"use client";

import type { LayerGroup, Map as LeafletMap, Marker } from "leaflet";
import { useEffect, useRef, useState } from "react";
import type { SelectedEasybox } from "./ShipoEasyboxPicker";

function validPoint(point: SelectedEasybox) {
  return Number.isFinite(point.lat) && Number.isFinite(point.lng);
}

export default function EasyboxMap({
  points,
  selectedId,
  onPreview,
}: {
  points: SelectedEasybox[];
  selectedId: number | null;
  onPreview: (point: SelectedEasybox) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const layerRef = useRef<LayerGroup | null>(null);
  const markersRef = useRef(new Map<number, Marker>());
  const leafletRef = useRef<typeof import("leaflet") | null>(null);
  const onPreviewRef = useRef(onPreview);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    onPreviewRef.current = onPreview;
  }, [onPreview]);

  useEffect(() => {
    let cancelled = false;
    const markers = markersRef.current;

    void import("leaflet").then((L) => {
      if (cancelled || !containerRef.current || mapRef.current) return;

      leafletRef.current = L;
      const map = L.map(containerRef.current, {
        zoomControl: true,
        attributionControl: true,
      });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      mapRef.current = map;
      layerRef.current = L.layerGroup().addTo(map);
      setReady(true);
      window.setTimeout(() => map.invalidateSize(), 0);
    });

    return () => {
      cancelled = true;
      markers.clear();
      layerRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
      leafletRef.current = null;
    };
  }, []);

  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!ready || !L || !map || !layer) return;

    layer.clearLayers();
    markersRef.current.clear();
    const visiblePoints = points.filter(validPoint);

    for (const point of visiblePoints) {
      const marker = L.marker([point.lat, point.lng], {
        icon: markerIcon(L, false),
        keyboard: true,
        title: point.name,
      }).addTo(layer);

      const tooltip = document.createElement("div");
      tooltip.className = "font-barlow text-xs font-bold";
      tooltip.textContent = point.name;
      marker.bindTooltip(tooltip, { direction: "top", offset: [0, -20] });
      marker.on("click", () => onPreviewRef.current(point));
      markersRef.current.set(point.id, marker);
    }

    if (visiblePoints.length === 1) {
      map.setView([visiblePoints[0].lat, visiblePoints[0].lng], 16);
    } else if (visiblePoints.length > 1) {
      map.fitBounds(
        L.latLngBounds(visiblePoints.map((point) => [point.lat, point.lng])),
        { padding: [48, 48], maxZoom: 15 },
      );
    }

    window.setTimeout(() => map.invalidateSize(), 0);
  }, [points, ready]);

  useEffect(() => {
    const L = leafletRef.current;
    if (!ready || !L) return;

    for (const [id, marker] of markersRef.current) {
      const selected = id === selectedId;
      marker.setIcon(markerIcon(L, selected));
      marker.setZIndexOffset(selected ? 1000 : 0);
      if (selected) marker.openTooltip();
      else marker.closeTooltip();
    }
  }, [ready, selectedId]);

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="easybox-map h-full w-full" />
      {!ready && (
        <div className="absolute inset-0 grid place-items-center bg-[#e8e6df] font-barlow text-sm font-semibold text-black/45">
          Térkép betöltése…
        </div>
      )}
    </div>
  );
}

function markerIcon(L: typeof import("leaflet"), selected: boolean) {
  return L.divIcon({
    className: "easybox-map-marker",
    html: `<span class="easybox-map-pin${selected ? " is-selected" : ""}"><span class="easybox-map-pin-dot"></span></span>`,
    iconSize: [42, 48],
    iconAnchor: [21, 45],
    tooltipAnchor: [0, -30],
  });
}
