/**
 * The colour slider: one value from 0 to 100 moves the light theme between
 * three palettes. 0 is "Hell" (sun white, the tints all but gone), 50 is
 * "Wasser" (the default water blue), 100 is "Grün". Text inks never move;
 * every accent in every palette holds white text and sits on white at AA.
 *
 * The values land as custom properties on <html>; the stylesheet reads
 * them through the --pw-* variables (see globals.css, "palette").
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
};

const SUN: Pal = {
  ...WATER,
  aqua: "#8fd3ec",
  paper1: "#fafcfe",
  paper2: "#f1f5f9",
  wash1: "#f8fafc",
  wash2: "#eef3f8",
  hero: "#ffffff",
  shot: "#eef2f6",
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
};

/** keys that the stylesheet also needs as "r g b" channels */
const CHANNELS = ["accent", "deep", "mark", "aqua", "paper1"];

export const TONE_DEFAULT = 50;
export const TONE_KEY = "sos_tone";

export function toneName(t: number) {
  return t < 25 ? "Hell" : t > 75 ? "Grün" : "Wasser";
}

const PALETTES = { SUN, WATER, GREEN, CHANNELS };

/**
 * The same function runs in the boot script (as a string, before first
 * paint) and in the slider, so it is written in plain ES5 without imports.
 */
function applyTone(this: void, P: typeof PALETTES, t: number, d: HTMLElement) {
  var hex = function (h: string) {
    return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  };
  var a = P.WATER;
  var b = t < 50 ? P.SUN : P.GREEN;
  var k = Math.min(1, Math.abs(t - 50) / 50);
  var keys = Object.keys(P.WATER);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var x = hex(a[key]);
    var y = hex(b[key]);
    var c = [0, 1, 2].map(function (j) {
      return Math.round(x[j] + (y[j] - x[j]) * k);
    });
    var name = "--pw-" + key.replace(/[A-Z]/g, function (m) {
      return "-" + m.toLowerCase();
    });
    if (t === 50) {
      d.style.removeProperty(name);
      d.style.removeProperty(name + "-rgb");
      continue;
    }
    d.style.setProperty(name, "rgb(" + c.join(" ") + ")");
    if (P.CHANNELS.indexOf(key) > -1) d.style.setProperty(name + "-rgb", c.join(" "));
  }
  d.style.setProperty("--pw-glow", String(t < 50 ? 1 - 0.7 * k : 1));
  if (t === 50) d.style.removeProperty("--pw-glow");
}

export function setTone(t: number) {
  applyTone(PALETTES, t, document.documentElement);
}

/** inline boot snippet: applies the stored tone before the first paint */
export const TONE_BOOT = `(function(){try{var t=parseFloat(localStorage.getItem(${JSON.stringify(TONE_KEY)}));if(isNaN(t)||t===50)return;if(document.documentElement.getAttribute('data-theme')==='dark')return;(${applyTone.toString()})(${JSON.stringify(PALETTES)},t,document.documentElement)}catch(e){}})();`;
