"use client";

import { CheckCircle, CircleX } from "lucide-react";
import Link from "next/link";
import StoreHeader from "../../components/StoreHeader";
import { useLanguage } from "../../i18n/LanguageProvider";
import ClearPaidCart from "./ClearPaidCart";

export default function ReturnContent({ paid, orderNumber, amount }: { paid: boolean; orderNumber: string; amount: number }) {
  const { locale, t } = useLanguage();

  return (
    <main className="min-h-screen bg-[#f4eee5] text-[#20221f]">
      <StoreHeader />
      {paid && <ClearPaidCart />}
      <section className="flex min-h-[calc(100vh-96px)] items-center justify-center px-5 py-12">
        <div className="w-full max-w-2xl rounded-[34px] border border-black/10 bg-white/70 p-8 text-center shadow-2xl shadow-black/5 md:p-12">
          <span className={["mx-auto flex h-20 w-20 items-center justify-center rounded-full", paid ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"].join(" ")}>
            {paid ? <CheckCircle size={38} strokeWidth={1.8} /> : <CircleX size={38} strokeWidth={1.8} />}
          </span>
          {orderNumber && <p className="mt-7 font-barlow text-xs font-black uppercase tracking-[0.25em] text-[#d99a4d]">{orderNumber}</p>}
          <h1 className="mt-3 font-barlow-condensed text-[48px] font-bold uppercase leading-none md:text-[62px]">
            {t(paid ? "Sikeres fizetés" : "A fizetés nem fejeződött be")}
          </h1>
          <p className="mx-auto mt-5 max-w-lg font-barlow leading-relaxed text-black/55">
            {paid ? (locale === "hu" ? `${amount} RON sikeresen kifizetve. ${t("A rendelésedet rögzítettük.")}` : `${amount} RON plătiți cu succes. ${t("A rendelésedet rögzítettük.")}`) : t("Nem történt sikeres terhelés. Visszatérhetsz a pénztárhoz, és újra megpróbálhatod.")}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href={paid ? "/" : "/checkout"} className="inline-flex h-13 items-center justify-center rounded-full bg-[#8f592d] px-8 font-barlow text-sm font-bold text-white transition hover:bg-[#d99a4d]">
              {t(paid ? "Vissza a főoldalra" : "Vissza a pénztárhoz")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
