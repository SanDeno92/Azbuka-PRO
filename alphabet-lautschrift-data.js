/* ============================================================
   Azbuka PRO – Lautschrift fürs Alphabet
   ------------------------------------------------------------
   Ersetzt auf den Alphabet-Karten die alte Aussprache-Angabe
   durch die Lautschrift aus dem Reise-Sprachführer.

   NICHT angetastet werden:
   - der russische Buchstabenname (бэ, вэ, эль ...)
   - die Beispiele auf der Kartenrückseite

   Aufbau eines Eintrags:
   {
     char:    "Б",              // Grossbuchstabe (Schluessel, Pflicht)
     laut:    "b",              // Lautschrift  -> steht in der gruenen Pille
     hinweis: "wie das g in Etage"  // Besonderheit (optional, kleine Zeile)
   }

   Mehrere Lautwerte einfach mit Semikolon schreiben, z.B.
   laut: "o; a".
   ============================================================ */

window.AZBUKA_LAUTSCHRIFT = [

  { char: "А", laut: "a", hinweis: "Wie a in Apfel" },
  { char: "Б", laut: "b", hinweis: "wie b in Ball" },
  { char: "В", laut: "w" },
  { char: "Г", laut: "g" },
  { char: "Д", laut: "d" },
  {
    char: "Е", laut: "e; je",
    hinweis: "betont wie e; unbetont eher wie i; am Wortanfang, nach Vokal und nach ь wie je"
  },
  { char: "Ё", laut: "jo", hinweis: "immer betont" },
  { char: "Ж", laut: "zh", hinweis: "wie das g in Etage" },
  { char: "З", laut: "s", hinweis: "stimmhaftes s wie in Rose" },
  { char: "И", laut: "i", hinweis: "nach ж, щ, ц: ein Laut zwischen i und ü" },
  { char: "Й", laut: "j" },
  { char: "К", laut: "k" },
  {
    char: "Л", laut: "l",
    hinweis: "wie im englischen love; vor е, ё, и, ю, я und ь weicher als im Deutschen"
  },
  { char: "М", laut: "m" },
  { char: "Н", laut: "n" },
  {
    char: "О", laut: "o; a",
    hinweis: "betont wie o in offen, aber etwas länger; unbetont oder am Wortanfang wie a"
  },
  { char: "П", laut: "p" },
  { char: "Р", laut: "r", hinweis: "Zungenspitzen-r" },
  { char: "С", laut: "ß" },
  { char: "Т", laut: "t" },
  { char: "У", laut: "u", hinweis: "wie u in Mut, aber kürzer" },
  { char: "Ф", laut: "f" },
  {
    char: "Х", laut: "ch",
    hinweis: "wie ch in Nacht; vor е, ё, и, ю, я und ь wie ch in nicht"
  },
  { char: "Ц", laut: "tz", hinweis: "wie z in Zahn" },
  { char: "Ч", laut: "tsch", hinweis: "wie tsch in tschüs" },
  { char: "Ш", laut: "sch", hinweis: "wie sch in Schule" },
  { char: "Щ", laut: "schj", hinweis: "langes sch" },
  {
    char: "Ъ", laut: "–",
    hinweis: "nie am Wortanfang; das Härtezeichen hat keinen Lautwert"
  },
  { char: "Ы", laut: "y", hinweis: "nie am Wortanfang; ein Laut zwischen i und ü" },
  {
    char: "Ь", laut: "–",
    hinweis: "nie am Wortanfang; das Weichheitszeichen hat keinen Lautwert"
  },
  { char: "Э", laut: "ä; e", hinweis: "ä vor hartem, e vor weichem Konsonant" },
  { char: "Ю", laut: "ju" },
  { char: "Я", laut: "ja;", hinweis: "ja betont, jj bzw. i unbetont" },

];
