"use client";

import { ColorPart } from "../data/products";

type Props = {
  sampleImage: string;
  colorParts: ColorPart[];
  colorValues?: Record<string, string>;
};

const PREVIEW_SCALE = 1.1;

export default function ProductPreview({
  sampleImage,
  colorParts,
  colorValues = {},
}: Props) {
  const previewHeight = `${PREVIEW_SCALE * 100}%`;

  return (
    <section className="relative h-full w-full overflow-hidden bg-[#efe7da]">
      {/* Háttér */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,.98),rgba(244,238,229,.82)_55%,rgba(226,199,166,.25)_100%)]" />

        <div className="absolute inset-0 opacity-20">
          <div className="absolute left-1/4 top-0 h-full w-px bg-[#d8c4a4]" />
          <div className="absolute left-1/2 top-0 h-full w-px bg-[#d8c4a4]" />
          <div className="absolute left-3/4 top-0 h-full w-px bg-[#d8c4a4]" />
        </div>

        <div className="absolute bottom-0 h-56 w-full bg-gradient-to-t from-[#d7c8b2]/35 to-transparent" />

        <div className="absolute left-1/2 top-[42%] h-[760px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60 blur-[130px]" />
      </div>

      {/* SAMPLE */}
      <img
        src={sampleImage}
        alt="hoodie"
        className="absolute bottom-0 left-1/2 z-10 w-auto max-w-none -translate-x-1/2 object-contain"
        style={{
          height: previewHeight,
        }}
      />

      {/* SZÍNEZHETŐ MASZKOK */}
      {colorParts.map((part, index) => (
        <ColorMask
          key={part.id}
          color={colorValues[part.id] ?? part.defaultColor}
          mask={part.mask}
          zIndex={20 + index}
          height={previewHeight}
        />
      ))}

      <div className="pointer-events-none absolute bottom-5 left-1/2 z-40 h-10 w-64 -translate-x-1/2 rounded-full bg-black/20 blur-xl" />
    </section>
  );
}

function ColorMask({
  color,
  mask,
  zIndex,
  height,
}: {
  color: string;
  mask: string;
  zIndex: number;
  height: string;
}) {
  return (
    <div
      className="absolute bottom-0 left-1/2 w-auto max-w-none -translate-x-1/2"
      style={{
        zIndex,
        height,
        aspectRatio: "1 / 1",
        backgroundColor: color,
        opacity: 0.72,
        mixBlendMode: "multiply",

        WebkitMaskImage: `url("${mask}")`,
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center bottom",
        WebkitMaskSize: "contain",

        maskImage: `url("${mask}")`,
        maskRepeat: "no-repeat",
        maskPosition: "center bottom",
        maskSize: "contain",
      }}
    />
  );
}
