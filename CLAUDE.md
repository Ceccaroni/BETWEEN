# CLAUDE.md – Between 🌀

## Projekt
Multi-Biome 2D Roguelike. 6 Dimensionen, jede eine andere Welt.
Phaser 3 + TypeScript + Vite. 3/4-Ansicht, 32x32 Tiles.
Start-Biome: "The Machine" (Pupkin Tech Dungeon Assets).

## Team
- Adrian: Architektur, Strategie, Tickets
- Neffe: Building, Learning
- Claude Code: Implementierung, Dokumentation

## Code-Regeln
- TypeScript strict. Keine `any`.
- Max 200 Zeilen pro Datei. Split wenn grösser.
- JSDoc auf jeder exportierten Funktion.
- PascalCase Klassen, camelCase Funktionen/Variablen.
- Neue Systeme → eigene Klasse in `src/systems/`.
- Neue Biome → eigener Ordner in `src/biomes/`.
- Assets: beschreibende Namen, kein `sprite1.png`.

## Workflow
- VOR Arbeit: STATUS.md lesen.
- NACH Session: STATUS.md updaten.
- Architektur-Entscheide → docs/DECISIONS.md.
- Commits: conventional (`feat:`, `fix:`, `refactor:`, `docs:`).
- Kein Feature ohne Absprache mit Entwickler.

## Sandbox-Regel
- Neue Features IMMER in isolierter Test-Scene prototypen.
- Erst nach Test in Haupt-Scene integrieren.
- Kaputt? → `git stash` oder Branch. NICHT im Main frickeln.

## Fallback
- Jeder Milestone: Git Tag (`v0.1-movement`, `v0.2-combat`).
- STATUS.md enthält immer letzten stabilen Tag.
- Im Zweifel: zurück zum Tag, neu aufbauen.

## Juice Policy 🧃
Bei JEDEM visuellen Feature das Maximum rausholen:
- Partikeleffekte bei Impacts, Deaths, Pickups
- Screen Shake bei Hits und Explosionen
- Tweens für UI-Elemente (Bounce, Fade, Scale)
- Flash-Effekt auf getroffenen Entities
- Dynamic Lighting wo möglich
- Slowmo-Frame bei Boss-Kills
- Loot-Drop mit Bounce-Physics
Phaser 3 hat all das eingebaut. BENUTZEN.

## Asset Rule (NICHT OPTIONAL)

**Bevor du IRGENDEINEN Asset in Code verwendest, analysierst du ihn zuerst.**

### Bei Spritesheets:
1. Datei öffnen und Pixel-Dimensionen lesen (NICHT raten)
2. Cell-Size bestimmen (Frame-Breite × Frame-Höhe)
3. Frame-Layout berechnen (Spalten × Reihen)
4. Animationen identifizieren (welche Reihe = welche Animation)
5. Ergebnis in `docs/ASSET-REGISTRY.md` dokumentieren

### Bei Tilesets:
1. Pixel-Dimensionen lesen
2. Tile-Size bestimmen
3. Tile-Positionen/IDs für verschiedene Typen identifizieren (Boden, Wand, Deko)
4. In ASSET-REGISTRY.md dokumentieren

### Verboten:
- `this.load.spritesheet()` mit Werten die nicht aus dem Registry kommen
- Frame-Dimensionen "ausprobieren" oder "schätzen"
- Asset-Bugs durch Trial-and-Error fixen statt durch Registry-Abgleich

### Kontrollmechanismus:
Jeder `frameWidth`/`frameHeight`-Wert im Code MUSS einen Kommentar haben:
```typescript
// ASSET-REGISTRY: player_blue.png, 256×128, 32×32 cells
frameWidth: 32,
frameHeight: 32
```

## Phasen-Regel (NICHT OPTIONAL)

Tickets mit mehreren Phasen werden SEQUENZIELL abgearbeitet.
- Phase 0 muss abgeschlossen und bestätigt sein bevor Phase 1 beginnt
- Jede Phase hat eigene Akzeptanzkriterien
- Jede Phase bekommt einen eigenen Commit
- Bei Unsicherheit: FRAGEN statt raten

## Architektur
→ docs/ARCHITECTURE.md

## Status
→ docs/STATUS.md
