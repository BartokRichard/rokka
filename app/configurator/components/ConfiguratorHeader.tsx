"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Palette,
  Rabbit,
  Ruler,
  Shirt,
  Sparkles,
} from "lucide-react";
import CartButton from "../../components/CartButton";
import { useLanguage } from "../../i18n/LanguageProvider";

type Props = {
  currentStep: number;
  extraStepLabel?: string;
};

export default function ConfiguratorHeader({
  currentStep,
  extraStepLabel,
}: Props) {
  const hasExtraStep = Boolean(extraStepLabel);
  const { t } = useLanguage();

  return (
    <header className="flex h-24 items-center justify-between border-b border-black/5 bg-[#f4eee5]/90 px-4 backdrop-blur sm:px-8 md:px-16">
      <Link href="/" className="flex items-center">
        <Image
          src="/images/logo_trans.png"
          alt="ROKKA logo"
          width={145}
          height={80}
          priority
          className="h-auto w-[105px] object-contain mix-blend-multiply sm:w-[125px]"
        />
      </Link>

      <div className="hidden items-center gap-5 lg:flex">
        <Step
          active={currentStep >= 1}
          number="01"
          label="Modell"
          icon={<Shirt size={20} />}
        />
        <Line />
        <Step
          active={currentStep >= 2}
          number="02"
          label="Anyag"
          icon={<Shirt size={20} />}
        />
        <Line />
        {hasExtraStep && (
          <>
            <Step
              active={currentStep >= 3}
              number="03"
              label={t(extraStepLabel ?? "")}
              icon={
                extraStepLabel === "Fül" ? (
                  <Rabbit size={20} />
                ) : (
                  <Sparkles size={20} />
                )
              }
            />
            <Line />
          </>
        )}
        <Step
          active={currentStep >= (hasExtraStep ? 4 : 3)}
          number={hasExtraStep ? "04" : "03"}
          label="Szín"
          icon={<Palette size={20} />}
        />
        <Line />
        <Step
          active={currentStep >= (hasExtraStep ? 5 : 4)}
          number={hasExtraStep ? "05" : "04"}
          label="Méret"
          icon={<Ruler size={20} />}
        />
      </div>

      <div className="flex items-center gap-5">
        <CartButton />
      </div>
    </header>
  );
}

function Step({
  active,
  number,
  label,
  icon,
}: {
  active?: boolean;
  number: string;
  label: string;
  icon: React.ReactNode;
}) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-full border ${
          active
            ? "border-[#d99a4d] bg-[#d99a4d] text-white"
            : "border-black/20 bg-white/30 text-black/70"
        }`}
      >
        {icon}
      </div>

      <div
        className={`text-center font-barlow text-[11px] font-black uppercase leading-tight tracking-wide ${
          active ? "text-[#d99a4d]" : "text-black/70"
        }`}
      >
        <div>{number}</div>
        <div>{t(label)}</div>
      </div>
    </div>
  );
}

function Line() {
  return <div className="h-px w-16 bg-black/20" />;
}
