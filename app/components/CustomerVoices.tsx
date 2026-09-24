"use client";

import { Heart, MessageCircleMore, Quote } from "lucide-react";
import { useLanguage } from "../i18n/LanguageProvider";

const FEEDBACK_QUOTES = [
  {
    text: "Szia drága! Nagyon szépen köszönjük a hoodiet! Nagyon tetszett a férjemnek, és a méret is tökéletes! Alig várom együtt hordhassuk a hoodie-jainkat ❤️🥰 köszönjük szépen! ❤️",
    className: "rotate-[-0.7deg] bg-[#fff8ec]",
  },
  {
    text: "Szia! Megérkezett a csomag! Nagyon tetszik! Imádom😍😍 pont jó a méret is😭 nagyon szépen köszönöm! Már elkezdtem gondolkozni a következőn😌🥰",
    className: "rotate-[0.55deg] bg-[#e5b874] text-[#28251f]",
  },
  {
    text: "Annyira nagyon kényelmes, meleg, jó nagyok a zsebek, egyszerűen zseniális 😍\nGondoltam, hogy tetszeni fog, de még így is pozitívan csalódtam, nagyon nagyon, tetszik, köszönöm 😊",
    className: "rotate-[-0.35deg] bg-[#eff0df]",
  },
  {
    text: "Szia. Nagyon szépen köszönöm a hoodiest! Nagyon tetszik! Nagy kedvencem lett ❤️! Kívánok neked egészséget, és sok szeretetet, hogy még sok embert tudj megörvendeztetni a szép munkáiddal! 😊",
    className: "rotate-[0.65deg] bg-[#fffaf3]",
  },
  {
    text: "Szia! Felprobáltam az új Pretty hoodiem olyan kényelmes ,puha és legfőképp meleg,amit nem is képzeltem.😊  Alig akartam levenni,olyan jól esett magamon érezni ezt a puhaságot. Köszönöm szépen még egyszer!😊 Nemsokára jöhet egy másik típus kiprobálása is.",
    className: "rotate-[-0.5deg] bg-[#dce5d4]",
  },
  {
    text: "Szia. Most hozta a futár. Hát valami csodaszép és puha és kényelmes és nagyon meleg😁😍\n😍 Nagyon tetszik. Nagyon szép. Profi kezed van😁😁 köszönöm szépen 😊😊❤️",
    className: "rotate-[0.4deg] bg-[#fff8ec]",
  },
  {
    text: "Pont tokeletes minden! A szinek, a meret, a szabasa 😊 imadom! S ahogy elnezem, még osszeallitok valami szinkombit a kozeljovoben!\n\nHalasan koszonom Neked, aldas a munkadra❤️",
    className: "rotate-[-0.45deg] bg-[#e5b874] text-[#28251f]",
  },
  {
    text: "Szia! Megérkezett ma a hoodie, annyira, de annyira gyönyörű!!! 🥺 Fotókon is eszméletlenül szép, de így élőben, felvéve... El vagyok ájulva tőle, biztosan fogok rendelni még! Köszönöm! 🥺😍😍😍",
    className: "rotate-[0.7deg] bg-[#eff0df]",
  },
  {
    text: "Szeretném megköszönni ezt a csodás munkát. A sapkák és a sálak egyszerűen gyönyörűek – még szebbek, mint amire számítottam. Látszik rajtuk a gondosság és a szeretet, amivel készültek.\nBiztos vagyok benne, hogy nem ez volt az utolsó rendelésem, mert öröm ilyen minőséget kapni. Még biztosan fogok rendelni Önöktől, és szívből ajánlani is fogom másoknak.\nKöszönöm szépen, és további sok sikert kívánok a munkájukhoz! ❤️",
    className: "rotate-[-0.6deg] bg-[#fffaf3]",
  },
] as const;

export default function CustomerVoices() {
  const { t } = useLanguage();

  return (
    <section
      id="visszajelzesek"
      className="relative scroll-mt-24 overflow-hidden bg-[#293027] px-0 py-16 text-white md:scroll-mt-28 md:px-12 md:py-28"
    >
      <div className="pointer-events-none absolute -left-24 top-4 font-barlow-condensed text-[14rem] font-black uppercase leading-none tracking-[-0.08em] text-white/[0.025] md:text-[25rem]">
        ROKKA
      </div>
      <div className="pointer-events-none absolute -right-40 bottom-[-12rem] h-[34rem] w-[34rem] rounded-full bg-[#d89a50]/20 blur-3xl" />
      <Heart aria-hidden="true" className="motion-float pointer-events-none absolute left-[7%] top-[28%] h-7 w-7 text-[#e5aa63]/20" />
      <Heart aria-hidden="true" className="motion-float-delayed pointer-events-none absolute right-[8%] top-[14%] h-10 w-10 text-white/10" />
      <Heart aria-hidden="true" className="motion-float-slow pointer-events-none absolute bottom-[9%] left-[48%] h-6 w-6 text-[#e5aa63]/20" />

      <div className="relative mx-auto max-w-[1580px]">
        <div className="mobile-reveal max-w-4xl px-5 md:px-0" data-scroll-speed="18">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-[#e5aa63]">
            <MessageCircleMore size={17} /> {t("Valódi visszajelzések")}
          </p>
          <h2 className="mt-3 font-barlow-condensed text-5xl font-bold uppercase leading-[1.04] tracking-[-0.025em] md:text-7xl md:leading-[0.94]">
            {t("Ezt írtátok a ROKKA darabokról")}
          </h2>
        </div>

        <p className="mt-6 flex items-center gap-2 px-5 text-[10px] font-black uppercase tracking-[0.18em] text-white/45 md:hidden">
          {t("Húzd oldalra a további történetekért")} <span aria-hidden="true">→</span>
        </p>

        <div className="mobile-hide-scrollbar mt-5 flex touch-pan-x snap-x snap-mandatory select-none items-start gap-4 overflow-x-auto px-5 pb-7 md:mt-12 md:block md:columns-2 md:px-0 md:pb-0 md:select-auto xl:columns-3">
          {FEEDBACK_QUOTES.map((quote, index) => (
            <article
              key={quote.text}
              data-scroll-speed={index % 2 === 0 ? "8" : "-8"}
              className={`mobile-reveal group relative mb-0 w-[84vw] shrink-0 snap-center overflow-hidden rounded-[1.5rem] p-6 text-[#28251f] shadow-2xl shadow-black/20 transition duration-300 max-md:rotate-0 md:mb-5 md:w-auto md:break-inside-avoid md:p-7 md:hover:rotate-0 md:hover:-translate-y-1 ${quote.className}`}
            >
              <Quote className="absolute -right-3 -top-4 h-24 w-24 text-black/[0.055]" strokeWidth={1.3} />
              <div className="mb-5 flex items-center justify-between">
                <span className="font-barlow-condensed text-sm font-bold uppercase tracking-[0.18em] text-black/35">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <Heart size={18} className="fill-[#c96f45] text-[#c96f45]" />
              </div>
              <blockquote className="relative whitespace-pre-wrap text-[1.05rem] font-semibold leading-[1.58] md:text-lg">
                “{quote.text}”
              </blockquote>
              <p className="mt-6 text-[10px] font-black uppercase tracking-[0.2em] text-black/35">
                {t("Vásárlói üzenet")}
              </p>
            </article>
          ))}
        </div>

        <div className="mobile-reveal mt-8 flex items-center justify-center gap-3 px-5 text-center text-sm font-bold text-white/55 md:mt-12 md:px-0">
          <span className="h-px w-12 bg-white/20" />
          {t("Köszönjük, hogy megosztjátok velünk a ROKKA-pillanataitokat.")}
          <span className="h-px w-12 bg-white/20" />
        </div>
      </div>
    </section>
  );
}
