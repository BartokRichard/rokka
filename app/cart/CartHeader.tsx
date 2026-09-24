import Image from "next/image";
import Link from "next/link";
import {
  Palette,
  Ruler,
  Shirt,
  ShoppingCart,
} from "lucide-react";

import CartButton from "../components/CartButton";
import { useLanguage } from "../i18n/LanguageProvider";

const STEPS = [
  { number: "01", label: "Modell", icon: Shirt },
  { number: "02", label: "Anyag", icon: Shirt },
  { number: "03", label: "Szín", icon: Palette },
  { number: "04", label: "Méret", icon: Ruler },
  { number: "05", label: "Kosár", icon: ShoppingCart },
];

export default function CartHeader() {
  const { t } = useLanguage();
  return (
    <header className="border-b border-black/10 bg-[#f8f3eb]/95 px-5 backdrop-blur md:px-10 lg:px-16">
      <div className="mx-auto flex h-24 max-w-[1500px] items-center justify-between gap-6">
        <Link href="/" className="shrink-0">
          <Image
            src="/images/logo_trans.png"
            alt="ROKKA logo"
            width={145}
            height={80}
            priority
            className="h-auto w-[105px] object-contain mix-blend-multiply md:w-[125px]"
          />
        </Link>

        <nav
          aria-label={t("Konfigurátor lépései")}
          className="hidden flex-1 items-center justify-center lg:flex"
        >
          {STEPS.map(({ number, label, icon: Icon }, index) => {
            const active = number === "05";

            return (
              <div key={number} className="flex items-center">
                <div className="flex w-[76px] flex-col items-center text-center">
                  <span
                    className={[
                      "flex h-10 w-10 items-center justify-center rounded-full border",
                      active
                        ? "border-[#e39b3e] bg-[#e39b3e] text-white shadow-md shadow-[#e39b3e]/25"
                        : "border-black/15 bg-white/70 text-black/75",
                    ].join(" ")}
                  >
                    <Icon size={18} strokeWidth={1.8} />
                  </span>
                  <span
                    className={[
                      "mt-1 font-barlow text-[9px] font-black uppercase leading-tight tracking-[0.08em]",
                      active ? "text-[#d9821e]" : "text-black/75",
                    ].join(" ")}
                  >
                    {number}
                    <br />
                    {t(label)}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <span className="mx-2 mb-7 h-px w-10 bg-black/15 xl:w-16" />
                )}
              </div>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <CartButton />
        </div>
      </div>
    </header>
  );
}
