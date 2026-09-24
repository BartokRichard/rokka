import type Stripe from "stripe";

import type { DeliveryMode } from "../cart/pricing";
import type { OrderSnapshot } from "./order-snapshot";

const DEFAULT_BASE_ID = "app7vwKI5cZe3viAt";
const DEFAULT_TABLE_ID = "tbla8knQ3XTvedJKp";

type AirtableListResponse = {
  records?: Array<{ id: string }>;
  error?: { type?: string; message?: string };
};

export async function savePaidOrderToAirtable(
  session: Stripe.Checkout.Session,
  order: OrderSnapshot,
) {
  return saveOrderToAirtable(order, {
    paid: true,
    paymentReference: `Stripe session: ${session.id}`,
  });
}

export async function saveOrderToAirtable(
  order: OrderSnapshot,
  options: { paid: boolean; paymentReference?: string },
) {
  const token = requiredEnvironmentValue("AIRTABLE_ACCESS_TOKEN");
  const baseId = process.env.AIRTABLE_BASE_ID?.trim() || DEFAULT_BASE_ID;
  const tableId = process.env.AIRTABLE_TABLE_ID?.trim() || DEFAULT_TABLE_ID;
  const endpoint = `https://api.airtable.com/v0/${encodeURIComponent(baseId)}/${encodeURIComponent(tableId)}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const query = new URLSearchParams({
    maxRecords: "1",
    filterByFormula: `FIND("${escapeFormulaString(order.orderNumber)}", {Termék leirás})`,
  });
  const existingResponse = await fetch(`${endpoint}?${query}`, {
    headers,
    cache: "no-store",
  });
  const existing = (await existingResponse.json()) as AirtableListResponse;

  if (!existingResponse.ok) {
    throw airtableError("A rendelés ellenőrzése sikertelen", existing);
  }
  if (existing.records?.length) return existing.records[0].id;

  const createResponse = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({
      typecast: true,
      records: [
        {
          fields: {
            Név: order.customer.name,
            ...(options.paid ? { Fizetve: new Date().toISOString() } : {}),
            Státusz: options.paid ? "Véglegesítve" : "Új rendelés",
            Típus: "Eladás",
            Termék: order.items.map((item) => item.name).join("; "),
            "Termék leirás": formatOrderDetails(order, options.paymentReference),
            "Személyes adatok": formatCustomerDetails(order),
            Átvétel: deliveryLabel(order.delivery.mode, order.shippingFee),
            Ár: order.total,
          },
        },
      ],
    }),
    cache: "no-store",
  });
  const created = (await createResponse.json()) as AirtableListResponse;

  if (!createResponse.ok || !created.records?.[0]?.id) {
    throw airtableError("A rendelés mentése sikertelen", created);
  }

  return created.records[0].id;
}

function formatOrderDetails(order: OrderSnapshot, paymentReference?: string) {
  const itemDetails = order.items.map((item, index) => {
    const details = [
      `${index + 1}. ${item.name}`,
      `Anyag: ${item.material}`,
      `Méret: ${item.size}`,
      item.variant ? `Változat: ${item.variant}` : "",
      item.ear ? `Fül: ${item.ear}` : "",
      item.height ? `Magasság: ${item.height}` : "",
      item.bust ? `Mellbőség: ${item.bust}` : "",
      ...item.colors.map(
        (color) =>
          `${color.part}: ${color.selection}`,
      ),
      `Mennyiség: ${item.quantity} db`,
      `Egységár: ${item.unitPrice} RON`,
      `Tétel összesen: ${item.unitPrice * item.quantity} RON`,
    ].filter(Boolean);

    return details.join("\n");
  });

  return [
    `Rendelésszám: ${order.orderNumber}`,
    `Fizetési mód: ${order.paymentMethod === "cash" ? "Készpénz személyes átvételkor" : order.paymentMethod === "transfer" ? "Banki átutalás egyeztetés után" : "Online kártyás fizetés"}`,
    paymentReference ?? "",
    "",
    ...itemDetails.flatMap((details, index) =>
      index === itemDetails.length - 1 ? [details] : [details, ""],
    ),
    "",
    `Részösszeg: ${order.subtotal} RON`,
    `Szállítás: ${order.shippingFee} RON`,
    `Rendelés összesen: ${order.total} RON`,
  ]
    .filter((line, index, lines) => line !== "" || lines[index - 1] !== "")
    .join("\n");
}

function formatCustomerDetails(order: OrderSnapshot) {
  return [
    `E-mail: ${order.customer.email}`,
    `Telefonszám: ${order.customer.phone}`,
  ]
    .filter(Boolean)
    .join("\n");
}

function deliveryLabel(mode: DeliveryMode, fee: number) {
  if (mode === "easybox") return `Easybox (${fee} ron)`;
  if (mode === "home") return `Házhozszállítás (${fee} ron)`;
  if (mode === "courier") return `Curier (${fee} ron)`;
  if (mode === "packeta") return "Külföldi rendelés – 7–10 EUR között, csomagtól függően";
  return "Személyes átvétel a műhelyből – ingyenes";
}

function escapeFormulaString(value: string) {
  return value.replaceAll("\\", "\\\\").replaceAll('"', '\\"');
}

function requiredEnvironmentValue(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} nincs beállítva.`);
  return value;
}

function airtableError(prefix: string, response: AirtableListResponse) {
  const detail = response.error?.message ?? response.error?.type ?? "ismeretlen Airtable hiba";
  return new Error(`${prefix}: ${detail}`);
}
