"use client";

import { ArrowLeft, ShoppingBag } from "lucide-react";

import PriceBadge from "../../components/PriceBadge";
import ProductPreview from "../../components/ProductPreview";
import {
  getColorOptionsForPart,
  Product,
  MaterialOption,
} from "../../data/products";
import { useLanguage } from "../../i18n/LanguageProvider";

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
  stepNumber?: string;
  isAddingToCart?: boolean;
  submitLabel?: string;
  busyLabel?: string;
  onBack: () => void;
  onAddToCart: () => void;
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
  stepNumber = "04",
  isAddingToCart = false,
  submitLabel = "Kosárba teszem",
  busyLabel = "Kosárba helyezés…",
  onBack,
  onAddToCart,
}: Props) {
  const { t } = useLanguage();
  const sizeOptions = product.sizeOptions ?? SIZES;
  const colorOptions = Array.from(
    new Map(
      product.colorParts
        .flatMap((part) => getColorOptionsForPart(product, material, part))
        .map((option) => [option.id, option]),
    ).values(),
  );
  const heightConfig = product.measurements?.height;
  const bustConfig = product.measurements?.bust;
  const usesCentimeterSizes = sizeOptions.some((item) => /\d/.test(item));
  const sizeReady =
    size !== "" &&
    (!heightConfig?.required || height.trim() !== "") &&
    (!bustConfig?.required || bust.trim() !== "");
  const measurementPrompt =
    heightConfig || bustConfig
      ? "Válassz ruhaméretet, majd add meg a termékhez szükséges további adatokat."
      : "Válaszd ki a megfelelő ruhaméretet. Ehhez a modellhez más méretadat nem szükséges.";

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
            {t("Színek módosítása")}
          </button>
        </div>

        <div className="mb-8 grid items-center gap-7 lg:grid-cols-[0.12fr_1fr_0.42fr]">
          <div className="pointer-events-none hidden text-[128px] font-black leading-none text-transparent opacity-70 [-webkit-text-stroke:1px_rgba(185,150,110,0.18)] lg:block">
            {stepNumber}
          </div>

          <div>
            <h1 className="font-barlow-condensed text-[52px] font-bold uppercase leading-[0.85] tracking-[-0.045em] md:text-[68px]">
              {t("Méretek")}
            </h1>

            <p className="font-caveat mt-2 text-[30px] font-semibold leading-none text-[#d99a4d] md:text-[38px]">
              {t("Add meg a szükséges adatokat.")}
            </p>
          </div>

          <p className="max-w-sm border-l border-black/10 pl-8 font-barlow text-base leading-relaxed text-black/70">
            {t(measurementPrompt)}
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

                <PriceBadge
                  product={product}
                  material={material}
                  size={size}
                />
              </div>
            </div>

            <div className="relative h-[560px] overflow-hidden rounded-b-[30px] md:h-[680px] xl:h-[720px] 2xl:h-[760px]">
              <ProductPreview
                sampleImage={product.sampleImage}
                colorParts={product.colorParts}
                colorOptions={colorOptions}
                colorValues={colorValues}
              />
            </div>
          </div>

          <aside className="rounded-[30px] border border-black/10 bg-white/65 p-8 shadow-xl shadow-black/5">
            <p className="font-barlow text-xs font-black uppercase tracking-[0.25em] text-[#d99a4d]">
              {t("Szükséges adatok")}
            </p>

            <h2 className="mt-3 font-barlow-condensed text-[44px] font-bold uppercase leading-none">
              {t("Méret")}
            </h2>

            <div className="mt-8 space-y-8">
              <div>
                <label className="font-barlow text-sm font-black uppercase tracking-[0.18em]">
                  {t("Ruhaméret")}
                </label>

                <div
                  className={[
                    "mt-4 grid gap-3",
                    product.sizeOptions ? "grid-cols-3" : "grid-cols-5",
                  ].join(" ")}
                >
                  {sizeOptions.map((item) => (
                    <button
                      key={item}
                      onClick={() => setSize(item)}
                      className={[
                        "min-h-14 rounded-2xl border px-2 py-2 font-barlow text-sm font-black transition",
                        size === item
                          ? "border-[#d99a4d] bg-[#d99a4d] text-white shadow-lg shadow-[#d99a4d]/25"
                          : "border-black/10 bg-white text-black hover:border-[#d99a4d]",
                      ].join(" ")}
                    >
                      <span className="block">
                        {item}
                        {usesCentimeterSizes ? " cm" : ""}
                      </span>

                      {product.sizePrices?.[material.name]?.[item] && (
                        <span
                          className={[
                            "mt-0.5 block text-[11px]",
                            size === item ? "text-white/80" : "text-black/45",
                          ].join(" ")}
                        >
                          {product.sizePrices[material.name][item]} ron
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {product.sizePrices && (
                <div>
                  <p className="font-barlow text-sm font-black uppercase tracking-[0.18em]">
                    {t("Teljes méretárlista")}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {Object.entries(product.sizePrices).map(
                      ([materialName, prices]) => (
                        <div
                          key={materialName}
                          className={[
                            "rounded-2xl border p-4",
                            materialName === material.name
                              ? "border-[#d99a4d] bg-[#d99a4d]/10"
                              : "border-black/10 bg-white/70",
                          ].join(" ")}
                        >
                          <p className="mb-3 font-barlow text-xs font-black uppercase tracking-[0.14em]">
                            {t(materialName)}
                          </p>

                          <div className="space-y-1.5">
                            {Object.entries(prices).map(
                              ([priceSize, price]) => (
                                <div
                                  key={priceSize}
                                  className={[
                                    "flex justify-between gap-2 font-barlow text-xs",
                                    size === priceSize
                                      ? "font-black text-[#c77720]"
                                      : "text-black/60",
                                  ].join(" ")}
                                >
                                  <span>{priceSize} cm</span>
                                  <span>{price} ron</span>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {heightConfig && (
                <div>
                  <label className="font-barlow text-sm font-black uppercase tracking-[0.18em]">
                    {t("Magasság")}
                    {!heightConfig.required && (
                      <span className="ml-2 text-[10px] text-black/40">
                        {t("opcionális")}
                      </span>
                    )}
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
                    {t(heightConfig.help)}
                  </p>
                </div>
              )}

              {bustConfig && (
                <div>
                  <label className="font-barlow text-sm font-black uppercase tracking-[0.18em]">
                    {t("Mellbőség")}
                    {!bustConfig.required && (
                      <span className="ml-2 text-[10px] text-black/40">
                        {t("opcionális")}
                      </span>
                    )}
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
                    {t(bustConfig.help)}
                  </p>
                </div>
              )}

              {!heightConfig && !bustConfig && (
                <p className="rounded-2xl border border-[#d99a4d]/20 bg-[#d99a4d]/10 px-5 py-4 font-barlow text-sm leading-relaxed text-black/60">
                  {t("A PDF szerint ehhez a modellhez csak a ruhaméretet kell kiválasztani.")}
                </p>
              )}

              <button
                disabled={!sizeReady || isAddingToCart}
                onClick={() => {
                  if (!sizeReady || isAddingToCart) return;
                  onAddToCart();
                }}
                className={[
                  "mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-full px-6 font-barlow text-sm font-bold transition",
                  sizeReady && !isAddingToCart
                    ? "bg-[#8f592d] text-white hover:bg-[#d99a4d]"
                    : "cursor-not-allowed bg-black/20 text-black/40",
                ].join(" ")}
              >
                <ShoppingBag size={18} />
                {t(isAddingToCart ? busyLabel : submitLabel)}
              </button>
            </div>
          </aside>
        </div>
      </div>

    </section>
  );
}
