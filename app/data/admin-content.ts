import rawContent from "./admin-content.json";

export const GALLERY_CATEGORIES = ["Női", "Férfi", "Gyerek", "Részletek", "Műhely", "Visszajelzés"] as const;
export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

export type GalleryItem = {
  id: string;
  src: string;
  titleHu: string;
  titleRo: string;
  category: GalleryCategory;
  enabled: boolean;
  order: number;
  width: number;
  height: number;
  originalName?: string;
};

export type ProductPriceOverride = {
  materials?: Record<string, number>;
  variants?: Record<string, number>;
  sizes?: Record<string, Record<string, number>>;
};

export type AdminContent = {
  version: number;
  gallery: GalleryItem[];
  priceOverrides: Record<string, ProductPriceOverride>;
};

export const ADMIN_CONTENT = rawContent as AdminContent;

export function isAdminContent(value: unknown): value is AdminContent {
  if (!value || typeof value !== "object") return false;
  const content = value as Partial<AdminContent>;
  if (content.version !== 1 || !Array.isArray(content.gallery)) return false;
  if (!content.priceOverrides || typeof content.priceOverrides !== "object") return false;
  if (content.gallery.length > 500) return false;

  const galleryIsValid = content.gallery.every((item) =>
    item &&
    typeof item.id === "string" && item.id.length <= 100 &&
    typeof item.src === "string" && item.src.startsWith("/images/collection/") &&
    typeof item.titleHu === "string" && item.titleHu.length <= 160 &&
    typeof item.titleRo === "string" && item.titleRo.length <= 160 &&
    GALLERY_CATEGORIES.includes(item.category) &&
    typeof item.enabled === "boolean" &&
    Number.isInteger(item.order) &&
    Number.isInteger(item.width) && item.width > 0 &&
    Number.isInteger(item.height) && item.height > 0,
  );
  if (!galleryIsValid || new Set(content.gallery.map((item) => item.id)).size !== content.gallery.length) return false;

  const priceIsValid = (price: unknown) => typeof price === "number" && Number.isInteger(price) && price > 0 && price < 100000;
  const priceMapsAreValid = (maps: unknown): maps is Record<string, number> =>
    Boolean(maps && typeof maps === "object" && Object.keys(maps).length <= 200 && Object.values(maps).every(priceIsValid));

  return Object.entries(content.priceOverrides).length <= 100 && Object.values(content.priceOverrides).every((override) => {
    if (!override || typeof override !== "object") return false;
    if (override.materials && !priceMapsAreValid(override.materials)) return false;
    if (override.variants && !priceMapsAreValid(override.variants)) return false;
    return !override.sizes || (
      typeof override.sizes === "object" &&
      Object.keys(override.sizes).length <= 50 &&
      Object.values(override.sizes).every(priceMapsAreValid)
    );
  });
}
