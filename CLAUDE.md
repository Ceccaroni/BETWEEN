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

## Architektur
→ docs/ARCHITECTURE.md

## Status
→ docs/STATUS.md
