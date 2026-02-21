# Asset Registry

---

## Characters – Hero Wizard (AKTIVER PLAYER)

Quelle: DungeonAssetPack (itch.io)
Lokaler Ordner: `ASSETS/DungeonAssetPack/hero/`
Projekt-Pfad: `public/assets/characters/hero-wizard/hero-wizard.png`
Frame-Size: **64×64 px**
Image: **512×64 px** (8 Frames × 64×64, eine Reihe)
Sichtbarer Charakter: ~24×40 px innerhalb des 64×64 Frames
Scale: **2** (→ 128×128 display, Char ~48×80 display)

| Datei | Pfad | Dimensionen | Frames | Beschreibung |
|-------|------|-------------|--------|-------------|
| hero-wizard.png | public/assets/characters/hero-wizard/ | 512×64 | 8 | Idle + Run Zyklus |

### Animations-Config:
```
player-idle: hero-wizard frame [0],     frameRate 1,  repeat -1 (statisch)
player-run:  hero-wizard frames [0..7], frameRate 10, repeat -1 (voller 8-Frame Walk-Zyklus)
```

### Physics Body (bei scale 2):
- size(20, 34), offset(22, 20) → Tighter fit um sichtbaren Charakter

---

## Characters – FreeKnight (BACKUP/INAKTIV)

Quelle: FreeKnight_v1 (itch.io)
Lokaler Ordner: `FreeKnight_v1/Colour1/Outline/120x80_PNGSheets/`
Frame-Size: **120×80 px** (alle Animationen konsistent)
Charakter: ~40×50 px sichtbar innerhalb des 120×80 Frames

| Datei | Pfad | Dimensionen | Frames | Animation |
|-------|------|-------------|--------|-----------|
| freeknight-idle.png | public/assets/characters/player/ | 1200×80 | 10 | Idle (atmend) |
| freeknight-run.png | public/assets/characters/player/ | 1200×80 | 10 | Run |
| freeknight-attack.png | public/assets/characters/player/ | 480×80 | 4 | Attack (stationary) |
| freeknight-death.png | public/assets/characters/player/ | 1200×80 | 10 | Death (stationary) |
| freeknight-dash.png | public/assets/characters/player/ | 240×80 | 2 | Dash |
| freeknight-hit.png | public/assets/characters/player/ | 120×80 | 1 | Hit reaction |
| freeknight-jump.png | public/assets/characters/player/ | 360×80 | 3 | Jump |
| freeknight-fall.png | public/assets/characters/player/ | 360×80 | 3 | Fall |

### Animations-Config:
```
player-idle:    fk-idle   frames [0..9],  frameRate 8,  repeat -1
player-run:     fk-run    frames [0..9],  frameRate 12, repeat -1
player-attack:  fk-attack frames [0..3],  frameRate 12, repeat 0
player-death:   fk-death  frames [0..9],  frameRate 8,  repeat 0
player-hit:     fk-hit    frames [0],     frameRate 1,  repeat 0
```

### Weitere verfügbare Animationen (noch nicht geladen):
Roll (12f), CrouchWalk (8f), WallClimb (7f), Slide (2f), TurnAround (3f),
Attack2 (6f), AttackCombo (10f), Crouch-Varianten, Wall-Varianten

---

# Asset Registry – Pupkin Tech Dungeon

> **Quelle:** Pupkin Tech Dungeon Asset Pack (Trevor Pupkin, itch.io)
> **Lokaler Ordner:** `pupkin/`
> **Dokumentation im Pack:** `Read Me.txt` + `NxM Cells.txt` pro Unterordner
>
> Alle Pixel-Dimensionen per `sips` gelesen.
> Cell-Sizes berechnet aus Pack-Angaben (z.B. `8x13 Cells.txt`) und x1-Dimensionen.
> x2/x3-Varianten sind exakt 2×/3× der x1-Werte.
> "No Outlines"-Varianten haben identische Dimensionen, nur ohne Outline-Pixel.

---

## Characters – Players

Cell-Datei: `Players/8x13 Cells.txt` → 8 Spalten × 13 Reihen
Cell-Size: **40×32 px** (320÷8 × 416÷13)
Animationen laut ReadMe: Idle, Talk, Reload, Run, Shoot, Death

> ReadMe sagt "Players (32x32)" — das ist die CHARACTER-Grösse, nicht die CELL-Grösse.
> Die Cells sind 40×32 weil Text-Labels im Spritesheet Platz brauchen.

| Datei | Pfad | Dimensionen | Scale | Typ |
|-------|------|-------------|-------|-----|
| players blue x1.png | pupkin/Players/ | 320×416 | x1 | Spritesheet |
| players blue x2.png | pupkin/Players/ | 640×832 | x2 | Spritesheet |
| players blue x3.png | pupkin/Players/ | 960×1248 | x3 | Spritesheet |
| players green x1.png | pupkin/Players/ | 320×416 | x1 | Spritesheet |
| players green x2.png | pupkin/Players/ | 640×832 | x2 | Spritesheet |
| players green x3.png | pupkin/Players/ | 960×1248 | x3 | Spritesheet |
| players grey x1.png | pupkin/Players/ | 320×416 | x1 | Spritesheet |
| players grey x2.png | pupkin/Players/ | 640×832 | x2 | Spritesheet |
| players grey x3.png | pupkin/Players/ | 960×1248 | x3 | Spritesheet |
| players red x1.png | pupkin/Players/ | 320×416 | x1 | Spritesheet |
| players red x2.png | pupkin/Players/ | 640×832 | x2 | Spritesheet |
| players red x3.png | pupkin/Players/ | 960×1248 | x3 | Spritesheet |
| players blue x1.png | pupkin/Players/No Outlines/ | 320×416 | x1 | Spritesheet (no outline) |
| players blue x2.png | pupkin/Players/No Outlines/ | 640×832 | x2 | Spritesheet (no outline) |
| players blue x3.png | pupkin/Players/No Outlines/ | 960×1248 | x3 | Spritesheet (no outline) |
| players green x1.png | pupkin/Players/No Outlines/ | 320×416 | x1 | Spritesheet (no outline) |
| players green x2.png | pupkin/Players/No Outlines/ | 640×832 | x2 | Spritesheet (no outline) |
| players green x3.png | pupkin/Players/No Outlines/ | 960×1248 | x3 | Spritesheet (no outline) |
| players grey x1.png | pupkin/Players/No Outlines/ | 320×416 | x1 | Spritesheet (no outline) |
| players grey x2.png | pupkin/Players/No Outlines/ | 640×832 | x2 | Spritesheet (no outline) |
| players grey x3.png | pupkin/Players/No Outlines/ | 960×1248 | x3 | Spritesheet (no outline) |
| players red x1.png | pupkin/Players/No Outlines/ | 320×416 | x1 | Spritesheet (no outline) |
| players red x2.png | pupkin/Players/No Outlines/ | 640×832 | x2 | Spritesheet (no outline) |
| players red x3.png | pupkin/Players/No Outlines/ | 960×1248 | x3 | Spritesheet (no outline) |

### Player Frame-Map (8 cols × 13 rows, 40×32 per cell)

**Verifiziert durch 4x-skalierte Contact Sheet Analyse (`docs/player-frame-grid.png`).**

Jede Row enthält Sprite-Frames UND rote Text-Labels. Nur Sprite-Frames verwenden!

**Variante 1 (Rows 0–5):**
| Row | Sprite-Frames | Label-Frames | Animation |
|-----|--------------|-------------|-----------|
| 0 | **F0** (1 Sprite) | F1="Idle", F3="No Gun" | Idle (Gun) — statisch |
| 0 | F2 (1 Sprite) | | Idle (No Gun) — statisch |
| 1 | **F8, F9** (2 Sprites) | F10="Talk" | Talk (Gun) |
| 1 | F11 (1 Sprite) | F12="No Gun" | Talk (No Gun) |
| 2 | **F16, F17, F18, F19** (4 Sprites) | F20="Reload" | Reload |
| 3 | **F24, F25, F26** (3 Sprites) | F27="Run" | Run (Gun) |
| 3 | F28, F29, F30 (3 Sprites) | F31="No Gun" | Run (No Gun) |
| 4 | **F32, F33, F34** (3 Sprites) | F35="Shoot" | Shoot |
| 5 | **F40, F41, F42, F43, F44** (5 Sprites) | F46="Death" | Death (F42-F43 = Explosion) |

**Row 6: LEER (Gap zwischen Varianten)**

**Variante 2 (Rows 7–12): Gleiche Struktur, Frames +56 offset.**

### Animations-Config:
```
player-idle:   frames [0],          frameRate 1,  repeat -1
player-run:    frames [24,25,26],   frameRate 10, repeat -1
player-shoot:  frames [32,33,34],   frameRate 10, repeat 0
player-death:  frames [40..44],     frameRate 8,  repeat 0
```

---

## Characters – NPC

Cell-Datei: `NPC/6x3 Cells.txt` → 6 Spalten × 3 Reihen
Cell-Size: **32×32 px** (192÷6 × 96÷3)
Animationen laut ReadMe: Idle1, Idle2, Talk

| Datei | Pfad | Dimensionen | Scale | Typ |
|-------|------|-------------|-------|-----|
| npc x1.png | pupkin/NPC/ | 192×96 | x1 | Spritesheet |
| npc x2.png | pupkin/NPC/ | 384×192 | x2 | Spritesheet |
| npc x3.png | pupkin/NPC/ | 576×288 | x3 | Spritesheet |
| npc x1.png | pupkin/NPC/No Outlines/ | 192×96 | x1 | Spritesheet (no outline) |
| npc x2.png | pupkin/NPC/No Outlines/ | 384×192 | x2 | Spritesheet (no outline) |
| npc x3.png | pupkin/NPC/No Outlines/ | 576×288 | x3 | Spritesheet (no outline) |

---

## Enemies

Cell-Datei: `Enemies/10x38 Cells.txt` → 10 Spalten × 38 Reihen
Cell-Size: **32×32 px** (320÷10 × 1216÷38)
Animationen laut ReadMe: Idle1, Idle2, Activate, Run, Shoot, Death, Spawn Idle, Spawn Death
5 Gegnertypen + Flying Bug (laut `+ Update.txt`)

> Enthält Text-Labels ähnlich wie Player-Sheet. Frame-Mapping pro Enemy-Typ steht aus.

| Datei | Pfad | Dimensionen | Scale | Typ |
|-------|------|-------------|-------|-----|
| enemies x1.png | pupkin/Enemies/ | 320×1216 | x1 | Spritesheet |
| enemies x2.png | pupkin/Enemies/ | 640×2432 | x2 | Spritesheet |
| enemies x3.png | pupkin/Enemies/ | 960×3648 | x3 | Spritesheet |
| enemies x1.png | pupkin/Enemies/No Outlines/ | 320×1216 | x1 | Spritesheet (no outline) |
| enemies x2.png | pupkin/Enemies/No Outlines/ | 640×2432 | x2 | Spritesheet (no outline) |
| enemies x3.png | pupkin/Enemies/No Outlines/ | 960×3648 | x3 | Spritesheet (no outline) |

---

## Boss

Cell-Datei: `Boss/17x7 Cells.txt` → 17 Spalten × 7 Reihen
Cell-Size: **64×64 px** (1088÷17 × 448÷7)
Animationen laut ReadMe: Idle, Talk, Run, Shoot1, Shoot2, Shoot3, Death
Hinweis: Legs, Body und Outlines sind separate Sheets laut ReadMe

| Datei | Pfad | Dimensionen | Scale | Typ |
|-------|------|-------------|-------|-----|
| boss x1.png | pupkin/Boss/ | 1088×448 | x1 | Spritesheet (body) |
| boss x2.png | pupkin/Boss/ | 2176×896 | x2 | Spritesheet (body) |
| boss x3.png | pupkin/Boss/ | 3264×1344 | x3 | Spritesheet (body) |
| boss outline x1.png | pupkin/Boss/ | 1088×448 | x1 | Spritesheet (outline layer) |
| boss outline x2.png | pupkin/Boss/ | 2176×896 | x2 | Spritesheet (outline layer) |
| boss outline x3.png | pupkin/Boss/ | 3264×1344 | x3 | Spritesheet (outline layer) |
| boss x1.png | pupkin/Boss/No Outlines/ | 1088×448 | x1 | Spritesheet (no outline) |
| boss x2.png | pupkin/Boss/No Outlines/ | 2176×896 | x2 | Spritesheet (no outline) |
| boss x3.png | pupkin/Boss/No Outlines/ | 3264×1344 | x3 | Spritesheet (no outline) |

---

## Tilesets

ReadMe: "Tileset (32x32)"
Cell-Size: **32×32 px**
Grid: 37 Spalten × 23 Reihen (1184÷32 × 736÷32)
Inhalt: Boden, Wände, Deko, Tech-Dungeon-Tiles

| Datei | Pfad | Dimensionen | Scale | Typ |
|-------|------|-------------|-------|-----|
| tileset x1.png | pupkin/ | 1184×736 | x1 | Tileset |
| tileset x2.png | pupkin/ | 2368×1472 | x2 | Tileset |
| tileset x3.png | pupkin/ | 3552×2208 | x3 | Tileset |

---

## Props and Items

Cell-Datei: `Props and Items/24x22 Cells.txt` → 24 Spalten × 22 Reihen
Cell-Size: **32×32 px** (768÷24 × 704÷22)
Inhalt: Animierte Props (Monitore, Server-Racks, Rohre, Items)

| Datei | Pfad | Dimensionen | Scale | Typ |
|-------|------|-------------|-------|-----|
| props and items x1.png | pupkin/Props and Items/ | 768×704 | x1 | Spritesheet |
| props and items x2.png | pupkin/Props and Items/ | 1536×1408 | x2 | Spritesheet |
| props and items x3.png | pupkin/Props and Items/ | 2304×2112 | x3 | Spritesheet |

---

## UI

Cell-Datei: `UI/20x11 Cells.txt` → 20 Spalten × 11 Reihen
Cell-Size: **32×32 px** (640÷20 × 352÷11)
Inhalt: Game-UI-Elemente (Buttons, Bars, Icons)

| Datei | Pfad | Dimensionen | Scale | Typ |
|-------|------|-------------|-------|-----|
| ui x1.png | pupkin/UI/ | 640×352 | x1 | Spritesheet |
| ui x2.png | pupkin/UI/ | 1280×704 | x2 | Spritesheet |
| ui x3.png | pupkin/UI/ | 1920×1056 | x3 | Spritesheet |

---

## Effects / Projectiles

Cell-Datei: `Projectiles/5x9 Cells.txt` → 5 Spalten × 9 Reihen
Cell-Size: **32×32 px** (160÷5 × 288÷9)
Inhalt: 8 animierte Projektile inkl. Kollisions-Frames

| Datei | Pfad | Dimensionen | Scale | Typ |
|-------|------|-------------|-------|-----|
| projectiles x1.png | pupkin/Projectiles/ | 160×288 | x1 | Spritesheet |
| projectiles x2.png | pupkin/Projectiles/ | 320×576 | x2 | Spritesheet |
| projectiles x3.png | pupkin/Projectiles/ | 480×864 | x3 | Spritesheet |

---

## Sonstiges

| Datei | Pfad | Dimensionen | Typ |
|-------|------|-------------|-----|
| color palette (Dungeon Lite).png | pupkin/ | 168×84 | Farbpalette (Referenz, kein Game-Asset) |

---

## Branding (Einzelbilder, nicht aus Pupkin Pack)

| Datei | Pfad | Dimensionen | Typ |
|-------|------|-------------|-----|
| ceccaroni-games.png | public/assets/branding/ | 667×836 | Einzelbild (Logo) |
| screen-splash.png | public/assets/branding/ | 2752×1536 | Einzelbild (Splash) |
| screen-title.png | public/assets/branding/ | 2752×1536 | Einzelbild (Title) |
| screen-menu.png | public/assets/branding/ | 2752×1536 | Einzelbild (Menu) |

---

## Zusammenfassung Cell-Sizes

| Kategorie | Cell-Datei | x1 Dimensionen | Cell-Size | Grid |
|-----------|------------|----------------|-----------|------|
| Players | 8×13 Cells | 320×416 | **40×32** | 8×13 |
| NPC | 6×3 Cells | 192×96 | **32×32** | 6×3 |
| Enemies | 10×38 Cells | 320×1216 | **32×32** | 10×38 |
| Boss | 17×7 Cells | 1088×448 | **64×64** | 17×7 |
| Projectiles | 5×9 Cells | 160×288 | **32×32** | 5×9 |
| Props & Items | 24×22 Cells | 768×704 | **32×32** | 24×22 |
| UI | 20×11 Cells | 640×352 | **32×32** | 20×11 |
| Tileset | ReadMe: 32×32 | 1184×736 | **32×32** | 37×23 |

**Gesamt: 57 PNG-Dateien im `pupkin/`-Ordner inventarisiert.**
**Alle Cell-Sizes aus Pack-Dokumentation berechnet — nicht geraten, nicht per Pixel-Analyse geschätzt.**

---

## Neue Asset Packs (in `public/assets/packs/`)

### DungeonAssetPack

Quelle: DungeonAssetPack (itch.io)
Projekt-Pfad: `public/assets/packs/dungeon-asset-pack/`

| Ordner | Inhalt | Cell-Size | Hinweis |
|--------|--------|-----------|---------|
| hero/ | Hero Warrior (9f), Hero Ranger (8f), Arrow | **64×64** | Aus Dateinamen |
| enemies/ | 26 Enemy-Sheets (Goblins, Skeletons, Witch, etc.) | **64×64** / **128×128** | Grösse im Dateinamen |
| gui/ | 47 UI-Elemente (Buttons, Bars, Portraits) | Variabel | Einzelbilder |
| vfx/ | Explosions, Hurt, Blood-Effekte | **64×64** | Spritesheets |
| water/ | Wasser-Animationen | **32×32** | Aus Dateinamen |
| props/ | Tileset, Türen, Truhen, Fallen, Deko | **32×32** | tiles_map.png = Haupt-Tileset |

### 32rogues

Quelle: Seth Boyles (itch.io, 2024)
Projekt-Pfad: `public/assets/packs/32rogues/`
Cell-Size: **32×32** (aus Pack-Name, keine Cell-Datei)

| Datei | Inhalt |
|-------|--------|
| rogues.png | 5×8 Grid Character-Sprites (Ritter, Wizards, Barbaren, etc.) |
| monsters.png | Monster-Sprites |
| items.png | Equipment & Items |
| animals.png | Tier-Sprites |
| tiles.png | Tileset |

Wizard-Sprites in Row 5: Female Wizard, Male Wizard, Druid, Desert Sage, Dwarf Mage

### 32rogues-2

Quelle: Seth Boyles (itch.io, erweitert)
Projekt-Pfad: `public/assets/packs/32rogues-2/`
Cell-Size: **32×32**

Erweiterung von 32rogues mit zusätzlichen Items, Autotiles, animierten Tiles.

### 32x32 Dungeon Pack

Projekt-Pfad: `public/assets/packs/dungeon-pack/`
Cell-Size: **32×32** (aus Pack-Name)

| Dateien | Inhalt |
|---------|--------|
| Dungeon_00..35.png | Individuelle Dungeon-Tiles |
| Sheet.png | Master-Sheet alle Tiles |
| Preview.png | Vorschau |
