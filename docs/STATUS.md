# STATUS.md – Between

## Letzter stabiler Stand
- **Tag:** `v0.2-menu`
- **Datum:** 2026-02-20
- **Was funktioniert:**
  - Kompletter Boot → Splash → Title → Menu Flow mit Artwork
  - Titelmusik (startet beim Splash, loopt)
  - Navigierbares Menu (New Run, Continue, Settings, Credits)
  - Settings-Scene (Sound, Game, Player Tabs)
  - Credits-Scene mit ESC-Rücksprung
  - Responsive Scaling (Mac, PC, iOS, Android)
  - GameScene mit Player-Bewegung (8-Richtungen, WASD+Pfeiltasten)
  - Statischer Raum mit Wall-Collision

## Abgeschlossen diese Session
- [x] T-001: Projekt-Setup + Boot Screens (`v0.0-setup`)
- [x] T-002: Player Movement + Erster Raum (`v0.1-movement`, WIP visuell)
- [x] T-003: Title Screen Menu + Titelmusik (`v0.2-menu`)
- [x] Fullscreen Artwork: Ceccaroni Splash, BETWEEN Title, Menu Background
- [x] Liminal Style: Glitch-Titel, Dust/Scanline-Effekte (später durch Artwork ersetzt)
- [x] Settings-Scene mit Sound/Game/Player Tabs
- [x] Responsive Scaling für alle Plattformen
- [x] AudioSystem als wiederverwendbare Klasse

## Known Bugs
- **Player-Sprite zu klein** (40x32px bei 1280x720) — braucht Scale oder x2 Assets
- **Player-Animationsframes vermutlich falsch** — müssen via TestScene verifiziert werden
- **Tileset-Indices falsch** — Wände nutzen Fallback-Tile, kein Pupkin Floor, keine Props
- **Raum nicht zentriert** — startet bei (0,0) statt Bildschirmmitte
- Details: `docs/ISSUE-T002-visual-fixes.md`

## Nächste Session
- [ ] T-002 Visual Fixes: Tile-Indices via TestScene Debug-Grid identifizieren
- [ ] Player-Sprite skalieren (2x) oder x2 Assets laden
- [ ] Animationsframes visuell verifizieren und korrigieren
- [ ] Pupkin Floor-Tiles und Wand-Varianten einbauen
- [ ] Animierte Props im Raum platzieren
- [ ] Menu-SFX Dateien bereitstellen (menu-select.mp3, menu-confirm.mp3)
- [ ] Erster Gegner (T-004)
