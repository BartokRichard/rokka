import type { CartItem } from "../cart/CartProvider";
import { DeliveryMode, getShippingFee } from "../cart/pricing";
import { getColorOptionsForPart, PRODUCTS } from "../data/products";
import {
  isPaymentTestOrder,
  PAYMENT_TEST_PRODUCT_ID,
  PAYMENT_TEST_PRODUCT_PRICE,
} from "./payment-test-product";
import { Locale, translate } from "../i18n/translations";

export type StripeOrderItem = Pick<
  CartItem,
  | "productId"
  | "materialName"
  | "variantId"
  | "earId"
  | "colors"
  | "size"
  | "height"
  | "bust"
  | "quantity"
>;

export type PricedOrderItem = {
  productId: string;
  name: string;
  description: string;
  material: string;
  variant?: string;
  ear?: string;
  size: string;
  height?: string;
  bust?: string;
  colors: Array<{
    part: string;
    selection: string;
    optionId: string;
    hex?: string;
  }>;
  quantity: number;
  unitPrice: number;
};

export function priceStripeOrder(
  rawItems: StripeOrderItem[],
  deliveryMode: DeliveryMode,
  locale: Locale = "hu",
) {
  if (!Array.isArray(rawItems) || rawItems.length === 0 || rawItems.length > 20) {
    throw new Error("Érvénytelen kosár.");
  }

  const items = rawItems.map((item) => priceItem(item, locale));
  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );
  const shippingFee = isPaymentTestOrder(rawItems)
    ? 0
    : getShippingFee(subtotal, deliveryMode);

  return {
    items,
    subtotal,
    shippingFee,
    total: subtotal + shippingFee,
  };
}

function priceItem(rawItem: StripeOrderItem, locale: Locale): PricedOrderItem {
  const quantity = Number(rawItem.quantity);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
    throw new Error("Érvénytelen mennyiség.");
  }

  if (rawItem.productId === PAYMENT_TEST_PRODUCT_ID) {
    if (process.env.NEXT_PUBLIC_ENABLE_PAYMENT_TEST_PRODUCT !== "true") {
      throw new Error("A fizetési teszttermék nincs engedélyezve.");
    }

    return {
      productId: PAYMENT_TEST_PRODUCT_ID,
      name: translate("Stripe fizetési teszt", locale),
      description: translate("Ideiglenes teszttermék – nincs szállítás", locale),
      material: "–",
      size: "–",
      colors: [],
      quantity,
      unitPrice: PAYMENT_TEST_PRODUCT_PRICE,
    };
  }

  const product = PRODUCTS.find((candidate) => candidate.id === rawItem.productId);
  if (!product) throw new Error("Ismeretlen termék.");

  const material = product.materialOptions.find(
    (candidate) => candidate.name === rawItem.materialName,
  );
  if (!material) throw new Error("Ismeretlen anyag.");

  const variant = rawItem.variantId
    ? product.variantOptions?.find((candidate) => candidate.id === rawItem.variantId)
    : undefined;
  if (rawItem.variantId && !variant) throw new Error("Ismeretlen változat.");

  const ear = rawItem.earId
    ? product.earOptions?.find((candidate) => candidate.id === rawItem.earId)
    : undefined;
  if (rawItem.earId && !ear) throw new Error("Ismeretlen fülváltozat.");

  const unitPrice =
    variant?.price ?? material.price ?? product.sizePrices?.[material.name]?.[rawItem.size];

  if (!unitPrice || !Number.isInteger(unitPrice) || unitPrice < 1) {
    throw new Error("A termék ára nem határozható meg.");
  }

  const suffix = variant?.name ?? ear?.name;
  const size = cleanOptional(rawItem.size, 40) ?? "–";
  const colors = product.colorParts.map((part) => {
    const requestedOption = rawItem.colors?.find(
      (color) => color.partId === part.id,
    )?.optionId;
    const options = getColorOptionsForPart(product, material, part);
    const option =
      options.find((candidate) => candidate.id === requestedOption) ??
      options.find((candidate) => candidate.id === part.defaultColor) ??
      options[0];

    if (!option) throw new Error("A termékszín nem határozható meg.");

    return {
      part: translate(part.label, locale),
      selection: translate(option.label, locale),
      optionId: option.id,
      ...(option.hex ? { hex: option.hex } : {}),
    };
  });

  return {
    productId: product.id,
    name: suffix ? `${product.name} – ${translate(suffix, locale)}` : product.name,
    description: `${translate(material.name, locale)} · ${size}`,
    material: translate(material.name, locale),
    ...(variant ? { variant: translate(variant.name, locale) } : {}),
    ...(ear ? { ear: translate(ear.name, locale) } : {}),
    size,
    ...(cleanOptional(rawItem.height, 30)
      ? { height: cleanOptional(rawItem.height, 30) }
      : {}),
    ...(cleanOptional(rawItem.bust, 30)
      ? { bust: cleanOptional(rawItem.bust, 30) }
      : {}),
    colors,
    quantity,
    unitPrice,
  };
}

function cleanOptional(value: unknown, maximumLength: number) {
  if (typeof value !== "string") return undefined;
  const cleaned = value.trim().slice(0, maximumLength);
  return cleaned || undefined;
}
