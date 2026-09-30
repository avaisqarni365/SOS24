"use client";

import React from "react";

export default function AmbientGlow() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage: `
          radial-gradient(60% 45% at 20% 0%, rgba(98, 196, 172, 0.05), transparent 70%),
          radial-gradient(50% 40% at 85% 100%, rgba(63, 154, 135, 0.05), transparent 70%)
        `
      }}
    />
  );
}
