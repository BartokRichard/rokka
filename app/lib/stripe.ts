import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();

  if (!secretKey) {
    throw new Error("A STRIPE_SECRET_KEY nincs beállítva.");
  }

  stripeClient ??= new Stripe(secretKey, {
    appInfo: {
      name: "ROKKA",
      version: "1.0.0",
    },
  });

  return stripeClient;
}
