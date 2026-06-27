# casa-luna —

**Casa Luna — Home Assistant Solar / Off-Grid / On-Grid / Automation Wall Dashboard**

`casa-luna.js` · Casa Luna Edition **v1.0.0** (build 103)

<img width="1852" height="1262" alt="IMG_20260624_142618" src="https://github.com/user-attachments/assets/900bfb4c-a962-45f4-84a0-b1afbfd34171" />
<img width="1880" height="1252" alt="IMG_20260624_013814" src="https://github.com/user-attachments/assets/171972f3-3463-44eb-8e62-515a2635b5c0" />
<img width="1864" height="1262" alt="Screenshot_2026-06-24-01-39-00-97_3aea4af51f236e4932235fdada7d1643" src="https://github.com/user-attachments/assets/6124a2d1-fed0-44f7-9b90-8256c3b47f22" />

> **Origin:** `casa-luna` is a full expansion of [`khan-skycard`](https://github.com/thekhan1122/khan-skycard) (itself a visual overhaul of [`k-flow-card`](https://github.com/thekhan1122/k-flow-card)) and lives in its own separate repository. It keeps the same weather-aware sky system, but grows the single energy-flow card into a full multi-view wall dashboard with its own entity schema. The custom element is renamed `casa-luna` to avoid a `customElements` collision when both cards are installed.

---

## Overview

`casa-luna` is a custom Home Assistant Lovelace card that renders a live, animated energy and home-automation dashboard against a full-card photographic sky background. Thirteen background images cover every major weather × time-of-day combination — the card picks the right one automatically from a `weather` entity and the current sun elevation.

It targets a GoodWe inverter with JK BMS storage (defaults are pre-filled for this hardware), but every entity is overridable, and several parts of the card (Battery View, smart plugs, bottom tiles, the entity-row "extras" in each nav view) work with **any** brand — Victron, Sungrow, Deye, etc. — since they take plain entity pickers rather than hardcoded names. Runs on a fixed **1500 × 1000** wall-mounted tablet. Self-contained in a single JavaScript file — no NPM, no build step, no extra dependencies — and updates live via the standard `hass` setter.

---

## What's New Since the First Pre-release (build 42 → 70)

The original pre-release was a single-language, 8-tile, GoodWe-only card. Since then:

| Area | Added |
|---|---|
| **Languages** | Auto-detects Home Assistant's language; **15 languages** built in (English + German, French, Spanish, Italian, Portuguese, Dutch, Polish, Swedish, Norwegian, Danish, Finnish, Russian, Ukrainian, Turkish) |
| **Navigation** | 9th tile added (**Smart Plugs**, its own dedicated view); rail re-spaced so the fold-toggle button sits right above the bottom tiles instead of floating with dead space below it |
| **Entity-row model** | Climate, Security, Lighting, Automation and Smart Plugs now support **rename + manual entity + show/hide** per item, plus 6 free "extra" slots each for additional rooms/devices |
| **PV strings** | Extended from 4 to **6** strings; the dedicated PV tile only shows as many columns as you've actually configured (no more forced-empty 2nd column) |
| **Battery back face** | The old condensed Current/Capacity/Endurance back face is gone — flipping the battery tile now shows **all 6 PV strings** (power + volt each). Rebuilt as a plain show/hide swap, not a CSS 3D flip, so it can't mirror or double-render on any browser |
| **Toggles** | Centralized into one **Toggles** section: bars, phase tile, battery-stats tile, PV tile, extra PV strings, EV tile, secondary battery — each independently hideable |
| **Editor** | Two-column layout, far less scrolling |
| **Decimals** | Global rule: values are shown as-is unless they have more than 2 decimal places, in which case they're rounded to 2 — applied consistently to every value on the card, and power readings are normalized to Watts regardless of whether the source sensor reports W or kW |
| **Battery View fallback** | If you haven't set the Battery View's own entities, it automatically mirrors whatever you set on the main face — no more "looks hardcoded to GoodWe" confusion for other brands |
| **Inverter Output Power** | New optional field so the INV LOAD % gauge can reflect one inverter's own output instead of total house consumption (for hybrid setups with multiple inverters/PV sources) |
| **Title & attribution** | Card title is editable; the subtitle's "by the Khan" credit is locked — altering it disables the card |
| **Bottom tiles** | Each of the 6 can now be individually disabled (not just left entity-less) — disabled tiles are skipped and the rest compact left |
| **Standalone totals** | `TOTAL IMP` / `TOTAL EXP` read their own dedicated lifetime-energy entities — no more silently duplicating the daily import/export tiles |
| **Bug fixes** | Grid flow animation now reverses correctly on export; cell-voltage thresholds actually colour the tile (previously configurable but unused); normal battery/BMS temperature no longer shows warning-orange |
| **Cameras** | Live stream now works without go2rtc — falls back to a signed Home Assistant MJPEG stream for any camera entity; tap a camera tile to open it full-screen |
| **Popups** | The card's own popups (confirm sheet, power menu, calendar, weather, device tap-popup) no longer heavily dim/blur the dashboard behind them — the rest of the screen stays clearly visible |
| **Energy units** | Every kWh-suffixed tile (Today's Consumption/Production, totals, battery charge/discharge, grid import/export) now reads the entity's own `unit_of_measurement` instead of always forcing "kWh" |
| **Renamable captions** | "Today's Consumption" and "Today's Production" — previously the only two captions on the card without a rename option — now have `label_*` overrides like everything else |

---

## What Changed from khan-skycard

| Area | khan-skycard (Sky Edition) | casa-luna |
|---|---|---|
| **Scope** | Single energy-flow card | Full dashboard — 9 nav views + 6 device tiles + event center |
| **Layout** | Free sky composition | Fixed 1500 × 1000 wall-tablet blueprint |
| **Element** | `khan-skycard` | `casa-luna` (renamed to avoid collision) |
| **Sky images** | `sky-<variant>.png` | `casa-luna-<variant>.png` (same 13-variant system) |
| **Battery** | SVG fill bar | Cylinder + tap-flip tile (front: 6 stats / back: 6 PV strings) |
| **Grid / Inverter** | Single-phase | 3-phase flip tile (Grid Phases ⇄ Inverter L1/L2/L3) |
| **Right column** | — | MODE, PV tile, EV tile, production/consumption history charts, totals |
| **Navigation** | — | 9 collapsible/foldable views, entity-row model, auto-discovery |
| **Header** | — | Status row (Wi-Fi / power / Bluetooth / camera) with popups, clock calendar, weather popup |
| **Language** | English only | Auto-follows HA locale; 15 languages |
| **Theming** | Hardcoded | Global CSS-variable theme system + editor controls |
| **Tiles** | — | Flip cards with corner buttons; animated device icons |

---

## Features

- Animated energy-flow paths (solar → inverter → battery / grid / home / EV) with directional colouring (orange = importing/discharging, green = exporting/charging) — flow direction reverses correctly for both grid and battery
- Live sun/moon arc positioned from `sun.sun` (real sunrise/sunset), night star field, weather-driven background variants and overlay animation (rain, snow, fog, lightning)
- Battery cylinder with SOC colour coding + tap-flip tile (6 live stats on the front, 6 PV strings on the back)
- Single- and 3-phase grid + inverter in a flip tile, hideable as a whole
- Dual battery support (primary + secondary)
- EV / car charger tile (W / A / SOC / ETA)
- Up to 6 PV strings, each with its own power + voltage, shown only when configured
- 9 navigation views (Dashboard, Energy, Smart Plugs, Battery, Climate, Security, Automation, Lighting, System); nav rail folds to the first three
- Entity-row model in 5 of those views: pick any entity, give it a custom name, and it shows up — or leave it blank and the tile/group disappears entirely
- 6 device tiles with animated state icons, each individually rename-able, icon-able, and disable-able
- Production/consumption history charts with peak markers; event center
- Header status row with tap popups, month-calendar on the clock, weather detail popup
- Full visual editor, two-column layout, no YAML required for setup
- 15 built-in languages, auto-detected from Home Assistant
- Global theme controls (background, accent colours, opacity, blur, text sizes)
- Fully dark-themed, shadow-DOM isolated
- Editable card title; locked author credit

> **Battery sign convention is inverted from standard** (GoodWe-via-inverter indirection): `battery_power > 50` = discharging, `< −50` = charging. Toggle `invert_battery_power` if your sensor differs.

> **Power units:** every power-type entity (battery, grid, inverter phases, PV strings, EV charger, smart plugs) is read via its own `unit_of_measurement` and normalized to Watts internally — if your sensor reports in kW instead of W, the card still works correctly without any extra configuration.

---

## Supported hardware & integrations

| Domain | Default / example source | Notes |
|---|---|---|
| Inverter | GoodWe (HA integration) | Any brand works — just point the pickers at your own entities |
| Battery / BMS | JK BMS | Battery View auto-falls-back to the main battery entities if its own aren't set |
| Grid metering | Tuya 3-phase meter | — |
| Smart switches / timers | Tuya (via `input_datetime` helpers) | — |
| Sensors / relays | ESP32 (gas, motion, flame, temp, lux + 4 relays) | — |
| Lighting | Zigbee | — |
| Cameras | go2rtc | — |
| Voice | Alexa | — |
| Smart plugs | Any `switch.*` (+ optional power sensor) | Dedicated nav view, 6 slots |

---

## Installation

### Method 1 — HACS via Custom Repository (Recommended)

Casa Luna is not in the default HACS store, so add it as a custom repository:

1. Open **HACS** in the Home Assistant sidebar.
2. Click the **⋮** menu (top-right) → **Custom repositories**.
3. Paste the repository URL:
   ```
   https://github.com/thekhan1122/casa-luna
   ```
4. Set **Category** to **Dashboard** (Lovelace) and click **Add**.
5. Find **Casa Luna** in the list, open it, and click **Download**.
6. Ensure the 13 sky PNGs are in `/config/www/community/casa-luna/sky/` (see **Sky Images**).
7. **Hard refresh** the browser (`Ctrl + Shift + R` / `Cmd + Shift + R`).
8. Add the card to a **Panel-mode** (single full-width card) dashboard:
   ```yaml
   type: custom:casa-luna
   ```
9. Open the visual editor to bind entities.

> HACS registers the Lovelace resource automatically — skip the manual resource step.

### Method 2 — Manual

1. Copy the card and the 13 sky PNGs into your HA config:
   ```
   /config/www/community/casa-luna/casa-luna.js
   /config/www/community/casa-luna/sky/casa-luna-<variant>.png
   ```
2. Register the Lovelace resource (*Settings → Dashboards → ⋮ → Resources → Add*):
   ```yaml
   url: /local/community/casa-luna/casa-luna.js
   type: module
   ```
3. Add the card to a Panel-mode dashboard:
   ```yaml
   type: custom:casa-luna
   ```
4. Open the visual editor to bind entities.

---

## Sky Images

The card needs 13 PNG files at `/config/www/community/casa-luna/sky/`. The variant is chosen from the `weather_entity` state and the `sun` elevation, and an animated overlay (rain streaks, snowfall, drifting fog, or a lightning flash) layers on top automatically when the condition calls for it.

| Filename (no extension) | Condition |
|---|---|
| `casa-luna-clear-day` | Clear sky, daytime |
| `casa-luna-clear-dawn` | Clear sky, dawn transition |
| `casa-luna-clear-dusk` | Clear sky, dusk transition |
| `casa-luna-clear-night` | Clear sky, night |
| `casa-luna-partlycloudy-day` | Partly cloudy, daytime |
| `casa-luna-partlycloudy-night` | Partly cloudy, night |
| `casa-luna-cloudy-day` | Overcast, daytime |
| `casa-luna-cloudy-night` | Overcast, night |
| `casa-luna-rainy-day` | Rain, daytime |
| `casa-luna-rainy-night` | Rain, night |
| `casa-luna-thunderstorm` | Thunderstorm (any time) |
| `casa-luna-snowy-day` | Snow (any time) |
| `casa-luna-fog-day` | Fog / mist (any time) |

All images must be **PNG**. The folder is configurable via `background_path` (default `/local/community/casa-luna/sky`). Without a `weather_entity`, the card falls back to the clear day/night variant.

---

## Language

The card auto-detects Home Assistant's language (`hass.locale.language`) and shows its own captions, nav titles, and mode words (Charging/Discharging/Idle, etc.) in that language automatically — nothing to configure. Entity state text (inverter mode, weather condition, on/off) is localized separately through Home Assistant's own translations via `formatEntityState`, so it follows whatever language HA itself is already showing.

**Built in:** English (baseline/fallback) — German `de` · French `fr` · Spanish `es` · Italian `it` · Portuguese `pt` · Dutch `nl` · Polish `pl` · Swedish `sv` · Norwegian `nb` · Danish `da` · Finnish `fi` · Russian `ru` · Ukrainian `uk` · Turkish `tr`.

To force a specific language regardless of HA's setting, add to the card YAML:
```yaml
language: de
```
There's no editor field for this (YAML only). Any language not in the list above falls back to English. Translations are professional-quality but not all natively reviewed — if you spot a wrong term, please report it.

> Renaming a caption yourself (any `label_*` key) always takes priority over the translation table for that one caption.

---

## Navigation & the Entity-Row Model

The left rail has **9 tiles**: Dashboard, Energy, Smart Plugs, Battery, Climate, Security, Automation, Lighting, System. Tapping the **▾** button at the bottom folds the rail down to just the first three (Dashboard / Energy / Smart Plugs); tapping again unfolds it.

Five of the nine views — **Climate, Security, Lighting, Automation, Smart Plugs** — share the same underlying pattern, the **entity-row model**:

- Each built-in slot (e.g. Climate's "Fridge Temp", Security's "Front Door") is a **pick an entity → optionally rename it → done**. Leave the entity blank and that tile simply doesn't render.
- Each of those views also has **6 free "extra" slots** — pick any entity, give it a name, and it shows up in a "More" group. This is how you add extra rooms, extra sensors, extra relays, etc. that don't fit a named built-in slot.
- A row/tile/group with nothing configured is *removed entirely*, not shown empty or dashed-out — so a view with nothing set shows a short "No … configured" hint instead of a wall of blank tiles.
- **Auto-discovery** is available as an alternative for Climate, Security, Lighting, and Automation (`auto_discover_*` toggles in each view's editor section): turning it on shows *every* matching entity by domain/device-class automatically and **ignores** the manual picks below it. It's one or the other, not a merge.

Two views work a little differently:
- **Battery View** has its own entity slots (`bat_*`) separate from the main face's battery entities (`battery_*`), because some users genuinely want the view to show a different pack/source. If you leave a `bat_*` field blank, it automatically uses the matching main-face entity instead — so most people never need to touch this section at all.
- **System** and **Energy** are populated entirely by their own dedicated editor sections (not the entity-row "extras" pattern).

---

## Smart Plugs

A dedicated nav view (3rd tile) with 6 plug slots. Each slot is:

| Field | Purpose |
|---|---|
| Entity | the `switch.*` to toggle |
| Name | optional display name (defaults to the entity's friendly name) |
| Power | optional power sensor — shown under the name in whatever unit *that* sensor reports (W, kW, etc.) |

Tap a plug tile to toggle it. Empty slots are hidden; the rest lay out in a simple grid.

---

## Cameras

Security View supports 2 camera tiles (`sec_cam1` / `sec_cam2`). There are two ways they can stream:

1. **go2rtc** (best quality/latency, requires your own go2rtc server) — set `camera_stream_base` to your go2rtc URL and the tile embeds its `stream.html` viewer.
2. **No go2rtc set up?** As long as `sec_cam1`/`sec_cam2` point at a real camera entity, the tile automatically falls back to a live MJPEG stream signed directly through Home Assistant — no extra server, no extra config. If your HA version doesn't support stream-signing, it falls back further to a refreshed snapshot rather than showing nothing.

Tap any camera tile to open it full-screen (closes with the **✕** in the corner or by tapping outside it).

> Adding the camera **entity** alone is enough — `camera_stream_base` is only needed if you specifically want go2rtc instead of HA's own stream.

---

## Configuration Reference

All keys are configurable through the visual editor unless noted; YAML equivalents are listed for reference. Almost every caption can be renamed with a matching `label_<key>` key (e.g. `label_consump` renames the LOAD tile's caption).

### Solar (PV)

| Key | Default | Description |
|---|---|---|
| `pv1_power` | `sensor.goodwe_pv1_power` | PV string 1 power |
| `pv2_power` … `pv6_power` | `''` | PV strings 2–6 power (string 2 used to default to a placeholder — now blank like 3–6) |
| `pv1_voltage` … `pv6_voltage` | `'sensor.goodwe_pv1_voltage'` / `''` | Per-string voltage |
| `pv_total_power` | `sensor.goodwe_pv_power` | Fallback total PV power, used only if **no** individual string is set |
| `pv_max_power` | `7500` | Max PV power for the PV capsule bar (W) |
| `_show_pv_extra` | `false` | Raises the string cap from 2 to 6 (PV tile + battery-back PV view) |
| `_show_pvtile` | `true` | Show/hide the small PV PWR/VOLT tile next to the battery |

> The dedicated PV tile shows exactly as many columns as you've configured (1 string = 1 column), and disappears entirely if none are set.

### Grid

| Key | Default | Description |
|---|---|---|
| `grid_active_power` | `sensor.goodwe_active_power` | Grid active power |
| `grid_voltage` | `''` | Grid voltage |
| `grid_import_today` | `sensor.goodwe_today_energy_import` | Today's grid import |
| `grid_export_energy` | `''` | Today's grid export |
| `consump` | `sensor.goodwe_house_consumption` | House load (drives the LOAD tile, INV LOAD %, and PWR bar) |
| `invert_grid_power` | `true` | Invert sign if positive = exporting |
| `grid_phase_a/b/c` | `''` | Per-phase power (3-phase) |
| `grid_phase_a/b/c_volt` | `''` | Per-phase voltage |
| `_show_phase` | `true` | Show/hide the whole Grid-Phases ⇄ Inverter flip tile |

### Phase / Inverter Tile

| Key | Default | Description |
|---|---|---|
| `inv_l1_power` / `inv_l2_power` | `sensor.goodwe_back_up_l1/l2_power` | Inverter backup-power phases (back face) |
| `inv_l3_power` | `''` | Phase 3 |
| `inv_l1/l2/l3_volt` | `''` | Inverter phase voltages |
| `inverter_output_power` | `''` | **Optional.** If set, the INV LOAD % gauge uses *this* entity's value instead of total house consumption — for hybrid setups where other inverters/PV sources also feed the house directly |
| `label_phase_title` / `label_inv_title` | `'GRID PHASES'` / `'INVERTER'` | Front/back titles |

### Primary Battery

| Key | Default | Description |
|---|---|---|
| `battery_soc` | `sensor.jk_soc` | State of charge |
| `battery_power` | `sensor.jk_power` | Battery power — inverted sign (see note above) |
| `battery_current` | `sensor.jk_current` | Battery current |
| `battery_voltage` | `sensor.jk_voltage` | Battery voltage |
| `battery_min_cell` / `battery_max_cell` | `''` | Cell voltage extremes — now actually drive the CELL VOLT colour (red/orange/green) |
| `battery_temp1` / `battery_temp2` | `''` | Cell temperature probes |
| `cell_temp_x10` | `false` | Enable if your temp sensor reports 10× too low (e.g. shows 3.3 instead of 33 °C) |
| `battery_mos` | `''` | BMS / MOS temperature |
| `battery_cap_unit` | `'ah'` | `ah` or `kwh` — selects which capacity field is used |
| `battery_full_ah` / `battery_full_wh` | `0` | Nameplate capacity (plain numbers, not entities) |
| `invert_battery_power` | `false` | Invert sign if positive = discharging |
| `_show_battstats` | `true` | Show/hide the whole battery stats tile (front: 6 stats, back: 6 PV strings) |

### Secondary Battery

| Key | Default | Description |
|---|---|---|
| `_show_battery2` | `false` | Enable a second pack |
| `battery2_soc` / `_power` / `_current` / `_voltage` / `_mos` | `''` | Secondary pack telemetry |
| `battery2_cap_unit` / `_full_ah` / `_full_wh` | `'ah'` / `0` / `0` | Secondary capacity |

### EV / Car Charger

| Key | Default | Description |
|---|---|---|
| `_show_ev` | `false` | Enable the EV tile |
| `charger_power` / `charger_current` / `charger_soc` | `''` | Charger power / current / car SOC — power is unit-aware (W or kW) |
| `charger_eta` | `''` | Charge ETA |
| `charger_battery_capacity_wh` | `0` | EV battery capacity — **stored but not yet wired into any calculation** |
| `charger_state` | `''` | **Still unused by the card** (kept for a future build) |

### Energy Today / Totals

| Key | Default | Description |
|---|---|---|
| `total_pv` | `sensor.goodwe_total_pv_generation` | Lifetime PV generation |
| `total_import` / `total_export` | `''` | **Standalone** lifetime import/export — read only these two entities, `--` if unset, never falls back to the daily tiles |
| `today_pv` / `today_load` | `''` / `''` | Daily PV / load |
| `today_batt_chg` | `sensor.goodwe_today_battery_charge` | Daily battery charge |
| `batt_dis` | `sensor.goodwe_today_battery_discharge` | Daily battery discharge |
| `label_total_imp` / `label_total_exp` / `label_chg_dis` | `'TOTAL IMP'` / `'TOTAL EXP'` / `'CHG / DIS'` | Captions for the bottom totals row |
| `label_today_consumption` / `label_today_production` | English default | Captions for the two big charts |

> Every kWh-suffixed value (this section's tiles, plus battery charge/discharge and grid import/export) reads the **entity's own** `unit_of_measurement` — if your sensor reports Wh instead of kWh, the tile shows `Wh`, not a misleading `kWh`. Falls back to `kWh` only if the entity declares no unit at all.

### Weather / Sun

| Key | Default | Description |
|---|---|---|
| `weather_entity` | `weather.home` | Drives sky variant + condition + overlay animation |
| `weather_temp_entity` / `_wind_entity` / `_dir_entity` | `''` | Header weather detail popup |
| `sun` | `sun.sun` | Sun/moon arc position |

### Thresholds

| Key | Default | Description |
|---|---|---|
| `thresh_soc_low` / `_critical` | `25` / `15` | Battery SOC colour bands (%) |
| `thresh_temp_warn` / `_critical` | `40` / `50` | Temperature colour bands (°C) |
| `thresh_cell_v_low` / `_critical` / `_high` | `3.1` / `3.0` / `3.65` | Cell voltage bands (V) — now live |
| `thresh_load_warn` / `_critical` | `70` / `90` | Load colour bands (%) |
| `thresh_endurance_low` / `_crit` | `2` / `1` | Endurance colour bands (hours) |

### Toggles

All in one editor section, each independent:

| Key | Default | Hides/shows |
|---|---|---|
| `_show_bars` | `true` | Both PV / PWR capsule bars |
| `_show_phase` | `true` | The Grid-Phases ⇄ Inverter flip tile |
| `_show_battstats` | `true` | The battery stats tile (flip → 6 PV strings) |
| `_show_pvtile` | `true` | The small PV PWR/VOLT tile |
| `_show_pv_extra` | `false` | PV strings 3–6 |
| `_show_ev` | `false` | The EV tile |
| `_show_battery2` | `false` | The secondary battery |

### Title & General

| Key | Default | Description |
|---|---|---|
| `title` | `'CASA LUNA'` | The only editable header text |
| `inverter_name` | `''` | Free-text label, shown wherever an inverter name is referenced |
| `pv_max_power` | `7500` | PV bar scaling |
| `inverter_max_power` | `6000` | Inverter/PWR bar + INV LOAD % scaling |
| `lower_section_offset` | `0` | Flow-diagram vertical nudge (SVG units) |

> **Subtitle is hardcoded**, not a config key: `ENERGY • AUTOMATION • SECURITY • by the Khan`. See **Title & Attribution** below.

### Bottom Tiles (1–6)

Each tile (`_extra_tile_N_*`, N = 1–6) has:

| Key | Description |
|---|---|
| `_extra_tile_N_enabled` | Show/hide this tile — disabled tiles are skipped and the rest compact left |
| `_extra_tile_N_label` | Free-text name (auto-shrinks to fit, ellipsis as a last resort) |
| `_extra_tile_N_entity` | Any entity |
| `_extra_tile_N_icon` | Static: `home batt bolt therm shield gear sun pump irrig warn plug` · Animated: `flame snow water heat fan bulb plug` |

Default tiles: 1=Heat Pump, 2=Irrigation, 3=Gas/Flame, 4=AC, 5=Lights, 6=Outlet.

### Nav-view sections (entity-row model)

Climate, Security, Lighting, and Automation each have:
- Named built-in slots with a paired `_name` override (e.g. `clim_fridge_temp` + `clim_fridge_temp_name`)
- `auto_discover_<view>` toggle (default `false`) — auto-discover by domain/device-class, ignoring manual picks
- 6 `<view>_extra_N_entity` + `<view>_extra_N_name` free slots

Smart Plugs has 6 `plug_N_entity` + `plug_N_name` + `plug_N_power` slots (see **Smart Plugs** above).

Battery View has its own `bat_soc` / `bat_voltage` / `bat_current` / `bat_power` / `bat_remain` / `bat_cellmax` / `bat_cellmin` / `bat_temp1` / `bat_temp2` / `bat_mos` — each falls back to the matching main-face `battery_*` entity if left blank.

System and Energy views are populated by their own dedicated editor sections (`sys_*`, `en_*` keys) rather than the extras pattern.

---

## Visual Editor Sections

Two-column layout (collapses to one column on narrow panels). In order:

| Section | Sub-sections | Notes |
|---|---|---|
| General | — | Title, inverter name, capacities, PV/inverter max power |
| Toggles | — | The 7 show/hide switches above |
| Weather & Sun | — | — |
| Solar | Extra PV Strings | PV1–2 always visible, 3–6 nested |
| Grid | 3-Phase Breakdown | — |
| Phase / Inverter Tile | — | Includes Inverter Output Power |
| Battery | Secondary Battery | — |
| Inverter | — | State, error, temp |
| Energy Today | — | Daily + lifetime energy, totals captions |
| EV / Car Charger | — | — |
| Bottom Tiles (1–6) | one sub-section per tile | Each collapses when disabled |
| Thresholds | — | All colour bands |
| Appearance | — | Background, colours, opacity, blur |
| Text Sizes | — | Per-element font sizes |
| Cameras (go2rtc) | — | — |
| Energy View | — | `en_*` keys |
| Smart Plugs View | — | 6 plug slots |
| Battery View | — | `bat_*` keys + fallback note |
| Climate View | — | Entity-row model |
| Security View | — | Entity-row model |
| Automation View | — | Entity-row model + 4 relays |
| Lighting View | — | Entity-row model |
| Recent Events | — | — |
| System View | — | `sys_*` keys |
| Testing | — | Demo-mode helpers |

---

## Colour Logic

| Metric | Thresholds |
|---|---|
| **Battery SOC** | ≤15% red · ≤25% orange · >25% blue |
| **Temperature** (cell/BMS) | ≥critical red · ≥warn orange · below = green |
| **Cell Voltage** | ≤critical red · ≤low **or** ≥high orange · between = green |
| **Load** | ≥90% red · ≥70% orange · below green |

All thresholds are adjustable in the **Thresholds** editor section. Cell-voltage and normal-range temperature colouring read live from these thresholds (previously cell-voltage thresholds existed in the editor but weren't wired to anything — that's fixed).

---

## Decimal Formatting

One rule, applied everywhere a number is shown: **if the source value has more than 2 decimal places, it's rounded to 2; otherwise it's shown exactly as the sensor reports it.** `60.000` → `60.00`, `3.201` → `3.20`, `98.215` → `98.22`, but `240` stays `240`, `98.2` stays `98.2`, and the big SOC % stays a whole number. This reads the sensor's *raw* string where possible, so trailing-zero precision (`60.000`) isn't lost the way a naive `parseFloat` would lose it.

Every power-type entity (battery, grid, inverter phases, PV strings, EV charger, the Energy/Battery-view power tiles) is additionally normalized to **Watts** based on its own `unit_of_measurement` before any kW conversion — so a sensor reporting `1.2` with unit `kW` is treated as 1200 W, not 1.2 W.

---

## Title & Attribution

- **Title** (big "CASA LUNA" text) is the only editable header text — set it in **General → Title**.
- **Subtitle** is hardcoded: `ENERGY • AUTOMATION • SECURITY • by the Khan`. It is not a config key and has no editor field.
- The card verifies at startup that the rendered subtitle still contains the "by the Khan" credit (checked against an independently-stored reference, not just a string match against the visible template). If that credit has been removed or altered, the card stops functioning and shows a notice instead of the dashboard.
- **Honest limitation:** this check lives in the same unobfuscated source as everything else, so it can be edited out by anyone willing to read the code. It's a deterrent, not a lock — the planned release-time minification/obfuscation pass is what's meant to make it actually stick. Feature words in the subtitle may be edited (e.g. translating "ENERGY" elsewhere); only removing/altering the credit itself trips it.

---

## Theming

Colours, background, opacity, blur and text sizes are exposed as CSS variables and editor controls (`--cl-box-bg`, `--cl-blur`, etc.). Background images follow the `casa-luna-<variant>.png` naming under `background_path`. The card uses shadow DOM, so HA themes do not penetrate it — all colours are hardcoded or entity-driven.

---

## UX Details

- **Battery flip tile** (front stats ⇄ back 6 PV strings) is a plain show/hide swap — no CSS 3D transform. This was rebuilt specifically because the old `rotateY`/`backface-visibility` approach could mirror or double-render both faces on some browsers.
- **Phase/Inverter flip tile** still uses the original CSS 3D flip (corner `↻` button, `backdrop-filter` disabled to avoid the Firefox preserve-3d flattening bug from build 42). Only the battery tile was rebuilt; this one wasn't reported as having the same issue.
- **Nav fold:** the slider button sits right above the bottom device-tile row. Folding keeps the first 3 tiles (Dashboard/Energy/Smart Plugs) and slides the rest away; unfolding reverses it.
- **Hide-when-empty:** unconfigured tiles, rows, and whole groups disappear rather than showing dashed placeholders — true across Climate, Security, Lighting, the PV tile, and the bottom totals.
- **Bottom tiles** auto-shrink long names to fit before falling back to an ellipsis; disabled tiles are skipped and the rest compact left, not just hidden in place.
- **Flow lines:** orange `#e07800` = importing/discharging, green `#39ff14` = exporting/charging, on both the grid and battery paths; the animated dot direction reverses correctly with the arrow on both. **There is no flow line for EV charging** — the EV tile is a standalone numeric readout (W/A/SOC/ETA), not connected to the animated diagram. That's by design, not a bug.
- **Popups stay light:** the card's own popups (confirm sheet, power menu, calendar, weather popup, device tap-popup, camera fullscreen) use a faint backdrop with no blur, so the dashboard underneath stays clearly visible. This does **not** apply to Home Assistant's own native more-info/history dialog (opened by tapping most live values) — that's rendered entirely by HA's frontend, outside the card, and its backdrop isn't something this card can control.
- Scrollable tiles are used only inside nav-panel overlays, never on the main face.

---

## File Structure

```
/config/www/community/casa-luna/
│
├── casa-luna.js                ← single JS file, register as Lovelace resource
│
└── sky/                        ← 13 PNG background images
    ├── casa-luna-clear-day.png
    ├── casa-luna-clear-dawn.png
    ├── casa-luna-clear-dusk.png
    ├── casa-luna-clear-night.png
    ├── casa-luna-partlycloudy-day.png
    ├── casa-luna-partlycloudy-night.png
    ├── casa-luna-cloudy-day.png
    ├── casa-luna-cloudy-night.png
    ├── casa-luna-rainy-day.png
    ├── casa-luna-rainy-night.png
    ├── casa-luna-thunderstorm.png
    ├── casa-luna-snowy-day.png
    └── casa-luna-fog-day.png
```

### Internal class structure

```
casa-luna.js
│
├── const LANG = { de, fr, es, it, pt, nl, pl, sv, nb, da, fi, ru, uk, tr }
│     83 caption keys per language; English is the implicit baseline/fallback
│
├── const NAV_VIEWS = [ 9 entries: key, title, subtitle, icon ]
│
├── class CasaLunaEditor        (visual editor — HTMLElement, shadow DOM)
│   ├── setConfig() / _render() / focusSection()
│   ├── section()                collapsible section — supports sub:true, wide:true,
│   │                            toggleKey/toggleOn/hidden (for per-item collapse)
│   ├── picker() / entityRow() / eg()     entity selectors (eg = entityRow w/ auto label key)
│   ├── textField() / numberField() / switchRow() / capGroup()
│   └── info() / divider()       static hint text / visual separators
│
└── class CasaLuna              (main card — HTMLElement, shadow DOM)
    ├── setConfig()              merges config with stub defaults
    ├── _build()                 full innerHTML render (once per config)
    │   ├── _verifyAttribution() / _lockCard()    title/attribution check
    │   └── _localizedConfig()   swaps untouched label_* defaults to the active language
    ├── _bindEvents()            wires taps, flips, nav, sliders, popups
    ├── _update()                live values, colours, charts (every hass tick)
    │   ├── _updateFlows()       animated flow paths + power labels (grid + battery,
    │   │                       both directions now correctly reverse the dot animation)
    │   ├── _gridNetW() / _invLoadW() / _pvSum()    normalized power aggregates
    │   ├── _watts()             normalizes any power entity to Watts via its own unit
    │   ├── _dec() / _decEnt() / _kwhEnt()           the conditional-decimal rule
    │   ├── _updateArc()         sun/moon position
    │   └── _updateBottomTiles() / _fitBottomLabels()
    ├── _viewClimate() / _viewSecurity() / _viewLighting() / _viewAutomation() / _viewPlugs()
    │                            the 5 entity-row-model views
    ├── _viewEnergy() / _viewBattery() / _viewSystem() / _viewGeneric()
    ├── _wTile() / _wToggleTile() / _wPlugTile() / _wLight() / _wClimate() / _wScenes() / _wCameras()
    │                            shared per-item widgets used across nav views —
    │                            unavailable-safe, decimal-rule-compliant
    ├── _moonSVG() / _moonPhase() / _starField() / _buildWxLayer() / _buildPvWaveHTML()
    ├── _setNavCompact()         nav fold / unfold
    ├── _statusPopup() / _updateStatusIcons()        header status row
    ├── _renderEvents()          event center
    ├── _battFill()              SOC → fill height + colour
    ├── _fetchHistory() / _drawHistory()             history charts
    ├── _t()                     caption translation lookup
    └── _num() / _st() / _stateObj() / _attr()       safe entity readers
```

---

## Notes

- Tested on Home Assistant OS with GoodWe ET/ES + JK BMS, and reported working with Sungrow and Victron setups via the entity-row model and Battery View fallback. Designed for a 1500 × 1000 wall tablet — not a responsive/mobile layout.
- The card uses shadow DOM — theme CSS does not penetrate. All colours are hardcoded or entity-driven.
- Config keys prefixed with `_` (e.g. `_show_ev`) are visibility/feature toggles stored in the card YAML.
- Sky selection requires a `weather_entity`; without it the card falls back to the clear day/night variant.
- Tuya timer UIs store schedules in HA `input_datetime` helpers — the card never runs schedules itself.
- `charger_state` and `charger_battery_capacity_wh` are stored but not yet wired into any display or calculation — reserved for a future build.
- Always bump the `VERSION` / `build no.` header after edits and hard-refresh, or the browser may serve a cached module.

---

## Troubleshooting

### Card does not appear / "Custom element doesn't exist: casa-luna"
- Confirm the resource is registered: **Settings → Dashboards → Resources**. You should see `/hacsfiles/casa-luna/casa-luna.js` (HACS) or `/local/community/casa-luna/casa-luna.js` (manual), type **JavaScript Module**.
- Hard refresh (`Ctrl/Cmd + Shift + R`). On the mobile app, force-close and reopen.

### "Casa Luna — attribution required" notice instead of the dashboard
- The subtitle's "by the Khan" credit has been altered or removed (in the file itself, or a modified copy). Restore the original subtitle text to re-enable the card.

### Sky background missing / wrong image
- Confirm all 13 PNGs exist under `/config/www/community/casa-luna/sky/` with exact, case-sensitive names.

### Camera shows "stream not set" even though the entity is configured
- Fixed in build 70 — the card now streams directly through Home Assistant without needing go2rtc. Update the card; if it persists, check the camera entity isn't `unavailable` and that your HA user has permission to view it.

### Tapping a tile/popup darkens or freezes the whole dashboard
- Fixed in build 70 for the card's own popups (confirm sheet, power menu, calendar, weather, device popup, camera fullscreen) — they now use a light, non-blurred backdrop. Home Assistant's own native more-info/history dialog is unaffected by this — that one is HA's own UI, not something the card can change.

### An energy tile shows the wrong-looking unit (e.g. a huge "kWh" number)
- Fixed in build 70 — these now read the entity's own `unit_of_measurement` instead of assuming kWh. If your sensor reports Wh, the tile will correctly show Wh.

### No flow line animates when my EV is charging
- Expected — the EV tile has never had a connected flow-line animation; it's a standalone numeric readout. Not a bug, just not built (yet).
- Ensure `weather_entity` is set and not `unavailable`.

### Card looks correct but shows the wrong language
- It follows Home Assistant's own language automatically. To force one, add `language: <code>` to the card YAML (see **Language**). Unsupported languages fall back to English.

### A power reading looks 1000× too small (or shows `0.00`)
- This was a real bug class, fixed in build 68 — every power entity now reads its own `unit_of_measurement`. If you're still seeing it on an older build, update the card.

### My battery mode is stuck on "IDLE" even though it's clearly charging/discharging
- Same root cause as above (a kW-reporting battery-power sensor wasn't being converted before build 68). Update the card; if it persists, check `invert_battery_power`.

### A nav-view tile or "extra" entity I configured doesn't show up
- Check the matching `auto_discover_<view>` toggle isn't on — auto-discovery ignores manual picks entirely while enabled.
- Confirm the entity isn't reporting `unavailable`/`unknown` — those are treated the same as "not configured" and the tile hides.

### Disabling a bottom tile in the editor didn't remove it from the dashboard
- Fixed in build 68 — make sure you're on the current build.

### Battery View shows GoodWe/JK-looking data even though I use a different brand
- Leave the Battery View's own fields (`bat_*`) blank — it will automatically mirror whatever you've set on the main face's Battery section. You only need to fill in `bat_*` if you want the view to show something *different* from the main face.

### Capacity / Endurance tiles show `--`
- Set `battery_full_ah` (or `battery_full_wh`) and `battery_cap_unit` in YAML — they're plain numbers, not entities, and default to `0`.

### Flip tiles render mirrored or doubled
- The battery tile no longer uses a CSS 3D flip at all (build 68), so this shouldn't recur there. If you see it on the Grid-Phases/Inverter tile, hard-refresh — the `backdrop-filter` fix from build 42 should already cover it.

### Entities show `--` or don't update
- Check **Developer Tools → States**: the entity must exist and return a numeric value (not `unavailable`/`unknown`). Entity IDs are case-sensitive.

### Sun/moon arc misaligned or static
- Ensure the `sun` entity is set and exposes `next_rising` / `next_setting`.

### Reporting a bug
Include: HA version, Casa Luna build number (file header / DevTools console), browser console errors, and the relevant card YAML (sanitise entity names if needed).

---

*Casa Luna · by The Khan · v1.0.0 (build 70)*

Email: khan.automationha@gmail.com
