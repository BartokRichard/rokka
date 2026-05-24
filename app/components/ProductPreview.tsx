"use client";

type Props = {
  bodyColor: string;
  sleeveColor: string;
};

export default function ProductPreview({ bodyColor, sleeveColor }: Props) {
  return (
    <section className="relative flex min-h-0 flex-1 overflow-hidden bg-[#5b554e]">
      <img
        src="/images/background.png"
        alt="background"
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />

      <img
        src="/images/sample.png"
        alt="hoodie"
        className="
          absolute inset-0 z-10
          h-full w-full
          object-contain

          scale-[1.72]
          translate-y-[5px]

          lg:scale-[1.22]
          lg:translate-y-0
        "
      />

      <div
        className="
          absolute inset-0 z-20
          h-full w-full

          scale-[1.72]
          translate-y-[5px]

          lg:scale-[1.22]
          lg:translate-y-0
        "
        style={{
          backgroundColor: bodyColor,
          opacity: 0.74,
          mixBlendMode: "multiply",

          WebkitMaskImage: "url('/images/masks/body-mask.png')",
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          WebkitMaskSize: "100%",

          maskImage: "url('/images/masks/body-mask.png')",
          maskRepeat: "no-repeat",
          maskPosition: "center",
          maskSize: "100%",
        }}
      />

      <div
        className="
          absolute inset-0 z-30
          h-full w-full

          scale-[1.72]
          translate-y-[5px]

          lg:scale-[1.22]
          lg:translate-y-0
        "
        style={{
          backgroundColor: sleeveColor,
          opacity: 0.74,
          mixBlendMode: "multiply",

          WebkitMaskImage: "url('/images/masks/sleeves-mask.png')",
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          WebkitMaskSize: "100%",

          maskImage: "url('/images/masks/sleeves-mask.png')",
          maskRepeat: "no-repeat",
          maskPosition: "center",
          maskSize: "100%",
        }}
      />

      <div className="absolute inset-0 z-40 bg-black/5" />
    </section>
  );
}
