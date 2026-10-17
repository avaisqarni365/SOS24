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

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
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

  const calcDocTotals = (doc?: WorkspaceGoBDDoc) => {
    if (!doc) return { net: 0, vat: 0, gross: 0, labourGross: 0, taxBonus20: 0 };
    const net = (doc.lines || []).reduce((sum, item) => sum + item.qty * item.price, 0);
    const vat = net * ((doc.vatRate ?? 19) / 100);
    const gross = net + vat;
    const labourGross = gross;
    const taxBonus20 = Math.min(1200, labourGross * 0.2);
    return { net, vat, gross, labourGross, taxBonus20 };
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
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2"
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
              className={`min-h-[44px] inline-flex items-center justify-center gap-1.5 px-2.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                tab === k
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white/5 text-slate-200 hover:bg-white/15"
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 space-y-4">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
              {t("Vor-Ort-Aufmaß & Schnellkalkulation", "On-Site Diagnostic Measurement & Quick Estimate")}
            </h3>
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
                </select>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-slate-700 mb-2">
                {t("WTA-Bausteine hinzufügen:", "Add WTA Standard Modules:")}
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
                    className="min-h-[40px] text-xs font-semibold bg-slate-100 hover:bg-emerald-50 text-slate-800 border border-slate-200 px-3 py-2 rounded-xl inline-flex items-center gap-1.5 text-left"
                  >
                    <Plus className="w-3.5 h-3.5 shrink-0 text-emerald-700" />
                    <span>{isEn ? tpl.pos_en : tpl.pos_de}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              {plLines.map((l, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:items-center bg-slate-50 p-3 rounded-xl border border-slate-200/80"
                >
                  <div className="sm:col-span-5 text-xs font-bold text-slate-900">{l.pos}</div>
                  <div className="flex items-center justify-between gap-2 sm:contents">
                    <div className="flex items-center gap-1.5 sm:col-span-3">
                      <input
                        type="number"
                        min={1}
                        aria-label={`Menge für ${l.pos}`}
                        value={l.qty}
                        onChange={(e) => {
                          const qty = Number(e.target.value) || 1;
                          setPlLines((prev) =>
                            prev.map((x, j) => (j === idx ? { ...x, qty } : x))
                          );
                        }}
                        className="w-20 sm:w-full min-h-[42px] px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-right text-base sm:text-sm font-bold text-slate-900"
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
                        className="min-h-[38px] min-w-[38px] inline-flex items-center justify-center text-slate-400 hover:text-red-600 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#0f2537] text-white rounded-2xl p-5 sm:p-6 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              {t("Live Aufmaß-Summe", "Live Estimate Total")}
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold">
              {eur(plLines.reduce((s, l) => s + l.qty * l.price, 0))}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t(
                "Inkl. ausgewiesenem Handwerker-Lohnanteil nach § 35a EStG und 10 Jahren Systemgarantie.",
                "Includes § 35a EStG tax-deductible craftsman labor bonus and 10-year system warranty."
              )}
            </p>
            <button
              type="button"
              onClick={() => {
                const newId = `A-${1001 + leads.length}`;
                const nl: WorkspaceLead = {
                  id: newId,
                  received: new Date().toLocaleString(isEn ? "en-US" : "de-DE"),
                  status: "Neu",
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
                persistAll(nextLeads, docs);
                createDocFromLead(nl, "offer");
              }}
              className="w-full min-h-[48px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm"
            >
              {t("📄 Als Anfrage speichern & GoBD-Angebot (PDF) öffnen →", "📄 Save as Lead & Open GoBD Quote (PDF) →")}
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: GoBD INVOICING & QUOTE ENGINE */}
      {tab === "belege" && curDoc && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex flex-wrap gap-2">
                {docs.map((d) => (
                  <button
                    key={d.nr}
                    type="button"
                    onClick={() => setSelectedDocNr(d.nr)}
                    className={`min-h-[42px] px-3.5 py-2 rounded-xl text-xs font-bold border ${
                      d.nr === curDoc.nr
                        ? "bg-[#0f2537] text-white border-[#0f2537]"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    {d.nr} ({d.typeLabel})
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setPreviewDoc(curDoc)}
                className="min-h-[44px] inline-flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shrink-0"
              >
                <Printer className="w-4 h-4" />
                <span>{t("👁️ PDF-Vorschau & Drucken", "👁️ PDF Preview & Print")}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t("Empfänger / Kunde", "Recipient / Customer")}
                </label>
                <input
                  type="text"
                  value={curDoc.name}
                  onChange={(e) => {
                    const nextDocs = docs.map((d) =>
                      d.nr === curDoc.nr ? { ...d, name: e.target.value } : d
                    );
                    persistAll(leads, nextDocs);
                  }}
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
                  onChange={(e) => {
                    const nextDocs = docs.map((d) =>
                      d.nr === curDoc.nr ? { ...d, address: e.target.value } : d
                    );
                    persistAll(leads, nextDocs);
                  }}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t("Betreff / Bauvorhaben", "Subject / Project")}
                </label>
                <input
                  type="text"
                  value={curDoc.service}
                  onChange={(e) => {
                    const nextDocs = docs.map((d) =>
                      d.nr === curDoc.nr ? { ...d, service: e.target.value } : d
                    );
                    persistAll(leads, nextDocs);
                  }}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t("Umsatzsteuer (§ 14 / § 19 UStG)", "VAT (§ 14 / § 19 UStG)")}
                </label>
                <select
                  value={curDoc.vatRate}
                  onChange={(e) => {
                    const nextDocs = docs.map((d) =>
                      d.nr === curDoc.nr ? { ...d, vatRate: Number(e.target.value) } : d
                    );
                    persistAll(leads, nextDocs);
                  }}
                  className={inputCls}
                >
                  <option value={19}>{t("19 % Regelbesteuerung", "19 % Standard VAT")}</option>
                  <option value={7}>{t("7 % Ermäßigt", "7 % Reduced VAT")}</option>
                  <option value={0}>{t("0 % Kleinunternehmer (§ 19 UStG)", "0 % Small Business (§ 19 UStG)")}</option>
                </select>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="text-xs font-bold text-slate-700">
                {t("Positionen (inkl. § 35a EStG Lohnanteil):", "Line Items (incl. § 35a EStG Craft Labor Bonus):")}
              </div>
              {curDoc.lines.map((l, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:grid sm:grid-cols-12 gap-1.5 sm:gap-2 sm:items-center text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/70"
                >
                  <div className="sm:col-span-6">
                    <div className="font-bold text-slate-900">{l.pos}</div>
                    <div className="text-slate-500">{l.basis}</div>
                  </div>
                  <div className="flex items-center justify-between sm:contents pt-1 sm:pt-0">
                    <div className="sm:col-span-2 sm:text-right font-semibold">
                      {l.qty} {l.unit}
                    </div>
                    <div className="sm:col-span-2 sm:text-right text-slate-500">{eur(l.price)}</div>
                    <div className="sm:col-span-2 sm:text-right font-extrabold text-slate-900">
                      {eur(l.qty * l.price)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 space-y-3 text-xs">
            <h3 className="text-base font-extrabold text-slate-900">
              {t("GoBD-Summen & § 35a EStG", "GoBD Totals & § 35a Tax Bonus")}
            </h3>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">{t("Nettobetrag:", "Net Total:")}</span>
              <span className="font-bold">{eur(docTotals.net)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">{t(`Umsatzsteuer (${curDoc.vatRate} %):`, `VAT (${curDoc.vatRate} %):`)}</span>
              <span className="font-bold">{eur(docTotals.vat)}</span>
            </div>
            <div className="flex justify-between py-2 border-b-2 border-slate-900 text-base font-extrabold text-slate-900">
              <span>{t("Gesamtbetrag (Brutto):", "Gross Total:")}</span>
              <span>{eur(docTotals.gross)}</span>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 space-y-1.5">
              <div className="font-bold text-slate-900">
                {t("§ 35a EStG Handwerkerleistung (Lohn- & Fahrtanteil):", "§ 35a EStG Craft Labor Bonus (Tax-Deductible):")}
              </div>
              <div className="flex justify-between text-slate-700">
                <span>{t("Ausgewiesener Arbeitsanteil:", "Eligible Labor Share:")}</span>
                <strong>{eur(docTotals.labourGross)}</strong>
              </div>
              <div className="flex justify-between text-emerald-800">
                <span>{t("20 % Steuerersparnis für Kunden:", "20 % Tax Savings for Client:")}</span>
                <strong>−{eur(docTotals.taxBonus20)}</strong>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPreviewDoc(curDoc)}
              className="w-full min-h-[48px] bg-[#0f2537] hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4 shrink-0" />
              <span>{t("Offizielles PDF öffnen & drucken", "Open Official PDF & Print")}</span>
            </button>
          </div>
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

      {/* TAB 7: SEO STRATEGY & GOOGLE SUITE */}
      {tab === "seo" && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  {t("Google Workspace & Local SEO Powerhouse", "Google Workspace & Local SEO Powerhouse")}
                </span>
                <h3 className="text-lg sm:text-2xl font-extrabold text-slate-900">
                  {t("Google Apps & SEO Strategie für sos-abdichtung.de", "Google Apps & SEO Strategy for sos-abdichtung.de")}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
                  {t(
                    "Alle essenziellen Google-Werkzeuge, lokales SEO für Wuppertal & NRW, Bewertungs-Management und Conversion-Tracking an einem zentralen Ort.",
                    "All essential Google tools, local SEO for Wuppertal & NRW, customer review acceleration, and lead tracking in one unified hub."
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Google Workspace Standard Active</span>
                </span>
              </div>
            </div>

            {/* Google Tools Quick Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* Tool 1: Google Search Console */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-slate-400">SEO & Indexierung</span>
                    <Search className="w-4 h-4 text-sky-600" />
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm mt-1">Google Search Console</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {t(
                      "Sitemap-Status, Keyword-Rankings in NRW und Google-Indexierungsprüfung.",
                      "Sitemap status, NRW keyword rankings, and URL inspection."
                    )}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-200 space-y-1 text-[11px]">
                  <div className="text-slate-600 font-semibold truncate">
                    Sitemap: <code>/sitemap.xml</code>
                  </div>
                  <a
                    href="https://search.google.com/search-console?resource_id=https://sos-abdichtung.de/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    <span>{t("Search Console öffnen", "Open Search Console")}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Tool 2: Google Business Profile (Maps) */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-slate-400">Local SEO / Maps</span>
                    <MapPin className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm mt-1">Google Business Profile</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {t(
                      "Google Maps Local Pack für Wuppertal (Höfen 80) & Kundenbewertungen.",
                      "Google Maps Local Pack for Wuppertal & 5-star customer reviews."
                    )}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-200 space-y-1 text-[11px]">
                  <a
                    href="https://business.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    <span>{t("Unternehmensprofil öffnen", "Manage Google Profile")}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Tool 3: Google Analytics 4 */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-slate-400">Analytics & Traffic</span>
                    <BarChart3 className="w-4 h-4 text-amber-600" />
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm mt-1">Google Analytics 4 (GA4)</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {t(
                      "Lead-Conversions, Klick auf Telefon & WhatsApp-Absprünge in Echtzeit.",
                      "Lead conversions, click-to-call, and WhatsApp interactions."
                    )}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-200 space-y-1 text-[11px]">
                  <a
                    href="https://analytics.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    <span>{t("Analytics öffnen", "Open GA4 Dashboard")}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Tool 4: Google Local Services Ads */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-slate-400">Marketing & Leads</span>
                    <Star className="w-4 h-4 text-purple-600" />
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm mt-1">Google Local Services Ads</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {t(
                      "Pay-per-Lead Handwerker-Anrufe mit „Google Geprüft“-Badge in NRW.",
                      "Pay-per-Lead calls with \"Google Guaranteed\" verification badge."
                    )}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-200 space-y-1 text-[11px]">
                  <a
                    href="https://adwords.google.com/localservices"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    <span>{t("Local Services Ads", "Open Local Services Ads")}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* 5-Star Review Generator & WhatsApp Booster */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 bg-gradient-to-br from-emerald-800 to-[#0f2537] text-white rounded-2xl p-5 sm:p-6 space-y-4">
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
                  „Hallo {curLead?.name || "Kunde"}, vielen Dank für Ihr Vertrauen in sos-abdichtung! Waren Sie mit unserer Vor-Ort-Beratung zufrieden? Wir würden uns riesig über eine kurze 5-Sterne-Bewertung auf Google freuen: https://g.page/r/sos-abdichtung/review Vielen Dank, Shahzad Mahmood“
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const revText = encodeURIComponent(
                    `Hallo ${curLead?.name || ""}, vielen Dank für Ihr Vertrauen in sos-abdichtung! Waren Sie mit unserer Vor-Ort-Beratung zur Kellersanierung zufrieden? Wir würden uns riesig über eine kurze 5-Sterne-Bewertung auf Google freuen: https://search.google.com/local/writereview?placeid=ChIJ-example Herzliche Grüße, Shahzad Mahmood`
                  );
                  window.open(`https://wa.me/${(curLead?.phone || "").replace(/[^\d]/g, "")}?text=${revText}`, "_blank");
                }}
                className="w-full min-h-[46px] bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span>{t("Bewertungslink per WhatsApp an aktuellen Kunden senden", "Send Review Request via WhatsApp to Current Customer")}</span>
              </button>
            </div>

            {/* Conversion Tracking & Google Ads Setup */}
            <div className="lg:col-span-6 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 space-y-4 text-xs">
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
                        <a
                          href={`https://search.google.com/search-console/inspect?resource_id=https://sos-abdichtung.de/&id=${encodeURIComponent(`https://sos-abdichtung.de${pg.url}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-bold text-sky-700 hover:underline"
                        >
                          Google Prüfen ↗
                        </a>
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
          <div className="bg-white w-full max-w-3xl max-h-[92dvh] rounded-2xl overflow-hidden flex flex-col shadow-2xl">
            <div className="bg-[#0f2537] text-white px-4 sm:px-5 py-3 flex flex-wrap items-center justify-between gap-2">
              <strong className="text-xs sm:text-sm truncate">
                {previewDoc.nr} · {previewDoc.typeLabel} ({previewDoc.name})
              </strong>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="min-h-[40px] bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl"
                >
                  {t("🖨️ Drucken / PDF", "🖨️ Print / PDF")}
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="min-h-[40px] bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-2 rounded-xl"
                >
                  {t("Schließen ×", "Close ×")}
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-8 overflow-y-auto space-y-5 text-xs text-slate-800">
              <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3 border-b-2 border-[#0f2537] pb-4">
                <div>
                  <div className="text-base sm:text-lg font-extrabold text-[#0f2537]">
                    {COMPANY.fullName}
                  </div>
                  <div className="text-slate-600">
                    {t("Inhaber:", "Owner:")} {COMPANY_INFO.owner} · {COMPANY_INFO.street}, {COMPANY_INFO.city}
                  </div>
                  <div className="text-slate-600 break-words">
                    Tel.: {COMPANY_INFO.phoneDisplay} · E-Mail: {COMPANY_INFO.email}
                  </div>
                </div>
                <div className="sm:text-right">
                  <div className="text-sm sm:text-base font-extrabold text-emerald-700">
                    {previewDoc.typeLabel.toUpperCase()}
                  </div>
                  <div className="font-bold">Nr.: {previewDoc.nr}</div>
                  <div>{t("Datum:", "Date:")} {previewDoc.date}</div>
                  <div>{t("Bezug:", "Reference:")} {t("Anfrage", "Lead")} {previewDoc.leadId}</div>
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400">
                  {t("Empfänger", "Recipient / Customer")}
                </div>
                <div className="font-bold text-sm text-slate-900">{previewDoc.name}</div>
                <div>{previewDoc.address}</div>
              </div>

              <div className="font-bold text-sm text-[#0f2537]">{previewDoc.service}</div>

              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-900 text-left text-[11px] uppercase text-slate-500">
                    <th className="py-2 pr-2">{t("Pos. / Beschreibung", "Item / Description")}</th>
                    <th className="py-2 px-1 sm:px-2 text-right">{t("Menge", "Qty")}</th>
                    <th className="py-2 px-2 text-right hidden sm:table-cell">{t("Einzelpreis", "Unit Price")}</th>
                    <th className="py-2 pl-2 text-right">{t("Gesamt", "Total")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {previewDoc.lines.map((l, i) => (
                    <tr key={i}>
                      <td className="py-2.5 pr-2">
                        <div className="font-bold text-slate-900">{l.pos}</div>
                        <div className="text-slate-500">{l.basis}</div>
                      </td>
                      <td className="py-2.5 px-1 sm:px-2 text-right whitespace-nowrap">
                        <div>
                          {l.qty} {l.unit}
                        </div>
                        <div className="text-[10px] text-slate-500 sm:hidden">
                          {eur(l.price)}
                        </div>
                      </td>
                      <td className="py-2.5 px-2 text-right whitespace-nowrap hidden sm:table-cell">
                        {eur(l.price)}
                      </td>
                      <td className="py-2.5 pl-2 text-right font-bold whitespace-nowrap">
                        {eur(l.qty * l.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {(() => {
                const tTotals = calcDocTotals(previewDoc);
                return (
                  <div className="sm:ml-auto sm:max-w-xs space-y-1.5 border-t-2 border-slate-900 pt-3">
                    <div className="flex justify-between">
                      <span>{t("Nettobetrag:", "Net Total:")}</span>
                      <strong>{eur(tTotals.net)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>{t(`Umsatzsteuer (${previewDoc.vatRate} %):`, `VAT (${previewDoc.vatRate} %):`)}</span>
                      <strong>{eur(tTotals.vat)}</strong>
                    </div>
                    <div className="flex justify-between text-sm font-extrabold border-t border-slate-300 pt-1.5">
                      <span>{t("Gesamtbetrag:", "Gross Total:")}</span>
                      <span>{eur(tTotals.gross)}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 pt-1">
                      {t("Darin enthaltener Arbeits-/Lohnanteil nach § 35a EStG:", "Included labor portion eligible for § 35a EStG tax deduction:")}{" "}
                      <strong>{eur(tTotals.labourGross)}</strong> ({t("20 % Steuerermäßigung =", "20 % tax credit =")}{" "}
                      {eur(tTotals.taxBonus20)}).
                    </div>
                  </div>
                );
              })()}

              <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-500">
                {t(
                  "Garantiehinweis: 10 Jahre Ausführungsgarantie von sos-abdichtung + 25 Jahre Produktgarantie der SchimmelPeter GmbH.",
                  "Warranty statement: 10-year workmanship warranty from sos-abdichtung + 25-year manufacturer warranty from SchimmelPeter GmbH."
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
