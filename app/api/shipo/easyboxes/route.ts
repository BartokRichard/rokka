import { NextRequest } from "next/server";

import { shipoFetch } from "../../../lib/shipo";

export type ShipoEasybox = {
  id: number;
  name: string;
  county: string;
  city: string;
  postal_code: string;
  address: string;
  lat: number;
  lng: number;
  opening_hours?: string;
};

type ShipoPointsResponse = {
  success: boolean;
  data?: ShipoEasybox[];
  message?: string;
};

const SAMEDAY_LOCKER_TO_LOCKER_RATE_ID = 7;

export async function GET(request: NextRequest) {
  const city = request.nextUrl.searchParams.get("city")?.trim() ?? "";
  const county = request.nextUrl.searchParams.get("county")?.trim() ?? "";
  const lat = Number(request.nextUrl.searchParams.get("lat"));
  const lng = Number(request.nextUrl.searchParams.get("lng"));
  if (city.length < 2 || city.length > 100) {
    return Response.json({ message: "Érvénytelen település." }, { status: 400 });
  }

  try {
    const params = new URLSearchParams({
      rate_id: String(SAMEDAY_LOCKER_TO_LOCKER_RATE_ID),
      party: "recipient",
      ...(Number.isFinite(lat) && Number.isFinite(lng)
        ? { coord: `${lat},${lng}`, radius: "40" }
        : { city }),
      max_results: "250",
    });
    const result = await shipoFetch<ShipoPointsResponse>(`/points?${params}`);
    if (!result.success) throw new Error(result.message ?? "Sikertelen lekérdezés.");

    const normalize = (value: string) =>
      value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/gi, "")
        .toLowerCase();
    const normalizedCity = normalize(city);
    const normalizedCounty = normalize(county);
    const easyboxes = (result.data ?? []).filter((point) => {
      const isEasybox = point.name.toLocaleLowerCase("ro").includes("easybox");
      const isBucharest =
        normalizedCity === "bucuresti" && normalize(point.county) === "bucuresti";
      const isSameCity = normalize(point.city) === normalizedCity;
      const isSameCountyAndCity =
        normalize(point.county) === normalizedCounty &&
        normalize(point.city).includes(normalizedCity);
      return isEasybox && (isBucharest || isSameCity || isSameCountyAndCity);
    });
    return Response.json(easyboxes);
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : "Ismeretlen hiba." },
      { status: 502 },
    );
  }
}
