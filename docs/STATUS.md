# STATUS.md – Between

## Letzter stabiler Stand
- **Tag:** `v0.3-hero-wizard`
- **Datum:** 2026-02-21
- **Was funktioniert:**
  - Kompletter Boot → Splash → Title → Menu Flow mit Artwork
  - Titelmusik (startet beim Splash, loopt)
  - Navigierbares Menu (New Run, Continue, Settings, Credits)
  - Settings-Scene (Sound, Game, Player Tabs)
  - Credits-Scene mit ESC-Rücksprung
  - Responsive Scaling (Mac, PC, iOS, Android)
  - GameScene mit Player-Bewegung (8-Richtungen, WASD+Pfeiltasten)
  - Tech-Dungeon-Raum mit Pupkin Tileset (Wände, Pillars, Props)
  - **Hero Wizard** Player mit Idle (12 Frames) und Run (32 Frames) Animationen
  - Wall-Collision (Perimeter + Interior-Pillars)
  - Dust-Partikel beim Laufen + Burst bei Richtungswechsel
  - Player-Shadow (Ellipse)

## Abgeschlossen diese Session (2026-02-21)
- [x] 4 neue Asset-Packs integriert (32rogues, 32rogues-2, Dungeon Pack, DungeonAssetPack)
- [x] Hero Wizard als neuer Spieler-Charakter (ersetzt FreeKnight)
- [x] High-Res Wizard Spritesheets verarbeitet:
  - hero-wizard-run.png: 2816×1536, 352×384 Cells, 32 Frames
  - hero-wizard-idle.png: 2112×768, 352×384 Cells, 12 Frames
  - Background-Removal (BFS Flood Fill + Blob Detection)
  - Idle-Frames auf Run-Charakter-Grösse skaliert und ausgerichtet
- [x] Player.ts komplett neu geschrieben für Wizard (Scale 0.55, Physics Body angepasst)
- [x] Dust-Trail-System (kontinuierlich beim Laufen + Burst bei Richtungswechsel)

## Known Bugs
- **BOT-Wall nutzt BLOCK-Fallback** — ti(4,6)=226 ist leer; untere Wand zeigt grauen Block statt dediziertem Wall-Tile
- **Floor ist Dark Rectangle** — Pupkin blaue Tiles sind transparent; aktuell ein 0x12121e Rechteck als Floor
- **Player-Hitbox ungetunt** — setSize(80,140) / setOffset(136,160) sind Schätzwerte für 352×384@0.55, brauchen visuelles Finetuning
- **Pupkin Player-Sheet unbrauchbar** — Text-Labels in Sprites eingebacken, als Backup behalten aber nicht aktiv genutzt
- **Alte hero-wizard.png (64×64) noch geladen** — wird nicht mehr genutzt, kann aus BootScene entfernt werden

## Nächste Session
- [ ] Player-Hitbox visuell feintunen (Debug-Overlay mit Hitbox-Anzeige)
- [ ] Attack/Shoot-Animation für Hero Wizard
- [ ] Bessere Floor-Tiles finden oder dunkleren Floor gestalten
- [ ] Dedizierte Bottom-Wall-Tile im Tileset identifizieren
- [ ] Menu-SFX Dateien bereitstellen (menu-select.mp3, menu-confirm.mp3)
- [ ] Erster Gegner (T-004)
- [ ] Alte unused Assets aufräumen (hero-wizard.png 64×64, FreeKnight-Sheets)
