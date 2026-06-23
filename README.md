# casa-luna Pre-release version.

**Casa Luna — Home Assistant Solar / Off-Grid Wall Dashboard**

`casa-luna.js` · Casa Luna Edition **v1.0.0** (build 42)

<!-- Replace with your own screenshot -->
<img width="1500" alt="Casa Luna dashboard" src="docs/casa-luna.png" />

> **Origin:** `casa-luna` is a full expansion of [`khan-skycard`](https://github.com/thekhan1122/khan-skycard) (itself a visual overhaul of [`k-flow-card`](https://github.com/thekhan1122/k-flow-card)) and lives in its own separate repository. It keeps the same entity schema, visual editor and weather-aware sky system, but grows the single energy-flow card into a full multi-view wall dashboard. The custom element is renamed `casa-luna` to avoid a `customElements` collision when both cards are installed.

---

## Overview

`casa-luna` is a custom Home Assistant Lovelace card that renders a live, animated energy and home-automation dashboard against a full-card photographic sky background. Thirteen background images cover every major weather × time-of-day combination — the card picks the right one automatically from a `weather` entity and the current sun elevation.

It targets a GoodWe inverter with JK BMS storage, single- or 3-phase grid, PV production, EV charging, and home devices, on a fixed **1500 × 1000** wall-mounted tablet. Self-contained in a single JavaScript file — no NPM, no build step, no extra dependencies — and updates live via the standard `hass` setter.

---

## What Changed from khan-skycard

| Area | khan-skycard (Sky Edition) | casa-luna |
|---|---|---|
| **Scope** | Single energy-flow card | Full dashboard — 8 nav views + 6 device tiles + event center |
| **Layout** | Free sky composition | Fixed 1500 × 1000 wall-tablet blueprint |
| **Element** | `khan-skycard` | `casa-luna` (renamed to avoid collision) |
| **Sky images** | `sky-<variant>.png` | `casa-luna-<variant>.png` (same 13-variant system) |
| **Battery** | SVG fill bar | Cylinder + **tap-flip** stat tile (front full / back condensed) |
| **Grid / Inverter** | Single-phase | 3-phase **flip tile** (Grid Phases ⇄ Inverter L1/L2/L3) |
| **Right column** | — | MODE, PV tile, EV tile, production/consumption history charts, totals |
| **Navigation** | — | 8 collapsible/foldable views with auto-discovery (Flavor A) |
| **Header** | — | Status row (Wi-Fi / power / Bluetooth / camera) with popups, clock calendar, weather popup |
| **Theming** | Hardcoded | Global CSS-variable theme system + editor controls |
| **Tiles** | — | CSS 3D flip cards with corner buttons; animated device icons |

---

## Features

- Animated energy-flow paths (solar → inverter → battery / grid / home / EV) with directional colouring (orange = importing, green = exporting)
- Live sun/moon arc positioned from `sun.sun` (real sunrise/sunset), night star field, weather-driven background variants
- Battery cylinder with SOC colour coding + tap-flip stat tile (Current / Capacity / Endurance on the back)
- Single- and 3-phase grid + inverter in a flip tile
- Dual battery support (primary + secondary)
- EV / car charger tile (W / A / SOC / ETA) directly under the PV tile
- Extra PV strings (PV3 / PV4) with a combined toggle
- 8 navigation views (Dashboard, Energy, Battery, Climate, Security, Automation, Lighting, System); the nav rail folds to the first three tiles
- 6 device tiles with animated state icons; production/consumption history charts with peak markers; event center
- Header status row with tap popups, month-calendar on the clock, weather detail popup
- Full visual editor with collapsible sections — no YAML required for setup
- Global theme controls (background, accent colours, opacity, blur, text sizes)
- Fully dark-themed, shadow-DOM isolated

> **Battery sign convention is inverted from standard** (GoodWe-via-inverter indirection): `battery_power > 50` = discharging, `< −50` = charging. Toggle `invert_battery_power` if your sensor differs.

---

## Supported hardware & integrations

| Domain | Source |
|---|---|
| Inverter | GoodWe (HA integration) |
| Battery / BMS | JK BMS |
| Grid metering | Tuya 3-phase meter |
| Smart switches / timers | Tuya (via `input_datetime` helpers) |
| Sensors / relays | ESP32 (gas, motion, flame, temp, lux + 4 relays) |
| Lighting | Zigbee |
| Cameras | go2rtc |
| Voice | Alexa |

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

---

### Method 2 — Manual

1. Copy the card and the 13 sky PNGs into your HA config:
   ```
   /config/www/community/casa-luna/casa-luna.js
   /config/www/community/casa-luna/sky/casa-luna-<variant>.png
   ```

2. Register the Lovelace resource
   *(Settings → Dashboards → ⋮ → Resources → Add)*:
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

The card needs 13 PNG files at `/config/www/community/casa-luna/sky/`. The variant is chosen from the `weather_entity` state and the `sun` elevation.

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

## Configuration Reference

All keys are configurable through the visual editor; YAML equivalents are listed for reference. Most on-screen captions can be renamed with a matching `label_<key>` key.

### Solar (PV)

| Key | Default | Description |
|---|---|---|
| `pv_total_power` | `sensor.goodwe_pv_power` | Total PV power (W) |
| `pv1_power` … `pv4_power` | `sensor.goodwe_pv1_power` / `''` | Per-string power |
| `pv1_voltage` … `pv4_voltage` | `''` | Per-string voltage |
| `pv_max_power` | `7500` | Max PV power for bar scaling (W) |
| `_show_pv_extra` | `false` | Enable PV3 / PV4 strings |

### Grid

| Key | Default | Description |
|---|---|---|
| `grid_active_power` | `sensor.goodwe_active_power` | Grid active power (W) |
| `grid_voltage` | `''` | Grid voltage (V) |
| `grid_import_today` | `''` | Today grid import (kWh) |
| `grid_export_energy` | `''` | Today grid export (kWh) |
| `consump` | `sensor.goodwe_house_consumption` | House consumption (W) |
| `invert_grid_power` | `true` | Invert sign if positive = exporting |
| `grid_phase_a/b/c` | `''` | Per-phase power (3-phase) |
| `grid_phase_a/b/c_volt` | `''` | Per-phase voltage (3-phase) |
| `_show_3phase` | `false` | Enable 3-phase breakdown |

### Primary Battery (JK BMS)

| Key | Default | Description |
|---|---|---|
| `battery_soc` | `sensor.jk_soc` | State of charge (%) |
| `battery_power` | `sensor.jk_power` | Battery power (W) — inverted sign |
| `battery_current` | `sensor.jk_current` | Battery current (A) |
| `battery_voltage` | `sensor.jk_voltage` | Battery voltage (V) |
| `battery_min_cell` / `battery_max_cell` | `''` | Cell voltage extremes |
| `battery_temp1` / `battery_temp2` | `''` | Cell temperature probes |
| `battery_mos` | `''` | BMS / MOS temperature |
| `battery_cap_unit` | `ah` | `ah` or `kwh` — selects the "full" field used |
| `battery_full_ah` | `0` | Nameplate capacity (Ah) — **set in YAML, editor field pending** |
| `battery_full_wh` | `0` | Nameplate capacity (Wh) — **set in YAML, editor field pending** |
| `invert_battery_power` | `false` | Invert sign if positive = discharging |

### Secondary Battery

| Key | Default | Description |
|---|---|---|
| `_show_battery2` | `false` | Enable secondary battery |
| `battery2_soc` / `_power` / `_current` / `_voltage` / `_mos` | `''` | Secondary pack telemetry |
| `battery2_cap_unit` / `battery2_full_ah` / `battery2_full_wh` | `ah` / `0` / `0` | Secondary capacity (set in YAML) |

### Inverter

| Key | Default | Description |
|---|---|---|
| `inverter_state` | `sensor.goodwe_work_mode` | Work mode / status text |
| `inverter_error` | `''` | Error indicator |
| `inv_temp` | `''` | Inverter temperature |
| `inv_l1/l2/l3_power` · `inv_l1/l2/l3_volt` | `''` | Inverter-side 3-phase (phase flip back face) |

### EV / Car Charger

| Key | Default | Description |
|---|---|---|
| `_show_ev` | `false` | Enable EV tile |
| `charger_power` / `charger_current` / `charger_soc` | `''` | Charger power / current / car SOC |
| `charger_eta` | `''` | Charge ETA (minutes) |
| `charger_battery_capacity_wh` | `''` | EV battery capacity (Wh) |
| `charger_state` | `''` | *Currently unused by the card* |

### Energy Today / Weather / Sun

| Key | Default | Description |
|---|---|---|
| `total_pv` | `sensor.goodwe_total_pv_generation` | Lifetime PV generation (kWh) |
| `today_pv` / `today_load` / `today_batt_chg` / `batt_dis` | `''` | Daily energy tiles |
| `weather_entity` | `weather.home` | Drives sky variant + condition |
| `weather_temp_entity` / `weather_wind_entity` / `weather_dir_entity` | `''` | Header weather detail |
| `sun` | `sun.sun` | Sun/moon arc position |

### Thresholds

| Key | Default | Description |
|---|---|---|
| `thresh_soc_low` / `thresh_soc_critical` | `25` / `15` | Battery SOC colour bands (%) |
| `thresh_temp_warn` / `thresh_temp_critical` | `40` / `50` | Temperature colour bands (°C) |
| `thresh_cell_v_low` / `_critical` / `_high` | `3.1` / `3.0` / `3.65` | Cell voltage bands (V) |
| `thresh_load_warn` / `thresh_load_critical` | `70` / `90` | Load colour bands (%) |

### Appearance & Layout

| Key | Default | Description |
|---|---|---|
| `background_path` | `/local/community/casa-luna/sky` | Sky image folder |
| `ui_bg_color` / `ui_bg_opacity` / `ui_blur` | theme | Tile background, opacity, blur |
| `lower_section_offset` | `0` | Flow-diagram vertical nudge (SVG units) |
| `sz_*` | per element | Text-size overrides |
| `_show_bars` | `true` | Show both PV / PWR capsule bars |

> **Capacity & Endurance:** depend on `battery_full_ah` / `battery_full_wh` + `battery_cap_unit` (and the `battery2_*` equivalents). They are plain numbers (not entities) and are **not yet exposed in the visual editor** — set them in YAML or the tiles show `--`.

---

## Visual Editor Sections

| Section | Toggle | Description |
|---|---|---|
| General | — | Global options, PV/PWR bars |
| Weather & Sun | — | Weather + sun entities |
| Solar | — | PV strings, total, max |
| Extra PV Strings | toggle | PV3 / PV4 |
| Grid | — | Grid power, import/export, consumption |
| 3-Phase Breakdown | toggle | Per-phase power & voltage |
| Phase / Inverter Tile | — | Flip-tile content |
| Battery | — | Full JK BMS telemetry |
| Secondary Battery | toggle | Second pack |
| Inverter | — | State, temp, 3-phase |
| Energy Today | — | Daily + lifetime energy |
| EV / Car Charger | toggle | Charger power, SOC, ETA |
| Bottom Tiles (1–6) | — | Device tiles + icons |
| Thresholds | — | Colour-band limits |
| Appearance | — | Background, colours, opacity, blur |
| Text Sizes | — | Per-element font sizes |
| Nav views (Cameras, Energy, Battery, Climate…) | per-view | Auto-discovery + per-view options |

> Nav-view device entities (`bat_*`, `clim_*`, `sec_*`, `light_*`, `auto_*`, `sys_*`, `en_*`, `tuya_*`) are resolved via **auto-discovery (Flavor A — device-class rules)** rather than individual pickers.

---

## Colour Logic

| Metric | Thresholds |
|---|---|
| **Battery SOC** | ≤15% red · ≤25% orange · >25% blue |
| **Temperature** | ≥50°C red · ≥40°C orange · below normal |
| **Cell Voltage** | <3.0V critical · <3.1V low · ≤3.65V normal · >3.65V high |
| **Load** | ≥90% red · ≥70% orange · below green |

All thresholds are adjustable in the **Thresholds** editor section.

---

## Theming

Colours, background, opacity, blur and text sizes are exposed as CSS variables and editor controls (`--cl-box-bg`, `--cl-blur`, etc.). Background images follow the `casa-luna-<variant>.png` naming under `background_path`. The card uses shadow DOM, so HA themes do not penetrate it — all colours are hardcoded or entity-driven.

---

## UX Details

- **Flip tiles** flip on a small corner `↻` button. Flip cards disable `backdrop-filter`, because a filtered ancestor flattens `transform-style: preserve-3d` in Firefox and breaks `backface-visibility` (both faces render, back mirrored).
- **Nav fold:** the slider button is pinned at the bottom of the rail. Folding hides tiles 4–8 and slides the first three down into the vacated slots; unfolding reverses it.
- **Flow lines:** orange `#e07800` import, green `#39ff14` export, sharing a common baseline.
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
├── class CasaLunaEditor        (visual editor — HTMLElement, shadow DOM)
│   ├── setConfig()             stores config, triggers render
│   ├── _render()               builds collapsible sections
│   ├── section()               collapsible section w/ optional toggle
│   ├── eg() / entityRow()      ha-selector entity picker
│   ├── numberField()           numeric input
│   └── switchRow()             pill toggle (supports default-on)
│
└── class CasaLuna              (main card — HTMLElement, shadow DOM)
    ├── setConfig()             merges config with stub defaults
    ├── _build()                full innerHTML render (once per config)
    ├── _bindEvents()           wires taps, flips, nav, sliders, popups
    ├── _update()               live values, colours, charts (every hass tick)
    ├── _updateFlows()          animated flow paths + power labels
    ├── _updateArc()            sun/moon position on the arc
    ├── _moonSVG() / _moonPhase()    moon rendering
    ├── _buildPvWaveHTML()      PV wave animation
    ├── _starField()            night sky
    ├── _buildWxLayer()         weather background variant
    ├── _setNavCompact()        nav fold / unfold
    ├── _statusPopup() / _updateStatusIcons()   header status row
    ├── _renderEvents()         event center
    ├── _battFill()             SOC → fill height + colour
    ├── _fetchHistory() / _drawHistory()   history charts
    ├── _num() / _st() / _stateObj()   safe entity readers
    └── _q() / _setTxt() / _dualVal()   DOM helpers
```

---

## Notes

- Tested on Home Assistant OS with GoodWe ET/ES + JK BMS. Designed for a 1500 × 1000 wall tablet — not a responsive/mobile layout.
- The card uses shadow DOM — theme CSS does not penetrate. All colours are hardcoded or entity-driven.
- Config keys prefixed with `_` (e.g. `_show_ev`) are visibility/feature toggles stored in the card YAML.
- Sky selection requires a `weather_entity`; without it the card falls back to the clear day/night variant.
- Tuya timer UIs store schedules in HA `input_datetime` helpers — the card never runs schedules itself.
- Always bump the `VERSION` / `build no.` header after edits and hard-refresh, or the browser may serve a cached module.

---

## Troubleshooting

### Card does not appear / "Custom element doesn't exist: casa-luna"

- Confirm the resource is registered: **Settings → Dashboards → Resources**. You should see `/hacsfiles/casa-luna/casa-luna.js` (HACS) or `/local/community/casa-luna/casa-luna.js` (manual), type **JavaScript Module**.
- Hard refresh (`Ctrl/Cmd + Shift + R`). On the mobile app, force-close and reopen.
- If manual, confirm the file path matches the registered resource exactly.

### Sky background missing / wrong image

- Confirm all 13 PNGs exist under `/config/www/community/casa-luna/sky/` with exact, case-sensitive names.
- Ensure `weather_entity` is set and not `unavailable`.
- DevTools → Network, filter `casa-luna-` to see which image is requested and whether it returns 200 or 404.

### Capacity / Endurance tiles show `--`

- Set `battery_full_ah` (or `battery_full_wh`) and `battery_cap_unit` in YAML — they default to `0` and have no editor field yet.
- Endurance also needs a valid `battery_current`; at ~0 current no estimate is shown.

### Flip tiles render mirrored or doubled (Firefox)

- Fixed in build 42 (flip cards drop `backdrop-filter`). Update the card and hard-refresh.

### Battery charge/discharge looks reversed

- Expected — the sign is inverted (GoodWe indirection). Toggle `invert_battery_power` if your sensor uses the opposite sign.

### Entities show `--` or don't update

- Check **Developer Tools → States**: the entity must exist and return a numeric value (not `unavailable`/`unknown`). Entity IDs are case-sensitive.

### Sun/moon arc misaligned or static

- Ensure the `sun` entity is set and exposes `next_rising` / `next_setting`. Without it the arc won't track but the rest of the card works.

### After a HACS update the card looks wrong

1. Hard refresh (`Ctrl/Cmd + Shift + R`).
2. If it persists, remove and re-add the resource in **Settings → Dashboards → Resources**, then restart HA.

### Reporting a bug

Include: HA version, Casa Luna build number (in the file header / DevTools console), browser console errors, and the relevant card YAML (sanitise entity names if needed).

---

*Casa Luna · by The Khan · v1.0.0 (build 42)*

Email: khan.automationha@gmail.com

