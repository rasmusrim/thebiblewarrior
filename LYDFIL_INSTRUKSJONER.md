# Slik deler du opp lydfilen for *The Bible Warrior 2*

Denne veiledningen viser hvordan du bruker et gratis program som heter **Audacity** til å dele én lang lydfil (hele Apostlenes gjerninger) i 42 korte MP3-filer — én for hver leksjonsdag i boka.

Du trenger ikke ha gjort noe slikt før. Bare følg stegene.

---

## Dette trenger du

- En PC med Windows
- Lydfilen `ACTS.mp3` (hele opptaket, ca. 2 timer og 9 minutter)
- Omtrent 1–2 timer sammenhengende tid

---

## Steg 1 — Installer Audacity (ca. 5 minutter)

1. Åpne nettleseren og gå til: **https://www.audacityteam.org/download/windows/**
2. Klikk på den store grønne knappen som heter **Audacity Windows Installer**.
3. Når filen er ferdig lastet ned, dobbeltklikk på den (ligger som regel i mappen *Nedlastinger*).
4. Klikk **Next** (Neste) gjennom hele installasjonen — de vanlige innstillingene er greie. Helt til slutt klikker du **Finish**.
5. Åpne Audacity fra Start-menyen.

---

## Steg 2 — Åpne lydfilen

1. Klikk øverst til venstre på **File** → **Open…**
2. Finn frem `ACTS.mp3` og åpne den.
3. Nå ser du en lang blå "bølge" som går over hele skjermen. Det er lyden visualisert.

**Tips:**
- **Mellomromstasten** (space) = spill av / sett på pause.
- **Klikk et sted i bølgen** for å hoppe dit.
- Hold **Ctrl** og rull på musehjulet for å zoome inn og ut.

---

## Steg 3 — Legg inn et merke for hver dag

Du skal nå lytte deg gjennom lyden og merke av hvor hver ny dag begynner. Hver dag starter som regel der det sies *"Kapittel X"* eller der første vers i dagens tekst leses.

### Slik lager du et merke

1. Klikk i bølgen akkurat der en ny dag starter.
2. Trykk **Ctrl + B** på tastaturet. Et lite merke dukker opp i en egen rad under lyden.
3. Skriv inn navnet på filen (dette er viktig — det blir selve filnavnet etterpå!):
    - For dag 1 skriver du: `day-01`
    - For dag 2 skriver du: `day-02`
    - Og så videre. Husk alltid **to siffer** (altså `day-09`, ikke `day-9`).
4. Trykk **Enter**.

Gjenta for alle dagene. Det blir 42 merker totalt når du er ferdig.

### Dager og bibelhenvisninger

**Viktig:** Hopp over dag 12, 22, 35 og 46 — de er videodager og trenger ikke lyd.

| Filnavn  | Bibel-tekst     |
|----------|-----------------|
| day-01   | Apg 1           |
| day-02   | Apg 2,1-24      |
| day-03   | Apg 2,25-47     |
| day-04   | Apg 3           |
| day-05   | Apg 4,1-22      |
| day-06   | Apg 4,23-37     |
| day-07   | Apg 5,1-16      |
| day-08   | Apg 5,17-42     |
| day-09   | Apg 6           |
| day-10   | Apg 7,1-19      |
| day-11   | Apg 7,20-38     |
| day-13   | Apg 7,39-60     |
| day-14   | Apg 8,1-25      |
| day-15   | Apg 8,26-40     |
| day-16   | Apg 9,1-22      |
| day-17   | Apg 9,23-43     |
| day-18   | Apg 10,1-23     |
| day-19   | Apg 10,24-48    |
| day-20   | Apg 11          |
| day-21   | Apg 12          |
| day-23   | Apg 13,1-25     |
| day-24   | Apg 13,26-52    |
| day-25   | Apg 14          |
| day-26   | Apg 15,1-30     |
| day-27   | Apg 15,31-41    |
| day-28   | Apg 16,1-15     |
| day-29   | Apg 16,16-40    |
| day-30   | Apg 17          |
| day-31   | Apg 18          |
| day-32   | Apg 19,1-20     |
| day-33   | Apg 19,21-40    |
| day-34   | Apg 20          |
| day-36   | Apg 21,1-16     |
| day-37   | Apg 21,17-21    |
| day-38   | Apg 22          |
| day-39   | Apg 23          |
| day-40   | Apg 24          |
| day-41   | Apg 25          |
| day-42   | Apg 26          |
| day-43   | Apg 27,1-26     |
| day-44   | Apg 27,27-44    |
| day-45   | Apg 28          |

### Gode råd underveis

- **Ta pauser!** Dette tar tid. Lagre prosjektet jevnlig: **File → Save Project As…** og kall det for eksempel `acts-deling.aup3`. Da kan du lukke Audacity og fortsette senere uten å miste noe.
- Hvis du ser at et merke havnet litt for tidlig eller sent, kan du **dra det sidelengs** i merkelinjen for å flytte det.
- Du kan åpne en liste over alle merkene dine via **Tracks → Edit Labels…** for å rette skrivefeil eller slette merker som ble feil.
- Det trenger ikke være helt på millisekundet — noen sekunder før eller etter går helt fint.

---

## Steg 4 — Eksporter alle filene i én operasjon

Når alle 42 merkene er på plass:

1. Klikk **File → Export → Export Multiple…**
2. I vinduet som kommer opp:
    - **Export Location**: Klikk **Browse…** og lag en ny, tom mappe på skrivebordet. Kall den for eksempel `ACTS-ferdig`.
    - **Format**: Velg **MP3 Files**.
    - Klikk **Options…** (ved siden av Format) og sett:
      - **Bit Rate Mode**: `Constant`
      - **Quality**: `64 kbps`
      - **Channel Mode**: `Force export to mono`
      - Klikk **OK**.
    - **Split files based on**: velg **Labels**.
    - **Name files**: velg **Using Label/Track Name**.
3. Klikk den store **Export**-knappen.
4. Audacity spør kanskje om å fylle inn "metadata" (artistnavn osv.) for hver fil. Du kan bare klikke **OK** 42 ganger — eller kryss av for **"Don't show again"** før den første, så slipper du resten.

Når det er ferdig har du en mappe med 42 filer: `day-01.mp3`, `day-02.mp3`, `day-03.mp3`, og så videre.

---

## Steg 5 — Send filene videre

1. Høyreklikk på mappen `ACTS-ferdig`.
2. Velg **Send til → Komprimert (zippet) mappe**. Det lager en `.zip`-fil.
3. Send zip-filen til Rasmus (på e-post, Dropbox, WeTransfer eller hvor du pleier).

Når Rasmus får filene legger han dem rett inn i appen.

---

**Er noe uklart?** Send en melding, så hjelper vi deg videre.
