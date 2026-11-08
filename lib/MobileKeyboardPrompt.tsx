"use client";

import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Placement = { top: number; left: number; width: number; maxHeight: number };

export function MobileKeyboardPrompt({ active, label, children }: {
  active: boolean;
  label: string;
  children: ReactNode;
}) {
  const [placement, setPlacement] = useState<Placement | null>(null);

  useEffect(() => {
    if (!active) return;

    const update = () => {
      const viewport = window.visualViewport;
      const width = viewport?.width ?? window.innerWidth;
      if (width > 900) {
        setPlacement(null);
        return;
      }
      const height = viewport?.height ?? window.innerHeight;
      setPlacement({
        top: (viewport?.offsetTop ?? 0) + 6,
        left: (viewport?.offsetLeft ?? 0) + 8,
        width: Math.max(0, width - 16),
        maxHeight: Math.max(48, Math.min(112, height * 0.42)),
      });
    };

    update();
    window.visualViewport?.addEventListener("resize", update);
    window.visualViewport?.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    return () => {
      window.visualViewport?.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [active]);

  if (!active || !placement) return null;

  return createPortal(
    <div
      role="note"
      aria-label="入力中の問題文"
      className="fixed z-50 overflow-y-auto overscroll-contain rounded-xl border border-indigo-300 bg-white px-3 py-2 shadow-lg"
      style={placement}
    >
      <p className="text-[11px] font-bold text-indigo-600">{label}</p>
      <div className="text-sm font-semibold leading-snug text-gray-900">{children}</div>
    </div>,
    document.body
  );
}
