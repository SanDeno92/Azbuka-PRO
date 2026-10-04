/* ============================================================
   Azbuka PRO – Aufgaben-Daten (Stage → Level → Übungen)
   ------------------------------------------------------------
   HIER trägst du neue Inhalte ein. Sonst nichts.

   AUFBAU
   ------------------------------------------------------------
   Stage (Kapitel)
     └ Level (Thema)
         └ Übung (ein Satz / ein Wort)

   {
     id: "gespraech",                  // eindeutig, NICHT nachträglich
                                       // ändern (haengt am Fortschritt)
     titel: "Ins Gespräch kommen",
     levels: [
       {
         id: "gespraech-verstaendigung",
         titel: "Verständigung",
         uebungen: [
           { de: "Sprechen Sie Russisch?",
             ru: "Вы говорите по-русски?",
             pron: "Wy gawaritje pa-russki?" }
         ]
       }
     ]
   }

   Eine Übung braucht nur drei Felder:
     de   – deutscher Satz
     ru   – russischer Satz
     pron – Aussprache (wird nach dem Lösen angezeigt)

   SCHWIERIGKEIT UND ÜBUNGSFORMEN
   ------------------------------------------------------------
   Darum musst du dich NICHT kümmern – die App regelt das.

   Die Stufe 1-4 ergibt sich aus der STAGE: Stage 1 ist Stufe 1,
   Stage 2 ist Stufe 2 und so weiter. Innerhalb einer Stage
   steigt es in der zweiten Hälfte der Level um eine Stufe.
   Stage 1 bleibt also leicht, auch mit 20 oder 30 Leveln.

   Die Schwierigkeit bestimmt, welche Übungsformen vorkommen:

     1 Einsteiger       wählen, Lautschrift zuordnen, Paare
     2 Aufbau           + Satz bauen, Lücke wählen, Buchstaben
     3 Fortgeschritten  + Lücke tippen, kein leichtes Wählen mehr
     4 Profi            Satz bauen, Lücke tippen, selbst schreiben

   Innerhalb eines Levels wechselt die Form von Aufgabe zu
   Aufgabe durch, damit es nicht monoton wird. Passt eine Form
   nicht zum Satz (z.B. Buchstabensalat bei einem langen Satz),
   wird sie für diese Aufgabe übersprungen.

   Damit die Vielfalt greift, lohnen sich Level mit 4-15
   Übungen. Pro Stage sind beliebig viele Level möglich.

   Ein Level ist geschafft, wenn alle Übungen darin richtig
   beantwortet wurden. Sterne gibt es nach Anteil: ab einem
   Drittel 1 Stern, ab zwei Dritteln 2 Sterne, komplett 3 Sterne.
   ============================================================ */

window.AZBUKA_AUFGABEN = [

  /* ==========================================================
     STAGE 1
     ========================================================== */
  {
    id: "einfuehrung",
    titel: "Einführung",
    text: "Die ersten Wörter, die du in jedem Satz brauchst.",
    levels: [
      {
        id: "einf-pronomen",
        titel: "Ich, du, er, sie …",
        uebungen: [
          { de: "ich", ru: "я", pron: "ja" },
          { de: "du", ru: "ты", pron: "ty" },
          { de: "er", ru: "он", pron: "on" },
          { de: "sie", ru: "она", pron: "ana" },
          { de: "es", ru: "оно", pron: "ano" },
          { de: "wir", ru: "мы", pron: "my" },
          { de: "ihr / Sie", ru: "вы", pron: "wy" },
          { de: "sie (Mehrzahl)", ru: "они", pron: "ani" },
          { de: "mich", ru: "меня", pron: "minja" },
          { de: "dich", ru: "тебя", pron: "tibja" },
          { de: "ihn", ru: "его", pron: "jewo" },
          { de: "sie (Akk)", ru: "её", pron: "jejjo" },
          { de: "uns", ru: "нас", pron: "nas" },
          { de: "euch", ru: "вас", pron: "was" },
          { de: "sie (Mz Akk)", ru: "их", pron: "ich" },
          { de: "mir", ru: "мне", pron: "mnje" },
          { de: "dir", ru: "тебе", pron: "tibje" },
          { de: "ihm", ru: "ему", pron: "jemu" },
          { de: "ihr (Dat)", ru: "ей", pron: "jej" },
          { de: "uns (Dat)", ru: "нам", pron: "nam" },
          { de: "euch (Dat)", ru: "вам", pron: "wam" },
          { de: "ihnen", ru: "им", pron: "im" }
        ]
      },
      {
        id: "einf-janein",
        titel: "Ja, nein, bitte, danke",
        uebungen: [
          { de: "ja", ru: "да", pron: "da" },
          { de: "nein", ru: "нет", pron: "njet" },
          { de: "bitte", ru: "пожалуйста", pron: "paschalusta" },
          { de: "danke", ru: "спасибо", pron: "ßpaßiba" },
          { de: "Entschuldigung", ru: "извините", pron: "iswinitje" },
          { de: "gut", ru: "хорошо", pron: "charascho" },
          { de: "ja, klar", ru: "да, конечно", pron: "da, kanjeschna" },
          { de: "nein, danke", ru: "нет, спасибо", pron: "njet, ßpaßiba" },
          { de: "ja, bitte", ru: "да, пожалуйста", pron: "da, paschalusta" },
          { de: "bitte sehr", ru: "пожалуйста", pron: "paschalusta" },
          { de: "danke sehr", ru: "большое спасибо", pron: "balschoje ßpaßiba" },
          { de: "vielen Dank", ru: "большое спасибо", pron: "balschoje ßpaßiba" },
          { de: "gern geschehen", ru: "пожалуйста", pron: "paschalusta" },
          { de: "doch", ru: "да нет же", pron: "da njet sche" },
          { de: "natürlich", ru: "конечно", pron: "kanjeschna" },
          { de: "klar", ru: "конечно", pron: "kanjeschna" },
          { de: "kein Problem", ru: "без проблем", pron: "bjes prablem" },
          { de: "okay", ru: "ладно", pron: "ladna" },
          { de: "sehr gut", ru: "очень хорошо", pron: "otschin charascho" },
          { de: "nicht gut", ru: "нехорошо", pron: "nicharascho" }
        ]
      },
      {
        id: "einf-hallo",
        titel: "Hallo und tschüss",
        uebungen: [
          { de: "hallo", ru: "привет", pron: "priwjet" },
          { de: "guten Tag", ru: "здравствуйте", pron: "sdrastwujtje" },
          { de: "tschüss", ru: "пока", pron: "paka" },
          { de: "guten Morgen", ru: "доброе утро", pron: "dobraje utra" },
          { de: "guten Abend", ru: "добрый вечер", pron: "dobry wjetschir" },
          { de: "gute Nacht", ru: "спокойной ночи", pron: "ßpakojnaj notschi" },
          { de: "hi", ru: "привет", pron: "priwjet" },
          { de: "hey", ru: "эй", pron: "ej" },
          { de: "hallo zusammen", ru: "всем привет", pron: "fßjem priwjet" },
          { de: "Morgen!", ru: "Доброе утро!", pron: "Dobraje utra!" },
          { de: "Abend!", ru: "Добрый вечер!", pron: "Dobry wjetschir!" },
          { de: "Nacht!", ru: "Спокойной ночи!", pron: "Spakojnaj notschi!" },
          { de: "tschüssi", ru: "пока-пока", pron: "paka-paka" },
          { de: "hallo, hallo", ru: "привет-привет", pron: "priwjet-priwjet" },
          { de: "guten Tag noch", ru: "добрый день", pron: "dobry djen" },
          { de: "guten Tag!", ru: "здравствуй", pron: "sdrastwuj" },
          { de: "guten Tag (zu du)", ru: "привет", pron: "priwjet" },
          { de: "hallo du", ru: "привет", pron: "priwjet" },
          { de: "Hallo, wie geht's?", ru: "Привет, как дела?", pron: "Priwjet, kak dila?" },
          { de: "Tschüss, bis dann", ru: "Пока, до встречи", pron: "Paka, da fstrjetschi" }
        ]
      },
      {
        id: "einf-ja-nein-satz",
        titel: "Ja, das stimmt",
        uebungen: [
          { de: "Ja, bitte.", ru: "Да, пожалуйста.", pron: "Da, paschalusta." },
          { de: "Nein, danke.", ru: "Нет, спасибо.", pron: "Njet, ßpaßiba." },
          { de: "Ja, gut.", ru: "Да, хорошо.", pron: "Da, charascho." },
          { de: "Nein, nicht gut.", ru: "Нет, нехорошо.", pron: "Njet, nicharascho." },
          { de: "vielleicht", ru: "может быть", pron: "moschit byt" },
          { de: "natürlich", ru: "конечно", pron: "kanjeschna" },
          { de: "ja", ru: "да", pron: "da" },
          { de: "nein", ru: "нет", pron: "njet" },
          { de: "gut", ru: "хорошо", pron: "charascho" },
          { de: "schlecht", ru: "плохо", pron: "plocha" },
          { de: "richtig", ru: "правильно", pron: "prawilna" },
          { de: "falsch", ru: "неправильно", pron: "neprawilna" },
          { de: "genau", ru: "точно", pron: "totschna" },
          { de: "klar", ru: "ясно", pron: "jasna" },
          { de: "okay", ru: "хорошо", pron: "charascho" },
          { de: "gerne", ru: "с удовольствием", pron: "s udawolstwije" },
          { de: "stimmt", ru: "верно", pron: "werno" },
          { de: "möglich", ru: "возможно", pron: "wasmoschna" },
          { de: "sicher", ru: "конечно", pron: "kanjeschna" },
          { de: "wirklich", ru: "действительно", pron: "dejstwitelna" }
        ]
      },
      {
        id: "einf-hoeflich",
        titel: "Höflich sein",
        uebungen: [
          { de: "Vielen Dank!", ru: "Большое спасибо!", pron: "Balschoje ßpaßiba!" },
          { de: "Bitte sehr.", ru: "Пожалуйста.", pron: "Paschalusta." },
          { de: "Entschuldigen Sie.", ru: "Извините.", pron: "Iswinitje." },
          { de: "Tut mir leid.", ru: "Простите.", pron: "Praßtitje." },
          { de: "Kein Problem.", ru: "Ничего.", pron: "Nitschiwo." },
          { de: "Sehr angenehm.", ru: "Очень приятно.", pron: "Otschin prijatna." },
          { de: "Danke.", ru: "Спасибо.", pron: "ßpaßiba." },
          { de: "Danke schön.", ru: "Спасибо большое.", pron: "ßpaßiba balschoje." },
          { de: "Bitte.", ru: "Пожалуйста.", pron: "Paschalusta." },
          { de: "Gern.", ru: "С удовольствием.", pron: "S udawolstwije." },
          { de: "Verzeihung.", ru: "Извините.", pron: "Iswinitje." },
          { de: "Entschuldige.", ru: "Извини.", pron: "Iswini." },
          { de: "Verzeih mir.", ru: "Прости меня.", pron: "Praßti minja." },
          { de: "Alles gut.", ru: "Всё хорошо.", pron: "Wßjo charascho." },
          { de: "Kein Problem.", ru: "Без проблем.", pron: "Bes problem." },
          { de: "Sehr nett.", ru: "Очень мило.", pron: "Otschin mila." },
          { de: "Angenehm.", ru: "Приятно.", pron: "Prijatna." },
          { de: "Danke sehr.", ru: "Большое спасибо.", pron: "Balschoje ßpaßiba." },
          { de: "Bitte warten.", ru: "Подождите, пожалуйста.", pron: "Padashdite, paschalusta." },
          { de: "Hilfe, bitte.", ru: "Помогите, пожалуйста.", pron: "Pamagite, paschalusta." }
        ]
      },
      {
        id: "einf-frageworte",
        titel: "Wer, was, wo",
        uebungen: [
          { de: "wer", ru: "кто", pron: "kto" },
          { de: "was", ru: "что", pron: "schto" },
          { de: "wo", ru: "где", pron: "gdje" },
          { de: "wann", ru: "когда", pron: "kagda" },
          { de: "wie", ru: "как", pron: "kak" },
          { de: "warum", ru: "почему", pron: "patschimu" },
          { de: "wohin", ru: "куда", pron: "kuda" },
          { de: "woher", ru: "откуда", pron: "atkuda" },
          { de: "welcher", ru: "какой", pron: "kakoj" },
          { de: "welche", ru: "какая", pron: "kakaja" },
          { de: "welches", ru: "какое", pron: "kakoje" },
          { de: "wie viel", ru: "сколько", pron: "skolka" },
          { de: "wie oft", ru: "как часто", pron: "kak tschasta" },
          { de: "wie lange", ru: "как долго", pron: "kak dolga" },
          { de: "wessen", ru: "чей", pron: "tschej" },
          { de: "mit wem", ru: "с кем", pron: "s kem" },
          { de: "für wen", ru: "для кого", pron: "dlja kawo" },
          { de: "wofür", ru: "для чего", pron: "dlja tschewo" },
          { de: "was hier", ru: "что здесь", pron: "schto sdjeß" },
          { de: "wo dort", ru: "где там", pron: "gdje tam" }
        ]
      },
      {
        id: "einf-dasist",
        titel: "Das ist …",
        uebungen: [
          { de: "das", ru: "это", pron: "eta" },
          { de: "Das ist gut.", ru: "Это хорошо.", pron: "Eta charascho." },
          { de: "Was ist das?", ru: "Что это?", pron: "Schto eta?" },
          { de: "Wer ist das?", ru: "Кто это?", pron: "Kto eta?" },
          { de: "Das bin ich.", ru: "Это я.", pron: "Eta ja." },
          { de: "Das ist er.", ru: "Это он.", pron: "Eta on." },
          { de: "Das ist sie.", ru: "Это она.", pron: "Eta ana." },
          { de: "Das ist du.", ru: "Это ты.", pron: "Eta ty." },
          { de: "Das ist wir.", ru: "Это мы.", pron: "Eta my." },
          { de: "Das ist hier.", ru: "Это здесь.", pron: "Eta sdjeß." },
          { de: "Das ist dort.", ru: "Это там.", pron: "Eta tam." },
          { de: "Das ist gut.", ru: "Это хорошо.", pron: "Eta charascho." },
          { de: "Das ist schlecht.", ru: "Это плохо.", pron: "Eta plocha." },
          { de: "Das ist neu.", ru: "Это новое.", pron: "Eta nowoje." },
          { de: "Das ist alt.", ru: "Это старое.", pron: "Eta staroje." },
          { de: "Das ist groß.", ru: "Это большое.", pron: "Eta balshoe." },
          { de: "Das ist klein.", ru: "Это маленькое.", pron: "Eta malenkaje." },
          { de: "Was ist hier?", ru: "Что здесь?", pron: "Schto sdjeß?" },
          { de: "Was ist dort?", ru: "Что там?", pron: "Schto tam?" },
          { de: "Wer ist hier?", ru: "Кто здесь?", pron: "Kto sdjeß?" }
        ]
      },
      {
        id: "einf-hier-dort",
        titel: "Hier und dort",
        uebungen: [
          { de: "hier", ru: "здесь", pron: "sdjeß" },
          { de: "dort", ru: "там", pron: "tam" },
          { de: "links", ru: "налево", pron: "nalewa" },
          { de: "rechts", ru: "направо", pron: "naprawa" },
          { de: "geradeaus", ru: "прямо", pron: "prjama" },
          { de: "Es ist hier.", ru: "Это здесь.", pron: "Eta sdjeß." },
          { de: "Es ist dort.", ru: "Это там.", pron: "Eta tam." },
          { de: "oben", ru: "вверху", pron: "wwerchu" },
          { de: "unten", ru: "внизу", pron: "wnisu" },
          { de: "vorne", ru: "впереди", pron: "wperedi" },
          { de: "hinten", ru: "сзади", pron: "szadi" },
          { de: "neben", ru: "рядом", pron: "rjadom" },
          { de: "gegenüber", ru: "напротив", pron: "naprotiw" },
          { de: "innen", ru: "внутри", pron: "wnutri" },
          { de: "außen", ru: "снаружи", pron: "snarushi" },
          { de: "nah", ru: "близко", pron: "bliska" },
          { de: "weit", ru: "далеко", pron: "daleko" },
          { de: "hier vorne", ru: "здесь впереди", pron: "sdjeß wperedi" },
          { de: "dort hinten", ru: "там сзади", pron: "tam szadi" },
          { de: "hier links", ru: "здесь слева", pron: "sdjeß slewa" }
        ]
      },
      {
        id: "einf-zahlen1",
        titel: "Zahlen 1 bis 5",
        uebungen: [
          { de: "eins", ru: "один", pron: "adin" },
          { de: "zwei", ru: "два", pron: "dwa" },
          { de: "drei", ru: "три", pron: "tri" },
          { de: "vier", ru: "четыре", pron: "tschityri" },
          { de: "fünf", ru: "пять", pron: "pjat" },
          { de: "null", ru: "ноль", pron: "nol" },
          { de: "eins", ru: "раз", pron: "ras" },
          { de: "zwei", ru: "два", pron: "dwa" },
          { de: "drei", ru: "три", pron: "tri" },
          { de: "vier", ru: "четыре", pron: "tschityri" },
          { de: "fünf", ru: "пять", pron: "pjat" },
          { de: "eine", ru: "одна", pron: "adna" },
          { de: "zwei Personen", ru: "два человека", pron: "dwa tscheloweka" },
          { de: "drei Personen", ru: "три человека", pron: "tri tscheloweka" },
          { de: "vier Personen", ru: "четыре человека", pron: "tschityri tscheloweka" },
          { de: "fünf Personen", ru: "пять человек", pron: "pjat tschelowjek" },
          { de: "eins, zwei", ru: "раз, два", pron: "ras, dwa" },
          { de: "eins, zwei, drei", ru: "раз, два, три", pron: "ras, dwa, tri" },
          { de: "vier, fünf", ru: "четыре, пять", pron: "tschityri, pjat" },
          { de: "null, eins", ru: "ноль, один", pron: "nol, adin" }
        ]
      },
      {
        id: "einf-zahlen2",
        titel: "Zahlen 6 bis 10",
        uebungen: [
          { de: "sechs", ru: "шесть", pron: "schest" },
          { de: "sieben", ru: "семь", pron: "ßjem" },
          { de: "acht", ru: "восемь", pron: "woßim" },
          { de: "neun", ru: "девять", pron: "djewit" },
          { de: "zehn", ru: "десять", pron: "djeßit" },
          { de: "viel", ru: "много", pron: "mnoga" },
          { de: "sechs", ru: "шесть", pron: "schest" },
          { de: "sieben", ru: "семь", pron: "ßjem" },
          { de: "acht", ru: "восемь", pron: "woßim" },
          { de: "neun", ru: "девять", pron: "djewit" },
          { de: "zehn", ru: "десять", pron: "djeßit" },
          { de: "sechs Personen", ru: "шесть человек", pron: "schest tschelowjek" },
          { de: "sieben Tage", ru: "семь дней", pron: "ßjem dnej" },
          { de: "acht Tage", ru: "восемь дней", pron: "woßim dnej" },
          { de: "neun Tage", ru: "девять дней", pron: "djewit dnej" },
          { de: "zehn Tage", ru: "десять дней", pron: "djeßit dnej" },
          { de: "sehr viel", ru: "очень много", pron: "otschin mnoga" },
          { de: "wenig", ru: "мало", pron: "mala" },
          { de: "mehr", ru: "больше", pron: "bolsche" },
          { de: "weniger", ru: "меньше", pron: "mensche" }
        ]
      },
      {
        id: "einf-eigenschaften",
        titel: "Klein, groß, alt, neu",
        uebungen: [
          { de: "groß", ru: "большой", pron: "balschoj" },
          { de: "klein", ru: "маленький", pron: "malinki" },
          { de: "alt", ru: "старый", pron: "ßtary" },
          { de: "neu", ru: "новый", pron: "nowy" },
          { de: "schön", ru: "красивый", pron: "kraßiwy" },
          { de: "schlecht", ru: "плохой", pron: "plachoj" },
          { de: "gut", ru: "хороший", pron: "charoschi" },
          { de: "jung", ru: "молодой", pron: "maladoj" },
          { de: "lang", ru: "длинный", pron: "dlinni" },
          { de: "kurz", ru: "короткий", pron: "karotki" },
          { de: "schnell", ru: "быстрый", pron: "bystry" },
          { de: "langsam", ru: "медленный", pron: "medlenni" },
          { de: "leicht", ru: "лёгкий", pron: "ljokki" },
          { de: "schwer", ru: "тяжёлый", pron: "tjascholy" },
          { de: "warm", ru: "тёплый", pron: "tjoply" },
          { de: "kalt", ru: "холодный", pron: "chalodni" },
          { de: "teuer", ru: "дорогой", pron: "daragoj" },
          { de: "billig", ru: "дешёвый", pron: "dischowy" },
          { de: "stark", ru: "сильный", pron: "ßilny" },
          { de: "schwach", ru: "слабый", pron: "ßlaby" }
        ]
      },
      {
        id: "einf-menschen",
        titel: "Mensch, Mann, Frau",
        uebungen: [
          { de: "der Mensch", ru: "человек", pron: "tschilawjek" },
          { de: "der Mann", ru: "мужчина", pron: "muschtschina" },
          { de: "die Frau", ru: "женщина", pron: "schenschtschina" },
          { de: "der Freund", ru: "друг", pron: "drug" },
          { de: "das Kind", ru: "ребёнок", pron: "ribjonak" },
          { de: "die Familie", ru: "семья", pron: "ßimja" },
          { de: "das Mädchen", ru: "девочка", pron: "djewotschka" },
          { de: "der Junge", ru: "мальчик", pron: "maltschik" },
          { de: "die Freundin", ru: "подруга", pron: "padruga" },
          { de: "der Vater", ru: "отец", pron: "atjez" },
          { de: "die Mutter", ru: "мать", pron: "mat" },
          { de: "der Bruder", ru: "брат", pron: "brat" },
          { de: "die Schwester", ru: "сестра", pron: "ßißtra" },
          { de: "der Nachbar", ru: "сосед", pron: "ßaßjed" },
          { de: "die Nachbarin", ru: "соседка", pron: "ßaßjetka" },
          { de: "der Lehrer", ru: "учитель", pron: "utschitel" },
          { de: "die Lehrerin", ru: "учительница", pron: "utschitelniza" },
          { de: "der Schüler", ru: "ученик", pron: "utschenik" },
          { de: "die Schülerin", ru: "ученица", pron: "utscheniza" },
          { de: "die Leute", ru: "люди", pron: "ljudi" }
        ]
      },
      {
        id: "einf-familie",
        titel: "Mama, Papa, Familie",
        uebungen: [
          { de: "die Mama", ru: "мама", pron: "mama" },
          { de: "der Papa", ru: "папа", pron: "papa" },
          { de: "der Sohn", ru: "сын", pron: "ßyn" },
          { de: "die Tochter", ru: "дочь", pron: "dotsch" },
          { de: "der Bruder", ru: "брат", pron: "brat" },
          { de: "die Schwester", ru: "сестра", pron: "ßißtra" },
          { de: "die Eltern", ru: "родители", pron: "raditeli" },
          { de: "der Großvater", ru: "дедушка", pron: "djeduschka" },
          { de: "die Großmutter", ru: "бабушка", pron: "babuscha" },
          { de: "der Onkel", ru: "дядя", pron: "djädja" },
          { de: "die Tante", ru: "тётя", pron: "tjotja" },
          { de: "der Cousin", ru: "двоюродный брат", pron: "dwojurodny brat" },
          { de: "die Cousine", ru: "двоюродная сестра", pron: "dwojurodnaja ßißtra" },
          { de: "der Ehemann", ru: "муж", pron: "musch" },
          { de: "die Ehefrau", ru: "жена", pron: "schena" },
          { de: "das Baby", ru: "малыш", pron: "malysh" },
          { de: "die Kinder", ru: "дети", pron: "djeti" },
          { de: "die Familie", ru: "семья", pron: "ßimja" },
          { de: "die Eltern", ru: "родители", pron: "raditeli" },
          { de: "die Verwandten", ru: "родственники", pron: "radstwenniki" }
        ]
      },
      {
        id: "einf-mein",
        titel: "Mein und dein",
        uebungen: [
          { de: "mein", ru: "мой", pron: "moj" },
          { de: "meine", ru: "моя", pron: "maja" },
          { de: "dein", ru: "твой", pron: "twoj" },
          { de: "unser", ru: "наш", pron: "nasch" },
          { de: "Ihr (höflich)", ru: "ваш", pron: "wasch" },
          { de: "Das ist meine Mama.", ru: "Это моя мама.", pron: "Eta maja mama." },
          { de: "deine", ru: "твоя", pron: "twaja" },
          { de: "unsere", ru: "наша", pron: "nascha" },
          { de: "eure", ru: "ваша", pron: "wascha" },
          { de: "sein", ru: "его", pron: "jewo" },
          { de: "ihr", ru: "её", pron: "jejo" },
          { de: "mein Haus", ru: "мой дом", pron: "moj dom" },
          { de: "meine Mama", ru: "моя мама", pron: "maja mama" },
          { de: "mein Papa", ru: "мой папа", pron: "moj papa" },
          { de: "dein Haus", ru: "твой дом", pron: "twoj dom" },
          { de: "deine Mama", ru: "твоя мама", pron: "twaja mama" },
          { de: "unser Haus", ru: "наш дом", pron: "nasch dom" },
          { de: "unsere Familie", ru: "наша семья", pron: "nascha ßimja" },
          { de: "sein Bruder", ru: "его брат", pron: "jewo brat" },
          { de: "ihre Schwester", ru: "её сестра", pron: "jejo ßißtra" }
        ]
      },
      {
        id: "einf-haben",
        titel: "Ich habe",
        uebungen: [
          { de: "Ich habe.", ru: "У меня есть.", pron: "U minja jest." },
          { de: "Ich habe nicht.", ru: "У меня нет.", pron: "U minja njet." },
          { de: "Hast du?", ru: "У тебя есть?", pron: "U tibja jest?" },
          { de: "Haben Sie?", ru: "У вас есть?", pron: "U waß jest?" },
          { de: "Ich habe Zeit.", ru: "У меня есть время.", pron: "U minja jest wrjemja." },
          { de: "die Zeit", ru: "время", pron: "wrjemja" },
          { de: "Geld", ru: "деньги", pron: "dengi" },
          { de: "ein Haus", ru: "дом", pron: "dom" },
          { de: "ein Auto", ru: "машина", pron: "maschina" },
          { de: "ein Handy", ru: "телефон", pron: "telefon" },
          { de: "Ich habe Geld.", ru: "У меня есть деньги.", pron: "U minja jest dengi." },
          { de: "Ich habe ein Auto.", ru: "У меня есть машина.", pron: "U minja jest maschina." },
          { de: "Ich habe ein Haus.", ru: "У меня есть дом.", pron: "U minja jest dom." },
          { de: "Hast du Geld?", ru: "У тебя есть деньги?", pron: "U tibja jest dengi?" },
          { de: "Hast du ein Auto?", ru: "У тебя есть машина?", pron: "U tibja jest maschina?" },
          { de: "Wir haben Zeit.", ru: "У нас есть время.", pron: "U nas jest wrjemja." },
          { de: "Wir haben Geld.", ru: "У нас есть деньги.", pron: "U nas jest dengi." },
          { de: "kein Geld", ru: "нет денег", pron: "njet deneg" },
          { de: "keine Zeit", ru: "нет времени", pron: "njet wremeni" },
          { de: "Was hast du?", ru: "Что у тебя есть?", pron: "Schto u tibja jest?" }
        ]
      },
      {
        id: "einf-sein",
        titel: "Ich bin, du bist",
        uebungen: [
          { de: "Ich bin zu Hause.", ru: "Я дома.", pron: "Ja doma." },
          { de: "Er ist dort.", ru: "Он там.", pron: "On tam." },
          { de: "Wir sind hier.", ru: "Мы здесь.", pron: "My sdjeß." },
          { de: "Sie ist schön.", ru: "Она красивая.", pron: "Ana kraßiwaja." },
          { de: "zu Hause", ru: "дома", pron: "doma" },
          { de: "das Haus", ru: "дом", pron: "dom" },
          { de: "hier", ru: "здесь", pron: "sdjeß" },
          { de: "dort", ru: "там", pron: "tam" },
          { de: "ich", ru: "я", pron: "ja" },
          { de: "du", ru: "ты", pron: "ty" },
          { de: "er", ru: "он", pron: "on" },
          { de: "sie", ru: "она", pron: "ana" },
          { de: "wir", ru: "мы", pron: "my" },
          { de: "ihr / Sie", ru: "вы", pron: "wy" },
          { de: "Ich bin hier.", ru: "Я здесь.", pron: "Ja sdjeß." },
          { de: "Du bist hier.", ru: "Ты здесь.", pron: "Ty sdjeß." },
          { de: "Er ist hier.", ru: "Он здесь.", pron: "On sdjeß." },
          { de: "Sie ist hier.", ru: "Она здесь.", pron: "Ana sdjeß." },
          { de: "Wir sind hier.", ru: "Мы здесь.", pron: "My sdjeß." },
          { de: "Bist du hier?", ru: "Ты здесь?", pron: "Ty sdjeß?" }
        ]
      },
      {
        id: "einf-nicht",
        titel: "Nicht und kein",
        uebungen: [
          { de: "nicht", ru: "не", pron: "nje" },
          { de: "Ich verstehe nicht.", ru: "Я не понимаю.", pron: "Ja nje panimaju." },
          { de: "Ich weiß nicht.", ru: "Я не знаю.", pron: "Ja nje snaju." },
          { de: "Das ist nicht gut.", ru: "Это нехорошо.", pron: "Eta nicharascho." },
          { de: "Er ist nicht hier.", ru: "Его нет здесь.", pron: "Jewo njet sdjeß." },
          { de: "nie", ru: "никогда", pron: "nikagda" },
          { de: "kein", ru: "нет", pron: "njet" },
          { de: "keine", ru: "нет", pron: "njet" },
          { de: "nicht hier", ru: "не здесь", pron: "nje sdjeß" },
          { de: "nicht dort", ru: "не там", pron: "nje tam" },
          { de: "nicht gut", ru: "не хорошо", pron: "nje charascho" },
          { de: "nicht schlecht", ru: "не плохо", pron: "nje plocha" },
          { de: "kein Problem", ru: "нет проблем", pron: "njet problem" },
          { de: "kein Geld", ru: "нет денег", pron: "njet deneg" },
          { de: "keine Zeit", ru: "нет времени", pron: "njet wremeni" },
          { de: "noch nicht", ru: "ещё нет", pron: "jescho njet" },
          { de: "nicht jetzt", ru: "не сейчас", pron: "nje ßitschaß" },
          { de: "nicht heute", ru: "не сегодня", pron: "nje ßiwodnja" },
          { de: "nicht morgen", ru: "не завтра", pron: "nje sawtra" },
          { de: "überhaupt nicht", ru: "вовсе нет", pron: "wowße njet" }
        ]
      },
      {
        id: "einf-wiegehts",
        titel: "Wie geht's?",
        uebungen: [
          { de: "Wie geht's?", ru: "Как дела?", pron: "Kak dila?" },
          { de: "Gut, danke.", ru: "Хорошо, спасибо.", pron: "Charascho, ßpaßiba." },
          { de: "Alles gut.", ru: "Всё хорошо.", pron: "Wßjo charascho." },
          { de: "Und du?", ru: "А ты?", pron: "A ty?" },
          { de: "Und Sie?", ru: "А вы?", pron: "A wy?" },
          { de: "So lala.", ru: "Так себе.", pron: "Tak ßibje." },
          { de: "Sehr gut.", ru: "Очень хорошо.", pron: "Otschin charascho." },
          { de: "gut", ru: "хорошо", pron: "charascho" },
          { de: "schlecht", ru: "плохо", pron: "plocha" },
          { de: "normal", ru: "нормально", pron: "normalna" },
          { de: "super", ru: "супер", pron: "ßuper" },
          { de: "prima", ru: "отлично", pron: "atlítschna" },
          { de: "müde", ru: "устал", pron: "ustal" },
          { de: "glücklich", ru: "счастлив", pron: "ßtchastliw" },
          { de: "traurig", ru: "грустно", pron: "grußtna" },
          { de: "okay", ru: "нормально", pron: "normalna" },
          { de: "alles", ru: "всё", pron: "wßjo" },
          { de: "gut so", ru: "хорошо", pron: "charascho" },
          { de: "danke", ru: "спасибо", pron: "ßpaßiba" },
          { de: "sehr gut", ru: "очень хорошо", pron: "otschin charascho" }
        ]
      },
      {
        id: "einf-wochentage",
        titel: "Heute, morgen, gestern",
        uebungen: [
          { de: "heute", ru: "сегодня", pron: "ßiwodnja" },
          { de: "morgen", ru: "завтра", pron: "sawtra" },
          { de: "gestern", ru: "вчера", pron: "ftschira" },
          { de: "jetzt", ru: "сейчас", pron: "ßitschaß" },
          { de: "immer", ru: "всегда", pron: "fßigda" },
          { de: "Bis morgen!", ru: "До завтра!", pron: "Da sawtra!" },
          { de: "heute Morgen", ru: "сегодня утром", pron: "ßiwodnja utrom" },
          { de: "heute Abend", ru: "сегодня вечером", pron: "ßiwodnja wetscherom" },
          { de: "morgen früh", ru: "завтра утром", pron: "sawtra utrom" },
          { de: "gestern Abend", ru: "вчера вечером", pron: "ftschira wetscherom" },
          { de: "bald", ru: "скоро", pron: "skora" },
          { de: "später", ru: "позже", pron: "posche" },
          { de: "früher", ru: "раньше", pron: "ransche" },
          { de: "manchmal", ru: "иногда", pron: "inagda" },
          { de: "oft", ru: "часто", pron: "tschasta" },
          { de: "selten", ru: "редко", pron: "redka" },
          { de: "nie", ru: "никогда", pron: "nikagda" },
          { de: "jeden Tag", ru: "каждый день", pron: "kaschdy djen" },
          { de: "jeden Morgen", ru: "каждое утро", pron: "kaschdaje utro" },
          { de: "Bis später!", ru: "До встречи!", pron: "Da fstrjetschi!" }
        ]
      },
      {
        id: "einf-abschied",
        titel: "Sich verabschieden",
        uebungen: [
          { de: "Auf Wiedersehen!", ru: "До свидания!", pron: "Da ßwidanija!" },
          { de: "Bis bald!", ru: "До скорого!", pron: "Da ßkorawa!" },
          { de: "Gute Reise!", ru: "Счастливого пути!", pron: "Schaßliwawa puti!" },
          { de: "Alles Gute!", ru: "Всего доброго!", pron: "Fßiwo dobrawa!" },
          { de: "Bis später!", ru: "До встречи!", pron: "Da fstrjetschi!" },
          { de: "Tschüss, bis morgen!", ru: "Пока, до завтра!", pron: "Paka, da sawtra!" },
          { de: "Bis morgen!", ru: "До завтра!", pron: "Da sawtra!" },
          { de: "Bis gleich!", ru: "До скорого!", pron: "Da skorawa!" },
          { de: "Bis später!", ru: "До встречи!", pron: "Da fstrjetschi!" },
          { de: "Gute Nacht!", ru: "Спокойной ночи!", pron: "Spakojnaj notschi!" },
          { de: "Schlaf gut!", ru: "Спокойной ночи!", pron: "Spakojnaj notschi!" },
          { de: "Schönen Tag!", ru: "Хорошего дня!", pron: "Charoschewo dnja!" },
          { de: "Schönen Abend!", ru: "Хорошего вечера!", pron: "Charoschewo wetschera!" },
          { de: "Mach's gut!", ru: "Всего хорошего!", pron: "Fßewo charoschewo!" },
          { de: "Pass auf dich auf!", ru: "Береги себя!", pron: "Beregi ßebja!" },
          { de: "Wir sehen uns!", ru: "Увидимся!", pron: "Uwidimßja!" },
          { de: "Bis nächste Woche!", ru: "До следующей недели!", pron: "Da sljedujuschtschej nedeli!" },
          { de: "Gute Fahrt!", ru: "Счастливого пути!", pron: "Schaßliwawa puti!" },
          { de: "Komm gut nach Hause!", ru: "Доберись домой!", pron: "Daberis damoj!" },
          { de: "Tschüss!", ru: "Пока!", pron: "Paka!" }
        ]
      },
      {
        id: "einf-farben",
        titel: "Farben",
        uebungen: [
          { de: "rot", ru: "красный", pron: "kraßny" },
          { de: "blau", ru: "синий", pron: "ßini" },
          { de: "grün", ru: "зелёный", pron: "seljony" },
          { de: "gelb", ru: "жёлтый", pron: "scholty" },
          { de: "schwarz", ru: "чёрный", pron: "tschorny" },
          { de: "weiß", ru: "белый", pron: "bjely" },
          { de: "grau", ru: "серый", pron: "ßery" },
          { de: "braun", ru: "коричневый", pron: "karitschnewy" },
          { de: "rosa", ru: "розовый", pron: "rosowy" },
          { de: "orange", ru: "оранжевый", pron: "aranschewy" },
          { de: "hellblau", ru: "голубой", pron: "galuboj" },
          { de: "dunkel", ru: "тёмный", pron: "tjomny" },
          { de: "hell", ru: "светлый", pron: "ßwetly" },
          { de: "bunt", ru: "цветной", pron: "tzwejnoj" },
          { de: "farbig", ru: "цветной", pron: "tzwejnoj" },
          { de: "die Farbe", ru: "цвет", pron: "tzwet" },
          { de: "welche Farbe?", ru: "какой цвет?", pron: "kakoj tzwet?" },
          { de: "rot und blau", ru: "красный и синий", pron: "kraßny i ßini" },
          { de: "schwarz-weiß", ru: "чёрно-белый", pron: "tschorna-bjely" },
          { de: "Farben", ru: "цвета", pron: "tzweta" },
        ]
      },
      {
        id: "einf-tiere",
        titel: "Tiere",
        uebungen: [
          { de: "der Hund", ru: "собака", pron: "ßabaka" },
          { de: "die Katze", ru: "кошка", pron: "koschka" },
          { de: "der Vogel", ru: "птица", pron: "ptitza" },
          { de: "die Maus", ru: "мышь", pron: "mysch" },
          { de: "der Fisch", ru: "рыба", pron: "ryba" },
          { de: "das Pferd", ru: "лошадь", pron: "loschad" },
          { de: "die Kuh", ru: "корова", pron: "karowa" },
          { de: "das Schwein", ru: "свинья", pron: "ßwinja" },
          { de: "der Bär", ru: "медведь", pron: "medwed" },
          { de: "der Wolf", ru: "волк", pron: "wolk" },
          { de: "der Fuchs", ru: "лиса", pron: "lißa" },
          { de: "der Hase", ru: "заяц", pron: "sajatz" },
          { de: "die Ente", ru: "утка", pron: "utka" },
          { de: "das Huhn", ru: "курица", pron: "kuritza" },
          { de: "Tiere", ru: "животные", pron: "schiwotnyje" },
          { de: "Hund und Katze", ru: "собака и кошка", pron: "ßabaka i koschka" },
          { de: "kleiner Hund", ru: "маленькая собака", pron: "malenkaja ßabaka" },
          { de: "große Katze", ru: "большая кошка", pron: "balschaja koschka" },
          { de: "mein Hund", ru: "моя собака", pron: "maja ßabaka" },
          { de: "dein Tier", ru: "твоё животное", pron: "twojo schiwotnoje" },
        ]
      },
      {
        id: "einf-essen1",
        titel: "Einfaches Essen",
        uebungen: [
          { de: "das Brot", ru: "хлеб", pron: "chljeb" },
          { de: "das Ei", ru: "яйцо", pron: "jajtzo" },
          { de: "die Butter", ru: "масло", pron: "maßlo" },
          { de: "der Käse", ru: "сыр", pron: "ßyr" },
          { de: "die Milch", ru: "молоко", pron: "malako" },
          { de: "das Fleisch", ru: "мясо", pron: "mjaßo" },
          { de: "der Zucker", ru: "сахар", pron: "ßachar" },
          { de: "das Salz", ru: "соль", pron: "ßol" },
          { de: "der Reis", ru: "рис", pron: "riß" },
          { de: "die Nudeln", ru: "макароны", pron: "makarony" },
          { de: "die Suppe", ru: "суп", pron: "ßup" },
          { de: "der Salat", ru: "салат", pron: "ßalat" },
          { de: "Essen", ru: "еда", pron: "jeda" },
          { de: "lecker", ru: "вкусно", pron: "fkußna" },
          { de: "Ich esse", ru: "я ем", pron: "ja jem" },
          { de: "Ich will essen", ru: "я хочу есть", pron: "ja chatschju jeßt" },
          { de: "Brot und Butter", ru: "хлеб и масло", pron: "chljeb i maßlo" },
          { de: "Käse und Brot", ru: "сыр и хлеб", pron: "ßyr i chljeb" },
          { de: "Guten Appetit", ru: "приятного аппетита", pron: "prijatnawa appetita" },
          { de: "Was isst du?", ru: "что ты ешь?", pron: "schto ty jesch?" },
        ]
      },
      {
        id: "einf-getraenke",
        titel: "Getränke",
        uebungen: [
          { de: "das Wasser", ru: "вода", pron: "wada" },
          { de: "der Tee", ru: "чай", pron: "tschaj" },
          { de: "der Kaffee", ru: "кофе", pron: "kofe" },
          { de: "der Saft", ru: "сок", pron: "ßok" },
          { de: "die Cola", ru: "кола", pron: "kola" },
          { de: "das Bier", ru: "пиво", pron: "piwo" },
          { de: "der Wein", ru: "вино", pron: "wino" },
          { de: "Milch", ru: "молоко", pron: "malako" },
          { de: "heißer Tee", ru: "горячий чай", pron: "garjatschi tschaj" },
          { de: "kaltes Wasser", ru: "холодная вода", pron: "chalodnaja wada" },
          { de: "ich trinke", ru: "я пью", pron: "ja pju" },
          { de: "du trinkst", ru: "ты пьёшь", pron: "ty pjosch" },
          { de: "Tee mit Zucker", ru: "чай с сахаром", pron: "tschaj ß ßacharam" },
          { de: "Kaffee mit Milch", ru: "кофе с молоком", pron: "kofe ß malakom" },
          { de: "Wasser bitte", ru: "воду пожалуйста", pron: "wodu paschalusta" },
          { de: "Ich will trinken", ru: "я хочу пить", pron: "ja chatschju pit" },
          { de: "Was trinkst du?", ru: "что ты пьёшь?", pron: "schto ty pjosch?" },
          { de: "Saft und Wasser", ru: "сок и вода", pron: "ßok i wada" },
          { de: "heiß", ru: "горячо", pron: "garjatscho" },
          { de: "kalt", ru: "холодно", pron: "choladna" },
        ]
      },
      {
        id: "einf-zuhause",
        titel: "Zu Hause",
        uebungen: [
          { de: "das Haus", ru: "дом", pron: "dom" },
          { de: "die Wohnung", ru: "квартира", pron: "kwartira" },
          { de: "das Zimmer", ru: "комната", pron: "komnata" },
          { de: "die Tür", ru: "дверь", pron: "dwer" },
          { de: "das Fenster", ru: "окно", pron: "akno" },
          { de: "die Küche", ru: "кухня", pron: "kuchnja" },
          { de: "das Bad", ru: "ванная", pron: "wannaja" },
          { de: "die Toilette", ru: "туалет", pron: "tualet" },
          { de: "der Balkon", ru: "балкон", pron: "balkon" },
          { de: "der Schlüssel", ru: "ключ", pron: "kljutsch" },
          { de: "zu Hause", ru: "дома", pron: "doma" },
          { de: "nach Hause", ru: "домой", pron: "damoj" },
          { de: "mein Haus", ru: "мой дом", pron: "moj dom" },
          { de: "deine Wohnung", ru: "твоя квартира", pron: "twoja kwartira" },
          { de: "großes Haus", ru: "большой дом", pron: "balschoj dom" },
          { de: "kleine Wohnung", ru: "маленькая квартира", pron: "malenkaja kwartira" },
          { de: "hier ist", ru: "здесь", pron: "sdjeß" },
          { de: "dort ist", ru: "там", pron: "tam" },
          { de: "Ich bin zu Hause", ru: "я дома", pron: "ja doma" },
          { de: "Wo ist das Haus?", ru: "где дом?", pron: "gdje dom?" },
        ]
      },
      {
        id: "einf-moebel",
        titel: "Möbel",
        uebungen: [
          { de: "Tisch", ru: "стол", pron: "ßtal" },
          { de: "Stuhl", ru: "стул", pron: "ßtul" },
          { de: "Bett", ru: "кровать", pron: "krawat" },
          { de: "Schrank", ru: "шкаф", pron: "schkaf" },
          { de: "Sofa", ru: "диван", pron: "diwan" },
          { de: "Lampe", ru: "лампа", pron: "lampa" },
          { de: "Teppich", ru: "ковёр", pron: "kawjor" },
          { de: "Spiegel", ru: "зеркало", pron: "serkala" },
          { de: "Regal", ru: "полка", pron: "palka" },
          { de: "Bild", ru: "картина", pron: "kartina" },
          { de: "Kissen", ru: "подушка", pron: "paduschka" },
          { de: "Decke", ru: "одеяло", pron: "adejala" },
          { de: "Tisch und Stuhl", ru: "стол и стул", pron: "ßtal i ßtul" },
          { de: "großer Tisch", ru: "большой стол", pron: "balschaj ßtal" },
          { de: "kleiner Stuhl", ru: "маленький стул", pron: "malenki ßtul" },
          { de: "mein Bett", ru: "моя кровать", pron: "maja krawat" },
          { de: "dein Schrank", ru: "твой шкаф", pron: "twaj schkaf" },
          { de: "neues Sofa", ru: "новый диван", pron: "nawy diwan" },
          { de: "altes Regal", ru: "старая полка", pron: "ßtaraja palka" },
          { de: "wo ist der Tisch?", ru: "где стол?", pron: "gde ßtal?" },
        ]
      },
      {
        id: "einf-kleidung1",
        titel: "Kleidung",
        uebungen: [
          { de: "Hemd", ru: "рубашка", pron: "rubaschka" },
          { de: "Hose", ru: "брюки", pron: "brjuki" },
          { de: "Kleid", ru: "платье", pron: "plate" },
          { de: "Rock", ru: "юбка", pron: "jubka" },
          { de: "Jacke", ru: "куртка", pron: "kurtka" },
          { de: "Mantel", ru: "пальто", pron: "palta" },
          { de: "Schuhe", ru: "обувь", pron: "abuw" },
          { de: "Mütze", ru: "шапка", pron: "schapka" },
          { de: "Handschuhe", ru: "перчатки", pron: "pertschatki" },
          { de: "Schal", ru: "шарф", pron: "scharf" },
          { de: "T-Shirt", ru: "футболка", pron: "futbalka" },
          { de: "Pullover", ru: "свитер", pron: "ßwiter" },
          { de: "Jeans", ru: "джинсы", pron: "dschinßy" },
          { de: "Socken", ru: "носки", pron: "naßki" },
          { de: "Gürtel", ru: "ремень", pron: "remen" },
          { de: "Anzug", ru: "костюм", pron: "kaßtjum" },
          { de: "Krawatte", ru: "галстук", pron: "galßtuk" },
          { de: "Mütze und Schal", ru: "шапка и шарф", pron: "schapka i scharf" },
          { de: "warme Jacke", ru: "тёплая куртка", pron: "tjoplaja kurtka" },
          { de: "neue Schuhe", ru: "новая обувь", pron: "nawaja abuw" },
        ]
      },
      {
        id: "einf-koerper",
        titel: "Körper",
        uebungen: [
          { de: "Kopf", ru: "голова", pron: "galawa" },
          { de: "Auge", ru: "глаз", pron: "glas" },
          { de: "Nase", ru: "нос", pron: "naß" },
          { de: "Mund", ru: "рот", pron: "rat" },
          { de: "Ohr", ru: "ухо", pron: "ucha" },
          { de: "Hand", ru: "рука", pron: "ruka" },
          { de: "Fuß", ru: "нога", pron: "naga" },
          { de: "Arm", ru: "рука", pron: "ruka" },
          { de: "Bein", ru: "нога", pron: "naga" },
          { de: "Rücken", ru: "спина", pron: "ßpina" },
          { de: "Bauch", ru: "живот", pron: "schiwat" },
          { de: "Herz", ru: "сердце", pron: "ßerdtze" },
          { de: "Haar", ru: "волос", pron: "walaß" },
          { de: "Finger", ru: "палец", pron: "paletz" },
          { de: "Knie", ru: "колено", pron: "kalena" },
          { de: "mein Kopf", ru: "моя голова", pron: "maja galawa" },
          { de: "deine Hand", ru: "твоя рука", pron: "twaja ruka" },
          { de: "zwei Augen", ru: "два глаза", pron: "dwa glasa" },
          { de: "große Nase", ru: "большой нос", pron: "balschaj naß" },
          { de: "kalte Hände", ru: "холодные руки", pron: "chaladnye ruki" },
        ]
      },
      {
        id: "einf-wetter",
        titel: "Wetter",
        uebungen: [
          { de: "Sonne", ru: "солнце", pron: "ßalntze" },
          { de: "Regen", ru: "дождь", pron: "daschd" },
          { de: "Schnee", ru: "снег", pron: "ßneg" },
          { de: "Wind", ru: "ветер", pron: "weter" },
          { de: "Wolkig", ru: "облачно", pron: "ablatschna" },
          { de: "Heiß", ru: "жарко", pron: "scharka" },
          { de: "Kalt", ru: "холодно", pron: "choladna" },
          { de: "Warm", ru: "тепло", pron: "tepla" },
          { de: "Kühl", ru: "прохладно", pron: "prachladna" },
          { de: "Es regnet", ru: "идёт дождь", pron: "idjot daschd" },
          { de: "Es schneit", ru: "идёт снег", pron: "idjot ßneg" },
          { de: "Schönes Wetter", ru: "хорошая погода", pron: "charaschaja pagada" },
          { de: "Schlechtes Wetter", ru: "плохая погода", pron: "plachaja pagada" },
          { de: "Wie ist das Wetter?", ru: "какая погода?", pron: "kakaja pagada?" },
          { de: "Es ist kalt", ru: "холодно", pron: "choladna" },
          { de: "Es ist warm", ru: "тепло", pron: "tepla" },
          { de: "Die Sonne scheint", ru: "светит солнце", pron: "ßwetit ßalntze" },
          { de: "starker Wind", ru: "сильный ветер", pron: "ßilny weter" },
          { de: "kein Regen", ru: "нет дождя", pron: "net daschdja" },
          { de: "morgen Regen", ru: "завтра дождь", pron: "sawtra daschd" },
        ]
      },
      {
        id: "einf-jahreszeiten",
        titel: "Jahreszeiten",
        uebungen: [
          { de: "Frühling", ru: "весна", pron: "weßna" },
          { de: "Sommer", ru: "лето", pron: "leta" },
          { de: "Herbst", ru: "осень", pron: "aßen" },
          { de: "Winter", ru: "зима", pron: "sima" },
          { de: "Im Frühling", ru: "весной", pron: "weßnaj" },
          { de: "Im Sommer", ru: "летом", pron: "letam" },
          { de: "Im Herbst", ru: "осенью", pron: "aßenju" },
          { de: "Im Winter", ru: "зимой", pron: "simaj" },
          { de: "warmer Sommer", ru: "тёплое лето", pron: "tjoplae leta" },
          { de: "kalter Winter", ru: "холодная зима", pron: "chaladnaja sima" },
          { de: "schöner Frühling", ru: "красивая весна", pron: "kraßiwaja weßna" },
          { de: "Jahreszeit", ru: "время года", pron: "wremja gada" },
          { de: "vier Jahreszeiten", ru: "четыре времени года", pron: "tschetyre wremeni gada" },
          { de: "es ist Frühling", ru: "сейчас весна", pron: "ßejtschaß weßna" },
          { de: "es ist Sommer", ru: "сейчас лето", pron: "ßejtschaß leta" },
          { de: "es ist Herbst", ru: "сейчас осень", pron: "ßejtschaß aßen" },
          { de: "es ist Winter", ru: "сейчас зима", pron: "ßejtschaß sima" },
          { de: "nächster Sommer", ru: "следующее лето", pron: "ßledujuschee leta" },
          { de: "letzter Winter", ru: "прошлая зима", pron: "praschlaja sima" },
          { de: "ich liebe Sommer", ru: "я люблю лето", pron: "ja ljublju leta" },
        ]
      },
      {
        id: "einf-monate",
        titel: "Monate",
        uebungen: [
          { de: "Januar", ru: "январь", pron: "janwar" },
          { de: "Februar", ru: "февраль", pron: "fewral" },
          { de: "März", ru: "март", pron: "mart" },
          { de: "April", ru: "апрель", pron: "aprel" },
          { de: "Mai", ru: "май", pron: "maj" },
          { de: "Juni", ru: "июнь", pron: "iun" },
          { de: "Juli", ru: "июль", pron: "iul" },
          { de: "August", ru: "август", pron: "awgußt" },
          { de: "September", ru: "сентябрь", pron: "ßentjabr" },
          { de: "Oktober", ru: "октябрь", pron: "aktjabr" },
          { de: "November", ru: "ноябрь", pron: "najabr" },
          { de: "Dezember", ru: "декабрь", pron: "dekabr" },
          { de: "im Januar", ru: "в январе", pron: "w janware" },
          { de: "im Mai", ru: "в мае", pron: "w mae" },
          { de: "im Dezember", ru: "в декабре", pron: "w dekabre" },
          { de: "Monat", ru: "месяц", pron: "meßjatz" },
          { de: "zwölf Monate", ru: "двенадцать месяцев", pron: "dwenadtzat meßjatzew" },
          { de: "nächsten Monat", ru: "в следующем месяце", pron: "w ßledujuschem meßjatze" },
          { de: "letzten Monat", ru: "в прошлом месяце", pron: "w praschlam meßjatze" },
          { de: "diesen Monat", ru: "в этом месяце", pron: "w ätam meßjatze" },
        ]
      },
      {
        id: "einf-uhrzeit",
        titel: "Uhrzeit",
        uebungen: [
          { de: "Uhr", ru: "час", pron: "tschaß" },
          { de: "Stunde", ru: "час", pron: "tschaß" },
          { de: "Minute", ru: "минута", pron: "minuta" },
          { de: "Sekunde", ru: "секунда", pron: "ßekunda" },
          { de: "Zeit", ru: "время", pron: "wremja" },
          { de: "Wie spät ist es?", ru: "который час?", pron: "katary tschaß?" },
          { de: "Es ist ein Uhr", ru: "сейчас час", pron: "ßejtschaß tschaß" },
          { de: "Es ist zwei Uhr", ru: "сейчас два часа", pron: "ßejtschaß dwa tschaßa" },
          { de: "Es ist drei Uhr", ru: "сейчас три часа", pron: "ßejtschaß tri tschaßa" },
          { de: "Es ist halb", ru: "сейчас половина", pron: "ßejtschaß palawina" },
          { de: "Es ist Viertel", ru: "сейчас четверть", pron: "ßejtschaß tschetwert" },
          { de: "morgens", ru: "утром", pron: "utram" },
          { de: "abends", ru: "вечером", pron: "wetscheram" },
          { de: "nachts", ru: "ночью", pron: "natschju" },
          { de: "pünktlich", ru: "вовремя", pron: "wawremja" },
          { de: "früh", ru: "рано", pron: "rana" },
          { de: "spät", ru: "поздно", pron: "pasdna" },
          { de: "jetzt", ru: "сейчас", pron: "ßejtschaß" },
          { de: "gleich", ru: "скоро", pron: "ßkara" },
          { de: "bald", ru: "скоро", pron: "ßkara" },
        ]
      },
      {
        id: "einf-tageszeiten",
        titel: "Tageszeiten",
        uebungen: [
          { de: "Morgen", ru: "утро", pron: "utra" },
          { de: "Vormittag", ru: "утро", pron: "utra" },
          { de: "Mittag", ru: "день", pron: "den" },
          { de: "Nachmittag", ru: "день", pron: "den" },
          { de: "Abend", ru: "вечер", pron: "wetscher" },
          { de: "Nacht", ru: "ночь", pron: "natsch" },
          { de: "Mitternacht", ru: "полночь", pron: "palnatsch" },
          { de: "heute Morgen", ru: "сегодня утром", pron: "ßegadnja utram" },
          { de: "heute Abend", ru: "сегодня вечером", pron: "ßegadnja wetscheram" },
          { de: "gestern Abend", ru: "вчера вечером", pron: "wtschera wetscheram" },
          { de: "morgen früh", ru: "завтра утром", pron: "sawtra utram" },
          { de: "guten Morgen", ru: "доброе утро", pron: "dabrae utra" },
          { de: "guten Abend", ru: "добрый вечер", pron: "dabry wetscher" },
          { de: "gute Nacht", ru: "спокойной ночи", pron: "ßpakajnaj natschi" },
          { de: "am Morgen", ru: "утром", pron: "utram" },
          { de: "am Abend", ru: "вечером", pron: "wetscheram" },
          { de: "in der Nacht", ru: "ночью", pron: "natschju" },
          { de: "jeden Morgen", ru: "каждое утро", pron: "kaschdae utra" },
          { de: "jeden Abend", ru: "каждый вечер", pron: "kaschdy wetscher" },
          { de: "den ganzen Tag", ru: "весь день", pron: "weß den" },
        ]
      },
      {
        id: "einf-einkaufen",
        titel: "Einkaufen",
        uebungen: [
          { de: "Geld", ru: "деньги", pron: "dengi" },
          { de: "Preis", ru: "цена", pron: "tzena" },
          { de: "teuer", ru: "дорого", pron: "daraga" },
          { de: "billig", ru: "дёшево", pron: "djoschewa" },
          { de: "kaufen", ru: "купить", pron: "kupit" },
          { de: "verkaufen", ru: "продать", pron: "pradat" },
          { de: "Geschäft", ru: "магазин", pron: "magasin" },
          { de: "Markt", ru: "рынок", pron: "rynak" },
          { de: "Kasse", ru: "касса", pron: "kaßßa" },
          { de: "Rabatt", ru: "скидка", pron: "ßkidka" },
          { de: "Wie viel kostet das?", ru: "сколько это стоит?", pron: "ßkalka äta ßtait?" },
          { de: "Das ist teuer", ru: "это дорого", pron: "äta daraga" },
          { de: "Das ist billig", ru: "это дёшево", pron: "äta djoschewa" },
          { de: "Ich kaufe", ru: "я покупаю", pron: "ja pakupaju" },
          { de: "Ich will kaufen", ru: "я хочу купить", pron: "ja chatschu kupit" },
          { de: "Wo ist das Geschäft?", ru: "где магазин?", pron: "gde magasin?" },
          { de: "Haben Sie...?", ru: "у вас есть...?", pron: "u waß eßt...?" },
          { de: "Ich suche", ru: "я ищу", pron: "ja ischu" },
          { de: "zu teuer", ru: "слишком дорого", pron: "ßlischkam daraga" },
          { de: "zu billig", ru: "слишком дёшево", pron: "ßlischkam djoschewa" },
        ]
      },
      {
        id: "einf-stadt",
        titel: "In der Stadt",
        uebungen: [
          { de: "Stadt", ru: "город", pron: "garad" },
          { de: "Dorf", ru: "деревня", pron: "derewnja" },
          { de: "Straße", ru: "улица", pron: "ulitza" },
          { de: "Platz", ru: "площадь", pron: "plaschad" },
          { de: "Park", ru: "парк", pron: "park" },
          { de: "Brücke", ru: "мост", pron: "maßt" },
          { de: "Kirche", ru: "церковь", pron: "tzerkaw" },
          { de: "Museum", ru: "музей", pron: "musej" },
          { de: "Theater", ru: "театр", pron: "teatr" },
          { de: "Kino", ru: "кино", pron: "kina" },
          { de: "Schule", ru: "школа", pron: "schkala" },
          { de: "Bank", ru: "банк", pron: "bank" },
          { de: "Post", ru: "почта", pron: "patschta" },
          { de: "Apotheke", ru: "аптека", pron: "apteka" },
          { de: "Supermarkt", ru: "супермаркет", pron: "ßupermarket" },
          { de: "Zentrum", ru: "центр", pron: "tzentr" },
          { de: "in der Stadt", ru: "в городе", pron: "w garade" },
          { de: "große Stadt", ru: "большой город", pron: "balschaj garad" },
          { de: "meine Stadt", ru: "мой город", pron: "maj garad" },
          { de: "Wo ist der Park?", ru: "где парк?", pron: "gde park?" },
        ]
      },
      {
        id: "einf-verben1",
        titel: "Einfache Verben",
        uebungen: [
          { de: "sein", ru: "быть", pron: "byt" },
          { de: "haben", ru: "иметь", pron: "imet" },
          { de: "machen", ru: "делать", pron: "delat" },
          { de: "gehen", ru: "идти", pron: "idti" },
          { de: "kommen", ru: "приходить", pron: "prichadit" },
          { de: "sehen", ru: "видеть", pron: "widet" },
          { de: "hören", ru: "слышать", pron: "ßlyschat" },
          { de: "sprechen", ru: "говорить", pron: "gawarit" },
          { de: "lesen", ru: "читать", pron: "tschitat" },
          { de: "schreiben", ru: "писать", pron: "pißat" },
          { de: "Ich bin", ru: "я", pron: "ja" },
          { de: "Du bist", ru: "ты", pron: "ty" },
          { de: "Ich habe", ru: "у меня есть", pron: "u menja eßt" },
          { de: "Ich mache", ru: "я делаю", pron: "ja delaju" },
          { de: "Ich gehe", ru: "я иду", pron: "ja idu" },
          { de: "Ich komme", ru: "я прихожу", pron: "ja prichaschu" },
          { de: "Ich sehe", ru: "я вижу", pron: "ja wischu" },
          { de: "Ich höre", ru: "я слышу", pron: "ja ßlyschu" },
          { de: "Ich spreche", ru: "я говорю", pron: "ja gawarju" },
          { de: "Ich lese", ru: "я читаю", pron: "ja tschitaju" },
        ]
      },
      {
        id: "einf-verben2",
        titel: "Verben 2",
        uebungen: [
          { de: "wollen", ru: "хотеть", pron: "chatet" },
          { de: "können", ru: "мочь", pron: "matsch" },
          { de: "mögen", ru: "любить", pron: "ljubit" },
          { de: "wissen", ru: "знать", pron: "snat" },
          { de: "denken", ru: "думать", pron: "dumat" },
          { de: "leben", ru: "жить", pron: "schit" },
          { de: "lieben", ru: "любить", pron: "ljubit" },
          { de: "arbeiten", ru: "работать", pron: "rabatat" },
          { de: "spielen", ru: "играть", pron: "igrat" },
          { de: "lernen", ru: "учить", pron: "utschit" },
          { de: "Ich will", ru: "я хочу", pron: "ja chatschu" },
          { de: "Ich kann", ru: "я могу", pron: "ja magu" },
          { de: "Ich mag", ru: "я люблю", pron: "ja ljublju" },
          { de: "Ich weiß", ru: "я знаю", pron: "ja snaju" },
          { de: "Ich denke", ru: "я думаю", pron: "ja dumaju" },
          { de: "Ich lebe", ru: "я живу", pron: "ja schiwu" },
          { de: "Ich liebe", ru: "я люблю", pron: "ja ljublju" },
          { de: "Ich arbeite", ru: "я работаю", pron: "ja rabataju" },
          { de: "Ich spiele", ru: "я играю", pron: "ja igraju" },
          { de: "Ich lerne", ru: "я учу", pron: "ja utschu" },
        ]
      },
      {
        id: "einf-adjektive1",
        titel: "Adjektive",
        uebungen: [
          { de: "gut", ru: "хороший", pron: "charaschi" },
          { de: "schlecht", ru: "плохой", pron: "plachaj" },
          { de: "groß", ru: "большой", pron: "balschaj" },
          { de: "klein", ru: "маленький", pron: "malenki" },
          { de: "neu", ru: "новый", pron: "nawy" },
          { de: "alt", ru: "старый", pron: "ßtary" },
          { de: "schön", ru: "красивый", pron: "kraßiwy" },
          { de: "hässlich", ru: "некрасивый", pron: "nekraßiwy" },
          { de: "jung", ru: "молодой", pron: "maladaj" },
          { de: "schwer", ru: "тяжёлый", pron: "tjaschjoly" },
          { de: "leicht", ru: "лёгкий", pron: "ljogki" },
          { de: "schnell", ru: "быстрый", pron: "byßtry" },
          { de: "langsam", ru: "медленный", pron: "medlenny" },
          { de: "richtig", ru: "правильный", pron: "prawilny" },
          { de: "falsch", ru: "неправильный", pron: "neprawilny" },
          { de: "einfach", ru: "простой", pron: "praßtaj" },
          { de: "schwierig", ru: "сложный", pron: "ßlaschny" },
          { de: "interessant", ru: "интересный", pron: "intereßny" },
          { de: "langweilig", ru: "скучный", pron: "ßkutschny" },
          { de: "nett", ru: "милый", pron: "mily" },
        ]
      },
      {
        id: "einf-gegenteile",
        titel: "Gegenteile",
        uebungen: [
          { de: "groß - klein", ru: "большой - маленький", pron: "balschaj - malenki" },
          { de: "gut - schlecht", ru: "хорошо - плохо", pron: "charascha - placha" },
          { de: "neu - alt", ru: "новый - старый", pron: "nawy - ßtary" },
          { de: "hell - dunkel", ru: "светлый - тёмный", pron: "ßwetly - tjomny" },
          { de: "warm - kalt", ru: "тепло - холодно", pron: "tepla - chaladna" },
          { de: "schnell - langsam", ru: "быстро - медленно", pron: "byßtra - medlenna" },
          { de: "leicht - schwer", ru: "легко - тяжело", pron: "legka - tjaschela" },
          { de: "richtig - falsch", ru: "правильно - неправильно", pron: "prawilna - neprawilna" },
          { de: "viel - wenig", ru: "много - мало", pron: "mnaga - mala" },
          { de: "hier - dort", ru: "здесь - там", pron: "sdeß - tam" },
          { de: "oben - unten", ru: "вверху - внизу", pron: "wwerchu - wnisu" },
          { de: "links - rechts", ru: "слева - справа", pron: "ßlewa - ßprawa" },
          { de: "vorne - hinten", ru: "спереди - сзади", pron: "ßperedi - ßsadi" },
          { de: "ja - nein", ru: "да - нет", pron: "da - net" },
          { de: "Tag - Nacht", ru: "день - ночь", pron: "den - natsch" },
          { de: "Morgen - Abend", ru: "утро - вечер", pron: "utra - wetscher" },
          { de: "früh - spät", ru: "рано - поздно", pron: "rana - pasdna" },
          { de: "teuer - billig", ru: "дорого - дёшево", pron: "daraga - djoschewa" },
          { de: "schön - hässlich", ru: "красиво - некрасиво", pron: "kraßiwa - nekraßiwa" },
          { de: "jung - alt", ru: "молодой - старый", pron: "maladaj - ßtary" },
        ]
      },
      {
        id: "einf-groessen",
        titel: "Größen",
        uebungen: [
          { de: "groß", ru: "большой", pron: "balschaj" },
          { de: "klein", ru: "маленький", pron: "malenki" },
          { de: "riesig", ru: "огромный", pron: "agramny" },
          { de: "winzig", ru: "крошечный", pron: "kraschetschny" },
          { de: "lang", ru: "длинный", pron: "dlinny" },
          { de: "kurz", ru: "короткий", pron: "karatki" },
          { de: "hoch", ru: "высокий", pron: "wyßaki" },
          { de: "niedrig", ru: "низкий", pron: "niski" },
          { de: "breit", ru: "широкий", pron: "schiraki" },
          { de: "schmal", ru: "узкий", pron: "uski" },
          { de: "dick", ru: "толстый", pron: "talßty" },
          { de: "dünn", ru: "тонкий", pron: "tanki" },
          { de: "sehr groß", ru: "очень большой", pron: "atschen balschaj" },
          { de: "sehr klein", ru: "очень маленький", pron: "atschen malenki" },
          { de: "zu groß", ru: "слишком большой", pron: "ßlischkam balschaj" },
          { de: "zu klein", ru: "слишком маленький", pron: "ßlischkam malenki" },
          { de: "großes Haus", ru: "большой дом", pron: "balschoj dom" },
          { de: "kleines Haus", ru: "маленький дом", pron: "malenki dam" },
          { de: "langer Weg", ru: "длинная дорога", pron: "dlinnaja daraga" },
          { de: "kurzer Weg", ru: "короткая дорога", pron: "karatkaja daraga" },
        ]
      },
      {
        id: "einf-positionen",
        titel: "Positionen",
        uebungen: [
          { de: "hier", ru: "здесь", pron: "sdjeß" },
          { de: "dort", ru: "там", pron: "tam" },
          { de: "da", ru: "там", pron: "tam" },
          { de: "oben", ru: "вверху", pron: "wwerchu" },
          { de: "unten", ru: "внизу", pron: "wnisu" },
          { de: "links", ru: "слева", pron: "ßlewa" },
          { de: "rechts", ru: "справа", pron: "ßprawa" },
          { de: "vorne", ru: "спереди", pron: "ßperedi" },
          { de: "hinten", ru: "сзади", pron: "ßsadi" },
          { de: "in der Mitte", ru: "в середине", pron: "w ßeredine" },
          { de: "neben", ru: "рядом", pron: "rjadam" },
          { de: "unter", ru: "под", pron: "pad" },
          { de: "über", ru: "над", pron: "nad" },
          { de: "vor", ru: "перед", pron: "pered" },
          { de: "hinter", ru: "за", pron: "sa" },
          { de: "zwischen", ru: "между", pron: "meschdu" },
          { de: "Wo ist es?", ru: "где это?", pron: "gde äta?" },
          { de: "Es ist hier", ru: "это здесь", pron: "äta sdeß" },
          { de: "Es ist dort", ru: "это там", pron: "äta tam" },
          { de: "Es ist oben", ru: "это наверху", pron: "äta nawerchu" },
        ]
      },
      {
        id: "einf-verkehr",
        titel: "Verkehr",
        uebungen: [
          { de: "Auto", ru: "машина", pron: "maschina" },
          { de: "Bus", ru: "автобус", pron: "awtabuß" },
          { de: "Bahn", ru: "поезд", pron: "paesd" },
          { de: "Zug", ru: "поезд", pron: "paesd" },
          { de: "Flugzeug", ru: "самолёт", pron: "ßamaljot" },
          { de: "Fahrrad", ru: "велосипед", pron: "welaßiped" },
          { de: "Taxi", ru: "такси", pron: "takßi" },
          { de: "Haltestelle", ru: "остановка", pron: "aßtanawka" },
          { de: "Bahnhof", ru: "вокзал", pron: "waksal" },
          { de: "Flughafen", ru: "аэропорт", pron: "aärapart" },
          { de: "Ticket", ru: "билет", pron: "bilet" },
          { de: "Fahrkarte", ru: "билет", pron: "bilet" },
          { de: "Ich fahre", ru: "я еду", pron: "ja edu" },
          { de: "Ich fliege", ru: "я лечу", pron: "ja letschu" },
          { de: "Wo ist der Bus?", ru: "где автобус?", pron: "gde awtabuß?" },
          { de: "Wo ist der Bahnhof?", ru: "где вокзал?", pron: "gde waksal?" },
          { de: "Ich warte", ru: "я жду", pron: "ja schdu" },
          { de: "schnelles Auto", ru: "быстрая машина", pron: "byßtraja maschina" },
          { de: "mein Auto", ru: "моя машина", pron: "maja maschina" },
          { de: "dein Fahrrad", ru: "твой велосипед", pron: "twaj welaßiped" },
        ]
      },
      {
        id: "einf-obst",
        titel: "Obst",
        uebungen: [
          { de: "Apfel", ru: "яблоко", pron: "jablaka" },
          { de: "Birne", ru: "груша", pron: "gruscha" },
          { de: "Banane", ru: "банан", pron: "banan" },
          { de: "Orange", ru: "апельсин", pron: "apelßin" },
          { de: "Zitrone", ru: "лимон", pron: "liman" },
          { de: "Traube", ru: "виноград", pron: "winagrad" },
          { de: "Erdbeere", ru: "клубника", pron: "klubnika" },
          { de: "Kirsche", ru: "вишня", pron: "wischnja" },
          { de: "Pfirsich", ru: "персик", pron: "perßik" },
          { de: "Wassermelone", ru: "арбуз", pron: "arbus" },
          { de: "Obst", ru: "фрукты", pron: "frukty" },
          { de: "leckeres Obst", ru: "вкусные фрукты", pron: "wkußnye frukty" },
          { de: "roter Apfel", ru: "красное яблоко", pron: "kraßnae jablaka" },
          { de: "gelbe Banane", ru: "жёлтый банан", pron: "schjolty banan" },
          { de: "süße Kirsche", ru: "сладкая вишня", pron: "ßladkaja wischnja" },
          { de: "Ich esse Obst", ru: "я ем фрукты", pron: "ja em frukty" },
          { de: "Ich mag Obst", ru: "я люблю фрукты", pron: "ja ljublju frukty" },
          { de: "ein Apfel", ru: "одно яблоко", pron: "adna jablaka" },
          { de: "zwei Äpfel", ru: "два яблока", pron: "dwa jablaka" },
          { de: "Obst und Gemüse", ru: "фрукты и овощи", pron: "frukty i awaschi" },
        ]
      },
      {
        id: "einf-gemuese",
        titel: "Gemüse",
        uebungen: [
          { de: "Tomate", ru: "помидор", pron: "pamidar" },
          { de: "Gurke", ru: "огурец", pron: "aguretz" },
          { de: "Kartoffel", ru: "картошка", pron: "kartaschka" },
          { de: "Karotte", ru: "морковь", pron: "markaw" },
          { de: "Zwiebel", ru: "лук", pron: "luk" },
          { de: "Knoblauch", ru: "чеснок", pron: "tscheßnak" },
          { de: "Kohl", ru: "капуста", pron: "kapußta" },
          { de: "Paprika", ru: "перец", pron: "peretz" },
          { de: "Erbse", ru: "горох", pron: "garach" },
          { de: "Pilz", ru: "гриб", pron: "grib" },
          { de: "Gemüse", ru: "овощи", pron: "awaschi" },
          { de: "frisches Gemüse", ru: "свежие овощи", pron: "ßweschie awaschi" },
          { de: "rote Tomate", ru: "красный помидор", pron: "kraßny pamidar" },
          { de: "grüne Gurke", ru: "зелёный огурец", pron: "seljony aguretz" },
          { de: "Ich esse Gemüse", ru: "я ем овощи", pron: "ja em awaschi" },
          { de: "Ich mag Gemüse", ru: "я люблю овощи", pron: "ja ljublju awaschi" },
          { de: "Tomaten und Gurken", ru: "помидоры и огурцы", pron: "pamidary i agurtzy" },
          { de: "Kartoffeln und Karotten", ru: "картошка и морковь", pron: "kartaschka i markaw" },
          { de: "Was ist das?", ru: "что это?", pron: "tschta äta?" },
          { de: "Das ist Gemüse", ru: "это овощи", pron: "äta awaschi" },
        ]
      },
      {
        id: "einf-berufe",
        titel: "Berufe",
        uebungen: [
          { de: "Arzt", ru: "врач", pron: "wratsch" },
          { de: "Lehrer", ru: "учитель", pron: "utschitel" },
          { de: "Ingenieur", ru: "инженер", pron: "inschener" },
          { de: "Koch", ru: "повар", pron: "pawar" },
          { de: "Fahrer", ru: "водитель", pron: "waditel" },
          { de: "Verkäufer", ru: "продавец", pron: "pradawetz" },
          { de: "Student", ru: "студент", pron: "ßtudent" },
          { de: "Schüler", ru: "ученик", pron: "utschenik" },
          { de: "Polizist", ru: "полицейский", pron: "palitzejßki" },
          { de: "Künstler", ru: "художник", pron: "chudaschnik" },
          { de: "Arbeit", ru: "работа", pron: "rabata" },
          { de: "Beruf", ru: "профессия", pron: "prafeßßia" },
          { de: "Ich bin Arzt", ru: "я врач", pron: "ja wratsch" },
          { de: "Ich bin Lehrer", ru: "я учитель", pron: "ja utschitel" },
          { de: "Wo arbeitest du?", ru: "где ты работаешь?", pron: "gde ty rabataesch?" },
          { de: "Ich arbeite", ru: "я работаю", pron: "ja rabataju" },
          { de: "mein Beruf", ru: "моя профессия", pron: "maja prafeßßia" },
          { de: "dein Beruf", ru: "твоя профессия", pron: "twaja prafeßßia" },
          { de: "guter Arzt", ru: "хороший врач", pron: "charaschi wratsch" },
          { de: "neuer Lehrer", ru: "новый учитель", pron: "nawy utschitel" },
        ]
      },
      {
        id: "einf-hobbys",
        titel: "Hobbys",
        uebungen: [
          { de: "Musik", ru: "музыка", pron: "musyka" },
          { de: "Sport", ru: "спорт", pron: "ßpart" },
          { de: "Buch", ru: "книга", pron: "kniga" },
          { de: "Film", ru: "фильм", pron: "film" },
          { de: "Spiel", ru: "игра", pron: "igra" },
          { de: "Tanz", ru: "танец", pron: "tanetz" },
          { de: "Foto", ru: "фото", pron: "fata" },
          { de: "Reise", ru: "путешествие", pron: "putescheßtwie" },
          { de: "Hobby", ru: "хобби", pron: "chabbi" },
          { de: "Freizeit", ru: "свободное время", pron: "ßwabadnae wremja" },
          { de: "Ich lese", ru: "я читаю", pron: "ja tschitaju" },
          { de: "Ich spiele", ru: "я играю", pron: "ja igraju" },
          { de: "Ich tanze", ru: "я танцую", pron: "ja tantzuju" },
          { de: "Ich reise", ru: "я путешествую", pron: "ja putescheßtwuju" },
          { de: "Ich mag Musik", ru: "я люблю музыку", pron: "ja ljublju musyku" },
          { de: "Ich mag Sport", ru: "я люблю спорт", pron: "ja ljublju ßpart" },
          { de: "mein Hobby", ru: "моё хобби", pron: "majo chabbi" },
          { de: "dein Hobby", ru: "твоё хобби", pron: "twajo chabbi" },
          { de: "Was machst du gern?", ru: "что ты любишь делать?", pron: "tschta ty ljubisch delat?" },
          { de: "Ich mag Bücher", ru: "я люблю книги", pron: "ja ljublju knigi" },
        ]
      },
      {
        id: "einf-emotionen",
        titel: "Gefühle",
        uebungen: [
          { de: "Freude", ru: "радость", pron: "radaßt" },
          { de: "Liebe", ru: "любовь", pron: "ljubaw" },
          { de: "Glück", ru: "счастье", pron: "ßtschaßte" },
          { de: "Trauer", ru: "грусть", pron: "grußt" },
          { de: "Angst", ru: "страх", pron: "ßtrach" },
          { de: "Wut", ru: "злость", pron: "slaßt" },
          { de: "Ich freue mich", ru: "я радуюсь", pron: "ja radujuß" },
          { de: "Ich liebe", ru: "я люблю", pron: "ja ljublju" },
          { de: "Ich bin glücklich", ru: "я счастлив", pron: "ja ßtschaßtliw" },
          { de: "Ich bin traurig", ru: "мне грустно", pron: "mne grußtna" },
          { de: "Mir ist kalt", ru: "мне холодно", pron: "mne chaladna" },
          { de: "Mir ist warm", ru: "мне тепло", pron: "mne tepla" },
          { de: "Ich bin müde", ru: "я устал", pron: "ja ußtal" },
          { de: "Ich bin krank", ru: "я болен", pron: "ja balen" },
          { de: "Ich bin gesund", ru: "я здоров", pron: "ja sdaraw" },
          { de: "Wie fühlst du dich?", ru: "как ты себя чувствуешь?", pron: "kak ty ßebja tschuwßtwuesch?" },
          { de: "Mir geht es gut", ru: "мне хорошо", pron: "mne charascha" },
          { de: "Mir geht es schlecht", ru: "мне плохо", pron: "mne placha" },
          { de: "Alles gut", ru: "всё хорошо", pron: "wßjo charascha" },
          { de: "Kein Problem", ru: "без проблем", pron: "bes prablem" },
        ]
      },
      {
        id: "einf-beschreiben",
        titel: "Beschreiben",
        uebungen: [
          { de: "Das ist ein Haus", ru: "это дом", pron: "äta dam" },
          { de: "Das ist ein Tisch", ru: "это стол", pron: "äta ßtal" },
          { de: "Das ist mein Haus", ru: "это мой дом", pron: "äta maj dam" },
          { de: "Das ist dein Buch", ru: "это твоя книга", pron: "äta twaja kniga" },
          { de: "Das ist groß", ru: "это большое", pron: "äta balschae" },
          { de: "Das ist klein", ru: "это маленькое", pron: "äta malenkae" },
          { de: "Das ist gut", ru: "это хорошо", pron: "äta charascha" },
          { de: "Das ist neu", ru: "это новое", pron: "äta nawae" },
          { de: "Das ist alt", ru: "это старое", pron: "äta ßtarae" },
          { de: "Das ist schön", ru: "это красиво", pron: "äta kraßiwa" },
          { de: "Was ist das?", ru: "что это?", pron: "tschta äta?" },
          { de: "Das ist ein Hund", ru: "это собака", pron: "äta ßabaka" },
          { de: "Das ist eine Katze", ru: "это кошка", pron: "äta kaschka" },
          { de: "Ist das dein?", ru: "это твоё?", pron: "äta twajo?" },
          { de: "Ja, das ist meins", ru: "да, это моё", pron: "da, äta majo" },
          { de: "Nein, das ist nicht meins", ru: "нет, это не моё", pron: "net, äta ne majo" },
          { de: "Das ist mein", ru: "это моё", pron: "äta majo" },
          { de: "Das ist deins", ru: "это твоё", pron: "äta twajo" },
          { de: "Das ist seins", ru: "это его", pron: "äta ega" },
          { de: "Das ist ihrs", ru: "это её", pron: "äta ejo" },
        ]
      },
      {
        id: "einf-fragen",
        titel: "Fragen",
        uebungen: [
          { de: "Was?", ru: "что?", pron: "tschta?" },
          { de: "Wer?", ru: "кто?", pron: "kta?" },
          { de: "Wo?", ru: "где?", pron: "gde?" },
          { de: "Wann?", ru: "когда?", pron: "kagda?" },
          { de: "Warum?", ru: "почему?", pron: "patschemu?" },
          { de: "Wie?", ru: "как?", pron: "kak?" },
          { de: "Was ist das?", ru: "что это?", pron: "tschta äta?" },
          { de: "Wer ist das?", ru: "кто это?", pron: "kta äta?" },
          { de: "Wo bist du?", ru: "где ты?", pron: "gde ty?" },
          { de: "Wann kommst du?", ru: "когда ты придёшь?", pron: "kagda ty pridjosch?" },
          { de: "Warum nicht?", ru: "почему нет?", pron: "patschemu net?" },
          { de: "Wie geht es?", ru: "как дела?", pron: "kak dela?" },
          { de: "Was machst du?", ru: "что ты делаешь?", pron: "tschta ty delaesch?" },
          { de: "Wer bist du?", ru: "кто ты?", pron: "kta ty?" },
          { de: "Wo ist das?", ru: "где это?", pron: "gde äta?" },
          { de: "Was willst du?", ru: "что ты хочешь?", pron: "tschta ty chatschesch?" },
          { de: "Wie viel?", ru: "сколько?", pron: "ßkalka?" },
          { de: "Welcher?", ru: "какой?", pron: "kakaj?" },
          { de: "Wie heißt du?", ru: "как тебя зовут?", pron: "kak tebja sawut?" },
          { de: "Woher kommst du?", ru: "откуда ты?", pron: "atkuda ty?" },
        ]
      },
      {
        id: "einf-alltag",
        titel: "Alltag",
        uebungen: [
          { de: "Ich stehe auf", ru: "я встаю", pron: "ja wßtaju" },
          { de: "Ich frühstücke", ru: "я завтракаю", pron: "ja sawtrakaju" },
          { de: "Ich gehe zur Arbeit", ru: "я иду на работу", pron: "ja idu na rabatu" },
          { de: "Ich arbeite", ru: "я работаю", pron: "ja rabataju" },
          { de: "Ich esse zu Mittag", ru: "я обедаю", pron: "ja abedaju" },
          { de: "Ich gehe nach Hause", ru: "я иду домой", pron: "ja idu damaj" },
          { de: "Ich esse zu Abend", ru: "я ужинаю", pron: "ja uschinaju" },
          { de: "Ich lese", ru: "я читаю", pron: "ja tschitaju" },
          { de: "Ich schlafe", ru: "я сплю", pron: "ja ßplju" },
          { de: "Guten Morgen", ru: "доброе утро", pron: "dabrae utra" },
          { de: "Guten Tag", ru: "добрый день", pron: "dabry den" },
          { de: "Guten Abend", ru: "добрый вечер", pron: "dabry wetscher" },
          { de: "Gute Nacht", ru: "спокойной ночи", pron: "ßpakajnaj natschi" },
          { de: "Wie war dein Tag?", ru: "как прошёл твой день?", pron: "kak praschjol twaj den?" },
          { de: "Mein Tag war gut", ru: "мой день был хорошим", pron: "maj den byl charaschim" },
          { de: "Ich bin zu Hause", ru: "я дома", pron: "ja doma" },
          { de: "Ich bin müde", ru: "я устал", pron: "ja ußtal" },
          { de: "Bis morgen", ru: "до завтра", pron: "da sawtra" },
          { de: "Bis bald", ru: "до скорого", pron: "da ßkaraga" },
          { de: "Tschüss", ru: "пока", pron: "paka" },
        ]
      },
    ]
  },
      /* ==========================================================
         STAGE 2
         ========================================================== */
      {
        id: "gespraech",
        titel: "Ins Gespräch kommen",
        text: "Die ersten Sätze, mit denen du dich verständigst.",
        levels: [
          {
            id: "gespraech-verstaendigung",
            titel: "Verständigung",
            uebungen: [
              {
                de: "Sprechen Sie Russisch?",
                ru: "Вы говорите по-русски?",
                pron: "Wy gawaritje pa-russki?"
              },
              {
                de: "Ich spreche kein Russisch.",
                ru: "Я не говорю по-русски.",
                pron: "Ja nje gawarju pa-russki."
              },
              {
                de: "Ich verstehe nicht.",
                ru: "Я не понимаю.",
                pron: "Ja nje panimaju."
              },
              {
                de: "Wie sagt man das auf Russisch?",
                ru: "Как это по-русски?",
                pron: "Kak eta pa-russki?"
              },
              {
                de: "Sprechen Sie bitte langsamer.",
                ru: "Говорите медленнее, пожалуйста.",
                pron: "Gawaritje mjedljenneje, paschalusta."
              },
              {
                de: "Können Sie das wiederholen?",
                ru: "Повторите, пожалуйста.",
                pron: "Pawtaritje, paschalusta."
              }
            ]
          },
          {
            id: "gespraech-begruessung",
            titel: "Begrüßung",
            uebungen: [
              { de: "Hallo!", ru: "Привет!", pron: "Priwjet!" },
              { de: "Guten Tag!", ru: "Здравствуйте!", pron: "Sdrastwujtje!" },
              { de: "Guten Morgen!", ru: "Доброе утро!", pron: "Dobraje utra!" },
              { de: "Guten Abend!", ru: "Добрый вечер!", pron: "Dobry wjetscher!" },
              { de: "Auf Wiedersehen!", ru: "До свидания!", pron: "Da ßwidanija!" },
              { de: "Tschüs!", ru: "Пока!", pron: "Paka!" }
            ]
          },
          {
            id: "gespraech-vorstellen",
            titel: "Sich vorstellen",
            uebungen: [
              {
                de: "Wie heißen Sie?",
                ru: "Как вас зовут?",
                pron: "Kak waß sawut?"
              },
              {
                de: "Ich heiße Anna.",
                ru: "Меня зовут Анна.",
                pron: "Minja sawut Anna."
              },
              {
                de: "Sehr angenehm!",
                ru: "Очень приятно!",
                pron: "Otschin prijatna!"
              },
              {
                de: "Woher kommen Sie?",
                ru: "Откуда вы?",
                pron: "Atkuda wy?"
              },
              {
                de: "Ich komme aus Deutschland.",
                ru: "Я из Германии.",
                pron: "Ja is Germanii."
              },
              {
                de: "Wie geht es dir?",
                ru: "Как дела?",
                pron: "Kak djela?"
              }
            ]
          }
        ]
      },

      /* ==========================================================
         STAGE 3
         ========================================================== */
      {
        id: "unterwegs",
        titel: "Unterwegs",
        text: "Nach dem Weg fragen und von A nach B kommen.",
        levels: [
          {
            id: "unterwegs-weg",
            titel: "Nach dem Weg fragen",
            uebungen: [
              {
                de: "Wo ist der Bahnhof?",
                ru: "Где вокзал?",
                pron: "Gdje wagsal?"
              },
              {
                de: "Wie komme ich ins Zentrum?",
                ru: "Как пройти в центр?",
                pron: "Kak prajti f zentr?"
              },
              {
                de: "Ist das weit?",
                ru: "Это далеко?",
                pron: "Eta daljeko?"
              },
              { de: "nach links", ru: "налево", pron: "naljewa" },
              { de: "nach rechts", ru: "направо", pron: "naprawa" },
              { de: "geradeaus", ru: "прямо", pron: "prjama" }
            ]
          },
          {
            id: "unterwegs-verkehr",
            titel: "Verkehrsmittel",
            uebungen: [
              {
                de: "Wo ist die Metro?",
                ru: "Где метро?",
                pron: "Gdje mitro?"
              },
              {
                de: "Eine Fahrkarte, bitte.",
                ru: "Один билет, пожалуйста.",
                pron: "Adin biljet, paschalusta."
              },
              {
                de: "Wann fährt der Zug ab?",
                ru: "Когда отходит поезд?",
                pron: "Kagda atchodit pojesd?"
              },
              {
                de: "Ich möchte ein Taxi.",
                ru: "Я хочу такси.",
                pron: "Ja chatschu takßi."
              },
              {
                de: "Halten Sie hier, bitte.",
                ru: "Остановитесь здесь, пожалуйста.",
                pron: "Aßtanawitjeß sdjeß, paschalusta."
              }
            ]
          }
        ]
      },

      /* ==========================================================
         STAGE 4
         ========================================================== */
      {
        id: "essen",
        titel: "Essen & Trinken",
        text: "Im Restaurant bestellen und bezahlen.",
        levels: [
          {
            id: "essen-restaurant",
            titel: "Im Restaurant",
            uebungen: [
              {
                de: "Die Speisekarte, bitte.",
                ru: "Меню, пожалуйста.",
                pron: "Minju, paschalusta."
              },
              {
                de: "Ich möchte bestellen.",
                ru: "Я хочу заказать.",
                pron: "Ja chatschu sakasat."
              },
              {
                de: "Was empfehlen Sie?",
                ru: "Что вы посоветуете?",
                pron: "Schto wy paßawjetujetje?"
              },
              {
                de: "Wasser, bitte.",
                ru: "Воду, пожалуйста.",
                pron: "Wodu, paschalusta."
              },
              {
                de: "Die Rechnung, bitte.",
                ru: "Счёт, пожалуйста.",
                pron: "Schtschot, paschalusta."
              },
              {
                de: "Es war sehr lecker.",
                ru: "Было очень вкусно.",
                pron: "Byla otschin fkußna."
              }
            ]
          }
        ]
      }

    ];
