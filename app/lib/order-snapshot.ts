import { deflateRawSync, inflateRawSync } from "node:zlib";

import type { DeliveryMode, ShippingCountry } from "../cart/pricing";
import type { Locale } from "../i18n/translations";
import type { PricedOrderItem } from "./stripe-order";

const SNAPSHOT_PREFIX = "order_snapshot_";
const SNAPSHOT_CHUNK_SIZE = 450;
const MAX_SNAPSHOT_CHUNKS = 40;

export type OrderSnapshot = {
  version: 1;
  orderNumber: string;
  createdAt: string;
  locale: Locale;
  paymentMethod?: "card" | "transfer" | "cash";
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  delivery: {
    mode: DeliveryMode;
    country: ShippingCountry;
    address: string;
    packetaPointId?: string;
  };
  items: PricedOrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  currency: "RON";
};

export function encodeOrderSnapshot(snapshot: OrderSnapshot) {
  const compressed = deflateRawSync(JSON.stringify(snapshot)).toString("base64");
  const chunks = compressed.match(new RegExp(`.{1,${SNAPSHOT_CHUNK_SIZE}}`, "g")) ?? [];

  if (chunks.length === 0 || chunks.length > MAX_SNAPSHOT_CHUNKS) {
    throw new Error("A rendelés részletei túl nagyok a biztonságos továbbításhoz.");
  }

  return Object.fromEntries(
    chunks.map((chunk, index) => [
      `${SNAPSHOT_PREFIX}${index.toString().padStart(2, "0")}`,
      chunk,
    ]),
  );
}

export function decodeOrderSnapshot(
  metadata: Record<string, string> | null | undefined,
): OrderSnapshot | null {
  if (!metadata) return null;

  const chunks = Object.entries(metadata)
    .filter(([key]) => key.startsWith(SNAPSHOT_PREFIX))
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([, value]) => value);

  if (chunks.length === 0) return null;

  const snapshot = JSON.parse(
    inflateRawSync(Buffer.from(chunks.join(""), "base64")).toString("utf8"),
  ) as OrderSnapshot;

  if (
    snapshot.version !== 1 ||
    !snapshot.orderNumber ||
    !snapshot.customer?.name ||
    !Array.isArray(snapshot.items)
  ) {
    throw new Error("A Stripe rendelési pillanatképe érvénytelen.");
  }

  return snapshot;
}
