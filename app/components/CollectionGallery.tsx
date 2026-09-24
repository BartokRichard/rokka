"use client";

import Image from "next/image";
import {
  ArrowDown,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Heart,
  Search,
  X,
  ZoomIn,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "../i18n/LanguageProvider";
import {
  ADMIN_CONTENT,
  GalleryCategory,
  GalleryItem,
  GALLERY_CATEGORIES,
} from "../data/admin-content";

type GallerySort = "newest" | "oldest" | "favorites";

const CATEGORIES: Array<"Mind" | GalleryCategory> = [
  "Mind",
  ...GALLERY_CATEGORIES,
];

const GALLERY_ITEMS = ADMIN_CONTENT.gallery
  .filter((item) => item.enabled)
  .sort((a, b) => a.order - b.order);

export default function CollectionGallery() {
  const { locale, t } = useLanguage();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("Mind");
  const [sort, setSort] = useState<GallerySort>("newest");
  const [sortOpen, setSortOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(24);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase(locale);
    const matching = GALLERY_ITEMS.filter(
      (item) =>
        (category === "Mind" || item.category === category) &&
        (!normalizedQuery ||
          `${locale === "hu" ? item.titleHu : item.titleRo} ${t(item.category)}`
            .toLocaleLowerCase(locale)
            .includes(normalizedQuery)),
    );

    return matching.sort((a, b) => {
      if (sort === "oldest") return b.order - a.order;
      if (sort === "favorites") {
        return Number(favorites.has(b.id)) - Number(favorites.has(a.id));
      }
      return a.order - b.order;
    });
  }, [category, favorites, locale, query, sort, t]);

  const visibleItems = filteredItems.slice(0, visibleCount);
  const selectedIndex = filteredItems.findIndex((item) => item.id === selectedId);
  const selectedItem = selectedIndex >= 0 ? filteredItems[selectedIndex] : null;

  useEffect(() => {
    if (!selectedItem) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedId(null);
      if (event.key === "ArrowLeft") {
        const previous = (selectedIndex - 1 + filteredItems.length) % filteredItems.length;
        setSelectedId(filteredItems[previous]?.id ?? null);
      }
      if (event.key === "ArrowRight") {
        const next = (selectedIndex + 1) % filteredItems.length;
        setSelectedId(filteredItems[next]?.id ?? null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [filteredItems, selectedIndex, selectedItem]);

  const toggleFavorite = (id: string) => {
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const showPrevious = () => {
    const previous = (selectedIndex - 1 + filteredItems.length) % filteredItems.length;
    setSelectedId(filteredItems[previous]?.id ?? null);
  };

  const showNext = () => {
    const next = (selectedIndex + 1) % filteredItems.length;
    setSelectedId(filteredItems[next]?.id ?? null);
  };

  return (
    <section
      id="kollekcio"
      className="relative scroll-mt-24 bg-[#f4eee5] px-4 py-16 md:scroll-mt-28 md:px-12 md:py-28"
    >
      <div className="pointer-events-none absolute -left-32 top-28 h-96 w-96 rounded-full bg-[#e3b271]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 top-1/2 h-[32rem] w-[32rem] rounded-full bg-[#7e8d6b]/15 blur-3xl" />

      <div className="relative mx-auto max-w-[1580px]">
        <div className="mobile-reveal grid items-end gap-6 md:gap-8 lg:grid-cols-[1fr_0.72fr]" data-scroll-speed="14">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#c67d35]">
              {t("ROKKA pillanatok")}
            </p>
            <h2 className="mt-3 font-barlow-condensed text-5xl font-bold uppercase leading-[1.04] tracking-[-0.025em] md:text-7xl md:leading-[0.94]">
              {t("Kollekció, részletek, történetek")}
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-black/58 md:text-lg">
            {t("Egy válogatás az elkészült darabokból, színekből és műhelypillanatokból.")} {t("Böngéssz szabadon, vagy szűkítsd a galériát egy témára.")}
          </p>
        </div>

        <div className="sticky top-[6.75rem] z-30 mt-8 rounded-[1.35rem] border border-white/80 bg-[#fbf7f0]/92 p-2.5 shadow-xl shadow-[#6f4d2d]/10 backdrop-blur-xl md:top-28 md:mt-10 md:rounded-[1.6rem] md:p-4">
          <div className="grid grid-cols-[minmax(0,1fr)_3rem] gap-2.5 xl:grid-cols-[minmax(220px,0.7fr)_1.6fr_220px] xl:gap-3">
            <label className="relative col-start-1 row-start-1 block xl:col-auto xl:row-auto">
              <span className="sr-only">{t("Keresés a galériában")}</span>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/35" size={19} />
              <input
                type="search"
                value={query}
                onChange={(event) => { setQuery(event.target.value); setVisibleCount(24); }}
                placeholder={t("Keresés a galériában…")}
                className="h-12 w-full rounded-xl border border-black/10 bg-white/65 pl-11 pr-4 text-sm outline-none transition placeholder:text-black/35 focus:border-[#d4914a] focus:ring-2 focus:ring-[#d4914a]/15"
              />
            </label>

            <div className="mobile-hide-scrollbar col-span-2 row-start-2 flex gap-2 overflow-x-auto pb-0.5 xl:col-auto xl:row-auto xl:pb-0" aria-label={t("Galériakategóriák")}>
              {CATEGORIES.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => { setCategory(option); setVisibleCount(24); }}
                  className={`h-11 shrink-0 rounded-xl px-4 text-sm font-black transition md:h-12 ${
                    category === option
                      ? "bg-[#d99a4d] text-white shadow-md shadow-[#bc762d]/20"
                      : "bg-[#ede5d9] text-black/58 hover:bg-[#e5d7c5] hover:text-black"
                  }`}
                >
                  {t(option)}
                </button>
              ))}
            </div>

            <div className="relative col-start-2 row-start-1 block xl:col-auto xl:row-auto">
              <span className="sr-only">{t("Galéria rendezése")}</span>
              <button type="button" aria-label={t("Galéria rendezése")} aria-haspopup="listbox" aria-expanded={sortOpen} onClick={() => setSortOpen((open) => !open)} className={`flex h-12 w-full items-center justify-center gap-3 rounded-xl border bg-white/65 px-3 text-left text-sm font-bold outline-none transition xl:justify-start xl:px-4 ${sortOpen ? "border-[#d4914a] ring-2 ring-[#d4914a]/15" : "border-black/10 hover:border-[#d4914a]/60"}`}>
                <ArrowUpDown size={18} className="text-[#b5793b]" />
                <span className="hidden flex-1 xl:inline">{t(sort === "newest" ? "Legújabb elöl" : sort === "oldest" ? "Legrégebbi elöl" : "Kedvencek elöl")}</span>
                <ChevronDown size={17} className={`hidden text-black/40 transition xl:block ${sortOpen ? "rotate-180" : ""}`} />
              </button>
              {sortOpen && <div role="listbox" aria-label={t("Galéria rendezése")} className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-[220px] overflow-hidden rounded-2xl border border-[#e1c9aa] bg-[#fffaf3] p-1.5 shadow-2xl shadow-[#6f4d2d]/20 xl:left-0 xl:w-auto">
                {([ ["newest", "Legújabb elöl"], ["oldest", "Legrégebbi elöl"], ["favorites", "Kedvencek elöl"] ] as const).map(([value, label]) => (
                  <button key={value} type="button" role="option" aria-selected={sort === value} onClick={() => { setSort(value); setVisibleCount(24); setSortOpen(false); }} className={`flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm transition ${sort === value ? "bg-[#d99a4d] font-black text-white" : "text-black/70 hover:bg-[#f1e4d3] hover:text-black"}`}>
                    {t(label)}
                  </button>
                ))}
              </div>}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between text-sm text-black/48">
          <span>{t(`${filteredItems.length} kép`)}</span>
          <span>{t(`${favorites.size} kedvenc`)}</span>
        </div>

        {visibleItems.length ? (
          <div className="mt-4 columns-2 gap-2.5 min-[540px]:gap-4 lg:columns-3 xl:columns-4">
            {visibleItems.map((item, index) => (
              <GalleryTile
                key={item.id}
                item={item}
                index={index}
                favorite={favorites.has(item.id)}
                onFavorite={() => toggleFavorite(item.id)}
                onOpen={() => setSelectedId(item.id)}
              />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-[2rem] border border-dashed border-[#a9723d]/30 bg-white/35 py-20 text-center text-black/50">
            {t("Nincs a keresésnek megfelelő kép.")}
          </div>
        )}

        {visibleCount < filteredItems.length && (
          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={() => setVisibleCount((count) => count + 24)}
              className="inline-flex h-14 items-center gap-3 rounded-full bg-[#252820] px-8 text-sm font-black uppercase tracking-wide text-white shadow-xl shadow-black/15 transition hover:-translate-y-0.5 hover:bg-[#3b4033]"
            >
              {t("További képek")} <ArrowDown size={18} />
            </button>
            <p className="mt-3 text-xs text-black/40">
              {t(`${Math.min(visibleCount, filteredItems.length)} / ${filteredItems.length} megjelenítve`)}
            </p>
          </div>
        )}
      </div>

      {selectedItem && (
        <GalleryLightbox
          item={selectedItem}
          position={selectedIndex + 1}
          total={filteredItems.length}
          favorite={favorites.has(selectedItem.id)}
          onFavorite={() => toggleFavorite(selectedItem.id)}
          onClose={() => setSelectedId(null)}
          onPrevious={showPrevious}
          onNext={showNext}
        />
      )}
    </section>
  );
}

function GalleryTile({
  item,
  index,
  favorite,
  onFavorite,
  onOpen,
}: {
  item: GalleryItem;
  index: number;
  favorite: boolean;
  onFavorite: () => void;
  onOpen: () => void;
}) {
  const { locale, t } = useLanguage();
  const title = locale === "hu" ? item.titleHu : item.titleRo;
  return (
    <article
      className="mobile-reveal group relative mb-2.5 break-inside-avoid overflow-hidden rounded-[1.05rem] bg-white shadow-lg shadow-[#775331]/8 min-[540px]:mb-4 min-[540px]:rounded-[1.35rem]"
      data-scroll-speed={index % 2 === 0 ? "7" : "-7"}
    >
      <button
        type="button"
        onClick={onOpen}
        className="relative block w-full overflow-hidden text-left"
        style={{ aspectRatio: `${item.width} / ${item.height}` }}
        aria-label={`${title} ${t("megnyitása")}`}
      >
        <Image
          src={item.src}
          alt={title}
          fill
          unoptimized
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-[1.025]"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-[#211d17]/75 via-transparent to-black/5 opacity-65 transition duration-300 group-hover:opacity-90" />
        <span className="absolute bottom-0 left-0 right-0 p-3 text-white transition duration-300 min-[540px]:translate-y-2 min-[540px]:p-5 min-[540px]:group-hover:translate-y-0">
          <span className="text-[10px] font-black uppercase tracking-[0.22em] text-white/70">{t(item.category)}</span>
        </span>
        <span className="absolute right-4 top-4 grid h-10 w-10 scale-90 place-items-center rounded-full bg-white/90 text-[#282a23] opacity-0 shadow-lg transition group-hover:scale-100 group-hover:opacity-100">
          <ZoomIn size={18} />
        </span>
      </button>
      <button
        type="button"
        onClick={onFavorite}
        aria-pressed={favorite}
        aria-label={t(favorite ? "Eltávolítás a kedvencekből" : "Hozzáadás a kedvencekhez")}
        className="absolute left-2.5 top-2.5 grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow-lg transition hover:scale-105 min-[540px]:left-4 min-[540px]:top-4 min-[540px]:h-10 min-[540px]:w-10"
      >
        <Heart size={18} className={favorite ? "fill-[#cc7637] text-[#cc7637]" : "text-black/55"} />
      </button>
    </article>
  );
}

function GalleryLightbox({
  item,
  position,
  total,
  favorite,
  onFavorite,
  onClose,
  onPrevious,
  onNext,
}: {
  item: GalleryItem;
  position: number;
  total: number;
  favorite: boolean;
  onFavorite: () => void;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const { locale, t } = useLanguage();
  const touchStartX = useRef<number | null>(null);
  const title = locale === "hu" ? item.titleHu : item.titleRo;
  return (
    <div
      className="fixed inset-0 z-[140] flex items-center justify-center bg-[#594838]/94 p-3 backdrop-blur-md md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={t("Galériakép nagyított nézete")}
      onMouseDown={onClose}
    >
      <div className="relative flex h-full w-full max-w-7xl flex-col" onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex h-14 items-center justify-between text-white">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#e4a55c]">{t(item.category)}</span>
            <span className="ml-3 text-sm text-white/55">{position} / {total}</span>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={onFavorite} className="grid h-11 w-11 place-items-center rounded-full bg-white/10 transition hover:bg-white/20" aria-label={t("Kedvenc megjelölése")}>
              <Heart size={20} className={favorite ? "fill-[#e49a50] text-[#e49a50]" : "text-white"} />
            </button>
            <button type="button" onClick={onClose} className="grid h-11 w-11 place-items-center rounded-full bg-white/10 transition hover:bg-white/20" aria-label={t("Nagyított nézet bezárása")}>
              <X size={22} />
            </button>
          </div>
        </div>

        <div className="relative flex min-h-0 flex-1 items-center justify-center py-3">
          <button type="button" onClick={onPrevious} className="absolute left-0 z-10 grid h-12 w-12 place-items-center rounded-full bg-white/12 text-white backdrop-blur transition hover:bg-white/25 md:left-3" aria-label={t("Előző kép")}>
            <ChevronLeft size={26} />
          </button>
          <div
            className="relative h-full w-full max-w-5xl overflow-hidden rounded-2xl bg-[#d9c7ad]/30 shadow-2xl md:w-[calc(100%-7rem)]"
            onTouchStart={(event) => { touchStartX.current = event.touches[0]?.clientX ?? null; }}
            onTouchEnd={(event) => {
              if (touchStartX.current === null) return;
              const distance = (event.changedTouches[0]?.clientX ?? touchStartX.current) - touchStartX.current;
              touchStartX.current = null;
              if (distance > 45) onPrevious();
              if (distance < -45) onNext();
            }}
          >
            <Image src={item.src} alt={title} fill unoptimized sizes="90vw" className="object-contain" priority />
          </div>
          <button type="button" onClick={onNext} className="absolute right-0 z-10 grid h-12 w-12 place-items-center rounded-full bg-white/12 text-white backdrop-blur transition hover:bg-white/25 md:right-3" aria-label={t("Következő kép")}>
            <ChevronRight size={26} />
          </button>
        </div>

        <div className="flex min-h-16 flex-col items-center justify-center gap-1 text-center text-white">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-white/70">{t(item.category)}</span>
          <span className="text-[10px] text-white/40 md:hidden">{t("Húzd oldalra a képek közötti váltáshoz")}</span>
        </div>
      </div>
    </div>
  );
}
