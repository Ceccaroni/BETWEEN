# ISSUE: T-002 Visual Fixes

## Status: GRÖSSTENTEILS GELÖST (2026-02-21)

## Gelöst
1. ~~**Player-Sprite zu klein**~~ → FreeKnight_v1 Pack (120×80 Frames) + setScale(2). Pupkin Player verworfen.
2. ~~**Player-Animationsframes falsch**~~ → FreeKnight hat saubere Frames ohne Text-Labels. Idle + Run funktionieren.
3. ~~**Raum nicht zentriert**~~ → Layer-Scale 2× füllt den Screen (20×11 Tiles × 64px = 1280×704).
5. ~~**Keine Wand-Varianten**~~ → TOP, LEFT, RIGHT als eigene Tiles; BLOCK für Corners, Pillars, Bottom.
6. ~~**Keine Props**~~ → 3 statische Props platziert (Monitor, Green Tank, Blue Screen).

## Offen (niedrige Priorität)
4. **Floor ist Dark Rectangle** — Pupkin blaue Tech-Tiles sind transparent (Overlays, kein Solid Floor). Aktuell 0x12121e Rechteck. Sieht akzeptabel aus, aber echte Floor-Tiles wären besser.
7. **Bottom-Wall nutzt BLOCK-Fallback** — ti(4,6)=226 ist leer im Tileset. Dediziertes Bottom-Tile noch nicht gefunden.

## Ursachenanalyse: Pupkin Player
Das Pupkin Player-Sheet (`players blue x1.png`, 40×32 Cells) hat **Text-Labels als Pixel in die Sprites eingebacken**. Jede Row enthält Sprite-Frames + rote Text-Frames ("Idle", "Run", etc.) im selben Grid. Das macht Frame-Indexing fehleranfällig und verhindert saubere Animationen. Die Entscheidung war, auf FreeKnight_v1 zu wechseln (separate Sheets pro Animation, konsistente 120×80 Frames, professionelles Sprite-Design).

## Betroffene Dateien (alle bereits aktualisiert)
- `src/systems/DungeonGenerator.ts` — Raum mit verifizierten Tile-Indices
- `src/entities/Player.ts` — FreeKnight-basiert
- `src/scenes/GameScene.ts` — Props, Shadow, Dust
- `src/scenes/BootScene.ts` — FreeKnight Spritesheets laden
