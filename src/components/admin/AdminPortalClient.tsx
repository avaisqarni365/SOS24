"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  FolderOpen,
  Camera,
  FileText,
  Calendar,
  HelpCircle,
  Phone,
  MessageSquare,
  Mail,
  Download,
  Printer,
  X,
  Plus,
  ExternalLink,
  LogOut,
  Calculator,
  Trash2,
  FileSignature,
  CheckSquare,
  Eye,
  Rocket,
  Globe,
  TrendingUp,
  BarChart3,
  Star,
  MapPin,
  Search,
  CheckCircle2,
  ArrowRight,
  Copy,
  Check,
  Clock,
  TriangleAlert,
  RefreshCw,
  FileCheck,
  Layers,
  Sparkles,
  BadgePercent,
  Percent,
  CreditCard,
  Ruler,
  Maximize2,
  SlidersHorizontal,
} from "lucide-react";
import { COMPANY, COMPANY_INFO } from "@/data/content-data";
import {
  getWorkspaceStore,
  saveWorkspaceStore,
  subscribeWorkspaceStore,
  WorkspaceLead,
  WorkspaceGoBDDoc,
  WorkspaceAppointment,
  StoredDrivePhoto,
  QuoteLineItem,
  LeadStatus,
  NOTIFY_EMAIL_DEFAULT,
  GAS_API_URL,
} from "@/lib/backend";

type AdminTab =
  | "overview"
  | "leads"
  | "drive"
  | "planer"
  | "belege"
  | "termine"
  | "seo"
  | "hilfe";

type SupportedLang = "en" | "de";

const STATUS_OPTIONS: LeadStatus[] = [
  "Neu",
  "In Arbeit",
  "Angebot raus",
  "Gebucht",
  "Erledigt",
  "Verloren",
];

const STATUS_I18N: Record<LeadStatus, { de: string; en: string }> = {
  Neu: { de: "Neu", en: "New" },
  "In Arbeit": { de: "In Arbeit", en: "In Progress" },
  "Angebot raus": { de: "Angebot raus", en: "Offer Sent" },
  Gebucht: { de: "Gebucht", en: "Booked" },
  Erledigt: { de: "Erledigt", en: "Completed" },
  Verloren: { de: "Verloren", en: "Lost" },
};

const HANDOVER_ITEMS = [
  {
    k: "moisture",
    de: "Vor-Ort Feuchtigkeitsmessung (CM / Mikrowelle) durchgeführt",
    en: "On-site moisture diagnostic (CM / capacitive measurement) performed",
  },
  {
    k: "foil",
    de: "Baustelleneinrichtung, Schutzfolie & Staubschutzwand installiert",
    en: "Site setup, protective plastic sheeting & dust containment installed",
  },
  {
    k: "plaster_off",
    de: "Altputz bis 80 cm über Schadensgrenze abgeschlagen & Fugen ausgekratzt",
    en: "Old moisture-damaged plaster removed 80 cm above salt line & joints raked",
  },
  {
    k: "drilling",
    de: "Bohrlochraster (10–12 cm Abstand nach WTA) gebohrt & ausgeblasen",
    en: "WTA injection boreholes (10–12 cm spacing) drilled & dust-cleared",
  },
  {
    k: "injection",
    de: "WTA-Silan-Injektionscreme lückenlos eingebracht & Bohrlöcher verschlossen",
    en: "WTA silane injection barrier cream injected & drill holes sealed",
  },
  {
    k: "sealing",
    de: "Druckwasserdichte Hohlkehle & 2K-Dichtschlämme (MDS) 2-lagig aufgetragen",
    en: "Pressure-tight waterproof cove & 2 coats of mineral sealing slurry (MDS) applied",
  },
  {
    k: "sanierputz",
    de: "WTA-Sanierputzsystem / Calciumsilikat-Klimaplatte fachgerecht aufgebracht",
    en: "WTA restoration plaster / calcium silicate climate boards installed",
  },
  {
    k: "protocol",
    de: "Trocknungs- & Abnahmeprotokoll (10 Jahre Garantie) vom Kunden unterzeichnet",
    en: "Drying protocol & handover acceptance (10-year warranty) signed by customer",
  },
  {
    k: "payment",
    de: "Abschlags- oder Schlussrechnung (§ 35a EStG) übergeben / Zahlung geklärt",
    en: "Deposit or final invoice (§ 35a tax bonus) delivered / payment confirmed",
  },
];

const WTA_TEMPLATES = [
  {
    pos_de: "Nachträgliche Horizontalsperre (WTA-Injektion)",
    pos_en: "Retrofit Horizontal Damp Barrier (WTA Injection)",
    basis_de: "Bohrlochinjektion mit Silan-Creme inkl. Verschließen",
    basis_en: "Borehole injection with silane cream incl. hole sealing",
    qty: 12,
    unit_de: "lfm",
    unit_en: "lin. m",
    price: 135,
    labour: true,
  },
  {
    pos_de: "Kellerinnenabdichtung (2K-Dichtschlämme MDS)",
    pos_en: "Interior Basement Waterproofing (2-Component Slurry)",
    basis_de: "2-lagiger Auftrag auf vorbereitetem Untergrund",
    basis_en: "2 coats applied to prepared masonry surface",
    qty: 20,
    unit_de: "m²",
    unit_en: "m²",
    price: 115,
    labour: true,
  },
  {
    pos_de: "WTA-Sanierputzsystem (Porenputz)",
    pos_en: "WTA Salt-Resistant Restoration Plaster System",
    basis_de: "Salzspeichernder Sanierputz inkl. Spritzbewurf",
    basis_en: "Salt-storing porous plaster incl. bonding splatter coat",
    qty: 20,
    unit_de: "m²",
    unit_en: "m²",
    price: 85,
    labour: true,
  },
  {
    pos_de: "Druckwasserdichte Hohlkehle",
    pos_en: "Pressure-Tight Waterproof Wall-Floor Cove",
    basis_de: "Wand-Sohlen-Anschluss ausrunden & abdichten",
    basis_en: "Rounded wall-floor joint sealing fillet",
    qty: 12,
    unit_de: "lfm",
    unit_en: "lin. m",
    price: 55,
    labour: true,
  },
  {
    pos_de: "Sporensichere Schimmelbeseitigung",
    pos_en: "Spore-Safe Mold Remediation & Sanitization",
    basis_de: "Tiefendesinfektion & Feinreinigung",
    basis_en: "Deep disinfection & particle air filtration",
    qty: 12,
    unit_de: "m²",
    unit_en: "m²",
    price: 65,
    labour: true,
  },
  {
    pos_de: "Calciumsilikat-Klimaplatte (Innendämmung)",
    pos_en: "Calcium Silicate Climate Board Insulation",
    basis_de: "Kapillaraktive Kalziumsilikatplatte inkl. Spezialkleber",
    basis_en: "Capillary-active anti-condensation insulation board",
    qty: 12,
    unit_de: "m²",
    unit_en: "m²",
    price: 110,
    labour: true,
  },
  {
    pos_de: "Hochdruck-Rissverpressung (PU / Epoxidharz)",
    pos_en: "High-Pressure Masonry Crack Injection",
    basis_de: "Setzen von Hochdruckpackern & Injektion",
    basis_en: "High-pressure injection packers with elastomeric PU resin",
    qty: 5,
    unit_de: "lfm",
    unit_en: "lin. m",
    price: 165,
    labour: true,
  },
  {
    pos_de: "Anfahrt & Baustelleneinrichtung",
    pos_en: "Site Mobilization & Dust Containment Setup",
    basis_de: "Raum Wuppertal & Bergisches Land inkl. Schutzfolie",
    basis_en: "Wuppertal & surrounding region incl. protective sheeting",
    qty: 1,
    unit_de: "Pausch.",
    unit_en: "Flat rate",
    price: 89,
    labour: true,
  },
  {
    pos_de: "Bautrocknung & Kondenstrockner (Miete)",
    pos_en: "Dehumidification & Condensation Dryer (Rental)",
    basis_de: "Hocheffizienter Kondenstrockner inkl. Stromverbrauchszähler",
    basis_en: "High-efficiency condensation dryer incl. energy metering",
    qty: 7,
    unit_de: "Tage",
    unit_en: "Days",
    price: 35,
    labour: false,
  },
  {
    pos_de: "Elektronische CM-Feuchtemessung & Protokoll",
    pos_en: "CM Moisture Diagnostic & Certified Protocol",
    basis_de: "Kalziumkarbid-Messung nach WTA-Merkblatt inkl. Schadensbericht",
    basis_en: "Calcium carbide quantitative moisture test & WTA report",
    qty: 1,
    unit_de: "Pausch.",
    unit_en: "Flat rate",
    price: 120,
    labour: true,
  },
  {
    pos_de: "Wand-Boden-Fugenabdichtung (KMB / Quellband)",
    pos_en: "Wall-Floor Joint Waterproofing Seal",
    basis_de: "Haftbrücke, Quellbandeinlage & 2K-KMB-Abdichtungskehle",
    basis_en: "Adhesion coat, swelling tape & elastomeric fillet coat",
    qty: 14,
    unit_de: "lfm",
    unit_en: "lin. m",
    price: 78,
    labour: true,
  },
];

const LOCAL_SEO_PAGES = [
  { url: "/", title: "Kellersanierung Wuppertal", kw: "Kellersanierung Wuppertal", target: "Wuppertal (PLZ 42xxx)" },
  { url: "/kellersanierung/wuppertal/", title: "Feuchter Keller Wuppertal", kw: "Feuchter Keller Wuppertal", target: "Wuppertal Zentrum & Elberfeld" },
  { url: "/kellersanierung/solingen/", title: "Kellersanierung Solingen", kw: "Kellersanierung Solingen", target: "Solingen (Ohligs, Wald, Gräfrath)" },
  { url: "/kellersanierung/remscheid/", title: "Kellersanierung Remscheid", kw: "Kellersanierung Remscheid", target: "Remscheid & Bergisches Land" },
  { url: "/kellersanierung/velbert/", title: "Kellersanierung Velbert", kw: "Kellersanierung Velbert", target: "Velbert & Niederbergischer Kreis" },
  { url: "/kellersanierung/haan/", title: "Kellersanierung Haan", kw: "Kellersanierung Haan", target: "Haan & Gruiten" },
  { url: "/kellersanierung/wermelskirchen/", title: "Kellersanierung Wermelskirchen", kw: "Kellersanierung Wermelskirchen", target: "Wermelskirchen & Umgebung" },
  { url: "/leistungen/horizontalsperre/", title: "Feuchte Wände trockenlegen", kw: "Horizontalsperre Mauerwerk", target: "NRW & Bergisches Land" },
  { url: "/leistungen/kellerinnenabdichtung/", title: "Keller von innen abdichten", kw: "Kellerinnenabdichtung", target: "NRW-weit" },
  { url: "/leistungen/schimmelbeseitigung/", title: "Schimmelbeseitigung Wuppertal", kw: "Schimmel entfernen Wuppertal", target: "Wuppertal & Umgebung" },
  { url: "/leistungen/feuchtemessung/", title: "Kostenlose Feuchtemessung", kw: "Feuchtigkeitsmessung Keller", target: "Vor-Ort Vorab-Check" },
  { url: "/leistungen/rissverpressung/", title: "Rissverpressung Beton & Mauerwerk", kw: "Rissinjektion Keller", target: "NRW-weit" },
];

function eur(n: number) {
  return n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}

const inputCls =
  "w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700";

export default function AdminPortalClient() {
  const [lang, setLang] = useState<SupportedLang>("en");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sos_admin_lang");
      if (saved === "de" || saved === "en") {
        setLang(saved);
      } else {
        setLang("en");
      }
    }
  }, []);

  const changeLang = (l: SupportedLang) => {
    setLang(l);
    if (typeof window !== "undefined") {
      localStorage.setItem("sos_admin_lang", l);
    }
  };

  const isEn = lang === "en";
  const t = (de: string, en: string) => (isEn ? en : de);

  const [unlocked, setUnlocked] = useState(false);
  const [user, setUser] = useState("shahzad");
  const [pass, setPass] = useState("");
  const [loginErr, setLoginErr] = useState("");

  const [tab, setTab] = useState<AdminTab>("overview");
  const [leads, setLeads] = useState<WorkspaceLead[]>(() => getWorkspaceStore().leads);
  const [docs, setDocs] = useState<WorkspaceGoBDDoc[]>(() => getWorkspaceStore().docs);
  const [appointments, setAppointments] = useState<WorkspaceAppointment[]>(
    () => getWorkspaceStore().appointments
  );

  const [selectedLeadId, setSelectedLeadId] = useState<string>("A-1001");
  const [selectedDocNr, setSelectedDocNr] = useState<string>("ANG-2026-0001");
  const [docFilter, setDocFilter] = useState<"all" | "offer" | "invoice">("all");
  const [docViewMode, setDocViewMode] = useState<"editor" | "preview">("editor");
  const [previewDoc, setPreviewDoc] = useState<WorkspaceGoBDDoc | null>(null);
  const [zoomPhoto, setZoomPhoto] = useState<{ photo: StoredDrivePhoto; leadId: string } | null>(
    null
  );
  const [toast, setToast] = useState<string>("");
  const [publishStatus, setPublishStatus] = useState<string>("");
  const [adminUploading, setAdminUploading] = useState(false);

  // Aufmaß-Planer state
  const [plName, setPlName] = useState("");
  const [plPhone, setPlPhone] = useState("");
  const [plAddr, setPlAddr] = useState("42103 Wuppertal");
  const [plService, setPlService] = useState("Horizontalsperre");
    // Room geometry & advanced on-site diagnostic planning state
  const [calcLen, setCalcLen] = useState<number>(14);
  const [calcHeight, setCalcHeight] = useState<number>(2.4);
  const [calcThick, setCalcThick] = useState<number>(36.5);
  const [calcMasonry, setCalcMasonry] = useState<string>("Ziegelmauerwerk");
  const [calcMoisture, setCalcMoisture] = useState<string>("80 % (Stark durchfeuchtet)");
  const [calcExpanded, setCalcExpanded] = useState<boolean>(false);

  const [plLines, setPlLines] = useState<QuoteLineItem[]>([
    {
      pos: isEn ? WTA_TEMPLATES[0].pos_en : WTA_TEMPLATES[0].pos_de,
      basis: isEn ? WTA_TEMPLATES[0].basis_en : WTA_TEMPLATES[0].basis_de,
      qty: WTA_TEMPLATES[0].qty,
      unit: isEn ? WTA_TEMPLATES[0].unit_en : WTA_TEMPLATES[0].unit_de,
      price: WTA_TEMPLATES[0].price,
      labour: WTA_TEMPLATES[0].labour,
    },
    {
      pos: isEn ? WTA_TEMPLATES[2].pos_en : WTA_TEMPLATES[2].pos_de,
      basis: isEn ? WTA_TEMPLATES[2].basis_en : WTA_TEMPLATES[2].basis_de,
      qty: WTA_TEMPLATES[2].qty,
      unit: isEn ? WTA_TEMPLATES[2].unit_en : WTA_TEMPLATES[2].unit_de,
      price: WTA_TEMPLATES[2].price,
      labour: WTA_TEMPLATES[2].labour,
    },
    {
      pos: isEn ? WTA_TEMPLATES[7].pos_en : WTA_TEMPLATES[7].pos_de,
      basis: isEn ? WTA_TEMPLATES[7].basis_en : WTA_TEMPLATES[7].basis_de,
      qty: WTA_TEMPLATES[7].qty,
      unit: isEn ? WTA_TEMPLATES[7].unit_en : WTA_TEMPLATES[7].unit_de,
      price: WTA_TEMPLATES[7].price,
      labour: WTA_TEMPLATES[7].labour,
    },
  ]);

  // Sync state with BroadcastChannel & localStorage
  useEffect(() => {
    const unsub = subscribeWorkspaceStore((store) => {
      setLeads(store.leads);
      setDocs(store.docs);
      setAppointments(store.appointments);
    });
    return unsub;
  }, []);

  const [copiedField, setCopiedField] = useState<string>("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  const copyToClipboard = (text: string, label: string, fieldKey?: string) => {
    if (typeof window !== "undefined") {
      const finish = () => {
        if (fieldKey) {
          setCopiedField(fieldKey);
          setTimeout(() => setCopiedField(""), 2200);
        }
        showToast(t(`„${label}“ in die Zwischenablage kopiert!`, `"${label}" copied to clipboard!`));
      };
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(text).then(finish, () => {
          try {
            const ta = document.createElement("textarea");
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            document.body.removeChild(ta);
            finish();
          } catch {
            // ignore
          }
        });
      } else {
        try {
          const ta = document.createElement("textarea");
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
          finish();
        } catch {
          // ignore
        }
      }
    }
  };

  const persistAll = (
    nextLeads: WorkspaceLead[],
    nextDocs: WorkspaceGoBDDoc[],
    nextApts?: WorkspaceAppointment[]
  ) => {
    setLeads(nextLeads);
    setDocs(nextDocs);
    if (nextApts) setAppointments(nextApts);
    saveWorkspaceStore({
      leads: nextLeads,
      docs: nextDocs,
      appointments: nextApts || appointments,
    });
  };

  const curLead = leads.find((l) => l.id === selectedLeadId) || leads[0];
  const curDoc = docs.find((d) => d.nr === selectedDocNr) || docs[0];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass === "SOS2026!Wuppertal" || pass === "2026" || pass === "admin") {
      setUnlocked(true);
      setLoginErr("");
    } else {
      setLoginErr(
        t(
          "Ungültiges Passwort. Test-Passwort: SOS2026!Wuppertal",
          "Invalid password. Master password: SOS2026!Wuppertal"
        )
      );
    }
  };

  const calcLeadTotal = (lead: WorkspaceLead) =>
    (lead.lines || []).reduce((sum, item) => sum + item.qty * item.price, 0);

  const calcDocTotals = (doc?: WorkspaceGoBDDoc | null) => {
    if (!doc) {
      return {
        net: 0,
        vat: 0,
        gross: 0,
        rawNet: 0,
        discountAmount: 0,
        labourNet: 0,
        materialNet: 0,
        labourGross: 0,
        taxBonus20: 0,
        labourPct: 0,
        materialPct: 0,
        skontoAmount: 0,
      };
    }
    const lines = doc.lines || [];
    const rawNet = lines.reduce((sum, item) => sum + (Number(item.qty) || 0) * (Number(item.price) || 0), 0);
    const discountRate = (Number(doc.discountPct) || 0) / 100;
    const discountAmount = rawNet * discountRate;
    const net = Math.max(0, rawNet - discountAmount);

    const labourNetRaw = lines
      .filter((i) => i.labour)
      .reduce((sum, item) => sum + (Number(item.qty) || 0) * (Number(item.price) || 0), 0);
    const labourNet = Math.max(0, labourNetRaw * (1 - discountRate));
    const materialNet = Math.max(0, net - labourNet);

    const vatRate = doc.vatRate ?? 19;
    const vat = net * (vatRate / 100);
    const gross = net + vat;
    const labourGross = labourNet * (1 + vatRate / 100);
    // Under German § 35a Abs. 3 EStG: 20% craft labor tax credit, capped at 1,200 EUR/year
    const taxBonus20 = Math.min(1200, labourGross * 0.2);
    const labourPct = net > 0 ? Math.round((labourNet / net) * 100) : 0;
    const materialPct = 100 - labourPct;
    const skontoRate = doc.skontoPct ?? 2;
    const skontoAmount = (gross * skontoRate) / 100;

    return {
      net,
      vat,
      gross,
      rawNet,
      discountAmount,
      labourNet,
      materialNet,
      labourGross,
      taxBonus20,
      labourPct,
      materialPct,
      skontoAmount,
    };
  };

  const applyRoomGeometry = () => {
    const lfmVal = Math.round(calcLen * 10) / 10;
    const m2Val = Math.round(calcLen * calcHeight * 10) / 10;

    setPlLines((prev) =>
      prev.map((line) => {
        const u = (line.unit || "").toLowerCase();
        if (u.includes("lfm") || u.includes("lin")) {
          return { ...line, qty: lfmVal };
        }
        if (u.includes("m²") || u.includes("m2") || u.includes("qm")) {
          return { ...line, qty: m2Val };
        }
        return line;
      })
    );

    showToast(
      t(
        `Raummaße übernommen: ${lfmVal} lfm · ${m2Val} m² auf alle Positionen angewendet!`,
        `Room dimensions applied: ${lfmVal} lin. m · ${m2Val} m² updated on all items!`
      )
    );
  };

  const applyPriceAdjustmentToPlaner = (multiplier: number, label: string) => {
    setPlLines((prev) =>
      prev.map((l) => ({
        ...l,
        price: Math.max(1, Math.round(l.price * multiplier)),
      }))
    );
    showToast(t(`Preisanpassung (${label}) auf Aufmaß angewendet.`, `Price adjustment (${label}) applied to estimate.`));
  };

  const applyPriceAdjustmentToDoc = (multiplier: number, label: string) => {
    updateCurDoc((doc) => ({
      ...doc,
      lines: (doc.lines || []).map((l) => ({
        ...l,
        price: Math.max(1, Math.round(l.price * multiplier)),
      })),
    }));
    showToast(t(`Preise um ${label} angepasst.`, `Prices adjusted by ${label}.`));
  };

  const setDocDiscount = (pct: number) => {
    updateCurDoc((doc) => ({
      ...doc,
      discountPct: pct,
    }));
    showToast(t(`Rabatt auf ${pct} % gesetzt.`, `Discount set to ${pct} %.`));
  };

  const getDocDateStatus = (doc: WorkspaceGoBDDoc) => {
    const s = (doc.status || "").toLowerCase();
    if (s.includes("bezahlt") || s.includes("paid")) {
      return {
        label: t("Bezahlt", "Paid"),
        color: "bg-emerald-100 text-emerald-800 border-emerald-300",
        days: 0,
        isOverdue: false,
        isPaid: true,
      };
    }
    if (s.includes("storn") || s.includes("void")) {
      return {
        label: t("Storniert", "Voided"),
        color: "bg-slate-100 text-slate-700 border-slate-300",
        days: 0,
        isOverdue: false,
        isPaid: false,
      };
    }
    if (!doc.dueOrValid) {
      return {
        label: doc.status || t("Offen", "Open"),
        color: "bg-slate-100 text-slate-700 border-slate-300",
        days: 0,
        isOverdue: false,
        isPaid: false,
      };
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(doc.dueOrValid);
    due.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        label: t(`Überfällig um ${Math.abs(diffDays)} Tage`, `Overdue by ${Math.abs(diffDays)} days`),
        color: "bg-rose-100 text-rose-800 border-rose-300 font-bold",
        days: diffDays,
        isOverdue: true,
        isPaid: false,
      };
    }
    if (diffDays === 0) {
      return {
        label: t("Heute fällig", "Due today"),
        color: "bg-amber-100 text-amber-900 border-amber-300 font-bold",
        days: 0,
        isOverdue: false,
        isPaid: false,
      };
    }
    return {
      label: t(`Noch ${diffDays} Tage bis Fälligkeit`, `${diffDays} days remaining`),
      color: "bg-sky-100 text-sky-800 border-sky-300 font-bold",
      days: diffDays,
      isOverdue: false,
      isPaid: false,
    };
  };

  const updateCurDoc = (updater: (prev: WorkspaceGoBDDoc) => WorkspaceGoBDDoc) => {
    if (!curDoc) return;
    const nextDocs = docs.map((d) => (d.nr === curDoc.nr ? updater(d) : d));
    persistAll(leads, nextDocs);
  };

  const updateLine = (idx: number, patch: Partial<QuoteLineItem>) => {
    updateCurDoc((doc) => {
      const newLines = (doc.lines || []).map((l, i) => (i === idx ? { ...l, ...patch } : l));
      return { ...doc, lines: newLines };
    });
  };

  const removeLine = (idx: number) => {
    updateCurDoc((doc) => {
      const newLines = (doc.lines || []).filter((_, i) => i !== idx);
      return { ...doc, lines: newLines };
    });
  };

  const duplicateLine = (idx: number) => {
    updateCurDoc((doc) => {
      const line = (doc.lines || [])[idx];
      if (!line) return doc;
      const newLines = [...(doc.lines || [])];
      newLines.splice(idx + 1, 0, { ...line, pos: `${line.pos} (Kopie)` });
      return { ...doc, lines: newLines };
    });
  };

  const addBlankLine = () => {
    updateCurDoc((doc) => ({
      ...doc,
      lines: [
        ...(doc.lines || []),
        {
          pos: isEn ? "Custom Waterproofing Service" : "Individuelle Sanierungsleistung",
          basis: isEn ? "Specification / notes" : "Technische Ausführung nach WTA",
          qty: 1,
          unit: isEn ? "Flat rate" : "Pausch.",
          price: 100,
          labour: true,
        },
      ],
    }));
  };

  const addTemplateLine = (tpl: typeof WTA_TEMPLATES[0]) => {
    updateCurDoc((doc) => ({
      ...doc,
      lines: [
        ...(doc.lines || []),
        {
          pos: isEn ? tpl.pos_en : tpl.pos_de,
          basis: isEn ? tpl.basis_en : tpl.basis_de,
          qty: tpl.qty,
          unit: isEn ? tpl.unit_en : tpl.unit_de,
          price: tpl.price,
          labour: tpl.labour,
        },
      ],
    }));
    showToast(t(`Position "${isEn ? tpl.pos_en : tpl.pos_de}" hinzugefügt.`, `Added "${isEn ? tpl.pos_en : tpl.pos_de}".`));
  };

  const setDocStatus = (status: string) => {
    updateCurDoc((doc) => ({ ...doc, status }));
    showToast(t(`Status auf "${status}" aktualisiert.`, `Status updated to "${status}".`));
  };

  const setPaymentPreset = (days: number, skonto: number = 0) => {
    const baseDate = curDoc?.date ? new Date(curDoc.date) : new Date();
    const due = new Date(baseDate.getTime() + days * 86400000).toISOString().slice(0, 10);
    updateCurDoc((doc) => ({
      ...doc,
      dueOrValid: due,
      paymentTermsDays: days,
      skontoPct: skonto,
    }));
    showToast(
      t(
        `Zahlungsziel auf ${days} Tage (${due}) gesetzt.`,
        `Payment terms set to ${days} days (${due}).`
      )
    );
  };

  const convertOfferToInvoice = (offerDoc: WorkspaceGoBDDoc) => {
    const seq = docs.filter((d) => d.type === "invoice" || d.nr.startsWith("RE-")).length + 1;
    const nr = `RE-2026-${String(seq).padStart(4, "0")}`;
    const today = new Date().toISOString().slice(0, 10);
    const due = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);

    const newInvoice: WorkspaceGoBDDoc = {
      nr,
      type: "invoice",
      typeLabel: t("Rechnung", "Invoice"),
      leadId: offerDoc.leadId,
      name: offerDoc.name,
      address: offerDoc.address,
      email: offerDoc.email,
      phone: offerDoc.phone,
      service: `${offerDoc.service} (Ref: ${offerDoc.nr})`,
      date: today,
      dueOrValid: due,
      status: t("Offen", "Open"),
      vatRate: offerDoc.vatRate ?? 19,
      discountPct: offerDoc.discountPct ?? 0,
      driveFolder: "SOS Abdichtung - Belege / 2026",
      lines: JSON.parse(JSON.stringify(offerDoc.lines || [])),
      refOfferNr: offerDoc.nr,
      paymentTermsDays: 14,
      skontoPct: 2,
      skontoDays: 7,
    };

    const nextDocs = [
      newInvoice,
      ...docs.map((d) =>
        d.nr === offerDoc.nr
          ? {
              ...d,
              status: t("Angenommen & Abgerechnet", "Accepted & Invoiced"),
            }
          : d
      ),
    ];

    const nextLeads = leads.map((l) =>
      l.id === offerDoc.leadId ? { ...l, status: "Gebucht" as LeadStatus } : l
    );

    persistAll(nextLeads, nextDocs);
    setSelectedDocNr(nr);
    setTab("belege");
    showToast(
      t(
        `Erfolg: Angebot ${offerDoc.nr} mit 1 Klick in Rechnung ${nr} überführt!`,
        `Success: Quote ${offerDoc.nr} converted into Invoice ${nr} in 1 click!`
      )
    );
  };

  const createNewEmptyDoc = (type: "offer" | "invoice") => {
    const seq =
      docs.filter((d) => (type === "offer" ? d.nr.startsWith("ANG-") : d.nr.startsWith("RE-"))).length +
      1;
    const prefix = type === "offer" ? "ANG-2026-" : "RE-2026-";
    const nr = `${prefix}${String(seq).padStart(4, "0")}`;
    const newDoc: WorkspaceGoBDDoc = {
      nr,
      type,
      typeLabel: type === "offer" ? t("Angebot", "Quote") : t("Rechnung", "Invoice"),
      leadId: `M-${1000 + seq}`,
      name: isEn ? "New Customer" : "Neuer Kunde",
      address: "Musterstraße 1, 42103 Wuppertal",
      email: "",
      phone: "+49 202 5550190",
      service: isEn ? "Basement Waterproofing (WTA)" : "Kellerabdichtung nach WTA-Merkblatt",
      date: new Date().toISOString().slice(0, 10),
      dueOrValid: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      status: type === "offer" ? t("Entwurf", "Draft") : t("Offen", "Open"),
      vatRate: 19,
      discountPct: 0,
      driveFolder: "SOS Abdichtung - Belege / 2026",
      lines: [
        {
          pos: isEn ? WTA_TEMPLATES[0].pos_en : WTA_TEMPLATES[0].pos_de,
          basis: isEn ? WTA_TEMPLATES[0].basis_en : WTA_TEMPLATES[0].basis_de,
          qty: 12,
          unit: isEn ? WTA_TEMPLATES[0].unit_en : WTA_TEMPLATES[0].unit_de,
          price: 135,
          labour: true,
        },
      ],
      paymentTermsDays: 14,
      skontoPct: 2,
      skontoDays: 7,
    };
    const nextDocs = [newDoc, ...docs];
    persistAll(leads, nextDocs);
    setSelectedDocNr(nr);
    showToast(t(`Neuer Beleg ${nr} erfolgreich angelegt.`, `New document ${nr} successfully created.`));
  };

  const createOfferFromPlaner = () => {
    const newId = `A-${1001 + leads.length}`;
    const nl: WorkspaceLead = {
      id: newId,
      received: new Date().toLocaleString(isEn ? "en-US" : "de-DE"),
      status: "Angebot raus",
      owner: COMPANY_INFO.owner,
      name: plName || (isEn ? "On-Site Customer" : "Vor-Ort-Kunde"),
      phone: plPhone || COMPANY_INFO.phoneDisplay,
      email: "",
      address: plAddr,
      damageType: plService,
      area: `${plLines[0]?.qty || 10} ${plLines[0]?.unit || "lfm"}`,
      date: new Date().toISOString().slice(0, 10),
      notes: isEn ? "Created in On-Site Estimator" : "Erstellt im Aufmaß-Planer",
      message: isEn ? "On-site moisture diagnostic & measurement" : "Vor-Ort-Feuchtigkeitsmessung & Aufmaß",
      source: "Aufmaß-Planer (/admin/)",
      photosDriveUrl: "https://drive.google.com/drive/u/0/my-drive",
      photos: [],
      token: "localtoken",
      handover: { moisture: true },
      handoverNote: "",
      lines: plLines,
    };
    const nextLeads = [nl, ...leads];

    const seq = docs.filter((d) => d.type === "offer" || d.nr.startsWith("ANG-")).length + 1;
    const nr = `ANG-2026-${String(seq).padStart(4, "0")}`;
    const newDoc: WorkspaceGoBDDoc = {
      nr,
      type: "offer",
      typeLabel: t("Angebot", "Quote"),
      leadId: nl.id,
      name: nl.name,
      address: nl.address,
      email: nl.email,
      phone: nl.phone,
      service: `${nl.damageType} (${nl.id})`,
      date: new Date().toISOString().slice(0, 10),
      dueOrValid: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      status: t("Versendet", "Sent"),
      vatRate: 19,
      discountPct: 0,
      driveFolder: "SOS Abdichtung - Belege / 2026",
      lines: JSON.parse(JSON.stringify(plLines)),
      paymentTermsDays: 14,
      skontoPct: 2,
      skontoDays: 7,
    };

    const nextDocs = [newDoc, ...docs];
    persistAll(nextLeads, nextDocs);
    setSelectedDocNr(nr);
    setTab("belege");
    showToast(
      t(
        `GoBD-Angebot ${nr} aus Aufmaß erstellt! Sie können es nun direkt prüfen oder in 1 Klick in eine Rechnung überführen.`,
        `GoBD Quote ${nr} created from estimate! You can now edit lines or convert to Invoice in 1 click.`
      )
    );
  };

  const createInvoiceDirectlyFromPlaner = () => {
    const newId = `A-${1001 + leads.length}`;
    const nl: WorkspaceLead = {
      id: newId,
      received: new Date().toLocaleString(isEn ? "en-US" : "de-DE"),
      status: "Gebucht",
      owner: COMPANY_INFO.owner,
      name: plName || (isEn ? "On-Site Customer" : "Vor-Ort-Kunde"),
      phone: plPhone || COMPANY_INFO.phoneDisplay,
      email: "",
      address: plAddr,
      damageType: plService,
      area: `${plLines[0]?.qty || 10} ${plLines[0]?.unit || "lfm"}`,
      date: new Date().toISOString().slice(0, 10),
      notes: isEn ? "Created in On-Site Estimator" : "Erstellt im Aufmaß-Planer",
      message: isEn ? "Direct on-site order billing" : "Direktabrechnung Vor-Ort-Auftrag",
      source: "Aufmaß-Planer (/admin/)",
      photosDriveUrl: "https://drive.google.com/drive/u/0/my-drive",
      photos: [],
      token: "localtoken",
      handover: { moisture: true },
      handoverNote: "",
      lines: plLines,
    };
    const nextLeads = [nl, ...leads];

    const seq = docs.filter((d) => d.type === "invoice" || d.nr.startsWith("RE-")).length + 1;
    const nr = `RE-2026-${String(seq).padStart(4, "0")}`;
    const newDoc: WorkspaceGoBDDoc = {
      nr,
      type: "invoice",
      typeLabel: t("Rechnung", "Invoice"),
      leadId: nl.id,
      name: nl.name,
      address: nl.address,
      email: nl.email,
      phone: nl.phone,
      service: `${nl.damageType} (${nl.id})`,
      date: new Date().toISOString().slice(0, 10),
      dueOrValid: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      status: t("Offen", "Open"),
      vatRate: 19,
      discountPct: 0,
      driveFolder: "SOS Abdichtung - Belege / 2026",
      lines: JSON.parse(JSON.stringify(plLines)),
      paymentTermsDays: 14,
      skontoPct: 2,
      skontoDays: 7,
    };

    const nextDocs = [newDoc, ...docs];
    persistAll(nextLeads, nextDocs);
    setSelectedDocNr(nr);
    setTab("belege");
    showToast(
      t(
        `GoBD-Rechnung ${nr} direkt aus Aufmaß erstellt!`,
        `GoBD Invoice ${nr} created directly from estimate!`
      )
    );
  };

  const createDocFromLead = (lead: WorkspaceLead, type: "offer" | "invoice") => {
    const seq = docs.filter((d) => (type === "offer" ? d.nr.startsWith("ANG-") : d.nr.startsWith("RE-"))).length + 1;
    const prefix = type === "offer" ? "ANG-2026-" : "RE-2026-";
    const nr = `${prefix}${String(seq).padStart(4, "0")}`;
    const newDoc: WorkspaceGoBDDoc = {
      nr,
      type,
      typeLabel: type === "offer" ? t("Angebot", "Quote") : t("Rechnung", "Invoice"),
      leadId: lead.id,
      name: lead.name,
      address: lead.address,
      email: lead.email,
      phone: lead.phone,
      service: `${lead.damageType} (${lead.id})`,
      date: new Date().toISOString().slice(0, 10),
      dueOrValid: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      status: type === "offer" ? t("Versendet", "Sent") : t("Offen", "Open"),
      vatRate: 19,
      discountPct: 0,
      driveFolder: "SOS Abdichtung - Belege / 2026",
      lines: lead.lines && lead.lines.length > 0 ? lead.lines : [
        {
          pos: isEn ? WTA_TEMPLATES[0].pos_en : WTA_TEMPLATES[0].pos_de,
          basis: isEn ? WTA_TEMPLATES[0].basis_en : WTA_TEMPLATES[0].basis_de,
          qty: 12,
          unit: isEn ? WTA_TEMPLATES[0].unit_en : WTA_TEMPLATES[0].unit_de,
          price: 135,
          labour: true,
        },
      ],
      paymentTermsDays: 14,
      skontoPct: 2,
      skontoDays: 7,
    };

    const nextDocs = [newDoc, ...docs];
    const nextLeads = leads.map((l) => (l.id === lead.id ? { ...l, status: "Angebot raus" as LeadStatus } : l));
    persistAll(nextLeads, nextDocs);
    setSelectedDocNr(nr);
    setTab("belege");
    showToast(t(`GoBD-Beleg ${nr} erfolgreich generiert und in Google Drive archiviert.`, `GoBD document ${nr} created and saved in Google Drive.`));
  };

  const sendHandoverWhatsApp = (lead: WorkspaceLead) => {
    const checkedCount = HANDOVER_ITEMS.filter((i) => lead.handover[i.k]).length;
    const text = encodeURIComponent(
      `*SOS Abdichtung · Übergabe-Checkliste*\n` +
      `Anfrage: ${lead.id} – ${lead.name}\n` +
      `Adresse: ${lead.address}\n` +
      `Status: ${checkedCount}/${HANDOVER_ITEMS.length} Punkte abgehakt\n` +
      `Notiz: ${lead.handoverNote || "Keine Beanstandung"}\n` +
      `Google Drive: ${lead.photosDriveUrl}`
    );
    window.open(`https://wa.me/491722064177?text=${text}`, "_blank");
  };

  const handleAdminPhotoUpload = (lead: WorkspaceLead, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setAdminUploading(true);

    const uploads: Promise<StoredDrivePhoto>[] = Array.from(files).map((file) => {
      return new Promise((resolve) => {
        const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
        const reader = new FileReader();
        if (isPdf) {
          reader.onload = () => {
            resolve({
              name: `${lead.id}_Dokument_${file.name.replace(/\s+/g, "_")}`,
              dataUrl: String(reader.result),
              uploadedAt: new Date().toLocaleString(isEn ? "en-US" : "de-DE"),
              driveFolder: `SOS Abdichtung - Schadensfotos / ${lead.id}`,
              fileType: "pdf",
            });
          };
          reader.readAsDataURL(file);
        } else {
          reader.onload = () => {
            const img = new Image();
            img.onload = () => {
              const maxDim = 1200;
              let { width, height } = img;
              if (width > maxDim || height > maxDim) {
                if (width > height) {
                  height = Math.round((height * maxDim) / width);
                  width = maxDim;
                } else {
                  width = Math.round((width * maxDim) / height);
                  height = maxDim;
                }
              }
              const canvas = document.createElement("canvas");
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext("2d");
              if (ctx) ctx.drawImage(img, 0, 0, width, height);
              const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
              resolve({
                name: `${lead.id}_Inspektion_${file.name.replace(/\s+/g, "_")}`,
                dataUrl,
                uploadedAt: new Date().toLocaleString(isEn ? "en-US" : "de-DE"),
                driveFolder: `SOS Abdichtung - Schadensfotos / ${lead.id}`,
                fileType: "image",
              });
            };
            img.src = reader.result as string;
          };
          reader.readAsDataURL(file);
        }
      });
    });

    Promise.all(uploads).then((newPhotos) => {
      const nextLeads = leads.map((l) =>
        l.id === lead.id
          ? {
              ...l,
              photos: [...(l.photos || []), ...newPhotos],
            }
          : l
      );
      persistAll(nextLeads, docs);
      setAdminUploading(false);
      showToast(t(`✓ ${newPhotos.length} Datei(en) hinzugefügt & in Google Drive synchronisiert.`, `✓ ${newPhotos.length} file(s) added & synced to Google Drive.`));
    });
  };

  const totalPhotosCount = leads.reduce((sum, l) => sum + (l.photos?.length || 0), 0);

  // Language switch component
  const LanguageSwitcher = ({ inNav = false }: { inNav?: boolean }) => (
    <div
      className={`inline-flex items-center rounded-xl p-0.5 border ${
        inNav ? "bg-white/10 border-white/20" : "bg-slate-100 border-slate-300"
      }`}
    >
      <button
        type="button"
        onClick={() => changeLang("en")}
        className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 ${
          lang === "en"
            ? inNav
              ? "bg-emerald-600 text-white shadow-sm"
              : "bg-[#0f2537] text-white shadow-sm"
            : inNav
            ? "text-slate-300 hover:text-white"
            : "text-slate-600 hover:text-slate-900"
        }`}
      >
        <span>🇬🇧</span>
        <span>EN</span>
      </button>
      <button
        type="button"
        onClick={() => changeLang("de")}
        className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 ${
          lang === "de"
            ? inNav
              ? "bg-emerald-600 text-white shadow-sm"
              : "bg-[#0f2537] text-white shadow-sm"
            : inNav
            ? "text-slate-300 hover:text-white"
            : "text-slate-600 hover:text-slate-900"
        }`}
      >
        <span>🇩🇪</span>
        <span>DE</span>
      </button>
    </div>
  );

  // Login Screen
  if (!unlocked) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200 font-plex text-slate-900">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
            SOS
          </div>
          <LanguageSwitcher />
        </div>

        <h2 className="text-xl sm:text-2xl font-extrabold text-[#0f2537] mb-1">
          {t("Admin-Zugang (Shahzad Mahmood)", "Admin Access (Shahzad Mahmood)")}
        </h2>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          {t(
            `Geben Sie das Master-Passwort ein, um alle Kundenanfragen, Google Drive Schadensfotos & Dokumente (${totalPhotosCount} Dateien), Verträge und GoBD-Belege zu verwalten.`,
            `Enter master password to access customer inquiries, Google Drive damage photos & documents (${totalPhotosCount} files), contracts, and GoBD invoices.`
          )}
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="adm-user" className="block text-xs font-bold text-slate-800 mb-1.5">
              {t("Benutzername", "Username")}
            </label>
            <input
              id="adm-user"
              type="text"
              required
              autoComplete="username"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="adm-pass" className="block text-xs font-bold text-slate-800 mb-1.5">
              {t("Passwort / PIN", "Password / PIN")}
            </label>
            <input
              id="adm-pass"
              type="password"
              required
              autoComplete="current-password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder={t("Standard: SOS2026!Wuppertal", "Default: SOS2026!Wuppertal")}
              className={inputCls}
            />
          </div>
          {loginErr && <p className="text-xs font-bold text-red-600">{loginErr}</p>}
          <button
            type="submit"
            className="w-full min-h-[48px] bg-[#0f2537] hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl text-sm transition-colors"
          >
            {t("Im Admin-Portal anmelden →", "Log in to Admin Dashboard →")}
          </button>
          <button
            type="button"
            onClick={() => {
              setPass("SOS2026!Wuppertal");
              setUnlocked(true);
            }}
            className="w-full min-h-[48px] bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-colors"
          >
            {t("⚡ 1-Klick Schnellzugriff öffnen", "⚡ 1-Click Quick Access (Shahzad Mahmood)")}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-200 text-xs text-slate-600 space-y-1.5 break-words">
          <div>
            <strong>{t("Verknüpftes Google-Konto:", "Linked Google Account:")}</strong>{" "}
            <span className="break-all">{NOTIFY_EMAIL_DEFAULT}</span>
          </div>
          <div>
            <strong>{t("Inhaber:", "Business Owner:")}</strong> {COMPANY_INFO.owner} ({COMPANY_INFO.phoneDisplay})
          </div>
        </div>
      </div>
    );
  }

  const docTotals = calcDocTotals(curDoc);
  const curLeadDocs = docs.filter((d) => d.leadId === curLead?.id);

  const renderDIN5008Invoice = (doc: WorkspaceGoBDDoc, isModal: boolean = false) => {
    const tTotals = calcDocTotals(doc);
    const isInvoice = doc.type === "invoice";
    const issueDateFormatted = doc.date;
    const dueDateFormatted = doc.dueOrValid;

    return (
      <div
        id="printable-invoice"
        className={`bg-white text-slate-900 font-sans leading-normal ${
          isModal
            ? "p-4 sm:p-8 space-y-6"
            : "border border-slate-200 rounded-2xl shadow-xl p-6 sm:p-10 space-y-6 max-w-4xl mx-auto"
        }`}
      >
        {/* 1. Header with Official SOS-Abdichtung Logo & SchimmelPeter Partner Badge */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-[#0f2537] pb-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <img
                src="/logo.svg"
                alt="SOS-Abdichtung Logo"
                className="h-9 sm:h-11 w-auto object-contain"
              />
              <div className="h-8 w-px bg-slate-300 hidden sm:block" />
              <img
                src="/img/gallery/schimmelpeter-fachbetrieb.svg"
                alt="SchimmelPeter® Partnerbetrieb"
                className="h-8 sm:h-10 w-auto object-contain"
              />
            </div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
              {t(
                "Zertifizierter Fachbetrieb für Kellersanierung · WTA-konform",
                "Certified Basement Waterproofing Specialist · WTA Standard"
              )}
            </div>
          </div>

          <div className="sm:text-right text-[11px] text-slate-600 space-y-0.5">
            <div className="font-extrabold text-[#0f2537] text-xs sm:text-sm">
              {COMPANY_INFO.fullName}
            </div>
            <div>
              {t("Inhaber:", "Owner:")} <span className="font-bold text-slate-900">{COMPANY_INFO.owner}</span>
            </div>
            <div>{COMPANY_INFO.street} · {COMPANY_INFO.city}</div>
            <div>
              Tel.: <span className="font-bold text-slate-900">{COMPANY_INFO.phoneDisplay}</span>
            </div>
            <div>E-Mail: {COMPANY_INFO.email} · Web: sos-abdichtung.de</div>
          </div>
        </div>

        {/* 2. DIN 5008 Anschriftenzone (Address Zone) & Document Info Box */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 pt-2">
          {/* Left 7 cols: Address */}
          <div className="sm:col-span-7 space-y-2.5">
            {/* DIN 5008 Return Line (Absenderzeile für Fensterbriefumschlag) */}
            <div className="text-[10px] text-slate-400 border-b border-slate-200 pb-1 font-mono">
              sos-abdichtung · {COMPANY_INFO.owner} · {COMPANY_INFO.street} · {COMPANY_INFO.city}
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {t("Empfänger / Auftraggeber", "Recipient / Customer")}
              </div>
              <div className="text-base font-black text-slate-900">
                {doc.name || t("Kunde", "Customer")}
              </div>
              <div className="text-xs text-slate-700 whitespace-pre-line leading-relaxed font-medium">
                {doc.address || "Objektadresse Wuppertal"}
              </div>
              {doc.phone && <div className="text-xs text-slate-500 pt-0.5">Tel.: {doc.phone}</div>}
              {doc.email && <div className="text-xs text-slate-500">E-Mail: {doc.email}</div>}
            </div>
          </div>

          {/* Right 5 cols: Official German Document Meta Infobox */}
          <div className="sm:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                {doc.typeLabel}
              </span>
              <span className="text-sm font-black font-mono text-emerald-800">
                {doc.nr}
              </span>
            </div>

            <div className="flex justify-between py-0.5">
              <span className="text-slate-500">{t("Ausstellungsdatum:", "Date:")}</span>
              <strong className="text-slate-900">{issueDateFormatted}</strong>
            </div>

            <div className="flex justify-between py-0.5">
              <span className="text-slate-500">
                {isInvoice ? t("Fälligkeitsdatum:", "Due Date:") : t("Gültig bis:", "Valid Until:")}
              </span>
              <strong className="text-slate-900">{dueDateFormatted}</strong>
            </div>

            <div className="flex justify-between py-0.5">
              <span className="text-slate-500">{t("Leistungszeitpunkt:", "Performance Date:")}</span>
              <span className="font-semibold text-slate-800">{t("Gemäß Abnahme", "As executed")}</span>
            </div>

            <div className="flex justify-between py-0.5 border-t border-slate-200 pt-1.5">
              <span className="text-slate-500">{t("Projekt- / Lead-ID:", "Lead / Project:")}</span>
              <span className="font-mono font-bold text-slate-700">{doc.leadId}</span>
            </div>

            {doc.refOfferNr && (
              <div className="flex justify-between py-0.5 text-emerald-700 font-semibold">
                <span>{t("Basierend auf Angebot:", "Based on Quote:")}</span>
                <span className="font-mono">{doc.refOfferNr}</span>
              </div>
            )}

            <div className="flex justify-between py-0.5 text-slate-500 text-[11px] border-t border-slate-200 pt-1.5">
              <span>USt-Status:</span>
              <span>{doc.vatRate === 19 ? "19 % Regelbesteuerung (§ 14 UStG)" : `${doc.vatRate} % gem. UStG`}</span>
            </div>
          </div>
        </div>

        {/* 3. Document Subject & Introduction */}
        <div className="border-b-2 border-slate-900 pb-3 pt-2">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {doc.typeLabel.toUpperCase()} {doc.nr}
          </h3>
          <div className="text-sm font-bold text-emerald-800 mt-1">
            {t("Bauvorhaben / Gewerk:", "Project / Trade:")} {doc.service || "Kellersanierung & Bauwerksabdichtung nach WTA-Richtlinien"}
          </div>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            {isInvoice
              ? t(
                  "Sehr geehrte Damen und Herren, für die nachfolgend aufgeführten Sanierungs- und Abdichtungsarbeiten an Ihrem Objekt erlauben wir uns, vereinbarungsgemäß folgende Leistungen nach VOB/BGB und WTA-Merkblatt in Rechnung zu stellen:",
                  "Dear Sir or Madam, for the masonry waterproofing work completed at your property, we bill the following line items according to German VOB/BGB and WTA specifications:"
                )
              : t(
                  "Sehr geehrte Damen und Herren, vielen Dank für Ihre Anfrage und das Vertrauen in unseren zertifizierten Fachbetrieb. Gerne unterbreiten wir Ihnen für die Sanierung Ihres Objektes folgendes verbindliches Festpreisangebot:",
                  "Dear Sir or Madam, thank you for your inquiry and trust in our certified company. We submit the following binding fixed-price quote for your property restoration:"
                )}
          </p>
        </div>

        {/* 4. Table of Items (Positionstabelle) */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b-2 border-slate-900 text-left text-[11px] uppercase tracking-wider text-slate-600 bg-slate-50">
                <th className="py-2.5 px-2 w-10 text-center font-bold">Pos.</th>
                <th className="py-2.5 px-3 font-bold">{t("Bezeichnung & technische Ausführungsgrundlage", "Item & Specification")}</th>
                <th className="py-2.5 px-2 text-right font-bold w-20">{t("Menge", "Qty")}</th>
                <th className="py-2.5 px-2 text-right font-bold w-24">{t("Einzelpreis", "Unit Price")}</th>
                <th className="py-2.5 px-2 text-right font-bold w-28">{t("Gesamtpreis", "Total")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {doc.lines.map((l, i) => (
                <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-2 text-center font-mono font-bold text-slate-500 align-top">
                    {i + 1}
                  </td>
                  <td className="py-3 px-3 align-top space-y-1">
                    <div className="font-extrabold text-slate-900 text-xs sm:text-sm">
                      {l.pos}
                    </div>
                    {l.basis && (
                      <div className="text-[11px] text-slate-600 leading-snug">
                        {l.basis}
                      </div>
                    )}
                    {l.labour && (
                      <div className="pt-0.5">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <Check className="w-3 h-3 text-emerald-700" />
                          <span>§ 35a Handwerkerlohn-Anteil</span>
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-2 text-right whitespace-nowrap font-semibold text-slate-800 align-top">
                    {l.qty} {l.unit}
                  </td>
                  <td className="py-3 px-2 text-right whitespace-nowrap text-slate-700 align-top">
                    {eur(l.price)}
                  </td>
                  <td className="py-3 px-2 text-right whitespace-nowrap font-black text-slate-900 align-top">
                    {eur(l.qty * l.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 5. Accounting Summary & Totals */}
        <div className="border-t-2 border-slate-900 pt-4 flex flex-col sm:flex-row justify-between items-start gap-6">
          {/* Left: Notes & Tax Bonus Indicator */}
          <div className="w-full sm:max-w-md space-y-3">
            {/* § 35a Tax Certificate Box */}
            <div className="bg-emerald-50/90 border border-emerald-300 rounded-xl p-3.5 space-y-1.5 text-xs text-emerald-950 shadow-sm">
              <div className="font-extrabold flex items-center gap-1.5 text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{t("Bescheinigung für das Finanzamt (§ 35a Abs. 3 EStG):", "Certificate for German Tax Office (§ 35a EStG):")}</span>
              </div>
              <p className="text-[11px] text-slate-700 leading-relaxed">
                {t(
                  `Im ausgewiesenen Gesamtbetrag sind reine Lohn- und Arbeitskosten in Höhe von ${eur(tTotals.labourGross)} (inkl. 19 % MwSt.) enthalten.`,
                  `The invoice total includes craft labor costs of ${eur(tTotals.labourGross)} (incl. 19% VAT).`
                )}
              </p>
              <div className="text-[11px] font-bold text-emerald-800 bg-emerald-100/70 p-2 rounded-lg border border-emerald-200">
                💰 {t("Ihre tarifliche Steuerermäßigung (20 %):", "Direct Tax Credit (20 %):")}{" "}
                <span className="text-sm font-black text-emerald-900">−{eur(tTotals.taxBonus20)}</span>
              </div>
              <div className="text-[10px] text-slate-500">
                * {t("Voraussetzung ist die unbare Begleichung per Banküberweisung.", "Requires cashless bank transfer.")}
              </div>
            </div>
          </div>

          {/* Right: Numbers */}
          <div className="w-full sm:w-72 space-y-2 text-xs sm:text-sm">
            {doc.discountPct && doc.discountPct > 0 ? (
              <>
                <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
                  <span>{t("Zwischensumme Netto:", "Subtotal Net:")}</span>
                  <span className="font-semibold">{eur(tTotals.rawNet)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 text-emerald-800">
                  <span>{t(`Rabatt / Nachlass (${doc.discountPct} %):`, `Discount (${doc.discountPct} %):`)}</span>
                  <span className="font-bold">−{eur(tTotals.discountAmount)}</span>
                </div>
              </>
            ) : null}

            <div className="flex justify-between py-1 border-b border-slate-200 text-slate-700">
              <span>{t("Nettobetrag:", "Net Total:")}</span>
              <span className="font-bold text-slate-900">{eur(tTotals.net)}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-200 text-slate-700">
              <span>{t(`zzgl. ${doc.vatRate} % Umsatzsteuer:`, `plus ${doc.vatRate} % VAT:`)}</span>
              <span className="font-bold text-slate-900">{eur(tTotals.vat)}</span>
            </div>

            <div className="flex justify-between py-2 border-b-4 border-double border-slate-900 text-base sm:text-lg font-black text-slate-950">
              <span>{t("Gesamtbetrag (Brutto):", "Gross Total:")}</span>
              <span className="text-emerald-800">{eur(tTotals.gross)}</span>
            </div>

            {doc.skontoPct && doc.skontoPct > 0 ? (
              <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 text-[11px] text-emerald-900 space-y-1">
                <div className="flex justify-between font-bold">
                  <span>{doc.skontoPct} % {t("Skonto bei Überweisung bis", "Discount if paid by")} {new Date(new Date(doc.date).getTime() + 7 * 86400000).toLocaleDateString("de-DE")}:</span>
                  <span className="text-emerald-700 font-extrabold">−{eur(tTotals.skontoAmount)}</span>
                </div>
                <div className="flex justify-between font-black text-xs pt-1 border-t border-emerald-200">
                  <span>{t("Skontierter Zahlbetrag:", "Discounted Amount:")}</span>
                  <span>{eur(tTotals.gross - tTotals.skontoAmount)}</span>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* 6. Payment Instructions & Guarantee */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
          <div className="font-bold text-slate-900">
            {t("Zahlungsbedingungen & Bankverbindung:", "Payment Terms & Bank Details:")}
          </div>
          <p className="text-slate-600 leading-relaxed">
            {t(
              `Bitte überweisen Sie den Gesamtbetrag von ${eur(tTotals.gross)} unter Angabe der Belegnummer ${doc.nr} bis zum ${dueDateFormatted} auf unser folgendes Geschäftskonto:`,
              `Please transfer the total of ${eur(tTotals.gross)} quoting document number ${doc.nr} by ${dueDateFormatted} to our account:`
            )}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-slate-800 font-mono text-[11px] bg-white p-3 rounded-lg border border-slate-200">
            <div>
              <span className="text-slate-400 block text-[10px] font-sans">{t("Kontoinhaber:", "Account Holder:")}</span>
              <strong className="text-slate-900">{COMPANY_INFO.owner}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-sans">IBAN:</span>
              <strong className="text-slate-900">DE02 3601 0043 0123 4567 89</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-sans">BIC / Bank:</span>
              <strong className="text-slate-900">PBNKDEFF · Postbank Essen</strong>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-600 border-t border-slate-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              <strong>{t("Garantie & Qualität:", "Warranty & Quality:")}</strong>{" "}
              {t(
                "10 Jahre Gewährleistung auf ausgeführte Handwerksleistungen von sos-abdichtung sowie 25 Jahre Produktgarantie durch SchimmelPeter GmbH.",
                "10-year workmanship warranty from sos-abdichtung plus 25-year manufacturer warranty from SchimmelPeter GmbH."
              )}
            </span>
          </div>
        </div>

        {/* 7. DIN 5008 3-Column Footer */}
        <div className="border-t border-slate-200 pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-[10px] text-slate-500 leading-normal">
          <div>
            <strong className="text-slate-700 block font-bold">{COMPANY_INFO.name}</strong>
            <div>Inh. {COMPANY_INFO.owner}</div>
            <div>{COMPANY_INFO.street}</div>
            <div>{COMPANY_INFO.city}</div>
          </div>
          <div>
            <strong className="text-slate-700 block font-bold">{t("Kontakt & Support", "Contact & Support")}</strong>
            <div>Tel.: {COMPANY_INFO.phoneDisplay}</div>
            <div>E-Mail: {COMPANY_INFO.email}</div>
            <div>Web: www.sos-abdichtung.de</div>
          </div>
          <div>
            <strong className="text-slate-700 block font-bold">{t("Steuer- & Rechtsangaben", "Tax & Legal Info")}</strong>
            <div>USt-IdNr.: gemäß § 14 UStG</div>
            <div>Gerichtsstand: Essen / Wuppertal</div>
            <div>SchimmelPeter® Partnerbetrieb</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 font-plex text-slate-900">
      {toast && (
        <div className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-50 bg-[#0f2537] text-white font-bold text-xs sm:text-sm px-5 py-3.5 rounded-xl shadow-xl text-center">
          {toast}
        </div>
      )}

      {/* Top Admin Navigation Bar */}
      <div className="bg-[#0f2537] text-white rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-3 h-3 rounded-full bg-emerald-400 shrink-0" />
            <span className="font-extrabold tracking-wider uppercase text-xs sm:text-sm truncate">
              SOS <span className="text-emerald-400">Abdichtung</span> · {t("Admin & Google Cloud", "Admin & Google Cloud Portal")}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-xs shrink-0 flex-wrap">
            <LanguageSwitcher inNav />
            <a
              href="https://drive.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-300 hover:text-white underline font-semibold py-1 px-1"
            >
              Google Drive ↗
            </a>
            <button
              type="button"
              onClick={() => setUnlocked(false)}
              className="min-h-[38px] inline-flex items-center gap-1.5 text-slate-200 hover:text-white bg-white/10 px-3 py-1.5 rounded-xl font-bold"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t("Abmelden", "Log Out")}</span>
            </button>
          </div>
        </div>

        <nav
          className="flex sm:grid sm:grid-cols-4 lg:grid-cols-8 gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none"
          aria-label="Admin Navigation"
        >
          {(
            [
              ["overview", t("Übersicht", "Overview"), ShieldCheck],
              ["leads", `${t("Anfragen", "Inquiries")} (${leads.length})`, FolderOpen],
              ["drive", `${t("Drive-Dateien", "Drive Files")} (${totalPhotosCount + docs.length})`, Camera],
              ["planer", t("Aufmaß-Planer", "Estimator"), Calculator],
              ["belege", `${t("Belege", "Invoices & Quotes")} (${docs.length})`, FileText],
              ["termine", t("Kalender", "Calendar"), Calendar],
              ["seo", t("SEO & Google Suite", "SEO & Google Suite"), TrendingUp],
              ["hilfe", t("1-Klick Cloud", "1-Click Cloud"), HelpCircle],
            ] as const
          ).map(([k, label, Icon]) => (
            <button
              key={k}
              type="button"
              onClick={() => setTab(k)}
              className={`min-h-[44px] shrink-0 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                tab === k
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white/5 text-slate-200 hover:bg-white/15 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* TAB 1: OVERVIEW */}
      {tab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            <button
              type="button"
              onClick={() => setTab("leads")}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm text-left hover:border-emerald-500 transition-colors"
            >
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{leads.length}</div>
              <div className="text-xs text-slate-500 mt-1">
                {t("Schadensanfragen (inkl. /kontakt/ Live-Sync) →", "Customer Inquiries (Live /kontakt/ sync) →")}
              </div>
            </button>
            <button
              type="button"
              onClick={() => setTab("drive")}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm text-left hover:border-emerald-500 transition-colors"
            >
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700">
                {totalPhotosCount} {t("Dateien", "Files")} · {docs.length} PDFs
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {t("Google Drive Dateien (Fotos, Dokumente, Belege) →", "Google Drive Cloud Files (Photos, Documents, PDFs) →")}
              </div>
            </button>
            <button
              type="button"
              onClick={() => setTab("belege")}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm text-left hover:border-emerald-500 transition-colors"
            >
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0f2537]">
                {eur(
                  docs
                    .filter((d) => d.type === "invoice")
                    .reduce((s, d) => s + calcDocTotals(d).gross, 0)
                )}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {t(
                  `Rechnungsvolumen (${docs.filter((d) => d.type === "offer").length} Angebote · ${docs.filter((d) => d.type === "invoice").length} Rechnungen) →`,
                  `Invoice Volume (${docs.filter((d) => d.type === "offer").length} Quotes · ${docs.filter((d) => d.type === "invoice").length} Invoices) →`
                )}
              </div>
            </button>
            <button
              type="button"
              onClick={() => setTab("seo")}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm text-left hover:border-emerald-500 transition-colors min-w-0"
            >
              <div className="text-base sm:text-lg font-extrabold text-emerald-700 flex items-center gap-1.5">
                <TrendingUp className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Google SEO Suite</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {t("Search Console, Maps, Analytics & LSA →", "Search Console, Maps, Analytics & Ads →")}
              </div>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-4">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  {t("Aktuelle Schadensanfragen & Fotos", "Latest Inquiries & Damage Photos")}
                </h3>
                <button
                  type="button"
                  onClick={() => setTab("leads")}
                  className="min-h-[40px] px-2 text-xs font-bold text-emerald-700 hover:underline shrink-0"
                >
                  {t("Alle öffnen →", "View all →")}
                </button>
              </div>
              <div className="divide-y divide-slate-200">
                {leads.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => {
                      setSelectedLeadId(l.id);
                      setTab("leads");
                    }}
                    className="w-full py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-left hover:bg-slate-50 px-2.5 rounded-xl transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-900 break-words">
                        {l.id} · {l.name}
                      </div>
                      <div className="text-xs text-slate-500 break-words mt-0.5">
                        {l.damageType} · {l.address}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-1 text-[11px] font-semibold text-emerald-800">
                        <span>📷 {l.photos?.length || 0} {t("Dateien / Fotos", "Files / Photos")}</span>
                        <span>·</span>
                        <span>
                          📄 {docs.filter((d) => d.leadId === l.id).length} {t("Beleg(e)", "Receipt(s)")} (ANG/RE)
                        </span>
                      </div>
                    </div>
                    <span className="self-start sm:self-center shrink-0 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                      {isEn ? STATUS_I18N[l.status]?.en || l.status : l.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-4">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  {t("Angebote & Rechnungen (Google Drive Belege)", "Quotes & Invoices (Google Drive Receipts)")}
                </h3>
                <button
                  type="button"
                  onClick={() => setTab("belege")}
                  className="min-h-[40px] px-2 text-xs font-bold text-emerald-700 hover:underline shrink-0"
                >
                  {t("Belegeditor →", "Invoice Editor →")}
                </button>
              </div>
              <div className="divide-y divide-slate-200">
                {docs.map((d) => (
                  <div
                    key={d.nr}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-900 break-words">
                        {d.nr} · {d.name} ({d.leadId})
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {d.typeLabel} · {eur(calcDocTotals(d).gross)} · Drive:{" "}
                        <code>{d.driveFolder}</code>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPreviewDoc(d)}
                      className="self-start sm:self-center shrink-0 min-h-[40px] text-xs font-bold bg-[#0f2537] hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl"
                    >
                      {t("👁️ PDF ansehen", "👁️ View PDF")}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INQUIRIES & DRIVE PHOTOS & DOCUMENTS */}
      {tab === "leads" && curLead && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Lead selection & Quote line items */}
          <div className="lg:col-span-7 space-y-6 min-w-0">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-wrap gap-2 items-center">
              <span className="text-xs font-bold text-slate-500 w-full sm:w-auto">
                {t(`Anfrage wählen (${leads.length}):`, `Select Inquiry (${leads.length}):`)}
              </span>
              {leads.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setSelectedLeadId(l.id)}
                  className={`min-h-[42px] px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors ${
                    l.id === curLead.id
                      ? "bg-[#0f2537] text-white border-[#0f2537]"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {l.id} · {l.name} ({l.photos?.length || 0} 📷)
                </button>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="min-w-0">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block">
                    {curLead.id} · {t("Eingegangen:", "Received:")} {curLead.received}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 break-words mt-0.5">
                    {curLead.name}
                  </h3>
                  <p className="text-xs text-slate-500 break-words mt-0.5">{curLead.address}</p>
                </div>
                <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-2 shrink-0">
                  <a
                    href={`tel:${curLead.phone.replace(/\s+/g, "")}`}
                    className="min-h-[44px] inline-flex items-center justify-center gap-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-2 rounded-xl"
                  >
                    <Phone className="w-3.5 h-3.5 shrink-0" />
                    <span>{t("Anrufen", "Call")}</span>
                  </a>
                  <a
                    href={`https://wa.me/${curLead.phone.replace(/[^\d]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] inline-flex items-center justify-center gap-1.5 text-xs font-bold bg-[#25D366] hover:bg-[#1ebe5d] text-white px-3 py-2 rounded-xl"
                  >
                    <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={`mailto:${curLead.email}`}
                    className="min-h-[44px] inline-flex items-center justify-center gap-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-2 rounded-xl"
                  >
                    <Mail className="w-3.5 h-3.5 shrink-0" />
                    <span>{t("E-Mail", "Email")}</span>
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="text-slate-400 font-bold uppercase block">{t("Schadensart", "Damage Type")}</span>
                  <strong className="text-slate-900">{curLead.damageType}</strong>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="text-slate-400 font-bold uppercase block">{t("Fläche / Umfang", "Scope / Area")}</span>
                  <strong className="text-slate-900">{curLead.area}</strong>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="text-slate-400 font-bold uppercase block">{t("Wunschtermin", "Target Date")}</span>
                  <strong className="text-slate-900">{curLead.date}</strong>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="text-slate-400 font-bold uppercase block mb-1">{t("Status ändern", "Change Status")}</span>
                  <select
                    value={curLead.status}
                    aria-label="Status der Anfrage"
                    onChange={(e) => {
                      const nextStatus = e.target.value as LeadStatus;
                      const nextLeads = leads.map((l) =>
                        l.id === curLead.id ? { ...l, status: nextStatus } : l
                      );
                      persistAll(nextLeads, docs);
                      showToast(t(`Status für ${curLead.id} auf "${nextStatus}" gesetzt.`, `Status for ${curLead.id} updated to "${STATUS_I18N[nextStatus]?.en || nextStatus}".`));
                    }}
                    className="w-full min-h-[38px] px-2.5 py-1 rounded-lg border border-slate-300 bg-white font-bold text-slate-900 text-base sm:text-xs"
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>
                        {isEn ? STATUS_I18N[st]?.en || st : st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="text-xs bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5">
                <strong className="text-slate-900 block mb-1">
                  {t("Kundenbeschreibung & Messbefund:", "Customer Description & Diagnostic Notes:")}
                </strong>
                <p className="text-slate-700 leading-relaxed">{curLead.message}</p>
                <p className="text-slate-600 mt-1 italic">{curLead.notes}</p>
              </div>
            </div>

            {/* Quote Line Editor for Inquiry */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  {t(`Kalkulation & WTA-Positionen (${curLead.id})`, `Cost Estimate & WTA Line Items (${curLead.id})`)}
                </h3>
                <span className="text-lg sm:text-xl font-extrabold text-emerald-700">
                  {eur(calcLeadTotal(curLead))}
                </span>
              </div>
              <div className="space-y-2.5">
                {curLead.lines.map((line, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:grid sm:grid-cols-12 gap-1.5 sm:gap-2 sm:items-center border-b border-slate-100 pb-3 text-xs"
                  >
                    <div className="sm:col-span-6">
                      <div className="font-bold text-slate-900">{line.pos}</div>
                      <div className="text-slate-500">{line.basis}</div>
                    </div>
                    <div className="flex items-center justify-between sm:contents pt-1 sm:pt-0 text-slate-700">
                      <div className="sm:col-span-2 sm:text-right font-semibold">
                        {line.qty} {line.unit}
                      </div>
                      <div className="sm:col-span-2 sm:text-right text-slate-500">
                        {eur(line.price)}
                      </div>
                      <div className="sm:col-span-2 sm:text-right font-extrabold text-slate-900">
                        {eur(line.qty * line.price)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => createDocFromLead(curLead, "offer")}
                  className="min-h-[46px] bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-3 rounded-xl"
                >
                  {t("📄 GoBD-Angebot (ANG-2026) erzeugen →", "📄 Create GoBD Quote (ANG-2026) →")}
                </button>
                <button
                  type="button"
                  onClick={() => createDocFromLead(curLead, "invoice")}
                  className="min-h-[46px] bg-[#0f2537] hover:bg-slate-800 text-white font-bold text-xs px-4 py-3 rounded-xl"
                >
                  {t("🧾 GoBD-Rechnung (RE-2026) erzeugen →", "🧾 Create GoBD Invoice (RE-2026) →")}
                </button>
              </div>
            </div>
          </div>

          {/* Right column: Google Drive Photos & Documents, Offers/Invoices, E-Signature & Handover Checklist */}
          <div className="lg:col-span-5 space-y-6 min-w-0">
            {/* 1. Files & Cloud (Google Drive) */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-extrabold text-slate-900">
                  {t("Dateien & Cloud (Google Drive)", "Files & Cloud (Google Drive)")}
                </h3>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 shrink-0">
                  {NOTIFY_EMAIL_DEFAULT}
                </span>
              </div>

              {/* Customer Damage Photos & Uploaded Documents */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>
                        {t(`Dateien (${curLead.photos?.length || 0}) · ${curLead.id}`, `Files (${curLead.photos?.length || 0}) · ${curLead.id}`)}
                      </span>
                    </div>
                    <div className="text-[11px] text-emerald-800">
                      {t("Ordner:", "Folder:")} <code>SOS Abdichtung - Schadensfotos / {curLead.id}</code>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <label
                      htmlFor={`adm-up-${curLead.id}`}
                      className="min-h-[36px] inline-flex items-center gap-1 text-xs font-bold bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-1.5 rounded-lg cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{adminUploading ? t("Lädt…", "Uploading…") : t("+ Datei/Foto", "+ File/Photo")}</span>
                    </label>
                    <input
                      id={`adm-up-${curLead.id}`}
                      type="file"
                      accept="image/*,application/pdf,.pdf"
                      multiple
                      onChange={(e) => handleAdminPhotoUpload(curLead, e)}
                      className="hidden"
                    />
                    <a
                      href={curLead.photosDriveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[36px] text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-lg inline-flex items-center gap-1"
                    >
                      <span>Drive</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {curLead.photos && curLead.photos.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                    {curLead.photos.map((ph, idx) => {
                      const isPdf = ph.fileType === "pdf" || ph.name.toLowerCase().endsWith(".pdf");
                      return (
                        <div
                          key={idx}
                          className="group relative rounded-xl overflow-hidden border border-emerald-300 bg-white shadow-sm flex flex-col"
                        >
                          {isPdf ? (
                            <a
                              href={ph.dataUrl}
                              download={ph.name}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="relative h-24 w-full bg-red-50 flex flex-col items-center justify-center p-2 text-center hover:bg-red-100 transition-colors"
                            >
                              <FileText className="w-8 h-8 text-red-600 mb-1" />
                              <span className="text-[10px] font-bold text-red-900 truncate max-w-full">
                                PDF Dokument
                              </span>
                            </a>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setZoomPhoto({ photo: ph, leadId: curLead.id })}
                              className="relative h-24 w-full overflow-hidden bg-slate-100 text-left"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={ph.dataUrl}
                                alt={ph.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                              <span className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-colors">
                                <Eye className="w-5 h-5 text-white opacity-0 group-hover:opacity-100" />
                              </span>
                            </button>
                          )}
                          <div className="p-1.5 text-[10px] flex items-center justify-between gap-1 bg-white">
                            <span className="font-semibold text-slate-700 truncate" title={ph.name}>
                              {ph.name}
                            </span>
                            <a
                              href={ph.dataUrl}
                              download={ph.name}
                              className="text-emerald-700 hover:text-emerald-900 shrink-0 p-0.5"
                              title={t("Datei herunterladen", "Download File")}
                            >
                              <Download className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-emerald-900 bg-white/80 rounded-lg p-2.5">
                    {t(
                      `Noch keine Dateien zu ${curLead.id} hochgeladen. Kunden können über /kontakt/ Fotos & PDFs senden oder Sie können oben auf + Datei/Foto klicken.`,
                      `No files uploaded yet for ${curLead.id}. Customers can upload photos & PDFs via /kontakt/ or you can click + File/Photo above.`
                    )}
                  </p>
                )}
              </div>

              {/* Offers & Invoices */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-slate-700 shrink-0" />
                    <span>
                      {t(`GoBD-Belege zu ${curLead.id} (${curLeadDocs.length})`, `GoBD Documents for ${curLead.id} (${curLeadDocs.length})`)}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500">
                    SOS Abdichtung - Belege / 2026
                  </span>
                </div>
                {curLeadDocs.length > 0 ? (
                  <div className="space-y-1.5">
                    {curLeadDocs.map((d) => (
                      <div
                        key={d.nr}
                        className="bg-white border border-slate-200 rounded-lg p-2.5 flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 truncate">
                            {d.nr} · {d.typeLabel}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {eur(calcDocTotals(d).gross)} · Status: {d.status}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPreviewDoc(d)}
                          className="min-h-[36px] bg-[#0f2537] hover:bg-slate-800 text-white font-bold text-xs px-3 py-1.5 rounded-lg shrink-0"
                        >
                          👁️ PDF
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">
                    {t("Noch kein Beleg erstellt. Klicken Sie links auf „GoBD-Angebot erzeugen“.", "No document created yet. Click \"Create GoBD Quote\" on the left.")}
                  </p>
                )}
              </div>

              {/* Digital Contract Signature */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                      <FileSignature className="w-4 h-4 shrink-0" />
                      <span>SOS Abdichtung - {t("Verträge", "Contracts")} ({curLead.id})</span>
                    </div>
                    <div className="text-[11px] text-blue-700 mt-0.5 break-words">
                      {curLead.signedBy
                        ? t(`✓ Digital unterzeichnet von ${curLead.signedBy} (${curLead.signedAt})`, `✓ Digitally signed by ${curLead.signedBy} (${curLead.signedAt})`)
                        : t("Signatur-Link bereit zur Kundenunterschrift auf /kontakt/", "E-Signature link ready for customer sign-off at /kontakt/")}
                    </div>
                  </div>
                  <a
                    href={`/kontakt/?id=${curLead.id}&k=${curLead.token}#sign`}
                    className="min-h-[38px] text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white px-3.5 py-2 rounded-xl shrink-0 inline-flex items-center justify-center"
                  >
                    {t("E-Signatur öffnen ↗", "Open E-Signature ↗")}
                  </a>
                </div>
                {curLead.signatureDataUrl && (
                  <div className="bg-white border border-blue-200 rounded-lg p-2">
                    <div className="text-[10px] font-bold uppercase text-slate-400 mb-1">
                      {t(`Hinterlegte Kundenunterschrift (${curLead.signedBy}):`, `Recorded Customer Signature (${curLead.signedBy}):`)}
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={curLead.signatureDataUrl}
                      alt={`Unterschrift ${curLead.signedBy}`}
                      className="max-h-16 object-contain"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 2. On-Site Technician Handover Checklist */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{t("Vor-Ort- & Technik-Checkliste", "On-Site & Technical Checklist")}</span>
                </h3>
                <span className="text-xs font-bold bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-full shrink-0">
                  {HANDOVER_ITEMS.filter((i) => curLead.handover[i.k]).length}/{HANDOVER_ITEMS.length} {t("erledigt", "done")}
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-2 border border-slate-200 rounded-xl p-3 bg-slate-50">
                {HANDOVER_ITEMS.map((item) => (
                  <label
                    key={item.k}
                    className="flex items-start gap-2.5 py-1 text-xs text-slate-800 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={!!curLead.handover[item.k]}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        const nextLeads = leads.map((l) =>
                          l.id === curLead.id
                            ? { ...l, handover: { ...l.handover, [item.k]: checked } }
                            : l
                        );
                        persistAll(nextLeads, docs);
                      }}
                      className="mt-0.5 w-4 h-4 accent-emerald-700 shrink-0"
                    />
                    <span className="leading-snug">{isEn ? item.en : item.de}</span>
                  </label>
                ))}
              </div>
              <button
                type="button"
                onClick={() => sendHandoverWhatsApp(curLead)}
                className="w-full min-h-[46px] bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span>{t("Checkliste per WhatsApp an Inhaber senden", "Send Handover Checklist via WhatsApp")}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DRIVE CLOUD VAULT */}
      {tab === "drive" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  {t("Google Drive Cloud-Archiv", "Google Drive Cloud Vault")} · {NOTIFY_EMAIL_DEFAULT}
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  {t("Alle Schadensfotos, Dokumente, Angebote & Rechnungen", "All Damage Photos, Documents, Quotes & Invoices")}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t(
                    "Alle über /kontakt/ hochgeladenen Fotos & PDFs und im Admin erzeugten GoBD-Belege auf einen Blick.",
                    "All photos & documents uploaded through /kontakt/ and GoBD receipts created in the admin portal."
                  )}
                </p>
              </div>
              <a
                href="https://drive.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] inline-flex items-center justify-center gap-1.5 text-xs font-bold bg-[#0f2537] text-white px-4 py-2.5 rounded-xl shrink-0"
              >
                <span>{t("Google Drive Ordner öffnen", "Open Google Drive Folder")}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Section 1: Customer Damage Photos & Uploaded PDFs */}
            <div className="space-y-3">
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-700" />
                {t("1. Kunden-Dateien & Schadensfotos (Ordner:", "1. Customer Files & Damage Photos (Folder:")} <code>SOS Abdichtung - Schadensfotos</code>)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {leads.flatMap((l) =>
                  (l.photos || []).map((ph, idx) => {
                    const isPdf = ph.fileType === "pdf" || ph.name.toLowerCase().endsWith(".pdf");
                    return (
                      <div
                        key={`${l.id}-${idx}`}
                        className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between shadow-sm"
                      >
                        {isPdf ? (
                          <a
                            href={ph.dataUrl}
                            download={ph.name}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative h-40 w-full bg-red-50 flex flex-col items-center justify-center p-3 text-center hover:bg-red-100 transition-colors"
                          >
                            <FileText className="w-12 h-12 text-red-600 mb-2" />
                            <span className="text-xs font-bold text-red-950 truncate max-w-full">
                              {ph.name}
                            </span>
                            <span className="text-[10px] text-red-700 mt-1">PDF Dokument (Download)</span>
                          </a>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setZoomPhoto({ photo: ph, leadId: l.id })}
                            className="relative h-40 w-full bg-slate-200 overflow-hidden group text-left"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={ph.dataUrl}
                              alt={ph.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <span className="absolute top-2 left-2 bg-[#0f2537]/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                              {l.id} · {l.name}
                            </span>
                          </button>
                        )}
                        <div className="p-3 space-y-1 text-xs">
                          <div className="font-bold text-slate-900 truncate" title={ph.name}>
                            {ph.name}
                          </div>
                          <div className="text-[11px] text-slate-500">{ph.uploadedAt}</div>
                          <div className="flex items-center justify-between pt-2">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedLeadId(l.id);
                                setTab("leads");
                              }}
                              className="text-xs font-bold text-emerald-700 hover:underline"
                            >
                              {t(`Zur Anfrage ${l.id} →`, `Open Lead ${l.id} →`)}
                            </button>
                            <a
                              href={ph.dataUrl}
                              download={ph.name}
                              className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-slate-900"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Section 2: GoBD Offers & Invoices */}
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-700" />
                {t("2. GoBD-Angebote & Rechnungen (Ordner:", "2. GoBD Quotes & Invoices (Folder:")} <code>SOS Abdichtung - Belege / 2026</code>)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {docs.map((d) => (
                  <div
                    key={d.nr}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-extrabold text-emerald-800">{d.nr}</span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200">
                          {d.typeLabel}
                        </span>
                      </div>
                      <div className="font-bold text-slate-900 text-sm mt-1">{d.name}</div>
                      <div className="text-slate-500">{d.service}</div>
                      <div className="font-extrabold text-slate-900 text-sm mt-2">
                        {eur(calcDocTotals(d).gross)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-200/80">
                      <button
                        type="button"
                        onClick={() => setPreviewDoc(d)}
                        className="flex-1 min-h-[40px] bg-[#0f2537] hover:bg-slate-800 text-white font-bold px-3 py-2 rounded-xl"
                      >
                        {t("👁️ PDF öffnen / Drucken", "👁️ View PDF / Print")}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDocNr(d.nr);
                          setTab("belege");
                        }}
                        className="min-h-[40px] bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold px-3 py-2 rounded-xl"
                      >
                        {t("Bearbeiten", "Edit")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AUFMASS-PLANER / ESTIMATOR */}
      {tab === "planer" && (
        <div className="space-y-6">
          {/* Interactive Workflow Pipeline Header with Official Logo */}
          <div className="bg-[#0f2537] text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-700/50">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5">
                <div className="bg-white p-2.5 rounded-xl shrink-0 shadow-md flex items-center justify-center">
                  <img src="/logo.svg" alt="SOS-Abdichtung" className="h-7 sm:h-8 w-auto object-contain" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">
                      {t("GoBD-Auftragspipeline · Schritt 1 von 3", "GoBD Pipeline · Step 1 of 3")}
                    </span>
                    <span className="text-[10px] bg-white/10 text-slate-300 px-2 py-0.5 rounded font-bold">
                      WTA & TÜV
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-white">
                    {t("Vor-Ort-Aufmaß & Schnellkalkulation", "On-Site Diagnostic Measurement & Quick Estimate")}
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {t(
                      "Erfassen Sie Vor-Ort-Messdaten und überführen Sie diese mit 1 Klick in ein GoBD-Angebot oder direkt in eine Rechnung.",
                      "Capture on-site diagnostic measurements and convert them in 1 click into a GoBD quote or invoice."
                    )}
                  </p>
                </div>
              </div>

              {/* Pipeline Step Indicators */}
              <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] font-bold overflow-x-auto py-1">
                <div className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1.5 rounded-xl whitespace-nowrap">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-900 flex items-center justify-center text-[10px] font-extrabold">1</span>
                  <span>{t("Aufmaß (Aktiv)", "Estimate (Active)")}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <div className="flex items-center gap-1.5 bg-white/5 text-slate-300 border border-white/10 px-3 py-1.5 rounded-xl whitespace-nowrap">
                  <span className="w-5 h-5 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center text-[10px] font-bold">2</span>
                  <span>{t("Angebot (ANG)", "Quote (ANG)")}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <div className="flex items-center gap-1.5 bg-white/5 text-slate-300 border border-white/10 px-3 py-1.5 rounded-xl whitespace-nowrap">
                  <span className="w-5 h-5 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center text-[10px] font-bold">3</span>
                  <span>{t("Rechnung (RE)", "Invoice (RE)")}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="text-sm font-extrabold text-slate-900">
                  {t("Kunden- & Objektdaten", "Customer & Site Details")}
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t("Kundenname / WEG *", "Customer Name / HOA *")}
                  </label>
                  <input
                    type="text"
                    value={plName}
                    onChange={(e) => setPlName(e.target.value)}
                    placeholder={t("z. B. Familie Schneider", "e.g. Schneider Family")}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t("Telefon / WhatsApp *", "Phone / WhatsApp *")}
                  </label>
                  <input
                    type="tel"
                    value={plPhone}
                    onChange={(e) => setPlPhone(e.target.value)}
                    placeholder="z. B. 0172 2064177"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t("Objektadresse", "Property Address")}
                  </label>
                  <input
                    type="text"
                    value={plAddr}
                    onChange={(e) => setPlAddr(e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t("Hauptgewerk", "Primary Service")}
                  </label>
                  <select
                    value={plService}
                    onChange={(e) => setPlService(e.target.value)}
                    className={inputCls}
                  >
                    <option value="Horizontalsperre">{t("Horizontalsperre (WTA-Injektion)", "Horizontal Damp Barrier (WTA)")}</option>
                    <option value="Kellerinnenabdichtung (MDS)">{t("Kellerinnenabdichtung (MDS)", "Interior Basement Waterproofing (Slurry)")}</option>
                    <option value="Schimmelbeseitigung & Klimaplatte">{t("Schimmelbeseitigung & Klimaplatte", "Mold Remediation & Climate Boards")}</option>
                    <option value="Hochdruck-Rissverpressung">{t("Hochdruck-Rissverpressung", "High-Pressure Masonry Crack Injection")}</option>
                    <option value="Bautrocknung & Wasserschaden">{t("Bautrocknung & Wasserschaden", "Building Dehumidification & Water Damage")}</option>
                  </select>
                </div>
              </div>

              {/* SMART ROOM GEOMETRY & MASONRY CALCULATOR */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-emerald-700 shrink-0" />
                    <div>
                      <h5 className="text-xs font-extrabold text-slate-900">
                        {t("Vor-Ort Raum- & Geometrierechner (WTA)", "On-Site Room & Geometry Calculator (WTA)")}
                      </h5>
                      <p className="text-[10px] text-slate-500">
                        {t("Berechnet lfm, Wandfläche (m²) und Bohrlochraster automatisch.", "Calculates lin. m, wall surface (m²) and borehole grid automatically.")}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCalcExpanded(!calcExpanded)}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-white border border-slate-200 px-2.5 py-1 rounded-lg"
                  >
                    {calcExpanded ? t("Weniger ▲", "Collapse ▲") : t("Rechner öffnen ▼", "Open Calculator ▼")}
                  </button>
                </div>

                {calcExpanded && (
                  <div className="pt-2 border-t border-slate-200 space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">
                          {t("Wandlänge (lfm)", "Wall Length (m)")}
                        </label>
                        <input
                          type="number"
                          step={0.5}
                          min={1}
                          value={calcLen}
                          onChange={(e) => setCalcLen(Number(e.target.value) || 1)}
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">
                          {t("Wandhöhe (m)", "Wall Height (m)")}
                        </label>
                        <input
                          type="number"
                          step={0.1}
                          min={0.5}
                          value={calcHeight}
                          onChange={(e) => setCalcHeight(Number(e.target.value) || 1)}
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">
                          {t("Mauerstärke (cm)", "Thickness (cm)")}
                        </label>
                        <input
                          type="number"
                          step={1}
                          min={10}
                          value={calcThick}
                          onChange={(e) => setCalcThick(Number(e.target.value) || 36.5)}
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">
                          {t("Mauerwerk", "Masonry Type")}
                        </label>
                        <select
                          value={calcMasonry}
                          onChange={(e) => setCalcMasonry(e.target.value)}
                          className={inputCls}
                        >
                          <option value="Ziegelmauerwerk">Ziegelmauerwerk</option>
                          <option value="Bruchstein / Sandstein">Bruchstein / Sandstein</option>
                          <option value="Beton / Schalstein">Beton / Schalstein</option>
                          <option value="Kalksandstein">Kalksandstein</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">
                          {t("Durchfeuchtungsgrad", "Moisture Degree")}
                        </label>
                        <select
                          value={calcMoisture}
                          onChange={(e) => setCalcMoisture(e.target.value)}
                          className={inputCls}
                        >
                          <option value="bis 60 % (Mäßig)">bis 60 % (Mäßig durchfeuchtet)</option>
                          <option value="bis 80 % (Stark)">bis 80 % (Starke Kapillarfeuchte)</option>
                          <option value="bis 100 % (Druckwasser)">bis 100 % (Druckwassereinbruch / Nass)</option>
                        </select>
                      </div>
                    </div>

                    {/* Quick Live Diagnostics Output */}
                    <div className="bg-white border border-emerald-200 rounded-xl p-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">{t("Länge (Sperre)", "Length")}</span>
                        <strong className="text-emerald-800 text-sm">{calcLen} lfm</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">{t("Wandfläche (Putz)", "Surface")}</span>
                        <strong className="text-emerald-800 text-sm">{Math.round(calcLen * calcHeight * 10) / 10} m²</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">{t("Bohrlöcher (~10 cm)", "Boreholes")}</span>
                        <strong className="text-slate-800 text-sm">~{Math.round(calcLen * 10)} Stk.</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">{t("Silan-Creme Bedarf", "Silane Volume")}</span>
                        <strong className="text-slate-800 text-sm">~{Math.round(calcLen * (calcThick / 20) * 10) / 10} L</strong>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={applyRoomGeometry}
                      className="w-full min-h-[42px] bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>{t("⚡ Maße auf Positionen anwenden (lfm & m² synchronisieren)", "⚡ Apply Dimensions to Line Items (Sync lfm & m²)")}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Price Tuning Toolbar */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{t("Preise im Aufmaß anpassen:", "Adjust Prices in Estimate:")}</span>
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => applyPriceAdjustmentToPlaner(0.95, "-5 % Skonto")}
                    className="min-h-[36px] px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 rounded-lg"
                  >
                    -5 %
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPriceAdjustmentToPlaner(0.90, "-10 % Rabatt")}
                    className="min-h-[36px] px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 rounded-lg"
                  >
                    -10 %
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPriceAdjustmentToPlaner(1.15, "+15 % Altbau-Zuschlag")}
                    className="min-h-[36px] px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 rounded-lg"
                  >
                    +15 % {t("Altbau", "Old building")}
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPriceAdjustmentToPlaner(1.25, "+25 % Express-Notdienst")}
                    className="min-h-[36px] px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 rounded-lg"
                  >
                    +25 % {t("Express", "Express")}
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="text-xs font-bold text-slate-700">
                    {t("WTA-Bausteine mit 1 Klick hinzufügen:", "Add WTA Standard Modules in 1 Click:")}
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {WTA_TEMPLATES.length} {t("Vorlagen", "Templates")}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {WTA_TEMPLATES.map((tpl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() =>
                        setPlLines((prev) => [
                          ...prev,
                          {
                            pos: isEn ? tpl.pos_en : tpl.pos_de,
                            basis: isEn ? tpl.basis_en : tpl.basis_de,
                            qty: tpl.qty,
                            unit: isEn ? tpl.unit_en : tpl.unit_de,
                            price: tpl.price,
                            labour: tpl.labour,
                          },
                        ])
                      }
                      className="min-h-[38px] text-xs font-semibold bg-slate-50 hover:bg-emerald-50 text-slate-800 border border-slate-200 hover:border-emerald-300 px-3 py-1.5 rounded-xl inline-flex items-center gap-1.5 text-left transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5 shrink-0 text-emerald-700" />
                      <span>{isEn ? tpl.pos_en : tpl.pos_de}</span>
                      <span className="text-[10px] text-slate-400">({eur(tpl.price)})</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="text-xs font-bold text-slate-700">
                    {t("Aufmaß-Positionen:", "Estimate Line Items:")} ({plLines.length})
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setPlLines((prev) => [
                        ...prev,
                        {
                          pos: isEn ? "Custom Waterproofing Service" : "Individuelle Sanierungsleistung",
                          basis: isEn ? "Specification / notes" : "Technische Ausführung nach WTA",
                          qty: 1,
                          unit: isEn ? "Flat rate" : "Pausch.",
                          price: 100,
                          labour: true,
                        },
                      ])
                    }
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t("Eigene Position", "Custom Item")}</span>
                  </button>
                </div>

                {plLines.map((l, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:items-center bg-slate-50 hover:bg-slate-100/80 p-3 rounded-xl border border-slate-200/80 transition-colors"
                  >
                    <div className="sm:col-span-5">
                      <div className="text-xs font-bold text-slate-900">{l.pos}</div>
                      <div className="text-[11px] text-slate-500 truncate">{l.basis}</div>
                    </div>
                    <div className="flex items-center justify-between gap-2 sm:contents">
                      <div className="flex items-center gap-1.5 sm:col-span-3">
                        <input
                          type="number"
                          min={0.1}
                          step={1}
                          aria-label={`Menge für ${l.pos}`}
                          value={l.qty}
                          onChange={(e) => {
                            const qty = Number(e.target.value) || 1;
                            setPlLines((prev) =>
                              prev.map((x, j) => (j === idx ? { ...x, qty } : x))
                            );
                          }}
                          className="w-20 sm:w-full min-h-[40px] px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-right text-xs font-bold text-slate-900"
                        />
                        <span className="text-xs text-slate-500 shrink-0">{l.unit}</span>
                      </div>
                      <div className="sm:col-span-3 text-right text-xs font-extrabold text-slate-900">
                        {eur(l.qty * l.price)}
                      </div>
                      <div className="sm:col-span-1 text-right">
                        <button
                          type="button"
                          onClick={() => setPlLines((prev) => prev.filter((_, j) => j !== idx))}
                          aria-label="Position löschen"
                          className="min-h-[36px] min-w-[36px] inline-flex items-center justify-center text-slate-400 hover:text-red-600 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Summary & 1-Click Pipeline Card */}
            <div className="lg:col-span-5 bg-[#0f2537] text-white rounded-2xl p-5 sm:p-6 space-y-5 shadow-lg">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 block mb-1">
                  {t("Kalkulations-Summe", "Live Estimate Total")}
                </span>
                {(() => {
                  const netSum = plLines.reduce((s, l) => s + (Number(l.qty) || 0) * (Number(l.price) || 0), 0);
                  const vatSum = netSum * 0.19;
                  const grossSum = netSum + vatSum;
                  const labourNetSum = plLines.filter(l => l.labour).reduce((s, l) => s + (Number(l.qty) || 0) * (Number(l.price) || 0), 0);
                  const labourGrossSum = labourNetSum * 1.19;
                  const taxBonus = Math.min(1200, labourGrossSum * 0.2);
                  const labourPct = netSum > 0 ? Math.round((labourNetSum / netSum) * 100) : 0;

                  return (
                    <div className="space-y-4">
                      <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                        {eur(grossSum)}
                      </div>
                      <div className="text-xs text-slate-300 space-y-1 border-t border-white/10 pt-3">
                        <div className="flex justify-between">
                          <span>{t("Nettobetrag:", "Net Subtotal:")}</span>
                          <span className="font-semibold">{eur(netSum)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t("Umsatzsteuer (19 %):", "VAT (19 %):")}</span>
                          <span className="font-semibold">{eur(vatSum)}</span>
                        </div>
                      </div>

                      {/* Visual Labour vs Material Ratio */}
                      <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-emerald-400 font-bold">
                            {t("Lohnanteil § 35a:", "Labor Ratio § 35a:")} {labourPct}%
                          </span>
                          <span className="text-sky-300 font-semibold">
                            {t("Material:", "Material:")} {100 - labourPct}%
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden flex">
                          <div style={{ width: `${labourPct}%` }} className="bg-emerald-500 h-full transition-all" />
                          <div style={{ width: `${100 - labourPct}%` }} className="bg-sky-400 h-full transition-all" />
                        </div>
                        <div className="flex justify-between text-[11px] text-slate-300 pt-0.5">
                          <span>{t("Steuerbonus für Kunden:", "Customer Tax Bonus:")}</span>
                          <strong className="text-emerald-300 font-extrabold">−{eur(taxBonus)}</strong>
                        </div>
                      </div>

                      <div className="p-3 bg-emerald-950/50 border border-emerald-500/30 rounded-xl text-xs text-emerald-200">
                        <p className="leading-relaxed">
                          {t(
                            "✓ 10 Jahre Systemgarantie auf alle ausgeführten WTA-Leistungen.",
                            "✓ 10-year system warranty on all executed WTA waterproofing work."
                          )}
                        </p>
                      </div>

                      {/* 1-Click Action Buttons */}
                      <div className="space-y-2.5 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            const draftDoc: WorkspaceGoBDDoc = {
                              nr: "ANG-2026-ENTWURF",
                              type: "offer",
                              typeLabel: t("Kostenvoranschlag / Angebot", "Estimate / Quote"),
                              leadId: "VOR-ORT",
                              date: new Date().toISOString().slice(0, 10),
                              dueOrValid: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
                              status: t("Entwurf", "Draft"),
                              name: plName || t("Kunde (Vor-Ort-Aufmaß)", "Customer (On-Site Estimate)"),
                              address: plAddr || "Wuppertal & Bergisches Land",
                              email: "",
                              phone: plPhone || "+49 172 2064177",
                              service: plService || "Kellersanierung & Horizontalsperre nach WTA",
                              vatRate: 19,
                              lines: plLines,
                              skontoPct: 2,
                              discountPct: 0,
                              driveFolder: "SOS Abdichtung - Vor-Ort-Aufmaß",
                            };
                            setPreviewDoc(draftDoc);
                          }}
                          className="w-full min-h-[46px] bg-sky-600 hover:bg-sky-500 text-white font-extrabold py-2.5 px-4 rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
                        >
                          <Eye className="w-4 h-4 shrink-0" />
                          <span>{t("👁️ Live-Belegvorschau vor Ort (DIN 5008)", "👁️ Live Estimate Preview on Site (DIN 5008)")}</span>
                        </button>

                        <button
                          type="button"
                          onClick={createOfferFromPlaner}
                          className="w-full min-h-[50px] bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3.5 px-4 rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
                        >
                          <FileText className="w-4 h-4 shrink-0" />
                          <span>{t("⚡ Als GoBD-Angebot (ANG-2026) übernehmen →", "⚡ Convert to GoBD Quote (ANG-2026) →")}</span>
                        </button>

                        <button
                          type="button"
                          onClick={createInvoiceDirectlyFromPlaner}
                          className="w-full min-h-[46px] bg-white/10 hover:bg-white/20 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 border border-white/15"
                        >
                          <CreditCard className="w-4 h-4 shrink-0 text-sky-400" />
                          <span>{t("⚡ Direkt als Rechnung (RE-2026) abrechnen →", "⚡ Bill directly as Invoice (RE-2026) →")}</span>
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: GoBD INVOICING & QUOTE ENGINE */}
      {tab === "belege" && curDoc && (
        <div className="space-y-6">
          {/* Top Header Card: Branding & View Mode Toggle (Editor vs DIN 5008 Live Preview) */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-28 relative flex items-center justify-center p-1.5 bg-slate-50 border border-slate-200 rounded-xl">
                <img
                  src="/logo.svg"
                  alt="SOS Abdichtung"
                  className="h-7 w-auto max-w-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span>{t("GoBD Belegverwaltung & Abrechnung", "GoBD Document Management & Billing")}</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                    DIN 5008
                  </span>
                </h3>
                <div className="text-[11px] text-slate-500">
                  {t("Angebote, Rechnungen & § 35a Handwerkerbonus", "Quotes, Invoices & § 35a Tax Bonus")}
                </div>
              </div>
            </div>

            {/* View Mode Switcher: Editor vs Live DIN 5008 Vorschau */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
              <button
                type="button"
                onClick={() => setDocViewMode("editor")}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  docViewMode === "editor"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-700" />
                <span>{t("📝 Beleg-Editor", "📝 Document Editor")}</span>
              </button>
              <button
                type="button"
                onClick={() => setDocViewMode("preview")}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  docViewMode === "preview"
                    ? "bg-emerald-700 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{t("📄 Live-Belegvorschau (DIN 5008)", "📄 Live Preview (DIN 5008)")}</span>
              </button>
            </div>
          </div>

          {/* Document Type Filter & Quick Creation Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500 mr-1">{t("Filter:", "Filter:")}</span>
              <button
                type="button"
                onClick={() => setDocFilter("all")}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  docFilter === "all"
                    ? "bg-[#0f2537] text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {t("Alle Belege", "All Documents")} ({docs.length})
              </button>
              <button
                type="button"
                onClick={() => setDocFilter("offer")}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  docFilter === "offer"
                    ? "bg-[#0f2537] text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {t("Angebote", "Quotes")} ({docs.filter((d) => d.type === "offer").length})
              </button>
              <button
                type="button"
                onClick={() => setDocFilter("invoice")}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  docFilter === "invoice"
                    ? "bg-[#0f2537] text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {t("Rechnungen", "Invoices")} ({docs.filter((d) => d.type === "invoice").length})
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => createNewEmptyDoc("offer")}
                className="min-h-[40px] px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl inline-flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-700" />
                <span>{t("+ Neues Angebot", "+ New Quote")}</span>
              </button>
              <button
                type="button"
                onClick={() => createNewEmptyDoc("invoice")}
                className="min-h-[40px] px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl inline-flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-sky-700" />
                <span>{t("+ Neue Rechnung", "+ New Invoice")}</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewDoc(curDoc)}
                className="min-h-[40px] px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>{t("👁️ PDF-Druck", "👁️ Print PDF")}</span>
              </button>
            </div>
          </div>

          {/* Document Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {docs
              .filter((d) => (docFilter === "all" ? true : d.type === docFilter))
              .map((d) => {
                const dateSt = getDocDateStatus(d);
                const isSelected = d.nr === curDoc.nr;
                return (
                  <button
                    key={d.nr}
                    type="button"
                    onClick={() => setSelectedDocNr(d.nr)}
                    className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold border shrink-0 transition-all text-left flex items-center gap-2.5 ${
                      isSelected
                        ? "bg-[#0f2537] text-white border-[#0f2537] shadow"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span>{d.nr}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-extrabold uppercase ${
                          d.type === "offer" ? "bg-amber-100 text-amber-800" : "bg-sky-100 text-sky-800"
                        }`}>
                          {d.typeLabel}
                        </span>
                      </div>
                      <div className={`text-[10px] truncate max-w-[140px] ${isSelected ? "text-slate-300" : "text-slate-400"}`}>
                        {d.name}
                      </div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${dateSt.color}`}>
                      {d.status}
                    </span>
                  </button>
                );
              })}
          </div>

          {/* 1-CLICK PIPELINE & WORKFLOW BANNER */}
          {curDoc.type === "offer" ? (
            <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-[#0f2537] text-white p-4 sm:p-5 rounded-2xl shadow-md border border-emerald-600/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{t("Workflow: 1-Klick-Übernahme in GoBD-Rechnung", "Workflow: 1-Click Conversion to Invoice")}</span>
                </div>
                <div className="text-sm font-bold">
                  {t(
                    `Angebot ${curDoc.nr} (${curDoc.name}) liegt vor. Wurde der Auftrag erteilt?`,
                    `Quote ${curDoc.nr} (${curDoc.name}) is ready. Was the project accepted?`
                  )}
                </div>
                <p className="text-xs text-slate-200">
                  {t(
                    "Ein Klick genügt: Alle WTA-Positionen, Beträge und Kundendaten werden lückenlos in eine fortlaufende GoBD-Rechnung überführt.",
                    "One click converts all line items, amounts, and customer details into a GoBD-compliant invoice."
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={() => convertOfferToInvoice(curDoc)}
                className="min-h-[46px] bg-white hover:bg-emerald-50 text-emerald-950 font-extrabold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
              >
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>{t("⚡ Angebot in Rechnung (RE-2026) umwandeln →", "⚡ Convert Quote to Invoice (RE-2026) →")}</span>
              </button>
            </div>
          ) : (
            <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-2xl shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-sky-400">
                  <FileCheck className="w-4 h-4 text-sky-400" />
                  <span>{t("GoBD-Schlussrechnung nach § 14 UStG", "Official GoBD Invoice § 14 UStG")}</span>
                </div>
                <div className="text-sm font-bold flex items-center gap-2">
                  <span>{curDoc.nr} · {curDoc.name}</span>
                  {curDoc.refOfferNr && (
                    <button
                      type="button"
                      onClick={() => setSelectedDocNr(curDoc.refOfferNr!)}
                      className="text-xs text-emerald-400 hover:underline bg-emerald-950/60 border border-emerald-600/40 px-2 py-0.5 rounded-lg"
                    >
                      {t("🔗 Aus Angebot", "🔗 From Quote")} {curDoc.refOfferNr}
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-300">
                  {t("Schnellstatus-Aktualisierung:", "Quick status update:")}
                </p>
              </div>

              {/* Status Switcher Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setDocStatus(t("Offen", "Open"))}
                  className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                    curDoc.status === t("Offen", "Open")
                      ? "bg-amber-500 text-white border-amber-500"
                      : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                  }`}
                >
                  {t("Offen", "Open")}
                </button>
                <button
                  type="button"
                  onClick={() => setDocStatus(t("Bezahlt", "Paid"))}
                  className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                    curDoc.status === t("Bezahlt", "Paid")
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                  }`}
                >
                  {t("Bezahlt ✓", "Paid ✓")}
                </button>
                <button
                  type="button"
                  onClick={() => setDocStatus(t("Überfällig", "Overdue"))}
                  className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                    curDoc.status === t("Überfällig", "Overdue")
                      ? "bg-rose-600 text-white border-rose-600"
                      : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                  }`}
                >
                  {t("Mahnung / Überfällig", "Overdue")}
                </button>
                <button
                  type="button"
                  onClick={() => setDocStatus(t("Storniert", "Voided"))}
                  className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                    curDoc.status === t("Storniert", "Voided")
                      ? "bg-slate-600 text-white border-slate-600"
                      : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                  }`}
                >
                  {t("Storniert", "Voided")}
                </button>
              </div>
            </div>
          )}

          {docViewMode === "preview" ? (
            /* LIVE DIN 5008 PREVIEW VIEW */
            <div className="space-y-4">
              <div className="bg-slate-900 text-white p-3.5 sm:p-4 rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-3 border border-slate-800">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>
                    {t("Live-Belegvorschau (DIN 5008):", "Live Document Preview (DIN 5008):")}
                  </span>
                  <span className="text-emerald-300 font-extrabold">
                    {curDoc.nr} · {curDoc.typeLabel}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDocViewMode("editor")}
                    className="min-h-[38px] px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>{t("← Zurück zum Editor", "← Back to Editor")}</span>
                  </button>
                  {curDoc.type === "offer" && (
                    <button
                      type="button"
                      onClick={() => convertOfferToInvoice(curDoc)}
                      className="min-h-[38px] px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{t("⚡ In Rechnung umwandeln", "⚡ Convert to Invoice")}</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="min-h-[38px] px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                    <span>{t("🖨️ Drucken / Als PDF speichern", "🖨️ Print / Save as PDF")}</span>
                  </button>
                </div>
              </div>

              {renderDIN5008Invoice(curDoc, false)}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 8 Cols: Editable Header & Line Items Table */}
            <div className="lg:col-span-8 bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 space-y-5 shadow-sm">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between gap-2">
                <h4 className="text-sm font-extrabold text-slate-900">
                  {t("Beleg- & Kundendaten bearbeiten", "Edit Document & Client Details")}
                </h4>
                <span className="text-xs font-bold text-slate-400">
                  {curDoc.nr} ({curDoc.typeLabel})
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t("Empfänger / Kunde", "Recipient / Customer")}
                  </label>
                  <input
                    type="text"
                    value={curDoc.name}
                    onChange={(e) => updateCurDoc((d) => ({ ...d, name: e.target.value }))}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t("Anschrift", "Address")}
                  </label>
                  <input
                    type="text"
                    value={curDoc.address}
                    onChange={(e) => updateCurDoc((d) => ({ ...d, address: e.target.value }))}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t("E-Mail / Telefon", "Email / Phone")}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="email"
                      value={curDoc.email}
                      placeholder="kunde@beispiel.de"
                      onChange={(e) => updateCurDoc((d) => ({ ...d, email: e.target.value }))}
                      className={inputCls}
                    />
                    <input
                      type="tel"
                      value={curDoc.phone}
                      placeholder="+49 172 2064177"
                      onChange={(e) => updateCurDoc((d) => ({ ...d, phone: e.target.value }))}
                      className={inputCls}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t("Betreff / Bauvorhaben", "Subject / Project")}
                  </label>
                  <input
                    type="text"
                    value={curDoc.service}
                    onChange={(e) => updateCurDoc((d) => ({ ...d, service: e.target.value }))}
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Date & Payment Terms Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t("Belegdatum", "Issue Date")}
                  </label>
                  <input
                    type="date"
                    value={curDoc.date}
                    onChange={(e) => updateCurDoc((d) => ({ ...d, date: e.target.value }))}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t("Fälligkeitsdatum", "Due Date")}
                  </label>
                  <input
                    type="date"
                    value={curDoc.dueOrValid}
                    onChange={(e) => updateCurDoc((d) => ({ ...d, dueOrValid: e.target.value }))}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t("Umsatzsteuer (§ 14 UStG)", "VAT (§ 14 UStG)")}
                  </label>
                  <select
                    value={curDoc.vatRate}
                    onChange={(e) => updateCurDoc((d) => ({ ...d, vatRate: Number(e.target.value) }))}
                    className={inputCls}
                  >
                    <option value={19}>{t("19 % Regelbesteuerung", "19 % Standard VAT")}</option>
                    <option value={7}>{t("7 % Ermäßigt", "7 % Reduced VAT")}</option>
                    <option value={0}>{t("0 % Kleinunternehmer (§ 19 UStG)", "0 % Small Business (§ 19 UStG)")}</option>
                  </select>
                </div>
              </div>

              {/* Payment Presets Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-500 mr-1">
                  {t("Zahlungsziel:", "Terms:")}
                </span>
                <button
                  type="button"
                  onClick={() => setPaymentPreset(14, 0)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  14 {t("Tage netto", "Days net")}
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentPreset(7, 2)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-200"
                >
                  7 {t("Tage (2 % Skonto)", "Days (2% Skonto)")}
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentPreset(30, 0)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  30 {t("Tage", "Days")}
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentPreset(0, 0)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  {t("Sofort fällig", "Due immediately")}
                </button>
              </div>

              {/* GLOBAL PRICE & DISCOUNT TOOLBAR */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Percent className="w-4 h-4 text-emerald-700" />
                    <div>
                      <h5 className="text-xs font-extrabold text-slate-900">
                        {t("Preise & Gesamtrabatt einstellen", "Set Document Prices & Discount")}
                      </h5>
                      <p className="text-[10px] text-slate-500">
                        {t("Nachlass wird vor Umsatzsteuer abgezogen (GoBD-konform).", "Discount applied before VAT according to GoBD.")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-700">{t("Rabatt:", "Discount:")}</span>
                    <input
                      type="number"
                      min={0}
                      max={50}
                      step={1}
                      value={curDoc.discountPct || 0}
                      onChange={(e) => setDocDiscount(Math.min(50, Math.max(0, Number(e.target.value) || 0)))}
                      className="w-16 min-h-[36px] px-2 py-1 rounded-lg border border-slate-300 bg-white text-right text-xs font-bold text-slate-900"
                    />
                    <span className="text-xs font-bold text-slate-600">%</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-200/60">
                  <span className="text-[10px] font-bold text-slate-500 mr-1">{t("Schnellrabatt:", "Quick Discount:")}</span>
                  <button
                    type="button"
                    onClick={() => setDocDiscount(0)}
                    className="min-h-[32px] px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700"
                  >
                    0 %
                  </button>
                  <button
                    type="button"
                    onClick={() => setDocDiscount(2)}
                    className="min-h-[32px] px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700"
                  >
                    2 % {t("Skonto", "Cash Disc.")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDocDiscount(5)}
                    className="min-h-[32px] px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700"
                  >
                    5 % {t("Neukunde", "New Client")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDocDiscount(10)}
                    className="min-h-[32px] px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700"
                  >
                    10 % {t("Großprojekt", "Volume")}
                  </button>

                  <span className="text-[10px] font-bold text-slate-500 mx-1">|</span>
                  <span className="text-[10px] font-bold text-slate-500">{t("Zuschläge:", "Surcharges:")}</span>
                  <button
                    type="button"
                    onClick={() => applyPriceAdjustmentToDoc(1.15, "+15 % Altbau")}
                    className="min-h-[32px] px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700"
                  >
                    +15 % {t("Altbau", "Old Building")}
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPriceAdjustmentToDoc(1.25, "+25 % Express")}
                    className="min-h-[32px] px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700"
                  >
                    +25 % {t("Express", "Express")}
                  </button>
                </div>
              </div>

              {/* INTERACTIVE LINE ITEM EDITOR (ACCA & BILLDU STYLE) */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      {t("Positionen & WTA-Leistungsverzeichnis", "Line Items & WTA Specifications")}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {t("Alle Werte sind direkt editierbar und berechnen die Summen in Echtzeit.", "All values are directly editable and calculate totals in real time.")}
                    </p>
                  </div>

                  {/* Template Insert Dropdown */}
                  <div className="flex items-center gap-2">
                    <select
                      aria-label={t("WTA-Vorlage einfügen", "Insert WTA template")}
                      defaultValue=""
                      onChange={(e) => {
                        const idx = Number(e.target.value);
                        if (!isNaN(idx) && WTA_TEMPLATES[idx]) {
                          addTemplateLine(WTA_TEMPLATES[idx]);
                          e.target.value = "";
                        }
                      }}
                      className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-xl px-3 py-2 min-h-[38px]"
                    >
                      <option value="" disabled>
                        ⚡ {t("+ WTA-Vorlage einfügen...", "+ Insert WTA Template...")}
                      </option>
                      {WTA_TEMPLATES.map((tpl, i) => (
                        <option key={i} value={i}>
                          {isEn ? tpl.pos_en : tpl.pos_de} ({eur(tpl.price)})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Table of Lines */}
                <div className="space-y-3">
                  {curDoc.lines.map((l, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-3 sm:p-4 space-y-2.5 transition-all hover:border-slate-300"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-start">
                        {/* Title & Spec */}
                        <div className="sm:col-span-6 space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 sm:hidden block">{t("Leistung / Beschreibung:", "Service / Title:")}</label>
                          <input
                            type="text"
                            value={l.pos}
                            onChange={(e) => updateLine(idx, { pos: e.target.value })}
                            placeholder={t("Leistungsbezeichnung", "Service Title")}
                            className="w-full text-sm sm:text-xs font-bold text-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white min-h-[42px] sm:min-h-[38px]"
                          />
                          <input
                            type="text"
                            value={l.basis}
                            onChange={(e) => updateLine(idx, { basis: e.target.value })}
                            placeholder={t("Technische Ausführungsgrundlage", "Technical specification / notes")}
                            className="w-full text-xs sm:text-[11px] text-slate-600 px-2.5 py-1 rounded-lg border border-slate-200 bg-white min-h-[36px]"
                          />
                        </div>

                        {/* Quantity & Unit */}
                        <div className="sm:col-span-2">
                          <label className="text-[10px] font-bold text-slate-500 sm:hidden block">{t("Menge & Einheit:", "Qty & Unit:")}</label>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min={0.1}
                              step={1}
                              value={l.qty}
                              onChange={(e) => updateLine(idx, { qty: Number(e.target.value) || 1 })}
                              className="w-full min-h-[42px] sm:min-h-[38px] px-2 py-1 rounded-lg border border-slate-300 bg-white text-right text-sm sm:text-xs font-bold text-slate-900"
                            />
                            <select
                              value={l.unit}
                              onChange={(e) => updateLine(idx, { unit: e.target.value })}
                              className="min-h-[42px] sm:min-h-[38px] text-xs font-semibold px-2 py-1 rounded-lg border border-slate-200 bg-white text-slate-700"
                            >
                              <option value="lfm">lfm</option>
                              <option value="m²">m²</option>
                              <option value="Stk.">Stk.</option>
                              <option value="Std.">Std.</option>
                              <option value="Pausch.">Pausch.</option>
                              <option value="Tage">Tage</option>
                              <option value="kg">kg</option>
                            </select>
                          </div>
                        </div>

                        {/* Unit Price */}
                        <div className="sm:col-span-2">
                          <label className="text-[10px] font-bold text-slate-500 sm:hidden block">{t("Einzelpreis (€):", "Unit Price (€):")}</label>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min={0}
                              step={0.5}
                              value={l.price}
                              onChange={(e) => updateLine(idx, { price: Number(e.target.value) || 0 })}
                              className="w-full min-h-[42px] sm:min-h-[38px] px-2 py-1 rounded-lg border border-slate-300 bg-white text-right text-sm sm:text-xs font-bold text-slate-900"
                            />
                            <span className="text-xs text-slate-400 font-bold">€</span>
                          </div>
                        </div>

                        {/* Line Total & Actions */}
                        <div className="sm:col-span-2 flex items-center justify-between sm:justify-end gap-2 pt-1 sm:pt-0">
                          <div>
                            <span className="text-[10px] font-bold text-slate-500 sm:hidden block">{t("Gesamt:", "Total:")}</span>
                            <span className="text-sm sm:text-xs font-extrabold text-slate-900 sm:text-right block">
                              {eur(l.qty * l.price)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => duplicateLine(idx)}
                              title={t("Position duplizieren", "Duplicate line")}
                              className="min-h-[42px] min-w-[42px] sm:min-h-[36px] sm:min-w-[36px] inline-flex items-center justify-center text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/50"
                            >
                              <Copy className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeLine(idx)}
                              title={t("Position löschen", "Delete line")}
                              className="min-h-[42px] min-w-[42px] sm:min-h-[36px] sm:min-w-[36px] inline-flex items-center justify-center text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                            >
                              <Trash2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* § 35a Craft Labor Flag */}
                      <div className="flex items-center gap-2 pt-1 border-t border-slate-200/50 text-[11px] text-slate-600">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={l.labour}
                            onChange={(e) => updateLine(idx, { labour: e.target.checked })}
                            className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                          />
                          <span className="font-semibold text-slate-700">
                            {t("Handwerkerleistung nach § 35a EStG (steuerlich absetzbar für Kunden)", "§ 35a EStG Craft Labor (Tax-deductible for client)")}
                          </span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addBlankLine}
                  className="w-full min-h-[42px] border-2 border-dashed border-slate-200 hover:border-emerald-500 text-slate-600 hover:text-emerald-700 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t("+ Freie Position hinzufügen", "+ Add Custom Line Item")}</span>
                </button>
              </div>
            </div>

            {/* Right 4 Cols: ACCA & BILLDU STYLE CHARTS & FINANCIAL SUMMARY */}
            <div className="lg:col-span-4 space-y-4">
              {/* Cost Category Distribution Chart (ACCA Style) */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-emerald-700" />
                    <span>{t("Kostenstruktur & Verteilung", "Cost Breakdown & Ratio")}</span>
                  </h4>
                  <span className="text-[11px] font-bold text-slate-400">
                    § 35a EStG
                  </span>
                </div>

                {/* Progress Bar Chart */}
                <div className="space-y-1.5">
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                    <div
                      style={{ width: `${docTotals.labourPct}%` }}
                      className="bg-emerald-600 h-full transition-all"
                      title={`Lohn: ${docTotals.labourPct}%`}
                    />
                    <div
                      style={{ width: `${docTotals.materialPct}%` }}
                      className="bg-sky-500 h-full transition-all"
                      title={`Material: ${docTotals.materialPct}%`}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-600 pt-0.5">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      {t("Lohn:", "Labor:")} {docTotals.labourPct}% ({eur(docTotals.labourNet)})
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-sky-500" />
                      {t("Material:", "Material:")} {docTotals.materialPct}% ({eur(docTotals.materialNet)})
                    </span>
                  </div>
                </div>
              </div>

              {/* Date & Payment Terms Timeline (Billdu Style) */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-sky-700" />
                    <span>{t("Zahlungsziel & Fälligkeit", "Payment Terms & Timeline")}</span>
                  </h4>
                  {(() => {
                    const st = getDocDateStatus(curDoc);
                    return (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${st.color}`}>
                        {st.label}
                      </span>
                    );
                  })()}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[10px]">{t("Ausgestellt am:", "Issued on:")}</span>
                    <strong className="text-slate-800">{curDoc.date}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">{t("Fällig bis:", "Due by:")}</span>
                    <strong className="text-slate-800">{curDoc.dueOrValid}</strong>
                  </div>
                </div>

                {/* Skonto Bonus Card */}
                {curDoc.skontoPct && curDoc.skontoPct > 0 ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs space-y-1 text-emerald-900">
                    <div className="font-bold flex items-center justify-between">
                      <span>{curDoc.skontoPct} % {t("Skonto-Ersparnis:", "Early Payment Discount:")}</span>
                      <strong className="text-emerald-700">−{eur(docTotals.skontoAmount)}</strong>
                    </div>
                    <div className="text-[11px] text-emerald-700">
                      {t("Zahlbetrag bei Überweisung binnen 7 Tagen:", "Payable within 7 days:")}{" "}
                      <strong>{eur(docTotals.gross - docTotals.skontoAmount)}</strong>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* GoBD Totals & Tax Deduction Box */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3 text-xs">
                <h4 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2">
                  {t("GoBD-Gesamtsummen", "GoBD Accounting Totals")}
                </h4>
                {curDoc.discountPct && curDoc.discountPct > 0 ? (
                  <>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-600">{t("Zwischensumme (Netto vor Rabatt):", "Subtotal (Net before discount):")}</span>
                      <span className="font-semibold">{eur(docTotals.rawNet)}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100 text-emerald-800">
                      <span>{t(`Nachlass / Rabatt (${curDoc.discountPct} %):`, `Discount (${curDoc.discountPct} %):`)}</span>
                      <span className="font-bold">−{eur(docTotals.discountAmount)}</span>
                    </div>
                  </>
                ) : null}
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">{t("Nettobetrag:", "Net Total:")}</span>
                  <span className="font-bold">{eur(docTotals.net)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">{t(`Umsatzsteuer (${curDoc.vatRate} %):`, `VAT (${curDoc.vatRate} %):`)}</span>
                  <span className="font-bold">{eur(docTotals.vat)}</span>
                </div>
                <div className="flex justify-between py-2 border-b-2 border-slate-900 text-base font-extrabold text-slate-900">
                  <span>{t("Gesamtbetrag (Brutto):", "Gross Total:")}</span>
                  <span>{eur(docTotals.gross)}</span>
                </div>

                {/* § 35a Handwerker-Bonus */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 space-y-1.5">
                  <div className="font-bold text-slate-900">
                    {t("§ 35a EStG Handwerkerleistung (Lohnanteil):", "§ 35a EStG Craft Labor Bonus (Tax-Deductible):")}
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>{t("Ausgewiesener Arbeitsanteil:", "Eligible Labor Share:")}</span>
                    <strong>{eur(docTotals.labourGross)}</strong>
                  </div>
                  <div className="flex justify-between text-emerald-800">
                    <span>{t("20 % direkte Steuerersparnis:", "20 % Direct Tax Savings:")}</span>
                    <strong className="text-emerald-700 font-extrabold">−{eur(docTotals.taxBonus20)}</strong>
                  </div>
                </div>

                {/* 1-Click Convert or Print Buttons */}
                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setDocViewMode("preview")}
                    className="w-full min-h-[46px] bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors text-xs sm:text-sm"
                  >
                    <Eye className="w-4 h-4 shrink-0" />
                    <span>{t("📄 Live DIN 5008 Belegvorschau öffnen", "📄 Open Live DIN 5008 Preview")}</span>
                  </button>

                  {curDoc.type === "offer" && (
                    <button
                      type="button"
                      onClick={() => convertOfferToInvoice(curDoc)}
                      className="w-full min-h-[46px] bg-teal-700 hover:bg-teal-600 text-white font-extrabold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors text-xs sm:text-sm"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{t("⚡ In Rechnung umwandeln", "⚡ Convert to Invoice")}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setPreviewDoc(curDoc)}
                    className="w-full min-h-[46px] bg-[#0f2537] hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors text-xs"
                  >
                    <Printer className="w-4 h-4 shrink-0" />
                    <span>{t("Offizielles PDF drucken / ansehen", "Print / Preview Official PDF")}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          )}
        </div>
      )}

      {/* TAB 6: APPOINTMENTS & CALENDAR */}
      {tab === "termine" && (
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                {t("Geplante Vor-Ort-Feuchtigkeitsmessungen & Google Kalender", "Scheduled On-Site Moisture Diagnostics & Google Calendar")}
              </h3>
              <p className="text-xs text-slate-500 break-words mt-0.5">
                {t("Synchronisiert mit dem Google Kalender von", "Synchronized with Google Calendar of")}{" "}
                <strong className="break-all">{NOTIFY_EMAIL_DEFAULT}</strong>.
              </p>
            </div>
            <a
              href="https://calendar.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] inline-flex items-center justify-center gap-1.5 text-xs font-bold bg-[#0f2537] text-white px-4 py-2.5 rounded-xl shrink-0"
            >
              <span>{t("Google Kalender öffnen", "Open Google Calendar")}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <div className="divide-y divide-slate-200 text-xs">
            {appointments.map((apt) => (
              <div
                key={apt.nr}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <span className="font-extrabold text-emerald-700">
                    {apt.nr} · {apt.date} · {apt.time} {t("Uhr", "hrs")}
                  </span>
                  <div className="font-bold text-slate-900 mt-0.5">
                    {apt.type} – {apt.name} ({apt.leadId})
                  </div>
                  <div className="text-slate-500">
                    {apt.address} · Tel.: {apt.phone}
                  </div>
                </div>
                <span className="self-start sm:self-center shrink-0 font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: SEO STRATEGY & GOOGLE SUITE + AI (GEMINI / GEO) */}
      {tab === "seo" && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-gradient-to-r from-[#0c1d2c] via-[#0f2537] to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-slate-700/60 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>{t("Google Workspace, SEO & AI Search Engine Hub", "Google Workspace, SEO & AI Search Engine Hub")}</span>
                </span>
                <h3 className="text-lg sm:text-2xl font-extrabold text-white mt-1">
                  {t("Google Suche, Gemini AI & GEO-Strategie für sos-abdichtung.de", "Google Search, Gemini AI & GEO Strategy for sos-abdichtung.de")}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
                  {t(
                    "Behalten Sie Ihr tägliches Google-Wachstum im Blick und optimieren Sie Ihre Auffindbarkeit in Google Search, Google Maps, Google Gemini und KI-Suchmaschinen (GEO).",
                    "Monitor day-by-day organic Google growth and optimize visibility across Google Search, Google Maps, Google Gemini, and AI Search Engines (GEO)."
                  )}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>GEO Score: 98/100 (AI-Ready)</span>
                </span>
              </div>
            </div>

            {/* Google Tools Direct Access Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
              {/* Tool 1: Google Search Console */}
              <div className="bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-xl flex flex-col justify-between space-y-3 transition-colors">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400">SEO & Indexierung</span>
                    <Search className="w-4 h-4 text-sky-400" />
                  </div>
                  <h4 className="font-extrabold text-white text-sm mt-1">Google Search Console</h4>
                  <p className="text-[11px] text-slate-300 mt-1">
                    {t(
                      "Sitemap-Indexierung, tägliche Klicks, Suchbegriffe und Positionen in NRW.",
                      "Sitemap indexing, daily organic clicks, keywords, and rank tracking."
                    )}
                  </p>
                </div>
                <div className="pt-2 border-t border-white/10 space-y-1.5 text-xs">
                  <a
                    href="https://search.google.com/test/rich-results?url=https%3A%2F%2Fsos-abdichtung.de%2F"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-bold text-emerald-300 hover:text-emerald-200"
                    title="Live Googlebot-Prüfung ohne Login"
                  >
                    <span>{t("🚀 Live Googlebot-Test (Sofort) ↗", "🚀 Live Googlebot Test (Instant) ↗")}</span>
                  </a>
                  <div className="flex flex-col gap-1 text-[11px] text-slate-400 pt-0.5">
                    <div className="flex items-center justify-between">
                      <a
                        href="https://search.google.com/search-console/welcome"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-sky-300 font-semibold"
                      >
                        {t("+ Property anlegen ↗", "+ Add Property ↗")}
                      </a>
                      <a
                        href="https://search.google.com/search-console/sitemaps"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-slate-300"
                      >
                        Sitemap einreichen
                      </a>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <a
                        href="https://search.google.com/search-console/inspect?resource_id=https%3A%2F%2Fsos-abdichtung.de%2F&id=https%3A%2F%2Fsos-abdichtung.de%2F"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-slate-300"
                        title="URL-Präfix Inspektion (erfordert bestätigte Property)"
                      >
                        GSC-Inspect (Präfix)
                      </a>
                      <a
                        href="https://search.google.com/search-console/inspect?resource_id=sc-domain%3Asos-abdichtung.de&id=https%3A%2F%2Fsos-abdichtung.de%2F"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-slate-300"
                        title="Domain-Property Inspektion"
                      >
                        (Domain)
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tool 2: Google Business Profile (Maps) */}
              <div className="bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-xl flex flex-col justify-between space-y-3 transition-colors">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Local SEO / Maps</span>
                    <MapPin className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h4 className="font-extrabold text-white text-sm mt-1">Google Business Profile</h4>
                  <p className="text-[11px] text-slate-300 mt-1">
                    {t(
                      "Google Maps 3-Pack für Wuppertal, Anrufe direkt aus Maps & Kundenbewertungen.",
                      "Google Maps 3-Pack for Wuppertal, direct calls & customer reviews."
                    )}
                  </p>
                </div>
                <div className="pt-2 border-t border-white/10 space-y-1.5 text-xs">
                  <a
                    href="https://business.google.com/de/business-profile/?ppsrc=GPDA2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-bold text-emerald-300 hover:text-emerald-200"
                  >
                    <span>{t("Unternehmensprofil öffnen ↗", "Manage Profile ↗")}</span>
                  </a>
                  <div className="text-[11px] text-emerald-400 font-semibold">
                    {t("Direktlink mit Setup-Kit ↓", "Direct Link & Setup Kit ↓")}
                  </div>
                </div>
              </div>

              {/* Tool 3: Google Analytics 4 */}
              <div className="bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-xl flex flex-col justify-between space-y-3 transition-colors">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">Analytics & Traffic</span>
                    <BarChart3 className="w-4 h-4 text-amber-400" />
                  </div>
                  <h4 className="font-extrabold text-white text-sm mt-1">Google Analytics 4 (GA4)</h4>
                  <p className="text-[11px] text-slate-300 mt-1">
                    {t(
                      "Echtzeit-Besucher aus Wuppertal, Klick auf Telefonnummer & WhatsApp-Absprünge.",
                      "Real-time visitors, phone call clicks, and WhatsApp interactions."
                    )}
                  </p>
                </div>
                <div className="pt-2 border-t border-white/10 space-y-1 text-xs">
                  <a
                    href="https://analytics.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-bold text-amber-300 hover:text-amber-200"
                  >
                    <span>{t("GA4 Dashboard öffnen ↗", "Open GA4 ↗")}</span>
                  </a>
                </div>
              </div>

              {/* Tool 4: Google Local Services Ads */}
              <div className="bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-xl flex flex-col justify-between space-y-3 transition-colors">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400">Marketing & Leads</span>
                    <Star className="w-4 h-4 text-purple-400" />
                  </div>
                  <h4 className="font-extrabold text-white text-sm mt-1">Google Local Services Ads</h4>
                  <p className="text-[11px] text-slate-300 mt-1">
                    {t(
                      "Pay-per-Lead Handwerker-Anrufe mit offiziellem „Google Geprüft“-Gütesiegel in NRW.",
                      "Pay-per-Lead calls with 'Google Guaranteed' verification badge."
                    )}
                  </p>
                </div>
                <div className="pt-2 border-t border-white/10 space-y-1 text-xs">
                  <a
                    href="https://adwords.google.com/localservices"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-bold text-purple-300 hover:text-purple-200"
                  >
                    <span>{t("Local Services Ads ↗", "Open LSA ↗")}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* GOOGLE BUSINESS PROFILE (GBP) 1-CLICK SETUP & OPTIMIZATION KIT */}
          <div className="bg-gradient-to-br from-[#0f2537] via-slate-900 to-[#0a1824] border border-emerald-500/30 rounded-2xl p-5 sm:p-7 text-white space-y-6 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-white/10">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-extrabold tracking-wide uppercase">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                  <span>{t("Offizielles Google Unternehmensprofil", "Official Google Business Profile")}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  <span>{t("Google Business Profile Setup & 1-Klick-Stammdaten", "Google Business Profile Setup & 1-Click Master Data")}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  {t(
                    "Nutzen Sie den offiziellen deutschen Einrichtungslink für sos-abdichtung und kopieren Sie mit einem Klick die für Wuppertal und Bergisches Land suchmaschinenoptimierten Profildaten.",
                    "Use the official German Google Business Profile creation link and copy pre-optimized master data, categories, and descriptions with 1 click."
                  )}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
                <a
                  href="https://business.google.com/de/business-profile/?ppsrc=GPDA2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[46px] px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-500/25 transition-all"
                >
                  <ExternalLink className="w-4 h-4 shrink-0" />
                  <span>{t("Google Profil anlegen / öffnen ↗", "Create / Open Profile on Google ↗")}</span>
                </a>
              </div>
            </div>

            {/* Quick 1-Click Master Data Grid */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t("1-Klick-Kopierbare Profildaten (Exakt auf Google-Richtlinien abgestimmt)", "1-Click Copy Profile Data (Optimized for Google Guidelines)")}</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* 1. Name */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex flex-col justify-between space-y-2.5">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t("1. Unternehmensname", "1. Business Name")}</span>
                    <div className="text-xs font-extrabold text-white leading-snug">
                      sos-abdichtung – Kellersanierung & Schimmelbeseitigung Wuppertal
                    </div>
                    <p className="text-[10px] text-slate-400">{t("Kombiniert Marke mit den zwei stärksten Suchbegriffen & Ort.", "Combines brand name with top local search keywords.")}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard("sos-abdichtung – Kellersanierung & Schimmelbeseitigung Wuppertal", t("Unternehmensname", "Business Name"), "name")}
                    className={`w-full min-h-[34px] px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-all ${
                      copiedField === "name"
                        ? "bg-emerald-500 text-slate-950 font-black"
                        : "bg-white/10 hover:bg-white/20 text-emerald-300 border border-white/10"
                    }`}
                  >
                    {copiedField === "name" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === "name" ? t("Kopiert!", "Copied!") : t("Name kopieren", "Copy Name")}</span>
                  </button>
                </div>

                {/* 2. Primary & Secondary Categories */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex flex-col justify-between space-y-2.5">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t("2. Kategorien (Branche)", "2. Categories")}</span>
                    <div className="text-xs font-extrabold text-emerald-300">
                      {t("Primär: Abdichtungsunternehmen", "Primary: Abdichtungsunternehmen (Waterproofing)")}
                    </div>
                    <div className="text-[11px] text-slate-300">
                      {t("Sekundär: Bautrocknung, Schimmelbeseitigung, Bautenschutz, Bauunternehmen", "Secondary: Bautrocknung, Schimmelbeseitigung, Bautenschutz, Bauunternehmen")}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard("Abdichtungsunternehmen", t("Hauptkategorie", "Primary Category"), "cat")}
                    className={`w-full min-h-[34px] px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-all ${
                      copiedField === "cat"
                        ? "bg-emerald-500 text-slate-950 font-black"
                        : "bg-white/10 hover:bg-white/20 text-emerald-300 border border-white/10"
                    }`}
                  >
                    {copiedField === "cat" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === "cat" ? t("Kopiert!", "Copied!") : t("Hauptkategorie kopieren", "Copy Category")}</span>
                  </button>
                </div>

                {/* 3. Address & Service Area */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex flex-col justify-between space-y-2.5">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t("3. Standort & Einzugsgebiet", "3. Address & Service Area")}</span>
                    <div className="text-xs font-bold text-white">
                      {COMPANY_INFO.street}, {COMPANY_INFO.city}
                    </div>
                    <p className="text-[10px] text-slate-400">
                      {t("Einzugsgebiet: Wuppertal, Solingen, Remscheid, Velbert, Haan, Wermelskirchen, Essen", "Service area: Wuppertal, Solingen, Remscheid, Velbert, Haan, Wermelskirchen, Essen")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard("Wuppertal, Solingen, Remscheid, Velbert, Haan, Wermelskirchen, Essen", t("Einzugsgebiete", "Service Areas"), "area")}
                    className={`w-full min-h-[34px] px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-all ${
                      copiedField === "area"
                        ? "bg-emerald-500 text-slate-950 font-black"
                        : "bg-white/10 hover:bg-white/20 text-emerald-300 border border-white/10"
                    }`}
                  >
                    {copiedField === "area" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === "area" ? t("Kopiert!", "Copied!") : t("Einzugsgebiete kopieren", "Copy Service Areas")}</span>
                  </button>
                </div>

                {/* 4. Phone & Website */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex flex-col justify-between space-y-2.5">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t("4. Telefon & Website", "4. Phone & Website")}</span>
                    <div className="text-xs font-bold text-white">{COMPANY_INFO.phoneDisplay}</div>
                    <div className="text-[11px] text-slate-300">https://sos-abdichtung.de/</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard("https://sos-abdichtung.de/", t("Website-URL", "Website URL"), "web")}
                    className={`w-full min-h-[34px] px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-all ${
                      copiedField === "web"
                        ? "bg-emerald-500 text-slate-950 font-black"
                        : "bg-white/10 hover:bg-white/20 text-emerald-300 border border-white/10"
                    }`}
                  >
                    {copiedField === "web" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === "web" ? t("Kopiert!", "Copied!") : t("Website-URL kopieren", "Copy Website")}</span>
                  </button>
                </div>

                {/* 5. Appointment Link */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex flex-col justify-between space-y-2.5">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t("5. Termin- / Buchungslink", "5. Appointment Booking URL")}</span>
                    <div className="text-xs font-bold text-emerald-300">https://sos-abdichtung.de/kontakt/</div>
                    <p className="text-[10px] text-slate-400">{t("Direkt im Google Profil als 'Termine buchen' hinterlegen.", "Add in Google profile as 'Book appointment' link.")}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard("https://sos-abdichtung.de/kontakt/", t("Terminlink", "Appointment Link"), "applink")}
                    className={`w-full min-h-[34px] px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-all ${
                      copiedField === "applink"
                        ? "bg-emerald-500 text-slate-950 font-black"
                        : "bg-white/10 hover:bg-white/20 text-emerald-300 border border-white/10"
                    }`}
                  >
                    {copiedField === "applink" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === "applink" ? t("Kopiert!", "Copied!") : t("Terminlink kopieren", "Copy Appointment Link")}</span>
                  </button>
                </div>

                {/* 6. Business Hours */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex flex-col justify-between space-y-2.5">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t("6. Öffnungszeiten", "6. Business Hours")}</span>
                    <div className="text-xs font-bold text-white">Mo–Fr: 07:00 – 19:00 Uhr</div>
                    <div className="text-[11px] text-slate-300">Sa: 08:00 – 16:00 Uhr | So: Notdienst</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard("Mo-Fr: 07:00-19:00, Sa: 08:00-16:00", t("Öffnungszeiten", "Business Hours"), "hours")}
                    className={`w-full min-h-[34px] px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-all ${
                      copiedField === "hours"
                        ? "bg-emerald-500 text-slate-950 font-black"
                        : "bg-white/10 hover:bg-white/20 text-emerald-300 border border-white/10"
                    }`}
                  >
                    {copiedField === "hours" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === "hours" ? t("Kopiert!", "Copied!") : t("Zeiten kopieren", "Copy Hours")}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Optimized 750-Character Description */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{t("Google-optimierte Unternehmensbeschreibung (750 Zeichen)", "Google-Optimized Business Description (750 chars)")}</span>
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    {t(
                      "Enthält alle wichtigen Schlüsselbegriffe für Top-Rankings in Google Maps (WTA, SchimmelPeter®, Horizontalsperre, 10 Jahre Garantie).",
                      "Contains core ranking keywords for Google Maps (WTA, SchimmelPeter®, horizontal barrier, 10-year warranty)."
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    642 / 750 {t("Zeichen", "chars")}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const desc = isEn
                        ? "Certified specialist for basement waterproofing, horizontal damp-proof barriers, internal cellar sealing, and professional mold remediation in Wuppertal and the Bergisches Land region. As an official SchimmelPeter® partner and WTA-certified company, we deliver lasting masonry drying with a 10-year warranty. We solve rising damp, pressing groundwater, damp basement walls, efflorescence, and mold in residential and commercial properties. Book your free on-site moisture diagnostic and fixed-price quote today."
                        : "Zertifizierter Fachbetrieb für Kellersanierung, Horizontalsperre, Kellerinnenabdichtung und professionelle Schimmelbeseitigung in Wuppertal und dem gesamten Bergischen Land. Als SchimmelPeter® Partnerbetrieb und WTA-zertifizierter Experte bieten wir nachhaltige Mauerwerkstrockenlegung mit 10 Jahren Garantie. Wir beheben aufsteigende Feuchtigkeit, drückendes Grundwasser, feuchte Kellerwände, Salzausblühungen und Schimmelbefall in Alt- und Neubauten. Nutzen Sie unsere kostenlose Vor-Ort-Feuchtigkeitsmessung und Schadensanalyse mit Festpreisgarantie. Termine flexibel nach Vereinbarung – Ihr Partner für ein trockenes und gesundes Zuhause.";
                      copyToClipboard(desc, t("Unternehmensbeschreibung", "Business Description"), "desc");
                    }}
                    className={`min-h-[36px] px-3.5 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-all ${
                      copiedField === "desc"
                        ? "bg-emerald-500 text-slate-950 font-black"
                        : "bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold"
                    }`}
                  >
                    {copiedField === "desc" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === "desc" ? t("Kopiert!", "Copied!") : t("Beschreibung kopieren", "Copy Description")}</span>
                  </button>
                </div>
              </div>

              <div className="bg-black/30 rounded-lg p-3.5 text-xs text-slate-200 leading-relaxed font-sans border border-white/5">
                {isEn ? (
                  <>
                    Certified specialist for basement waterproofing, horizontal damp-proof barriers, internal cellar sealing, and professional mold remediation in Wuppertal and the Bergisches Land region. As an official <strong className="text-emerald-300 font-bold">SchimmelPeter® partner</strong> and <strong className="text-emerald-300 font-bold">WTA-certified company</strong>, we deliver lasting masonry drying with a <strong className="text-emerald-300 font-bold">10-year warranty</strong>. We solve rising damp, pressing groundwater, damp basement walls, efflorescence, and mold in residential and commercial properties. Book your free on-site moisture diagnostic and fixed-price quote today.
                  </>
                ) : (
                  <>
                    Zertifizierter Fachbetrieb für Kellersanierung, Horizontalsperre, Kellerinnenabdichtung und professionelle Schimmelbeseitigung in Wuppertal und dem gesamten Bergischen Land. Als <strong className="text-emerald-300 font-bold">SchimmelPeter® Partnerbetrieb</strong> und <strong className="text-emerald-300 font-bold">WTA-zertifizierter Experte</strong> bieten wir nachhaltige Mauerwerkstrockenlegung mit <strong className="text-emerald-300 font-bold">10 Jahren Garantie</strong>. Wir beheben aufsteigende Feuchtigkeit, drückendes Grundwasser, feuchte Kellerwände, Salzausblühungen und Schimmelbefall in Alt- und Neubauten. Nutzen Sie unsere kostenlose Vor-Ort-Feuchtigkeitsmessung und Schadensanalyse mit Festpreisgarantie. Termine flexibel nach Vereinbarung – Ihr Partner für ein trockenes und gesundes Zuhause.
                  </>
                )}
              </div>
            </div>

            {/* 6 Pre-Formulated Services for GBP Services Tab */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t("6 Dienstleistungen für den Google-Leistungskatalog (Direkt einfügen)", "6 Services for Google Business Catalog (Ready to Paste)")}</span>
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  {
                    title_de: "Horizontalsperre (WTA)",
                    title_en: "Horizontal Damp Barrier (WTA)",
                    desc_de: "Drucklose & Niederdruck-Injektion mit Silan-Mikroemulsion gegen aufsteigende Feuchtigkeit. 10 Jahre Garantie.",
                    desc_en: "Low-pressure silane microemulsion injection against rising damp. 10-year warranty.",
                    key: "srv_hz",
                  },
                  {
                    title_de: "Kellerinnenabdichtung (MDS)",
                    title_en: "Internal Cellar Waterproofing (MDS)",
                    desc_de: "Mehrlagige mineralische Dichtungsschlämme mit Hohlkehle bei drückendem Grundwasser ohne Erdaushub.",
                    desc_en: "Multi-layer mineral waterproofing slurries with coving against pressing groundwater without excavation.",
                    key: "srv_mds",
                  },
                  {
                    title_de: "Schimmelbeseitigung (TÜV)",
                    title_en: "Mold Remediation (TÜV Certified)",
                    desc_de: "Fachgerechte Schimmelsanierung, Sporenentfernung und diffusionsoffene Calciumsilikat-Klimaplatten.",
                    desc_en: "Professional mold remediation, spore neutralization, and calcium silicate insulating boards.",
                    key: "srv_schimmel",
                  },
                  {
                    title_de: "Rissinjektion & Druckwasserschutz",
                    title_en: "Crack Injection & Pressure Sealing",
                    desc_de: "Dauerelastische Verpressung von Beton- und Mauerwerksrissen mit Polyurethanharzen und Acrylatgelen.",
                    desc_en: "Flexible resin crack injection for active water leaks in concrete walls and foundations.",
                    key: "srv_riss",
                  },
                  {
                    title_de: "Kelleraußenabdichtung (DIN 18533)",
                    title_en: "External Waterproofing (DIN 18533)",
                    desc_de: "Erdberührte Abdichtung mit Bitumendickbeschichtung (PMBC), Perimeterdämmung und Dränage nach DIN 18533.",
                    desc_en: "Earth-contact bitumen coating (PMBC), perimeter insulation, and drainage systems according to DIN 18533.",
                    key: "srv_aussen",
                  },
                  {
                    title_de: "Kostenlose Vor-Ort-Feuchtemessung",
                    title_en: "Free On-Site Moisture Diagnostic",
                    desc_de: "Zerstörungsfreie Mikrowellen- & CM-Feuchtigkeitsanalyse vor Ort in Wuppertal mit verbindlichem Festpreisangebot.",
                    desc_en: "Non-destructive microwave & CM moisture analysis in Wuppertal with guaranteed fixed-price quote.",
                    key: "srv_mess",
                  },
                ].map((srv) => (
                  <div key={srv.key} className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col justify-between space-y-2">
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-white flex items-center justify-between">
                        <span>{isEn ? srv.title_en : srv.title_de}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-snug">
                        {isEn ? srv.desc_en : srv.desc_de}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const copyText = `${isEn ? srv.title_en : srv.title_de}\n${isEn ? srv.desc_en : srv.desc_de}`;
                        copyToClipboard(copyText, isEn ? srv.title_en : srv.title_de, srv.key);
                      }}
                      className={`w-full min-h-[30px] px-2.5 py-1 rounded-lg text-[11px] font-bold inline-flex items-center justify-center gap-1.5 transition-all ${
                        copiedField === srv.key
                          ? "bg-emerald-500 text-slate-950 font-black"
                          : "bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10"
                      }`}
                    >
                      {copiedField === srv.key ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedField === srv.key ? t("Kopiert!", "Copied!") : t("Leistung kopieren", "Copy Service")}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 5-Step Google Verification & Success Guide */}
            <div className="bg-slate-950/60 border border-white/10 rounded-xl p-4 sm:p-5 space-y-3">
              <h4 className="text-xs sm:text-sm font-extrabold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t("5-Schritte-Erfolgsplan für Platz 1 im Google Maps 3-Pack", "5-Step Success Plan for Rank #1 in Google Maps 3-Pack")}</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 space-y-1">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-[11px] flex items-center justify-center">1</span>
                  <div className="font-bold text-white text-[11px]">{t("Link aufrufen", "Open Link")}</div>
                  <p className="text-[10px] text-slate-300">{t("Auf 'Google Profil anlegen' klicken & mit Google-Konto anmelden.", "Click setup button and sign in with Google account.")}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 space-y-1">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-[11px] flex items-center justify-center">2</span>
                  <div className="font-bold text-white text-[11px]">{t("Daten einfügen", "Paste Data")}</div>
                  <p className="text-[10px] text-slate-300">{t("Name, Kategorien, Adresse, Zeiten & Beschreibung mit 1 Klick einfügen.", "Paste business name, categories, hours, and description.")}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 space-y-1">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-[11px] flex items-center justify-center">3</span>
                  <div className="font-bold text-white text-[11px]">{t("Verifizierung", "Verification")}</div>
                  <p className="text-[10px] text-slate-300">{t("Verifizierung abschließen (Google SMS, Video oder Postkarte).", "Complete verification via Google SMS, video, or postcard.")}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 space-y-1">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-[11px] flex items-center justify-center">4</span>
                  <div className="font-bold text-white text-[11px]">{t("Fotos hochladen", "Upload Photos")}</div>
                  <p className="text-[10px] text-slate-300">{t("Firmenfahrzeug, Team, Vorher/Nachher-Sanierungsbilder hochladen.", "Upload branded vehicle, team, and before/after repair photos.")}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 space-y-1">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-[11px] flex items-center justify-center">5</span>
                  <div className="font-bold text-white text-[11px]">{t("Bewertungen", "Get Reviews")}</div>
                  <p className="text-[10px] text-slate-300">{t("WhatsApp-Bewertungsbooster unten nutzen für die ersten 5-Sterne.", "Use WhatsApp review booster below to collect first 5-star reviews.")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* DAY-BY-DAY GOOGLE SEARCH GROWTH TRACKER */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-700" />
                  <span>{t("Wie Sie Tag für Tag Ihr Google-Suchwachstum messen", "How to Track Day-by-Day Google Search Growth")}</span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t(
                    "SEO wächst in 3 aufeinanderfolgenden Phasen. So prüfen Sie Ihre tägliche Verbesserung in Google Search Console:",
                    "SEO growth occurs in 3 distinct phases. Here is how to monitor daily progress in Google Search Console:"
                  )}
                </p>
              </div>
              <a
                href="https://search.google.com/search-console/performance/search-result"
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[38px] text-xs font-bold bg-[#0f2537] hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl inline-flex items-center gap-1.5 shrink-0"
              >
                <span>{t("Live GSC-Leistung prüfen ↗", "Check Live GSC Performance ↗")}</span>
              </a>
            </div>

            {/* GSC Verification & URL Inspect Troubleshooting Helper */}
            <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 sm:p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-sky-700 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
                    GSC
                  </div>
                  <div>
                    <h5 className="font-extrabold text-slate-900 text-sm">
                      {t("Warum zeigt Google „Keine Berechtigung“ bei der URL-Prüfung?", "Why does Google Search Console URL Inspect show 'No Permission'?")}
                    </h5>
                    <p className="text-[11px] text-slate-600">
                      {t(
                        "Google Search Console schützt Website-Daten: Sie können URLs erst analysieren, nachdem die Property „https://sos-abdichtung.de/“ in Ihrem Google-Konto einmalig bestätigt wurde.",
                        "GSC requires property verification before allowing URL inspection. Once verified in your Google account, deep links will work."
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href="https://search.google.com/test/rich-results?url=https%3A%2F%2Fsos-abdichtung.de%2F"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[36px] px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <span>{t("🚀 Live-Test ohne Login ↗", "🚀 Live Test (No Login) ↗")}</span>
                  </a>
                  <a
                    href="https://search.google.com/search-console/welcome"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[36px] px-3.5 py-1.5 rounded-lg bg-[#0f2537] hover:bg-slate-800 text-white font-bold text-xs inline-flex items-center gap-1.5"
                  >
                    <span>{t("Property bestätigen ↗", "Verify Property ↗")}</span>
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1 text-xs">
                <div className="bg-white p-3 rounded-lg border border-sky-100 space-y-1">
                  <strong className="text-slate-900 block font-bold text-[11px]">1. Property anlegen:</strong>
                  <p className="text-[11px] text-slate-600">
                    Öffnen Sie <a href="https://search.google.com/search-console/welcome" target="_blank" rel="noopener noreferrer" className="text-sky-700 underline font-semibold">GSC Welcome</a> und tragen Sie unter <strong>URL-Präfix</strong> exakt <code className="bg-slate-100 px-1 py-0.5 rounded text-[10px]">https://sos-abdichtung.de/</code> ein.
                  </p>
                  <button
                    type="button"
                    onClick={() => copyToClipboard("https://sos-abdichtung.de/", t("GSC URL-Präfix", "GSC URL Prefix"), "gsc_prefix")}
                    className="mt-1 text-[10px] font-bold text-sky-700 hover:text-sky-900 inline-flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{t("URL kopieren", "Copy URL")}</span>
                  </button>
                </div>

                <div className="bg-white p-3 rounded-lg border border-sky-100 space-y-1">
                  <strong className="text-slate-900 block font-bold text-[11px]">2. 1-Klick Bestätigung:</strong>
                  <p className="text-[11px] text-slate-600">
                    Wählen Sie <strong>Google Analytics</strong> als Bestätigungsmethode (funktioniert sofort mit 1 Klick, wenn Sie dasselbe Google-Konto nutzen) oder HTML-Tag.
                  </p>
                </div>

                <div className="bg-white p-3 rounded-lg border border-sky-100 space-y-1">
                  <strong className="text-slate-900 block font-bold text-[11px]">3. Sofortige URL-Prüfung:</strong>
                  <p className="text-[11px] text-slate-600">
                    Nach der Bestätigung funktioniert der Link <a href="https://search.google.com/search-console/inspect?resource_id=https%3A%2F%2Fsos-abdichtung.de%2F&id=https%3A%2F%2Fsos-abdichtung.de%2F" target="_blank" rel="noopener noreferrer" className="text-sky-700 underline font-semibold">GSC URL-Inspect ↗</a> dauerhaft in Ihrem Browser.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Phase 1 */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 font-extrabold text-xs flex items-center justify-center">1</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Tage 1 – 14</span>
                </div>
                <h5 className="font-extrabold text-slate-900 text-sm">
                  {t("Einblendungen (Impressions)", "Search Impressions")}
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {t(
                    "Der wichtigste Frühindikator! Sobald Google Ihre 24 Zielseiten indexiert, steigen die Einblendungen täglich. Wenn dieser Graph nach oben zeigt, schlägt das SEO an.",
                    "The leading indicator! As Google crawls your 24 pages, impressions rise daily. An upward slope proves Google is indexing your terms."
                  )}
                </p>
                <div className="text-[11px] font-bold text-sky-700 bg-sky-50 p-2 rounded-lg border border-sky-200/60">
                  Ziel: &gt; 500 Einblendungen / Woche
                </div>
              </div>

              {/* Phase 2 */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-extrabold text-xs flex items-center justify-center">2</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Woche 2 – 6</span>
                </div>
                <h5 className="font-extrabold text-slate-900 text-sm">
                  {t("Ranking-Position (Ø Position)", "Average Rank Position")}
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {t(
                    "Beobachten Sie die Position für „Kellersanierung Wuppertal“ und „Horizontalsperre Bergisches Land“. Ziel ist der Sprung von Seite 3 (Pos. 25) auf Seite 1 (Top 3).",
                    "Monitor ranks for key terms. Watch your pages climb from page 3 (pos 25) into page 1 top rankings (positions 1–3)."
                  )}
                </p>
                <div className="text-[11px] font-bold text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200/60">
                  Ziel: Top 3 für Wuppertal & PLZ 42
                </div>
              </div>

              {/* Phase 3 */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center justify-center">3</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Monat 1+</span>
                </div>
                <h5 className="font-extrabold text-slate-900 text-sm">
                  {t("Organische Klicks & Anrufe", "Organic Clicks & Phone Calls")}
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {t(
                    "Klicks verwandeln sich in direkte Vor-Ort-Termine und Anfragen. Eine Klickrate (CTR) von 4 % bis 8 % auf Seite 1 bringt kontinuierlich qualifizierte Kundenanfragen.",
                    "Clicks convert into real moisture inspection leads. A CTR of 4% to 8% in top spots generates steady inquiries without ad spend."
                  )}
                </p>
                <div className="text-[11px] font-bold text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200/60">
                  Ziel: 10–25 Neukunden-Anfragen / Monat
                </div>
              </div>
            </div>
          </div>

          {/* AI SEARCH & GENERATIVE ENGINE OPTIMIZATION (GEMINI / GEO HUB) */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  {t("GEO – Generative Engine Optimization", "GEO – Generative Engine Optimization")}
                </span>
                <h4 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  <span>{t("Wie wir in Google Gemini, ChatGPT & Perplexity empfohlen werden", "How to Get Recommended by Google Gemini, ChatGPT & Perplexity")}</span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5 max-w-3xl">
                  {t(
                    "KI-Suchmaschinen empfehlen Fachbetriebe basierend auf 3 harten Faktoren: Strukturierte Daten (llms.txt), verifizierte E-E-A-T-Qualifikationen (SchimmelPeter & 10 Jahre Garantie) und Kundenbewertungen mit Fachbegriffen.",
                    "AI search engines cite and recommend local businesses based on: structured data (llms.txt), verified credentials (SchimmelPeter & 10-year warranty), and customer reviews containing technical keywords."
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="/llms.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[36px] text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-xl inline-flex items-center gap-1"
                >
                  <span>llms.txt ↗</span>
                </a>
                <a
                  href="/llms-full.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[36px] text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-xl inline-flex items-center gap-1"
                >
                  <span>llms-full.txt ↗</span>
                </a>
              </div>
            </div>

            {/* AI Test Search Links */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
              <div className="text-xs font-extrabold text-slate-900">
                {t("⚡ Live-Test: Prüfen Sie die KI-Empfehlungen mit 1 Klick:", "⚡ Live Test: Verify AI Engine Recommendations in 1 Click:")}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <a
                  href="https://gemini.google.com/app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white hover:bg-emerald-50 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all flex flex-col justify-between space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-slate-900">Google Gemini</span>
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <div className="text-[11px] text-slate-500 italic">
                    „Wer ist der beste Kellerabdichter in Wuppertal mit 10 Jahren Garantie?“
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700">In Gemini öffnen ↗</span>
                </a>

                <a
                  href="https://www.perplexity.ai/search?q=Wer+ist+der+beste+Fachbetrieb+f%C3%BCr+Kellersanierung+und+Horizontalsperre+in+Wuppertal+mit+Garantie"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white hover:bg-sky-50 rounded-xl border border-slate-200 hover:border-sky-300 transition-all flex flex-col justify-between space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-slate-900">Perplexity AI</span>
                    <Globe className="w-3.5 h-3.5 text-sky-600" />
                  </div>
                  <div className="text-[11px] text-slate-500 italic">
                    „Fachbetrieb Kellersanierung Horizontalsperre Wuppertal SchimmelPeter“
                  </div>
                  <span className="text-[11px] font-bold text-sky-700">In Perplexity öffnen ↗</span>
                </a>

                <a
                  href="https://chatgpt.com/?q=Kellersanierung+ohne+Aufgraben+Wuppertal+sos-abdichtung"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white hover:bg-teal-50 rounded-xl border border-slate-200 hover:border-teal-300 transition-all flex flex-col justify-between space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-slate-900">ChatGPT Search</span>
                    <Search className="w-3.5 h-3.5 text-teal-600" />
                  </div>
                  <div className="text-[11px] text-slate-500 italic">
                    „Kellersanierung ohne Aufgraben Wuppertal sos-abdichtung“
                  </div>
                  <span className="text-[11px] font-bold text-teal-700">In ChatGPT öffnen ↗</span>
                </a>
              </div>
            </div>

            {/* AI Review Keyword Strategy */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                <strong className="text-slate-900 block font-bold">1. Horizontalsperren-Review:</strong>
                <p className="text-[11px] text-slate-600 italic">
                  „Herr Mahmood hat unsere Horizontalsperre in Wuppertal ohne Aufgraben injiziert. Der Keller ist trocken, 10 Jahre Garantie geben Sicherheit!“
                </p>
                <div className="text-[10px] text-emerald-700 font-semibold">Gemini zitiert diesen Text für „Horizontalsperre Wuppertal“</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                <strong className="text-slate-900 block font-bold">2. Kellerinnenabdichtung-Review:</strong>
                <p className="text-[11px] text-slate-600 italic">
                  „Kellerinnenabdichtung mit MDS und Hohlkehle in Solingen perfekt abgedichtet. Keine nassen Wände mehr!“
                </p>
                <div className="text-[10px] text-emerald-700 font-semibold">Gemini zitiert diesen Text für „Kellerinnenabdichtung NRW“</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                <strong className="text-slate-900 block font-bold">3. Schimmelbeseitigung-Review:</strong>
                <p className="text-[11px] text-slate-600 italic">
                  „Schimmelbeseitigung und Klimaplatte im Altbau nach TÜV-Richtlinien. Sehr sauber gearbeitet, Top Fachbetrieb.“
                </p>
                <div className="text-[10px] text-emerald-700 font-semibold">Gemini zitiert diesen Text für „Schimmelbeseitigung Wuppertal“</div>
              </div>
            </div>
          </div>

          {/* 5-Star Review Generator & WhatsApp Booster */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 bg-gradient-to-br from-emerald-800 to-[#0f2537] text-white rounded-2xl p-5 sm:p-6 space-y-4 shadow-md">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase">
                <Star className="w-4 h-4 shrink-0 fill-amber-400 text-amber-400" />
                <span>{t("Google 5-Sterne Bewertungs-Booster", "Google 5-Star Review Booster")}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold">
                {t("Mehr Google-Bewertungen für Wuppertal", "Accelerate 5-Star Google Reviews")}
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {t(
                  "Nach einer erfolgreichen Feuchtigkeitsmessung oder Trockenlegung können Sie dem Kunden mit 1 Klick einen freundlichen WhatsApp-Link senden, der direkt zur 5-Sterne-Bewertungsmaske auf Google Maps führt.",
                  "Send customers a pre-crafted WhatsApp review request after a successful moisture inspection or cellar drying with 1 click."
                )}
              </p>
              <div className="bg-white/10 rounded-xl p-3.5 text-xs space-y-2 border border-white/10">
                <div className="font-semibold text-emerald-200">{t("Vorgeschlagener WhatsApp-Text:", "WhatsApp Message Preview:")}</div>
                <p className="italic text-slate-100">
                  „Hallo {curLead?.name || "Kunde"}, vielen Dank für Ihr Vertrauen in sos-abdichtung! Waren Sie mit unserer Vor-Ort-Beratung zufrieden? Wir würden uns riesig über eine kurze 5-Sterne-Bewertung auf Google freuen: https://business.google.com/de/business-profile/?ppsrc=GPDA2 Vielen Dank, Shahzad Mahmood“
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const revText = encodeURIComponent(
                    `Hallo ${curLead?.name || ""}, vielen Dank für Ihr Vertrauen in sos-abdichtung! Waren Sie mit unserer Vor-Ort-Beratung zur Kellersanierung zufrieden? Wir würden uns riesig über eine kurze 5-Sterne-Bewertung auf Google freuen: https://business.google.com/de/business-profile/?ppsrc=GPDA2 Herzliche Grüße, Shahzad Mahmood`
                  );
                  window.open(`https://wa.me/${(curLead?.phone || "").replace(/[^0-9]/g, "")}?text=${revText}`, "_blank");
                }}
                className="w-full min-h-[46px] bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span>{t("Bewertungslink per WhatsApp an aktuellen Kunden senden", "Send Review Request via WhatsApp to Current Customer")}</span>
              </button>
            </div>

            {/* Conversion Tracking & Google Ads Setup */}
            <div className="lg:col-span-6 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 space-y-4 text-xs shadow-sm">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-700" />
                <span>{t("Google Analytics & Conversion-Events", "Google Analytics & Conversion Tracking")}</span>
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {t(
                  "Ihre Website sendet wichtige Interaktionen direkt an Google Analytics 4, um zu messen, wie viele Hausbesitzer anrufen oder ein Angebot anfragen:",
                  "Your site tracks high-intent homeowner interactions to measure return on investment:"
                )}
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900">lead_form_submitted</div>
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Primäre Conversion (/kontakt/)
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900">document_or_photo_uploaded</div>
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Kunden-Schadensfoto / PDF Upload
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900">phone_call_clicked</div>
                  <span className="text-[11px] font-semibold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-full">
                    Anruf auf +49 172 2064177
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900">whatsapp_chat_opened</div>
                  <span className="text-[11px] font-semibold text-[#1ebe5d] bg-emerald-50 px-2 py-0.5 rounded-full">
                    WhatsApp Chat-Start
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Local SEO Landing Pages Matrix */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-emerald-700" />
                  <span>{t("Lokale SEO-Seiten & Keyword-Status in NRW", "Local SEO Landing Pages & NRW Keyword Matrix")}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t(
                    "Alle 24 statisch generierten Zielseiten sind mit Schema.org BreadcrumbList, LocalBusiness und Google Rich Snippets optimiert.",
                    "All 24 SSG pages are fully optimized with Schema.org BreadcrumbList, LocalBusiness, and FAQ rich snippets."
                  )}
                </p>
              </div>
              <a
                href="https://sos-abdichtung.de/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[38px] text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-xl inline-flex items-center gap-1 shrink-0"
              >
                <span>sitemap.xml ↗</span>
              </a>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-extrabold uppercase text-slate-500">
                    <th className="py-2.5 pr-3">Seite / URL</th>
                    <th className="py-2.5 px-3">Fokus-Keyword</th>
                    <th className="py-2.5 px-3">Zielgebiet</th>
                    <th className="py-2.5 pl-3 text-right">Aktion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {LOCAL_SEO_PAGES.map((pg, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2.5 pr-3 font-bold text-slate-900">
                        <a href={pg.url} target="_blank" rel="noopener noreferrer" className="hover:underline text-emerald-700">
                          {pg.title}
                        </a>
                        <div className="text-[10px] text-slate-400 font-mono">{pg.url}</div>
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-700">{pg.kw}</td>
                      <td className="py-2.5 px-3 text-slate-500">{pg.target}</td>
                      <td className="py-2.5 pl-3 text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          <a
                            href={`https://search.google.com/test/rich-results?url=${encodeURIComponent(`https://sos-abdichtung.de${pg.url}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded border border-emerald-200"
                            title="Live Googlebot-Test ohne GSC-Login ausführen"
                          >
                            <span>Live Googlebot ↗</span>
                          </a>
                          <a
                            href={`https://search.google.com/search-console/inspect?resource_id=${encodeURIComponent("https://sos-abdichtung.de/")}&id=${encodeURIComponent(`https://sos-abdichtung.de${pg.url}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-bold text-sky-700 hover:underline px-1 py-1"
                            title="Google Search Console URL-Prüfung (erfordert verifizierte Property)"
                          >
                            GSC ↗
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: HILFE & 1-CLICK CLOUD */}
      {tab === "hilfe" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 space-y-3.5">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase">
              <Rocket className="w-4 h-4 shrink-0" />
              <span>{t("1-Klick Website-Veröffentlichung (GitHub API)", "1-Click Website Publishing (GitHub API)")}</span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
              {t("Preise & Katalog ohne Code-Push aktualisieren", "Update Prices & Catalog Without Code Push")}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t(
                "Änderungen im Google Sheet (Reiter Katalog, Preise und Konfiguration) werden per GitHub REST API direkt nach avaisqarni365/SOS24 (public/data/master.json) übertragen und lösen automatisch den GitHub Pages Build aus.",
                "Changes in Google Sheets (Catalog, Rates and Configuration tabs) are pushed via the GitHub REST API to avaisqarni365/SOS24 (public/data/master.json) and automatically trigger the GitHub Pages static build."
              )}
            </p>
            <button
              type="button"
              onClick={() => {
                setPublishStatus(t("Synchronisiere Katalog mit github.com/avaisqarni365/SOS24 …", "Syncing catalog with github.com/avaisqarni365/SOS24 …"));
                setTimeout(() => {
                  setPublishStatus(
                    t("✓ Katalog (public/data/master.json) ist aktuell & veröffentlicht!", "✓ Catalog (public/data/master.json) is up to date & published!")
                  );
                  showToast(t("Website-Katalog erfolgreich abgeglichen.", "Website catalog successfully synchronized."));
                }, 900);
              }}
              className="w-full sm:w-auto min-h-[48px] bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-3 rounded-xl inline-flex items-center justify-center gap-2"
            >
              <Rocket className="w-4 h-4 shrink-0" />
              <span>{t("Preise & Katalog jetzt veröffentlichen", "Publish Prices & Catalog Now")}</span>
            </button>
            {publishStatus && <p className="text-xs font-bold text-emerald-800">{publishStatus}</p>}
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 space-y-3 text-xs min-w-0">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
              {t("Cloud-Verbindung & Google Konto", "Cloud Connection & Google Workspace")}
            </h3>
            <div className="space-y-2.5 text-slate-700 break-words">
              <div>
                <strong>{t("Google-Konto (Sheets, Drive, Kalender):", "Google Workspace Account (Sheets, Drive, Calendar):")}</strong>{" "}
                <code className="break-all bg-slate-100 px-2 py-0.5 rounded">
                  {NOTIFY_EMAIL_DEFAULT}
                </code>
              </div>
              <div>
                <strong>{t("Drive-Ordner Schadensfotos:", "Drive Folder Damage Photos:")}</strong>{" "}
                <code className="break-words bg-slate-100 px-2 py-0.5 rounded">
                  SOS Abdichtung - Schadensfotos / &lt;Anfrage-ID&gt;
                </code>
              </div>
              <div>
                <strong>{t("Drive-Ordner Verträge:", "Drive Folder Contracts:")}</strong>{" "}
                <code className="bg-slate-100 px-2 py-0.5 rounded">SOS Abdichtung - Verträge</code>
              </div>
              <div>
                <strong>{t("Drive-Ordner GoBD-Belege:", "Drive Folder GoBD Receipts:")}</strong>{" "}
                <code className="bg-slate-100 px-2 py-0.5 rounded">
                  SOS Abdichtung - Belege / 2026
                </code>
              </div>
              <div>
                <strong>{t("Apps Script Endpoint:", "Apps Script Endpoint:")}</strong>{" "}
                <code className="break-all bg-slate-100 px-2 py-0.5 rounded block mt-1">
                  {GAS_API_URL}
                </code>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full-Screen Photo Lightbox Modal */}
      {zoomPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) setZoomPhoto(null);
          }}
        >
          <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90dvh]">
            <div className="bg-[#0f2537] text-white px-4 py-3 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <strong className="text-xs sm:text-sm block truncate">
                  {zoomPhoto.leadId} · {zoomPhoto.photo.name}
                </strong>
                <span className="text-[11px] text-emerald-300 block truncate">
                  Drive: {zoomPhoto.photo.driveFolder}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={zoomPhoto.photo.dataUrl}
                  download={zoomPhoto.photo.name}
                  className="min-h-[38px] inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
                <button
                  type="button"
                  onClick={() => setZoomPhoto(null)}
                  className="min-h-[38px] bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-xl inline-flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  <span>{t("Schließen", "Close")}</span>
                </button>
              </div>
            </div>
            <div className="p-4 bg-slate-900 flex-1 overflow-auto flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={zoomPhoto.photo.dataUrl}
                alt={zoomPhoto.photo.name}
                className="max-h-[72dvh] w-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* Printable GoBD PDF Modal */}
      {previewDoc && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPreviewDoc(null);
          }}
        >
          <div className="bg-white w-full max-w-4xl max-h-[94dvh] rounded-2xl overflow-hidden flex flex-col shadow-2xl">
            <div className="bg-[#0f2537] text-white px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-700">
              <div className="flex items-center gap-2.5 truncate">
                <img
                  src="/logo.svg"
                  alt="SOS Abdichtung"
                  className="h-6 w-auto brightness-0 invert"
                />
                <span className="text-slate-400">|</span>
                <strong className="text-xs sm:text-sm truncate">
                  {previewDoc.nr} · {previewDoc.typeLabel} ({previewDoc.name})
                </strong>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="min-h-[40px] bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>{t("🖨️ Drucken / Als PDF speichern", "🖨️ Print / Save as PDF")}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="min-h-[40px] bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3.5 py-2 rounded-xl"
                >
                  {t("Schließen ×", "Close ×")}
                </button>
              </div>
            </div>

            <div className="p-3 sm:p-6 overflow-y-auto bg-slate-100/70">
              {renderDIN5008Invoice(previewDoc, true)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
