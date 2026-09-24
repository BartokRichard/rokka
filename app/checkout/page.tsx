"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle,
  LoaderCircle,
  ShoppingBag,
} from "lucide-react";

import { useCart } from "../cart/CartProvider";
import {
  DeliveryMode,
  COURIER_SHIPPING_FEE,
  FREE_SHIPPING_THRESHOLD,
  getShippingFee,
  ShippingCountry,
} from "../cart/pricing";
import StoreHeader from "../components/StoreHeader";
import ShipoEasyboxPicker, {
  SelectedEasybox,
} from "./ShipoEasyboxPicker";
import PacketaPickupPointPicker, {
  SelectedPacketaPoint,
} from "./PacketaPickupPointPicker";
import { useLanguage } from "../i18n/LanguageProvider";

type PaymentMode = "transfer" | "cash";

type Confirmation = {
  orderNumber: string;
  itemCount: number;
  totalPrice: number;
};

export default function CheckoutPage() {
  const { locale, t } = useLanguage();
  const { items, hydrated, totalPrice, clearCart } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMode, setPaymentMode] = useState<PaymentMode | "">("");
  const [shippingCountry, setShippingCountry] =
    useState<ShippingCountry>("ro");
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>("easybox");
  const [shippingAddress, setShippingAddress] = useState("");
  const [selectedEasybox, setSelectedEasybox] =
    useState<SelectedEasybox | null>(null);
  const [selectedPacketaPoint, setSelectedPacketaPoint] =
    useState<SelectedPacketaPoint | null>(null);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [startingPayment, setStartingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const effectiveDeliveryMode: DeliveryMode =
    shippingCountry === "hu" ? "packeta" : deliveryMode;
  const shippingFee = getShippingFee(totalPrice, effectiveDeliveryMode);
  const orderTotal = totalPrice + shippingFee;
  const hasFreeShipping = totalPrice >= FREE_SHIPPING_THRESHOLD;
  const isPickup = effectiveDeliveryMode === "pickup";
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const deliveryDetailsAreValid =
    isPickup ||
    (effectiveDeliveryMode === "easybox"
      ? selectedEasybox !== null
      : effectiveDeliveryMode === "packeta"
        ? selectedPacketaPoint !== null
      : shippingAddress.trim() !== "");
  const checkoutReady =
    name.trim() !== "" &&
    emailIsValid &&
    phone.trim() !== "" &&
    paymentMode !== "" &&
    deliveryDetailsAreValid;

  const changeDeliveryMode = (value: string) => {
    const nextDeliveryMode = value as DeliveryMode;
    setDeliveryMode(nextDeliveryMode);

    if (nextDeliveryMode !== "pickup" && paymentMode === "cash") {
      setPaymentMode("");
    }
  };

  const submitOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!checkoutReady || items.length === 0 || startingPayment) return;

    setStartingPayment(true);
    setPaymentError("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          shippingCountry,
          deliveryMode: effectiveDeliveryMode,
          customer: { name, email, phone },
          shippingAddress,
          easybox: selectedEasybox,
          packetaPoint: selectedPacketaPoint,
          paymentMethod: paymentMode,
          locale,
        }),
      });
      const result = (await response.json()) as {
        orderNumber?: string;
        itemCount?: number;
        totalPrice?: number;
        error?: string;
      };

      if (!response.ok || !result.orderNumber || !result.itemCount || result.totalPrice === undefined) {
        throw new Error(result.error ?? "A rendelés nem menthető.");
      }

      setConfirmation({
        orderNumber: result.orderNumber,
        itemCount: result.itemCount,
        totalPrice: result.totalPrice,
      });
      clearCart();
    } catch (error) {
      setPaymentError(
        error instanceof Error
          ? error.message
          : "A rendelés nem menthető. Próbáld újra.",
      );
    } finally {
      setStartingPayment(false);
    }
  };

  if (!hydrated) {
    return (
      <main className="min-h-screen bg-[#f4eee5]">
        <StoreHeader />
        <div className="flex min-h-[calc(100vh-96px)] items-center justify-center font-barlow text-black/45">
          {t("Checkout betöltése…")}
        </div>
      </main>
    );
  }

  if (confirmation) {
    return (
      <main className="min-h-screen bg-[#f4eee5] text-[#20221f]">
        <StoreHeader />
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#674b37]/45 p-4 backdrop-blur-sm">
          <section role="dialog" aria-modal="true" aria-labelledby="order-confirmation-title" className="w-full max-w-2xl rounded-[34px] border border-black/10 bg-[#fffaf2] p-8 text-center shadow-2xl md:p-12">
            <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#d99a4d]/15 text-[#c77720]">
              <CheckCircle size={38} strokeWidth={1.8} />
            </span>
            <p className="mt-7 font-barlow text-xs font-black uppercase tracking-[0.25em] text-[#d99a4d]">
              {confirmation.orderNumber}
            </p>
            <h1 id="order-confirmation-title" className="mt-3 font-barlow-condensed text-[48px] font-bold uppercase leading-none md:text-[62px]">
              {t("Rendelés rögzítve")}
            </h1>
            <p className="mx-auto mt-5 max-w-lg font-barlow leading-relaxed text-black/55">
              {t(`${confirmation.itemCount} termék`)}, {locale === "hu" ? "összesen" : "în total"}{" "}
              <strong className="text-black">
                {confirmation.totalPrice} ron
              </strong>
              . {t("A rendelés részleteivel kapcsolatban hamarosan felveszem Önnel a kapcsolatot.")}
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/"
                className="inline-flex h-13 items-center justify-center rounded-full border border-black/10 bg-white px-7 font-barlow text-sm font-bold transition hover:border-[#d99a4d]"
              >
                {t("Főoldal")}
              </Link>
              <Link
                href="/configurator"
                className="inline-flex h-13 items-center justify-center rounded-full bg-[#8f592d] px-7 font-barlow text-sm font-bold text-white transition hover:bg-[#d99a4d]"
              >
                {t("Új termék tervezése")}
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#f4eee5] text-[#20221f]">
        <StoreHeader />
        <section className="flex min-h-[calc(100vh-96px)] items-center justify-center px-5 py-12">
          <div className="w-full max-w-xl rounded-[30px] border border-black/10 bg-white/60 p-9 text-center shadow-xl shadow-black/5">
            <ShoppingBag className="mx-auto text-[#c77720]" size={42} />
            <h1 className="mt-5 font-barlow-condensed text-[42px] font-bold uppercase">
              {t("Nincs mit megrendelni")}
            </h1>
            <p className="mt-3 font-barlow text-black/55">
              {t("A checkout megkezdéséhez előbb tegyél legalább egy terméket a kosárba.")}
            </p>
            <Link
              href="/configurator"
              className="mt-7 inline-flex h-14 items-center justify-center rounded-full bg-[#8f592d] px-8 font-barlow text-sm font-bold text-white transition hover:bg-[#d99a4d]"
            >
              {t("Termék tervezése")}
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4eee5] text-[#20221f]">
      <StoreHeader />

      <section className="relative px-5 py-10 md:px-10 lg:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_55%_15%,rgba(255,255,255,0.95),rgba(244,238,229,0.65)_48%,rgba(226,199,166,0.24)_100%)]" />

        <div className="relative z-10 mx-auto max-w-[1380px]">
          <Link
            href="/cart"
            className="mb-7 inline-flex items-center gap-2 font-barlow text-sm font-semibold text-black/55 transition hover:text-black"
          >
            <ArrowLeft size={16} />
            {t("Vissza a kosárhoz")}
          </Link>

          <div className="mb-9">
            <p className="font-barlow text-xs font-black uppercase tracking-[0.25em] text-[#d99a4d]">
              {t("Utolsó lépés")}
            </p>
            <h1 className="mt-2 font-barlow-condensed text-[54px] font-bold uppercase leading-none md:text-[72px]">
              Checkout
            </h1>
          </div>

          <form
            onSubmit={submitOrder}
            className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_430px]"
          >
            <div className="space-y-7 rounded-[32px] border border-black/10 bg-white/65 p-7 shadow-xl shadow-black/5 md:p-9">
              <div>
                <p className="font-barlow text-xs font-black uppercase tracking-[0.23em] text-[#d99a4d]">
                  {t("Kapcsolattartás")}
                </p>
                <h2 className="mt-3 font-barlow-condensed text-[40px] font-bold uppercase leading-none">
                  {t("Személyes adatok")}
                </h2>
              </div>

              <CheckoutInput
                label="Név"
                value={name}
                onChange={setName}
                placeholder="Teljes név"
                autoComplete="name"
              />
              <CheckoutInput
                label="E-mail-cím"
                value={email}
                onChange={setEmail}
                placeholder="nev@pelda.hu"
                type="email"
                autoComplete="email"
              />
              <CheckoutInput
                label="Telefonszám"
                value={phone}
                onChange={setPhone}
                placeholder="+40..."
                type="tel"
                autoComplete="tel"
              />

              <div className="space-y-7">
                  <ChoiceGroup
                    title="Szállítási ország"
                    value={shippingCountry}
                    onChange={(value) => {
                      const country = value as ShippingCountry;
                      setShippingCountry(country);
                      if (country === "hu" && paymentMode === "cash") {
                        setPaymentMode("");
                      }
                    }}
                    options={[
                      ["ro", "Románia"],
                      ["hu", "Külföld – Magyarország"],
                    ]}
                  />

                  {shippingCountry === "ro" ? (
                    <ChoiceGroup
                      title="Szállítás"
                      value={deliveryMode}
                      onChange={changeDeliveryMode}
                      options={[
                        [
                          "easybox",
                          hasFreeShipping ? "Easybox – ingyenes" : "Easybox – 18 ron",
                        ],
                        [
                          "courier",
                          hasFreeShipping ? "Curier – ingyenes" : `Curier – ${COURIER_SHIPPING_FEE} ron`,
                        ],
                        ["pickup", "Személyes átvétel a műhelyből – ingyenes"],
                      ]}
                    />
                  ) : (
                    <ChoiceGroup
                      title="Szállítás"
                      value="packeta"
                      onChange={() => undefined}
                      options={[
                        [
                          "packeta",
                          "Packeta / Z-BOX – 7–10 EUR között, csomagtól függően",
                        ],
                      ]}
                    />
                  )}
              </div>

              <ChoiceGroup
                title="Fizetési mód"
                value={paymentMode}
                onChange={(value) => setPaymentMode(value as PaymentMode)}
                options={
                  isPickup
                    ? [
                        ["transfer", "Banki átutalás egyeztetés után"],
                        ["cash", "Készpénz személyes átvételkor"],
                      ]
                    : [["transfer", "Banki átutalás egyeztetés után"]]
                }
              />

              {effectiveDeliveryMode === "easybox" && (
                <ShipoEasyboxPicker
                  value={selectedEasybox}
                  onSelect={setSelectedEasybox}
                />
              )}

              {effectiveDeliveryMode === "packeta" && (
                <PacketaPickupPointPicker
                  value={selectedPacketaPoint}
                  onSelect={setSelectedPacketaPoint}
                />
              )}

              {(effectiveDeliveryMode === "home" || effectiveDeliveryMode === "courier") && (
                <CheckoutInput
                  label="Szállítási cím"
                  value={shippingAddress}
                  onChange={setShippingAddress}
                  placeholder="Irányítószám, város, utca, házszám"
                  autoComplete="street-address"
                />
              )}
            </div>

            <aside className="rounded-[30px] border border-black/10 bg-white/75 p-7 shadow-xl shadow-black/5 lg:sticky lg:top-6">
              <p className="font-barlow text-xs font-black uppercase tracking-[0.23em] text-[#d99a4d]">
                {t("Rendelésed")}
              </p>
              <h2 className="mt-3 font-barlow-condensed text-[40px] font-bold uppercase leading-none">
                {t("Összesítés")}
              </h2>

              <div className="mt-7 max-h-[390px] space-y-4 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[64px_minmax(0,1fr)] gap-3 border-b border-black/10 pb-4 last:border-b-0"
                  >
                    <div className={`relative h-20 overflow-hidden rounded-xl ${/\/(?:FoxHoodieSample\.webp|PrettyHoodie\.png)(?:\?|$)/.test(item.sampleImage) ? "bg-[#d9c7ad]" : "bg-[#efe7da]"}`}>
                      <Image
                        src={item.sampleImage}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-contain p-1.5"
                        style={/\/(?:FoxHoodieSample\.webp|PrettyHoodie\.png)(?:\?|$)/.test(item.sampleImage) ? {
                          maskImage: `url("${item.sampleImage}")`,
                          maskMode: "luminance",
                          maskRepeat: "no-repeat",
                          maskPosition: "center",
                          maskSize: "contain",
                        } : undefined}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-barlow text-sm font-black">
                        {t(item.productName)}
                      </p>
                      <p className="mt-1 font-barlow text-xs text-black/50">
                        {t(item.materialName)} · {item.size} · {item.quantity} {locale === "hu" ? "db" : "buc."}
                      </p>
                      <p className="mt-2 font-barlow text-sm font-bold text-[#c77720]">
                        {item.unitPrice * item.quantity} {item.currency}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3 border-t border-black/10 pt-6 font-barlow text-sm">
                <div className="flex justify-between gap-4 text-black/55">
                  <span>{t("Részösszeg")}</span>
                  <span>{totalPrice} ron</span>
                </div>
                <div className="flex justify-between gap-4 text-black/55">
                  <span>{t("Szállítás")}</span>
                  <span>
                    {effectiveDeliveryMode === "packeta"
                      ? "7–10 EUR között, csomagtól függően"
                      : shippingFee === 0
                        ? t("Ingyenes")
                        : `${shippingFee} ron`}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex items-end justify-between gap-4 border-t border-black/10 pt-5">
                <span className="font-barlow text-sm font-black uppercase tracking-[0.12em]">
                  {t("Összesen")}
                </span>
                <span className="font-barlow-condensed text-[38px] font-bold text-[#c77720]">
                  {orderTotal} ron
                </span>
              </div>

              <button
                type="submit"
                disabled={!checkoutReady || startingPayment}
                className={[
                  "mt-7 flex h-14 w-full items-center justify-center gap-2 rounded-full px-6 font-barlow text-sm font-bold transition",
                  checkoutReady && !startingPayment
                    ? "bg-[#8f592d] text-white hover:bg-[#d99a4d]"
                    : "cursor-not-allowed bg-black/20 text-black/40",
                ].join(" ")}
              >
                {startingPayment ? (
                  <LoaderCircle className="animate-spin" size={18} />
                ) : (
                  <CheckCircle size={18} />
                )}
                {t(startingPayment
                  ? "Rendelés mentése…"
                  : "Rendelés leadása")}
              </button>
              {paymentError && (
                <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 font-barlow text-sm font-semibold text-red-700">
                  {t(paymentError)}
                </p>
              )}
            </aside>
          </form>
        </div>
      </section>
    </main>
  );
}

function CheckoutInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  autoComplete?: string;
}) {
  const { t } = useLanguage();
  return (
    <label className="block">
      <span className="font-barlow text-sm font-black uppercase tracking-[0.18em]">
        {t(label)}
      </span>
      <input
        required
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={t(placeholder)}
        autoComplete={autoComplete}
        className="mt-3 h-14 w-full rounded-2xl border border-black/10 bg-white px-5 font-barlow text-base font-semibold outline-none transition focus:border-[#d99a4d]"
      />
    </label>
  );
}

function ChoiceGroup({
  title,
  value,
  onChange,
  options,
}: {
  title: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<[string, string]>;
}) {
  const { t } = useLanguage();
  return (
    <fieldset>
      <legend className="font-barlow text-sm font-black uppercase tracking-[0.18em]">
        {t(title)}
      </legend>
      <div
        className={[
          "mt-3 grid gap-3",
          options.length === 1
            ? "sm:grid-cols-1"
            : options.length === 2
              ? "sm:grid-cols-2"
              : "sm:grid-cols-3",
        ].join(" ")}
      >
        {options.map(([optionValue, label]) => {
          const active = value === optionValue;

          return (
            <button
              key={optionValue}
              type="button"
              onClick={() => onChange(optionValue)}
              className={[
                "flex min-h-14 min-w-0 items-center justify-between gap-3 overflow-hidden rounded-2xl border px-4 text-left font-barlow text-sm font-semibold transition",
                active
                  ? "border-[#d99a4d] bg-[#d99a4d]/15"
                  : "border-black/10 bg-white hover:border-[#d99a4d]",
              ].join(" ")}
            >
              <span className="min-w-0 flex-1 break-words">{t(label)}</span>
              <span
                className={[
                  "h-4 w-4 shrink-0 rounded-full border",
                  active
                    ? "border-[#d99a4d] bg-[#d99a4d]"
                    : "border-black/20",
                ].join(" ")}
              />
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
