"use client";

import Image from "next/image";
import Link from "next/link";
import {
  User,
  ShoppingBag,
  Pencil,
  Box,
  Truck,
  ShieldCheck,
  Heart,
  Leaf,
  Star,
  ArrowRight,
} from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f4eee5] text-[#20221f]">
      <header className="fixed left-0 top-0 z-50 flex h-28 w-full items-center justify-between border-b border-black/5 bg-[#f4eee5]/90 px-8 backdrop-blur md:px-16">
        <Link href="/" className="ml-2 mt-6 flex items-center">
          <Image
            src="/images/logo_trans.png"
            alt="ROKKA logo"
            width={170}
            height={90}
            priority
            className="h-auto w-[150px] object-contain mix-blend-multiply"
          />
        </Link>

        <nav className="hidden items-center gap-12 text-sm font-bold uppercase tracking-wide md:flex">
          <Link href="#">Kollekció</Link>

          <Link
            href="/configurator"
            className="border-b-2 border-[#d99a4d] pb-2 text-[#d99a4d]"
          >
            Tervezd meg
          </Link>

          <Link href="#">Rólunk</Link>
          <Link href="#">Kapcsolat</Link>
        </nav>

        <div className="flex items-center gap-5">
          <User size={24} strokeWidth={1.7} />
          <ShoppingBag size={24} strokeWidth={1.7} />
        </div>
      </header>

      <section className="relative min-h-screen px-8 pt-14 md:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_58%_43%,rgba(255,255,255,0.96),rgba(244,238,229,0.5)_38%,rgba(226,199,166,0.34)_100%)]" />

        <div className="relative z-10 grid min-h-[calc(100vh-7rem)] grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_1.2fr_0.75fr]">
          <div className="relative z-20 max-w-[560px]">
            <div className="pointer-events-none absolute -left-2 -top-24 z-0 whitespace-nowrap text-[12vw] font-black uppercase leading-none tracking-tight text-transparent opacity-80 [-webkit-text-stroke:1.2px_rgba(166,119,72,0.28)]">
              TERVEZD MEG
            </div>

            <div className="relative z-10 pt-28">
              <h1
                className="
  font-barlow-condensed
  text-[58px]
  font-semibold
  uppercase
  leading-[0.82]
  tracking-[-0.06em]
  text-[#20221f]
  md:text-[76px]
"
              >
                A STÍLUSOD.
              </h1>

              <div
                className="
    font-caveat
    mt-1
    text-[50px]
    font-bold
    leading-[0.85]
    tracking-[-0.02em]
    text-[#d99a4d]
    md:text-[68px]
    pt-2
  "
              >
                A SZABÁLYAID.
              </div>

              <p className="mt-10 max-w-[430px] text-[20px] leading-[1.45] text-[#20221f]">
                Tervezd meg saját ruhadarabod
                <br />
                pár kattintással. Egyedi. Modern.
                <br />
              </p>

              <Link
                href="/configurator"
                className="
  mt-9
  inline-flex
  h-[60px]
  w-full
  max-w-[320px]
  items-center
  justify-center gap-4
  rounded-xl
  bg-[#e1a35c]
  px-5
  text-[16px]
  font-black
  uppercase
  tracking-wide
  text-white
  shadow-xl
  shadow-orange-900/15
  transition
  hover:bg-[#d9903f]
  md:h-[64px]
  md:max-w-[330px]
  md:px-9
  md:text-[17px]
"
              >
                Tervezd meg most
                <ArrowRight size={26} />
              </Link>
            </div>
          </div>

          <div
            className="
  relative
  -mt-24
  flex
  min-h-[420px]
  items-start
  justify-center
  md:min-h-[620px]
  md:items-center
  md:mt-0
"
          >
            <div className="absolute left-1/2 top-[48%] h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fff4e4] opacity-95 blur-[80px]" />

            <div className="absolute left-1/2 top-[52%] h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f5d4a8]/45 blur-[70px]" />

            <div className="absolute left-1/2 top-[58%] h-24 w-[420px] -translate-x-1/2 rounded-full bg-black/18 blur-2xl" />

            <Image
              src="/images/landing_rokka.png"
              alt="ROKKA hoodie"
              width={900}
              height={1100}
              priority
              className="
  relative
  z-10
  h-[680px]
  w-auto
  object-contain
  drop-shadow-2xl
  md:h-[760px]
"
            />
          </div>

          <div className="z-20 space-y-8">
            <Feature
              icon={<Pencil />}
              title="Saját design"
              text="Válaszd ki a fazont, színeket, részleteket."
            />

            <Feature
              icon={<Box />}
              title="3D előnézet"
              text="Nézd meg a terveid valósághűen 3D-ben."
            />

            <Feature
              icon={<Truck />}
              title="Gyors szállítás"
              text="Rövid határidővel, egyenesen hozzád."
            />
          </div>
        </div>

        <div className="relative z-20 mb-10 rounded-3xl bg-white/55 p-8 shadow-xl shadow-black/5 backdrop-blur">
          <div className="grid gap-6 md:grid-cols-4">
            <BottomFeature
              icon={<ShieldCheck />}
              title="Minőségi anyagok"
              text="Prémium textíliák, amik kényelmet és tartósságot biztosítanak."
            />
            <BottomFeature
              icon={<Heart />}
              title="Egyedi & modern"
              text="Alkoss valami igazán egyedit, ami kifejezi a stílusod."
            />
            <BottomFeature
              icon={<Leaf />}
              title="Fenntartható"
              text="Környezetbarát gyártás, tudatos választás a jövőért."
            />
            <BottomFeature
              icon={<Star />}
              title="Neked készül"
              text="Minden darab egyedileg készül, csak számodra."
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-5 border-b border-black/15 pb-7">
      <div className="text-[#b5793b] [&_svg]:h-10 [&_svg]:w-10 [&_svg]:stroke-[1.4]">
        {icon}
      </div>

      <div>
        <h3 className="text-lg font-black uppercase">{title}</h3>
        <p className="mt-2 text-base leading-relaxed text-black/65">{text}</p>
      </div>
    </div>
  );
}

function BottomFeature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-5 border-black/10 md:border-r md:pr-6 last:md:border-r-0">
      <div className="text-[#667154] [&_svg]:h-11 [&_svg]:w-11 [&_svg]:stroke-[1.4]">
        {icon}
      </div>

      <div>
        <h4 className="text-sm font-black uppercase">{title}</h4>
        <p className="mt-2 text-sm leading-relaxed text-black/65">{text}</p>
      </div>
    </div>
  );
}
