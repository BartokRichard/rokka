"use client";

import {
  getCurrentPrice,
  MaterialOption,
  Product,
} from "../data/products";
import { useLanguage } from "../i18n/LanguageProvider";

type Props = {
  product: Product;
  material: MaterialOption;
  size?: string;
};

export default function PriceBadge({ product, material, size }: Props) {
  const { t } = useLanguage();
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-[#e1a35c]/15 px-3 py-1 font-barlow text-sm font-bold text-[#d1842f]">
      <span className="text-[10px] font-black uppercase tracking-[0.12em] text-black/45">
        {t("Aktuális ár")}
      </span>
      {t(getCurrentPrice(product, material, size))}
    </span>
  );
}
