"use client";

import { Languages } from "lucide-react";
import { useLanguage } from "../i18n/LanguageProvider";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-3 z-[120] flex items-center gap-0.5 rounded-full border border-black/10 bg-white/95 p-1 font-barlow text-[11px] font-black shadow-xl backdrop-blur sm:right-4 sm:gap-1 sm:p-1.5 sm:text-xs" aria-label={locale === "hu" ? "Nyelvválasztó" : "Selector de limbă"}>
      <Languages size={16} className="ml-1 mr-0.5 text-[#c77720] sm:ml-1.5" aria-hidden="true" />
      {(["hu", "ro"] as const).map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => setLocale(item)}
          className={`min-w-9 rounded-full px-2 py-2 uppercase transition sm:min-w-10 sm:px-2.5 ${locale === item ? "bg-[#1f1d1a] text-white" : "text-black/55 hover:bg-black/5"}`}
          aria-pressed={locale === item}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
