import type { Faq } from "./seo-pages";

/**
 * One "science chapter" per service area: the physics behind the service,
 * shown layer by layer. Headings and FAQs target the search phrases from the
 * SchimmelPeter Google Ads report (extracted_pdf_keywords.txt) that each
 * area answers best.
 */
export interface ScienceChapter {
  slug: string;
  /** H2 of the chapter, carries the area's search phrase */
  heading: string;
  intro: string;
  /** search phrases this chapter is written for (documentation only) */
  targets: string[];
  faqs: Faq[];
}

export const SCIENCE: Record<string, ScienceChapter> = {
  horizontalsperre: {
    slug: "horizontalsperre",
    heading: "Feuchtes Mauerwerk sanieren: die Physik der Kapillare",
    intro:
      "Aufsteigende Feuchtigkeit ist Kapillarphysik. Je feiner eine Pore, desto höher zieht sie Wasser. Wir zoomen von der Wand bis auf die Porenwand und zeigen, warum die Injektion das Wasser stoppt, den Wasserdampf aber durchlässt.",
    targets: ["feuchte wände trockenlegen", "feuchtes mauerwerk sanieren", "mauertrockenlegung von innen", "feuchte wand trockenlegen"],
    faqs: [
      {
        q: "Wie hoch kann Feuchtigkeit im Mauerwerk aufsteigen?",
        a: "Rechnerisch könnte eine Pore mit einem Mikrometer Radius Wasser mehrere Meter hoch ziehen. In der Praxis begrenzen Verdunstung an der Oberfläche und die unregelmäßige Porenstruktur die Steighöhe, typisch ist ein feuchter Sockel von bis zu etwa einem Meter und mehr. Wie hoch es bei Ihnen ist, zeigt nur die Messung in verschiedenen Höhen.",
      },
      {
        q: "Ist eine Mauertrockenlegung von innen möglich?",
        a: "Ja. Die Horizontalsperre wird per Injektion von innen gesetzt, Aufgraben ist dafür nicht nötig. Das Injektionsmittel macht die Porenwände wasserabweisend, sodass die Kapillare kein Wasser mehr nach oben zieht, während die Wand weiter austrocknen kann.",
      },
    ],
  },
  kellerinnenabdichtung: {
    slug: "kellerinnenabdichtung",
    heading: "Keller von innen abdichten: Schicht für Schicht gegen den Wasserdruck",
    intro:
      "Innen abgedichtet wird auf der Seite, von der das Wasser nicht kommt. Die Abdichtung muss deshalb so fest im Untergrund haften, dass der Wasserdruck aus dem Erdreich sie nicht abdrückt. Scrollen Sie durch den Aufbau.",
    targets: ["keller von innen abdichten", "feuchten keller abdichten", "feuchte kellerwände abdichten", "feuchte kellerwände"],
    faqs: [
      {
        q: "Wie stark drückt Wasser auf eine Kellerwand?",
        a: "Je Meter Wassersäule steigt der Druck um rund 0,1 bar, das sind etwa eine Tonne Last pro Quadratmeter. Eine Innenabdichtung muss diesem Druck von der Rückseite standhalten, deshalb wird sie als mineralische Dichtschlämme fest mit dem vorbereiteten Untergrund verbunden.",
      },
      {
        q: "Kann man feuchte Kellerwände dauerhaft von innen abdichten?",
        a: "Ja, wenn der Untergrund tragfähig vorbereitet ist und die Hohlkehle am Boden-Wand-Anschluss sauber ausgebildet wird. Steigt zusätzlich Feuchte kapillar auf, kombinieren wir die Innenabdichtung mit einer Horizontalsperre. Welche Kombination nötig ist, zeigt die Messung.",
      },
    ],
  },
  schimmelbeseitigung: {
    slug: "schimmelbeseitigung",
    heading: "Schimmel an der Wand: Taupunkt und Oberflächenfeuchte berechnen",
    intro:
      "Schimmel braucht keine nasse Wand, eine dauerhaft feuchte Oberfläche genügt. Entscheidend ist, wie kalt die Wandoberfläche im Verhältnis zur Raumluft ist. Stellen Sie Ihre Werte ein und sehen Sie, ab wann es kritisch wird.",
    targets: ["schimmel entfernen wand", "schimmel in der wohnung", "schimmelbefall mietwohnung", "schimmelbeseitigung", "fachfirma für schimmelbeseitigung"],
    faqs: [
      {
        q: "Ab welcher Luftfeuchtigkeit entsteht Schimmel an der Wand?",
        a: "Maßgeblich ist nicht die Raumluft, sondern die relative Feuchte direkt an der Wandoberfläche. Liegt sie über längere Zeit bei rund 80 Prozent oder mehr, können Schimmelpilze wachsen. Das passiert an kalten Außenwänden schon bei normaler Raumluftfeuchte.",
      },
      {
        q: "Wer ist bei Schimmel in der Mietwohnung verantwortlich?",
        a: "Das hängt von der Ursache ab: Baumängel wie undichte Außenwände oder Wärmebrücken liegen meist beim Vermieter, falsches Heiz- und Lüftungsverhalten beim Mieter. Eine Messung der Oberflächentemperatur und Feuchte schafft hier eine sachliche Grundlage für beide Seiten.",
      },
    ],
  },
  feuchtemessung: {
    slug: "feuchtemessung",
    heading: "Feuchte Wand, was tun? Das Feuchtebild richtig lesen",
    intro:
      "Jede Ursache hinterlässt ein eigenes Muster in der Wand. Wählen Sie ein Schadensbild und sehen Sie, wie die Feuchte verteilt ist, in welcher Tiefe welches Messverfahren misst und was daraus folgt.",
    targets: ["feuchte wand was tun", "schimmel messen", "sachverständiger schimmel", "wasserschaden schimmel gesundheit"],
    faqs: [
      {
        q: "Feuchte Wand, was tun als Erstes?",
        a: "Nicht überstreichen und nicht einfach einen Entfeuchter aufstellen. Zuerst muss klar sein, woher die Feuchte kommt: von unten, von außen, aus einer Leitung oder als Kondensat. Das Feuchtebild und eine Messung in verschiedenen Höhen und Tiefen beantworten genau diese Frage.",
      },
      {
        q: "Wie misst man Schimmel und Feuchte in der Wand?",
        a: "Kapazitive Geräte zeigen schnell, wo die Wand oberflächennah feucht ist. Für den tatsächlichen Wassergehalt im Baustoff wird eine Probe entnommen und per CM-Messung oder Darr-Verfahren bestimmt. Schimmelbefall wird zusätzlich über Sichtprüfung und bei Bedarf über Proben bewertet.",
      },
    ],
  },
  rissverpressung: {
    slug: "rissverpressung",
    heading: "Risse im Keller abdichten: vom Packer bis zur gefüllten Rissflanke",
    intro:
      "Ein wasserführender Riss muss über die ganze Wanddicke gefüllt werden, nicht nur an der Oberfläche. Scrollen Sie durch den Querschnitt: Bohren, Packer setzen, Harz einpressen, bis es an der nächsten Öffnung austritt.",
    targets: ["keller risse abdichten", "feuchte kellerwände sanieren", "nasse kellerwände sanieren"],
    faqs: [
      {
        q: "Welches Harz wird für Risse im Keller verwendet?",
        a: "Für wasserführende Risse, die sich noch bewegen, eignen sich elastische Polyurethanharze, teils als schnell aufschäumendes Harz zum ersten Stoppen des Wassers. Soll der Riss kraftschlüssig geschlossen werden, kommt Epoxidharz zum Einsatz. Welches passt, entscheidet die Rissaufnahme.",
      },
      {
        q: "Reicht es, einen Riss im Keller zuzuspachteln?",
        a: "Bei einem trockenen Haarriss manchmal ja, bei einem wasserführenden Riss nicht. Spachtelmasse schließt nur die Oberfläche, das Wasser läuft im Riss weiter und drückt sie heraus. Die Verpressung füllt den Riss über die gesamte Bauteildicke.",
      },
    ],
  },
  kellersanierung: {
    slug: "kellersanierung",
    heading: "Schimmel im Keller: vier Ursachen im Querschnitt",
    intro:
      "Schimmel im Keller ist fast immer die Folge von Feuchte, und die hat im Keller vier typische Wege ins Mauerwerk. Tippen Sie auf eine Stelle im Querschnitt, um Ursache, Anzeichen und Lösung zu sehen.",
    targets: ["schimmel im keller", "schimmel im keller was tun", "feuchter keller", "keller trockenlegen", "feuchte kellerwände sanieren"],
    faqs: [
      {
        q: "Schimmel im Keller, was tun?",
        a: "Befall nicht trocken abbürsten, damit sich keine Sporen verteilen, und die Ursache klären lassen. Im Keller steckt dahinter meist eine defekte Horizontalsperre, eine undichte Außenabdichtung, fehlende Drainage oder ein Riss, im Sommer auch Kondensat durch warme Außenluft. Erst wenn die Feuchtequelle beseitigt ist, lohnt die Schimmelsanierung.",
      },
      {
        q: "Warum ist der Keller im Sommer feucht?",
        a: "Warme Sommerluft enthält viel Wasserdampf. Kühlt sie an den kalten Kellerwänden ab, fällt Kondensat aus, obwohl die Wand selbst dicht ist. Dann hilft richtiges Lüften zu kühlen Tageszeiten, während Feuchte aus dem Mauerwerk eine Abdichtung braucht. Die Messung trennt beides.",
      },
    ],
  },
};
