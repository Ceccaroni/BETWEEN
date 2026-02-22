# STATUS – Between

## Letzter stabiler Tag
`v0.3-hero-wizard` — 2026-02-21

## Was funktioniert
- Boot → Splash → Title → Menu Flow mit Artwork
- Titelmusik (startet beim Splash, loopt)
- Navigierbares Menu (New Run, Continue, Settings, Credits)
- Settings-Scene (Sound, Game, Player Tabs)
- Credits-Scene mit ESC-Rücksprung
- Responsive Scaling (Mac, PC, iOS, Android)
- GameScene mit Player-Bewegung (8-Richtungen, WASD+Pfeiltasten)
- Tech-Dungeon-Raum mit Pupkin Tileset (Wände, Pillars, Props)
- Hero Wizard Player: Idle (12 Frames), Run (32 Frames)
- Wall-Collision (Perimeter + Interior-Pillars)
- Dust-Partikel beim Laufen + Burst bei Richtungswechsel
- Player-Shadow (Ellipse)
- TilesetViewer (?scene=tileset oder T im Menu)

## Aktives Ticket
Keins — Cleanup-Session abgeschlossen (2026-02-22)

## Bekannte Bugs
- **Floor ist Dark Rectangle** — Pupkin Floor-Tiles sind transparent by design; `0x12121e` Rechteck als Floor ist korrekte Lösung, kein Code-Bug
- **Pupkin Player-Sheet unbrauchbar** — Text-Labels in Sprites eingebacken, als Backup behalten aber nicht aktiv genutzt
- **Menu-SFX fehlen** — menu-select.mp3 und menu-confirm.mp3 existieren nicht, AudioSystem überspringt sie

## NICHT ANFASSEN
- `BootScene.ts` Asset-Loading-Reihenfolge — alles hängt davon ab
- `DungeonGenerator.ts` Tile-Indices — manuell verifiziert, nicht raten
- `Player.ts` Scale/Hitbox-Werte — pixelgenau abgestimmt auf Hero Wizard Sprites
- Pupkin Asset Pack unter `src/Pupkin Tech Dungeon Asset Pack/` — Lizenz-Assets, nicht modifizieren
