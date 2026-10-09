"use client";

import { useEffect } from "react";

/** Loads and registers the site's custom elements once, after hydration. */
export default function WebComponents() {
  useEffect(() => {
    void import("@/components/wc/elements");
  }, []);
  return null;
}
