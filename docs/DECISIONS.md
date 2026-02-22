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
