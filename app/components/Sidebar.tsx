import Image from "next/image";
import Step from "./Step";

export default function Sidebar() {
  return (
    <aside className="bg-black lg:flex lg:min-h-0 lg:flex-col">
      <div className="flex h-[110px] items-center justify-center border-b border-white/10 lg:h-[128px]">
        <Image
          src="/images/logo.jpg"
          alt="ROKKA logo"
          width={122}
          height={90}
          priority
          className="object-contain invert"
        />
      </div>

      <div className="hidden min-h-0 flex-1 flex-col justify-between px-8 py-7 lg:flex">
        <div className="space-y-7">
          <Step number="01" title="MODELL" subtitle="Raglan Hoodie" active />
          <Step number="02" title="SZÍNEK" subtitle="Saját összeállítás" />
          <Step number="03" title="RÉSZLETEK" subtitle="Kapucni & Zseb" />
          <Step
            number="04"
            title="MÉRET & FAZON"
            subtitle="Méret kiválasztása"
          />
        </div>

        <div className="text-sm text-white/55">Súgó</div>
      </div>

      <div className="hidden shrink-0 border-t border-white/10 bg-white/[0.03] p-8 lg:block">
        <div className="text-[11px] uppercase tracking-[0.2em] text-white/35">
          Összesen
        </div>
        <div className="mt-3 text-2xl font-light">249 Lei</div>
        <button className="mt-6 w-full rounded bg-orange-600 px-6 py-4 text-sm font-bold">
          KOSÁRBA
        </button>
      </div>
    </aside>
  );
}
