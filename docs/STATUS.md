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
  - Tech-Dungeon-Raum mit Pupkin Tileset (Wände, Pillars, Props)
  - FreeKnight Player mit Idle/Run-Animationen
  - Wall-Collision (Perimeter + Interior-Pillars)

## Abgeschlossen diese Session (2026-02-21)
- [x] TICKET-002-REBOOT Phase 0: Asset-Registry (`docs/ASSET-REGISTRY.md`)
- [x] TICKET-002-REBOOT Phase 1: Asset-Loading verifiziert (war bereits korrekt)
- [x] TICKET-002-REBOOT Phase 2: Erster Raum (WIP — Tiles + Props + Player)
  - [x] DungeonGenerator: 20×11 Raum, Layer-Scale 2× (64×64 Display), Wall-Perimeter + 4 Pillars
  - [x] Verifizierte Tile-Indices: TOP=ti(4,0), LEFT=ti(1,3), RIGHT=ti(9,4), BLOCK=ti(3,0)
  - [x] 3 statische Props im Raum (Monitor, Green Tank, Blue Screen)
  - [x] Player-Wechsel: Pupkin → FreeKnight_v1 (120×80 Frames, saubere Animationen)
  - [x] 8 FreeKnight-Spritesheets kopiert und geladen
  - [x] Player Scale 2×, Shadow + Dust-Particles angepasst
  - [x] ASSET-REGISTRY.md mit FreeKnight-Sektion erweitert

## Known Bugs
- **BOT-Wall nutzt BLOCK-Fallback** — ti(4,6)=226 ist leer; untere Wand zeigt grauen Block statt dediziertem Wall-Tile
- **Floor ist Dark Rectangle** — Pupkin blaue Tiles sind transparent; aktuell ein 0x12121e Rechteck als Floor
- **Player-Hitbox ungetunt** — setSize(30,45) / setOffset(45,17) sind Schätzwerte, brauchen visuelles Finetuning
- **Pupkin Player-Sheet unbrauchbar** — Text-Labels in Sprites eingebacken, als Backup behalten aber nicht aktiv genutzt

## Nächste Session
- [ ] TICKET-002-REBOOT Phase 3: Player + Movement verfeinern (Hitbox-Tuning, Attack-Animation)
- [ ] TICKET-002-REBOOT Phase 4: Juice (Particles, Screenshake, Tweens)
- [ ] Bessere Floor-Tiles finden oder dunkleren Floor gestalten
- [ ] Dedizierte Bottom-Wall-Tile im Tileset identifizieren
- [ ] Menu-SFX Dateien bereitstellen (menu-select.mp3, menu-confirm.mp3)
- [ ] Erster Gegner (T-004)
