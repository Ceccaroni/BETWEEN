# Anleitung: Heute Nachmittag 🚀

## Schritt 1: Repo klonen (Terminal auf Mac)
```bash
cd ~/Desktop
git clone https://github.com/Ceccaroni/BETWEEN.git
cd BETWEEN
```

## Schritt 2: Dateien ins Repo kopieren
Die Dateien die ihr von Claude (Chat) bekommen habt, ins Repo legen:
- `CLAUDE.md` → Repo-Root
- `TICKET-001.md` → Repo-Root
- `SESSION-PROMPTS.md` → Repo-Root
- `docs/STATUS.md`
- `docs/ARCHITECTURE.md`
- `docs/DECISIONS.md`
- `docs/LORE.md`

```bash
mkdir -p docs
# Dateien reinkopieren (Drag & Drop in Finder oder via Terminal)
```

## Schritt 3: Pushen
```bash
git add .
git commit -m "docs: add project documentation and first ticket"
git push
```

## Schritt 4: Pupkin Assets kaufen & entpacken
1. https://trevor-pupkin.itch.io/tech-dungeon-roguelite → Vollversion £2.99
2. ZIP runterladen und entpacken
3. Inhalt nach `src/assets/` sortieren (macht Claude Code in Ticket #002)
4. NICHT committen – Assets gehören nicht ins öffentliche Repo (Lizenz!)

→ Fügt diese Zeile zur .gitignore hinzu:
```
src/assets/tilesets/
src/assets/characters/
src/assets/enemies/
```

## Schritt 5: Claude Code öffnen
```bash
cd ~/Desktop/BETWEEN
claude
```

## Schritt 6: Ersten Prompt geben
Kopiert den "Allererster Prompt" aus SESSION-PROMPTS.md:

```
Lies CLAUDE.md, docs/STATUS.md, docs/ARCHITECTURE.md, docs/DECISIONS.md und docs/LORE.md.

Dann lies TICKET-001.md und führe es Schritt für Schritt aus.

Frag mich bevor du startest ob ich das Ceccaroni Games Logo (PNG) hochladen will,
oder ob du mit Platzhalter-Text arbeiten sollst.
```

## Schritt 7: Logo hochladen
Wenn Claude Code fragt: Ceccaroni Games Logo PNG hochladen.
Claude Code wird es nach `src/assets/branding/` ablegen.

## Schritt 8: Zuschauen & Lernen 🎮
Claude Code arbeitet das Ticket ab. Ihr schaut zu, fragt wenn nötig.
Am Ende: `npm run dev` → Browser → Spiel läuft!

## Bei Problemen
→ Zurück zu Claude (Chat) kommen. Fehlermeldung posten. Wir fixen das.
