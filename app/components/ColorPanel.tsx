"use client";

import { ColorOption, ColorPart } from "../data/products";
import { useLanguage } from "../i18n/LanguageProvider";

type Props = {
  colorParts: ColorPart[];
  colorsByPart: Record<string, ColorOption[]>;
  colorValues: Record<string, string>;
  setColorValues: (values: Record<string, string>) => void;
};

export default function ColorPanel({
  colorParts,
  colorsByPart,
  colorValues,
  setColorValues,
}: Props) {
  const { t } = useLanguage();
  return (
    <aside className="rounded-[30px] border border-black/10 bg-white/45 p-8 shadow-xl shadow-black/5">
      <p className="font-barlow text-xs font-black uppercase tracking-[0.25em] text-[#d99a4d]">
        {t("Variálható részek")}
      </p>

      <h2 className="mt-3 font-barlow-condensed text-[42px] font-bold uppercase leading-none">
        {t("Színezés")}
      </h2>

      <div className="mt-8 space-y-7">
        {colorParts.map((part) => (
          <ColorGroup
            key={part.id}
            part={part}
            colors={colorsByPart[part.id] ?? []}
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
  colors,
  selected,
  onSelect,
}: {
  part: ColorPart;
  colors: ColorOption[];
  selected: string;
  onSelect: (color: string) => void;
}) {
  const { t } = useLanguage();
  const selectedOption = colors.find((color) => color.id === selected);

  return (
    <div className="border-t border-black/10 pt-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="font-barlow text-xs font-black uppercase tracking-[0.18em]">
          {t(part.label)}
        </h3>

        <span className="font-barlow text-sm font-semibold text-black/45">
          {selectedOption ? t(selectedOption.label) : selected}
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <button
            key={color.id}
            type="button"
            title={t(color.label)}
            aria-label={t(color.label)}
            onClick={() => onSelect(color.id)}
            className={`h-10 w-10 rounded-full border transition ${
              selected === color.id
                ? "scale-110 border-[#d99a4d] ring-4 ring-[#d99a4d]/20"
                : "border-black/15"
            }`}
            style={{
              backgroundColor: color.hex ?? "#ffffff",
              backgroundImage: color.texture
                ? `url("${color.texture.src}")`
                : undefined,
              backgroundSize:
                color.texture?.swatchBackgroundSize ??
                color.texture?.backgroundSize,
              backgroundPosition: color.texture?.backgroundPosition,
              backgroundRepeat: color.texture?.backgroundRepeat ?? "no-repeat",
            }}
          />
        ))}
      </div>
    </div>
  );
}
