"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  FilePenLine,
  Images,
  Megaphone,
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
  Zap,
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
  Receipt,
  Ruler,
  Maximize2,
  SlidersHorizontal,
  ZoomIn,
  ZoomOut,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  ImageIcon,
  Play,
  Pause,
  Power,
  DollarSign,
  Sliders,
  Building2,
} from "lucide-react";
import { COMPANY, COMPANY_INFO } from "@/data/content-data";
import { useLanguage } from "@/i18n/LanguageContext";
import { LogoWordmark } from "@/components/brand/Logo";
import AdminSiteContent from "@/components/admin/AdminSiteContent";
import AdminLeadsTable from "@/components/admin/AdminLeadsTable";
import AdminAppointments from "@/components/admin/AdminAppointments";
import AdminInvoices from "@/components/admin/AdminInvoices";
import AdminPhotos from "@/components/admin/AdminPhotos";
import AdminMedia from "@/components/admin/AdminMedia";
import AdminPages from "@/components/admin/AdminPages";
import AdminSocial from "@/components/admin/AdminSocial";
import AdminAssistant from "@/components/admin/AdminAssistant";
import AdminNumbers from "@/components/admin/AdminNumbers";
import AdminAutomations from "@/components/admin/AdminAutomations";
import AdminReviews from "@/components/admin/AdminReviews";
import AdminToday from "@/components/admin/AdminToday";
import AdminQuote from "@/components/admin/AdminQuote";
import AdminDocEditor from "@/components/admin/AdminDocEditor";
import { LeadForm } from "@/components/admin/AdminForms";
import { adminSignIn, adminSignOut, adminCall, hasAdminSession, type SheetLead } from "@/lib/adminApi";
import { buildGoogleCalendarUrl, downloadIcsFile, INSPECTION_SLOTS } from "@/lib/calendar";
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
  ADMIN_WEBAPP_URL,
} from "@/lib/backend";


type AdminTab =
  | "overview"
  | "leads"
  | "drive"
  | "planer"
  | "belege"
  | "termine"
  | "numbers"
  | "social"
  | "assistant"
  | "auto"
  | "reviews"
  | "hilfe"
  | "website"
  | "media"
  | "pages";

type SupportedLang = "en" | "de";

/** The address of each admin page (/admin/#anfragen) and back. */
const TAB_HASH: Record<AdminTab, string> = {
  overview: "uebersicht",
  leads: "anfragen",
  termine: "termine",
  planer: "aufmass",
  belege: "belege",
  drive: "fotos",
  numbers: "zahlen",
  social: "beitraege",
  assistant: "ki-assistent",
  auto: "automatik",
  reviews: "bewertungen",
  hilfe: "hilfe",
  website: "website",
  media: "mediathek",
  pages: "seiten",
};
const HASH_TAB = {
  ...Object.fromEntries(Object.entries(TAB_HASH).map(([k, v]) => [v, k])),
  // addresses of the former demo pages still open something useful
  "google-ads": "numbers",
  analytics: "numbers",
  "search-console": "numbers",
  "google-maps": "numbers",
  seo: "numbers",
  strategie: "assistant",
} as Record<string, AdminTab>;

const fromSheet = (l: SheetLead): WorkspaceLead => ({
  id: l.id,
  received: l.received ? new Date(l.received).toLocaleString("de-DE", { dateStyle: "short", timeStyle: "short" }) : "",
  status: l.status as LeadStatus,
  owner: l.owner,
  name: l.name,
  phone: l.phone,
  email: l.email,
  address: l.from || "",
  damageType: l.service || l.to,
  area: "",
  date: l.date || "",
  notes: l.notes,
  message: l.message,
  source: l.source,
  photosDriveUrl: l.photosDrive,
  photos: [],
  token: "",
  handover: l.handover || {},
  handoverNote: "",
  lines: [],
});

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

const MARKETING_PACKAGES = [
  {
    id: "starter",
    title_de: "Starter Local Presence",
    title_en: "Starter Local Presence",
    focus_de: "Essen HQ & Ruhrgebiet / Bergisches Land (Essen, Wuppertal, Bochum, Düsseldorf)",
    focus_en: "Essen HQ & Ruhr / Bergisch Region (Essen, Wuppertal, Bochum, Düsseldorf)",
    badge_de: "Live mit Google Ads verknüpft (75 €)",
    badge_en: "Live Connected to Google Ads (75 €)",
    weeklyPrice: 75,
    dailyPrice: 10.71,
    hourlyPrice60: 1.25,
    hourlyPrice24: 0.45,
    monthlyPrice: 325,
    estLeadsWeek: "2 – 4",
    estLeadsMonth: "9 – 16",
    features_de: [
      "Google Ads Express & Local Services Ads mit offiziellem Kampagnen-Tracking",
      "Verknüpft mit aktiver Kampagne #24368834798 (Konto 861-159-7140)",
      "Top 3 Kern-Keywords: Kellersanierung, Feuchter Keller, Schimmel Essen & NRW",
      "Google Maps 3-Pack Optimierung für lokale Smartphone-Suchen",
      "Garantierter Ausgaben-Deckel: exakt 75 €/Woche, kein Cent mehr",
    ],
    features_en: [
      "Google Ads Express & Local Services Ads with verified conversion tracking",
      "Linked to active Campaign #24368834798 (Account 861-159-7140)",
      "Top 3 core search keywords: Cellar Waterproofing, Damp Cellar, Mold Essen & NRW",
      "Google Maps 3-Pack optimization for local smartphone searches",
      "Strict spend cap: exactly 75 €/week, zero surprise overages",
    ],
  },
  {
    id: "pro",
    title_de: "Pro Growth & Lead Booster",
    title_en: "Pro Growth & Lead Booster",
    focus_de: "Wuppertal + Solingen + Remscheid (35 km)",
    focus_en: "Wuppertal + Solingen + Remscheid (35 km)",
    badge_de: "Empfohlen (Sweet Spot)",
    badge_en: "Recommended (Sweet Spot)",
    weeklyPrice: 150,
    dailyPrice: 21.43,
    hourlyPrice60: 2.50,
    hourlyPrice24: 0.89,
    monthlyPrice: 650,
    estLeadsWeek: "6 – 10",
    estLeadsMonth: "26 – 43",
    features_de: [
      "Google Local Services Ads + Google Search Suchkampagnen kombiniert",
      "35 km Radius: Wuppertal, Solingen, Remscheid, Velbert, Haan, Wermelskirchen",
      "Negativ-Keyword-Filter (schließt Heimwerker, Billig-Suchende & Konkurrenten aus)",
      "Live Conversion-Tracking (Anrufe, Schadensfotos & WhatsApp-Klicks)",
      "Automatischer 5-Sterne Google-Bewertungsbooster per WhatsApp",
      "Garantierter Ausgaben-Deckel: exakt 150 €/Woche",
    ],
    features_en: [
      "Google Local Services Ads + Google Search Ads combined",
      "35 km radius: Wuppertal, Solingen, Remscheid, Velbert, Haan, Wermelskirchen",
      "Negative keyword filtering (excludes DIY searches, competitors, and job seekers)",
      "Live conversion tracking (phone calls, damage photos & WhatsApp clicks)",
      "Automated 5-Star Google review WhatsApp booster",
      "Strict spend cap: exactly 150 €/week",
    ],
  },
  {
    id: "scale",
    title_de: "Business Scale & NRW Expansion",
    title_en: "Business Scale & NRW Expansion",
    focus_de: "Düsseldorf, Bergisches Land & Ruhrgebiet",
    focus_en: "Düsseldorf, Bergisches Land & Ruhr Area",
    badge_de: "Wachstum",
    badge_en: "Growth Scale",
    weeklyPrice: 300,
    dailyPrice: 42.86,
    hourlyPrice60: 5.00,
    hourlyPrice24: 1.79,
    monthlyPrice: 1300,
    estLeadsWeek: "12 – 18",
    estLeadsMonth: "52 – 78",
    features_de: [
      "Vollständige Schaltung über alle 24 regionalen Landing Pages in NRW",
      "Google Suchanzeigen + Meta Retargeting (Facebook & Instagram Hausbesitzer)",
      "Bevorzugte Lead-Zustellung direkt per SMS & WhatsApp auf Ihr Smartphone",
      "A/B-Testing von Anzeigentexten & Anruf-Erweiterungen",
      "Garantierter Ausgaben-Deckel: exakt 300 €/Woche",
    ],
    features_en: [
      "Full coverage across all 24 regional NRW landing pages",
      "Google Search Ads + Meta Retargeting (Facebook & Instagram homeowners)",
      "Priority lead delivery via instant WhatsApp/SMS notification",
      "A/B split testing of ad copy & call extensions",
      "Strict spend cap: exactly 300 €/week",
    ],
  },
  {
    id: "dominance",
    title_de: "Market Leader Dominance",
    title_en: "Market Leader Dominance",
    focus_de: "Ganz NRW & 24/7 Notdienst-Einsätze",
    focus_en: "Entire NRW & 24/7 Emergency Dispatch",
    badge_de: "Marktführer",
    badge_en: "Market Leader",
    weeklyPrice: 500,
    dailyPrice: 71.43,
    hourlyPrice60: 8.33,
    hourlyPrice24: 2.98,
    monthlyPrice: 2165,
    estLeadsWeek: "20 – 30+",
    estLeadsMonth: "85 – 130+",
    features_de: [
      "Aggressive Top-Gebote für Platz 1 in ganz NRW",
      "24/7 Notdienst-Routing für akuten Wassereinbruch & Starkregen-Schäden",
      "Multi-Kanal-Dominanz (Google Search, Maps, YouTube & Meta)",
      "Garantierter Ausgaben-Deckel: exakt 500 €/Woche",
    ],
    features_en: [
      "Aggressive top-of-page #1 bidding across entire NRW",
      "24/7 emergency water damage & burst pipe lead routing",
      "Omnichannel dominance (Google Search, Maps, YouTube & Meta)",
      "Strict spend cap: exactly 500 €/week",
    ],
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

export interface BusinessLocation {
  id: string;
  name_de: string;
  name_en: string;
  type: "headquarters" | "branch";
  city: string;
  plz: string;
  street: string;
  phone: string;
  url: string;
  serviceAreas: string;
  googleMapsQuery: string;
}

const DEFAULT_LOCATIONS: BusinessLocation[] = [
  {
    id: "loc_essen",
    name_de: "Standort 1: Essen (Hauptsitz)",
    name_en: "Location 1: Essen (Headquarters)",
    type: "headquarters",
    city: "Essen",
    plz: "45144",
    street: "Niebuhrstraße 46",
    phone: "+49 (0)172 2064177",
    url: "https://sos-abdichtung.de/",
    serviceAreas: "Essen (Frohnhausen, Rüttenscheid, Holsterhausen, Bredeney), Wuppertal, Mülheim, Bochum, Oberhausen",
    googleMapsQuery: "Niebuhrstraße+46+45144+Essen",
  },
  {
    id: "loc_wuppertal",
    name_de: "Standort 2: Wuppertal (Stützpunkt)",
    name_en: "Location 2: Wuppertal (Branch Office)",
    type: "branch",
    city: "Wuppertal",
    plz: "42103",
    street: "Elberfeld / Barmen (Service-Stützpunkt)",
    phone: "+49 (0)172 2064177",
    url: "https://sos-abdichtung.de/kellersanierung/wuppertal/",
    serviceAreas: "Wuppertal (Elberfeld, Barmen, Vohwinkel, Cronenberg, Ronsdorf), Velbert, Haan",
    googleMapsQuery: "sos-abdichtung+Wuppertal",
  },
  {
    id: "loc_solingen",
    name_de: "Standort 3: Solingen & Remscheid",
    name_en: "Location 3: Solingen & Remscheid",
    type: "branch",
    city: "Solingen",
    plz: "42651",
    street: "Kölner Straße / Ohligs (Service-Stützpunkt)",
    phone: "+49 (0)172 2064177",
    url: "https://sos-abdichtung.de/kellersanierung/solingen/",
    serviceAreas: "Solingen, Remscheid, Hilden, Langenfeld, Leichlingen, Wermelskirchen",
    googleMapsQuery: "sos-abdichtung+Solingen",
  },
];

export interface RegionalMarket {
  city: string;
  name_de: string;
  name_en: string;
  postal: string;
  altbauten: number;
  primaryIssue_de: string;
  primaryIssue_en: string;
  cpl: number;
  avgTicket: number;
  competitorsCount: number;
  competitivePressure: "Sehr Hoch" | "Hoch" | "Mittel";
  recBudget: number;
  recPlan_de: string;
  recPlan_en: string;
  topCompetitor: string;
}

const REGIONAL_MARKETS: RegionalMarket[] = [
  {
    city: "Essen",
    name_de: "Essen (Hauptsitz / Ruhrgebiet-Zentrum)",
    name_en: "Essen (Headquarters / Ruhr Hub)",
    postal: "45144 / 45138",
    altbauten: 14200,
    primaryIssue_de: "Aufsteigende Mauerfeuchte, Bergschäden & Keller-Schimmel",
    primaryIssue_en: "Capillary rising damp, mining settlement cracks & cellar mold",
    cpl: 19,
    avgTicket: 6200,
    competitorsCount: 4,
    competitivePressure: "Sehr Hoch",
    recBudget: 150,
    recPlan_de: "Marktführer Essen & Ruhrgebiet (Dominanz)",
    recPlan_en: "Market Leader Essen & Ruhr (Dominance)",
    topCompetitor: "ISOTEC Fachbetrieb & ATG",
  },
  {
    city: "Wuppertal",
    name_de: "Wuppertal (Bergisches Land)",
    name_en: "Wuppertal (Bergisch Region)",
    postal: "42103 / 42285",
    altbauten: 11800,
    primaryIssue_de: "Hangdruckwasser, Schiefergestein & Starkregen-Überflutung",
    primaryIssue_en: "Hillside hydrostatic pressure, slate masonry & stormwater inundation",
    cpl: 17,
    avgTicket: 5400,
    competitorsCount: 3,
    competitivePressure: "Hoch",
    recBudget: 100,
    recPlan_de: "Wupper-Hangschutz & Horizontalsperre",
    recPlan_en: "Hillside Drainage & Damp Barrier",
    topCompetitor: "Regionale Meisterbetriebe & Isotec",
  },
  {
    city: "Solingen",
    name_de: "Solingen (Klingenstadt / Südstadt)",
    name_en: "Solingen (Blade City / South)",
    postal: "42651 / 42653",
    altbauten: 6500,
    primaryIssue_de: "Historische Bruchstein- & Fachwerkfundamente",
    primaryIssue_en: "Historic rubble stone & timber frame basements",
    cpl: 16,
    avgTicket: 5100,
    competitorsCount: 2,
    competitivePressure: "Mittel",
    recBudget: 75,
    recPlan_de: "Fachwerk- & Bruchstein-Spezialist",
    recPlan_en: "Timber & Rubble Stone Specialist",
    topCompetitor: "Lokale Dach- und Bautenschutzbetriebe",
  },
  {
    city: "Remscheid",
    name_de: "Remscheid (Höhenlagen)",
    name_en: "Remscheid (High Elevations)",
    postal: "42853 / 42897",
    altbauten: 5900,
    primaryIssue_de: "Höchste Niederschlagsmenge NRW, extreme Witterungsbelastung",
    primaryIssue_en: "Highest annual rainfall in NRW, severe weather exposure",
    cpl: 15,
    avgTicket: 4900,
    competitorsCount: 2,
    competitivePressure: "Mittel",
    recBudget: 75,
    recPlan_de: "Wetterfeste Außenabdichtung & Keller",
    recPlan_en: "Weatherproof Exterior Barrier & Basement",
    topCompetitor: "Lokale Sanierer",
  },
  {
    city: "Düsseldorf",
    name_de: "Düsseldorf (Rhein-Metropole)",
    name_en: "Düsseldorf (Rhine Metropolitan Area)",
    postal: "40210 / 40477",
    altbauten: 18500,
    primaryIssue_de: "Schwankender Grundwasserspiegel Rhein, hochwertige Keller",
    primaryIssue_en: "Rhine water table fluctuations & premium cellar spaces",
    cpl: 24,
    avgTicket: 7800,
    competitorsCount: 5,
    competitivePressure: "Sehr Hoch",
    recBudget: 200,
    recPlan_de: "Premium Weisse Wanne & Druckwasser",
    recPlan_en: "Premium White Tank & Water Pressure Defense",
    topCompetitor: "Isotec Rhein-Ruhr & Bautenschutz-Konzerne",
  },
  {
    city: "Bochum",
    name_de: "Bochum & Mittleres Ruhrgebiet",
    name_en: "Bochum & Central Ruhr Area",
    postal: "44787 / 44801",
    altbauten: 12400,
    primaryIssue_de: "Setzungsrisse, Bodensenkungen & drückendes Sickerwasser",
    primaryIssue_en: "Settlement cracks, ground subsidence & seepage water",
    cpl: 18,
    avgTicket: 5600,
    competitorsCount: 3,
    competitivePressure: "Hoch",
    recBudget: 110,
    recPlan_de: "Rissverpressung & Schleierinjektion",
    recPlan_en: "Crack Injection & Curtain Grouting",
    topCompetitor: "ATG & Regionale Betriebe",
  },
];

export interface CompetitorData {
  id: string;
  name: string;
  type_de: string;
  type_en: string;
  budgetEst: string;
  pricingEst: string;
  strengths_de: string;
  strengths_en: string;
  weaknesses_de: string;
  weaknesses_en: string;
  sosStrategy_de: string;
  sosStrategy_en: string;
  status_de: string;
  status_en: string;
}

const COMPETITOR_INTEL: CompetitorData[] = [
  {
    id: "isotec",
    name: "ISOTEC Fachbetriebe (NRW / Ruhrgebiet)",
    type_de: "Franchise-Konzern (Bundesweit)",
    type_en: "Franchise Network (Nationwide)",
    budgetEst: "5.000 – 12.000 € / Monat",
    pricingEst: "320 – 480 € / m² (Sehr hoch)",
    strengths_de: "Hohe Markenbekanntheit durch TV & Radio, geschulte Vertriebler.",
    strengths_en: "High brand recognition through TV & radio ads, trained sales reps.",
    weaknesses_de: "25-35% teurer wegen Franchise-Lizenzaufschlägen, 2-4 Wochen Angebotsdauer, kein Online-Rechner, Callcenter-Barriere.",
    weaknesses_en: "25-35% more expensive due to franchise fees, 2-4 weeks quote wait, no transparent calculator, call center hurdles.",
    sosStrategy_de: "Preis-Vorteil (-25% bei identischer WTA-Qualität) & Festpreis-Angebot binnen 24 Stunden mit digitaler Signatur.",
    sosStrategy_en: "25% price advantage with identical WTA certification & 24h binding quote with digital signature.",
    status_de: "Sehr aktiv auf Google Ads (Platz 1-2)",
    status_en: "Highly active on Google Ads (Rank 1-2)",
  },
  {
    id: "atg",
    name: "ATG Deutschland (Mauerwerksabdichtung)",
    type_de: "Überregionaler Direktvertrieb",
    type_en: "Regional Direct Sales Organization",
    budgetEst: "3.500 – 8.000 € / Monat",
    pricingEst: "4.500 – 12.000 € Pauschalpreise",
    strengths_de: "Aggressive Tageszeitungs- & Online-Suchanzeigen, schnelle Vor-Ort-Termine durch reine Vertriebsbeauftragte.",
    strengths_en: "Aggressive newspaper & search ads, fast on-site sales meetings with commission reps.",
    weaknesses_de: "Aggressiver Abschlussdruck, intransparente Festpreise ohne detailliertes Einzelaufmaß, keine digitale Selbstbedienung.",
    weaknesses_en: "Heavy sales pressure, intransparent flat rates without itemized bill of quantities, no digital customer self-service.",
    sosStrategy_de: "100% Preistransparenz im Rechner, digitaler Foto-Upload vorab zur Vermeidung unnötiger Hausbesuche, zertifizierte GoBD-Abrechnung.",
    sosStrategy_en: "100% pricing transparency, instant Drive photo upload before visit, certified GoBD invoicing with § 35a tax credit.",
    status_de: "Aktiv auf Suchbegriffen 'nasse Wände'",
    status_en: "Active on keywords 'nasse Wände'",
  },
  {
    id: "regional",
    name: "Regionale Handwerks- & Dachdeckerbetriebe",
    type_de: "Lokale Kleinbetriebe (Essen, Wuppertal)",
    type_en: "Local Tradesmen (Essen, Wuppertal)",
    budgetEst: "< 500 € / Monat (Minimal)",
    pricingEst: "180 – 260 € / m² (Günstig)",
    strengths_de: "Lokale Bekanntheit, persönliche Weiterempfehlungen.",
    strengths_en: "Local word-of-mouth reputation, personal neighborhood ties.",
    weaknesses_de: "Veraltete Websites, keine Google Maps SEO Optimierung, keine 24/7 Notdienst-Hotline, oft keine WTA-Spezialisierung für Injektionen.",
    weaknesses_en: "Outdated websites, zero Google Maps optimization, unstaffed phones after hours, lack of specialized WTA certification.",
    sosStrategy_de: "Google Maps 3-Pack dominieren, mobile 1-Klick Erreichbarkeit & WTA-Verfahren & Messprotokolle als Qualitätsnachweis hervorheben.",
    sosStrategy_en: "Dominate Google Maps 3-pack, 1-tap call & WhatsApp accessibility, WTA methods & measurement reports as proof of quality.",
    status_de: "Geringe Werbeaktivität",
    status_en: "Minimal online ad activity",
  },
  {
    id: "drymat",
    name: "Drymat / Nischen-Anbieter (Elektrophysikalisch)",
    type_de: "Geräte-Verkauf ohne Baumaßnahme",
    type_en: "Device Sales without Masonry Work",
    budgetEst: "1.000 – 2.500 € / Monat",
    pricingEst: "3.800 – 7.500 € pro Steuergerät",
    strengths_de: "Keine Bauarbeiten / kein Schmutz im Keller.",
    strengths_en: "Zero drilling or excavation mess in basement.",
    weaknesses_de: "Von führenden Bauexperten (WTA / DHBV) bei drückendem Wasser als unzureichend eingestuft, keine Beseitigung von Schimmelsporen.",
    weaknesses_en: "Dismissed by structural civil engineers (WTA / DHBV) for hydrostatic moisture, does not remediate toxic mold spores.",
    sosStrategy_de: "Aufklärung über WTA-geprüfte physikalische Horizontalsperren & Injektionsverfahren mit echter 10-Jahres-Garantie.",
    sosStrategy_en: "Educational walkthrough on WTA-certified horizontal barriers with 10-year physical structural warranty.",
    status_de: "Nischen-Anzeigen auf Google",
    status_en: "Niche Google search ads",
  },
];

function eur(n: number) {
  return n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}

const inputCls =
  "w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700";

export default function AdminPortalClient() {
  const { lang, setLang } = useLanguage();
  const changeLang = (l: SupportedLang) => setLang(l);

  const isEn = lang === "en";
  const t = (de: string, en: string) => (isEn ? en : de);

  const [unlocked, setUnlocked] = useState(false);
  const [user, setUser] = useState("shahzad");
  const [pass, setPass] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [checking, setChecking] = useState(false);
  // live: the enquiries come from the Google Sheet, not from the browser's sample data
  const realRef = useRef(false);
  const [live, setLive] = useState<{ at: string; count: number; state: "load" | "ok" | "error" } | null>(null);

  // a signed-in tab stays signed in until it is closed or "Abmelden" is pressed
  useEffect(() => {
    try {
      if (hasAdminSession()) setUnlocked(true);
    } catch {
      // storage blocked: sign in again on reload
    }
  }, []);

  const [tab, setTabState] = useState<AdminTab>("overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const [leadView, setLeadView] = useState<"table" | "detail">("table");
  // the invoice editor opens over any page (Belege, Aufmaß); the list reloads after a change
  const [editNr, setEditNr] = useState("");
  const [docsVersion, setDocsVersion] = useState(0);
  // upserts: the enquiry form (new or edit) and a new appointment for an enquiry
  const [leadForm, setLeadForm] = useState<"new" | WorkspaceLead | null>(null);
  const [apptFor, setApptFor] = useState<string | null>(null);
  // the page follows the address, so every page can be bookmarked and the back button works
  const setTab = (next: AdminTab) => {
    setTabState(next);
    setMenuOpen(false);
    if (next === "leads") setLeadView("table");
    if (typeof window !== "undefined" && window.location.hash !== "#" + TAB_HASH[next]) {
      window.history.pushState(null, "", "#" + TAB_HASH[next]);
    }
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  };
  useEffect(() => {
    const fromHash = () => {
      const k = HASH_TAB[window.location.hash.slice(1)];
      if (k) setTabState(k);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    window.addEventListener("popstate", fromHash);
    return () => {
      window.removeEventListener("hashchange", fromHash);
      window.removeEventListener("popstate", fromHash);
    };
  }, []);
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
  const [zoomPhoto, setZoomPhoto] = useState<{
    photo: StoredDrivePhoto;
    leadId: string;
    leadName?: string;
    index: number;
    total: number;
    list: Array<{ photo: StoredDrivePhoto; leadId: string; leadName?: string }>;
  } | null>(null);
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [rotationDeg, setRotationDeg] = useState<number>(0);
  const [driveLeadFilter, setDriveLeadFilter] = useState<string>("all");
  const [drivePhotoSearch, setDrivePhotoSearch] = useState<string>("");
  const [driveViewMode, setDriveViewMode] = useState<"grid" | "table">("grid");
  const [toast, setToast] = useState<string>("");
  const [publishStatus, setPublishStatus] = useState<string>("");
  const [adminUploading, setAdminUploading] = useState(false);

  // Paid Marketing Campaign & Weekly Schedule Manager state
  const [campaignActive, setCampaignActive] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sos_marketing_active");
      return saved !== null ? saved === "true" : true;
    }
    return true;
  });
  const [weeklyBudget, setWeeklyBudget] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sos_marketing_budget");
      if (saved && saved !== "150") return Number(saved);
      if (saved === "75") return 75;
    }
    return 75;
  });
  // Live Connected Google Ads Express Campaign Credentials
  const [googleAdsCampaignId, setGoogleAdsCampaignId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sos_gads_campaign_id") || "24368834798";
    }
    return "24368834798";
  });
  const [googleAdsAccountId, setGoogleAdsAccountId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sos_gads_account_id") || "861-159-7140";
    }
    return "861-159-7140";
  });
  const [googleAdsOcid, setGoogleAdsOcid] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sos_gads_ocid") || "8611597140";
    }
    return "8611597140";
  });
  const [googleAdsEuid, setGoogleAdsEuid] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sos_gads_euid") || "6650346939";
    }
    return "6650346939";
  });
  const [isEditingGAds, setIsEditingGAds] = useState<boolean>(false);
  const [schedulePlan, setSchedulePlan] = useState<"weekdays" | "fullweek" | "emergency">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sos_marketing_schedule") as any;
      if (saved && ["weekdays", "fullweek", "emergency"].includes(saved)) return saved;
    }
    return "weekdays";
  });
  const [autoPauseCapacity, setAutoPauseCapacity] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sos_marketing_autopause");
      return saved !== null ? saved === "true" : true;
    }
    return true;
  });

  // Predictive Regional Strategy & Competitor Intelligence state
  const [selectedPredictiveCity, setSelectedPredictiveCity] = useState<string>("Essen");
  const [targetLeadsGoal, setTargetLeadsGoal] = useState<number>(20);
  const [competitorFilter, setCompetitorFilter] = useState<string>("all");

  // Service Catalog (Preisliste) State — Live editable for any service
  const [serviceCatalog, setServiceCatalog] = useState<typeof WTA_TEMPLATES>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sos_service_catalog");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch {}
      }
    }
    return WTA_TEMPLATES;
  });
  const [showPriceListModal, setShowPriceListModal] = useState<boolean>(false);
  const [marketingFreqView, setMarketingFreqView] = useState<"hourly" | "daily" | "weekly" | "monthly">("weekly");
  const [newServiceName, setNewServiceName] = useState<string>("");
  const [newServicePrice, setNewServicePrice] = useState<number>(95);
  const [newServiceUnit, setNewServiceUnit] = useState<string>("m²");
  const [newServiceBasis, setNewServiceBasis] = useState<string>("");

  // Multi-Location State (2-3 Business Locations in NRW)
  const [businessLocations, setBusinessLocations] = useState<BusinessLocation[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sos_business_locations");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch {}
      }
    }
    return DEFAULT_LOCATIONS;
  });
  const [selectedLocationId, setSelectedLocationId] = useState<string>("loc_wuppertal");
  const [showLocationEditorModal, setShowLocationEditorModal] = useState<boolean>(false);
  const [newLocCity, setNewLocCity] = useState<string>("");
  const [newLocPlz, setNewLocPlz] = useState<string>("");
  const [newLocStreet, setNewLocStreet] = useState<string>("");
  const [newLocPhone, setNewLocPhone] = useState<string>("+49 (0)172 2064177");
  const [newLocUrl, setNewLocUrl] = useState<string>("");

  // Google Calendar & Appointment Manager State
  const [showNewAptModal, setShowNewAptModal] = useState<boolean>(false);
  const [newAptLeadId, setNewAptLeadId] = useState<string>("A-1001");
  const [newAptDate, setNewAptDate] = useState<string>(() => new Date(Date.now() + 86400000).toISOString().slice(0, 10));
  const [newAptTime, setNewAptTime] = useState<string>("10:00");
  const [newAptType, setNewAptType] = useState<string>("Vor-Ort-Feuchtigkeitsmessung");
  const [aptFilter, setAptFilter] = useState<"all" | "today" | "upcoming" | "done">("all");

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
      if (!realRef.current) setLeads(store.leads);
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

  const updateServicePrice = (index: number, newPrice: number) => {
    const validPrice = Math.max(0, isNaN(newPrice) ? 0 : newPrice);
    setServiceCatalog((prev) => {
      const next = [...prev];
      if (next[index]) {
        next[index] = { ...next[index], price: validPrice };
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("sos_service_catalog", JSON.stringify(next));
      }
      return next;
    });
    showToast(t("Preisliste aktualisiert! Gilt ab sofort für alle Angebote & Rechnungen.", "Price list updated! Active immediately for all quotes and invoices."));
  };

  const addCustomServiceToCatalog = () => {
    if (!newServiceName.trim()) {
      showToast(t("Bitte geben Sie einen Leistungsnamen ein.", "Please enter a service name."));
      return;
    }
    const newItem = {
      pos_de: newServiceName.trim(),
      pos_en: newServiceName.trim(),
      basis_de: newServiceBasis.trim() || "Fachgerechte Ausführung nach anerkannten Regeln der Technik",
      basis_en: newServiceBasis.trim() || "Professional execution according to trade standards",
      qty: 1,
      unit_de: newServiceUnit,
      unit_en: newServiceUnit,
      price: Math.max(0, newServicePrice),
      labour: true,
    };
    setServiceCatalog((prev) => {
      const next = [...prev, newItem];
      if (typeof window !== "undefined") {
        localStorage.setItem("sos_service_catalog", JSON.stringify(next));
      }
      return next;
    });
    setNewServiceName("");
    setNewServiceBasis("");
    setNewServicePrice(95);
    showToast(t(`Neue Leistung "${newItem.pos_de}" zur Preisliste hinzugefügt!`, `Added new service "${newItem.pos_de}" to price list!`));
  };

  const removeServiceFromCatalog = (index: number) => {
    setServiceCatalog((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (typeof window !== "undefined") {
        localStorage.setItem("sos_service_catalog", JSON.stringify(next));
      }
      return next;
    });
    showToast(t("Position aus Preisliste entfernt.", "Service removed from price list."));
  };

  const resetServiceCatalog = () => {
    setServiceCatalog(WTA_TEMPLATES);
    if (typeof window !== "undefined") {
      localStorage.removeItem("sos_service_catalog");
    }
    showToast(t("Preisliste auf WTA-Standardpreise zurückgesetzt.", "Price list reset to standard WTA rates."));
  };

  const addMarketingExpenseToDoc = (planTitle: string, amount: number, periodLabel: string) => {
    if (!curDoc) {
      showToast(t("Kein aktiver Beleg ausgewählt. Bitte öffnen Sie zuerst Tab 5 (Belege).", "No active document selected. Please open Tab 5 (Belege) first."));
      return;
    }
    updateCurDoc((doc) => ({
      ...doc,
      lines: [
        ...(doc.lines || []),
        {
          pos: `Marketing & SEO: ${planTitle} (${periodLabel})`,
          basis: "Werbeausgaben Google Local Services Ads, Search Ads & Conversion Tracking",
          qty: 1,
          unit: "Pausch.",
          price: amount,
          labour: false,
        },
      ],
    }));
    showToast(t(`Marketing-Ausgabe (${eur(amount)}) als Belegposition übernommen!`, `Added marketing cost (${eur(amount)}) to current document!`));
  };

  const activeLocation = businessLocations.find((l) => l.id === selectedLocationId) || businessLocations[0] || DEFAULT_LOCATIONS[0];

  const updateLocationField = (id: string, field: keyof BusinessLocation, val: string) => {
    setBusinessLocations((prev) => {
      const next = prev.map((loc) => (loc.id === id ? { ...loc, [field]: val } : loc));
      if (typeof window !== "undefined") {
        localStorage.setItem("sos_business_locations", JSON.stringify(next));
      }
      return next;
    });
    showToast(t("Standortdaten aktualisiert!", "Location data updated!"));
  };

  const addNewLocation = () => {
    if (!newLocCity.trim()) {
      showToast(t("Bitte geben Sie eine Stadt ein.", "Please enter a city name."));
      return;
    }
    const cleanCity = newLocCity.trim();
    const newLoc: BusinessLocation = {
      id: `loc_${Date.now()}`,
      name_de: `Standort ${businessLocations.length + 1}: ${cleanCity} (Niederlassung)`,
      name_en: `Location ${businessLocations.length + 1}: ${cleanCity} (Branch Office)`,
      type: "branch",
      city: cleanCity,
      plz: newLocPlz.trim() || "42xxx",
      street: newLocStreet.trim() || `${cleanCity} Zentrum`,
      phone: newLocPhone.trim() || "+49 (0)172 2064177",
      url: newLocUrl.trim() || `https://sos-abdichtung.de/kellersanierung/${cleanCity.toLowerCase().replace(/[^a-z0-9]/g, "")}/`,
      serviceAreas: `${cleanCity} & umliegende Region`,
      googleMapsQuery: `sos-abdichtung+${encodeURIComponent(cleanCity)}`,
    };
    setBusinessLocations((prev) => {
      const next = [...prev, newLoc];
      if (typeof window !== "undefined") {
        localStorage.setItem("sos_business_locations", JSON.stringify(next));
      }
      return next;
    });
    setSelectedLocationId(newLoc.id);
    setNewLocCity("");
    setNewLocPlz("");
    setNewLocStreet("");
    setNewLocUrl("");
    setShowLocationEditorModal(false);
    showToast(t(`Neuer Standort "${cleanCity}" erfolgreich angelegt!`, `New location "${cleanCity}" added successfully!`));
  };

  const removeLocation = (id: string) => {
    if (businessLocations.length <= 1) {
      showToast(t("Mindestens ein Hauptstandort muss erhalten bleiben.", "At least one location must remain."));
      return;
    }
    setBusinessLocations((prev) => {
      const next = prev.filter((l) => l.id !== id);
      if (typeof window !== "undefined") {
        localStorage.setItem("sos_business_locations", JSON.stringify(next));
      }
      return next;
    });
    setSelectedLocationId((prev) => (prev === id ? businessLocations[0]?.id || "loc_wuppertal" : prev));
    showToast(t("Standort entfernt.", "Location removed."));
  };

  const resetLocationsToDefault = () => {
    setBusinessLocations(DEFAULT_LOCATIONS);
    setSelectedLocationId("loc_wuppertal");
    if (typeof window !== "undefined") {
      localStorage.removeItem("sos_business_locations");
    }
    showToast(t("Standorte auf Standardwerte zurückgesetzt.", "Locations reset to standard defaults."));
  };

  const openPhotoViewer = (
    targetPhoto: StoredDrivePhoto,
    leadId: string,
    contextPhotos?: Array<{ photo: StoredDrivePhoto; leadId: string; leadName?: string }>
  ) => {
    const allList: Array<{ photo: StoredDrivePhoto; leadId: string; leadName?: string }> =
      contextPhotos && contextPhotos.length > 0
        ? contextPhotos
        : leads.flatMap((l) =>
            (l.photos || []).map((p) => ({
              photo: p,
              leadId: l.id,
              leadName: l.name,
            }))
          );

    const idx = allList.findIndex(
      (item) => item.photo.name === targetPhoto.name && item.leadId === leadId
    );

    const currentLead = leads.find((l) => l.id === leadId);

    setZoomScale(1);
    setRotationDeg(0);
    setZoomPhoto({
      photo: targetPhoto,
      leadId,
      leadName: currentLead?.name,
      index: idx >= 0 ? idx : 0,
      total: allList.length,
      list: allList,
    });
  };

  const nextPhoto = () => {
    if (!zoomPhoto || zoomPhoto.list.length <= 1) return;
    const nextIdx = (zoomPhoto.index + 1) % zoomPhoto.list.length;
    const target = zoomPhoto.list[nextIdx];
    setZoomScale(1);
    setRotationDeg(0);
    setZoomPhoto({
      photo: target.photo,
      leadId: target.leadId,
      leadName: target.leadName,
      index: nextIdx,
      total: zoomPhoto.list.length,
      list: zoomPhoto.list,
    });
  };

  const prevPhoto = () => {
    if (!zoomPhoto || zoomPhoto.list.length <= 1) return;
    const prevIdx = (zoomPhoto.index - 1 + zoomPhoto.list.length) % zoomPhoto.list.length;
    const target = zoomPhoto.list[prevIdx];
    setZoomScale(1);
    setRotationDeg(0);
    setZoomPhoto({
      photo: target.photo,
      leadId: target.leadId,
      leadName: target.leadName,
      index: prevIdx,
      total: zoomPhoto.list.length,
      list: zoomPhoto.list,
    });
  };

  useEffect(() => {
    if (!zoomPhoto) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setZoomPhoto(null);
      } else if (e.key === "ArrowRight") {
        nextPhoto();
      } else if (e.key === "ArrowLeft") {
        prevPhoto();
      } else if (e.key === "+" || e.key === "=") {
        setZoomScale((s) => Math.min(3, Math.round((s + 0.25) * 100) / 100));
      } else if (e.key === "-") {
        setZoomScale((s) => Math.max(0.75, Math.round((s - 0.25) * 100) / 100));
      } else if (e.key === "0") {
        setZoomScale(1);
        setRotationDeg(0);
      } else if (e.key.toLowerCase() === "r") {
        setRotationDeg((r) => (r + 90) % 360);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [zoomPhoto]);

  const persistAll = (
    nextLeads: WorkspaceLead[],
    nextDocs: WorkspaceGoBDDoc[],
    nextApts?: WorkspaceAppointment[]
  ) => {
    setLeads(nextLeads);
    setDocs(nextDocs);
    if (nextApts) setAppointments(nextApts);
    saveWorkspaceStore({
      // real customer data stays in the Google Sheet, never in the browser
      leads: realRef.current ? getWorkspaceStore().leads : nextLeads,
      docs: nextDocs,
      appointments: nextApts || appointments,
    });
  };

  const curLead = leads.find((l) => l.id === selectedLeadId) || leads[0];
  const curDoc = docs.find((d) => d.nr === selectedDocNr) || docs[0];

  // One login: the back office checks username and password against its "Benutzer" sheet,
  // with the same lockout. This page keeps no password of its own.
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    setLoginErr("");
    const r = await adminSignIn(user.trim(), pass);
    setChecking(false);
    if (r.ok) {
      setPass("");
      setUnlocked(true);
      return;
    }
    setLoginErr(
      r.error === "locked"
        ? t("Zu viele Versuche. Bitte 15 Minuten warten.", "Too many attempts. Please wait 15 minutes.")
        : r.error === "leaked"
        ? t("Dieses Passwort ist gesperrt. Bitte im Backoffice ein neues festlegen.", "This password is blocked. Please set a new one in the back office.")
        : r.error === "network"
        ? t("Keine Verbindung. Bitte erneut versuchen.", "No connection. Please try again.")
        : t("Benutzername oder Passwort falsch.", "Wrong username or password.")
    );
  };

  const logout = useCallback(() => {
    setUnlocked(false);
    realRef.current = false;
    setLive(null);
    setLeads(getWorkspaceStore().leads);
    adminSignOut();
  }, []);

  // from a table row, an appointment or an invoice: straight to that enquiry
  const openLead = (id: string) => {
    setTab("leads");
    setSelectedLeadId(id);
    setLeadView("detail");
  };

  // the real enquiries from the Google Sheet (back office): loaded after login and on demand
  const loadReal = useCallback(async () => {
    setLive((v) => ({ at: v?.at || "", count: v?.count || 0, state: "load" }));
    const r = await adminCall<{ leads: SheetLead[] }>("api_bootstrap");
    if (!r.ok) {
      if (r.error === "login") {
        logout();
        setLoginErr(t("Sitzung abgelaufen. Bitte neu anmelden.", "Session expired. Please log in again."));
      } else setLive((v) => ({ at: v?.at || "", count: v?.count || 0, state: "error" }));
      return;
    }
    realRef.current = true;
    const real = r.data.leads.map(fromSheet);
    setLeads(real);
    if (real[0]) setSelectedLeadId(real[0].id);
    setLive({ at: new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }), count: real.length, state: "ok" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logout]);
  useEffect(() => {
    if (unlocked) loadReal();
  }, [unlocked, loadReal]);

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

  const createNewAppointment = () => {
    const lead = leads.find((l) => l.id === newAptLeadId);
    const nr = `T-${1001 + appointments.length}`;
    const newApt: WorkspaceAppointment = {
      nr,
      leadId: newAptLeadId,
      date: newAptDate,
      time: newAptTime,
      type: newAptType,
      name: lead ? lead.name : "Kunde",
      phone: lead ? lead.phone : COMPANY_INFO.phoneDisplay,
      address: lead ? (lead.area || lead.address || "NRW") : "NRW",
      damageType: lead ? lead.damageType : "Kellersanierung",
      status: "Bestätigt",
    };
    const nextApts = [newApt, ...appointments];
    setAppointments(nextApts);
    saveWorkspaceStore({ leads, docs, appointments: nextApts });
    setShowNewAptModal(false);
    showToast(t(`✓ Vor-Ort-Termin ${nr} für ${newApt.name} angelegt!`, `✓ Appointment ${nr} for ${newApt.name} scheduled!`));
  };

  const updateAptStatus = (nr: string, nextStatus: string) => {
    const nextApts = appointments.map((a) => (a.nr === nr ? { ...a, status: nextStatus } : a));
    setAppointments(nextApts);
    saveWorkspaceStore({ leads, docs, appointments: nextApts });
    showToast(t(`Status von ${nr} auf „${nextStatus}“ aktualisiert.`, `Status of ${nr} updated to '${nextStatus}'.`));
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
      showToast(t(`${newPhotos.length} Datei(en) nur in diesem Browser abgelegt, nicht in Google Drive. Zum Speichern bitte „Fotos & Drive“ nutzen.`, `${newPhotos.length} file(s) kept in this browser only, not in Google Drive. To save them, use "Photos & Drive".`));
    });
  };

  const totalPhotosCount = leads.reduce((sum, l) => sum + (l.photos?.length || 0), 0);

  // Language switch component
  const LanguageSwitcher = ({ inNav = false }: { inNav?: boolean }) => (
    <div
      className={`inline-flex items-center rounded-xl p-0.5 border ${
        inNav ? "bg-slate-100 border-slate-200" : "bg-slate-100 border-slate-300"
      }`}
    >
      <button
        type="button"
        onClick={() => changeLang("en")}
        className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 ${
          lang === "en"
            ? "bg-emerald-700 text-white shadow-sm"
            : inNav
            ? "text-slate-600 hover:text-slate-900"
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
            ? "bg-emerald-700 text-white shadow-sm"
            : inNav
            ? "text-slate-600 hover:text-slate-900"
            : "text-slate-600 hover:text-slate-900"
        }`}
      >
        <span>🇩🇪</span>
        <span>DE</span>
      </button>
    </div>
  );

  // Login Screen: the site's logo, white card and red button; one login with the back office
  if (!unlocked) {
    return (
      <section className="admin-gate" aria-labelledby="admin-gate-title">
        <LogoWordmark className="admin-gate__logo" title="SOS-Abdichtung" />
        <p className="sc-label">{t("Admin & Backoffice", "Admin & back office")}</p>
        <h2 id="admin-gate-title" className="admin-gate__t">
          {t("Anmelden", "Log in")}
        </h2>
        <p className="admin-gate__d">
          {t(
            "Ein Login für alles: derselbe Benutzername und dasselbe Passwort wie im Google-Backoffice.",
            "One login for everything: the same username and password as in the Google back office."
          )}
        </p>
        <form onSubmit={handleLogin} className="admin-gate__form">
          <label htmlFor="adm-user">{t("Benutzername", "Username")}</label>
          <input id="adm-user" type="text" required autoComplete="username" autoCapitalize="none" value={user} onChange={(e) => setUser(e.target.value)} />
          <label htmlFor="adm-pass">{t("Passwort", "Password")}</label>
          <input id="adm-pass" type="password" required autoComplete="current-password" value={pass} onChange={(e) => setPass(e.target.value)} />
          {loginErr && (
            <p className="admin-gate__err" role="alert">
              {loginErr}
            </p>
          )}
          <button type="submit" className="btn-shine admin-gate__btn" disabled={checking}>
            {checking ? t("Wird geprüft …", "Checking …") : t("Anmelden", "Log in")} <span aria-hidden="true">→</span>
          </button>
        </form>
        <p className="admin-gate__alt">
          <a href={ADMIN_WEBAPP_URL} target="_blank" rel="noopener noreferrer">
            {t("Google-Backoffice öffnen", "Open the Google back office")} ↗
          </a>
        </p>
      </section>
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
    <div className="adm font-plex text-slate-900">
      {toast && (
        <div className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-50 bg-[#0f2537] text-white font-bold text-xs sm:text-sm px-5 py-3.5 rounded-xl shadow-xl text-center">
          {toast}
        </div>
      )}

      {/* One menu on the left: the business, marketing, help */}
      <aside className={`adm__side${menuOpen ? " is-open" : ""}`} aria-label={t("Admin-Menü", "Admin menu")}>
        <div className="adm__brand">
          <LogoWordmark className="adm__logo" title="SOS-Abdichtung" />
          <span className="adm__brand-k">{t("Admin", "Admin")}</span>
        </div>
        <nav className="adm__nav">
          {(
            [
              [t("Betrieb", "Business"), [
                ["overview", t("Übersicht", "Overview"), ShieldCheck, 0],
                ["leads", t("Anfragen", "Inquiries"), FolderOpen, leads.length],
                ["termine", t("Termine & Kalender", "Appointments"), Calendar, 0],
                ["planer", t("Aufmaß & Angebot", "Estimator"), Calculator, 0],
                ["belege", t("Belege & Rechnungen", "Invoices"), FileText, 0],
                ["drive", t("Fotos & Drive", "Photos & Drive"), Camera, 0],
              ]],
              [t("Marketing", "Marketing"), [
                ["pages", t("Seiten & Fotos", "Pages & photos"), FilePenLine, 0],
                ["media", t("Mediathek", "Media library"), Images, 0],
                ["website", t("Website & Kanäle", "Website & channels"), Globe, 0],
                ["social", t("Beiträge & Social Media", "Posts & social media"), Megaphone, 0],
                ["assistant", t("KI-Assistent", "AI assistant"), Sparkles, 0],
                ["reviews", t("Bewertungen", "Reviews"), Star, 0],
                ["auto", t("Automatik", "Automations"), Zap, 0],
                ["numbers", t("Google & Zahlen", "Google & numbers"), BarChart3, 0],
              ]],
              [t("Hilfe", "Help"), [
                ["hilfe", t("Hilfe & Anleitung", "Help & guide"), HelpCircle, 0],
              ]],
            ] as const
          ).map(([group, items]) => (
            <div key={group} className="adm__group">
              <p className="adm__group-k">{group}</p>
              <ul>
                {items.map(([k, label, Icon, count]) => (
                  <li key={k}>
                    <a
                      href={"#" + TAB_HASH[k]}
                      onClick={(e) => {
                        e.preventDefault();
                        setTab(k);
                      }}
                      className={`adm__link${tab === k ? " is-on" : ""}`}
                      aria-current={tab === k ? "page" : undefined}
                    >
                      <Icon aria-hidden="true" />
                      <span>{label}</span>
                      {count > 0 && <span className="adm__count">{count}</span>}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="adm__foot">
          <LanguageSwitcher inNav />
          <a href={ADMIN_WEBAPP_URL} target="_blank" rel="noopener noreferrer" className="adm__foot-link">
            {t("Google-Tabelle & Backoffice", "Google Sheet & back office")} ↗
          </a>
          <button type="button" onClick={logout} className="adm__logout">
            <LogOut aria-hidden="true" />
            <span>{t("Abmelden", "Log out")}</span>
          </button>
        </div>
      </aside>
      {menuOpen && <button type="button" className="adm__scrim" aria-label={t("Menü schließen", "Close menu")} onClick={() => setMenuOpen(false)} />}

      <div className="adm__main space-y-6">
        {/* phones: the menu opens from the left */}
        <div className="adm__bar">
          <button type="button" className="adm__menu-btn" onClick={() => setMenuOpen(true)} aria-expanded={menuOpen}>
            <span aria-hidden="true">☰</span> {t("Menü", "Menu")}
          </button>
          <span className="adm__bar-t">{
            {
              overview: t("Übersicht", "Overview"),
              leads: t("Anfragen", "Inquiries"),
              termine: t("Termine & Kalender", "Appointments"),
              planer: t("Aufmaß & Angebot", "Estimator"),
              belege: t("Belege & Rechnungen", "Invoices"),
              drive: t("Fotos & Drive", "Photos & Drive"),
              social: t("Beiträge & Social Media", "Posts & social media"),
              assistant: t("KI-Assistent", "AI assistant"),
              auto: t("Automatik", "Automations"),
              reviews: t("Bewertungen", "Reviews"),
              numbers: t("Google & Zahlen", "Google & numbers"),
              hilfe: t("Hilfe & Anleitung", "Help & guide"),
              website: t("Website & Kanäle", "Website & channels"),
              media: t("Mediathek", "Media library"),
              pages: t("Seiten & Fotos", "Pages & photos"),
            }[tab]
          }</span>
          {live && (
            <button type="button" className={`adm__live is-${live.state}`} onClick={loadReal} title={t("Neu laden", "Reload")}>
              {live.state === "load"
                ? t("Lädt aus Google-Tabelle …", "Loading from Google Sheet …")
                : live.state === "error"
                ? t("Google-Tabelle nicht erreichbar · erneut versuchen", "Google Sheet unreachable · retry")
                : t(`Live · Google-Tabelle · ${live.count} Anfragen · ${live.at} ⟳`, `Live · Google Sheet · ${live.count} inquiries · ${live.at} ⟳`)}
            </button>
          )}
        </div>

      {tab === "website" && <AdminSiteContent t={t} onSessionEnd={logout} />}
      {tab === "media" && <AdminMedia t={t} onSessionEnd={logout} />}
      {tab === "pages" && <AdminPages t={t} onSessionEnd={logout} onOpenMedia={() => setTab("media")} />}
      {tab === "social" && <AdminSocial t={t} onSessionEnd={logout} onOpenMedia={() => setTab("media")} />}
      {tab === "assistant" && <AdminAssistant t={t} onSessionEnd={logout} />}
      {tab === "auto" && <AdminAutomations t={t} lang={lang} onSessionEnd={logout} />}
      {tab === "reviews" && <AdminReviews t={t} onSessionEnd={logout} />}
      {tab === "numbers" && <AdminNumbers t={t} onSessionEnd={logout} />}

      {/* TAB 1: OVERVIEW */}
      {tab === "overview" && (
        <div className="space-y-6">
          <AdminToday t={t} onGo={setTab} onSessionEnd={logout} />
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
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-2 min-w-0">
              <div>
                <div className="text-base sm:text-lg font-extrabold text-emerald-700 flex items-center gap-1.5">
                  <TrendingUp className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{t("Marketing", "Marketing")}</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">{t("Seiten, Beiträge, KI-Entwürfe und echte Zahlen:", "Pages, posts, AI drafts and real numbers:")}</div>
              </div>
              <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                {(
                  [
                    ["pages", t("Seiten & Fotos", "Pages & photos")],
                    ["social", t("Beiträge", "Posts")],
                    ["assistant", t("KI-Assistent", "AI assistant")],
                    ["numbers", t("Google & Zahlen", "Google & numbers")],
                  ] as const
                ).map(([k, label]) => (
                  <button key={k} type="button" onClick={() => setTab(k)} className="px-2 py-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs border border-emerald-200 truncate">
                    {label}
                  </button>
                ))}
              </div>
            </div>
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
      {tab === "leads" && leadView === "table" && <AdminLeadsTable leads={leads} t={t} onOpen={openLead} onNew={() => setLeadForm("new")} />}
      {tab === "leads" && leadView === "detail" && (
        <div className="dw__acts">
          <button type="button" className="at__back" onClick={() => setLeadView("table")}>
            ← {t("Alle Anfragen", "All inquiries")}
          </button>
          {curLead && realRef.current && (
            <>
              <button type="button" className="at__btn" onClick={() => setLeadForm(curLead)}>
                {t("Kundendaten bearbeiten", "Edit customer data")}
              </button>
              <button
                type="button"
                className="at__btn"
                onClick={() => {
                  setApptFor(curLead.id);
                  setTab("termine");
                }}
              >
                {t("Termin anlegen", "New appointment")}
              </button>
              <button type="button" className="btn-shine at__new" onClick={() => setTab("planer")}>
                {t("Aufmaß & Angebot", "Survey & quote")}
              </button>
            </>
          )}
        </div>
      )}
      {leadForm && (
        <LeadForm
          t={t}
          lead={leadForm === "new" ? null : leadForm}
          onClose={() => setLeadForm(null)}
          onSessionEnd={logout}
          onSaved={async (l) => {
            setLeadForm(null);
            await loadReal();
            openLead(l.id);
          }}
        />
      )}
      {tab === "leads" && leadView === "detail" && curLead && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Lead selection & Quote line items */}
          <div className="lg:col-span-7 space-y-6 min-w-0">
            {/* the table is the way between enquiries; this is the single view */}
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
                      if (realRef.current) {
                        // written to the Google Sheet; on failure the old status comes back
                        const id = curLead.id, before = curLead.status;
                        adminCall("api_update", id, { status: nextStatus }).then((r) => {
                          if (!r.ok) {
                            setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status: before } : l)));
                            showToast(t(`Status nicht gespeichert: ${r.error}`, `Status not saved: ${r.error}`));
                            if (r.error === "login") logout();
                          }
                        });
                      }
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

              <button
                type="button"
                onClick={() => {
                  setNewAptLeadId(curLead.id);
                  setNewAptDate(curLead.date || new Date(Date.now() + 86400000).toISOString().slice(0, 10));
                  setTab("termine");
                  setShowNewAptModal(true);
                }}
                className="w-full min-h-[44px] bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs px-4 py-2.5 rounded-xl border border-slate-300 flex items-center justify-center gap-2 transition-colors mt-1"
              >
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>{t("📅 Vor-Ort-Termin für diesen Kunden planen", "📅 Schedule On-Site Appointment for this Lead")}</span>
              </button>
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
                              onClick={() => {
                                const leadPhotoList = (curLead.photos || []).map((p) => ({
                                  photo: p,
                                  leadId: curLead.id,
                                  leadName: curLead.name,
                                }));
                                openPhotoViewer(ph, curLead.id, leadPhotoList);
                              }}
                              className="relative h-24 w-full overflow-hidden bg-slate-100 text-left"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={ph.dataUrl}
                                alt={ph.name}
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src =
                                    "/img/gallery/schimmel-ausbluehungen-480.webp";
                                }}
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
      {tab === "drive" && <AdminPhotos t={t} leads={leads} onSessionEnd={logout} onOpenLead={openLead} />}

      {tab === "planer" && <AdminQuote t={t} leads={leads} startId={selectedLeadId} onSessionEnd={logout} onOpenDoc={setEditNr} />}

      {tab === "belege" && <AdminInvoices t={t} onSessionEnd={logout} onOpenLead={openLead} onEdit={setEditNr} version={docsVersion} />}
      {editNr && (
        <AdminDocEditor
          nr={editNr}
          t={t}
          onClose={() => setEditNr("")}
          onChanged={() => setDocsVersion((v) => v + 1)}
          onSessionEnd={logout}
          onOpenDoc={setEditNr}
        />
      )}

      {tab === "termine" && <AdminAppointments t={t} isEn={isEn} onSessionEnd={logout} onOpenLead={openLead} leads={leads} createFor={apptFor} onCreateDone={() => setApptFor(null)} />}

      {/* TAB 8: HILFE & GOOGLE-SETUP */}
      {tab === "hilfe" && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-extrabold uppercase">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t("Hilfe-Center & Google-Setup Handbuch", "Help Center & Google Setup Manual")}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              {t("Alles zu Google Ads, Google Maps, Analytics & Admin-Steuerung", "All About Google Ads, Google Maps, Analytics & Admin Controls")}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              {t(
                "Hier finden Sie die vollständige Übersicht, wie Ihre Google Ads Express Kampagne, Ihr Google Unternehmensprofil in Essen, Google Analytics 4 und dieser Admin nahtlos zusammenarbeiten.",
                "Complete guide on how your Google Ads Express campaign, your Essen Google Business Profile, Google Analytics 4, and this Admin work together seamlessly."
              )}
            </p>
          </div>

          {/* SECTION 1: GOOGLE ADS INTEGRATION & PLAN SYNCHRONIZATION */}
          <div className="bg-gradient-to-br from-emerald-50/80 via-white to-slate-50 border-2 border-emerald-500/40 rounded-2xl p-5 sm:p-7 space-y-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-200/60 pb-4">
              <div className="space-y-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800">
                  {t("1. Google Ads Express Kampagne & Admin-Synchronisation", "1. Google Ads Express Campaign & Admin Sync")}
                </span>
                <h4 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  {t("Ihre Kampagne #24368834798 ist aktiv geschaltet", "Your Campaign #24368834798 Is Live & Active")}
                </h4>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={`https://ads.google.com/aw/express/dashboard?campaignId=${googleAdsCampaignId}&ocid=${googleAdsOcid}&euid=${googleAdsEuid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[42px] px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs inline-flex items-center gap-2 shadow-xs transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{t("Google Ads Dashboard öffnen ↗", "Open Google Ads Dashboard ↗")}</span>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                <div className="font-extrabold text-slate-900 flex items-center gap-1.5 text-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{t("Was macht Google Ads?", "What does Google Ads do?")}</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  {t(
                    "Google spielt Ihre Anzeigen in Essen und ganz NRW für Suchbegriffe wie „Kellersanierung Essen“, „feuchter Keller“ und „Wasserschaden“ aus. Google rechnet Ihr Budget von 75 €/Woche direkt ab.",
                    "Google broadcasts your ads across Essen and NRW for high-intent keywords like 'cellar waterproofing', 'damp basement', and 'water damage' with your 75 €/week budget."
                  )}
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                <div className="font-extrabold text-slate-900 flex items-center gap-1.5 text-sky-800">
                  <FolderOpen className="w-4 h-4 text-sky-600" />
                  <span>{t("Was macht dieser Admin?", "What does this Admin do?")}</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  {t(
                    "Ihr Admin empfängt jeden Telefon-Anruf, jeden WhatsApp-Chat und jedes Kontaktformular sofort in Tab 1 (Anfragen), berechnet Angebote nach WTA und schützt Sie vor Kalender-Überlastung.",
                    "Your Admin collects all phone calls, WhatsApp inquiries, and contact forms instantly in Tab 1 (Leads), builds WTA estimates, and manages your bookings."
                  )}
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                <div className="font-extrabold text-slate-900 flex items-center gap-1.5 text-amber-800">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  <span>{t("Warum war ein anderer Tarif aktiv?", "Why was another plan active before?")}</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  {t(
                    "Im Admin war anfangs standardmäßig das 150 € Pro-Paket vorausgewählt. Wir haben den Admin jetzt dauerhaft auf Ihr aktives 75 € / Woche Google Ads Starter-Paket synchronisiert.",
                    "The admin initially defaulted to the 150 € Pro tier. We have now permanently synchronized the admin to your active 75 € / week Google Ads Starter tier."
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 2: THE 4-PILLAR GOOGLE STATUS (NO REPEATING STEPS!) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 space-y-5 shadow-sm">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-emerald-700 text-[11px] font-black uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{t("2. Das 4-Säulen Google Ökosystem (Keine doppelten Schritte nötig!)", "2. The 4-Pillar Google Ecosystem (No More Repeating Steps!)")}</span>
              </div>
              <h4 className="text-lg sm:text-xl font-extrabold text-slate-900">
                {t("Alle 4 Google-Systeme sind fertig eingerichtet & verifiziert", "All 4 Google Systems Are Fully Verified & Operational")}
              </h4>
              <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                {t(
                  "Sie müssen keine Bestätigungsschritte mehr wiederholen. Ihr Profil, Ihre Website-Verifizierung und Ihre Kampagne sind vollständig aktiv:",
                  "You do not need to repeat verification steps in Google. Your profile, website verification, and ad campaign are fully active:"
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              {/* Pillar 1 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-xs">1. Google Business Profile</span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">✓ Bestätigt</span>
                </div>
                <div className="text-[11px] text-slate-700 font-semibold">
                  Niebuhrstraße 46, 45144 Essen (HQ)
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  {t(
                    "Ihr offizieller Firmensitz bei Google Maps. Kunden in Essen und Umgebung finden Ihr Profil bei lokalen Suchen.",
                    "Your official headquarters on Google Maps. Homeowners find you in local search packs."
                  )}
                </p>
                <div className="pt-2 border-t border-slate-200">
                  <a
                    href="https://business.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-emerald-700 hover:underline inline-flex items-center gap-1"
                  >
                    <span>{t("Profil verwalten ↗", "Manage Profile ↗")}</span>
                  </a>
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-xs">2. Search Console</span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">✓ Verifiziert</span>
                </div>
                <div className="text-[10px] font-mono text-slate-700 truncate" title="google2708c8bddd621795.html">
                  google2708c8bddd621795.html
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  {t(
                    "HTML-Bestätigungsdatei und Meta-Tag liegen live auf https://sos-abdichtung.de/. Google erkennt Ihre Inhaberschaft automatisch an.",
                    "HTML token and meta tag are live on the server. Google recognizes verified ownership automatically."
                  )}
                </p>
                <div className="pt-2 border-t border-slate-200">
                  <a
                    href="https://search.google.com/search-console?resource_id=https%3A%2F%2Fsos-abdichtung.de%2F"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-sky-700 hover:underline inline-flex items-center gap-1"
                  >
                    <span>{t("Search Console öffnen ↗", "Open Search Console ↗")}</span>
                  </a>
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-xs">3. Analytics 4 (GA4)</span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">✓ Aktiv</span>
                </div>
                <div className="text-[10px] font-mono text-slate-700">
                  Tag: G-X723SXRK6F
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  {t(
                    "Offizieller Google-Tag ist im Quellcode jeder Seite eingebunden. Erfasst Klicks auf die Telefonnummer, Formulare & WhatsApp.",
                    "Official Google Tag installed on all pages. Automatically tracks phone clicks, forms, and WhatsApp."
                  )}
                </p>
                <div className="pt-2 border-t border-slate-200">
                  <a
                    href="https://analytics.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-amber-700 hover:underline inline-flex items-center gap-1"
                  >
                    <span>{t("GA4 Dashboard ↗", "Open GA4 ↗")}</span>
                  </a>
                </div>
              </div>

              {/* Pillar 4 */}
              <div className="p-4 rounded-xl border-2 border-emerald-400 bg-emerald-50/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-xs">4. Google Ads Express</span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    Live Aktiv
                  </span>
                </div>
                <div className="text-[10px] font-mono text-emerald-900 font-bold">
                  Kampagne #{googleAdsCampaignId}
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  {t(
                    "Aktives Budget: 75 €/Woche. Anrufe und Leads aus Google Ads werden automatisch in Tab 1 erfasst.",
                    "Active budget: 75 €/week. Calls and leads from Google Ads flow automatically into Tab 1."
                  )}
                </p>
                <div className="pt-2 border-t border-emerald-200">
                  <a
                    href={`https://ads.google.com/aw/express/dashboard?campaignId=${googleAdsCampaignId}&ocid=${googleAdsOcid}&euid=${googleAdsEuid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-black text-emerald-800 hover:underline inline-flex items-center gap-1"
                  >
                    <span>{t("Google Ads Dashboard ↗", "Open Ads Dashboard ↗")}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: STEP-BY-STEP WORKFLOW FROM LEAD TO GOBD INVOICE */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 space-y-5 shadow-sm">
            <div className="space-y-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800">
                {t("3. Arbeitsablauf in Ihrem Admin-Portal", "3. Step-by-Step Trade Workflow in Your Admin")}
              </span>
              <h4 className="text-lg sm:text-xl font-extrabold text-slate-900">
                {t("So wickeln Sie einen Kunden vom Klick bis zur Rechnung ab", "How to Handle a Customer From Ad Click to Invoice")}
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-black flex items-center justify-center text-xs">
                  1
                </div>
                <div className="font-bold text-slate-900 text-sm">
                  {t("Anfrage geht ein", "Inquiry Arrives")}
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  {t(
                    "Kunde klickt auf Ihre Google-Werbung oder ruft an. Die Anfrage erscheint sofort in Tab 1 (Anfragen) mit Kontaktdaten und Schadensort.",
                    "Homeowner clicks your Google Ad or calls. Inbound inquiry appears immediately in Tab 1 (Inquiries) with address and damage type."
                  )}
                </p>
                <div className="text-[10px] font-bold text-emerald-700">→ Tab 1: Anfragen</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-black flex items-center justify-center text-xs">
                  2
                </div>
                <div className="font-bold text-slate-900 text-sm">
                  {t("Vor-Ort-Diagnose", "On-Site Diagnostic")}
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  {t(
                    "Tragen Sie den Vor-Ort-Besichtigungstermin in Tab 6 (Kalender) ein. Schadensfotos vom Keller laden Sie direkt in Tab 3 (Drive) hoch.",
                    "Schedule inspection in Tab 6 (Calendar). Upload moisture photos directly into Tab 3 (Drive) for safe storage."
                  )}
                </p>
                <div className="text-[10px] font-bold text-emerald-700">→ Tab 3 & 6: Drive & Kalender</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-black flex items-center justify-center text-xs">
                  3
                </div>
                <div className="font-bold text-slate-900 text-sm">
                  {t("WTA-Angebot erstellen", "Create WTA Quote")}
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  {t(
                    "Öffnen Sie Tab 4 (Aufmaß-Planer). Geben Sie Wandlänge (lfm) & Wandhöhe ein. Mit einem Klick erzeugen Sie ein zertifiziertes WTA-Angebot (ANG-2026-xxxx).",
                    "Open Tab 4 (Estimator). Enter wall length (lin. m) & height. Generate a certified WTA quote (ANG-2026-xxxx) with one click."
                  )}
                </p>
                <div className="text-[10px] font-bold text-emerald-700">→ Tab 4: Aufmaß-Planer</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-black flex items-center justify-center text-xs">
                  4
                </div>
                <div className="font-bold text-slate-900 text-sm">
                  {t("GoBD-Rechnung drucken", "Print GoBD Invoice")}
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  {t(
                    "Kunde unterschreibt digital. In Tab 5 (Belege) wandeln Sie das Angebot mit 1 Klick in eine GoBD-Rechnung (RE-2026-xxxx) um inkl. § 35a Handwerkerbonus.",
                    "Customer signs digitally. In Tab 5 (Invoices), convert the quote to a GoBD invoice (RE-2026-xxxx) with deductible labor tax bonus."
                  )}
                </p>
                <div className="text-[10px] font-bold text-emerald-700">→ Tab 5: Belege</div>
              </div>
            </div>
          </div>

          {/* SECTION 4: FAQ (FREQUENTLY ASKED QUESTIONS) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 space-y-4 shadow-sm">
            <h4 className="text-lg font-black text-slate-900">
              {t("Häufig gestellte Fragen (FAQ)", "Frequently Asked Questions (FAQ)")}
            </h4>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="font-extrabold text-slate-900">
                  {t("Frage: Muss ich den Google-Tag oder die HTML-Datei nochmals einfügen?", "Question: Do I need to upload the Google tag or HTML file again?")}
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  {t(
                    "Antwort: Nein! Die Datei google2708c8bddd621795.html und das Google-Tag G-X723SXRK6F sind bereits fest im Quellcode der Website verankert und live auf dem Server aktiv. Sie müssen diesen Schritt nie wiederholen.",
                    "Answer: No! The file google2708c8bddd621795.html and the Google tag G-X723SXRK6F are permanently deployed to the website server. You do not need to repeat this step."
                  )}
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="font-extrabold text-slate-900">
                  {t("Frage: Wie stoppe oder pausiere ich die Werbung, wenn wir zu viele Aufträge haben?", "Question: How do I pause ads when we are fully booked?")}
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  {t(
                    "Antwort: Gehen Sie in Tab 7 („SEO & Google Suite“) und klicken Sie auf „Kampagne pausieren“. Die Werbung stoppt sofort und verursacht 0 € Kosten. Zusätzlich können Sie den automatischen Kapazitätsschutz aktivieren, der ab 5 Terminen pro Woche automatisch pausiert.",
                    "Answer: Go to Tab 7 ('SEO & Google Suite') and click 'Pause Campaign'. Ads halt immediately with 0 € cost. You can also turn on auto-pause for capacity protection."
                  )}
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="font-extrabold text-slate-900">
                  {t("Frage: Wo sehe ich, ob die 75 Euro wirklich arbeiten?", "Question: Where can I see if the 75 Euro plan is actively working?")}
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  {t(
                    "Antwort: In Tab 7 finden Sie das „Live-Marketing Cockpit“ mit allen eingegangenen Anfragen, berechnetem CPL (Kosten pro Anfrage) und dem Wert Ihrer offenen Angebote. Über den grünen Button „Google Ads Dashboard öffnen“ sehen Sie zudem die Klickzahlen und Impressionen direkt bei Google.",
                    "Answer: In Tab 7 you will find the Live Marketing Cockpit displaying real inquiries, cost-per-lead, and pipeline revenue. The direct button opens your Google Ads live dashboard."
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 5: CLOUD CONNECTION & 1-CLICK PUBLISHING */}
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
                {t("Cloud-Verbindung & Google Workspace", "Cloud Connection & Google Workspace")}
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
                  <code className="break-words bg-slate-100 px-2 py-0.5 rounded">SOS Abdichtung - Verträge</code>
                </div>
                <div>
                  <strong>{t("Drive-Ordner GoBD-Belege:", "Drive Folder GoBD Receipts:")}</strong>{" "}
                  <code className="break-words bg-slate-100 px-2 py-0.5 rounded">
                    SOS Abdichtung - Belege / 2026
                  </code>
                </div>
                <div>
                  <strong>{t("Apps Script Endpoint:", "Apps Script Endpoint:")}</strong>{" "}
                  <code className="break-all bg-slate-100 px-2 py-0.5 rounded block mt-1">
                    {GAS_API_URL}
                  </code>
                </div>
                <div className="pt-2 flex flex-wrap gap-2">
                  <a
                    href="https://drive.google.com/open?id=13tKv0uH-iFvJZhQ09-YnAALKt2VUyG7cOTd1jgKhDfI"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition"
                  >
                    <span>📊 Google Sheet öffnen ↗</span>
                  </a>
                  <a
                    href={ADMIN_WEBAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0f2537] hover:bg-slate-800 text-white font-bold text-xs transition"
                  >
                    <span>⚙️ Apps Script Admin SPA ↗</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 6: MASTER ARCHITECTURE & GOOGLE WORKSPACE CLOUD GUIDE */}
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 sm:p-7 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[11px] font-black uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t("Master-Architektur: Google Apps Script, Sheets & GoBD Cloud", "Master Architecture: Google Apps Script, Sheets & GoBD Cloud")}</span>
                </div>
                <h4 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  {t("Autonomes Google Workspace Ökosystem (Zero-Code im laufenden Betrieb)", "Autonomous Google Workspace Ecosystem (Zero Code After Deployment)")}
                </h4>
                <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
                  {t(
                    "Das gesamte System arbeitet vollautomatisch: Anfragen, Schadensfotos, Angebote, Kalendertermine und GoBD-Rechnungen werden direkt in Ihrem Google Workspace gespeichert.",
                    "The entire system operates automatically: Inquiries, damage photos, quotes, calendar appointments, and GoBD invoices are stored directly in your Google Workspace."
                  )}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <a
                  href="https://drive.google.com/open?id=13tKv0uH-iFvJZhQ09-YnAALKt2VUyG7cOTd1jgKhDfI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs inline-flex items-center gap-1.5 transition shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Google Sheet Master ↗</span>
                </a>
                <a
                  href={ADMIN_WEBAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-[#0f2537] hover:bg-slate-800 text-white font-bold text-xs inline-flex items-center gap-1.5 transition shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Apps Script Admin SPA ↗</span>
                </a>
              </div>
            </div>

            {/* 3 Core Architecture Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Pillar 1: Google Sheets Database */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-700" />
                    <span>1. Google Sheets Datenbank</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    8 Tabellen
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Zentrale relationale Datenbank für Kunden, Preise, Verträge und Audit-Logs:
                </p>
                <ul className="space-y-1 text-[11px] text-slate-700 font-medium">
                  <li>• <strong>Anfragen:</strong> Leads, Adressen, Token &amp; Status</li>
                  <li>• <strong>Positionen:</strong> WTA-Material- &amp; Leistungspositionen</li>
                  <li>• <strong>Angebote:</strong> Festpreis-Kalkulationen &amp; Versionen</li>
                  <li>• <strong>Belege:</strong> 17 GoBD-Spalten (§ 14 UStG &amp; § 35a EStG)</li>
                  <li>• <strong>Protokoll:</strong> Revisionssicheres Audit-Log jeder Änderung</li>
                  <li>• <strong>Benutzer:</strong> Gesalzene Passwörter &amp; Brute-Force-Schutz</li>
                  <li>• <strong>Konfiguration:</strong> Steuernr, USt-ID, IBAN, Stundensätze</li>
                  <li>• <strong>Termine &amp; Strecken:</strong> Kalenderbuchungen &amp; PLZ-Logs</li>
                </ul>
              </div>

              {/* Pillar 2: Google Drive Storage */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-sky-700" />
                    <span>2. Google Drive Ordner</span>
                  </span>
                  <span className="text-[10px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-full">
                    Cloud Storage
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Automatische Ordner-Erstellung und Archivierung aller Medien in Originalauflösung:
                </p>
                <div className="space-y-2 text-[11px]">
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <strong className="text-slate-900 block">SOS Abdichtung - Kundenfotos:</strong>
                    <span className="text-slate-500 font-mono text-[10px]">&lt;Anfrage-ID&gt;/</span> für Schadensfotos direkt vom Smartphone.
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <strong className="text-slate-900 block">SOS Abdichtung - Belege:</strong>
                    <span className="text-slate-500 font-mono text-[10px]">&lt;2026&gt;/</span> für unveränderbare GoBD-Angebots- &amp; Rechnungs-PDFs.
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <strong className="text-slate-900 block">SOS Abdichtung - Verträge:</strong>
                    <span className="text-slate-500">Für digitale Kunden-Signaturen (PNG-Zertifikate).</span>
                  </div>
                </div>
              </div>

              {/* Pillar 3: GoBD Invoicing & § 35a */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                    <Receipt className="w-4 h-4 text-amber-700" />
                    <span>3. GoBD &amp; § 35a EStG</span>
                  </span>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                    Finanzamt-Konform
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Lückenlose Rechnungslegung und automatischer Steuervorteil für Ihre Kunden:
                </p>
                <ul className="space-y-1.5 text-[11px] text-slate-700">
                  <li>• <strong>Fortlaufende Nummern:</strong> <code>ANG-2026-xxxx</code> (Angebot), <code>RE-2026-xxxx</code> (Rechnung), <code>STORNO-RE-xxxx</code> (Korrektur).</li>
                  <li>• <strong>§ 35a Handwerkerlohn:</strong> 20 % Steuerersparnis für Kunden bei unbarer Zahlung wird automatisch berechnet und separat ausgewiesen.</li>
                  <li>• <strong>Zahlungsverfolgung:</strong> Teilbezahlt, Bezahlt und automatische Skonto-/Fälligkeitsberechnung.</li>
                  <li>• <strong>GoBD-Festschreibung:</strong> Rechnungen können nach Versand nicht gelöscht, sondern nur ordnungsgemäß storniert werden.</li>
                </ul>
              </div>
            </div>

            {/* Customer Self-Service & Testing Verification Bar */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="font-extrabold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Kunden-Selfservice-Portal (/mein-auftrag/) &amp; Test-Suiten</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed max-w-2xl">
                  Kunden erhalten bei jeder Anfrage einen sicheren Token-Link (z. B. <code>/mein-auftrag/?id=A-1001&amp;k=...</code>) mit Live-Status, 1-Klick Google Kalender Sync, Foto-Upload und digitaler Unterschrift per Finger/Maus.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <Link
                  href="/mein-auftrag/"
                  target="_blank"
                  className="px-3.5 py-2 rounded-xl bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-900 font-bold text-xs inline-flex items-center gap-1.5 transition"
                >
                  <span>Kunden-Portal öffnen ↗</span>
                </Link>
                <div className="text-[10px] font-mono text-emerald-800 bg-emerald-100/80 px-2.5 py-1.5 rounded-lg border border-emerald-300">
                  ✓ node backend/test/run.js (7/7)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full-Screen Photo Lightbox Modal & Damage Inspector */}
      {zoomPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col p-2 sm:p-4 select-none"
          onClick={(e) => {
            if (e.target === e.currentTarget) setZoomPhoto(null);
          }}
        >
          {/* Top Bar */}
          <div className="bg-[#0f2537] text-white px-3 sm:px-5 py-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xl shrink-0 border border-slate-800">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 bg-emerald-950 border border-emerald-500/40 rounded-xl shrink-0">
                <Camera className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-extrabold text-xs sm:text-sm text-white truncate">
                    {zoomPhoto.leadId} {zoomPhoto.leadName ? `· ${zoomPhoto.leadName}` : ""}
                  </span>
                  <span className="text-[10px] bg-emerald-600/70 text-emerald-100 px-2 py-0.5 rounded-full font-bold">
                    {zoomPhoto.index + 1} / {zoomPhoto.total}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 truncate">
                  📁 <code>{zoomPhoto.photo.driveFolder}</code> · {zoomPhoto.photo.name}
                </div>
              </div>
            </div>

            {/* Viewer Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Zoom Out */}
              <button
                type="button"
                onClick={() => setZoomScale((s) => Math.max(0.75, Math.round((s - 0.25) * 100) / 100))}
                title={t("Verkleinern (-)", "Zoom Out (-)")}
                className="min-h-[38px] min-w-[38px] bg-white/10 hover:bg-white/20 text-white rounded-xl inline-flex items-center justify-center transition-colors"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              {/* Zoom Reset / Scale */}
              <button
                type="button"
                onClick={() => {
                  setZoomScale(1);
                  setRotationDeg(0);
                }}
                title={t("Zoom zurücksetzen (0)", "Reset Zoom (0)")}
                className="min-h-[38px] px-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-colors"
              >
                {Math.round(zoomScale * 100)} %
              </button>

              {/* Zoom In */}
              <button
                type="button"
                onClick={() => setZoomScale((s) => Math.min(3, Math.round((s + 0.25) * 100) / 100))}
                title={t("Vergrößern (+)", "Zoom In (+)")}
                className="min-h-[38px] min-w-[38px] bg-white/10 hover:bg-white/20 text-white rounded-xl inline-flex items-center justify-center transition-colors"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              {/* Rotate */}
              <button
                type="button"
                onClick={() => setRotationDeg((r) => (r + 90) % 360)}
                title={t("90° Drehen (R)", "Rotate 90° (R)")}
                className="min-h-[38px] min-w-[38px] bg-white/10 hover:bg-white/20 text-white rounded-xl inline-flex items-center justify-center transition-colors"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              {/* Download */}
              <a
                href={zoomPhoto.photo.dataUrl}
                download={zoomPhoto.photo.name}
                title={t("Herunterladen", "Download")}
                className="min-h-[38px] px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download</span>
              </a>

              {/* Close */}
              <button
                type="button"
                onClick={() => setZoomPhoto(null)}
                title={t("Schließen (Esc)", "Close (Esc)")}
                className="min-h-[38px] min-w-[38px] bg-white/10 hover:bg-rose-600 text-white rounded-xl inline-flex items-center justify-center transition-colors ml-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Center Stage with Prev / Next Buttons */}
          <div className="relative flex-1 my-2 overflow-hidden rounded-2xl bg-black/60 flex items-center justify-center border border-white/5">
            {/* Prev Button */}
            {zoomPhoto.total > 1 && (
              <button
                type="button"
                onClick={prevPhoto}
                title={t("Vorheriges Foto (←)", "Previous Photo (←)")}
                className="absolute left-3 sm:left-6 z-20 min-h-[48px] min-w-[48px] rounded-full bg-black/70 hover:bg-emerald-600 text-white flex items-center justify-center transition-all shadow-xl backdrop-blur-sm border border-white/20"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Photo Container */}
            <div className="w-full h-full flex items-center justify-center p-2 sm:p-6 overflow-hidden">
              <img
                src={zoomPhoto.photo.dataUrl}
                alt={zoomPhoto.photo.name}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "/img/gallery/schimmel-ausbluehungen-480.webp";
                }}
                style={{
                  transform: `scale(${zoomScale}) rotate(${rotationDeg}deg)`,
                  transition: "transform 0.15s ease-out",
                }}
                className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
              />
            </div>

            {/* Next Button */}
            {zoomPhoto.total > 1 && (
              <button
                type="button"
                onClick={nextPhoto}
                title={t("Nächstes Foto (→)", "Next Photo (→)")}
                className="absolute right-3 sm:right-6 z-20 min-h-[48px] min-w-[48px] rounded-full bg-black/70 hover:bg-emerald-600 text-white flex items-center justify-center transition-all shadow-xl backdrop-blur-sm border border-white/20"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Bottom Thumbnail Strip & File Details */}
          <div className="bg-[#0f2537]/90 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-white shrink-0 border border-slate-800">
            <div className="text-xs space-y-0.5 text-center sm:text-left min-w-0">
              <div className="font-bold truncate text-emerald-300">
                {zoomPhoto.photo.name}
              </div>
              <div className="text-[11px] text-slate-300 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span>{t("Hochgeladen:", "Uploaded:")} {zoomPhoto.photo.uploadedAt}</span>
                <span>·</span>
                <span>{zoomPhoto.photo.driveFolder}</span>
              </div>
            </div>

            {/* Thumbnails */}
            {zoomPhoto.total > 1 && (
              <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1">
                {zoomPhoto.list.map((item, i) => {
                  const isActive = i === zoomPhoto.index;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setZoomScale(1);
                        setRotationDeg(0);
                        setZoomPhoto({
                          photo: item.photo,
                          leadId: item.leadId,
                          leadName: item.leadName,
                          index: i,
                          total: zoomPhoto.total,
                          list: zoomPhoto.list,
                        });
                      }}
                      className={`relative h-12 w-12 sm:h-14 sm:w-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                        isActive
                          ? "border-emerald-400 scale-105 shadow-md"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={item.photo.dataUrl}
                        alt={item.photo.name}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "/img/gallery/schimmel-ausbluehungen-480.webp";
                        }}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
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

      {/* GLOBAL SERVICE PRICE LIST MANAGER MODAL */}
      {showPriceListModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden text-slate-900 animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between gap-3 bg-gradient-to-r from-emerald-50/60 to-white">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-emerald-800 text-[11px] font-black uppercase tracking-wider">
                  <Sliders className="w-4 h-4 text-emerald-600" />
                  <span>{t("Service-Preisliste & Tarife verwalten", "Manage Service Price List & Rates")}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  {t("Einheitspreise für alle Handwerker-Leistungen anpassen", "Adjust Unit Prices for All Trade Services")}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {t(
                    "Ändern Sie hier die Preise für beliebige Leistungen. Alle neuen Angebote im Aufmaß-Planer und Rechnungen in den Belegen übernehmen automatisch die neuen Preise.",
                    "Update unit prices for any service. New estimates in the planner and invoices will immediately reflect updated rates."
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPriceListModal(false)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center shrink-0 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Scrollable Service List */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 pb-1 border-b border-slate-100">
                <span>{t("Leistung & technische Spezifikation", "Service & Specification")}</span>
                <span className="text-right">{t("Einheitspreis (€)", "Unit Rate (€)")}</span>
              </div>

              <div className="space-y-3">
                {serviceCatalog.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                  >
                    <div className="space-y-0.5 flex-1 pr-2">
                      <div className="font-extrabold text-xs text-slate-900">
                        {isEn ? item.pos_en : item.pos_de}
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">
                        {isEn ? item.basis_en : item.basis_de}
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
                        {t("Einheit:", "Unit:")} {isEn ? item.unit_en : item.unit_de}
                      </span>
                    </div>

                    {/* Inline Price Adjuster */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => updateServicePrice(idx, Math.max(0, item.price - 5))}
                        className="w-8 h-8 rounded-lg bg-white hover:bg-slate-200 border border-slate-300 font-black text-xs text-slate-700 flex items-center justify-center shadow-xs"
                        title="-5 €"
                      >
                        -5
                      </button>

                      <div className="relative">
                        <input
                          type="number"
                          step={1}
                          min={0}
                          value={item.price}
                          onChange={(e) => updateServicePrice(idx, Number(e.target.value) || 0)}
                          className="w-24 min-h-[36px] text-center font-black text-xs text-slate-900 bg-white border border-slate-300 rounded-lg px-2 shadow-xs focus:ring-2 focus:ring-emerald-600"
                        />
                        <span className="absolute right-2 top-2 text-[10px] font-bold text-slate-400">€</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => updateServicePrice(idx, item.price + 5)}
                        className="w-8 h-8 rounded-lg bg-white hover:bg-slate-200 border border-slate-300 font-black text-xs text-slate-700 flex items-center justify-center shadow-xs"
                        title="+5 €"
                      >
                        +5
                      </button>

                      <button
                        type="button"
                        onClick={() => removeServiceFromCatalog(idx)}
                        className="w-8 h-8 rounded-lg bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 flex items-center justify-center transition-colors ml-1"
                        title={t("Löschen", "Delete")}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Custom Service Form */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <div className="text-xs font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                  <Plus className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t("Neue Leistung zur Preisliste hinzufügen", "Add Custom Service to Price List")}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                  <input
                    type="text"
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                    placeholder={t("Leistungsbezeichnung (z.B. Kernbohrung)", "Service Title (e.g. Core Drilling)")}
                    className="sm:col-span-5 text-xs px-3 py-2 border border-slate-300 rounded-xl bg-white min-h-[40px]"
                  />
                  <input
                    type="text"
                    value={newServiceBasis}
                    onChange={(e) => setNewServiceBasis(e.target.value)}
                    placeholder={t("Technische Spezifikation / Material", "Specification / Material")}
                    className="sm:col-span-3 text-xs px-3 py-2 border border-slate-300 rounded-xl bg-white min-h-[40px]"
                  />
                  <select
                    value={newServiceUnit}
                    onChange={(e) => setNewServiceUnit(e.target.value)}
                    className="sm:col-span-2 text-xs px-2.5 py-2 border border-slate-300 rounded-xl bg-white min-h-[40px] font-bold"
                  >
                    <option value="m²">m²</option>
                    <option value="lfm">lfm</option>
                    <option value="Pausch.">Pausch.</option>
                    <option value="Std.">Std.</option>
                    <option value="Tage">Tage</option>
                    <option value="Stk.">Stk.</option>
                  </select>
                  <div className="sm:col-span-2 relative">
                    <input
                      type="number"
                      step={1}
                      min={0}
                      value={newServicePrice}
                      onChange={(e) => setNewServicePrice(Number(e.target.value) || 0)}
                      placeholder="Preis"
                      className="w-full text-xs font-bold text-center px-2 py-2 border border-slate-300 rounded-xl bg-white min-h-[40px]"
                    />
                    <span className="absolute right-2 top-2.5 text-[10px] font-bold text-slate-400">€</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addCustomServiceToCatalog}
                  className="w-full min-h-[42px] bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs py-2 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t("Leistung speichern & sofort in Vorlagen aktivieren", "Save Service & Enable in Templates")}</span>
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <button
                type="button"
                onClick={resetServiceCatalog}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 underline"
              >
                {t("WTA-Standardwerte wiederherstellen", "Reset to Standard WTA Defaults")}
              </button>

              <button
                type="button"
                onClick={() => setShowPriceListModal(false)}
                className="min-h-[44px] px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-sm"
              >
                {t("Fertig & Schließen", "Done & Close")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MULTI-LOCATION & BRANCH MANAGER MODAL */}
      {showLocationEditorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {t("Firmenstandorte & Filialen verwalten", "Manage Business Locations & Branches")}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {t(
                      "Definieren Sie Hauptsitz & Niederlassungen für Google Business Profile, Local SEO & Google Ads",
                      "Configure HQ & branch offices for Google Business Profile, Local SEO & Google Ads"
                    )}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLocationEditorModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Existing Locations List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {t("Aktive Standorte", "Active Locations")} ({businessLocations.length})
                  </span>
                  <a
                    href="https://business.google.com/locations"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline inline-flex items-center gap-1"
                  >
                    <span>{t("Google Standortgruppe öffnen ↗", "Open Google Location Group ↗")}</span>
                  </a>
                </div>

                <div className="space-y-3">
                  {businessLocations.map((loc, idx) => (
                    <div
                      key={loc.id}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-black text-slate-900">
                            {isEn ? loc.name_en : loc.name_de}
                          </span>
                          <span
                            className={`text-[9px] px-2 py-0.5 rounded font-extrabold uppercase ${
                              loc.type === "headquarters"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {loc.type === "headquarters" ? t("Hauptsitz", "HQ") : t("Niederlassung", "Branch")}
                          </span>
                        </div>

                        {businessLocations.length > 1 && loc.type !== "headquarters" && (
                          <button
                            type="button"
                            onClick={() => removeLocation(loc.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors"
                            title={t("Standort entfernen", "Remove location")}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase">{t("Stadt", "City")}</label>
                          <input
                            type="text"
                            value={loc.city}
                            onChange={(e) => updateLocationField(loc.id, "city", e.target.value)}
                            className="w-full mt-0.5 text-xs font-semibold px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase">{t("PLZ & Straße", "ZIP & Street")}</label>
                          <div className="flex gap-1 mt-0.5">
                            <input
                              type="text"
                              value={loc.plz}
                              onChange={(e) => updateLocationField(loc.id, "plz", e.target.value)}
                              placeholder="PLZ"
                              className="w-16 text-xs font-semibold px-2 py-1.5 border border-slate-300 rounded-lg bg-white"
                            />
                            <input
                              type="text"
                              value={loc.street}
                              onChange={(e) => updateLocationField(loc.id, "street", e.target.value)}
                              placeholder="Straße"
                              className="w-full text-xs font-semibold px-2 py-1.5 border border-slate-300 rounded-lg bg-white"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase">{t("Telefonnummer", "Phone")}</label>
                          <input
                            type="text"
                            value={loc.phone}
                            onChange={(e) => updateLocationField(loc.id, "phone", e.target.value)}
                            className="w-full mt-0.5 text-xs font-semibold px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase">{t("Zielseiten-URL (SEO)", "City URL")}</label>
                          <input
                            type="text"
                            value={loc.url}
                            onChange={(e) => updateLocationField(loc.id, "url", e.target.value)}
                            className="w-full mt-0.5 text-xs font-semibold px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-emerald-800"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase">{t("Einzugsgebiet / Nachbarstädte", "Service Area")}</label>
                        <input
                          type="text"
                          value={loc.serviceAreas}
                          onChange={(e) => updateLocationField(loc.id, "serviceAreas", e.target.value)}
                          className="w-full mt-0.5 text-xs font-medium px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-700"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add New Location Form */}
              <div className="p-4 bg-emerald-50/50 border border-emerald-200/80 rounded-xl space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-700" />
                  <span>{t("Weitere Niederlassung / Standort hinzufügen", "Add Another Branch / Location")}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase">{t("Stadt", "City")}</label>
                    <input
                      type="text"
                      value={newLocCity}
                      onChange={(e) => setNewLocCity(e.target.value)}
                      placeholder="z.B. Düsseldorf"
                      className="w-full mt-0.5 text-xs font-semibold px-2.5 py-2 border border-slate-300 rounded-lg bg-white min-h-[38px]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase">{t("PLZ", "Postal Code")}</label>
                    <input
                      type="text"
                      value={newLocPlz}
                      onChange={(e) => setNewLocPlz(e.target.value)}
                      placeholder="z.B. 40210"
                      className="w-full mt-0.5 text-xs font-semibold px-2.5 py-2 border border-slate-300 rounded-lg bg-white min-h-[38px]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase">{t("Straße & Nr.", "Street & No.")}</label>
                    <input
                      type="text"
                      value={newLocStreet}
                      onChange={(e) => setNewLocStreet(e.target.value)}
                      placeholder="z.B. Königsallee 1"
                      className="w-full mt-0.5 text-xs font-semibold px-2.5 py-2 border border-slate-300 rounded-lg bg-white min-h-[38px]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase">{t("Telefon", "Phone")}</label>
                    <input
                      type="text"
                      value={newLocPhone}
                      onChange={(e) => setNewLocPhone(e.target.value)}
                      placeholder="z.B. +49 211 1234567"
                      className="w-full mt-0.5 text-xs font-semibold px-2.5 py-2 border border-slate-300 rounded-lg bg-white min-h-[38px]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-600 uppercase">{t("Landingpage-URL", "Landing Page URL")}</label>
                    <input
                      type="text"
                      value={newLocUrl}
                      onChange={(e) => setNewLocUrl(e.target.value)}
                      placeholder="https://sos-abdichtung.de/kellersanierung/duesseldorf/"
                      className="w-full mt-0.5 text-xs font-semibold px-2.5 py-2 border border-slate-300 rounded-lg bg-white min-h-[38px]"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addNewLocation}
                  className="w-full min-h-[40px] bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs py-2 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t("Standort speichern & aktivieren", "Save Location & Enable")}</span>
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <button
                type="button"
                onClick={resetLocationsToDefault}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 underline"
              >
                {t("Standard-Standorte wiederherstellen", "Reset to Default Locations")}
              </button>

              <button
                type="button"
                onClick={() => setShowLocationEditorModal(false)}
                className="min-h-[44px] px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-sm"
              >
                {t("Fertig & Schließen", "Done & Close")}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
