"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Shirt,
  Palette,
  Ruler,
  User,
  ShoppingBag,
} from "lucide-react";
import { Product } from "../data/products";

type Props = {
  products: Product[];
  onSelect: (product: Product) => void;
};

export default function ModelSelector({ products, onSelect }: Props) {
  return (
    <section className="min-h-screen overflow-x-hidden bg-[#f4eee5] text-[#20221f]">
      <header className="flex h-24 items-center justify-between border-b border-black/5 bg-[#f4eee5]/90 px-8 backdrop-blur md:px-16">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo_trans.png"
            alt="ROKKA logo"
            width={145}
            height={80}
            priority
            className="h-auto w-[125px] object-contain mix-blend-multiply"
          />
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          <Step active number="01" label="Modell" icon={<Shirt size={20} />} />
          <Line />
          <Step number="02" label="Anyag" icon={<Shirt size={20} />} />
          <Line />
          <Step number="03" label="Szín" icon={<Palette size={20} />} />
          <Line />
          <Step number="04" label="Méret" icon={<Ruler size={20} />} />
        </div>

        <div className="flex items-center gap-5">
          <User size={22} strokeWidth={1.7} />
          <ShoppingBag size={22} strokeWidth={1.7} />
        </div>
      </header>

      <main className="relative px-5 py-7 md:px-10 lg:px-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_55%_24%,rgba(255,255,255,0.95),rgba(244,238,229,0.62)_42%,rgba(226,199,166,0.24)_100%)]" />

        <div className="relative z-10 mx-auto max-w-[1660px]">
          <div className="mb-8 grid items-center gap-7 lg:grid-cols-[0.12fr_1fr_0.42fr]">
            <div className="pointer-events-none hidden text-[128px] font-black leading-none text-transparent opacity-70 [-webkit-text-stroke:1px_rgba(185,150,110,0.18)] lg:block">
              01
            </div>

            <div>
              <h1 className="font-barlow-condensed text-[52px] font-bold uppercase leading-[0.85] tracking-[-0.045em] md:text-[68px]">
                Válaszd ki a modellt
              </h1>

              <p className="font-caveat mt-2 text-[30px] font-semibold leading-none text-[#d99a4d] md:text-[38px]">
                Találd meg a hozzád illő fazont.
              </p>
            </div>

            <p className="max-w-sm border-l border-black/10 pl-8 font-barlow text-base leading-relaxed text-black/70 max-md:border-l-0 max-md:pl-0">
              Minden modell egyedi szabással készült, hogy a te stílusodhoz és
              életedhez illeszkedjen.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {products.map((product) => (
              <button
                key={product.id}
                onClick={() => onSelect(product)}
                className="group grid min-h-[300px] w-full max-w-[405px] grid-cols-[150px_minmax(0,1fr)] overflow-hidden rounded-2xl bg-[#f4eee5]/90 p-4 text-left shadow-xl shadow-black/5 backdrop-blur transition hover:-translate-y-1 hover:bg-[#f4eee5] md:w-[calc(50%-12px)] xl:w-[calc(25%-18px)]"
              >
                <div className="relative h-full min-h-[268px] overflow-hidden rounded-lg bg-[#dedbd8]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    priority={product.id === products[0]?.id}
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="flex min-h-[268px] min-w-0 flex-col px-5 py-3">
                  <h2 className="font-barlow-condensed text-[20px] font-bold uppercase leading-[1]">
                    {product.name}
                  </h2>

                  <p className="mt-3 font-barlow text-[15px] font-medium leading-relaxed text-[#d99a4d]">
                    {product.subtitle}
                  </p>

                  <div className="my-5 h-px bg-black/10" />

                  <div className="space-y-1 font-barlow text-[13px] font-bold leading-tight">
                    {product.prices.slice(0, 3).map((price) => (
                      <p key={price}>{price}</p>
                    ))}
                  </div>

                  <div className="mt-auto pt-5">
                    <div className="flex h-12 w-full min-w-0 items-center justify-center gap-2 rounded-md bg-[#e1a35c] px-2 shadow-lg shadow-orange-900/10 sm:px-3">
                      <span className="min-w-0 truncate whitespace-nowrap font-barlow text-[11px] font-black uppercase leading-none text-white sm:text-[12px]">
                        Kiválasztom
                      </span>

                      <ArrowRight
                        size={17}
                        strokeWidth={2.5}
                        className="shrink-0 text-white"
                      />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
    </section>
  );
}

function Step({
  active,
  number,
  label,
  icon,
}: {
  active?: boolean;
  number: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-full border ${
          active
            ? "border-[#d99a4d] bg-[#d99a4d] text-white"
            : "border-black/20 bg-white/30 text-black/70"
        }`}
      >
        {icon}
      </div>

      <div
        className={`text-center font-barlow text-[11px] font-black uppercase leading-tight tracking-wide ${
          active ? "text-[#d99a4d]" : "text-black/70"
        }`}
      >
        <div>{number}</div>
        <div>{label}</div>
      </div>
    </div>
  );
}

function Line() {
  return <div className="h-px w-24 bg-black/20" />;
}
