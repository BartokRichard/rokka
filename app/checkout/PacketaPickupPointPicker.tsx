"use client";

import { useState } from "react";
import Script from "next/script";
import {
  ChevronRight,
  LoaderCircle,
  MapPin,
  PackageCheck,
} from "lucide-react";

import { useLanguage } from "../i18n/LanguageProvider";

export type SelectedPacketaPoint = {
  id: string;
  name: string;
  country: string;
  place: string;
  street: string;
  city: string;
  zip: string;
  group?: string;
  gps?: { lat: number; lon: number };
};

type PacketaWidgetPoint = Omit<SelectedPacketaPoint, "id"> & {
  id?: string;
};

type PacketaWindow = Window & {
  Packeta?: {
    Widget: {
      pick: (
        apiKey: string,
        callback: (point: PacketaWidgetPoint | null) => void,
        options: Record<string, unknown>,
      ) => void;
    };
  };
};

export default function PacketaPickupPointPicker({
  value,
  onSelect,
}: {
  value: SelectedPacketaPoint | null;
  onSelect: (selection: SelectedPacketaPoint) => void;
}) {
  const { locale, t } = useLanguage();
  const [scriptReady, setScriptReady] = useState(false);
  const [opening, setOpening] = useState(false);
  const [error, setError] = useState("");

  const openPicker = async () => {
    if (!scriptReady || opening) return;

    setOpening(true);
    setError("");
    try {
      const response = await fetch("/api/packeta/config", { cache: "no-store" });
      const result = (await response.json()) as {
        apiKey?: string;
        message?: string;
      };
      if (!response.ok || !result.apiKey) {
        throw new Error(result.message || "A Packeta integráció nem érhető el.");
      }

      const packeta = (window as PacketaWindow).Packeta;
      if (!packeta) throw new Error("A Packeta választó nem töltődött be.");

      packeta.Widget.pick(
        result.apiKey,
        (point) => {
          setOpening(false);
          if (!point) return;

          if (!point.id || point.country.toLowerCase() !== "hu") {
            setError("Csak magyarországi Packeta pont választható.");
            return;
          }

          onSelect({ ...point, id: point.id });
        },
        {
          country: "hu",
          language: locale,
          vendors: [
            { country: "hu" },
            { country: "hu", group: "zbox" },
          ],
          webUrl: window.location.origin,
          appIdentity: "rokka-nextjs",
        },
      );
    } catch (pickerError) {
      setOpening(false);
      setError(
        pickerError instanceof Error
          ? pickerError.message
          : "A Packeta választó nem nyitható meg.",
      );
    }
  };

  return (
    <div>
      <Script
        id="packeta-widget"
        src="https://widget.packeta.com/v6/www/js/library.js"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
        onError={() => setError("A Packeta választó nem töltődött be.")}
      />

      <span className="font-barlow text-sm font-black uppercase tracking-[0.18em]">
        {t("Packeta átvételi pont")}
      </span>
      <button
        type="button"
        onClick={openPicker}
        disabled={!scriptReady || opening}
        className="mt-3 flex min-h-20 w-full items-center gap-4 rounded-2xl border border-black/10 bg-white px-5 py-4 text-left font-barlow transition hover:border-[#d99a4d] disabled:cursor-wait disabled:opacity-60"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#ba282f]/10 text-[#a61f25]">
          {opening ? (
            <LoaderCircle className="animate-spin" size={22} />
          ) : value ? (
            <PackageCheck size={22} />
          ) : (
            <MapPin size={22} />
          )}
        </span>
        <span className="min-w-0 flex-1">
          {value ? (
            <>
              <strong className="block text-sm font-black">{value.name}</strong>
              <span className="mt-1 block text-sm leading-snug text-black/55">
                {value.zip} {value.city}, {value.street}
              </span>
            </>
          ) : (
            <>
              <strong className="block text-sm font-bold">
                {t(scriptReady ? "Válassz Packeta pontot vagy Z-BOX-ot" : "Packeta választó betöltése…")}
              </strong>
              <span className="mt-1 block text-xs text-black/50">
                {t("Magyarországi lista és térkép megnyitása")}
              </span>
            </>
          )}
        </span>
        <ChevronRight size={20} className="shrink-0 text-black/35" />
      </button>

      {error && (
        <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 font-barlow text-sm font-semibold text-red-700">
          {t(error)}
        </p>
      )}
    </div>
  );
}
