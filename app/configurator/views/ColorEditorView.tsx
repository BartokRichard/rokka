"use client";

import dynamic from "next/dynamic";
import { ArrowLeft, Rotate3D, Ruler } from "lucide-react";

import ProductPreview from "../../components/ProductPreview";
import ColorPanel from "../../components/ColorPanel";
import PriceBadge from "../../components/PriceBadge";
import {
  getColorOptionsForPart,
  Product,
  MaterialOption,
} from "../../data/products";
import { useLanguage } from "../../i18n/LanguageProvider";

const HoodieViewer = dynamic(() => import("../../components/HoodieViewer"), {
  ssr: false,
  loading: () => <HoodieViewerLoading />,
});

function HoodieViewerLoading() {
  const { t } = useLanguage();
  return <div className="flex h-full items-center justify-center bg-[#d7c2a5] font-barlow text-sm text-[#252820]/60">{t("3D nézet betöltése…")}</div>;
}

type Props = {
  product: Product;
  material: MaterialOption;
  colorValues: Record<string, string>;
  setColorValues: (values: Record<string, string>) => void;
  fullView: boolean;
  setFullView: (value: boolean) => void;
  stepNumber?: string;
  backLabel?: string;
  onBack: () => void;
  onNext: () => void;
};

export default function ColorEditorView({
  product,
  material,
  colorValues,
  setColorValues,
  fullView,
  setFullView,
  stepNumber = "03",
  backLabel = "Anyag módosítása",
  onBack,
  onNext,
}: Props) {
  const { t } = useLanguage();
  const colorsByPart = Object.fromEntries(
    product.colorParts.map((part) => [
      part.id,
      getColorOptionsForPart(product, material, part),
    ]),
  );
  const colorOptions = Array.from(
    new Map(
      Object.values(colorsByPart)
        .flat()
        .map((option) => [option.id, option]),
    ).values(),
  );

  return (
    <section className="relative min-h-[calc(100vh-96px)] overflow-hidden bg-[#f4eee5]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(255,255,255,0.95),rgba(244,238,229,0.65)_45%,rgba(226,199,166,0.26)_100%)]" />

      <div className="relative z-10 mx-auto w-full max-w-[1580px] px-5 py-6 sm:px-8 sm:py-7">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex w-fit items-center gap-2 font-barlow text-sm font-semibold text-black/60 transition hover:text-black"
          >
            <ArrowLeft size={16} />
            {t(backLabel)}
          </button>

        </div>

        <div className="mb-8 grid min-w-0 items-center gap-7 lg:grid-cols-[0.12fr_1fr_0.42fr]">
          <div className="pointer-events-none hidden text-[128px] font-black leading-none text-transparent opacity-70 [-webkit-text-stroke:1px_rgba(185,150,110,0.18)] lg:block">
            {stepNumber}
          </div>

          <div>
            <h1 className="font-barlow-condensed text-[clamp(2.7rem,12vw,4.25rem)] font-bold uppercase leading-[0.85] tracking-[-0.045em]">
              {t("Válassz színt")}
            </h1>

            <p className="font-caveat mt-2 text-[30px] font-semibold leading-none text-[#d99a4d] md:text-[38px]">
              {t("Tedd igazán egyedivé.")}
            </p>
          </div>

          <p className="max-w-sm border-l border-black/10 pl-8 font-barlow text-base leading-relaxed text-black/70">
            {t("Válaszd ki a variálható részek színét. Anyag:")}
            <span className="font-bold text-[#d99a4d]"> {t(material.name)}</span>.
          </p>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_410px]">
          <div className="overflow-hidden rounded-[30px] border border-black/10 bg-white/45 shadow-xl shadow-black/5">
            <div className="border-b border-black/5 px-8 py-5">
              <p className="font-barlow text-xs font-black uppercase tracking-[0.25em] text-[#d99a4d]">
                {t("Kiválasztott modell")}
              </p>

              <div className="mt-1 flex flex-wrap items-center gap-3">
                <h2 className="font-barlow-condensed text-[32px] font-bold uppercase leading-none">
                  {product.name}
                </h2>

                <span className="font-barlow text-sm text-black/55">
                  {t(product.subtitle)}
                </span>

                <span className="rounded-full bg-black/5 px-3 py-1 font-barlow text-sm font-bold text-black/60">
                  {t(material.name)}
                </span>

                <PriceBadge product={product} material={material} />
              </div>
            </div>

            <div className="relative h-[680px] overflow-hidden rounded-b-[30px] xl:h-[720px] 2xl:h-[760px]">
              {fullView ? (
                <HoodieViewer
                  model={product.model}
                  colorValues={Object.fromEntries(
                    product.colorParts.map((part) => [
                      part.id,
                      colorValues[part.id] ?? part.defaultColor,
                    ]),
                  )}
                />
              ) : (
                <ProductPreview
                  sampleImage={product.sampleImage}
                  colorParts={product.colorParts}
                  colorOptions={colorOptions}
                  colorValues={colorValues}
                />
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid w-full grid-cols-2 gap-2 font-barlow text-sm font-semibold sm:gap-3">
              <button
                onClick={() => setFullView(!fullView)}
                className={[
                  "flex min-w-0 items-center justify-center gap-2 rounded-full px-3 py-3 text-center transition sm:px-5",
                  fullView
                    ? "bg-[#d99a4d] text-white shadow-lg shadow-[#d99a4d]/25"
                    : "bg-white/70 text-black/60 shadow-sm hover:bg-white hover:text-black",
                ].join(" ")}
              >
                <Rotate3D size={17} />
                {t(fullView ? "2D nézet" : "3D modell")}
              </button>

              <button
                onClick={onNext}
                className="flex min-w-0 items-center justify-center gap-2 rounded-full bg-[#8f592d] px-3 py-3 text-center text-white transition hover:bg-[#d99a4d] sm:px-5"
              >
                <Ruler size={17} />
                {t("Méretek beállítása")}
              </button>
            </div>

            <ColorPanel
              colorParts={product.colorParts}
              colorsByPart={colorsByPart}
              colorValues={colorValues}
              setColorValues={setColorValues}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
