/**
 * The service-page tools as Web Components (custom elements). Each one
 * upgrades markup the server already rendered (light DOM, so the site's
 * styles and the translation reach it): without JavaScript the content is
 * still there, with it the tool works.
 *
 *   <sos-check>     three questions, then the likely cause and service
 *   <sos-compare>   before and after, one drawing, a handle to drag
 *   <sos-callback>  a day and a time window, then WhatsApp with the request
 */

/** Schnell-Check: one question at a time; the answers' points pick a result. */
class SosCheck extends HTMLElement {
  private steps: HTMLElement[] = [];
  private results: HTMLElement[] = [];

  connectedCallback() {
    this.steps = Array.from(this.querySelectorAll<HTMLElement>("[data-q]"));
    this.results = Array.from(this.querySelectorAll<HTMLElement>("[data-result]"));
    this.addEventListener("change", this.onChange);
    this.querySelector("[data-restart]")?.addEventListener("click", this.restart);
    this.setAttribute("data-ready", "");
    this.show(0);
  }

  disconnectedCallback() {
    this.removeEventListener("change", this.onChange);
  }

  private show(i: number) {
    this.steps.forEach((s, j) => (s.hidden = j !== i));
    this.results.forEach((r) => (r.hidden = true));
    const bar = this.querySelector<HTMLElement>("[data-progress]");
    if (bar) bar.style.setProperty("--done", String(i / this.steps.length));
    const count = this.querySelector<HTMLElement>("[data-count]");
    if (count) count.textContent = `${Math.min(i + 1, this.steps.length)} / ${this.steps.length}`;
    this.toggleAttribute("data-done", false);
  }

  private onChange = (e: Event) => {
    const input = e.target as HTMLInputElement;
    if (input.type !== "radio") return;
    const i = this.steps.findIndex((s) => s.contains(input));
    if (i < 0) return;
    // a short beat so the tap reads as chosen before the next question
    window.setTimeout(() => (i + 1 < this.steps.length ? this.next(i + 1) : this.finish()), 220);
  };

  private next(i: number) {
    this.show(i);
    this.steps[i].querySelector<HTMLInputElement>("input")?.focus({ preventScroll: true });
  }

  private finish() {
    const total: Record<string, number> = {};
    for (const input of Array.from(this.querySelectorAll<HTMLInputElement>("input[type=radio]:checked"))) {
      const score = JSON.parse(input.dataset.score || "{}") as Record<string, number>;
      for (const [k, v] of Object.entries(score)) total[k] = (total[k] || 0) + v;
    }
    const ranked = Object.entries(total).sort((a, b) => b[1] - a[1]);
    // nothing clear, or a tie at the top: measure first
    const pick = !ranked.length || (ranked[1] && ranked[1][1] === ranked[0][1]) ? "feuchtemessung" : ranked[0][0];
    this.steps.forEach((s) => (s.hidden = true));
    const res = this.results.find((r) => r.dataset.result === pick) ?? this.results.find((r) => r.dataset.result === "feuchtemessung");
    if (!res) return;
    res.hidden = false;
    this.toggleAttribute("data-done", true);
    const bar = this.querySelector<HTMLElement>("[data-progress]");
    if (bar) bar.style.setProperty("--done", "1");
    res.querySelector<HTMLElement>("[data-result-title]")?.focus({ preventScroll: true });
  }

  private restart = () => {
    this.querySelectorAll<HTMLInputElement>("input[type=radio]").forEach((r) => (r.checked = false));
    this.next(0);
  };
}

/** Vorher/Nachher: the range sets where the "before" picture ends. */
class SosCompare extends HTMLElement {
  private range: HTMLInputElement | null = null;
  private dragging = false;

  connectedCallback() {
    this.range = this.querySelector("input[type=range]");
    const stage = this.querySelector<HTMLElement>("[data-stage]");
    this.range?.addEventListener("input", this.onRange);
    stage?.addEventListener("pointerdown", this.onDown);
    window.addEventListener("pointermove", this.onMove);
    window.addEventListener("pointerup", this.onUp);
    this.setAttribute("data-ready", "");
    this.set(Number(this.range?.value ?? 50));
  }

  disconnectedCallback() {
    window.removeEventListener("pointermove", this.onMove);
    window.removeEventListener("pointerup", this.onUp);
  }

  private set(v: number) {
    const pos = Math.max(0, Math.min(100, v));
    this.style.setProperty("--pos", `${pos}%`);
    if (this.range && Number(this.range.value) !== pos) this.range.value = String(Math.round(pos));
  }

  private onRange = () => this.set(Number(this.range?.value ?? 50));

  private fromPointer(e: PointerEvent) {
    const stage = this.querySelector<HTMLElement>("[data-stage]");
    if (!stage) return;
    const r = stage.getBoundingClientRect();
    this.set(((e.clientX - r.left) / r.width) * 100);
  }

  private onDown = (e: PointerEvent) => {
    this.dragging = true;
    this.fromPointer(e);
  };

  private onMove = (e: PointerEvent) => {
    if (this.dragging) this.fromPointer(e);
  };

  private onUp = () => {
    this.dragging = false;
  };
}

/** Rückruf planen: the chosen day and time window go into a WhatsApp text. */
class SosCallback extends HTMLElement {
  connectedCallback() {
    this.labelDays();
    this.addEventListener("change", this.update);
    this.setAttribute("data-ready", "");
    this.update();
  }

  disconnectedCallback() {
    this.removeEventListener("change", this.update);
  }

  /**
   * The three day options become the next three days we are open (opening
   * hours: Mon to Fri 8 to 18, Sat 9 to 14, Sunday closed). Today counts
   * only while there is still time to call back.
   */
  private labelDays() {
    const lang = document.documentElement.lang || "de";
    const en = lang.startsWith("en");
    const now = new Date();
    const open: number[] = [];
    for (let offset = 0; open.length < 3 && offset < 10; offset++) {
      const d = new Date(now);
      d.setDate(now.getDate() + offset);
      const wd = d.getDay();
      if (wd === 0) continue;
      if (offset === 0 && now.getHours() >= (wd === 6 ? 13 : 17)) continue;
      open.push(offset);
    }
    const name = new Intl.DateTimeFormat(lang, { weekday: "long" });
    const date = new Intl.DateTimeFormat(lang, { day: "numeric", month: "numeric" });
    const inputs = Array.from(this.querySelectorAll<HTMLInputElement>("input[name$='-day']"));
    inputs.forEach((input, i) => {
      const offset = open[i];
      const d = new Date(now);
      d.setDate(now.getDate() + offset);
      input.value = String(offset);
      input.dataset.saturday = d.getDay() === 6 ? "1" : "";
      const label = input.closest("label");
      const main = label?.querySelector<HTMLElement>("[data-day-name]");
      const small = label?.querySelector<HTMLElement>("[data-day-date]");
      if (main) main.textContent = offset === 0 ? (en ? "Today" : "Heute") : offset === 1 ? (en ? "Tomorrow" : "Morgen") : name.format(d);
      if (small) small.textContent = date.format(d);
    });
  }

  private update = () => {
    const day = this.querySelector<HTMLInputElement>("input[name$='-day']:checked");
    // Saturday closes at 14:00: no afternoon call then
    const late = this.querySelector<HTMLInputElement>("input[name$='-slot'][value^='nachmittags']");
    if (late) {
      late.disabled = day?.dataset.saturday === "1";
      if (late.disabled) late.checked = false;
    }
    const slot = this.querySelector<HTMLInputElement>("input[name$='-slot']:checked");
    const link = this.querySelector<HTMLAnchorElement>("[data-send]");
    if (!link) return;
    const ready = Boolean(day && slot);
    if (!ready) {
      link.setAttribute("aria-disabled", "true");
      link.removeAttribute("href");
      return;
    }
    link.removeAttribute("aria-disabled");
    const offset = Number(day!.value);
    const d = new Date();
    d.setDate(d.getDate() + offset);
    const when = new Intl.DateTimeFormat("de-DE", { weekday: "long", day: "numeric", month: "long" }).format(d);
    const topic = this.dataset.topic ? ` Thema: ${this.dataset.topic}.` : "";
    const text = `Hallo Herr Mahmood, bitte rufen Sie mich am ${when} ${slot!.value} zurück.${topic}`;
    link.href = `https://wa.me/${this.dataset.phone}?text=${encodeURIComponent(text)}`;
  };
}

const define = (name: string, ctor: CustomElementConstructor) => {
  if (!customElements.get(name)) customElements.define(name, ctor);
};
define("sos-check", SosCheck);
define("sos-compare", SosCompare);
define("sos-callback", SosCallback);

export {};
