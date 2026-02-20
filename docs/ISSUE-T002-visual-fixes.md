# ISSUE: T-002 Visual Fixes (HIGH PRIORITY)

## Status: OFFEN

## Probleme
1. **Player-Sprite zu klein** — 40x32px auf 1280x720 kaum sichtbar. Braucht 2x-3x Scale oder x2 Assets.
2. **Player-Animationsframes falsch** — Zeigt Label-Text ("Idle", "No Gun") aus dem Spritesheet. Frame-Indices müssen korrigiert werden.
3. **Raum nicht zentriert** — Room startet bei (0,0), sollte zentriert sein oder Kamera besser konfiguriert.
4. **Keine Pupkin Floor-Tiles** — Aktuell Rectangle-Fallback statt echte Tileset-Tiles. Tile-Indices müssen via TestScene (Tile-Debug-Grid) identifiziert werden.
5. **Keine Wand-Varianten** — Alle Wände nutzen denselben Tile (ti(3,0)). Braucht Corners, Edges, Faces.
6. **Keine animierten Props** — Prop-Frame-Indices waren falsch, Props temporär entfernt.
7. **Kein Tileset-Floor** — Floor braucht blaue Tech-Streifen aus dem Pupkin Tileset.

## Lösung
- TestScene enthält bereits Tileset-Debug-Grid mit Index-Nummern
- TestScene als erste Scene starten, Tile-Indices ablesen
- DungeonGenerator.ts mit korrekten Indices updaten
- Player: entweder x2 Asset nutzen oder `setScale(2)` auf dem Sprite
- Player-Animationsframes visuell verifizieren und korrigieren

## Betroffene Dateien
- `src/systems/DungeonGenerator.ts`
- `src/entities/Player.ts`
- `src/scenes/GameScene.ts`
- `src/scenes/BootScene.ts` (falls x2 Assets geladen werden)
