"use client";

import Swatch from "./Swatch";

type Props = {
  title: string;
  value: string;
  colors: string[];
  onChange: (color: string) => void;
};

export default function ColorGroup({ title, value, colors, onChange }: Props) {
  return (
    <div className="border-b border-white/10 py-5">
      <div className="mb-4 flex items-center justify-between text-xs">
        <span className="font-bold text-white">{title}</span>
        <span className="text-white/60">{value}</span>
      </div>

      <div className="flex flex-wrap gap-4">
        {colors.map((color) => (
          <Swatch
            key={color}
            color={color}
            active={value === color}
            onClick={() => onChange(color)}
          />
        ))}
      </div>
    </div>
  );
}
