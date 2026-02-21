# Asset Registry – Pupkin Tech Dungeon + Weitere Packs

Generiert am: 2026-02-21
Methode: Pixel-Dimensionen per `sips` gelesen, Cell-Sizes aus Pack-Dokumentation berechnet

## Quellen

| Pack | Lokaler Ordner | Lizenz |
|------|---------------|--------|
| Pupkin Tech Dungeon Roguelite | `pupkin/` | Frei + Kommerziell, kein Weiterverkauf |
| DungeonAssetPack | `public/assets/packs/dungeon-asset-pack/` | itch.io |
| 32rogues | `public/assets/packs/32rogues/` | Seth Boyles, itch.io |
| 32rogues-2 | `public/assets/packs/32rogues-2/` | Seth Boyles, itch.io |
| 32x32 Dungeon Pack | `public/assets/packs/dungeon-pack/` | itch.io |
| Hero Wizard | `public/assets/characters/hero-wizard/` | DungeonAssetPack |
| FreeKnight v1 | `public/assets/characters/player/` | itch.io |

---

## 1. Characters

### 1a. Hero Wizard (AKTIVER PLAYER)

Quelle: DungeonAssetPack. Frame-Grösse aus Bild-Dimensionen und bekannter Frame-Anzahl abgeleitet.

| Datei | Pfad | Dimensionen | Cell-Size | Frames (S x R) | Inhalt |
|-------|------|-------------|-----------|-----------------|--------|
| hero-wizard-run.png | public/assets/characters/hero-wizard/ | 2816 x 1536 | 352 x 384 | 8 x 4 = 32 | Run-Animation |
| hero-wizard-idle.png | public/assets/characters/hero-wizard/ | 2112 x 768 | 352 x 384 | 6 x 2 = 12 | Idle-Animation |
| hero-wizard.png | public/assets/characters/hero-wizard/ | 512 x 64 | 64 x 64 | 8 x 1 = 8 | Alt: Idle+Run (INAKTIV) |

### 1b. FreeKnight v1 (BACKUP/INAKTIV)

Quelle: FreeKnight_v1 (itch.io). Alle Sheets haben konsistent 120 x 80 Cell-Size.

| Datei | Pfad | Dimensionen | Cell-Size | Frames (S x R) | Inhalt |
|-------|------|-------------|-----------|-----------------|--------|
| freeknight-idle.png | public/assets/characters/player/ | 1200 x 80 | 120 x 80 | 10 x 1 = 10 | Idle (atmend) |
| freeknight-run.png | public/assets/characters/player/ | 1200 x 80 | 120 x 80 | 10 x 1 = 10 | Run |
| freeknight-attack.png | public/assets/characters/player/ | 480 x 80 | 120 x 80 | 4 x 1 = 4 | Attack |
| freeknight-death.png | public/assets/characters/player/ | 1200 x 80 | 120 x 80 | 10 x 1 = 10 | Death |
| freeknight-dash.png | public/assets/characters/player/ | 240 x 80 | 120 x 80 | 2 x 1 = 2 | Dash |
| freeknight-hit.png | public/assets/characters/player/ | 120 x 80 | 120 x 80 | 1 x 1 = 1 | Hit reaction |
| freeknight-jump.png | public/assets/characters/player/ | 360 x 80 | 120 x 80 | 3 x 1 = 3 | Jump |
| freeknight-fall.png | public/assets/characters/player/ | 360 x 80 | 120 x 80 | 3 x 1 = 3 | Fall |

### 1c. Pupkin Players

Quelle: Pupkin Pack. Cell-Datei: `8x13 Cells.txt` -> 8 Spalten x 13 Reihen.
Cell-Size: **40 x 32** (320 / 8 = 40, 416 / 13 = 32).

> ReadMe sagt "Players (32x32)" — das ist die CHARACTER-Grösse innerhalb der Zelle.
> Die Cells sind 40 x 32 weil Text-Labels im Spritesheet Platz brauchen.
> ACHTUNG: Jede Reihe enthält Sprite-Frames UND rote Text-Labels. Nur Sprite-Frames verwenden!

| Datei | Pfad | Dimensionen | Cell-Size | Frames (S x R) | Inhalt |
|-------|------|-------------|-----------|-----------------|--------|
| players blue x1.png | pupkin/Players/ | 320 x 416 | 40 x 32 | 8 x 13 | Spieler blau (x1) |
| players blue x2.png | pupkin/Players/ | 640 x 832 | 80 x 64 | 8 x 13 | Spieler blau (x2) |
| players blue x3.png | pupkin/Players/ | 960 x 1248 | 120 x 96 | 8 x 13 | Spieler blau (x3) |
| players green x1.png | pupkin/Players/ | 320 x 416 | 40 x 32 | 8 x 13 | Spieler gruen (x1) |
| players green x2.png | pupkin/Players/ | 640 x 832 | 80 x 64 | 8 x 13 | Spieler gruen (x2) |
| players green x3.png | pupkin/Players/ | 960 x 1248 | 120 x 96 | 8 x 13 | Spieler gruen (x3) |
| players grey x1.png | pupkin/Players/ | 320 x 416 | 40 x 32 | 8 x 13 | Spieler grau (x1) |
| players grey x2.png | pupkin/Players/ | 640 x 832 | 80 x 64 | 8 x 13 | Spieler grau (x2) |
| players grey x3.png | pupkin/Players/ | 960 x 1248 | 120 x 96 | 8 x 13 | Spieler grau (x3) |
| players red x1.png | pupkin/Players/ | 320 x 416 | 40 x 32 | 8 x 13 | Spieler rot (x1) |
| players red x2.png | pupkin/Players/ | 640 x 832 | 80 x 64 | 8 x 13 | Spieler rot (x2) |
| players red x3.png | pupkin/Players/ | 960 x 1248 | 120 x 96 | 8 x 13 | Spieler rot (x3) |

"No Outlines"-Varianten: Identische Dimensionen, ohne Outline-Pixel. Vorhanden fuer alle 4 Farben in x1/x2/x3.

#### Pupkin Player Frame-Map (verifiziert via `docs/player-frame-grid.png`)

**Variante 1 (Row 0-5), Gun:**
| Row | Sprite-Frames | Label-Frames | Animation |
|-----|---------------|--------------|-----------|
| 0 | F0 (1 Frame) | F1="Idle", F3="No Gun" | Idle (Gun) — statisch |
| 0 | F2 (1 Frame) | — | Idle (No Gun) — statisch |
| 1 | F8, F9 (2 Frames) | F10="Talk" | Talk (Gun) |
| 1 | F11 (1 Frame) | F12="No Gun" | Talk (No Gun) |
| 2 | F16, F17, F18, F19 (4 Frames) | F20="Reload" | Reload |
| 3 | F24, F25, F26 (3 Frames) | F27="Run" | Run (Gun) |
| 3 | F28, F29, F30 (3 Frames) | F31="No Gun" | Run (No Gun) |
| 4 | F32, F33, F34 (3 Frames) | F35="Shoot" | Shoot |
| 5 | F40, F41, F42, F43, F44 (5 Frames) | F46="Death" | Death |

Row 6: LEER (Gap). Variante 2 (Row 7-12): Gleiche Struktur, Frame-Offset +56.

### 1d. Pupkin NPC

Cell-Datei: `6x3 Cells.txt` -> 6 Spalten x 3 Reihen.
Cell-Size: **32 x 32** (192 / 6 = 32, 96 / 3 = 32).

| Datei | Pfad | Dimensionen | Cell-Size | Frames (S x R) | Inhalt |
|-------|------|-------------|-----------|-----------------|--------|
| npc x1.png | pupkin/NPC/ | 192 x 96 | 32 x 32 | 6 x 3 | NPC (x1) |
| npc x2.png | pupkin/NPC/ | 384 x 192 | 64 x 64 | 6 x 3 | NPC (x2) |
| npc x3.png | pupkin/NPC/ | 576 x 288 | 96 x 96 | 6 x 3 | NPC (x3) |

"No Outlines"-Varianten: Identische Dimensionen. Vorhanden in x1/x2/x3.
Animationen laut ReadMe: Idle1, Idle2, Talk.

### 1e. DungeonAssetPack Heroes

| Datei | Pfad | Dimensionen | Cell-Size | Frames (S x R) | Inhalt |
|-------|------|-------------|-----------|-----------------|--------|
| hero-warrior.png | public/assets/packs/dungeon-asset-pack/hero/ | 576 x 64 | 64 x 64 | 9 x 1 = 9 | Warrior Spritesheet |
| hero-ranger.png | public/assets/packs/dungeon-asset-pack/hero/ | 512 x 64 | 64 x 64 | 8 x 1 = 8 | Ranger Spritesheet |
| arrow.png | public/assets/packs/dungeon-asset-pack/hero/ | 32 x 32 | — | 1 (Einzelbild) | Pfeil-Projektil |

---

## 2. Tilesets

### 2a. Pupkin Tileset

ReadMe: "Tileset (32x32)". Tile-Size: **32 x 32**.
Grid: 37 Spalten x 23 Reihen (1184 / 32 = 37, 736 / 32 = 23).

| Datei | Pfad | Dimensionen | Tile-Size | Tiles (S x R) | Inhalt |
|-------|------|-------------|-----------|----------------|--------|
| tileset x1.png | pupkin/ | 1184 x 736 | 32 x 32 | 37 x 23 | Tech-Dungeon Tileset (x1) |
| tileset x2.png | pupkin/ | 2368 x 1472 | 64 x 64 | 37 x 23 | Tech-Dungeon Tileset (x2) |
| tileset x3.png | pupkin/ | 3552 x 2208 | 96 x 96 | 37 x 23 | Tech-Dungeon Tileset (x3) |

Kopie in Projekt: `public/assets/tilesets/machine/tileset.png` (1184 x 736, identisch mit x1).

### 2b. 32rogues Tiles

Cell-Size: **32 x 32** (aus Pack-Name).

| Datei | Pfad | Dimensionen | Tile-Size | Tiles (S x R) | Inhalt |
|-------|------|-------------|-----------|----------------|--------|
| tiles.png | public/assets/packs/32rogues/ | 672 x 768 | 32 x 32 | 21 x 24 | Dungeon-Tiles |
| tiles.png | public/assets/packs/32rogues-2/ | 544 x 832 | 32 x 32 | 17 x 26 | Dungeon-Tiles (erweitert) |
| autotiles.png | public/assets/packs/32rogues-2/ | 384 x 256 | 32 x 32 | 12 x 8 | Autotiles |
| animated-tiles.png | public/assets/packs/32rogues-2/ | 352 x 384 | 32 x 32 | 11 x 12 | Animierte Tiles |

### 2c. 32x32 Dungeon Pack

Tile-Size: **32 x 32** (aus Pack-Name). Einzelne Tile-Dateien + Master-Sheet.

| Datei | Pfad | Dimensionen | Tile-Size | Tiles (S x R) | Inhalt |
|-------|------|-------------|-----------|----------------|--------|
| Sheet.png | public/assets/packs/dungeon-pack/ | 192 x 192 | 32 x 32 | 6 x 6 | Master-Sheet |
| Dungeon_00.png bis Dungeon_35.png | public/assets/packs/dungeon-pack/ | 32 x 32 | — | je 1 (Einzelbild) | 36 individuelle Tiles |
| Dungeon_20+21.png | public/assets/packs/dungeon-pack/ | 32 x 64 | — | 1 (Einzelbild) | Kombiniertes 1x2-Tile |
| Dungeon_20+22.png | public/assets/packs/dungeon-pack/ | 32 x 64 | — | 1 (Einzelbild) | Kombiniertes 1x2-Tile |
| Dungeon_23-25.png | public/assets/packs/dungeon-pack/ | 64 x 64 | — | 1 (Einzelbild) | Kombiniertes 2x2-Tile |
| Preview.png | public/assets/packs/dungeon-pack/ | 768 x 768 | — | — | Vorschaubild (kein Game-Asset) |

### 2d. DungeonAssetPack Tilemap

| Datei | Pfad | Dimensionen | Tile-Size | Tiles (S x R) | Inhalt |
|-------|------|-------------|-----------|----------------|--------|
| tiles_map.png | public/assets/packs/dungeon-asset-pack/props/ | 655 x 793 | UNKLAR | UNKLAR | 655 und 793 sind NICHT durch 32 teilbar. Irregulares Layout oder Padding. |

---

## 3. Props / Animated Objects

### 3a. Pupkin Props and Items

Cell-Datei: `24x22 Cells.txt` -> 24 Spalten x 22 Reihen.
Cell-Size: **32 x 32** (768 / 24 = 32, 704 / 22 = 32).

| Datei | Pfad | Dimensionen | Cell-Size | Frames (S x R) | Inhalt |
|-------|------|-------------|-----------|-----------------|--------|
| props and items x1.png | pupkin/Props and Items/ | 768 x 704 | 32 x 32 | 24 x 22 | Animierte Props + Items (x1) |
| props and items x2.png | pupkin/Props and Items/ | 1536 x 1408 | 64 x 64 | 24 x 22 | Animierte Props + Items (x2) |
| props and items x3.png | pupkin/Props and Items/ | 2304 x 2112 | 96 x 96 | 24 x 22 | Animierte Props + Items (x3) |

Kopie in Projekt: `public/assets/props/machine/props.png` (768 x 704, identisch mit x1).

### 3b. DungeonAssetPack Props

Cell-Sizes aus Dateinamen abgeleitet. Alle Dimensionen per `sips` verifiziert.

| Datei | Pfad | Dimensionen | Cell-Size | Frames | Inhalt |
|-------|------|-------------|-----------|--------|--------|
| chest-32x32-Sheet.png | .../dungeon-asset-pack/props/ | 320 x 32 | 32 x 32 | 10 | Truhe (oeffnen) |
| bonfire-32x32-Sheet.png | .../dungeon-asset-pack/props/ | 256 x 32 | 32 x 32 | 8 | Lagerfeuer |
| candle-32x32-Sheet.png | .../dungeon-asset-pack/props/ | 256 x 32 | 32 x 32 | 8 | Kerze #1 |
| candle#2-32x32-Sheet.png | .../dungeon-asset-pack/props/ | 256 x 32 | 32 x 32 | 8 | Kerze #2 |
| switch-32x32-Sheet.png | .../dungeon-asset-pack/props/ | 256 x 32 | 32 x 32 | 8 | Schalter |
| door#1_32x64-Sheet.png | .../dungeon-asset-pack/props/ | 640 x 64 | 32 x 64 | 20 | Tuer #1 (2 Tiles hoch) |
| door#2_32x32-Sheet.png | .../dungeon-asset-pack/props/ | 512 x 32 | 32 x 32 | 16 | Tuer #2 |
| lockeddoor#1-32x32-Sheet.png | .../dungeon-asset-pack/props/ | 480 x 32 | 32 x 32 | 15 | Verschlossene Tuer #1 |
| lockeddoor#2_32x32-Sheet.png | .../dungeon-asset-pack/props/ | 480 x 32 | 32 x 32 | 15 | Verschlossene Tuer #2 |
| statue#1-64x80-Sheet.png | .../dungeon-asset-pack/props/ | 384 x 80 | 64 x 80 | 6 | Statue #1 |
| statue#2_32x64-Sheet.png | .../dungeon-asset-pack/props/ | 192 x 64 | 32 x 64 | 6 | Statue #2 |
| drainpipe-32x64-Sheet.png | .../dungeon-asset-pack/props/ | 192 x 64 | 32 x 64 | 6 | Abflussrohr |
| trap#1.png | .../dungeon-asset-pack/props/ | 512 x 32 | 32 x 32 | 16 | Falle #1 |
| trap#2.png | .../dungeon-asset-pack/props/ | 512 x 32 | 32 x 32 | 16 | Falle #2 |
| keys-Sheet.png | .../dungeon-asset-pack/props/ | 96 x 32 | 32 x 32 | 3 | Schluessel |
| Venom.png | .../dungeon-asset-pack/props/ | 192 x 32 | 32 x 32 | 6 | Gift-Animation |
| water_sprite.png | .../dungeon-asset-pack/props/ | 128 x 32 | 32 x 32 | 4 | Wasser-Sprite |
| water#1.png | .../dungeon-asset-pack/props/ | 960 x 32 | 32 x 32 | 30 | Wasser-Animation #1 |
| water#2.png | .../dungeon-asset-pack/props/ | 960 x 32 | 32 x 32 | 30 | Wasser-Animation #2 |
| Table#1.png | .../dungeon-asset-pack/props/ | 32 x 64 | — | 1 (Einzelbild) | Tisch (1x2 Tiles) |
| wooden barrel.png | .../dungeon-asset-pack/props/ | 32 x 32 | — | 1 (Einzelbild) | Holzfass |
| wooden_barrel#2.png | .../dungeon-asset-pack/props/ | 32 x 32 | — | 1 (Einzelbild) | Holzfass Variante |
| wooden_barrel_#2.png | .../dungeon-asset-pack/props/ | 32 x 32 | — | 1 (Einzelbild) | Holzfass Variante (Tippfehler?) |
| cargo_box.png | .../dungeon-asset-pack/props/ | 32 x 32 | — | 1 (Einzelbild) | Kiste |

### 3c. 32rogues Items

| Datei | Pfad | Dimensionen | Cell-Size | Frames (S x R) | Inhalt |
|-------|------|-------------|-----------|-----------------|--------|
| items.png | public/assets/packs/32rogues/ | 256 x 704 | 32 x 32 | 8 x 22 | Equipment + Items |
| items.png | public/assets/packs/32rogues-2/ | 352 x 832 | 32 x 32 | 11 x 26 | Items (erweitert) |
| items-palette-swaps.png | public/assets/packs/32rogues-2/ | 256 x 1376 | 32 x 32 | 8 x 43 | Item-Farbvarianten |

---

## 4. Enemies

### 4a. Pupkin Enemies

Cell-Datei: `10x38 Cells.txt` -> 10 Spalten x 38 Reihen.
Cell-Size: **32 x 32** (320 / 10 = 32, 1216 / 38 = 32).
Animationen laut ReadMe: Idle1, Idle2, Activate, Run, Shoot, Death, Spawn Idle, Spawn Death.
5 Gegnertypen + Flying Bug (laut `+ Update.txt`).

> Enthält Text-Labels aehnlich wie Player-Sheet. Frame-Mapping pro Enemy-Typ steht aus.

| Datei | Pfad | Dimensionen | Cell-Size | Frames (S x R) | Inhalt |
|-------|------|-------------|-----------|-----------------|--------|
| enemies x1.png | pupkin/Enemies/ | 320 x 1216 | 32 x 32 | 10 x 38 | 5 Enemy-Typen + Bug (x1) |
| enemies x2.png | pupkin/Enemies/ | 640 x 2432 | 64 x 64 | 10 x 38 | 5 Enemy-Typen + Bug (x2) |
| enemies x3.png | pupkin/Enemies/ | 960 x 3648 | 96 x 96 | 10 x 38 | 5 Enemy-Typen + Bug (x3) |

"No Outlines"-Varianten: Identische Dimensionen. Vorhanden in x1/x2/x3.
Kopie in Projekt: `public/assets/enemies/machine/enemies.png` (320 x 1216, identisch mit x1).

### 4b. Pupkin Boss

Cell-Datei: `17x7 Cells.txt` -> 17 Spalten x 7 Reihen.
Cell-Size: **64 x 64** (1088 / 17 = 64, 448 / 7 = 64).
Animationen laut ReadMe: Idle, Talk, Run, Shoot1, Shoot2, Shoot3, Death.
Hinweis: Legs, Body und Outlines sind separate Sheets.

| Datei | Pfad | Dimensionen | Cell-Size | Frames (S x R) | Inhalt |
|-------|------|-------------|-----------|-----------------|--------|
| boss x1.png | pupkin/Boss/ | 1088 x 448 | 64 x 64 | 17 x 7 | Boss Body (x1) |
| boss x2.png | pupkin/Boss/ | 2176 x 896 | 128 x 128 | 17 x 7 | Boss Body (x2) |
| boss x3.png | pupkin/Boss/ | 3264 x 1344 | 192 x 192 | 17 x 7 | Boss Body (x3) |
| boss outline x1.png | pupkin/Boss/ | 1088 x 448 | 64 x 64 | 17 x 7 | Boss Outline-Layer (x1) |
| boss outline x2.png | pupkin/Boss/ | 2176 x 896 | 128 x 128 | 17 x 7 | Boss Outline-Layer (x2) |
| boss outline x3.png | pupkin/Boss/ | 3264 x 1344 | 192 x 192 | 17 x 7 | Boss Outline-Layer (x3) |

"No Outlines"-Varianten: boss x1/x2/x3.png in `pupkin/Boss/No Outlines/`, identische Dimensionen.

### 4c. DungeonAssetPack Enemies

Cell-Sizes aus Dateinamen. Alle Sheets sind Single-Row (1 Reihe).

**64x64 Enemies:**

| Datei | Pfad | Dimensionen | Cell-Size | Frames | Inhalt |
|-------|------|-------------|-----------|--------|--------|
| Goblin1-64x64-Sheet.png | .../dungeon-asset-pack/enemies/ | 512 x 64 | 64 x 64 | 8 | Goblin #1 |
| Goblin2-64x64-Sheet.png | .../dungeon-asset-pack/enemies/ | 512 x 64 | 64 x 64 | 8 | Goblin #2 |
| Goblin3-64x64-Sheet.png | .../dungeon-asset-pack/enemies/ | 512 x 64 | 64 x 64 | 8 | Goblin #3 |
| Goblin4-64x64-Sheet.png | .../dungeon-asset-pack/enemies/ | 512 x 64 | 64 x 64 | 8 | Goblin #4 |
| Skeleton#1-64x64-Sheet.png | .../dungeon-asset-pack/enemies/ | 512 x 64 | 64 x 64 | 8 | Skelett #1 |
| skeleton#2-64x64-Sheet.png | .../dungeon-asset-pack/enemies/ | 512 x 64 | 64 x 64 | 8 | Skelett #2 |
| Bandit_Archer-64x64-Sheet.png | .../dungeon-asset-pack/enemies/ | 512 x 64 | 64 x 64 | 8 | Bandit Archer |
| Scarecrow-64x64-Sheet.png | .../dungeon-asset-pack/enemies/ | 512 x 64 | 64 x 64 | 8 | Scarecrow |
| mushroom-64x64-Sheet.png | .../dungeon-asset-pack/enemies/ | 512 x 64 | 64 x 64 | 8 | Mushroom |
| spider-64x64-Sheet.png | .../dungeon-asset-pack/enemies/ | 512 x 64 | 64 x 64 | 8 | Spider |
| glutton-64x64-Sheet.png | .../dungeon-asset-pack/enemies/ | 512 x 64 | 64 x 64 | 8 | Glutton |
| ogre-64x64-Sheet.png | .../dungeon-asset-pack/enemies/ | 512 x 64 | 64 x 64 | 8 | Ogre |
| Green_mucus-64x64-Sheet.png | .../dungeon-asset-pack/enemies/ | 512 x 64 | 64 x 64 | 8 | Green Mucus |
| Vampire_Countess-64x64-Sheet.png | .../dungeon-asset-pack/enemies/ | 512 x 64 | 64 x 64 | 8 | Vampire Countess |
| Witch_64x64-Sheet.png | .../dungeon-asset-pack/enemies/ | 512 x 64 | 64 x 64 | 8 | Witch |
| evil-Sheet.png | .../dungeon-asset-pack/enemies/ | 512 x 64 | 64 x 64 | 8 | Evil (Groesse aus Dimensionen) |

**96x96 Enemies:**

| Datei | Pfad | Dimensionen | Cell-Size | Frames | Inhalt |
|-------|------|-------------|-----------|--------|--------|
| Thief_Warrior-96x96-Sheet.png | .../dungeon-asset-pack/enemies/ | 768 x 96 | 96 x 96 | 8 | Thief Warrior |
| TemplarKnight-96x96-Sheet.png | .../dungeon-asset-pack/enemies/ | 768 x 96 | 96 x 96 | 8 | Templar Knight |
| servant-96x96-Sheet.png | .../dungeon-asset-pack/enemies/ | 768 x 96 | 96 x 96 | 8 | Servant |
| Onehandedsoldier-96x96-Sheet.png | .../dungeon-asset-pack/enemies/ | 768 x 96 | 96 x 96 | 8 | One-Handed Soldier |

**128x128 Enemies:**

| Datei | Pfad | Dimensionen | Cell-Size | Frames | Inhalt |
|-------|------|-------------|-----------|--------|--------|
| troll-128x128-Sheet.png | .../dungeon-asset-pack/enemies/ | 1024 x 128 | 128 x 128 | 8 | Troll |
| old_Tree_128x128-Sheet.png | .../dungeon-asset-pack/enemies/ | 1024 x 128 | 128 x 128 | 8 | Old Tree |
| strange_bird-128x128--Sheet.png | .../dungeon-asset-pack/enemies/ | 1024 x 128 | 128 x 128 | 8 | Strange Bird |
| The_angel_with_broken_wings-128x128-Sheet.png | .../dungeon-asset-pack/enemies/ | 1024 x 128 | 128 x 128 | 8 | Angel with Broken Wings |

### 4d. 32rogues Enemies

| Datei | Pfad | Dimensionen | Cell-Size | Frames (S x R) | Inhalt |
|-------|------|-------------|-----------|-----------------|--------|
| monsters.png | public/assets/packs/32rogues/ | 384 x 416 | 32 x 32 | 12 x 13 | Monster-Sprites |
| monsters.png | public/assets/packs/32rogues-2/ | 384 x 416 | 32 x 32 | 12 x 13 | Monster-Sprites (erweitert) |
| animals.png | public/assets/packs/32rogues/ | 288 x 512 | 32 x 32 | 9 x 16 | Tier-Sprites |
| animals.png | public/assets/packs/32rogues-2/ | 288 x 512 | 32 x 32 | 9 x 16 | Tier-Sprites (erweitert) |
| rogues.png | public/assets/packs/32rogues/ | 192 x 224 | 32 x 32 | 6 x 7 | Character-Sprites |
| rogues.png | public/assets/packs/32rogues-2/ | 224 x 224 | 32 x 32 | 7 x 7 | Character-Sprites (erweitert) |

---

## 5. UI Elements

### 5a. Pupkin UI

Cell-Datei: `20x11 Cells.txt` -> 20 Spalten x 11 Reihen.
Cell-Size: **32 x 32** (640 / 20 = 32, 352 / 11 = 32).

| Datei | Pfad | Dimensionen | Cell-Size | Frames (S x R) | Inhalt |
|-------|------|-------------|-----------|-----------------|--------|
| ui x1.png | pupkin/UI/ | 640 x 352 | 32 x 32 | 20 x 11 | Game-UI Elemente (x1) |
| ui x2.png | pupkin/UI/ | 1280 x 704 | 64 x 64 | 20 x 11 | Game-UI Elemente (x2) |
| ui x3.png | pupkin/UI/ | 1920 x 1056 | 96 x 96 | 20 x 11 | Game-UI Elemente (x3) |

Kopie in Projekt: `public/assets/ui/machine/ui.png` (640 x 352, identisch mit x1).

### 5b. DungeonAssetPack GUI

47 UI-Elemente, ueberwiegend Einzelbilder. Ausgewaehlte Assets:

| Datei | Pfad | Dimensionen | Cell-Size | Frames | Inhalt |
|-------|------|-------------|-----------|--------|--------|
| health_bar.png | .../dungeon-asset-pack/gui/ | 48 x 46 | — | 1 | Health Bar |
| hourglass-34x34-Sheet.png | .../dungeon-asset-pack/gui/ | 408 x 34 | 34 x 34 | 12 | Sanduhr-Animation |
| gui_portrait_box.png | .../dungeon-asset-pack/gui/ | 128 x 64 | — | 1 | Portrait-Rahmen |
| button#1.png | .../dungeon-asset-pack/gui/ | 128 x 32 | — | 1 | Breiter Button |
| button#2.png | .../dungeon-asset-pack/gui/ | 64 x 32 | — | 1 | Mittlerer Button |
| button#3.png bis #10 | .../dungeon-asset-pack/gui/ | 32 x 32 | — | je 1 | Icon-Buttons |
| box#1.png | .../dungeon-asset-pack/gui/ | 112 x 64 | — | 1 | UI-Box |
| box#2.png bis #4 | .../dungeon-asset-pack/gui/ | 64 x 64 | — | je 1 | UI-Boxen |
| box#5.png | .../dungeon-asset-pack/gui/ | 108 x 151 | — | 1 | Grosse UI-Box |
| box#6.png | .../dungeon-asset-pack/gui/ | 64 x 64 | — | 1 | UI-Box |
| select.png | .../dungeon-asset-pack/gui/ | 64 x 32 | — | 1 | Select-Element |
| switch.png | .../dungeon-asset-pack/gui/ | 64 x 32 | — | 1 | Toggle-Switch |
| slider#1.png | .../dungeon-asset-pack/gui/ | 57 x 12 | — | 1 | Slider horizontal |
| slider#2.png | .../dungeon-asset-pack/gui/ | 32 x 80 | — | 1 | Slider vertikal |
| holding.png | .../dungeon-asset-pack/gui/ | 80 x 64 | — | 1 | Holding-UI |
| Item_level_background.png | .../dungeon-asset-pack/gui/ | 128 x 32 | — | 1 | Item-Level BG |
| Wearable_item_indication_slot_icon.png | .../dungeon-asset-pack/gui/ | 160 x 64 | — | 1 | Wearable-Slot Icons |
| hero_portrait#1.png | .../dungeon-asset-pack/gui/ | 32 x 32 | — | 1 | Hero Portrait #1 |
| hero_portrait#2.png | .../dungeon-asset-pack/gui/ | 32 x 32 | — | 1 | Hero Portrait #2 |
| hero_portrait#3.png | .../dungeon-asset-pack/gui/ | 32 x 32 | — | 1 | Hero Portrait #3 |
| Settings-Icons (4 Stueck) | .../dungeon-asset-pack/gui/ | 32 x 32/64 | — | je 1 | Settings, Sound, Video, Control, Game |
| Weitere (13 Stueck) | .../dungeon-asset-pack/gui/ | 32 x 32 | — | je 1 | Icons (backpack, shield, mouse, etc.) |

---

## 6. Effects / Projectiles

### 6a. Pupkin Projectiles

Cell-Datei: `5x9 Cells.txt` -> 5 Spalten x 9 Reihen.
Cell-Size: **32 x 32** (160 / 5 = 32, 288 / 9 = 32).
Inhalt: 8 animierte Projektile inkl. Kollisions-Frames.

| Datei | Pfad | Dimensionen | Cell-Size | Frames (S x R) | Inhalt |
|-------|------|-------------|-----------|-----------------|--------|
| projectiles x1.png | pupkin/Projectiles/ | 160 x 288 | 32 x 32 | 5 x 9 | 8 Projektile + Kollision (x1) |
| projectiles x2.png | pupkin/Projectiles/ | 320 x 576 | 64 x 64 | 5 x 9 | 8 Projektile + Kollision (x2) |
| projectiles x3.png | pupkin/Projectiles/ | 480 x 864 | 96 x 96 | 5 x 9 | 8 Projektile + Kollision (x3) |

Kopie in Projekt: `public/assets/effects/projectiles/projectiles.png` (160 x 288, identisch mit x1).

### 6b. DungeonAssetPack VFX

| Datei | Pfad | Dimensionen | Cell-Size | Frames | Inhalt |
|-------|------|-------------|-----------|--------|--------|
| vfx_explosion_64x64-_65frame-Sheet.png | .../dungeon-asset-pack/vfx/ | 4160 x 64 | 64 x 64 | 65 | Explosion |
| hurt_vfx64x64-Sheet.png | .../dungeon-asset-pack/vfx/ | 640 x 64 | 64 x 64 | 10 | Hurt-Effekt |
| hack_vfx_64x64-Sheet.png | .../dungeon-asset-pack/vfx/ | 576 x 64 | 64 x 64 | 9 | Hack/Slash-Effekt |
| blood#1_39x54.png | .../dungeon-asset-pack/vfx/ | 351 x 378 | 39 x 54 | 9 x 7 = 63 | Blut-Animation #1 |
| blood#2_48x68.png | .../dungeon-asset-pack/vfx/ | 432 x 476 | 48 x 68 | 9 x 7 = 63 | Blut-Animation #2 |

### 6c. DungeonAssetPack Water

| Datei | Pfad | Dimensionen | Cell-Size | Frames | Inhalt |
|-------|------|-------------|-----------|--------|--------|
| water#1-32x32-Sheet.png | .../dungeon-asset-pack/water/ | 960 x 32 | 32 x 32 | 30 | Wasser-Animation #1 |
| water#2_32x32-Sheet.png | .../dungeon-asset-pack/water/ | 960 x 32 | 32 x 32 | 30 | Wasser-Animation #2 |

---

## 7. Branding (Einzelbilder, nicht aus Packs)

| Datei | Pfad | Dimensionen | Typ | Inhalt |
|-------|------|-------------|-----|--------|
| ceccaroni-games.png | public/assets/branding/ | 667 x 836 | Einzelbild | Ceccaroni Games Logo |
| screen-splash.png | public/assets/branding/ | 2752 x 1536 | Einzelbild | Splash Screen Artwork |
| screen-title.png | public/assets/branding/ | 2752 x 1536 | Einzelbild | Title Screen Artwork |
| screen-menu.png | public/assets/branding/ | 2752 x 1536 | Einzelbild | Menu Screen Artwork |

---

## 8. Sonstige

| Datei | Pfad | Dimensionen | Typ | Inhalt |
|-------|------|-------------|-----|--------|
| color palette (Dungeon Lite).png | pupkin/ | 168 x 84 | Farbpalette | Referenz-Palette, kein Game-Asset |
| 32rogues-palette.png | public/assets/packs/32rogues-2/ | 16 x 4 | Farbpalette | Referenz-Palette, kein Game-Asset |
| player-blue.png | public/assets/characters/player/ | 320 x 416 | Kopie | Identisch mit pupkin/Players/players blue x1.png |

---

## Zusammenfassung Cell-Sizes

### Pupkin Tech Dungeon Pack

| Kategorie | Cell-Datei | x1 Dimensionen | Cell-Size | Grid |
|-----------|------------|----------------|-----------|------|
| Players | 8x13 Cells | 320 x 416 | **40 x 32** | 8 x 13 |
| NPC | 6x3 Cells | 192 x 96 | **32 x 32** | 6 x 3 |
| Enemies | 10x38 Cells | 320 x 1216 | **32 x 32** | 10 x 38 |
| Boss | 17x7 Cells | 1088 x 448 | **64 x 64** | 17 x 7 |
| Projectiles | 5x9 Cells | 160 x 288 | **32 x 32** | 5 x 9 |
| Props & Items | 24x22 Cells | 768 x 704 | **32 x 32** | 24 x 22 |
| UI | 20x11 Cells | 640 x 352 | **32 x 32** | 20 x 11 |
| Tileset | ReadMe: 32x32 | 1184 x 736 | **32 x 32** | 37 x 23 |

### Weitere Packs

| Pack | Cell-Size | Quelle der Groesse |
|------|-----------|---------------------|
| DungeonAssetPack Enemies 64x64 | **64 x 64** | Dateiname |
| DungeonAssetPack Enemies 96x96 | **96 x 96** | Dateiname |
| DungeonAssetPack Enemies 128x128 | **128 x 128** | Dateiname |
| DungeonAssetPack Heroes | **64 x 64** | Berechnung (512/8, 576/9) |
| DungeonAssetPack VFX | **64 x 64** | Dateiname |
| DungeonAssetPack Props | **32 x 32** | Dateiname |
| Hero Wizard (aktiv) | **352 x 384** | Berechnung (2816/8, 1536/4) |
| FreeKnight (inaktiv) | **120 x 80** | Berechnung (1200/10) |
| 32rogues / 32rogues-2 | **32 x 32** | Pack-Name |
| 32x32 Dungeon Pack | **32 x 32** | Pack-Name |

---

## Duplikate: pupkin/ vs. public/assets/

Die folgenden Dateien in `public/assets/` sind identische Kopien der Pupkin x1-Versionen:

| public/assets/ Pfad | Kopie von |
|---------------------|-----------|
| tilesets/machine/tileset.png | pupkin/tileset x1.png |
| enemies/machine/enemies.png | pupkin/Enemies/enemies x1.png |
| effects/projectiles/projectiles.png | pupkin/Projectiles/projectiles x1.png |
| props/machine/props.png | pupkin/Props and Items/props and items x1.png |
| ui/machine/ui.png | pupkin/UI/ui x1.png |
| characters/player/player-blue.png | pupkin/Players/players blue x1.png |

Zusaetzlich existiert eine Kopie des Packs unter `src/Pupkin Tech Dungeon Asset Pack/` (identisch mit `pupkin/`).

---

## PNG-Zaehlung

| Ort | Anzahl PNGs |
|-----|-------------|
| pupkin/ (Pupkin Pack) | 57 |
| public/assets/branding/ | 4 |
| public/assets/characters/ | 12 |
| public/assets/enemies/ | 1 |
| public/assets/tilesets/ | 1 |
| public/assets/props/ | 1 |
| public/assets/ui/ | 1 |
| public/assets/effects/ | 1 |
| public/assets/packs/32rogues/ | 5 |
| public/assets/packs/32rogues-2/ | 8 |
| public/assets/packs/dungeon-pack/ | 40 |
| public/assets/packs/dungeon-asset-pack/ | ~80 |
| **Gesamt** | **~211** |

**Alle Dimensionen per `sips -g pixelWidth -g pixelHeight` gelesen — nicht geraten.**
**Alle Pupkin Cell-Sizes aus Pack-Dokumentation (NxM Cells.txt / Read Me.txt) berechnet.**
**Andere Pack Cell-Sizes aus Dateinamen oder Pixel-Berechnung abgeleitet.**
