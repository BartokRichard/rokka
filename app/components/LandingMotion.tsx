"use client";

import { useEffect } from "react";

export default function LandingMotion() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    const scrollLayers = Array.from(
      document.querySelectorAll<HTMLElement>("[data-scroll-speed]"),
    );
    const cursorLayers = Array.from(
      document.querySelectorAll<HTMLElement>("[data-cursor-strength]"),
    );
    let scrollFrame = 0;
    let pointerFrame = 0;
    let pointerX = 0;
    let pointerY = 0;

    const updateScroll = () => {
      const viewportHeight = window.innerHeight;
      const scrollRange = Math.max(
        document.documentElement.scrollHeight - viewportHeight,
        1,
      );
      document.documentElement.style.setProperty(
        "--landing-progress",
        String(window.scrollY / scrollRange),
      );

      scrollLayers.forEach((layer) => {
        const rect = layer.getBoundingClientRect();
        const distanceFromCenter =
          (rect.top + rect.height / 2 - viewportHeight / 2) / viewportHeight;
        const speed = Number(layer.dataset.scrollSpeed ?? 0);
        const offset = Math.max(-1.2, Math.min(1.2, distanceFromCenter)) * speed;
        layer.style.setProperty("--motion-scroll-y", `${offset.toFixed(2)}px`);
      });
      scrollFrame = 0;
    };

    const updatePointer = () => {
      cursorLayers.forEach((layer) => {
        const strength = Number(layer.dataset.cursorStrength ?? 0);
        layer.style.setProperty("--motion-pointer-x", `${pointerX * strength}px`);
        layer.style.setProperty("--motion-pointer-y", `${pointerY * strength}px`);
      });
      pointerFrame = 0;
    };

    const onScroll = () => {
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScroll);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (window.innerWidth < 768 || event.pointerType === "touch") return;
      pointerX = event.clientX / window.innerWidth - 0.5;
      pointerY = event.clientY / window.innerHeight - 0.5;
      if (!pointerFrame) pointerFrame = window.requestAnimationFrame(updatePointer);
    };

    updateScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
      if (pointerFrame) window.cancelAnimationFrame(pointerFrame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.style.removeProperty("--landing-progress");
      [...scrollLayers, ...cursorLayers].forEach((layer) => {
        layer.style.removeProperty("--motion-scroll-y");
        layer.style.removeProperty("--motion-pointer-x");
        layer.style.removeProperty("--motion-pointer-y");
      });
    };
  }, []);

  return null;
}
