"use client";

import React from "react";
import { useBlockUIStore } from "@/stores/useBlockUIStore";
import { LogoLoader } from "@/shared/components/LogoLoader";

export const BlockUIOverlay: React.FC = () => {
  const isOpen = useBlockUIStore((s) => s.isOpen);
  const message = useBlockUIStore((s) => s.message);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "var(--color-overlay)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99999,
      }}
    >
      <LogoLoader sMessage={message || "Loading..."} />
    </div>
  );
};

export { BlockUI } from "@/stores/useBlockUIStore";
 