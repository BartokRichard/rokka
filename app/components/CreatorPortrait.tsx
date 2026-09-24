"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useState, type CSSProperties } from "react";

import foxHoodie from "../../public/images/products/FoxHoodie.png";
import prettyHoodie from "../../public/images/products/PrettyHoodie.jpg";
import summerFox from "../../public/images/products/SummerFox.png";
import { useLanguage } from "../i18n/LanguageProvider";
import styles from "./CreatorPortrait.module.css";

type Props = {
  src: StaticImageData;
  alt: string;
};

const pieces = [
  { id: "summer-fox-hoodie", name: "Summer Fox", image: summerFox },
  { id: "pretty-hoodie", name: "Pretty Hoodie", image: prettyHoodie },
  { id: "fox-hoodie", name: "Fox Hoodie", image: foxHoodie },
] as const;

export default function CreatorPortrait({ src, alt }: Props) {
  const [split, setSplit] = useState(88);
  const [selectedPiece, setSelectedPiece] = useState(0);
  const [animateReveal, setAnimateReveal] = useState(false);
  const { t } = useLanguage();
  const piece = pieces[selectedPiece];
  const style = {
    "--creator-split": `${split}%`,
    aspectRatio: "1312 / 2048",
  } as CSSProperties;

  return (
    <div className="creator-comparison relative w-full max-w-[680px]">
      <div
        className={`${styles.stage} ${animateReveal ? styles.animated : ""} relative isolate mx-auto w-full max-w-[576px] overflow-hidden shadow-2xl shadow-black/40 sm:rounded-[1.5rem]`}
        style={style}
      >
        <Image
          key={piece.id}
          src={piece.image}
          alt={`${piece.name} – ${t("ROKKA darab")}`}
          fill
          sizes="(min-width: 1024px) 45vw, (min-width: 640px) 576px, 100vw"
          className={`${styles.finishedImage} object-cover object-center`}
        />

        <div className={`${styles.curtain} absolute inset-0 z-10`}>
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 45vw, (min-width: 640px) 576px, 100vw"
            className="object-cover object-center"
          />
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-between gap-3 p-3 text-[10px] font-black uppercase tracking-[0.16em] text-white sm:p-5">
          <span className="rounded-full bg-[#252820]/80 px-3 py-2 backdrop-blur-md">{t("Az alkotó")}</span>
          <span className="rounded-full bg-[#252820]/80 px-3 py-2 backdrop-blur-md">{t("A kész darab")}</span>
        </div>

        <div className={`${styles.seam} pointer-events-none absolute inset-y-0 z-20`} aria-hidden="true">
          <span className={`${styles.handle} absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-[#f3d2a8] bg-[#252820] text-2xl font-light text-[#f3d2a8] shadow-[0_10px_30px_rgba(0,0,0,.5)] sm:h-20 sm:w-20`}>
            ↔
          </span>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 flex flex-col items-center gap-2 bg-gradient-to-t from-black/60 to-transparent px-4 pb-5 pt-20">
          <button
            type="button"
            onClick={() => {
              setAnimateReveal(true);
              setSplit(split >= 50 ? 8 : 92);
            }}
            className="pointer-events-auto rounded-full border border-[#f3d2a8] bg-[#252820] px-4 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-[#f3d2a8] shadow-lg transition hover:bg-[#e5aa63] hover:text-[#252820] sm:text-xs"
          >
            {t(split >= 50 ? "Mutasd a kész darabot" : "Mutasd az alkotót")}
          </button>
          <span className="rounded-full bg-[#252820]/85 px-3 py-1 text-[9px] font-bold text-white backdrop-blur-md sm:text-[10px]">
            {t("A varrásvonalat el is húzhatod")}
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={split}
          onChange={(event) => {
            setAnimateReveal(false);
            setSplit(Number(event.target.value));
          }}
          aria-label={t("Portré és kész darab összehasonlítása")}
          className={`${styles.range} absolute inset-0 z-30 h-full w-full cursor-ew-resize opacity-0`}
        />
      </div>

      <div className="mx-auto mt-3 flex w-full max-w-[576px] flex-col gap-3 rounded-2xl border border-white/15 bg-white/[0.075] p-3 sm:mt-4 sm:flex-row sm:items-center sm:justify-between sm:p-4">
        <div className="flex flex-wrap gap-2" role="group" aria-label={t("Válassz egy elkészült darabot")}>
          {pieces.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setSelectedPiece(index);
                setAnimateReveal(true);
                setSplit(8);
              }}
              aria-pressed={selectedPiece === index}
              className={`rounded-full px-3 py-2 text-[11px] font-black uppercase tracking-wide transition sm:text-xs ${
                selectedPiece === index
                  ? "bg-[#e5aa63] text-[#252820] shadow-lg shadow-black/15"
                  : "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white"
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
        <Link
          href="/configurator"
          className="inline-flex shrink-0 items-center justify-center gap-1 self-start rounded-full border border-[#e5aa63]/70 px-3 py-2 text-[11px] font-black uppercase tracking-wide text-[#f3c38e] transition hover:bg-[#e5aa63] hover:text-[#252820] sm:self-auto"
        >
          {t("Tervezd meg a sajátodat")} <ArrowUpRight size={14} />
        </Link>
      </div>
    </div>
  );
}
