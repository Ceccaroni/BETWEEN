# STATUS – Between

## Letzter stabiler Tag
`v0.4-hero-warrior` — 2026-03-21

## Was funktioniert
- Boot → Splash → Title → Menu Flow mit Artwork
- Titelmusik (startet beim Splash, loopt)
- Navigierbares Menu (New Run, Continue, Settings, Credits)
- Settings-Scene (Sound, Game, Player Tabs)
- Credits-Scene mit ESC-Rücksprung
- Responsive Scaling (Mac, PC, iOS, Android)
- GameScene mit Player-Bewegung (8-Richtungen, WASD+Pfeiltasten)
- **Hero Warrior Player** (DungeonAssetPack, 64×64, Idle/Run/Attack)
- Wall-Collision (Perimeter + prozedurale Pillars)
- Dust-Partikel beim Laufen + Burst bei Richtungswechsel
- Player-Shadow (Ellipse)
- **Animierte Props**: Bonfire (Raum-Mitte), Candles (bei Pillars)
- **Statische Props**: Barrels, Crates, Chest, Monitors, Tanks
- **Tech-Grid Floor** (subtile Linien auf dunklem Boden)
- **Ambient-Partikel** (schwebende Motes)
- **Vignette-Overlay** (dunkle Ränder für Atmosphäre)
- **PropManager-System** (data-driven Prop-Platzierung mit Cleanup)
- TilesetViewer (?scene=tileset oder T im Menu)
- Crosshair — Custom-Cursor ersetzt OS-Maus, folgt Pointer
- Mouse-Aiming — Player flippt horizontal zur Mausposition
- Shooting-System — Linksklick feuert grüne Energiebolzen (Pupkin Projectiles)
- Projektil-Pool — 20 recycled Sprites, 4 Schüsse/Sek Cooldown
- Projektil-Wandkollision — Bolzen zerstören sich an Wänden mit Spark-Partikeln
- Muzzle Flash — Weisser Kreis bei Schuss-Origin, faded schnell
- Screen Shake — Subtiles Wackeln bei jedem Schuss
- Projektil-Trail — Grüne Partikel hinter fliegenden Bolzen
- Dash — Leertaste, 80px/150ms, 800ms Cooldown, I-Frames während Dash
- Afterimage-Trail — Blaue Ghost-Sprites alle 30ms während Dash
- Alpha-Blink — Player blinkt 0.3↔1.0 während Invulnerabilität
- Dash Dust-Burst — 10 Staubpartikel beim Dash-Start
- Drone Enemy — Green Mucus Chaser (HP=6, speed=60, Kontaktschaden=1)
- Enemy-Basisklasse — HP, Knockback, White-Flash, Hurt-VFX, Freeze-Frame Death
- CombatManager — Zentrale Collision-Wiring, Schaden, Spawning, Player-HP
- Turret Enemy — Witch (HP=9, stationär, Schuss alle 2s mit 0.5s roter Telegraph-Linie)
- Enemy-Projektile — Pool von 15 Cyan-Bolzen (Frames 5-7), Speed 300, Damage 2
- Telegraph-System — Rote pulsierende Linie zeigt Schussrichtung an, locked Angle
- HUD Herzen — 5 prozedurale Herzen (voll/halb/leer), Bounce bei Schaden, Jitter bei ≤3 HP
- Room Clear — Slow-Mo (0.2× für 800ms), Kamera-Flash, "ROOM CLEAR" Gold-Text mit Bounce
- **[NEU] Raum-Transitionen** — 6-Raum-Run (5 Combat + 1 Boss), Türen nach Room Clear
- **[NEU] Prozedurale Raum-Layouts** — 4-7 zufällige Pillars pro Raum, Flood-Fill Pathability-Check
- **[NEU] Door Entity** — Animierte Tür an Wand-Lücke, Bounce-In Reveal, Öffnungs-Animation
- **[NEU] RunState** — Raum-Fortschritt, HP-Persistenz, WallSide-Typ
- **[NEU] Wellen-Skalierung** — Gegner-Anzahl steigt pro Raum (R1:4 → R6:12)
- **[NEU] HUD Raum-Counter** — "X/6" oben rechts
- **[NEU] Victory Scene** — "RUN COMPLETE" nach Raum 6
- **[NEU] In-Scene Room Cycling** — Persistente Objekte überleben Transitionen

## Aktives Ticket
Keins — Freeze-Bugfixes abgeschlossen (2026-03-21)

## T-006 Fortschritt
- [x] **Phase 0**: Asset-Vorbereitung + Konstanten
- [x] **Phase 1**: RunState-System
- [x] **Phase 2**: DungeonGenerator — Wall Gaps, prozedurale Obstacles, Cleanup
- [x] **Phase 3**: Door Entity
- [x] **Phase 4**: RoomClearManager — Door Reveal + Event
- [x] **Phase 5**: CombatManager — Konfigurierbares HP, Wellen-Skalierung, Cleanup
- [x] **Phase 6**: PropManager — Cleanup-Support
- [x] **Phase 7**: GameScene — Raum-Lifecycle Orchestrierung
- [x] **Phase 8**: VictoryScene + Registrierung
- [x] **Phase 9**: HUD — Raum-Counter + HP-Sync
- [x] **Phase 10**: Polish + Edge Cases

## Neue Dateien (Session 2026-03-21, T-006)
- `src/systems/RunState.ts` — WallSide-Typ, oppositeSide(), RunState-Klasse (roomNumber, playerHP, lastExitSide)
- `src/entities/Door.ts` — Arcade.Sprite an Wall-Gap, reveal/open Animation, emits `door-entered`
- `src/scenes/VictoryScene.ts` — "RUN COMPLETE" mit Bounce, R zum Neustarten
- `public/assets/packs/dungeon-asset-pack/props/door2-32x32-Sheet.png` — URL-safe Kopie von door#2

## Geänderte Dateien (Session 2026-03-21, T-006)
- `src/utils/Constants.ts` — ROOMS_PER_RUN, ROOM_W_TILES, ROOM_H_TILES, TILE_DISPLAY
- `src/scenes/BootScene.ts` — Lädt `dap-door` Spritesheet (32×32, 16 Frames)
- `src/systems/DungeonGenerator.ts` — RoomConfig, Wall Gaps, prozedurale Obstacles, Flood-Fill, destroyRoom()
- `src/systems/CombatManager.ts` — initialHP, spawnWave(), cleanup(), Collider-Tracking
- `src/systems/ProjectilePool.ts` — clearAll() hinzugefügt
- `src/systems/RoomClearManager.ts` — Door-Referenz, reveal nach Clear, room-cleared Event
- `src/systems/PropManager.ts` — placeAll() gibt Array zurück, destroyAll()
- `src/scenes/GameScene.ts` — Komplett-Refactor: buildRoom/teardownRoom/transitionToNextRoom
- `src/ui/HUD.ts` — setHP(), setRoomNumber(), Raum-Counter Text
- `src/entities/Player.ts` — cancelDash()
- `src/entities/Enemy.ts` — destroy() Override für Shadow-Cleanup
- `src/entities/enemies/Turret.ts` — override Keyword für destroy()
- `src/main.ts` — VictoryScene registriert

## Bekannte Bugs (behoben)
- **[FIXED] Freeze bei Treffer durch Enemy-Projektil** — Phaser overlap callback argument swap
- **[FIXED] timeScale-Freeze bei Enemy-Tod** — window.setTimeout statt delayedCall
- **[FIXED] Freeze: Player-Tod Re-Hit** — playerDead-Flag verhindert doppelten scene.start()
- **[FIXED] Freeze: timeScale auf zerstörter Scene** — scene.sys.isActive() Check vor Restore
- **[FIXED] Freeze: Destroyed-Object Callbacks** — 12 Stellen mit scene-Existenz-Check abgesichert
- **[FIXED] Freeze: Argument-Swap in Overlaps** — Alle Overlap-Callbacks swap-sicher
- **[FIXED] Freeze: Enemy-Iteration** — Snapshot-Array statt Live-Iteration

## Bekannte Bugs (offen)
- **Floor ist Dark Rectangle + Grid** — Pupkin Floor-Tiles transparent by design
- **Pupkin Player-Sheet unbrauchbar** — Text-Labels eingebacken
- **Menu-SFX fehlen** — menu-select.mp3 und menu-confirm.mp3 existieren nicht

## NICHT ANFASSEN
- `BootScene.ts` Asset-Loading-Reihenfolge — alles hängt davon ab
- `DungeonGenerator.ts` Tile-Indices — manuell verifiziert, nicht raten
- `Player.ts` Hitbox-Werte — abgestimmt auf Hero Warrior 64×64 Sprites
- Pupkin Asset Pack unter `src/Pupkin Tech Dungeon Asset Pack/` — Lizenz-Assets
- **Dateinamen mit # oder Spaces** im DungeonAssetPack → URL-safe Kopien verwenden
