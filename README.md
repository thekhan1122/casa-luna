# Casa Luna

A custom Home Assistant Lovelace card — a full-screen, glanceable solar / off-grid energy and home-automation dashboard built for a wall-mounted tablet.

`casa-luna.js` renders a fixed **1500 × 1000** canvas: a live energy-flow diagram, battery state, PV production, grid (single- or 3-phase), EV charging, climate, security, lighting and system views, with an animated sky background that tracks the real sun/moon and weather.

> Current element version `1.0.0`, build `42`. Forked and substantially extended from `khan-skycard.js`, with components lifted from `ha-smart-room-card.js`.

---

## Features

- **Live energy-flow diagram** — grid ⇄ inverter ⇄ battery ⇄ PV ⇄ load, with directional flow lines (orange = importing, green = exporting) sharing a common baseline.
- **Animated sky** — sun/moon arc positioned from `sun.sun` (with real sunrise/sunset), star field at night, and weather-driven background variants (clear / cloudy / rain / snow / thunderstorm, day & night).
- **Battery cylinder + stats** — SOC %, cell/BMS temps, cell voltage, current, capacity and endurance. The stats tile is a **tap-flip card** (front: full readout; back: condensed Current / Capacity / Endurance).
- **3-phase support** — per-phase power & voltage in a flip tile (Grid Phases ⇄ Inverter L1/L2/L3), gated behind a toggle.
- **8 navigation views** — Dashboard, Energy, Battery, Climate, Security, Automation, Lighting, System. The nav rail **folds** to show only the first three tiles (tap the slider at the bottom).
- **6 device tiles** along the bottom with animated state icons (heat pump, irrigation, gas/flame, AC, lights, breaker/outlet…).
- **EV charger tile** (W / A / SOC / ETA), positioned directly under the PV tile.
- **Production / consumption history charts** with peak markers.
- **Event center** fed from camera/sensor entities.
- **Header status row** — Wi-Fi, power menu, Bluetooth, camera, with tap popups; clock opens a month calendar; weather opens a detail popup.
- **Full visual editor** (`casa-luna-editor`) with collapsible sections and native `ha-selector` entity pickers.
- **Global theme system** — background image/color/opacity/blur, accent colors and text sizes, all configurable.

---

## Target hardware & integrations

| Domain | Source |
|---|---|
| Inverter | GoodWe (via HA integration) |
| Battery / BMS | JK BMS |
| Grid metering | Tuya 3-phase meter |
| Smart switches / timers | Tuya (via `input_datetime` helpers) |
| Sensors / relays | ESP32 (gas, motion, flame, temp, lux + 4 relays) |
| Lighting | Zigbee |
| Cameras | go2rtc |
| Voice | Alexa |

> **Battery sign convention is inverted from standard** due to GoodWe-via-inverter indirection: `battery_power > 50` = *discharging*, `< −50` = *charging*.

---

## Requirements

- Home Assistant (HAOS or supervised) with the relevant integrations above already producing entities.
- A browser/tablet that supports CSS 3D transforms (Chrome, Firefox, WebKit all supported).
- Designed for a **1500 × 1000** viewport (wall tablet in landscape). It is not a responsive/mobile layout.

---

## Installation

1. **Copy the card and assets** to your HA config:

   ```
   /config/www/community/casa-luna/casa-luna.js
   /config/www/community/casa-luna/sky/casa-luna-<variant>.png   (background images)
   ```

2. **Register the resource** (Settings → Dashboards → ⋮ → Resources, or in YAML):

   ```yaml
   resources:
     - url: /local/community/casa-luna/casa-luna.js
       type: module
   ```

3. **Add the card** to a Panel-mode (single-card, full-width) dashboard:

   ```yaml
   type: custom:casa-luna
   ```

   Then open the card's visual editor to bind entities, or paste a full YAML config (below).

---

## Quick-start configuration

Minimum useful config — the rest fall back to sensible defaults or the visual editor:

```yaml
type: custom:casa-luna
# --- Solar ---
pv_total_power: sensor.goodwe_pv_power
pv1_power: sensor.goodwe_pv1_power
pv1_voltage: sensor.goodwe_pv1_voltage
# --- Battery (JK BMS) ---
battery_soc: sensor.jk_bms_soc
battery_power: sensor.goodwe_battery_power
battery_current: sensor.jk_bms_current
battery_voltage: sensor.jk_bms_voltage
battery_min_cell: sensor.jk_bms_cell_min
battery_temp1: sensor.jk_bms_temp
battery_mos: sensor.jk_bms_mos_temp
# Capacity / Endurance — plain numbers, NOT entities (see note below)
battery_cap_unit: ah          # 'ah' or 'kwh'
battery_full_ah: 280          # battery nameplate capacity
# --- Grid ---
grid_active_power: sensor.tuya_grid_power
grid_voltage: sensor.tuya_grid_voltage
grid_import_today: sensor.grid_import_energy
grid_export_energy: sensor.grid_export_energy
# --- Inverter ---
inverter_state: sensor.goodwe_work_mode
inv_temp: sensor.goodwe_inverter_temp
# --- Weather & sun ---
weather_entity: weather.home
sun: sun.sun
# --- Energy today ---
consump: sensor.house_consumption_today
total_pv: sensor.pv_generation_total
today_pv: sensor.pv_today
today_load: sensor.load_today
today_batt_chg: sensor.battery_charge_today
```

> **Important — Capacity & Endurance.** `battery_full_ah` / `battery_full_wh` and `battery_cap_unit` are **plain numbers/units, not entities**, and are **not yet exposed in the visual editor**. If they're left at the default `0`, the Capacity and Endurance readouts will show `--`. Set them in YAML (as above) until the editor fields are added. The same applies to the `battery2_*` capacity keys for a secondary battery.

---

## Configuration reference

All keys are read off the card config object. Entity keys take an entity_id; number/unit/toggle keys take literals. Most have a matching label key `label_<key>` for renaming the on-screen caption.

### Solar (PV)

| Key | Type | Notes |
|---|---|---|
| `pv_total_power` | entity | Total PV power |
| `pv1_power` … `pv4_power` | entity | Per-string power |
| `pv1_voltage` … `pv4_voltage` | entity | Per-string voltage |
| `pv_max_power` | number | Bar scaling max (editor: number field) |

### Battery (primary) & secondary (`battery2_*`)

| Key | Type | Notes |
|---|---|---|
| `battery_soc` | entity | State of charge % |
| `battery_power` | entity | Inverted sign (see convention) |
| `battery_current` | entity | |
| `battery_voltage` | entity | |
| `battery_min_cell` / `battery_max_cell` | entity | Cell voltage extremes |
| `battery_temp1` / `battery_temp2` | entity | Cell temps |
| `battery_mos` | entity | BMS/MOS temp |
| `battery_cap_unit` | `ah` \| `kwh` | Selects which "full" field is used |
| `battery_full_ah` / `battery_full_wh` | number | Nameplate capacity for Capacity/Endurance (**editor field pending**) |

### Grid (single + 3-phase)

| Key | Type | Notes |
|---|---|---|
| `grid_active_power` | entity | Net grid power |
| `grid_voltage` | entity | |
| `grid_import_today` / `grid_export_energy` | entity | Daily energy |
| `grid_phase_a/b/c` | entity | Per-phase power (toggle: 3-phase) |
| `grid_phase_a/b/c_volt` | entity | Per-phase voltage |

### Inverter

| Key | Type | Notes |
|---|---|---|
| `inverter_state` | entity | Work mode / status text |
| `inverter_error` | entity | Error/no-error indicator |
| `inv_temp` | entity | Inverter temperature |
| `inv_l1/l2/l3_power` / `inv_l1/l2/l3_volt` | entity | Inverter-side 3-phase (phase flip back face) |

### EV / Charger

| Key | Type | Notes |
|---|---|---|
| `charger_power` / `charger_current` / `charger_soc` / `charger_eta` | entity | EV tile (W / A / SOC / ETA) |
| `charger_state` | entity | **Currently unused by the card** |

### Energy today / Weather / Sun

| Key | Type | Notes |
|---|---|---|
| `consump` | entity | Consumption history + total |
| `total_pv` / `today_pv` / `today_load` / `today_batt_chg` | entity | Energy-today tiles & production chart |
| `weather_entity` | entity | Drives background variant + condition |
| `weather_temp_entity` / `weather_wind_entity` / `weather_dir_entity` | entity | Header weather detail |
| `sun` | entity | Sun/moon arc (defaults to `sun.sun`) |

### Navigation-view devices (auto-discovery)

The 8 nav views and 6 bottom tiles resolve their device entities via **auto-discovery (Flavor A — device-class rules)** with per-view toggles, rather than individual pickers. Families: `bat_*`, `clim_*`, `sec_*`, `light_*`, `auto_*`, `sys_*`, `en_*`, `tuya_*`. Tuya timer UIs store schedules in HA `input_datetime` helpers — the card never runs schedules itself.

### Appearance & layout

| Key | Type | Notes |
|---|---|---|
| `background_path` | path | Default `/local/community/casa-luna/sky` |
| `ui_bg_color` / `ui_bg_opacity` / `ui_blur` | theme | Box background, opacity, blur |
| `lower_section_offset` | number | Flow-diagram vertical nudge |
| `sz_*` | number | Text-size overrides (per element) |
| `_show_3phase`, `_show_ev`, `_show_battery2`, `_show_bars`, `_show_pv_extra` | toggle | Feature toggles (`_show_bars` defaults **on**) |

---

## The visual editor

Open via the card's ⋮ → Edit. Sections (collapsible): General, Weather & Sun, Solar, Extra PV Strings, Grid, 3-Phase Breakdown, Phase / Inverter Tile, Battery, Secondary Battery, Inverter, Energy Today, EV / Car Charger, Bottom Tiles (1–6), Thresholds, Appearance, Text Sizes, plus per-view sections (Cameras, Energy, Battery, Climate…).

Preferences set in the editor write standard config keys, so the YAML and editor stay interchangeable.

---

## UX details

- **Flip tiles.** The battery-stats and phase tiles flip on a small corner `↻` button. Flip cards disable `backdrop-filter` because a filtered ancestor flattens `transform-style: preserve-3d` in Firefox, which breaks `backface-visibility` (both faces render, back mirrored).
- **Nav fold.** The slider button is pinned at the bottom of the rail. Folding hides tiles 4–8 and slides the first three (Dashboard / Energy / Battery) **down** into the vacated bottom slots; unfolding reverses it.
- **Flow line colors** follow the khan-skycard convention: orange `#e07800` import, green `#39ff14` export.
- **Scrollable tiles** are used only inside nav-panel overlays, never on the main blueprint face.

---

## Theming

Colors, background, opacity, blur and text sizes are exposed as CSS variables and editor controls (`--cl-box-bg`, `--cl-blur`, etc.). Background images follow the `casa-luna-<variant>.png` naming under `background_path`.

---

## Development

- **Source of truth:** keep the clean canonical `casa-luna.js`; treat any minified/obfuscated build as a separate distributable.
- **Versioning:** bump the `VERSION` constant and the `build no.N` header on every change — essential for confirming the file loaded past browser cache.
- **Layout:** geometry is defined in the `SL` slot table (measured at 1500 × 1000). Right-column tiles anchor their right edge; nav tiles anchor their left edge.
- **Rendering harness:** preview via Playwright/Chromium headless at 1500 × 1000, `deviceScaleFactor: 2`, screenshotting the card root.

### Code protection (distribution)

For release builds: Terser minification + moderate `javascript-obfuscator` (name-mangling, string-array encoding; **no** control-flow flattening, **no** domainLock). Run at release time against a copy, never the canonical source.

---

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| Capacity / Endurance show `--` | Set `battery_full_ah`/`battery_full_wh` + `battery_cap_unit` in YAML (not yet in editor). |
| Flip tiles render mirrored / doubled | Pre-build-42 issue (backdrop-filter flattening 3D). Update the card and hard-refresh. |
| Battery charge/discharge looks reversed | Expected — sign is inverted (GoodWe indirection). |
| Card didn't update after edit | Bump `VERSION`/build and hard-refresh; browser cached the old module. |
| Sun/moon arc misaligned | Confirm the `sun` entity is set and provides `next_rising` / `next_setting`. |

---

## Credits & license

Casa Luna Edition — by **The Khan**. Forked from `khan-skycard.js`; primitives adapted from `ha-smart-room-card.js`.

License: add your chosen license here (e.g. MIT) before public distribution.
