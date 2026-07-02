"use client";

import { useState } from "react";
import { ArrowLeft, CheckCircle } from "lucide-react";

import ProductPreview from "../../components/ProductPreview";
import { Product, MaterialOption } from "../../data/products";
import CheckoutPopup from "./CheckoutPopup";

type Props = {
  product: Product;
  material: MaterialOption;
  colorValues: Record<string, string>;
  size: string;
  setSize: (value: string) => void;
  height: string;
  setHeight: (value: string) => void;
  bust: string;
  setBust: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
};

const SIZES = ["XS", "S", "M", "L", "XL"];

export default function SizeEditorView({
  product,
  material,
  colorValues,
  size,
  setSize,
  height,
  setHeight,
  bust,
  setBust,
  onBack,
  onNext,
}: Props) {
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const sizeReady = size !== "" && height.trim() !== "" && bust.trim() !== "";

  return (
    <section className="relative min-h-[calc(100vh-96px)] overflow-x-hidden bg-[#f4eee5] pb-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(255,255,255,0.95),rgba(244,238,229,0.65)_45%,rgba(226,199,166,0.26)_100%)]" />

      <div className="relative z-10 mx-auto max-w-[1580px] px-5 py-7 md:px-8">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 font-barlow text-sm font-semibold text-black/60 transition hover:text-black"
          >
            <ArrowLeft size={16} />
            Színek módosítása
          </button>
        </div>

        <div className="mb-8 grid items-center gap-7 lg:grid-cols-[0.12fr_1fr_0.42fr]">
          <div className="pointer-events-none hidden text-[128px] font-black leading-none text-transparent opacity-70 [-webkit-text-stroke:1px_rgba(185,150,110,0.18)] lg:block">
            04
          </div>

          <div>
            <h1 className="font-barlow-condensed text-[52px] font-bold uppercase leading-[0.85] tracking-[-0.045em] md:text-[68px]">
              Méretek
            </h1>

            <p className="font-caveat mt-2 text-[30px] font-semibold leading-none text-[#d99a4d] md:text-[38px]">
              Add meg a szükséges adatokat.
            </p>
          </div>

          <p className="max-w-sm border-l border-black/10 pl-8 font-barlow text-base leading-relaxed text-black/70">
            Válassz ruhaméretet, majd add meg a magasságot és a mellbőséget.
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

            <div className="relative h-[560px] overflow-hidden rounded-b-[30px] md:h-[680px] xl:h-[720px] 2xl:h-[760px]">
              <ProductPreview
                sampleImage={product.sampleImage}
                colorParts={product.colorParts}
                colorValues={colorValues}
              />
            </div>
          </div>

          <aside className="rounded-[30px] border border-black/10 bg-white/65 p-8 shadow-xl shadow-black/5">
            <p className="font-barlow text-xs font-black uppercase tracking-[0.25em] text-[#d99a4d]">
              Szükséges adatok
            </p>

            <h2 className="mt-3 font-barlow-condensed text-[44px] font-bold uppercase leading-none">
              Méret
            </h2>

            <div className="mt-8 space-y-8">
              <div>
                <label className="font-barlow text-sm font-black uppercase tracking-[0.18em]">
                  Ruhaméret
                </label>

                <div className="mt-4 grid grid-cols-5 gap-3">
                  {SIZES.map((item) => (
                    <button
                      key={item}
                      onClick={() => setSize(item)}
                      className={[
                        "h-14 rounded-full border font-barlow text-sm font-black transition",
                        size === item
                          ? "border-[#d99a4d] bg-[#d99a4d] text-white shadow-lg shadow-[#d99a4d]/25"
                          : "border-black/10 bg-white text-black hover:border-[#d99a4d]",
                      ].join(" ")}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-barlow text-sm font-black uppercase tracking-[0.18em]">
                  Magasság
                </label>

                <div className="mt-4 flex items-center rounded-2xl border border-black/10 bg-white px-5">
                  <input
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    type="number"
                    placeholder="pl. 170"
                    className="h-14 flex-1 bg-transparent font-barlow text-lg font-semibold outline-none"
                  />

                  <span className="font-barlow text-sm font-bold text-black/45">
                    cm
                  </span>
                </div>

                <p className="mt-3 font-barlow text-sm leading-relaxed text-black/55">
                  A magasságot centiméterben add meg.
                </p>
              </div>

              <div>
                <label className="font-barlow text-sm font-black uppercase tracking-[0.18em]">
                  Mellbőség
                </label>

                <div className="mt-4 flex items-center rounded-2xl border border-black/10 bg-white px-5">
                  <input
                    value={bust}
                    onChange={(e) => setBust(e.target.value)}
                    type="number"
                    placeholder="pl. 92"
                    className="h-14 flex-1 bg-transparent font-barlow text-lg font-semibold outline-none"
                  />

                  <span className="font-barlow text-sm font-bold text-black/45">
                    cm
                  </span>
                </div>

                <p className="mt-3 font-barlow text-sm leading-relaxed text-black/55">
                  A mellbőséget centiméterben add meg.
                </p>
              </div>

              <button
                disabled={!sizeReady}
                onClick={() => {
                  if (!sizeReady) return;
                  setCheckoutOpen(true);
                }}
                className={[
                  "mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-full px-6 font-barlow text-sm font-bold transition",
                  sizeReady
                    ? "bg-black text-white hover:bg-[#d99a4d]"
                    : "cursor-not-allowed bg-black/20 text-black/40",
                ].join(" ")}
              >
                <CheckCircle size={18} />
                Véglegesítés
              </button>
            </div>
          </aside>
        </div>
      </div>

      <CheckoutPopup
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onSubmit={onNext}
      />
    </section>
  );
}
