/**
 * The chemistry behind each service, as it actually runs on site.
 * Formulae are written as plain strings with a tiny markup: `_n` is a
 * subscript, `^n` a superscript, so the renderer can set them properly
 * without pulling in a maths library for six equations.
 */
export interface Reaction {
  /** what the step is called on site */
  stage: string;
  equation: string;
  /** what the equation means for the wall */
  note: string;
}

export interface ChemEntry {
  slug: string;
  service: string;
  /** the question the chemistry answers */
  heading: string;
  intro: string;
  reactions: Reaction[];
  /** the measurable consequence, with its number */
  outcome: { value: string; label: string };
}

export const CHEMISTRY: ChemEntry[] = [
  {
    slug: "horizontalsperre",
    service: "Horizontalsperre",
    heading: "Warum die Kapillare das Wasser loslässt",
    intro:
      "Das Injektionsmittel ist ein Silan-Siloxan-Gemisch. Im feuchten Mauerwerk reagiert es mit genau dem Wasser, das dort das Problem ist, und kleidet die Porenwand mit einem wasserabweisenden Film aus.",
    reactions: [
      {
        stage: "Hydrolyse",
        equation: "R–Si(OC_2H_5)_3 + 3 H_2O → R–Si(OH)_3 + 3 C_2H_5OH",
        note: "Das Silan spaltet im Porenwasser seine Ethoxygruppen ab. Ohne Feuchte im Mauerwerk läuft diese Reaktion nicht — deshalb wird in die nasse Wand injiziert, nicht in die trockene.",
      },
      {
        stage: "Kondensation",
        equation: "2 R–Si(OH)_3 → R–Si(OH)_2–O–Si(OH)_2–R + H_2O",
        note: "Die Silanole vernetzen zu einem Polysiloxan, das sich chemisch an das Silikat der Porenwand bindet. Es verstopft die Pore nicht, es macht sie unbenetzbar.",
      },
      {
        stage: "Folge",
        equation: "h = 2 γ cos θ ⁄ (ρ g r),  θ > 90° ⇒ cos θ < 0",
        note: "In der Kapillargleichung kippt der Randwinkel über 90°. Die Steighöhe wird negativ: Wasser wird nicht mehr hochgezogen, sondern abgewiesen. Wasserdampf passiert weiter, die Wand trocknet aus.",
      },
    ],
    outcome: { value: "> 90°", label: "Randwinkel nach der Behandlung" },
  },
  {
    slug: "kellerinnenabdichtung",
    service: "Kellerinnenabdichtung",
    heading: "Wie die Dichtschlämme mit dem Untergrund verwächst",
    intro:
      "Eine mineralische Dichtungsschlämme wird nicht aufgeklebt, sie kristallisiert in den Untergrund hinein. Deshalb hält sie dem Wasserdruck auch von der Rückseite stand.",
    reactions: [
      {
        stage: "Hydratation",
        equation: "2 Ca_3SiO_5 + 7 H_2O → 3 CaO·2 SiO_2·4 H_2O + 3 Ca(OH)_2",
        note: "Der Zementklinker bildet CSH-Phasen: nadelförmige Kristalle, die in die Poren des Untergrunds wachsen und mechanisch verzahnen.",
      },
      {
        stage: "Carbonatisierung",
        equation: "Ca(OH)_2 + CO_2 → CaCO_3 + H_2O",
        note: "Das freie Calciumhydroxid reagiert mit Kohlendioxid zu Calciumcarbonat und dichtet Restporen nach. Die Schicht wird mit der Zeit dichter, nicht durchlässiger.",
      },
    ],
    outcome: { value: "≈ 1 t/m²", label: "Rückseitiger Druck je Meter Wassersäule" },
  },
  {
    slug: "rissverpressung",
    service: "Rissverpressung",
    heading: "Ein Harz, das das eindringende Wasser als Treibmittel nutzt",
    intro:
      "Im wasserführenden Riss ist Nässe kein Hindernis, sondern der Reaktionspartner: Das Polyurethanharz schäumt genau dort auf, wo Wasser steht, und presst sich in die Rissflanken.",
    reactions: [
      {
        stage: "Treibreaktion",
        equation: "R–N=C=O + H_2O → R–NH_2 + CO_2↑",
        note: "Isocyanat und Wasser bilden ein Amin und Kohlendioxid. Das Gas treibt den Schaum auf ein Vielfaches seines Volumens und drückt ihn in jede Verästelung des Risses.",
      },
      {
        stage: "Vernetzung",
        equation: "R–N=C=O + R′–NH_2 → R–NH–CO–NH–R′",
        note: "Das Amin reagiert sofort weiter zu Polyharnstoff. Der Schaum wird zäh-elastisch und bleibt es: Er nimmt Bewegungen des Bauteils auf, statt erneut zu reißen.",
      },
    ],
    outcome: { value: "bis 30×", label: "Volumenzunahme beim Aufschäumen" },
  },
  {
    slug: "feuchtemessung",
    service: "Feuchtemessung",
    heading: "Die CM-Messung: Feuchte, die man wiegen kann",
    intro:
      "Elektrische Messgeräte zeigen einen Widerstand, der auch von Salz abhängt. Für den belastbaren Wert nehmen wir eine Probe und rechnen sie über eine Gasreaktion in Masseprozent um.",
    reactions: [
      {
        stage: "Carbid-Methode",
        equation: "CaC_2 + 2 H_2O → C_2H_2↑ + Ca(OH)_2",
        note: "Calciumcarbid reagiert mit der gesamten freien Feuchte der Probe zu Acetylen. Der Gasdruck in der Stahlflasche ist der Feuchtegehalt — unabhängig davon, wie versalzen die Wand ist.",
      },
      {
        stage: "Salzsprengung",
        equation: "Na_2SO_4 + 10 H_2O ⇌ Na_2SO_4·10 H_2O",
        note: "Warum Salz überhaupt zählt: Glaubersalz nimmt beim Kristallisieren rund das Dreifache an Volumen ein. Dieser Kristallisationsdruck sprengt Putz ab — die Ursache hinter abplatzenden Flächen.",
      },
    ],
    outcome: { value: "Masse-%", label: "Einheit, auf die das Protokoll sich bezieht" },
  },
  {
    slug: "schimmelbeseitigung",
    service: "Schimmelbeseitigung",
    heading: "Schimmel ist keine Reaktion, sondern eine Bedingung",
    intro:
      "Sporen sind in jeder Raumluft. Ob sie keimen, entscheidet allein das Wasserangebot an der Oberfläche — und das ist eine Frage der Temperatur dieser Oberfläche.",
    reactions: [
      {
        stage: "Phasenübergang",
        equation: "H_2O(g) → H_2O(l)  bei  ϑ_Oberfläche ≤ ϑ_Taupunkt",
        note: "Unterschreitet die Wandoberfläche den Taupunkt der Raumluft, kondensiert Wasser aus. Bei 20 °C und 50 % relativer Feuchte liegt dieser Punkt bei 9,3 °C.",
      },
      {
        stage: "Keimbedingung",
        equation: "a_w ≥ 0,80",
        note: "Ab einer Wasseraktivität von etwa 0,8 — rund 80 % relativer Feuchte direkt an der Oberfläche — keimen die ersten Arten. Deshalb wird die Oberflächentemperatur angehoben, nicht nur die Fläche gereinigt.",
      },
    ],
    outcome: { value: "12,6 °C", label: "Kritische Oberflächentemperatur im Beispiel" },
  },
  {
    slug: "kellersanierung",
    service: "Kellersanierung",
    heading: "Der Sanierputz: ein Speicher, kein Deckel",
    intro:
      "Nach der Abdichtung bleiben Salze in der Wand. Ein Sanierputz nach WTA verschließt sie nicht, er gibt ihnen Platz — sonst kommen sie an der Oberfläche wieder heraus.",
    reactions: [
      {
        stage: "Porengefüge",
        equation: "Luftporengehalt ≥ 25 Vol-%,  w ≤ 0,2 kg/(m²·√h)",
        note: "Ein Viertel des Putzvolumens ist Luftpore. Die Salze kristallisieren in diesem Hohlraum aus, statt die Oberfläche abzusprengen; der Wasseraufnahmekoeffizient hält Flüssigwasser draußen.",
      },
      {
        stage: "Dampfdiffusion",
        equation: "s_d = μ · d ≤ 0,2 m",
        note: "Gleichzeitig bleibt der Putz diffusionsoffen: Wasserdampf verlässt die Wand weiter nach innen. Die Wand trocknet durch den Putz hindurch aus.",
      },
    ],
    outcome: { value: "≥ 25 Vol-%", label: "Luftporen im Sanierputz nach WTA" },
  },

  {
    slug: "dachabdichtung",
    service: "Dachabdichtung",
    heading: "Warum eine Schwei\u00dfnaht h\u00e4lt und ein Flicken nicht",
    intro:
      "Elastomerbitumen ist Bitumen, das mit SBS-Kautschuk modifiziert wurde. Beim Verschwei\u00dfen schmelzen beide Bahnen oberfl\u00e4chlich auf und erstarren als ein einziges Material \u2013 es gibt danach keine Fuge mehr, die altern k\u00f6nnte.",
    reactions: [
      {
        stage: "Modifikation",
        equation: "Bitumen + SBS \u2192 Elastomerbitumen (elastisch bis \u221220 \u00b0C)",
        note: "Der Styrol-Butadien-Kautschuk bildet im Bitumen ein elastisches Netzwerk. Die Bahn bleibt im Winter flexibel, statt zu verspr\u00f6den und zu rei\u00dfen.",
      },
      {
        stage: "Verschwei\u00dfen",
        equation: "T \u2248 180 \u00b0C: Deckschicht schmilzt \u2192 homogene Naht",
        note: "Unter der Flamme verfl\u00fcssigen sich beide F\u00fcgefl\u00e4chen und flie\u00dfen ineinander. Nach dem Erkalten ist die Naht so dicht wie die Fl\u00e4che \u2013 ein aufgeklebter Flicken hat diese Verbindung nie.",
      },
    ],
    outcome: { value: "2 Lagen", label: "vollfl\u00e4chig verschwei\u00dft, Naht = Fl\u00e4che" },
  },
  {
    slug: "balkon-terrasse",
    service: "Balkon & Terrasse",
    heading: "Eine Haut ohne Naht: die Polymerisation auf der Fl\u00e4che",
    intro:
      "Fl\u00fcssigkunststoff wird als Fl\u00fcssigkeit aufgetragen und h\u00e4rtet direkt auf dem Balkon zur Membran aus. Die Reaktion passiert vor Ort \u2013 deshalb gibt es keine Naht, keine Fuge und keinen Anschluss, der undicht werden k\u00f6nnte.",
    reactions: [
      {
        stage: "Initiierung",
        equation: "Peroxid \u2192 2 Radikale (Start der Kettenreaktion)",
        note: "Ein Katalysatorpulver wird einger\u00fchrt und zerf\u00e4llt in Radikale. Ab jetzt l\u00e4uft die Reaktion von selbst \u2013 auch bei K\u00e4lte, deshalb ist das Verfahren fast ganzj\u00e4hrig einsetzbar.",
      },
      {
        stage: "Polymerisation",
        equation: "n MMA \u2192 PMMA (fl\u00fcssig \u2192 elastische Membran)",
        note: "Die Monomere verketten sich binnen ~45 Minuten zu Polymethylmethacrylat. Mit Vlies armiert entsteht eine rissue\u0308berbr\u00fcckende Haut, die an T\u00fcr und Gel\u00e4nderfu\u00df einfach mit hochgezogen wird.",
      },
    ],
    outcome: { value: "0 N\u00e4hte", label: "eine fugenlose Membran, regenfest in Stunden" },
  },
  {
    slug: "sockelabdichtung",
    service: "Sockelabdichtung",
    heading: "Vom Emulsionsanstrich zum geschlossenen Film",
    intro:
      "Die Bitumen-Dickbeschichtung kommt als w\u00e4ssrige Emulsion auf den Sockel: Milliarden Bitumentr\u00f6pfchen in Wasser. Erst auf der Wand bricht die Emulsion \u2013 und aus dem Anstrich wird eine geschlossene Abdichtung.",
    reactions: [
      {
        stage: "Brechen der Emulsion",
        equation: "Bitumen\u00b7H\u2082O (Emulsion) \u2192 Bitumenfilm + H\u2082O\u2191",
        note: "Das Wasser verdunstet und wird vom Untergrund aufgesaugt; die Bitumenpartikel r\u00fccken zusammen und verschmelzen zu einem porenfreien Film von mehreren Millimetern.",
      },
      {
        stage: "Spritzwasserzone",
        equation: "Schutzh\u00f6he \u2265 30 cm \u00fcber Gel\u00e4nde",
        note: "Die Norm verlangt die Abdichtung bis mindestens 30 Zentimeter \u00fcber die Gel\u00e4ndeoberkante \u2013 so hoch spritzt Regen vom Pflaster zur\u00fcck an die Wand.",
      },
    ],
    outcome: { value: "\u2265 30 cm", label: "abgedichtete Spritzwasserzone \u00fcber Gel\u00e4nde" },
  },
];
