"use client";

import { useState } from "react";
import Sidebar from "./components/Sidebar";
import ProductPreview from "./components/ProductPreview";
import ColorPanel from "./components/ColorPanel";

export default function Page() {
  const [sleeveColor, setSleeveColor] = useState("#ff6b00");

  return (
    <main className="min-h-screen w-screen overflow-x-hidden bg-[#101010] text-white">
      <div className="mx-auto grid min-h-screen w-full bg-[#151515] lg:h-screen lg:grid-cols-[240px_minmax(0,1fr)_370px] lg:overflow-hidden lg:border lg:border-white/10">
        <Sidebar />

        <section className="flex min-h-[520px] flex-col overflow-hidden lg:min-h-0">
          <header className="flex h-16 shrink-0 items-center justify-center gap-6 bg-[#181818] px-4 text-sm text-white/70 lg:h-[72px] lg:justify-end lg:px-10">
            <button>Mentés</button>
            <button>Megosztás</button>
            <button>Teljes nézet</button>
          </header>

          <ProductPreview sleeveColor={sleeveColor} />
        </section>

        <ColorPanel sleeveColor={sleeveColor} setSleeveColor={setSleeveColor} />
      </div>
    </main>
  );
}
