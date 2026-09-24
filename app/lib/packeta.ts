import type { Locale } from "../i18n/translations";

export const PACKETA_WIDGET_OPTIONS = {
  country: "hu",
  vendors: [
    { country: "hu" },
    { country: "hu", group: "zbox" },
  ],
} as const;

export type PacketaPointIdentity = {
  id: string;
};

export type ValidatedPacketaPoint = PacketaPointIdentity & {
  name: string;
  street: string;
  city: string;
  zip: string;
  country: "hu";
  group?: string;
};

type PacketaValidationResponse = {
  isValid?: boolean;
  point?: {
    name?: string;
    address?: {
      street?: string;
      city?: string;
      zip?: string;
      country?: string;
    };
    group?: string;
  };
  errors?: Array<{ description?: string }>;
};

export function getPacketaApiKey() {
  const apiKey = process.env.PACKETA_API_KEY?.trim();
  if (!apiKey) throw new Error("A PACKETA_API_KEY nincs beállítva.");
  return apiKey;
}

export async function validatePacketaPoint(
  point: PacketaPointIdentity | null | undefined,
  locale: Locale,
): Promise<ValidatedPacketaPoint> {
  const id = typeof point?.id === "string" ? point.id.trim().slice(0, 80) : "";
  if (!id) throw new Error("Hiányzó Packeta átvételi pont.");

  const response = await fetch(
    "https://widget.packeta.com/v6/pps/api/widget/v1/validate",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Language": locale,
      },
      body: JSON.stringify({
        apiKey: getPacketaApiKey(),
        point: { id },
        options: PACKETA_WIDGET_OPTIONS,
      }),
      cache: "no-store",
    },
  );

  const result = (await response.json().catch(() => null)) as
    | PacketaValidationResponse
    | null;

  if (!response.ok || !result?.isValid || !result.point?.address) {
    const detail = result?.errors?.[0]?.description;
    throw new Error(detail || "A Packeta átvételi pont nem érvényes.");
  }

  const address = result.point.address;
  if (address.country?.toLowerCase() !== "hu") {
    throw new Error("A kiválasztott Packeta pont nem magyarországi.");
  }

  const name = result.point.name?.trim();
  const street = address.street?.trim();
  const city = address.city?.trim();
  const zip = address.zip?.trim();
  if (!name || !street || !city || !zip) {
    throw new Error("A Packeta pont címadatai hiányosak.");
  }

  return {
    id,
    name,
    street,
    city,
    zip,
    country: "hu",
    group: result.point.group,
  };
}
