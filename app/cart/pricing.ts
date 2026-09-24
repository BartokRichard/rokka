export const EASYBOX_SHIPPING_FEE = 18;
export const HOME_SHIPPING_FEE = 24;
export const COURIER_SHIPPING_FEE = 25;
export const PACKETA_HU_SHIPPING_FEE = 35;
export const FREE_SHIPPING_THRESHOLD = 450;

export type DeliveryMode = "easybox" | "home" | "courier" | "pickup" | "packeta";
export type ShippingCountry = "ro" | "hu";

export function getShippingFee(
  subtotal: number,
  deliveryMode: DeliveryMode = "easybox",
) {
  if (deliveryMode === "pickup") return 0;

  if (deliveryMode !== "packeta" && subtotal >= FREE_SHIPPING_THRESHOLD) return 0;

  if (deliveryMode === "easybox") return EASYBOX_SHIPPING_FEE;
  if (deliveryMode === "courier") return COURIER_SHIPPING_FEE;
  if (deliveryMode === "packeta") return PACKETA_HU_SHIPPING_FEE;

  return HOME_SHIPPING_FEE;
}
