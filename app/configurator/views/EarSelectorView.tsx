"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

import PriceBadge from "../../components/PriceBadge";
import {
  EarOption,
  MaterialOption,
  Product,
} from "../../data/products";
import { useLanguage } from "../../i18n/LanguageProvider";

type Props = {
  product: Product;
  material: MaterialOption;
  options: EarOption[];
  selectedEar: string;
  setSelectedEar: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
};

export default function EarSelectorView({
  product,
  material,
  options,
  selectedEar,
  setSelectedEar,
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
              {t("Válassz fület")}
            </h1>

            <p className="font-caveat mt-2 text-[30px] font-semibold leading-none text-[#d99a4d] md:text-[38px]">
              {t("Nyuszi vagy medve?")}
            </p>
          </div>

          <div className="border-l border-black/10 pl-8 max-md:border-l-0 max-md:pl-0">
            <p className="font-barlow text-base leading-relaxed text-black/70">
              {t("Válaszd ki, milyen fülekkel készüljön a Yuppi.")}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-black/5 px-3 py-1 font-barlow text-sm font-bold text-black/60">
                {t(material.name)}
              </span>
              <PriceBadge product={product} material={material} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:gap-7">
          {options.map((option) => {
            const selected = selectedEar === option.id;

            return (
              <button
                key={option.id}
                onClick={() => setSelectedEar(option.id)}
                className={[
                  "group overflow-hidden rounded-[30px] border bg-white/55 text-left shadow-xl shadow-black/5 transition-all duration-300",
                  selected
                    ? "border-[#d99a4d] ring-4 ring-[#d99a4d]/15"
                    : "border-black/10 hover:-translate-y-1 hover:border-[#d99a4d]/50",
                ].join(" ")}
              >
                <div className="relative h-[230px] overflow-hidden bg-[#efe7da] sm:h-[320px] md:h-[420px]">
                  <Image
                    src={option.image}
                    alt={option.name}
                    fill
                    sizes="50vw"
                    className="object-contain p-3 transition duration-500 group-hover:scale-[1.02] sm:p-6 md:p-8"
                  />
                </div>

                <div className="flex min-h-[132px] flex-col items-start justify-between gap-3 border-t border-black/5 p-3 sm:min-h-[148px] sm:p-5 md:min-h-0 md:flex-row md:items-center md:gap-5 md:p-6">
                  <div className="min-w-0">
                    <h2 className="font-barlow-condensed text-[25px] font-bold uppercase leading-none sm:text-[30px] md:text-[36px]">
                      {t(option.name)}
                    </h2>
                    <p className="mt-2 font-barlow text-xs leading-snug text-black/55 sm:text-sm">
                      {t(option.description)}
                    </p>
                  </div>

                  <span
                    className={[
                      "flex h-9 w-9 shrink-0 items-center justify-center self-end rounded-full transition sm:h-11 sm:w-11 md:h-12 md:w-12 md:self-auto",
                      selected
                        ? "bg-[#d99a4d] text-white"
                        : "bg-black/5 text-black/35",
                    ].join(" ")}
                  >
                    <Check size={20} strokeWidth={2.5} />
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            disabled={!selectedEar}
            onClick={() => {
              if (selectedEar) onNext();
            }}
            className={[
              "flex h-14 items-center justify-center gap-2 rounded-full px-8 font-barlow text-sm font-bold transition",
              selectedEar
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
