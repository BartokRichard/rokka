"use client";

import { Suspense, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Bounds,
  Environment,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";

import { ProductModel } from "../data/products";
import { useLanguage } from "../i18n/LanguageProvider";

type Props = {
  model?: ProductModel;
  colorValues: Record<string, string>;
};

type LoadedModelProps = {
  model: ProductModel;
  colorValues: Record<string, string>;
};

function LoadedHoodieModel({ model, colorValues }: LoadedModelProps) {
  const { scene: sourceScene } = useGLTF(model.src);

  const scene = useMemo(() => {
    const clonedScene = sourceScene.clone(true);

    clonedScene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      child.material = Array.isArray(child.material)
        ? child.material.map((material) => material.clone())
        : child.material.clone();
    });

    return clonedScene;
  }, [sourceScene]);

  useEffect(() => {
    scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material];

      materials.forEach((material) => {
        if (material instanceof THREE.MeshStandardMaterial) {
          material.metalness = 0;
          material.roughness = Math.max(material.roughness, 0.82);
          material.envMapIntensity = 0.55;
        }

        if (!("color" in material) || !(material.color instanceof THREE.Color)) {
          return;
        }

        const searchableName =
          `${child.name} ${material.name}`.toLocaleLowerCase();

        const binding = model.colorBindings?.find(({ matches }) =>
          matches.some((match) =>
            searchableName.includes(match.toLocaleLowerCase()),
          ),
        );

        const selectedColor = binding
          ? colorValues[binding.partId]
          : undefined;

        if (selectedColor) {
          material.color.set(selectedColor);
          material.needsUpdate = true;
        }
      });
    });
  }, [colorValues, model.colorBindings, scene]);

  return (
    <primitive
      object={scene}
      scale={model.scale ?? 1}
      position={model.position ?? [0, 0, 0]}
    />
  );
}

export default function HoodieViewer({ model, colorValues }: Props) {
  const { t } = useLanguage();
  if (!model) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#d7c2a5] px-8 text-center text-[#252820]">
        <div className="max-w-md">
          <p className="font-barlow-condensed text-4xl font-bold uppercase">
            {t("3D modell előkészítve")}
          </p>
          <p className="mt-4 font-barlow text-sm leading-relaxed text-[#252820]/60">
            {t("Ehhez a termékhez még nincs végleges GLB hozzárendelve. Az új modell feltöltése után ezen a nézeten automatikusan megjelenik.")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-[#d7c2a5]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 35 }}
        dpr={[1, 1.5]}
        frameloop="demand"
      >
        <ambientLight intensity={1.4} />
        <directionalLight position={[5, 5, 5]} intensity={2} />
        <Environment preset="studio" />

        <OrbitControls makeDefault enablePan={false} />

        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.18} maxDuration={0.45}>
            <LoadedHoodieModel model={model} colorValues={colorValues} />
          </Bounds>
        </Suspense>
      </Canvas>
    </div>
  );
}
