"use client";

import Image from "next/image";
import Link from "next/link";
import { Palette, Ruler, Shirt, ShoppingBag, User } from "lucide-react";

type Props = {
  currentStep: number;
};

export default function ConfiguratorHeader({ currentStep }: Props) {
  return (
    <header className="flex h-24 items-center justify-between border-b border-black/5 bg-[#f4eee5]/90 px-8 backdrop-blur md:px-16">
      <Link href="/" className="flex items-center">
        <Image
          src="/images/logo_trans.png"
          alt="ROKKA logo"
          width={145}
          height={80}
          priority
          className="h-auto w-[125px] object-contain mix-blend-multiply"
        />
      </Link>

      <div className="hidden items-center gap-8 lg:flex">
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
        <Step
          active={currentStep >= 3}
          number="03"
          label="Szín"
          icon={<Palette size={20} />}
        />
        <Line />
        <Step
          active={currentStep >= 4}
          number="04"
          label="Méret"
          icon={<Ruler size={20} />}
        />
      </div>

      <div className="flex items-center gap-5">
        <User size={22} strokeWidth={1.7} />
        <ShoppingBag size={22} strokeWidth={1.7} />
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
        <div>{label}</div>
      </div>
    </div>
  );
}

function Line() {
  return <div className="h-px w-24 bg-black/20" />;
}
