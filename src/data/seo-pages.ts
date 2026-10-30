export interface PageSection { heading: string; paragraphs: string[]; bullets?: string[] }
export interface Faq { q: string; a: string }
export interface LayerNote { name: string; text: string }

export interface ServicePage {
  slug: string;
  navTitle: string;
  /** the service exactly as it is named in the Google Business Profile */
  serviceName: string;
  keyword: string;
  title: string;
  metaDescription: string;
  h1: string;
  lede: string;
  symptoms: string[];
  layers: LayerNote[];
  sections: PageSection[];
  steps: { title: string; text: string }[];
  faqs: Faq[];
  related: string[];
}

export interface CityPage {
  slug: string;
  name: string;
  keyword: string;
  title: string;
  metaDescription: string;
  h1: string;
  lede: string;
  plz: string[];
  districts: string[];
  geo: { lat: number; lng: number };
  responseTime: string;
  localFactors: LayerNote[];
  sections: PageSection[];
  faqs: Faq[];
  nearby: string[];
  /** the city's Wikipedia article: links the page's City node to the known entity */
  wiki?: string;
  /**
   * The services as they are done in this city, each a card with its own anchor
   * (#slug). Service pages link here with "<Leistung> <Stadt>", so a search such
   * as "Rissverpressung Essen" lands on the city page, not on the home page.
   */
  localServices?: { slug: string; heading: string; text: string }[];
  /** the city's districts grouped by area, each with what is typical for its cellars */
  districtGroups?: { name: string; districts: string[]; text: string }[];
}

export const SERVICE_PAGES: ServicePage[] = [
  // 1. Kellersanierung
  {
    slug: "kellersanierung",
    serviceName: "Kellersanierung von innen (ohne Aufgraben)",
    navTitle: "Kellersanierung",
    keyword: "Feuchte Kellerwände sanieren",
    title: "Feuchte Kellerwände sanieren | Kellersanierung von innen",
    metaDescription:
      "Feuchte Kellerwände sanieren ohne Aufgraben: Ursache messen, Keller von innen trockenlegen, Festpreis, 10 Jahre Garantie auf die Arbeit. Messung kostenlos.",
    h1: "Feuchte Kellerwände sanieren: den Keller von innen trockenlegen, ohne Aufgraben",
    lede:
      "Ob muffiger Geruch, Salzränder oder Schimmel in der Ecke: Ein feuchter Keller hat fast immer eine messbare Ursache. Wir finden sie und sanieren von innen, damit Garten, Einfahrt und Pflaster unberührt bleiben.",
    symptoms: [
      "Muffiger, modriger Geruch im Keller und im Treppenhaus",
      "Dunkle Feuchteränder im unteren Wandbereich",
      "Weiße Salzausblühungen und sandender, abplatzender Putz",
      "Schimmelflecken an Wänden, Kartons und gelagerten Möbeln",
      "Wasser am Boden-Wand-Anschluss nach starkem Regen",
      "Rostende Regale und Wäsche, die im Keller nicht trocknet",
    ],
    layers: [
      {
        name: "Bodenplatte und Wandfuß",
        text: "Am Übergang von Kellerboden zu Wand dringt Wasser am häufigsten ein, deshalb bilden wir hier eine Hohlkehle aus Sperrmörtel.",
      },
      {
        name: "Horizontalsperre",
        text: "Eine injizierte Sperrschicht im unteren Mauerwerk unterbricht den kapillaren Wassertransport nach oben.",
      },
      {
        name: "Mineralische Dichtungsschlämme",
        text: "Die Dichtungsschlämme auf der Innenseite hält Feuchte zurück, die seitlich aus dem Erdreich durch die Wand drückt.",
      },
      {
        name: "Sanierputz",
        text: "Der poröse Sanierputz lagert verbliebene Salze ein, ohne abzuplatzen, und lässt die Wand weiter austrocknen.",
      },
      {
        name: "Raumluft",
        text: "Richtiges Lüften und bei Bedarf eine Schutzentfeuchtung verhindern, dass sich Kondensat an den kühlen Kellerwänden niederschlägt.",
      },
    ],
    sections: [
      {
        heading: "Warum Keller in Wuppertal so oft feucht sind",
        paragraphs: [
          "Wuppertal liegt im engen Tal der Wupper, und viele Häuser stehen an Hängen, die zur Talsohle hin abfallen. Regenwasser versickert oberhalb der Gebäude, läuft als Hang- und Schichtenwasser durch den Boden und trifft bergseitig direkt auf die Kellerwand. Dazu kommt ein großer Bestand an Gründerzeithäusern in Elberfeld und Barmen, deren Keller aus Bruchstein oder Ziegel gemauert wurden, ohne Abdichtung nach heutigem Verständnis. Eine Horizontalsperre fehlt dort meistens ganz, oder die alte Bitumenpappe in der Fuge hat längst ihre Wirkung verloren.",
          "Das Ergebnis ist fast immer eine Mischung aus mehreren Feuchtequellen: Wasser steigt kapillar aus dem Fundament auf, dringt seitlich durch die erdberührte Wand ein und schlägt sich im Sommer als Kondensat an den kühlen Flächen nieder. Wer nur eine dieser Ursachen behandelt, etwa mit einem neuen Anstrich oder einem Luftentfeuchter, hat nach wenigen Monaten wieder dieselben Flecken. Eine dauerhafte Kellersanierung beginnt deshalb mit der Frage, welcher Anteil der Nässe woher kommt, und diese Frage beantwortet nur eine Messung im Mauerwerk.",
        ],
      },
      {
        heading: "Vier typische Ursachen für einen nassen Keller",
        paragraphs: [
          "Hinter einem nassen Keller steckt selten nur ein einzelner Fehler. Häufig hat die Kapillarwassersperre versagt, also die waagerechte Sperrschicht im Mauerwerk, die meist aus Bitumen oder Kunststoff besteht und Bodenfeuchte am Aufsteigen hindern soll. Ebenso oft ist die Vertikalsperre undicht geworden. Sie schützt die erdberührten Kellerwände vor Feuchte, die seitlich aus dem Erdreich eindringt, und besteht aus Beschichtungen oder Dichtungsbahnen auf der Außenseite. Beide Schichten altern mit der Zeit, und in vielen alten Kellern wurden sie nie nach heutigem Verständnis eingebaut.",
          "Die dritte Ursache ist ein fehlerhaftes oder fehlendes Drainagesystem. Drainagerohre und Drainagematten rund um das Fundament leiten Niederschlagswasser von den Kellerwänden ab und senken den Wasserdruck deutlich. Fehlen sie oder sind sie defekt, steht das Wasser direkt an der Wand. Viertens lassen Risse und undichte Stellen in Wänden und Boden Feuchte gezielt eindringen. Welche dieser Ursachen bei Ihnen zusammenkommen, zeigt die Außen- und Innenbesichtigung mit genauen Messungen. Davon hängt ab, welche Maßnahmen Ihr Keller wirklich braucht und welche Sie sich sparen können.",
        ],
        bullets: [
          "Defekte Kapillarwassersperre aus Bitumen oder Kunststoff",
          "Undichte Vertikalsperre gegen seitlich eindringende Feuchte",
          "Fehlerhaftes oder fehlendes Drainagesystem am Fundament",
          "Risse und undichte Stellen in Kellerwänden und Boden",
        ],
      },
      {
        heading: "Sanierung von innen statt Außenaufgrabung",
        paragraphs: [
          "Fachlich betrachtet ist eine vollständige Außenabdichtung oft die wirksamste Methode, denn sie hält das Wasser dort auf, wo es ankommt. Dafür muss aber das Erdreich rund um das Haus bis zum Fundament ausgehoben werden. In Wuppertal heißt das oft: Reihenhaus mit Nachbarwand, Hanglage mit Stützmauer, Vorgarten mit Treppe und gepflasterte Einfahrt. Wo Aufgraben nicht möglich oder unverhältnismäßig ist, sind Innenabdichtung und Injektion die bewährte Alternative. Welcher Weg der richtige ist, entscheidet die Messung. Bei der Innensanierung bleibt draußen alles so, wie es ist.",
          "Gegenüber einer Außenaufgrabung sparen Sie auf diesem Weg bis zu 60 Prozent der Kosten. Das liegt nicht an billigeren Materialien, sondern am Wegfall von Bagger, Verbau, Entsorgung und Wiederherstellung der Außenanlagen. Wichtig ist, dass die Innensanierung als System geplant wird. Eine Innenabdichtung allein hält zwar das Wasser aus dem Raum, das Mauerwerk dahinter bleibt aber nass. Erst zusammen mit einer Horizontalsperre und abgedichteten Anschlüssen an den Querwänden entsteht ein trockener, dauerhaft nutzbarer Keller.",
        ],
        bullets: [
          "Keine Erdarbeiten, Garten und Einfahrt bleiben unberührt",
          "Bis zu 60 Prozent günstiger als eine Außenaufgrabung",
          "Verbindliches Festpreisangebot nach der Messung",
          "25 Jahre Produktgarantie des Herstellers SchimmelPeter GmbH",
          "10 Jahre Garantie von sos-abdichtung auf die ausgeführten Arbeiten",
        ],
      },
      {
        heading: "Wasserschaden im Keller nach Starkregen: erst messen, dann trocknen",
        paragraphs: [
          "Läuft der Keller nach einem Rohrbruch oder einem Starkregen voll, stehen zuerst Abpumpen und Ausräumen an. Diese akute Wasserschadensanierung übernehmen wir nicht, dafür sind Notdienst und Trocknungsfirmen zuständig. Danach kommt die eigentliche Frage: Ist die Wand nur oberflächlich nass geworden und trocknet mit guter Lüftung und technischer Trocknung wieder ab, oder hat das Ereignis einen Schaden sichtbar gemacht, der schon lange bestand? Diese Unterscheidung treffen wir mit der Feuchtemessung vor Ort, bevor Geld in Trocknungsgeräte oder neuen Putz fließt.",
          "Zeigt die Messung, dass das Mauerwerk auch in der Tiefe durchfeuchtet ist und Salze enthält, reicht Trocknen allein nicht aus. Dann wird die Trocknung Teil der Kellersanierung: Wir entfernen durchnässten Putz, bauen bei Bedarf eine Horizontalsperre ein und begleiten die Austrocknung mit einer Schutzentfeuchtung, bis der Sanierputz aufgebracht werden kann. Die Messwerte halten wir schriftlich fest. Das schafft Klarheit über den Zustand vor der Sanierung und hilft auch im Gespräch mit Ihrer Versicherung.",
        ],
      },
    ],
    steps: [
      {
        title: "Schadensanalyse mit Feuchtemessung",
        text: "Herr Mahmood besichtigt Haus und Keller außen und innen, misst kostenlos und unverbindlich die Feuchte im Mauerwerk und ermittelt die genaue Ursache.",
      },
      {
        title: "Verbindliches Angebot",
        text: "Auf Basis der Analyse erhalten Sie ein verbindliches Angebot, aus dem hervorgeht, welche Wand welche Maßnahme braucht, ohne versteckte Mehrkosten.",
      },
      {
        title: "Sanierungsplan und Sanierung",
        text: "Nach Ihrem Auftrag legen wir gemeinsam die Reihenfolge von Horizontalsperre, Hohlkehle, Innenabdichtung und Sanierputz fest und sanieren dann von innen.",
      },
      {
        title: "Gemeinsame Abnahme",
        text: "Nach der Sanierung nehmen Sie die Arbeiten gemeinsam mit uns ab. Wir übergeben die Baustelle sauber und begleiten die Austrocknung bei Bedarf mit einer Schutzentfeuchtung.",
      },
    ],
    faqs: [
      {
        q: "Wie lange dauert eine Kellersanierung in einem Wuppertaler Altbau?",
        a: "Das hängt von der Zahl der betroffenen Wände und vom Durchfeuchtungsgrad ab. Die eigentlichen Abdichtungsarbeiten sind in einem üblichen Einfamilienhauskeller meist in wenigen Tagen erledigt. Länger dauert die Austrocknung des Mauerwerks danach, die wir mit Sanierputz und bei Bedarf einer Schutzentfeuchtung begleiten.",
      },
      {
        q: "Reicht ein Luftentfeuchter gegen den feuchten Keller?",
        a: "Ein Luftentfeuchter senkt die Luftfeuchte im Raum und hilft gegen Kondensat. Gegen Wasser, das aus dem Erdreich in die Wand eindringt, ist er wirkungslos, weil die Wand ständig Feuchte nachliefert. Ob Ihr Problem Kondensat oder eindringende Nässe ist, klärt die Messung vor Ort.",
      },
      {
        q: "Kann ich den Keller nach der Sanierung als Wohnraum nutzen?",
        a: "Ein fachgerecht abgedichteter und verputzter Keller ist trocken genug für Hobbyraum, Büro oder Lager. Für einen Aufenthaltsraum im baurechtlichen Sinn gelten zusätzliche Anforderungen an Belichtung, Raumhöhe und Wärmeschutz. Das sollten Sie vorab mit Ihrem Architekten oder der Bauaufsicht klären.",
      },
      {
        q: "Was kostet es, einen Keller trockenzulegen?",
        a: "Die Kosten richten sich nach Wandbaustoff, Mauerstärke, Länge der betroffenen Wände und Durchfeuchtungsgrad. Pauschale Meterpreise wären unseriös, weil ein Bruchsteinkeller in Barmen anders zu behandeln ist als ein Betonkeller aus den Siebzigerjahren. Nach der kostenlosen Messung erhalten Sie ein verbindliches Festpreisangebot.",
      },
    ],
    related: ["horizontalsperre", "kellerinnenabdichtung", "feuchtemessung"],
  },

  // 2. Horizontalsperre
  {
    slug: "horizontalsperre",
    serviceName: "Horizontalsperre im Injektionsverfahren",
    navTitle: "Horizontalsperre",
    keyword: "Feuchte Wände trockenlegen",
    title: "Feuchte Wände trockenlegen | Horizontalsperre per Injektion",
    metaDescription:
      "Feuchte Wände trockenlegen ohne Aufgraben: Horizontalsperre per SchimmelPeter-Injektion, keine Vortrocknung, 10 Jahre Garantie auf die Arbeit.",
    h1: "Feuchte Wände trockenlegen mit einer Horizontalsperre im Injektionsverfahren",
    lede:
      "Steigt Feuchtigkeit aus dem Fundament im Mauerwerk auf, hilft kein Anstrich und kein neuer Putz. Mit der Injektion von SchimmelPeter erneuern wir eine defekte Horizontalsperre direkt in der Wand, ohne aufwendige Erdarbeiten und in der Regel ohne Vortrocknung.",
    symptoms: [
      "Feuchtezone, die vom Boden aus nach oben zieht und in einer deutlichen Linie endet",
      "Weiße, kristalline Salzausblühungen im unteren Wandbereich",
      "Putz, der sandet, hohl klingt oder in Schollen abfällt",
      "Abblätternde Farbe und aufquellende Tapeten im Erdgeschoss",
      "Mürbe, bröselnde Fugen im Ziegel- oder Bruchsteinmauerwerk",
    ],
    layers: [
      {
        name: "Fundament und Erdreich",
        text: "Aus dem feuchten Erdreich unter dem Haus saugt das Mauerwerk über seine feinen Kapillaren Wasser an und leitet es nach oben.",
      },
      {
        name: "Bohrlochreihe",
        text: "Im feuchten Mauerwerk setzen wir Bohrlöcher im Abstand von bis zu 20 cm und bringen eine genau berechnete Menge Injektionsmittel ein.",
      },
      {
        name: "Injektionszone",
        text: "Der in Paraffin gelöste Kunststoff verteilt sich vollständig in der Injektionszone und wirkt im Mauerwerk wie ein flüssiger Schutzschild.",
      },
      {
        name: "Wasserabweisende Sperrschicht",
        text: "Das Polymer verbindet sich hydrophob mit den Kapillarwänden. Die Schicht ist nur wenige Moleküle dick, deshalb bleiben die Poren offen.",
      },
      {
        name: "Mauerwerk oberhalb",
        text: "Ohne Nachschub von unten trocknet die Wand aus. Mit der Feuchtigkeit verdunstet das Paraffinöl, und die natürliche Wärmedämmfähigkeit kehrt zurück.",
      },
    ],
    sections: [
      {
        heading: "Ursachen feuchter Wände und wie aufsteigende Feuchte entsteht",
        paragraphs: [
          "Feuchte Wände haben ganz unterschiedliche Ursachen. Häufig sind es Schäden am Dach, undichte Wasser- oder Abwasserleitungen, eine unzureichende Drainage oder Kondenswasser in schlecht belüfteten oder schlecht gedämmten Räumen. Eine Horizontalsperre hilft gegen eine ganz bestimmte Ursache: kapillar aufsteigende Feuchtigkeit aus dem Fundament, die vor allem altes, poröses Mauerwerk betrifft. Deshalb steht am Anfang jeder Sanierung eine Schadensanalyse. Erst wenn feststeht, dass die Nässe tatsächlich von unten kommt, ist die Injektion die richtige Maßnahme und kein teurer Versuch ins Blaue.",
          "Beim Neubau wird unter dem Mauerwerk eine Horizontalsperre eingebaut, die in der DIN 18533 Querschnittsabdichtung heißt. Sie soll verhindern, dass Feuchtigkeit aus dem Erdreich in der Wand nach oben wandert. Denn Mauerwerk aus Ziegel, Kalksandstein oder Naturstein ist von feinen Kapillaren durchzogen, die Wasser ähnlich wie ein Docht ansaugen. Fehlt diese Sperre oder hat die alte Bitumenpappe in der Fuge ihre Wirkung verloren, steigt die Feuchte ungehindert auf. Wie hoch, hängt vom Porengefüge, von der Verdunstung an der Oberfläche und vom Salzgehalt ab.",
          "Mit dem Wasser wandern gelöste Salze aus Boden und Baustoff in die Wand. Wo das Wasser an der Oberfläche verdunstet, bleiben sie zurück und kristallisieren. Diese Kristalle brauchen mehr Platz, als die Poren bieten, sprengen den Putz ab und zerstören nach und nach auch Fugen und Steine. Außerdem ziehen die Salze Feuchtigkeit aus der Raumluft an. Deshalb bleibt eine versalzene Wand auch dann feucht, wenn der Nachschub von unten längst gestoppt wäre.",
        ],
      },
      {
        heading: "Anzeichen und Folgen einer defekten Horizontalsperre",
        paragraphs: [
          "Eine defekte Sperrschicht zeigt sich meist an einem typischen Schadensbild in Bodennähe. Für die Einordnung hilft eine einfache Regel: Steigt die Feuchtigkeit gleichmäßig von unten nach oben, spricht das für kapillar aufsteigende Feuchte und damit für eine defekte oder fehlende Horizontalsperre. Einzelne, klar begrenzte Feuchtstellen deuten dagegen eher auf ein undichtes Rohr oder auf Wasser, das von außen eindringt. Sicher beurteilen lässt sich das allerdings erst mit Feuchte- und Materialmessungen im Mauerwerk, nicht allein mit dem Auge.",
          "Bleibt die Sperre unsaniert, zieht das Wasser immer weiter nach oben, und die feuchten Zonen wachsen. Die mitgeführten Salze kristallisieren beim Austrocknen aus und sprengen den Putz ab. Im Winter gefriert Wasser in den Poren und verursacht Abplatzungen und Risse, durch die noch mehr Feuchte eindringt. Dauerhaft nasse Wände bieten Schimmel ideale Bedingungen, und die Sporen belasten die Raumluft. Dazu kommt ein muffiger Geruch, der sich auch durch Lüften nicht vertreiben lässt.",
          "Oft unterschätzt wird der Energieverlust. Nasses Mauerwerk dämmt deutlich schlechter als trockenes: Schon 5 % Feuchte im Baustoff können den Wärmedämmwert um bis zu 50 % verschlechtern. Die Folge sind kühle Wände trotz Heizung und höhere Heizkosten. Nicht zuletzt verliert die Immobilie an Wert, denn bei Verkauf oder Vermietung wird ein feuchter Keller schnell zum Ausschlusskriterium. Je früher Sie die Ursache klären lassen, desto kleiner bleiben Schaden und Trocknungszeit und desto günstiger fällt die Sanierung aus.",
        ],
        bullets: [
          "Dunkle, feuchte Ränder oder Flecken, vor allem in Bodennähe",
          "Salzausblühungen als weiße, kristalline Ablagerungen auf Putz oder Ziegel",
          "Abblätternde Farbe und aufgequollener Putz",
          "Muffiger Geruch oder ein dauerhaft kühles, klammes Kellerklima",
          "Schimmel an Sockelleisten oder hinter Möbeln",
          "Messbar erhöhte Feuchte im Mauerwerk unterhalb des Erdgeschosses",
        ],
      },
      {
        heading: "Mauerwerkstrockenlegung: so wirkt die SchimmelPeter-Injektion",
        paragraphs: [
          "Als SchimmelPeter® Partnerbetrieb erneuern wir defekte Horizontalsperren ohne aufwendige Erdarbeiten. Dazu setzen wir im feuchten Mauerwerk eine Reihe von Bohrlöchern im Abstand von bis zu 20 cm. In diese Bohrlöcher bringen wir eine genau berechnete Menge Injektionsmittel ein. Der Wirkstoff ist ein in Paraffin gelöster Kunststoff, der sich im Mauerwerk wie ein flüssiger Schutzschild verhält. Wie viel Material eine Wand braucht, ermitteln wir vorher bei der Schadensanalyse, denn Baustoff, Wandstärke und Durchfeuchtung unterscheiden sich von Haus zu Haus.",
          "Im Mauerwerk verteilt sich das Mittel vollständig innerhalb der Injektionszone. Dort verbindet es sich als hydrophobes, also wasserabweisendes Polymer mit den Kapillarwänden des Baustoffs. So entsteht eine neue, wasserabweisende Sperrschicht, an der das von unten aufsteigende Wasser nicht mehr vorbeikommt. Die aufsteigende Feuchtigkeit wird zuverlässig gestoppt, und das Mauerwerk oberhalb der Sperre erhält keinen Nachschub mehr. Für Sie bedeutet das: kein Bagger vor dem Haus, keine aufgerissenen Beete und keine Arbeiten auf dem Grundstück des Nachbarn.",
          "Anders als Verfahren, die die Poren verstopfen, lässt die SchimmelPeter-Injektion die Wand atmungsaktiv. Die wirksame Polymerschicht ist nur wenige Moleküle dick und kleidet die Kapillaren lediglich aus, statt sie zu füllen. Flüssiges Wasser wird an der Sperrschicht zurückgehalten, Wasserdampf kann dagegen weiterhin durch das diffusionsfähige Mauerwerk wandern. So entweicht die Feuchte, die bereits in der Wand steckt, nach und nach, und mit ihr verdunstet das Paraffinöl, das als Träger gedient hat. Zurück bleibt eine trockene Wand, die ihre natürliche Wärmedämmfähigkeit wiedergewinnt.",
        ],
        bullets: [
          "Keine aufwendigen Erdarbeiten rund um das Haus",
          "Bohrlöcher im Abstand von bis zu 20 cm",
          "Vortrocknung in der Regel nicht notwendig",
          "25 Jahre Produktgarantie des Herstellers SchimmelPeter GmbH",
          "10 Jahre Garantie von sos-abdichtung auf die ausgeführten Arbeiten",
        ],
      },
      {
        heading: "Keine Vortrocknung und was nach der Injektion passiert",
        paragraphs: [
          "Viele Eigentümer rechnen damit, dass eine nasse Wand erst wochenlang getrocknet werden muss, bevor die eigentliche Sanierung beginnt. Bei der SchimmelPeter-Injektion ist eine Vortrocknung in der Regel nicht notwendig. Das Verfahren wirkt auch in stark durchfeuchtetem Mauerwerk mit einem Durchfeuchtungsgrad von über 90 %. Gerade in den alten Bruchstein- und Ziegelkellern im Bergischen Land, die oft seit Jahrzehnten nass sind, ist das ein großer Vorteil. Die Injektion kann direkt nach der gemeinsamen Planung erfolgen, ohne Trocknungsgeräte als Vorstufe.",
          "Die Horizontalsperre stoppt den Nachschub, das Wasser in der Wand verschwindet aber nicht über Nacht. Das Mauerwerk oberhalb der Sperre trocknet über Monate aus, je nach Wandstärke und Baustoff unterschiedlich schnell. In dieser Zeit darf die Oberfläche nicht mit dichten Materialien wie Dispersionsfarbe oder Zementputz verschlossen werden. Den alten, versalzenen Putz ersetzen wir deshalb durch ein Sanierputzsystem, das Salze einlagert und Wasserdampf entweichen lässt. Oft ist eine Kombination sinnvoll, etwa mit einer Innenabdichtung an erdberührten Wänden.",
          "Ausgeführt wird die Injektion von Mitarbeitern, die in den Schulungszentren von SchimmelPeter ausgebildet wurden und mehrmals im Jahr an Schulungen teilnehmen, um auf dem aktuellen Stand zu bleiben. Für die Wirksamkeit des Produkts gibt es 25 Jahre Produktgarantie des Herstellers SchimmelPeter GmbH. Unabhängig davon übernimmt sos-abdichtung 10 Jahre Garantie auf die ausgeführten Arbeiten. Beide Zusagen stehen nebeneinander und decken unterschiedliche Dinge ab: die eine das Produkt, die andere die handwerkliche Ausführung bei Ihnen vor Ort.",
        ],
      },
    ],
    steps: [
      {
        title: "Schadensanalyse mit Feuchtemessung",
        text: "Bei einer unverbindlichen Besichtigung außen und innen messen wir genau, wie die Feuchte verteilt ist, und klären, ob sie kapillar aufsteigt.",
      },
      {
        title: "Verbindliches Angebot",
        text: "Auf Basis der Analyse erhalten Sie ein verbindliches Angebot für die Horizontalsperre und alle begleitenden Maßnahmen.",
      },
      {
        title: "Sanierungsplan und Injektion",
        text: "Nach Ihrem Auftrag legen wir gemeinsam Wände, Reihenfolge und Putz fest. Dann setzen wir Bohrlöcher im Abstand von bis zu 20 cm und injizieren die berechnete Menge.",
      },
      {
        title: "Gemeinsame Abnahme",
        text: "Nach der Sanierung nehmen Sie die Arbeiten gemeinsam mit uns ab, und wir übergeben Ihnen die Baustelle sauber.",
      },
    ],
    faqs: [
      {
        q: "Hilft eine Horizontalsperre auch gegen Feuchte, die seitlich durch die Kellerwand kommt?",
        a: "Nein, die Horizontalsperre unterbricht nur den Wassertransport von unten nach oben. Dringt Feuchte seitlich aus dem Erdreich durch die Kelleraußenwand, braucht es zusätzlich eine Flächenabdichtung auf der Innenseite. Oft ist genau diese Kombination sinnvoll, und welche Maßnahmen Ihre Wand braucht, zeigt die Schadensanalyse vor Ort.",
      },
      {
        q: "Muss die Wand vor der Injektion erst getrocknet werden?",
        a: "Nein, eine Vortrocknung ist in der Regel nicht notwendig. Das SchimmelPeter-Verfahren wirkt auch in stark durchfeuchtetem Mauerwerk mit einem Durchfeuchtungsgrad von über 90 %. Damit eignet es sich auch für alte Bruchstein- und Ziegelkeller, die seit Jahrzehnten nass sind.",
      },
      {
        q: "Kann die Wand nach der Injektion noch atmen?",
        a: "Ja. Die wirksame Polymerschicht ist nur wenige Moleküle dick, deshalb werden die Kapillarporen nicht verstopft und das Mauerwerk bleibt diffusionsfähig. Die Feuchtigkeit in der Wand kann so nach und nach entweichen, und mit ihr verdunstet auch das Paraffinöl.",
      },
      {
        q: "Welche Garantie erhalte ich auf die Horizontalsperre?",
        a: "Sie erhalten zwei getrennte Zusagen. Auf die Wirksamkeit des Produkts gibt es 25 Jahre Produktgarantie des Herstellers SchimmelPeter GmbH. Zusätzlich gibt sos-abdichtung 10 Jahre Garantie auf die ausgeführten Arbeiten.",
      },
      {
        q: "Geht eine Mauertrockenlegung auch von innen?",
        a: "Ja. Die Bohrlöcher für die Injektion setzen wir in der Regel vom Keller oder vom Raum aus, ein Aufgraben von außen ist dafür nicht nötig. So lässt sich feuchtes Mauerwerk sanieren, auch wenn außen Terrasse, Einfahrt oder das Nachbarhaus angrenzen. Ob zusätzlich eine Innenabdichtung gegen seitlich eindringende Feuchte nötig ist, zeigt die Messung vor Ort.",
      },
    ],
    related: ["kellersanierung", "kellerinnenabdichtung", "feuchtemessung"],
  },

  // 3. Kellerinnenabdichtung
  {
    slug: "kellerinnenabdichtung",
    serviceName: "Kellerinnenabdichtung nach WTA-Standard",
    navTitle: "Kellerinnenabdichtung",
    keyword: "Keller von innen abdichten",
    title: "Keller von innen abdichten | Innenabdichtung nach WTA",
    metaDescription:
      "Keller von innen abdichten nach WTA statt aufgraben: Hohlkehle, mineralische Dichtungsschlämme und Sanierputz, auch gegen drückendes Wasser. Festpreis.",
    h1: "Keller von innen abdichten, auch gegen drückendes Wasser",
    lede:
      "Wenn Feuchte seitlich durch die erdberührte Kellerwand kommt, muss die Wand selbst abgedichtet werden. Wir tun das von innen mit mineralischen Dichtungsschlämmen, einer sauber ausgebildeten Hohlkehle und einem Sanierputz, ganz ohne Erdarbeiten.",
    symptoms: [
      "Nasse Flecken, die nach Regenperioden über die ganze Wandfläche wachsen",
      "Wasseraustritt am Übergang zwischen Kellerboden und Wand",
      "Feuchte Stellen an Rohr- und Kabeldurchführungen",
      "Salzausblühungen und abplatzender Putz an bergseitigen Wänden",
      "Bitumenanstriche auf der Innenseite, die Blasen werfen und sich lösen",
    ],
    layers: [
      {
        name: "Erdberührte Außenwand",
        text: "Das Mauerwerk bleibt zur Erdseite hin feucht, deshalb setzen wir die Abdichtung als Negativabdichtung auf die Innenseite.",
      },
      {
        name: "Hohlkehle",
        text: "Am Boden-Wand-Anschluss formen wir eine gerundete Kehle aus Sperrmörtel, damit die Abdichtung an dieser Kante nicht abreißt.",
      },
      {
        name: "Mineralische Dichtungsschlämme (MDS)",
        text: "Mehrere Lagen MDS verbinden sich fest mit dem Untergrund und halten Wasser auch unter Druck zurück.",
      },
      {
        name: "Sanierputz",
        text: "Der Sanierputz bildet die Nutzschicht und nimmt Salze aus dem Übergangsbereich oberhalb der Abdichtung auf.",
      },
      {
        name: "Diffusionsoffener Anstrich",
        text: "Eine Silikat- oder Kalkfarbe schließt die Wand ab, ohne die Feuchteabgabe an die Raumluft zu behindern.",
      },
    ],
    sections: [
      {
        heading: "Feuchte Kellerwände abdichten: wann die Innenabdichtung die richtige Wahl ist",
        paragraphs: [
          "Nach der reinen Lehre gehört eine Abdichtung auf die Außenseite der Kellerwand, dorthin, wo das Wasser ankommt. In der Praxis ist die Außenseite aber oft nicht erreichbar: Das Nachbarhaus steht direkt an der Grenze, eine Garage oder Terrasse ist angebaut, oder das Haus steht am Hang mit Stützmauern und Treppen. In all diesen Fällen ist die Innenabdichtung die wirtschaftliche und technisch sinnvolle Lösung. Sie spart die Erdarbeiten und damit bis zu 60 Prozent der Kosten einer Außenaufgrabung.",
          "Eingesetzt werden Dichtschlämmen und mineralische Dichtsysteme, die fest mit dem Mauerwerk verbunden sein müssen. Mürbe Fugen, lose Steine und alte Beschichtungen entfernen wir deshalb vollständig, Bruchsteinwände egalisieren wir mit Sperrmörtel. Eine aufwendige Vortrocknung ist nicht nötig: Die Lösung von SchimmelPeter hat eine sehr geringe Oberflächenspannung und verteilt sich selbst in wassergesättigtem Mauerwerk mit über 90 % Durchfeuchtung. Steigt zusätzlich Feuchte kapillar auf, ergänzen wir eine Horizontalsperre, denn oft ist erst die Kombination beider Verfahren die dauerhafte Lösung.",
        ],
      },
      {
        heading: "Hohlkehle, MDS und Querwände: die kritischen Details",
        paragraphs: [
          "Die meisten undichten Innenabdichtungen versagen nicht in der Fläche, sondern an den Übergängen. Der Boden-Wand-Anschluss ist die Schwachstelle jedes Kellers, weil hier zwei Bauteile aufeinandertreffen, die sich unterschiedlich bewegen. Wir öffnen diesen Anschluss und formen eine Hohlkehle aus Sperrmörtel, über die die Dichtungsschlämme ohne scharfe Kante vom Boden in die Wand läuft. Rohr- und Kabeldurchführungen erhalten eigene Dichtmanschetten oder werden gezielt verpresst.",
          "Ein Detail, das oft übersehen wird, sind die Innenwände. Wo eine Querwand auf die abgedichtete Außenwand trifft, kann Feuchte an der Abdichtung vorbei in die Innenwand wandern und dort nach oben steigen. Deshalb dichten wir die Anschlussbereiche der Querwände ein Stück weit mit ab oder setzen dort eine Horizontalsperre. Nur so bleibt nicht allein die Außenwand trocken, sondern der ganze Keller, einschließlich der Räume, die an die sanierte Wand angrenzen.",
        ],
      },
      {
        heading: "Drückendes Wasser und Hanglagen",
        paragraphs: [
          "Bei einfacher Bodenfeuchte genügt meist eine zweilagige Dichtungsschlämme. Anders sieht es aus, wenn nach Starkregen Wasser mit Druck gegen die Wand steht, etwa bei Häusern am Hang oder in Senken, in denen sich Sickerwasser staut. Hier setzen wir auf mehrlagige, starre Schlämmen in ausreichender Schichtdicke und beziehen auch die Bodenplatte mit ein. Wasserführende Risse werden vorher verpresst, denn über einen offenen Riss würde jede Beschichtung früher oder später hinterlaufen.",
          "Wichtig ist uns, offen zu sagen, was eine Innenabdichtung leisten kann. Sie hält das Wasser aus dem Raum, das Mauerwerk dahinter bleibt jedoch feucht. Das ist bauphysikalisch in Ordnung, solange die Abdichtung lückenlos ist und die Feuchte nicht in darüberliegende Geschosse aufsteigen kann. Deshalb kombinieren wir die Innenabdichtung in Altbauten fast immer mit einer Horizontalsperre knapp oberhalb der abgedichteten Zone, damit das Erdgeschoss trocken bleibt.",
        ],
        bullets: [
          "Mehrlagige MDS bei drückendem Wasser",
          "Einbeziehung der Bodenplatte",
          "Vorheriges Verpressen wasserführender Risse",
          "Horizontalsperre oberhalb der Abdichtung",
        ],
      },
    ],
    steps: [
      {
        title: "Schadensanalyse mit Feuchtemessung",
        text: "Bei einer unverbindlichen Besichtigung außen und innen messen wir die Feuchte, prüfen den Untergrund und klären, ob Bodenfeuchte oder drückendes Wasser anliegt.",
      },
      {
        title: "Verbindliches Angebot",
        text: "Auf Basis der Analyse erhalten Sie ein verbindliches Angebot für Innenabdichtung und Hohlkehle und, falls nötig, für eine ergänzende Horizontalsperre.",
      },
      {
        title: "Sanierungsplan und Abdichtung",
        text: "Nach Ihrem Auftrag legen wir gemeinsam den Ablauf fest, damit Sie den Keller gezielt ausräumen können. Dann bauen wir Hohlkehle, Dichtschlämme und Sanierputz ein.",
      },
      {
        title: "Gemeinsame Abnahme",
        text: "Nach der Sanierung nehmen Sie die Abdichtung gemeinsam mit uns ab, und wir übergeben Ihnen den Keller sauber.",
      },
    ],
    faqs: [
      {
        q: "Kann ich einen Keller von innen selbst abdichten?",
        a: "Dichtungsschlämme gibt es im Baumarkt, die Tücke liegt aber im Untergrund und in den Anschlüssen. Wird die Schlämme auf alten Putz oder Farbe gestrichen, löst sie sich unter Wasserdruck wieder ab. Ohne Hohlkehle und abgedichtete Querwände läuft die Feuchte außerdem einfach um die Abdichtung herum.",
      },
      {
        q: "Hält eine Innenabdichtung auch bei drückendem Wasser?",
        a: "Ja, wenn sie dafür ausgelegt ist. Bei drückendem Wasser braucht es mehrlagige Schlämmen in ausreichender Schichtdicke auf einem festen, sauberen Untergrund, und die Bodenplatte muss mit einbezogen werden. Ob Ihr Keller Bodenfeuchte oder Druckwasser ausgesetzt ist, klären wir bei der Messung vor Ort.",
      },
      {
        q: "Warum reicht ein Bitumenanstrich von innen nicht?",
        a: "Bitumen haftet auf feuchtem Mauerwerk schlecht und wird von innen durch den Wasserdruck von der Wand weggedrückt. Mineralische Dichtungsschlämmen verbinden sich dagegen mit dem Untergrund und sind für die Anwendung von innen geeignet. Deshalb entfernen wir alte Bitumenanstriche vor der Sanierung vollständig.",
      },
      {
        q: "Feuchte Wände sanieren: von innen oder von außen?",
        a: "Eine Außenabdichtung hält das Wasser vor der Wand, verlangt aber das Aufgraben bis zum Fundament, mit Erdarbeiten und oft beschädigten Außenanlagen. Die Innenabdichtung nach WTA erreicht die Wand vom Keller aus und ist für die meisten Altbauten die wirtschaftlichere Lösung, auch bei drückendem Wasser. Steigt die Feuchte dagegen im Mauerwerk auf, gehört eine Horizontalsperre dazu. Welche Kombination Ihre Wand braucht, entscheidet die kostenlose Feuchtemessung.",
      },
    ],
    related: ["kellersanierung", "horizontalsperre", "rissverpressung"],
  },

  // 4. Schimmelbeseitigung
  {
    slug: "schimmelbeseitigung",
    serviceName: "Schimmelbeseitigung & Klimaplatten",
    navTitle: "Schimmelbeseitigung",
    keyword: "Schimmel im Keller",
    title: "Schimmel im Keller entfernen | Schimmelbeseitigung NRW",
    metaDescription:
      "Schimmel im Keller oder in der Wohnung? Schimmelsanierung mit Ursachenmessung, sporensicherer Entfernung ohne Chlor und Klimaplatten gegen Kondensat.",
    h1: "Schimmel im Keller und in der Wohnung: erst die Ursache, dann der Schimmel",
    lede:
      "Schimmel wächst nur dort, wo über längere Zeit zu viel Feuchtigkeit ist. Wer ihn nur abwischt, sieht ihn wieder. Wir finden heraus, woher die Feuchte kommt, entfernen den Befall sporensicher und sorgen dafür, dass die Fläche trocken bleibt.",
    symptoms: [
      "Schwarze oder grünliche Flecken in Raumecken, hinter Schränken und an Fensterlaibungen",
      "Stockflecken und muffiger Geruch in Keller- und Souterrainräumen",
      "Beschlagene Scheiben und nasse Wandecken in der Heizperiode",
      "Verfärbte Tapete oder Putz an kalten Außenwänden",
      "Befall an gelagerten Kartons, Schuhen und Möbeln im Keller",
    ],
    layers: [
      {
        name: "Feuchtequelle",
        text: "Aufsteigende Nässe, eindringendes Wasser oder Kondensat an kalten Flächen liefern die Feuchtigkeit, ohne die Schimmel nicht wachsen kann.",
      },
      {
        name: "Wandbaustoff",
        text: "Mauerwerk und Putz speichern diese Feuchte und bleiben dadurch über Wochen ein Nährboden.",
      },
      {
        name: "Befallene Oberfläche",
        text: "Tapete, Putz und Anstrich mit Pilzgeflecht werden unter Abschottung entfernt, statt nur überstrichen zu werden.",
      },
      {
        name: "Calciumsilikatplatte",
        text: "Die kapillaraktive, alkalische Platte hebt die Oberflächentemperatur an und nimmt Kondensat auf, bevor Schimmel entstehen kann.",
      },
      {
        name: "Raumluft",
        text: "Angepasstes Heizen und Lüften hält die Luftfeuchte so niedrig, dass sich an den Wänden kein Tauwasser mehr bildet.",
      },
    ],
    sections: [
      {
        heading: "Schimmelsanierung: warum wir immer mit der Ursache anfangen",
        paragraphs: [
          "Schimmel ist kein eigenständiges Problem, sondern das sichtbare Zeichen für zu viel Feuchtigkeit an einer Oberfläche. Sporen sind in jeder Raumluft vorhanden. Sie keimen erst aus, wenn sie auf einer Fläche landen, die über längere Zeit feucht bleibt. Eine Schimmelbeseitigung ohne Ursachenanalyse behandelt also nur das Symptom. In den meisten Fällen steht man nach wenigen Monaten wieder vor demselben Fleck, weil sich an der Feuchtequelle nichts geändert hat.",
          "Bei der Ursachenanalyse messen wir die Feuchte im Wandbaustoff, die Oberflächentemperatur der betroffenen Stelle, die Raumtemperatur und die relative Luftfeuchte. Aus diesen Werten ergibt sich, ob an der Wand der Taupunkt unterschritten wird oder ob die Nässe aus dem Mauerwerk selbst kommt. Diese Unterscheidung ist entscheidend: Kondensat an einer kalten Außenecke verlangt eine andere Lösung als aufsteigende Feuchte oder ein undichter Boden-Wand-Anschluss im Keller.",
          "In der Praxis begegnen uns vier Ursachen besonders oft. Zu hohe Luftfeuchtigkeit zeigt sich zuerst als leichter Befall, die sogenannten Stockflecken, die ebenfalls sofort behandelt werden sollten. Hier spielt das Heiz- und Lüftungsverhalten eine große Rolle. Ein undichtes Rohr in der Wand verteilt Wasser weit im Bauteil, solche Schäden sind meist versichert und sollten schnell behoben werden. Über eine undichte Außenwand dringt Regen ein, etwa durch defekte Fallrohre, alten, abbröckelnden Anstrich oder Fassadenrisse. Und im nassen Keller ist oft die gealterte oder rissige Außenabdichtung im Erdreich der Auslöser.",
        ],
        bullets: [
          "Hohe Luftfeuchtigkeit mit Stockflecken, oft durch Heiz- und Lüftungsverhalten",
          "Undichtes Rohr in der Wand, meist ein Versicherungsfall, schnell handeln",
          "Undichte Außenwand durch Fallrohre, alten Anstrich oder Fassadenrisse",
          "Nasser Keller, weil die Außenabdichtung im Erdreich gealtert oder gerissen ist",
        ],
      },
      {
        heading: "Sporensichere Entfernung ohne Chlor",
        paragraphs: [
          "Oberflächlich abgewischter Schimmel ist meist nur optisch verschwunden. Das Pilzgeflecht sitzt in Tapete, Putz und Fugen, und beim trockenen Abbürsten werden massenhaft Sporen in der Wohnung verteilt. Wir schotten den Arbeitsbereich deshalb ab, entfernen befallene Tapeten und Putze kontrolliert und saugen den Staub mit geeigneten Filtergeräten ab. Möbel und angrenzende Räume bleiben so weitgehend frei von zusätzlicher Sporenbelastung, auch wenn Sie während der Arbeiten in der Wohnung bleiben.",
          "Auf chlorhaltige Schimmelentferner aus dem Baumarkt verzichten wir bewusst. Chlor bleicht den Befall zwar aus, sodass er verschwunden scheint, belastet aber die Raumluft und kann auf mineralischen Untergründen Salze hinterlassen. Wir arbeiten mit Mitteln, die Sporen abtöten, ohne toxische Chlorrückstände zu hinterlassen. Anschließend wird die Fläche mit mineralischen Materialien neu aufgebaut, die Schimmel keinen Nährboden bieten und Feuchte aufnehmen und wieder abgeben können.",
          "Unser Team wurde in den Schulungszentren von SchimmelPeter ausgebildet. Die Mitarbeiter, die bei uns Schimmel sanieren, haben die entsprechenden Schulungen absolviert und eine Prüfung beim TÜV Süd bestanden. Mehrmals im Jahr nehmen wir an weiteren Schulungen teil, um fachlich auf dem aktuellen Stand zu bleiben. Für Sie heißt das: Die Arbeiten in Ihrer Wohnung übernehmen Fachleute, die wissen, wie man befallene Schichten kontrolliert abträgt, Sporen sicher entfernt und angrenzende Räume schützt, auch wenn Sie während der Sanierung weiter dort wohnen.",
        ],
      },
      {
        heading: "Klimaplatten aus Calciumsilikat gegen Kondensat an kalten Wänden",
        paragraphs: [
          "Viele Schimmelschäden in Wuppertaler Altbauwohnungen entstehen an ungedämmten Außenwänden, Fensterlaibungen und Ecken, die im Winter deutlich kälter sind als die übrige Wand. Dort kondensiert die Luftfeuchte, und die Stelle wird dauerhaft feucht. Für solche Wärmebrücken setzen wir Calciumsilikatplatten ein. Das Material ist kapillaraktiv, nimmt anfallendes Kondensat auf, verteilt es in der Fläche und gibt es wieder an die Raumluft ab, sobald diese trockener ist.",
          "Hinzu kommt die hohe Alkalität des Materials, die Schimmelwachstum auf der Oberfläche hemmt, ganz ohne Biozide. Gleichzeitig hebt die Platte die Oberflächentemperatur an, sodass der Taupunkt seltener unterschritten wird. Für Häuser, deren Fassade aus Gründen des Denkmalschutzes oder wegen der Nachbarbebauung nicht außen gedämmt werden kann, ist diese Innendämmung oft der praktikabelste Weg. Wichtig bleibt ein angepasstes Lüftungsverhalten, das wir nach der Sanierung mit Ihnen besprechen.",
        ],
      },
      {
        heading: "Schimmel in der Mietwohnung",
        paragraphs: [
          "Bei Schimmel in der Mietwohnung stehen sich häufig zwei Sichtweisen gegenüber: Der Vermieter vermutet falsches Lüften, der Mieter einen Baumangel. Beides kommt vor, und oft wirkt beides zusammen. Eine neutrale Messung schafft hier Klarheit. Wir dokumentieren Feuchtewerte im Mauerwerk, Oberflächentemperaturen und Raumklima so, dass nachvollziehbar wird, ob die Ursache im Gebäude, in der Nutzung oder in einer Kombination aus beidem liegt.",
          "Für Eigentümer und Mieter erstellen wir eine nachvollziehbare schriftliche Dokumentation, die als Grundlage für Sanierungsentscheidungen und für Gespräche mit der Gegenseite oder einer Versicherung dienen. Mieter sollten einen Befall zuerst mit Fotos und Datum festhalten und den Vermieter schriftlich informieren. Eine Rechtsberatung ersetzen wir nicht, aber belastbare Messwerte machen jede Auseinandersetzung sachlicher und führen deutlich schneller zu einer Lösung, mit der beide Seiten leben können.",
        ],
      },
    ],
    steps: [
      {
        title: "Schadensanalyse mit Feuchtemessung",
        text: "Bei einer unverbindlichen Besichtigung außen und innen erfassen wir Ausmaß und Lage des Befalls und messen Materialfeuchte, Oberflächentemperatur und Raumklima.",
      },
      {
        title: "Verbindliches Angebot",
        text: "Auf Basis der Analyse leiten wir die genaue Feuchtequelle ab, und Sie erhalten ein verbindliches Angebot für Entfernung und Ursachenbehebung.",
      },
      {
        title: "Sanierungsplan und Sanierung",
        text: "Nach Ihrem Auftrag planen wir gemeinsam Räume und Termine. Dann entfernen wir befallene Schichten sporensicher und ohne Chlor und bauen die Fläche neu auf.",
      },
      {
        title: "Gemeinsame Abnahme",
        text: "Nach der Sanierung nehmen Sie die Arbeiten gemeinsam mit uns ab, besprechen mit uns das richtige Heizen und Lüften und erhalten die Räume sauber zurück.",
      },
    ],
    faqs: [
      {
        q: "Wann sollte Schimmel vom Fachbetrieb entfernt werden?",
        a: "Kleine, oberflächliche Flecken etwa an einer Silikonfuge können Sie selbst behandeln. Sobald der Befall größer ist, immer wiederkommt oder in Putz und Mauerwerk sitzt, gehört er in fachliche Hände. Das gilt ebenso, wenn Allergiker, Kleinkinder oder Menschen mit geschwächtem Immunsystem im Haushalt leben.",
      },
      {
        q: "Schimmel im Keller: Was tun?",
        a: "Räumen Sie befallene Kartons und Textilien aus und lüften Sie im Sommer nicht an warmen, schwülen Tagen, weil sich die feuchte Außenluft sonst an den kühlen Kellerwänden niederschlägt. Wischen oder bürsten Sie den Schimmel nicht trocken ab. Danach sollte gemessen werden, ob die Feuchte aus der Wand oder aus der Luft kommt.",
      },
      {
        q: "Hilft Anti-Schimmel-Farbe?",
        a: "Anti-Schimmel-Farben enthalten Biozide, die den Befall eine Weile unterdrücken. Solange die Wand feucht bleibt, kommt der Schimmel zurück, sobald der Wirkstoff ausgewaschen oder erschöpft ist. Sinnvoll ist so eine Farbe höchstens als Ergänzung, nie als Ersatz für die Beseitigung der Ursache.",
      },
      {
        q: "Erstellen Sie auch für Mieter eine Dokumentation?",
        a: "Ja, unsere Messung und Dokumentation richtet sich an Eigentümer ebenso wie an Mieter. Sie hält fest, wo welche Feuchte gemessen wurde und welche Ursache sich daraus ergibt. Die rechtliche Bewertung übernimmt im Streitfall ein Anwalt oder Mieterverein.",
      },
      {
        q: "Woran erkenne ich eine gute Fachfirma für Schimmelbeseitigung?",
        a: "An drei Dingen: Sie misst die Feuchte, bevor sie ein Angebot macht, und nennt Ihnen die Ursache. Sie entfernt den Befall sporensicher und ohne Chlor, statt ihn nur zu überstreichen. Und sie beseitigt die Ursache, damit der Schimmel nicht wiederkommt, mit schriftlicher Garantie. Wir sind SchimmelPeter-Partner, die Messung vor Ort ist kostenlos und auf die Arbeit geben wir 10 Jahre Garantie.",
      },
    ],
    related: ["feuchtemessung", "kellersanierung", "horizontalsperre"],
  },

  // 5. Feuchtemessung
  {
    slug: "feuchtemessung",
    serviceName: "Kostenlose Feuchtigkeitsmessung & Schadensanalyse",
    navTitle: "Feuchtemessung & Gutachten",
    keyword: "Feuchtigkeitsmessung",
    title: "Kostenlose Feuchtigkeitsmessung & Schadensanalyse",
    metaDescription:
      "Kostenlose Feuchtigkeitsmessung vor Ort in ganz NRW: kapillare und hygroskopische Feuchte, Taupunkt, Salze. Schadensanalyse und Schimmel-Gutachten.",
    h1: "Kostenlose Feuchtigkeitsmessung & Schadensanalyse: wissen, woher die Nässe kommt",
    lede:
      "Feuchte Wand, was tun? Bevor Geld in Putz, Farbe oder Entfeuchter fließt, sollte klar sein, welche Art von Feuchte in der Wand steckt und woher sie kommt. Genau das klärt eine fachgerechte Messung.",
    symptoms: [
      "Feuchte Wandstellen, deren Ursache unklar ist",
      "Schimmel, bei dem Mieter und Vermieter unterschiedliche Ursachen vermuten",
      "Wände, die nach einem Wasserschaden auffällig lange feucht bleiben",
      "Salzränder, die nach jeder Renovierung wiederkommen",
      "Feuchter Keller in einem Altbau, den Sie kaufen möchten",
    ],
    layers: [
      {
        name: "Wandfuß",
        text: "Hier zeigt sich, ob Feuchte kapillar aus dem Fundament aufsteigt, deshalb messen wir in mehreren Höhen.",
      },
      {
        name: "Mauerwerkskern",
        text: "Oberflächengeräte erfassen nur die ersten Millimeter, erst Messungen in der Tiefe zeigen den tatsächlichen Wassergehalt.",
      },
      {
        name: "Putz und Salze",
        text: "Salze im Putz ziehen Feuchte aus der Luft an und verfälschen einfache Messungen, deshalb trennen wir hygroskopische von kapillarer Feuchte.",
      },
      {
        name: "Oberfläche und Raumluft",
        text: "Oberflächentemperatur, Raumtemperatur und relative Luftfeuchte zeigen, ob an der Wand der Taupunkt unterschritten wird.",
      },
    ],
    sections: [
      {
        heading: "Kapillar, hygroskopisch oder Kondensat?",
        paragraphs: [
          "Eine Wand kann aus ganz verschiedenen Gründen feucht sein, und jede Ursache verlangt eine andere Sanierung. Häufig sind Schäden am Dach, kapillar aufsteigende Feuchtigkeit vor allem in altem, porösem Mauerwerk, undichte Wasser- oder Abwasserleitungen, eine unzureichende Drainage oder Kondenswasser in schlecht belüfteten oder schlecht gedämmten Räumen. Aufsteigende Feuchte zeigt ein typisches Profil: unten am nassesten, nach oben abnehmend. Kondensat entsteht an der Oberfläche kalter Bauteile und ist im Kern der Wand oft kaum nachweisbar. Leckagen aus Leitungen zeigen sich dagegen als örtlich begrenzte, nasse Zonen.",
          "Ein Sonderfall ist die hygroskopische Feuchte. Salze, die sich über Jahre im Putz angereichert haben, ziehen Wasser aus der Raumluft an. Eine solche Wand kann feucht wirken, obwohl längst keine Nässe mehr von unten nachkommt, etwa weil bereits eine Horizontalsperre eingebaut wurde. Wer das nicht unterscheidet, lässt womöglich eine zweite Sperre einbauen, die gar nicht gebraucht wird. Umgekehrt nützt neuer Putz nichts, solange noch kapillares Wasser aufsteigt.",
        ],
        bullets: [
          "Undichtes oder beschädigtes Dach",
          "Kapillar aufsteigende Feuchtigkeit, vor allem in altem, porösem Mauerwerk",
          "Undichte Sanitärinstallationen, also Wasser- und Abwasserleitungen",
          "Unzureichende oder defekte Drainage rund um das Haus",
          "Kondenswasser in schlecht belüfteten oder schlecht gedämmten Räumen",
        ],
      },
      {
        heading: "Wie wir messen",
        paragraphs: [
          "Jede Schadensanalyse beginnt mit einer Besichtigung außen und innen und einer genauen Sichtprüfung, denn schon das Schadensbild verrät viel. Waagerecht verlaufende Feuchtelinien im Sockelbereich, unten nass und weiter oben trocken, sind ein klassisches Zeichen für aufsteigende Feuchte. Flecken rund um Fenster oder Rohrdurchführungen deuten dagegen meist auf eine Undichtigkeit von außen hin. Auch Dach, Fallrohre, Gelände und Leitungsverlauf liefern wichtige Hinweise. Mit dem Auge allein lässt sich die Ursache aber nicht sicher bestimmen, deshalb folgt immer die Messung.",
          "Mit kapazitiven Messgeräten bestimmen wir den Feuchtegehalt der Wand in verschiedenen Höhen. Nehmen die Werte zum Boden hin zu, ist das ein klarer Hinweis auf kapillare Feuchte. Weil Salze und unterschiedliche Baustoffe solche Anzeigen verfälschen können, ermitteln wir den tatsächlichen Feuchtegrad bei Bedarf zusätzlich per CM-Messung oder Bohrkernanalyse. Parallel erfassen wir Oberflächentemperaturen, Raumtemperatur und relative Luftfeuchte, um das Taupunktrisiko zu bewerten und Kondensat sicher von Nässe aus dem Mauerwerk zu unterscheiden.",
          "Ebenso wichtig ist der Baustoff selbst. Ziegel, Kalksandstein und Naturstein nehmen unterschiedlich viel Wasser auf, und davon hängt ab, welches Sanierungssystem passt. Aus allen Werten ergibt sich eine fachliche Bewertung: Fehlt die Horizontalsperre ganz, hat sie nur in Teilbereichen versagt, oder sind andere Ursachen wie seitlich eindringende Feuchte verantwortlich? Darauf baut unser Sanierungsvorschlag auf. Weil die Messung vor der Wahl des Verfahrens steht, ist das Angebot herstellerunabhängig und richtet sich nach dem Befund, nicht nach einem bestimmten Produkt.",
        ],
        bullets: [
          "Sichtprüfung: Feuchtelinien im Sockel oder Flecken an Fenstern und Rohren",
          "Messung in verschiedenen Höhen, kapazitiv und bei Bedarf per CM-Messung oder Bohrkern",
          "Materialanalyse von Ziegel, Kalksandstein oder Naturstein",
          "Bewertung mit Taupunktprüfung und konkretem Sanierungsvorschlag",
        ],
      },
      {
        heading: "Feuchte-Check beim Immobilienkauf",
        paragraphs: [
          "Feuchte Wände sind für Laien oft nicht auf den ersten Blick zu erkennen, schon gar nicht bei einer kurzen Besichtigung. Wer ein Haus oder eine Wohnung kaufen möchte, sollte deshalb vor der Entscheidung wissen, wie es um Keller und Wände steht. Wir prüfen die Immobilie mit denselben Verfahren wie bei jeder Schadensanalyse: Sichtprüfung, Feuchtemessung in mehreren Räumen und Höhen und, falls vorhanden, die Erfassung von Schimmelbefall und seinem Ausmaß. So wissen Sie, worauf Sie sich einlassen, statt die Katze im Sack zu kaufen.",
          "Noch vor Ort erhalten Sie einen schriftlichen Befund zum Zustand der Immobilie hinsichtlich Feuchtigkeit und gegebenenfalls Schimmel. Das Angebot richtet sich an Kaufinteressenten ebenso wie an Immobilienmakler, die ihren Kunden Sicherheit geben und den Zustand eines Objekts belegen möchten. Zeigt die Messung Handlungsbedarf, erhalten Sie auf Wunsch ein verbindliches Angebot für die Sanierung. Der Befund ist eine fachliche Bestandsaufnahme und kein gerichtsfestes Gutachten, gibt Ihnen aber eine sachliche Grundlage für Ihre Kaufentscheidung.",
        ],
      },
      {
        heading: "Schimmel messen und nachvollziehbar dokumentieren",
        paragraphs: [
          "Wer nach einem Sachverständigen für Schimmel sucht, braucht meist zweierlei: eine fachliche Klärung der Ursache und eine Dokumentation, die auch Dritte nachvollziehen können. Unsere Gutachten halten fest, wo welcher Befall sitzt, welche Feuchte- und Temperaturwerte gemessen wurden und welche Ursache sich daraus ergibt. Dazu gehört eine klare Empfehlung, mit welchen Maßnahmen der Schaden dauerhaft behoben werden kann, und auf Wunsch ein Festpreisangebot für die Umsetzung.",
          "Solche Unterlagen sind für Eigentümer und Mieter gleichermaßen nützlich, etwa bei Streit über die Ursache, im Gespräch mit einer Versicherung oder vor dem Kauf eines Hauses mit feuchtem Keller. Kommt es tatsächlich zu einem Gerichtsverfahren, bestellt das Gericht in der Regel einen eigenen Sachverständigen. Das sprechen wir offen an. Meist reicht jedoch eine saubere messtechnische Dokumentation, um die Frage nach der Ursache sachlich zu klären, bevor ein Streit überhaupt entsteht.",
        ],
      },
    ],
    steps: [
      {
        title: "Schadensanalyse mit Feuchtemessung",
        text: "Nach Ihrer Anfrage, gern mit Fotos per WhatsApp, besichtigen wir das Gebäude außen und innen und messen genau. Die Erstmessung ist kostenlos und unverbindlich.",
      },
      {
        title: "Verbindliches Angebot",
        text: "Sie erhalten die Ergebnisse mit einer klaren Empfehlung und auf Basis der Analyse ein verbindliches Angebot für die Sanierung.",
      },
      {
        title: "Sanierungsplan und Sanierung",
        text: "Nach Ihrem Auftrag erstellen wir gemeinsam mit Ihnen den Sanierungsplan und führen die Sanierung wie vereinbart aus.",
      },
      {
        title: "Gemeinsame Abnahme",
        text: "Nach der Sanierung nehmen Sie die Arbeiten gemeinsam mit uns ab, und wir übergeben Ihnen die Baustelle sauber.",
      },
    ],
    faqs: [
      {
        q: "Ist die Feuchtemessung wirklich kostenlos?",
        a: "Ja, die Erstmessung vor Ort zur Ermittlung der Schadensursache ist für Sie kostenlos und unverbindlich. Sie wissen danach, welche Art von Feuchte vorliegt, und erhalten auf Wunsch ein Festpreisangebot für die Sanierung. Ein ausführliches schriftliches Gutachten, etwa für eine Auseinandersetzung mit Dritten, besprechen wir gesondert.",
      },
      {
        q: "Feuchte Wand: Was tun bis zum Termin?",
        a: "Rücken Sie Möbel etwas von der Wand ab, damit Luft zirkulieren kann, und streichen oder verputzen Sie die Stelle noch nicht. Lüften Sie kurz und kräftig, statt Fenster dauerhaft zu kippen. Notieren Sie, ob sich die Feuchte bei Regen oder in der Heizperiode verändert, denn das hilft bei der Ursachenfindung.",
      },
      {
        q: "Kann ich Feuchte in der Wand selbst messen?",
        a: "Mit einem einfachen Messgerät sehen Sie, ob eine Stelle feuchter ist als eine andere. Den tatsächlichen Wassergehalt oder die Ursache können diese Geräte nicht zuverlässig bestimmen, weil Salze und Baustoff die Anzeige verfälschen. Für eine Sanierungsentscheidung reicht eine solche Messung deshalb nicht aus.",
      },
      {
        q: "Was bedeutet der Taupunkt beim Thema Schimmel?",
        a: "Der Taupunkt ist die Temperatur, bei der Wasserdampf aus der Luft zu Wasser kondensiert. Ist eine Wandoberfläche kälter als der Taupunkt der Raumluft, schlägt sich dort Feuchtigkeit nieder, und Schimmel findet ideale Bedingungen. Schon bevor sichtbares Tauwasser entsteht, kann eine dauerhaft hohe Feuchte an der Oberfläche für Schimmelwachstum ausreichen.",
      },
    ],
    related: ["schimmelbeseitigung", "horizontalsperre", "kellersanierung"],
  },

  // 6. Rissverpressung
  {
    slug: "rissverpressung",
    serviceName: "Rissverpressung im Mauerwerk & Beton",
    navTitle: "Rissverpressung",
    keyword: "Rissverpressung Keller",
    title: "Rissverpressung Keller | Wasserführende Risse abdichten",
    metaDescription:
      "Rissverpressung Keller: wasserführende Risse in Beton und Mauerwerk mit PU-Harz oder Epoxid dauerhaft schließen, auch in WU-Beton. In ganz NRW.",
    h1: "Rissverpressung Keller: wasserführende Risse dauerhaft schließen",
    lede:
      "Ein Riss in der Kellerwand, durch den Wasser sickert, lässt sich nicht einfach zuspachteln. Wir verpressen ihn unter hohem Druck mit PU-Harz oder Epoxid und füllen ihn damit über den gesamten Wandquerschnitt.",
    symptoms: [
      "Feuchte oder nasse Linie entlang eines Risses in Wand oder Bodenplatte",
      "Wasser, das bei Regen sichtbar aus einem Riss oder einer Fuge läuft",
      "Weiße Kalkfahnen und Ablagerungen an Rissen im Beton",
      "Undichte Arbeitsfugen zwischen Bodenplatte und Wand",
      "Nasse Stellen an Rohrdurchführungen in Betonwänden",
      "Rostspuren an Rissen als Hinweis auf angegriffene Bewehrung",
    ],
    layers: [
      {
        name: "Erdseitige Rissflanke",
        text: "Von außen drängt Wasser in den Riss, und genau bis dorthin muss das Injektionsharz vordringen.",
      },
      {
        name: "Rissverlauf im Bauteil",
        text: "Über schräg gesetzte Bohrpacker erreicht das Harz den Riss mitten im Querschnitt statt nur an der Oberfläche.",
      },
      {
        name: "Injektionsharz",
        text: "PU-Harz dichtet elastisch ab, Epoxidharz verbindet die Rissufer kraftschlüssig miteinander.",
      },
      {
        name: "Innenseite",
        text: "Nach dem Aushärten werden die Packer entfernt und die Bohrlöcher bündig mit Mörtel verschlossen.",
      },
    ],
    sections: [
      {
        heading: "Welche Risse verpresst werden müssen",
        paragraphs: [
          "Nicht jeder Riss im Keller ist ein Fall für die Injektion. Feine Schwindrisse im Putz sind meist harmlos und betreffen nur die Oberfläche. Anders sieht es bei Rissen aus, die durch die ganze Wand oder Bodenplatte gehen und Wasser führen. Sie zeigen sich als dunkle, feuchte Linien, bei Regen manchmal auch als rinnendes Wasser, oft begleitet von weißen Kalkfahnen, weil das durchsickernde Wasser Kalk aus dem Beton löst und an der Oberfläche ablagert.",
          "Typische Schwachstellen sind Arbeitsfugen zwischen Bodenplatte und Wand, Risse an Fenster- und Türöffnungen, Übergänge zwischen Altbau und Anbau sowie Rohrdurchführungen. Bevor wir injizieren, klären wir, ob der Riss noch arbeitet. Setzungsrisse, die sich weiter öffnen, deuten auf ein statisches Problem hin. In diesem Fall gehört zuerst ein Tragwerksplaner an den Tisch, denn eine Abdichtung ersetzt keine Ursachenbehebung an der Gründung.",
        ],
      },
      {
        heading: "PU-Harz oder Epoxid: das richtige Harz für den Riss",
        paragraphs: [
          "Für wasserführende Risse setzen wir Polyurethanharze ein. Steht Wasser unter Druck im Riss, stoppt ein schnell reagierendes, schäumendes PU-Harz zunächst den Wasserfluss. Unmittelbar danach wird ein elastisches PU-Harz nachinjiziert, das den Riss dauerhaft füllt und kleine Bewegungen des Bauteils mitmacht, etwa durch Temperaturwechsel. So bleibt der Riss auch dann dicht, wenn sich seine Breite im Lauf des Jahres leicht verändert.",
          "Epoxidharz verwenden wir, wenn der Riss nicht nur dicht, sondern auch kraftschlüssig geschlossen werden soll. Es verklebt die Rissufer fest miteinander und stellt die Tragfähigkeit des Bauteils wieder her. Dafür muss der Riss allerdings zur Ruhe gekommen und weitgehend trocken sein, denn Epoxid ist starr und würde bei weiteren Bewegungen daneben erneut reißen. Neben den Injektionsharzen setzen wir an undichten Stellen je nach Befund auch spezielle Dichtungsmassen ein. Welches Material passt, entscheiden wir nach Rissbreite, Feuchtezustand und Bewegungsverhalten.",
        ],
        bullets: [
          "Sofortiger Stopp von fließendem Wassereintritt",
          "Dauerhafte Dehnfähigkeit bei Bauteilbewegungen mit PU-Harz",
          "Kraftschlüssiger Verbund mit Epoxidharz",
          "Geeignet für WU-Betonkeller und Weiße Wannen",
        ],
      },
      {
        heading: "Risse in WU-Beton und Weißen Wannen",
        paragraphs: [
          "Keller aus wasserundurchlässigem Beton, sogenannte Weiße Wannen, brauchen keine zusätzliche Abdichtungsschicht, weil der Beton selbst die Abdichtung ist. Das funktioniert nur, solange er rissfrei bleibt. Schon ein durchgehender Trennriss oder eine schlecht ausgeführte Arbeitsfuge genügt, damit Wasser in den Keller gelangt. Weil es keine zweite Schutzebene gibt, ist die Rissverpressung hier die fachlich richtige und oft die einzig sinnvolle Reparaturmethode.",
          "Wir bohren dazu beidseitig des Risses schräg in das Bauteil, sodass die Bohrungen den Riss in der Tiefe kreuzen, und setzen Injektionspacker. Über diese wird das Harz mit hohem Druck eingepresst, bis es an den benachbarten Packern oder an der Rissoberfläche austritt. Nach dem Aushärten werden die Packer entfernt und die Bohrlöcher verschlossen. Der Riss ist dann über den gesamten Querschnitt gefüllt, nicht nur oberflächlich zugespachtelt.",
        ],
      },
    ],
    steps: [
      {
        title: "Schadensanalyse mit Feuchtemessung",
        text: "Bei einer unverbindlichen Besichtigung außen und innen erfassen wir Verlauf, Breite und Wasserführung des Risses, messen die Feuchte und klären, ob er noch arbeitet.",
      },
      {
        title: "Verbindliches Angebot",
        text: "Auf Basis der Analyse erhalten Sie ein verbindliches Angebot mit dem passenden Harz für Ihren Riss.",
      },
      {
        title: "Sanierungsplan und Verpressung",
        text: "Nach Ihrem Auftrag stimmen wir den Ablauf gemeinsam ab. Dann injizieren wir über versetzte Schrägbohrungen mit Packern PU-Harz oder Epoxid, bis der Riss im ganzen Querschnitt gefüllt ist.",
      },
      {
        title: "Gemeinsame Abnahme",
        text: "Packer werden entfernt und Bohrlöcher verschlossen. Danach nehmen Sie die Arbeiten gemeinsam mit uns ab und erhalten eine saubere, für Putz oder Anstrich vorbereitete Fläche.",
      },
    ],
    faqs: [
      {
        q: "Kann ich einen nassen Riss einfach zuspachteln?",
        a: "Spachtelmasse oder Silikon schließen nur die Oberfläche. Das Wasser steht dahinter weiter im Riss, sucht sich einen neuen Weg und drückt die Spachtelung früher oder später heraus. Dauerhaft dicht wird ein Riss nur, wenn er über den gesamten Querschnitt gefüllt ist.",
      },
      {
        q: "Funktioniert die Rissverpressung auch bei gemauerten Kellerwänden?",
        a: "Bei Beton ist die Rissinjektion das Standardverfahren. In Mauerwerk verteilt sich das Harz auch in Fugen und Hohlräumen, deshalb kombinieren wir dort die Injektion meist mit einer Flächenabdichtung von innen. Welches Vorgehen sinnvoll ist, zeigt die Begutachtung vor Ort.",
      },
      {
        q: "Wie erkenne ich, ob ein Riss statisch bedenklich ist?",
        a: "Warnzeichen sind Risse, die breiter werden, schräg über Wandecken verlaufen oder mit klemmenden Türen und Fenstern einhergehen. Mit einfachen Gipsmarken lässt sich beobachten, ob sich ein Riss bewegt. Bei Verdacht auf Setzungen empfehlen wir, vor der Abdichtung einen Tragwerksplaner hinzuzuziehen.",
      },
    ],
    related: ["kellerinnenabdichtung", "kellersanierung", "horizontalsperre"],
  },

  // 7. Dachabdichtung
  {
    slug: "dachabdichtung",
    serviceName: "Dachabdichtung: Flachdach, Dachterrasse & Garage",
    navTitle: "Dachabdichtung",
    keyword: "Dachabdichtung",
    title: "Dachabdichtung: Flachdach & Garage dauerhaft dicht",
    metaDescription:
      "Dachabdichtung in NRW: Flachdach, Steildach, Dachterrasse und Garagendach dauerhaft dicht. Pr\u00fcfung kostenlos, 10 Jahre Garantie auf die Arbeit.",
    h1: "Dachabdichtung: Flachdach, Dachterrasse und Garagendach dauerhaft dicht",
    lede:
      "Ein undichtes Dach meldet sich selten dort, wo das Wasser eintritt. Wir suchen die Eintrittsstelle systematisch, dichten vollfl\u00e4chig ab und pr\u00fcfen jede Naht, bevor wir abnehmen.",
    symptoms: [
      "Feuchte Flecken oder Tropfstellen an der Decke nach Regen",
      "Blasen, Risse oder offene N\u00e4hte in der alten Dachbahn",
      "Stehendes Wasser auf dem Flachdach, das nicht abl\u00e4uft",
      "Moos und Wildwuchs in den Anschl\u00fcssen und Kehlen",
      "Nasse D\u00e4mmung: das Dach wird schwer und verliert D\u00e4mmwirkung",
      "Rostspuren an Attika, Einfassungen und Durchdringungen",
    ],
    layers: [
      { name: "Untergrund", text: "Altbahnen pr\u00fcfen, lose Lagen entfernen, Untergrund trocken und tragf\u00e4hig herstellen." },
      { name: "Dampfsperre & Gef\u00e4lle", text: "Wo n\u00f6tig Dampfsperre und Gef\u00e4lled\u00e4mmung, damit Wasser zum Ablauf l\u00e4uft statt zu stehen." },
      { name: "Abdichtungslage", text: "Zwei Lagen Elastomerbitumen, vollfl\u00e4chig verschwei\u00dft; Anschl\u00fcsse und Durchdringungen zuerst." },
      { name: "Schutz & Abnahme", text: "Kiessch\u00fcttung oder Schutzlage, dann Nahtpr\u00fcfung und gemeinsame Abnahme mit Protokoll." },
    ],
    sections: [
      {
        heading: "Flachdach, Steildach, Dachterrasse, Garagendach",
        paragraphs: [
          "Jede Dachform hat ihre eigene Schwachstelle: beim Flachdach die stehende N\u00e4sse, bei der Dachterrasse der T\u00fcranschluss, beim Garagendach die Attika und beim Steildach Kehlen und Durchdringungen. Wir dichten nicht die Fl\u00e4che irgendwo ab, sondern die Stelle, an der das Wasser nachweislich eintritt.",
          "Daf\u00fcr pr\u00fcfen wir das Dach vor dem Angebot: Sichtpr\u00fcfung der N\u00e4hte und Anschl\u00fcsse, bei Bedarf Feuchtemessung in der D\u00e4mmebene. Sie erhalten ein verbindliches Angebot f\u00fcr genau den Aufbau, den Ihr Dach braucht.",
        ],
      },
      {
        heading: "Verschwei\u00dft statt geflickt",
        paragraphs: [
          "Ein Flicken auf der Leckstelle h\u00e4lt selten l\u00e4nger als einen Winter, weil Wasser unter der alten Bahn wandert. Wir arbeiten vollfl\u00e4chig: zwei Lagen Elastomerbitumen, im Schwei\u00dfverfahren homogen verbunden, mit sauber eingearbeiteten An- und Abschl\u00fcssen.",
          "Auf die Arbeit geben wir 10 Jahre Garantie. Die Abnahme erfolgt gemeinsam am fertigen Dach, mit Pr\u00fcfung aller N\u00e4hte.",
        ],
      },
    ],
    steps: [
      { title: "Dachpr\u00fcfung", text: "Besichtigung von Fl\u00e4che, N\u00e4hten und Anschl\u00fcssen; bei Bedarf Feuchtemessung in der D\u00e4mmung." },
      { title: "Verbindliches Angebot", text: "Aufbau, Material und Festpreis f\u00fcr Ihr Dach, ohne versteckte Positionen." },
      { title: "Abdichtung", text: "Anschl\u00fcsse zuerst, dann die Fl\u00e4che: zwei Lagen, vollfl\u00e4chig verschwei\u00dft." },
      { title: "Nahtpr\u00fcfung & Abnahme", text: "Jede Naht wird gepr\u00fcft; \u00dcbergabe mit Protokoll und 10 Jahren Garantie auf die Arbeit." },
    ],
    faqs: [
      {
        q: "Woran erkenne ich, dass mein Flachdach undicht ist?",
        a: "Typisch sind feuchte Flecken an der Decke nach Regen, Blasen oder offene N\u00e4hte in der Dachbahn und stehendes Wasser, das nach zwei Tagen noch nicht abgelaufen ist. Da Wasser unter der Bahn wandert, liegt die Eintrittsstelle oft nicht \u00fcber dem Fleck. Sicherheit gibt die Pr\u00fcfung am Dach.",
      },
      {
        q: "Muss die alte Dachbahn immer komplett herunter?",
        a: "Nein. Ist die alte Lage trocken und tragf\u00e4hig, kann sie als Untergrund bleiben und wird \u00fcberarbeitet. Ist die D\u00e4mmung durchfeuchtet, muss der nasse Bereich heraus, sonst dichtet man die N\u00e4sse ein. Das kl\u00e4rt die Feuchtemessung vor dem Angebot.",
      },
      {
        q: "Welche Dacharten decken Sie ab?",
        a: "Flachd\u00e4cher, Dachterrassen, Garagend\u00e4cher und die Abdichtungsdetails am Steildach, etwa Kehlen, Gauben und Durchdringungen. F\u00fcr jede Form gilt derselbe Ablauf: pr\u00fcfen, verbindlich anbieten, vollfl\u00e4chig abdichten, gemeinsam abnehmen.",
      },
    ],
    related: ["balkon-terrasse", "sockelabdichtung", "rissverpressung"],
  },

  // 8. Balkon & Terrasse
  {
    slug: "balkon-terrasse",
    serviceName: "Balkon- und Terrassenabdichtung",
    navTitle: "Balkon & Terrasse",
    keyword: "Balkon abdichten",
    title: "Balkon abdichten: fugenlos & begehbar | sos-abdichtung",
    metaDescription:
      "Balkon abdichten ohne Abriss: Fl\u00fcssigkunststoff dichtet fugenlos bis unter die T\u00fcr. F\u00fcr Balkon, Loggia und Terrasse. 10 Jahre Garantie auf die Arbeit.",
    h1: "Balkon abdichten: fugenlos dicht, auch am T\u00fcranschluss",
    lede:
      "Balkone werden fast nie in der Fl\u00e4che undicht, sondern am Detail: T\u00fcranschluss, Gel\u00e4nderfu\u00df, Randabschluss. Fl\u00fcssigkunststoff dichtet genau diese Stellen fugenlos ab und bleibt begehbar.",
    symptoms: [
      "Feuchte Flecken an der Decke unter dem Balkon",
      "Frostsch\u00e4den: abgeplatzte Fliesen und m\u00fcrber Estrich",
      "Risse im Belag oder in der Aufkantung am Rand",
      "Wasserr\u00e4nder an der Balkont\u00fcr oder der Schwelle",
      "Gr\u00fcnbelag in Ecken, in denen Wasser stehen bleibt",
      "Rost am Gel\u00e4nderfu\u00df oder an der Entw\u00e4sserung",
    ],
    layers: [
      { name: "Untergrund", text: "Belag pr\u00fcfen, lose Teile entfernen, Risse kraftschl\u00fcssig schlie\u00dfen, Fl\u00e4che grundieren." },
      { name: "Detailabdichtung", text: "T\u00fcranschluss, Gel\u00e4nderf\u00fc\u00dfe und R\u00e4nder zuerst: mit Vlies armiert, 15 cm hochgezogen." },
      { name: "Fl\u00e4chenabdichtung", text: "Fl\u00fcssigkunststoff in zwei Lagen, fugenlos und UV-best\u00e4ndig, mit Gef\u00e4lle zum Ablauf." },
      { name: "Nutzschicht", text: "Begehbare Oberfl\u00e4che nach Wunsch: Quarzsand-Einstreu, Beschichtung oder neuer Belag." },
    ],
    sections: [
      {
        heading: "Warum Fl\u00fcssigkunststoff",
        paragraphs: [
          "Bahnen und Fliesen scheitern am Balkon an den Details: jede Naht, jede Fuge und jeder Anschluss ist eine Eintrittsstelle. Fl\u00fcssigkunststoff wird fl\u00fcssig aufgetragen und h\u00e4rtet zu einer einzigen, nahtlosen Haut aus, die bis unter die T\u00fcrschwelle und um jeden Gel\u00e4nderfu\u00df reicht.",
          "Die Abdichtung bleibt elastisch, \u00fcberbr\u00fcckt k\u00fcnftige Haarrisse und ist nach Stunden regenfest. In den meisten F\u00e4llen ist kein Abriss des Belags n\u00f6tig.",
        ],
      },
      {
        heading: "Begehbar und gestaltbar",
        paragraphs: [
          "Auf die Abdichtung kommt die Nutzschicht: rutschfeste Einstreu, eine farbige Beschichtung oder ein neuer Belag auf Stelzlagern. Die Fl\u00e4che bleibt begehbar und sieht wieder nach Terrasse aus, nicht nach Baustelle.",
          "Vor dem Angebot pr\u00fcfen wir Gef\u00e4lle, Anschlussh\u00f6hen und den Zustand des Untergrunds. Sie erhalten einen Festpreis und 10 Jahre Garantie auf die Arbeit.",
        ],
      },
    ],
    steps: [
      { title: "Pr\u00fcfung vor Ort", text: "Belag, Gef\u00e4lle, T\u00fcranschluss und Entw\u00e4sserung: wir suchen die tats\u00e4chliche Eintrittsstelle." },
      { title: "Verbindliches Angebot", text: "Aufbau und Festpreis, inklusive Nutzschicht nach Ihrer Wahl." },
      { title: "Detail- und Fl\u00e4chenabdichtung", text: "Anschl\u00fcsse zuerst, dann die Fl\u00e4che: fugenloser Fl\u00fcssigkunststoff in zwei Lagen." },
      { title: "Abnahme", text: "Gemeinsame Abnahme der fertigen Fl\u00e4che, mit Protokoll und 10 Jahren Garantie auf die Arbeit." },
    ],
    faqs: [
      {
        q: "Muss der alte Balkonbelag komplett entfernt werden?",
        a: "Meist nicht. Ist der Untergrund tragf\u00e4hig, wird direkt auf dem vorhandenen Belag gearbeitet: reinigen, grundieren, abdichten. Nur lose Fliesen und m\u00fcrber Estrich m\u00fcssen heraus. Das kl\u00e4rt die Pr\u00fcfung vor dem Angebot.",
      },
      {
        q: "Wie lange dauert eine Balkonabdichtung?",
        a: "Ein normaler Balkon ist in ein bis zwei Arbeitstagen abgedichtet, die Fl\u00e4che ist nach wenigen Stunden regenfest und nach etwa einem Tag begehbar. Terrassen und Loggien entsprechend nach Fl\u00e4che.",
      },
      {
        q: "H\u00e4lt Fl\u00fcssigkunststoff auch unter der Balkont\u00fcr?",
        a: "Ja, das ist seine St\u00e4rke. Die Abdichtung wird mit Vlies armiert und mindestens 15 Zentimeter an T\u00fcr und Wand hochgezogen, bei niedrigen Schwellen mit speziellem Anschlussprofil. Genau an dieser Stelle versagen Bahnenabdichtungen am h\u00e4ufigsten.",
      },
    ],
    related: ["dachabdichtung", "sockelabdichtung", "rissverpressung"],
  },

  // 9. Sockelabdichtung
  {
    slug: "sockelabdichtung",
    serviceName: "Sockelabdichtung & Mauerwerkstrockenlegung",
    navTitle: "Sockelabdichtung",
    keyword: "Sockel abdichten",
    title: "Sockel abdichten: Schutz vor Spritzwasser & Feuchte",
    metaDescription:
      "Sockel abdichten als Teil der Mauerwerkstrockenlegung: Spritzwasserzone freilegen, zweilagig beschichten, sauber anschließen. 10 Jahre Garantie auf die Arbeit.",
    h1: "Sockel abdichten: die Spritzwasserzone dauerhaft dicht",
    lede:
      "Der Sockel ist die h\u00e4rtest beanspruchte Zone am Haus: Spritzwasser von oben, Erdfeuchte von unten, Frost im Winter. Wenn dort Putz platzt und Farbe bl\u00e4ttert, hilft kein Anstrich, sondern eine Abdichtung.",
    symptoms: [
      "Abplatzender Putz und Bl\u00e4schen in der Sockelfarbe",
      "Dunkler Feuchterand am Haussockel nach Regen",
      "Salzausbl\u00fchungen in den unteren 30 bis 50 Zentimetern",
      "Gr\u00fcnbelag und Moos am Sockel auf der Wetterseite",
      "Frostsch\u00e4den: sandender Putz, der gro\u00dffl\u00e4chig abf\u00e4llt",
      "Feuchte Innenwand hinter dem besch\u00e4digten Sockel",
    ],
    layers: [
      { name: "Freilegen", text: "Sockel bis unter die Gel\u00e4ndelinie freilegen, Altputz und lose Beschichtung entfernen." },
      { name: "Dickbeschichtung", text: "Zwei Lagen Bitumen-Dickbeschichtung vom Fundamentansatz bis 30 cm \u00fcber Gel\u00e4nde." },
      { name: "Schutz & Drainung", text: "Noppenbahn als Schutz, bei Bedarf Kiesstreifen, damit Spritzwasser versickert statt steht." },
      { name: "Sockelputz", text: "Wasserabweisender Sockelputz und Anstrich: die Zone sieht wieder aus wie neu und bleibt es." },
    ],
    sections: [
      {
        heading: "Warum der Sockel zuerst leidet",
        paragraphs: [
          "Regen prallt auf das Pflaster und spritzt zur\u00fcck an die Fassade: die unteren 30 Zentimeter werden bei jedem Schauer nass. Gleichzeitig zieht Erdfeuchte von unten in den Putz. Normale Fassadenfarbe h\u00e4lt dieser Doppelbelastung nicht stand, deshalb bl\u00e4ttert der Sockel immer wieder, egal wie oft man streicht.",
          "Die L\u00f6sung ist eine echte Abdichtung der Zone: freilegen, zweilagig beschichten, sch\u00fctzen und mit einem Sockelputz abschlie\u00dfen, der Wasser abweist, aber Wasserdampf durchl\u00e4sst.",
        ],
      },
      {
        heading: "Sauber angeschlossen",
        paragraphs: [
          "Eine Sockelabdichtung ist nur so gut wie ihre Anschl\u00fcsse: oben an die Fassade, unten an die Kellerabdichtung oder das Fundament. Wir arbeiten beide \u00dcberg\u00e4nge sauber ein, damit keine neue Eintrittskante entsteht.",
          "Die Arbeiten betreffen nur die Sockelzone; Garten und Pflaster bleiben bis auf den schmalen Arbeitsstreifen unber\u00fchrt. Auf die Arbeit geben wir 10 Jahre Garantie.",
        ],
      },
    ],
    steps: [
      { title: "Messung & Befund", text: "Feuchtemessung am Sockel und innen dahinter: Spritzwasser, Erdfeuchte oder beides." },
      { title: "Verbindliches Angebot", text: "Aufbau, Anschlussh\u00f6hen und Festpreis f\u00fcr Ihre Sockelzone." },
      { title: "Freilegen & Abdichten", text: "Altputz herunter, zwei Lagen Dickbeschichtung, Schutzlage und Anschl\u00fcsse." },
      { title: "Sockelputz & Abnahme", text: "Wasserabweisender Putz und Anstrich, dann gemeinsame Abnahme mit Protokoll." },
    ],
    faqs: [
      {
        q: "Reicht es nicht, den Sockel neu zu streichen?",
        a: "Nein. Farbe ist keine Abdichtung: Spritzwasser und Erdfeuchte dr\u00fccken von beiden Seiten in den Putz, und der n\u00e4chste Winter sprengt die neue Schicht wieder ab. Dauerhaft hilft nur, die Zone abzudichten und mit wasserabweisendem Sockelputz zu schlie\u00dfen.",
      },
      {
        q: "Muss daf\u00fcr der Garten aufgegraben werden?",
        a: "Nur ein schmaler Streifen direkt am Haus, so tief, dass die Abdichtung unter der Gel\u00e4ndelinie ansetzen kann. Beete, Pflaster und Rasen daneben bleiben unber\u00fchrt. Das unterscheidet die Sockelabdichtung von einer kompletten Au\u00dfenabdichtung.",
      },
      {
        q: "Was kostet eine Sockelabdichtung?",
        a: "Das h\u00e4ngt von L\u00e4nge, Zustand und Anschlussh\u00f6hen ab. Nach der kostenlosen Messung vor Ort erhalten Sie ein verbindliches Festpreisangebot; versteckte Nachtr\u00e4ge gibt es nicht.",
      },
    ],
    related: ["dachabdichtung", "balkon-terrasse", "kellersanierung"],
  },
];

export const CITY_PAGES: CityPage[] = [
  // Wuppertal
  {
    slug: "wuppertal",
    name: "Wuppertal",
    keyword: "Kellersanierung Wuppertal",
    title: "Kellersanierung Wuppertal | Feuchter Keller, ohne Aufgraben",
    metaDescription:
      "Kellersanierung Wuppertal: feuchter Keller, Hangwasser, Bruchstein- und Gründerzeitkeller von innen trockenlegen. Messung kostenlos, Festpreis.",
    h1: "Kellersanierung Wuppertal: Ihr feuchter Keller wird trocken, auch in Hanglage",
    lede:
      "Zwischen Vohwinkel und Beyenburg stehen viele Häuser am Hang oder nah an der Wupper. Wir kennen die typischen Kellerschäden dieser Stadt und sind in Wuppertal in der Regel innerhalb von 24 Stunden bei Ihnen.",
    plz: [
      "42103", "42105", "42107", "42109", "42111", "42113", "42115", "42117", "42119",
      "42275", "42277", "42279", "42281", "42283", "42285", "42287", "42289",
      "42327", "42329", "42349", "42369", "42389", "42399",
    ],
    districts: [
      "Elberfeld",
      "Elberfeld-West",
      "Barmen",
      "Oberbarmen",
      "Heckinghausen",
      "Vohwinkel",
      "Cronenberg",
      "Ronsdorf",
      "Uellendahl-Katernberg",
      "Langerfeld-Beyenburg",
    ],
    geo: { lat: 51.256, lng: 7.151 },
    responseTime: "24 Stunden",
    localFactors: [
      {
        name: "Hang- und Schichtenwasser",
        text: "Viele Straßen ziehen sich steil die Talflanken hinauf. Regenwasser läuft im Boden hangabwärts und staut sich an der bergseitigen Kellerwand, die dadurch deutlich nasser ist als die Talseite.",
      },
      {
        name: "Gründerzeitkeller aus Bruchstein und Ziegel",
        text: "Die Altbauviertel in Elberfeld und Barmen, etwa das Briller Viertel oder der Ölberg, entstanden größtenteils im späten 19. und frühen 20. Jahrhundert. Ihre Keller besitzen selten eine funktionierende Horizontalsperre.",
      },
      {
        name: "Regenreiches Bergisches Klima",
        text: "Feuchte Westwinde regnen sich an den bergischen Höhen ab, entsprechend oft und ergiebig regnet es in Wuppertal. Die Böden kommen zwischen den Regenperioden kaum zur Ruhe.",
      },
      {
        name: "Talsohle an der Wupper",
        text: "In den Lagen nah am Fluss sind die Böden feuchter, und bei Hochwasser wie im Juli 2021 können Keller auch von unten volllaufen.",
      },
    ],
    sections: [
      {
        heading: "Altbauten zwischen Briller Viertel und Ölberg",
        paragraphs: [
          "Wer in Elberfeld oder Barmen einen Altbau besitzt, kennt das Bild: hohe Räume, stuckverzierte Fassaden und darunter ein Keller, der nie für eine trockene Nutzung gebaut wurde. Die Villen im Briller Viertel ebenso wie die dicht bebauten Straßen am Ölberg und in der Nordstadt entstanden überwiegend in der Blütezeit der Wuppertaler Textilindustrie. Die Kellerwände bestehen aus Bruchstein oder Ziegel, verfugt mit Kalkmörtel, und eine wirksame Sperrschicht gegen aufsteigende Feuchte fehlt meist ganz.",
          "Genau diese Keller lassen sich von außen kaum sanieren. Viele Häuser stehen in geschlossener Bebauung, die Vorgärten sind schmal oder fehlen, und manche Hauswand grenzt unmittelbar an den Gehweg. Wir arbeiten deshalb von innen: Horizontalsperre im Injektionsverfahren, verfüllte Hohlräume im Bruchstein, Innenabdichtung an den erdberührten Wänden und ein Sanierputz, der die über Jahrzehnte eingelagerten Salze aufnimmt. Stuck, Fassade und Vorgarten bleiben dabei unberührt.",
        ],
      },
      {
        heading: "Hanglagen auf den Südhöhen und an den Nordhängen",
        paragraphs: [
          "Cronenberg, Küllenhahn und Ronsdorf liegen auf den Südhöhen, Uellendahl und Katernberg an den nördlichen Hängen über Elberfeld. Hier ist selten das Grundwasser das Problem, sondern Wasser, das nach Regen im Hang abwärts sickert. An Schichtgrenzen im Untergrund tritt es als Schichtenwasser aus und trifft auf die Kellerwand, die in den Hang hineingebaut ist. Typisch ist dann ein Keller, dessen bergseitige Wand nass ist, während die talseitige Wand trocken bleibt.",
          "Diese einseitige Belastung verlangt ein differenziertes Konzept. Die bergseitige Wand bekommt häufig eine Innenabdichtung, die auch zeitweise drückendem Sickerwasser standhält, während an den übrigen Wänden eine Horizontalsperre und ein Sanierputz ausreichen. Wo nach starkem Regen Wasser am Boden-Wand-Anschluss austritt, legen wir besonderes Augenmerk auf die Hohlkehle. So bezahlen Sie nur für die Maßnahmen, die an der jeweiligen Wand wirklich nötig sind, und erhalten dafür einen Festpreis.",
        ],
      },
      {
        heading: "Nah an der Wupper: Hochwasser und nasse Talsohle",
        paragraphs: [
          "Entlang der Talsohle, von Vohwinkel über Sonnborn und Elberfeld bis Oberbarmen und Beyenburg, liegen viele Keller nicht weit über dem Flussniveau, oft direkt unter der Trasse der Schwebebahn. Beim Hochwasser im Juli 2021 ist vielen Wuppertalern bewusst geworden, wie schnell ein Keller volllaufen kann. Nach einem solchen Ereignis bleibt das Mauerwerk lange feucht, und Schäden, die schon vorher bestanden, treten deutlicher hervor als zuvor.",
          "Nach einem Wasserschaden messen wir zunächst, wie tief die Nässe ins Mauerwerk eingedrungen ist und ob die Wand von selbst abtrocknen kann. Ist sie dauerhaft durchfeuchtet, wird die Trocknung Teil einer vollständigen Kellersanierung mit Horizontalsperre und Sanierputz. Wasserführende Risse in Betonkellern jüngerer Häuser verpressen wir mit PU-Harz. Die kostenlose Messung vor Ort zeigt, welcher Weg bei Ihrem Keller der richtige ist.",
        ],
      },
    ],
    faqs: [
      {
        q: "Wie schnell sind Sie in Wuppertal vor Ort?",
        a: "Innerhalb Wuppertals sind wir in der Regel binnen 24 Stunden bei Ihnen, von Vohwinkel bis Beyenburg. Schicken Sie vorab gern Fotos per WhatsApp, dann kann Herr Mahmood den Schaden schon vor dem Termin grob einschätzen. Die Feuchtemessung vor Ort ist kostenlos.",
      },
      {
        q: "Muss bei einem Haus am Hang in Wuppertal aufgegraben werden?",
        a: "Nein. Gerade am Hang wäre eine Außenaufgrabung besonders aufwendig, weil Stützmauern, Treppen und oft auch Nachbargrundstücke betroffen sind. Wir sanieren komplett von innen und sparen Ihnen damit bis zu 60 Prozent gegenüber einer Außenaufgrabung.",
      },
      {
        q: "Sanieren Sie auch Keller in denkmalgeschützten Häusern?",
        a: "Ja, die Arbeiten finden im Keller statt und verändern die Fassade nicht. Ob auch für Eingriffe im Inneren eine denkmalrechtliche Erlaubnis nötig ist, sollten Sie vorab mit der Unteren Denkmalbehörde der Stadt Wuppertal klären. Die technische Beschreibung der geplanten Maßnahmen stellen wir Ihnen dafür gern zur Verfügung.",
      },
    ],
    nearby: ["solingen", "remscheid", "velbert"],
  },

  // Solingen
  {
    slug: "solingen",
    name: "Solingen",
    keyword: "Kellersanierung Solingen",
    title: "Kellersanierung Solingen | Feuchte Keller trockenlegen",
    metaDescription:
      "Kellersanierung Solingen: feuchte Keller von Gräfrath bis Ohligs von innen trockenlegen. Kostenlose Messung, 10 Jahre Garantie auf die Arbeit.",
    h1: "Kellersanierung Solingen: von der Wupper bis zur Ohligser Heide",
    lede:
      "Die Klingenstadt reicht vom steilen Wuppertal bei Burg bis in die flacheren Lagen im Westen. Entsprechend unterschiedlich sind die Ursachen feuchter Keller, und entsprechend genau muss man hinschauen.",
    plz: ["42651", "42653", "42655", "42657", "42659", "42697", "42699", "42719"],
    districts: ["Solingen-Mitte", "Ohligs", "Wald", "Gräfrath", "Höhscheid", "Aufderhöhe", "Merscheid", "Burg"],
    geo: { lat: 51.171, lng: 7.083 },
    responseTime: "24 bis 48 Stunden",
    localFactors: [
      {
        name: "Steile Bachtäler zur Wupper",
        text: "Zahlreiche Bäche haben sich tief in das Stadtgebiet eingeschnitten und fließen der Wupper zu. Häuser an diesen Talhängen bekommen von der Bergseite Hang- und Sickerwasser ab.",
      },
      {
        name: "Schieferhäuser in Gräfrath",
        text: "Rund um den Gräfrather Markt stehen Fachwerk- und Schieferhäuser, deren Keller aus Bruchstein gemauert sind und keine Sperrschicht besitzen.",
      },
      {
        name: "Wiederaufbau nach dem Krieg",
        text: "Die Solinger Innenstadt wurde im Zweiten Weltkrieg weitgehend zerstört und neu aufgebaut. Keller aus dieser Zeit zeigen nicht selten Risse und undichte Arbeitsfugen.",
      },
      {
        name: "Wupper-Hochwasser",
        text: "In Unterburg und anderen Lagen direkt an der Wupper hat das Hochwasser im Juli 2021 gezeigt, wie schnell Keller volllaufen können.",
      },
    ],
    sections: [
      {
        heading: "Gräfrath, Burg und die alten Kotten",
        paragraphs: [
          "Gräfrath mit seinem Marktplatz, den verschieferten Fassaden und dem Deutschen Klingenmuseum gehört zu den schönsten historischen Ortskernen im Bergischen Land. Unter den Häusern liegen Keller, die aus Bruchstein und Kalkmörtel errichtet wurden. Sie waren als kühle Vorratsräume gedacht, nie als trockene Nutzräume. Ähnlich sieht es in den Hofschaften und alten Schleifkotten entlang der Bachtäler aus, in denen früher die Solinger Klingen geschliffen wurden.",
          "In solchen Wänden steigt die Feuchte über die Mörtelfugen auf, und Hohlräume zwischen den unregelmäßigen Steinen erschweren jede Abdichtung. Wir verfüllen diese Hohlräume vor der Injektion, damit das Injektionsmittel dort ankommt, wo es wirken soll, und nicht ins Leere läuft. Eine Vortrocknung der oft seit Generationen nassen Wände ist dabei in der Regel nicht notwendig. Weil die Fassaden erhalten bleiben sollen, findet die gesamte Sanierung im Keller statt. Schieferkleid und Fachwerk bleiben unangetastet, und außen ist kein Spatenstich nötig.",
        ],
      },
      {
        heading: "Ohligs, Wald und die Häuser der Nachkriegszeit",
        paragraphs: [
          "Nach Westen hin, in Ohligs, Aufderhöhe und Merscheid, wird das Gelände flacher. Hier stehen viele Siedlungs- und Reihenhäuser aus der Nachkriegszeit und den folgenden Jahrzehnten. Ihre Keller sind oft aus Beton oder Kalksandstein und haben eine äußere Abdichtung, die nach so langer Zeit spröde geworden ist. Feuchte dringt dann an Arbeitsfugen, Rohrdurchführungen oder Rissen ein, meist punktuell statt großflächig und vor allem nach längeren Regenperioden.",
          "Für diese Keller ist eine flächige Sanierung selten nötig. Häufig reicht es, wasserführende Risse mit PU-Harz zu verpressen und die Übergänge zwischen Bodenplatte und Wand gezielt von innen abzudichten. Die nach dem Krieg neu aufgebaute Innenstadt und Teile von Wald zeigen ähnliche Schadensbilder. Die kostenlose Feuchtemessung vor Ort klärt, ob ein punktueller Eingriff genügt oder ob die Wand großflächig betroffen ist und mehr braucht.",
        ],
      },
    ],
    faqs: [
      {
        q: "Kommen Sie auch nach Burg und in die Orte an der Wupper?",
        a: "Ja, wir sind im gesamten Solinger Stadtgebiet tätig, auch in Unterburg und den Hofschaften an der Wupper. Vor Ort sind wir in der Regel innerhalb von 24 bis 48 Stunden. Nach einem Hochwasserschaden klären wir zuerst, wie tief die Nässe im Mauerwerk sitzt.",
      },
      {
        q: "Lässt sich ein Gräfrather Schieferhaus sanieren, ohne die Fassade anzufassen?",
        a: "Ja. Horizontalsperre, Innenabdichtung und Sanierputz werden ausschließlich im Keller eingebaut. Schieferkleid und Fachwerk bleiben vollständig erhalten, und außen sind keine Erdarbeiten nötig.",
      },
    ],
    nearby: ["wuppertal", "remscheid", "wermelskirchen"],
  },

  // Remscheid
  {
    slug: "remscheid",
    name: "Remscheid",
    keyword: "Kellersanierung Remscheid",
    title: "Kellersanierung Remscheid | Nasse Kellerwände sanieren",
    metaDescription:
      "Kellersanierung Remscheid: nasse Kellerwände in Lennep, Lüttringhausen und Alt-Remscheid ohne Aufgraben trockenlegen. Kostenlose Messung.",
    h1: "Kellersanierung Remscheid: trockene Keller trotz Höhenlage und Regen",
    lede:
      "Remscheid liegt höher als jede andere Stadt im Bergischen Land und bekommt entsprechend viel Regen ab. Für Keller heißt das: Die Wände sind oft über Monate nass, und nur eine sorgfältig geplante Sanierung bringt sie dauerhaft zur Ruhe.",
    plz: ["42853", "42855", "42857", "42859", "42897", "42899"],
    districts: ["Alt-Remscheid", "Süd", "Lennep", "Lüttringhausen", "Hasten", "Vieringhausen", "Reinshagen"],
    geo: { lat: 51.179, lng: 7.194 },
    responseTime: "24 bis 48 Stunden",
    localFactors: [
      {
        name: "Steigungsregen auf den Höhen",
        text: "Feuchte Westwinde steigen an den bergischen Höhen auf und regnen sich dort ab. Remscheid zählt dadurch zu den regenreichsten Städten Deutschlands.",
      },
      {
        name: "Schieferhäuser in Lennep und Lüttringhausen",
        text: "Die historischen Ortskerne sind geprägt von verschieferten Fachwerkhäusern auf Bruchsteinsockeln, deren Keller keine Horizontalsperre besitzen.",
      },
      {
        name: "Geklüfteter Fels im Untergrund",
        text: "Unter oft dünnen Bodenschichten liegt Schiefer- und Grauwackegestein. Sickerwasser folgt den Klüften und tritt häufig genau an der Kellerwand aus.",
      },
      {
        name: "Tiefe Täler zur Wupper",
        text: "Zwischen den Höhen und der Wupper bei Müngsten liegen große Höhenunterschiede, viele Häuser stehen deshalb in Hanglage.",
      },
    ],
    sections: [
      {
        heading: "Lennep und Lüttringhausen: Schiefer, Fachwerk und Bruchsteinkeller",
        paragraphs: [
          "Die Altstadt von Lennep, Geburtsort von Wilhelm Conrad Röntgen, ist ein weitgehend geschlossen erhaltenes historisches Ensemble. Häuser in den bergischen Farben, mit schwarzem Schiefer, weißen Fenstern und grünen Läden, stehen dicht an dicht in engen Gassen. Auch in Lüttringhausen ist der alte Ortskern erhalten. Unter diesen Häusern liegen Keller aus Bruchstein, oft mit Gewölbe, die über Generationen als Vorratsräume dienten und heute als Werkstatt, Lager oder Hobbyraum genutzt werden sollen.",
          "Die engen Gassen lassen eine Außenaufgrabung praktisch nicht zu, und oft teilen sich Nachbarhäuser eine Wand. Wir sanieren diese Keller deshalb vollständig von innen. Im Bruchstein verfüllen wir zunächst Hohlräume und offene Fugen, danach setzen wir die Bohrlöcher für die Horizontalsperre im Abstand von bis zu 20 cm. Eine Vortrocknung ist in der Regel nicht notwendig, auch wenn das Mauerwerk nach einem Remscheider Regenwinter sehr nass ist. Gewölbekeller erhalten einen diffusionsoffenen Sanierputz, damit das Mauerwerk in der langen Trocknungsphase weiter Feuchte abgeben kann.",
        ],
      },
      {
        heading: "Viel Regen, wenig Pause: warum Remscheider Keller länger nass bleiben",
        paragraphs: [
          "In einer Stadt, in der es häufig und ergiebig regnet, kommen die Böden kaum zur Ruhe. Das Wasser sickert durch die oft dünne Bodenschicht und folgt im geklüfteten Fels den Spalten. Wo ein Keller in den Hang gebaut ist, trifft dieses Wasser direkt auf die Wand, teils mit spürbarem Druck. Die Folge sind Keller, die nach Regenperioden deutlich nasser sind als im Hochsommer, mit Wasser am Boden-Wand-Anschluss und dunklen Feuchtefeldern auf der Bergseite.",
          "Gegen eine solche wechselnde Belastung reicht eine einfache Sperre nicht. Wir kombinieren an den betroffenen Wänden eine mehrlagige Innenabdichtung aus mineralischen Dichtungsschlämmen mit einer sorgfältig ausgebildeten Hohlkehle. Wasserführende Risse in Betonteilen werden vorher mit PU-Harz verpresst. Weil die Trocknung im feuchten Remscheider Klima länger dauert als anderswo, planen wir bei Bedarf eine Schutzentfeuchtung ein, bevor der Sanierputz aufgebracht wird. So entsteht kein Zeitdruck, der später zu Schäden führt.",
        ],
      },
    ],
    faqs: [
      {
        q: "Lohnt sich die Kellersanierung bei einem Schieferhaus in Lennep?",
        a: "Ja, gerade dort. Ein trockener Keller schützt die Holzbalken der darüberliegenden Decke und den Bruchsteinsockel, auf dem das ganze Haus steht. Da wir nur von innen arbeiten, bleiben Fassade und Straßenbild unverändert.",
      },
      {
        q: "Warum ist mein Keller im Winter nasser als im Sommer?",
        a: "In Remscheid regnet es das ganze Jahr über viel, im Winterhalbjahr verdunstet jedoch deutlich weniger. Der Boden bleibt länger gesättigt, und Sickerwasser steht länger an der Kellerwand an. Ob es sich um eindringendes Wasser oder Kondensat handelt, zeigt die Messung vor Ort.",
      },
    ],
    nearby: ["wuppertal", "solingen", "wermelskirchen"],
  },

  // Velbert
  {
    slug: "velbert",
    name: "Velbert",
    keyword: "Kellersanierung Velbert",
    title: "Kellersanierung Velbert | Neviges, Langenberg & Mitte",
    metaDescription:
      "Kellersanierung Velbert: feuchte Keller in Neviges, Langenberg und Velbert-Mitte von innen abdichten. Kostenlose Feuchtemessung, Festpreis.",
    h1: "Kellersanierung Velbert: Altstadtkeller und Hanghäuser trockenlegen",
    lede:
      "Velbert vereint drei sehr unterschiedliche Stadtteile: die Schlossstadt auf der Höhe, den Wallfahrtsort Neviges und das historische Langenberg im Deilbachtal. Jeder bringt eigene Kellerprobleme mit.",
    plz: ["42549", "42551", "42553", "42555"],
    districts: ["Velbert-Mitte", "Neviges", "Langenberg", "Tönisheide", "Nierenhof"],
    geo: { lat: 51.340, lng: 7.043 },
    responseTime: "24 bis 48 Stunden",
    localFactors: [
      {
        name: "Historische Ortskerne mit Bruchsteinkellern",
        text: "In Neviges und Langenberg stehen zahlreiche Fachwerk- und Schieferhäuser aus vergangenen Jahrhunderten, deren Keller keine Sperrschicht gegen aufsteigende Feuchte besitzen.",
      },
      {
        name: "Enge Bachtäler",
        text: "Langenberg liegt im Tal des Deilbachs, Neviges am Hardenberger Bach. In diesen Tallagen sammelt sich Wasser aus den umliegenden Hängen.",
      },
      {
        name: "Hangbebauung rund um Velbert-Mitte",
        text: "Die Innenstadt liegt auf einem Höhenrücken des Niederbergischen Landes, zu allen Seiten fällt das Gelände in Täler ab. Viele Häuser sind deshalb in den Hang gebaut.",
      },
    ],
    sections: [
      {
        heading: "Neviges und Langenberg: historische Keller im Tal",
        paragraphs: [
          "Neviges ist vor allem durch den Mariendom bekannt, den markanten Betonbau von Gottfried Böhm. Rund um Schloss Hardenberg und im alten Ortskern stehen aber auch viele deutlich ältere Häuser. Noch geschlossener ist das historische Bild in Langenberg, wo sich Fachwerk- und Schieferhäuser im Deilbachtal aneinanderreihen. Die Keller dieser Häuser sind aus Bruchstein oder Ziegel gemauert, liegen häufig nah am Bach und wurden nie gegen Feuchte abgedichtet.",
          "Für diese Gebäude ist die Sanierung von innen oft die einzige praktikable Lösung. Wir injizieren eine Horizontalsperre in das alte Mauerwerk, nachdem die Hohlräume im Bruchstein verfüllt wurden, und dichten die erdberührten Wandflächen mit mineralischen Dichtungsschlämmen ab. Der Sanierputz nimmt die Salze auf, die sich über Generationen in den Wänden angesammelt haben. Außen bleibt alles, wie es ist, was in den engen Ortskernen auch kaum anders ginge.",
        ],
      },
      {
        heading: "Velbert-Mitte und Tönisheide: Keller in Hang- und Höhenlage",
        paragraphs: [
          "Velbert-Mitte und Tönisheide liegen auf der Höhe, doch das Gelände fällt zu den Bachtälern hin teils steil ab. Viele Häuser, gerade aus der Zeit, als die Schloss- und Beschlagindustrie die Stadt wachsen ließ, sind in den Hang gebaut. Ihre Keller haben eine bergseitige Wand, gegen die nach Regen Sickerwasser drückt, und eine talseitige Wand, die oft ganz trocken bleibt. Pauschale Lösungen verschwenden hier Geld.",
          "Solche Keller sanieren wir deshalb gezielt. Die belastete Wand erhält eine Innenabdichtung mit Hohlkehle, Durchführungen und Arbeitsfugen werden gesondert abgedichtet, und Risse in Betonwänden verpressen wir mit PU-Harz. An den übrigen Wänden genügt häufig eine Horizontalsperre mit Sanierputz. Nach der kostenlosen Messung wissen Sie, welche Wand welche Maßnahme braucht, und erhalten dafür ein verbindliches Festpreisangebot. Außenanlagen, Treppen und Stützmauern am Hang bleiben unberührt.",
        ],
      },
    ],
    faqs: [
      {
        q: "Wie schnell sind Sie in Velbert vor Ort?",
        a: "Velbert-Mitte, Neviges und Langenberg erreichen wir in der Regel innerhalb von 24 bis 48 Stunden. Gern können Sie vorab Fotos des Schadens per WhatsApp schicken, dann bringen wir zum Termin schon die passende Messtechnik mit.",
      },
      {
        q: "Mein Haus in Langenberg liegt direkt am Bach. Ist eine Sanierung von innen trotzdem möglich?",
        a: "Ja, in vielen Fällen. Entscheidend ist, ob Bodenfeuchte oder zeitweise drückendes Wasser anliegt. Dafür gibt es mehrlagige Innenabdichtungen, die auch Druckwasser standhalten, kombiniert mit einer Horizontalsperre im Mauerwerk.",
      },
    ],
    nearby: ["wuppertal", "haan"],
  },

  // Haan
  {
    slug: "haan",
    name: "Haan",
    keyword: "Kellersanierung Haan",
    title: "Kellersanierung Haan | Keller trockenlegen, auch in Gruiten",
    metaDescription:
      "Kellersanierung Haan: Keller und Souterrainwohnungen in Haan und Gruiten trockenlegen. Ohne Aufgraben, kostenlose Messung, Festpreisangebot.",
    h1: "Kellersanierung Haan: Keller und Souterrain dauerhaft trockenlegen",
    lede:
      "Zwischen der Gartenstadt Haan und dem alten Dorf Gruiten im Düsseltal liegen nur wenige Kilometer, aber sehr unterschiedliche Böden. Wir kennen beide Seiten und sanieren feuchte Keller und Souterrainwohnungen von innen.",
    plz: ["42781"],
    districts: ["Haan-Mitte", "Unterhaan", "Oberhaan", "Gruiten", "Gruiten-Dorf"],
    geo: { lat: 51.193, lng: 7.013 },
    responseTime: "24 bis 48 Stunden",
    localFactors: [
      {
        name: "Kalkstein im Untergrund bei Gruiten",
        text: "Rund um Gruiten liegt verkarsteter Kalkstein, der früher in Steinbrüchen wie der heutigen Grube 7 abgebaut wurde. Wasser fließt in solchem Gestein über Spalten und kann an unerwarteten Stellen an Kellerwänden austreten.",
      },
      {
        name: "Das Düsseltal",
        text: "Gruiten-Dorf liegt direkt an der Düssel. In der Tallage sind die Böden feuchter, und nach Starkregen steigt der Wasserstand im Bach schnell an.",
      },
      {
        name: "Souterrainwohnungen",
        text: "In den Wohngebieten der Gartenstadt werden viele Untergeschosse als Wohnung oder Büro genutzt, deren Wände teilweise im Erdreich stecken.",
      },
    ],
    sections: [
      {
        heading: "Gruiten-Dorf und das Düsseltal",
        paragraphs: [
          "Gruiten-Dorf mit seinen Fachwerkhäusern und der Lage an der Düssel ist einer der malerischsten Orte im Kreis Mettmann. Die Häuser stehen auf Bruchsteinsockeln, die Keller sind klein, oft gewölbt und liegen im feuchten Talgrund. Aufsteigende Feuchte und Salzausblühungen gehören in diesen Kellern zum gewohnten Bild, und viele Eigentümer haben sich damit abgefunden. Das muss nicht sein, denn auch alte Bruchsteinkeller lassen sich dauerhaft trockenlegen.",
          "Weil die Häuser eng beieinanderstehen und die Fassaden erhalten bleiben sollen, ist eine Außenabdichtung kaum umsetzbar. Wir setzen eine Horizontalsperre im Injektionsverfahren, verfüllen vorher die Hohlräume im Bruchstein und bringen einen Sanierputz auf, der die Salze einlagert. Im Kalksteingebiet achten wir besonders auf Stellen, an denen Wasser punktuell aus Spalten an die Wand tritt, und dichten diese gezielt mit mineralischen Dichtungsschlämmen ab.",
        ],
      },
      {
        heading: "Souterrainwohnungen in der Gartenstadt",
        paragraphs: [
          "In Haan-Mitte, Unterhaan und Oberhaan gibt es viele Ein- und Mehrfamilienhäuser, deren Untergeschoss als Einliegerwohnung, Büro oder Gästezimmer genutzt wird. Tritt dort Feuchte auf, geht es nicht nur um einen feuchten Lagerraum, sondern um Wohnqualität und oft auch um ein Mietverhältnis. Typisch sind Schimmel hinter Möbeln an erdberührten Wänden, klamme Luft und Kondensat im Sommer, wenn warme Außenluft auf die kühlen Wände trifft.",
          "Hier ist die genaue Ursachenanalyse besonders wichtig. Kommt die Feuchte aus der Wand, helfen Horizontalsperre und Innenabdichtung. Handelt es sich um Kondensat, sind Calciumsilikatplatten an den kalten Flächen und ein angepasstes Lüftungskonzept die bessere Lösung. Häufig liegt eine Kombination vor. Nach der Messung erhalten Sie ein Konzept, das beides berücksichtigt, und einen Festpreis, mit dem Sie als Eigentümer oder Vermieter sicher planen können.",
        ],
      },
    ],
    faqs: [
      {
        q: "Kann eine feuchte Souterrainwohnung in Haan wieder vermietbar werden?",
        a: "In den meisten Fällen ja, wenn die Ursache sauber ermittelt und behoben wird. Je nach Befund kombinieren wir Horizontalsperre, Innenabdichtung und Calciumsilikatplatten gegen Kondensat. Die Messwerte dokumentieren wir auf Wunsch schriftlich.",
      },
      {
        q: "Macht der Kalkstein in Gruiten die Sanierung schwieriger?",
        a: "Er macht sie nicht schwieriger, aber anders. Im verkarsteten Kalk fließt Wasser über Spalten und tritt oft punktuell an der Kellerwand aus, statt die Wand gleichmäßig zu durchfeuchten. Diese Stellen finden wir bei der Messung und dichten sie gezielt ab.",
      },
    ],
    nearby: ["solingen", "wuppertal"],
  },


  // Wermelskirchen
  {
    slug: "wermelskirchen",
    name: "Wermelskirchen",
    keyword: "Kellersanierung Wermelskirchen",
    title: "Kellersanierung Wermelskirchen | Dabringhausen & Dhünn",
    metaDescription:
      "Kellersanierung Wermelskirchen: feuchte Keller in der Innenstadt, Dabringhausen und Dhünn von innen trockenlegen. Kostenlose Messung vor Ort.",
    h1: "Kellersanierung Wermelskirchen: trockene Keller auf der bergischen Hochfläche",
    lede:
      "Wermelskirchen liegt auf einer Hochfläche zwischen Wupper und Dhünn, umgeben von tief eingeschnittenen Bachtälern wie dem Eifgental. Wir sanieren feuchte Keller in der Innenstadt ebenso wie in Dabringhausen und Dhünn, von innen und ohne Aufgraben.",
    plz: ["42929"],
    districts: ["Wermelskirchen-Mitte", "Dabringhausen", "Dhünn", "Tente", "Hünger"],
    geo: { lat: 51.139, lng: 7.216 },
    responseTime: "24 bis 48 Stunden",
    localFactors: [
      {
        name: "Regenreiche Höhenlage",
        text: "Wie die Nachbarstädte Remscheid und Wuppertal bekommt Wermelskirchen viel Regen von den feuchten Westwinden ab. Die Böden bleiben dadurch oft über Wochen gesättigt.",
      },
      {
        name: "Bachtäler von Eifgenbach und Dhünn",
        text: "Rund um die Hochfläche haben sich Eifgenbach, Dhünn und ihre Zuflüsse tief eingeschnitten. Häuser an den Talhängen bekommen von der Bergseite Hang- und Sickerwasser ab.",
      },
      {
        name: "Schiefer und Fachwerk in den alten Ortskernen",
        text: "In den alten Kernen von Wermelskirchen und Dabringhausen stehen bergische Häuser mit Schieferbehang oder Fachwerk auf Bruchsteinsockeln, deren Keller keine Sperrschicht besitzen.",
      },
      {
        name: "Klüftiger Fels im Untergrund",
        text: "Unter oft dünnen Verwitterungsböden liegt das Gestein des Rheinischen Schiefergebirges. Sickerwasser folgt den Klüften und tritt häufig genau an der erdberührten Kellerwand aus.",
      },
    ],
    sections: [
      {
        heading: "Innenstadt und Dabringhausen: Schieferhäuser auf Bruchsteinsockeln",
        paragraphs: [
          "Wer durch die Wermelskirchener Innenstadt oder den alten Ortskern von Dabringhausen geht, sieht das typische Bild des Bergischen Landes: Häuser mit Schieferbehang, weißen Fensterrahmen und grünen Läden, dazwischen Fachwerk. Unter vielen dieser Häuser liegen Keller aus Bruchstein, verfugt mit Kalkmörtel und gebaut als kühle Vorratsräume. Eine Sperrschicht gegen aufsteigende Feuchte gab es damals nicht. Entsprechend häufig finden wir hier Salzränder, sandenden Putz und einen muffigen Geruch, der bis ins Treppenhaus zieht.",
          "Diese Keller sanieren wir vollständig von innen, damit Schieferfassade und Fachwerk unberührt bleiben. Die Horizontalsperre setzen wir im Injektionsverfahren von SchimmelPeter, mit Bohrlöchern im Abstand von bis zu 20 cm. Eine Vortrocknung ist in der Regel nicht notwendig, selbst wenn das alte Mauerwerk nach einem nassen Winter stark durchfeuchtet ist. Anschließend nimmt ein Sanierputz die über Generationen eingelagerten Salze auf. Weil das Mauerwerk diffusionsfähig bleibt, kann es in den folgenden Monaten in Ruhe austrocknen.",
        ],
      },
      {
        heading: "Dhünn und das Eifgental: Häuser am Talhang",
        paragraphs: [
          "Zu den Rändern hin fällt die Wermelskirchener Hochfläche in die Täler von Dhünn und Eifgenbach ab. Der Ortsteil Dhünn liegt nahe der Großen Dhünntalsperre, und in den Hofschaften entlang der Bachläufe stehen viele Häuser in Hanglage. Nach Regen sickert das Wasser im Hang abwärts, folgt den Klüften im Fels und trifft auf die bergseitige Kellerwand. Typisch ist dann ein Keller, dessen Hangseite nach jeder Regenperiode dunkle Feuchtefelder zeigt, während die Talseite weitgehend trocken bleibt.",
          "Für diese einseitige Belastung planen wir nicht pauschal, sondern Wand für Wand. Die bergseitige Wand erhält häufig eine Innenabdichtung mit Dichtschlämmen und einer sauber ausgebildeten Hohlkehle, weil hier Wasser seitlich eindringt. An den übrigen Wänden genügt oft eine Horizontalsperre mit Sanierputz. Welche Kombination sinnvoll ist, zeigt die Schadensanalyse mit Begehung außen und innen. Danach erhalten Sie ein verbindliches Angebot und einen Sanierungsplan, den wir gemeinsam mit Ihnen abstimmen.",
        ],
      },
      {
        heading: "Jüngere Wohngebiete: punktuelle Schäden statt nasser Wände",
        paragraphs: [
          "Neben den alten Ortskernen prägen Ein- und Zweifamilienhäuser aus der zweiten Hälfte des 20. Jahrhunderts viele Straßen in Wermelskirchen und den Ortsteilen. Ihre Keller sind meist aus Beton oder Kalksandstein gebaut und außen mit einem Bitumenanstrich abgedichtet, der nach Jahrzehnten spröde geworden ist. Feuchte dringt dann an Arbeitsfugen, Rohrdurchführungen oder Rissen ein, meist punktuell und vor allem nach längeren Regenperioden, wie sie auf der Hochfläche häufig vorkommen.",
          "Für diese Keller ist eine flächige Sanierung selten nötig. Häufig reicht es, wasserführende Risse mit PU-Harz zu verpressen und den Boden-Wand-Anschluss gezielt von innen abzudichten. Nicht jede nasse Stelle kommt allerdings aus dem Erdreich. Undichte Wasser- oder Abwasserleitungen, eine unzureichende Drainage oder Kondenswasser in schlecht belüfteten Räumen können ganz ähnlich aussehen. Die kostenlose Messung vor Ort klärt, welche Ursache vorliegt und ob ein punktueller Eingriff genügt.",
        ],
      },
    ],
    faqs: [
      {
        q: "Wie schnell sind Sie in Wermelskirchen vor Ort?",
        a: "Die Innenstadt, Dabringhausen und Dhünn erreichen wir in der Regel innerhalb von 24 bis 48 Stunden. Schicken Sie vorab gern Fotos per WhatsApp, dann kann Herr Mahmood den Schaden schon vor dem Termin grob einschätzen. Die Feuchtemessung vor Ort ist kostenlos.",
      },
      {
        q: "Lässt sich ein Schieferhaus in Wermelskirchen sanieren, ohne die Fassade anzufassen?",
        a: "Ja. Horizontalsperre, Innenabdichtung und Sanierputz werden ausschließlich im Keller eingebaut. Schieferbehang und Fachwerk bleiben vollständig erhalten, und außen sind keine aufwendigen Erdarbeiten nötig.",
      },
      {
        q: "Welche Garantie erhalte ich auf die Kellersanierung?",
        a: "Auf die Wirksamkeit des Injektionsmittels gibt es 25 Jahre Produktgarantie des Herstellers SchimmelPeter GmbH. Unabhängig davon gibt sos-abdichtung 10 Jahre Garantie auf die ausgeführten Arbeiten.",
      },
    ],
    nearby: ["remscheid", "solingen", "wuppertal"],
  },

  // Essen
  {
    slug: "essen",
    name: "Essen",
    keyword: "Kellersanierung Essen",
    title: "Kellersanierung Essen | Abdichtung & Rissverpressung",
    metaDescription:
      "Kellersanierung Essen vom Betrieb vor Ort, Niebuhrstraße 46: Keller abdichten, Rissverpressung, Horizontalsperre. Kostenlose Feuchtemessung, Festpreis.",
    h1: "Kellersanierung Essen: Keller abdichten vom Fachbetrieb vor Ort",
    lede:
      "Unser Sitz ist in Essen, in der Niebuhrstraße 46. Von Karnap bis Kettwig sind wir in der Regel innerhalb von 24 Stunden bei Ihnen, messen kostenlos, woher die Feuchte kommt, und dichten Ihren Keller dann von innen ab, ohne Aufgraben und zum Festpreis.",
    plz: [
      "45127", "45128", "45130", "45131", "45133", "45134", "45136", "45138", "45139", "45141", "45143",
      "45144", "45145", "45147", "45149", "45219", "45239", "45257", "45259", "45276", "45277", "45279",
      "45289", "45307", "45309", "45326", "45327", "45329", "45355", "45356", "45357", "45359",
    ],
    districts: ["Rüttenscheid", "Frohnhausen", "Holsterhausen", "Altenessen", "Borbeck", "Steele", "Kray", "Werden", "Kettwig", "Bredeney"],
    geo: { lat: 51.4556, lng: 7.0116 },
    responseTime: "24 Stunden",
    wiki: "https://de.wikipedia.org/wiki/Essen",
    localFactors: [
      {
        name: "Bergsenkungen und Setzungsrisse",
        text: "Unter weiten Teilen der Stadt wurde über Jahrhunderte Steinkohle abgebaut. Der Boden hat sich dabei ungleichmäßig gesenkt, Kellerwände und Bodenplatten haben Risse bekommen, durch die heute Wasser eindringt.",
      },
      {
        name: "Grundwasser im Emscherbruch",
        text: "Im Essener Norden liegt das Gelände durch die Senkungen so tief, dass das Grundwasser dauerhaft abgepumpt wird. Kellersohlen stehen hier dicht über dem Wasserspiegel, nach langem Regen drückt es von unten.",
      },
      {
        name: "Ruhr, Baldeneysee und Hanglagen im Süden",
        text: "In Werden, Kettwig, Heisingen und Kupferdreh bestimmen die Ruhr und die Hänge, wie nass ein Keller wird: Sickerwasser am Hang, steigendes Grundwasser im Tal.",
      },
      {
        name: "Altbauten ohne Horizontalsperre",
        text: "Gründerzeithäuser in Rüttenscheid und Holsterhausen und die Zechenhäuser im Norden haben Keller aus Ziegel oder Mischmauerwerk, deren Sperrschicht längst versagt hat. Die Feuchte steigt kapillar auf.",
      },
    ],
    localServices: [
      {
        slug: "kellersanierung",
        heading: "Kellersanierung in Essen",
        text: "Wir messen zuerst, woher die Nässe kommt, und kombinieren dann nur die Verfahren, die Ihr Keller braucht: Horizontalsperre, Innenabdichtung, Rissverpressung und Sanierputz. Alles von innen, ohne den Vorgarten aufzugraben, mit Festpreis und 10 Jahren Garantie auf die Arbeit.",
      },
      {
        slug: "kellerinnenabdichtung",
        heading: "Keller abdichten in Essen",
        text: "Gegen Wasser, das seitlich durch die Wand oder am Boden-Wand-Anschluss eindringt, dichten wir die erdberührten Wände von innen ab: mineralische Dichtungsschlämme, Hohlkehle und Sanierputz nach WTA. Das hält auch zeitweise drückendem Wasser stand, wie es im Ruhrtal und im Emscherbruch vorkommt.",
      },
      {
        slug: "rissverpressung",
        heading: "Rissverpressung in Essen",
        text: "Setzungsrisse aus dem Bergbau sind in Essen der häufigste Weg, auf dem Wasser in Betonkeller kommt. Wir verpressen wasserführende Risse unter Druck mit PU-Harz, das sich im Riss ausdehnt und elastisch bleibt, wenn sich das Haus weiter bewegt. Tragende Risse schließen wir kraftschlüssig mit Epoxid.",
      },
      {
        slug: "horizontalsperre",
        heading: "Horizontalsperre in Essen",
        text: "Steigt die Feuchte im Mauerwerk eines Altbaus von unten auf, setzen wir knapp über dem Kellerboden eine neue Sperrschicht per Injektion. Der Kunststoff in Paraffin braucht keine Vortrocknung, die Wand bleibt diffusionsoffen. Der Hersteller SchimmelPeter garantiert die Wirksamkeit 25 Jahre.",
      },
      {
        slug: "schimmelbeseitigung",
        heading: "Schimmel im Keller in Essen",
        text: "Schimmel im Keller ist fast immer ein Feuchteproblem. Wir klären per Messung, ob die Nässe aus der Wand kommt oder als Kondensat aus der Luft, entfernen den Befall sporensicher und beseitigen die Ursache, damit er nicht wiederkommt.",
      },
      {
        slug: "feuchtemessung",
        heading: "Feuchtemessung in Essen",
        text: "Die Messung ist kostenlos: Inhaber Shahzad Mahmood misst die Feuchte in mehreren Wandhöhen, prüft Salze, Oberflächentemperatur und Raumklima und erklärt Ihnen vor Ort, was die Werte bedeuten. Sie bekommen das Protokoll und ein verbindliches Festpreisangebot.",
      },
    ],
    districtGroups: [
      {
        name: "Essener Norden",
        districts: ["Altenessen", "Karnap", "Vogelheim", "Katernberg", "Stoppenberg", "Schonnebeck"],
        text: "Zechenhäuser und Siedlungen aus der Bergbauzeit, Gelände mit Bergsenkungen und hohem Grundwasser. Typisch sind Risse in Wand und Bodenplatte und Wasser, das nach langem Regen von unten kommt.",
      },
      {
        name: "Mitte, Süd- und Westviertel",
        districts: ["Rüttenscheid", "Südviertel", "Holsterhausen", "Frohnhausen", "Huttrop", "Altendorf"],
        text: "Dicht bebaute Gründerzeit- und Nachkriegsstraßen, Häuser direkt am Gehweg. Die alte Sperrschicht hat versagt, die Feuchte steigt auf, Salze sprengen den Putz. Von außen ist hier meist kein Platz zum Aufgraben.",
      },
      {
        name: "Essener Westen",
        districts: ["Borbeck", "Bedingrade", "Schönebeck", "Frintrop", "Dellwig", "Gerschede"],
        text: "Gemischter Bestand aus Altbauten, Siedlungshäusern und Einfamilienhäusern der 1950er bis 1970er Jahre. Häufig eine Mischung aus aufsteigender Feuchte im Mauerwerk und undichten Anschlüssen an der Bodenplatte.",
      },
      {
        name: "Essener Osten",
        districts: ["Steele", "Kray", "Horst", "Freisenbruch", "Überruhr", "Leithe"],
        text: "Zwischen Ruhr und ehemaligen Zechen: Hanglagen über dem Fluss, Bergsenkungen in Kray und Leithe. Feuchte kommt hier je nach Lage seitlich vom Hang oder durch Risse.",
      },
      {
        name: "Essener Süden und das Ruhrtal",
        districts: ["Bredeney", "Werden", "Kettwig", "Heisingen", "Kupferdreh", "Rellinghausen"],
        text: "Villen und Einfamilienhäuser am Hang und am Baldeneysee. Die bergseitige Kellerwand ist oft nass, im Tal steigt das Grundwasser mit der Ruhr. Hier ist eine Innenabdichtung gegen drückendes Wasser der häufigste Weg.",
      },
    ],
    sections: [
      {
        heading: "Bergsenkungen: warum so viele Essener Keller Risse haben",
        paragraphs: [
          "Essen ist mit dem Bergbau gewachsen, von den Stollen im Ruhrtal bis zu den großen Schachtanlagen im Norden. Wo unter Tage Kohle abgebaut wurde, hat sich das Gelände darüber gesenkt, nicht überall gleich, sondern in Mulden und Stufen. Ein Haus, das auf einer solchen Stufe steht, wird ungleichmäßig belastet: Die Bodenplatte reißt, an den Wandecken öffnen sich Fugen, im Beton entstehen Risse, die bis durch die Wand gehen.",
          "Solange diese Risse trocken bleiben, sind sie meist harmlos. Steigt aber das Grundwasser, oder staut sich Regenwasser vor der Wand, werden sie zum Weg ins Haus. Wir prüfen deshalb zuerst, ob ein Riss Wasser führt und ob er sich noch bewegt. Wasserführende Risse verpressen wir mit PU-Harz, das elastisch bleibt; erst danach wird die Fläche abgedichtet. Wenn Sie einen Bergschaden vermuten, dokumentieren wir Verlauf, Breite und Feuchte der Risse so, dass Sie die Unterlagen für Ihre Ansprüche verwenden können.",
        ],
      },
      {
        heading: "Gründerzeit und Nachkriegsbau: aufsteigende Feuchte in Rüttenscheid und Holsterhausen",
        paragraphs: [
          "In Rüttenscheid, Holsterhausen, Frohnhausen und im Südviertel stehen Straßenzüge, deren Keller als einfache Lagerräume aus Ziegel oder Mischmauerwerk gebaut wurden. Nach Jahrzehnten ist die ursprüngliche Sperrschicht versprödet oder fehlt ganz. Die Feuchte steigt aus dem Fundament in die Wand, und mit ihr die Salze, die den Putz absprengen und die weißen Ränder hinterlassen.",
          "Weil diese Häuser direkt am Gehweg oder Wand an Wand mit dem Nachbarn stehen, ist eine Aufgrabung von außen kaum möglich. Wir setzen deshalb von innen eine Horizontalsperre im Injektionsverfahren und bringen danach einen Sanierputz auf, der die Restfeuchte verdunsten lässt und die Salze aufnimmt, ohne dass sie an der Oberfläche wieder ausblühen.",
        ],
      },
      {
        heading: "Ruhrtal und Baldeneysee: drückendes Wasser in Werden und Kettwig",
        paragraphs: [
          "Im Süden der Stadt stehen viele Häuser am Hang über der Ruhr oder unten im Tal. Am Hang sickert Regenwasser im Boden abwärts und staut sich an der bergseitigen Kellerwand, die dann deutlich nasser ist als die anderen. Im Tal steigt das Grundwasser nach langem Regen mit dem Fluss. Das Hochwasser im Juli 2021 hat gezeigt, wie schnell das gehen kann.",
          "Gegen zeitweise drückendes Wasser reicht eine Sperrschicht allein nicht. Wir dichten die betroffenen Wände von innen mit mehrlagiger mineralischer Dichtungsschlämme ab, mit einer Hohlkehle am Übergang zum Boden, und verpressen vorher die Risse. So bezahlen Sie nur an den Wänden für eine Abdichtung, an denen das Wasser tatsächlich drückt.",
        ],
      },
      {
        heading: "Was eine Kellersanierung in Essen kostet",
        paragraphs: [
          "Den Preis bestimmen vier Dinge: die Ursache der Feuchte, die Länge und Höhe der betroffenen Wände, das Mauerwerk (Ziegel, Bruchstein oder Beton) und wie viel Salz darin steckt. Eine Horizontalsperre an einer Wand kostet deshalb einen Bruchteil einer kompletten Innenabdichtung aller Kellerwände. Seriös beziffern lässt sich das erst nach der Messung.",
          "Darum messen wir zuerst, kostenlos und unverbindlich, und geben Ihnen danach einen Festpreis, der sich nicht mehr ändert. Gegenüber einer Außenabdichtung mit Bagger, Drainage und neuem Pflaster ist die Sanierung von innen fast immer deutlich günstiger. Eine erste Einordnung gibt Ihnen unser Kostenrechner.",
        ],
        bullets: [
          "Kostenlose Feuchtemessung mit Protokoll, auch für Kontrollmessungen nach der Sanierung",
          "Verbindlicher Festpreis nach der Messung, ohne Nachträge",
          "10 Jahre Garantie auf die Arbeit, 25 Jahre Herstellergarantie auf die Wirksamkeit",
          "Kurze Wege: Unser Sitz ist in Essen, Niebuhrstraße 46",
        ],
      },
    ],
    faqs: [
      {
        q: "Wie schnell sind Sie in Essen vor Ort?",
        a: "Unser Sitz ist in Essen, in der Niebuhrstraße 46. Deshalb sind wir in jedem Essener Stadtteil, von Karnap bis Kettwig, in der Regel innerhalb von 24 Stunden bei Ihnen. Schicken Sie vorab gern Fotos per WhatsApp an 0172 2064177. Die Feuchtemessung vor Ort ist kostenlos und unverbindlich.",
      },
      {
        q: "Was kostet eine Kellersanierung in Essen?",
        a: "Das hängt von der Ursache, der Wandfläche, dem Mauerwerk und dem Salzgehalt ab, deshalb nennen wir keinen Pauschalpreis aus der Ferne. Nach der kostenlosen Messung bekommen Sie einen verbindlichen Festpreis. Eine Sanierung von innen ist fast immer deutlich günstiger als eine Außenabdichtung mit Aufgraben.",
      },
      {
        q: "Muss für eine Kellersanierung in Essen der Vorgarten aufgegraben werden?",
        a: "Nein. Horizontalsperre, Rissverpressung und Innenabdichtung werden von innen ausgeführt. Vorgarten, Terrasse, Einfahrt und Pflaster bleiben unberührt, und der Keller ist während der Arbeiten meist weiter begehbar.",
      },
      {
        q: "Mein Keller hat Risse. Kann das ein Bergschaden sein?",
        a: "In Essen ist das gut möglich, denn große Teile der Stadt liegen über ehemaligem Bergbau. Wir dokumentieren Verlauf, Breite und Feuchte der Risse und verpressen wasserführende Risse dauerhaft. Ob ein Bergschaden vorliegt und Ansprüche bestehen, klärt ein Sachverständiger oder die Schlichtungsstelle Bergschaden NRW; unsere Dokumentation können Sie dafür verwenden.",
      },
      {
        q: "Welche Garantie bekomme ich?",
        a: "sos-abdichtung gibt 10 Jahre Garantie auf die ausgeführte Arbeit. Zusätzlich garantiert der Hersteller SchimmelPeter GmbH 25 Jahre lang die Wirksamkeit des Injektionsmittels.",
      },
      {
        q: "Was hilft gegen Schimmel im Keller in einem Essener Altbau?",
        a: "Zuerst die Ursache: Wir messen, ob die Feuchte aus dem Mauerwerk aufsteigt, seitlich eindringt oder als Kondensat an kalten Wänden entsteht. Danach wird der Befall sporensicher entfernt und die Ursache beseitigt, etwa mit einer Horizontalsperre, einer Innenabdichtung oder Klimaplatten.",
      },
      {
        q: "Arbeiten Sie auch in den Nachbarstädten von Essen?",
        a: "Ja. Von unserem Sitz in Essen fahren wir regelmäßig nach Mülheim an der Ruhr, Gelsenkirchen, Bottrop, Oberhausen, Bochum und Velbert, in der Regel innerhalb von 24 bis 48 Stunden.",
      },
    ],
    nearby: ["muelheim-an-der-ruhr", "gelsenkirchen", "bottrop", "oberhausen", "bochum", "velbert"],
  },

  // Düsseldorf
  {
    slug: "duesseldorf",
    name: "Düsseldorf",
    keyword: "Kellersanierung Düsseldorf",
    title: "Kellersanierung Düsseldorf | Keller abdichten vom Profi",
    metaDescription:
      "Kellersanierung Düsseldorf: Nasse Keller & drückendes Wasser von innen abdichten. Kostenlose Feuchtemessung, Festpreis und 10 Jahre Garantie.",
    h1: "Kellersanierung Düsseldorf: Keller trockenlegen ohne Aufgraben",
    lede:
      "Hoher Rhein-Grundwasserspiegel, wertvolle Wohn- und Nutzflächen im Souterrain: In Düsseldorf erfordert feuchtes Mauerwerk professionelle Abdichtungssysteme mit garantierter Dichtigkeit.",
    plz: ["40210", "40213", "40477", "40545", "40547", "40597", "40625"],
    districts: ["Düsseldorf-Mitte", "Oberkassel", "Pempelfort", "Unterbilk", "Gerresheim", "Benrath", "Grafenberg"],
    geo: { lat: 51.2277, lng: 6.7735 },
    responseTime: "24 bis 48 Stunden",
    localFactors: [
      {
        name: "Rhein-Hochwasser & Grundwasserdruck",
        text: "In rheinnahen Stadtteilen wie Oberkassel, Bilk und Pempelfort drückt das Rhein-Grundwasser bei Pegelanstieg mit starkem hydrostatischem Druck gegen Bodenplatte und Kellerwände.",
      },
      {
        name: "Hochwertig genutzte Souterrain-Räume",
        text: "In Düsseldorf werden Untergeschosse häufig als Büros, Einliegerwohnungen oder Praxisräume genutzt. Nässe und Schimmel gefährden hier direkt teure Bausubstanz und Mieteinnahmen.",
      },
      {
        name: "Kies- und Sandböden der Rheinterrasse",
        text: "Die durchlässigen Böden leiten Regenwasser extrem schnell in tiefere Schichten ab, was zu plötzlichen Wasseranstiegen am Kellerfundament führt.",
      },
    ],
    sections: [
      {
        heading: "Oberkassel, Pempelfort und Bilk: Druckwasserdichte Innenabdichtung",
        paragraphs: [
          "Die historischen Stadthäuser in Düsseldorf-Oberkassel und Pempelfort besitzen repräsentative Altbaukeller. Wenn der Rhein Hochwasser führt, steigt das Grundwasser in den Kies- und Sandböden rasant an. Feuchtigkeit drückt durch poröse Fugen im Mauerwerk und führt zu Schimmelbildung hinter Sockelleisten und Verkleidungen.",
          "Unsere druckwasserdichte Innenabdichtung nach WTA-Merkblatt dichtet das Mauerwerk dauerhaft gegen drückendes Wasser ab. In Kombination mit einer tiefenwirksamen Horizontalsperre gegen kapillar aufsteigende Feuchte schaffen wir ein trockenes, gesundes Raumklima – ohne teure Erdarbeiten vor dem Haus.",
        ],
      },
      {
        heading: "Gerresheim und Benrath: Hangwasser und Sanierung von Souterrainwohnungen",
        paragraphs: [
          "In den Randlagen von Düsseldorf, wie am Gerresheimer Hang oder in Benrath, treffen Schichtenwasser und Altbausubstanz aufeinander. Nasse Wände im bewohnten Souterrain mindern den Wert der Immobilie erheblich.",
          "Wir analysieren bei der kostenlosen Feuchtemessung vor Ort exakt die Ursache (Kondensfeuchte, kapillarer Aufstieg oder drückendes Sickerwasser) und erstellen Ihnen ein transparentes Festpreisangebot. Bei vermieteten Wohnungen stellen wir auf Wunsch alle nötigen Messprotokolle für Mieter und Hausverwaltungen aus.",
        ],
      },
      {
        "heading": "Schimmel im Keller und in Souterrainwohnungen in Düsseldorf",
        "paragraphs": [
          "In Düsseldorf werden Keller und Souterrains oft als Wohnraum, Büro oder Hobbyraum genutzt. Dort reicht ein feuchter Fleck nicht als Schönheitsfehler: Er ist häufig der Anfang von Schimmel. Typisch sind Kondensat an kalten Außenwänden, seitlich eindringende Feuchte und in Rheinnähe drückendes Grundwasser bei hohen Pegelständen.",
          "Mit einer Feuchtigkeitsmessung unterscheiden wir diese Ursachen, bevor saniert wird. Die Messwerte bekommen Sie schriftlich, auch als Grundlage für Gespräche mit Vermietern, Mietern oder einer Hausverwaltung."
        ],
        "bullets": [
          "Messung von Wandfeuchte, Oberflächentemperatur und Luftfeuchte",
          "Schimmelsanierung mit sporensicherer Entfernung ohne Chlor",
          "Innenabdichtung gegen drückendes Wasser, ohne Aufgraben"
        ]
      }
    ],
    faqs: [
      {
        q: "Hält die Innenabdichtung auch bei Rhein-Hochwasser dicht?",
        a: "Ja. Unser mehrlagiges mineralisches Dichtungssystem hält hydrostatischem Druckwasser stand und wird speziell an den hochwassergefährdeten Wand-Boden-Anschlüssen mit druckfesten Hohlkehlen verstärkt.",
      },
      {
        q: "Können wir den Keller während der Sanierung weiter betreten?",
        a: "Ja, der Arbeitsbereich wird staubdicht abgeschottet. Es gibt keine großflächigen Baustellen im Außenbereich, und Ihr Garten sowie Gehwege bleiben komplett unberührt.",
      },
      {
        q: "Wie läuft der erste Vor-Ort-Termin in Düsseldorf ab?",
        a: "Bautenschutz-Experte Shahzad Mahmood prüft mit digitaler HF-Messtechnik die Feuchtigkeitsverteilung im Mauerwerk. Sie erhalten sofort eine klare Diagnose und ein verbindliches Festpreisangebot.",
      },
      {
        "q": "Kann ein Souterrain in Düsseldorf von innen abgedichtet werden?",
        "a": "Ja. Erdberührte Wände lassen sich von innen mit mineralischen Dichtungsschlämmen, einer Hohlkehle und Sanierputz abdichten, auch gegen drückendes Wasser. Ob das reicht oder zusätzlich eine Horizontalsperre nötig ist, zeigt die Messung."
      },
      {
        "q": "Wer zahlt die Feuchtigkeitsmessung in Düsseldorf?",
        "a": "Die erste Feuchtigkeitsmessung vor Ort ist bei uns kostenlos und unverbindlich, für Eigentümer, Mieter und Hausverwaltungen gleichermaßen."
      }
    ],
    nearby: ["wuppertal", "essen", "solingen"],
  },

  // Bochum
  {
    slug: "bochum",
    name: "Bochum",
    keyword: "Kellersanierung Bochum",
    title: "Kellersanierung Bochum | Feuchte Keller sanieren & sperren",
    metaDescription:
      "Kellersanierung Bochum: Nasse Kellerwände & Setzungsrisse von innen sanieren. Kostenlose Feuchtemessung vor Ort, Festpreis & 10 Jahre Garantie.",
    h1: "Kellersanierung Bochum: Nasse Keller dauerhaft trockenlegen",
    lede:
      "Von Ehrenfeld und Stiepel bis Langendreer und Wattenscheid: Ehemalige Bergbaugebiete, Lehmböden und feuchtes Mauerwerk verlangen maßgeschneiderte Lösungen ohne Erdarbeiten.",
    plz: ["44787", "44789", "44791", "44799", "44801", "44803", "44866"],
    districts: ["Bochum-Mitte", "Ehrenfeld", "Wattenscheid", "Stiepel", "Weitmar", "Langendreer", "Wiemelhausen"],
    geo: { lat: 51.4818, lng: 7.2162 },
    responseTime: "24 bis 48 Stunden",
    localFactors: [
      {
        name: "Löss- und Lehmböden im mittleren Ruhrgebiet",
        text: "Schwere Böden stauen Niederschlagswasser lange an der Außenwand. Ohne intakte Vertikal- oder Innenabdichtung dringt Wasser seitlich ins Kellergefüge.",
      },
      {
        name: "Bergschäden & Risse im Fundament",
        text: "Tiefenbohrungen und Setzungen aus der Bergbauhistorie hinterlassen feine Bewegungsrisse in Betonböden und Kellerwänden.",
      },
      {
        name: "Altbauten der Zechenära",
        text: "Viele Bergarbeitersiedlungen und Mehrfamilienhäuser in Wattenscheid und Ehrenfeld besitzen Ziegelmauerwerk ohne jede vertikale Sperrbahn.",
      },
    ],
    sections: [
      {
        heading: "Bochum-Ehrenfeld und Mitte: Ziegelkeller ohne Aufgraben sanieren",
        paragraphs: [
          "In den dicht bebauten Straßen von Bochum-Ehrenfeld, Weitmar und Mitte reihen sich Mehrfamilienhäuser aneinander. Wenn hier der Keller feucht wird, zieht der Modergeruch schnell bis ins Erdgeschoss. Feuchte Wände zersetzen den Mörtel und lassen Salze auskristallisieren.",
          "Mit unserem Injektionsverfahren bringen wir eine Paraffin-Harz-Horizontalsperre ein, die ohne statische Schwächung das kapillare Aufsteigen von Wasser stoppt. Durch die Sanierung von innen entfallen Straßenabsperrungen, Grabarbeiten und Vorgartenschäden komplett.",
        ],
      },
      {
        heading: "Stiepel und Ruhrtal: Hanglagen und drückendes Schichtenwasser",
        paragraphs: [
          "Im grünen Süden Bochums, rund um Stiepel und die Ruhrhänge, sind viele Häuser in steile Hanglagen gebaut. Hier sammelt sich Hangwasser oberhalb des Gebäudes und drückt gegen die erdberührte Rückwand.",
          "Wir schützen diese Wände mit mehrschichtigen flexiblen Dichtungsschlämmen und dichten wasserführende Risse im Mauerwerk per Hochdruckverpressung ab. Das schützt die Bausubstanz nachhaltig und sichert den Immobilienwert.",
        ],
      },
      {
        "heading": "Feuchte Kellerwände sanieren in Bochum: Zechenhäuser und Nachkriegsbauten",
        "paragraphs": [
          "Viele Bochumer Häuser stammen aus der Zechenzeit oder aus dem Wiederaufbau nach dem Krieg. Ihre Keller haben oft keine oder keine intakte Horizontalsperre mehr, und Bergsenkungen können Risse verursachen, durch die Wasser eindringt. Beides zeigt sich als feuchte Kellerwand, Salzränder oder Schimmel im Keller.",
          "Wir messen, welche Ursache vorliegt, und kombinieren die passenden Verfahren: eine Horizontalsperre im Injektionsverfahren gegen aufsteigende Feuchte, eine Rissverpressung für wasserführende Risse und eine Innenabdichtung für erdberührte Wände."
        ],
        "bullets": [
          "Kostenlose Feuchtigkeitsmessung und Schadensanalyse in Bochum",
          "Rissverpressung im Mauerwerk und Beton mit PU-Harz oder Epoxid",
          "Mauerwerkstrockenlegung ohne Aufgraben, mit 10 Jahren Garantie auf die Arbeit"
        ]
      }
    ],
    faqs: [
      {
        q: "Können Risse im Kellerboden in Bochum abgedichtet werden?",
        a: "Ja, mit unserem elastischen Polyurethanharz-Injektionsverfahren verpressen wir Setzungs- und Arbeitsrisse dauerhaft wasserdicht, selbst bei anstehendem Druckwasser.",
      },
      {
        q: "Ist die Vor-Ort-Besichtigung in Bochum kostenlos?",
        a: "Ja, wir führen bei Ihnen in Bochum eine kostenfreie Feuchtigkeitsmessung mit digitaler Messtechnik durch und erstellen Ihnen einen garantierten Festpreis.",
      },
      {
        "q": "Woran erkenne ich in Bochum, ob ein Riss im Keller durch Bergsenkung entstanden ist?",
        "a": "Setzungs- und Bergsenkungsrisse verlaufen oft schräg oder treppenförmig durch das Mauerwerk und können sich über Jahre verändern. Ob ein Riss wasserführend ist und verpresst werden muss, zeigt die Besichtigung mit Feuchtigkeitsmessung."
      },
      {
        "q": "Was kostet es, feuchte Kellerwände in Bochum sanieren zu lassen?",
        "a": "Das hängt von Ursache, Wandlänge und Wanddicke ab. Nach der kostenlosen Messung erhalten Sie ein verbindliches Festpreisangebot ohne Nachforderungen."
      }
    ],
    nearby: ["essen", "dortmund", "wuppertal"],
  },

  // Dortmund
  {
    slug: "dortmund",
    name: "Dortmund",
    keyword: "Kellersanierung Dortmund",
    title: "Kellersanierung Dortmund | Keller trockenlegen & dichten",
    metaDescription:
      "Kellersanierung Dortmund: Feuchte Keller & aufsteigende Feuchte von innen sanieren. Kostenlose Feuchtemessung vor Ort, Festpreis & Garantie.",
    h1: "Kellersanierung Dortmund: Keller sanieren ohne Aufgraben",
    lede:
      "Vom Kreuzviertel und Hörde am Phoenix-See bis nach Brackel und Mengede: Trockene Keller schützen die Bausubstanz und sichern den Wert Ihrer Immobilie in Dortmund.",
    plz: ["44135", "44137", "44139", "44225", "44263", "44309", "44359"],
    districts: ["Dortmund-Innenstadt", "Kreuzviertel", "Hörde", "Hombruch", "Aplerbeck", "Brackel", "Mengede"],
    geo: { lat: 51.5136, lng: 7.4653 },
    responseTime: "24 bis 48 Stunden",
    localFactors: [
      {
        name: "Grundwasseranstieg nach Zechenstilllegungen",
        text: "Durch das regulierte Abpumpen und den Grubenwasseranstieg im östlichen Ruhrgebiet steigen die Pegel in tieferen Erdschichten seit Jahren wieder an.",
      },
      {
        name: "Gründerzeitviertel im Kreuzviertel und Kaiserviertel",
        text: "Dicht bebaute Blockrandstrukturen mit historischen Vollziegelkellern, die bei aufsteigender Feuchte rasch Salzausblühungen bilden.",
      },
      {
        name: "Urbane Sanierungsanforderungen am Phoenix-See",
        text: "Moderne Souterrains und modernisierte Bestandsgebäude verlangen hochwertige Nutzbarkeit ohne Feuchtegeruch und Schimmelsporen.",
      },
    ],
    sections: [
      {
        heading: "Dortmunder Kreuzviertel: Sanierung von Altbaukellern von innen",
        paragraphs: [
          "Das Dortmunder Kreuzviertel und das Kaiserviertel zählen zu den gefragtesten Wohngegenden im Ruhrgebiet. Viele Häuser stammen aus der Jahrhundertwende. Feuchte Kellermauern und schimmelnde Abstellräume sind hier ein bekanntes Problem, das oft durch aufsteigende Nässe im Fundamentbereich verursacht wird.",
          "Weil Vorgärten oder Zufahrten nicht existieren, ist eine Innenabdichtung der einzig denkbare Sanierungsweg. Wir bohren in geringen Abständen Injektionskanäle und sättigen das Mauerwerk mit unserem paraffingelösten Dichtstoff. Die Wand bleibt atmungsaktiv, trocknet nach oben hin ab und ist dauerhaft vor neuem Wasser geschützt.",
        ],
      },
      {
        heading: "Hörde, Hombruch und Aplerbeck: Schutz vor drückendem Sickerwasser",
        paragraphs: [
          "In Stadtteilen wie Hörde oder Aplerbeck sorgt starker Regen regelmäßig für Staunässe in bindigen Lehmböden. Das Wasser dringt durch unzureichend abgedichtete Wand-Boden-Fugen in den Keller ein.",
          "Unsere mineralischen Dichtungsschlämmen bilden in Verbindung mit einer Hohlkehlenausbildung eine unüberwindbare Barriere. Ihr Keller wird wieder als sauberer Lagerraum oder Hobbyraum nutzbar – mit 10 Jahren Handwerksgarantie.",
        ],
      },
      {
        "heading": "Schimmel im Keller und nasse Wände in Dortmund",
        "paragraphs": [
          "In Dortmund treffen Gründerzeitviertel, Nachkriegsbauten und Siedlungen der Zechenzeit aufeinander. Wo der Bergbau endete, ist das Grundwasser vielerorts wieder gestiegen. Keller, die jahrzehntelang trocken waren, können dadurch feucht werden: mit dunklen Rändern an den Wänden, muffigem Geruch und Schimmel im Keller.",
          "Wir prüfen mit einer Feuchtigkeitsmessung, ob das Wasser von unten aufsteigt, seitlich drückt oder als Kondensat entsteht, und sanieren den Keller dann gezielt von innen."
        ],
        "bullets": [
          "Horizontalsperre im Injektionsverfahren für ältere Mauerwerkskeller",
          "Kellerinnenabdichtung nach WTA-Standard gegen drückendes Sickerwasser",
          "Schimmelbeseitigung und Klimaplatten gegen Kondensat"
        ]
      }
    ],
    faqs: [
      {
        q: "Wie lange dauert eine Kellersanierung in Dortmund?",
        a: "Je nach Kellergröße dauert die Ausführung meist nur 2 bis 4 Werktage. Der Keller bleibt währenddessen begehbar, und es entstehen keine Behinderungen vor dem Haus.",
      },
      {
        q: "Gibt es Fördermöglichkeiten für die Kellersanierung in NRW?",
        a: "Ja, für handwerkliche Sanierungsmaßnahmen an selbstgenutzten Immobilien können Eigentümer 20 % der Arbeitskosten (Handwerkerleistung gem. § 35a EStG) direkt steuerlich geltend machen. Wir weisen den Lohnanteil auf der Rechnung separat GoBD-konform aus.",
      },
      {
        "q": "Warum wird mein Keller in Dortmund erst jetzt feucht?",
        "a": "Häufig ändern sich die Verhältnisse im Boden, etwa durch steigendes Grundwasser nach dem Ende des Bergbaus, oder eine alte Abdichtung hat ihr Lebensende erreicht. Die Feuchtigkeitsmessung zeigt, welche Ursache bei Ihnen vorliegt."
      },
      {
        "q": "Muss für die Kellersanierung in Dortmund aufgegraben werden?",
        "a": "In den meisten Fällen nicht. Horizontalsperre, Innenabdichtung und Rissverpressung werden von innen ausgeführt, Garten und Einfahrt bleiben unberührt."
      }
    ],
    nearby: ["bochum", "essen", "wuppertal"],
  },
  // Köln
  {
    slug: "koeln",
    name: "Köln",
    keyword: "Kellersanierung Köln",
    title: "Kellersanierung Köln | Feuchte Keller trockenlegen",
    metaDescription: "Kellersanierung Köln ohne Aufgraben: feuchte Kellerwände von innen sanieren, Schutz bei Rhein-Hochwasser. Kostenlose Feuchtigkeitsmessung, Festpreis.",
    "h1": "Kellersanierung Köln: feuchte Keller dauerhaft trockenlegen",
    lede: "Ob Gründerzeitbau in Ehrenfeld und Nippes oder Einfamilienhaus in Rodenkirchen: In Köln entscheiden der Rhein, der Grundwasserstand und das Alter des Mauerwerks, warum ein Keller nass wird. Wir messen die Ursache und sanieren von innen.",
    plz: [
      "50667",
      "50672",
      "50674",
      "50676",
      "50733",
      "50735",
      "50823",
      "50825",
      "50931",
      "50933",
      "50937",
      "50968",
      "50996",
      "51063",
      "51065",
      "51105",
      "51143"
    ],
    districts: [
      "Innenstadt",
      "Ehrenfeld",
      "Nippes",
      "Lindenthal",
      "Sülz",
      "Rodenkirchen",
      "Mülheim",
      "Kalk",
      "Porz"
    ],
    geo: {
      lat: 50.9375,
      lng: 6.9603
    },
    responseTime: "24 bis 48 Stunden",
    localFactors: [
      {
        name: "Rhein-Hochwasser und Grundwasser",
        text: "Steigt der Rhein, steigt mit Verzögerung auch das Grundwasser in den ufernahen Vierteln. Keller in Rodenkirchen, Porz oder der Altstadt bekommen dann Druck von außen und von unten."
      },
      {
        name: "Gründerzeitkeller aus Ziegel",
        text: "Viele Altbauten in Ehrenfeld, Nippes und der Südstadt haben Ziegelkeller ohne wirksame Horizontalsperre. Die Feuchte steigt kapillar auf und hinterlässt Salzränder und abplatzenden Putz."
      },
      {
        name: "Genutzte Souterrains",
        text: "In der Stadt wird jeder Quadratmeter genutzt: als Büro, Werkstatt oder Wohnung. Dort ist ein feuchter Keller nicht nur ein Bauschaden, sondern ein Risiko für Schimmel im Wohnraum."
      }
    ],
    sections: [
      {
        heading: "Feuchte Kellerwände sanieren in Köln: erst messen, dann abdichten",
        paragraphs: [
          "In Köln treffen sehr unterschiedliche Ursachen aufeinander: aufsteigende Feuchte in alten Ziegelkellern, seitlich drückendes Wasser in Rheinnähe und Kondensat in genutzten, schlecht gelüfteten Räumen. Welche davon vorliegt, zeigt erst die Feuchtigkeitsmessung im Mauerwerk.",
          "Danach planen wir das passende Verfahren: eine Horizontalsperre im Injektionsverfahren gegen aufsteigende Feuchte, eine Kellerinnenabdichtung nach WTA gegen Wasser von außen oder beides zusammen, jeweils von innen und ohne Aufgraben."
        ],
        bullets: [
          "Kostenlose Feuchtigkeitsmessung und Schadensanalyse vor Ort",
          "Innenabdichtung auch gegen drückendes Wasser",
          "Festpreis nach der Messung, 10 Jahre Garantie auf die Arbeit"
        ]
      },
      {
        heading: "Schimmel im Keller und in Souterrainwohnungen",
        paragraphs: [
          "Schimmel im Keller entsteht in Kölner Altbauten oft an kalten Außenwänden, wenn warme, feuchte Luft dort kondensiert. Wir entfernen den Befall sporensicher und beseitigen die Ursache, zum Beispiel mit Klimaplatten aus Calciumsilikat oder einer Abdichtung der Wand."
        ]
      }
    ],
    faqs: [
      {
        q: "Was hilft bei feuchtem Keller nach Rhein-Hochwasser in Köln?",
        a: "Zuerst trocknen und messen: Ob das Wasser nur eingedrungen ist oder die Wand dauerhaft durchfeuchtet bleibt, zeigt die Feuchtigkeitsmessung. Danach dichten wir die Wand von innen ab, damit beim nächsten Hochwasser kein Wasser mehr durchkommt."
      },
      {
        q: "Kommen Sie für die Messung auch nach Köln?",
        a: "Ja. Die Feuchtigkeitsmessung und Schadensanalyse vor Ort ist in Köln kostenlos und unverbindlich; einen Termin vereinbaren wir in der Regel innerhalb von 24 bis 48 Stunden."
      },
      {
        q: "Muss für die Kellersanierung in Köln aufgegraben werden?",
        a: "In den meisten Fällen nicht. Horizontalsperre, Innenabdichtung und Rissverpressung werden von innen ausgeführt; Hof, Garten und Gehweg bleiben unberührt."
      }
    ],
    nearby: [
      "leverkusen",
      "duesseldorf",
      "solingen"
    ]
  },
  // Duisburg
  {
    slug: "duisburg",
    name: "Duisburg",
    keyword: "Kellersanierung Duisburg",
    title: "Kellersanierung Duisburg | Nasse Keller sanieren",
    metaDescription: "Kellersanierung Duisburg ohne Aufgraben: nasse Kellerwände, Grundwasser an Rhein und Ruhr, Bergsenkung. Kostenlose Feuchtigkeitsmessung und Festpreis.",
    "h1": "Kellersanierung Duisburg: nasse Keller an Rhein und Ruhr trockenlegen",
    lede: "Duisburg liegt am Zusammenfluss von Rhein und Ruhr, und im Norden hat der Bergbau den Boden verändert. Beides merkt man im Keller: Grundwasser, das von außen drückt, und Risse, durch die es eindringt.",
    plz: [
      "47051",
      "47053",
      "47055",
      "47057",
      "47058",
      "47059",
      "47119",
      "47137",
      "47166",
      "47169",
      "47178",
      "47198",
      "47226",
      "47228",
      "47239",
      "47249",
      "47259",
      "47279"
    ],
    districts: [
      "Altstadt",
      "Neudorf",
      "Duissern",
      "Hamborn",
      "Meiderich",
      "Walsum",
      "Rheinhausen",
      "Homberg",
      "Huckingen"
    ],
    geo: {
      lat: 51.4344,
      lng: 6.7623
    },
    responseTime: "24 bis 48 Stunden",
    localFactors: [
      {
        name: "Grundwasser an Rhein und Ruhr",
        text: "In den Rheinvierteln und entlang der Ruhr hängt der Grundwasserstand vom Pegel ab. Bei Hochwasser drückt Wasser seitlich und von unten gegen Kellerwand und Bodenplatte."
      },
      {
        name: "Bergsenkungen im Duisburger Norden",
        text: "In Walsum, Hamborn und Meiderich hat der Steinkohlenbergbau den Boden absinken lassen. Setzungsrisse in Kellerwänden und Bodenplatten sind dort häufig der Weg, auf dem Wasser hereinkommt."
      },
      {
        name: "Altbauten aus der Industriezeit",
        text: "Neudorf, Duissern und Hochfeld haben viele Häuser aus der Gründerzeit und den Jahren um 1900 mit Ziegelkellern, deren Horizontalsperre längst nicht mehr wirkt."
      }
    ],
    sections: [
      {
        heading: "Feuchte Kellerwände in Duisburg: Grundwasser, Risse oder aufsteigende Feuchte?",
        paragraphs: [
          "Ein nasser Keller in Duisburg kann drei Ursachen haben, oft mehrere zugleich. Die Feuchtigkeitsmessung zeigt, ob Wasser von außen drückt, ob es durch Risse eindringt oder ob die Feuchte aus dem Fundament im Mauerwerk aufsteigt.",
          "Je nach Befund kombinieren wir eine Kellerinnenabdichtung nach WTA, eine Rissverpressung mit PU-Harz oder Epoxid und eine Horizontalsperre im Injektionsverfahren, alles von innen."
        ],
        bullets: [
          "Rissverpressung im Mauerwerk und Beton",
          "Innenabdichtung gegen drückendes Grundwasser",
          "Kostenlose Feuchtigkeitsmessung vor Ort"
        ]
      },
      {
        heading: "Schimmel im Keller in Duisburger Altbauten",
        paragraphs: [
          "Wo Kellerräume als Lager oder Hobbyraum genutzt werden, folgt auf die Feuchte oft der Schimmel. Wir entfernen ihn sporensicher und beseitigen die Ursache, damit er nicht wiederkommt."
        ]
      }
    ],
    faqs: [
      {
        q: "Kann ein Keller in Duisburg trotz hohem Grundwasser dicht werden?",
        a: "Ja. Eine Innenabdichtung aus mineralischen Dichtungsschlämmen mit sauber ausgebildeter Hohlkehle hält auch drückendem Wasser stand. Wie die Abdichtung aufgebaut sein muss, legen wir nach der Messung fest."
      },
      {
        q: "Was tun bei Rissen im Keller durch Bergsenkung?",
        a: "Wasserführende Risse werden unter Druck mit PU-Harz oder Epoxid verpresst und damit über den ganzen Wandquerschnitt geschlossen. Ob ein Riss noch arbeitet, klären wir bei der Besichtigung."
      },
      {
        q: "Wie schnell sind Sie in Duisburg vor Ort?",
        a: "In der Regel innerhalb von 24 bis 48 Stunden. Die Feuchtigkeitsmessung und Schadensanalyse ist kostenlos und unverbindlich."
      }
    ],
    nearby: [
      "oberhausen",
      "muelheim-an-der-ruhr",
      "duesseldorf"
    ]
  },
  // Gelsenkirchen
  {
    slug: "gelsenkirchen",
    name: "Gelsenkirchen",
    keyword: "Kellersanierung Gelsenkirchen",
    title: "Kellersanierung Gelsenkirchen | Risse & feuchte Keller",
    metaDescription:
      "Kellersanierung Gelsenkirchen ohne Aufgraben: Bergsenkungsrisse verpressen, feuchte Keller abdichten, von Buer bis Ückendorf. Messung kostenlos, Festpreis.",
    h1: "Kellersanierung Gelsenkirchen: Risse und feuchte Keller dauerhaft sanieren",
    lede:
      "Gelsenkirchen ist mit dem Bergbau gewachsen, und der Bergbau hat Spuren im Boden hinterlassen: Setzungsrisse, ein künstlich niedrig gehaltenes Grundwasser und viele Siedlungshäuser ohne Sperrschicht. Von unserem Sitz in Essen sind wir schnell in Buer, Horst oder Ückendorf, messen kostenlos und sanieren von innen.",
    plz: ["45879", "45881", "45883", "45884", "45886", "45888", "45889", "45891", "45892", "45894", "45896", "45897", "45899"],
    districts: ["Altstadt", "Schalke", "Ückendorf", "Rotthausen", "Bismarck", "Erle", "Resse", "Buer", "Hassel", "Horst"],
    geo: { lat: 51.5177, lng: 7.0857 },
    responseTime: "24 bis 48 Stunden",
    wiki: "https://de.wikipedia.org/wiki/Gelsenkirchen",
    localFactors: [
      {
        name: "Bergsenkungen und Setzungsrisse",
        text: "Unter fast dem ganzen Stadtgebiet wurde Kohle abgebaut, von Consolidation in Bismarck bis Nordstern in Horst. Der Boden hat sich ungleichmäßig gesetzt; Risse in Kellerwand und Bodenplatte lassen heute Wasser durch.",
      },
      {
        name: "Gepumptes Grundwasser im Emschertal",
        text: "Zwischen Emscher und Rhein-Herne-Kanal liegen Flächen so tief, dass das Grundwasser dauerhaft abgepumpt wird. Keller stehen hier dicht über dem Wasserspiegel und merken jede Änderung zuerst.",
      },
      {
        name: "Siedlungshäuser aus Ziegel",
        text: "Die Zechensiedlungen in Bismarck, Hassel und Buer und die schnell gebauten Häuser der Nachkriegszeit haben selten eine Horizontalsperre, die noch wirkt. Die Feuchte steigt im Ziegel auf.",
      },
      {
        name: "Kalte Kellerwände im Sommer",
        text: "Wird an warmen Tagen gelüftet, schlägt sich die feuchte Luft an den kühlen Wänden nieder. Viele Keller, die als nass gelten, haben in Wahrheit ein Kondensatproblem.",
      },
    ],
    localServices: [
      {
        slug: "rissverpressung",
        heading: "Rissverpressung in Gelsenkirchen",
        text: "Bergsenkungsrisse sind in Gelsenkirchen der häufigste Weg, auf dem Wasser in den Keller kommt. Wir prüfen, ob ein Riss Wasser führt und ob er noch arbeitet, und verpressen ihn dann unter Druck mit PU-Harz, das im Riss aufschäumt und elastisch bleibt, wenn sich der Boden weiter bewegt.",
      },
      {
        slug: "kellerinnenabdichtung",
        heading: "Keller abdichten in Gelsenkirchen",
        text: "Wo das Grundwasser im Emschertal nah an der Kellersohle steht, dichten wir die erdberührten Wände von innen ab: Dichtungsschlämme in mehreren Lagen, eine Hohlkehle am Boden-Wand-Anschluss und Sanierputz. Einfahrt und Vorgarten bleiben unberührt.",
      },
      {
        slug: "horizontalsperre",
        heading: "Horizontalsperre in Gelsenkirchen",
        text: "In Siedlungshäusern aus Ziegel steigt die Feuchte meist aus dem Fundament auf. Knapp über dem Kellerboden setzen wir per Injektion eine neue Sperrschicht, ohne Vortrocknung. Danach trocknet die Wand nach oben ab, wir messen nach, bis die Zielwerte erreicht sind.",
      },
      {
        slug: "schimmelbeseitigung",
        heading: "Schimmel im Keller in Gelsenkirchen",
        text: "Ob der Schimmel aus der nassen Wand kommt oder aus Kondensat, zeigt die Messung von Wandfeuchte, Oberflächentemperatur und Raumklima. Wir entfernen den Befall sporensicher und beseitigen dann die Ursache, damit er nicht zurückkommt.",
      },
    ],
    districtGroups: [
      {
        name: "Gelsenkirchen-Süd und Mitte",
        districts: ["Altstadt", "Schalke", "Ückendorf", "Rotthausen", "Neustadt", "Bulmke-Hüllen"],
        text: "Dichte Bebauung aus Gründerzeit und Wiederaufbau. Die alten Sperrschichten haben versagt, die Feuchte steigt auf, Salze sprengen den Putz. Von außen fehlt fast immer der Platz zum Aufgraben.",
      },
      {
        name: "Entlang der Emscher",
        districts: ["Bismarck", "Heßler", "Horst", "Erle", "Feldmark"],
        text: "Tief liegendes Gelände mit gepumptem Grundwasser und alten Zechenstandorten. Typisch sind Wasser von unten nach langem Regen und Risse an der Bodenplatte.",
      },
      {
        name: "Buer und der Norden",
        districts: ["Buer", "Hassel", "Scholven", "Resse", "Beckhausen"],
        text: "Siedlungshäuser, Einfamilienhäuser und der Altbaukern von Buer. Häufig eine Mischung aus aufsteigender Feuchte im Ziegel und Setzungsrissen aus dem Bergbau.",
      },
    ],
    sections: [
      {
        heading: "Bergsenkungsrisse: erst prüfen, dann verpressen",
        paragraphs: [
          "Wo unter Tage Kohle abgebaut wurde, hat sich die Oberfläche gesenkt, nicht gleichmäßig, sondern in Mulden und Stufen. Ein Haus, das darauf steht, wird schief belastet, und im Keller zeigt sich das zuerst: Risse an den Wandecken, an Fenstern und quer durch die Bodenplatte. Solange sie trocken bleiben, sind viele davon harmlos.",
          "Gefährlich werden sie, wenn Wasser durchkommt. Dann reicht Zuspachteln nicht, weil der Riss weiter arbeitet. Wir messen Breite und Feuchte, prüfen, ob er sich bewegt, und verpressen wasserführende Risse mit elastischem PU-Harz. Erst danach dichten wir die Fläche ab. Vermuten Sie einen Bergschaden, dokumentieren wir die Risse so, dass Sie die Unterlagen für Ihre Ansprüche verwenden können.",
        ],
      },
      {
        heading: "Feuchte Keller in Zechensiedlungen und Nachkriegshäusern",
        paragraphs: [
          "Die Siedlungshäuser in Bismarck, Hassel und Buer wurden schnell und sparsam gebaut, die Keller als Lagerraum aus Ziegel, mit einer dünnen Pappe als Sperrschicht, die nach Jahrzehnten zerfallen ist. Die Feuchte steigt im Mauerwerk auf, der Putz blüht weiß aus und bröckelt, es riecht muffig.",
          "Hier hilft eine Horizontalsperre im Injektionsverfahren, von innen gesetzt, mit einem Sanierputz, der die Restfeuchte verdunsten lässt und die Salze aufnimmt. Weil die Häuser oft Wand an Wand stehen, ist das auch der einzige Weg, der ohne Aufgraben beim Nachbarn auskommt.",
        ],
      },
      {
        heading: "Was eine Kellersanierung in Gelsenkirchen kostet",
        paragraphs: [
          "Den Preis bestimmen die Ursache, die Länge der betroffenen Wände, das Mauerwerk und die Zahl der Risse. Ein einzelner verpresster Riss kostet einen Bruchteil einer Innenabdichtung aller Wände. Deshalb messen wir zuerst, kostenlos, und geben Ihnen danach einen Festpreis, der sich nicht mehr ändert.",
        ],
        bullets: [
          "Kostenlose Feuchtemessung mit Protokoll",
          "Festpreis nach der Messung, ohne Nachträge",
          "10 Jahre Garantie auf die Arbeit, 25 Jahre Herstellergarantie auf die Wirksamkeit",
        ],
      },
    ],
    faqs: [
      {
        q: "Wer zahlt Bergschäden am Keller in Gelsenkirchen?",
        a: "Bei Schäden durch den Steinkohlenbergbau kann ein Anspruch gegen das Bergbauunternehmen bestehen. Ob ein Bergschaden vorliegt, klärt ein Sachverständiger oder die Schlichtungsstelle Bergschaden NRW. Wir dokumentieren Feuchte und Risse mit Messprotokoll, das Sie dafür verwenden können.",
      },
      {
        q: "Kann ein feuchter Keller in Gelsenkirchen ohne Aufgraben trocken werden?",
        a: "Ja. Horizontalsperre, Rissverpressung und Innenabdichtung werden von innen ausgeführt. Vorgarten, Einfahrt und die Wand zum Nachbarn bleiben unberührt.",
      },
      {
        q: "Wie schnell sind Sie in Gelsenkirchen vor Ort?",
        a: "Von unserem Sitz in Essen aus in der Regel innerhalb von 24 bis 48 Stunden, in Buer, Horst und Ückendorf ebenso wie in Resse. Fotos vorab per WhatsApp an 0172 2064177 helfen bei der ersten Einschätzung. Die Messung ist kostenlos.",
      },
      {
        q: "Ist jeder Riss im Keller gefährlich?",
        a: "Nein. Feine, trockene Risse, die sich nicht weiter öffnen, sind oft nur ein Schönheitsfehler. Führt ein Riss Wasser oder wird er breiter, sollte er verpresst werden. Das klären wir bei der kostenlosen Messung.",
      },
      {
        q: "Was kostet die Kellersanierung in Gelsenkirchen?",
        a: "Das hängt von Ursache, Wandfläche, Mauerwerk und Rissen ab. Nach der kostenlosen Messung erhalten Sie ein verbindliches Festpreisangebot; die Sanierung von innen ist fast immer deutlich günstiger als eine Außenabdichtung.",
      },
    ],
    nearby: ["essen", "bottrop", "bochum", "oberhausen"],
  },
  // Oberhausen
  {
    slug: "oberhausen",
    name: "Oberhausen",
    keyword: "Kellersanierung Oberhausen",
    title: "Kellersanierung Oberhausen | Feuchte Keller sanieren",
    metaDescription:
      "Kellersanierung Oberhausen ohne Aufgraben: feuchte Keller in Zechenhäusern und Altbauten von Sterkrade bis Alstaden. Messung kostenlos, Festpreis.",
    h1: "Kellersanierung Oberhausen: feuchte Keller von innen trockenlegen",
    lede:
      "Von der Siedlung Eisenheim bis Sterkrade und Osterfeld stehen in Oberhausen viele Häuser aus der Zeit von Kohle und Stahl. Ihre Keller sind oft feucht, weil die alte Sperrschicht nicht mehr wirkt oder das Grundwasser an der Emscher hoch steht. Wir messen kostenlos, woher die Nässe kommt, und sanieren von innen.",
    plz: ["46045", "46047", "46049", "46117", "46119", "46145", "46147", "46149"],
    districts: ["Alt-Oberhausen", "Alstaden", "Lirich", "Sterkrade", "Holten", "Schmachtendorf", "Königshardt", "Osterfeld", "Klosterhardt", "Rothebusch"],
    geo: { lat: 51.4963, lng: 6.8638 },
    responseTime: "24 bis 48 Stunden",
    wiki: "https://de.wikipedia.org/wiki/Oberhausen",
    localFactors: [
      {
        name: "Arbeitersiedlungen aus Ziegel",
        text: "Eisenheim, gebaut ab 1846, gilt als älteste Arbeitersiedlung im Ruhrgebiet, und viele weitere folgten. Ihre Ziegelkeller haben keine moderne Abdichtung, die Feuchte steigt aus dem Boden auf.",
      },
      {
        name: "Emscher, Kanal und Grundwasser",
        text: "Emscher und Rhein-Herne-Kanal laufen quer durch die Stadt. Im abgesenkten Gelände daneben wird das Grundwasser gepumpt; nach langem Regen steht es an Bodenplatte und Wandfuß.",
      },
      {
        name: "Bergsenkung",
        text: "Unter Osterfeld und Sterkrade wurde Kohle abgebaut. Der Boden hat sich gesetzt, und Risse in Kellerwand und Boden sind heute ein Weg für das Wasser.",
      },
      {
        name: "Wiederaufbau nach dem Krieg",
        text: "Viele Häuser wurden nach 1945 schnell wieder aufgebaut, oft auf alten Kellern. Abdichtung und Sperrschicht fehlen oder sind nach Jahrzehnten unwirksam.",
      },
    ],
    localServices: [
      {
        slug: "horizontalsperre",
        heading: "Horizontalsperre in Oberhausen",
        text: "In den Ziegelkellern der Siedlungen und Altbauten steigt die Feuchte meist aus dem Fundament auf. Wir setzen knapp über dem Boden per Injektion eine neue Sperrschicht, ohne Vortrocknung, und messen nach, bis die Wand trocken ist.",
      },
      {
        slug: "kellerinnenabdichtung",
        heading: "Keller abdichten in Oberhausen",
        text: "Wo das Grundwasser an Emscher und Kanal nah an der Kellersohle steht, dichten wir die erdberührten Wände von innen ab: Dichtungsschlämme, Hohlkehle am Wandfuß und Sanierputz. Das hält auch zeitweise drückendem Wasser stand.",
      },
      {
        slug: "kellersanierung",
        heading: "Kellersanierung in Oberhausen",
        text: "Oft kommen mehrere Ursachen zusammen: aufsteigende Feuchte, Wasser von außen und ein Riss. Wir messen jede Wand einzeln und kombinieren nur die Verfahren, die sie braucht, zum Festpreis und mit 10 Jahren Garantie auf die Arbeit.",
      },
      {
        slug: "schimmelbeseitigung",
        heading: "Schimmel im Keller in Oberhausen",
        text: "Riecht der Keller muffig oder zeigen sich dunkle Flecken, ist meist schon Schimmel da. Wir entfernen ihn sporensicher, klären per Messung, ob die Nässe aus der Wand oder aus der Luft kommt, und beseitigen die Ursache.",
      },
    ],
    districtGroups: [
      {
        name: "Alt-Oberhausen",
        districts: ["Innenstadt", "Lirich", "Alstaden", "Marienkirche", "Bermensfeld"],
        text: "Gründerzeitstraßen und Wiederaufbau rund um die Innenstadt, in Alstaden nah an der Ruhr. Typisch ist aufsteigende Feuchte im alten Mauerwerk, in Ruhrnähe zusätzlich Wasser von unten.",
      },
      {
        name: "Sterkrade",
        districts: ["Sterkrade-Mitte", "Holten", "Schmachtendorf", "Königshardt", "Tackenberg", "Buschhausen"],
        text: "Gewachsener Ortskern, Siedlungen und viele Einfamilienhäuser. Häufig undichte Anschlüsse an der Bodenplatte und Risse aus Bergsenkungen.",
      },
      {
        name: "Osterfeld",
        districts: ["Osterfeld-Mitte", "Eisenheim", "Klosterhardt", "Rothebusch", "Vondern"],
        text: "Zechensiedlungen und Bergbaugelände. Ziegelkeller ohne Sperrschicht, dazu Setzungsrisse und ein Grundwasser, das im abgesenkten Gelände nah an der Sohle steht.",
      },
    ],
    sections: [
      {
        heading: "Siedlungshäuser: Feuchte, die aus dem Boden steigt",
        paragraphs: [
          "Die Häuser in Eisenheim, Klosterhardt oder rund um die alten Hütten wurden für die Arbeiter von Kohle und Stahl gebaut, mit einfachen Kellern aus Ziegel. Eine Sperrschicht gegen aufsteigende Feuchte gab es oft gar nicht, oder sie bestand aus Pappe, die längst zerfallen ist. Das Ergebnis kennen viele Oberhausener: ein dunkler Feuchterand, weiße Salze und abplatzender Putz.",
          "Weil viele dieser Häuser unter Denkmalschutz oder in geschlossener Reihe stehen, kommt eine Aufgrabung kaum in Frage. Eine Horizontalsperre von innen und ein Sanierputz lösen das Problem, ohne die Fassade oder den Garten anzufassen.",
        ],
      },
      {
        heading: "Wasser von unten an Emscher und Kanal",
        paragraphs: [
          "In den tief liegenden Lagen entlang der Emscher hält die Emschergenossenschaft das Grundwasser mit Pumpen niedrig. Die Kellersohle liegt dort trotzdem oft nur knapp darüber. Nach langem Regen drückt das Wasser durch den Boden-Wand-Anschluss oder durch Risse in der Bodenplatte.",
          "Dann reicht eine Sperrschicht allein nicht. Wir verpressen die Risse und dichten die Wände von innen bis über die Wasserlinie ab, mit einer Hohlkehle am Übergang zum Boden, an der das meiste Wasser hereinkommt.",
        ],
      },
      {
        heading: "Was eine Kellersanierung in Oberhausen kostet",
        paragraphs: [
          "Eine Horizontalsperre an zwei Wänden ist etwas anderes als eine Innenabdichtung des ganzen Kellers. Den Preis bestimmen Ursache, Wandfläche, Mauerwerk und Salzgehalt, deshalb messen wir zuerst, kostenlos, und geben Ihnen danach einen Festpreis.",
        ],
        bullets: [
          "Kostenlose Feuchtemessung und Schadensanalyse",
          "Verbindlicher Festpreis nach der Messung",
          "10 Jahre Garantie auf die Arbeit, 25 Jahre Herstellergarantie auf die Wirksamkeit",
        ],
      },
    ],
    faqs: [
      {
        q: "Lohnt sich eine Kellersanierung in einem Oberhausener Zechenhaus?",
        a: "Ja, denn ein trockener Keller schützt die Bausubstanz und macht den Raum wieder nutzbar. Mit der Injektion von innen bleibt der Aufwand überschaubar; den Festpreis erfahren Sie nach der kostenlosen Messung.",
      },
      {
        q: "Darf ich in einem denkmalgeschützten Siedlungshaus sanieren?",
        a: "Die Arbeiten finden im Keller statt und verändern die Fassade nicht. Ob auch innen eine Erlaubnis nötig ist, klären Sie vorab mit der Unteren Denkmalbehörde der Stadt Oberhausen; die technische Beschreibung der Maßnahmen geben wir Ihnen dafür mit.",
      },
      {
        q: "Wie lange dauert es, bis die Wand trocken ist?",
        a: "Die Sperre stoppt den Nachschub sofort; die gespeicherte Feuchte verdunstet je nach Wanddicke in einigen Monaten. Wir messen nach, bis die Zielwerte erreicht sind.",
      },
      {
        q: "Wie schnell sind Sie in Oberhausen vor Ort?",
        a: "Von unserem Sitz in Essen in der Regel innerhalb von 24 bis 48 Stunden, in Sterkrade, Osterfeld und Alt-Oberhausen. Die Feuchtemessung ist kostenlos und unverbindlich.",
      },
      {
        q: "Was kostet die Kellersanierung in Oberhausen?",
        a: "Das hängt von Ursache, Wandfläche und Mauerwerk ab. Nach der kostenlosen Messung bekommen Sie einen verbindlichen Festpreis, ohne Nachträge.",
      },
    ],
    nearby: ["muelheim-an-der-ruhr", "bottrop", "duisburg", "essen"],
  },
  // Mülheim an der Ruhr
  {
    slug: "muelheim-an-der-ruhr",
    name: "Mülheim an der Ruhr",
    keyword: "Kellersanierung Mülheim",
    title: "Kellersanierung Mülheim | Abdichtung in Saarn & Broich",
    metaDescription:
      "Kellersanierung Mülheim an der Ruhr: Keller abdichten gegen Hang- und Grundwasser in Saarn, Broich, Speldorf und Heißen. Messung kostenlos, Festpreis.",
    h1: "Kellersanierung Mülheim an der Ruhr: Keller abdichten an Hang und Ruhr",
    lede:
      "Zwischen den Hängen von Saarn und Holthausen und dem Ruhrufer in Broich und Mintard bekommen Keller Wasser von mehreren Seiten: als Hangwasser, als Grundwasser und als aufsteigende Feuchte im alten Mauerwerk. Mülheim grenzt an Essen, unseren Sitz; wir messen kostenlos und dichten von innen ab.",
    plz: ["45468", "45470", "45472", "45473", "45475", "45476", "45478", "45479", "45481"],
    districts: ["Altstadt", "Saarn", "Selbeck", "Mintard", "Speldorf", "Broich", "Menden", "Holthausen", "Heißen", "Dümpten", "Styrum"],
    geo: { lat: 51.4275, lng: 6.8825 },
    responseTime: "24 bis 48 Stunden",
    wiki: "https://de.wikipedia.org/wiki/M%C3%BClheim_an_der_Ruhr",
    localFactors: [
      {
        name: "Hanglagen zur Ruhr",
        text: "An den Hängen von Saarn, Menden und Holthausen sickert Regenwasser im Boden abwärts und staut sich an der bergseitigen Kellerwand. Es drückt durch Fugen und Risse.",
      },
      {
        name: "Ruhr und Grundwasser",
        text: "In Broich, Mintard und Styrum folgt der Grundwasserstand der Ruhr. Bei hohem Pegel steht Wasser an Bodenplatte und Wandfuß.",
      },
      {
        name: "Altbauten und Villen",
        text: "Die Häuser in der Altstadt, in Broich und Speldorf haben oft Bruchstein- oder Ziegelkeller ohne Sperrschicht, die noch wirkt. Die Feuchte steigt auf.",
      },
      {
        name: "Bergbau im Norden",
        text: "Mülheim war die erste Stadt im Ruhrgebiet ohne Zeche, doch in Heißen und Dümpten wurde lange Kohle abgebaut. Setzungsrisse gibt es dort bis heute.",
      },
    ],
    localServices: [
      {
        slug: "kellerinnenabdichtung",
        heading: "Keller abdichten in Mülheim",
        text: "Gegen Hang- und Schichtenwasser dichten wir die betroffene Wand von innen ab: mehrlagige Dichtungsschlämme, eine Hohlkehle am Boden-Wand-Anschluss und Sanierputz. Das hält auch drückendem Wasser stand, ohne dass der Hang aufgegraben werden muss.",
      },
      {
        slug: "horizontalsperre",
        heading: "Horizontalsperre in Mülheim",
        text: "In den Altbauten der Innenstadt, in Broich und Speldorf steigt die Feuchte meist im Mauerwerk auf. Wir setzen per Injektion eine neue Sperrschicht, auch in Bruchstein, dessen Hohlräume wir vorher verfüllen.",
      },
      {
        slug: "rissverpressung",
        heading: "Rissverpressung in Mülheim",
        text: "In Heißen und Dümpten stammen viele Risse aus dem Bergbau, am Hang aus dem Druck des Bodens. Wasserführende Risse verpressen wir unter Druck mit PU-Harz, das elastisch bleibt; tragende Risse schließen wir mit Epoxid.",
      },
      {
        slug: "schimmelbeseitigung",
        heading: "Schimmel im Souterrain in Mülheim",
        text: "Am Hang wird das Souterrain oft als Wohnraum genutzt. Kondensat und eindringende Feuchte führen dort schnell zu Schimmel. Wir entfernen ihn sporensicher und beseitigen die Ursache, wo nötig mit Klimaplatten.",
      },
    ],
    districtGroups: [
      {
        name: "Linksruhr: Saarn, Speldorf und Broich",
        districts: ["Saarn", "Selbeck", "Mintard", "Speldorf", "Broich"],
        text: "Hanglagen, Villen und Einfamilienhäuser zwischen Ruhr und Wald. Die bergseitige Kellerwand ist oft nass, unten an der Ruhr steigt das Grundwasser. Hier ist eine Innenabdichtung gegen drückendes Wasser der häufigste Weg.",
      },
      {
        name: "Innenstadt und Süden",
        districts: ["Altstadt", "Eppinghofen", "Menden", "Holthausen", "Raadt"],
        text: "Gründerzeit und Wiederaufbau in der Stadtmitte, Hanglagen im Süden. Typisch ist aufsteigende Feuchte im alten Mauerwerk, am Hang zusätzlich seitlich eindringendes Wasser.",
      },
      {
        name: "Der Norden",
        districts: ["Heißen", "Dümpten", "Styrum", "Winkhausen"],
        text: "Ehemaliges Bergbaugebiet und Siedlungshäuser. Setzungsrisse in Wand und Bodenplatte und Ziegelkeller ohne Sperrschicht.",
      },
    ],
    sections: [
      {
        heading: "Hangwasser in Saarn, Menden und Holthausen",
        paragraphs: [
          "Wer am Hang über der Ruhr wohnt, kennt das Bild: Die Wand zum Hang ist nass, die zum Tal trocken. Regen versickert oben, läuft im Boden abwärts und staut sich an der Kellerwand, die in den Hang hineingebaut ist. Bei Starkregen drückt das Wasser durch Fugen und am Wandfuß in den Keller.",
          "Eine Sperrschicht allein hilft dagegen nicht. Wir dichten die bergseitige Wand von innen mit Dichtungsschlämme in mehreren Lagen ab, mit einer Hohlkehle am Übergang zum Boden. An den übrigen Wänden reicht oft eine Horizontalsperre und ein Sanierputz. So zahlen Sie nur für die Abdichtung, die jede Wand wirklich braucht.",
        ],
      },
      {
        heading: "An der Ruhr: Grundwasser in Broich, Mintard und Styrum",
        paragraphs: [
          "In den Lagen nah am Fluss folgt das Grundwasser dem Pegel der Ruhr. Bei hohem Wasserstand steht es an der Bodenplatte, und es drückt von unten durch den Boden-Wand-Anschluss. Das Hochwasser im Juli 2021 hat gezeigt, wie schnell die Ruhr steigen kann.",
          "Nach einem Wasserschaden messen wir zuerst, wie tief die Nässe ins Mauerwerk gezogen ist. Dann dichten wir den Keller von innen ab, damit er beim nächsten Hochwasser trocken bleibt.",
        ],
      },
      {
        heading: "Was eine Kellersanierung in Mülheim kostet",
        paragraphs: [
          "Den Preis bestimmen die Ursache, die Länge der betroffenen Wände und das Mauerwerk. Eine Innenabdichtung an der Hangwand kostet einen Bruchteil einer Abdichtung des ganzen Kellers. Deshalb messen wir zuerst, kostenlos, und nennen Ihnen danach einen Festpreis.",
        ],
        bullets: [
          "Kostenlose Feuchtemessung vor Ort, mit Protokoll",
          "Abdichtung nur an den Wänden, an denen das Wasser drückt",
          "Kurze Wege von unserem Sitz in Essen",
        ],
      },
    ],
    faqs: [
      {
        q: "Hilft eine Innenabdichtung gegen Hangwasser in Mülheim?",
        a: "Ja. Die erdberührte Wand wird von innen mit mineralischen Dichtungsschlämmen und einer Hohlkehle abgedichtet; das hält auch drückendem Wasser stand, ohne dass der Hang aufgegraben werden muss.",
      },
      {
        q: "Suchen Sie einen Abdichter in Saarn?",
        a: "Saarn liegt wenige Minuten von unserem Sitz in Essen. Wir messen in Saarn, Selbeck und Mintard kostenlos, woher die Feuchte kommt, und dichten den Keller dann von innen ab, zum Festpreis.",
      },
      {
        q: "Wie schnell sind Sie in Mülheim vor Ort?",
        a: "Mülheim grenzt an Essen, unseren Sitz; einen Termin für die kostenlose Messung bekommen Sie in der Regel innerhalb von 24 bis 48 Stunden.",
      },
      {
        q: "Was kostet die Kellersanierung in Mülheim?",
        a: "Das hängt von Ursache, Wandlänge und Wanddicke ab. Nach der kostenlosen Messung erhalten Sie ein verbindliches Festpreisangebot.",
      },
      {
        q: "Mein Keller stand beim Hochwasser unter Wasser. Was nun?",
        a: "Erst trocknen und messen: Ob das Wasser nur eingedrungen ist oder die Wand dauerhaft durchfeuchtet bleibt, zeigt die Messung. Danach dichten wir von innen ab, damit beim nächsten Hochwasser kein Wasser mehr durchkommt.",
      },
    ],
    nearby: ["essen", "oberhausen", "duisburg", "duesseldorf"],
  },
  // Hagen
  {
    slug: "hagen",
    name: "Hagen",
    keyword: "Kellersanierung Hagen",
    title: "Kellersanierung Hagen | Feuchte Keller trockenlegen",
    metaDescription: "Kellersanierung Hagen ohne Aufgraben: feuchte Kellerwände in Hanglagen an Volme, Ennepe und Lenne von innen sanieren. Kostenlose Feuchtigkeitsmessung.",
    "h1": "Kellersanierung Hagen: feuchte Keller in Hang und Tal sanieren",
    lede: "Hagen liegt am Rand des Sauerlands zwischen Volme, Ennepe, Lenne und Ruhr. Steile Hänge, viel Regen und alte Keller aus Bruchstein machen Feuchte im Keller hier besonders häufig.",
    plz: [
      "58089",
      "58091",
      "58093",
      "58095",
      "58097",
      "58099",
      "58119",
      "58135"
    ],
    districts: [
      "Mitte",
      "Haspe",
      "Hohenlimburg",
      "Eilpe",
      "Wehringhausen",
      "Boele",
      "Vorhalle",
      "Emst"
    ],
    geo: {
      lat: 51.3671,
      lng: 7.4633
    },
    responseTime: "24 bis 48 Stunden",
    localFactors: [
      {
        name: "Hänge und Schichtenwasser",
        text: "Viele Häuser in Eilpe, Emst und Haspe stehen am Hang. Nach Regen läuft Wasser im Boden auf die bergseitige Kellerwand zu und dringt ein."
      },
      {
        name: "Vier Flüsse in der Stadt",
        text: "Volme, Ennepe, Lenne und Ruhr prägen die Täler. In Tallagen und bei Hochwasser steigt das Grundwasser an den Keller heran."
      },
      {
        name: "Bruchsteinkeller",
        text: "Ältere Häuser, etwa in Hohenlimburg und Wehringhausen, haben Keller aus Bruchstein, die ohne Abdichtung gebaut wurden."
      }
    ],
    sections: [
      {
        heading: "Feuchte Kellerwände sanieren in Hagen",
        paragraphs: [
          "In Hanglage kommt das Wasser meist seitlich, im Tal oft von unten. Wir messen, welcher Fall vorliegt, und dichten von innen ab: mit Kellerinnenabdichtung nach WTA, Horizontalsperre im Injektionsverfahren und, wo nötig, Rissverpressung."
        ],
        bullets: [
          "Abdichtung gegen Hangwasser ohne Aufgraben",
          "Mauerwerkstrockenlegung auch in Bruchstein",
          "Kostenlose Feuchtigkeitsmessung und Festpreis"
        ]
      },
      {
        heading: "Schimmel im Keller in Hagener Altbauten",
        paragraphs: [
          "Feuchte Bruchsteinwände kühlen stark aus, warme Luft kondensiert daran. Wir beseitigen den Schimmel sporensicher und die Ursache gleich mit."
        ]
      }
    ],
    faqs: [
      {
        q: "Kann ein Bruchsteinkeller in Hagen abgedichtet werden?",
        a: "Ja. Bruchsteinmauerwerk wird vor der Injektion vorbereitet, Hohlräume werden verfüllt; danach wirkt die Horizontalsperre wie in Ziegelmauerwerk. Die Innenabdichtung schützt zusätzlich gegen seitliches Wasser."
      },
      {
        q: "Was tun, wenn nach Starkregen Wasser im Keller steht?",
        a: "Rufen Sie uns an. Nach dem Abpumpen messen wir, wo das Wasser hereinkommt, und planen die Abdichtung, damit es beim nächsten Regen trocken bleibt."
      },
      {
        q: "Ist die Messung in Hagen kostenlos?",
        a: "Ja, die Feuchtigkeitsmessung und Schadensanalyse vor Ort ist kostenlos und unverbindlich."
      }
    ],
    nearby: [
      "wuppertal",
      "dortmund",
      "bochum"
    ]
  },
  // Leverkusen
  {
    slug: "leverkusen",
    name: "Leverkusen",
    keyword: "Kellersanierung Leverkusen",
    title: "Kellersanierung Leverkusen | Feuchte Keller sanieren",
    metaDescription: "Kellersanierung Leverkusen ohne Aufgraben: feuchte Kellerwände nach Hochwasser an Rhein, Wupper und Dhünn von innen sanieren. Kostenlose Messung.",
    "h1": "Kellersanierung Leverkusen: feuchte Keller dauerhaft trockenlegen",
    lede: "Leverkusen liegt zwischen Rhein, Wupper und Dhünn. Das Hochwasser im Juli 2021 hat in Opladen und Schlebusch gezeigt, wie schnell Wasser in Keller kommt. Danach bleibt die Wand oft lange nass.",
    plz: [
      "51371",
      "51373",
      "51375",
      "51377",
      "51379",
      "51381"
    ],
    districts: [
      "Wiesdorf",
      "Opladen",
      "Schlebusch",
      "Hitdorf",
      "Rheindorf",
      "Quettingen",
      "Bergisch Neukirchen",
      "Steinbüchel"
    ],
    geo: {
      lat: 51.0459,
      lng: 6.9844
    },
    responseTime: "24 bis 48 Stunden",
    localFactors: [
      {
        name: "Hochwasser an Wupper und Dhünn",
        text: "Im Juli 2021 traten Wupper und Dhünn über die Ufer. Keller, die damals vollgelaufen sind, zeigen oft noch Jahre später Feuchteränder und Salze."
      },
      {
        name: "Rhein und Grundwasser",
        text: "In Hitdorf und Rheindorf steigt das Grundwasser mit dem Rheinpegel. Dann drückt Wasser von unten und seitlich gegen den Keller."
      },
      {
        name: "Siedlungs- und Nachkriegsbauten",
        text: "Viele Häuser stammen aus den Jahrzehnten des Wachstums der Stadt; ihre Kellerabdichtung ist heute oft verbraucht."
      }
    ],
    sections: [
      {
        heading: "Feuchte Kellerwände nach Hochwasser sanieren",
        paragraphs: [
          "Nach einem Wasserschaden im Keller reicht Trocknen allein oft nicht: Salze bleiben in der Wand und ziehen weiter Feuchte. Wir messen Feuchte und Salze und sanieren dann von innen mit Kellerinnenabdichtung nach WTA, Sanierputz und, wo nötig, einer Horizontalsperre."
        ],
        bullets: [
          "Feuchtigkeitsmessung und Salzanalyse kostenlos",
          "Innenabdichtung gegen drückendes Wasser",
          "Festpreis und 10 Jahre Garantie auf die Arbeit"
        ]
      },
      {
        heading: "Schimmel im Keller nach einem Wasserschaden",
        paragraphs: [
          "Bleibt die Wand nach einem Hochwasser feucht, folgt oft Schimmel. Wir entfernen ihn sporensicher und beseitigen die Feuchte, damit er nicht wiederkommt."
        ]
      }
    ],
    faqs: [
      {
        q: "Mein Keller in Leverkusen war 2021 überflutet. Ist die Wand jetzt trocken?",
        a: "Das lässt sich nur messen. Oft ist die Oberfläche trocken, das Mauerwerk innen aber noch feucht und voller Salze. Die Feuchtigkeitsmessung zeigt den Zustand und ob saniert werden muss."
      },
      {
        q: "Kann man den Keller gegen das nächste Hochwasser schützen?",
        a: "Eine Innenabdichtung nach WTA hält drückendem Wasser stand und verhindert, dass es durch Wand und Wandfuß kommt. Wie hoch und wie stark sie ausgeführt wird, legen wir nach der Messung fest."
      },
      {
        q: "Wie schnell sind Sie in Leverkusen vor Ort?",
        a: "In der Regel innerhalb von 24 bis 48 Stunden; die Messung ist kostenlos und unverbindlich."
      }
    ],
    nearby: [
      "koeln",
      "solingen",
      "wermelskirchen"
    ]
  },
  // Bottrop
  {
    slug: "bottrop",
    name: "Bottrop",
    keyword: "Kellersanierung Bottrop",
    title: "Kellersanierung Bottrop | Bergschäden & feuchte Keller",
    metaDescription:
      "Kellersanierung Bottrop ohne Aufgraben: Setzungsrisse verpressen, feuchte Keller abdichten, von Welheim bis Kirchhellen. Messung kostenlos, Festpreis.",
    h1: "Kellersanierung Bottrop: feuchte Keller und Setzungsrisse dauerhaft sanieren",
    lede:
      "In Bottrop endete 2018 mit der Zeche Prosper-Haniel der deutsche Steinkohlenbergbau. Geblieben sind abgesenkte Böden, Setzungsrisse und Siedlungshäuser, in deren Kellern die Feuchte steigt. Von unserem Sitz in Essen sind wir schnell in Welheim, Eigen oder Kirchhellen, messen kostenlos und sanieren von innen.",
    plz: ["46236", "46238", "46240", "46242", "46244"],
    districts: ["Stadtmitte", "Eigen", "Batenbrock", "Boy", "Welheim", "Ebel", "Fuhlenbrock", "Vonderort", "Grafenwald", "Kirchhellen"],
    geo: { lat: 51.5236, lng: 6.9285 },
    responseTime: "24 bis 48 Stunden",
    wiki: "https://de.wikipedia.org/wiki/Bottrop",
    localFactors: [
      {
        name: "Bergsenkungen",
        text: "Über mehr als hundert Jahre wurde unter Bottrop Kohle abgebaut, zuletzt bis 2018. Der Boden hat sich ungleichmäßig gesetzt; Risse in Wänden und Bodenplatten lassen Wasser in den Keller.",
      },
      {
        name: "Gepumptes Grundwasser",
        text: "Im abgesenkten Süden an der Emscher, in Ebel und Welheim, hält die Emschergenossenschaft das Grundwasser mit Pumpen niedrig. Die Kellersohlen liegen dort nur knapp darüber.",
      },
      {
        name: "Zechensiedlungen aus Ziegel",
        text: "Die Siedlungshäuser in Welheim, Batenbrock, Boy und Eigen haben Ziegelkeller ohne Sperrschicht, die noch wirkt. Die Feuchte steigt im Mauerwerk auf.",
      },
      {
        name: "Kirchhellen: Sand und Einfamilienhäuser",
        text: "Im ländlichen Norden stehen vor allem Einfamilienhäuser auf sandigem Boden. Typisch sind undichte Anschlüsse an der Bodenplatte und Kondensat in kühlen Kellern.",
      },
    ],
    localServices: [
      {
        slug: "rissverpressung",
        heading: "Rissverpressung in Bottrop",
        text: "Bergsenkungsrisse sind in Bottrop der häufigste Weg für das Wasser. Wir prüfen, ob ein Riss Wasser führt und ob er noch arbeitet, und verpressen ihn mit PU-Harz, das elastisch bleibt, wenn sich der Boden weiter setzt.",
      },
      {
        slug: "horizontalsperre",
        heading: "Horizontalsperre in Bottrop",
        text: "In den Ziegelkellern der Siedlungen steigt die Feuchte aus dem Fundament. Knapp über dem Kellerboden setzen wir per Injektion eine neue Sperrschicht, ohne Vortrocknung, und messen nach, bis die Wand trocken ist.",
      },
      {
        slug: "kellerinnenabdichtung",
        heading: "Keller abdichten in Bottrop",
        text: "Wo das Grundwasser an der Emscher nah an der Kellersohle steht, dichten wir die erdberührten Wände von innen ab: Dichtungsschlämme, Hohlkehle am Wandfuß und Sanierputz. Garten und Einfahrt bleiben unberührt.",
      },
      {
        slug: "feuchtemessung",
        heading: "Feuchtemessung in Bottrop",
        text: "Die Messung ist kostenlos: Wir messen die Feuchte in mehreren Wandhöhen, prüfen Salze, Oberflächentemperatur und Raumklima und dokumentieren Risse mit Verlauf und Breite. Das Protokoll bekommen Sie schriftlich, auch für die Klärung eines Bergschadens.",
      },
    ],
    districtGroups: [
      {
        name: "Bottrop-Süd an der Emscher",
        districts: ["Ebel", "Welheim", "Welheimer Mark", "Batenbrock-Süd", "Boy"],
        text: "Tief liegendes Gelände, Zechensiedlungen und gepumptes Grundwasser. Typisch sind Wasser von unten nach langem Regen und Risse in der Bodenplatte.",
      },
      {
        name: "Stadtmitte und Bottrop-Nord",
        districts: ["Stadtmitte", "Eigen", "Fuhlenbrock", "Batenbrock-Nord", "Vonderort", "Lehmkuhle"],
        text: "Altbauten, Wiederaufbau und Siedlungshäuser rund um die Innenstadt. Häufig aufsteigende Feuchte im Ziegel und Setzungsrisse aus dem Bergbau.",
      },
      {
        name: "Kirchhellen",
        districts: ["Kirchhellen-Mitte", "Grafenwald", "Feldhausen"],
        text: "Einfamilienhäuser auf sandigem Boden. Seltener Bergschäden, häufiger undichte Anschlüsse am Wandfuß und Schimmel durch Kondensat im kühlen Keller.",
      },
    ],
    sections: [
      {
        heading: "Nach dem Bergbau: Risse, die Wasser führen",
        paragraphs: [
          "Als Prosper-Haniel 2018 schloss, endete die Kohle, nicht aber ihre Folgen. Wo unter Tage abgebaut wurde, hat sich die Oberfläche gesenkt, in Mulden und Stufen. Häuser darauf werden ungleich belastet, und im Keller zeigt sich das als Riss an Ecken, Fenstern und quer durch die Bodenplatte.",
          "Führt ein solcher Riss Wasser, reicht Zuspachteln nicht, weil er weiter arbeitet. Wir messen Breite und Feuchte, prüfen, ob er sich bewegt, und verpressen ihn mit elastischem PU-Harz. Vermuten Sie einen Bergschaden, dokumentieren wir die Risse so, dass Sie die Unterlagen für Ihre Ansprüche verwenden können.",
        ],
      },
      {
        heading: "Feuchte Siedlungshäuser in Welheim, Batenbrock und Eigen",
        paragraphs: [
          "Die Gartenstadt Welheim und die vielen Siedlungen der Stadt wurden für die Bergleute gebaut, mit einfachen Kellern aus Ziegel. Die Sperrschicht ist längst zerfallen, die Feuchte steigt auf, und mit ihr die Salze, die den Putz absprengen und den muffigen Geruch bringen.",
          "Eine Horizontalsperre von innen, dazu ein Sanierputz, der die Restfeuchte verdunsten lässt: So wird der Keller trocken, ohne die Fassade, den Garten oder die Wand zum Nachbarn anzufassen.",
        ],
      },
      {
        heading: "Was eine Kellersanierung in Bottrop kostet",
        paragraphs: [
          "Den Preis bestimmen die Ursache, die Länge der betroffenen Wände, das Mauerwerk und die Zahl der Risse. Deshalb messen wir zuerst, kostenlos, und geben Ihnen danach einen Festpreis, der sich nicht mehr ändert.",
        ],
        bullets: [
          "Kostenlose Feuchtemessung mit Protokoll",
          "Festpreis nach der Messung, ohne Nachträge",
          "10 Jahre Garantie auf die Arbeit, 25 Jahre Herstellergarantie auf die Wirksamkeit",
        ],
      },
    ],
    faqs: [
      {
        q: "Wer kommt für Bergschäden am Haus in Bottrop auf?",
        a: "Bei Schäden durch den Steinkohlenbergbau kann ein Anspruch gegen das Bergbauunternehmen bestehen, auch nach dem Ende des Bergbaus. Ob ein Bergschaden vorliegt, klärt ein Sachverständiger oder die Schlichtungsstelle Bergschaden NRW. Unser Messprotokoll dokumentiert Feuchte und Risse und hilft Ihnen dabei.",
      },
      {
        q: "Muss für die Sanierung der Garten aufgegraben werden?",
        a: "Nein. Horizontalsperre, Rissverpressung und Innenabdichtung führen wir von innen aus. Garten, Einfahrt und Terrasse bleiben unberührt.",
      },
      {
        q: "Werden die Keller in Bottrop nach dem Ende des Bergbaus nasser?",
        a: "In den abgesenkten Gebieten wird das Grundwasser weiter abgepumpt, das ist eine Daueraufgabe. Wo sich der Wasserstand trotzdem ändert oder neue Risse entstehen, kann ein bisher trockener Keller feucht werden. Die Messung zeigt, ob das bei Ihnen der Fall ist.",
      },
      {
        q: "Wie schnell sind Sie in Bottrop vor Ort?",
        a: "Von unserem Sitz in Essen in der Regel innerhalb von 24 bis 48 Stunden, auch in Kirchhellen und Grafenwald. Die Feuchtemessung ist kostenlos und unverbindlich.",
      },
      {
        q: "Was kostet die Kellersanierung in Bottrop?",
        a: "Das hängt von Ursache, Wandfläche, Mauerwerk und Rissen ab. Nach der kostenlosen Messung bekommen Sie einen verbindlichen Festpreis.",
      },
    ],
    nearby: ["gelsenkirchen", "oberhausen", "essen"],
  },
];

