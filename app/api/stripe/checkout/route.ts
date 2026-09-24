import { NextRequest } from "next/server";

import { DeliveryMode, ShippingCountry } from "../../../cart/pricing";
import { validatePacketaPoint } from "../../../lib/packeta";
import { getStripe } from "../../../lib/stripe";
import {
  encodeOrderSnapshot,
  OrderSnapshot,
} from "../../../lib/order-snapshot";
import {
  priceStripeOrder,
  StripeOrderItem,
} from "../../../lib/stripe-order";
import { Locale, translate } from "../../../i18n/translations";

type CheckoutRequest = {
  locale?: Locale;
  items: StripeOrderItem[];
  shippingCountry?: ShippingCountry;
  deliveryMode: DeliveryMode;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress?: string;
  easybox?: {
    id: number;
    name: string;
    address: string;
    city: string;
  };
  packetaPoint?: {
    id: string;
  };
};

const DELIVERY_MODES: DeliveryMode[] = ["easybox", "home", "pickup", "packeta"];

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CheckoutRequest;
    const deliveryMode = body.deliveryMode;
    const shippingCountry: ShippingCountry =
      body.shippingCountry === "hu" ? "hu" : "ro";
    const locale: Locale = body.locale === "ro" ? "ro" : "hu";

    if (!DELIVERY_MODES.includes(deliveryMode)) {
      return Response.json({ error: "Érvénytelen szállítási mód." }, { status: 400 });
    }
    if (
      (shippingCountry === "hu" && deliveryMode !== "packeta") ||
      (shippingCountry === "ro" && deliveryMode === "packeta")
    ) {
      return Response.json(
        { error: "A szállítási ország és mód nem egyezik." },
        { status: 400 },
      );
    }

    const name = cleanRequired(body.customer?.name, 120);
    const email = cleanRequired(body.customer?.email, 160);
    const phone = cleanRequired(body.customer?.phone, 50);
    const order = priceStripeOrder(body.items, deliveryMode, locale);
    const orderNumber = `ROKKA-${Date.now().toString().slice(-8)}`;

    const packetaPoint =
      deliveryMode === "packeta"
        ? await validatePacketaPoint(body.packetaPoint, locale)
        : null;
    const deliveryAddress =
      deliveryMode === "home"
        ? cleanRequired(body.shippingAddress, 300)
        : deliveryMode === "easybox"
          ? cleanRequired(
              `${body.easybox?.name ?? ""}, ${body.easybox?.address ?? ""}, ${body.easybox?.city ?? ""}`,
              300,
            )
          : deliveryMode === "packeta" && packetaPoint
            ? cleanRequired(
                `${packetaPoint.name}, ${packetaPoint.zip} ${packetaPoint.city}, ${packetaPoint.street}`,
                300,
              )
          : translate("Személyes átvétel a műhelyből", locale);

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? request.nextUrl.origin;
    const snapshot: OrderSnapshot = {
      version: 1,
      orderNumber,
      createdAt: new Date().toISOString(),
      locale,
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
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded_page",
      mode: "payment",
      locale,
      currency: "ron",
      customer_email: email,
      return_url: `${siteUrl}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
      line_items: [
        ...order.items.map((item) => ({
          quantity: item.quantity,
          price_data: {
            currency: "ron",
            unit_amount: item.unitPrice * 100,
            product_data: {
              name: item.name,
              description: item.description,
            },
          },
        })),
        ...(order.shippingFee > 0
          ? [
              {
                quantity: 1,
                price_data: {
                  currency: "ron",
                  unit_amount: order.shippingFee * 100,
                  product_data: { name: translate("Szállítás", locale) },
                },
              },
            ]
          : []),
      ],
      metadata: {
        order_number: orderNumber,
        customer_name: name,
        customer_phone: phone,
        delivery_mode: deliveryMode,
        shipping_country: shippingCountry.toUpperCase(),
        delivery_address: deliveryAddress,
        ...(packetaPoint
          ? { packeta_point_id: packetaPoint.id }
          : {}),
        ...encodeOrderSnapshot(snapshot),
      },
    });

    if (!session.client_secret) {
      throw new Error("A Stripe nem adott vissza kliensazonosítót.");
    }

    return Response.json({ clientSecret: session.client_secret });
  } catch (error) {
    console.error("Stripe Checkout session error", error);

    const configurationError =
      error instanceof Error &&
      (error.message.includes("STRIPE_SECRET_KEY") ||
        error.message.includes("PACKETA_API_KEY"));

    return Response.json(
      {
        error: configurationError
          ? error instanceof Error && error.message.includes("PACKETA_API_KEY")
            ? "A Packeta integráció még nincs beállítva."
            : "A Stripe tesztkulcs még nincs beállítva."
          : "A fizetés most nem indítható el. Ellenőrizd az adatokat, majd próbáld újra.",
      },
      { status: configurationError ? 503 : 400 },
    );
  }
}

function cleanRequired(value: unknown, maximumLength: number) {
  if (typeof value !== "string") throw new Error("Hiányzó adat.");

  const cleaned = value.trim().slice(0, maximumLength);
  if (!cleaned) throw new Error("Hiányzó adat.");

  return cleaned;
}
