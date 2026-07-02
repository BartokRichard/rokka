"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Product, MaterialOption } from "../../data/products";

type Props = {
  product: Product;
  onBack: () => void;
  onSelect: (material: MaterialOption) => void;
};

export default function MaterialSelectorView({
  product,
  onBack,
  onSelect,
}: Props) {
  return (
    <section className="relative min-h-[calc(100vh-96px)] overflow-x-hidden bg-[#f4eee5] pb-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(255,255,255,0.95),rgba(244,238,229,0.65)_45%,rgba(226,199,166,0.26)_100%)]" />

      <div className="relative z-10 mx-auto max-w-[1580px] px-5 py-7 md:px-8">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 font-barlow text-sm font-semibold text-black/60 transition hover:text-black"
        >
          <ArrowLeft size={16} />
          Modell váltása
        </button>

        <div className="mb-8 grid items-center gap-7 lg:grid-cols-[0.12fr_1fr_0.42fr]">
          <div className="pointer-events-none hidden text-[128px] font-black leading-none text-transparent opacity-70 [-webkit-text-stroke:1px_rgba(185,150,110,0.18)] lg:block">
            02
          </div>

          <div>
            <h1 className="font-barlow-condensed text-[52px] font-bold uppercase leading-[0.85] tracking-[-0.045em] md:text-[68px]">
              Válassz anyagot
            </h1>

            <p className="font-caveat mt-2 text-[30px] font-semibold leading-none text-[#d99a4d] md:text-[38px]">
              Tapintásban is legyen tökéletes.
            </p>
          </div>

          <p className="max-w-sm border-l border-black/10 pl-8 font-barlow text-base leading-relaxed text-black/70 max-md:border-l-0 max-md:pl-0">
            A kiválasztott modellhez válaszd ki az anyagot. Ezután tudod majd a
            színeket személyre szabni.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:gap-20">
          <div className="overflow-hidden rounded-[30px] border border-black/10 bg-white/45 shadow-xl shadow-black/5">
            <div className="grid grid-cols-1 overflow-hidden lg:grid-cols-[320px_1fr]">
              <div className="relative h-[460px] sm:h-[500px] lg:h-[360px]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover object-center"
                />
              </div>

              <div className="flex min-w-0 flex-col justify-center px-7 py-8 md:px-9">
                <p className="font-barlow text-xs font-black uppercase tracking-[0.25em] text-[#d99a4d]">
                  Kiválasztott modell
                </p>

                <h2 className="mt-3 max-w-full break-words font-barlow-condensed text-[38px] font-bold uppercase leading-[0.9] tracking-[-0.04em] sm:text-[44px] md:text-[54px] lg:text-[62px]">
                  {product.name}
                </h2>

                <p className="mt-5 font-barlow text-[18px] text-black/60 md:text-[20px]">
                  {product.subtitle}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:h-[360px] lg:justify-between lg:gap-0 lg:py-1">
            {product.materialOptions.map((material) => (
              <button
                key={material.name}
                onClick={() => onSelect(material)}
                className="group flex min-h-[122px] w-full items-center justify-between rounded-[28px] border border-black/10 bg-white/55 px-8 text-left shadow-xl shadow-black/5 transition-all duration-300 hover:-translate-y-1 hover:border-[#d99a4d]/50 hover:bg-white"
              >
                <div>
                  <h3 className="font-barlow-condensed text-[42px] font-bold uppercase leading-none md:text-[46px]">
                    {material.name}
                  </h3>

                  <p className="mt-3 font-barlow text-[20px] font-medium text-black/55">
                    {material.price
                      ? `${material.price} ${material.currency}`
                      : material.note}
                  </p>
                </div>

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#e1a35c] text-white transition-all duration-300 group-hover:translate-x-1 group-hover:scale-105">
                  <ArrowRight size={22} strokeWidth={2.3} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
