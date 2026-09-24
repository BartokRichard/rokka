"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import CartButton from "./CartButton";
import { useLanguage } from "../i18n/LanguageProvider";

export default function StoreHeader() {
  const { t } = useLanguage();
  const pathname = usePathname();
  return (
    <header className="flex h-24 items-center justify-between border-b border-black/5 bg-[#f4eee5]/90 px-6 backdrop-blur md:px-16">
      <Link href="/" className="flex items-center">
        <Image
          src="/images/logo_trans.png"
          alt="ROKKA logo"
          width={145}
          height={80}
          priority
          className="h-auto w-[125px] object-contain mix-blend-multiply"
        />
      </Link>

      <nav className="hidden items-center gap-8 font-barlow text-sm font-bold md:flex">
        <Link href="/#kollekcio" className="transition hover:text-[#d99a4d]">
          {t("Kollekció")}
        </Link>
        <Link href="/configurator" className={`border-b-2 pb-1 transition hover:text-[#d99a4d] ${pathname === "/configurator" ? "border-[#d99a4d] text-[#d99a4d]" : "border-transparent"}`}>
          {t("Tervezés indítása")}
        </Link>
        <Link href="/#rolunk" className="transition hover:text-[#d99a4d]">
          {t("Rólunk")}
        </Link>
        <Link href="/cart" className="transition hover:text-[#d99a4d]">
          {t("Kosár")}
        </Link>
      </nav>

      <div className="flex items-center gap-4">
        <CartButton />
      </div>
    </header>
  );
}
