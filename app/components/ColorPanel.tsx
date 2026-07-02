"use client";

import { ColorPart } from "../data/products";

const COLORS = [
  "#ff6b00",
  "#ffffff",
  "#000000",
  "#8b2bc2",
  "#3b82f6",
  "#7bb6c8",
];

type Props = {
  colorParts: ColorPart[];
  colorValues: Record<string, string>;
  setColorValues: (values: Record<string, string>) => void;
};

export default function ColorPanel({
  colorParts,
  colorValues,
  setColorValues,
}: Props) {
  return (
    <aside className="rounded-[30px] border border-black/10 bg-white/45 p-8 shadow-xl shadow-black/5">
      <p className="font-barlow text-xs font-black uppercase tracking-[0.25em] text-[#d99a4d]">
        Variálható részek
      </p>

      <h2 className="mt-3 font-barlow-condensed text-[42px] font-bold uppercase leading-none">
        Színezés
      </h2>

      <div className="mt-8 space-y-7">
        {colorParts.map((part) => (
          <ColorGroup
            key={part.id}
            part={part}
            selected={colorValues[part.id] ?? part.defaultColor}
            onSelect={(color) =>
              setColorValues({
                ...colorValues,
                [part.id]: color,
              })
            }
          />
        ))}
      </div>
    </aside>
  );
}

function ColorGroup({
  part,
  selected,
  onSelect,
}: {
  part: ColorPart;
  selected: string;
  onSelect: (color: string) => void;
}) {
  return (
    <div className="border-t border-black/10 pt-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="font-barlow text-xs font-black uppercase tracking-[0.18em]">
          {part.label}
        </h3>

        <span className="font-barlow text-sm font-semibold text-black/45">
          {selected}
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        {COLORS.map((color) => (
          <button
            key={color}
            onClick={() => onSelect(color)}
            className={`h-10 w-10 rounded-full border transition ${
              selected === color
                ? "scale-110 border-[#d99a4d] ring-4 ring-[#d99a4d]/20"
                : "border-black/15"
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
}
