import { getStripe } from "../../lib/stripe";
import ReturnContent from "./ReturnContent";

export const dynamic = "force-dynamic";

export default async function StripeReturnPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  let paid = false;
  let orderNumber = "";
  let amount = 0;

  if (sessionId?.startsWith("cs_")) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(sessionId);
      paid = session.payment_status === "paid";
      orderNumber = session.metadata?.order_number ?? "";
      amount = (session.amount_total ?? 0) / 100;
    } catch {
      paid = false;
    }
  }

  return <ReturnContent paid={paid} orderNumber={orderNumber} amount={amount} />;
}
