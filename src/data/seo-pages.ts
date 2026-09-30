export interface PageSection { heading: string; paragraphs: string[]; bullets?: string[] }
export interface Faq { q: string; a: string }
export interface LayerNote { name: string; text: string }

export interface ServicePage {
  slug: string;
  navTitle: string;
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
}

export const SERVICE_PAGES: ServicePage[] = [
  // 1. Kellersanierung
  {
    slug: "kellersanierung",
    navTitle: "Kellersanierung",
    keyword: "Keller trockenlegen",
    title: "Keller trockenlegen ohne Aufgraben | Kellersanierung",
    metaDescription:
      "Keller trockenlegen ohne Aufgraben: Ursache messen, von innen sanieren, verbindliches Angebot, 10 Jahre Garantie auf die Arbeit. Messung kostenlos.",
    h1: "Keller trockenlegen: nasse Keller dauerhaft sanieren, ohne Aufgraben",
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
          "Bis zu 25 Jahre Produktgarantie des Herstellers SchimmelPeter GmbH",
          "10 Jahre Garantie von sos-abdichtung auf die ausgeführten Arbeiten",
        ],
      },
      {
        heading: "Nach Wasserschaden oder Starkregen: erst messen, dann trocknen",
        paragraphs: [
          "Läuft der Keller nach einem Rohrbruch oder einem Starkregen voll, stehen zuerst Abpumpen und Ausräumen an. Danach kommt die eigentliche Frage: Ist die Wand nur oberflächlich nass geworden und trocknet mit guter Lüftung und technischer Trocknung wieder ab, oder hat das Ereignis einen Schaden sichtbar gemacht, der schon lange bestand? Diese Unterscheidung treffen wir mit der Feuchtemessung vor Ort, bevor Geld in Trocknungsgeräte oder neuen Putz fließt.",
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
        q: "Was kostet eine Kellersanierung in Wuppertal?",
        a: "Die Kosten richten sich nach Wandbaustoff, Mauerstärke, Länge der betroffenen Wände und Durchfeuchtungsgrad. Pauschale Meterpreise wären unseriös, weil ein Bruchsteinkeller in Barmen anders zu behandeln ist als ein Betonkeller aus den Siebzigerjahren. Nach der kostenlosen Messung erhalten Sie ein verbindliches Festpreisangebot.",
      },
    ],
    related: ["horizontalsperre", "kellerinnenabdichtung", "feuchtemessung"],
  },

  // 2. Horizontalsperre
  {
    slug: "horizontalsperre",
    navTitle: "Horizontalsperre",
    keyword: "Feuchte Wände trockenlegen",
    title: "Feuchte Wände trockenlegen | Horizontalsperre Wuppertal",
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
        heading: "So wirkt die SchimmelPeter-Injektion",
        paragraphs: [
          "Als SchimmelPeter® Partnerbetrieb erneuern wir defekte Horizontalsperren ohne aufwendige Erdarbeiten. Dazu setzen wir im feuchten Mauerwerk eine Reihe von Bohrlöchern im Abstand von bis zu 20 cm. In diese Bohrlöcher bringen wir eine genau berechnete Menge Injektionsmittel ein. Der Wirkstoff ist ein in Paraffin gelöster Kunststoff, der sich im Mauerwerk wie ein flüssiger Schutzschild verhält. Wie viel Material eine Wand braucht, ermitteln wir vorher bei der Schadensanalyse, denn Baustoff, Wandstärke und Durchfeuchtung unterscheiden sich von Haus zu Haus.",
          "Im Mauerwerk verteilt sich das Mittel vollständig innerhalb der Injektionszone. Dort verbindet es sich als hydrophobes, also wasserabweisendes Polymer mit den Kapillarwänden des Baustoffs. So entsteht eine neue, wasserabweisende Sperrschicht, an der das von unten aufsteigende Wasser nicht mehr vorbeikommt. Die aufsteigende Feuchtigkeit wird zuverlässig gestoppt, und das Mauerwerk oberhalb der Sperre erhält keinen Nachschub mehr. Für Sie bedeutet das: kein Bagger vor dem Haus, keine aufgerissenen Beete und keine Arbeiten auf dem Grundstück des Nachbarn.",
          "Anders als Verfahren, die die Poren verstopfen, lässt die SchimmelPeter-Injektion die Wand atmungsaktiv. Die wirksame Polymerschicht ist nur wenige Moleküle dick und kleidet die Kapillaren lediglich aus, statt sie zu füllen. Flüssiges Wasser wird an der Sperrschicht zurückgehalten, Wasserdampf kann dagegen weiterhin durch das diffusionsfähige Mauerwerk wandern. So entweicht die Feuchte, die bereits in der Wand steckt, nach und nach, und mit ihr verdunstet das Paraffinöl, das als Träger gedient hat. Zurück bleibt eine trockene Wand, die ihre natürliche Wärmedämmfähigkeit wiedergewinnt.",
        ],
        bullets: [
          "Keine aufwendigen Erdarbeiten rund um das Haus",
          "Bohrlöcher im Abstand von bis zu 20 cm",
          "Vortrocknung in der Regel nicht notwendig",
          "Bis zu 25 Jahre Produktgarantie des Herstellers SchimmelPeter GmbH",
          "10 Jahre Garantie von sos-abdichtung auf die ausgeführten Arbeiten",
        ],
      },
      {
        heading: "Keine Vortrocknung und was nach der Injektion passiert",
        paragraphs: [
          "Viele Eigentümer rechnen damit, dass eine nasse Wand erst wochenlang getrocknet werden muss, bevor die eigentliche Sanierung beginnt. Bei der SchimmelPeter-Injektion ist eine Vortrocknung in der Regel nicht notwendig. Das Verfahren wirkt auch in stark durchfeuchtetem Mauerwerk mit einem Durchfeuchtungsgrad von über 90 %. Gerade in den alten Bruchstein- und Ziegelkellern im Bergischen Land, die oft seit Jahrzehnten nass sind, ist das ein großer Vorteil. Die Injektion kann direkt nach der gemeinsamen Planung erfolgen, ohne Trocknungsgeräte als Vorstufe.",
          "Die Horizontalsperre stoppt den Nachschub, das Wasser in der Wand verschwindet aber nicht über Nacht. Das Mauerwerk oberhalb der Sperre trocknet über Monate aus, je nach Wandstärke und Baustoff unterschiedlich schnell. In dieser Zeit darf die Oberfläche nicht mit dichten Materialien wie Dispersionsfarbe oder Zementputz verschlossen werden. Den alten, versalzenen Putz ersetzen wir deshalb durch ein Sanierputzsystem, das Salze einlagert und Wasserdampf entweichen lässt. Oft ist eine Kombination sinnvoll, etwa mit einer Innenabdichtung an erdberührten Wänden.",
          "Ausgeführt wird die Injektion von Mitarbeitern, die in den Schulungszentren von SchimmelPeter ausgebildet wurden und mehrmals im Jahr an Schulungen teilnehmen, um auf dem aktuellen Stand zu bleiben. Für die Wirksamkeit des Produkts gibt es bis zu 25 Jahre Produktgarantie des Herstellers SchimmelPeter GmbH. Unabhängig davon übernimmt sos-abdichtung 10 Jahre Garantie auf die ausgeführten Arbeiten. Beide Zusagen stehen nebeneinander und decken unterschiedliche Dinge ab: die eine das Produkt, die andere die handwerkliche Ausführung bei Ihnen vor Ort.",
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
        a: "Sie erhalten zwei getrennte Zusagen. Auf die Wirksamkeit des Produkts gibt es bis zu 25 Jahre Produktgarantie des Herstellers SchimmelPeter GmbH. Zusätzlich gibt sos-abdichtung 10 Jahre Garantie auf die ausgeführten Arbeiten.",
      },
    ],
    related: ["kellersanierung", "kellerinnenabdichtung", "feuchtemessung"],
  },

  // 3. Kellerinnenabdichtung
  {
    slug: "kellerinnenabdichtung",
    navTitle: "Kellerinnenabdichtung",
    keyword: "Keller von innen abdichten",
    title: "Keller von innen abdichten | Innenabdichtung Wuppertal",
    metaDescription:
      "Keller von innen abdichten statt aufgraben: Hohlkehle, mineralische Dichtungsschlämme und Sanierputz, auch gegen drückendes Wasser. Festpreis.",
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
        heading: "Wann eine Innenabdichtung die richtige Wahl ist",
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
    ],
    related: ["kellersanierung", "horizontalsperre", "rissverpressung"],
  },

  // 4. Schimmelbeseitigung
  {
    slug: "schimmelbeseitigung",
    navTitle: "Schimmelbeseitigung",
    keyword: "Schimmelbeseitigung Wuppertal",
    title: "Schimmelbeseitigung Wuppertal | Ursache finden & beheben",
    metaDescription:
      "Schimmelbeseitigung Wuppertal: Ursachenanalyse per Messung, sporensichere Entfernung ohne Chlor und Calciumsilikat gegen Kondensat.",
    h1: "Schimmelbeseitigung Wuppertal: erst die Ursache, dann der Schimmel",
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
        heading: "Warum wir immer mit der Ursache anfangen",
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
        heading: "Calciumsilikat gegen Kondensat an kalten Wänden",
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
    ],
    related: ["feuchtemessung", "kellersanierung", "horizontalsperre"],
  },

  // 5. Feuchtemessung
  {
    slug: "feuchtemessung",
    navTitle: "Feuchtemessung & Gutachten",
    keyword: "Feuchtemessung & Schimmel-Gutachten",
    title: "Feuchtemessung & Schimmel-Gutachten | Wuppertal",
    metaDescription:
      "Feuchtemessung & Schimmel-Gutachten im Raum Wuppertal: kapillare und hygroskopische Feuchte, Taupunkt, Salze. Kostenlose Erstmessung vor Ort.",
    h1: "Feuchtemessung & Schimmel-Gutachten: wissen, woher die Nässe kommt",
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
    navTitle: "Rissverpressung",
    keyword: "Rissverpressung Keller",
    title: "Rissverpressung Keller | Wasserführende Risse abdichten",
    metaDescription:
      "Rissverpressung Keller: wasserführende Risse in Beton und Mauerwerk mit PU-Harz oder Epoxid dauerhaft schließen, auch in WU-Beton. Raum Wuppertal.",
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
];

export const CITY_PAGES: CityPage[] = [
  // Wuppertal
  {
    slug: "wuppertal",
    name: "Wuppertal",
    keyword: "Feuchter Keller Wuppertal",
    title: "Feuchter Keller Wuppertal | Von Vohwinkel bis Beyenburg",
    metaDescription:
      "Feuchter Keller Wuppertal: Hangwasser, Bruchsteinkeller und Gründerzeit-Altbauten trockenlegen. Vor Ort in 24 Stunden, Messung kostenlos.",
    h1: "Feuchter Keller Wuppertal: so wird er trocken, auch in Hanglage",
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
        a: "Auf die Wirksamkeit des Injektionsmittels gibt es bis zu 25 Jahre Produktgarantie des Herstellers SchimmelPeter GmbH. Unabhängig davon gibt sos-abdichtung 10 Jahre Garantie auf die ausgeführten Arbeiten.",
      },
    ],
    nearby: ["remscheid", "solingen", "wuppertal"],
  },
];
