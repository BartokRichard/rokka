export const PAYMENT_TEST_PRODUCT_ID = "stripe-payment-test";
export const PAYMENT_TEST_PRODUCT_PRICE = 2;

export const PAYMENT_TEST_PRODUCT = {
  productId: PAYMENT_TEST_PRODUCT_ID,
  productName: "Stripe fizetési teszt",
  subtitle: "Ideiglenes teszttermék – nincs szállítás",
  sampleImage: "/images/logo_trans.png",
  materialName: "Teszt",
  colors: [],
  size: "–",
  unitPrice: PAYMENT_TEST_PRODUCT_PRICE,
  currency: "ron",
};

export function isPaymentTestOrder(
  items: ReadonlyArray<{ productId: string }>,
) {
  return (
    items.length > 0 &&
    items.every((item) => item.productId === PAYMENT_TEST_PRODUCT_ID)
  );
}
