"use client";

import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  List,
  LocateFixed,
  MapPinned,
  MapPin,
  Navigation,
  PackageOpen,
  Search,
  X,
} from "lucide-react";
import { useLanguage } from "../i18n/LanguageProvider";
import EasyboxMap from "./EasyboxMap";

export type SelectedEasybox = {
  id: number;
  name: string;
  county: string;
  city: string;
  postal_code: string;
  address: string;
  lat: number;
  lng: number;
};

type City = {
  id: number;
  label: string;
  value: string;
  county: string;
  lat: number;
  lng: number;
};

export default function ShipoEasyboxPicker({
  value,
  onSelect,
}: {
  value: SelectedEasybox | null;
  onSelect: (selection: SelectedEasybox) => void;
}) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [cityQuery, setCityQuery] = useState("");
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [easyboxes, setEasyboxes] = useState<SelectedEasybox[]>([]);
  const [preview, setPreview] = useState<SelectedEasybox | null>(null);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingEasyboxes, setLoadingEasyboxes] = useState(false);
  const [mobilePane, setMobilePane] = useState<"list" | "map">("list");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  useEffect(() => {
    if (!open || selectedCity || cityQuery.trim().length < 2) {
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoadingCities(true);
      setError("");
      try {
        const response = await fetch(
          `/api/shipo/cities?term=${encodeURIComponent(cityQuery.trim())}`,
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error("A városlista jelenleg nem tölthető be.");
        setCities((await response.json()) as City[]);
      } catch (fetchError) {
        if (fetchError instanceof DOMException && fetchError.name === "AbortError") return;
        setError("A városlista jelenleg nem tölthető be.");
      } finally {
        setLoadingCities(false);
      }
    }, 300);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [cityQuery, open, selectedCity]);

  const chooseCity = async (city: City) => {
    setSelectedCity(city);
    setCityQuery(city.label);
    setCities([]);
    setEasyboxes([]);
    setPreview(null);
    setMobilePane("list");
    setLoadingEasyboxes(true);
    setError("");
    try {
      const response = await fetch(
        `/api/shipo/easyboxes?${new URLSearchParams({
          city: city.value,
          county: city.county,
          lat: String(city.lat),
          lng: String(city.lng),
        })}`,
      );
      if (!response.ok) throw new Error("Az Easybox-lista jelenleg nem tölthető be.");
      const points = (await response.json()) as SelectedEasybox[];
      setEasyboxes(points);
      setPreview(points[0] ?? null);
      if (points.length === 0) setError("Ebben a városban nem találtunk Easybox automatát.");
    } catch {
      setError("Az Easybox-lista jelenleg nem tölthető be.");
    } finally {
      setLoadingEasyboxes(false);
    }
  };

  const resetCity = () => {
    setSelectedCity(null);
    setCityQuery("");
    setEasyboxes([]);
    setPreview(null);
    setMobilePane("list");
    setError("");
  };

  return (
    <div>
      <span className="font-barlow text-sm font-black uppercase tracking-[0.18em]">
        {t("Easybox automata")}
      </span>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 flex min-h-20 w-full items-center gap-4 rounded-2xl border border-black/10 bg-white px-5 py-4 text-left font-barlow transition hover:border-[#d99a4d]"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2ca66f]/12 text-[#23855a]">
          {value ? <PackageOpen size={22} /> : <MapPin size={22} />}
        </span>
        <span className="min-w-0 flex-1">
          {value ? (
            <>
              <strong className="block text-sm font-black">{value.name}</strong>
              <span className="mt-1 block text-sm leading-snug text-black/55">
                {value.address}, {value.city}, {value.county}
              </span>
            </>
          ) : (
            <>
              <strong className="block text-sm font-bold">{t("Válassz Easybox automatát")}</strong>
              <span className="mt-1 block text-xs text-black/50">{t("Város és átvételi hely kiválasztása")}</span>
            </>
          )}
        </span>
        <ChevronRight size={20} className="shrink-0 text-black/35" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#674b37]/55 p-3 backdrop-blur-sm md:p-7"
          role="dialog"
          aria-modal="true"
          aria-label={t("Easybox automata kiválasztása")}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div className="flex h-[calc(100dvh-1rem)] w-full max-w-6xl min-w-0 flex-col overflow-hidden rounded-[22px] bg-[#f7f4ef] shadow-2xl md:h-[min(850px,94vh)] md:rounded-[28px]">
            <header className="flex min-w-0 items-center justify-between gap-3 border-b border-black/10 bg-white px-4 py-3.5 md:px-7 md:py-4">
              <div className="min-w-0">
                <p className="font-barlow text-[10px] font-black uppercase tracking-[0.22em] text-[#d99a4d]">{t("Szállítás")}</p>
                <h2 className="mt-1 break-words font-barlow-condensed text-[clamp(1.65rem,8vw,1.875rem)] font-bold uppercase leading-[0.95]">{t("Easybox kiválasztása")}</h2>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white transition hover:border-[#d99a4d]" aria-label={t("Bezárás")}>
                <X size={21} />
              </button>
            </header>

            {selectedCity && preview && (
              <div className="grid grid-cols-2 gap-1 border-b border-black/10 bg-white p-2 md:hidden">
                <button type="button" onClick={() => setMobilePane("list")} className={`flex h-10 items-center justify-center gap-2 rounded-xl font-barlow text-sm font-bold transition ${mobilePane === "list" ? "bg-[#1f1d1a] text-white" : "bg-[#f4eee5] text-black/60"}`}>
                  <List size={17} /> {t("Lista")}
                </button>
                <button type="button" onClick={() => setMobilePane("map")} className={`flex h-10 items-center justify-center gap-2 rounded-xl font-barlow text-sm font-bold transition ${mobilePane === "map" ? "bg-[#1f1d1a] text-white" : "bg-[#f4eee5] text-black/60"}`}>
                  <MapPinned size={17} /> {t("Térkép")}
                </button>
              </div>
            )}

            <div className="grid min-h-0 flex-1 md:grid-cols-[390px_minmax(0,1fr)]">
              <section className={`${mobilePane === "list" ? "flex" : "hidden"} min-h-0 min-w-0 flex-col border-r border-black/10 bg-white p-4 md:flex md:p-6`}>
                {selectedCity && (
                  <button type="button" onClick={resetCity} className="mb-3 flex items-center gap-1 self-start font-barlow text-sm font-bold text-[#c77720]">
                    <ChevronLeft size={17} /> {t("Másik város")}
                  </button>
                )}
                <label className="relative block">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/35" size={19} />
                  <input
                    value={cityQuery}
                    onChange={(event) => {
                      setSelectedCity(null);
                      setCities([]);
                      setCityQuery(event.target.value);
                    }}
                    placeholder={t("Keress várost Romániában…")}
                    autoFocus
                    className="h-14 w-full rounded-2xl border border-black/10 bg-[#fafafa] pl-12 pr-11 font-barlow font-semibold outline-none transition focus:border-[#d99a4d]"
                  />
                  {(loadingCities || loadingEasyboxes) && <LoaderCircle className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-[#d99a4d]" size={19} />}
                </label>

                <div className="mt-4 min-h-0 flex-1 overflow-y-auto">
                  {!selectedCity && cities.map((city) => (
                    <button key={city.id} type="button" onClick={() => chooseCity(city)} className="flex w-full items-center justify-between border-b border-black/7 px-2 py-4 text-left font-barlow transition hover:bg-[#f4eee5]">
                      <span><strong className="block text-sm">{city.value}</strong><span className="mt-1 block text-xs text-black/50">{t(`${city.county} megye`)}</span></span>
                      <ChevronRight size={18} className="text-black/30" />
                    </button>
                  ))}

                  {selectedCity && easyboxes.map((point) => (
                    <button key={point.id} type="button" onClick={() => { setPreview(point); setMobilePane("map"); }} className={["mb-3 w-full min-w-0 rounded-2xl border p-4 text-left font-barlow transition", preview?.id === point.id ? "border-[#d99a4d] bg-[#d99a4d]/10" : "border-black/10 hover:border-[#d99a4d]"].join(" ")}>
                      <strong className="block text-sm">{point.name}</strong>
                      <span className="mt-1 block text-xs leading-relaxed text-black/55">{point.address}</span>
                    </button>
                  ))}

                  {!selectedCity && cityQuery.trim().length < 2 && (
                    <p className="px-2 py-6 text-center font-barlow text-sm text-black/45">{t("Írd be a város nevének legalább két betűjét.")}</p>
                  )}
                  {error && <p className="rounded-xl bg-red-50 px-4 py-3 font-barlow text-sm font-semibold text-red-700">{t(error)}</p>}
                </div>
              </section>

              <section className={`${mobilePane === "map" ? "block" : "hidden"} relative h-full min-h-0 min-w-0 overflow-hidden bg-[#e8e6df] md:block`}>
                {preview ? (
                  <>
                    <EasyboxMap
                      points={easyboxes}
                      selectedId={preview.id}
                      onPreview={setPreview}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_42%,rgba(35,31,27,.10)_100%)]" />

                    <div className="pointer-events-none absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/70 bg-white/88 px-3.5 py-2 font-barlow text-xs font-bold text-black/65 shadow-[0_8px_24px_rgba(38,32,25,.10)] backdrop-blur-md">
                      <LocateFixed size={15} className="text-[#c77720]" />
                      {preview.city}
                    </div>
                    <a
                      href={`https://www.openstreetmap.org/?mlat=${preview.lat}&mlon=${preview.lng}#map=17/${preview.lat}/${preview.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/90 text-black/60 shadow-[0_8px_24px_rgba(38,32,25,.12)] backdrop-blur-md transition hover:bg-white hover:text-[#c77720]"
                      aria-label={t("Megnyitás nagy térképen")}
                      title={t("Megnyitás nagy térképen")}
                    >
                      <Navigation size={17} />
                    </a>
                  </>
                ) : (
                  <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_center,#f7f3eb_0%,#e7e3da_100%)] px-8 text-center font-barlow text-black/40"><div className="max-w-xs"><span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-black/5 bg-white/70 shadow-sm"><MapPin size={27} className="text-[#c77720]" /></span><p className="font-semibold text-black/50">{t("Válassz várost, majd egy Easybox automatát.")}</p><p className="mt-1 text-xs text-black/35">{t("A kiválasztott pont itt jelenik meg a térképen.")}</p></div></div>
                )}
                {preview && (
                  <div className="absolute inset-x-5 bottom-5 z-20 hidden rounded-[22px] border border-white/70 bg-white/92 p-2.5 pl-5 shadow-[0_18px_50px_rgba(45,37,29,.18)] backdrop-blur-xl md:block">
                    <div className="flex items-center gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#d98735]/12 text-[#c77720]">
                        <PackageOpen size={20} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <strong className="block truncate font-barlow text-[15px]">{preview.name}</strong>
                        <span className="mt-0.5 block truncate font-barlow text-xs text-black/50">{preview.address}, {preview.city}</span>
                      </span>
                      <button type="button" onClick={() => { onSelect(preview); setOpen(false); }} className="h-11 shrink-0 rounded-2xl bg-[#1f1d1a] px-5 font-barlow text-sm font-bold text-white shadow-sm transition hover:bg-[#c77720]">{t("Kiválasztom")}</button>
                    </div>
                  </div>
                )}
              </section>
            </div>

            {preview && mobilePane === "map" && (
              <div className="border-t border-black/10 bg-white p-4 md:hidden">
                <strong className="font-barlow text-sm">{preview.name}</strong>
                <p className="mt-1 font-barlow text-xs text-black/55">{preview.address}</p>
                <button type="button" onClick={() => { onSelect(preview); setOpen(false); }} className="mt-3 h-11 w-full rounded-full bg-[#8f592d] font-barlow text-sm font-bold text-white">{t("Ezt az automatát választom")}</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
