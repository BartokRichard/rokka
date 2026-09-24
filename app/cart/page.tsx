"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Minus,
  Pencil,
  Plus,
  RotateCcw,
  ShoppingCart,
  Trash2,
} from "lucide-react";

import CartHeader from "./CartHeader";
import { CartItem, useCart } from "./CartProvider";
import ProductPreview from "../components/ProductPreview";
import { PRODUCTS } from "../data/products";
import {
  EASYBOX_SHIPPING_FEE,
  COURIER_SHIPPING_FEE,
  FREE_SHIPPING_THRESHOLD,
  getShippingFee,
} from "./pricing";
import {
  isPaymentTestOrder,
  PAYMENT_TEST_PRODUCT,
  PAYMENT_TEST_PRODUCT_ID,
} from "../lib/payment-test-product";
import { useLanguage } from "../i18n/LanguageProvider";

export default function CartPage() {
  const { t } = useLanguage();
  const {
    items,
    hydrated,
    itemCount,
    totalPrice,
    addItem,
    updateQuantity,
    removeItem,
  } = useCart();

  const paymentTestOrder = isPaymentTestOrder(items);
  const shippingFee = paymentTestOrder ? 0 : getShippingFee(totalPrice);
  const orderTotal = totalPrice + shippingFee;
  const paymentTestEnabled =
    process.env.NEXT_PUBLIC_ENABLE_PAYMENT_TEST_PRODUCT === "true";
  const addPaymentTestProduct = () => addItem({ ...PAYMENT_TEST_PRODUCT });

  if (!hydrated) {
    return (
      <main className="min-h-screen bg-[#f8f3eb]">
        <CartHeader />
        <div className="flex min-h-[calc(100vh-96px)] items-center justify-center font-barlow text-black/45">
          {t("Kosár betöltése…")}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f3eb] text-[#20221f]">
      <CartHeader />

      <section className="relative overflow-hidden px-5 py-10 md:px-10 lg:px-16 lg:py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_5%,rgba(255,255,255,0.98),rgba(248,243,235,0.76)_48%,rgba(227,155,62,0.08)_100%)]" />

        <div className="relative z-10 mx-auto max-w-[1500px]">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
            <div className="flex items-start gap-5">
              <ShoppingCart
                className="mt-2 hidden text-[#e39b3e]/10 sm:block"
                size={74}
                strokeWidth={1.1}
              />
              <div>
                <h1 className="font-barlow-condensed text-[54px] font-bold uppercase leading-none md:text-[66px]">
                  {t("A kosarad")}
                </h1>
                <p className="mt-1 font-caveat text-2xl text-[#dc8c2d] md:text-[28px]">
                  {t("Ellenőrizd a termékeket, és véglegesítsd a rendelésed.")}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {paymentTestEnabled && (
                <button
                  type="button"
                  onClick={addPaymentTestProduct}
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-emerald-700/25 bg-emerald-50 px-6 font-barlow text-sm font-black text-emerald-800 transition hover:border-emerald-700"
                >
                  + {t("Fizetési teszttermék")} · 2 RON
                </button>
              )}
              {items.length > 0 && (
                <Link
                  href="/configurator"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-black/15 bg-white/60 px-6 font-barlow text-sm font-black transition hover:border-[#e39b3e] hover:text-[#c77720]"
                >
                  {t("+ Új termék tervezése")}
                </Link>
              )}
            </div>
          </div>

          {items.length === 0 ? (
            <EmptyCart
              paymentTestEnabled={paymentTestEnabled}
              onAddPaymentTestProduct={addPaymentTestProduct}
            />
          ) : (
            <div className="grid items-start gap-7 xl:grid-cols-[minmax(0,1fr)_360px]">
              <div className="min-w-0">
                <div className="mb-3 hidden grid-cols-[minmax(0,1fr)_110px_150px_110px_36px] gap-4 px-5 font-barlow text-[10px] font-black uppercase tracking-[0.12em] text-black/55 md:grid">
                  <span>{t("Termék")}</span>
                  <span>{t("Ár")}</span>
                  <span className="text-center">{t("Mennyiség")}</span>
                  <span className="text-right">{t("Összesen")}</span>
                  <span />
                </div>

                <div className="overflow-hidden rounded-[24px] border border-black/10 bg-white/75 shadow-xl shadow-black/5">
                  {items.map((item) => (
                    <CartRow
                      key={item.id}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeItem}
                    />
                  ))}
                </div>

                <Link
                  href="/configurator"
                  className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl border border-black/15 bg-white/45 px-5 font-barlow text-xs font-black uppercase tracking-[0.08em] transition hover:border-[#e39b3e]"
                >
                  <RotateCcw size={15} />
                  {t("Vásárlás folytatása")}
                </Link>
              </div>

              <aside className="rounded-[26px] border border-black/10 bg-white/75 p-6 shadow-xl shadow-black/5 xl:sticky xl:top-5">
                <h2 className="font-barlow-condensed text-[28px] font-bold uppercase leading-none">
                  {t("Rendelés összesítő")}
                </h2>

                <div className="mt-7 space-y-3 border-b border-black/10 pb-5 font-barlow text-sm">
                <div className="flex justify-between gap-4 text-black/70">
                    <span>{t("Részösszeg")} ({t(`${itemCount} termék`)})</span>
                    <strong>{totalPrice} ron</strong>
                  </div>
                  <div className="flex justify-between gap-4 text-black/70">
                    <span>{t("Szállítás")}</span>
                    <strong>
                      {shippingFee === 0 ? t("Ingyenes") : `${shippingFee} ron`}
                    </strong>
                  </div>
                </div>

                <div className="rounded-lg bg-[#eef7eb] px-3 py-2.5 font-barlow text-xs font-semibold text-[#2d7b3a]">
                  {t("450 lej felett én fizetem a küldést")}
                </div>

                <div className="flex items-end justify-between gap-4 py-5">
                  <span className="font-barlow text-sm font-black uppercase tracking-[0.08em]">
                    {t("Összesen")}
                  </span>
                  <span className="font-barlow-condensed text-[36px] font-bold leading-none">
                    {orderTotal} ron
                  </span>
                </div>

                <Link
                  href="/checkout"
                  className="mt-4 flex h-13 w-full items-center justify-center gap-2 rounded-lg bg-[#e99a37] px-5 font-barlow text-sm font-black uppercase text-white shadow-lg shadow-[#e99a37]/20 transition hover:bg-[#cf7f20]"
                >
                  {t("Tovább a pénztárhoz")}
                  <ArrowRight size={17} />
                </Link>

                <div className="mt-6 border-t border-black/10 pt-5 font-barlow">
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-black/45">
                    {t("Szállítási díjak")}
                  </p>
                  <div className="mt-3 space-y-2 text-xs text-black/65">
                    <ShippingRate
                      label="Easybox"
                      price={`${EASYBOX_SHIPPING_FEE} ron`}
                    />
                    <ShippingRate
                      label="Curier"
                      price={`${COURIER_SHIPPING_FEE} ron`}
                    />
                    <ShippingRate
                      label="Személyes átvétel a műhelyből"
                      price="Ingyenes"
                    />
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function CartRow({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: CartItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}) {
  const { t } = useLanguage();
  const colorNames = Array.from(
    new Set(item.colors.map((color) => t(color.optionLabel))),
  );
  const shownColors = colorNames.slice(0, 2).join(" / ");
  const extraColorCount = Math.max(colorNames.length - 2, 0);
  const leadingColor = item.colors[0];
  const product = PRODUCTS.find((candidate) => candidate.id === item.productId);
  const earOption = product?.earOptions?.find(
    (option) => option.id === item.earId || option.name === item.earName,
  );
  const previewSample = earOption?.image ?? item.sampleImage;
  const previewParts = product?.colorParts.map((part) => ({
    ...part,
    mask:
      part.id === "outer"
        ? earOption?.masks?.outer ?? part.mask
        : part.id === "lining"
          ? earOption?.masks?.lining ?? part.mask
          : part.mask,
  }));
  const previewColors = item.colors.map((color) => ({
    id: color.optionId,
    label: color.optionLabel,
    hex: color.hex,
    texture: color.texture,
  }));
  const previewValues = Object.fromEntries(
    item.colors.map((color) => [color.partId, color.optionId]),
  );
  const editHref = `/configurator?edit=${encodeURIComponent(item.id)}`;
  const paymentTestItem = item.productId === PAYMENT_TEST_PRODUCT_ID;

  const preview = product && previewParts ? (
    <ProductPreview
      sampleImage={previewSample}
      colorParts={previewParts}
      colorOptions={previewColors}
      colorValues={previewValues}
    />
  ) : (
    <Image
      src={item.sampleImage}
      alt={item.productName}
      fill
      sizes="112px"
      className="object-contain p-1.5"
    />
  );

  return (
    <article className="grid gap-5 border-b border-black/10 p-4 last:border-b-0 md:grid-cols-[minmax(0,1fr)_110px_150px_110px_36px] md:items-center md:gap-4 md:px-5 md:py-4">
      <div className="grid min-w-0 grid-cols-[92px_minmax(0,1fr)] gap-4 sm:grid-cols-[112px_minmax(0,1fr)]">
        {paymentTestItem ? (
          <div className="relative h-[112px] overflow-hidden rounded-xl bg-[#eee1cf] sm:h-[122px]">
            {preview}
          </div>
        ) : (
          <Link
            href={editHref}
            aria-label={`${t(item.productName)} ${t("szerkesztése")}`}
            className="group relative h-[112px] overflow-hidden rounded-xl bg-[#eee1cf] sm:h-[122px]"
          >
            {preview}
            <span className="absolute bottom-2 right-2 z-50 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-black shadow-sm transition group-hover:bg-[#e39b3e] group-hover:text-white">
              <Pencil size={13} />
            </span>
          </Link>
        )}

        <div className="min-w-0 self-center">
          <h3 className="font-barlow-condensed text-[24px] font-bold uppercase leading-none">
            {t(item.productName)}
          </h3>
          <p className="mt-1 truncate font-barlow text-xs text-black/55">
            {t(item.subtitle)}
          </p>

          <div className="mt-3 space-y-1 font-barlow text-[11px] text-black/65">
            <ProductDetail color="#bd7621" label="Anyag" value={item.materialName} />
            <ProductDetail
              color={leadingColor?.hex ?? "#48856f"}
              label="Szín"
              value={`${shownColors}${extraColorCount ? ` +${extraColorCount}` : ""}`}
            />
            <ProductDetail color="#bd7621" label="Méret" value={item.size} />
          </div>

          {(item.height || item.bust) && (
            <p className="mt-2 font-barlow text-[10px] text-black/45">
              {item.height && `${t("Magasság")}: ${item.height} cm`}
              {item.height && item.bust && " · "}
              {item.bust && `${t("Mellbőség")}: ${item.bust} cm`}
            </p>
          )}

          {!paymentTestItem && (
            <Link
              href={editHref}
              className="mt-2 inline-flex items-center gap-1.5 font-barlow text-[11px] font-black text-[#c77720] transition hover:text-black"
            >
              <Pencil size={12} />
              {t("Szerkesztés")}
            </Link>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between md:block">
        <span className="font-barlow text-[10px] font-black uppercase text-black/40 md:hidden">
          {t("Egységár")}
        </span>
        <strong className="font-barlow text-sm">
          {item.unitPrice} {item.currency}
        </strong>
      </div>

      <div className="flex items-center justify-between md:justify-center">
        <span className="font-barlow text-[10px] font-black uppercase text-black/40 md:hidden">
          {t("Mennyiség")}
        </span>
        <div className="inline-flex items-center rounded-full border border-black/10 bg-white">
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity === 1}
            className="flex h-9 w-9 items-center justify-center disabled:opacity-25"
            aria-label={t("Mennyiség csökkentése")}
          >
            <Minus size={14} />
          </button>
          <span className="min-w-7 text-center font-barlow text-sm font-black">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="flex h-9 w-9 items-center justify-center"
            aria-label={t("Mennyiség növelése")}
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between md:block md:text-right">
        <span className="font-barlow text-[10px] font-black uppercase text-black/40 md:hidden">
          {t("Összesen")}
        </span>
        <strong className="font-barlow text-sm">
          {item.unitPrice * item.quantity} {item.currency}
        </strong>
      </div>

      <button
        type="button"
        onClick={() => onRemove(item.id)}
        aria-label={`${t(item.productName)} ${t("eltávolítása")}`}
        className="flex h-9 w-9 items-center justify-center justify-self-end rounded-full text-black/55 transition hover:bg-red-50 hover:text-red-600 md:justify-self-center"
      >
        <Trash2 size={17} />
      </button>
    </article>
  );
}

function ProductDetail({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: string;
}) {
  const { t } = useLanguage();
  return (
    <p className="flex min-w-0 items-center gap-1.5">
      <span
        className="h-2 w-2 shrink-0 rounded-full border border-black/10"
        style={{ backgroundColor: color }}
      />
      <span className="truncate">
        <strong>{t(label)}:</strong> {t(value)}
      </span>
    </p>
  );
}

function ShippingRate({ label, price }: { label: string; price: string }) {
  const { t } = useLanguage();
  return (
    <div className="flex items-center justify-between gap-4">
      <span>{t(label)}</span>
      <strong className="text-black">{t(price)}</strong>
    </div>
  );
}

function EmptyCart({
  paymentTestEnabled,
  onAddPaymentTestProduct,
}: {
  paymentTestEnabled: boolean;
  onAddPaymentTestProduct: () => void;
}) {
  const { t } = useLanguage();
  return (
    <div className="flex min-h-[470px] flex-col items-center justify-center rounded-[28px] border border-black/10 bg-white/65 p-8 text-center shadow-xl shadow-black/5">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#e39b3e]/15 text-[#c77720]">
        <ShoppingCart size={34} strokeWidth={1.6} />
      </span>
      <h2 className="mt-6 font-barlow-condensed text-[38px] font-bold uppercase">
        {t("A kosarad még üres")}
      </h2>
      <p className="mt-3 max-w-md font-barlow text-black/55">
        {t("Tervezz meg egy terméket, válaszd ki a méretét, majd tedd a kosárba.")}
      </p>
      <Link
        href="/configurator"
        className="mt-7 inline-flex h-13 items-center gap-2 rounded-lg bg-[#e99a37] px-8 font-barlow text-sm font-black uppercase text-white transition hover:bg-[#cf7f20]"
      >
        {t("Tervezés indítása")}
        <ArrowRight size={18} />
      </Link>
      {paymentTestEnabled && (
        <button
          type="button"
          onClick={onAddPaymentTestProduct}
          className="mt-3 inline-flex h-12 items-center gap-2 rounded-lg border border-emerald-700/25 bg-emerald-50 px-7 font-barlow text-sm font-black text-emerald-800 transition hover:border-emerald-700"
        >
          {t("Fizetési teszttermék")} · 2 RON
        </button>
      )}
    </div>
  );
}
