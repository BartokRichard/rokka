"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { useCart } from "../cart/CartProvider";
import { useLanguage } from "../i18n/LanguageProvider";

type Props = {
  size?: number;
};

export default function CartButton({ size = 22 }: Props) {
  const { itemCount } = useCart();
  const { t } = useLanguage();

  return (
    <Link
      href="/cart"
      aria-label={`${t("Kosár")}, ${t(`${itemCount} termék`)}`}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-black/5"
    >
      <ShoppingBag size={size} strokeWidth={1.7} />

      {itemCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d99a4d] px-1 font-barlow text-[10px] font-black text-white">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Link>
  );
}
