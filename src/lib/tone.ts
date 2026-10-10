/**
 * The site colour. Three hand-tuned presets (Rot, the default and the
 * logo's brick red; Wasser; Grün) or any colour the visitor picks. The background stays white (dark in the dark
 * theme); the colour reaches the accents only: headings' highlights,
 * buttons, icons, links, the faint section tints. In the dark theme the
 * accent text uses light tints of the same colour.
 *
 * For a picked colour every shade is computed for its job, so contrast holds
 * whatever the colour: text accents 6.4:1 or more on white, buttons hold
 * white text, dark-theme accents 7:1 or more on the dark sheet.
 *
 * The values land as custom properties on <html>; the stylesheet reads them
 * through the --pw-* variables (see globals.css, "palette").
 */
type Pal = Record<string, string>;

const WATER: Pal = {
  accent: "#0b63a8",
  deep: "#0a4f8a",
  mark: "#1784c7",
  aqua: "#1fa9d6",
  label: "#0a6fa8",
  ctaHi: "#0f74bf",
  emHi: "#1590c9",
  paper1: "#f1f8fd",
  paper2: "#e3f1fa",
  wash1: "#eaf5fc",
  wash2: "#d9edf9",
  hero: "#f5fafe",
  shot: "#dbe9f4",
  brick: "#2b4570",
  onDark: "#a6dcfa",
  onDark2: "#7cc4f2",
};

const GREEN: Pal = {
  accent: "#0c6e4a",
  deep: "#0b5e40",
  mark: "#159a63",
  aqua: "#2fc48a",
  label: "#0b6646",
  ctaHi: "#0f8457",
  emHi: "#16a06a",
  paper1: "#f0f9f4",
  paper2: "#dff2e7",
  wash1: "#ebf7f0",
  wash2: "#d6efe1",
  hero: "#f4fbf7",
  shot: "#dcefe4",
  brick: "#1d5a40",
  onDark: "#8ee5b6",
  onDark2: "#4fd18f",
};

/** the logo's brick red */
const RED: Pal = {
  accent: "#b42318",
  deep: "#8f1d14",
  mark: "#d92d20",
  aqua: "#f2877d",
  label: "#a8231a",
  ctaHi: "#c8291c",
  emHi: "#e0483a",
  paper1: "#fdf5f4",
  paper2: "#f9e6e4",
  wash1: "#fcf0ef",
  wash2: "#f6dfdc",
  hero: "#fefaf9",
  shot: "#f0dedc",
  brick: "#5e1e18",
  onDark: "#f4b4ad",
  onDark2: "#ec8a81",
};

/** keys that the stylesheet also needs as "r g b" channels */
const CHANNELS = ["accent", "deep", "mark", "aqua", "paper1", "onDark"];

export type ColorChoice = string;
export const COLOR_KEY = "sos_color";
const LEGACY_KEY = "sos_tone";
export const COLOR_DEFAULT = "red";

/** where each preset sits on the colour wheel (the slider) */
export const PRESET_HUE: Record<string, number> = { water: 206, green: 157, red: 4 };

export function colorName(c: ColorChoice) {
  return c === "water" ? "Wasser" : c === "green" ? "Grün" : c === "red" ? "Auto (Rot)" : "Eigene Farbe";
}

/** a clear, mid colour for a hue (the slider's custom colours) */
export function hexFromHue(h: number) {
  const s = 0.72, l = 0.42;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))));
  };
  return "#" + [f(0), f(8), f(4)].map((v) => v.toString(16).padStart(2, "0")).join("");
}

export function hueOf(c: ColorChoice) {
  if (PRESET_HUE[c] !== undefined) return PRESET_HUE[c];
  const m = /^#([0-9a-f]{6})$/i.exec(c);
  if (!m) return PRESET_HUE.red;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16) / 255);
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  if (!d) return 0;
  const h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return Math.round(h * 60);
}

const PALETTES = { WATER, GREEN, RED, CHANNELS };

/**
 * Paints a colour choice onto <html>. The same function runs in the boot
 * script (as a string, before first paint) and in the controls, so it is
 * written in plain ES5 without imports. A picked colour gets a computed
 * palette: each shade is the lightest (on white) or darkest (on the dark
 * sheet) that still meets its contrast target.
 */
function paint(this: void, P: typeof PALETTES, c: string, d: HTMLElement) {
  var keys = Object.keys(P.RED);
  var name = function (k: string) {
    return "--pw-" + k.replace(/[A-Z]/g, function (m) {
      return "-" + m.toLowerCase();
    });
  };
  // the default (red) is what the stylesheet already carries
  if (c === "red" || !c) {
    for (var i = 0; i < keys.length; i++) {
      d.style.removeProperty(name(keys[i]));
      d.style.removeProperty(name(keys[i]) + "-rgb");
    }
    return;
  }
  var hexRgb = function (h: string) {
    return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  };
  var pal: Record<string, string> | null = c === "green" ? P.GREEN : c === "water" ? P.WATER : null;
  if (!pal) {
    if (!/^#[0-9a-fA-F]{6}$/.test(c)) return;
    var rgb = hexRgb(c).map(function (v) {
      return v / 255;
    });
    var mx = Math.max(rgb[0], rgb[1], rgb[2]), mn = Math.min(rgb[0], rgb[1], rgb[2]), l0 = (mx + mn) / 2, dd = mx - mn;
    var hue = 0, sat = 0;
    if (dd) {
      sat = l0 > 0.5 ? dd / (2 - mx - mn) : dd / (mx + mn);
      hue = 60 * (mx === rgb[0] ? (rgb[1] - rgb[2]) / dd + (rgb[1] < rgb[2] ? 6 : 0) : mx === rgb[1] ? (rgb[2] - rgb[0]) / dd + 2 : (rgb[0] - rgb[1]) / dd + 4);
    }
    // greys stay near-neutral; colours get enough body to read as colour
    sat = sat < 0.12 ? 0.1 : Math.max(0.42, Math.min(0.88, sat));
    var hsl = function (h: number, s: number, l: number) {
      var f = function (n: number) {
        var k = (n + h / 30) % 12, a = s * Math.min(l, 1 - l);
        return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))));
      };
      return [f(0), f(8), f(4)];
    };
    var lum = function (x: number[]) {
      var g = function (v: number) {
        v = v / 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      };
      return 0.2126 * g(x[0]) + 0.7152 * g(x[1]) + 0.0722 * g(x[2]);
    };
    var ratio = function (a: number[], b: number[]) {
      var x = lum(a), y = lum(b);
      return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
    };
    var WHITE = [255, 255, 255], DARK = [15, 20, 30];
    var hex = function (x: number[]) {
      return "#" + x.map(function (v) {
        var s = v.toString(16);
        return s.length < 2 ? "0" + s : s;
      }).join("");
    };
    // on white: the lightest shade that still meets t; on dark: the darkest
    var solve = function (s: number, t: number, onDark: boolean, lo: number, hi: number) {
      for (var n = 0; n < 22; n++) {
        var m = (lo + hi) / 2, ok = ratio(hsl(hue, s, m), onDark ? DARK : WHITE) >= t;
        if (onDark ? ok : !ok) hi = m;
        else lo = m;
      }
      return hex(hsl(hue, s, onDark ? hi : lo));
    };
    var tint = function (k: number, l: number) {
      return hex(hsl(hue, sat * k, l));
    };
    pal = {
      // as strong as the presets: accent text still reads on its own tints
      accent: solve(sat, 6.4, false, 0.04, 0.7),
      deep: solve(sat, 8.2, false, 0.04, 0.7),
      mark: solve(sat, 3.7, false, 0.04, 0.8),
      aqua: solve(sat, 2.2, false, 0.2, 0.95),
      label: solve(sat, 6.6, false, 0.04, 0.7),
      ctaHi: solve(sat, 5.0, false, 0.04, 0.7),
      emHi: solve(sat, 3.3, false, 0.04, 0.8),
      paper1: tint(0.75, 0.972),
      paper2: tint(0.65, 0.935),
      wash1: tint(0.7, 0.958),
      wash2: tint(0.62, 0.918),
      hero: tint(0.75, 0.982),
      shot: tint(0.45, 0.9),
      brick: tint(0.6, 0.27),
      onDark: solve(sat * 0.9, 10.5, true, 0.3, 0.97),
      onDark2: solve(sat * 0.85, 7.2, true, 0.3, 0.97),
    };
  }
  for (var j = 0; j < keys.length; j++) {
    var key = keys[j];
    d.style.setProperty(name(key), pal[key]);
    if (P.CHANNELS.indexOf(key) > -1) d.style.setProperty(name(key) + "-rgb", hexRgb(pal[key]).join(" "));
  }
}

export function applyColor(c: ColorChoice) {
  paint(PALETTES, c, document.documentElement);
}

export function readColor(): ColorChoice {
  try {
    const c = localStorage.getItem(COLOR_KEY);
    if (c) return c;
    // the old slider: its right end was green
    const t = parseFloat(localStorage.getItem(LEGACY_KEY) ?? "");
    return t > 75 ? "green" : COLOR_DEFAULT;
  } catch {
    return COLOR_DEFAULT;
  }
}

export function storeColor(c: ColorChoice) {
  try {
    localStorage.removeItem(LEGACY_KEY);
    if (c === COLOR_DEFAULT) localStorage.removeItem(COLOR_KEY);
    else localStorage.setItem(COLOR_KEY, c);
  } catch {
    /* private mode: the choice lasts for this page view */
  }
}

/** inline boot snippet: paints the stored colour before the first paint */
export const COLOR_BOOT = `(function(){try{var c=localStorage.getItem(${JSON.stringify(COLOR_KEY)});if(!c){var t=parseFloat(localStorage.getItem(${JSON.stringify(LEGACY_KEY)}));if(t>75)c='green'}if(!c||c==='red')return;(${paint.toString()})(${JSON.stringify(PALETTES)},c,document.documentElement)}catch(e){}})();`;
