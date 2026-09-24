"use client";

import { ArrowLeft, ArrowRight, Check } from "lucide-react";

import { MaterialOption, Product, VariantOption } from "../../data/products";
import { useLanguage } from "../../i18n/LanguageProvider";

type Props = {
  product: Product;
  material: MaterialOption;
  options: VariantOption[];
  selectedVariant: string;
  setSelectedVariant: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
};

export default function VariantSelectorView({
  product,
  material,
  options,
  selectedVariant,
  setSelectedVariant,
  onBack,
  onNext,
}: Props) {
  const { t } = useLanguage();
  return (
    <section className="relative min-h-[calc(100vh-96px)] overflow-x-hidden bg-[#f4eee5] pb-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(255,255,255,0.95),rgba(244,238,229,0.65)_45%,rgba(226,199,166,0.26)_100%)]" />

      <div className="relative z-10 mx-auto max-w-[1380px] px-5 py-7 md:px-8">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 font-barlow text-sm font-semibold text-black/60 transition hover:text-black"
        >
          <ArrowLeft size={16} />
          {t("Anyag módosítása")}
        </button>

        <div className="mb-8 grid items-center gap-7 lg:grid-cols-[0.12fr_1fr_0.42fr]">
          <div className="pointer-events-none hidden text-[128px] font-black leading-none text-transparent opacity-70 [-webkit-text-stroke:1px_rgba(185,150,110,0.18)] lg:block">
            03
          </div>

          <div>
            <h1 className="font-barlow-condensed text-[52px] font-bold uppercase leading-[0.85] tracking-[-0.045em] md:text-[68px]">
              {t("Válassz típust")}
            </h1>

            <p className="font-caveat mt-2 text-[30px] font-semibold leading-none text-[#d99a4d] md:text-[38px]">
              {t("A neked megfelelő kialakítás.")}
            </p>
          </div>

          <p className="border-l border-black/10 pl-8 font-barlow text-base leading-relaxed text-black/70 max-md:border-l-0 max-md:pl-0">
            {product.name} · {t(material.name)}. {t("A végleges ár a választott típustól függ.")}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {options.map((option) => {
            const selected = selectedVariant === option.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setSelectedVariant(option.id)}
                className={[
                  "flex min-h-[280px] flex-col rounded-[30px] border bg-white/60 p-7 text-left shadow-xl shadow-black/5 transition-all",
                  selected
                    ? "border-[#d99a4d] ring-4 ring-[#d99a4d]/15"
                    : "border-black/10 hover:-translate-y-1 hover:border-[#d99a4d]/50",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-4">
                  <h2 className="font-barlow-condensed text-[36px] font-bold uppercase leading-none">
                    {t(option.name)}
                  </h2>

                  <span
                    className={[
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
                      selected
                        ? "bg-[#d99a4d] text-white"
                        : "bg-black/5 text-black/35",
                    ].join(" ")}
                  >
                    <Check size={19} strokeWidth={2.5} />
                  </span>
                </div>

                <p className="mt-6 font-barlow text-sm leading-relaxed text-black/60">
                  {t(option.description)}
                </p>

                <p className="mt-auto pt-8 font-barlow-condensed text-[32px] font-bold text-[#c77720]">
                  {option.price} {option.currency}
                </p>
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            disabled={!selectedVariant}
            onClick={() => {
              if (selectedVariant) onNext();
            }}
            className={[
              "flex h-14 items-center justify-center gap-2 rounded-full px-8 font-barlow text-sm font-bold transition",
              selectedVariant
                ? "bg-[#8f592d] text-white hover:bg-[#d99a4d]"
                : "cursor-not-allowed bg-black/20 text-black/40",
            ].join(" ")}
          >
            {t("Színek kiválasztása")}
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
