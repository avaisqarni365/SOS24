import type { DetailedHTMLProps, HTMLAttributes } from "react";

/** The site's own custom elements (src/components/wc/elements.ts). */
type El = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "sos-check": El;
      "sos-compare": El;
      "sos-callback": El;
    }
  }
}

export {};
