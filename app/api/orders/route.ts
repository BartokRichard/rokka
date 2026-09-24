import { NextRequest } from "next/server";

import { DeliveryMode, ShippingCountry } from "../../cart/pricing";
import { Locale, translate } from "../../i18n/translations";
import { saveOrderToAirtable } from "../../lib/airtable";
import { OrderSnapshot } from "../../lib/order-snapshot";
import { validatePacketaPoint } from "../../lib/packeta";
import { priceStripeOrder, StripeOrderItem } from "../../lib/stripe-order";

type OrderRequest = {
  locale?: Locale;
  items: StripeOrderItem[];
  shippingCountry?: ShippingCountry;
  deliveryMode: DeliveryMode;
  paymentMethod?: "transfer" | "cash";
  customer: { name: string; email: string; phone: string };
  shippingAddress?: string;
  easybox?: { id: number; name: string; address: string; city: string };
  packetaPoint?: { id: string };
};

const DELIVERY_MODES: DeliveryMode[] = ["easybox", "home", "courier", "pickup", "packeta"];

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as OrderRequest;
    const deliveryMode = body.deliveryMode;
    const shippingCountry: ShippingCountry = body.shippingCountry === "hu" ? "hu" : "ro";
    const locale: Locale = body.locale === "ro" ? "ro" : "hu";
    const paymentMethod = body.paymentMethod;

    if (paymentMethod !== "transfer" && paymentMethod !== "cash") {
      return Response.json({ error: "Válassz fizetési módot." }, { status: 400 });
    }
    if (paymentMethod === "cash" && deliveryMode !== "pickup") {
      return Response.json({ error: "Készpénzes fizetés csak személyes átvételnél választható." }, { status: 400 });
    }

    if (!DELIVERY_MODES.includes(deliveryMode)) {
      return Response.json({ error: "Érvénytelen szállítási mód." }, { status: 400 });
    }
    if ((shippingCountry === "hu" && deliveryMode !== "packeta") ||
        (shippingCountry === "ro" && deliveryMode === "packeta")) {
      return Response.json({ error: "A szállítási ország és mód nem egyezik." }, { status: 400 });
    }

    const name = cleanRequired(body.customer?.name, 120);
    const email = cleanRequired(body.customer?.email, 160);
    const phone = cleanRequired(body.customer?.phone, 50);
    const order = priceStripeOrder(body.items, deliveryMode, locale);
    const orderNumber = `ROKKA-${Date.now().toString().slice(-8)}`;
    const packetaPoint = deliveryMode === "packeta"
      ? await validatePacketaPoint(body.packetaPoint, locale)
      : null;
    const deliveryAddress = deliveryMode === "home" || deliveryMode === "courier"
      ? cleanRequired(body.shippingAddress, 300)
      : deliveryMode === "easybox"
        ? cleanRequired(`${body.easybox?.name ?? ""}, ${body.easybox?.address ?? ""}, ${body.easybox?.city ?? ""}`, 300)
        : deliveryMode === "packeta" && packetaPoint
          ? cleanRequired(`${packetaPoint.name}, ${packetaPoint.zip} ${packetaPoint.city}, ${packetaPoint.street}`, 300)
          : translate("Személyes átvétel a műhelyből", locale);

    const snapshot: OrderSnapshot = {
      version: 1,
      orderNumber,
      createdAt: new Date().toISOString(),
      locale,
      paymentMethod,
      customer: { name, email, phone },
      delivery: {
        mode: deliveryMode,
        country: shippingCountry,
        address: deliveryAddress,
        ...(packetaPoint ? { packetaPointId: packetaPoint.id } : {}),
      },
      items: order.items,
      subtotal: order.subtotal,
      shippingFee: order.shippingFee,
      total: order.total,
      currency: "RON",
    };

    await saveOrderToAirtable(snapshot, { paid: false });
    return Response.json({
      orderNumber,
      itemCount: body.items.reduce((count, item) => count + Number(item.quantity || 0), 0),
      totalPrice: order.total,
    });
  } catch (error) {
    console.error("Order submission error", error);
    return Response.json({
      error: error instanceof Error ? error.message : "A rendelés mentése sikertelen.",
    }, { status: 400 });
  }
}

function cleanRequired(value: unknown, maximumLength: number) {
  if (typeof value !== "string") throw new Error("Hiányzó adat.");
  const cleaned = value.trim().slice(0, maximumLength);
  if (!cleaned) throw new Error("Hiányzó adat.");
  return cleaned;
}
