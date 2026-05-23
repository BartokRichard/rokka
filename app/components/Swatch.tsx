"use client";

type Props = {
  color: string;
  active?: boolean;
  onClick: () => void;
};

export default function Swatch({ color, active, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`h-10 w-10 rounded-full border transition ${
        active ? "border-orange-500 ring-2 ring-white" : "border-white/20"
      }`}
      style={{ backgroundColor: color }}
    />
  );
}
