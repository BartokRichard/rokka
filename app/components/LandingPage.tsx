"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  Box,
  ExternalLink,
  Heart,
  Leaf,
  Mail,
  MapPin,
  Menu,
  Pencil,
  ShieldCheck,
  Star,
  Truck,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import aboutPhoto from "../../public/images/about.jpg";
import landingSummerfox from "../../public/images/landing_summerfox.png";
import CartButton from "./CartButton";
import CollectionGallery from "./CollectionGallery";
import CreatorPortrait from "./CreatorPortrait";
import CustomerVoices from "./CustomerVoices";
import LandingMotion from "./LandingMotion";
import ScrollStory from "./ScrollStory";
import { useLanguage } from "../i18n/LanguageProvider";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<"kollekcio" | "visszajelzesek" | "rolunk" | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const sections = ["kollekcio", "visszajelzesek", "rolunk"]
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) setActiveSection(visible.target.id as "kollekcio" | "visszajelzesek" | "rolunk");
      },
      { rootMargin: "-28% 0px -52% 0px", threshold: [0, 0.25, 0.6, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen overflow-x-clip bg-[#f4eee5] text-[#20221f]">
      <header className="fixed left-0 top-0 z-50 flex h-24 w-full items-center justify-between border-b border-black/5 bg-[#f4eee5]/90 px-6 backdrop-blur md:h-28 md:px-16">
        <Link href="/" className="flex items-center" aria-label={`ROKKA ${t("Kezdőlap")}`}>
          <Image
            src="/images/logo_trans.png"
            alt="ROKKA"
            width={170}
            height={90}
            priority
            className="h-auto w-[130px] object-contain mix-blend-multiply md:w-[150px]"
          />
        </Link>

        <nav className="hidden items-center gap-12 text-sm font-bold uppercase tracking-wide md:flex">
          <NavLink href="#kollekcio" active={activeSection === "kollekcio"}>{t("Kollekció")}</NavLink>
          <NavLink href="#visszajelzesek" active={activeSection === "visszajelzesek"}>{t("Visszajelzések")}</NavLink>
          <Link
            href="/configurator"
            className="border-b-2 border-transparent pb-2 transition hover:border-[#d99a4d] hover:text-[#bd7431]"
          >
            {t("Tervezés indítása")}
          </Link>
          <NavLink href="#rolunk" active={activeSection === "rolunk"}>{t("Rólunk")}</NavLink>
        </nav>

        <div className="flex items-center gap-4">
          <CartButton size={24} />
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-black/10 md:hidden"
            aria-label={mobileMenuOpen ? t("Menü bezárása") : t("Menü megnyitása")}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <>
          <button
            type="button"
            aria-label={t("Menü bezárása")}
            className="fixed inset-0 top-24 z-0 bg-[#20221f]/35 backdrop-blur-sm md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <nav className="fixed inset-x-4 top-[6.5rem] z-10 grid gap-2 overflow-hidden rounded-[1.75rem] border border-white/70 bg-[#fbf7f1]/98 p-3 text-sm font-black uppercase tracking-wide shadow-2xl md:hidden">
            <p className="px-4 pb-2 pt-3 text-[10px] tracking-[0.24em] text-[#b66e2f]">ROKKA</p>
            <MobileNavLink href="#kollekcio" active={activeSection === "kollekcio"} onClick={() => setMobileMenuOpen(false)}>
              {t("Kollekció")}
            </MobileNavLink>
            <MobileNavLink href="#visszajelzesek" active={activeSection === "visszajelzesek"} onClick={() => setMobileMenuOpen(false)}>
              {t("Visszajelzések")}
            </MobileNavLink>
            <MobileNavLink href="/configurator" active={false} onClick={() => setMobileMenuOpen(false)}>
              {t("Tervezés indítása")}
            </MobileNavLink>
            <MobileNavLink href="#rolunk" active={activeSection === "rolunk"} onClick={() => setMobileMenuOpen(false)}>
              {t("Rólunk")}
            </MobileNavLink>
          </nav>
          </>
        )}
      </header>

      <LandingMotion />
      <ScrollStory />
      <Hero />
      <CollectionGallery />
      <CustomerVoices />
      <About />
    </main>
  );
}

function Hero() {
  const { t } = useLanguage();
  return (
    <section id="kezdet" className="relative px-5 pb-14 pt-28 md:px-16 md:pb-16 md:pt-36">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_58%_28%,rgba(255,255,255,0.96),rgba(244,238,229,0.5)_38%,rgba(226,199,166,0.34)_100%)]" />

      <div className="relative z-10 mx-auto grid max-w-[1580px] grid-cols-1 gap-7 sm:gap-10 lg:min-h-[calc(100vh-9rem)] lg:grid-cols-[1fr_1.2fr_0.75fr] lg:items-center lg:gap-8">
        <div className="mobile-reveal relative z-30 max-w-[560px]" data-scroll-speed="16">
          <h1 className="font-barlow-condensed text-[52px] font-semibold uppercase leading-[0.82] tracking-[-0.06em] md:text-[76px]">
            {t("A STÍLUSOD.")}
          </h1>
          <div className="font-caveat mt-1 pt-2 text-[46px] font-bold leading-[0.85] tracking-[-0.02em] text-[#d99a4d] md:text-[68px]">
            {t("A SZABÁLYAID.")}
          </div>
          <p className="mt-8 max-w-[430px] text-[20px] leading-[1.45] md:mt-10">
            {t("Tervezd meg saját ruhadarabod színeit pár kattintással.")}
          </p>
          <Link
            href="/configurator"
            className="motion-shimmer mt-8 inline-flex h-[60px] w-full max-w-[340px] items-center justify-center gap-4 overflow-hidden rounded-xl bg-[#e1a35c] px-5 text-[16px] font-black uppercase tracking-wide text-white shadow-xl shadow-orange-900/15 transition hover:-translate-y-1 hover:bg-[#d9903f] md:h-[64px] md:max-w-[330px] md:px-9 md:text-[17px]"
          >
            {t("Tervezés indítása")} <ArrowRight size={26} />
          </Link>
          <div className="mt-5 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-black/38 md:hidden">
            <span className="grid h-7 w-7 place-items-center rounded-full border border-black/10 bg-white/50">
              <ChevronDown size={15} />
            </span>
            {t("Görgess tovább")}
          </div>
        </div>

        <div className="mobile-photo-reveal relative isolate z-20 flex min-h-[430px] items-center justify-center md:min-h-[620px]" data-scroll-speed="-32" data-cursor-strength="22">
          <div className="absolute left-1/2 top-[52%] z-0 h-[680px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fff4e4] opacity-95 blur-[100px] md:h-[980px] md:w-[980px]" />
          <div className="absolute left-1/2 top-[58%] z-0 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f5d4a8]/45 blur-[90px] md:h-[780px] md:w-[780px]" />
          <div className="absolute bottom-8 left-1/2 z-0 h-20 w-[300px] -translate-x-1/2 rounded-full bg-black/15 blur-3xl md:h-28 md:w-[540px]" />
          <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
            <div className="motion-orbit absolute left-1/2 top-1/2 h-[390px] w-[390px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#d99a4d]/35 sm:h-[540px] sm:w-[540px] lg:h-[650px] lg:w-[650px]">
              <span className="absolute left-1/2 top-[-7px] h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-[#d99a4d] shadow-[0_0_20px_rgba(217,154,77,0.9)]" />
            </div>
            <div className="motion-orbit-reverse absolute left-1/2 top-1/2 h-[315px] w-[315px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#657052]/18 sm:h-[430px] sm:w-[430px] lg:h-[520px] lg:w-[520px]">
              <span className="absolute bottom-[12%] right-[3%] h-2.5 w-2.5 rounded-full bg-[#657052] shadow-[0_0_16px_rgba(101,112,82,0.65)]" />
            </div>
          </div>
          <Image
            src={landingSummerfox}
            alt="Summer Fox Hoodie"
            quality={100}
            priority
            className="relative z-20 h-[560px] w-[450px] max-w-[115%] object-contain drop-shadow-2xl sm:h-[700px] sm:w-[560px] lg:h-[820px] lg:w-[650px]"
          />
        </div>

        <div className="mobile-hide-scrollbar z-30 -mx-5 flex touch-pan-x snap-x snap-mandatory select-none gap-4 overflow-x-auto px-5 pb-4 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0 md:select-auto lg:block lg:space-y-8" data-scroll-speed="12">
          <Feature icon={<Pencil />} title="Saját design" text="Válaszd ki a fazont, színeket, részleteket." />
          <Feature icon={<Box />} title="3D előnézet" text="Nézd meg a terveid valósághűen 3D-ben." />
          <Feature icon={<Truck />} title="Gyors szállítás" text="Rövid határidővel, egyenesen hozzád." />
        </div>
      </div>

      <div className="mobile-reveal relative z-30 mx-auto mt-8 max-w-[1580px] rounded-3xl bg-white/55 p-4 shadow-xl shadow-black/5 backdrop-blur md:mt-12 md:p-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          <BottomFeature icon={<ShieldCheck />} title="Minőségi anyagok" text="Prémium textíliák, amik kényelmet és tartósságot biztosítanak." />
          <BottomFeature icon={<Heart />} title="Egyedi & modern" text="Alkoss valami igazán egyedit, ami kifejezi a stílusod." />
          <BottomFeature icon={<Leaf />} title="Fenntartható" text="Környezetbarát gyártás, tudatos választás a jövőért." />
          <BottomFeature icon={<Star />} title="Neked készül" text="Minden darab egyedileg készül, csak számodra." />
        </div>
      </div>
    </section>
  );
}

function About() {
  const { locale, t } = useLanguage();
  const mapsQuery = encodeURIComponent(
    "Kossuth Lajos utca 32-34, Miercurea Ciuc, Romania",
  );
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
  const mapsEmbedUrl = `https://maps.google.com/maps?hl=${locale}&q=${mapsQuery}&z=17&output=embed`;

  return (
    <section id="rolunk" className="scroll-mt-24 overflow-hidden px-3 py-16 sm:px-6 md:scroll-mt-28 md:px-16 md:py-28">
      <div className="mx-auto min-w-0 max-w-[1580px]">
        <div className="mobile-reveal grid min-w-0 overflow-hidden rounded-[1.5rem] bg-[#fbf8f3] shadow-2xl shadow-[#7f5b35]/10 sm:rounded-[2rem] lg:grid-cols-[0.82fr_1.18fr]">
          <div className="flex min-w-0 flex-col justify-center p-5 sm:p-7 md:p-12 lg:p-16" data-scroll-speed="12">
            <SectionHeading eyebrow={t("Rólunk")} title={t("Helyben készül. Neked készül.")}>
              {t("A ROKKA darabok Csíkszeredában, egy kis műhelyben születnek. Minden fazont úgy alakíthatsz, hogy színben, anyagban és részleteiben is igazán a tiéd legyen.")}
            </SectionHeading>

            <div className="mt-8 grid min-w-0 gap-4 sm:mt-9">
              <a href={mapsUrl} target="_blank" rel="noreferrer" className="group flex min-w-0 items-center gap-3 overflow-hidden rounded-2xl border border-black/10 p-3 transition hover:border-[#d99a4d]/60 hover:bg-[#f5ecdf] sm:gap-4 sm:p-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#e8ddcc] text-[#a96227]"><MapPin size={21} /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-black uppercase tracking-wider text-black/40">{t("Műhely")}</span>
                  <span className="mt-1 block break-words text-sm font-bold sm:text-base">
                    {t("Csíkszereda, Kossuth Lajos utca 32–34.")}
                  </span>
                  <span className="mt-1 block text-sm text-black/55">
                    {t("Emelet, szemközti ajtó")}
                  </span>
                </span>
                <ExternalLink size={18} className="ml-auto hidden shrink-0 text-black/35 transition group-hover:text-[#a96227] sm:block" />
              </a>

              <a href="mailto:rokkaholmik@gmail.com" className="group flex min-w-0 items-center gap-3 overflow-hidden rounded-2xl border border-black/10 p-3 transition hover:border-[#d99a4d]/60 hover:bg-[#f5ecdf] sm:gap-4 sm:p-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#e8ddcc] text-[#a96227]"><Mail size={21} /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-black uppercase tracking-wider text-black/40">E-mail</span>
                  <span className="mt-1 block truncate font-bold">rokkaholmik@gmail.com</span>
                </span>
                <ArrowRight size={18} className="ml-auto shrink-0 text-black/35 transition group-hover:text-[#a96227]" />
              </a>
            </div>
          </div>

          <div className="relative min-h-[58svh] overflow-hidden bg-[#ded8cf] sm:min-h-[540px] lg:min-h-[650px]" data-scroll-speed="-10">
            <iframe
              key={locale}
              src={mapsEmbedUrl}
              title={t("ROKKA műhely a Google Térképen")}
              loading="eager"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0"
            />
            <a href={mapsUrl} target="_blank" rel="noreferrer" className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/70 bg-[#fbf8f3]/95 px-4 py-2 text-xs font-black uppercase tracking-wide text-[#20221f] shadow-xl backdrop-blur transition hover:bg-white sm:right-6 sm:top-6">
              Google Maps <ExternalLink size={15} />
            </a>
          </div>
        </div>

        <div className="mobile-reveal mt-5 overflow-hidden rounded-[1.5rem] bg-[#252820] text-white shadow-2xl shadow-[#7f5b35]/10 sm:mt-8 sm:rounded-[2rem] lg:grid lg:grid-cols-[0.72fr_1.28fr]">
          <div className="relative flex flex-col justify-between overflow-hidden p-7 sm:p-10 lg:min-h-[760px] lg:p-14 xl:p-16">
            <div className="pointer-events-none absolute -left-10 top-16 font-barlow-condensed text-[11rem] font-black uppercase leading-none tracking-[-0.08em] text-white/[0.035] lg:text-[18rem]">
              ROKKA
            </div>
            <div className="relative" data-scroll-speed="14">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#e5aa63]">
                {t("A ROKKA alkotója")}
              </p>
              <h3 className="mt-4 font-barlow-condensed text-5xl font-bold uppercase leading-[0.94] tracking-[-0.025em] sm:text-6xl xl:text-7xl">
                {t("Ötlettől az utolsó öltésig.")}
              </h3>
              <div aria-hidden="true" className="mt-6 h-[4.75rem] max-w-lg" />
            </div>

            <div className="relative mt-10 grid grid-cols-3 gap-2 border-t border-white/15 pt-6 sm:gap-3">
              {["Tervezés", "Szabás", "Varrás"].map((step, index) => (
                <div key={step} className="min-w-0">
                  <span className="font-barlow-condensed text-2xl font-bold text-[#e5aa63]">0{index + 1}</span>
                  <span className="mt-1 block break-words text-[10px] font-black uppercase tracking-[0.12em] text-white/65 sm:text-xs sm:tracking-[0.16em]">
                    {t(step)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex items-center justify-center overflow-hidden bg-[#1d211c] p-0 sm:p-6 lg:min-h-[760px] lg:p-8" data-scroll-speed="-16">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(229,170,99,0.16),transparent_58%)]" />
            <CreatorPortrait
              src={aboutPhoto}
              alt={t("A ROKKA készítője a műhelyben")}
            />
          </div>
        </div>

        <footer className="flex flex-col items-center justify-between gap-4 py-10 text-center text-sm text-black/50 sm:flex-row sm:text-left">
          <Image src="/images/logo_trans.png" alt="ROKKA" width={110} height={58} className="h-auto w-[100px] object-contain mix-blend-multiply opacity-75" />
          <p>© {new Date().getFullYear()} ROKKA · {locale === "hu" ? "Egyedi ruhák Csíkszeredából" : "Haine unice din Miercurea Ciuc"}</p>
          <Link href="/admin" className="text-xs uppercase tracking-widest opacity-45 transition hover:opacity-100">Admin</Link>
        </footer>
      </div>
    </section>
  );
}

function SectionHeading({ eyebrow, title, children, light = false }: { eyebrow: string; title: string; children: React.ReactNode; light?: boolean }) {
  return (
    <div className="min-w-0 max-w-3xl">
      <p className="text-xs font-black uppercase tracking-[0.24em] text-[#d99a4d]">{eyebrow}</p>
      <h2 className={`mt-3 break-words font-barlow-condensed text-[clamp(2.5rem,12vw,3rem)] font-bold uppercase leading-[0.98] tracking-[-0.025em] md:text-7xl ${light ? "text-white" : "text-[#20221f]"}`}>{title}</h2>
      <p className={`mt-5 max-w-2xl break-words text-base leading-7 md:text-lg ${light ? "text-white/60" : "text-black/60"}`}>{children}</p>
    </div>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return <Link href={href} className={`border-b-2 pb-2 transition hover:border-[#d99a4d] hover:text-[#b66e2f] ${active ? "border-[#d99a4d] text-[#d99a4d]" : "border-transparent"}`}>{children}</Link>;
}

function MobileNavLink({ href, active, onClick, children }: { href: string; active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <Link href={href} onClick={onClick} className={`flex min-h-14 items-center justify-between rounded-2xl px-5 py-3 transition hover:bg-[#efe3d3] hover:text-[#b66e2f] ${active ? "bg-[#efe3d3] text-[#b66e2f]" : ""}`}><span>{children}</span><ArrowRight size={18} /></Link>;
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  const { t } = useLanguage();
  return (
    <div className="mobile-reveal min-w-[78vw] snap-center rounded-[1.35rem] border border-white/70 bg-white/60 p-5 shadow-lg shadow-black/5 backdrop-blur md:min-w-0 md:rounded-none md:border-0 md:border-b md:border-black/15 md:bg-transparent md:p-0 md:pb-7 md:shadow-none md:backdrop-blur-none md:last:border-b lg:last:border-b-0 flex gap-5">
      <div className="shrink-0 text-[#b5793b] [&_svg]:h-10 [&_svg]:w-10 [&_svg]:stroke-[1.4]">{icon}</div>
      <div><h3 className="text-lg font-black uppercase">{t(title)}</h3><p className="mt-2 text-base leading-relaxed text-black/65">{t(text)}</p></div>
    </div>
  );
}

function BottomFeature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  const { t } = useLanguage();
  return (
    <div className="mobile-reveal flex flex-col gap-3 rounded-2xl bg-white/45 p-3.5 sm:flex-row sm:gap-5 sm:bg-transparent sm:p-0 md:border-r md:border-black/10 md:pr-6 last:md:border-r-0">
      <div className="shrink-0 text-[#667154] [&_svg]:h-11 [&_svg]:w-11 [&_svg]:stroke-[1.4]">{icon}</div>
      <div><h4 className="text-sm font-black uppercase">{t(title)}</h4><p className="mt-2 text-sm leading-relaxed text-black/65">{t(text)}</p></div>
    </div>
  );
}
