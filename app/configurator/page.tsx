"use client";

import { useState } from "react";

import ModelSelector from "../components/ModelSelector";
import { PRODUCTS, Product, MaterialOption } from "../data/products";
import ConfiguratorHeader from "./components/ConfiguratorHeader";
import MaterialSelectorView from "./views/MaterialSelectorView";
import ColorEditorView from "./views/ColorEditorView";
import SizeEditorView from "./views/SizeEditorView";

type ConfiguratorView = "color" | "size";

export default function ConfiguratorPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedMaterial, setSelectedMaterial] =
    useState<MaterialOption | null>(null);

  const [activeView, setActiveView] = useState<ConfiguratorView>("color");

  const [colorValues, setColorValues] = useState<Record<string, string>>({});
  const [fullView, setFullView] = useState(false);

  const [size, setSize] = useState("");
  const [height, setHeight] = useState("");
  const [bust, setBust] = useState("");

  if (!selectedProduct) {
    return (
      <main className="min-h-screen w-full overflow-x-hidden bg-[#f4eee5]">
        <ModelSelector
          products={PRODUCTS}
          onSelect={(product) => {
            setSelectedProduct(product);
            setSelectedMaterial(null);
            setActiveView("color");
            setColorValues({});
            setFullView(false);
            setSize("");
            setHeight("");
            setBust("");
          }}
        />
      </main>
    );
  }

  const currentStep = !selectedMaterial ? 2 : activeView === "size" ? 4 : 3;

  return (
    <main className="min-h-screen w-screen overflow-x-hidden bg-[#f4eee5] text-[#20221f]">
      <ConfiguratorHeader currentStep={currentStep} />

      {!selectedMaterial ? (
        <MaterialSelectorView
          product={selectedProduct}
          onBack={() => {
            setSelectedProduct(null);
            setSelectedMaterial(null);
            setActiveView("color");
            setColorValues({});
            setFullView(false);
            setSize("");
            setHeight("");
            setBust("");
          }}
          onSelect={(material) => {
            setSelectedMaterial(material);
            setActiveView("color");
          }}
        />
      ) : activeView === "size" ? (
        <SizeEditorView
          product={selectedProduct}
          material={selectedMaterial}
          colorValues={colorValues}
          size={size}
          setSize={setSize}
          height={height}
          setHeight={setHeight}
          bust={bust}
          setBust={setBust}
          onBack={() => setActiveView("color")}
          onNext={() => {
            console.log({
              product: selectedProduct,
              material: selectedMaterial,
              colorValues,
              size,
              height,
              bust,
            });
          }}
        />
      ) : (
        <ColorEditorView
          product={selectedProduct}
          material={selectedMaterial}
          colorValues={colorValues}
          setColorValues={setColorValues}
          fullView={fullView}
          setFullView={setFullView}
          onBack={() => {
            setSelectedMaterial(null);
            setActiveView("color");
            setFullView(false);
          }}
          onNext={() => setActiveView("size")}
        />
      )}
    </main>
  );
}
