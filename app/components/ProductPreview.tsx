"use client";

import Image from "next/image";

import { ColorOption, ColorPart } from "../data/products";

type Props = {
  sampleImage: string;
  colorParts: ColorPart[];
  colorOptions: ColorOption[];
  colorValues?: Record<string, string>;
};

const PREVIEW_INSET = "8%";

export default function ProductPreview({
  sampleImage,
  colorParts,
  colorOptions,
  colorValues = {},
}: Props) {
  const hasDarkSampleBackdrop = /\/(?:FoxHoodieSample\.webp|PrettyHoodie\.png)(?:\?|$)/.test(sampleImage);

  return (
    <section className={`relative h-full w-full overflow-hidden ${hasDarkSampleBackdrop ? "bg-[#d9c7ad]" : "bg-[#efe7da]"}`}>
      {/* Háttér */}
      <div className="absolute inset-0">
        <div className={`absolute inset-0 ${hasDarkSampleBackdrop ? "bg-[radial-gradient(circle_at_50%_18%,#ede1cf_0%,#d9c7ad_65%,#c6ac89_100%)]" : "bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,.98),rgba(244,238,229,.82)_55%,rgba(226,199,166,.25)_100%)]"}`} />

        <div className="absolute inset-0 opacity-20">
          <div className="absolute left-1/4 top-0 h-full w-px bg-[#d8c4a4]" />
          <div className="absolute left-1/2 top-0 h-full w-px bg-[#d8c4a4]" />
          <div className="absolute left-3/4 top-0 h-full w-px bg-[#d8c4a4]" />
        </div>

        <div className="absolute bottom-0 h-56 w-full bg-gradient-to-t from-[#d7c8b2]/35 to-transparent" />

        <div className="absolute left-1/2 top-[42%] h-[760px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60 blur-[130px]" />
      </div>

      {/* SAMPLE */}
      <div
        className="absolute z-10"
        style={{
          inset: PREVIEW_INSET,
          ...(hasDarkSampleBackdrop ? {
            maskImage: `url("${sampleImage}")`,
            maskMode: "luminance" as const,
            maskRepeat: "no-repeat",
            maskPosition: "center",
            maskSize: "contain",
          } : {}),
        }}
      >
        <Image
          src={sampleImage}
          alt="hoodie"
          fill
          sizes="(min-width: 1024px) 65vw, 100vw"
          className="object-contain object-center"
        />
      </div>

      {/* SZÍNEZHETŐ MASZKOK */}
      {colorParts.map((part, index) => (
        <ColorMask
          key={part.id}
          fill={
            colorOptions.find(
              (option) =>
                option.id === (colorValues[part.id] ?? part.defaultColor),
            ) ?? {
              id: part.defaultColor,
              label: part.defaultColor,
              hex: colorValues[part.id] ?? part.defaultColor,
            }
          }
          mask={part.mask}
          zIndex={20 + index}
        />
      ))}

      <div className="pointer-events-none absolute bottom-[7%] left-1/2 z-40 h-8 w-[36%] max-w-64 -translate-x-1/2 rounded-full bg-black/15 blur-xl" />
    </section>
  );
}

function ColorMask({
  fill,
  mask,
  zIndex,
}: {
  fill: ColorOption;
  mask: string;
  zIndex: number;
}) {
  return (
    <div
      className="absolute"
      style={{
        inset: PREVIEW_INSET,
        zIndex,
        backgroundColor: fill.hex ?? "#ffffff",
        backgroundImage: fill.texture
          ? `url("${fill.texture.src}")`
          : undefined,
        backgroundSize: fill.texture?.backgroundSize,
        backgroundPosition: fill.texture?.backgroundPosition,
        backgroundRepeat: fill.texture?.backgroundRepeat ?? "no-repeat",
        opacity: 0.72,
        mixBlendMode: "multiply",

        WebkitMaskImage: `url("${mask}")`,
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        WebkitMaskSize: "contain",

        maskImage: `url("${mask}")`,
        maskRepeat: "no-repeat",
        maskPosition: "center",
        maskSize: "contain",
      }}
    />
  );
}
