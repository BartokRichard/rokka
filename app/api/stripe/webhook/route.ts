import Stripe from "stripe";

import { savePaidOrderToAirtable } from "../../../lib/airtable";
import { decodeOrderSnapshot } from "../../../lib/order-snapshot";
import { getStripe } from "../../../lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();

  if (!signature || !webhookSecret) {
    return new Response("A webhook nincs beállítva.", { status: 400 });
  }

  const payload = await request.text();
  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      payload,
      signature,
      webhookSecret,
    );
  } catch (error) {
    console.error("Stripe webhook verification failed", error);
    return new Response("Érvénytelen webhook-aláírás.", { status: 400 });
  }

  try {
    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.payment_status !== "paid") {
        return Response.json({ received: true, paid: false });
      }

      const order = decodeOrderSnapshot(session.metadata);
      if (!order) {
        console.warn("Stripe payment has no order snapshot", {
          sessionId: session.id,
          orderNumber: session.metadata?.order_number,
        });
        return Response.json({ received: true, snapshot: false });
      }

      const airtableRecordId = await savePaidOrderToAirtable(session, order);
      console.info("Stripe payment completed", {
        sessionId: session.id,
        orderNumber: order.orderNumber,
        paymentStatus: session.payment_status,
        airtableRecordId,
      });
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("Stripe paid order persistence failed", error);
    return new Response("A rendelés mentése átmenetileg sikertelen.", {
      status: 500,
    });
  }
}
