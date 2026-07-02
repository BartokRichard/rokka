"use client";

import { useState } from "react";
import { X, CheckCircle } from "lucide-react";

type PaymentMode = "bank" | "revolut" | "cash";
type DeliveryMode = "pickup" | "courier";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
};

export default function CheckoutPopup({ open, onClose, onSubmit }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [paymentMode, setPaymentMode] = useState<PaymentMode>("bank");
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>("pickup");

  const [shippingAddress, setShippingAddress] = useState("");

  if (!open) return null;

  const needsAddress = deliveryMode === "courier";

  const checkoutReady =
    name.trim() !== "" &&
    phone.trim() !== "" &&
    (!needsAddress || shippingAddress.trim() !== "");

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-4 md:items-center">
      <div className="relative max-h-[90vh] w-full max-w-[620px] overflow-y-auto rounded-[30px] bg-[#f4eee5] p-7 shadow-2xl md:p-9">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full bg-white p-2 text-black/60 transition hover:text-black"
        >
          <X size={18} />
        </button>

        <p className="font-barlow text-xs font-black uppercase tracking-[0.25em] text-[#d99a4d]">
          Személyes adatok
        </p>

        <h2 className="mt-3 font-barlow-condensed text-[44px] font-bold uppercase leading-none">
          Rendelés
        </h2>

        <div className="mt-8 space-y-7">
          <Input
            label="Név"
            value={name}
            onChange={setName}
            placeholder="Teljes név"
          />

          <Input
            label="Telefonszám"
            value={phone}
            onChange={setPhone}
            placeholder="+40..."
          />

          <RadioGroup
            title="Fizetési mód"
            value={paymentMode}
            onChange={(value) => setPaymentMode(value as PaymentMode)}
            options={[
              ["bank", "Banki utalás"],
              ["revolut", "Revolut"],
              ["cash", "Készpénz"],
            ]}
          />

          <RadioGroup
            title="Átvétel / szállítás"
            value={deliveryMode}
            onChange={(value) => setDeliveryMode(value as DeliveryMode)}
            options={[
              ["pickup", "Személyes átvétel"],
              ["courier", "Futárszolgálattal küldöm a megrendelőnek"],
            ]}
          />

          {needsAddress && (
            <div>
              <Input
                label="Szállítási cím"
                value={shippingAddress}
                onChange={setShippingAddress}
                placeholder="Irányítószám, város, utca, házszám"
              />

              <p className="mt-3 font-barlow text-sm leading-relaxed text-black/55">
                Ezt a címet használjuk a futárszolgálatos kiszállításhoz.
              </p>
            </div>
          )}

          <button
            disabled={!checkoutReady}
            onClick={() => {
              if (!checkoutReady) return;
              onSubmit();
            }}
            className={[
              "flex h-14 w-full items-center justify-center gap-2 rounded-full px-6 font-barlow text-sm font-bold transition",
              checkoutReady
                ? "bg-black text-white hover:bg-[#d99a4d]"
                : "cursor-not-allowed bg-black/20 text-black/40",
            ].join(" ")}
          >
            <CheckCircle size={18} />
            Rendelés leadása
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="font-barlow text-sm font-black uppercase tracking-[0.18em]">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-3 h-14 w-full rounded-2xl border border-black/10 bg-white px-5 font-barlow text-lg font-semibold outline-none"
      />
    </div>
  );
}

function RadioGroup({
  title,
  value,
  onChange,
  options,
}: {
  title: string;
  value: string;
  onChange: (value: string) => void;
  options: [string, string][];
}) {
  return (
    <div>
      <p className="font-barlow text-sm font-black uppercase tracking-[0.18em]">
        {title}
      </p>

      <div className="mt-3 grid gap-3">
        {options.map(([optionValue, label]) => {
          const active = value === optionValue;

          return (
            <button
              key={optionValue}
              type="button"
              onClick={() => onChange(optionValue)}
              className={[
                "flex items-center justify-between rounded-2xl border px-5 py-4 text-left font-barlow font-semibold transition",
                active
                  ? "border-[#d99a4d] bg-[#d99a4d]/15 text-black"
                  : "border-black/10 bg-white text-black/70 hover:border-[#d99a4d]",
              ].join(" ")}
            >
              <span>{label}</span>

              <span
                className={[
                  "h-4 w-4 shrink-0 rounded-full border",
                  active
                    ? "border-[#d99a4d] bg-[#d99a4d]"
                    : "border-black/20 bg-white",
                ].join(" ")}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
