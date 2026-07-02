"use client";

import { ArrowLeft, Rotate3D, Ruler } from "lucide-react";

import ProductPreview from "../../components/ProductPreview";
import ColorPanel from "../../components/ColorPanel";
import HoodieViewer from "../../components/HoodieViewer";
import { Product, MaterialOption } from "../../data/products";

type Props = {
  product: Product;
  material: MaterialOption;
  colorValues: Record<string, string>;
  setColorValues: (values: Record<string, string>) => void;
  fullView: boolean;
  setFullView: (value: boolean) => void;
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
  onBack,
  onNext,
}: Props) {
  return (
    <section className="relative min-h-[calc(100vh-96px)] overflow-hidden bg-[#f4eee5]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(255,255,255,0.95),rgba(244,238,229,0.65)_45%,rgba(226,199,166,0.26)_100%)]" />

      <div className="relative z-10 mx-auto max-w-[1580px] px-8 py-7">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 font-barlow text-sm font-semibold text-black/60 transition hover:text-black"
          >
            <ArrowLeft size={16} />
            Anyag módosítása
          </button>

          <div className="flex items-center gap-4 font-barlow text-sm font-semibold">
            <button
              onClick={() => setFullView(!fullView)}
              className={[
                "flex items-center gap-2 rounded-full px-5 py-2 transition",
                fullView
                  ? "bg-[#d99a4d] text-white shadow-lg shadow-[#d99a4d]/25"
                  : "bg-white/70 text-black/60 hover:bg-white hover:text-black",
              ].join(" ")}
            >
              <Rotate3D size={17} />
              {fullView ? "2D nézet" : "3D modell"}
            </button>

            <button
              onClick={onNext}
              className="flex items-center gap-2 rounded-full bg-black px-6 py-2 text-white transition hover:bg-[#d99a4d]"
            >
              <Ruler size={17} />
              Méretek beállítása
            </button>
          </div>
        </div>

        <div className="mb-8 grid items-center gap-7 lg:grid-cols-[0.12fr_1fr_0.42fr]">
          <div className="pointer-events-none hidden text-[128px] font-black leading-none text-transparent opacity-70 [-webkit-text-stroke:1px_rgba(185,150,110,0.18)] lg:block">
            03
          </div>

          <div>
            <h1 className="font-barlow-condensed text-[52px] font-bold uppercase leading-[0.85] tracking-[-0.045em] md:text-[68px]">
              Válassz színt
            </h1>

            <p className="font-caveat mt-2 text-[30px] font-semibold leading-none text-[#d99a4d] md:text-[38px]">
              Tedd igazán egyedivé.
            </p>
          </div>

          <p className="max-w-sm border-l border-black/10 pl-8 font-barlow text-base leading-relaxed text-black/70">
            Válaszd ki a variálható részek színét. Anyag:
            <span className="font-bold text-[#d99a4d]"> {material.name}</span>.
          </p>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_410px]">
          <div className="overflow-hidden rounded-[30px] border border-black/10 bg-white/45 shadow-xl shadow-black/5">
            <div className="border-b border-black/5 px-8 py-5">
              <p className="font-barlow text-xs font-black uppercase tracking-[0.25em] text-[#d99a4d]">
                Kiválasztott modell
              </p>

              <div className="mt-1 flex flex-wrap items-center gap-3">
                <h2 className="font-barlow-condensed text-[32px] font-bold uppercase leading-none">
                  {product.name}
                </h2>

                <span className="font-barlow text-sm text-black/55">
                  {product.subtitle}
                </span>

                <span className="rounded-full bg-[#e1a35c]/15 px-3 py-1 font-barlow text-sm font-bold text-[#d99a4d]">
                  {material.name}
                  {material.price
                    ? ` · ${material.price} ${material.currency}`
                    : ""}
                </span>
              </div>
            </div>

            <div className="relative h-[680px] overflow-hidden rounded-b-[30px] xl:h-[720px] 2xl:h-[760px]">
              {fullView ? (
                <HoodieViewer sleeveColor={colorValues.sleeve ?? "#ff6b00"} />
              ) : (
                <ProductPreview
                  sampleImage={product.sampleImage}
                  colorParts={product.colorParts}
                  colorValues={colorValues}
                />
              )}
            </div>
          </div>

          <ColorPanel
            colorParts={product.colorParts}
            colorValues={colorValues}
            setColorValues={setColorValues}
          />
        </div>
      </div>
    </section>
  );
}
