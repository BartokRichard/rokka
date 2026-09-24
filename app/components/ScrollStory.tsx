"use client";

import {
  Images,
  MapPinned,
  MessageCircleHeart,
  Sparkles,
  Spool,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useLanguage } from "../i18n/LanguageProvider";

type ScrollStage = {
  id: string;
  eyebrow: string;
  title: string;
  text: string;
  icon: LucideIcon;
};

const STAGES: ScrollStage[] = [
  {
    id: "kezdet",
    eyebrow: "Tervezés",
    title: "A te színeid.",
    text: "A saját darabod a 3D tervezőben indul.",
    icon: Sparkles,
  },
  {
    id: "kollekcio",
    eyebrow: "Kollekció",
    title: "Nincs két egyforma.",
    text: "Valódi ROKKA darabok, valódi színkombinációk.",
    icon: Images,
  },
  {
    id: "visszajelzesek",
    eyebrow: "Visszajelzések",
    title: "Ti írtátok.",
    text: "Vásárlói fotók és pontosan idézett üzenetek.",
    icon: MessageCircleHeart,
  },
  {
    id: "rolunk",
    eyebrow: "Műhely",
    title: "Itt készül.",
    text: "Csíkszeredában, helyben, egyedileg.",
    icon: MapPinned,
  },
];

export default function ScrollStory() {
  const { t } = useLanguage();
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(true);
  const activeIndexRef = useRef(0);

  useEffect(() => {
    let frame = 0;
    let hideTimer = window.setTimeout(() => setShowDetails(false), 3600);

    const update = () => {
      const scrollRange = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1,
      );
      const nextProgress = Math.min(Math.max(window.scrollY / scrollRange, 0), 1);
      const readingLine = window.scrollY + window.innerHeight * 0.42;
      let nextIndex = 0;

      STAGES.forEach((stage, index) => {
        const section = document.getElementById(stage.id);
        if (section && section.offsetTop <= readingLine) nextIndex = index;
      });

      setProgress(nextProgress);
      if (nextIndex !== activeIndexRef.current) {
        activeIndexRef.current = nextIndex;
        setActiveIndex(nextIndex);
        setShowDetails(true);
        window.clearTimeout(hideTimer);
        hideTimer = window.setTimeout(() => setShowDetails(false), 3600);
      }
      frame = 0;
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.clearTimeout(hideTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const stage = STAGES[activeIndex];
  const StageIcon = stage.icon;
  const markerPosition = 29 + progress * 53;

  return (
    <>
      <div
        aria-hidden="true"
        className="scroll-story-mobile pointer-events-none fixed left-0 right-0 top-[5.9rem] z-[60] h-[3px] bg-black/10 md:top-[6.9rem] xl:hidden"
      >
        <span
          className="absolute inset-y-0 left-0 origin-left bg-[#d99a4d] shadow-[0_0_12px_rgba(217,154,77,0.8)]"
          style={{ transform: `scaleX(${progress})` }}
        />
        <span
          className="absolute top-1/2 grid h-5 w-5 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/80 bg-[#252820] text-[#e5aa63] shadow-lg"
          style={{ left: `${4 + progress * 92}%` }}
        >
          <Spool size={11} style={{ transform: `rotate(${progress * 540}deg)` }} />
        </span>
      </div>

      <div className="scroll-story-mobile pointer-events-none fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-3 z-[110] flex h-11 items-center gap-2 rounded-full border border-white/15 bg-[#252820]/94 px-3.5 text-white shadow-xl shadow-black/20 backdrop-blur-xl xl:hidden">
        <span className="font-barlow-condensed text-lg font-bold text-[#e5aa63]">
          {String(activeIndex + 1).padStart(2, "0")}
        </span>
        <span className="text-[9px] font-black uppercase tracking-[0.16em] text-white/70">
          {t(stage.eyebrow)}
        </span>
      </div>

      <aside
        aria-label={t("Az oldal története")}
        className="scroll-story-desktop pointer-events-none fixed inset-y-0 right-0 z-40 hidden w-[22rem] xl:block"
      >
        <div className="absolute bottom-[18%] right-6 top-[29%] w-px bg-[#252820]/15">
          <span
            className="absolute left-0 top-0 w-px bg-[#d99a4d] shadow-[0_0_14px_rgba(217,154,77,0.6)]"
            style={{ height: `${progress * 100}%` }}
          />
        </div>

        <div
          className="absolute right-1 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/70 bg-[#252820] text-[#e5aa63] shadow-[0_12px_28px_rgba(32,34,31,0.28)]"
          style={{ top: `${markerPosition}%` }}
        >
          <Spool size={20} style={{ transform: `rotate(${progress * 720}deg)` }} />
        </div>

        <div
          aria-hidden={showDetails}
          className={`absolute right-16 -translate-y-1/2 rounded-full border border-white/65 bg-[#fbf8f3]/95 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#9c5b25] shadow-xl backdrop-blur-xl transition-all duration-500 ${
            showDetails ? "translate-x-4 opacity-0" : "translate-x-0 opacity-100"
          }`}
          style={{ top: `${markerPosition}%` }}
        >
          {String(activeIndex + 1).padStart(2, "0")} · {t(stage.eyebrow)}
        </div>

        <div
          aria-hidden={!showDetails}
          className={`absolute right-16 w-[250px] -translate-y-1/2 transition-all duration-500 ${
            showDetails ? "translate-x-0 opacity-100" : "translate-x-5 opacity-0"
          }`}
          style={{ top: `${markerPosition}%` }}
        >
          <div
            key={stage.id}
            className="scroll-story-card relative overflow-hidden rounded-[1.35rem] border border-white/65 bg-[#fbf8f3]/95 p-5 text-[#20221f] shadow-2xl shadow-black/15 backdrop-blur-xl"
          >
            <div className="absolute -right-8 -top-9 h-28 w-28 rounded-full bg-[#e5aa63]/20 blur-2xl" />
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#b66e2f]">
                  {String(activeIndex + 1).padStart(2, "0")} / {t(stage.eyebrow)}
                </p>
                <p className="mt-2 font-barlow-condensed text-[1.7rem] font-bold uppercase leading-none tracking-[-0.02em]">
                  {t(stage.title)}
                </p>
              </div>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#252820] text-[#e5aa63]">
                <StageIcon size={19} />
              </span>
            </div>
            <p className="relative mt-3 text-sm font-medium leading-5 text-black/58">
              {t(stage.text)}
            </p>
            <div className="relative mt-4 flex items-center gap-2">
              {STAGES.map((item, index) => (
                <span
                  key={item.id}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    index === activeIndex ? "w-8 bg-[#d99a4d]" : "w-2 bg-black/15"
                  }`}
                />
              ))}
              <span className="ml-auto text-[10px] font-black tabular-nums text-black/35">
                {Math.round(progress * 100)}%
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
