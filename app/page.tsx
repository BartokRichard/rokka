"use client";

import { useState } from "react";

import Sidebar from "./components/Sidebar";
import ProductPreview from "./components/ProductPreview";
import ColorPanel from "./components/ColorPanel";
import HoodieViewer from "./components/HoodieViewer";

import { Maximize2 } from "lucide-react";

export default function Page() {
  const [bodyColor, setBodyColor] = useState("#ffffff");
  const [sleeveColor, setSleeveColor] = useState("#ff6b00");

  const [fullView, setFullView] = useState(false);

  return (
    <main className="min-h-screen w-screen overflow-x-hidden bg-[#101010] text-white">
      <div className="mx-auto grid min-h-screen w-full bg-[#151515] lg:h-screen lg:grid-cols-[240px_minmax(0,1fr)_370px] lg:overflow-hidden lg:border lg:border-white/10">
        <Sidebar />

        <section className="flex min-h-[520px] flex-col overflow-hidden lg:min-h-0">
          <header className="flex h-16 shrink-0 items-center justify-center gap-6 bg-[#181818] px-4 text-sm text-white/70 lg:h-[72px] lg:justify-end lg:px-10">
            <button>Mentés</button>

            <button>Megosztás</button>

            <button
              onClick={() => setFullView(!fullView)}
              className="flex items-center gap-2"
            >
              <Maximize2 size={16} />
              Teljes nézet
            </button>
          </header>

          {fullView ? (
            <HoodieViewer sleeveColor={sleeveColor} />
          ) : (
            <ProductPreview bodyColor={bodyColor} sleeveColor={sleeveColor} />
          )}
        </section>

        <ColorPanel
          bodyColor={bodyColor}
          setBodyColor={setBodyColor}
          sleeveColor={sleeveColor}
          setSleeveColor={setSleeveColor}
        />
      </div>
    </main>
  );
}
