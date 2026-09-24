"use client";

import { Suspense, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { CartItem, useCart } from "../cart/CartProvider";
import ModelSelector from "../components/ModelSelector";
import {
  getColorOptionsForPart,
  PRODUCTS,
  Product,
  MaterialOption,
} from "../data/products";
import ConfiguratorHeader from "./components/ConfiguratorHeader";
import MaterialSelectorView from "./views/MaterialSelectorView";
import EarSelectorView from "./views/EarSelectorView";
import VariantSelectorView from "./views/VariantSelectorView";
import ColorEditorView from "./views/ColorEditorView";
import SizeEditorView from "./views/SizeEditorView";
import { useLanguage } from "../i18n/LanguageProvider";

type ConfiguratorView = "ears" | "variant" | "color" | "size";

export default function ConfiguratorPage() {
  return (
    <Suspense fallback={<ConfiguratorLoading label="Konfigurátor betöltése…" />}>
      <ConfiguratorContent />
    </Suspense>
  );
}

function ConfiguratorContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const editItemId = searchParams.get("edit");
  const requestedProductId = searchParams.get("product");
  const { items, hydrated } = useCart();

  if (!editItemId) {
    return <ConfiguratorSession requestedProductId={requestedProductId} />;
  }

  if (!hydrated) {
    return <ConfiguratorLoading label="Termék betöltése szerkesztéshez…" />;
  }

  const cartItem = items.find((item) => item.id === editItemId);
  const product = PRODUCTS.find(
    (candidate) => candidate.id === cartItem?.productId,
  );
  const material = product?.materialOptions.find(
    (candidate) => candidate.name === cartItem?.materialName,
  );

  if (!cartItem || !product || !material) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#f4eee5] px-5 text-center">
        <p className="font-barlow-condensed text-4xl font-bold uppercase">
          {t("A termék már nincs a kosárban")}
        </p>
        <Link
          href="/cart"
          className="rounded-full bg-[#8f592d] px-7 py-3 font-barlow text-sm font-bold text-white"
        >
          {t("Vissza a kosárhoz")}
        </Link>
      </main>
    );
  }

  return <ConfiguratorSession key={cartItem.id} initialCartItem={cartItem} />;
}

function ConfiguratorSession({
  initialCartItem,
  requestedProductId,
}: {
  initialCartItem?: CartItem;
  requestedProductId?: string | null;
}) {
  const router = useRouter();
  const { addItem, updateItem } = useCart();
  const editItemId = initialCartItem?.id;
  const initialProduct = PRODUCTS.find(
    (product) =>
      product.id === (initialCartItem?.productId ?? requestedProductId),
  );
  const initialMaterial = initialProduct?.materialOptions.find(
    (material) => material.name === initialCartItem?.materialName,
  );
  const initialEar = initialProduct?.earOptions?.find(
    (option) =>
      option.id === initialCartItem?.earId ||
      option.name === initialCartItem?.earName,
  );
  const initialVariant = initialProduct?.variantOptions?.find(
    (option) =>
      option.id === initialCartItem?.variantId ||
      option.name === initialCartItem?.variantName,
  );
  const addToCartLock = useRef(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(
    initialProduct ?? null,
  );
  const [selectedMaterial, setSelectedMaterial] =
    useState<MaterialOption | null>(initialMaterial ?? null);

  const [activeView, setActiveView] = useState<ConfiguratorView>("color");

  const [colorValues, setColorValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      initialCartItem?.colors.map((color) => [color.partId, color.optionId]) ??
        [],
    ),
  );
  const [fullView, setFullView] = useState(false);
  const [selectedEar, setSelectedEar] = useState(initialEar?.id ?? "");
  const [selectedVariant, setSelectedVariant] = useState(
    initialVariant?.id ?? "",
  );

  const [size, setSize] = useState(initialCartItem?.size ?? "");
  const [height, setHeight] = useState(initialCartItem?.height ?? "");
  const [bust, setBust] = useState(initialCartItem?.bust ?? "");

  if (!selectedProduct) {
    return (
      <main className="min-h-screen w-full overflow-x-hidden bg-[#f4eee5]">
        <ModelSelector
          products={PRODUCTS}
          onSelect={(product) => {
            addToCartLock.current = false;
            setIsAddingToCart(false);
            setSelectedProduct(product);
            setSelectedMaterial(null);
            setActiveView("color");
            setColorValues({});
            setFullView(false);
            setSelectedEar("");
            setSelectedVariant("");
            setSize("");
            setHeight("");
            setBust("");
          }}
        />
      </main>
    );
  }

  const hasEarStep = Boolean(selectedProduct.earOptions?.length);
  const hasVariantStep = Boolean(selectedProduct.variantOptions?.length);
  const hasExtraStep = hasEarStep || hasVariantStep;
  const selectedEarOption = selectedProduct.earOptions?.find(
    (option) => option.id === selectedEar,
  );
  const selectedVariantOption = selectedProduct.variantOptions?.find(
    (option) => option.id === selectedVariant,
  );
  const configuredMaterial =
    selectedMaterial && selectedVariantOption
      ? {
          ...selectedMaterial,
          price: selectedVariantOption.price,
          currency: selectedVariantOption.currency,
        }
      : selectedMaterial;
  const configuredProduct = {
    ...selectedProduct,
    ...(selectedEarOption
      ? {
        name: `${selectedProduct.name} – ${selectedEarOption.name}`,
        sampleImage: selectedEarOption.image,
        colorParts: selectedProduct.colorParts.map((part) => ({
          ...part,
          mask:
            part.id === "outer"
              ? selectedEarOption.masks?.outer ?? part.mask
              : part.id === "lining"
                ? selectedEarOption.masks?.lining ?? part.mask
                : part.mask,
        })),
      }
      : {}),
    ...(selectedVariantOption
      ? {
          name: `${selectedProduct.name} – ${selectedVariantOption.name}`,
        }
      : {}),
  };

  const currentStep = !selectedMaterial
    ? 2
    : activeView === "ears" || activeView === "variant"
      ? 3
      : activeView === "color"
        ? hasExtraStep
          ? 4
          : 3
        : hasExtraStep
          ? 5
          : 4;

  const handleAddToCart = () => {
    if (!selectedMaterial || addToCartLock.current) return;

    const material = configuredMaterial ?? selectedMaterial;
    const unitPrice =
      material.price ?? selectedProduct.sizePrices?.[material.name]?.[size];

    if (!unitPrice) return;

    addToCartLock.current = true;
    setIsAddingToCart(true);

    const cartItem = {
      productId: selectedProduct.id,
      productName: configuredProduct.name,
      subtitle: configuredProduct.subtitle,
      sampleImage: configuredProduct.sampleImage,
      productImage: selectedProduct.image,
      materialName: material.name,
      earId: selectedEarOption?.id,
      earName: selectedEarOption?.name,
      variantId: selectedVariantOption?.id,
      variantName: selectedVariantOption?.name,
      colors: configuredProduct.colorParts.map((part) => {
        const colorOptions = getColorOptionsForPart(
          configuredProduct,
          material,
          part,
        );
        const optionId = colorValues[part.id] ?? part.defaultColor;
        const option = colorOptions.find((color) => color.id === optionId);

        return {
          partId: part.id,
          partLabel: part.label,
          optionId,
          optionLabel: option?.label ?? optionId,
          hex: option?.hex,
          texture: option?.texture,
        };
      }),
      size,
      height: height.trim() || undefined,
      bust: bust.trim() || undefined,
      unitPrice,
      currency: material.currency ?? "ron",
    };

    if (editItemId) {
      updateItem(editItemId, cartItem);
    } else {
      addItem(cartItem);
    }

    router.push("/cart");
  };

  return (
    <main className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#f4eee5] text-[#20221f]">
      <ConfiguratorHeader
        currentStep={currentStep}
        extraStepLabel={
          hasEarStep ? "Fül" : hasVariantStep ? "Típus" : undefined
        }
      />

      {!selectedMaterial ? (
        <MaterialSelectorView
          product={selectedProduct}
          onBack={() => {
            setSelectedProduct(null);
            setSelectedMaterial(null);
            setActiveView("color");
            setColorValues({});
            setFullView(false);
            setSelectedEar("");
            setSelectedVariant("");
            setSize("");
            setHeight("");
            setBust("");
          }}
          onSelect={(material) => {
            setSelectedMaterial(material);
            setActiveView(
              hasEarStep ? "ears" : hasVariantStep ? "variant" : "color",
            );
            setColorValues(
              Object.fromEntries(
                selectedProduct.colorParts.map((part) => {
                  const colorOptions = getColorOptionsForPart(
                    selectedProduct,
                    material,
                    part,
                  );
                  const initialColor =
                    (selectedProduct.id === "yuppi" && part.id === "outer"
                      ? colorOptions[0]
                      : colorOptions.find(
                          (option) => option.label === "Fehér",
                        )) ?? colorOptions[0];

                  return [
                    part.id,
                    initialColor?.id ?? part.defaultColor,
                  ];
                }),
              ),
            );
            setSize("");
          }}
        />
      ) : activeView === "ears" && selectedProduct.earOptions ? (
        <EarSelectorView
          product={selectedProduct}
          material={selectedMaterial}
          options={selectedProduct.earOptions}
          selectedEar={selectedEar}
          setSelectedEar={setSelectedEar}
          onBack={() => {
            setSelectedMaterial(null);
            setActiveView("ears");
          }}
          onNext={() => setActiveView("color")}
        />
      ) : activeView === "variant" && selectedProduct.variantOptions ? (
        <VariantSelectorView
          product={selectedProduct}
          material={selectedMaterial}
          options={selectedProduct.variantOptions}
          selectedVariant={selectedVariant}
          setSelectedVariant={setSelectedVariant}
          onBack={() => {
            setSelectedMaterial(null);
            setActiveView("variant");
          }}
          onNext={() => setActiveView("color")}
        />
      ) : activeView === "size" ? (
        <SizeEditorView
          product={configuredProduct}
          material={configuredMaterial ?? selectedMaterial}
          colorValues={colorValues}
          size={size}
          setSize={setSize}
          height={height}
          setHeight={setHeight}
          bust={bust}
          setBust={setBust}
          stepNumber={hasExtraStep ? "05" : "04"}
          isAddingToCart={isAddingToCart}
          submitLabel={editItemId ? "Módosítások mentése" : undefined}
          busyLabel={editItemId ? "Módosítások mentése…" : undefined}
          onBack={() => setActiveView("color")}
          onAddToCart={handleAddToCart}
        />
      ) : (
        <ColorEditorView
          product={configuredProduct}
          material={configuredMaterial ?? selectedMaterial}
          colorValues={colorValues}
          setColorValues={setColorValues}
          fullView={fullView}
          setFullView={setFullView}
          stepNumber={hasExtraStep ? "04" : "03"}
          backLabel={
            hasEarStep
              ? "Fül módosítása"
              : hasVariantStep
                ? "Típus módosítása"
                : "Anyag módosítása"
          }
          onBack={() => {
            if (hasEarStep) {
              setActiveView("ears");
            } else if (hasVariantStep) {
              setActiveView("variant");
            } else {
              setSelectedMaterial(null);
              setActiveView("color");
            }
            setFullView(false);
          }}
          onNext={() => setActiveView("size")}
        />
      )}
    </main>
  );
}

function ConfiguratorLoading({ label }: { label: string }) {
  const { t } = useLanguage();
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4eee5] font-barlow text-black/45">
      {t(label)}
    </main>
  );
}
