"use client";

import ColorGroup from "./ColorGroup";

const sleeveColors = [
  "#ff6b00",
  "#ffffff",
  "#000000",
  "#7a1cac",
  "#3b82f6",
  "#6ba4b8",
];

type Props = {
  sleeveColor: string;
  setSleeveColor: (color: string) => void;
};

export default function ColorPanel({ sleeveColor, setSleeveColor }: Props) {
  return (
    <aside className="bg-black px-5 py-5 lg:min-h-0 lg:overflow-y-auto lg:px-8 lg:py-6">
      <ColorGroup
        title="UJJAK"
        value={sleeveColor}
        colors={sleeveColors}
        onChange={setSleeveColor}
      />

      <div className="mt-6 border-t border-white/10 pt-6 lg:hidden">
        <div className="text-[11px] uppercase tracking-[0.2em] text-white/35">
          Összesen
        </div>
        <div className="mt-3 text-2xl font-light">249 Lei</div>
        <button className="mt-5 w-full rounded bg-orange-600 px-6 py-4 text-sm font-bold">
          KOSÁRBA
        </button>
      </div>
    </aside>
  );
}
