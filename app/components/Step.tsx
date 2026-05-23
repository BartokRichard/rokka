type Props = {
  number: string;
  title: string;
  subtitle: string;
  active?: boolean;
};

export default function Step({ number, title, subtitle, active }: Props) {
  return (
    <div className="flex items-center gap-4">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[11px] ${
          active
            ? "border-orange-500 text-orange-500"
            : "border-white/25 text-white/55"
        }`}
      >
        {number}
      </div>

      <div>
        <div className="text-xs font-bold text-white">{title}</div>
        <div className="mt-1 text-[10px] text-white/45">{subtitle}</div>
      </div>
    </div>
  );
}
