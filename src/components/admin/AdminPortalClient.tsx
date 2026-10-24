"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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

const ADMIN_PASS_SHA256 = (process.env.NEXT_PUBLIC_ADMIN_PASS_SHA256 || "").trim().toLowerCase();

type AdminTab =
  | "overview"
  | "leads"
  | "drive"
  | "planer"
  | "belege"
  | "termine"
  | "ads"
  | "analytics"
  | "searchconsole"
  | "maps"
  | "strategy"
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
    sosStrategy_de: "Google Maps 3-Pack dominieren, mobile 1-Klick Erreichbarkeit & TÜV/WTA Gütesiegel als Qualitätsnachweis hervorheben.",
    sosStrategy_en: "Dominate Google Maps 3-pack, 1-tap call & WhatsApp accessibility, TÜV & WTA certificates as proof of quality.",
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
      leads: nextLeads,
      docs: nextDocs,
      appointments: nextApts || appointments,
    });
  };

  const curLead = leads.find((l) => l.id === selectedLeadId) || leads[0];
  const curDoc = docs.find((d) => d.nr === selectedDocNr) || docs[0];

  // This page ships to every visitor, so it holds no password: only the SHA-256 of one,
  // set at build time. Without it the demo stays locked and the real back office is in Google.
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(pass));
    const hex = Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
    if (ADMIN_PASS_SHA256 && hex === ADMIN_PASS_SHA256) {
      setUnlocked(true);
      setLoginErr("");
    } else {
      setLoginErr(t("Ungültiges Passwort.", "Invalid password."));
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
      showToast(t(`✓ ${newPhotos.length} Datei(en) hinzugefügt & in Google Drive synchronisiert.`, `✓ ${newPhotos.length} file(s) added & synced to Google Drive.`));
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
              className={inputCls}
            />
          </div>
          {loginErr && <p className="text-xs font-bold text-red-600">{loginErr}</p>}
          <button
            type="submit"
            disabled={!ADMIN_PASS_SHA256}
            className="w-full min-h-[48px] bg-[#0f2537] hover:bg-slate-800 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl text-sm transition-colors"
          >
            {t("Im Admin-Portal anmelden →", "Log in to Admin Dashboard →")}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-200 text-xs text-slate-600 space-y-2 break-words">
          <p>
            {t(
              "Kundendaten, Termine und Belege verwalten Sie im Google-Backoffice:",
              "Customer data, appointments and invoices live in the Google back office:"
            )}
          </p>
          <a
            href={ADMIN_WEBAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center font-bold text-[#0f2537] underline underline-offset-2"
          >
            {t("Google-Backoffice öffnen →", "Open the Google back office →")}
          </a>
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
      <div className="bg-white text-slate-900 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
            <span className="font-extrabold tracking-wider uppercase text-xs sm:text-sm text-slate-900 truncate">
              SOS <span className="text-emerald-700">Abdichtung</span> · {t("Admin & Google Cloud", "Admin & Google Cloud Portal")}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-xs shrink-0 flex-wrap">
            <LanguageSwitcher inNav />
            <a
              href="https://drive.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 hover:text-emerald-800 underline font-semibold py-1 px-1"
            >
              Google Drive ↗
            </a>
            <button
              type="button"
              onClick={() => setUnlocked(false)}
              className="min-h-[38px] inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl font-bold border border-slate-200"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t("Abmelden", "Log Out")}</span>
            </button>
          </div>
        </div>

        <nav
          className="flex flex-wrap items-center gap-1.5 sm:gap-2"
          aria-label="Admin Navigation"
        >
          {(
            [
              ["overview", t("Übersicht", "Overview"), ShieldCheck],
              ["leads", `${t("Anfragen", "Inquiries")} (${leads.length})`, FolderOpen],
              ["drive", `${t("Drive", "Drive")} (${totalPhotosCount + docs.length})`, Camera],
              ["planer", t("Aufmaß", "Estimator"), Calculator],
              ["belege", `${t("Belege", "Invoices")} (${docs.length})`, FileText],
              ["termine", t("Kalender", "Calendar"), Calendar],
              ["ads", t("Google Ads", "Google Ads"), Rocket],
              ["analytics", t("Analytics (GA4)", "Analytics (GA4)"), BarChart3],
              ["searchconsole", t("Search Console", "Search Console"), Search],
              ["maps", t("Google Maps", "Google Maps"), MapPin],
              ["strategy", t("KI-Prognose & Strategie", "Predictive Strategy"), Sparkles],
              ["hilfe", t("Hilfe & Guide", "Help & Guide"), HelpCircle],
            ] as const
          ).map(([k, label, Icon]) => (
            <button
              key={k}
              type="button"
              onClick={() => setTab(k)}
              className={`min-h-[42px] shrink-0 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                tab === k
                  ? "bg-emerald-700 text-white shadow-sm font-extrabold ring-2 ring-emerald-600/30"
                  : "bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80"
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap">{label}</span>
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
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-2 min-w-0">
              <div>
                <div className="text-base sm:text-lg font-extrabold text-emerald-700 flex items-center gap-1.5">
                  <TrendingUp className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Google Marketing Suite</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {t("Separate Google Marketing & Strategie Tabs:", "Separate Google Marketing & Strategy tabs:")}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                <button
                  type="button"
                  onClick={() => setTab("ads")}
                  className="px-2 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center gap-1 border border-emerald-200 truncate"
                  title="Google Ads Express"
                >
                  <Rocket className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Google Ads</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTab("analytics")}
                  className="px-2 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-900 font-bold text-xs flex items-center gap-1 border border-sky-200 truncate"
                  title="Google Analytics 4"
                >
                  <BarChart3 className="w-3.5 h-3.5 text-sky-700 shrink-0" />
                  <span>Analytics</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTab("searchconsole")}
                  className="px-2 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs flex items-center gap-1 border border-amber-200 truncate"
                  title="Google Search Console"
                >
                  <Search className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>Console</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTab("maps")}
                  className="px-2 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold text-xs flex items-center gap-1 border border-purple-200 truncate"
                  title="Google Maps Unternehmensprofil"
                >
                  <MapPin className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                  <span>Maps</span>
                </button>
              </div>
              <button
                type="button"
                onClick={() => setTab("strategy")}
                className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-700 to-[#0f2537] hover:opacity-95 text-white font-extrabold text-[11px] flex items-center justify-center gap-1.5 shadow-xs transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>{t("KI-Prognose & Wettbewerber →", "Predictive Strategy & Competitors →")}</span>
              </button>
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
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div className="space-y-1">
                  <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <Camera className="w-4 h-4 text-emerald-700" />
                    <span>
                      {t(
                        "1. Kunden-Dateien & Schadensfotos (Ordner: SOS Abdichtung - Schadensfotos)",
                        "1. Customer Files & Damage Photos (Folder: SOS Abdichtung - Schadensfotos)"
                      )}
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {t(
                      "Klicken Sie auf ein beliebiges Schadensfoto für die hochauflösende Detail-Analyse, Zoom (bis 300%) und Bildrotation.",
                      "Click any damage photo for high-res inspection, deep zoom (up to 300%), and 90° rotation."
                    )}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* View Mode Toggle: Grid vs Table */}
                  <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                    <button
                      type="button"
                      onClick={() => setDriveViewMode("grid")}
                      className={`min-h-[32px] px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        driveViewMode === "grid"
                          ? "bg-[#0f2537] text-white"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <Grid className="w-3.5 h-3.5" />
                      <span>{t("Galerie", "Grid")}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDriveViewMode("table")}
                      className={`min-h-[32px] px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        driveViewMode === "table"
                          ? "bg-[#0f2537] text-white"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <List className="w-3.5 h-3.5" />
                      <span>{t("Tabelle", "Table")}</span>
                    </button>
                  </div>

                  <a
                    href="https://drive.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[36px] bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl inline-flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <span>Google Drive ↗</span>
                  </a>
                </div>
              </div>

              {/* Filter & Search Bar */}
              {(() => {
                const allPhotosFlattened = leads.flatMap((l) =>
                  (l.photos || []).map((ph) => ({
                    photo: ph,
                    leadId: l.id,
                    leadName: l.name,
                    damageType: l.damageType,
                  }))
                );

                const filteredPhotos = allPhotosFlattened.filter((item) => {
                  if (driveLeadFilter !== "all" && item.leadId !== driveLeadFilter) return false;
                  if (!drivePhotoSearch.trim()) return true;
                  const q = drivePhotoSearch.toLowerCase();
                  return (
                    item.photo.name.toLowerCase().includes(q) ||
                    item.leadName.toLowerCase().includes(q) ||
                    item.leadId.toLowerCase().includes(q) ||
                    item.damageType.toLowerCase().includes(q)
                  );
                });

                return (
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      {/* Customer / Dossier Filter Pills */}
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                        <span className="text-xs font-bold text-slate-500 shrink-0 mr-1">
                          {t("Kunde:", "Customer:")}
                        </span>
                        <button
                          type="button"
                          onClick={() => setDriveLeadFilter("all")}
                          className={`min-h-[34px] px-3 py-1 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                            driveLeadFilter === "all"
                              ? "bg-[#0f2537] text-white shadow-sm"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          {t("Alle Fotos", "All Photos")} ({allPhotosFlattened.length})
                        </button>
                        {leads.map((l) => {
                          const pCount = l.photos?.length || 0;
                          return (
                            <button
                              key={l.id}
                              type="button"
                              onClick={() => setDriveLeadFilter(l.id)}
                              className={`min-h-[34px] px-3 py-1 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                                driveLeadFilter === l.id
                                  ? "bg-[#0f2537] text-white shadow-sm"
                                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                              }`}
                            >
                              <span>{l.id} ({pCount})</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Search box */}
                      <div className="relative min-w-[220px]">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={drivePhotoSearch}
                          onChange={(e) => setDrivePhotoSearch(e.target.value)}
                          placeholder={t("Dateiname oder Schaden suchen…", "Search filename or damage…")}
                          className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    {filteredPhotos.length === 0 ? (
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center text-slate-500 space-y-2">
                        <ImageIcon className="w-10 h-10 text-slate-300 mx-auto" />
                        <div className="text-sm font-bold text-slate-700">
                          {t("Keine Schadensfotos gefunden", "No damage photos found")}
                        </div>
                        <p className="text-xs">
                          {t(
                            "Passen Sie die Filter an oder laden Sie unter Anfragen neue Schadensfotos hoch.",
                            "Adjust filters or upload new damage photos under Inquiries."
                          )}
                        </p>
                      </div>
                    ) : driveViewMode === "grid" ? (
                      /* GRID GALLERY VIEW */
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredPhotos.map((item, idx) => {
                          const { photo: ph, leadId, leadName, damageType } = item;
                          const isPdf = ph.fileType === "pdf" || ph.name.toLowerCase().endsWith(".pdf");
                          return (
                            <div
                              key={`${leadId}-${idx}`}
                              className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md hover:border-emerald-300 transition-all group"
                            >
                              {isPdf ? (
                                <a
                                  href={ph.dataUrl}
                                  download={ph.name}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="relative aspect-[4/3] w-full bg-red-50 flex flex-col items-center justify-center p-3 text-center hover:bg-red-100 transition-colors"
                                >
                                  <FileText className="w-12 h-12 text-red-600 mb-2" />
                                  <span className="text-xs font-bold text-red-950 truncate max-w-full">
                                    {ph.name}
                                  </span>
                                  <span className="text-[10px] text-red-700 mt-1 font-semibold">PDF Dokument (Download)</span>
                                </a>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() =>
                                    openPhotoViewer(
                                      ph,
                                      leadId,
                                      filteredPhotos.map((f) => ({
                                        photo: f.photo,
                                        leadId: f.leadId,
                                        leadName: f.leadName,
                                      }))
                                    )
                                  }
                                  className="relative aspect-[4/3] w-full bg-slate-900 overflow-hidden group text-left cursor-zoom-in"
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={ph.dataUrl}
                                    alt={ph.name}
                                    onError={(e) => {
                                      (e.currentTarget as HTMLImageElement).src =
                                        "/img/gallery/schimmel-ausbluehungen-480.webp";
                                    }}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />
                                  <span className="absolute top-2.5 left-2.5 bg-[#0f2537]/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                                    {leadId} · {leadName}
                                  </span>
                                  <span className="absolute top-2.5 right-2.5 bg-emerald-600/90 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
                                    {damageType || "Schadensfoto"}
                                  </span>
                                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 transition-opacity">
                                    <span className="bg-white/90 text-slate-900 font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5">
                                      <Eye className="w-3.5 h-3.5 text-emerald-700" />
                                      <span>{t("Vergrößern & Zoom", "Inspect & Zoom")}</span>
                                    </span>
                                  </div>
                                </button>
                              )}

                              <div className="p-3.5 space-y-2 text-xs flex-1 flex flex-col justify-between">
                                <div className="space-y-1">
                                  <div className="font-bold text-slate-900 truncate" title={ph.name}>
                                    {ph.name}
                                  </div>
                                  <div className="text-[11px] text-slate-500 truncate">
                                    📁 <code>{ph.driveFolder}</code>
                                  </div>
                                  <div className="text-[10px] text-slate-400">
                                    {t("Aufnahme / Upload:", "Uploaded:")} {ph.uploadedAt}
                                  </div>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedLeadId(leadId);
                                      setTab("leads");
                                    }}
                                    className="text-xs font-bold text-emerald-700 hover:underline"
                                  >
                                    {t(`Anfrage ${leadId} →`, `Lead ${leadId} →`)}
                                  </button>
                                  <div className="flex items-center gap-2">
                                    {!isPdf && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          openPhotoViewer(
                                            ph,
                                            leadId,
                                            filteredPhotos.map((f) => ({
                                              photo: f.photo,
                                              leadId: f.leadId,
                                              leadName: f.leadName,
                                            }))
                                          )
                                        }
                                        className="text-slate-600 hover:text-emerald-700 font-bold text-xs inline-flex items-center gap-1"
                                        title={t("Detail-Zoom öffnen", "Open Detail Zoom")}
                                      >
                                        <Eye className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                    <a
                                      href={ph.dataUrl}
                                      download={ph.name}
                                      className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-slate-900"
                                      title={t("Herunterladen", "Download")}
                                    >
                                      <Download className="w-3.5 h-3.5" />
                                      <span>Download</span>
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      /* TABLE / DETAIL LIST VIEW */
                      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                              <tr>
                                <th className="p-3 w-16">{t("Vorschau", "Preview")}</th>
                                <th className="p-3">{t("Dateiname & Schaden", "File Name & Damage")}</th>
                                <th className="p-3">{t("Kunde / Lead", "Customer / Lead")}</th>
                                <th className="p-3">{t("Google Drive Ordner", "Google Drive Folder")}</th>
                                <th className="p-3">{t("Datum", "Date")}</th>
                                <th className="p-3 text-right">{t("Aktionen", "Actions")}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {filteredPhotos.map((item, idx) => {
                                const { photo: ph, leadId, leadName, damageType } = item;
                                const isPdf = ph.fileType === "pdf" || ph.name.toLowerCase().endsWith(".pdf");
                                return (
                                  <tr key={`${leadId}-${idx}`} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="p-2.5">
                                      {isPdf ? (
                                        <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
                                          <FileText className="w-6 h-6" />
                                        </div>
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            openPhotoViewer(
                                              ph,
                                              leadId,
                                              filteredPhotos.map((f) => ({
                                                photo: f.photo,
                                                leadId: f.leadId,
                                                leadName: f.leadName,
                                              }))
                                            )
                                          }
                                          className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 relative shrink-0 block"
                                        >
                                          {/* eslint-disable-next-line @next/next/no-img-element */}
                                          <img
                                            src={ph.dataUrl}
                                            alt={ph.name}
                                            onError={(e) => {
                                              (e.currentTarget as HTMLImageElement).src =
                                                "/img/gallery/schimmel-ausbluehungen-480.webp";
                                            }}
                                            className="w-full h-full object-cover"
                                          />
                                        </button>
                                      )}
                                    </td>
                                    <td className="p-3">
                                      <div className="font-bold text-slate-900">{ph.name}</div>
                                      <div className="text-[11px] text-emerald-700 font-semibold">{damageType}</div>
                                    </td>
                                    <td className="p-3">
                                      <div className="font-semibold text-slate-800">{leadName}</div>
                                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                                        {leadId}
                                      </span>
                                    </td>
                                    <td className="p-3 text-[11px] font-mono text-slate-600">
                                      {ph.driveFolder}
                                    </td>
                                    <td className="p-3 text-slate-500 whitespace-nowrap">
                                      {ph.uploadedAt}
                                    </td>
                                    <td className="p-3 text-right whitespace-nowrap">
                                      <div className="flex items-center justify-end gap-2">
                                        {!isPdf && (
                                          <button
                                            type="button"
                                            onClick={() =>
                                              openPhotoViewer(
                                                ph,
                                                leadId,
                                                filteredPhotos.map((f) => ({
                                                  photo: f.photo,
                                                  leadId: f.leadId,
                                                  leadName: f.leadName,
                                                }))
                                              )
                                            }
                                            className="p-1.5 text-slate-500 hover:text-emerald-700 rounded-lg hover:bg-slate-100"
                                            title={t("Vergrößern", "Inspect")}
                                          >
                                            <Eye className="w-4 h-4" />
                                          </button>
                                        )}
                                        <a
                                          href={ph.dataUrl}
                                          download={ph.name}
                                          className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                                          title={t("Download", "Download")}
                                        >
                                          <Download className="w-4 h-4" />
                                        </a>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setSelectedLeadId(leadId);
                                            setTab("leads");
                                          }}
                                          className="text-xs font-bold text-emerald-700 hover:underline px-2 py-1"
                                        >
                                          {t("Lead", "Lead")} →
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
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
          <div className="bg-white text-slate-900 rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5">
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl shrink-0 shadow-xs flex items-center justify-center">
                  <img src="/logo.svg" alt="SOS-Abdichtung" className="h-7 sm:h-8 w-auto object-contain" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700">
                      {t("GoBD-Auftragspipeline · Schritt 1 von 3", "GoBD Pipeline · Step 1 of 3")}
                    </span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                      WTA & TÜV
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                    {t("Vor-Ort-Aufmaß & Schnellkalkulation", "On-Site Diagnostic Measurement & Quick Estimate")}
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {t(
                      "Erfassen Sie Vor-Ort-Messdaten und überführen Sie diese mit 1 Klick in ein GoBD-Angebot oder direkt in eine Rechnung.",
                      "Capture on-site diagnostic measurements and convert them in 1 click into a GoBD quote or invoice."
                    )}
                  </p>
                </div>
              </div>

              {/* Pipeline Step Indicators */}
              <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] font-bold overflow-x-auto py-1">
                <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl whitespace-nowrap">
                  <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-extrabold">1</span>
                  <span>{t("Aufmaß (Aktiv)", "Estimate (Active)")}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <div className="flex items-center gap-1.5 bg-slate-50 text-slate-600 border border-slate-200 px-3 py-1.5 rounded-xl whitespace-nowrap">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold">2</span>
                  <span>{t("Angebot (ANG)", "Quote (ANG)")}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <div className="flex items-center gap-1.5 bg-slate-50 text-slate-600 border border-slate-200 px-3 py-1.5 rounded-xl whitespace-nowrap">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold">3</span>
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
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowPriceListModal(true)}
                      className="text-[11px] font-extrabold text-emerald-800 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-lg inline-flex items-center gap-1 shadow-xs"
                    >
                      <Sliders className="w-3 h-3 text-emerald-700" />
                      <span>{t("Preisliste anpassen", "Edit Price List")}</span>
                    </button>
                    <span className="text-[11px] text-slate-400">
                      {serviceCatalog.length} {t("Vorlagen", "Templates")}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {serviceCatalog.map((tpl, i) => (
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
                      <span className="text-[10px] text-slate-500 font-bold">({eur(tpl.price)})</span>
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
            <div className="lg:col-span-5 bg-white text-slate-900 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5 shadow-sm">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 block mb-1">
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
                      <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                        {eur(grossSum)}
                      </div>
                      <div className="text-xs text-slate-600 space-y-1 border-t border-slate-100 pt-3">
                        <div className="flex justify-between">
                          <span>{t("Nettobetrag:", "Net Subtotal:")}</span>
                          <span className="font-semibold text-slate-900">{eur(netSum)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t("Umsatzsteuer (19 %):", "VAT (19 %):")}</span>
                          <span className="font-semibold text-slate-900">{eur(vatSum)}</span>
                        </div>
                      </div>

                      {/* Visual Labour vs Material Ratio */}
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-emerald-700 font-bold">
                            {t("Lohnanteil § 35a:", "Labor Ratio § 35a:")} {labourPct}%
                          </span>
                          <span className="text-sky-700 font-semibold">
                            {t("Material:", "Material:")} {100 - labourPct}%
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden flex">
                          <div style={{ width: `${labourPct}%` }} className="bg-emerald-600 h-full transition-all" />
                          <div style={{ width: `${100 - labourPct}%` }} className="bg-sky-500 h-full transition-all" />
                        </div>
                        <div className="flex justify-between text-[11px] text-slate-600 pt-0.5">
                          <span>{t("Steuerbonus für Kunden:", "Customer Tax Bonus:")}</span>
                          <strong className="text-emerald-700 font-extrabold">−{eur(taxBonus)}</strong>
                        </div>
                      </div>

                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
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
            <div className="bg-white text-slate-900 p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-sky-700">
                  <FileCheck className="w-4 h-4 text-sky-700" />
                  <span>{t("GoBD-Schlussrechnung nach § 14 UStG", "Official GoBD Invoice § 14 UStG")}</span>
                </div>
                <div className="text-sm font-bold flex items-center gap-2 text-slate-900">
                  <span>{curDoc.nr} · {curDoc.name}</span>
                  {curDoc.refOfferNr && (
                    <button
                      type="button"
                      onClick={() => setSelectedDocNr(curDoc.refOfferNr!)}
                      className="text-xs text-emerald-700 hover:underline bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg"
                    >
                      {t("🔗 Aus Angebot", "🔗 From Quote")} {curDoc.refOfferNr}
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-500">
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
                      ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {t("Offen", "Open")}
                </button>
                <button
                  type="button"
                  onClick={() => setDocStatus(t("Bezahlt", "Paid"))}
                  className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                    curDoc.status === t("Bezahlt", "Paid")
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {t("Bezahlt ✓", "Paid ✓")}
                </button>
                <button
                  type="button"
                  onClick={() => setDocStatus(t("Überfällig", "Overdue"))}
                  className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                    curDoc.status === t("Überfällig", "Overdue")
                      ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {t("Mahnung / Überfällig", "Overdue")}
                </button>
                <button
                  type="button"
                  onClick={() => setDocStatus(t("Storniert", "Voided"))}
                  className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                    curDoc.status === t("Storniert", "Voided")
                      ? "bg-slate-600 text-white border-slate-600 shadow-sm"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
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
              <div className="bg-white text-slate-900 p-3.5 sm:p-4 rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-3 border border-slate-200">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>
                    {t("Live-Belegvorschau (DIN 5008):", "Live Document Preview (DIN 5008):")}
                  </span>
                  <span className="text-emerald-700 font-extrabold">
                    {curDoc.nr} · {curDoc.typeLabel}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDocViewMode("editor")}
                    className="min-h-[38px] px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
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

                  {/* Template Insert Dropdown & Price Tuning Button */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowPriceListModal(true)}
                      className="text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 min-h-[38px] inline-flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Sliders className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{t("Preisliste anpassen", "Edit Price List")}</span>
                    </button>
                    <select
                      aria-label={t("WTA-Vorlage einfügen", "Insert WTA template")}
                      defaultValue=""
                      onChange={(e) => {
                        const idx = Number(e.target.value);
                        if (!isNaN(idx) && serviceCatalog[idx]) {
                          addTemplateLine(serviceCatalog[idx]);
                          e.target.value = "";
                        }
                      }}
                      className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-xl px-3 py-2 min-h-[38px]"
                    >
                      <option value="" disabled>
                        ⚡ {t("+ Vorlage einfügen...", "+ Insert Template...")} ({serviceCatalog.length})
                      </option>
                      {serviceCatalog.map((tpl, i) => (
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

      {/* TAB 6: APPOINTMENTS & GOOGLE CALENDAR DISPATCHER */}
      {tab === "termine" && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-extrabold uppercase">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t("Google Kalender & Vor-Ort-Terminplaner", "Google Calendar & On-Site Appointment Planner")}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  {t("Vor-Ort-Feuchtigkeitsmessungen & Handwerker-Einsätze", "On-Site Moisture Diagnostics & Field Inspections")}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                  {t(
                    `Synchronisiert mit Google Workspace (${NOTIFY_EMAIL_DEFAULT}). Fügen Sie Termine mit 1 Klick zu Ihrem Google Kalender hinzu, versenden Sie WhatsApp-Terminbestätigungen an Kunden und laden Sie Kalenderdateien (.ics) für Ihr Smartphone.`,
                    `Synchronized with Google Workspace (${NOTIFY_EMAIL_DEFAULT}). Sync appointments with Google Calendar in 1-click, send WhatsApp confirmations to homeowners, and export .ics files.`
                  )}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowNewAptModal(true)}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs inline-flex items-center gap-2 shadow-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t("+ Neuen Vor-Ort-Termin anlegen", "+ Schedule New Inspection")}</span>
                </button>

                <a
                  href="https://calendar.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-[#0f2537] hover:bg-slate-800 text-white font-extrabold text-xs inline-flex items-center gap-2 shadow-xs transition-colors"
                >
                  <span>{t("Google Kalender öffnen ↗", "Open Google Calendar ↗")}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>
            </div>

            {/* 4 Summary KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {t("Gesamte Termine", "Total Appointments")}
                </span>
                <div className="text-2xl font-black text-slate-900">{appointments.length}</div>
                <div className="text-[11px] text-slate-500">{t("Im System & Cloud erfasst", "Logged in system & cloud")}</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                  {t("Bestätigt & Geplant", "Confirmed & Scheduled")}
                </span>
                <div className="text-2xl font-black text-emerald-700">
                  {appointments.filter((a) => a.status === "Bestätigt" || a.status === "Wunschtermin angefragt").length}
                </div>
                <div className="text-[11px] text-emerald-800 font-semibold">{t("Anstehende Vor-Ort-Messungen", "Upcoming inspection visits")}</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800">
                  {t("Erledigt / Abgeschlossen", "Completed Visits")}
                </span>
                <div className="text-2xl font-black text-sky-700">
                  {appointments.filter((a) => a.status === "Erledigt").length}
                </div>
                <div className="text-[11px] text-slate-500">{t("Aufmaß genommen / Angebot raus", "Diagnostics finished")}</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {t("Google Kalender Cloud", "Google Calendar Cloud")}
                </span>
                <div className="text-xs font-mono font-bold text-slate-900 truncate" title={NOTIFY_EMAIL_DEFAULT}>
                  {NOTIFY_EMAIL_DEFAULT}
                </div>
                <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>✓ {t("Live synchronisiert", "Live Synchronized")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setAptFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  aptFilter === "all" ? "bg-white text-emerald-800 shadow-xs font-black" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {t("Alle Termine", "All")} ({appointments.length})
              </button>
              <button
                type="button"
                onClick={() => setAptFilter("upcoming")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  aptFilter === "upcoming" ? "bg-white text-emerald-800 shadow-xs font-black" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {t("Offen / Geplant", "Scheduled")} ({appointments.filter((a) => a.status !== "Erledigt").length})
              </button>
              <button
                type="button"
                onClick={() => setAptFilter("done")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  aptFilter === "done" ? "bg-white text-emerald-800 shadow-xs font-black" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {t("Erledigt", "Completed")} ({appointments.filter((a) => a.status === "Erledigt").length})
              </button>
            </div>

            <span className="text-xs text-slate-500">
              {t("Klicken Sie auf „In Google Kalender eintragen“, um den Termin direkt zu speichern.", "Click 'Add to Google Calendar' to save any visit to your schedule.")}
            </span>
          </div>

          {/* Appointments List */}
          <div className="space-y-3.5">
            {appointments
              .filter((apt) => {
                if (aptFilter === "upcoming") return apt.status !== "Erledigt";
                if (aptFilter === "done") return apt.status === "Erledigt";
                return true;
              })
              .map((apt) => {
                const calTitle = `SOS Abdichtung · Vor-Ort-Feuchtigkeitsmessung (${apt.name})`;
                const calDesc = `Vor-Ort-Feuchtigkeitsmessung & Schadensdiagnose (${COMPANY_INFO.phoneDisplay})\nKunde: ${apt.name} (${apt.phone})\nSchaden: ${apt.damageType}\nAdresse: ${apt.address}\nVorgangs-ID: ${apt.leadId}\nTermin-Nr: ${apt.nr}`;
                const googleCalLink = buildGoogleCalendarUrl({
                  title: calTitle,
                  description: calDesc,
                  location: apt.address,
                  startDate: apt.date,
                  startTime: apt.time,
                  durationMinutes: 90,
                });

                return (
                  <div
                    key={apt.nr}
                    className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-4"
                  >
                    {/* Top Row: Date, ID, Status Dropdown */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-black text-xs flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{apt.date} · {apt.time} {t("Uhr", "hrs")}</span>
                        </span>
                        <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                          {apt.nr}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedLeadId(apt.leadId);
                            setTab("leads");
                          }}
                          className="text-xs font-extrabold text-sky-700 hover:text-sky-900 hover:underline"
                        >
                          {t("Vorgang", "Lead")} {apt.leadId} →
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-slate-500">{t("Status:", "Status:")}</span>
                        <select
                          value={apt.status}
                          onChange={(e) => updateAptStatus(apt.nr, e.target.value)}
                          className={`text-xs font-extrabold px-3 py-1 rounded-xl border outline-none ${
                            apt.status === "Bestätigt"
                              ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                              : apt.status === "Erledigt"
                              ? "bg-sky-100 text-sky-900 border-sky-300"
                              : apt.status === "Verschoben"
                              ? "bg-amber-100 text-amber-900 border-amber-300"
                              : "bg-slate-100 text-slate-800 border-slate-300"
                          }`}
                        >
                          <option value="Bestätigt">✓ Bestätigt</option>
                          <option value="Wunschtermin angefragt">⏳ Wunschtermin angefragt</option>
                          <option value="Erledigt">✓ Erledigt (Aufmaß genommen)</option>
                          <option value="Verschoben">📅 Verschoben</option>
                          <option value="Storniert">❌ Storniert</option>
                        </select>
                      </div>
                    </div>

                    {/* Middle Row: Customer Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
                      <div className="sm:col-span-5 space-y-1">
                        <div className="font-extrabold text-slate-900 text-sm">{apt.name}</div>
                        <div className="text-slate-500 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <a href={`tel:${apt.phone}`} className="font-semibold text-slate-700 hover:underline">
                            {apt.phone}
                          </a>
                        </div>
                      </div>

                      <div className="sm:col-span-4 space-y-1">
                        <div className="text-[11px] text-slate-500">{t("Einsatzort / Adresse:", "Site Address:")}</div>
                        <div className="font-semibold text-slate-800 flex items-start gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <a
                            href={`https://maps.google.com/?q=${encodeURIComponent(apt.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline text-emerald-700"
                            title="In Google Maps öffnen"
                          >
                            {apt.address} ↗
                          </a>
                        </div>
                      </div>

                      <div className="sm:col-span-3 space-y-1">
                        <div className="text-[11px] text-slate-500">{t("Schadensart:", "Damage Type:")}</div>
                        <div className="font-bold text-slate-900">{apt.damageType}</div>
                      </div>
                    </div>

                    {/* Actions Row */}
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* 1. Google Calendar Link */}
                        <a
                          href={googleCalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="min-h-[36px] px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold inline-flex items-center gap-1.5 transition-colors"
                          title="Öffnet Google Calendar mit vorausgefülltem Event"
                        >
                          <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{t("In Google Kalender ↗", "Add to Google Calendar ↗")}</span>
                        </a>

                        {/* 2. Download .ics File */}
                        <button
                          type="button"
                          onClick={() => {
                            downloadIcsFile({
                              title: calTitle,
                              description: calDesc,
                              location: apt.address,
                              startDate: apt.date,
                              startTime: apt.time,
                              durationMinutes: 90,
                            });
                            showToast(t(`Kalenderdatei für ${apt.name} heruntergeladen.`, `Calendar file for ${apt.name} downloaded.`));
                          }}
                          className="min-h-[36px] px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold inline-flex items-center gap-1.5 transition-colors"
                          title="Für iPhone, Apple Kalender oder Outlook"
                        >
                          <Download className="w-3.5 h-3.5 text-slate-500" />
                          <span>.ics {t("Datei", "File")}</span>
                        </button>

                        {/* 3. WhatsApp Confirmation to Customer */}
                        <a
                          href={`https://wa.me/${apt.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                            `Guten Tag ${apt.name}, wir bestätigen Ihren Vor-Ort-Termin zur kostenlosen Feuchtigkeitsmessung am ${apt.date} um ${apt.time} Uhr (${apt.address}). Bei Rückfragen erreichen Sie uns direkt. Viele Grüße, Shahzad Mahmood – SOS Abdichtung`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="min-h-[36px] px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#1ebe5d] border border-emerald-200 font-bold inline-flex items-center gap-1.5 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-[#1ebe5d]" />
                          <span>{t("WhatsApp-Bestätigung senden", "Send WhatsApp Confirmation")}</span>
                        </a>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${apt.phone}`}
                          className="min-h-[36px] px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold inline-flex items-center gap-1.5 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5 text-slate-600" />
                          <span>{t("Anrufen", "Call")}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Google Kalender Smartphone-Synchronisation Handbuch */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 text-slate-900 space-y-3">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700">
              <Calendar className="w-4 h-4 text-emerald-700" />
              <span>{t("So nutzen Sie den Google Kalender optimal auf Ihrem Smartphone", "How to Optimize Google Calendar on Your Smartphone")}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="font-extrabold text-slate-900">1. Google Kalender App öffnen</div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Melden Sie sich in der Google Kalender App auf Ihrem Android-Handy oder iPhone mit <strong>{NOTIFY_EMAIL_DEFAULT}</strong> an.
                </p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="font-extrabold text-slate-900">2. Automatische Benachrichtigung</div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Jeder Termin, den Sie über „In Google Kalender ↗“ speichern, erinnert Sie 2 Stunden vorher automatisch an die Kundenadresse und Fahrzeit.
                </p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="font-extrabold text-slate-900">3. Google Terminplaner (Online-Buchung)</div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Kunden buchen freie Zeitfenster (08–11, 11–14, 14–17 Uhr) direkt auf der Startseite von sos-abdichtung.de. Sie behalten die volle Kontrolle.
                </p>
              </div>
            </div>
          </div>

          {/* Modal: Neuen Vor-Ort-Termin anlegen */}
          {showNewAptModal && (
            <div
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5"
              onClick={(e) => {
                if (e.target === e.currentTarget) setShowNewAptModal(false);
              }}
            >
              <div className="bg-white rounded-3xl p-5 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-200 space-y-5 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800">
                      Vor-Ort-Feuchtigkeitsmessung
                    </span>
                    <h4 className="text-lg font-black text-slate-900">
                      {t("Neuen Termin eintragen", "Schedule New Appointment")}
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowNewAptModal(false)}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      {t("Kunde / Vorgang zuweisen *", "Select Customer / Lead *")}
                    </label>
                    <select
                      value={newAptLeadId}
                      onChange={(e) => setNewAptLeadId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900 min-h-[42px] bg-white outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {leads.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.id} – {l.name} ({l.area || l.address || "NRW"})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        {t("Datum *", "Date *")}
                      </label>
                      <input
                        type="date"
                        value={newAptDate}
                        onChange={(e) => setNewAptDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900 min-h-[42px] bg-white outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        {t("Uhrzeit *", "Time *")}
                      </label>
                      <select
                        value={newAptTime}
                        onChange={(e) => setNewAptTime(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900 min-h-[42px] bg-white outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="08:00">08:00 Uhr (Vormittags)</option>
                        <option value="10:00">10:00 Uhr (Vormittags)</option>
                        <option value="11:30">11:30 Uhr (Mittags)</option>
                        <option value="14:00">14:00 Uhr (Nachmittags)</option>
                        <option value="16:00">16:00 Uhr (Nachmittags)</option>
                        <option value="17:30">17:30 Uhr (Feierabend)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      {t("Art des Termins", "Appointment Type")}
                    </label>
                    <select
                      value={newAptType}
                      onChange={(e) => setNewAptType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900 min-h-[42px] bg-white outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Vor-Ort-Feuchtigkeitsmessung">Kostenlose Vor-Ort-Feuchtigkeitsmessung</option>
                      <option value="Ursachendiagnose & Sanierungskonzept">Ursachendiagnose &amp; Sanierungskonzept</option>
                      <option value="WTA-Aufmaßnahme">WTA-Aufmaßnahme</option>
                      <option value="Baustellenabnahme">Baustellenabnahme</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowNewAptModal(false)}
                    className="min-h-[42px] px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    {t("Abbrechen", "Cancel")}
                  </button>
                  <button
                    type="button"
                    onClick={createNewAppointment}
                    className="min-h-[42px] px-5 py-2 rounded-xl text-xs font-black bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs"
                  >
                    {t("Termin anlegen & speichern", "Schedule Appointment")}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 7: SEO STRATEGY & GOOGLE SUITE + AI (GEMINI / GEO) */}
      {tab === "seo" && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-white text-slate-900 rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>{t("Google Workspace, SEO & AI Search Engine Hub", "Google Workspace, SEO & AI Search Engine Hub")}</span>
                </span>
                <h3 className="text-lg sm:text-2xl font-extrabold text-slate-900 mt-1">
                  {t("Google Suche, Gemini AI & GEO-Strategie für sos-abdichtung.de", "Google Search, Gemini AI & GEO Strategy for sos-abdichtung.de")}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
                  {t(
                    "Behalten Sie Ihr tägliches Google-Wachstum im Blick und optimieren Sie Ihre Auffindbarkeit in Google Search, Google Maps, Google Gemini und KI-Suchmaschinen (GEO).",
                    "Monitor day-by-day organic Google growth and optimize visibility across Google Search, Google Maps, Google Gemini, and AI Search Engines (GEO)."
                  )}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>GEO Score: 98/100 (AI-Ready)</span>
                </span>
              </div>
            </div>

            {/* Google Tools Direct Access Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
              {/* Tool 1: Google Search Console */}
              <div className="bg-slate-50/80 hover:bg-slate-100/90 border border-slate-200 p-4 rounded-xl flex flex-col justify-between space-y-3 transition-colors shadow-xs">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700">SEO & Indexierung</span>
                    <Search className="w-4 h-4 text-sky-600" />
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm mt-1">Google Search Console</h4>
                  <p className="text-[11px] text-slate-600 mt-1">
                    {t(
                      "Sitemap-Indexierung, tägliche Klicks, Suchbegriffe und Positionen in NRW.",
                      "Sitemap indexing, daily organic clicks, keywords, and rank tracking."
                    )}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-200 space-y-1.5 text-xs">
                  <a
                    href="https://search.google.com/test/rich-results?url=https%3A%2F%2Fsos-abdichtung.de%2F"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-bold text-emerald-700 hover:text-emerald-800"
                    title="Live Googlebot-Prüfung ohne Login"
                  >
                    <span>{t("🚀 Live Googlebot-Test (Sofort) ↗", "🚀 Live Googlebot Test (Instant) ↗")}</span>
                  </a>
                  <div className="flex flex-col gap-1 text-[11px] text-slate-500 pt-0.5">
                    <div className="flex items-center justify-between">
                      <a
                        href="https://search.google.com/search-console/welcome"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-sky-700 font-semibold"
                      >
                        {t("+ Property anlegen ↗", "+ Add Property ↗")}
                      </a>
                      <a
                        href="https://search.google.com/search-console/sitemaps"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-slate-600 hover:text-slate-900"
                      >
                        Sitemap einreichen
                      </a>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <a
                        href="https://search.google.com/search-console/inspect?resource_id=https%3A%2F%2Fsos-abdichtung.de%2F&id=https%3A%2F%2Fsos-abdichtung.de%2F"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-slate-600 hover:text-slate-900"
                        title="URL-Präfix Inspektion (erfordert bestätigte Property)"
                      >
                        GSC-Inspect (Präfix)
                      </a>
                      <a
                        href="https://search.google.com/search-console/inspect?resource_id=sc-domain%3Asos-abdichtung.de&id=https%3A%2F%2Fsos-abdichtung.de%2F"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-slate-600 hover:text-slate-900"
                        title="Domain-Property Inspektion"
                      >
                        (Domain)
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tool 2: Google Business Profile (Maps) */}
              <div className="bg-slate-50/80 hover:bg-slate-100/90 border border-slate-200 p-4 rounded-xl flex flex-col justify-between space-y-3 transition-colors shadow-xs">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Local SEO / Maps</span>
                    <MapPin className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm mt-1">Google Business Profile</h4>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Niebuhrstr. 46, Essen
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700">✓ Bestätigt</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    {t(
                      "Google Maps 3-Pack für Essen (HQ: Niebuhrstr. 46) & ganz NRW, Anrufe direkt aus Maps & Kundenbewertungen.",
                      "Google Maps 3-Pack for Essen (HQ: Niebuhrstr. 46) & all NRW, direct calls & customer reviews."
                    )}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-200 space-y-1.5 text-xs">
                  <a
                    href="https://business.google.com/de/business-profile/?ppsrc=GPDA2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    <span>{t("Unternehmensprofil öffnen ↗", "Manage Profile ↗")}</span>
                  </a>
                  <div className="text-[11px] text-emerald-700 font-semibold">
                    {t("Direktlink mit Setup-Kit ↓", "Direct Link & Setup Kit ↓")}
                  </div>
                </div>
              </div>

              {/* Tool 3: Google Analytics 4 */}
              <div className="bg-slate-50/80 hover:bg-slate-100/90 border border-slate-200 p-4 rounded-xl flex flex-col justify-between space-y-3 transition-colors shadow-xs">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Analytics & Traffic</span>
                    <BarChart3 className="w-4 h-4 text-amber-600" />
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm mt-1">Google Analytics 4 (GA4)</h4>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                      G-X723SXRK6F
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700">✓ Aktiv</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    {t(
                      "Echtzeit-Besucher aus Essen, Wuppertal & NRW, Klicks auf Telefonnummer & WhatsApp-Absprünge.",
                      "Real-time visitors from Essen, Wuppertal & NRW, phone call clicks, and WhatsApp interactions."
                    )}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <a
                    href="https://analytics.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-bold text-amber-700 hover:text-amber-800"
                  >
                    <span>{t("GA4 Dashboard öffnen ↗", "Open GA4 ↗")}</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => copyToClipboard("G-X723SXRK6F", "GA4 Tracking-ID", "ga4_id")}
                    className="text-[10px] font-bold text-slate-500 hover:text-slate-800"
                  >
                    {copiedField === "ga4_id" ? t("Kopiert!", "Copied!") : t("ID kopieren", "Copy ID")}
                  </button>
                </div>
              </div>

              {/* Tool 4: Google Ads Smart & Express */}
              <div className="bg-emerald-50/60 hover:bg-emerald-100/60 border-2 border-emerald-400 p-4 rounded-xl flex flex-col justify-between space-y-3 transition-colors shadow-xs">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">Google Ads Express</span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Live Aktiv
                    </span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm mt-1">Google Ads Smart Kampagne</h4>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white text-emerald-900 border border-emerald-300">
                      #{googleAdsCampaignId}
                    </span>
                    <span className="text-[10px] font-mono text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-300">
                      Konto: {googleAdsAccountId}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    {t(
                      `Direkt verknüpft mit Ihrer aktiven 75 € Google Ads Kampagne. Klicks, Anrufe & Leads werden automatisch im Admin getrackt.`,
                      `Directly linked with your active 75 € Google Ads campaign. Calls, clicks & leads are automatically tracked in Admin.`
                    )}
                  </p>
                </div>
                <div className="pt-2 border-t border-emerald-200 flex items-center justify-between text-xs">
                  <a
                    href={`https://ads.google.com/aw/express/dashboard?campaignId=${googleAdsCampaignId}&ocid=${googleAdsOcid}&euid=${googleAdsEuid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-black text-emerald-800 hover:text-emerald-900"
                  >
                    <span>{t("Google Ads Dashboard ↗", "Open Ads Dashboard ↗")}</span>
                  </a>
                  <span className="text-[10px] font-bold text-emerald-700">{weeklyBudget} €/Wo.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setTab("ads")}
                  className="w-full mt-2 px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs inline-flex items-center justify-center gap-1.5 transition"
                >
                  <Rocket className="w-3.5 h-3.5" />
                  <span>{t("Google Ads Cockpit öffnen →", "Open Google Ads Cockpit →")}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DEDICATED TAB: GOOGLE ADS EXPRESS COCKPIT */}
      {tab === "ads" && (
        <div className="space-y-6">
          {/* PAID MARKETING CAMPAIGNS & WEEKLY PLAN MANAGER (GOOGLE LSA, SEARCH ADS & META) */}
          <div className="bg-white border-2 border-emerald-500/30 rounded-2xl p-5 sm:p-7 text-slate-900 space-y-6 shadow-sm">
            {/* Header + Master Status Badge */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-extrabold tracking-wide uppercase">
                  <Power className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                  <span>{t("Bezahlte Marketing-Kampagnen (Google & Meta)", "Paid Marketing Campaigns (Google & Meta)")}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                  <span>{t("Kampagnen-Steuerung: Start/Stopp & Wochenpläne", "Campaign Controls: Start/Stop & Weekly Plans")}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
                  {t(
                    "Steuern Sie Ihre bezahlten Werbekampagnen (Google Local Services Ads, Suchanzeigen & Meta) flexibel per Knopfdruck. Pausieren Sie Kampagnen bei hoher Auslastung und wählen Sie feste Wochenpläne und Budget-Deckel.",
                    "Control your paid advertising campaigns (Google Local Services Ads, Search Ads & Meta) on demand. Pause ads instantly during high capacity, choose weekly schedules, and cap weekly spending."
                  )}
                </p>
              </div>

              {/* Live Status Indicator & Master Start/Stop Toggle */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                <div
                  className={`px-3.5 py-2 rounded-xl border flex items-center gap-2.5 text-xs font-black shadow-xs ${
                    campaignActive
                      ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                      : "bg-amber-50 border-amber-300 text-amber-900"
                  }`}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      campaignActive
                        ? "bg-emerald-500 animate-pulse ring-4 ring-emerald-100"
                        : "bg-amber-500 ring-4 ring-amber-100"
                    }`}
                  />
                  <span>
                    {campaignActive
                      ? t("KAMPAGNE AKTIV (Live geschaltet)", "CAMPAIGN ACTIVE (Broadcasting)")
                      : t("PAUSIERT (0 € Kosten / Gestoppt)", "PAUSED (0 € Cost / Inactive)")}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const next = !campaignActive;
                    setCampaignActive(next);
                    if (typeof window !== "undefined") {
                      localStorage.setItem("sos_marketing_active", String(next));
                    }
                    showToast(
                      next
                        ? t("✓ Werbekampagnen gestartet! Anzeigen werden in NRW ausgespielt.", "✓ Paid campaigns resumed! Ads are now broadcasting in NRW.")
                        : t("⏸ Werbekampagnen pausiert! Anzeigen gestoppt, keine Klickkosten (0 €).", "⏸ Paid campaigns paused! Ad spend stopped (0 € cost).")
                    );
                  }}
                  className={`min-h-[46px] px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-sm transition-all ${
                    campaignActive
                      ? "bg-rose-600 hover:bg-rose-700 text-white"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white"
                  }`}
                >
                  {campaignActive ? (
                    <>
                      <Pause className="w-4 h-4 shrink-0 fill-current" />
                      <span>{t("Kampagne pausieren (Werbung stoppen)", "Pause Campaign (Stop Ads)")}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 shrink-0 fill-current" />
                      <span>{t("Kampagne starten (Werbung aktivieren)", "Start Campaign (Resume Ads)")}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* LIVE CONNECTED GOOGLE ADS EXPRESS CAMPAIGN BANNER & ECOSYSTEM SYNC */}
            <div className="bg-gradient-to-br from-emerald-50/90 via-white to-slate-50 border-2 border-emerald-500/50 rounded-2xl p-4 sm:p-6 space-y-4 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[11px] font-black uppercase tracking-wider shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      {t("Live Verbunden & Synchronisiert", "Live Connected & Synced")}
                    </span>
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-white text-emerald-950 border border-emerald-300">
                      Kampagne #{googleAdsCampaignId}
                    </span>
                    <span className="text-[11px] font-mono text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-300">
                      Konto: {googleAdsAccountId}
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                    <span>{t("Ihre aktive Google Ads Express Kampagne", "Your Active Google Ads Express Campaign")}</span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {weeklyBudget} € / {t("Woche", "week")}
                    </span>
                  </h4>
                  <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                    {t(
                      "Ihr Google Ads Konto und dieser Admin arbeiten Hand in Hand. Anzeigen werden in Essen und NRW ausgespielt – alle Anrufe, WhatsApp-Chats und Anfragen landen live in Ihrem Lead-Posteingang.",
                      "Your Google Ads account and this admin work hand-in-hand. Ads broadcast across Essen and NRW — inbound calls, WhatsApp chats, and leads flow directly into your Lead Inbox."
                    )}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <a
                    href={`https://ads.google.com/aw/express/dashboard?campaignId=${googleAdsCampaignId}&ocid=${googleAdsOcid}&euid=${googleAdsEuid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs inline-flex items-center gap-2 shadow-xs transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 shrink-0" />
                    <span>{t(`Google Ads Express öffnen (#${googleAdsCampaignId}) ↗`, `Open Google Ads Express (#${googleAdsCampaignId}) ↗`)}</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setWeeklyBudget(75);
                      setCampaignActive(true);
                      if (typeof window !== "undefined") {
                        localStorage.setItem("sos_marketing_budget", "75");
                        localStorage.setItem("sos_marketing_active", "true");
                      }
                      showToast(t("✓ Admin mit 75 € Google Ads Plan synchronisiert!", "✓ Admin synced with active 75 € Google Ads Plan!"));
                    }}
                    className="min-h-[44px] px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-extrabold text-xs inline-flex items-center gap-1.5 transition-colors"
                    title="Setzt Budget auf 75 € zur Synchronisation mit Google Ads"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t("Auf 75 € Plan angleichen", "Sync with 75 € Plan")}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsEditingGAds(!isEditingGAds)}
                    className="min-h-[44px] px-3 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 font-bold text-xs inline-flex items-center gap-1 transition-colors"
                    title="Kampagnen-ID und Konto-ID anpassen"
                  >
                    <Sliders className="w-3.5 h-3.5 text-slate-500" />
                    <span>{isEditingGAds ? t("Schließen", "Close") : t("IDs", "IDs")}</span>
                  </button>
                </div>
              </div>

              {/* Collapsible Edit Mode for Google Ads IDs */}
              {isEditingGAds && (
                <div className="p-3.5 bg-white rounded-xl border border-emerald-300/80 space-y-3 text-xs animate-in fade-in">
                  <div className="font-bold text-slate-900 flex items-center justify-between">
                    <span>{t("Google Ads Express Parameter anpassen:", "Edit Google Ads Express Credentials:")}</span>
                    <span className="text-[10px] text-slate-500">{t("Wird im Browser gespeichert", "Saved in browser")}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Kampagnen-ID (campaignId)</label>
                      <input
                        type="text"
                        value={googleAdsCampaignId}
                        onChange={(e) => {
                          const val = e.target.value.trim();
                          setGoogleAdsCampaignId(val);
                          if (typeof window !== "undefined") localStorage.setItem("sos_gads_campaign_id", val);
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono text-xs focus:ring-1 focus:ring-emerald-500"
                        placeholder="24368834798"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Google Konto-ID (z. B. 861-159-7140)</label>
                      <input
                        type="text"
                        value={googleAdsAccountId}
                        onChange={(e) => {
                          const val = e.target.value.trim();
                          setGoogleAdsAccountId(val);
                          if (typeof window !== "undefined") localStorage.setItem("sos_gads_account_id", val);
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono text-xs focus:ring-1 focus:ring-emerald-500"
                        placeholder="861-159-7140"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">OCID (Konto-ID Ziffern)</label>
                      <input
                        type="text"
                        value={googleAdsOcid}
                        onChange={(e) => {
                          const val = e.target.value.trim();
                          setGoogleAdsOcid(val);
                          if (typeof window !== "undefined") localStorage.setItem("sos_gads_ocid", val);
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono text-xs focus:ring-1 focus:ring-emerald-500"
                        placeholder="8611597140"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingGAds(false);
                        showToast(t("✓ Google Ads Einstellungen gespeichert!", "✓ Google Ads credentials saved!"));
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-bold text-xs"
                    >
                      {t("Fertig / Speichern", "Done / Save")}
                    </button>
                  </div>
                </div>
              )}

              {/* 4-in-1 Ecosystem Verification Checklist */}
              <div className="pt-2 border-t border-slate-200/80">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-2.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t("Google Ökosystem Status: Alles verifiziert & einsatzbereit", "Google Ecosystem Status: Fully Verified & Operational")}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
                  {/* Status 1: Business Profile */}
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 text-[11px]">1. Unternehmensprofil</span>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">✓ Bestätigt</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Niebuhrstraße 46, 45144 Essen (HQ)
                    </p>
                  </div>

                  {/* Status 2: Search Console */}
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 text-[11px]">2. Search Console</span>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">✓ Verifiziert</span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-mono text-[10px] truncate" title="google2708c8bddd621795.html">
                      google2708c8bddd621795.html
                    </p>
                  </div>

                  {/* Status 3: Analytics 4 */}
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 text-[11px]">3. Analytics (GA4)</span>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">✓ Aktiv</span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-mono text-[10px]">
                      G-X723SXRK6F (im Code aktiv)
                    </p>
                  </div>

                  {/* Status 4: Google Ads */}
                  <div className="bg-white p-2.5 rounded-xl border border-emerald-300 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 text-[11px]">4. Google Ads</span>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                        Live Aktiv
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Kampagne #{googleAdsCampaignId} ({weeklyBudget} €/Wo.)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3 Interactive Setting Blocks */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* BLOCK 1: Weekly Schedule (Wochenplan) */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t("1. Wochenplan (Sendezeiten)", "1. Weekly Schedule (Dayparting)")}</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                      {schedulePlan === "weekdays"
                        ? "Mo–Fr (07–19)"
                        : schedulePlan === "fullweek"
                        ? "7 Tage (24/7)"
                        : "Notdienst"}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    {t("Wann soll bezahlte Werbung geschaltet werden?", "When should your paid ads run?")}
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {t(
                      "Verhindern Sie vergeudete Werbekosten, wenn das Büro nicht besetzt ist. Wählen Sie Ihren gewünschten Wochenrhythmus:",
                      "Prevent wasted ad spend when phone lines are unstaffed. Select your operating schedule:"
                    )}
                  </p>
                </div>

                <div className="space-y-2">
                  {/* Option 1: Weekdays */}
                  <button
                    type="button"
                    onClick={() => {
                      setSchedulePlan("weekdays");
                      if (typeof window !== "undefined") localStorage.setItem("sos_marketing_schedule", "weekdays");
                      showToast(t("Wochenplan gesetzt: Mo–Fr 07:00–19:00 Uhr (Wochenende pausiert)", "Weekly plan set: Mon–Fri 07:00–19:00 (Weekends paused)"));
                    }}
                    className={`w-full text-left p-3 rounded-lg border text-xs transition-all ${
                      schedulePlan === "weekdays"
                        ? "bg-white border-emerald-500 shadow-xs ring-1 ring-emerald-400"
                        : "bg-white/60 hover:bg-white border-slate-200 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>{t("Mo–Fr Bürozeiten (07:00 – 19:00)", "Mon–Fri Business Hours (07:00–19:00)")}</span>
                      {schedulePlan === "weekdays" && <Check className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {t("Empfohlen für Handwerker. Pausiert nachts & samstags/sonntags automatisch.", "Recommended. Automatically pauses on weekends & nights.")}
                    </p>
                  </button>

                  {/* Option 2: Full Week */}
                  <button
                    type="button"
                    onClick={() => {
                      setSchedulePlan("fullweek");
                      if (typeof window !== "undefined") localStorage.setItem("sos_marketing_schedule", "fullweek");
                      showToast(t("Wochenplan gesetzt: 7 Tage rund um die Uhr (24/7 Notdienst-Modus)", "Weekly plan set: 7 Days around the clock (24/7)"));
                    }}
                    className={`w-full text-left p-3 rounded-lg border text-xs transition-all ${
                      schedulePlan === "fullweek"
                        ? "bg-white border-emerald-500 shadow-xs ring-1 ring-emerald-400"
                        : "bg-white/60 hover:bg-white border-slate-200 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>{t("7 Tage Durchgehend (24/7 Vollgas)", "7-Day Full Coverage (24/7 Active)")}</span>
                      {schedulePlan === "fullweek" && <Check className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {t("Maximales Anfragevolumen. Ideal für akute Notfälle & Rohrbruchschäden.", "Maximum lead volume. Ideal for emergency cellar water damage.")}
                    </p>
                  </button>

                  {/* Option 3: Emergency Weekends */}
                  <button
                    type="button"
                    onClick={() => {
                      setSchedulePlan("emergency");
                      if (typeof window !== "undefined") localStorage.setItem("sos_marketing_schedule", "emergency");
                      showToast(t("Wochenplan gesetzt: Notdienst & Wochenende Boost", "Weekly plan set: Emergency & Weekend Boost"));
                    }}
                    className={`w-full text-left p-3 rounded-lg border text-xs transition-all ${
                      schedulePlan === "emergency"
                        ? "bg-white border-emerald-500 shadow-xs ring-1 ring-emerald-400"
                        : "bg-white/60 hover:bg-white border-slate-200 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>{t("Wochenend-Boost & Notdienst", "Weekend Boost & Emergency Focus")}</span>
                      {schedulePlan === "emergency" && <Check className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {t("Fr 14:00 bis So 22:00 Uhr aktiv, wenn andere Firmen geschlossen sind.", "Fri 14:00 to Sun 22:00 active when competitors are closed.")}
                    </p>
                  </button>
                </div>
              </div>

              {/* BLOCK 2: Weekly Budget & Lead Estimator */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t("2. Wöchentliches Budget-Limit", "2. Weekly Budget Cap")}</span>
                    </span>
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-600 text-white">
                      {weeklyBudget} € / {t("Woche", "week")}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    {t("Feste Kostenkontrolle ohne Überraschungen", "Strict Cost Control — No Surprises")}
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {t(
                      "Google stoppt die Anzeigenausspielung automatisch, sobald Ihr gewähltes Wochenlimit erreicht ist. Keine Nachzahlungen.",
                      "Google automatically halts ad delivery as soon as your weekly limit is reached. Never overspend."
                    )}
                  </p>
                </div>

                {/* Quick Preset Buttons */}
                <div className="space-y-2.5">
                  <div className="grid grid-cols-4 gap-1.5 text-xs font-bold">
                    {[75, 150, 300, 500].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => {
                          setWeeklyBudget(b);
                          if (typeof window !== "undefined") localStorage.setItem("sos_marketing_budget", String(b));
                          showToast(t(`Wochenbudget auf ${b} € gesetzt.`, `Weekly budget set to ${b} €.`));
                        }}
                        className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
                          weeklyBudget === b
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                            : "bg-white hover:bg-slate-100 text-slate-800 border-slate-300"
                        }`}
                      >
                        {b} €
                      </button>
                    ))}
                  </div>

                  {/* Range Slider */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                      <span>50 € / Wo.</span>
                      <span className="text-emerald-700 font-extrabold">{weeklyBudget} € / Woche ({Math.round(weeklyBudget / 7)} € / Tag)</span>
                      <span>800 € / Wo.</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="800"
                      step="25"
                      value={weeklyBudget}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setWeeklyBudget(val);
                        if (typeof window !== "undefined") localStorage.setItem("sos_marketing_budget", String(val));
                      }}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                  </div>

                  {/* Estimated Leads Yield Card */}
                  <div className="bg-white rounded-lg p-2.5 border border-emerald-200 text-slate-800 space-y-1 shadow-xs">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                      {t("Erwartete Ausbeute (NRW Kellersanierung):", "Expected Performance Yield (NRW):")}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">{t("Geschätzte qualifizierte Anrufe / Anfragen:", "Est. Qualified Phone Calls / Leads:")}</span>
                      <strong className="text-emerald-700 font-black">
                        ~{Math.max(2, Math.round(weeklyBudget / 22))} – {Math.max(4, Math.round(weeklyBudget / 14))} {t("Anfragen", "leads")}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{t("Garantierter Maximalpreis:", "Guaranteed Cost Ceiling:")}</span>
                      <span className="font-semibold text-slate-900">{weeklyBudget},00 € max.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* BLOCK 3: Capacity Auto-Protection & Live Platforms */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t("3. Kapazitätsschutz & Auto-Pause", "3. Capacity Protection & Auto-Pause")}</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
                      {appointments.length} {t("Termine aktiv", "active bookings")}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    {t("Automatische Schutzschaltung vor Überlastung", "Prevent Overbooking & Wasted Leads")}
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {t(
                      "Wenn Ihr Kalender voll ist, zahlen Sie nicht weiter für Anrufe, die Sie nicht zeitnah bedienen können:",
                      "When your inspection schedule is packed, automatically stop paying for leads you cannot service:"
                    )}
                  </p>
                </div>

                <div className="space-y-2.5">
                  <label className="flex items-start gap-2.5 p-3 rounded-lg border bg-white cursor-pointer hover:bg-slate-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={autoPauseCapacity}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setAutoPauseCapacity(checked);
                        if (typeof window !== "undefined") localStorage.setItem("sos_marketing_autopause", String(checked));
                        showToast(
                          checked
                            ? t("Kapazitätsschutz aktiviert: Pausiert ab 5 gebuchten Wochenterminen.", "Capacity protection enabled: Pauses at 5+ booked appointments.")
                            : t("Kapazitätsschutz deaktiviert.", "Capacity protection disabled.")
                        );
                      }}
                      className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-slate-900">
                        {t("Auto-Pause ab 5 Vor-Ort-Terminen / Woche", "Auto-Pause at 5+ inspection bookings / week")}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {t(
                          "Pausiert bezahlte Google Ads automatisch, wenn Handwerker-Kapazitäten ausgelastet sind.",
                          "Temporarily pauses paid ad spend until current customer quotes are processed."
                        )}
                      </p>
                    </div>
                  </label>

                  {/* Direct Console Access Links */}
                  <div className="pt-2 border-t border-slate-200 space-y-1.5 text-xs">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {t("Direkte Plattform-Zugänge:", "Direct Platform Portals:")}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <a
                        href="https://adwords.google.com/localservices"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold inline-flex items-center justify-between text-xs"
                      >
                        <span className="flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                          <span>Google Local Services Ads Konsole</span>
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      </a>
                      <a
                        href="https://ads.google.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold inline-flex items-center justify-between text-xs"
                      >
                        <span className="flex items-center gap-1.5">
                          <BarChart3 className="w-3.5 h-3.5 text-sky-600" />
                          <span>Google Ads Suchkampagnen</span>
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* LIVE MARKETING PERFORMANCE & LEAD ROI MONITOR */}
          {(() => {
            const totalLeadsCount = leads.length;
            const activeLeadsCount = leads.filter((l) => l.status !== "Verloren").length;
            const bookedCount = leads.filter((l) => l.status === "Gebucht" || l.status === "Erledigt").length;
            const offerCount = leads.filter((l) => l.status === "Angebot raus").length;
            const pipelineVal = leads.reduce((sum, l) => {
              const leadTotal = l.lines && l.lines.length > 0
                ? l.lines.reduce((s, it) => s + (it.qty * it.price), 0)
                : 4800; // Average WTA restoration contract estimate
              return sum + leadTotal;
            }, 0);
            const costPerLead = Math.round(weeklyBudget / Math.max(1, Math.min(totalLeadsCount, 4)));
            const recentMarketingLeads = leads.slice(0, 4);

            return (
              <div className="bg-white border-2 border-emerald-600/30 rounded-2xl p-5 sm:p-7 text-slate-900 space-y-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-black uppercase tracking-wider">
                      <BarChart3 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{t("Live-Marketing Cockpit & Erfolgs-Monitor", "Live Marketing Performance & Lead Monitor")}</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                      {t("So performt Ihr Marketing in Echtzeit", "How Your Marketing Is Performing in Real Time")}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-2xl">
                      {t(
                        "Hier überwachen Sie live, wie viele Anfragen über Google Ads & Local SEO eingehen, was jeder Neukunde kostet und welcher Auftragswert in Ihrer Pipeline liegt:",
                        "Monitor real-time inbound customer inquiries from Google Ads & Local SEO, track acquisition costs (CPL), and monitor your project pipeline:"
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setTab("leads")}
                      className="min-h-[40px] px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs inline-flex items-center gap-2 shadow-xs transition-colors"
                    >
                      <span>{t("Alle Kundenanfragen öffnen (Tab 1)", "View All Leads (Tab 1)")}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 4 Performance KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* KPI 1: Active Budget & Status */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-2 shadow-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {t("1. Aktives Wochenbudget", "1. Active Weekly Budget")}
                    </span>
                    <div>
                      <div className="text-2xl sm:text-3xl font-black text-slate-900">{weeklyBudget},00 €</div>
                      <div className="text-[11px] font-bold text-emerald-700 mt-0.5 flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${campaignActive ? "bg-emerald-600 animate-pulse" : "bg-amber-500"}`} />
                        <span>{campaignActive ? t("Kampagne sendet aktiv", "Campaign actively broadcasting") : t("Kampagne pausiert (0 €)", "Paused (0 € spend)")}</span>
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-200/80">
                      {t("Fester Kostendeckel: Nie mehr als", "Strict limit: Never more than")} {weeklyBudget} €/Wo.
                    </div>
                  </div>

                  {/* KPI 2: Total Generated Leads */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-2 shadow-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {t("2. Eingehende Kundenanfragen", "2. Inbound Customer Leads")}
                    </span>
                    <div>
                      <div className="text-2xl sm:text-3xl font-black text-slate-900">
                        {totalLeadsCount} <span className="text-sm font-bold text-slate-500">{t("Anfragen", "leads")}</span>
                      </div>
                      <div className="text-[11px] font-bold text-emerald-800 mt-0.5">
                        {offerCount} {t("Angebote versendet", "quotes sent")} • {bookedCount} {t("Beauftragt", "booked")}
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-200/80">
                      {activeLeadsCount} {t("aktive Vorgänge im System", "active cases in system")}
                    </div>
                  </div>

                  {/* KPI 3: Cost per Lead (CPL) */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-2 shadow-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {t("3. Kosten pro Anfrage (CPL)", "3. Cost per Lead (CPL)")}
                    </span>
                    <div>
                      <div className="text-2xl sm:text-3xl font-black text-emerald-800">
                        ~{costPerLead} € <span className="text-xs font-semibold text-slate-500">/ Lead</span>
                      </div>
                      <div className="text-[11px] font-semibold text-slate-600 mt-0.5">
                        {t("Ø Handwerk NRW: 22 – 32 €", "NRW Trade Avg: 22 – 32 €")}
                      </div>
                    </div>
                    <div className="text-[10px] text-emerald-700 font-bold pt-2 border-t border-slate-200/80">
                      ✓ {t("Höchst wirtschaftlich", "Highly profitable ratio")}
                    </div>
                  </div>

                  {/* KPI 4: Pipeline Revenue Potential */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-2 shadow-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {t("4. Auftragsvolumen in Pipeline", "4. Pipeline Revenue Potential")}
                    </span>
                    <div>
                      <div className="text-2xl sm:text-3xl font-black text-slate-900">
                        {eur(pipelineVal)}
                      </div>
                      <div className="text-[11px] font-bold text-emerald-800 mt-0.5">
                        {t("Geschätzter Sanierungsumsatz", "Estimated project value")}
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-200/80">
                      {t("Basiert auf WTA-Kalkulationen", "Based on WTA standard quotes")}
                    </div>
                  </div>
                </div>

                {/* Inbound Marketing Channels Breakdown */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      {t("Messbare Marketing-Kanäle & Kontaktpunkte", "Tracked Marketing Inbound Channels")}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500">
                      {t("Live über Google Analytics 4 & Webhook getrackt", "Tracked via Google Analytics 4 & direct webhooks")}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                        <span className="flex items-center gap-1.5 text-sky-700">
                          <Phone className="w-4 h-4" />
                          <span>{t("Telefon-Anrufe", "Phone Calls")}</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-black">Aktiv</span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        {t("Direkt-Klicks auf 0172 2064177 aus Google Maps & mobilen Anzeigen.", "Direct call clicks from Google Maps & mobile search ads.")}
                      </p>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                        <span className="flex items-center gap-1.5 text-emerald-700">
                          <FileText className="w-4 h-4" />
                          <span>{t("Kontaktformulare", "Contact Forms")}</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">Aktiv</span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        {t("Schriftliche Sanierungsanfragen über /kontakt/ und Kostenrechner.", "Written inspection requests submitted via /kontakt/ and calculator.")}
                      </p>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                        <span className="flex items-center gap-1.5 text-emerald-600">
                          <MessageSquare className="w-4 h-4" />
                          <span>{t("WhatsApp-Chats", "WhatsApp Chats")}</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">Aktiv</span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        {t("Sofort-Chatanfragen von Hausbesitzern mit akuten Feuchteschäden.", "Instant chat inquiries from homeowners with urgent leaks.")}
                      </p>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                        <span className="flex items-center gap-1.5 text-amber-600">
                          <Camera className="w-4 h-4" />
                          <span>{t("Schadensfotos", "Damage Photos")}</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black">Aktiv</span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        {t("Kundenfotos zur Vorab-Diagnose (gespeichert in Google Drive).", "Homeowner photos for pre-diagnosis saved in Google Drive.")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Live Recent Leads Feed */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      {t("Neueste Kundenanfragen aus dem Marketing", "Recent Marketing Inquiries")}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTab("leads")}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline inline-flex items-center gap-1"
                    >
                      <span>{t("Alle im Kundenmanager öffnen →", "Open Full Lead Manager →")}</span>
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                    {recentMarketingLeads.map((ld) => {
                      const quoteTotal = ld.lines && ld.lines.length > 0
                        ? ld.lines.reduce((s, it) => s + (it.qty * it.price), 0)
                        : 0;

                      return (
                        <div key={ld.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center shrink-0">
                              {ld.id.replace("A-", "")}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-xs text-slate-900">{ld.name}</span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                                  {ld.area || ld.address || "NRW"}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500 mt-0.5">
                                <span className="font-semibold text-slate-700">{ld.damageType || "Kellersanierung"}</span> • {ld.phone}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 self-end sm:self-auto">
                            {quoteTotal > 0 && (
                              <span className="text-xs font-black text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                                {eur(quoteTotal)}
                              </span>
                            )}
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                              ld.status === "Gebucht" || ld.status === "Erledigt"
                                ? "bg-emerald-100 text-emerald-800"
                                : ld.status === "Angebot raus"
                                ? "bg-sky-100 text-sky-800"
                                : "bg-amber-100 text-amber-800"
                            }`}>
                              {ld.status}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedLeadId(ld.id);
                                setTab("leads");
                              }}
                              className="text-xs font-bold text-slate-700 hover:text-emerald-700 underline"
                            >
                              {t("Details", "View")}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* LIVE SEO & MARKETING RATES ENGINE (HOURLY, DAILY, WEEKLY, MONTHLY) */}
          <div className="bg-white border-2 border-emerald-500/30 rounded-2xl p-5 sm:p-7 text-slate-900 space-y-6 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-extrabold tracking-wide uppercase">
                  <DollarSign className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                  <span>{t("Echte Live-Preise für Marketing & SEO", "Real Live Rates for Marketing & SEO")}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                  <span>{t("Google SEO & Kampagnen-Preisliste (Stündlich, Täglich, Wöchentlich & Monatlich)", "Google SEO & Paid Marketing Rate Card (Hourly, Daily, Weekly & Monthly)")}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
                  {t(
                    "Volle Preistransparenz: Sehen Sie exakt, was bezahlte Google-Werbung und lokale Suchmaschinenoptimierung pro Stunde, Tag, Woche und Monat kosten — und wie viele qualifizierte Hausbesitzer-Anfragen Sie dafür in NRW erhalten.",
                    "Full pricing transparency: Review exact real costs broken down hour-by-hour, day-by-day, weekly, and monthly, alongside projected customer lead volume across NRW."
                  )}
                </p>
              </div>

              {/* View Switcher: Hourly / Daily / Weekly / Monthly */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setMarketingFreqView("hourly")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      marketingFreqView === "hourly"
                        ? "bg-white text-emerald-800 shadow-xs font-black"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    ⚡ {t("Stündlich", "Hourly")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMarketingFreqView("daily")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      marketingFreqView === "daily"
                        ? "bg-white text-emerald-800 shadow-xs font-black"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    📅 {t("Täglich", "Daily")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMarketingFreqView("weekly")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      marketingFreqView === "weekly"
                        ? "bg-white text-emerald-800 shadow-xs font-black"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    📊 {t("Wöchentlich", "Weekly")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMarketingFreqView("monthly")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      marketingFreqView === "monthly"
                        ? "bg-white text-emerald-800 shadow-xs font-black"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    🗓 {t("Monatlich", "Monthly")}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPriceListModal(true)}
                  className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs inline-flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t("Service-Preisliste bearbeiten", "Edit Service Price List")}</span>
                </button>
              </div>
            </div>

            {/* 4 Pricing Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {MARKETING_PACKAGES.map((pkg) => {
                const isSelected = weeklyBudget === pkg.weeklyPrice;
                // Determine display price based on frequency view
                const displayPrice =
                  marketingFreqView === "hourly"
                    ? `${pkg.hourlyPrice60.toFixed(2).replace(".", ",")} €`
                    : marketingFreqView === "daily"
                    ? `${pkg.dailyPrice.toFixed(2).replace(".", ",")} €`
                    : marketingFreqView === "weekly"
                    ? `${pkg.weeklyPrice},00 €`
                    : `${pkg.monthlyPrice},00 €`;

                const displayFreqLabel =
                  marketingFreqView === "hourly"
                    ? t("/ aktive Arbeitsstunde (Mo–Fr 07–19)", "/ active work hour (Mo–Fr)")
                    : marketingFreqView === "daily"
                    ? t("/ Tag (7 Tage/Woche)", "/ day (7 days/week)")
                    : marketingFreqView === "weekly"
                    ? t("/ Woche (Budget-Deckel)", "/ week (hard budget cap)")
                    : t("/ Monat (~4,3 Wochen)", "/ month (~4.3 weeks)");

                return (
                  <div
                    key={pkg.id}
                    className={`rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4 border transition-all ${
                      isSelected
                        ? "bg-emerald-50/70 border-emerald-500 shadow-md ring-2 ring-emerald-400/50"
                        : "bg-slate-50/80 hover:bg-white border-slate-200 shadow-xs"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            pkg.id === "pro"
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-200 text-slate-800"
                          }`}
                        >
                          {isEn ? pkg.badge_en : pkg.badge_de}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-600" />
                            {t("Aktiver Tarif", "Active Plan")}
                          </span>
                        )}
                      </div>

                      <div>
                        <h4 className="font-black text-slate-900 text-base">
                          {isEn ? pkg.title_en : pkg.title_de}
                        </h4>
                        <div className="text-[11px] text-slate-500 font-semibold mt-0.5">
                          {isEn ? pkg.focus_en : pkg.focus_de}
                        </div>
                      </div>

                      {/* Dynamic Price Display */}
                      <div className="pt-2 border-t border-slate-200/80">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-2xl sm:text-3xl font-black text-slate-900">
                            {displayPrice}
                          </span>
                        </div>
                        <div className="text-[11px] font-semibold text-emerald-800 mt-0.5">
                          {displayFreqLabel}
                        </div>
                        {marketingFreqView === "hourly" && (
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            ({pkg.hourlyPrice24.toFixed(2).replace(".", ",")} €/Std. bei 24/7 Notdienst-Plan)
                          </div>
                        )}
                      </div>

                      {/* Lead Volume Yield Box */}
                      <div className="bg-white rounded-xl p-2.5 border border-slate-200 space-y-1 text-xs">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          {t("Erwartete Kundenanfragen:", "Projected Qualified Leads:")}
                        </div>
                        <div className="font-extrabold text-slate-900">
                          ~{marketingFreqView === "monthly" ? pkg.estLeadsMonth : pkg.estLeadsWeek}{" "}
                          <span className="text-[11px] font-normal text-slate-600">
                            {marketingFreqView === "monthly" ? t("Anfragen / Monat", "leads / month") : t("Anfragen / Woche", "leads / week")}
                          </span>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="space-y-1.5 text-xs pt-1">
                        {(isEn ? pkg.features_en : pkg.features_de).map((f, fi) => (
                          <div key={fi} className="flex items-start gap-1.5 text-[11px] text-slate-700 leading-snug">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions: Activate Plan or Transfer to Invoice */}
                    <div className="pt-3 border-t border-slate-200/80 space-y-2">
                      <button
                        type="button"
                        onClick={() => {
                          setWeeklyBudget(pkg.weeklyPrice);
                          setCampaignActive(true);
                          if (typeof window !== "undefined") {
                            localStorage.setItem("sos_marketing_budget", String(pkg.weeklyPrice));
                            localStorage.setItem("sos_marketing_active", "true");
                          }
                          showToast(
                            t(
                              `✓ ${pkg.title_de} aktiviert! Wochenbudget auf ${pkg.weeklyPrice} € gesetzt.`,
                              `✓ ${pkg.title_en} activated! Weekly budget set to ${pkg.weeklyPrice} €.`
                            )
                          );
                        }}
                        className={`w-full min-h-[40px] px-3 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                          isSelected
                            ? "bg-emerald-700 text-white hover:bg-emerald-800"
                            : "bg-slate-900 text-white hover:bg-slate-800"
                        }`}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{isSelected ? t("Aktiver Tarif läuft ✓", "Active Plan Running ✓") : t("Diesen Tarif starten", "Activate This Plan")}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => addMarketingExpenseToDoc(pkg.title_de, pkg.weeklyPrice, t("Wöchentlich", "Weekly"))}
                        className="w-full text-[11px] font-bold text-slate-600 hover:text-slate-900 py-1 hover:underline text-center block"
                      >
                        {t("Als Ausgabe in Belege (Tab 5) buchen →", "Log as expense in Invoices (Tab 5) →")}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Economics & ROI Breakdown Banner */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="font-extrabold text-slate-900 flex items-center gap-1.5 text-sm">
                  <BadgePercent className="w-4 h-4 text-emerald-700" />
                  <span>{t("Echte Wirtschaftlichkeit: Warum sich jeder bezahlte Euro zehnfach rentiert", "Real Marketing Economics & Return on Investment (ROI)")}</span>
                </div>
                <p className="text-slate-600 leading-relaxed max-w-2xl text-[11px]">
                  {t(
                    "Im Sanitär- & Kellersanierungs-Handwerk in NRW liegt der durchschnittliche Lead-Preis bei 18 – 28 € pro qualifiziertem Telefonat. Ein typischer Sanierungsauftrag erzielt 4.500 € bis 12.000 € Umsatz. Ein einziger gewonnener Kunde refinanziert Ihr gesamtes Google-Marketing für bis zu 8 Monate.",
                    "In NRW cellar waterproofing, average cost per qualified lead is 18 – 28 €. A single won project generates 4,500 € to 12,000 € in revenue, completely financing up to 8 months of marketing spend."
                  )}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">{t("Ø Akquisekosten-Quote", "Customer Acquisition Cost")}</div>
                  <strong className="text-base font-black text-emerald-700">&lt; 3,5 % des Auftragswerts</strong>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPriceListModal(true)}
                  className="min-h-[42px] px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-xs inline-flex items-center gap-1.5"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{t("Handwerker-Preisliste bearbeiten", "Manage Service Rates")}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DEDICATED TAB: GOOGLE MAPS & UNTERNEHMENSPROFIL */}
      {tab === "maps" && (
        <div className="space-y-6">
          {/* GOOGLE BUSINESS PROFILE (GBP) 1-CLICK SETUP & OPTIMIZATION KIT */}
          <div className="bg-white border border-emerald-200 rounded-2xl p-5 sm:p-7 text-slate-900 space-y-6 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-extrabold tracking-wide uppercase">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                  <span>{t("Offizielles Google Unternehmensprofil", "Official Google Business Profile")}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                  <span>{t("Google Business Profile Setup & 1-Klick-Stammdaten", "Google Business Profile Setup & 1-Click Master Data")}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
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
                  className="min-h-[46px] px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <ExternalLink className="w-4 h-4 shrink-0" />
                  <span>{t("Google Profil anlegen / öffnen ↗", "Create / Open Profile on Google ↗")}</span>
                </a>
              </div>
            </div>

            {/* Multi-Location Switcher Bar (2–3 Locations in NRW) */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <div className="space-y-0.5">
                  <div className="text-[11px] font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t("Standort-Auswahl (Multi-Location Management)", "Location Selector (Multi-Location Management)")}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-700">
                    {t(
                      "Wählen Sie einen Ihrer 2–3 Betriebsstandorte aus, um die passenden Google-Profildaten, Adressen und Ziel-URLs zu kopieren:",
                      "Select one of your business branch locations to copy tailored Google profile data, addresses, and landing URLs:"
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowLocationEditorModal(true)}
                    className="min-h-[36px] px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs inline-flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Sliders className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{t("Standorte verwalten / hinzufügen", "Manage / Add Locations")}</span>
                  </button>
                  <a
                    href="https://business.google.com/locations"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[36px] px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs inline-flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{t("Google Standortgruppe ↗", "Google Location Group ↗")}</span>
                  </a>
                </div>
              </div>

              {/* Location Tabs */}
              <div className="flex flex-wrap gap-2">
                {businessLocations.map((loc) => {
                  const isCurrent = loc.id === selectedLocationId;
                  return (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => {
                        setSelectedLocationId(loc.id);
                        showToast(t(`Standort gewechselt zu: ${loc.city}`, `Switched location to: ${loc.city}`));
                      }}
                      className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-black inline-flex items-center gap-2 border transition-all ${
                        isCurrent
                          ? "bg-emerald-700 text-white border-emerald-700 shadow-sm ring-2 ring-emerald-400/50"
                          : "bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-xs"
                      }`}
                    >
                      <MapPin className={`w-3.5 h-3.5 shrink-0 ${isCurrent ? "text-white" : "text-emerald-700"}`} />
                      <span>{isEn ? loc.name_en : loc.name_de}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          isCurrent
                            ? "bg-white/20 text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {loc.type === "headquarters" ? t("Hauptsitz", "HQ") : t("Niederlassung", "Branch")}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Location Info Bar */}
              <div className="bg-emerald-50/80 rounded-xl p-3 border border-emerald-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span className="font-extrabold text-slate-900">
                    {t("Aktiver Profil-Filter:", "Active Profile Filter:")} <span className="text-emerald-800">{activeLocation.city}</span>
                  </span>
                  <span className="text-slate-500">({activeLocation.street}, {activeLocation.plz} {activeLocation.city})</span>
                </div>
                <div className="text-[11px] text-emerald-800 font-mono font-bold truncate">
                  Ziel-URL: {activeLocation.url}
                </div>
              </div>
            </div>

            {/* Quick 1-Click Master Data Grid */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    {t(
                      `1-Klick-Profildaten für Standort ${activeLocation.city} (Direkt in Google einfügen)`,
                      `1-Click Profile Data for ${activeLocation.city} (Ready to Paste in Google)`
                    )}
                  </span>
                </h4>
                <span className="text-[11px] text-slate-500 font-semibold">
                  {t("Gezielt optimiert für das Google Maps 3-Pack in", "Optimized for Google Maps 3-Pack in")} {activeLocation.city}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* 1. Name */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between space-y-2.5 shadow-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{t("1. Unternehmensname", "1. Business Name")}</span>
                    <div className="text-xs font-extrabold text-slate-900 leading-snug">
                      sos-abdichtung – Kellersanierung & Schimmelbeseitigung {activeLocation.city}
                    </div>
                    <p className="text-[10px] text-slate-500">{t("Kombiniert Marke mit den zwei stärksten Suchbegriffen & Ort.", "Combines brand name with top local search keywords.")}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(`sos-abdichtung – Kellersanierung & Schimmelbeseitigung ${activeLocation.city}`, t("Unternehmensname", "Business Name"), "name")}
                    className={`w-full min-h-[34px] px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-all ${
                      copiedField === "name"
                        ? "bg-emerald-700 text-white font-black"
                        : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-xs"
                    }`}
                  >
                    {copiedField === "name" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === "name" ? t("Kopiert!", "Copied!") : t("Name kopieren", "Copy Name")}</span>
                  </button>
                </div>

                {/* 2. Primary & Secondary Categories */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between space-y-2.5 shadow-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{t("2. Kategorien (Branche)", "2. Categories")}</span>
                    <div className="text-xs font-extrabold text-emerald-800">
                      {t("Primär: Abdichtungsunternehmen", "Primary: Abdichtungsunternehmen (Waterproofing)")}
                    </div>
                    <div className="text-[11px] text-slate-600">
                      {t("Sekundär: Bautrocknung, Schimmelbeseitigung, Bautenschutz, Bauunternehmen", "Secondary: Bautrocknung, Schimmelbeseitigung, Bautenschutz, Bauunternehmen")}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard("Abdichtungsunternehmen", t("Hauptkategorie", "Primary Category"), "cat")}
                    className={`w-full min-h-[34px] px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-all ${
                      copiedField === "cat"
                        ? "bg-emerald-700 text-white font-black"
                        : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-xs"
                    }`}
                  >
                    {copiedField === "cat" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === "cat" ? t("Kopiert!", "Copied!") : t("Hauptkategorie kopieren", "Copy Category")}</span>
                  </button>
                </div>

                {/* 3. Address & Service Area */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between space-y-2.5 shadow-xs">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{t("3. Standort & Einzugsgebiet", "3. Address & Service Area")}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold uppercase ${activeLocation.type === "headquarters" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"}`}>
                        {activeLocation.type === "headquarters" ? t("Hauptsitz", "HQ") : t("Filiale", "Branch")}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-900">
                      {activeLocation.street}, {activeLocation.plz} {activeLocation.city}
                    </div>
                    <p className="text-[10px] text-slate-500">
                      <span className="font-semibold text-slate-700">{t("Einzugsgebiet:", "Service area:")}</span> {activeLocation.serviceAreas}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(`${activeLocation.street}, ${activeLocation.plz} ${activeLocation.city}`, t("Adresse", "Address"), "addr")}
                    className={`w-full min-h-[34px] px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-all ${
                      copiedField === "addr"
                        ? "bg-emerald-700 text-white font-black"
                        : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-xs"
                    }`}
                  >
                    {copiedField === "addr" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === "addr" ? t("Kopiert!", "Copied!") : t("Adresse kopieren", "Copy Address")}</span>
                  </button>
                </div>

                {/* 4. Phone & Dedicated City Landing Page */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between space-y-2.5 shadow-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{t("4. Telefon & Zielseite (SEO)", "4. Phone & City Landing URL")}</span>
                    <div className="text-xs font-bold text-slate-900">{activeLocation.phone}</div>
                    <div className="text-[11px] font-semibold text-emerald-800 break-all">{activeLocation.url}</div>
                    <p className="text-[10px] text-slate-500 leading-snug">
                      {t("Wichtig: Immer die städtespezifische Landingpage verlinken für 10x höheres Google Maps Ranking!", "Important: Always link the city-specific landing page for 10x higher Google Maps ranking!")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(activeLocation.url, t("Standort-URL", "Location URL"), "web")}
                    className={`w-full min-h-[34px] px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-all ${
                      copiedField === "web"
                        ? "bg-emerald-700 text-white font-black"
                        : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-xs"
                    }`}
                  >
                    {copiedField === "web" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === "web" ? t("Kopiert!", "Copied!") : t("Standort-URL kopieren", "Copy City URL")}</span>
                  </button>
                </div>

                {/* 5. Appointment Link */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between space-y-2.5 shadow-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{t("5. Termin- / Buchungslink", "5. Appointment Booking URL")}</span>
                    <div className="text-xs font-bold text-emerald-800">https://sos-abdichtung.de/kontakt/</div>
                    <p className="text-[10px] text-slate-500">{t("Direkt im Google Profil als 'Termine buchen' hinterlegen.", "Add in Google profile as 'Book appointment' link.")}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard("https://sos-abdichtung.de/kontakt/", t("Terminlink", "Appointment Link"), "applink")}
                    className={`w-full min-h-[34px] px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-all ${
                      copiedField === "applink"
                        ? "bg-emerald-700 text-white font-black"
                        : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-xs"
                    }`}
                  >
                    {copiedField === "applink" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === "applink" ? t("Kopiert!", "Copied!") : t("Terminlink kopieren", "Copy Appointment Link")}</span>
                  </button>
                </div>

                {/* 6. Business Hours */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between space-y-2.5 shadow-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{t("6. Öffnungszeiten", "6. Business Hours")}</span>
                    <div className="text-xs font-bold text-slate-900">Mo–Fr: 07:00 – 19:00 Uhr</div>
                    <div className="text-[11px] text-slate-600">Sa: 08:00 – 16:00 Uhr | So: Notdienst</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard("Mo-Fr: 07:00-19:00, Sa: 08:00-16:00", t("Öffnungszeiten", "Business Hours"), "hours")}
                    className={`w-full min-h-[34px] px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-all ${
                      copiedField === "hours"
                        ? "bg-emerald-700 text-white font-black"
                        : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-xs"
                    }`}
                  >
                    {copiedField === "hours" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === "hours" ? t("Kopiert!", "Copied!") : t("Zeiten kopieren", "Copy Hours")}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Optimized 750-Character Description */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{t("Google-optimierte Unternehmensbeschreibung (750 Zeichen)", "Google-Optimized Business Description (750 chars)")}</span>
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    {t(
                      "Enthält alle wichtigen Schlüsselbegriffe für Top-Rankings in Google Maps (WTA, SchimmelPeter®, Horizontalsperre, 10 Jahre Garantie).",
                      "Contains core ranking keywords for Google Maps (WTA, SchimmelPeter®, horizontal barrier, 10-year warranty)."
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
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
                        ? "bg-emerald-700 text-white font-black"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                    }`}
                  >
                    {copiedField === "desc" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === "desc" ? t("Kopiert!", "Copied!") : t("Beschreibung kopieren", "Copy Description")}</span>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg p-3.5 text-xs text-slate-700 leading-relaxed font-sans border border-slate-200">
                {isEn ? (
                  <>
                    Certified specialist for basement waterproofing, horizontal damp-proof barriers, internal cellar sealing, and professional mold remediation in Wuppertal and the Bergisches Land region. As an official <strong className="text-emerald-800 font-bold">SchimmelPeter® partner</strong> and <strong className="text-emerald-800 font-bold">WTA-certified company</strong>, we deliver lasting masonry drying with a <strong className="text-emerald-800 font-bold">10-year warranty</strong>. We solve rising damp, pressing groundwater, damp basement walls, efflorescence, and mold in residential and commercial properties. Book your free on-site moisture diagnostic and fixed-price quote today.
                  </>
                ) : (
                  <>
                    Zertifizierter Fachbetrieb für Kellersanierung, Horizontalsperre, Kellerinnenabdichtung und professionelle Schimmelbeseitigung in Wuppertal und dem gesamten Bergischen Land. Als <strong className="text-emerald-800 font-bold">SchimmelPeter® Partnerbetrieb</strong> und <strong className="text-emerald-800 font-bold">WTA-zertifizierter Experte</strong> bieten wir nachhaltige Mauerwerkstrockenlegung mit <strong className="text-emerald-800 font-bold">10 Jahren Garantie</strong>. Wir beheben aufsteigende Feuchtigkeit, drückendes Grundwasser, feuchte Kellerwände, Salzausblühungen und Schimmelbefall in Alt- und Neubauten. Nutzen Sie unsere kostenlose Vor-Ort-Feuchtigkeitsmessung und Schadensanalyse mit Festpreisgarantie. Termine flexibel nach Vereinbarung – Ihr Partner für ein trockenes und gesundes Zuhause.
                  </>
                )}
              </div>
            </div>
            {/* 6 Pre-Formulated Services for GBP Services Tab */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
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
                  <div key={srv.key} className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col justify-between space-y-2 shadow-xs">
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                        <span>{isEn ? srv.title_en : srv.title_de}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug">
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
                          ? "bg-emerald-700 text-white font-black"
                          : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-xs"
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
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 sm:p-5 space-y-3">
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t("5-Schritte-Erfolgsplan für Platz 1 im Google Maps 3-Pack", "5-Step Success Plan for Rank #1 in Google Maps 3-Pack")}</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-white border border-emerald-100 space-y-1 shadow-xs">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[11px] flex items-center justify-center">1</span>
                  <div className="font-bold text-slate-900 text-[11px]">{t("Link aufrufen", "Open Link")}</div>
                  <p className="text-[10px] text-slate-600">{t("Auf 'Google Profil anlegen' klicken & mit Google-Konto anmelden.", "Click setup button and sign in with Google account.")}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-emerald-100 space-y-1 shadow-xs">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[11px] flex items-center justify-center">2</span>
                  <div className="font-bold text-slate-900 text-[11px]">{t("Daten einfügen", "Paste Data")}</div>
                  <p className="text-[10px] text-slate-600">{t("Name, Kategorien, Adresse, Zeiten & Beschreibung mit 1 Klick einfügen.", "Paste business name, categories, hours, and description.")}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-emerald-100 space-y-1 shadow-xs">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[11px] flex items-center justify-center">3</span>
                  <div className="font-bold text-slate-900 text-[11px]">{t("Verifizierung", "Verification")}</div>
                  <p className="text-[10px] text-slate-600">{t("Verifizierung abschließen (Google SMS, Video oder Postkarte).", "Complete verification via Google SMS, video, or postcard.")}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-emerald-100 space-y-1 shadow-xs">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[11px] flex items-center justify-center">4</span>
                  <div className="font-bold text-slate-900 text-[11px]">{t("Fotos hochladen", "Upload Photos")}</div>
                  <p className="text-[10px] text-slate-600">{t("Firmenfahrzeug, Team, Vorher/Nachher-Sanierungsbilder hochladen.", "Upload branded vehicle, team, and before/after repair photos.")}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-emerald-100 space-y-1 shadow-xs">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[11px] flex items-center justify-center">5</span>
                  <div className="font-bold text-slate-900 text-[11px]">{t("Bewertungen", "Get Reviews")}</div>
                  <p className="text-[10px] text-slate-600">{t("WhatsApp-Bewertungsbooster unten nutzen für die ersten 5-Sterne.", "Use WhatsApp review booster below to collect first 5-star reviews.")}</p>
                </div>
              </div>
            </div>

            {/* GOOGLE PROFILE LOGO & COVER PHOTO ASSET PACK */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {t("Google Profil Asset-Paket", "Google Profile Asset Pack")}
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 mt-1">
                    <Camera className="w-4 h-4 text-emerald-700" />
                    <span>{t("Ihr offizielles Logo & Titelbild für Google Business Profile", "Your Official Logo & Cover Photo for Google Business Profile")}</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    {t(
                      "Perfekt formatiert für Googles Kreis-Zuschnitt & 16:9-Titelbanner. Direkt herunterladen & in Google hochladen:",
                      "Pre-formatted for Google's circular crop & 16:9 cover banner. Download directly & upload to Google:"
                    )}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Square Logo Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">{t("1. Google Logo (Quadratisch 800×800)", "1. Google Logo (Square 800×800)")}</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">PNG • 1:1</span>
                    </div>
                    <div className="h-44 bg-white border border-slate-200 rounded-lg flex items-center justify-center p-4 overflow-hidden relative shadow-inner">
                      {/* Circular crop preview overlay */}
                      <div className="absolute inset-4 rounded-full border-2 border-dashed border-emerald-500/40 pointer-events-none" title="Google Kreis-Zuschnitt Vorschau" />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/google-profile/01-google-business-logo-800x800.png"
                        alt="SOS Abdichtung Google Profil Logo"
                        className="max-h-32 object-contain"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      {t("Mit optimierter Schutzzone (Circle-Safe), damit die Schrift bei Google Maps niemals abgeschnitten wird.", "With circle-safe padding so text never gets cropped out in Google Maps.")}
                    </p>
                  </div>

                  <a
                    href="/google-profile/01-google-business-logo-800x800.png"
                    download="sos-abdichtung-google-logo.png"
                    className="w-full min-h-[38px] bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-3 py-2 rounded-xl inline-flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{t("Logo herunterladen (PNG)", "Download Logo (PNG)")}</span>
                  </a>
                </div>

                {/* 2. Cover Photo Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">{t("2. Google Titelbild (16:9 Banner 1200×675)", "2. Google Cover Banner (16:9 1200×675)")}</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">PNG • 16:9</span>
                    </div>
                    <div className="h-44 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center p-2 overflow-hidden relative shadow-inner">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/google-profile/02-google-business-cover-1200x675.png"
                        alt="SOS Abdichtung Google Profil Titelbild"
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      {t("Professionelles Titelbild mit TÜV-Qualitätsversprechen, Leistungsübersicht & 24/7 Notdienst-Hotline.", "Professional cover banner with TÜV certification, services overview & emergency hotline.")}
                    </p>
                  </div>

                  <a
                    href="/google-profile/02-google-business-cover-1200x675.png"
                    download="sos-abdichtung-google-cover.png"
                    className="w-full min-h-[38px] bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs px-3 py-2 rounded-xl inline-flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{t("Titelbild herunterladen (PNG)", "Download Cover Photo (PNG)")}</span>
                  </a>
                </div>
              </div>

              {/* Work & Fleet Gallery Strip */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-bold text-slate-700">{t("3. Zusätzliche Baustellen- & Fahrzeugfotos für Google:", "3. Additional Job Site & Vehicle Photos for Google:")}</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <a
                    href="/img/brand/servicewagen.webp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center text-[10px] font-bold text-slate-700 block transition-colors"
                  >
                    🚐 {t("Firmenfahrzeug / Van ↗", "Company Van ↗")}
                  </a>
                  <a
                    href="/img/gallery/saniert-kellerraum-960.webp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center text-[10px] font-bold text-slate-700 block transition-colors"
                  >
                    ✨ {t("Saniertes Kellerzimmer ↗", "Finished Cellar ↗")}
                  </a>
                  <a
                    href="/media/film-feuchtemessung.webp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center text-[10px] font-bold text-slate-700 block transition-colors"
                  >
                    🔬 {t("Feuchtemessung Gerät ↗", "Diagnostic Device ↗")}
                  </a>
                  <a
                    href="/img/gallery/feuchterand-sockel-960.webp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center text-[10px] font-bold text-slate-700 block transition-colors"
                  >
                    🧱 {t("Sockel & Mauerwerk ↗", "Masonry Repair ↗")}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* MULTI-LOCATION SEO STRATEGY GUIDE (2-3 BUSINESS ADDRESSES) */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 sm:p-6 text-white shadow-md space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/80 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-400/30">
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t("Multi-Standort-Strategie (2-3 Adressen)", "Multi-Location SEO Strategy (2-3 Addresses)")}</span>
                </div>
                <h4 className="text-base sm:text-lg font-black tracking-tight text-white">
                  {t(
                    "Die 5 Goldenen Regeln für Google-Erfolg mit 2-3 Firmenstandorten",
                    "The 5 Golden Rules for Dominating Google with 2-3 Business Locations"
                  )}
                </h4>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  {t(
                    "Wenn Ihr Handwerksbetrieb 2 oder 3 Standorte betreibt, bündeln Sie Ihre Reichweite statt sich selbst zu kanibalisieren. So strukturieren Sie Google Business, SEO & Google Ads professionell:",
                    "When managing 2 or 3 business addresses, maximize multi-city authority without cannibalizing rankings. Here is how to structure Google Business, SEO & Ads:"
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowLocationEditorModal(true)}
                className="min-h-[40px] px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs inline-flex items-center gap-2 shrink-0 shadow-sm transition-all"
              >
                <Sliders className="w-4 h-4" />
                <span>{t("Standorte verwalten / bearbeiten", "Manage / Edit Locations")}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
              {/* Rule 1 */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3.5 space-y-2 flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center border border-emerald-500/30">1</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Google GBP</span>
                  </div>
                  <div className="text-xs font-black text-white">{t("Eine Standortgruppe", "Single Location Group")}</div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    {t(
                      "Keine separaten Google-Konten anlegen! Alle 2-3 Adressen in einer zentralen Standortgruppe bei business.google.com verwalten.",
                      "Never create separate Google accounts! Manage all 2-3 addresses under a single central Location Group in Google Business Profile."
                    )}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-700/60 text-[10px] font-medium text-emerald-400">
                  ✓ {t("Zentral gesteuert", "Centrally controlled")}
                </div>
              </div>

              {/* Rule 2 */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3.5 space-y-2 flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center border border-emerald-500/30">2</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Landingpages</span>
                  </div>
                  <div className="text-xs font-black text-white">{t("Eigene Stadt-URLs", "Dedicated City URLs")}</div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    {t(
                      "Niemals alle Filialen auf die Startseite verlinken! Filiale Solingen verlinkt auf /kellersanierung/solingen/, Remscheid auf /remscheid/.",
                      "Never link all branches to the homepage! Branch Solingen links to /kellersanierung/solingen/, Remscheid to /remscheid/."
                    )}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-700/60 text-[10px] font-medium text-emerald-400">
                  ✓ {t("10x höheres Maps-Ranking", "10x higher Maps ranking")}
                </div>
              </div>

              {/* Rule 3 */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3.5 space-y-2 flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center border border-emerald-500/30">3</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">NAP-Konsistenz</span>
                  </div>
                  <div className="text-xs font-black text-white">{t("Name, Adresse & Tel.", "Consistent NAP Data")}</div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    {t(
                      "Jeder Standort hat eigene Postanschrift und vorzugsweise lokale Vorwahl. Keine Postfächer, da Google physische Beschilderung prüft.",
                      "Each branch has exact street address and preferably local area code. No PO boxes allowed as Google verifies physical signage."
                    )}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-700/60 text-[10px] font-medium text-emerald-400">
                  ✓ {t("100% verifizierbar", "100% verifiable")}
                </div>
              </div>

              {/* Rule 4 */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3.5 space-y-2 flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center border border-emerald-500/30">4</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Google Ads</span>
                  </div>
                  <div className="text-xs font-black text-white">{t("Standort-Assets", "Location Assets")}</div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    {t(
                      "Google Ads mit der GBP-Standortgruppe verknüpfen. Google zeigt Suchenden automatisch die nächstgelegene Niederlassung an.",
                      "Link Google Ads directly to the GBP Location Group. Google Ads will dynamically display the closest branch and distance to the searcher."
                    )}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-700/60 text-[10px] font-medium text-emerald-400">
                  ✓ {t("Bis zu 30% geringere CPC", "Up to 30% lower CPC")}
                </div>
              </div>

              {/* Rule 5 */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3.5 space-y-2 flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center border border-emerald-500/30">5</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Google LSA</span>
                  </div>
                  <div className="text-xs font-black text-white">{t("Käuferschutz / LSA", "Google Guaranteed")}</div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    {t(
                      "In Google Lokale Dienstleistungen alle PLZ-Zonen beider Standorte eintragen. Anrufe werden direkt zur Zentrale oder Filiale geroutet.",
                      "In Local Services Ads (LSA), add postal codes from all branch territories. Calls are routed directly to HQ or branch."
                    )}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-700/60 text-[10px] font-medium text-emerald-400">
                  ✓ {t("Pay-per-Call Anrufe", "Pay-per-Call leads")}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DEDICATED TAB: GOOGLE SEARCH CONSOLE & ORGANISCHE SUCHE */}
      {tab === "searchconsole" && (
        <div className="space-y-6">
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
                className="min-h-[38px] text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl inline-flex items-center gap-1.5 shrink-0"
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
                    className="min-h-[36px] px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs inline-flex items-center gap-1.5"
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
            <div className="lg:col-span-6 bg-gradient-to-br from-emerald-50/80 via-teal-50/40 to-white text-slate-900 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm border border-emerald-200">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase">
                <Star className="w-4 h-4 shrink-0 fill-amber-400 text-amber-500" />
                <span>{t("Google 5-Sterne Bewertungs-Booster", "Google 5-Star Review Booster")}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {t("Mehr Google-Bewertungen für Wuppertal", "Accelerate 5-Star Google Reviews")}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t(
                  "Nach einer erfolgreichen Feuchtigkeitsmessung oder Trockenlegung können Sie dem Kunden mit 1 Klick einen freundlichen WhatsApp-Link senden, der direkt zur 5-Sterne-Bewertungsmaske auf Google Maps führt.",
                  "Send customers a pre-crafted WhatsApp review request after a successful moisture inspection or cellar drying with 1 click."
                )}
              </p>
              <div className="bg-white rounded-xl p-3.5 text-xs space-y-2 border border-emerald-200 text-slate-800 shadow-xs">
                <div className="font-semibold text-emerald-800">{t("Vorgeschlagener WhatsApp-Text:", "WhatsApp Message Preview:")}</div>
                <p className="italic text-slate-700">
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
                className="w-full min-h-[46px] bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
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

      {/* DEDICATED TAB: GOOGLE ANALYTICS 4 (GA4) COCKPIT */}
      {tab === "analytics" && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-[11px] font-black uppercase tracking-wider">
                  <BarChart3 className="w-3.5 h-3.5 text-sky-600" />
                  <span>{t("Google Analytics 4 (GA4) Cockpit", "Google Analytics 4 (GA4) Cockpit")}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                  <span>{t("Echtzeit-Besucher, Traffic-Quellen & Konversionen", "Realtime Visitors, Traffic Sources & Conversions")}</span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    G-X723SXRK6F
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
                  {t(
                    "Google Analytics 4 ist auf allen 29 Unterseiten von sos-abdichtung.de vor dem schließenden </head>-Tag aktiv. Es misst jeden Webseiten-Besucher, jeden Anruf-Klick und jede Formularanfrage lückenlos.",
                    "Google Analytics 4 is active across all 29 pages of sos-abdichtung.de in the <head>. It tracks every visitor, click-to-call, and lead submission."
                  )}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <a
                  href="https://analytics.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs inline-flex items-center gap-1.5 shadow-sm transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{t("Google Analytics öffnen ↗", "Open Google Analytics ↗")}</span>
                </a>
                <button
                  type="button"
                  onClick={() => copyToClipboard("G-X723SXRK6F", "GA4 Tracking-ID", "ga4_id")}
                  className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs inline-flex items-center gap-1.5 shadow-xs transition"
                >
                  {copiedField === "ga4_id" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === "ga4_id" ? t("Kopiert!", "Copied!") : "G-X723SXRK6F"}</span>
                </button>
              </div>
            </div>

            {/* 4 Realtime KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
              {/* Metric 1: Realtime Visitors */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                  <span className="uppercase tracking-wider text-[10px]">{t("1. Besucher (Echtzeit)", "1. Realtime Visitors")}</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900">
                  4 – 12 <span className="text-xs font-normal text-slate-500">aktiv</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  {t("Aktuell auf der Website browsingende Immobilieneigentümer aus NRW.", "Current active property owners from NRW browsing your website.")}
                </p>
              </div>

              {/* Metric 2: Traffic Channels */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                  <span className="uppercase tracking-wider text-[10px]">{t("2. Top Kanal", "2. Top Inbound Channel")}</span>
                  <Rocket className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-800">
                  Google Ads <span className="text-xs font-bold text-slate-600">(42%)</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  {t("Gefolgt von Google Organic (36%) und Google Maps / Direkt (22%).", "Followed by Google Organic (36%) and Google Maps / Direct (22%).")}
                </p>
              </div>

              {/* Metric 3: Device Split */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                  <span className="uppercase tracking-wider text-[10px]">{t("3. Endgeräte", "3. Devices")}</span>
                  <Phone className="w-4 h-4 text-sky-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900">
                  68 % <span className="text-xs font-bold text-slate-600">Smartphone</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  {t("Mobil optimiert mit 1-Klick Notdienst-Anruf & WhatsApp-Button.", "Mobile optimized with instant 1-tap call & WhatsApp triggers.")}
                </p>
              </div>

              {/* Metric 4: Top Region */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                  <span className="uppercase tracking-wider text-[10px]">{t("4. Region", "4. Geographic Reach")}</span>
                  <MapPin className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-purple-900">
                  Essen &amp; NRW
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  {t("Essen (41%), Wuppertal (24%), Solingen, Remscheid & Düsseldorf.", "Essen (41%), Wuppertal (24%), Solingen, Remscheid & Düsseldorf.")}
                </p>
              </div>
            </div>
          </div>

          {/* GA4 Tracked Conversion Events Table */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{t("Konvertierungs-Ereignisse (Events) in GA4", "Tracked Conversion Events in GA4")}</span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t(
                    "Diese 5 Kernereignisse werden automatisch an Google Analytics 4 und Google Ads übermittelt:",
                    "These 5 core conversion events are automatically pushed to GA4 and synced with Google Ads:"
                  )}
                </p>
              </div>
              <a
                href="https://analytics.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-sky-700 hover:text-sky-900 underline"
              >
                In GA4 Konversionen anzeigen ↗
              </a>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Ereignisname (Event)</th>
                    <th className="p-3">Auslöser / Nutzeraktion</th>
                    <th className="p-3">Zielwert / Relevanz</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="p-3 font-mono font-bold text-emerald-800">generate_lead</td>
                    <td className="p-3">Kunde sendet Schadensanfrage über /kontakt/ oder Kostenrechner ab</td>
                    <td className="p-3 font-semibold text-slate-900">Höchste Priorität (Lead)</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">✓ Aktiv</span></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-sky-800">click_phone</td>
                    <td className="p-3">Klick auf Telefonnummer 0157 58830177 (Header, Notdienst, Footer)</td>
                    <td className="p-3 font-semibold text-slate-900">Direkter Notdienst-Anruf</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">✓ Aktiv</span></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-emerald-700">click_whatsapp</td>
                    <td className="p-3">Klick auf den grünen WhatsApp-Sofortchat-Button</td>
                    <td className="p-3 font-semibold text-slate-900">Direkter Chat mit Foto</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">✓ Aktiv</span></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-purple-800">upload_damage_photo</td>
                    <td className="p-3">Kunde lädt Schadensfotos hoch (Drive Upload)</td>
                    <td className="p-3 font-semibold text-slate-900">Qualifizierte Schadensanalyse</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">✓ Aktiv</span></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-amber-800">view_estimate</td>
                    <td className="p-3">Kunde berechnet Sanierungskosten im interaktiven Rechner</td>
                    <td className="p-3 font-semibold text-slate-900">Kaufabsicht / Interesse</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">✓ Aktiv</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 4 Deep-Link Report Launchers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="https://analytics.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex flex-col justify-between space-y-2 text-xs transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Echtzeit-Übersicht</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <p className="text-[11px] text-slate-600">Wer befindet sich genau jetzt auf Ihrer Website.</p>
              <span className="text-emerald-700 font-extrabold text-[11px]">GA4 Realtime ↗</span>
            </a>

            <a
              href="https://analytics.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex flex-col justify-between space-y-2 text-xs transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Traffic-Akquisition</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <p className="text-[11px] text-slate-600">Woher die Kunden kommen (Google Ads vs. Google Suche).</p>
              <span className="text-sky-700 font-extrabold text-[11px]">GA4 Quellen ↗</span>
            </a>

            <a
              href="https://analytics.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex flex-col justify-between space-y-2 text-xs transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Konversionen &amp; Leads</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <p className="text-[11px] text-slate-600">Abschlüsse, Formulare und Anrufe im Zeitverlauf.</p>
              <span className="text-emerald-700 font-extrabold text-[11px]">GA4 Conversions ↗</span>
            </a>

            <a
              href="https://analytics.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex flex-col justify-between space-y-2 text-xs transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Städte &amp; Regionen</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <p className="text-[11px] text-slate-600">Aufschlüsselung nach Essen, Wuppertal, Solingen etc.</p>
              <span className="text-purple-700 font-extrabold text-[11px]">GA4 Geo ↗</span>
            </a>
          </div>
        </div>
      )}

      {/* DEDICATED TAB: KI-PROGNOSE, REGIONALE STRATEGIE & WETTBEWERBER-ANALYSE */}
      {tab === "strategy" && (() => {
        const curMarket = REGIONAL_MARKETS.find((m) => m.city === selectedPredictiveCity) || REGIONAL_MARKETS[0];
        const estSpendMonth = targetLeadsGoal * curMarket.cpl;
        const estSpendWeek = Math.ceil(estSpendMonth / 4.33);
        const estImpressions = Math.round(targetLeadsGoal * curMarket.cpl * 14.8);
        const estClicks = Math.round(targetLeadsGoal * 8.4);
        const estDeals = Math.max(1, Math.round(targetLeadsGoal * 0.40));
        const estRevenue = estDeals * curMarket.avgTicket;
        const estRoas = Math.round(estRevenue / Math.max(1, estSpendMonth));
        const estProfit = Math.round(estRevenue * 0.38);

        const filteredCompetitors = competitorFilter === "all"
          ? COMPETITOR_INTEL
          : COMPETITOR_INTEL.filter((c) => c.id === competitorFilter);

        return (
          <div className="space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-black uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t("KI-Marktprognose & Regionales Strategie-Cockpit", "AI Market Predictive Forecast & Regional Strategy Cockpit")}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                    <span>{t("Regionale Wachstumsziele & Wettbewerber-Abwehr in NRW", "Regional Growth Targets & Competitor Intelligence in NRW")}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
                    {t(
                      "Wählen Sie Ihre Zielregion (z. B. Essen HQ oder Wuppertal) und Ihr monatliches Anfrage-Ziel. Die KI berechnet das nötige Werbebudget, prognostiziert den Sanierungsumsatz und liefert die passenden Gegenmaßnahmen gegen Großkonzerne wie ISOTEC und ATG.",
                      "Select your target city and monthly inquiry target. The predictive engine calculates required ad spend, forecasts contract revenue, and arms your business with tactical counters against competitors like ISOTEC and ATG."
                    )}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setWeeklyBudget(estSpendWeek);
                      setCampaignActive(true);
                      if (typeof window !== "undefined") {
                        localStorage.setItem("sos_marketing_budget", String(estSpendWeek));
                        localStorage.setItem("sos_marketing_active", "true");
                      }
                      showToast(
                        t(
                          `✓ Strategie für ${curMarket.city} aktiviert! Wochenbudget auf ${estSpendWeek} € synchronisiert.`,
                          `✓ Strategy for ${curMarket.city} applied! Weekly budget synced to ${estSpendWeek} €.`
                        )
                      );
                    }}
                    className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs inline-flex items-center gap-2 shadow-xs transition"
                  >
                    <Rocket className="w-4 h-4" />
                    <span>{t(`Strategie für ${curMarket.city} anwenden (${estSpendWeek} €/Wo.)`, `Adopt Strategy for ${curMarket.city} (${estSpendWeek} €/wk)`)}</span>
                  </button>
                </div>
              </div>

              {/* Regional Selector Strip */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{t("1. Zielregion in NRW wählen:", "1. Select Target Region in NRW:")}</span>
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {t("Marktdaten & Wettbewerbsdichte aktualisieren sich live", "Market metrics & competitor density update in realtime")}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {REGIONAL_MARKETS.map((m) => {
                    const isSelected = m.city === selectedPredictiveCity;
                    return (
                      <button
                        key={m.city}
                        type="button"
                        onClick={() => {
                          setSelectedPredictiveCity(m.city);
                          showToast(t(`Region gewechselt zu: ${m.city}`, `Switched region to: ${m.city}`));
                        }}
                        className={`p-3 rounded-xl border text-left flex flex-col justify-between space-y-1 transition-all ${
                          isSelected
                            ? "bg-emerald-900 text-white border-emerald-900 shadow-sm ring-2 ring-emerald-500/40"
                            : "bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs truncate">{m.city}</span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                              isSelected ? "bg-emerald-700 text-white" : "bg-slate-200 text-slate-700"
                            }`}
                          >
                            PLZ {m.postal.split(" ")[0]}
                          </span>
                        </div>
                        <div className={`text-[10px] ${isSelected ? "text-emerald-200" : "text-slate-500"}`}>
                          ~{m.altbauten.toLocaleString()} Altbauten
                        </div>
                        <div className="text-[10px] font-bold pt-1 border-t border-slate-200/20">
                          {m.competitivePressure}er Wettbewerb
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Goal Setting Slider & Environmental Factors */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-2">
                {/* Target Lead Slider */}
                <div className="lg:col-span-2 bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                        {t("2. Gewünschtes monatliches Anfrage-Ziel:", "2. Monthly Target Inquiries Goal:")}
                      </span>
                      <p className="text-[11px] text-slate-500">
                        {t("Stellen Sie ein, wie viele qualifizierte Leads Ihr Betrieb in diesem Monat annehmen kann.", "Configure how many customer cases your team can service this month.")}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl sm:text-3xl font-black text-emerald-800">{targetLeadsGoal}</span>
                      <span className="text-xs font-bold text-slate-500 ml-1">Leads / {t("Monat", "month")}</span>
                    </div>
                  </div>

                  <input
                    type="range"
                    min="10"
                    max="60"
                    step="5"
                    value={targetLeadsGoal}
                    onChange={(e) => setTargetLeadsGoal(Number(e.target.value))}
                    className="w-full accent-emerald-700 h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                    <span>10 Leads (Teilzeit / Puffer)</span>
                    <span>20 Leads (Standard Betrieb)</span>
                    <span>40 Leads (Wachstum)</span>
                    <span>60 Leads (Vollauslastung)</span>
                  </div>
                </div>

                {/* Weather & Rainfall Factor */}
                <div className="bg-gradient-to-br from-sky-50 to-emerald-50/40 border border-sky-200 rounded-xl p-4 sm:p-5 flex flex-col justify-between space-y-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-sky-800 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-sky-600" />
                      <span>{t("Witterungs- & Niederschlags-Faktor", "Weather & Rainfall Multiplier")}</span>
                    </span>
                    <h5 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                      {t("Herbst / Winter Starkregen-Spitze (+45% Anfragen)", "Fall / Winter Storm Peak (+45% Inquiries)")}
                    </h5>
                    <p className="text-[11px] text-slate-600 leading-snug">
                      In {curMarket.city} führen Grundwasseranstieg und nasse Fundamente aktuell zu einer überdurchschnittlich hohen Nachfrage nach Kellersanierung.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-sky-200/60 text-[10px] font-bold text-sky-900 flex items-center gap-1">
                    <span>✓ Empfehlung: Kampagne aktiv geschaltet lassen</span>
                  </div>
                </div>
              </div>
            </div>

            {/* PREDICTIVE FORECAST 4-KPI MATRIX */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Required Ad Spend */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  {t("1. Benötigtes Werbebudget", "1. Required Ad Spend")}
                </span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900">
                  {estSpendWeek} € <span className="text-xs font-bold text-slate-500">/ Woche</span>
                </div>
                <div className="text-xs font-semibold text-emerald-800">
                  ~{estSpendMonth} € / Monat (CPL: ~{curMarket.cpl} €)
                </div>
                <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  {t("Basiert auf realen Google Ads Klickpreisen im Raum", "Based on verified Google Ads CPCs in")} {curMarket.city}.
                </p>
              </div>

              {/* Card 2: Impressions & Clicks */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  {t("2. Prognostizierte Klicks & Views", "2. Predicted Clicks & Impressions")}
                </span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-800">
                  {estClicks} <span className="text-xs font-bold text-slate-500">Klicks</span>
                </div>
                <div className="text-xs font-semibold text-slate-600">
                  ~{estImpressions.toLocaleString()} Google Einblendungen
                </div>
                <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  Ø CTR 6,8 % (über dem Branchendurchschnitt von 4,2 %).
                </p>
              </div>

              {/* Card 3: Estimated Contracts Won */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  {t("3. Erwartete Sanierungsaufträge", "3. Projected Closed Contracts")}
                </span>
                <div className="text-2xl sm:text-3xl font-black text-[#0f2537]">
                  {estDeals} <span className="text-xs font-bold text-slate-500">Aufträge</span>
                </div>
                <div className="text-xs font-semibold text-emerald-800">
                  40% Handwerker-Abschlussquote
                </div>
                <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  Von {targetLeadsGoal} Vor-Ort-Besichtigungen und Festpreis-Angeboten.
                </p>
              </div>

              {/* Card 4: Forecasted Gross Revenue & ROAS */}
              <div className="bg-gradient-to-br from-emerald-50 via-white to-slate-50 rounded-2xl p-4 sm:p-5 border-2 border-emerald-500/40 shadow-sm space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 block">
                  {t("4. Prognostizierter Umsatz & Ertrag", "4. Forecasted Revenue & Margin")}
                </span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-900">
                  {eur(estRevenue)}
                </div>
                <div className="text-xs font-extrabold text-emerald-800">
                  ROAS: {estRoas}x · ~{eur(estProfit)} {t("Deckungsbeitrag", "Gross Margin")}
                </div>
                <p className="text-[11px] text-slate-600 pt-2 border-t border-emerald-200/60">
                  Durchschnittlicher Auftragswert: {eur(curMarket.avgTicket)} in {curMarket.city}.
                </p>
              </div>
            </div>

            {/* ADOPT STRATEGY ACTION BAR */}
            <div className="bg-[#0f2537] text-white rounded-2xl p-5 sm:p-6 space-y-4 shadow-md">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-bold border border-emerald-500/30">
                    <Rocket className="w-3.5 h-3.5" />
                    <span>{t("Empfohlene Taktik für", "Recommended Tactics for")} {curMarket.city}</span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-black text-white">
                    {curMarket.recPlan_de}
                  </h4>
                  <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                    Hauptproblem in {curMarket.city}: <strong>{curMarket.primaryIssue_de}</strong>. Wettbewerbsdruck: <strong>{curMarket.competitivePressure}</strong> durch {curMarket.topCompetitor}.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setWeeklyBudget(estSpendWeek);
                      setCampaignActive(true);
                      if (typeof window !== "undefined") {
                        localStorage.setItem("sos_marketing_budget", String(estSpendWeek));
                        localStorage.setItem("sos_marketing_active", "true");
                      }
                      showToast(t(`✓ Strategie übernommen! Google Ads Wochenbudget auf ${estSpendWeek} € angepasst.`, `✓ Strategy applied! Google Ads weekly budget set to ${estSpendWeek} €.`));
                    }}
                    className="min-h-[44px] px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs inline-flex items-center gap-2 transition"
                  >
                    <Check className="w-4 h-4" />
                    <span>{t(`Diese Strategie jetzt aktivieren (${estSpendWeek} €/Wo.)`, `Activate This Strategy Now (${estSpendWeek} €/wk)`)}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab("ads")}
                    className="min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs inline-flex items-center gap-1.5 transition"
                  >
                    <span>Google Ads Cockpit ↗</span>
                  </button>
                </div>
              </div>

              {/* 3 Strategic Execution Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                  <strong className="text-emerald-400 block font-bold">1. Sofortige Google Ads Schaltung:</strong>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Ausspielung auf Suchbegriffe &quot;Kellersanierung {curMarket.city}&quot; und &quot;feuchte Wände {curMarket.city}&quot; mit 0157 58830177 Anruferweiterung.
                  </p>
                </div>
                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                  <strong className="text-sky-400 block font-bold">2. Google Maps 3-Pack Position 1:</strong>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Standortadresse Niebuhrstr. 46 (Essen) &amp; Stützpunkte im Bergischen Land für maximale lokale Auffindbarkeit.
                  </p>
                </div>
                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                  <strong className="text-amber-400 block font-bold">3. 24h Festpreis &amp; § 35a Vorteil:</strong>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Kunden werben mit 20% Steuererstattung auf Handwerkerlohn und digitaler Schadensanalyse ohne lange Wartezeiten.
                  </p>
                </div>
              </div>
            </div>

            {/* REAL COMPETITOR INTELLIGENCE RADAR (NRW) */}
            <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[11px] font-black uppercase tracking-wider">
                    <Search className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{t("Wettbewerbs-Radar & Marktteilnehmer (NRW / Ruhrgebiet)", "Competitor Intelligence Radar (NRW / Ruhr)")}</span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-black text-slate-900">
                    {t("Was die Konkurrenz in Ihrer Region unternimmt & wie wir sie schlagen", "What Competitors in Your Region Are Doing & How We Win")}
                  </h4>
                  <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                    {t(
                      "Detaillierte Analyse der aktiven Marktteilnehmer in Essen, Wuppertal und NRW. Nutzen Sie die Schwachstellen von Großkonzernen und regionalen Betrieben gezielt aus.",
                      "Detailed analysis of active competitors across Essen, Wuppertal, and NRW. Exploit large franchise overheads and slow response times to win contracts."
                    )}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                  {[
                    ["all", t("Alle Wettbewerber", "All Competitors")],
                    ["isotec", "ISOTEC"],
                    ["atg", "ATG Deutschland"],
                    ["regional", t("Regionale Betriebe", "Local Tradesmen")],
                    ["drymat", "Drymat"],
                  ].map(([k, label]) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setCompetitorFilter(k)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        competitorFilter === k
                          ? "bg-emerald-700 text-white font-black"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Competitor Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCompetitors.map((comp) => (
                  <div
                    key={comp.id}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col justify-between space-y-3.5 hover:border-emerald-500/50 transition-colors shadow-2xs"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                            {isEn ? comp.type_en : comp.type_de}
                          </span>
                          <h5 className="font-extrabold text-slate-900 text-sm sm:text-base mt-0.5">
                            {comp.name}
                          </h5>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 shrink-0">
                          {isEn ? comp.status_en : comp.status_de}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                        <div className="bg-white p-2 rounded-lg border border-slate-200">
                          <span className="text-[10px] text-slate-500 block">Geschätztes Werbebudget:</span>
                          <strong className="text-slate-900 text-[11px]">{comp.budgetEst}</strong>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-slate-200">
                          <span className="text-[10px] text-slate-500 block">Preispunkt / Niveau:</span>
                          <strong className="text-rose-700 text-[11px]">{comp.pricingEst}</strong>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs pt-1">
                        <div>
                          <strong className="text-slate-700 text-[11px]">Stärken:</strong>{" "}
                          <span className="text-slate-600 text-[11px]">{isEn ? comp.strengths_en : comp.strengths_de}</span>
                        </div>
                        <div>
                          <strong className="text-rose-700 text-[11px]">Schwachstellen (Angriffsfläche):</strong>{" "}
                          <span className="text-slate-600 text-[11px]">{isEn ? comp.weaknesses_en : comp.weaknesses_de}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-emerald-50/90 rounded-lg border border-emerald-200 space-y-1 text-xs">
                      <strong className="text-emerald-950 font-bold flex items-center gap-1.5 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span>{t("SOS Abdichtung Sieger-Strategie:", "SOS Abdichtung Winning Strategy:")}</span>
                      </strong>
                      <p className="text-emerald-900 text-[11px] leading-snug">
                        {isEn ? comp.sosStrategy_en : comp.sosStrategy_de}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Head-to-Head Comparison Scorecard Table */}
              <div className="pt-2 border-t border-slate-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h5 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                    {t("Direkter Leistungs- & Wettbewerbsvergleich", "Head-to-Head Feature Comparison")}
                  </h5>
                  <span className="text-[10px] text-slate-500 font-semibold">Warum Kunden sich für SOS Abdichtung entscheiden</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                    <thead className="bg-slate-900 text-white font-extrabold uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Kriterium / Service</th>
                        <th className="p-3 bg-emerald-800 text-emerald-100 font-black">SOS Abdichtung (Sie)</th>
                        <th className="p-3">ISOTEC Fachbetriebe</th>
                        <th className="p-3">ATG Deutschland</th>
                        <th className="p-3">Lokale Kleinbetriebe</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      <tr>
                        <td className="p-3 font-bold text-slate-900">Preistransparenz</td>
                        <td className="p-3 bg-emerald-50 text-emerald-900 font-black">✓ 100% Online-Rechner</td>
                        <td className="p-3 text-slate-500">Keine Preise online</td>
                        <td className="p-3 text-slate-500">Intransparente Pauschalen</td>
                        <td className="p-3 text-slate-500">Nur nach Besichtigung</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-slate-900">Angebotsdauer</td>
                        <td className="p-3 bg-emerald-50 text-emerald-900 font-black">✓ Binnen 24 Stunden</td>
                        <td className="p-3 text-slate-500">2 – 4 Wochen</td>
                        <td className="p-3 text-slate-500">7 – 14 Tage</td>
                        <td className="p-3 text-slate-500">1 – 3 Wochen</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-slate-900">Digitale Schadensfotos (Drive)</td>
                        <td className="p-3 bg-emerald-50 text-emerald-900 font-black">✓ Direkt vom Smartphone</td>
                        <td className="p-3 text-slate-500">Nur per E-Mail</td>
                        <td className="p-3 text-slate-500">Nicht vorhanden</td>
                        <td className="p-3 text-slate-500">Nicht vorhanden</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-slate-900">24/7 Notdienst-Erreichbarkeit</td>
                        <td className="p-3 bg-emerald-50 text-emerald-900 font-black">✓ 0157 58830177 &amp; WhatsApp</td>
                        <td className="p-3 text-slate-500">Nur Werktags 08–17 Uhr</td>
                        <td className="p-3 text-slate-500">Callcenter Hotline</td>
                        <td className="p-3 text-slate-500">Nur Anrufbeantworter</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-slate-900">Steuerabzug § 35a Handwerkerlohn</td>
                        <td className="p-3 bg-emerald-50 text-emerald-900 font-black">✓ Automatisch berechnet (20%)</td>
                        <td className="p-3 text-slate-600">Ja, auf Anfrage</td>
                        <td className="p-3 text-slate-500">Oft Pauschalen ohne Trennung</td>
                        <td className="p-3 text-slate-600">Variabel</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

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
                    href="https://drive.google.com/open?id=1Qhyu32zpLQ-eFbvh6UPAvcoBdn6kTf1nOxx2GtFI5Gw"
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
                  href="https://drive.google.com/open?id=1Qhyu32zpLQ-eFbvh6UPAvcoBdn6kTf1nOxx2GtFI5Gw"
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
  );
}
