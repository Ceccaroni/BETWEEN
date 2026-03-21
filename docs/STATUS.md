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
- Tech-Dungeon-Raum mit Pupkin Tileset (Wände, Pillars)
- **Hero Warrior Player** (DungeonAssetPack, 64×64, Idle/Run/Attack)
- Wall-Collision (Perimeter + Interior-Pillars)
- Dust-Partikel beim Laufen + Burst bei Richtungswechsel
- Player-Shadow (Ellipse)
- **Animierte Props**: Bonfire (Raum-Mitte), Candles (bei Pillars)
- **Statische Props**: Barrels, Crates, Chest, Monitors, Tanks
- **Tech-Grid Floor** (subtile Linien auf dunklem Boden)
- **Ambient-Partikel** (schwebende Motes)
- **Vignette-Overlay** (dunkle Ränder für Atmosphäre)
- **PropManager-System** (data-driven Prop-Platzierung)
- TilesetViewer (?scene=tileset oder T im Menu)
- **[NEU] Crosshair** — Custom-Cursor ersetzt OS-Maus, folgt Pointer
- **[NEU] Mouse-Aiming** — Player flippt horizontal zur Mausposition
- **[NEU] Shooting-System** — Linksklick feuert grüne Energiebolzen (Pupkin Projectiles)
- **[NEU] Projektil-Pool** — 20 recycled Sprites, 4 Schüsse/Sek Cooldown
- **[NEU] Projektil-Wandkollision** — Bolzen zerstören sich an Wänden mit Spark-Partikeln
- **[NEU] Muzzle Flash** — Weisser Kreis bei Schuss-Origin, faded schnell
- **[NEU] Screen Shake** — Subtiles Wackeln bei jedem Schuss
- **[NEU] Projektil-Trail** — Grüne Partikel hinter fliegenden Bolzen
- **[NEU] Dash** — Leertaste, 80px/150ms, 800ms Cooldown, I-Frames während Dash
- **[NEU] Afterimage-Trail** — Blaue Ghost-Sprites alle 30ms während Dash
- **[NEU] Alpha-Blink** — Player blinkt 0.3↔1.0 während Invulnerabilität
- **[NEU] Dash Dust-Burst** — 10 Staubpartikel beim Dash-Start

## Aktives Ticket
T-005-REBOOT: Schiessen + Erster Gegner + Combat — **Phase 1 abgeschlossen** (2026-03-21)

## T-005 Fortschritt
- [x] **Phase 0**: Crosshair + Schuss-Infrastruktur
- [x] **Phase 1**: Dash mit I-Frames ← HIER
- [ ] Phase 2: Erster Gegner — Drone (Green Mucus, chaser)
- [ ] Phase 3: Zweiter Gegner — Turret (Witch, telegraphed shots)
- [ ] Phase 4: HUD (Herzen) + Raum-Clear

## Nächste Session: Phase 2 (Drone Enemy)
- Green Mucus (64×64, 8 Frames) als Chaser-Enemy
- HP=6, speed=60, Kontaktschaden=1
- Enemy.ts Basisklasse + Drone.ts
- CombatManager.ts für Collision-Wiring
- Hurt-VFX, Knockback, Death-Dissolve
- Neues File: `src/entities/Enemy.ts`, `src/entities/enemies/Drone.ts`, `src/systems/CombatManager.ts`

## Neue Dateien (Session 2026-03-21, T-005 Phase 1)
- `src/effects/Afterimage.ts` — Blaue Ghost-Sprites für Dash-Trail

## Geänderte Dateien (Session 2026-03-21, T-005 Phase 1)
- `src/entities/Player.ts` — dash(), updateTimers(), startIFrames(), getIsInvulnerable(), getIsDashing()
- `src/scenes/GameScene.ts` — Dash-Input (Space), Afterimage-Spawning, Dust-Burst, Schuss-Block während Dash

## Bekannte Bugs
- **Floor ist Dark Rectangle + Grid** — Pupkin Floor-Tiles transparent by design; Rechteck + Grid ist korrekte Lösung
- **Pupkin Player-Sheet unbrauchbar** — Text-Labels eingebacken, als Backup behalten
- **Menu-SFX fehlen** — menu-select.mp3 und menu-confirm.mp3 existieren nicht
- **Noch kein Commit** für Phase 0 — muss noch getestet + committed werden

## NICHT ANFASSEN
- `BootScene.ts` Asset-Loading-Reihenfolge — alles hängt davon ab
- `DungeonGenerator.ts` Tile-Indices — manuell verifiziert, nicht raten
- `Player.ts` Hitbox-Werte — abgestimmt auf Hero Warrior 64×64 Sprites
- Pupkin Asset Pack unter `src/Pupkin Tech Dungeon Asset Pack/` — Lizenz-Assets
- **Dateinamen mit # oder Spaces** im DungeonAssetPack → URL-safe Kopien verwenden (candle2, wooden-barrel)
