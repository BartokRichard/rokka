import { NextRequest } from "next/server";

import { shipoFetch } from "../../../lib/shipo";

type ShipoCityResponse = Record<
  string,
  {
    name: string;
    zipcode?: string;
    coord?: { lat: string; lng: string };
  }
>;

type City = {
  id: number;
  label: string;
  value: string;
  county: string;
  lat: number;
  lng: number;
};

export async function GET(request: NextRequest) {
  const term = request.nextUrl.searchParams.get("term")?.trim() ?? "";
  if (term.length < 2 || term.length > 100) return Response.json([]);

  try {
    const result = await shipoFetch<ShipoCityResponse>(
      `/city?term=${encodeURIComponent(term)}`,
    );
    const cities: City[] = Object.entries(result).map(([id, city]) => {
      const [name, county = ""] = city.name.split(",").map((part) => part.trim());
      return {
        id: Number(id),
        label: city.name,
        value: name,
        county,
        lat: Number(city.coord?.lat ?? 0),
        lng: Number(city.coord?.lng ?? 0),
      };
    });
    return Response.json(cities.slice(0, 20));
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : "Ismeretlen hiba." },
      { status: 502 },
    );
  }
}
