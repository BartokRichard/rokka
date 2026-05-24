"use client";

import { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";

type Props = {
  sleeveColor: string;
};

function HoodieModel({ sleeveColor }: Props) {
  const { scene } = useGLTF("/models/hoodie.glb");

  useEffect(() => {
    const rows: any[] = [];

    scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      const material = child.material as THREE.MeshStandardMaterial;

      rows.push({
        mesh: child.name,
        material: material?.name,
      });

      const meshName = child.name.toLowerCase();
      const materialName = material?.name?.toLowerCase() || "";

      const isSleeve =
        meshName.includes("sleeve") ||
        meshName.includes("arm") ||
        meshName.includes("ujj") ||
        materialName.includes("sleeve") ||
        materialName.includes("arm") ||
        materialName.includes("ujj");

      if (isSleeve && material) {
        material.color = new THREE.Color(sleeveColor);
        material.needsUpdate = true;
      }
    });

    console.table(rows);
  }, [scene, sleeveColor]);

  return <primitive object={scene} scale={2.2} position={[0, -2.2, 0]} />;
}

export default function HoodieViewer({ sleeveColor }: Props) {
  return (
    <div className="h-full w-full bg-[#1a1a1a]">
      <Canvas camera={{ position: [0, 0, 5], fov: 35 }}>
        <ambientLight intensity={1.4} />
        <directionalLight position={[5, 5, 5]} intensity={2} />
        <Environment preset="studio" />

        <HoodieModel sleeveColor={sleeveColor} />

        <OrbitControls enablePan={false} minDistance={3} maxDistance={8} />
      </Canvas>
    </div>
  );
}
