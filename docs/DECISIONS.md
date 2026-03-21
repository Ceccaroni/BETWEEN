# DECISIONS.md – Between

## 2025-02-20: Tech Stack
**Entscheid:** Phaser 3 + TypeScript + Vite
**Warum:** Browser-basiert (null Setup-Friction), TypeScript für Struktur, Vite für Hot Reload. Claude Code exzellent mit TypeScript.
**Alternativen verworfen:** Godot (Installation nötig), Pygame (weniger Engine-Features)

## 2025-02-20: Perspektive
**Entscheid:** 3/4-Ansicht (Top-Down mit Tiefe)
**Warum:** Standard für Roguelikes, einfachere Physik als Isometrie, riesige Asset-Auswahl.
**Alternativen verworfen:** Echte Isometrie (zu komplex für Session 1)

## 2025-02-20: Biome-Strategie
**Entscheid:** 6 Dimensionen, Start mit "The Machine"
**Warum:** Pupkin Tech Dungeon liefert komplettes 32x32 Asset Pack (Tiles, Characters, Enemies, Boss, UI, Projektile). Weitere Biome werden inkrementell ergänzt sobald passende Assets gefunden werden. Core-Systeme sind biome-agnostisch.
**Erkenntnis:** Biome brauchen wirklich eigene Tilesets. Shader/Farbfilter allein reichen nicht für radikal verschiedene Welten.

## 2025-02-20: Asset-Strategie
**Entscheid:** 32x32 Pixel Art + Phaser Effekte (Lighting, Particles, Shake)
**Warum:** Grösstes Angebot an Assets in dieser Grösse, mit Post-Processing polierter Indie-Look. Verschiedene Packs pro Biome ist Feature, nicht Bug.
**Start-Assets:** Pupkin Tech Dungeon (£2.99 Vollversion) für "The Machine"

## 2025-02-20: Scene-Flow
**Entscheid:** SplashScene → BootScene → TitleScene → GameScene → GameOverScene
**Warum:** Professioneller Auftritt. Ceccaroni Games Branding zuerst, dann Asset-Loading, dann Spieltitel. Standard in der Industrie.

## 2026-02-20: Auflösung 1280x720
**Entscheid:** Wechsel von 1024x768 auf 1280x720 (16:9)
**Warum:** 16:9 ist der Standard für moderne Displays. Bessere Kompatibilität mit Desktop und Mobile.

## 2026-02-20: Scene-Trennung Title vs Menu
**Entscheid:** TitleScene (reiner Spieltitel) und MenuScene (Navigation) sind separate Scenes
**Warum:** Erlaubt unabhängige Gestaltung von Titel-Animation und Menu-Hintergrund. Titel ist eine Präsentation, Menu ist Interaktion. Können von verschiedenen Personen entwickelt werden.

## 2026-02-20: Fullscreen Artwork statt prozeduraler Hintergründe
**Entscheid:** Splash, Title und Menu nutzen bildschirmfüllende PNG-Artworks
**Warum:** Bessere visuelle Qualität als prozedural generierte Effekte. Artwork (6 Dimensionen, BETWEEN Logo, Ceccaroni Skull) transportiert die Spielidentität stärker. Prozedurale Effekte (Glitch, Dust, Scanlines) waren visuell zu minimalistisch für ein Pixel-Art-Roguelike.
**Vorher:** Liminal-Style mit Runtime-generierten Texturen (verworfen)

## 2026-02-20: Assets in public/ statt src/
**Entscheid:** Alle Assets liegen unter `public/assets/`, nicht unter `src/assets/`
**Warum:** Vite served `public/` als Static Directory. Assets in `src/` würden durch den Bundler laufen und Base64-encoded werden. Für Spritesheets und grosse Bilder ist `public/` der korrekte Ort.

## 2026-02-20: Responsive Scaling
**Entscheid:** Phaser Scale.FIT + CENTER_BOTH, Landscape erzwungen auf Mobile
**Warum:** Spiel muss auf allen Geräten funktionieren. FIT behält Aspect Ratio, CENTER_BOTH zentriert mit Letterbox. Portrait-Overlay auf Mobile statt automatische Rotation (nicht alle Browser unterstützen screen.orientation.lock).

## 2026-02-20: AudioSystem als zentrale Klasse
**Entscheid:** Eigene AudioSystem-Klasse statt direkte Phaser-Sound-Calls
**Warum:** Fade-In/Out-Logik, Volume-Management und graceful Handling fehlender Audio-Files an einem Ort. Jede Scene instanziert AudioSystem und nutzt einheitliches API.

## 2026-02-21: Tilemap Layer-Scale statt Camera-Zoom
**Entscheid:** Tiles 32×32 intern, Layer `setScale(2)` → 64×64 Display. Kein Camera-Zoom.
**Warum:** Camera-Zoom 2× reduziert den sichtbaren Bereich auf 640×360, was bei einem 20×11 Raum (640×352) die Ränder abschneidet. Layer-Scale hält die Camera bei 1280×720 und vergrössert nur die Tiles. Raum 20×11 × 64 = 1280×704 füllt den Screen fast komplett.
**Alternativen verworfen:** Camera zoom 2× (schnitt Wände ab), native 64×64 Tiles (gibt es nicht im Pack)

## 2026-02-21: Player-Wechsel FreeKnight → Hero Wizard
**Entscheid:** Hero Wizard (DungeonAssetPack + KI-generierte High-Res Sheets) ersetzt FreeKnight
**Warum:** FreeKnight war ein Platzhalter. Das DungeonAssetPack enthält einen Hero Wizard der thematisch zum Spiel passt. Die originale 64×64 Version hatte fast identische Frames (Mantel verdeckte Bewegung). Lösung: High-Res Spritesheets (352×384 pro Frame) via Gemini generiert, mit Python/PIL verarbeitet (Background-Removal, Blob-Detection, Scale-Matching).
**Vorher:** FreeKnight_v1 (120×80 Frames, 8 separate PNGs)
**Nachher:** Hero Wizard Idle (2112×768, 12 Frames) + Run (2816×1536, 32 Frames)
**FreeKnight bleibt vorerst** in `public/assets/characters/player/`, kann aufgeräumt werden.

## 2026-02-21: Spritesheet-Verarbeitung mit Blob-Detection
**Entscheid:** Connected-Component-Analyse (BFS Flood Fill) statt festes Grid für Idle-Sheet
**Warum:** Das KI-generierte Idle-Sheet hatte Charaktere in unregelmässigen Positionen (~365×520px pro Charakter), die nicht auf das 352×384 Grid des Run-Sheets passten. Festes Slicing schnitt Charaktere in der Mitte durch. Blob-Detection findet die tatsächlichen Charakter-Bounding-Boxes, skaliert sie auf die Run-Charakter-Grösse (188×293px) und platziert sie zentriert in sauberen 352×384 Frames.
**Ergebnis:** Idle und Run Sheets haben jetzt identische Frame-Grössen und konsistente Charakter-Proportionen.

## 2026-02-22: Player-Charakter — finaler Entscheid
**Entscheid:** Hero Wizard bleibt der Spieler-Charakter. Kein weiterer Wechsel.
**Warum:** High-Res Spritesheets (352×384) funktionieren, Idle + Run sind sauber, Adrian liefert bei Bedarf weitere Posen (Attack, Death, Dash etc.). FreeKnight-Assets nach `_unused/` verschoben.

## 2026-02-22: Enemies — DungeonAssetPack (64×64)
**Entscheid:** Gegner kommen aus dem DungeonAssetPack, 64×64 Sprites mit sauberen Sheets.
**Warum:** Einheitlicher Stil, keine eingebackenen Text-Labels wie beim Pupkin Player-Sheet. Grössere Sprites passen besser zum Hero Wizard.

## 2026-02-22: Floor-Rendering — Solid Color + Noise
**Entscheid:** Floor ist Solid Color (`0x12121e`), später ergänzt durch ein Noise-Pattern.
**Warum:** Pupkin Floor-Tiles sind transparent by design. Solid Rectangle ist die korrekte Lösung, kein Bug. Noise-Pattern kommt als visuelles Upgrade, wenn die Basis steht.

## 2026-02-22: Wall-Tiles — manuell per TilesetViewer gewählt
**Entscheid:** Wall-Tile-Indices werden manuell über den TilesetViewer identifiziert und in `DungeonGenerator.ts` hartcodiert.
**Warum:** Kein automatisches Matching möglich — welche Tiles gut aussehen ist eine Design-Entscheidung. TilesetViewer (`?scene=tileset` / T-Taste) zeigt alle Tiles mit (col,row)-Index.

## 2026-02-22: Tile-Grösse — 32×32 base, Scale 2×
**Entscheid:** Tiles bleiben 32×32 aus dem Pack. Display über `layer.setScale(2)` → 64×64 im Spiel.
**Warum:** Pack liefert nur 32×32. Camera-Zoom schneidet Ränder ab (siehe Entscheid 2026-02-21). Layer-Scale ist die saubere Lösung.

## 2026-02-22: Inaktive Assets — _unused/ Ordner
**Entscheid:** Nicht mehr genutzte Assets werden nach `public/assets/_unused/` verschoben statt gelöscht.
**Warum:** Assets könnten später für andere Biome oder als Referenz nützlich sein. Löschen ist irreversibel, Verschieben nicht.

## 2026-03-21: Player-Wechsel Hero Wizard → Hero Warrior (DungeonAssetPack)
**Entscheid:** Hero Wizard (352×384, AI-generiert, Scale 0.35) ersetzt durch Hero Warrior (64×64, Pixel-Art, Scale 1:1)
**Warum:** Der High-Res Hero Wizard passte stilistisch nicht zum 32×32 Pupkin Pixel-Art Tileset — zwei verschiedene visuelle Welten. Der DungeonAssetPack Hero Warrior ist native 64×64, was exakt der Display-Größe der Tiles (32×32 × 2× Scale) entspricht. Kein Skalierungs-Hack mehr nötig.
**Hero Wizard bleibt** als Backup in BootScene.ts auskommentiert + Sprites in public/assets/characters/hero-wizard/.

## 2026-03-21: Twin-Stick Shooting mit Maus-Aiming
**Entscheid:** Bewegung WASD, Zielen mit Maus, Schiessen mit Linksklick. Player flippt horizontal zur Maus.
**Warum:** Nuclear Throne / Gungeon Stil. Maus-Aiming ist präziser als "letzte Bewegungsrichtung" (Binding of Isaac). Twin-Stick ist der Standard für Top-Down Shooter-Roguelikes.
**Alternativen verworfen:** Richtungs-basiertes Schiessen (ungenau), Auto-Aim (langweilig)

## 2026-03-21: Pupkin Projectiles für Spieler-Bolzen
**Entscheid:** Pupkin `projectiles.png` Frames 0-2 (grüne Energie-Dashes) als Spieler-Projektile, Frames 5-7 (cyan) für Gegner-Projektile.
**Warum:** Bereits geladen in BootScene, 32×32 bei 2× Scale = 64px Display, farblich unterscheidbar (grün = Spieler, cyan = Gegner). DungeonAssetPack Arrow (32×32 Einzelbild) als Alternative nicht animiert.

## 2026-03-21: Projektil Object Pool (20 Sprites)
**Entscheid:** Pool von 20 vorinstanziierten Projektilen, recycled via activate/deactivate.
**Warum:** Performance — kein `new Sprite()` bei jedem Schuss. Bei 4 Schüssen/Sek und 2s Lebenszeit sind max 8 gleichzeitig aktiv, 20 gibt grosszügigen Buffer.

## 2026-03-21: Custom Crosshair (programmatisch)
**Entscheid:** Crosshair wird per Phaser Graphics gezeichnet (weisses Kreuz mit Center-Gap), kein Sprite-Asset.
**Warum:** Sofort verfügbar, keine Asset-Abhängigkeit, gut sichtbar auf dunklem Dungeon-Boden. Pupkin UI-Sheet hätte passende Icons aber Identifikation der richtigen Frames unsicher.

## 2026-03-21: DungeonAssetPack Enemies für Combat (64×64)
**Entscheid:** Green Mucus als "Drone" (Chaser), Witch als "Turret" (Stationary Shooter). Beide 64×64, 8 Frames.
**Warum:** Gleiche Pixel-Art-Qualität wie Hero Warrior, passende Grösse (1:1 mit Player). Pupkin Enemies (32×32) wären bei 2× Scale visuell ok, aber DungeonAssetPack hat mehr Charakter-Vielfalt und bessere Lesbarkeit.

## 2026-03-21: DungeonAssetPack als primäre Charakter/Prop-Quelle
**Entscheid:** Characters, Enemies und Props kommen primär aus dem DungeonAssetPack, Tileset bleibt Pupkin.
**Warum:** DungeonAssetPack hat 24 Enemy-Typen (64×64), animierte Props (Bonfire, Candles, Chest, Doors, Traps), VFX (Slash, Hurt, Explosion), GUI-Elemente. Alles im gleichen Pixel-Art-Stil. Kombiniert mit Pupkin-Tileset für die Welt ergibt das ein kohärentes Gesamtbild.

## 2026-03-21: PropManager als eigenes System
**Entscheid:** Prop-Platzierung und Animationen in eigene Klasse `src/systems/PropManager.ts` extrahiert.
**Warum:** GameScene.ts drohte das 200-Zeilen-Limit zu überschreiten. Data-driven Ansatz (Arrays mit Prop-Definitionen) statt hartcodierter Platzierung. Ermöglicht später einfaches Hinzufügen neuer Props oder Room-Templates.

## 2026-03-21: URL-safe Asset-Kopien
**Entscheid:** Assets mit `#` oder Spaces im Dateinamen werden als URL-safe Kopien angelegt.
**Warum:** `#` in URLs wird als Fragment-Identifier interpretiert, Browser lädt falsche Datei. `candle#2-32x32-Sheet.png` → `candle2-32x32-Sheet.png`, `wooden barrel.png` → `wooden-barrel.png`. Originale bleiben erhalten, Code referenziert nur die Kopien.

## 2026-03-21: Dash-Mechanik — Richtungs-basiert mit Fallback
**Entscheid:** Dash geht in WASD-Richtung. Ohne Input: Dash in Blickrichtung (flipX).
**Warum:** Spieler will instinktiv "weg vom Gegner" dashes — Bewegungsrichtung ist intuitiver als Mausrichtung. Fallback auf Blickrichtung verhindert "Dash auf der Stelle" wenn man still steht.
**Alternativen verworfen:** Mausrichtungs-Dash (zu unintuitiv), Doppeltipp-Richtung (zu langsam)

## 2026-03-21: I-Frames — einheitliches System für Dash und Hit
**Entscheid:** `startIFrames()` wird sowohl vom Dash als auch von Kontaktschaden aufgerufen. Gleiche Dauer (500ms), gleicher Blink-Effekt.
**Warum:** Einheitliches System statt separate Invulnerability-Tracker. Dash gewährt automatisch I-Frames (wie in Nuclear Throne / Enter the Gungeon). Späterer Hit-iFrame nutzt den gleichen Code.

## 2026-03-21: Freeze-Frame via window.setTimeout
**Entscheid:** Hitstop bei Enemy-Kill nutzt `window.setTimeout` statt `scene.time.delayedCall` für die timeScale-Wiederherstellung.
**Warum:** `scene.time.delayedCall` wird von `scene.time.timeScale` beeinflusst — bei 0.05× timeScale dauert ein 80ms-Delay 1600ms real. Schlimmer: wenn das Enemy-Sprite vor Ablauf des Delays destroyed wird, wird timeScale nie zurückgesetzt → permanenter Freeze. `window.setTimeout` läuft auf Wall-Clock-Time und ist immun gegen Phaser's timeScale.
**Bug gefixed:** Erster Versuch mit `scene.time.timeScale = 0.1` + `delayedCall(80)` fror das Spiel beim ersten Enemy-Kill dauerhaft ein.

## 2026-03-21: Enemy-Architektur — Abstrakte Basisklasse
**Entscheid:** `Enemy.ts` als abstrakte Klasse, konkrete Enemies (Drone, Turret) erben davon.
**Warum:** Gemeinsame Logik (HP, Knockback, Flash, Death-VFX, Shadow) wird einmal geschrieben. Jeder Enemy-Typ implementiert nur `updateAI()`. Skaliert auf 24+ Enemy-Typen im DungeonAssetPack.

## 2026-03-21: CombatManager als zentrales System
**Entscheid:** Alle Kampf-Kollisionen und Schadens-Logik in `CombatManager.ts`, nicht in GameScene.
**Warum:** GameScene drohte das 200-Zeilen-Limit zu überschreiten. CombatManager kapselt: Projectile↔Enemy, Player↔Enemy, Enemy↔Wall, Enemy↔Enemy Kollisionen. Verwaltet Player-HP und Enemy-Spawning zentral.

## 2026-03-21: Floor-Grid statt Noise-Pattern
**Entscheid:** Subtile Tech-Grid-Linien (1px, 0x334466, alpha 0.1) statt geplantes Noise-Pattern.
**Warum:** Grid-Linien passen besser zur "Machine"-Ästhetik. Programmatisch einfach (Phaser Graphics), kein zusätzliches Asset nötig. Depth 0.5 (über Floor-Rechteck, unter Walls).

## 2026-03-21: Atmosphäre-Effekte
**Entscheid:** Ambient-Partikel (schwebende Motes) + Vignette-Overlay in GameScene.
**Warum:** Juice Policy verlangt Maximum bei visuellen Features. Motes erzeugen lebendige Atmosphäre, Vignette fokussiert den Blick auf die Raum-Mitte. Beide sind performance-günstig (wenige Partikel, statische Graphics).

## 2026-03-21: Turret-Telegraph via Graphics statt Sprite
**Entscheid:** Telegraph-Linie wird mit Phaser Graphics gezeichnet (rote Linie, pulsierender Alpha 0.3-0.8), nicht als Sprite.
**Warum:** Flexible Länge/Rotation, kein Extra-Asset nötig. Pulsierender Alpha macht die Intention klar ohne den Bildschirm zu dominieren. Winkel wird bei Telegraph-Start gelockt — Spieler kann ausweichen.

## 2026-03-21: EnemyProjectilePool als separates System
**Entscheid:** Eigener Pool für Gegner-Projektile (15 Sprites) statt gemeinsamer Pool mit Spieler.
**Warum:** Farblich unterscheidbar (cyan vs. grün), unterschiedliche Geschwindigkeit (300 vs. 500), separate Kollisions-Logik (trifft Spieler, nicht Gegner). `clearAll()` kann bei Room Clear nur Gegner-Projektile entfernen.

## 2026-03-21: HUD-Herzen prozedural gezeichnet
**Entscheid:** Herzen werden per Phaser Graphics gezeichnet (2 Kreise + Dreieck), nicht als Sprite-Asset.
**Warum:** Kein Asset-Abhängigkeit, dynamische Farb-Zustände (voll=rot, halb=halbiert, leer=dunkel) ohne mehrere Sprites. Bounce- und Jitter-Effekte direkt auf dem Graphics-Objekt via Tweens.

## 2026-03-21: Room Clear via window.setTimeout für Slow-Mo
**Entscheid:** Slow-Mo bei Room Clear nutzt `window.setTimeout` für timeScale-Wiederherstellung (gleich wie Enemy-Death Freeze-Frame).
**Warum:** Konsistenz mit bestehendem Freeze-Frame-Pattern. `scene.time.delayedCall` ist von `timeScale` betroffen und würde den Slow-Mo verlängern. Bewährtes Pattern aus Phase 2.

## 2026-03-21: Event-basierte HUD-Aktualisierung
**Entscheid:** CombatManager emittiert `player-hp-changed` Event, HUD hört darauf.
**Warum:** Lose Kopplung — HUD muss CombatManager nicht kennen und umgekehrt. Phaser Events sind performant und erlauben beliebig viele Listener (z.B. später Sound-Effekte bei Schaden).

## 2026-03-21: In-Scene Room Cycling statt Scene Restart
**Entscheid:** Raum-Transitionen durch Destroy/Rebuild innerhalb von GameScene, nicht via `scene.restart()`.
**Warum:** `scene.restart()` zerstört ALLE Objekte inkl. Player, HUD, InputSystem, Projectile Pools. Das erfordert Serialisierung/Deserialisierung von Player-State (HP, Dash-Timer, I-Frames) über Scene-Data. In-Scene Cycling trennt persistente Objekte (Player, HUD, Pools) von per-Room Objekten (Tilemap, Enemies, Props, Door) und recycled erstere.
**Risiko:** Collider-Leaks, Event-Listener-Leaks, Tilemap-Name-Kollisionen. Mitigiert durch explizites Collider-Tracking, `cleanup()`-Methoden, und unique Layer-Namen.

## 2026-03-21: Prozedurale Raum-Layouts mit Flood-Fill
**Entscheid:** 4-7 zufällige Pillar-Positionen pro Raum, validiert durch BFS Flood-Fill.
**Warum:** Spieler wählte "Procedural layouts" für maximale Wiederspielbarkeit. Fixed Layouts (Templating) wäre einfacher aber repetitiv. Flood-Fill garantiert dass Entry-Gap und Exit-Gap immer erreichbar sind — kein softlock möglich.
**Alternativen verworfen:** Feste 4-Pillar-Positionen (monoton), Wave Function Collapse (overengineered für 20×11 Räume)

## 2026-03-21: Linearer Run mit randomisierter Exit-Wand
**Entscheid:** 6 Räume linear (kein Branching), aber Exit-Tür auf zufälliger Wand (verschieden von Entry).
**Warum:** Linear ist einfach für erste Implementierung, randomisierte Wand-Seite gibt trotzdem Abwechslung in der Bewegungsrichtung. Entry ist immer gegenüber dem vorherigen Exit.
**Alternativen verworfen:** Immer rechts raus (monoton), 4-Direktionales Grid (zu komplex für V1)

## 2026-03-21: Door Asset — door#2 (32×32, 16 Frames)
**Entscheid:** `door#2_32x32-Sheet.png` als Tür-Sprite, URL-safe kopiert zu `door2-32x32-Sheet.png`.
**Warum:** 32×32 bei 2× Scale = 64×64 Display, passt exakt in eine Tile-Position. 16-Frame Öffnungs-Animation gibt gutes visuelles Feedback. door#1 (32×64, 2 Tiles hoch) wäre für Side-Walls gut aber inkonsistent mit Top/Bottom-Walls.
