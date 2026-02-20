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
