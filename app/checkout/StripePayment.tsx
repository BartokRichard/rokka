"use client";

import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useLanguage } from "../i18n/LanguageProvider";

const publishableKey =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim() ?? "";
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

export default function StripePayment({
  clientSecret,
  onBack,
}: {
  clientSecret: string;
  onBack: () => void;
}) {
  const { t } = useLanguage();
  return (
    <main className="min-h-screen bg-[#f4eee5] px-4 py-8 text-[#20221f] md:px-8">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={onBack}
          className="mb-5 inline-flex items-center gap-2 font-barlow text-sm font-bold text-black/55 transition hover:text-black"
        >
          <ArrowLeft size={17} /> {t("Vissza a rendeléshez")}
        </button>

        <div className="overflow-hidden rounded-[30px] border border-black/10 bg-white shadow-2xl shadow-black/8">
          <div className="flex items-center justify-between gap-5 border-b border-black/10 px-6 py-5 md:px-8">
            <div>
              <p className="font-barlow text-[10px] font-black uppercase tracking-[0.22em] text-[#c77720]">
                {t("Biztonságos fizetés")}
              </p>
              <h1 className="mt-1 font-barlow-condensed text-3xl font-bold uppercase">
                {t("Online fizetés")}
              </h1>
            </div>
            <ShieldCheck className="shrink-0 text-[#23855a]" size={28} />
          </div>

          <div className="min-h-[520px] p-3 md:p-6">
            {stripePromise ? (
              <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={{ clientSecret }}
              >
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            ) : (
              <div className="flex min-h-[420px] items-center justify-center rounded-2xl bg-red-50 px-6 text-center font-barlow text-sm font-semibold text-red-700">
                {t("A Stripe nyilvános tesztkulcs még nincs beállítva.")}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
