// v1.0.0 stable · build no.105
/* ════════════════════════════════════════════════════════════════════
   casa-luna.js — Casa Luna Edition · by The Khan
   Custom element: <casa-luna>  (renamed from khan-skycard to avoid
   customElements collision when both cards are installed)

   • Config keys are 100% compatible with casa_luna.js / khan-skycard —
     existing YAML keeps working unchanged.
   • Layout: canonical SLOTS measured from template 60883 (1500×1000).
   • Backgrounds: /local/community/casa-luna/sky/casa-luna-<variant>.png
     (same files & variant logic as before; path configurable).
   ════════════════════════════════════════════════════════════════════ */

(() => {
'use strict';
const VERSION = '1.0.0';
const VB_W = 1500, VB_H = 1000;

/* ── i18n: card's own captions. Keyed by the English string; English is the
   implicit baseline (any missing key falls back to English). Entity state text
   (inverter mode, weather, on/off) is localised separately via HA's own
   translations (hass.formatEntityState). Add a language by pasting one block. ── */
const LANG = {
  de: {
    'DASHBOARD':'ÜBERSICHT', 'Home':'Startseite',
    'ENERGY':'ENERGIE', 'Production & Flow':'Erzeugung & Fluss',
    'SMART PLUGS':'INTELLIGENTE STECKDOSEN', 'Load & Switches':'Last & Schalter',
    'BATTERY':'BATTERIE', 'Status & Settings':'Status & Einstell.',
    'CLIMATE':'KLIMA', 'Temperature & Humidity':'Temp. & Luftfeuchte',
    'SECURITY':'SICHERHEIT', 'Alarms & Cameras':'Alarme & Kameras',
    'AUTOMATION':'AUTOMATION', 'Scenes & Routines':'Szenen & Routinen',
    'LIGHTING':'BELEUCHTUNG', 'Lights & Ambience':'Licht & Ambiente',
    'SYSTEM':'SYSTEM', 'System & Preferences':'System & Einstell.',
    "TODAY'S CONSUMPTION":'VERBRAUCH HEUTE', "TODAY'S PRODUCTION":'ERZEUGUNG HEUTE',
    'RECENT EVENTS':'LETZTE EREIGNISSE', 'INV LOAD':'WR-LAST', 'No Errors':'Keine Fehler',
    'IDLE':'BEREIT', 'DISCHARGING':'ENTLÄDT', 'CHARGING':'LÄDT',
    'CELL TEMP':'ZELLTEMP.', 'LOAD':'LAST', 'CELL VOLT':'ZELLSPG.', 'BMS TEMP':'BMS-TEMP.',
    'ENDURANCE':'LAUFZEIT', 'BATT CURRENT':'BATT-STROM', 'CAPACITY':'KAPAZITÄT',
    'GRID PHASES':'NETZPHASEN', 'INVERTER':'WECHSELRICHTER',
    'PV1 POWER':'PV1 LEISTUNG', 'PV2 POWER':'PV2 LEISTUNG', 'PV3 POWER':'PV3 LEISTUNG', 'PV4 POWER':'PV4 LEISTUNG',
    'PV5 POWER':'PV5 LEISTUNG', 'PV6 POWER':'PV6 LEISTUNG',
    'PV TOTAL':'PV GESAMT', 'PV1 VOLT':'PV1 SPG.', 'PV2 VOLT':'PV2 SPG.', 'PV3 VOLT':'PV3 SPG.', 'PV4 VOLT':'PV4 SPG.',
    'PV5 VOLT':'PV5 SPG.', 'PV6 VOLT':'PV6 SPG.',
    'WEATHER':'WETTER', 'TEMPERATURE':'TEMPERATUR', 'WIND SPEED':'WINDGESCHW.', 'WIND DIR':'WINDRICHT.', 'SUN':'SONNE',
    'GRID POWER':'NETZLEISTUNG', 'GRID VOLT':'NETZSPG.', 'GRID IMPORT':'NETZBEZUG', 'GRID EXPORT':'EINSPEISUNG',
    'L1 VOLT':'L1 SPG.', 'L2 VOLT':'L2 SPG.', 'L3 VOLT':'L3 SPG.',
    'BATTERY SOC':'BATTERIE-SOC', 'BATTERY POWER':'BATT-LEISTUNG', 'BATTERY CURRENT':'BATT-STROM', 'BATTERY VOLT':'BATT-SPG.',
    'MIN CELL':'MIN. ZELLE', 'MAX CELL':'MAX. ZELLE', 'Batt Discharge':'Batt-Entladung',
    'BATT2 POWER':'BATT2 LEISTUNG', 'BATT2 CURRENT':'BATT2 STROM', 'BATT2 VOLT':'BATT2 SPG.',
    'INVERTER TEMP':'WR-TEMP.', "TODAY'S PV":'PV HEUTE', "TODAY'S LOAD":'LAST HEUTE', 'BATT CHARGE':'BATT-LADUNG',
    'TOTAL PV':'PV GESAMT', 'INV STATE':'WR-STATUS',
    'TOTAL IMP':'GESAMT-BEZUG', 'TOTAL EXP':'GESAMT-EINSP.',
    'CHARGER STATE':'LADESTATUS', 'CHARGER POWER':'LADELEISTUNG', 'CHARGER CURRENT':'LADESTROM',
    'CAR SOC':'AUTO-SOC', 'CHARGE ETA':'LADE-ETA',
  },
  fr: {
    'DASHBOARD':'TABLEAU DE BORD', 'Home':'Accueil', 'ENERGY':'ÉNERGIE',
    'Production & Flow':'Production & Flux', 'SMART PLUGS':'PRISES INTELLIGENTES', 'Load & Switches':'Charge & Interrupteurs',
    'BATTERY':'BATTERIE', 'Status & Settings':'État & Réglages', 'CLIMATE':'CLIMAT',
    'Temperature & Humidity':'Température & Humidité', 'SECURITY':'SÉCURITÉ', 'Alarms & Cameras':'Alarmes & Caméras',
    'AUTOMATION':'AUTOMATISATION', 'Scenes & Routines':'Scènes & Routines', 'LIGHTING':'ÉCLAIRAGE',
    'Lights & Ambience':'Lumières & Ambiance', 'SYSTEM':'SYSTÈME', 'System & Preferences':'Système & Préférences',
    "TODAY'S CONSUMPTION":'CONSOMMATION DU JOUR', "TODAY'S PRODUCTION":'PRODUCTION DU JOUR', 'RECENT EVENTS':'ÉVÉNEMENTS RÉCENTS',
    'INV LOAD':'CHARGE ONDUL.', 'No Errors':'Aucune erreur', 'IDLE':'INACTIF',
    'DISCHARGING':'DÉCHARGE', 'CHARGING':'CHARGE', 'CELL TEMP':'TEMP. CELLULE',
    'LOAD':'CHARGE', 'CELL VOLT':'TENS. CELLULE', 'BMS TEMP':'TEMP. BMS',
    'ENDURANCE':'AUTONOMIE', 'BATT CURRENT':'COURANT BATT.', 'CAPACITY':'CAPACITÉ',
    'GRID PHASES':'PHASES RÉSEAU', 'INVERTER':'ONDULEUR', 'PV1 POWER':'PUISSANCE PV1',
    'PV2 POWER':'PUISSANCE PV2', 'PV3 POWER':'PUISSANCE PV3', 'PV4 POWER':'PUISSANCE PV4',
    'PV5 POWER':'PUISSANCE PV5', 'PV6 POWER':'PUISSANCE PV6', 'PV TOTAL':'PV TOTAL',
    'PV1 VOLT':'TENSION PV1', 'PV2 VOLT':'TENSION PV2', 'PV3 VOLT':'TENSION PV3',
    'PV4 VOLT':'TENSION PV4', 'PV5 VOLT':'TENSION PV5', 'PV6 VOLT':'TENSION PV6',
    'WEATHER':'MÉTÉO', 'TEMPERATURE':'TEMPÉRATURE', 'WIND SPEED':'VITESSE VENT',
    'WIND DIR':'DIR. VENT', 'SUN':'SOLEIL', 'GRID POWER':'PUISSANCE RÉSEAU',
    'GRID VOLT':'TENSION RÉSEAU', 'GRID IMPORT':'IMPORT RÉSEAU', 'GRID EXPORT':'EXPORT RÉSEAU',
    'L1 VOLT':'TENSION L1', 'L2 VOLT':'TENSION L2', 'L3 VOLT':'TENSION L3',
    'BATTERY SOC':'SOC BATTERIE', 'BATTERY POWER':'PUISSANCE BATT.', 'BATTERY CURRENT':'COURANT BATT.',
    'BATTERY VOLT':'TENSION BATT.', 'MIN CELL':'CELLULE MIN', 'MAX CELL':'CELLULE MAX',
    'Batt Discharge':'Décharge Batt.', 'BATT2 POWER':'PUISSANCE BATT2', 'BATT2 CURRENT':'COURANT BATT2',
    'BATT2 VOLT':'TENSION BATT2', 'INVERTER TEMP':'TEMP. ONDULEUR', "TODAY'S PV":'PV DU JOUR',
    "TODAY'S LOAD":'CHARGE DU JOUR', 'BATT CHARGE':'CHARGE BATT.', 'TOTAL PV':'PV TOTAL',
    'INV STATE':'ÉTAT ONDUL.', 'TOTAL IMP':'IMPORT TOTAL', 'TOTAL EXP':'EXPORT TOTAL',
    'CHARGER STATE':'ÉTAT CHARGEUR', 'CHARGER POWER':'PUISSANCE CHARGEUR', 'CHARGER CURRENT':'COURANT CHARGEUR',
    'CAR SOC':'SOC VÉHICULE', 'CHARGE ETA':'ETA CHARGE',
  },
  es: {
    'DASHBOARD':'PANEL', 'Home':'Inicio', 'ENERGY':'ENERGÍA',
    'Production & Flow':'Producción y Flujo', 'SMART PLUGS':'ENCHUFES INTELIGENTES', 'Load & Switches':'Carga e Interruptores',
    'BATTERY':'BATERÍA', 'Status & Settings':'Estado y Ajustes', 'CLIMATE':'CLIMA',
    'Temperature & Humidity':'Temperatura y Humedad', 'SECURITY':'SEGURIDAD', 'Alarms & Cameras':'Alarmas y Cámaras',
    'AUTOMATION':'AUTOMATIZACIÓN', 'Scenes & Routines':'Escenas y Rutinas', 'LIGHTING':'ILUMINACIÓN',
    'Lights & Ambience':'Luces y Ambiente', 'SYSTEM':'SISTEMA', 'System & Preferences':'Sistema y Preferencias',
    "TODAY'S CONSUMPTION":'CONSUMO DE HOY', "TODAY'S PRODUCTION":'PRODUCCIÓN DE HOY', 'RECENT EVENTS':'EVENTOS RECIENTES',
    'INV LOAD':'CARGA INV.', 'No Errors':'Sin errores', 'IDLE':'INACTIVO',
    'DISCHARGING':'DESCARGANDO', 'CHARGING':'CARGANDO', 'CELL TEMP':'TEMP. CELDA',
    'LOAD':'CARGA', 'CELL VOLT':'VOLT. CELDA', 'BMS TEMP':'TEMP. BMS',
    'ENDURANCE':'AUTONOMÍA', 'BATT CURRENT':'CORRIENTE BAT.', 'CAPACITY':'CAPACIDAD',
    'GRID PHASES':'FASES RED', 'INVERTER':'INVERSOR', 'PV1 POWER':'POTENCIA PV1',
    'PV2 POWER':'POTENCIA PV2', 'PV3 POWER':'POTENCIA PV3', 'PV4 POWER':'POTENCIA PV4',
    'PV5 POWER':'POTENCIA PV5', 'PV6 POWER':'POTENCIA PV6', 'PV TOTAL':'PV TOTAL',
    'PV1 VOLT':'VOLTAJE PV1', 'PV2 VOLT':'VOLTAJE PV2', 'PV3 VOLT':'VOLTAJE PV3',
    'PV4 VOLT':'VOLTAJE PV4', 'PV5 VOLT':'VOLTAJE PV5', 'PV6 VOLT':'VOLTAJE PV6',
    'WEATHER':'CLIMA', 'TEMPERATURE':'TEMPERATURA', 'WIND SPEED':'VEL. VIENTO',
    'WIND DIR':'DIR. VIENTO', 'SUN':'SOL', 'GRID POWER':'POTENCIA RED',
    'GRID VOLT':'VOLTAJE RED', 'GRID IMPORT':'IMPORT. RED', 'GRID EXPORT':'EXPORT. RED',
    'L1 VOLT':'VOLTAJE L1', 'L2 VOLT':'VOLTAJE L2', 'L3 VOLT':'VOLTAJE L3',
    'BATTERY SOC':'SOC BATERÍA', 'BATTERY POWER':'POTENCIA BAT.', 'BATTERY CURRENT':'CORRIENTE BAT.',
    'BATTERY VOLT':'VOLTAJE BAT.', 'MIN CELL':'CELDA MÍN', 'MAX CELL':'CELDA MÁX',
    'Batt Discharge':'Descarga Bat.', 'BATT2 POWER':'POTENCIA BAT2', 'BATT2 CURRENT':'CORRIENTE BAT2',
    'BATT2 VOLT':'VOLTAJE BAT2', 'INVERTER TEMP':'TEMP. INVERSOR', "TODAY'S PV":'PV DE HOY',
    "TODAY'S LOAD":'CARGA DE HOY', 'BATT CHARGE':'CARGA BAT.', 'TOTAL PV':'PV TOTAL',
    'INV STATE':'ESTADO INV.', 'TOTAL IMP':'IMPORT. TOTAL', 'TOTAL EXP':'EXPORT. TOTAL',
    'CHARGER STATE':'ESTADO CARGADOR', 'CHARGER POWER':'POTENCIA CARGADOR', 'CHARGER CURRENT':'CORRIENTE CARGADOR',
    'CAR SOC':'SOC VEHÍCULO', 'CHARGE ETA':'ETA CARGA',
  },
  it: {
    'DASHBOARD':'PANNELLO', 'Home':'Home', 'ENERGY':'ENERGIA',
    'Production & Flow':'Produzione e Flusso', 'SMART PLUGS':'PRESE INTELLIGENTI', 'Load & Switches':'Carico e Interruttori',
    'BATTERY':'BATTERIA', 'Status & Settings':'Stato e Impostazioni', 'CLIMATE':'CLIMA',
    'Temperature & Humidity':'Temperatura e Umidità', 'SECURITY':'SICUREZZA', 'Alarms & Cameras':'Allarmi e Telecamere',
    'AUTOMATION':'AUTOMAZIONE', 'Scenes & Routines':'Scene e Routine', 'LIGHTING':'ILLUMINAZIONE',
    'Lights & Ambience':'Luci e Ambiente', 'SYSTEM':'SISTEMA', 'System & Preferences':'Sistema e Preferenze',
    "TODAY'S CONSUMPTION":'CONSUMO DI OGGI', "TODAY'S PRODUCTION":'PRODUZIONE DI OGGI', 'RECENT EVENTS':'EVENTI RECENTI',
    'INV LOAD':'CARICO INV.', 'No Errors':'Nessun errore', 'IDLE':'INATTIVO',
    'DISCHARGING':'SCARICA', 'CHARGING':'CARICA', 'CELL TEMP':'TEMP. CELLA',
    'LOAD':'CARICO', 'CELL VOLT':'TENS. CELLA', 'BMS TEMP':'TEMP. BMS',
    'ENDURANCE':'AUTONOMIA', 'BATT CURRENT':'CORRENTE BATT.', 'CAPACITY':'CAPACITÀ',
    'GRID PHASES':'FASI RETE', 'INVERTER':'INVERTER', 'PV1 POWER':'POTENZA PV1',
    'PV2 POWER':'POTENZA PV2', 'PV3 POWER':'POTENZA PV3', 'PV4 POWER':'POTENZA PV4',
    'PV5 POWER':'POTENZA PV5', 'PV6 POWER':'POTENZA PV6', 'PV TOTAL':'PV TOTALE',
    'PV1 VOLT':'TENSIONE PV1', 'PV2 VOLT':'TENSIONE PV2', 'PV3 VOLT':'TENSIONE PV3',
    'PV4 VOLT':'TENSIONE PV4', 'PV5 VOLT':'TENSIONE PV5', 'PV6 VOLT':'TENSIONE PV6',
    'WEATHER':'METEO', 'TEMPERATURE':'TEMPERATURA', 'WIND SPEED':'VEL. VENTO',
    'WIND DIR':'DIR. VENTO', 'SUN':'SOLE', 'GRID POWER':'POTENZA RETE',
    'GRID VOLT':'TENSIONE RETE', 'GRID IMPORT':'IMPORT RETE', 'GRID EXPORT':'EXPORT RETE',
    'L1 VOLT':'TENSIONE L1', 'L2 VOLT':'TENSIONE L2', 'L3 VOLT':'TENSIONE L3',
    'BATTERY SOC':'SOC BATTERIA', 'BATTERY POWER':'POTENZA BATT.', 'BATTERY CURRENT':'CORRENTE BATT.',
    'BATTERY VOLT':'TENSIONE BATT.', 'MIN CELL':'CELLA MIN', 'MAX CELL':'CELLA MAX',
    'Batt Discharge':'Scarica Batt.', 'BATT2 POWER':'POTENZA BATT2', 'BATT2 CURRENT':'CORRENTE BATT2',
    'BATT2 VOLT':'TENSIONE BATT2', 'INVERTER TEMP':'TEMP. INVERTER', "TODAY'S PV":'PV DI OGGI',
    "TODAY'S LOAD":'CARICO DI OGGI', 'BATT CHARGE':'CARICA BATT.', 'TOTAL PV':'PV TOTALE',
    'INV STATE':'STATO INV.', 'TOTAL IMP':'IMPORT TOTALE', 'TOTAL EXP':'EXPORT TOTALE',
    'CHARGER STATE':'STATO CARICATORE', 'CHARGER POWER':'POTENZA CARICATORE', 'CHARGER CURRENT':'CORRENTE CARICATORE',
    'CAR SOC':'SOC VEICOLO', 'CHARGE ETA':'ETA CARICA',
  },
  pt: {
    'DASHBOARD':'PAINEL', 'Home':'Início', 'ENERGY':'ENERGIA',
    'Production & Flow':'Produção e Fluxo', 'SMART PLUGS':'TOMADAS INTELIGENTES', 'Load & Switches':'Carga e Interruptores',
    'BATTERY':'BATERIA', 'Status & Settings':'Estado e Definições', 'CLIMATE':'CLIMA',
    'Temperature & Humidity':'Temperatura e Humidade', 'SECURITY':'SEGURANÇA', 'Alarms & Cameras':'Alarmes e Câmaras',
    'AUTOMATION':'AUTOMAÇÃO', 'Scenes & Routines':'Cenas e Rotinas', 'LIGHTING':'ILUMINAÇÃO',
    'Lights & Ambience':'Luzes e Ambiente', 'SYSTEM':'SISTEMA', 'System & Preferences':'Sistema e Preferências',
    "TODAY'S CONSUMPTION":'CONSUMO DE HOJE', "TODAY'S PRODUCTION":'PRODUÇÃO DE HOJE', 'RECENT EVENTS':'EVENTOS RECENTES',
    'INV LOAD':'CARGA INV.', 'No Errors':'Sem erros', 'IDLE':'INATIVO',
    'DISCHARGING':'A DESCARREGAR', 'CHARGING':'A CARREGAR', 'CELL TEMP':'TEMP. CÉLULA',
    'LOAD':'CARGA', 'CELL VOLT':'TENS. CÉLULA', 'BMS TEMP':'TEMP. BMS',
    'ENDURANCE':'AUTONOMIA', 'BATT CURRENT':'CORRENTE BAT.', 'CAPACITY':'CAPACIDADE',
    'GRID PHASES':'FASES REDE', 'INVERTER':'INVERSOR', 'PV1 POWER':'POTÊNCIA PV1',
    'PV2 POWER':'POTÊNCIA PV2', 'PV3 POWER':'POTÊNCIA PV3', 'PV4 POWER':'POTÊNCIA PV4',
    'PV5 POWER':'POTÊNCIA PV5', 'PV6 POWER':'POTÊNCIA PV6', 'PV TOTAL':'PV TOTAL',
    'PV1 VOLT':'TENSÃO PV1', 'PV2 VOLT':'TENSÃO PV2', 'PV3 VOLT':'TENSÃO PV3',
    'PV4 VOLT':'TENSÃO PV4', 'PV5 VOLT':'TENSÃO PV5', 'PV6 VOLT':'TENSÃO PV6',
    'WEATHER':'METEOROLOGIA', 'TEMPERATURE':'TEMPERATURA', 'WIND SPEED':'VEL. VENTO',
    'WIND DIR':'DIR. VENTO', 'SUN':'SOL', 'GRID POWER':'POTÊNCIA REDE',
    'GRID VOLT':'TENSÃO REDE', 'GRID IMPORT':'IMPORT. REDE', 'GRID EXPORT':'EXPORT. REDE',
    'L1 VOLT':'TENSÃO L1', 'L2 VOLT':'TENSÃO L2', 'L3 VOLT':'TENSÃO L3',
    'BATTERY SOC':'SOC BATERIA', 'BATTERY POWER':'POTÊNCIA BAT.', 'BATTERY CURRENT':'CORRENTE BAT.',
    'BATTERY VOLT':'TENSÃO BAT.', 'MIN CELL':'CÉLULA MÍN', 'MAX CELL':'CÉLULA MÁX',
    'Batt Discharge':'Descarga Bat.', 'BATT2 POWER':'POTÊNCIA BAT2', 'BATT2 CURRENT':'CORRENTE BAT2',
    'BATT2 VOLT':'TENSÃO BAT2', 'INVERTER TEMP':'TEMP. INVERSOR', "TODAY'S PV":'PV DE HOJE',
    "TODAY'S LOAD":'CARGA DE HOJE', 'BATT CHARGE':'CARGA BAT.', 'TOTAL PV':'PV TOTAL',
    'INV STATE':'ESTADO INV.', 'TOTAL IMP':'IMPORT. TOTAL', 'TOTAL EXP':'EXPORT. TOTAL',
    'CHARGER STATE':'ESTADO CARREGADOR', 'CHARGER POWER':'POTÊNCIA CARREGADOR', 'CHARGER CURRENT':'CORRENTE CARREGADOR',
    'CAR SOC':'SOC VEÍCULO', 'CHARGE ETA':'ETA CARGA',
  },
  nl: {
    'DASHBOARD':'DASHBOARD', 'Home':'Start', 'ENERGY':'ENERGIE',
    'Production & Flow':'Productie & Stroom', 'SMART PLUGS':'SLIMME STEKKERS', 'Load & Switches':'Belasting & Schakelaars',
    'BATTERY':'ACCU', 'Status & Settings':'Status & Instellingen', 'CLIMATE':'KLIMAAT',
    'Temperature & Humidity':'Temperatuur & Vochtigheid', 'SECURITY':'BEVEILIGING', 'Alarms & Cameras':"Alarmen & Camera's",
    'AUTOMATION':'AUTOMATISERING', 'Scenes & Routines':'Scènes & Routines', 'LIGHTING':'VERLICHTING',
    'Lights & Ambience':'Licht & Sfeer', 'SYSTEM':'SYSTEEM', 'System & Preferences':'Systeem & Voorkeuren',
    "TODAY'S CONSUMPTION":'VERBRUIK VANDAAG', "TODAY'S PRODUCTION":'PRODUCTIE VANDAAG', 'RECENT EVENTS':'RECENTE GEBEURTENISSEN',
    'INV LOAD':'INV. BELASTING', 'No Errors':'Geen fouten', 'IDLE':'INACTIEF',
    'DISCHARGING':'ONTLADEN', 'CHARGING':'OPLADEN', 'CELL TEMP':'CELTEMP.',
    'LOAD':'BELASTING', 'CELL VOLT':'CELSPANNING', 'BMS TEMP':'BMS-TEMP.',
    'ENDURANCE':'DUUR', 'BATT CURRENT':'ACCUSTROOM', 'CAPACITY':'CAPACITEIT',
    'GRID PHASES':'NETFASEN', 'INVERTER':'OMVORMER', 'PV1 POWER':'PV1 VERMOGEN',
    'PV2 POWER':'PV2 VERMOGEN', 'PV3 POWER':'PV3 VERMOGEN', 'PV4 POWER':'PV4 VERMOGEN',
    'PV5 POWER':'PV5 VERMOGEN', 'PV6 POWER':'PV6 VERMOGEN', 'PV TOTAL':'PV TOTAAL',
    'PV1 VOLT':'PV1 SPANNING', 'PV2 VOLT':'PV2 SPANNING', 'PV3 VOLT':'PV3 SPANNING',
    'PV4 VOLT':'PV4 SPANNING', 'PV5 VOLT':'PV5 SPANNING', 'PV6 VOLT':'PV6 SPANNING',
    'WEATHER':'WEER', 'TEMPERATURE':'TEMPERATUUR', 'WIND SPEED':'WINDSNELHEID',
    'WIND DIR':'WINDRICHTING', 'SUN':'ZON', 'GRID POWER':'NETVERMOGEN',
    'GRID VOLT':'NETSPANNING', 'GRID IMPORT':'NETAFNAME', 'GRID EXPORT':'NETINVOEDING',
    'L1 VOLT':'L1 SPANNING', 'L2 VOLT':'L2 SPANNING', 'L3 VOLT':'L3 SPANNING',
    'BATTERY SOC':'ACCU SOC', 'BATTERY POWER':'ACCUVERMOGEN', 'BATTERY CURRENT':'ACCUSTROOM',
    'BATTERY VOLT':'ACCUSPANNING', 'MIN CELL':'MIN. CEL', 'MAX CELL':'MAX. CEL',
    'Batt Discharge':'Accu Ontlading', 'BATT2 POWER':'ACCU2 VERMOGEN', 'BATT2 CURRENT':'ACCU2 STROOM',
    'BATT2 VOLT':'ACCU2 SPANNING', 'INVERTER TEMP':'OMVORMER TEMP.', "TODAY'S PV":'PV VANDAAG',
    "TODAY'S LOAD":'BELASTING VANDAAG', 'BATT CHARGE':'ACCU LADEN', 'TOTAL PV':'PV TOTAAL',
    'INV STATE':'OMVORMERSTATUS', 'TOTAL IMP':'TOTALE AFNAME', 'TOTAL EXP':'TOTALE INVOEDING',
    'CHARGER STATE':'LADERSTATUS', 'CHARGER POWER':'LAADVERMOGEN', 'CHARGER CURRENT':'LAADSTROOM',
    'CAR SOC':'AUTO SOC', 'CHARGE ETA':'LAAD-ETA',
  },
  pl: {
    'DASHBOARD':'PULPIT', 'Home':'Strona główna', 'ENERGY':'ENERGIA',
    'Production & Flow':'Produkcja i Przepływ', 'SMART PLUGS':'INTELIGENTNE GNIAZDA', 'Load & Switches':'Obciążenie i Przełączniki',
    'BATTERY':'AKUMULATOR', 'Status & Settings':'Stan i Ustawienia', 'CLIMATE':'KLIMAT',
    'Temperature & Humidity':'Temperatura i Wilgotność', 'SECURITY':'BEZPIECZEŃSTWO', 'Alarms & Cameras':'Alarmy i Kamery',
    'AUTOMATION':'AUTOMATYKA', 'Scenes & Routines':'Scenariusze i Rutyny', 'LIGHTING':'OŚWIETLENIE',
    'Lights & Ambience':'Światła i Nastrój', 'SYSTEM':'SYSTEM', 'System & Preferences':'System i Preferencje',
    "TODAY'S CONSUMPTION":'ZUŻYCIE DZIŚ', "TODAY'S PRODUCTION":'PRODUKCJA DZIŚ', 'RECENT EVENTS':'OSTATNIE ZDARZENIA',
    'INV LOAD':'OBC. INWERTERA', 'No Errors':'Brak błędów', 'IDLE':'BEZCZYNNY',
    'DISCHARGING':'ROZŁADOWANIE', 'CHARGING':'ŁADOWANIE', 'CELL TEMP':'TEMP. OGNIWA',
    'LOAD':'OBCIĄŻENIE', 'CELL VOLT':'NAPIĘCIE OGNIWA', 'BMS TEMP':'TEMP. BMS',
    'ENDURANCE':'CZAS PRACY', 'BATT CURRENT':'PRĄD AKUM.', 'CAPACITY':'POJEMNOŚĆ',
    'GRID PHASES':'FAZY SIECI', 'INVERTER':'INWERTER', 'PV1 POWER':'MOC PV1',
    'PV2 POWER':'MOC PV2', 'PV3 POWER':'MOC PV3', 'PV4 POWER':'MOC PV4',
    'PV5 POWER':'MOC PV5', 'PV6 POWER':'MOC PV6', 'PV TOTAL':'PV CAŁKOWITE',
    'PV1 VOLT':'NAPIĘCIE PV1', 'PV2 VOLT':'NAPIĘCIE PV2', 'PV3 VOLT':'NAPIĘCIE PV3',
    'PV4 VOLT':'NAPIĘCIE PV4', 'PV5 VOLT':'NAPIĘCIE PV5', 'PV6 VOLT':'NAPIĘCIE PV6',
    'WEATHER':'POGODA', 'TEMPERATURE':'TEMPERATURA', 'WIND SPEED':'PRĘDK. WIATRU',
    'WIND DIR':'KIER. WIATRU', 'SUN':'SŁOŃCE', 'GRID POWER':'MOC SIECI',
    'GRID VOLT':'NAPIĘCIE SIECI', 'GRID IMPORT':'IMPORT SIECI', 'GRID EXPORT':'EKSPORT SIECI',
    'L1 VOLT':'NAPIĘCIE L1', 'L2 VOLT':'NAPIĘCIE L2', 'L3 VOLT':'NAPIĘCIE L3',
    'BATTERY SOC':'SOC AKUM.', 'BATTERY POWER':'MOC AKUM.', 'BATTERY CURRENT':'PRĄD AKUM.',
    'BATTERY VOLT':'NAPIĘCIE AKUM.', 'MIN CELL':'MIN. OGNIWO', 'MAX CELL':'MAX. OGNIWO',
    'Batt Discharge':'Rozładowanie Akum.', 'BATT2 POWER':'MOC AKUM2', 'BATT2 CURRENT':'PRĄD AKUM2',
    'BATT2 VOLT':'NAPIĘCIE AKUM2', 'INVERTER TEMP':'TEMP. INWERTERA', "TODAY'S PV":'PV DZIŚ',
    "TODAY'S LOAD":'OBCIĄŻENIE DZIŚ', 'BATT CHARGE':'ŁADOWANIE AKUM.', 'TOTAL PV':'PV CAŁKOWITE',
    'INV STATE':'STAN INWERTERA', 'TOTAL IMP':'IMPORT CAŁKOWITY', 'TOTAL EXP':'EKSPORT CAŁKOWITY',
    'CHARGER STATE':'STAN ŁADOWARKI', 'CHARGER POWER':'MOC ŁADOWARKI', 'CHARGER CURRENT':'PRĄD ŁADOWARKI',
    'CAR SOC':'SOC POJAZDU', 'CHARGE ETA':'ETA ŁADOWANIA',
  },
  sv: {
    'DASHBOARD':'ÖVERSIKT', 'Home':'Hem', 'ENERGY':'ENERGI',
    'Production & Flow':'Produktion & Flöde', 'SMART PLUGS':'SMARTA UTTAG', 'Load & Switches':'Belastning & Strömbrytare',
    'BATTERY':'BATTERI', 'Status & Settings':'Status & Inställningar', 'CLIMATE':'KLIMAT',
    'Temperature & Humidity':'Temperatur & Luftfuktighet', 'SECURITY':'SÄKERHET', 'Alarms & Cameras':'Larm & Kameror',
    'AUTOMATION':'AUTOMATION', 'Scenes & Routines':'Scener & Rutiner', 'LIGHTING':'BELYSNING',
    'Lights & Ambience':'Ljus & Atmosfär', 'SYSTEM':'SYSTEM', 'System & Preferences':'System & Inställningar',
    "TODAY'S CONSUMPTION":'FÖRBRUKNING IDAG', "TODAY'S PRODUCTION":'PRODUKTION IDAG', 'RECENT EVENTS':'SENASTE HÄNDELSER',
    'INV LOAD':'VÄXELR. LAST', 'No Errors':'Inga fel', 'IDLE':'VILOLÄGE',
    'DISCHARGING':'URLADDNING', 'CHARGING':'LADDNING', 'CELL TEMP':'CELLTEMP.',
    'LOAD':'LAST', 'CELL VOLT':'CELLSPÄNNING', 'BMS TEMP':'BMS-TEMP.',
    'ENDURANCE':'UTHÅLLIGHET', 'BATT CURRENT':'BATTERISTRÖM', 'CAPACITY':'KAPACITET',
    'GRID PHASES':'NÄTFASER', 'INVERTER':'VÄXELRIKTARE', 'PV1 POWER':'PV1 EFFEKT',
    'PV2 POWER':'PV2 EFFEKT', 'PV3 POWER':'PV3 EFFEKT', 'PV4 POWER':'PV4 EFFEKT',
    'PV5 POWER':'PV5 EFFEKT', 'PV6 POWER':'PV6 EFFEKT', 'PV TOTAL':'PV TOTALT',
    'PV1 VOLT':'PV1 SPÄNNING', 'PV2 VOLT':'PV2 SPÄNNING', 'PV3 VOLT':'PV3 SPÄNNING',
    'PV4 VOLT':'PV4 SPÄNNING', 'PV5 VOLT':'PV5 SPÄNNING', 'PV6 VOLT':'PV6 SPÄNNING',
    'WEATHER':'VÄDER', 'TEMPERATURE':'TEMPERATUR', 'WIND SPEED':'VINDHASTIGHET',
    'WIND DIR':'VINDRIKTNING', 'SUN':'SOL', 'GRID POWER':'NÄTEFFEKT',
    'GRID VOLT':'NÄTSPÄNNING', 'GRID IMPORT':'NÄTIMPORT', 'GRID EXPORT':'NÄTEXPORT',
    'L1 VOLT':'L1 SPÄNNING', 'L2 VOLT':'L2 SPÄNNING', 'L3 VOLT':'L3 SPÄNNING',
    'BATTERY SOC':'BATTERI SOC', 'BATTERY POWER':'BATTERIEFFEKT', 'BATTERY CURRENT':'BATTERISTRÖM',
    'BATTERY VOLT':'BATTERISPÄNNING', 'MIN CELL':'MIN. CELL', 'MAX CELL':'MAX. CELL',
    'Batt Discharge':'Batteriurladdning', 'BATT2 POWER':'BATTERI2 EFFEKT', 'BATT2 CURRENT':'BATTERI2 STRÖM',
    'BATT2 VOLT':'BATTERI2 SPÄNNING', 'INVERTER TEMP':'VÄXELR. TEMP.', "TODAY'S PV":'PV IDAG',
    "TODAY'S LOAD":'LAST IDAG', 'BATT CHARGE':'BATTERILADDNING', 'TOTAL PV':'PV TOTALT',
    'INV STATE':'VÄXELR. STATUS', 'TOTAL IMP':'TOTAL IMPORT', 'TOTAL EXP':'TOTAL EXPORT',
    'CHARGER STATE':'LADDARSTATUS', 'CHARGER POWER':'LADDAREFFEKT', 'CHARGER CURRENT':'LADDARSTRÖM',
    'CAR SOC':'BIL SOC', 'CHARGE ETA':'LADDNING ETA',
  },
  nb: {
    'DASHBOARD':'OVERSIKT', 'Home':'Hjem', 'ENERGY':'ENERGI',
    'Production & Flow':'Produksjon & Flyt', 'SMART PLUGS':'SMARTE STIKKONTAKTER', 'Load & Switches':'Last & Brytere',
    'BATTERY':'BATTERI', 'Status & Settings':'Status & Innstillinger', 'CLIMATE':'KLIMA',
    'Temperature & Humidity':'Temperatur & Luftfuktighet', 'SECURITY':'SIKKERHET', 'Alarms & Cameras':'Alarmer & Kameraer',
    'AUTOMATION':'AUTOMASJON', 'Scenes & Routines':'Scener & Rutiner', 'LIGHTING':'BELYSNING',
    'Lights & Ambience':'Lys & Stemning', 'SYSTEM':'SYSTEM', 'System & Preferences':'System & Innstillinger',
    "TODAY'S CONSUMPTION":'FORBRUK I DAG', "TODAY'S PRODUCTION":'PRODUKSJON I DAG', 'RECENT EVENTS':'NYLIGE HENDELSER',
    'INV LOAD':'INV. LAST', 'No Errors':'Ingen feil', 'IDLE':'INAKTIV',
    'DISCHARGING':'UTLADING', 'CHARGING':'LADING', 'CELL TEMP':'CELLETEMP.',
    'LOAD':'LAST', 'CELL VOLT':'CELLESPENNING', 'BMS TEMP':'BMS-TEMP.',
    'ENDURANCE':'VARIGHET', 'BATT CURRENT':'BATTERISTRØM', 'CAPACITY':'KAPASITET',
    'GRID PHASES':'NETTFASER', 'INVERTER':'INVERTER', 'PV1 POWER':'PV1 EFFEKT',
    'PV2 POWER':'PV2 EFFEKT', 'PV3 POWER':'PV3 EFFEKT', 'PV4 POWER':'PV4 EFFEKT',
    'PV5 POWER':'PV5 EFFEKT', 'PV6 POWER':'PV6 EFFEKT', 'PV TOTAL':'PV TOTALT',
    'PV1 VOLT':'PV1 SPENNING', 'PV2 VOLT':'PV2 SPENNING', 'PV3 VOLT':'PV3 SPENNING',
    'PV4 VOLT':'PV4 SPENNING', 'PV5 VOLT':'PV5 SPENNING', 'PV6 VOLT':'PV6 SPENNING',
    'WEATHER':'VÆR', 'TEMPERATURE':'TEMPERATUR', 'WIND SPEED':'VINDHASTIGHET',
    'WIND DIR':'VINDRETNING', 'SUN':'SOL', 'GRID POWER':'NETTEFFEKT',
    'GRID VOLT':'NETTSPENNING', 'GRID IMPORT':'NETTIMPORT', 'GRID EXPORT':'NETTEKSPORT',
    'L1 VOLT':'L1 SPENNING', 'L2 VOLT':'L2 SPENNING', 'L3 VOLT':'L3 SPENNING',
    'BATTERY SOC':'BATTERI SOC', 'BATTERY POWER':'BATTERIEFFEKT', 'BATTERY CURRENT':'BATTERISTRØM',
    'BATTERY VOLT':'BATTERISPENNING', 'MIN CELL':'MIN. CELLE', 'MAX CELL':'MAX. CELLE',
    'Batt Discharge':'Batteriutlading', 'BATT2 POWER':'BATTERI2 EFFEKT', 'BATT2 CURRENT':'BATTERI2 STRØM',
    'BATT2 VOLT':'BATTERI2 SPENNING', 'INVERTER TEMP':'INVERTER TEMP.', "TODAY'S PV":'PV I DAG',
    "TODAY'S LOAD":'LAST I DAG', 'BATT CHARGE':'BATTERILADING', 'TOTAL PV':'PV TOTALT',
    'INV STATE':'INVERTERSTATUS', 'TOTAL IMP':'TOTAL IMPORT', 'TOTAL EXP':'TOTAL EKSPORT',
    'CHARGER STATE':'LADERSTATUS', 'CHARGER POWER':'LADEEFFEKT', 'CHARGER CURRENT':'LADESTRØM',
    'CAR SOC':'BIL SOC', 'CHARGE ETA':'LADING ETA',
  },
  da: {
    'DASHBOARD':'OVERSIGT', 'Home':'Hjem', 'ENERGY':'ENERGI',
    'Production & Flow':'Produktion & Flow', 'SMART PLUGS':'SMARTE STIKKONTAKTER', 'Load & Switches':'Belastning & Kontakter',
    'BATTERY':'BATTERI', 'Status & Settings':'Status & Indstillinger', 'CLIMATE':'KLIMA',
    'Temperature & Humidity':'Temperatur & Luftfugtighed', 'SECURITY':'SIKKERHED', 'Alarms & Cameras':'Alarmer & Kameraer',
    'AUTOMATION':'AUTOMATISERING', 'Scenes & Routines':'Scener & Rutiner', 'LIGHTING':'BELYSNING',
    'Lights & Ambience':'Lys & Stemning', 'SYSTEM':'SYSTEM', 'System & Preferences':'System & Indstillinger',
    "TODAY'S CONSUMPTION":'FORBRUG I DAG', "TODAY'S PRODUCTION":'PRODUKTION I DAG', 'RECENT EVENTS':'SENESTE HÆNDELSER',
    'INV LOAD':'INV. BELASTN.', 'No Errors':'Ingen fejl', 'IDLE':'INAKTIV',
    'DISCHARGING':'AFLADNING', 'CHARGING':'OPLADNING', 'CELL TEMP':'CELLETEMP.',
    'LOAD':'BELASTNING', 'CELL VOLT':'CELLESPÆNDING', 'BMS TEMP':'BMS-TEMP.',
    'ENDURANCE':'VARIGHED', 'BATT CURRENT':'BATTERISTRØM', 'CAPACITY':'KAPACITET',
    'GRID PHASES':'NETFASER', 'INVERTER':'INVERTER', 'PV1 POWER':'PV1 EFFEKT',
    'PV2 POWER':'PV2 EFFEKT', 'PV3 POWER':'PV3 EFFEKT', 'PV4 POWER':'PV4 EFFEKT',
    'PV5 POWER':'PV5 EFFEKT', 'PV6 POWER':'PV6 EFFEKT', 'PV TOTAL':'PV TOTAL',
    'PV1 VOLT':'PV1 SPÆNDING', 'PV2 VOLT':'PV2 SPÆNDING', 'PV3 VOLT':'PV3 SPÆNDING',
    'PV4 VOLT':'PV4 SPÆNDING', 'PV5 VOLT':'PV5 SPÆNDING', 'PV6 VOLT':'PV6 SPÆNDING',
    'WEATHER':'VEJR', 'TEMPERATURE':'TEMPERATUR', 'WIND SPEED':'VINDHASTIGHED',
    'WIND DIR':'VINDRETNING', 'SUN':'SOL', 'GRID POWER':'NETEFFEKT',
    'GRID VOLT':'NETSPÆNDING', 'GRID IMPORT':'NETIMPORT', 'GRID EXPORT':'NETEKSPORT',
    'L1 VOLT':'L1 SPÆNDING', 'L2 VOLT':'L2 SPÆNDING', 'L3 VOLT':'L3 SPÆNDING',
    'BATTERY SOC':'BATTERI SOC', 'BATTERY POWER':'BATTERIEFFEKT', 'BATTERY CURRENT':'BATTERISTRØM',
    'BATTERY VOLT':'BATTERISPÆNDING', 'MIN CELL':'MIN. CELLE', 'MAX CELL':'MAX. CELLE',
    'Batt Discharge':'Batteriafladning', 'BATT2 POWER':'BATTERI2 EFFEKT', 'BATT2 CURRENT':'BATTERI2 STRØM',
    'BATT2 VOLT':'BATTERI2 SPÆNDING', 'INVERTER TEMP':'INVERTER TEMP.', "TODAY'S PV":'PV I DAG',
    "TODAY'S LOAD":'BELASTNING I DAG', 'BATT CHARGE':'BATTERIOPLADNING', 'TOTAL PV':'PV TOTAL',
    'INV STATE':'INVERTERSTATUS', 'TOTAL IMP':'TOTAL IMPORT', 'TOTAL EXP':'TOTAL EKSPORT',
    'CHARGER STATE':'OPLADERSTATUS', 'CHARGER POWER':'OPLADEREFFEKT', 'CHARGER CURRENT':'OPLADERSTRØM',
    'CAR SOC':'BIL SOC', 'CHARGE ETA':'OPLADNING ETA',
  },
  fi: {
    'DASHBOARD':'YLEISKATSAUS', 'Home':'Koti', 'ENERGY':'ENERGIA',
    'Production & Flow':'Tuotanto & Virtaus', 'SMART PLUGS':'ÄLYPISTOKKEET', 'Load & Switches':'Kuorma & Kytkimet',
    'BATTERY':'AKKU', 'Status & Settings':'Tila & Asetukset', 'CLIMATE':'ILMASTO',
    'Temperature & Humidity':'Lämpötila & Kosteus', 'SECURITY':'TURVALLISUUS', 'Alarms & Cameras':'Hälytykset & Kamerat',
    'AUTOMATION':'AUTOMAATIO', 'Scenes & Routines':'Tilanteet & Rutiinit', 'LIGHTING':'VALAISTUS',
    'Lights & Ambience':'Valot & Tunnelma', 'SYSTEM':'JÄRJESTELMÄ', 'System & Preferences':'Järjestelmä & Asetukset',
    "TODAY'S CONSUMPTION":'KULUTUS TÄNÄÄN', "TODAY'S PRODUCTION":'TUOTANTO TÄNÄÄN', 'RECENT EVENTS':'VIIMEISIMMÄT TAPAHTUMAT',
    'INV LOAD':'INV. KUORMA', 'No Errors':'Ei virheitä', 'IDLE':'JOUTOKÄYNTI',
    'DISCHARGING':'PURKAUTUU', 'CHARGING':'LATAUTUU', 'CELL TEMP':'KENNON LÄMPÖ',
    'LOAD':'KUORMA', 'CELL VOLT':'KENNON JÄNNITE', 'BMS TEMP':'BMS-LÄMPÖ',
    'ENDURANCE':'KESTOAIKA', 'BATT CURRENT':'AKUN VIRTA', 'CAPACITY':'KAPASITEETTI',
    'GRID PHASES':'VERKON VAIHEET', 'INVERTER':'INVERTTERI', 'PV1 POWER':'PV1 TEHO',
    'PV2 POWER':'PV2 TEHO', 'PV3 POWER':'PV3 TEHO', 'PV4 POWER':'PV4 TEHO',
    'PV5 POWER':'PV5 TEHO', 'PV6 POWER':'PV6 TEHO', 'PV TOTAL':'PV YHTEENSÄ',
    'PV1 VOLT':'PV1 JÄNNITE', 'PV2 VOLT':'PV2 JÄNNITE', 'PV3 VOLT':'PV3 JÄNNITE',
    'PV4 VOLT':'PV4 JÄNNITE', 'PV5 VOLT':'PV5 JÄNNITE', 'PV6 VOLT':'PV6 JÄNNITE',
    'WEATHER':'SÄÄ', 'TEMPERATURE':'LÄMPÖTILA', 'WIND SPEED':'TUULEN NOPEUS',
    'WIND DIR':'TUULEN SUUNTA', 'SUN':'AURINKO', 'GRID POWER':'VERKON TEHO',
    'GRID VOLT':'VERKON JÄNNITE', 'GRID IMPORT':'VERKOSTA OTTO', 'GRID EXPORT':'VERKKOON SYÖTTÖ',
    'L1 VOLT':'L1 JÄNNITE', 'L2 VOLT':'L2 JÄNNITE', 'L3 VOLT':'L3 JÄNNITE',
    'BATTERY SOC':'AKUN SOC', 'BATTERY POWER':'AKUN TEHO', 'BATTERY CURRENT':'AKUN VIRTA',
    'BATTERY VOLT':'AKUN JÄNNITE', 'MIN CELL':'MIN. KENNO', 'MAX CELL':'MAKS. KENNO',
    'Batt Discharge':'Akun Purkautuminen', 'BATT2 POWER':'AKKU2 TEHO', 'BATT2 CURRENT':'AKKU2 VIRTA',
    'BATT2 VOLT':'AKKU2 JÄNNITE', 'INVERTER TEMP':'INVERTTERIN LÄMPÖ', "TODAY'S PV":'PV TÄNÄÄN',
    "TODAY'S LOAD":'KUORMA TÄNÄÄN', 'BATT CHARGE':'AKUN LATAUS', 'TOTAL PV':'PV YHTEENSÄ',
    'INV STATE':'INVERTTERIN TILA', 'TOTAL IMP':'KOKONAISOTTO', 'TOTAL EXP':'KOKONAISSYÖTTÖ',
    'CHARGER STATE':'LATURIN TILA', 'CHARGER POWER':'LATURIN TEHO', 'CHARGER CURRENT':'LATURIN VIRTA',
    'CAR SOC':'AUTON SOC', 'CHARGE ETA':'LATAUKSEN ETA',
  },
  ru: {
    'DASHBOARD':'ПАНЕЛЬ', 'Home':'Главная', 'ENERGY':'ЭНЕРГИЯ',
    'Production & Flow':'Выработка и Поток', 'SMART PLUGS':'УМНЫЕ РОЗЕТКИ', 'Load & Switches':'Нагрузка и Выключатели',
    'BATTERY':'АККУМУЛЯТОР', 'Status & Settings':'Статус и Настройки', 'CLIMATE':'КЛИМАТ',
    'Temperature & Humidity':'Температура и Влажность', 'SECURITY':'БЕЗОПАСНОСТЬ', 'Alarms & Cameras':'Сигнализация и Камеры',
    'AUTOMATION':'АВТОМАТИЗАЦИЯ', 'Scenes & Routines':'Сценарии и Рутины', 'LIGHTING':'ОСВЕЩЕНИЕ',
    'Lights & Ambience':'Свет и Атмосфера', 'SYSTEM':'СИСТЕМА', 'System & Preferences':'Система и Настройки',
    "TODAY'S CONSUMPTION":'ПОТРЕБЛЕНИЕ СЕГОДНЯ', "TODAY'S PRODUCTION":'ВЫРАБОТКА СЕГОДНЯ', 'RECENT EVENTS':'ПОСЛЕДНИЕ СОБЫТИЯ',
    'INV LOAD':'НАГРУЗКА ИНВ.', 'No Errors':'Нет ошибок', 'IDLE':'ОЖИДАНИЕ',
    'DISCHARGING':'РАЗРЯД', 'CHARGING':'ЗАРЯД', 'CELL TEMP':'ТЕМП. ЯЧЕЙКИ',
    'LOAD':'НАГРУЗКА', 'CELL VOLT':'НАПР. ЯЧЕЙКИ', 'BMS TEMP':'ТЕМП. BMS',
    'ENDURANCE':'АВТОНОМНОСТЬ', 'BATT CURRENT':'ТОК АКБ', 'CAPACITY':'ЁМКОСТЬ',
    'GRID PHASES':'ФАЗЫ СЕТИ', 'INVERTER':'ИНВЕРТОР', 'PV1 POWER':'МОЩНОСТЬ PV1',
    'PV2 POWER':'МОЩНОСТЬ PV2', 'PV3 POWER':'МОЩНОСТЬ PV3', 'PV4 POWER':'МОЩНОСТЬ PV4',
    'PV5 POWER':'МОЩНОСТЬ PV5', 'PV6 POWER':'МОЩНОСТЬ PV6', 'PV TOTAL':'PV ВСЕГО',
    'PV1 VOLT':'НАПРЯЖЕНИЕ PV1', 'PV2 VOLT':'НАПРЯЖЕНИЕ PV2', 'PV3 VOLT':'НАПРЯЖЕНИЕ PV3',
    'PV4 VOLT':'НАПРЯЖЕНИЕ PV4', 'PV5 VOLT':'НАПРЯЖЕНИЕ PV5', 'PV6 VOLT':'НАПРЯЖЕНИЕ PV6',
    'WEATHER':'ПОГОДА', 'TEMPERATURE':'ТЕМПЕРАТУРА', 'WIND SPEED':'СКОР. ВЕТРА',
    'WIND DIR':'НАПР. ВЕТРА', 'SUN':'СОЛНЦЕ', 'GRID POWER':'МОЩНОСТЬ СЕТИ',
    'GRID VOLT':'НАПРЯЖЕНИЕ СЕТИ', 'GRID IMPORT':'ИМПОРТ ИЗ СЕТИ', 'GRID EXPORT':'ЭКСПОРТ В СЕТЬ',
    'L1 VOLT':'НАПРЯЖЕНИЕ L1', 'L2 VOLT':'НАПРЯЖЕНИЕ L2', 'L3 VOLT':'НАПРЯЖЕНИЕ L3',
    'BATTERY SOC':'ЗАРЯД АКБ', 'BATTERY POWER':'МОЩНОСТЬ АКБ', 'BATTERY CURRENT':'ТОК АКБ',
    'BATTERY VOLT':'НАПРЯЖЕНИЕ АКБ', 'MIN CELL':'МИН. ЯЧЕЙКА', 'MAX CELL':'МАКС. ЯЧЕЙКА',
    'Batt Discharge':'Разряд АКБ', 'BATT2 POWER':'МОЩНОСТЬ АКБ2', 'BATT2 CURRENT':'ТОК АКБ2',
    'BATT2 VOLT':'НАПРЯЖЕНИЕ АКБ2', 'INVERTER TEMP':'ТЕМП. ИНВЕРТОРА', "TODAY'S PV":'PV СЕГОДНЯ',
    "TODAY'S LOAD":'НАГРУЗКА СЕГОДНЯ', 'BATT CHARGE':'ЗАРЯД АКБ', 'TOTAL PV':'PV ВСЕГО',
    'INV STATE':'СТАТУС ИНВЕРТОРА', 'TOTAL IMP':'ИМПОРТ ВСЕГО', 'TOTAL EXP':'ЭКСПОРТ ВСЕГО',
    'CHARGER STATE':'СТАТУС ЗАРЯДКИ', 'CHARGER POWER':'МОЩНОСТЬ ЗАРЯДКИ', 'CHARGER CURRENT':'ТОК ЗАРЯДКИ',
    'CAR SOC':'ЗАРЯД АВТО', 'CHARGE ETA':'ETA ЗАРЯДКИ',
  },
  uk: {
    'DASHBOARD':'ПАНЕЛЬ', 'Home':'Головна', 'ENERGY':'ЕНЕРГІЯ',
    'Production & Flow':'Виробництво та Потік', 'SMART PLUGS':'РОЗУМНІ РОЗЕТКИ', 'Load & Switches':'Навантаження та Вимикачі',
    'BATTERY':'АКУМУЛЯТОР', 'Status & Settings':'Статус та Налаштування', 'CLIMATE':'КЛІМАТ',
    'Temperature & Humidity':'Температура та Вологість', 'SECURITY':'БЕЗПЕКА', 'Alarms & Cameras':'Сигналізація та Камери',
    'AUTOMATION':'АВТОМАТИЗАЦІЯ', 'Scenes & Routines':'Сценарії та Рутини', 'LIGHTING':'ОСВІТЛЕННЯ',
    'Lights & Ambience':'Світло та Атмосфера', 'SYSTEM':'СИСТЕМА', 'System & Preferences':'Система та Налаштування',
    "TODAY'S CONSUMPTION":'СПОЖИВАННЯ СЬОГОДНІ', "TODAY'S PRODUCTION":'ВИРОБНИЦТВО СЬОГОДНІ', 'RECENT EVENTS':'ОСТАННІ ПОДІЇ',
    'INV LOAD':'НАВАНТАЖ. ІНВ.', 'No Errors':'Немає помилок', 'IDLE':'ОЧІКУВАННЯ',
    'DISCHARGING':'РОЗРЯДКА', 'CHARGING':'ЗАРЯДКА', 'CELL TEMP':'ТЕМП. ЕЛЕМЕНТА',
    'LOAD':'НАВАНТАЖЕННЯ', 'CELL VOLT':'НАПР. ЕЛЕМЕНТА', 'BMS TEMP':'ТЕМП. BMS',
    'ENDURANCE':'АВТОНОМНІСТЬ', 'BATT CURRENT':'СТРУМ АКБ', 'CAPACITY':'ЄМНІСТЬ',
    'GRID PHASES':'ФАЗИ МЕРЕЖІ', 'INVERTER':'ІНВЕРТОР', 'PV1 POWER':'ПОТУЖНІСТЬ PV1',
    'PV2 POWER':'ПОТУЖНІСТЬ PV2', 'PV3 POWER':'ПОТУЖНІСТЬ PV3', 'PV4 POWER':'ПОТУЖНІСТЬ PV4',
    'PV5 POWER':'ПОТУЖНІСТЬ PV5', 'PV6 POWER':'ПОТУЖНІСТЬ PV6', 'PV TOTAL':'PV ЗАГАЛОМ',
    'PV1 VOLT':'НАПРУГА PV1', 'PV2 VOLT':'НАПРУГА PV2', 'PV3 VOLT':'НАПРУГА PV3',
    'PV4 VOLT':'НАПРУГА PV4', 'PV5 VOLT':'НАПРУГА PV5', 'PV6 VOLT':'НАПРУГА PV6',
    'WEATHER':'ПОГОДА', 'TEMPERATURE':'ТЕМПЕРАТУРА', 'WIND SPEED':'ШВИДК. ВІТРУ',
    'WIND DIR':'НАПР. ВІТРУ', 'SUN':'СОНЦЕ', 'GRID POWER':'ПОТУЖНІСТЬ МЕРЕЖІ',
    'GRID VOLT':'НАПРУГА МЕРЕЖІ', 'GRID IMPORT':'ІМПОРТ З МЕРЕЖІ', 'GRID EXPORT':'ЕКСПОРТ В МЕРЕЖУ',
    'L1 VOLT':'НАПРУГА L1', 'L2 VOLT':'НАПРУГА L2', 'L3 VOLT':'НАПРУГА L3',
    'BATTERY SOC':'ЗАРЯД АКБ', 'BATTERY POWER':'ПОТУЖНІСТЬ АКБ', 'BATTERY CURRENT':'СТРУМ АКБ',
    'BATTERY VOLT':'НАПРУГА АКБ', 'MIN CELL':'МІН. ЕЛЕМЕНТ', 'MAX CELL':'МАКС. ЕЛЕМЕНТ',
    'Batt Discharge':'Розрядка АКБ', 'BATT2 POWER':'ПОТУЖНІСТЬ АКБ2', 'BATT2 CURRENT':'СТРУМ АКБ2',
    'BATT2 VOLT':'НАПРУГА АКБ2', 'INVERTER TEMP':'ТЕМП. ІНВЕРТОРА', "TODAY'S PV":'PV СЬОГОДНІ',
    "TODAY'S LOAD":'НАВАНТАЖЕННЯ СЬОГОДНІ', 'BATT CHARGE':'ЗАРЯДКА АКБ', 'TOTAL PV':'PV ЗАГАЛОМ',
    'INV STATE':'СТАТУС ІНВЕРТОРА', 'TOTAL IMP':'ІМПОРТ ЗАГАЛОМ', 'TOTAL EXP':'ЕКСПОРТ ЗАГАЛОМ',
    'CHARGER STATE':'СТАТУС ЗАРЯДКИ', 'CHARGER POWER':'ПОТУЖНІСТЬ ЗАРЯДКИ', 'CHARGER CURRENT':'СТРУМ ЗАРЯДКИ',
    'CAR SOC':'ЗАРЯД АВТО', 'CHARGE ETA':'ETA ЗАРЯДКИ',
  },
  tr: {
    'DASHBOARD':'PANO', 'Home':'Ana Sayfa', 'ENERGY':'ENERJİ',
    'Production & Flow':'Üretim & Akış', 'SMART PLUGS':'AKILLI PRİZLER', 'Load & Switches':'Yük & Anahtarlar',
    'BATTERY':'AKÜ', 'Status & Settings':'Durum & Ayarlar', 'CLIMATE':'İKLİM',
    'Temperature & Humidity':'Sıcaklık & Nem', 'SECURITY':'GÜVENLİK', 'Alarms & Cameras':'Alarmlar & Kameralar',
    'AUTOMATION':'OTOMASYON', 'Scenes & Routines':'Sahneler & Rutinler', 'LIGHTING':'AYDINLATMA',
    'Lights & Ambience':'Işıklar & Ambiyans', 'SYSTEM':'SİSTEM', 'System & Preferences':'Sistem & Tercihler',
    "TODAY'S CONSUMPTION":'BUGÜNKÜ TÜKETİM', "TODAY'S PRODUCTION":'BUGÜNKÜ ÜRETİM', 'RECENT EVENTS':'SON OLAYLAR',
    'INV LOAD':'İNV. YÜKÜ', 'No Errors':'Hata yok', 'IDLE':'BOŞTA',
    'DISCHARGING':'DEŞARJ', 'CHARGING':'ŞARJ', 'CELL TEMP':'HÜCRE SICAKLIĞI',
    'LOAD':'YÜK', 'CELL VOLT':'HÜCRE VOLTAJI', 'BMS TEMP':'BMS SICAKLIĞI',
    'ENDURANCE':'DAYANMA SÜRESİ', 'BATT CURRENT':'AKÜ AKIMI', 'CAPACITY':'KAPASİTE',
    'GRID PHASES':'ŞEBEKE FAZLARI', 'INVERTER':'İNVERTER', 'PV1 POWER':'PV1 GÜCÜ',
    'PV2 POWER':'PV2 GÜCÜ', 'PV3 POWER':'PV3 GÜCÜ', 'PV4 POWER':'PV4 GÜCÜ',
    'PV5 POWER':'PV5 GÜCÜ', 'PV6 POWER':'PV6 GÜCÜ', 'PV TOTAL':'TOPLAM PV',
    'PV1 VOLT':'PV1 VOLTAJI', 'PV2 VOLT':'PV2 VOLTAJI', 'PV3 VOLT':'PV3 VOLTAJI',
    'PV4 VOLT':'PV4 VOLTAJI', 'PV5 VOLT':'PV5 VOLTAJI', 'PV6 VOLT':'PV6 VOLTAJI',
    'WEATHER':'HAVA DURUMU', 'TEMPERATURE':'SICAKLIK', 'WIND SPEED':'RÜZGAR HIZI',
    'WIND DIR':'RÜZGAR YÖNÜ', 'SUN':'GÜNEŞ', 'GRID POWER':'ŞEBEKE GÜCÜ',
    'GRID VOLT':'ŞEBEKE VOLTAJI', 'GRID IMPORT':'ŞEBEKEDEN ALIM', 'GRID EXPORT':'ŞEBEKEYE SATIŞ',
    'L1 VOLT':'L1 VOLTAJI', 'L2 VOLT':'L2 VOLTAJI', 'L3 VOLT':'L3 VOLTAJI',
    'BATTERY SOC':'AKÜ SOC', 'BATTERY POWER':'AKÜ GÜCÜ', 'BATTERY CURRENT':'AKÜ AKIMI',
    'BATTERY VOLT':'AKÜ VOLTAJI', 'MIN CELL':'MIN. HÜCRE', 'MAX CELL':'MAKS. HÜCRE',
    'Batt Discharge':'Akü Deşarjı', 'BATT2 POWER':'AKÜ2 GÜCÜ', 'BATT2 CURRENT':'AKÜ2 AKIMI',
    'BATT2 VOLT':'AKÜ2 VOLTAJI', 'INVERTER TEMP':'İNVERTER SICAKLIĞI', "TODAY'S PV":'BUGÜNKÜ PV',
    "TODAY'S LOAD":'BUGÜNKÜ YÜK', 'BATT CHARGE':'AKÜ ŞARJI', 'TOTAL PV':'TOPLAM PV',
    'INV STATE':'İNVERTER DURUMU', 'TOTAL IMP':'TOPLAM ALIM', 'TOTAL EXP':'TOPLAM SATIŞ',
    'CHARGER STATE':'ŞARJ DURUMU', 'CHARGER POWER':'ŞARJ GÜCÜ', 'CHARGER CURRENT':'ŞARJ AKIMI',
    'CAR SOC':'ARAÇ SOC', 'CHARGE ETA':'ŞARJ ETA',
  },
};

/* ── canonical geometry (measured from template, scaled 1536→1500) ── */
const SL = {
  nav:  { x:20, w:211, h:77, tops:[146,229,312,395,478,561,644,727,810] },
  r_cyl:[1113,92,152,288], r_stats:[1275,136,208,237], r_mode:[1275,25,208,104],
  r_pvtile:[1113,384,369,50], r_ev:[1113,436,369,50], r_cons:[1113,488,369,123], r_prod:[1113,613,369,123], r_events:[1113,738,369,141],
  pv:[323,575,360,33], pwr:[720,575,355,33],
  stat_cont:[297,619,799,131],
  stat:{ y:630,h:107,w:180,xs:[309,508,707,906] },
  inv_box:[299,762,209,136],
  inv_right:[509,762,585,136],
  donut_c:[556,786,87,106],
  invt:{ y:781,h:107,w:122,xs:[687,823,959] },
  bot:{ y:917,h:75,w:182,xs:[156,357,558,759,960,1161] },
  icons:{ x:1110, y:20 },
  arc:{ lx:413,ly:205, px:735,py:150, rx:1057,ry:205 },
};

/* ── glossy 3D icon library (60029-style: gradients + specular) ── */
const ICON_DEFS = `
<defs>
 <linearGradient id="gB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fe1ff"/><stop offset=".5" stop-color="#39a8ff"/><stop offset="1" stop-color="#0d62d8"/></linearGradient>
 <linearGradient id="gY" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe98a"/><stop offset=".5" stop-color="#ffc02e"/><stop offset="1" stop-color="#f08c00"/></linearGradient>
 <linearGradient id="gG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b7f7a1"/><stop offset=".5" stop-color="#52d652"/><stop offset="1" stop-color="#1d9e2e"/></linearGradient>
 <linearGradient id="gS" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8eef6"/><stop offset=".55" stop-color="#aab6c6"/><stop offset="1" stop-color="#76828f"/></linearGradient>
 <linearGradient id="gC" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9ad8ff"/><stop offset="1" stop-color="#1b7fe8"/></linearGradient>
 <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff9d8a"/><stop offset="1" stop-color="#e02d1b"/></linearGradient>
 <radialGradient id="gGlow" cx=".5" cy=".35" r=".7"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
</defs>`;

const ICONS = {
  home: `<g><path d="M5 14 L16 4.5 L27 14" fill="none" stroke="url(#gB)" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M8.5 13 V26 H23.5 V13" fill="rgba(40,130,240,.25)" stroke="url(#gB)" stroke-width="2.6" stroke-linejoin="round"/>
    <rect x="13.4" y="18" width="5.2" height="8" rx="1" fill="url(#gB)"/>
    <ellipse cx="13" cy="8.5" rx="6" ry="2.4" fill="url(#gGlow)" opacity=".5"/></g>`,
  bolt: `<g><path d="M18 2.5 L7.5 17.5 H14.6 L12.6 29.5 L24.5 13 H16.6 Z" fill="url(#gY)" stroke="#b96e00" stroke-width=".8"/>
    <path d="M16.8 4.5 L10.4 14.4 l3.4 .4 z" fill="#fff" opacity=".45"/></g>`,
  batt: `<g><rect x="13" y="3.4" width="6" height="3.2" rx="1" fill="#3a4654"/>
    <rect x="7.6" y="6.4" width="16.8" height="22" rx="3.4" fill="rgba(20,60,30,.5)" stroke="url(#gG)" stroke-width="2.4"/>
    <rect x="10.2" y="9" width="11.6" height="16.8" rx="2" fill="url(#gG)"/>
    <path d="M16 12 v9 M11.8 16.5 h8.4" stroke="#053b12" stroke-width="2.6" stroke-linecap="round"/>
    <rect x="10.8" y="9.6" width="4" height="14" rx="2" fill="#fff" opacity=".22"/></g>`,
  therm:`<g><path d="M16 3.6 a3.6 3.6 0 0 1 3.6 3.6 V18.6 a6.2 6.2 0 1 1 -7.2 0 V7.2 A3.6 3.6 0 0 1 16 3.6 Z" fill="rgba(60,140,255,.18)" stroke="url(#gC)" stroke-width="2.6"/>
    <circle cx="16" cy="23.4" r="3.8" fill="url(#gR)"/><rect x="14.7" y="9" width="2.6" height="13" rx="1.3" fill="url(#gR)"/>
    <path d="M21 6 h4 M21 10 h3 M21 14 h4" stroke="#9fc8ef" stroke-width="1.6" stroke-linecap="round"/></g>`,
  shield:`<g><path d="M16 3.4 L27 8 V15.6 C27 21.8 22.4 26.6 16 28.8 C9.6 26.6 5 21.8 5 15.6 V8 Z" fill="url(#gC)" stroke="#0a4f9e" stroke-width="1.4"/>
    <path d="M16 5.8 L24.8 9.5 V15.5 C24.8 20.6 21 24.7 16 26.6 V5.8 Z" fill="#fff" opacity=".16"/>
    <path d="M16 10 l1.8 3.6 4 .55 -2.9 2.8 .7 3.95 -3.6 -1.9 -3.6 1.9 .7 -3.95 -2.9 -2.8 4 -.55 Z" fill="#fff"/></g>`,
  gear: `<g fill="url(#gS)" stroke="#46505c" stroke-width=".8">
    <path d="M16 6.4 l1.5 -3 h-3 Z M16 25.6 l1.5 3 h-3 Z M6.4 16 l-3 1.5 v-3 Z M25.6 16 l3 1.5 v-3 Z M9.2 9.2 l-3.2 -1 1 3.2 Z M22.8 22.8 l3.2 1 -1 -3.2 Z M22.8 9.2 l1 -3.2 -3.2 1 Z M9.2 22.8 l-1 3.2 3.2 -1 Z"/>
    <circle cx="16" cy="16" r="8.6"/><circle cx="16" cy="16" r="4" fill="#222a33"/>
    <ellipse cx="13.4" cy="12" rx="4.4" ry="2" fill="#fff" opacity=".35" stroke="none"/></g>`,
  bulb: `<g><path d="M16 3.6 a8.6 8.6 0 0 1 5.4 15.2 c-.9 .8 -1.4 1.6 -1.4 2.8 H12 c0 -1.2 -.5 -2 -1.4 -2.8 A8.6 8.6 0 0 1 16 3.6 Z" fill="url(#gY)" stroke="#b97600" stroke-width="1"/>
    <ellipse cx="13" cy="9" rx="3.4" ry="2" fill="#fff" opacity=".5"/>
    <rect x="12.4" y="23" width="7.2" height="2" rx="1" fill="#8a93a0"/><rect x="12.9" y="26" width="6.2" height="2" rx="1" fill="#8a93a0"/></g>`,
  sun:  `<g><circle cx="16" cy="16" r="6.4" fill="url(#gY)"/><circle cx="14" cy="13.6" r="2.6" fill="#fff" opacity=".5"/>
    <g stroke="url(#gY)" stroke-width="2.6" stroke-linecap="round"><line x1="16" y1="2.6" x2="16" y2="6.6"/><line x1="16" y1="25.4" x2="16" y2="29.4"/><line x1="2.6" y1="16" x2="6.6" y2="16"/><line x1="25.4" y1="16" x2="29.4" y2="16"/><line x1="6.2" y1="6.2" x2="9" y2="9"/><line x1="23" y1="23" x2="25.8" y2="25.8"/><line x1="25.8" y1="6.2" x2="23" y2="9"/><line x1="9" y1="23" x2="6.2" y2="25.8"/></g></g>`,
  pump: `<g><rect x="5" y="14.6" width="14" height="10.4" rx="2" fill="url(#gS)" stroke="#46505c"/>
    <circle cx="12" cy="19.8" r="3" fill="#2a3340"/><circle cx="12" cy="19.8" r="1.4" fill="url(#gC)"/>
    <path d="M12 14.6 V8.6 H22.6 M19.4 5 H25.8 M22.6 5 V12" stroke="url(#gS)" stroke-width="2.6" fill="none" stroke-linecap="round"/></g>`,
  irrig:`<g><circle cx="16" cy="9.6" r="3.4" fill="url(#gC)"/><rect x="14.7" y="12" width="2.6" height="14" rx="1.3" fill="url(#gS)"/>
    <g stroke="url(#gC)" stroke-width="2.2" stroke-linecap="round"><line x1="9.4" y1="17" x2="6" y2="24"/><line x1="22.6" y1="17" x2="26" y2="24"/></g>
    <g fill="#7fc8ff"><circle cx="8" cy="13" r="1.1"/><circle cx="24" cy="13" r="1.1"/><circle cx="16" cy="4.4" r="1.1"/></g></g>`,
  warn: `<g><path d="M16 3.6 L29 26 H3 Z" fill="rgba(255,70,50,.16)" stroke="url(#gR)" stroke-width="2.6" stroke-linejoin="round"/>
    <rect x="14.6" y="10.4" width="2.8" height="8" rx="1.4" fill="url(#gR)"/><circle cx="16" cy="22" r="1.8" fill="url(#gR)"/></g>`,
  plug: `<g><path d="M10.4 3.6 V10 M21.6 3.6 V10" stroke="url(#gS)" stroke-width="2.8" stroke-linecap="round"/>
    <path d="M7 10 H25 V15 a9 9 0 0 1 -18 0 Z" fill="url(#gS)" stroke="#46505c" stroke-width="1"/>
    <path d="M16 24 V28.4" stroke="url(#gS)" stroke-width="2.8" stroke-linecap="round"/>
    <ellipse cx="12.6" cy="12.4" rx="4" ry="1.6" fill="#fff" opacity=".4"/></g>`,
};
/* Room-card device SVGs (copied verbatim, 24×24, currentColor) — used for live animated tile icons */
const RC_ICONS = {
  fan: `<path d="M12 11 C10 8, 8 5.5, 10 4 C12 2.5, 13 5, 13 11Z" fill="currentColor" opacity="0.85"/>
  <path d="M13 12 C16 10, 18.5 8, 20 10 C21.5 12, 19 13, 13 13Z" fill="currentColor" opacity="0.75"/>
  <path d="M12 13 C14 16, 16 18.5, 14 20 C12 21.5, 11 19, 11 13Z" fill="currentColor" opacity="0.85"/>
  <path d="M11 12 C8 14, 5.5 16, 4 14 C2.5 12, 5 11, 11 11Z" fill="currentColor" opacity="0.75"/>
  <circle cx="12" cy="12" r="2.2" fill="currentColor"/>
  <circle cx="12" cy="12" r="1" fill="rgba(255,255,255,0.35)"/>`,
  bulb: `<g class="bulb-rays" opacity="0">
    <line x1="12" y1="1" x2="12" y2="3" stroke="rgba(255,230,60,0.9)" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="19.07" y1="3.93" x2="17.66" y2="5.34" stroke="rgba(255,230,60,0.7)" stroke-width="1.3" stroke-linecap="round"/>
    <line x1="21" y1="9.5" x2="19" y2="9.5" stroke="rgba(255,230,60,0.7)" stroke-width="1.3" stroke-linecap="round"/>
    <line x1="4.93" y1="3.93" x2="6.34" y2="5.34" stroke="rgba(255,230,60,0.7)" stroke-width="1.3" stroke-linecap="round"/>
    <line x1="3" y1="9.5" x2="5" y2="9.5" stroke="rgba(255,230,60,0.7)" stroke-width="1.3" stroke-linecap="round"/>
  </g>
  <path fill="currentColor" d="M12 3.5a5.5 5.5 0 0 1 5.5 5.5c0 2.1-1.18 3.93-2.92 4.87L14 15.5h-4l-.58-1.63A5.5 5.5 0 0 1 6.5 9 5.5 5.5 0 0 1 12 3.5z"/>
  <rect x="10" y="15.5" width="4" height="1.2" rx="0.6" fill="currentColor" opacity="0.7"/>
  <rect x="10.5" y="17" width="3" height="1.1" rx="0.55" fill="currentColor" opacity="0.5"/>
  <rect x="11" y="18.3" width="2" height="1" rx="0.5" fill="currentColor" opacity="0.35"/>`,
  plug: `<rect x="3.5" y="3.5" width="17" height="17" rx="3.5" fill="none" stroke="currentColor" stroke-width="1.5"/>
  <rect x="8.5" y="7" width="2" height="3.5" rx="1" fill="currentColor" opacity="0.9"/>
  <rect x="13.5" y="7" width="2" height="3.5" rx="1" fill="currentColor" opacity="0.9"/>
  <path d="M10.5 14 A1.5 1.5 0 0 1 13.5 14 L13.5 15 A1.5 1.5 0 0 1 10.5 15 Z" fill="currentColor" opacity="0.7"/>`,
  flame: `<path d="M12 2 C12 2 6.5 8.5 6.5 13.5 A5.5 5.5 0 0 0 17.5 13.5 C17.5 10 14 8 14 5.5 C14 8.5 12.5 8.5 12.5 6 C12.5 4 12 3 12 2Z" fill="currentColor"/>
  <path d="M12 10 C12 10 9.5 13 9.5 15 A2.5 2.5 0 0 0 14.5 15 C14.5 13.2 12 11.5 12 10Z" fill="rgba(255,235,150,0.85)"/>`,
  snow: `<g stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none">
    <line x1="12" y1="3" x2="12" y2="21"/><line x1="4.2" y1="7.5" x2="19.8" y2="16.5"/><line x1="19.8" y1="7.5" x2="4.2" y2="16.5"/>
    <path d="M12 6.2 L10 4.5 M12 6.2 L14 4.5 M12 17.8 L10 19.5 M12 17.8 L14 19.5"/>
    <path d="M5.6 9.3 L5.2 7 M5.6 9.3 L3.4 9.6 M18.4 14.7 L18.8 17 M18.4 14.7 L20.6 14.4"/>
    <path d="M18.4 9.3 L18.8 7 M18.4 9.3 L20.6 9.6 M5.6 14.7 L5.2 17 M5.6 14.7 L3.4 14.4"/></g>`,
  water: `<path d="M12 3 C12 3 6 11 6 15 A6 6 0 0 0 18 15 C18 11 12 3 12 3Z" fill="currentColor"/>
  <path d="M9 15 A3 3 0 0 0 12 18" stroke="rgba(255,255,255,0.45)" stroke-width="1.2" fill="none" stroke-linecap="round"/>`,
  heat: `<g stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round">
    <path d="M7.5 21 V14 Q7.5 10.5 9.75 10.5 Q12 10.5 12 7"/>
    <path d="M13 21 V13 Q13 9.5 15.25 9.5 Q17.5 9.5 17.5 6"/></g>`,
};
const rcIcon = (k, s = 31) =>
  `<svg viewBox="0 0 24 24" width="${s}" height="${s}" style="display:block">${RC_ICONS[k]}</svg>`;
const icon = (k, s = 30) =>
  `<svg width="${s}" height="${s}" viewBox="0 0 32 32" style="display:block">${ICON_DEFS}${ICONS[k] || ICONS.gear}</svg>`;

/* ── small helpers ── */
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
/* shared raised-tile shadow with a coloured inner glow (g = "r,g,b") — used by nav + stat tiles */
const glowShadow = g => `inset 0 1px 0 rgba(120,210,255,.28),inset 0 -1px 0 rgba(0,0,0,.6),0 4px 20px rgba(0,0,0,.65),inset 0 0 40px rgba(${g},.05)`;
/* config keys whose value must be a number — guards against YAML authored with a
   quoted value (e.g. thresh_temp_warn: "40") so downstream code can rely on the type
   instead of every call site re-coercing defensively. Coerced once in setConfig(). */
const NUMERIC_CONFIG_KEYS = [
  'battery_full_ah', 'battery_full_wh', 'battery2_full_ah', 'battery2_full_wh',
  'inverter_max_power', 'pv_max_power', 'lower_section_offset', 'charger_battery_capacity_wh',
  'thresh_temp_warn', 'thresh_temp_critical', 'thresh_cell_v_low', 'thresh_cell_v_critical', 'thresh_cell_v_high',
  'thresh_soc_low', 'thresh_soc_critical', 'thresh_load_warn', 'thresh_load_critical',
  'thresh_endurance_low', 'thresh_endurance_crit',
  'sz_soc', 'sz_mode', 'sz_invstate', 'ui_bg_opacity', 'ui_blur', 'edge_dim_opacity', 'sz_flow_power', 'sz_flow_volt',
  'sz_batbox_label', 'sz_batbox_value', 'sz_tile_label', 'sz_tile_value', 'sz_prodcons_total',
  'sz_pvtile', 'sz_bottile_label', 'sz_bottile_value', 'sz_totals_value', 'sz_invload',
];

/* recognized HA domains — used by the hass-update dirty-check to find entity-id-shaped
   config values regardless of key naming (config has no consistent *_entity suffix). */
const HA_DOMAINS = /^(sensor|binary_sensor|switch|light|climate|sun|weather|camera|automation|scene|script|input_boolean|input_datetime|input_number|input_select|input_text|person|device_tracker|cover|fan|lock|alarm_control_panel|media_player|water_heater|vacuum|humidifier|number|select|button|group|zone|timer|counter|proximity)\./;

const NAV_VIEWS = [
  ['dashboard',  'DASHBOARD',  'Home',                  'home'],
  ['energy',     'ENERGY',     'Production & Flow',     'bolt'],
  ['plugs',      'SMART PLUGS','Load & Switches',       'plug'],
  ['battery',    'BATTERY',    'Status & Settings',     'batt'],
  ['climate',    'CLIMATE',    'Temperature & Humidity','therm'],
  ['security',   'SECURITY',   'Alarms & Cameras',      'shield'],
  ['automation', 'AUTOMATION', 'Scenes & Routines',     'gear'],
  ['lighting',   'LIGHTING',   'Lights & Ambience',     'bulb'],
  ['system',     'SYSTEM',     'System & Preferences',  'gear'],
];

/* ════════════════════════════════════════════════════════════════════
   CARD
   ════════════════════════════════════════════════════════════════════ */
class CasaLuna extends HTMLElement {

  /* —— config (keys preserved from casa_luna.js, plus additive keys) —— */
  static getStubConfig() {
    return {
      pv1_power: '',
      pv2_power: '',
      pv3_power: '', pv4_power: '', pv5_power: '', pv6_power: '',
      pv_total_power: '',
      grid_active_power: '',
      grid_export_energy: '',
      consump: '',
      today_pv: '',
      total_pv: '',
      total_import: '', total_export: '',
      inverter_state: '',
      inverter_error: '',
      today_batt_chg: '',
      today_load: '',
      battery_soc: '',
      battery_power: '',
      battery_current: '',
      battery_voltage: '',
      label_cell_temp: 'CELL TEMP',
      label_load: 'LOAD',
      label_cell_volt: 'CELL VOLT',
      battery_temp1: '',
      battery_temp2: '',
      battery_mos: '',
      battery_min_cell: '',
      battery_max_cell: '',
      inv_temp: '',
      batt_dis: '',
      battery2_soc: '', battery2_power: '', battery2_current: '',
      battery2_voltage: '', battery2_mos: '',
      battery_full_ah: 0, battery_full_wh: 0, battery_cap_unit: 'ah',
      battery2_cap_unit: 'ah',
      battery2_full_ah: 0, battery2_full_wh: 0,
      inverter_max_power: 6000, pv_max_power: 7500,
      lower_section_offset: 0,
      charger_state: '', charger_current: '', charger_power: '',
      charger_soc: '', charger_eta: '', charger_battery_capacity_wh: 0,
      sun: 'sun.sun',
      weather_entity: 'weather.home',
      weather_temp_entity: '', weather_wind_entity: '', weather_dir_entity: '',
      inverter_name: '',
      label_bms_temp: 'BMS TEMP', label_endurance: 'ENDURANCE',
      label_batt_current: 'BATT CURRENT', label_capacity: 'CAPACITY',
      pv1_voltage: '',
      pv2_voltage: '',
      pv3_voltage: '', pv4_voltage: '', pv5_voltage: '', pv6_voltage: '',
      grid_import_today: '',
      grid_voltage: '',
      _show_phase: true, grid_phase_a: '', grid_phase_b: '', grid_phase_c: '',
      grid_phase_a_volt: '', grid_phase_b_volt: '', grid_phase_c_volt: '',
      _show_battery2: false,
      invert_battery_power: false, invert_grid_power: true,
      _show_pv_extra: false, _show_ev: false,
      _show_bars: true, _show_battstats: true, _show_pvtile: true,
      _extra_tile_1_enabled: true,  _extra_tile_1_label: 'Heat Pump',   _extra_tile_1_entity: '', _extra_tile_1_icon: 'heat',
      _extra_tile_2_enabled: true,  _extra_tile_2_label: 'Irrigation',  _extra_tile_2_entity: '', _extra_tile_2_icon: 'water',
      _extra_tile_3_enabled: true,  _extra_tile_3_label: 'Gas / Flame', _extra_tile_3_entity: '', _extra_tile_3_icon: 'flame',
      _extra_tile_4_enabled: true,  _extra_tile_4_label: 'AC',          _extra_tile_4_entity: '', _extra_tile_4_icon: 'snow',
      _extra_tile_5_enabled: true,  _extra_tile_5_label: 'Lights',      _extra_tile_5_entity: '', _extra_tile_5_icon: 'bulb',
      _extra_tile_6_enabled: true,  _extra_tile_6_label: 'Outlet',      _extra_tile_6_entity: '', _extra_tile_6_icon: 'plug',
      thresh_temp_warn: 40, thresh_temp_critical: 50,
      thresh_cell_v_low: 3.1, thresh_cell_v_critical: 3.0, thresh_cell_v_high: 3.65,
      thresh_soc_low: 25, thresh_soc_critical: 15,
      thresh_load_warn: 70, thresh_load_critical: 90,
      thresh_endurance_low: 2, thresh_endurance_crit: 1,
      /* —— additive (new in casa-luna) —— */
      title: 'CASA LUNA',
      background_path: '/local/community/casa-luna/sky',
      edge_dim_opacity: 100,
      history_charts: true,
      _show_advanced: false,
      cell_temp_x10: false,
      camera_stream_base: '',
      /* per-view auto-discovery toggles (OFF = manual entity picks; ON = scan hass by device_class) */
      auto_discover_security: false, auto_discover_climate: false,
      auto_discover_lighting: false, auto_discover_automation: false,
      events_entities: [],
      /* ── phase / inverter flip tile ── */
      label_phase_title: 'GRID PHASES', label_inv_title: 'INVERTER',
      inv_l1_power: '', inv_l2_power: '', inv_l3_power: '',
      inverter_output_power: '',
      inv_l1_volt: '', inv_l2_volt: '', inv_l3_volt: '',
      /* ── SECURITY view ── (real entities pre-filled; slots empty for later) */
      sec_cam1: '', sec_cam2: '',
      sec_flame: '', sec_gas_analog: '',
      sec_gas_digital: '', sec_motion: '',
      sec_door1: '', sec_window1: '',
      sec_scene_arm: '', sec_scene_disarm: '', sec_scene_night: '', sec_motion_alert: '',
      /* ── CLIMATE view ── (ambient/lux pre-filled from your ESP; AC/fridge slots for later) */
      clim_ac: '', clim_fridge_temp: '', clim_fridge_door: '', clim_fridge_power: '',
      clim_ambient: '', clim_humidity: '', clim_lux: '',
      clim_window_ac: '', clim_schedule: '',
      clim_ac_name: '', clim_fridge_temp_name: '', clim_fridge_door_name: '', clim_fridge_power_name: '',
      clim_ambient_name: '', clim_humidity_name: '', clim_lux_name: '',
      clim_extra_1_entity: '', clim_extra_1_name: '', clim_extra_2_entity: '', clim_extra_2_name: '',
      clim_extra_3_entity: '', clim_extra_3_name: '', clim_extra_4_entity: '', clim_extra_4_name: '',
      clim_extra_5_entity: '', clim_extra_5_name: '', clim_extra_6_entity: '', clim_extra_6_name: '',
      plug_1_entity: '', plug_1_name: '', plug_1_power: '', plug_2_entity: '', plug_2_name: '', plug_2_power: '',
      plug_3_entity: '', plug_3_name: '', plug_3_power: '', plug_4_entity: '', plug_4_name: '', plug_4_power: '',
      plug_5_entity: '', plug_5_name: '', plug_5_power: '', plug_6_entity: '', plug_6_name: '', plug_6_power: '',
      sec_flame_name: '', sec_gas_analog_name: '', sec_gas_digital_name: '', sec_motion_name: '', sec_door1_name: '', sec_window1_name: '',
      sec_extra_1_entity: '', sec_extra_1_name: '', sec_extra_2_entity: '', sec_extra_2_name: '', sec_extra_3_entity: '', sec_extra_3_name: '',
      sec_extra_4_entity: '', sec_extra_4_name: '', sec_extra_5_entity: '', sec_extra_5_name: '', sec_extra_6_entity: '', sec_extra_6_name: '',
      light1_name: '', light2_name: '', light3_name: '', light_zigbee_name: '',
      light_extra_1_entity: '', light_extra_1_name: '', light_extra_2_entity: '', light_extra_2_name: '', light_extra_3_entity: '', light_extra_3_name: '',
      light_extra_4_entity: '', light_extra_4_name: '', light_extra_5_entity: '', light_extra_5_name: '', light_extra_6_entity: '', light_extra_6_name: '',
      auto_relay1_name: '', auto_relay2_name: '', auto_relay3_name: '', auto_relay4_name: '',
      auto_extra_1_entity: '', auto_extra_1_name: '', auto_extra_2_entity: '', auto_extra_2_name: '', auto_extra_3_entity: '', auto_extra_3_name: '',
      auto_extra_4_entity: '', auto_extra_4_name: '', auto_extra_5_entity: '', auto_extra_5_name: '', auto_extra_6_entity: '', auto_extra_6_name: '',
      /* ── ENERGY view ── (monitoring pre-filled from GoodWe/Tuya; control slots for later) */
      en_pv1: '', en_pv2: '',
      en_grid_power: '', en_load: '',
      en_backup: '', en_work_mode: '',
      en_backup_supply: '', en_ems_mode: '', en_op_mode: '', en_export_switch: '', en_export_limit: '',
      en_dod_holding: '', en_soc_protect: '', en_dod_ongrid: '', en_dod_offgrid: '',
      en_eco_power: '', en_ems_power: '', en_grid_switch: '', en_sync_time: '',
      /* ── BATTERY view ── (JK BMS pre-filled; charge-control slots for later) */
      bat_soc: '', bat_voltage: '',
      bat_current: '', bat_power: '',
      bat_remain: '',
      bat_cellmax: '', bat_cellmin: '',
      bat_temp1: '', bat_temp2: '',
      bat_mos: '',
      bat_charge_enable: '', bat_discharge_enable: '', bat_force_charge: '', bat_soc_limit: '',
      /* ── AUTOMATION view ── (relays + Alexa pre-filled; scenes/automations/timers slots) */
      auto_scene_night: '', auto_scene_morning: '', auto_scene_away: '',
      auto_scene_movie: '', auto_scene_party: '', auto_scene_home: '',
      auto_relay1: '',
      auto_relay2: '',
      auto_relay3: '',
      auto_relay4: '',
      auto_motion_lights: '', auto_sunset_lights: '', auto_door_alerts: '',
      auto_low_batt: '', auto_smoke_fan: '',
      auto_night_mode: '', auto_vacation_mode: '', auto_guest_mode: '',
      auto_alexa: '',
      tuya_sw1: '', tuya_sw1_on: '', tuya_sw1_off: '', tuya_sw1_timer: '',
      tuya_sw2: '', tuya_sw2_on: '', tuya_sw2_off: '', tuya_sw2_timer: '',
      /* ── LIGHTING view ── (Zigbee light pre-filled; others slots) */
      light1: '', light2: '', light3: '', light_zigbee: '',
      light_all_on: '', light_all_off: '', light_adaptive: '',
      /* ── SYSTEM view ── (ESP/inverter pre-filled; server stats slots) */
      sys_inv_temp: '', sys_work_mode: '',
      sys_c3_status: '',
      sys_board_temp: '', sys_gas: '', sys_lux: '',
      sys_wifi: '', sys_bluetooth: '', sys_grid_meter: '',
      _demo_mode: false,
      calendar_entities: [],
      sys_cpu: '', sys_memory: '', sys_disk: '', sys_uptime: '',
      /* per-element font sizes (px) — default to current values; editor lets user resize */
      sz_soc: 21, sz_mode: 17, sz_invstate: 9,
      ui_bg_color: '#000000', ui_bg_opacity: 35, ui_blur: 9,
      sz_flow_power: 16, sz_flow_volt: 13,
      sz_batbox_label: 12, sz_batbox_value: 17,
      sz_tile_label: 11, sz_tile_value: 21,
      sz_prodcons_total: 15, sz_pvtile: 14,
      sz_bottile_label: 12, sz_bottile_value: 15,
      sz_totals_value: 16, sz_invload: 22,
      /* —— per-entity labels (customizable via ✏️ in each section) —— */
      label_grid_import_today: 'GRID IMPORT', label_grid_export_energy: 'GRID EXPORT',
      label_consump: 'LOAD',
      label_total_pv: 'TOTAL PV', label_inverter_state: 'INV STATE',
      label_today_consumption: "TODAY'S CONSUMPTION", label_today_production: "TODAY'S PRODUCTION",
      label_total_imp: 'TOTAL IMP', label_total_exp: 'TOTAL EXP', label_chg_dis: 'CHG / DIS',
    };
  }

  static getConfigElement() { return document.createElement('casa-luna-editor'); }
  /* ═══════════════════════ LIFECYCLE & HASS ═══════════════════════ */
  getCardSize() { return 8; }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._built = false;
    this._activeView = 'dashboard';
    this._bgKey = '';
    this._bgFlip = false;
    this._histCache = {};   // entity -> {t, pts}
    this._lastMinute = -1;
    // PV wave double-buffer (matches khan-skycard exactly)
    this._pvSlot = 'A';
    this._prevPvTier = -1;
    this._prevPvWaveBx = -1;
    this._prevPvWaveBy = -1;
    this._prevMoonPhase = -1;
  }

  setConfig(config) {
    const stub = CasaLuna.getStubConfig();
    const merged = { ...stub, ...config };
    /* type guard: a hand-written YAML value like thresh_temp_warn: "40" (string) would
       otherwise silently rely on JS's loose comparison coercion everywhere it's read —
       fine today (only comparisons), but fragile if future code ever does arithmetic
       on these. Normalize once here instead. */
    for (const k of NUMERIC_CONFIG_KEYS) {
      const n = Number(merged[k]);
      merged[k] = Number.isFinite(n) ? n : stub[k];
    }
    this.config = merged;
    this._built = false;
    if (this._hass) this._build();
  }

  /* —— BUILD 1: render dirty-check ——
     HA pushes a new hass object on every state change anywhere in the system,
     not just for entities this card uses. Without a guard, _update() runs a
     full pass on every unrelated push too. Discover this card's entity-id-shaped
     config values by domain pattern (works regardless of key naming) and skip
     _update() when none of their state/last_updated has changed. */
  _watchedEntityIds() {
    if (this._watchedIdsCache && this._watchedIdsCacheConfig === this.config) return this._watchedIdsCache;
    const ids = new Set();
    const scan = v => { if (typeof v === 'string' && HA_DOMAINS.test(v)) ids.add(v); };
    for (const v of Object.values(this.config || {})) {
      if (Array.isArray(v)) v.forEach(scan); else scan(v);
    }
    this._watchedIdsCache = ids;
    this._watchedIdsCacheConfig = this.config;
    return ids;
  }
  /* domains/device_classes that the card's auto-discovery features (Recent Events,
     Security, Climate, Automation scenes, Lighting) can surface — these entities are
     never explicit config values, so without this they're invisible to the dirty-check
     above: a door opening or automation firing wouldn't change the signature, silently
     skipping _update() and leaving those displays stale until some unrelated watched
     entity happened to change too. */
  static AUTODISC_DOMAINS = new Set(['automation', 'climate', 'scene', 'light']);
  static AUTODISC_BINARY_DC = new Set(['motion', 'occupancy', 'moving', 'door', 'window', 'opening', 'garage_door', 'gas', 'smoke', 'carbon_monoxide', 'safety']);
  static AUTODISC_SENSOR_DC = new Set(['temperature', 'humidity']);
  _entitiesSignature() {
    const states = this._hass?.states;
    if (!states) return '';
    const watched = this._watchedEntityIds();
    let sig = '';
    for (const id of watched) {
      const s = states[id];
      sig += id + ':' + (s ? (s.last_updated || s.state) : '\u2205') + '|';
    }
    for (const id in states) {
      if (watched.has(id)) continue;
      const dom = id.split('.')[0];
      const dc = states[id].attributes?.device_class;
      if (CasaLuna.AUTODISC_DOMAINS.has(dom)
        || (dom === 'binary_sensor' && CasaLuna.AUTODISC_BINARY_DC.has(dc))
        || (dom === 'sensor' && CasaLuna.AUTODISC_SENSOR_DC.has(dc))) {
        sig += id + ':' + (states[id].last_updated || states[id].state) + '|';
      }
    }
    return sig;
  }

  set hass(hass) {
    this._hass = hass;
    if (!this.config) return;
    if (this.config._demo_mode) this._wrapDemoServices();
    const freshBuild = !this._built && !this._locked;
    if (freshBuild) this._build();
    if (!freshBuild && this._built && !this.config._demo_mode) {
      const sig = this._entitiesSignature();
      if (sig === this._lastEntitiesSig) return;
      this._lastEntitiesSig = sig;
    } else {
      this._lastEntitiesSig = this._entitiesSignature();
    }
    this._update();
  }

  connectedCallback() {
    /* self-heal: remove any overlay left behind by a previous instance that didn't get
       a clean disconnectedCallback (e.g. tab/iframe torn down abnormally) — see _hostOverlay */
    document.querySelectorAll('.cl-overlay').forEach(n => { if (!(this._overlays || []).includes(n)) n.remove(); });
    this._clock = setInterval(() => { if (this._hass) this._update(true); }, 15000);
    /* BUILD 3: pause all animation on screen-off/tab-hidden, resume + resync on return.
       Wall tablet sits idle most of the day — SMIL/CSS animations otherwise run 24/7
       regardless of whether anyone can see them. */
    this._visHandler = () => this._onVisibilityChange();
    document.addEventListener('visibilitychange', this._visHandler);
    if (document.hidden) this._onVisibilityChange();
  }
  disconnectedCallback() {
    clearInterval(this._clock);
    if (this._visHandler) document.removeEventListener('visibilitychange', this._visHandler);
    (this._overlays || []).forEach(n => n.remove()); this._overlays = [];
  }
  _onVisibilityChange() {
    if (document.hidden) {
      clearInterval(this._clock); this._clock = null;
      this.classList.add('cl-paused');
      this.shadowRoot.querySelectorAll('svg').forEach(svg => { try { svg.pauseAnimations && svg.pauseAnimations(); } catch (e) {} });
    } else {
      if (!this._clock) this._clock = setInterval(() => { if (this._hass) this._update(true); }, 15000);
      this.classList.remove('cl-paused');
      this.shadowRoot.querySelectorAll('svg').forEach(svg => { try { svg.unpauseAnimations && svg.unpauseAnimations(); } catch (e) {} });
      if (this._hass) this._update(true); // resync anything that changed while paused
    }
  }

  /* ── global theme: drive box background tint/opacity + blur from config via
     CSS custom properties on the host (inherited into the shadow tree). ── */
  _hexToRgba(hex, opacityPct) {
    const h = String(hex || '#000000').replace('#', '');
    const r = parseInt(h.substring(0, 2), 16) || 0, g = parseInt(h.substring(2, 4), 16) || 0, b = parseInt(h.substring(4, 6), 16) || 0;
    const a = Math.max(0, Math.min(100, opacityPct == null ? 35 : opacityPct)) / 100;
    return `rgba(${r},${g},${b},${a})`;
  }
  _applyTheme() {
    const c = this.config || {};
    this.style.setProperty('--cl-box-bg', this._hexToRgba(c.ui_bg_color || '#000000', c.ui_bg_opacity != null ? c.ui_bg_opacity : 35));
    this.style.setProperty('--cl-blur', (c.ui_blur != null ? c.ui_blur : 9) + 'px');
  }

  /* —— state helpers —— */
  /* ═══════════════════════ DATA HELPERS ═══════════════════════ */
  /* resolves the real HA state object, or — only in _demo_mode, and only when
     the real entity is missing/unavailable/unknown — a synthetic stand-in.
     Every read (_st/_attr/_lastChanged, and therefore _num/_name) funnels
     through here, so demo mode needs no changes anywhere else. */
  _stateObj(id) {
    if (!id) return null;
    const real = this._hass?.states?.[id];
    if (real && !['unavailable', 'unknown'].includes(real.state)) return real;
    if (this.config?._demo_mode) return this._mockState(id);
    return real || null;
  }
  _st(id)  { const s = this._stateObj(id); return s ? s.state : null; }
  _num(id, d = 0) { const v = parseFloat(this._st(id)); return Number.isFinite(v) ? v : d; }
  _attr(id, a) { return this._stateObj(id)?.attributes?.[a]; }
  /* normalize a power-type entity reading to WATTS regardless of whether the
     entity itself reports W or kW (checked via its own unit_of_measurement).
     Defaults to assuming W when no unit is declared, matching GoodWe/JK norms
     used elsewhere on this card. Use a NaN default to detect unavailable. */
  _watts(id, d = 0) {
    if (!id) return d;
    const v = this._num(id, NaN);
    if (!Number.isFinite(v)) return d;
    const u = (this._attr(id, 'unit_of_measurement') || '').trim().toLowerCase();
    if (u === 'kw') return v * 1000;
    if (u === 'mw') return v * 1000000;
    return v;
  }
  _name(id) { return this._attr(id, 'friendly_name') || id; }
  _lastChanged(id) { const lc = this._stateObj(id)?.last_changed; return lc ? new Date(lc).getTime() : null; }

  /* ── demo-mode: synthetic state for a missing/unavailable entity. Stable
     per-id (hashed seed), domain- and keyword-aware so values look plausible
     (SOC%, temps, volts, power, kWh) rather than zero/blank. Cached so a
     tile's mock value doesn't jump around between renders. ── */
  _mockState(id) {
    if (!this._mockCache) this._mockCache = {};
    if (this._mockCache[id]) return this._mockCache[id];
    const domain = id.split('.')[0];
    const lc = id.toLowerCase();
    const seed = [...id].reduce((a, ch) => a + ch.charCodeAt(0), 0);
    const pct = seed % 100;
    let state, attributes = { friendly_name: this._mockLabel(id) };
    if (domain === 'binary_sensor') state = (seed % 4 === 0) ? 'on' : 'off';
    else if (['switch', 'light', 'input_boolean', 'fan'].includes(domain)) state = (seed % 2 === 0) ? 'on' : 'off';
    else if (domain === 'climate') state = 'heat';
    else if (domain === 'cover') state = 'open';
    else if (domain === 'lock') state = 'locked';
    else if (domain === 'sun') state = 'above_horizon';
    else if (domain === 'weather') {
      state = 'sunny';
      attributes = { ...attributes, temperature: 24, humidity: 45, pressure: 1012, wind_speed: 12, wind_bearing: 60,
        forecast: [0, 1, 2, 3, 4].map(d => ({ datetime: new Date(Date.now() + d * 86400000).toISOString(), condition: 'sunny', temperature: 26 + d, templow: 18 + d })) };
    } else if (domain === 'calendar') state = 'off';
    else if (/soc|battery_level|percent/.test(lc)) state = 20 + (pct % 80);
    else if (/cell.*volt/.test(lc)) state = (3.2 + (pct % 40) / 100).toFixed(3);
    else if (/volt/.test(lc)) state = 220 + (pct % 30);
    else if (/temp/.test(lc)) state = 18 + (pct % 25);
    else if (/current/.test(lc)) state = ((pct % 20) / 10).toFixed(1);
    else if (/power|watt/.test(lc)) state = pct * 30;
    else if (/(energy|kwh|generation|charge)/.test(lc)) state = ((pct % 50) + (pct % 10) / 10).toFixed(2);
    else if (/work_mode|inverter_state/.test(lc)) state = 'Normal';
    else state = pct;
    const obj = { state: String(state), attributes,
      last_changed: new Date(Date.now() - (seed % 6) * 3600000).toISOString() };
    this._mockCache[id] = obj;
    return obj;
  }
  _mockLabel(id) {
    return id.split('.')[1].replace(/_/g, ' ').replace(/\b\w/g, m => m.toUpperCase());
  }

  /* ── demo-mode: route service calls (toggle/turn_on/turn_off/set_value) for
     mocked entities to a LOCAL state mutation instead of the real HA backend
     — so taps work and look right with zero real entities, and real devices
     are never touched while testing. Non-mocked entities pass straight through. ── */
  _wrapDemoServices() {
    if (!this._hass || !this.config?._demo_mode) return;
    const realCall = this._hass.callService.bind(this._hass);
    this._hass.callService = (domain, service, data) => {
      const id = data?.entity_id;
      const mocked = id && this._mockCache && this._mockCache[id];
      if (!mocked) return realCall(domain, service, data);
      if (service === 'toggle') mocked.state = mocked.state === 'on' ? 'off' : 'on';
      else if (service === 'turn_on') { mocked.state = 'on'; if (data.brightness_pct != null) mocked.attributes.brightness_pct = data.brightness_pct; }
      else if (service === 'turn_off') mocked.state = 'off';
      else if (service === 'set_value' && data.value != null) mocked.state = String(data.value);
      this._update();
      return Promise.resolve();
    };
  }
  _relTime(ms) {
    if (ms == null) return '--';
    const s = Math.max(0, Math.floor((Date.now() - ms) / 1000));
    if (s < 60) return `${s}s ago`;
    const m = Math.floor(s / 60); if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60); if (h < 24) return `${h}h ${m % 60}m ago`;
    const d = Math.floor(h / 24); return `${d}d ${h % 24}h ago`;
  }
  _durTime(ms) {
    if (ms == null) return '--';
    const s = Math.max(0, Math.floor((Date.now() - ms) / 1000));
    const m = Math.floor(s / 60); if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60); return `${h}h ${m % 60}m`;
  }
  /* conditional decimals: cap to 2 only when the value has >2; otherwise natural (no padding) */
  _dec(v) {
    const n = Number(v);
    if (!Number.isFinite(n)) return '--';
    const s = String(v);
    const dot = s.indexOf('.');
    const decs = dot < 0 ? 0 : s.length - dot - 1;
    return decs > 2 ? n.toFixed(2) : s;
  }
  /* same rule, but reads the RAW entity string first — preserves true source precision
     even when trailing zeros would otherwise vanish on parseFloat (e.g. "60.000" → 60). */
  _decEnt(id, fallback = NaN) {
    const raw = this._st(id);
    if (raw == null || raw === '') return this._dec(fallback);
    return this._dec(raw);
  }
  _fmt(v) { return this._dec(v); }

  /* The 7 customizable tiles → the config key the editor edits for each.
     A tile shows raw (entity's own unit/sign) when its entity is set, else default kWh. */
  /* ═══════════════════════ TILE / ENTITY CONFIG HELPERS ═══════════════════════ */
  _TILES() {
    return {
      load:  { entityKey:'consump'           },
      ctmp:  { entityKey:'battery_temp1'     },
      bms:   { entityKey:'battery_mos'       },
      cellv: { entityKey:'battery_min_cell'  },
      imp:   { entityKey:'grid_import_today' },
      exp:   { entityKey:'grid_export_energy'},
      pv:    { entityKey:'total_pv'          },
    };
  }
  /* custom=true whenever the entity differs from default — switches that tile to raw
     display (entity's own unit/sign, via _rawTile) instead of forced kWh formatting.
     Previously required the label to ALSO be changed, which meant pointing the tile
     at a different entity alone could show wrongly-formatted (or blank) values until
     the caption was edited too. Entity choice alone now drives correct formatting. */
  _tileState(key) {
    const c = this.config, t = this._TILES()[key];
    const curEnt = c[t.entityKey] || '';
    return { custom: !!curEnt, entity: curEnt };
  }
  /* raw display string for a fallen-back tile: 1-decimal numeric (+unit), or text state, or '--' */
  _rawTile(entId) {
    const s = entId && this._hass?.states?.[entId];
    if (!s || s.state === 'unavailable' || s.state === 'unknown' || s.state === '') return '--';
    const num = parseFloat(s.state);
    if (isNaN(num)) return String(s.state);
    const unit = (s.attributes?.unit_of_measurement || '').trim();
    return this._dec(s.state) + (unit ? ' ' + unit : '');
  }
  /* ═══════════════════════ FORMAT & DOM HELPERS ═══════════════════════ */
  _kwh(v) { return Number.isFinite(v) ? `${this._dec(v)} kWh` : '--'; }
  /* unified power label: takes WATTS, shows small values in W and large in kW
     (decimals capped via _dec). Single source of truth so every power readout —
     flow lines, tiles, phase/inverter, PV strings — formats identically. */
  _powerStr(watts) {
    if (!Number.isFinite(watts)) return '--';
    const a = Math.abs(watts);
    return a >= 1000 ? `${this._dec(watts / 1000)} kW` : `${Math.round(watts)} W`;
  }
  /* reading the entity: if it's genuinely a power sensor (unit W/kW/MW, or a plain
     unitless number) show smart W/kW; otherwise fall back to the entity's own
     value+unit, or its text state, or '--'. So a power slot pointed at a %, °C, or
     text-state entity still shows that entity's real reading instead of blanking —
     matching how mainstream HA cards behave. */
  _powerEnt(id) {
    if (!id) return '--';
    const s = this._stateObj(id);
    if (!s || s.state === 'unavailable' || s.state === 'unknown' || s.state === '') return '--';
    const unit = (s.attributes?.unit_of_measurement || '').trim();
    const u = unit.toLowerCase();
    const num = parseFloat(s.state);
    if (u === 'w' || u === 'kw' || u === 'mw' || (unit === '' && Number.isFinite(num))) {
      return this._powerStr(this._watts(id, NaN));   // genuine power → smart W/kW
    }
    if (Number.isFinite(num)) return this._dec(s.state) + (unit ? ' ' + unit : '');  // other numeric → value+own unit
    return String(s.state);                            // text state → show as-is
  }
  _kwhEnt(id) {
    const s = this._stateObj(id);
    if (!s || s.state === 'unavailable' || s.state === 'unknown' || s.state === '') return '--';
    if (!Number.isFinite(parseFloat(s.state))) return String(s.state);  // text state → show as-is
    const unit = (s.attributes?.unit_of_measurement || 'kWh');
    return `${this._decEnt(id)} ${unit}`;
  }
  _cap(s) { return String(s).replace(/_/g, ' ').replace(/\b\w/g, m => m.toUpperCase()); }
  /* —— BUILD 2: element cache ——
     querySelector/getElementById walk the shadow tree on every call; _build() only
     runs once per config, so the resolved element is stable across _update() passes.
     Cache it. isConnected guards against staleness if the tree is ever rebuilt —
     a detached cached element is simply re-queried, no manual invalidation needed. */
  _q(sel) {
    const c = this._qCache || (this._qCache = new Map());
    let el = c.get(sel);
    if (el && el.isConnected) return el;
    el = this.shadowRoot.querySelector(sel);
    if (el) c.set(sel, el); else c.delete(sel);
    return el;
  }
  _qi(id) {
    const c = this._qiCache || (this._qiCache = new Map());
    let el = c.get(id);
    if (el && el.isConnected) return el;
    el = this.shadowRoot.getElementById(id);
    if (el) c.set(id, el); else c.delete(id);
    return el;
  }
  _setTxt(sel, t) { const e = this._q(sel); if (e && e.textContent !== t) e.textContent = t; }
  _setColor(sel, color) { const e = this._q(sel); if (e) e.style.color = color; }
  /* dual-battery aware value: "v1 | v2 unit" when battery2 on, else "v1 unit". */
  _dualVal(sel, ent1, ent2, unit, fmt) {
    const f = fmt || (id => this._decEnt(id));
    const v1 = this._num(ent1, NaN);
    const s1 = Number.isFinite(v1) ? f(ent1) : '--';
    if (this.config._show_battery2) {
      const v2 = this._num(ent2, NaN);
      const s2 = Number.isFinite(v2) ? f(ent2) : '--';
      this._setTxt(sel, `${s1} | ${s2} ${unit}`);
    } else {
      this._setTxt(sel, Number.isFinite(v1) ? `${s1} ${unit}` : '--');
    }
  }

  /* Sum of PV1-4 power (falls back to pv_total_power if no individual strings set) */
  _pvSum() {
    const c = this.config;
    const all = c._show_pv_extra
      ? [c.pv1_power, c.pv2_power, c.pv3_power, c.pv4_power, c.pv5_power, c.pv6_power]
      : [c.pv1_power, c.pv2_power];
    const ids = all.filter(Boolean);
    if (ids.length === 0) return this._watts(c.pv_total_power);
    let sum = 0;
    for (const id of ids) sum += this._watts(id);
    return sum;
  }

  /* ══════════════ BUILD (once per config) ══════════════ */
  /* component styles (static; interpolates only module geometry + scale vars) */
  _styles() {
    return `
      :host { display:block; }
      .stage { position:relative; width:100%; aspect-ratio:${VB_W}/${VB_H};
        border-radius:18px; overflow:hidden; background:#020c1e;
        container-type: inline-size; font-family:'Segoe UI',Roboto,'Helvetica Neue',system-ui,sans-serif; }
      .scaler { position:absolute; left:0; top:0; width:${VB_W}px; height:${VB_H}px;
        transform-origin:top left; }
      .bg { position:absolute; inset:0; width:100%; height:100%; object-fit:cover;
        transition:opacity 1.6s ease; }
      /* —— weather system overlays (ported from khan-skycard) —— */
      #wxStars { position:absolute; left:0; top:0; width:${VB_W}px; height:58%; pointer-events:none; transition:opacity 1.4s ease; z-index:1; }
      #wxLayer { position:absolute; inset:0; overflow:hidden; pointer-events:none; z-index:1; }
      /* BUILD 3: tablet screen off / tab backgrounded — pause every CSS-driven animation
         (stars, rain, snow, fog, lightning, device-tile pulses) in one rule. !important
         beats the non-important inline animation shorthand each particle sets. SMIL
         (animate elements in the flow/arc SVGs) is paused separately via pauseAnimations(). */
      :host(.cl-paused) * { animation-play-state: paused !important; }
      @keyframes clTwinkle{0%,100%{opacity:.10}50%{opacity:.85}}
      @keyframes clRain{0%{transform:translateY(-30px) skewX(-10deg)}100%{transform:translateY(110%) skewX(-10deg)}}
      @keyframes clSnow{0%{transform:translateY(-10px) translateX(0)}25%{transform:translateY(28%) translateX(8px)}50%{transform:translateY(56%) translateX(-5px)}75%{transform:translateY(82%) translateX(9px)}100%{transform:translateY(110%) translateX(3px)}}
      @keyframes clLightning{0%,85%,88%,92%,100%{opacity:0}86%,90%{opacity:.8}}
      @keyframes clFogDrift{0%{transform:translateX(-6%)}100%{transform:translateX(6%)}}
      /* live device-tile animations (lifted from room card) */
      @keyframes clSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      .tileSpin{animation:clSpin 2.4s linear infinite;transform-origin:center;transform-box:fill-box}
      @keyframes clBulbPulse{0%,100%{filter:drop-shadow(0 0 4px rgba(255,230,60,.55))}50%{filter:drop-shadow(0 0 11px rgba(255,230,60,1))}}
      .tileBulbOn{animation:clBulbPulse 2.2s ease-in-out infinite}
      @keyframes clSocketGlow{0%,100%{filter:drop-shadow(0 0 2px rgba(80,240,140,.4))}50%{filter:drop-shadow(0 0 8px rgba(80,240,140,.95))}}
      .tileSocketOn{animation:clSocketGlow 2.5s ease-in-out infinite}
      @keyframes clFlameFlicker{0%,100%{transform:scaleY(1) scaleX(1);filter:drop-shadow(0 0 4px rgba(255,90,30,.7))}40%{transform:scaleY(1.08) scaleX(.96);filter:drop-shadow(0 0 9px rgba(255,120,30,1))}70%{transform:scaleY(.97) scaleX(1.03)}}
      .tileFlameOn{animation:clFlameFlicker 1.1s ease-in-out infinite;transform-origin:center bottom;transform-box:fill-box}
      @keyframes clSnowSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      .tileSnowOn{animation:clSnowSpin 9s linear infinite;transform-origin:center;transform-box:fill-box;filter:drop-shadow(0 0 5px rgba(0,210,255,.7))}
      @keyframes clDrip{0%,100%{transform:translateY(0);filter:drop-shadow(0 0 3px rgba(60,170,255,.6))}50%{transform:translateY(1.5px);filter:drop-shadow(0 0 8px rgba(60,170,255,.95))}}
      .tileWaterOn{animation:clDrip 2s ease-in-out infinite;transform-origin:center;transform-box:fill-box}
      @keyframes clHeatWave{0%,100%{transform:translateY(0);opacity:.85;filter:drop-shadow(0 0 3px rgba(255,150,50,.5))}50%{transform:translateY(-1.5px);opacity:1;filter:drop-shadow(0 0 8px rgba(255,150,50,.9))}}
      .tileHeatOn{animation:clHeatWave 2.4s ease-in-out infinite;transform-origin:center;transform-box:fill-box}
      @keyframes clRgbCycle{0%{filter:drop-shadow(0 0 4px rgba(255,60,60,.85))}16%{filter:drop-shadow(0 0 4px rgba(255,160,0,.85))}33%{filter:drop-shadow(0 0 4px rgba(255,235,0,.85))}50%{filter:drop-shadow(0 0 4px rgba(60,255,120,.85))}66%{filter:drop-shadow(0 0 4px rgba(0,200,255,.85))}83%{filter:drop-shadow(0 0 4px rgba(160,80,255,.85))}100%{filter:drop-shadow(0 0 4px rgba(255,60,60,.85))}}
      .tileRgbOn{animation:clRgbCycle 3s linear infinite}
      @keyframes clTilePulse{0%,100%{box-shadow:inset 0 0 0 1px rgba(120,210,255,.2),0 0 0 rgba(90,224,110,0)}50%{box-shadow:inset 0 0 0 1px rgba(120,210,255,.2),0 0 16px rgba(90,224,110,.35)}}
      /* ───────── room-card device-card mechanism (copied verbatim) ───────── */
      .dcard{width:150px;border-radius:16px;background:linear-gradient(160deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.01) 100%);border:1px solid rgba(255,255,255,0.1);overflow:hidden;transition:all 0.3s;box-shadow:0 2px 12px rgba(0,0,0,0.3)}
      .dcard.on-y{border-color:rgba(255,200,50,0.5);background:linear-gradient(160deg,rgba(255,200,50,0.14) 0%,rgba(255,160,20,0.06) 100%);box-shadow:0 4px 20px rgba(255,180,30,0.2),inset 0 1px 0 rgba(255,230,80,0.2)}
      .dcard.on-c{border-color:rgba(0,200,255,0.5);background:linear-gradient(160deg,rgba(0,200,255,0.13) 0%,rgba(0,150,255,0.06) 100%);box-shadow:0 4px 20px rgba(0,180,255,0.2),inset 0 1px 0 rgba(0,230,255,0.2)}
      .dcard.on-gr{border-color:rgba(60,220,120,0.5);background:linear-gradient(160deg,rgba(60,220,120,0.13) 0%,rgba(20,180,80,0.06) 100%);box-shadow:0 4px 20px rgba(40,200,100,0.2),inset 0 1px 0 rgba(80,255,150,0.2)}
      .dcard.on-r{border-color:rgba(180,80,255,0.5);background:linear-gradient(160deg,rgba(180,80,255,0.14) 0%,rgba(140,40,255,0.06) 100%);box-shadow:0 4px 20px rgba(160,60,255,0.2),inset 0 1px 0 rgba(200,130,255,0.2)}
      .top-h{position:relative;height:62px;display:flex;align-items:center;justify-content:center;border-radius:16px 16px 0 0}
      .top-h.bg-y{background:radial-gradient(ellipse at 25% 0%,rgba(255,210,60,0.22) 0%,transparent 65%)}
      .top-h.bg-c{background:radial-gradient(ellipse at 25% 0%,rgba(0,200,255,0.2) 0%,transparent 65%)}
      .top-h.bg-gr{background:radial-gradient(ellipse at 25% 0%,rgba(60,220,120,0.2) 0%,transparent 65%)}
      .i-ring{width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);transition:all 0.3s;cursor:pointer}
      .i-ring.ry{background:linear-gradient(145deg,rgba(255,210,60,0.28) 0%,rgba(255,160,20,0.14) 100%);border-color:rgba(255,210,60,0.55);box-shadow:0 3px 14px rgba(255,180,30,0.3),inset 0 1px 0 rgba(255,240,100,0.3);color:rgba(255,225,70,0.98)}
      .i-ring.rc{background:linear-gradient(145deg,rgba(0,210,255,0.25) 0%,rgba(0,150,255,0.12) 100%);border-color:rgba(0,200,255,0.55);box-shadow:0 3px 14px rgba(0,180,255,0.3),inset 0 1px 0 rgba(0,240,255,0.3);color:rgba(0,225,255,0.98)}
      .i-ring.rgr{background:linear-gradient(145deg,rgba(60,230,120,0.22) 0%,rgba(20,180,80,0.1) 100%);border-color:rgba(60,220,120,0.55);box-shadow:0 3px 14px rgba(40,200,100,0.3),inset 0 1px 0 rgba(100,255,160,0.3);color:rgba(80,245,145,0.98)}
      .i-ring.rr{background:linear-gradient(145deg,rgba(200,80,255,0.25) 0%,rgba(150,40,255,0.12) 100%);border-color:rgba(190,90,255,0.55);box-shadow:0 3px 14px rgba(160,60,255,0.3),inset 0 1px 0 rgba(210,140,255,0.3);color:rgba(210,140,255,0.98)}
      .i-ring svg{width:28px;height:28px}
      .i-ring:not(.ry):not(.rc):not(.rgr):not(.rr) svg{color:rgba(255,255,255,0.4)}
      .on-badge{font-size:9px;font-weight:800;letter-spacing:0.2px;padding:3px 8px;border-radius:20px;display:inline-flex;align-items:center;gap:3px;position:absolute;top:8px;right:8px;box-shadow:0 1px 4px rgba(0,0,0,0.3)}
      .on-badge::before{content:'';width:5px;height:5px;border-radius:50%;background:currentColor;opacity:0.85;flex-shrink:0}
      .ba-y{background:rgba(255,200,50,0.22);color:rgba(255,220,70,1);border:1px solid rgba(255,200,50,0.35)}
      .ba-c{background:rgba(0,200,255,0.18);color:rgba(0,225,255,1);border:1px solid rgba(0,200,255,0.35)}
      .ba-gr{background:rgba(60,220,120,0.18);color:rgba(85,245,145,1);border:1px solid rgba(60,220,120,0.35)}
      .ba-r{background:rgba(180,80,255,0.2);color:rgba(205,135,255,1);border:1px solid rgba(180,80,255,0.35)}
      .ba-off{background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.3);border:1px solid rgba(255,255,255,0.1)}
      .bot-h{padding:10px 12px 12px;display:flex;flex-direction:column;gap:4px;align-items:center}
      .c-name{font-size:13px;font-weight:700;color:rgba(255,255,255,0.9);text-align:center;width:100%}
      .c-sub{font-weight:600;font-size:11px;text-align:center;width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .sub-off{color:rgba(255,255,255,0.25)}.sub-y{color:rgba(255,215,60,0.95)}.sub-c{color:rgba(0,225,255,0.95)}
      .sub-gr{color:rgba(80,245,145,0.95)}.sub-r{color:rgba(205,135,255,0.95)}
      .bright-bar-wrap{width:100%;display:flex;align-items:center;gap:6px;margin-top:4px}
      .bright-track{flex:1;height:5px;border-radius:3px;background:rgba(255,255,255,0.08);position:relative;box-shadow:inset 0 1px 2px rgba(0,0,0,0.3);cursor:pointer}
      .bright-fill{height:100%;border-radius:3px;transition:width 0.3s;background:linear-gradient(90deg,rgba(255,160,20,0.8),rgba(255,235,60,1))}
      .bright-thumb{width:13px;height:13px;border-radius:50%;background:white;position:absolute;top:50%;transform:translate(-50%,-50%);pointer-events:none;box-shadow:0 1px 6px rgba(0,0,0,0.5),0 0 0 1px rgba(255,255,255,0.5)}
      .bright-val{font-size:11px;font-weight:700;color:rgba(255,255,255,0.55);flex-shrink:0;min-width:30px;text-align:right}
      .socket-stat{width:100%;display:flex;align-items:center;justify-content:space-between;background:rgba(255,255,255,0.04);border-radius:6px;padding:5px 8px;border:1px solid rgba(255,255,255,0.06);margin-top:4px;box-sizing:border-box}
      .socket-stat-lbl{font-size:8px;color:rgba(255,255,255,0.3);font-weight:700;letter-spacing:0.3px}
      .socket-stat-val{font-size:12px;font-weight:700;color:rgba(80,240,140,0.9)}
      .socket-bar{width:100%;height:5px;border-radius:3px;background:rgba(255,255,255,0.07);overflow:hidden;margin-top:4px;box-shadow:inset 0 1px 2px rgba(0,0,0,0.3)}
      .socket-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,rgba(60,220,120,0.7),rgba(0,255,180,1));width:0%;transition:width 0.5s}
      .spd-open-btn{width:100%;padding:6px 10px;border-radius:20px;font-size:12px;font-weight:600;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.14);color:rgba(255,255,255,0.82);cursor:pointer;display:flex;align-items:center;justify-content:center;gap:5px;margin-top:4px;box-sizing:border-box}
      .spd-open-btn.fan-on{border-color:rgba(0,200,255,0.4);box-shadow:0 0 8px rgba(0,180,255,0.2);color:rgba(160,235,255,0.95);background:rgba(0,180,255,0.1)}
      .spd-chip{flex:1;padding:9px 0;text-align:center;border-radius:10px;cursor:pointer;font-size:12px;font-weight:700;background:rgba(255,255,255,0.05);border:1px solid rgba(150,200,255,0.18);color:#a8cae6}
      .spd-chip.sel{background:rgba(0,200,255,0.22);border-color:rgba(0,200,255,0.6);color:#5bc8ff}
      .rainbow-bar{height:5px;border-radius:3px;margin-top:4px;background:linear-gradient(90deg,#ff4040,#ffa000,#ffeb00,#3cff78,#00c8ff,#a050ff,#ff4040)}
      .rgb-btn{width:100%;padding:6px 10px;border-radius:20px;font-size:12px;font-weight:700;cursor:pointer;margin-top:6px;text-align:center;background:linear-gradient(90deg,rgba(255,60,60,.2),rgba(160,80,255,.2));border:1px solid rgba(180,120,255,.4);color:#c9b6ff;box-sizing:border-box}
      .dim { position:absolute; inset:0; pointer-events:none; background:
        linear-gradient(to bottom, rgba(2,6,18,.78), rgba(2,6,18,.42) 9%, transparent 18%),
        linear-gradient(to top,    rgba(2,6,18,.82), rgba(2,6,18,.50) 14%, transparent 26%),
        linear-gradient(to right,  rgba(2,6,18,.72), rgba(2,6,18,.38) 14%, transparent 24%),
        linear-gradient(to left,   rgba(2,6,18,.76), rgba(2,6,18,.44) 22%, transparent 35%); }
      .box { position:absolute; border:1.5px solid rgba(150,200,255,.40); border-radius:14px;
        background:var(--cl-box-bg,rgba(0,0,0,.35));
        backdrop-filter:blur(var(--cl-blur,9px)); -webkit-backdrop-filter:blur(var(--cl-blur,9px));
        box-shadow:inset 0 1px 0 rgba(255,255,255,.22), inset 0 -1px 0 rgba(0,0,0,.45),
          0 7px 16px rgba(0,0,0,.45), 0 0 12px rgba(60,150,255,.10); }
      .box::before { content:""; position:absolute; inset:3px; border:1px solid rgba(120,175,235,.15);
        border-radius:10px; pointer-events:none; }
      .collapsible { transition: left .32s ease, width .32s ease; }
      .tileFrontLayer, .tileTabLayer { position:absolute; inset:0; transition:opacity .18s linear; }
      .collapsible.collapsed .tileFrontLayer { opacity:0; pointer-events:none; }
      .collapsible.collapsed .tileTabLayer { opacity:1; pointer-events:auto; }
      .collapsible:not(.collapsed) .tileTabLayer { opacity:0; pointer-events:none; }
      .collapsible:not(.collapsed) .tileFrontLayer { opacity:1; pointer-events:auto; }
      .tileTabLayer { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px; cursor:pointer; }
      .tileTabLbl { font-size:11px; font-weight:800; letter-spacing:.08em; writing-mode:vertical-rl; text-orientation:mixed; }
      .tabChevIcon { font-size:12px; color:#7fa3c4; }
      .collapseBtn { position:absolute; width:18px; height:18px; border-radius:50%; z-index:6; cursor:pointer;
        background:rgba(20,40,70,.65); border:1px solid rgba(150,200,255,.45); color:#a8cae6; font-size:11px; font-weight:700;
        display:flex; align-items:center; justify-content:center; box-shadow:0 2px 6px rgba(0,0,0,.4); }
      .collapseBtn:active { transform:scale(.88); }
      .navtile.collapsible { transition:transform .34s ease, opacity .28s ease; }
      .navtile.folded { transform:translateY(54px); opacity:0; pointer-events:none; }
      .navFrontLayer { position:absolute; inset:0; }
      #navToggle { position:absolute; cursor:pointer; transition:transform .12s ease; z-index:6;
        display:flex; align-items:center; justify-content:center; border-radius:10px;
        background:rgba(20,40,70,.65); border:1px solid rgba(150,200,255,.45); color:#a8cae6; font-size:13px;
        box-shadow:0 2px 6px rgba(0,0,0,.4); }
      #navToggle:active { transform:scale(.96); }
      .shelf { position:absolute; background:var(--cl-box-bg,rgba(0,0,0,.35)); border:1px solid rgba(70,160,240,.22);
        border-radius:14px; backdrop-filter:blur(var(--cl-blur,9px)); -webkit-backdrop-filter:blur(var(--cl-blur,9px)); }
      .well { position:absolute; background:rgba(1,6,18,.80); border:1px solid rgba(60,140,220,.22);
        border-radius:6px; box-shadow:inset 0 2px 6px rgba(0,0,0,.6), inset 0 -1px 0 rgba(255,255,255,.04); }
      .lbl { font-size:13px; letter-spacing:.07em; color:#a8cae6; text-transform:uppercase;
        font-weight:600; white-space:nowrap; font-family:'Segoe UI',Roboto,'Helvetica Neue',system-ui,sans-serif; }
      .val { font-weight:700; color:#d8eeff; white-space:nowrap;
        font-family:'Segoe UI',Roboto,'Helvetica Neue',system-ui,sans-serif; }
      /* long/unpredictable values (entity-driven totals, dual values) wrap to 2 lines
         instead of overflowing their box or getting cut off — ellipsis only kicks in
         if content is still too long even across 2 lines. One shared mechanism for
         every value slot instead of per-element font-shrink fixes. */
      .val-fit { white-space:normal; line-height:1.08;
        display:-webkit-box; -webkit-box-orient:vertical; -webkit-line-clamp:2; overflow:hidden;
        overflow-wrap:break-word; }
      .tap { cursor:pointer; transition:transform .12s, box-shadow .12s, border-color .12s; }
      .tap:hover { border-color:rgba(80,220,255,.90);
        box-shadow: inset 0 1px 0 rgba(120,210,255,.28),
          0 4px 20px rgba(0,0,0,.65),
          0 0 24px rgba(30,200,255,.35),
          0 0 0 1px rgba(30,90,180,.25); }
      .tap:active { transform:scale(.985); }
      .nav-active { border-color:rgba(50,200,255,1) !important;
        box-shadow: inset 0 1px 0 rgba(120,210,255,.28),
          0 0 28px rgba(20,190,255,.55),
          inset 0 0 18px rgba(20,160,255,.18) !important; }
      svg { display:block; overflow:visible; }
      text { font-family:'Segoe UI',Roboto,'Helvetica Neue',system-ui,sans-serif; }
      .navtile .val { font-size:17px; font-weight:700; letter-spacing:.04em; color:#cce4ff; }
      .stattile .val { font-family:'Segoe UI',Roboto,'Helvetica Neue',system-ui,sans-serif; }
      /* nav slide-panel: opens from nav rail's right edge, fills the MIDDLE zone only
         (right column stays visible). Vertical: below header → PV/PWR bar. */
      .detail { position:absolute; left:231px; top:130px;
        width:869px; height:768px;
        display:none; z-index:40;
        background:linear-gradient(135deg,rgba(12,28,52,.975),rgba(8,18,38,.985));
        border:2px solid rgba(0,200,255,.55); border-left:none;
        border-radius:0 16px 16px 0;
        box-shadow:0 0 50px rgba(0,180,255,.30),inset 0 1px 0 rgba(120,210,255,.18);
        transform-origin:left center; overflow:hidden; }
      .detail.open { display:block; animation:clPanelIn .28s cubic-bezier(.2,.7,.3,1); }
      @keyframes clPanelIn { from{ transform:scaleX(.02); opacity:.4 } to{ transform:scaleX(1); opacity:1 } }
      .detail-inner { position:absolute; inset:0; overflow-y:auto; padding:18px 24px; }
      .detail h3 { color:#5bc8ff; font-size:22px; letter-spacing:.05em; margin-bottom:2px; }
      .detail .dsub { color:#7fa3c4; font-size:12px; margin-bottom:16px; }
      .detail .dclose { position:absolute; top:14px; right:18px; color:#a8cae6; font-size:24px;
        cursor:pointer; line-height:1; z-index:2; }
      /* ── panel control widgets (rows, toggle, slider, select, button, scene, camera) ── */
      .pw { display:flex; align-items:center; gap:12px; padding:11px 14px; margin-bottom:8px;
        background:rgba(255,255,255,.04); border:1px solid rgba(120,180,255,.14);
        border-radius:11px; min-height:44px; box-sizing:border-box; }
      .pw .pw-ic { width:24px; text-align:center; font-size:17px; flex-shrink:0; }
      /* shared small corner flip button (tap to flip) */
      /* keyboard-focus visibility for custom (non-native) interactive elements —
         these get role/tabindex assigned at bind time, see _a11yPass() */
      [tabindex]:focus-visible { outline:2px solid #5bc8ff; outline-offset:2px; border-radius:4px; }
      .flipbtn { position:absolute; width:22px; height:22px; border-radius:50%; cursor:pointer;
        display:flex; align-items:center; justify-content:center; z-index:4;
        background:rgba(255,255,255,.10); border:1px solid rgba(150,200,255,.28);
        color:#a8cae6; font-size:13px; line-height:1; transition:background .2s,color .2s; }
      .flipbtn:hover { background:rgba(120,210,255,.22); color:#eaf4ff; }
      .flipbtn:active { transform:scale(.92); }
      /* backdrop-filter on a parent flattens preserve-3d in Firefox, breaking
         backface-visibility (both faces show, back mirrored) — disable it on flip cards */
      .box.flipcard { -webkit-backdrop-filter:none; backdrop-filter:none; }
      .flipface { position:absolute; inset:0; -webkit-backface-visibility:hidden; backface-visibility:hidden; transform:rotateY(0deg); }
      .flipcard.flipped .flipinner { transform:rotateY(180deg); }
      /* ── compact tile grids (metric / toggle / button) ── */
      .pw-grid { display:grid; gap:8px; margin-bottom:8px; }
      .pw-mtile { background:rgba(255,255,255,.04); border:1px solid rgba(120,180,255,.14);
        border-radius:10px; padding:9px 7px; text-align:center; min-height:62px;
        display:flex; flex-direction:column; justify-content:center; box-sizing:border-box; }
      .pw-mtile .mi { font-size:15px; line-height:1; }
      .pw-mtile .ml { font-size:9px; color:#a8cae6; text-transform:uppercase; letter-spacing:.03em;
        margin:3px 0 2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
      .pw-mtile .mv { font-size:14px; font-weight:700; color:#5bc8ff; white-space:nowrap;
        overflow:hidden; text-overflow:ellipsis; }
      .pw-mtile .mv.off { color:#7fa3c4; }
      .pw-ttile { background:rgba(255,255,255,.04); border:1px solid rgba(120,180,255,.14);
        border-radius:10px; padding:9px 7px; min-height:62px; box-sizing:border-box;
        display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px; }
      .pw-ttile .ti { font-size:15px; line-height:1; }
      .pw-ttile .tl { font-size:10px; color:#cce4ff; font-weight:600; text-align:center;
        white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%; }
      .pw .pw-lbl { flex:1; color:#cce4ff; font-size:14px; font-weight:600; white-space:nowrap;
        overflow:hidden; text-overflow:ellipsis; }
      .pw .pw-val { color:#5bc8ff; font-size:14px; font-weight:700; flex-shrink:0; }
      .pw .pw-val.off { color:#7fa3c4; }
      /* toggle */
      .pw-tgl { width:46px; height:25px; border-radius:13px; background:rgba(255,255,255,.12);
        border:1px solid rgba(255,255,255,.16); position:relative; cursor:pointer; flex-shrink:0;
        transition:background .25s,border-color .25s; }
      .pw-tgl.on { background:rgba(60,200,120,.55); border-color:rgba(80,240,150,.7); }
      .pw-tgl .kn { width:19px; height:19px; border-radius:50%; background:#eaf3ff; position:absolute;
        top:2px; left:2px; transition:left .22s; box-shadow:0 1px 4px rgba(0,0,0,.4); }
      .pw-tgl.on .kn { left:24px; }
      /* slider */
      .pw-sld-wrap { flex:1; display:flex; align-items:center; gap:10px; }
      .pw-sld { flex:1; height:5px; border-radius:3px; background:rgba(255,255,255,.12);
        position:relative; cursor:pointer; }
      .pw-sld .fill { position:absolute; left:0; top:0; bottom:0; border-radius:3px;
        background:linear-gradient(90deg,rgba(0,150,255,.7),rgba(0,210,255,1)); }
      .pw-sld .thumb { width:15px; height:15px; border-radius:50%; background:#fff; position:absolute;
        top:50%; transform:translate(-50%,-50%); box-shadow:0 1px 5px rgba(0,0,0,.5); pointer-events:none; }
      .pw-sld-val { min-width:42px; text-align:right; color:#5bc8ff; font-size:13px; font-weight:700; }
      /* select (dropdown) */
      .pw-sel { background:rgba(0,0,0,.3); border:1px solid rgba(120,180,255,.22); color:#eaf4ff;
        font-size:13px; font-weight:600; border-radius:8px; padding:7px 10px; cursor:pointer; flex-shrink:0;
        min-width:120px; outline:none; }
      .pw-sel option { background:#0c1c34; color:#eaf4ff; }
      /* button / press */
      .pw-btn { padding:7px 16px; border-radius:20px; font-size:13px; font-weight:700; cursor:pointer;
        background:rgba(0,180,255,.16); border:1px solid rgba(0,200,255,.4); color:#7fd4ff; flex-shrink:0; }
      .pw-btn:active { background:rgba(0,180,255,.3); }
      .pw-btn.danger { background:rgba(255,80,80,.14); border-color:rgba(255,90,90,.4); color:#ff9a8a; }
      /* scene buttons grid */
      .pw-scenes { display:grid; grid-template-columns:repeat(3,1fr); gap:9px; margin-bottom:12px; }
      .pw-scene { padding:13px 8px; border-radius:12px; text-align:center; cursor:pointer;
        background:linear-gradient(160deg,rgba(40,70,110,.4),rgba(20,40,70,.3));
        border:1px solid rgba(120,180,255,.22); color:#cce4ff; font-size:13px; font-weight:700; }
      .pw-scene:active { background:rgba(0,120,200,.4); }
      .pw-scene .si { font-size:20px; display:block; margin-bottom:4px; }
      /* section subheader inside panel */
      .pw-head { color:#7fb0d8; font-size:11px; font-weight:700; letter-spacing:.12em;
        text-transform:uppercase; margin:14px 0 8px; opacity:.85; }
      .pw-head:first-child { margin-top:0; }
      /* camera tiles */
      .pw-cams { display:flex; gap:12px; margin-bottom:14px; }
      .pw-cam { flex:1; aspect-ratio:16/10; background:rgba(0,0,0,.55); border:1px solid rgba(0,200,255,.3);
        border-radius:10px; overflow:hidden; position:relative; }
      .pw-cam iframe { width:100%; height:100%; border:none; }
      .pw-cam .camStream { width:100%; height:100%; object-fit:cover; display:block; background:#000; }
      .pw-cam[data-cam-tap] { cursor:pointer; }
      .pw-cam .clbl { position:absolute; bottom:6px; left:8px; font-size:11px; font-weight:700;
        color:#eaf4ff; text-shadow:0 1px 3px #000; }
      .pw-cam .crec { position:absolute; top:6px; right:8px; font-size:9px; font-weight:700;
        color:#3fb950; display:flex; align-items:center; gap:3px; }
      .pw-cam .crec::before { content:''; width:6px; height:6px; border-radius:50%; background:#3fb950;
        animation:clRecBlink 1.4s infinite; }
      @keyframes clRecBlink { 0%,100%{opacity:1} 50%{opacity:.3} }
      /* time picker row (Tuya timer) */
      .pw-time { background:rgba(0,0,0,.3); border:1px solid rgba(120,180,255,.22); color:#eaf4ff;
        font-size:13px; border-radius:8px; padding:6px 8px; outline:none; }
      .erow { display:flex; align-items:center; gap:12px; padding:9px 12px; margin-bottom:8px;
        background:rgba(2,9,24,.7); border:1px solid rgba(70,160,240,.22); border-radius:8px;
        cursor:pointer; }
      .erow:hover { border-color:rgba(80,220,255,.7); }
      .erow .en { flex:1; color:#cce4ff; font-size:15px; overflow:hidden; text-overflow:ellipsis; }
      .erow .es { color:#5fd4ff; font-weight:700; font-size:15px; }
      .erow .tgl { width:40px; height:22px; border-radius:11px; background:#1e2e44; position:relative;
        flex:none; transition:background .15s; }
      .erow .tgl::after { content:""; position:absolute; top:2px; left:2px; width:18px; height:18px;
        border-radius:50%; background:#6080a0; transition:left .15s, background .15s; }
      .erow .tgl.on { background:#1a8e42; } .erow .tgl.on::after { left:20px; background:#fff; }
      .hint { color:#5e8eaa; font-size:14px; line-height:1.5; }
    `;
  }

  /* ═══════════════════════ BUILD — full DOM (runs once per config) ═══════════════════════ */
  /* i18n: translate a card caption (English string is the key + fallback) */
  _t(s) { const m = LANG[this._lang]; return (m && m[s] != null) ? m[s] : s; }
  /* a config copy whose untouched label_* defaults are swapped for the active language */
  _localizedConfig() {
    const c = { ...this.config };
    if (!this._lang || this._lang === 'en' || !LANG[this._lang]) return c;
    const stub = CasaLuna.getStubConfig();
    for (const k in c) if (k.indexOf('label_') === 0 && c[k] === stub[k]) c[k] = this._t(stub[k]);
    return c;
  }

  /* attribution integrity — canonical phrase kept independently of the visible
     template text (decoded from char codes here, not as a plain string) so a
     casual find-replace of the on-screen credit is detected, not just trusted. */
  _attrPhrase() {
    const c = [98, 121, 32, 116, 104, 101, 32, 75, 104, 97, 110]; // "by the Khan"
    return c.map(n => String.fromCharCode(n)).join('');
  }
  _verifyAttribution() {
    const el = this._q('#hSubtitle');
    const txt = el ? el.textContent : '';
    return txt.indexOf(this._attrPhrase()) !== -1;
  }
  _lockCard() {
    this._locked = true;
    this.shadowRoot.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;width:100%;aspect-ratio:${VB_W}/${VB_H};
        background:#0a0e14;color:#ff6a6a;font-family:'Segoe UI',Roboto,system-ui,sans-serif;text-align:center;padding:24px">
        <div>
          <div style="font-size:20px;font-weight:700;margin-bottom:8px">Casa Luna — attribution required</div>
          <div style="font-size:13px;color:#a8cae6">This card's author credit has been altered or removed. Restore it to continue using the card.</div>
        </div>
      </div>`;
  }

  _build() {
    this._lang = ((this.config.language || this._hass?.locale?.language || this._hass?.language || 'en') + '').toLowerCase().slice(0, 2);
    const c = this._lc = this._localizedConfig();
    const css = this._styles();

    /* header (open zone) — hardcoded title/subtitle, weather as HTML */
    const header = `
    <div style="position:absolute;left:0;top:0;width:${VB_W}px;height:140px;pointer-events:none">
      ${c._demo_mode ? `<div style="position:absolute;left:0;top:0;width:${VB_W}px;text-align:center;z-index:50">
        <span style="display:inline-block;margin-top:4px;padding:3px 14px;border-radius:0 0 8px 8px;
          background:#ffb020;color:#1a1200;font-size:11px;font-weight:800;letter-spacing:.1em;
          box-shadow:0 2px 8px rgba(0,0,0,.4)">DEMO MODE — mock data, no real devices touched</span>
      </div>` : ''}
      <!-- Clock + date -->
      <div id="hTime" style="position:absolute;left:44px;top:30px;font-size:44px;font-weight:800;color:#eaf4ff;letter-spacing:-1px;font-family:'Segoe UI',Roboto,'Helvetica Neue',system-ui,sans-serif">--:--</div>
      <div id="hDay"  style="position:absolute;left:46px;top:84px;font-size:16px;font-weight:700;color:#a8cae6;font-family:'Segoe UI',Roboto,'Helvetica Neue',system-ui,sans-serif"></div>
      <div id="hDate" style="position:absolute;left:46px;top:104px;font-size:15px;color:#7fa3c4;font-family:'Segoe UI',Roboto,'Helvetica Neue',system-ui,sans-serif"></div>
      <div id="timeHotspot" style="position:absolute;left:40px;top:24px;width:150px;height:104px;cursor:pointer;pointer-events:auto"></div>
      <div id="weatherHotspot" style="position:absolute;left:185px;top:44px;width:180px;height:80px;cursor:pointer;pointer-events:auto"></div>
      <!-- Weather gadget — shifted left to x=190 -->
      <div id="hWxArt" style="position:absolute;left:190px;top:56px;width:50px;height:60px"></div>
      <div id="hTemp" style="position:absolute;left:252px;top:46px;font-size:32px;font-weight:700;color:#eaf4ff;font-family:'Segoe UI',Roboto,'Helvetica Neue',system-ui,sans-serif">--°</div>
      <div id="hCond" style="position:absolute;left:252px;top:82px;font-size:14px;font-weight:600;color:#a8cae6;font-family:'Segoe UI',Roboto,'Helvetica Neue',system-ui,sans-serif"></div>
      <div id="hWind" style="position:absolute;left:252px;top:104px;font-size:14px;color:#a8cae6;font-family:'Segoe UI',Roboto,'Helvetica Neue',system-ui,sans-serif"></div>
      <!-- Hardcoded metallic title -->
      <div style="position:absolute;left:0;top:0;width:${VB_W}px;text-align:center;pointer-events:none">
        <div style="margin-top:8px;line-height:1;font-family:'Bahnschrift','Arial Narrow','Franklin Gothic Medium','Segoe UI',Impact,sans-serif;font-size:70px;font-weight:900;
          letter-spacing:16px;text-align:center;
          background:linear-gradient(180deg,#ffffff 0%,#dce5ef 30%,#8ba3bc 50%,#b0c4de 75%,#556e89 100%);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
          text-shadow:none;
          filter:drop-shadow(0 0 18px rgba(58,123,255,0.55)) drop-shadow(0 0 6px rgba(128,179,255,0.7))">${esc(c.title || 'CASA LUNA')}</div>
        <div id="hSubtitle" style="margin-top:5px;line-height:1;font-family:'Bahnschrift','Arial Narrow','Segoe UI',sans-serif;font-size:11.2px;font-weight:400;
          letter-spacing:4.8px;color:#a8cae6;text-align:center">ENERGY • AUTOMATION • SECURITY • by the Khan</div>
      </div>
    </div>`;

    /* sun arc + flow labels
       Arc v3.2: left arm FIXED at L(-29,161), right arm extended 10% → R(607,161)
       Peak raised to y=40. SVG viewBox widened to 630 to contain new right coords.
       Flow paths: battery→home (green/orange) + grid→home (cyan/orange) exact 60028 style. */
    const arc = `
    <svg id="arcLayer" viewBox="0 0 630 260" preserveAspectRatio="xMidYMid meet"
      style="position:absolute;left:252px;top:44px;width:1063px;height:260px;overflow:visible;background:none">
      <defs>
        <filter id="arcSunF" x="-150%" y="-150%" width="400%" height="400%"><feGaussianBlur stdDeviation="7"/></filter>
        <filter id="arcSunF2" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="3"/></filter>
        <filter id="moonF"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <linearGradient id="arcDayGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="rgba(255,200,70,.55)"/><stop offset="12%" stop-color="rgba(255,210,80,.75)"/><stop offset="50%" stop-color="rgba(255,228,110,.92)"/><stop offset="88%" stop-color="rgba(255,205,75,.6)"/><stop offset="100%" stop-color="rgba(255,180,50,.35)"/></linearGradient>
        <linearGradient id="arcNightGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="rgba(140,170,255,0)"/><stop offset="30%" stop-color="rgba(155,185,255,.20)"/><stop offset="50%" stop-color="rgba(200,215,255,.45)"/><stop offset="70%" stop-color="rgba(155,185,255,.20)"/><stop offset="100%" stop-color="rgba(140,170,255,0)"/></linearGradient>
        <radialGradient id="sunGlowG1" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="rgba(255,255,220,1)"/><stop offset="100%" stop-color="rgba(255,255,220,0)"/></radialGradient>
        <radialGradient id="sunGlowG2" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="rgba(255,240,160,1)"/><stop offset="100%" stop-color="rgba(255,240,160,0)"/></radialGradient>
        <radialGradient id="sunGlowG3" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="rgba(255,210,80,1)"/><stop offset="100%" stop-color="rgba(255,210,80,0)"/></radialGradient>
        <radialGradient id="sunGlowG4" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="rgba(255,170,30,1)"/><stop offset="100%" stop-color="rgba(255,170,30,0)"/></radialGradient>
        <radialGradient id="sunCoreGD" cx="50%" cy="38%" r="60%">
          <stop offset="0%"   stop-color="#ffffff"/>
          <stop offset="45%"  stop-color="#fffbe8"/>
          <stop offset="100%" stop-color="#ffe090"/>
        </radialGradient>
        <marker id="arrL" markerWidth="9" markerHeight="9" refX="2" refY="4.5" orient="auto"><path d="M9 1 L2 4.5 L9 8" fill="none" stroke="#22c3ff" stroke-width="1.6"/></marker>
        <marker id="arrR" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0 1 L7 4.5 L0 8" fill="none" stroke="#a6ff5a" stroke-width="1.6"/></marker>
        <!-- Flow arrow markers — exact 60028 style -->
        <marker id="fArrCyan"   markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto" markerUnits="strokeWidth"><path d="M0,.5 L0,4.5 L4.5,2.5 z" fill="#00f0ff"/></marker>
        <marker id="fArrGreen"  markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto" markerUnits="strokeWidth"><path d="M0,.5 L0,4.5 L4.5,2.5 z" fill="#39ff14"/></marker>
        <marker id="fArrOrange" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto" markerUnits="strokeWidth"><path d="M0,.5 L0,4.5 L4.5,2.5 z" fill="#e07800"/></marker>
      </defs>

      <!-- Day arc: L(-29,161) → Q(299,40) → R(607,161) — asymmetric: right arm 10% longer -->
      <path id="sunArcTrack" d="M -64,161 Q 289,40 607,161" fill="none" stroke="url(#arcDayGrad)" stroke-width="2.0" stroke-linecap="round"/>
      <!-- Night dashed arc -->
      <path id="sunArcNight" d="M 607,161 Q 289,40 -64,161" fill="none" stroke="url(#arcNightGrad)" stroke-width="1.5" stroke-dasharray="4,6" opacity=".35"/>

      <!-- Horizon line + endpoint dots -->
      <line x1="-56" y1="161" x2="596" y2="161" stroke="rgba(255,255,255,.18)" stroke-width="1" stroke-dasharray="4,9"/>
      <circle cx="-64" cy="161" r="4" fill="#f5c842"/>
      <circle cx="289" cy="161" r="3.5" fill="rgba(255,255,255,.30)"/>
      <circle cx="607" cy="161" r="4" fill="#e05030"/>

      <!-- rise/set labels -->
      <text id="tRise" x="-64"  y="182" font-size="14" font-weight="600" fill="#a8cae6" text-anchor="middle">--:--</text>
      <text id="tSet"  x="607"  y="182" font-size="14" font-weight="600" fill="#a8cae6" text-anchor="middle">--:--</text>
      <text x="289" y="182" font-size="14" fill="#a8cae6" text-anchor="middle">12:00</text>

      <!-- Sun glow stack — all layers move dynamically with elevation -->
      <g id="arcSunGroup" opacity="1">
        <circle id="sunL4" cx="289" cy="40" r="110" fill="url(#sunGlowG4)" opacity="0.10">
          <animate attributeName="r"       values="110;138;110"    dur="3.8s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.08;0.18;0.08" dur="3.8s" repeatCount="indefinite"/>
        </circle>
        <circle id="sunL3" cx="289" cy="40" r="70"  fill="url(#sunGlowG3)" opacity="0.18"/>
        <circle id="sunL2" cx="289" cy="40" r="42"  fill="url(#sunGlowG2)" opacity="0.32"/>
        <circle id="sunL1" cx="289" cy="40" r="24"  fill="url(#sunGlowG1)" opacity="0.70"/>
        <circle id="sunCore" cx="289" cy="40" r="14" fill="url(#sunCoreGD)"/>
      </g>

      <!-- Moon SVG group -->
      <g id="moonSvgGroup" opacity="0" transform="translate(289,161)">
        <g id="moonSvgInner" transform="scale(0.85)"></g>
      </g>

      <!-- PV animated flow wave double-buffer -->
      <g id="pvFlowGroupA" opacity="1"></g>
      <g id="pvFlowGroupB" opacity="0"></g>

      <!-- PV power bubble -->
      <g id="pvBubbleGroup" opacity="0">
        <path id="pvBubbleBg"
              d="M 0,28 L 0,13 A 13,13 0 0,1 13,0 L 91,0 A 13,13 0 0,1 104,13 L 104,15 A 13,13 0 0,1 91,28 Z"
              fill="rgba(10,10,10,0.20)" stroke="#ffe040" stroke-width="1.5"/>
        <text id="pvBubbleVal" x="52" y="19" text-anchor="middle"
              font-size="13" font-weight="650" fill="#ffe040">-- kW ⚡</text>
      </g>

      <!-- arc-side text labels for grid and load -->
    </svg>`;

    /* nav tiles — icon glow colour per tile (no badge background) */
    const NAV_GLOW = [
      '56,140,255',  /* dashboard — blue */
      '255,170,40',  /* energy — amber */
      '255,140,255', /* smart plugs — magenta */
      '60,210,90',   /* battery — green */
      '60,160,255',  /* climate — blue */
      '90,110,255',  /* security — indigo */
      '170,190,90',  /* automation — olive */
      '255,200,60',  /* lighting — amber */
      '170,190,90',  /* system — olive */
    ];
    const nav = NAV_VIEWS.map(([key, t, s, ik], i) => {
      const navH = Math.round(SL.nav.h * 0.9);      /* height -10% */
      const y = SL.nav.tops[i] + Math.round((SL.nav.h - navH) / 2); /* keep centre fixed */
      const g = NAV_GLOW[i];
      const txtL = 68;
      return `<div class="box tap navtile collapsible" data-view="${key}" data-i="${i}"
        style="left:${SL.nav.x}px;top:${y}px;width:${SL.nav.w}px;height:${navH}px;background:var(--cl-box-bg,rgba(0,0,0,.35));
        box-shadow:${glowShadow(g)};overflow:hidden">
        <div class="navFrontLayer">
          <div style="position:absolute;left:11px;top:${(navH-46)/2}px;width:46px;height:46px;
            display:flex;align-items:center;justify-content:center">${icon(ik, 39)}</div>
          <div style="position:absolute;left:${txtL}px;top:${navH/2-19}px;right:6px;overflow:hidden;
            font-size:15px;font-weight:700;letter-spacing:.04em;color:#cce4ff;
            font-family:'Segoe UI',Roboto,'Helvetica Neue',system-ui,sans-serif;white-space:nowrap;text-overflow:ellipsis">${this._t(t)}</div>
          <div style="position:absolute;left:${txtL}px;top:${navH/2+2}px;right:6px;overflow:hidden;
            font-size:12px;color:#a8cae6;font-family:'Segoe UI',Roboto,'Helvetica Neue',system-ui,sans-serif;
            white-space:nowrap;text-overflow:ellipsis">${this._t(s)}</div>
        </div>
      </div>`;
    }).join('');

    /* single master toggle: collapses/expands all 9 nav tiles together (icon-only ↔ full) */
    const _navH = Math.round(SL.nav.h * 0.9);
    const _navBtmY = SL.nav.tops[SL.nav.tops.length - 1] + Math.round((SL.nav.h - _navH) / 2) + _navH + 6;
    const navToggle = `<div id="navToggle" style="left:${SL.nav.x}px;top:${_navBtmY}px;width:${SL.nav.w}px;height:20px">
      <span id="navToggleIcon">\u25BE</span>
    </div>`;

    /* PV / PWR capsule bars — 3D shaded-cylinder blocks */
    const barHtml = (id, [x, y, w, h], label, col, n) => {
      const sx = 70;
      const pitch = (w - sx - 50) / n;
      const gap = 2.4;
      const blkW = pitch - gap;
      const blkH = Math.round((h - 14) * 0.9);
      const blkTop = Math.round((h - blkH) / 2);
      /* inactive cylinder: vertical gradient dark→light highlight→dark */
      const inactiveBg = 'linear-gradient(to bottom, rgba(255,255,255,.02) 0%, rgba(255,255,255,.07) 42%, rgba(255,255,255,.04) 60%, rgba(0,0,0,.30) 100%)';
      let segs = '';
      for (let k = 0; k < n; k++)
        segs += `<div class="seg-${id}" data-i="${k}" style="position:absolute;left:${sx + k*pitch}px;top:${blkTop}px;width:${blkW}px;height:${blkH}px;`
          + `border-radius:3px;background:${inactiveBg};transition:background .35s"></div>`;
      return `<div class="box" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:${h / 2}px;background:var(--cl-box-bg,rgba(0,0,0,.35))">
        <div class="val" style="position:absolute;left:24px;top:${h / 2 - 9}px;font-size:14px">${label}</div>${segs}
        <div class="val" id="${id}Pct" style="position:absolute;right:14px;top:${h / 2 - 9}px;font-size:14px">--%</div>
      </div>`;
    };

    /* stat tiles — match inverter 3-tile order: label (top) / icon (mid) / value (bottom) */
    const STAT_GLOW = ['56,140,255', '255,120,40', '60,210,90', '60,255,140'];
    const statDefs = [
      ['load', c.label_consump || c.label_load || 'LOAD', 'home'],
      ['gimp', c.label_grid_import_today || 'GRID IMP', 'plug'],
      ['gexp', c.label_grid_export_energy || 'GRID EXP', 'bolt'],
    ];
    const statRowCalc = (h) => ({ r1: Math.round(h * 1 / 6), r2: Math.round(h * 3 / 6), r3: Math.round(h * 5 / 6) });
    const stats = statDefs.map(([id, lbl, ik], k) => {
      const x = SL.stat.xs[k], { y, w, h } = SL.stat;
      const g = STAT_GLOW[k];
      const { r1, r2, r3 } = statRowCalc(h); const iconSz = 36;
      return `<div class="box tap stattile" data-stat="${id}"
        style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:transparent;box-shadow:${glowShadow(g)}">
        <div class="lbl" style="position:absolute;left:0;top:${r1 - 7}px;width:100%;text-align:center;font-size:${Number(c.sz_tile_label) || 11}px;letter-spacing:.05em">${esc(lbl)}</div>
        <div style="position:absolute;left:0;top:${r2 - iconSz / 2}px;width:100%;display:flex;justify-content:center;align-items:center">${icon(ik, iconSz)}</div>
        <div class="val val-fit" id="v_${id}" style="position:absolute;left:0;top:${r3 - 11}px;width:100%;text-align:center;font-size:${Number(c.sz_tile_value) || 21}px;padding:0 4px">--</div>
      </div>`;
    }).join('') +
    (() => {
      const x = SL.stat.xs[3], { y, w, h } = SL.stat, g = STAT_GLOW[3];
      const { r1, r2, r3 } = statRowCalc(h); const iconSz = 36;
      return `<div class="box tap stattile" data-stat="chgdis"
        style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:transparent;box-shadow:${glowShadow(g)}">
        <div class="lbl" style="position:absolute;left:0;top:${r1 - 7}px;width:100%;text-align:center;font-size:${Number(c.sz_tile_label) || 11}px;letter-spacing:.05em">${c.label_chg_dis ? esc(c.label_chg_dis) : 'CHG <span style="color:#7fa3c4">/ DIS</span>'}</div>
        <div style="position:absolute;left:0;top:${r2 - iconSz / 2}px;width:100%;display:flex;justify-content:center;align-items:center">${icon('batt', iconSz)}</div>
        <div style="position:absolute;left:0;top:${r3 - 11}px;width:100%;display:flex;justify-content:center;align-items:center;gap:6px">
          <div class="val val-fit" id="v_bchg" style="font-size:${Math.round((Number(c.sz_tile_value) || 21) * 0.68)}px;color:#7ce05a;max-width:45%;text-align:center">--</div>
          <div style="width:1px;height:16px;background:rgba(100,180,255,.35);flex-shrink:0"></div>
          <div class="val val-fit" id="v_bdis" style="font-size:${Math.round((Number(c.sz_tile_value) || 21) * 0.68)}px;color:#ffb45a;max-width:45%;text-align:center">--</div>
        </div>
      </div>`;
    })();

    /* stat container (behind 4 stat tiles) + lower two containers (inverter | donut+tiles) */
    const SC = SL.stat_cont;
    const IB = SL.inv_box, IR = SL.inv_right, DC = SL.donut_c;
    const statCont = `<div class="box" style="left:${SC[0]}px;top:${SC[1]}px;width:${SC[2]}px;height:${SC[3]}px;background:var(--cl-box-bg,rgba(0,0,0,.35))"></div>`;
    /* when the phase tile is hidden, the GOODWE box widens to absorb the vacated
       space instead of leaving a dead empty hole beside it. shift = how far the
       box's left edge moved; existing content (donut, labels) gets the same
       offset added so it stays anchored at its original screen position rather
       than jumping. */
    const irX = c._show_phase ? IR[0] : IB[0];
    const irShift = IR[0] - irX;
    const irW = IR[2] + irShift;
    const lower = `
    <div class="box flipcard" id="phaseFlip" style="left:${IB[0]}px;top:${IB[1]}px;width:${IB[2]}px;height:${IB[3]}px;background:var(--cl-box-bg,rgba(0,0,0,.35));perspective:800px;${c._show_phase ? "" : "display:none"}">
      <div class="flipinner" id="phaseFlipInner" style="position:absolute;inset:0;transition:transform .5s;transform-style:preserve-3d">
        <!-- FRONT: grid phases -->
        <div class="flipface" style="position:absolute;inset:0;backface-visibility:hidden;padding:0">
          <div class="val" style="position:absolute;left:14px;top:10px;font-size:15px" id="phaseTitle">${esc(c.label_phase_title || 'GRID PHASES')}</div>
          <div class="flipbtn" id="phaseFlipBtn" style="right:10px;top:10px">↻</div>
          <div style="position:absolute;left:14px;top:42px;font-size:10px;color:#a8cae6;letter-spacing:.04em">PWR<br><span style="font-size:8px;opacity:.7">kW</span></div>
          <div id="phaseRowP" style="position:absolute;left:54px;right:12px;top:40px;display:flex;gap:6px;justify-content:space-between;font-size:15px;font-weight:700;color:#eaf4ff"></div>
          <div style="position:absolute;left:14px;top:74px;font-size:10px;color:#a8cae6;letter-spacing:.04em">VOLT<br><span style="font-size:8px;opacity:.7">V</span></div>
          <div id="phaseRowV" style="position:absolute;left:54px;right:12px;top:72px;display:flex;gap:6px;justify-content:space-between;font-size:15px;font-weight:700;color:#a8cae6"></div>
        </div>
        <!-- BACK: inverter pwr/volt as 3-phase -->
        <div class="flipface" style="position:absolute;inset:0;backface-visibility:hidden;transform:rotateY(180deg);padding:0">
          <div class="val" style="position:absolute;left:14px;top:10px;font-size:15px">${esc(c.label_inv_title || 'INVERTER')}</div>
          <div class="flipbtn" id="phaseFlipBackBtn" style="right:10px;top:10px">↻</div>
          <div style="position:absolute;left:14px;top:42px;font-size:10px;color:#a8cae6;letter-spacing:.04em">PWR<br><span style="font-size:8px;opacity:.7">kW</span></div>
          <div id="invRowP" style="position:absolute;left:54px;right:12px;top:40px;display:flex;gap:6px;justify-content:space-between;font-size:15px;font-weight:700;color:#eaf4ff"></div>
          <div style="position:absolute;left:14px;top:74px;font-size:10px;color:#a8cae6;letter-spacing:.04em">VOLT<br><span style="font-size:8px;opacity:.7">V</span></div>
          <div id="invRowV" style="position:absolute;left:54px;right:12px;top:72px;display:flex;gap:6px;justify-content:space-between;font-size:15px;font-weight:700;color:#a8cae6"></div>
        </div>
      </div>
    </div>
    <div class="box" style="left:${irX}px;top:${IR[1]}px;width:${irW}px;height:${IR[3]}px;background:var(--cl-box-bg,rgba(0,0,0,.35))">
      ${!c._show_phase ? `
      <div style="position:absolute;left:10px;top:10px;width:${irShift - 20}px;height:${IR[3] - 20}px;border-radius:10px;
        background:rgba(20,40,70,.5);border:1px solid rgba(150,200,255,.25);padding:9px 11px;box-sizing:border-box;overflow:hidden">
        <div style="font-size:9.5px;color:#7fa3c4;letter-spacing:.05em">☰ ${this._t('EMS MODE')}</div>
        <div class="val val-fit" id="goodweEmsVal" style="font-size:18px;font-weight:800;color:#39d353;margin-top:6px">--</div>
        <div style="font-size:9px;color:#6f8aa6;letter-spacing:.04em;margin-top:8px">${this._t('OPERATION')}</div>
        <div class="val val-fit" id="goodweOpVal" style="font-size:12px;font-weight:650;color:#a8cae6;margin-top:2px">--</div>
      </div>` : ''}
      <svg style="position:absolute;left:${DC[0]-irX-10}px;top:${(IR[3]-115)/2}px;width:115px;height:115px" viewBox="0 0 115 115">
        ${(() => {
          const cx = 57.5, cy = 57.5, r = 44, sw = 6.1;
          const nBlk = 6, gapDeg = 12;
          const blkDeg = (360 / nBlk) - gapDeg;
          const polar = (ang) => { const a = (ang - 90) * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; };
          const arcPath = (startDeg, sweepDeg) => {
            const [x1, y1] = polar(startDeg); const [x2, y2] = polar(startDeg + sweepDeg);
            const large = sweepDeg > 180 ? 1 : 0;
            return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
          };
          let out = '';
          for (let i = 0; i < nBlk; i++) {
            const start = i * (360 / nBlk) + gapDeg / 2;
            out += `<path d="${arcPath(start, blkDeg)}" fill="none" stroke="rgba(255,255,255,.10)" stroke-width="${sw}" stroke-linecap="round"/>`;
            out += `<path id="donutBlk${i}" d="${arcPath(start, blkDeg)}" fill="none" stroke="#46e05a" stroke-width="${sw}" stroke-linecap="round" opacity="0"/>`;
          }
          return out;
        })()}
        <text x="57.5" y="48" font-size="14" fill="#a8cae6" text-anchor="middle">${this._t("INV LOAD")}</text>
        <text id="donutPct" x="57.5" y="80" font-size="${Number(c.sz_invload)||22}" font-weight="800" fill="#eaf4ff" text-anchor="middle">--%</text>
      </svg>
      <div class="val" style="position:absolute;left:${14+irShift}px;top:10px;font-size:10px">${esc(c.inverter_name || 'GOODWE')}</div>
      <div style="position:absolute;left:${14+irShift}px;bottom:6px;width:162px;display:flex;justify-content:space-between;align-items:baseline;gap:8px">
        <span id="invStatus" style="font-size:11px;color:#a8cae6;white-space:nowrap">--</span>
        <span id="invErr" style="font-size:11px;color:#46e05a;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis"></span>
      </div>
    </div>`;

    const invTileDefs = [
      { id:'itImp', tsKey:'imp', label: c.label_total_imp || this._t('TOTAL IMP'), ik:'plug',  col:'#ffb45a' },
      { id:'itExp', tsKey:'exp', label: c.label_total_exp || this._t('TOTAL EXP'), ik:'bolt',  col:'#7ce05a' },
      { id:'itPv',  tsKey:'pv',  label: c.label_total_pv  || this._t('TOTAL PV'),  ik:'sun',   col:'#ffd24a' },
    ];
    /* label / icon / value — three rows, vertically equal-spaced; bigger icon */
    const invTiles = invTileDefs.map((td, k) => {
      const x = SL.invt.xs[k], { y, w, h } = SL.invt;
      const iconSz = 43;
      /* equal thirds: row centres at h*1/6, h*3/6, h*5/6 */
      const row1 = Math.round(h * 1/6);   // label centre
      const row2 = Math.round(h * 3/6);   // icon centre
      const row3 = Math.round(h * 5/6);   // value centre
      const ent = this._tileState(td.tsKey).entity || '';
      return `<div class="box${ent ? ' tap' : ''}" ${ent ? `data-entity="${esc(ent)}"` : ''} style="left:${x}px;top:${y}px;width:${w}px;height:${h}px">
        <div class="lbl" id="itLbl${k}" style="position:absolute;left:4px;right:4px;top:${row1-7}px;text-align:center;font-size:11px;letter-spacing:.05em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(td.label)}</div>
        <div style="position:absolute;left:0;top:${row2-iconSz/2}px;width:100%;display:flex;justify-content:center;align-items:center">${icon(td.ik, iconSz)}</div>
        <div class="val val-fit" id="${td.id}" style="position:absolute;left:0;top:${row3-9}px;width:100%;text-align:center;font-size:${Number(c.sz_totals_value)||16}px;color:${td.col};padding:0 4px">--</div>
      </div>`;
    }).join('');

    /* —— production box: chart + 2 inline rows (PV PWR / PV VOLT), dynamic string count —— */
    /* ── collapsible tile: front layer (existing content + a small "collapse"
       button) and a tab layer (vertical label, tap to expand). The outer .box
       itself animates left/width (right edge anchored) via _setCollapsed. ── */
    const collapsibleInner = (tileId, frontHtml, label, col, btnPos) => `
      <div class="tileFrontLayer">
        ${frontHtml}
        <div class="collapseBtn" data-collapse="${tileId}" style="${btnPos}">\u203a</div>
      </div>
      <div class="tileTabLayer" data-expand="${tileId}">
        <div class="tabChevIcon">\u2039</div>
        <div class="tileTabLbl" style="color:${col}">${esc(label)}</div>
      </div>`;

    const prodBox = ([x, y, w, h]) => {
      const col = '#7ce05a';
      const chartH = h - 38;
      const front = `<div class="val" style="position:absolute;left:14px;top:10px;font-size:14px">${c.label_today_production || this._t("TODAY'S PRODUCTION")}</div>
        <div class="val val-fit" id="prTotal" style="position:absolute;right:14px;top:10px;max-width:150px;text-align:right;font-size:${Number(c.sz_prodcons_total)||15}px;color:${col}">--</div>
        <div class="well" style="position:absolute;left:12px;top:32px;width:${w - 24}px;height:${chartH}px"></div>
        <svg id="prChart" style="position:absolute;left:12px;top:32px;width:${w - 24}px;height:${chartH}px">
          <defs><linearGradient id="prFillGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${col}" stop-opacity="0.55"/>
            <stop offset="100%" stop-color="${col}" stop-opacity="0"/></linearGradient></defs>
          <path class="fill" fill="url(#prFillGrad)" stroke="none"/>
          <path fill="none" stroke="${col}" stroke-width="2"/></svg>`;
      return `<div class="box collapsible" data-collapse-id="prod" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;overflow:hidden;background:var(--cl-box-bg,rgba(0,0,0,.35))">
        ${collapsibleInner('prod', front, 'PROD', col, 'bottom:8px;right:8px')}
      </div>`;
    };
    const prod = prodBox(SL.r_prod);
    /* PV PWR tile (single row) — above consumption; tap → custom voltage popup */
    const pvTileBox = (() => {
      const [px, py, pw, ph] = SL.r_pvtile;
      const pvIds = [c.pv1_power, c.pv2_power, c.pv3_power, c.pv4_power, c.pv5_power, c.pv6_power];
      let rawActive = 0; const maxStrings = c._show_pv_extra ? 6 : 2;
      for (let i = 0; i < maxStrings; i++) if (pvIds[i] && this._stateObj(pvIds[i])) rawActive = i + 1;
      /* hide-when-empty: no PV string configured at all → drop the tile entirely;
         also respects the explicit show/hide toggle even when entities ARE set */
      if (rawActive === 0 || c._show_pvtile === false) return '';
      const nActive = Math.max(1, rawActive);
      const labelW = 64, slotW = (pw - 24 - labelW) / nActive;
      const rowH = ph / 2;
      const row = (rowLabel, idPrefix, col, topY) => {
        let h = `<div style="position:absolute;left:13px;top:${topY}px;height:${rowH}px;display:flex;align-items:center;font-size:10px;color:#a8cae6;letter-spacing:.04em;text-transform:uppercase">${rowLabel}</div>`;
        for (let i = 0; i < nActive; i++) {
          const sx = 13 + labelW + i * slotW;
          h += `<div id="${idPrefix}${i}" style="position:absolute;left:${sx}px;width:${slotW}px;top:${topY}px;height:${rowH}px;display:flex;align-items:center;justify-content:center;font-size:${Number(c.sz_pvtile)||14}px;font-weight:700;color:${col}">--</div>`;
        }
        return h;
      };
      const rows = row('PV PWR', 'prPc', '#ffd24a', 0) + row('PV VOLT', 'prVc', '#a8cae6', rowH);
      return `<div class="box collapsible" data-collapse-id="pv" id="pvPwrTile" style="left:${px}px;top:${py}px;width:${pw}px;height:${ph}px;overflow:hidden;background:var(--cl-box-bg,rgba(0,0,0,.35))">
        ${collapsibleInner('pv', rows, 'PV', '#ffd24a', 'top:4px;right:4px')}
      </div>`;
    })();
    /* Today's consumption: graph-only */
    const consBox = ([x, y, w, h]) => {
      const col = '#46bcff';
      const chartH = h - 38;
      const front = `<div class="val" style="position:absolute;left:14px;top:10px;font-size:14px">${c.label_today_consumption || this._t("TODAY'S CONSUMPTION")}</div>
        <div class="val val-fit" id="cnTotal" style="position:absolute;right:14px;top:10px;max-width:150px;text-align:right;font-size:${Number(c.sz_prodcons_total)||15}px;color:${col}">--</div>
        <div class="well" style="position:absolute;left:12px;top:32px;width:${w-24}px;height:${chartH}px"></div>
        <svg id="cnChart" style="position:absolute;left:12px;top:32px;width:${w-24}px;height:${chartH}px">
          <defs><linearGradient id="cnFillGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${col}" stop-opacity="0.55"/>
            <stop offset="100%" stop-color="${col}" stop-opacity="0"/></linearGradient></defs>
          <path class="fill" fill="url(#cnFillGrad)" stroke="none"/>
          <path fill="none" stroke="${col}" stroke-width="2"/></svg>`;
      return `<div class="box collapsible" data-collapse-id="cons" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;overflow:hidden;background:var(--cl-box-bg,rgba(0,0,0,.35))">
        ${collapsibleInner('cons', front, 'HOME', col, 'bottom:8px;right:8px')}
      </div>`;
    };
    const cons = consBox(SL.r_cons);
    const [ex0, ey0, ew0, eh0] = SL.r_events;
    const eventsFront = `<div class="val" style="position:absolute;left:14px;top:11px;font-size:14px">${this._t('RECENT EVENTS')}</div>
      <div id="evRows" style="position:absolute;left:0;top:34px;right:0;bottom:8px;overflow-y:auto"></div>`;
    const events = `
    <div class="box collapsible" data-collapse-id="events" style="left:${ex0}px;top:${ey0}px;width:${ew0}px;height:${eh0}px;overflow:hidden;background:var(--cl-box-bg,rgba(0,0,0,.35))">
      ${collapsibleInner('events', eventsFront, 'EVENT', '#7fd4ff', 'top:8px;right:8px')}
    </div>`;

    /* bottom strip from _extra_tile_N — skip disabled tiles, compact the rest left */
    const bottom = [1,2,3,4,5,6]
      .filter(n => c[`_extra_tile_${n}_enabled`] !== false)
      .map((n, k) => {
      const x = SL.bot.xs[k], { y, w, h } = SL.bot;
      const lbl = c[`_extra_tile_${n}_label`] || `TILE ${n}`;
      const ikName = c[`_extra_tile_${n}_icon`];
      const ik  = ICONS[ikName] ? ikName : 'gear';
      /* fan/bulb/plug use room-card animated SVGs (currentColor-driven) */
      const iconHtml = RC_ICONS[ikName] ? `<span style="color:#7a8694;display:flex">${rcIcon(ikName, 31)}</span>` : icon(ik, 31);
      return `<div class="box tap bottile" id="bottile${n}" data-n="${n}"
        style="left:${x}px;top:${y}px;width:${w}px;height:${h}px">
        <div id="btIcon${n}" style="position:absolute;left:8px;top:10px;width:46px;height:${h - 20}px;display:flex;align-items:center;justify-content:center">${iconHtml}</div>
        <div class="val" id="btLbl${n}" style="position:absolute;left:60px;right:8px;top:13px;font-size:${Number(c.sz_bottile_label)||12}px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(lbl).toUpperCase()}</div>
        <div class="val val-fit" id="bt${n}" style="position:absolute;left:60px;right:8px;top:35px;font-size:${Number(c.sz_bottile_value)||15}px;color:#7fd4ff">--</div>
      </div>`;
    }).join('');

    /* detail view overlay (center) */
    const detail = `<div class="detail" id="detailPanel">
      <span class="dclose" id="detailClose">✕</span>
      <div class="detail-inner" id="detailInner"></div></div>`;

    const [mx, my, mw, mh] = SL.r_mode;
    const mode = `
    <div id="statusIcons"></div>
    <div class="box" style="left:${mx}px;top:${my}px;width:${mw}px;height:${mh}px">
      <div class="lbl" style="position:absolute;left:16px;top:11px">MODE</div>
      <div class="val" id="modeVal" style="position:absolute;left:16px;top:33px;font-size:${Number(c.sz_mode) || 17}px;color:#22c3ff">--</div>
      <div style="position:absolute;left:14px;right:14px;top:66px;height:1px;background:rgba(150,200,255,.18)"></div>
      <div style="position:absolute;left:16px;right:14px;top:76px;display:flex;align-items:center;justify-content:space-between;gap:4px">
        <span id="invStateLbl" style="font-size:11px;color:#7fa3c4;text-transform:uppercase;letter-spacing:.05em;white-space:nowrap">${esc(c.label_inverter_state || 'INV STATE')}</span>
        <span class="val" id="invState" data-entity="${c.inverter_state || ''}" style="font-size:${Number(c.sz_invstate) || 13}px;font-weight:650;color:#39d353;text-align:right;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">--</span>
      </div>
    </div>`;
    const [cx0, cy0, cw0, ch0] = SL.r_cyl;
    const cylinder = `
    <div class="box" style="left:${cx0}px;top:${cy0}px;width:${cw0}px;height:${ch0}px;overflow:hidden">
      <svg viewBox="34 118 100 168" width="${cw0}" height="${ch0}" preserveAspectRatio="xMidYMid meet" style="display:block;position:absolute;inset:0">
        <defs>
          <linearGradient id="battCapGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#050505"/><stop offset="15%" stop-color="#2a2a2c"/><stop offset="30%" stop-color="#6b6d73"/><stop offset="42%" stop-color="#d4d6db"/><stop offset="48%" stop-color="#ffffff"/><stop offset="54%" stop-color="#d4d6db"/><stop offset="70%" stop-color="#404247"/><stop offset="88%" stop-color="#0f0f12"/><stop offset="100%" stop-color="#000000"/></linearGradient>
          <linearGradient id="battDarkGroove" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#000000"/><stop offset="20%" stop-color="#111114"/><stop offset="50%" stop-color="#222226"/><stop offset="80%" stop-color="#111114"/><stop offset="100%" stop-color="#000000"/></linearGradient>
          <linearGradient id="battLiquidBlue" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#00081c"/><stop offset="12%" stop-color="#001a5e"/><stop offset="35%" stop-color="#004be8"/><stop offset="50%" stop-color="#0066ff"/><stop offset="65%" stop-color="#004be8"/><stop offset="88%" stop-color="#00103d"/><stop offset="100%" stop-color="#00040f"/></linearGradient>
          <linearGradient id="battGlassReflect" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="rgba(0,5,15,0.55)"/><stop offset="7%" stop-color="rgba(180,210,245,0.25)"/><stop offset="13%" stop-color="rgba(220,238,255,0.40)"/><stop offset="20%" stop-color="rgba(255,255,255,0.06)"/><stop offset="50%" stop-color="rgba(255,255,255,0.0)"/><stop offset="82%" stop-color="rgba(255,255,255,0.0)"/><stop offset="90%" stop-color="rgba(180,210,245,0.14)"/><stop offset="96%" stop-color="rgba(0,10,30,0.30)"/><stop offset="100%" stop-color="rgba(0,5,15,0.55)"/></linearGradient>
          <linearGradient id="battFillHighlight" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="rgba(255,255,255,0.0)"/><stop offset="14%" stop-color="rgba(255,255,255,0.55)"/><stop offset="22%" stop-color="rgba(255,255,255,0.1)"/><stop offset="80%" stop-color="rgba(255,255,255,0.0)"/><stop offset="92%" stop-color="rgba(255,255,255,0.25)"/><stop offset="100%" stop-color="rgba(255,255,255,0.0)"/></linearGradient>
          <clipPath id="battBodyClip"><path d="M 55,135 L 55,268 A 29,3.5 0 0 0 113,268 L 113,135 Z"/></clipPath>
          <clipPath id="battBodyClipLeft"><path d="M 55,135 L 55,268 A 29,3.5 0 0 0 84,271.5 L 84,135 Z"/></clipPath>
          <clipPath id="battBodyClipRight"><path d="M 84,135 L 84,271.5 A 29,3.5 0 0 0 113,268 L 113,135 Z"/></clipPath>
          <filter id="battGlowRed"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <filter id="battGlowOrange"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <filter id="battGlowCyan"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <filter id="battGlowBolt"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <filter id="iconGlowBlue" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10" result="b"/><feFlood flood-color="rgba(30,144,255,0.6)" result="c"/><feComposite in="c" in2="b" operator="in" result="d"/><feMerge><feMergeNode in="d"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <filter id="softTextShadow"><feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="#000000" flood-opacity="0.8"/></filter>
        </defs>
        <g id="battIconWrap">
          <!-- glass inner background -->
          <path d="M 55,135 L 55,268 A 29,3.5 0 0 0 113,268 L 113,135 Z" fill="#000208"/>
          ${c._show_battery2 ? `
          <!-- dual fills (behind glass) -->
          <rect id="battFillBar1" x="55" y="269" width="29.5" height="0" fill="#0066ff" clip-path="url(#battBodyClipLeft)"/>
          <rect id="battFillHL1"  x="55" y="269" width="29.5" height="0" fill="url(#battFillHighlight)" clip-path="url(#battBodyClipLeft)" style="pointer-events:none"/>
          <rect id="battFillBar2" x="84" y="269" width="29.5" height="0" fill="#0066ff" clip-path="url(#battBodyClipRight)"/>
          <rect id="battFillHL2"  x="84" y="269" width="29.5" height="0" fill="url(#battFillHighlight)" clip-path="url(#battBodyClipRight)" style="pointer-events:none"/>
          ` : `
          <!-- single fill (behind glass) -->
          <rect id="battFillBar" x="55" y="269" width="58" height="0" fill="#0066ff" clip-path="url(#battBodyClip)"/>
          <rect id="battFillHL"  x="55" y="269" width="58" height="0" fill="url(#battFillHighlight)" clip-path="url(#battBodyClip)" style="pointer-events:none"/>
          `}
          <!-- glass reflection over liquid -->
          <path d="M 51,135 L 51,269 A 33,4 0 0 0 117,269 L 117,135 Z" fill="url(#battGlassReflect)" style="pointer-events:none"/>
          <!-- top cap assembly (nub + cap + lower collar), drawn on top -->
          <path d="M 73,119 A 11,2 0 0 0 95,119 L 95,125 A 11,2 0 0 1 73,125 Z" fill="url(#battCapGrad)"/>
          <path d="M 75,123 A 9,1.5 0 0 0 93,123 L 93,126 A 9,1.5 0 0 1 75,126 Z" fill="url(#battDarkGroove)"/>
          <path d="M 51,126 A 33,4 0 0 0 117,126 L 117,134 A 33,4 0 0 1 51,134 Z" fill="url(#battCapGrad)"/>
          <path d="M 51,133 A 33,4 0 0 0 117,133 L 117,136 A 33,4 0 0 1 51,136 Z" fill="url(#battDarkGroove)"/>
          <path d="M 51,135 A 33,4 0 0 0 117,135 L 117,140 A 33,4 0 0 1 51,140 Z" fill="url(#battCapGrad)"/>
          <path d="M 51,139 A 33,4 0 0 0 117,139 L 117,141.5 A 33,4 0 0 1 51,141.5 Z" fill="url(#battDarkGroove)"/>
          <!-- bottom base assembly -->
          <path d="M 51,269 A 33,4 0 0 0 117,269 L 117,272 A 33,4 0 0 1 51,272 Z" fill="url(#battCapGrad)"/>
          <path d="M 51,271 A 33,4 0 0 0 117,271 L 117,274 A 33,4 0 0 1 51,274 Z" fill="url(#battDarkGroove)"/>
          <path d="M 51,273 A 33,4 0 0 0 117,273 L 117,284 A 33,4 0 0 1 51,284 Z" fill="url(#battCapGrad)"/>
          <path d="M 54,284 A 30,3 0 0 0 114,284 L 114,287 A 30,3 0 0 1 54,287 Z" fill="url(#battDarkGroove)"/>
          ${c._show_battery2 ? `
          <g id="battBoltGroup1" opacity="0"><polygon points="70,170 62,189 68,189 64,209 76,187 70,187 78,170" fill="#1a9fff" stroke="rgba(100,200,255,.6)" stroke-width="0.8" filter="url(#battGlowBolt)"><animate attributeName="opacity" values="0.5;1;0.5" dur="1.0s" repeatCount="indefinite"/></polygon></g>
          <g id="battBoltGroup2" opacity="0"><polygon points="102,170 94,189 100,189 96,209 108,187 102,187 110,170" fill="#1a9fff" stroke="rgba(100,200,255,.6)" stroke-width="0.8" filter="url(#battGlowBolt)"><animate attributeName="opacity" values="0.5;1;0.5" dur="1.0s" repeatCount="indefinite"/></polygon></g>
          <text id="cylPct1" x="68"  y="210" text-anchor="middle" font-family="'Segoe UI',Roboto,sans-serif" font-size="15" font-weight="700" fill="#fff" filter="url(#softTextShadow)">--%</text>
          <text id="cylPct2" x="100" y="210" text-anchor="middle" font-family="'Segoe UI',Roboto,sans-serif" font-size="15" font-weight="700" fill="#fff" filter="url(#softTextShadow)">--%</text>
          ` : `
          <g id="battBoltGroup" opacity="0">
            <polygon points="86,170 74,196 82,196 77,224 95,194 85,194 98,170" fill="#1a9fff" stroke="rgba(100,200,255,.6)" stroke-width="0.8" filter="url(#battGlowBolt)">
              <animate attributeName="opacity" values="0.5;1;0.5" dur="1.0s" repeatCount="indefinite"/>
            </polygon>
          </g>
          <text id="cylPct" x="84" y="211" text-anchor="middle" font-family="'Segoe UI',Roboto,sans-serif" font-size="${Number(c.sz_soc) || 21}" font-weight="600" fill="#ffffff" filter="url(#softTextShadow)">--%</text>
          `}
        </g>
      </svg>
    </div>`;
    const [sx0, sy0, sw0, sh0] = SL.r_stats;
    /* inline rows: label left, value right end-aligned; BATT CHG/DIS added before endurance */
    const statRowDefs = [
      ['bCtmp', c.label_cell_temp || 'Cell Temp', '#ffb45a', c.battery_temp1],
      ['bBms',  c.label_bms_temp || 'BMS Temp',   '#ffb45a', c.battery_mos],
      ['bCv',   c.label_cell_volt || 'Cell Volt', '#7ce05a', c.battery_min_cell],
      ['bCur',  c.label_batt_current || 'BATT CURRENT', '#d8eeff', c.battery_current],
      ['bC',    c.label_capacity || 'CAPACITY',         '#d8eeff', null],
      ['bE',    c.label_endurance || 'Endurance', '#d8eeff', null],
    ];
    const headH = 22;
    const rowH = (sh0 - headH - 8) / statRowDefs.length;
    const statRows = statRowDefs.map(([id, l, vc, ent], k) => {
      const rowTop = headH + k * rowH;
      const midY = rowTop + rowH / 2;
      const tap = ent ? ` data-entity="${ent}"` : '';
      /* bCtmp/bCv can show "X | Y unit" (dual temp sensors / min|max cell volt) — the only
         2 of the 6 rows where content can outgrow the fixed-width value column. Smaller
         font here avoids the ellipsis-clipping seen in longer-label languages. */
      const baseSz = Number(c.sz_batbox_value) || 17;
      const baseLblSz = Number(c.sz_batbox_label) || 12;
      const dualRow = id === 'bCtmp' || id === 'bCv';
      const lblSz = dualRow ? Math.max(9, baseLblSz - 2) : baseLblSz;
      const valSz = dualRow ? Math.max(11, baseSz - 5) : baseSz;
      return `<div${tap} style="position:absolute;left:16px;right:14px;top:${midY - 9}px;display:flex;align-items:baseline;justify-content:space-between;gap:8px">
        <span id="${id}Lbl" style="font-size:${lblSz}px;color:#a8cae6;white-space:nowrap;flex-shrink:0">${esc(l)}</span>
        <span class="val" id="${id}" style="font-size:${valSz}px;color:${vc};text-align:right;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">--</span>
      </div>`;
    }).join('');
    const battStats = `
    <div class="box" id="battFlip" style="left:${sx0}px;top:${sy0}px;width:${sw0}px;height:${sh0}px;${c._show_battstats ? "" : "display:none"}">
      <!-- FRONT: full battery stat rows -->
      <div id="battFaceFront" style="position:absolute;inset:0">
        <div class="flipbtn" id="battFlipBtn" style="right:10px;top:8px">↻</div>
        ${statRows}
      </div>
      <!-- BACK: 6 PV strings (power + volt) -->
      <div id="battFaceBack" style="position:absolute;inset:0;display:none">
        <div class="flipbtn" id="battFlipBackBtn" style="right:10px;top:8px">↻</div>
        <div class="val" style="position:absolute;left:16px;top:10px;font-size:15px;letter-spacing:.05em">PV</div>
        <div style="position:absolute;left:16px;right:14px;top:38px;bottom:8px;display:flex;flex-direction:column;justify-content:space-around">
          ${[1, 2, 3, 4, 5, 6].map(n =>
            `<div style="display:flex;align-items:center;justify-content:space-between;gap:6px">
               <div style="font-size:12px;color:#a8cae6;letter-spacing:.03em;width:38px">PV${n}</div>
               <div class="val" id="bPV${n}P" style="font-size:14px;font-weight:700;color:#ffd24a;text-align:right;flex:1">--</div>
               <div class="val" id="bPV${n}V" style="font-size:14px;font-weight:700;color:#a8cae6;text-align:right;width:62px">--</div>
             </div>`).join('')}
        </div>
      </div>
    </div>`;

    /* ── Battery + Pole flow lines (card coords 1500×1000)
       H dash=13.5px gap=6px → H_CYC=19.5px
       V dash=4px    gap=6px → V_CYC=10px

       BATTERY A(1113,321) → left 11 H-dots (215px) → corner → down 6 V-dots (60px) → C(898,381)
         Arrow at C: one dash LEFT ◄

       POLE: starts at gridW card x = arcSVG_left + gridW_svgX × scale
             Arc SVG left=170, viewBox=630, width=1045 → scale=1045/630=1.6587
             gridW SVG x=-35 → card 112 (arc left endpoint)
             BUT "0 W" visual position in card ≈ 300px (user "move right")
             Use card x=300 = SVG x=(300-170)/1.6587 = 78 → verified ~299 card px
       POLE P(300,321) → right 16 H-dots (312px) → corner → down 6 V-dots (60px) → R(612,381)
         Arrow at R: one dash RIGHT ►
         Colour: khan-skycard exactly — importing=#e07800 orange, exporting=#39ff14 green
    */
    const A_Y    = SL.r_stats[1] + 38 + 3 * 46 + 9 + 20;  // 341 (base)
    const H_DASH = 13.5, H_GAP = 6, H_CYC = H_DASH + H_GAP;  // 19.5
    const V_DASH = 4,    V_GAP = 6, V_CYC = V_DASH + V_GAP;  // 10
    const CR     = 15;
    const BATT_Y = A_Y + 10;    // battery flow line pulled down 10px
    const POLE_Y = A_Y + 45;    // grid flow line (pulled down 45px)

    // ───── Battery flow A→B→C→D (right→left, mirrored step) ─────
    // A (battery edge) → H left → B → round down → V → C → round left → D(arrow)
    const BATT_A_X   = SL.r_cyl[0];                      // 1113 (A, battery edge) — no dash deletion
    const BATT_H_LEN = Math.round(12 * H_CYC);           // 12 H-dashes
    const BATT_B_X   = BATT_A_X - BATT_H_LEN;            // B corner x
    const BATT_V_LEN = Math.round(5 * V_CYC);            // B→C vertical: 5 dashes
    const BATT_C_Y   = BATT_Y + CR + BATT_V_LEN;         // C (after bend + 5 dashes)
    const BATT_D_LEN = Math.round(2 * H_CYC);            // C→D horizontal: 2 dashes (toward house = left)
    const BATT_D_X   = BATT_B_X - CR - BATT_D_LEN;       // D end x
    // A→B horizontal + rounded bend down
    const battH      = `M ${BATT_A_X},${BATT_Y} H ${BATT_B_X + CR} a ${CR},${CR} 0 0 0 -${CR},${CR}`;
    // B→C vertical (5 dashes)
    const battV      = `M ${BATT_B_X},${BATT_Y + CR} V ${BATT_C_Y}`;
    // C→D rounded turn left + horizontal (2 dashes)
    const battD      = `M ${BATT_B_X},${BATT_C_Y} a ${CR},${CR} 0 0 1 -${CR},${CR} H ${BATT_D_X}`;
    const BATT_D_Y   = BATT_C_Y + CR;

    // ───── Pole/grid flow A→B→C→D (left→right step) ─────
    // A stays; delete 3.5 dashes from A→B middle → B (and C,D) move left. Whole line pulled down 60px.
    const POLE_P_X   = 300 + Math.round(5 * H_CYC) - 40; // A start, moved 40px left total
    const POLE_H_LEN = Math.round((11 - 3) * H_CYC);     // A→B top run (cut 0.5 dash from start)
    const POLE_Q_X   = POLE_P_X + POLE_H_LEN;            // B corner x (moved left)
    const POLE_V_LEN = Math.round(5 * V_CYC);            // B→C vertical: 5 dashes
    const POLE_C_Y   = POLE_Y + CR + POLE_V_LEN;         // C (after bend + 5 dashes)
    const POLE_D_LEN = Math.round(2 * H_CYC);            // C→D horizontal: 2 dashes (right)
    const POLE_D_X   = POLE_Q_X + CR + POLE_D_LEN;       // D end x (moved left with B)
    const poleH      = `M ${POLE_P_X},${POLE_Y} H ${POLE_Q_X - CR} a ${CR},${CR} 0 0 1 ${CR},${CR}`;
    const poleV      = `M ${POLE_Q_X},${POLE_Y + CR} V ${POLE_C_Y}`;
    // C→D rounded turn right + horizontal (2 dashes)
    const poleD      = `M ${POLE_Q_X},${POLE_C_Y} a ${CR},${CR} 0 0 0 ${CR},${CR} H ${POLE_D_X}`;
    const POLE_D_Y   = POLE_C_Y + CR;

    /* flow-line labels (moved here from arc SVG) — card coords, hugging each line near A end.
       power above the A→B run, volt below. */
    const flowLabels = `
      <text id="gridW" x="${POLE_P_X + 11}" y="${POLE_Y - 9}" font-size="${Number(c.sz_flow_power) || 16}" font-weight="700" fill="#eaf4ff">--</text>
      <text id="gridVolt" x="${POLE_P_X + 11}" y="${POLE_Y + 20}" font-size="${Number(c.sz_flow_volt) || 13}" font-weight="600" fill="#a8cae6">--</text>
      <text id="loadW" x="${BATT_A_X - 13}" y="${BATT_Y - 9}" font-size="${Number(c.sz_flow_power) || 16}" font-weight="700" fill="#a6ff5a" text-anchor="end">--</text>
      <text id="battVolt" x="${BATT_A_X - 13}" y="${BATT_Y + 20}" font-size="${Number(c.sz_flow_volt) || 13}" font-weight="600" fill="#a8cae6" text-anchor="end">--</text>`;

    const flowOverlay = `
    <svg id="flowOverlay" style="position:absolute;left:0;top:0;width:${VB_W}px;height:1000px;overflow:visible;pointer-events:none;z-index:2">
      <defs>
        <!-- No SVG markers needed — arrows drawn as explicit paths -->
      </defs>

      <!-- ── BATTERY H segment (right→left + corner) ── -->
      <path id="battHGlow" d="${battH}" fill="none" stroke="rgba(57,255,20,0.22)" stroke-width="4"
        stroke-linecap="round" stroke-dasharray="${H_DASH} ${H_GAP}" opacity="0">
        <animate attributeName="stroke-dashoffset" from="${H_CYC}" to="0" dur="1.8s" repeatCount="indefinite" calcMode="linear"/>
      </path>
      <path id="battHCore" d="${battH}" fill="none" stroke="#39ff14" stroke-width="2.5"
        stroke-linecap="round" stroke-dasharray="${H_DASH} ${H_GAP}" opacity="0">
        <animate attributeName="stroke-dashoffset" from="${H_CYC}" to="0" dur="1.8s" repeatCount="indefinite" calcMode="linear"/>
      </path>

      <!-- ── BATTERY V segment (down) ── -->
      <path id="battVGlow" d="${battV}" fill="none" stroke="rgba(57,255,20,0.22)" stroke-width="4"
        stroke-linecap="round" stroke-dasharray="${V_DASH} ${V_GAP}" opacity="0">
        <animate attributeName="stroke-dashoffset" from="${V_CYC}" to="0" dur="1.8s" repeatCount="indefinite" calcMode="linear"/>
      </path>
      <path id="battVCore" d="${battV}" fill="none" stroke="#39ff14" stroke-width="2.5"
        stroke-linecap="round" stroke-dasharray="${V_DASH} ${V_GAP}" opacity="0">
        <animate attributeName="stroke-dashoffset" from="${V_CYC}" to="0" dur="1.8s" repeatCount="indefinite" calcMode="linear"/>
      </path>

      <!-- ── BATTERY D segment (round left + horizontal, 2 dashes) ── -->
      <path id="battDGlow" d="${battD}" fill="none" stroke="rgba(57,255,20,0.22)" stroke-width="4"
        stroke-linecap="round" stroke-dasharray="${H_DASH} ${H_GAP}" opacity="0">
        <animate attributeName="stroke-dashoffset" from="${H_CYC}" to="0" dur="1.8s" repeatCount="indefinite" calcMode="linear"/>
      </path>
      <path id="battDCore" d="${battD}" fill="none" stroke="#39ff14" stroke-width="2.5"
        stroke-linecap="round" stroke-dasharray="${H_DASH} ${H_GAP}" opacity="0">
        <animate attributeName="stroke-dashoffset" from="${H_CYC}" to="0" dur="1.8s" repeatCount="indefinite" calcMode="linear"/>
      </path>

      <!-- ── BATTERY arrow at D end — discharging points LEFT ◄ (toward house) ── -->
      <path id="battArrD"
        d="M ${BATT_D_X + 7},${BATT_D_Y - 5} L ${BATT_D_X},${BATT_D_Y} L ${BATT_D_X + 7},${BATT_D_Y + 5}"
        fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" opacity="0"/>
      <!-- ── BATTERY arrow at A end — charging points RIGHT ► into battery ── -->
      <path id="battArrA"
        d="M ${BATT_A_X - 7},${BATT_Y - 5} L ${BATT_A_X},${BATT_Y} L ${BATT_A_X - 7},${BATT_Y + 5}"
        fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" opacity="0"/>

      <!-- ── POLE H segment (left→right + corner)
           Skip 3 leading dashes: animate dashoffset from (4×H_CYC) to (3×H_CYC)
           so first 3 cycles of the path appear as gaps, flow travels rightward ── -->
      <path id="poleHGlow" d="${poleH}" fill="none" stroke="rgba(224,120,0,0.22)" stroke-width="4"
        stroke-linecap="round" stroke-dasharray="${H_DASH} ${H_GAP}" opacity="0">
        <animate attributeName="stroke-dashoffset" from="${4*H_CYC}" to="${3*H_CYC}" dur="1.4s" repeatCount="indefinite" calcMode="linear"/>
      </path>
      <path id="poleHCore" d="${poleH}" fill="none" stroke="#e07800" stroke-width="2.5"
        stroke-linecap="round" stroke-dasharray="${H_DASH} ${H_GAP}" opacity="0">
        <animate attributeName="stroke-dashoffset" from="${4*H_CYC}" to="${3*H_CYC}" dur="1.4s" repeatCount="indefinite" calcMode="linear"/>
      </path>

      <!-- ── POLE V segment (down) ── -->
      <path id="poleVGlow" d="${poleV}" fill="none" stroke="rgba(224,120,0,0.22)" stroke-width="4"
        stroke-linecap="round" stroke-dasharray="${V_DASH} ${V_GAP}" opacity="0">
        <animate attributeName="stroke-dashoffset" from="${V_CYC}" to="0" dur="1.4s" repeatCount="indefinite" calcMode="linear"/>
      </path>
      <path id="poleVCore" d="${poleV}" fill="none" stroke="#e07800" stroke-width="2.5"
        stroke-linecap="round" stroke-dasharray="${V_DASH} ${V_GAP}" opacity="0">
        <animate attributeName="stroke-dashoffset" from="${V_CYC}" to="0" dur="1.4s" repeatCount="indefinite" calcMode="linear"/>
      </path>

      <!-- ── POLE D segment (round right + horizontal, 2 dashes) ── -->
      <path id="poleDGlow" d="${poleD}" fill="none" stroke="rgba(224,120,0,0.22)" stroke-width="4"
        stroke-linecap="round" stroke-dasharray="${H_DASH} ${H_GAP}" opacity="0">
        <animate attributeName="stroke-dashoffset" from="${H_CYC}" to="0" dur="1.4s" repeatCount="indefinite" calcMode="linear"/>
      </path>
      <path id="poleDCore" d="${poleD}" fill="none" stroke="#e07800" stroke-width="2.5"
        stroke-linecap="round" stroke-dasharray="${H_DASH} ${H_GAP}" opacity="0">
        <animate attributeName="stroke-dashoffset" from="${H_CYC}" to="0" dur="1.4s" repeatCount="indefinite" calcMode="linear"/>
      </path>

      <!-- ── POLE arrows: D (house, ►) importing; P (grid, ◄) exporting ── -->
      <path id="poleArrR"
        d="M ${POLE_D_X - 7},${POLE_D_Y - 5} L ${POLE_D_X},${POLE_D_Y} L ${POLE_D_X - 7},${POLE_D_Y + 5}"
        fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" opacity="0"/>
      <path id="poleArrP"
        d="M ${POLE_P_X + 7},${POLE_Y - 5} L ${POLE_P_X},${POLE_Y} L ${POLE_P_X + 7},${POLE_Y + 5}"
        fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" opacity="0"/>

      ${flowLabels}
    </svg>`;

    /* EV banner — proper tile below Today's Consumption (W/A/SOC/ETA). Shown only when EV enabled. */
    const [evx, evy, evw, evh] = SL.r_ev;
    const evFront = `
        <div style="display:grid;grid-template-columns:auto repeat(5,1fr);align-items:center;
        position:absolute;inset:0;padding:5px 14px;box-sizing:border-box;column-gap:6px">
        <div style="grid-row:1;font-size:12px;font-weight:700;color:#cfeaff;letter-spacing:.06em">EV</div>
        <div style="grid-row:1;text-align:center;font-size:9px;color:rgba(255,255,255,.55);letter-spacing:.5px">W</div>
        <div style="grid-row:1;text-align:center;font-size:9px;color:rgba(255,255,255,.55);letter-spacing:.5px">A</div>
        <div style="grid-row:1;text-align:center;font-size:9px;color:rgba(255,255,255,.55);letter-spacing:.5px">SOC</div>
        <div style="grid-row:1;text-align:center;font-size:9px;color:rgba(255,255,255,.55);letter-spacing:.5px">ETA</div>
        <div style="grid-row:1;text-align:center;font-size:9px;color:rgba(255,255,255,.55);letter-spacing:.5px">STATE</div>
        <div style="grid-row:2"></div>
        <div id="evPowerVal"   style="grid-row:2;text-align:center;font-size:14px;font-weight:650;color:#00aaff">--</div>
        <div id="evCurrentVal" style="grid-row:2;text-align:center;font-size:14px;font-weight:650;color:#88ccff">--</div>
        <div id="evSocVal"     style="grid-row:2;text-align:center;font-size:14px;font-weight:650;color:#4ade80">--</div>
        <div id="evEtaVal"     style="grid-row:2;text-align:center;font-size:14px;font-weight:650;color:#4ade80">--</div>
        <div class="val-fit" id="evStateVal" style="grid-row:2;text-align:center;font-size:10.5px;font-weight:650;color:#ffd24a">--</div>
        </div>`;
    const evBanner = c._show_ev ? `
      <div class="box collapsible" id="evBanner" data-collapse-id="ev" style="left:${evx}px;top:${evy}px;width:${evw}px;height:${evh}px;
        overflow:hidden;border-color:rgba(0,170,255,.5)">
        ${collapsibleInner('ev', evFront, 'EV', '#00aaff', 'bottom:4px;right:4px')}
      </div>` : '';

    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <div class="stage">
        <div class="scaler" id="scaler">
          <img class="bg" id="bgA"><img class="bg" id="bgB" style="opacity:0">
          <svg id="wxStars" xmlns="http://www.w3.org/2000/svg" style="opacity:0"></svg>
          <div id="wxLayer"></div>
          ${(() => { const dimOp = Number(c.edge_dim_opacity); return Number.isFinite(dimOp) && dimOp > 0 ? `<div class="dim" style="opacity:${Math.min(100, dimOp) / 100}"></div>` : ''; })()}
          ${header}${arc}${navToggle}${nav}
          ${c._show_bars ? barHtml('pv', SL.pv, 'PV', '#43ea13', 10) + barHtml('pwr', SL.pwr, 'PWR', '#0a8aea', 10) : ''}
          ${evBanner}
          ${statCont}${stats}${lower}${invTiles}
          ${mode}${cylinder}${battStats}${pvTileBox}${prod}${cons}${events}
          ${bottom}${detail}
          ${flowOverlay}
        </div>
      </div>`;

    const ICON_SLOTS = [
      ['wifi',  '<path d="M2 9 a11 11 0 0 1 18 0 M5 13 a7 7 0 0 1 12 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="11" cy="17" r="1.6" fill="currentColor"/>'],
      ['power', '<path d="M11 3 V11 M5.5 6 a8 8 0 1 0 11 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'],
      ['bt',    '<path d="M11 2 V20 L17 15 L5 7 M11 2 L17 7 L5 15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>'],
      ['cam',   '<rect x="2" y="6" width="18" height="13" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="11" cy="12.5" r="3.6" fill="none" stroke="currentColor" stroke-width="2"/>'],
    ];
    const si = this._q('#statusIcons');
    si.innerHTML = ICON_SLOTS.map(([role, g], k) =>
      `<div class="box tap" id="si_${role}" data-icon="${role}" style="left:${SL.icons.x + k * 36}px;top:${SL.icons.y}px;width:30px;height:30px;border-radius:8px;cursor:pointer;color:#5a7a9a">
        <svg style="position:absolute;left:4px;top:4px" width="22" height="22" viewBox="0 0 22 22">${g}</svg></div>`).join('');

    /* responsive scaling */
    const stage = this._q('.stage'), scaler = this._q('#scaler');
    this._ro = new ResizeObserver(() => {
      const s = stage.clientWidth / VB_W;
      scaler.style.transform = `scale(${s})`;
    });
    this._ro.observe(stage);

    /* interactions */
    this._bindEvents();

    /* attribution check — must run after the subtitle node exists in the DOM */
    if (!this._verifyAttribution()) { this._lockCard(); return; }

    this._built = true;
    this._applyTheme();
    this._setBackground(true);
  }

  /* wire all DOM interactions after innerHTML is set (called once from _build) */
  /* auto-fit bottom-tile labels: shrink font until the name fits (ellipsis as last resort) */
  _fitBottomLabels() {
    const base = Number(this.config.sz_bottile_label) || 12;
    requestAnimationFrame(() => {
      for (let n = 1; n <= 6; n++) {
        const el = this._q('#btLbl' + n);
        if (!el) continue;
        let fs = base; el.style.fontSize = fs + 'px';
        while (el.scrollWidth > el.clientWidth && fs > 8) { fs -= 0.5; el.style.fontSize = fs + 'px'; }
      }
      for (let k = 0; k < 3; k++) {
        const el = this._q('#itLbl' + k);
        if (!el) continue;
        let fs = 11; el.style.fontSize = fs + 'px';
        while (el.scrollWidth > el.clientWidth && fs > 7.5) { fs -= 0.5; el.style.fontSize = fs + 'px'; }
      }
    });
  }

  _bindEvents() {
    this._fitBottomLabels();
    this._a11yPass();
    const c = this.config;
    this.shadowRoot.querySelectorAll('.navtile').forEach(t =>
      t.addEventListener('click', () => this._openView(t.dataset.view)));
    this._q('#detailClose')?.addEventListener('click', () => this._closeView());
    /* phase tile flip: corner ↻ button flips between grid phases and inverter pwr/volt */
    const flipCard = this._q('#phaseFlip');
    const doFlip = () => flipCard && flipCard.classList.toggle('flipped');
    this._q('#phaseFlipBtn')?.addEventListener('click', e => { e.stopPropagation(); doFlip(); });
    this._q('#phaseFlipBackBtn')?.addEventListener('click', e => { e.stopPropagation(); doFlip(); });
    /* battery value tile flip: corner ↻ button → 6 PV strings; hide dedicated PV tile while flipped.
       Plain display-swap (no CSS 3D transform) — avoids the backface-visibility/transform-style
       fragility that caused mirrored/overlapping text on some browsers (e.g. some Android WebViews). */
    const battFront = this._q('#battFaceFront'), battBack = this._q('#battFaceBack');
    const doBattFlip = () => {
      if (!battFront || !battBack) return;
      const backShowing = battBack.style.display !== 'none';
      battFront.style.display = backShowing ? '' : 'none';
      battBack.style.display  = backShowing ? 'none' : '';
      const pvTile = this._q('#pvPwrTile');
      if (pvTile) pvTile.style.visibility = backShowing ? '' : 'hidden';
    };
    this._q('#battFlipBtn')?.addEventListener('click', e => { e.stopPropagation(); doBattFlip(); });
    this._q('#battFlipBackBtn')?.addEventListener('click', e => { e.stopPropagation(); doBattFlip(); });
    this.shadowRoot.querySelectorAll('.bottile').forEach(t => {
      let hold;
      t.addEventListener('click', () => this._tapTile(+t.dataset.n));
      t.addEventListener('pointerdown', () => { hold = setTimeout(() => this._moreInfoTile(+t.dataset.n), 550); });
      ['pointerup', 'pointerleave'].forEach(ev => t.addEventListener(ev, () => clearTimeout(hold)));
    });
    this.shadowRoot.querySelectorAll('.stattile').forEach(t =>
      t.addEventListener('click', () => {
        const map = {
          load:  this._tileState('load').entity || c.consump,
          gimp:  c.grid_import_today,
          gexp:  c.grid_export_energy,
          chgdis: c.today_batt_chg,
        };
        const ent = map[t.dataset.stat]; if (ent) this._fireMoreInfo(ent);
      }));

    /* PV PWR tile is now inline (power + voltage rows); popup removed */

    /* generic: any element tagged data-entity opens its HA more-info (history) on tap.
       Computed/summed values are simply never tagged, so they stay inert. */
    this.shadowRoot.querySelectorAll('[data-entity]').forEach(el => {
      const id = el.getAttribute('data-entity');
      if (!id) return;
      el.style.cursor = 'pointer';
      el.addEventListener('click', e => { e.stopPropagation(); this._fireMoreInfo(id); });
    });

    /* collapsible tiles: collapse-button (front) and tab (collapsed) toggle the tile */
    this.shadowRoot.querySelectorAll('[data-collapse]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        this._setCollapsed(btn.closest('.collapsible'), true);
      });
    });
    this.shadowRoot.querySelectorAll('[data-expand]').forEach(tab => {
      tab.addEventListener('click', e => {
        e.stopPropagation();
        this._setCollapsed(tab.closest('.collapsible'), false);
      });
    });

    /* left nav rail master toggle */
    this._q('#navToggle')?.addEventListener('click', e => {
      e.stopPropagation();
      this._setNavCompact(!this._navCompact);
    });

    /* header status icons */
    this._q('#si_wifi')?.addEventListener('click', () => {
      const id = c.sys_wifi, rows = [];
      if (id) {
        const st = this._st(id), n = this._num(id, NaN), unit = this._attr(id, 'unit_of_measurement') || (Number.isFinite(n) ? 'dBm' : '');
        const ok = st != null && !['unavailable', 'unknown', 'off'].includes(String(st).toLowerCase());
        rows.push(['Status', ok ? 'Connected' : 'Offline', ok ? '#39d353' : '#ff5a5a']);
        rows.push(['Signal', `${st}${unit ? ' ' + unit : ''}`, '#5bc8ff']);
        ['ssid', 'bssid', 'ip_address', 'ip', 'mac', 'channel'].forEach(a => { const v = this._attr(id, a); if (v != null) rows.push([this._cap(a === 'ip' ? 'ip_address' : a), v, '#d8eeff']); });
      }
      this._statusPopup('WiFi', rows);
    });
    this._q('#si_bt')?.addEventListener('click', () => {
      const id = c.sys_bluetooth, rows = [];
      if (id) {
        const st = this._st(id);
        const connected = ['on', 'connected', 'true'].includes(String(st).toLowerCase()) || this._num(id, 0) > 0;
        rows.push(['Status', connected ? 'Connected' : 'Idle', connected ? '#39d353' : '#7fa3c4']);
        rows.push(['State', this._cap(st ?? '--'), '#5bc8ff']);
        ['device', 'device_name', 'connected_devices', 'rssi', 'address'].forEach(a => { const v = this._attr(id, a); if (v != null) rows.push([this._cap(a), v, '#d8eeff']); });
      }
      this._statusPopup('Bluetooth', rows);
    });
    this._q('#si_power')?.addEventListener('click', () => this._powerMenu());
    this._q('#si_cam')?.addEventListener('click', () => this._openView('security'));
    this._q('#timeHotspot')?.addEventListener('click', () => this._calendarPopup());
    this._q('#weatherHotspot')?.addEventListener('click', () => this._weatherPopup());
  }

  /* ══════════════ NAV / DETAIL VIEWS ══════════════ */
  /* ═══════════════════════ BATTERY HELPERS ═══════════════════════ */
  _fmtEndurance(h) {
    if (!isFinite(h) || h < 0) return '--';
    const days = Math.floor(h / 24), hrs = Math.floor(h % 24), mins = Math.floor((h - Math.floor(h)) * 60);
    if (days > 0) return days + 'd ' + hrs + 'h';
    return hrs + 'h ' + (mins < 10 ? '0' : '') + mins + 'm';
  }

  _battFill(soc) {
    const fb=268, fh=133;
    const fH = Math.round((soc||0)/100*fh), fY = fb-fH;
    let c, f, tc;
    const thresh_critical = Number(this.config?.thresh_soc_critical) || 15;
    const thresh_warn     = Number(this.config?.thresh_soc_low)      || 25;
    if (soc <= thresh_critical) { c='#ef4444'; f='url(#battGlowRed)';    tc='#fff'; }
    else if (soc <= thresh_warn){ c='#f59e0b'; f='url(#battGlowOrange)'; tc='#fff'; }
    else                        { c='url(#battLiquidBlue)'; f='url(#battGlowCyan)'; tc='#fff'; }
    // extend +6 past clip bottom so liquid fills the rounded base smoothly
    return { y:fY, height:fH>0?fH+6:0, color:c, filter:fH>4?f:'none', textColor:tc };
  }

  /* ═══════════════════════ NAV / DETAIL VIEWS ═══════════════════════ */
  _openView(view) {
    const panel = this._q('#detailPanel');
    if (!panel) return;
    /* DASHBOARD = the main card itself; tapping it just closes any open panel */
    if (view === 'dashboard') { this._closeView(); return; }
    /* toggle: tapping the active tile again closes the panel */
    if (this._activeView === view && panel.classList.contains('open')) {
      this._closeView();
      return;
    }
    this._activeView = view;
    this._panelBusy = false;
    this.shadowRoot.querySelectorAll('.navtile').forEach(t =>
      t.classList.toggle('nav-active', t.dataset.view === view));
    /* re-trigger slide animation on swap */
    panel.classList.remove('open');
    void panel.offsetWidth;
    panel.classList.add('open');
    this._renderDetail();
  }

  _closeView() {
    const panel = this._q('#detailPanel');
    if (panel) panel.classList.remove('open');
    this._activeView = 'dashboard';
    this._panelBusy = false;
    this.shadowRoot.querySelectorAll('.navtile').forEach(t => t.classList.remove('nav-active'));
  }

  /* ═══════════════ PANEL WIDGET BUILDERS (reusable across all nav views) ═══════════════ */
  /* Each returns an HTML string. Interactions are wired by _bindPanelWidgets() after render,
     via data-* attributes, so computed/empty rows stay inert and entities can be added later. */

  _wHead(text) { return `<div class="pw-head">${esc(text)}</div>`; }

  /* wrap items in an N-column grid (compact tile layout) */
  _wGrid(cols, html) { return `<div class="pw-grid" style="grid-template-columns:repeat(${cols},1fr)">${html}</div>`; }

  /* compact metric TILE: icon / label / value stacked (taps to more-info / history) */
  _wTile(icon, label, entId, unit = '', isPower = false) {
    const has = !!entId;
    const raw = has ? this._st(entId) : null;
    const bad = raw == null || raw === '' || /^(unavailable|unknown)$/i.test(raw);
    let val;
    if (bad) {
      val = '--';
    } else if (isPower) {
      const w = this._watts(entId, NaN);
      val = Number.isFinite(w) ? `${this._dec(w)}${unit ? ' ' + unit : ''}` : `${raw}${unit ? ' ' + unit : ''}`;
    } else {
      const n = this._num(entId, NaN);
      val = Number.isFinite(n) ? `${this._decEnt(entId)}${unit ? ' ' + unit : ''}` : `${raw}${unit ? ' ' + unit : ''}`;
    }
    return `<div class="pw-mtile" ${has ? `data-more="${esc(entId)}" style="cursor:pointer"` : ''}>
      <div class="mi">${icon}</div><div class="ml">${esc(label)}</div>
      <div class="mv${bad ? ' off' : ''}" ${has ? `data-val="${esc(entId)}" data-unit="${esc(unit)}"` : ''}>${esc(val)}</div></div>`;
  }

  /* compact toggle TILE: icon / label / switch stacked */
  _wToggleTile(icon, label, entId) {
    const has = !!entId;
    const on = has && ['on', 'open', 'home', 'unlocked', 'playing'].includes(String(this._st(entId)).toLowerCase());
    return `<div class="pw-ttile">
      <div class="ti">${icon}</div><div class="tl">${esc(label)}</div>
      <div class="pw-tgl ${on ? 'on' : ''}" ${has ? `data-toggle="${esc(entId)}"` : 'style="opacity:.4"'}><div class="kn"></div></div></div>`;
  }

  /* smart-plug tile: name + optional live power + on/off toggle */
  _wPlugTile(label, switchId, powerId) {
    const has = !!switchId;
    const on = has && ['on', 'open', 'playing'].includes(String(this._st(switchId)).toLowerCase());
    let pw = '';
    if (powerId) {
      const n = this._num(powerId, NaN);
      const txt = Number.isFinite(n) ? `${this._decEnt(powerId)} ${esc(this._attr(powerId, 'unit_of_measurement') || 'W')}` : '--';
      pw = `<div class="tl" style="color:#5bc8ff;font-weight:700;font-size:13px;margin-top:1px">${txt}</div>`;
    }
    return `<div class="pw-ttile">
      <div class="ti">🔌</div><div class="tl">${esc(label)}</div>${pw}
      <div class="pw-tgl ${on ? 'on' : ''}" ${has ? `data-toggle="${esc(switchId)}"` : 'style="opacity:.4"'}><div class="kn"></div></div></div>`;
  }

  /* compact button TILE */
  _wButtonTile(icon, label, entId, btnText = '', danger = false) {
    const has = !!entId;
    return `<div class="pw-ttile" ${has ? `data-press="${esc(entId)}" style="cursor:pointer"` : 'style="opacity:.4"'}>
      <div class="ti">${icon}</div><div class="tl">${esc(label)}</div>
      ${btnText ? `<div class="pw-btn ${danger ? 'danger' : ''}" style="pointer-events:none;padding:4px 12px">${esc(btnText)}</div>` : ''}</div>`;
  }

  /* read-only metric row: icon + label + live value (taps to more-info if entity set) */
  _wRow(icon, label, entId, unit = '') {
    const has = !!entId;
    const st = has ? this._st(entId) : null;
    const val = st == null ? '--' : `${st}${unit ? ' ' + unit : ''}`;
    return `<div class="pw" ${has ? `data-more="${esc(entId)}" style="cursor:pointer"` : ''}>
      <span class="pw-ic">${icon}</span><span class="pw-lbl">${esc(label)}</span>
      <span class="pw-val${st == null ? ' off' : ''}" ${has ? `data-val="${esc(entId)}" data-unit="${esc(unit)}"` : ''}>${esc(val)}</span></div>`;
  }

  /* toggle row for switch/light/input_boolean/fan/automation/script */
  _wToggle(icon, label, entId) {
    const has = !!entId;
    const on = has && ['on', 'open', 'home', 'unlocked', 'playing'].includes(String(this._st(entId)).toLowerCase());
    return `<div class="pw">
      <span class="pw-ic">${icon}</span><span class="pw-lbl">${esc(label)}</span>
      <div class="pw-tgl ${on ? 'on' : ''}" ${has ? `data-toggle="${esc(entId)}"` : 'style="opacity:.4"'}><div class="kn"></div></div></div>`;
  }

  /* slider row for number entities (min/max/step pulled from entity attrs when present) */
  _wSlider(icon, label, entId, fallbackMin = 0, fallbackMax = 100, fallbackStep = 1, unit = '') {
    const has = !!entId;
    const cur = has ? this._num(entId, NaN) : NaN;
    const mnV = has && Number.isFinite(this._numRaw(this._attr(entId, 'min'))) ? +this._attr(entId, 'min') : fallbackMin;
    const mxV = has && Number.isFinite(this._numRaw(this._attr(entId, 'max'))) ? +this._attr(entId, 'max') : fallbackMax;
    const stV = has && Number.isFinite(this._numRaw(this._attr(entId, 'step'))) ? +this._attr(entId, 'step') : fallbackStep;
    const pct = Number.isFinite(cur) ? Math.max(0, Math.min(100, ((cur - mnV) / (mxV - mnV || 1)) * 100)) : 0;
    const valTxt = Number.isFinite(cur) ? `${cur}${unit ? unit : ''}` : '--';
    return `<div class="pw">
      <span class="pw-ic">${icon}</span><span class="pw-lbl" style="flex:0 0 auto;max-width:38%">${esc(label)}</span>
      <div class="pw-sld-wrap">
        <div class="pw-sld" ${has ? `data-slider="${esc(entId)}" data-min="${mnV}" data-max="${mxV}" data-step="${stV}" data-unit="${esc(unit)}"` : 'style="opacity:.4"'}>
          <div class="fill" style="width:${pct}%"></div><div class="thumb" style="left:${pct}%"></div></div>
        <span class="pw-sld-val">${esc(valTxt)}</span>
      </div></div>`;
  }

  /* select/dropdown row for select entities */
  _wSelect(icon, label, entId, fallbackOptions = []) {
    const has = !!entId;
    const opts = has ? (this._attr(entId, 'options') || fallbackOptions) : fallbackOptions;
    const cur = has ? this._st(entId) : null;
    const optHtml = (opts || []).map(o => `<option value="${esc(o)}" ${o === cur ? 'selected' : ''}>${esc(o)}</option>`).join('')
      || `<option>--</option>`;
    return `<div class="pw">
      <span class="pw-ic">${icon}</span><span class="pw-lbl">${esc(label)}</span>
      <select class="pw-sel" ${has ? `data-select="${esc(entId)}"` : 'disabled style="opacity:.4"'}>${optHtml}</select></div>`;
  }

  /* button row for button entities or service calls */
  _wButton(icon, label, entId, btnText = 'Press', danger = false) {
    const has = !!entId;
    return `<div class="pw">
      <span class="pw-ic">${icon}</span><span class="pw-lbl">${esc(label)}</span>
      <div class="pw-btn ${danger ? 'danger' : ''}" ${has ? `data-press="${esc(entId)}"` : 'style="opacity:.4"'}>${esc(btnText)}</div></div>`;
  }

  /* scene/script buttons grid */
  _wScenes(scenes) {
    const cells = scenes.map(([icon, label, entId]) =>
      `<div class="pw-scene" ${entId ? `data-scene="${esc(entId)}"` : 'style="opacity:.45"'}>
        <span class="si">${icon}</span>${esc(label)}</div>`).join('');
    return `<div class="pw-scenes">${cells}</div>`;
  }

  /* dual camera tiles (go2rtc/WebRTC iframe streams) */
  _wCameras(cams) {
    const base = this.config.camera_stream_base || '';
    const cells = cams.map(([label, src]) => {
      const url = src && base ? `${base}/stream.html?src=${encodeURIComponent(src)}&mode=mse` : '';
      const body = url
        ? `<iframe src="${esc(url)}" allowfullscreen></iframe>`
        : src
          ? `<img class="camStream" data-cam-id="${esc(src)}" alt="${esc(label)}">`
          : `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#5a7a9a;font-size:12px">📷 ${esc(label)}<br>(stream not set)</div>`;
      return `<div class="pw-cam" ${src ? `data-cam-tap="${esc(src)}" data-cam-label="${esc(label)}" data-cam-url="${esc(url)}"` : ''}>
        ${body}
        <div class="clbl">${esc(label)}</div><div class="crec">LIVE</div></div>`;
    }).join('');
    return `<div class="pw-cams">${cells}</div>`;
  }

  /* climate control card: current temp + target steppers + mode/fan/swing chips + eco (climate.*) */
  _wClimate(label, entId) {
    const has = !!entId;
    const cur = has ? this._attr(entId, 'current_temperature') : null;
    const target = has ? this._attr(entId, 'temperature') : null;
    const st = has ? this._st(entId) : null;
    const modes = (has && this._attr(entId, 'hvac_modes')) || ['off', 'cool', 'heat', 'auto', 'dry', 'fan_only'];
    const fanModes = has ? this._attr(entId, 'fan_modes') : null;
    const swingModes = has ? this._attr(entId, 'swing_modes') : null;
    const curFan = has ? this._attr(entId, 'fan_mode') : null;
    const curSwing = has ? this._attr(entId, 'swing_mode') : null;
    const curPreset = has ? this._attr(entId, 'preset_mode') : null;
    const presets = has ? this._attr(entId, 'preset_modes') : null;
    const chip = (active, attrs, text) =>
      `<div class="pw-scene" style="padding:7px 4px;font-size:11px;${active ? 'background:rgba(0,200,255,.25);border-color:rgba(0,200,255,.6);color:#5bc8ff' : ''}" ${attrs}>${esc(text)}</div>`;
    const modeChips = modes.map(m => chip(m === st, has ? `data-hvac="${esc(entId)}" data-mode="${esc(m)}"` : 'style="opacity:.4"', m)).join('');
    let extra = '';
    if (has && fanModes && fanModes.length) {
      extra += `<div class="pw-head" style="margin:10px 0 6px">Fan Speed</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px">${fanModes.map(f => chip(f === curFan, `data-fan="${esc(entId)}" data-val="${esc(f)}"`, f)).join('')}</div>`;
    }
    if (has && swingModes && swingModes.length) {
      extra += `<div class="pw-head" style="margin:10px 0 6px">Airflow</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px">${swingModes.map(s => chip(s === curSwing, `data-swing="${esc(entId)}" data-val="${esc(s)}"`, s)).join('')}</div>`;
    }
    if (has && presets && presets.includes('eco')) {
      extra += `<div style="margin-top:10px">${this._wToggleInline('🌿', 'Eco mode', entId, curPreset === 'eco', 'data-eco="' + esc(entId) + '"')}</div>`;
    }
    return `<div class="pw" style="flex-direction:column;align-items:stretch;gap:10px;padding:14px">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span class="pw-lbl" style="font-size:15px">${esc(label)}</span>
        <span style="font-size:12px;color:#7fa3c4">Now: <b style="color:#5bc8ff">${cur != null ? (+cur).toFixed(1) + '°' : '--'}</b></span>
      </div>
      <div style="display:flex;align-items:center;justify-content:center;gap:18px">
        <div class="pw-btn" style="width:38px;height:38px;border-radius:50%;padding:0;display:flex;align-items:center;justify-content:center;font-size:20px"
          ${has ? `data-tempstep="${esc(entId)}" data-delta="-0.5"` : 'style="opacity:.4"'}>−</div>
        <div style="text-align:center;min-width:74px"><div style="font-size:10px;color:#7fa3c4">TARGET</div>
          <div data-target="${esc(entId)}" style="font-size:26px;font-weight:700;color:#ffd24a">${target != null ? (+target).toFixed(1) + '°' : '--'}</div></div>
        <div class="pw-btn" style="width:38px;height:38px;border-radius:50%;padding:0;display:flex;align-items:center;justify-content:center;font-size:20px"
          ${has ? `data-tempstep="${esc(entId)}" data-delta="0.5"` : 'style="opacity:.4"'}>+</div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px">${modeChips}</div>
      ${extra}
    </div>`;
  }

  /* inline toggle (no row wrapper) — for embedding inside other widgets */
  _wToggleInline(icon, label, entId, on, dataAttr) {
    return `<div style="display:flex;align-items:center;gap:12px;padding:9px 12px;background:rgba(255,255,255,.04);border:1px solid rgba(120,180,255,.14);border-radius:10px">
      <span class="pw-ic">${icon}</span><span class="pw-lbl">${esc(label)}</span>
      <div class="pw-tgl ${on ? 'on' : ''}" ${dataAttr}><div class="kn"></div></div></div>`;
  }

  /* Tuya-style timer row: device switch + ON-time + OFF-time.
     Times are stored in HA input_datetime helpers (the card reads/writes them, and an HA
     automation reads the same helpers to do the actual switching). The card never runs the
     schedule itself — a sleeping tablet would miss it. Pass the helper entity_ids. */
  _wTimer(label, switchEnt, onHelper, offHelper, enableHelper) {
    const has = !!switchEnt;
    const on = has && ['on', 'open'].includes(String(this._st(switchEnt)).toLowerCase());
    const hhmm = (ent) => {
      if (!ent) return '';
      const s = this._st(ent);
      if (!s) return '';
      // input_datetime state like "07:00:00" or "2026-01-01 07:00:00"
      const m = String(s).match(/(\d{1,2}):(\d{2})/);
      return m ? `${m[1].padStart(2, '0')}:${m[2]}` : '';
    };
    const onT = hhmm(onHelper) || '07:00';
    const offT = hhmm(offHelper) || '23:00';
    const en = enableHelper && ['on', 'open'].includes(String(this._st(enableHelper)).toLowerCase());
    return `<div class="pw" style="flex-direction:column;align-items:stretch;gap:10px;padding:13px">
      <div style="display:flex;align-items:center;gap:12px">
        <span class="pw-ic">🔌</span><span class="pw-lbl">${esc(label)}</span>
        <div class="pw-tgl ${on ? 'on' : ''}" ${has ? `data-toggle="${esc(switchEnt)}"` : 'style="opacity:.4"'}><div class="kn"></div></div>
      </div>
      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
        <div class="pw-tgl ${en ? 'on' : ''}" ${enableHelper ? `data-toggle="${esc(enableHelper)}"` : 'style="opacity:.4"'} style="flex-shrink:0"><div class="kn"></div></div>
        <span style="font-size:12px;color:#7fa3c4">Timer</span>
        <span style="font-size:11px;color:#7fa3c4;margin-left:auto">ON</span>
        <input type="time" class="pw-time" value="${esc(onT)}" ${onHelper ? `data-settime="${esc(onHelper)}"` : 'disabled style="opacity:.4"'}>
        <span style="font-size:11px;color:#7fa3c4">OFF</span>
        <input type="time" class="pw-time" value="${esc(offT)}" ${offHelper ? `data-settime="${esc(offHelper)}"` : 'disabled style="opacity:.4"'}>
      </div></div>`;
  }




  /* light control: on/off toggle + brightness slider (light.* uses brightness 0-255 attr) */
  _wLight(label, entId) {
    const has = !!entId;
    const st = has ? this._st(entId) : null;
    const on = String(st).toLowerCase() === 'on';
    const br = has && on ? this._attr(entId, 'brightness') : null;
    const pct = br != null ? Math.round((+br / 255) * 100) : 0;
    const isLight = has && entId.startsWith('light.');
    return `<div class="pw" style="flex-direction:column;align-items:stretch;gap:10px">
      <div style="display:flex;align-items:center;gap:12px">
        <span class="pw-ic">💡</span><span class="pw-lbl">${esc(label)}</span>
        <div class="pw-tgl ${on ? 'on' : ''}" ${has ? `data-toggle="${esc(entId)}"` : 'style="opacity:.4"'}><div class="kn"></div></div>
      </div>
      ${isLight ? `<div style="display:flex;align-items:center;gap:10px">
        <span style="font-size:11px;color:#7fa3c4">☀</span>
        <div class="pw-sld" data-bright="${esc(entId)}" style="flex:1">
          <div class="fill" style="width:${pct}%"></div><div class="thumb" style="left:${pct}%"></div></div>
        <span class="pw-sld-val" data-brightval="${esc(entId)}">${on ? pct + '%' : 'off'}</span>
      </div>` : ''}
    </div>`;
  }

  /* raw numeric parse (no entity lookup) — for attribute min/max/step */
  _numRaw(v) { const n = parseFloat(v); return Number.isFinite(n) ? n : NaN; }

  /* wire all widget interactions after a panel renders */
  _bindPanelWidgets(root) {
    const hass = this._hass; if (!hass) return;
    this._a11yPass(root);
    root.querySelectorAll('[data-cam-tap]').forEach(el => el.addEventListener('click', e => {
      if (e.target.id === 'camFsClose') return;
      this._openCameraFullscreen(el.getAttribute('data-cam-tap'), el.getAttribute('data-cam-label') || 'Camera', el.getAttribute('data-cam-url') || '');
    }));
    this._refreshCameraStreams();
    root.querySelectorAll('[data-more]').forEach(el => el.addEventListener('click', e => {
      if (e.target.closest('[data-toggle],[data-slider],[data-select],[data-press]')) return;
      this._fireMoreInfo(el.getAttribute('data-more'));
    }));
    root.querySelectorAll('[data-toggle]').forEach(el => el.addEventListener('click', e => {
      e.stopPropagation();
      const id = el.getAttribute('data-toggle'), dom = id.split('.')[0];
      const svc = dom === 'script' ? 'script' : 'homeassistant';
      hass.callService(svc, dom === 'script' ? 'turn_on' : 'toggle', { entity_id: id });
      el.classList.toggle('on');
    }));
    root.querySelectorAll('[data-select]').forEach(el => el.addEventListener('change', e => {
      e.stopPropagation();
      hass.callService('select', 'select_option', { entity_id: el.getAttribute('data-select'), option: el.value });
    }));
    root.querySelectorAll('[data-press]').forEach(el => el.addEventListener('click', e => {
      e.stopPropagation();
      const id = el.getAttribute('data-press'), dom = id.split('.')[0];
      if (dom === 'button') hass.callService('button', 'press', { entity_id: id });
      else if (dom === 'script') hass.callService('script', 'turn_on', { entity_id: id });
      else hass.callService('homeassistant', 'toggle', { entity_id: id });
    }));
    root.querySelectorAll('[data-scene]').forEach(el => el.addEventListener('click', e => {
      e.stopPropagation();
      const id = el.getAttribute('data-scene'), dom = id.split('.')[0];
      hass.callService(dom === 'script' ? 'script' : 'scene', dom === 'script' ? 'turn_on' : 'turn_on', { entity_id: id });
    }));
    /* climate: temp steppers + hvac mode chips */
    root.querySelectorAll('[data-tempstep]').forEach(el => el.addEventListener('click', e => {
      e.stopPropagation();
      const id = el.getAttribute('data-tempstep'), delta = +el.getAttribute('data-delta');
      const cur = parseFloat(this._attr(id, 'temperature')) || 22;
      const next = Math.round((cur + delta) * 2) / 2;
      const tEl = root.querySelector(`[data-target="${id}"]`); if (tEl) tEl.textContent = next.toFixed(1) + '°';
      hass.callService('climate', 'set_temperature', { entity_id: id, temperature: next });
    }));
    root.querySelectorAll('[data-hvac]').forEach(el => el.addEventListener('click', e => {
      e.stopPropagation();
      hass.callService('climate', 'set_hvac_mode', { entity_id: el.getAttribute('data-hvac'), hvac_mode: el.getAttribute('data-mode') });
    }));
    root.querySelectorAll('[data-fan]').forEach(el => el.addEventListener('click', e => {
      e.stopPropagation();
      hass.callService('climate', 'set_fan_mode', { entity_id: el.getAttribute('data-fan'), fan_mode: el.getAttribute('data-val') });
    }));
    root.querySelectorAll('[data-swing]').forEach(el => el.addEventListener('click', e => {
      e.stopPropagation();
      hass.callService('climate', 'set_swing_mode', { entity_id: el.getAttribute('data-swing'), swing_mode: el.getAttribute('data-val') });
    }));
    root.querySelectorAll('[data-eco]').forEach(el => el.addEventListener('click', e => {
      e.stopPropagation();
      const id = el.getAttribute('data-eco'); const isEco = this._attr(id, 'preset_mode') === 'eco';
      hass.callService('climate', 'set_preset_mode', { entity_id: id, preset_mode: isEco ? 'none' : 'eco' });
      el.classList.toggle('on');
    }));
    /* Tuya timer: write picked time to its HA input_datetime helper (HA automation reads it) */
    root.querySelectorAll('[data-settime]').forEach(el => el.addEventListener('change', e => {
      e.stopPropagation();
      hass.callService('input_datetime', 'set_datetime', { entity_id: el.getAttribute('data-settime'), time: el.value + ':00' });
    }));
    /* light brightness slider → light.turn_on with brightness_pct */
    root.querySelectorAll('[data-bright]').forEach(track => {
      const id = track.getAttribute('data-bright');
      const fill = track.querySelector('.fill'), thumb = track.querySelector('.thumb');
      const valEl = track.parentElement.querySelector('[data-brightval]');
      const fromX = (clientX) => {
        const r = track.getBoundingClientRect();
        const pct = Math.round(Math.max(0, Math.min(1, (clientX - r.left) / r.width)) * 100);
        fill.style.width = pct + '%'; thumb.style.left = pct + '%';
        if (valEl) valEl.textContent = pct + '%';
        return pct;
      };
      this._bindSlider(track, fromX, pct => this._hass.callService('light', 'turn_on', { entity_id: id, brightness_pct: pct }));
    });
    root.querySelectorAll('[data-slider]').forEach(track => {
      const id = track.getAttribute('data-slider');
      const mn = +track.getAttribute('data-min'), mx = +track.getAttribute('data-max'), stp = +track.getAttribute('data-step') || 1;
      const fill = track.querySelector('.fill'), thumb = track.querySelector('.thumb');
      const valEl = track.parentElement.querySelector('.pw-sld-val');
      const unit = track.getAttribute('data-unit') || '';
      const dec = (String(stp).split('.')[1] || '').length;       // step decimal precision
      const fromX = (clientX) => {
        const r = track.getBoundingClientRect();
        const p = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
        let val = mn + Math.round((p * (mx - mn)) / stp) * stp;    // snap to step grid from min
        val = Math.max(mn, Math.min(mx, +val.toFixed(dec)));       // clamp + kill float artifacts
        const pct = ((val - mn) / (mx - mn || 1)) * 100;
        fill.style.width = pct + '%'; thumb.style.left = pct + '%';
        if (valEl) valEl.textContent = `${val}${unit}`;
        return val;
      };
      this._bindSlider(track, fromX, v => this._hass.callService('number', 'set_value', { entity_id: id, value: v }));
    });
  }

  /* ── shared slider drag (mouse+touch via pointer events). fromX(clientX)
     paints the live preview and returns the value; commit(value) fires on
     release. Sets _panelBusy for the gesture so the live hass refresh won't
     rebuild the panel mid-drag and snap the thumb back (room-card guard). ── */
  _bindSlider(track, fromX, commit) {
    let v = null;
    const end = (e) => {
      if (!this._panelBusy) return;
      this._panelBusy = false;
      try { track.releasePointerCapture(e.pointerId); } catch (e2) { console.debug('casa-luna: releasePointerCapture no-op', e2); }
      if (v != null) commit(v);
    };
    track.addEventListener('pointerdown', e => { this._panelBusy = true; v = fromX(e.clientX); try { track.setPointerCapture(e.pointerId); } catch (e2) { console.debug('casa-luna: setPointerCapture no-op', e2); } });
    track.addEventListener('pointermove', e => { if (this._panelBusy) v = fromX(e.clientX); });
    track.addEventListener('pointerup', end);
    track.addEventListener('pointercancel', () => { this._panelBusy = false; });
  }

  _renderDetail() {
    const view = this._activeView;
    if (view === 'dashboard') return;
    const inner = this._q('#detailInner');
    const meta = NAV_VIEWS.find(v => v[0] === view);
    if (!meta) { this._closeView(); return; }   // unknown view → close panel rather than crash on meta[1]
    /* per-view rich builders; fall back to the generic entity list for views not yet built */
    const builders = {
      security: () => this._viewSecurity(),
      climate: () => this._viewClimate(),
      energy: () => this._viewEnergy(),
      plugs: () => this._viewPlugs(),
      battery: () => this._viewBattery(),
      automation: () => this._viewAutomation(),
      lighting: () => this._viewLighting(),
      system: () => this._viewSystem(),
    };
    const body = builders[view] ? builders[view]() : this._viewGeneric(view, meta);
    /* setting innerHTML always resets scrollTop to 0 - without restoring it, every
       periodic refresh (the 15s clock, or any watched entity changing) would silently
       snap the panel back to the top while someone's reading further down. */
    const prevScroll = inner.scrollTop;
    inner.innerHTML = `<h3>${meta[1]}</h3><div class="dsub">${meta[2]}</div>${body}`;
    this._bindPanelWidgets(inner);
    /* generic list also needs its row binding */
    inner.querySelectorAll('.erow').forEach(r => {
      r.addEventListener('click', e => {
        const id = r.dataset.ent;
        if (r.dataset.tg === '1' && e.target.classList.contains('tgl')) {
          const dom = id.split('.')[0];
          this._hass.callService(dom === 'script' ? 'script' : 'homeassistant', dom === 'script' ? 'turn_on' : 'toggle', { entity_id: id });
        } else this._fireMoreInfo(id);
      });
    });
    this._fitDetailPanel();
    /* restore AFTER _fitDetailPanel — its position:static measurement trick resets
       scrollTop as a side effect, so restoring before it runs gets clobbered. */
    inner.scrollTop = prevScroll;
  }

  /* Size #detailPanel to fit THIS view's actual content instead of a constant height.
     .detail-inner is position:absolute;inset:0 so it always stretches to match whatever
     height the panel currently has — meaning scrollHeight just reports back that same
     forced height when content is shorter (nothing to "scroll into view" yet). To get the
     true content height we briefly relax the panel taller than any real view could need,
     measure, then clamp: light views (a few buttons) shrink to fit; heavy views (many rows,
     e.g. Security/Automation's Extra 1–6 slots) grow up to the cap — the inverter-tile row's
     bottom edge, y=898 — and scroll inside .detail-inner beyond that, same as before. */
  _fitDetailPanel() {
    const panel = this._q('#detailPanel'), inner = this._q('#detailInner');
    if (!panel || !inner) return;
    const MIN = 200, MAX = 768;
    /* .detail-inner is position:absolute;inset:0, so it always stretches to match
       whatever height the panel currently has — scrollHeight just echoes that forced
       size back, never the true (possibly shorter) content height. Briefly switch it
       to normal flow (position:static) so height:auto reflects real content, measure,
       then restore. */
    const prevPos = inner.style.position;
    inner.style.position = 'static';
    const natural = inner.scrollHeight;
    inner.style.position = prevPos;
    panel.style.height = Math.max(MIN, Math.min(MAX, natural)) + 'px';
  }

  /* generic fallback: simple entity list from view_<view>_entities */
  /* ═══════════════ AUTO-DISCOVERY ═══════════════
     Scan hass.states for entities matching domain + device_class rules.
     Returns sorted entity ids. Used when a view's auto-discover toggle is ON. */
  _discover(rules) {
    const hass = this._hass; if (!hass) return [];
    const out = [];
    for (const id in hass.states) {
      const dom = id.split('.')[0];
      const dc = hass.states[id].attributes?.device_class;
      for (const r of rules) {
        if (r.domain && dom !== r.domain) continue;
        if (r.device_class) {
          const want = Array.isArray(r.device_class) ? r.device_class : [r.device_class];
          if (!want.includes(dc)) continue;
        }
        if (r.exclude_dc && dc && (Array.isArray(r.exclude_dc) ? r.exclude_dc : [r.exclude_dc]).includes(dc)) continue;
        out.push(id); break;
      }
    }
    return out.sort((a, b) => this._name(a).localeCompare(this._name(b)));
  }

  /* build a tile grid (N cols) of metric tiles from a discovered entity list */
  _discoverTiles(rules, cols = 4, iconFn = null) {
    const ids = this._discover(rules);
    if (!ids.length) return `<div class="hint" style="opacity:.6">No matching entities found.</div>`;
    return this._wGrid(cols, ids.map(id => {
      const icon = iconFn ? iconFn(id) : '•';
      const unit = this._attr(id, 'unit_of_measurement') || '';
      return this._wTile(icon, this._name(id), id, unit);
    }).join(''));
  }

  /* build toggle tiles from a discovered list (for switches/lights/automations) */
  _discoverToggles(rules, cols = 4, iconFn = null) {
    const ids = this._discover(rules);
    if (!ids.length) return `<div class="hint" style="opacity:.6">No matching entities found.</div>`;
    return this._wGrid(cols, ids.map(id => this._wToggleTile(iconFn ? iconFn(id) : '⚪', this._name(id), id)).join(''));
  }

  /* is auto-discover enabled for this view? */
  _autoOn(view) { return !!this.config[`auto_discover_${view}`]; }

  _viewGeneric(view, meta) {
    const ents = this.config[`view_${view}_entities`] || [];
    if (!ents.length) {
      return `<div class="hint">No entities configured for this view yet.<br>
        Open the card editor → <b>Navigation Views</b> → add entities to <b>${meta[1]}</b>.</div>`;
    }
    return ents.map(id => {
      const st = this._st(id), dom = id.split('.')[0];
      const toggleable = ['switch', 'light', 'input_boolean', 'fan', 'automation', 'script'].includes(dom);
      const on = ['on', 'open', 'unlocked', 'home'].includes(st);
      return `<div class="erow" data-ent="${esc(id)}" data-tg="${toggleable ? 1 : 0}">
        <div class="en">${esc(this._name(id))}</div>
        ${toggleable ? `<div class="tgl ${on ? 'on' : ''}"></div>`
          : `<div class="es">${esc(st ?? '--')}${esc(this._attr(id, 'unit_of_measurement') || '')}</div>`}
      </div>`;
    }).join('');
  }

  /* ── SECURITY view: cameras + safety sensors + alarm controls ── */
  _viewSecurity() {
    const c = this.config;
    /* auto-discover: all cameras + safety binary_sensors */
    if (this._autoOn('security')) {
      return this._wHead('Cameras')
        + this._wCameras([['Front — Cam 1', c.sec_cam1 || ''], ['Gate — Cam 2', c.sec_cam2 || '']])
        + this._wHead('Safety Sensors (auto)')
        + this._discoverTiles([{ domain: 'binary_sensor', device_class: ['gas', 'smoke', 'carbon_monoxide', 'safety'] }], 4, () => '🔥')
        + this._wHead('Motion & Doors (auto)')
        + this._discoverTiles([{ domain: 'binary_sensor', device_class: ['motion', 'occupancy', 'moving'] }, { domain: 'binary_sensor', device_class: ['door', 'window', 'opening', 'garage_door'] }], 4,
          id => { const dc = this._attr(id, 'device_class'); return ['door', 'window', 'opening', 'garage_door'].includes(dc) ? '🚪' : '🚶'; });
    }
    const grp = (head, body) => body ? this._wHead(head) + body : '';
    const safety = [
      c.sec_flame      && this._wTile('🔥', c.sec_flame_name      || this._name(c.sec_flame), c.sec_flame),
      c.sec_gas_analog && this._wTile('💨', c.sec_gas_analog_name || this._name(c.sec_gas_analog), c.sec_gas_analog),
      c.sec_gas_digital&& this._wTile('🔔', c.sec_gas_digital_name|| this._name(c.sec_gas_digital), c.sec_gas_digital),
      c.sec_motion     && this._wTile('🚶', c.sec_motion_name     || this._name(c.sec_motion), c.sec_motion),
    ].filter(Boolean).join('');
    const doors = [
      c.sec_door1   && this._wTile('🚪', c.sec_door1_name   || this._name(c.sec_door1), c.sec_door1),
      c.sec_window1 && this._wTile('🪟', c.sec_window1_name || this._name(c.sec_window1), c.sec_window1),
    ].filter(Boolean).join('');
    const extra = [1, 2, 3, 4, 5, 6].map(n => {
      const id = c[`sec_extra_${n}_entity`];
      return id ? this._wTile('🛡️', c[`sec_extra_${n}_name`] || this._name(id), id) : '';
    }).filter(Boolean).join('');
    const scenes = [
      ['🛡️', 'Arm Away', c.sec_scene_arm || ''],
      ['🏠', 'Disarm', c.sec_scene_disarm || ''],
      ['🌙', 'Night', c.sec_scene_night || ''],
    ].filter(s => s[2]);
    return this._wCameras([
      ['Front — Cam 1', c.sec_cam1 || ''],
      ['Gate — Cam 2', c.sec_cam2 || ''],
    ])
      + grp('Safety Sensors', safety ? this._wGrid(4, safety) : '')
      + grp('Doors & Windows', doors ? this._wGrid(2, doors) : '')
      + grp('More', extra ? this._wGrid(4, extra) : '')
      + grp('Alarm & Scenes', scenes.length ? this._wScenes(scenes) : '')
      + (c.sec_motion_alert ? this._wToggle('📢', 'Motion alert when away', c.sec_motion_alert) : '');
  }

  /* ── CLIMATE view: AC + fridge + ambient sensors ── */
  _viewClimate() {
    const c = this.config;
    /* auto-discover: all climate entities + temp/humidity sensors */
    if (this._autoOn('climate')) {
      const acs = this._discover([{ domain: 'climate' }]);
      let acCards = acs.length ? acs.map(id => this._wClimate(this._name(id), id)).join('') : '<div class="hint" style="opacity:.6">No climate entities found.</div>';
      return this._wHead('Climate Devices (auto)')
        + acCards
        + this._wHead('Temperature (auto)')
        + this._discoverTiles([{ domain: 'sensor', device_class: 'temperature' }], 4, () => '🌡️')
        + this._wHead('Humidity (auto)')
        + this._discoverTiles([{ domain: 'sensor', device_class: 'humidity' }], 4, () => '💧');
    }
    /* manual: only render tiles whose entity is set; drop empty groups entirely */
    const grp = (head, body) => body ? this._wHead(head) + body : '';
    const ac = (c.clim_ac || '') ? this._wClimate(c.clim_ac_name || this._name(c.clim_ac), c.clim_ac) : '';
    const fridge = [
      c.clim_fridge_temp  && this._wTile('🌡️', c.clim_fridge_temp_name  || this._name(c.clim_fridge_temp), c.clim_fridge_temp, '°C'),
      c.clim_fridge_door  && this._wTile('🚪', c.clim_fridge_door_name  || this._name(c.clim_fridge_door), c.clim_fridge_door),
      c.clim_fridge_power && this._wTile('🔌', c.clim_fridge_power_name || this._name(c.clim_fridge_power), c.clim_fridge_power, 'W', true),
    ].filter(Boolean).join('');
    const ambient = [
      c.clim_ambient  && this._wTile('🌡️', c.clim_ambient_name  || this._name(c.clim_ambient), c.clim_ambient, '°C'),
      c.clim_humidity && this._wTile('💧', c.clim_humidity_name || this._name(c.clim_humidity), c.clim_humidity, '%'),
      c.clim_lux      && this._wTile('💡', c.clim_lux_name      || this._name(c.clim_lux), c.clim_lux, 'lx'),
    ].filter(Boolean).join('');
    const extra = [1, 2, 3, 4, 5, 6].map(n => {
      const id = c[`clim_extra_${n}_entity`];
      return id ? this._wTile('🌡️', c[`clim_extra_${n}_name`] || this._name(id), id) : '';
    }).filter(Boolean).join('');
    const autom = [
      c.clim_window_ac && this._wToggleTile('🪟', 'Window→AC', c.clim_window_ac),
      c.clim_schedule  && this._wToggleTile('🕐', 'Schedule',  c.clim_schedule),
    ].filter(Boolean).join('');
    const out = grp('Air Conditioning', ac)
      + grp('Refrigerator', fridge ? this._wGrid(3, fridge) : '')
      + grp('Ambient', ambient ? this._wGrid(3, ambient) : '')
      + grp('More', extra ? this._wGrid(3, extra) : '')
      + grp('Automation', autom ? this._wGrid(2, autom) : '');
    return out || '<div class="hint" style="opacity:.6;padding:18px">No climate entities configured. Add them in the editor → Climate View.</div>';
  }

  /* ── ENERGY view: monitoring + GoodWe inverter controls (from config) ── */
  _viewEnergy() {
    const c = this.config;
    /* Same inheritance pattern as _viewBattery's bf(): if the Energy View's own en_*
       field isn't set (or its entity doesn't exist in this HA), fall back to the main
       dashboard's equivalent — so this view mirrors it automatically instead of asking
       for the same entity twice. */
    const bf = (enKey, mainKey) => (c[enKey] && this._stateObj(c[enKey])) ? c[enKey] : (c[mainKey] || '');
    return this._wHead('Live Power')
      + this._wGrid(4,
        this._wTile('☀️', 'PV1', bf('en_pv1', 'pv1_power'), 'W', true)
        + this._wTile('☀️', 'PV2', bf('en_pv2', 'pv2_power'), 'W', true)
        + this._wTile('🏭', 'Grid', bf('en_grid_power', 'grid_active_power'), 'W', true)
        + this._wTile('🏠', 'Load', bf('en_load', 'consump'), 'W', true)
        + this._wTile('🔋', 'Backup', c.en_backup || '', 'W', true)
        + this._wTile('⚙️', 'Mode', bf('en_work_mode', 'inverter_state')))
      + this._wHead('Inverter Controls')
      + this._wGrid(3,
        this._wToggleTile('🔋', 'Backup', c.en_backup_supply || '')
        + this._wToggleTile('🏭', 'Export lim', c.en_export_switch || '')
        + this._wToggleTile('🪫', 'DOD hold', c.en_dod_holding || ''))
      + this._wSelect('☰', 'EMS mode', c.en_ems_mode || '', ['Auto', 'Manual', 'Eco', 'Backup'])
      + this._wSelect('⚡', 'Operation mode', c.en_op_mode || '', ['General', 'Off-Grid', 'Backup', 'Eco'])
      + this._wSlider('📤', 'Export limit', c.en_export_limit || '', 0, 10000, 100, 'W')
      + this._wHead('Battery Limits')
      + this._wSlider('🔋', 'SoC protection', c.en_soc_protect || '', 0, 100, 1, '%')
      + this._wSlider('🪫', 'DoD (on-grid)', c.en_dod_ongrid || '', 0, 100, 1, '%')
      + this._wSlider('🪫', 'DoD (off-grid)', c.en_dod_offgrid || '', 0, 100, 1, '%')
      + this._wSlider('🌿', 'Eco mode power', c.en_eco_power || '', 0, 100, 1, '%')
      + this._wSlider('⚡', 'EMS power', c.en_ems_power || '', 0, 10000, 100, 'W')
      + this._wHead('Grid & Sync')
      + this._wGrid(2,
        this._wToggleTile('🔌', 'Grid switch', c.en_grid_switch || '')
        + this._wButtonTile('🕐', 'Sync time', c.en_sync_time || '', 'Press'));
  }

  _viewPlugs() {
    const c = this.config;
    const plugs = [1, 2, 3, 4, 5, 6].map(n => {
      const id = c[`plug_${n}_entity`];
      return id ? this._wPlugTile(c[`plug_${n}_name`] || this._name(id), id, c[`plug_${n}_power`]) : '';
    }).filter(Boolean).join('');
    return plugs
      ? this._wHead('Smart Plugs') + this._wGrid(3, plugs)
      : '<div class="hint" style="opacity:.6;padding:18px">No smart plugs configured. Add them in the editor → Smart Plugs View.</div>';
  }

  /* ── BATTERY view: JK BMS detail + charge controls ── */
  _viewBattery() {
    const c = this.config;
    /* Battery View has its own bat_* entity keys (defaults to JK BMS names), separate
       from the main face's battery_* keys. If bat_X isn't set OR doesn't actually exist
       in this HA (e.g. a stale default from a non-GoodWe install), fall back to the
       main face's equivalent entity so the view mirrors it automatically. */
    const bf = (batKey, mainKey) => (c[batKey] && this._stateObj(c[batKey])) ? c[batKey] : (c[mainKey] || '');
    return this._wHead('Pack')
      + this._wGrid(4,
        this._wTile('🔋', 'SoC', bf('bat_soc', 'battery_soc'), '%')
        + this._wTile('⚡', 'Voltage', bf('bat_voltage', 'battery_voltage'), 'V')
        + this._wTile('🔌', 'Current', bf('bat_current', 'battery_current'), 'A')
        + this._wTile('📊', 'Power', bf('bat_power', 'battery_power'), 'W', true)
        + this._wTile('⏳', 'Remain', c.bat_remain || '', 'Ah')
        + this._wTile('🔺', 'Cell Max', bf('bat_cellmax', 'battery_max_cell'), 'V')
        + this._wTile('🔻', 'Cell Min', bf('bat_cellmin', 'battery_min_cell'), 'V'))
      + this._wHead('Temps')
      + this._wGrid(3,
        this._wTile('🌡️', 'Temp 1', bf('bat_temp1', 'battery_temp1'), '°C')
        + this._wTile('🌡️', 'Temp 2', bf('bat_temp2', 'battery_temp2'), '°C')
        + this._wTile('🌡️', 'MOS', bf('bat_mos', 'battery_mos'), '°C'))
      + this._wHead('Charge Controls')
      + this._wGrid(3,
        this._wToggleTile('⚡', 'Charge', c.bat_charge_enable || '')
        + this._wToggleTile('🔌', 'Discharge', c.bat_discharge_enable || '')
        + this._wToggleTile('🔋', 'Force chg', c.bat_force_charge || ''))
      + this._wSlider('🎯', 'Charge SoC limit', c.bat_soc_limit || '', 0, 100, 1, '%');
  }

  /* ── AUTOMATION view: scenes + relays + automations + Alexa + Tuya timers ── */
  _viewAutomation() {
    const c = this.config;
    /* auto-discover: all scenes + automations + switches */
    if (this._autoOn('automation')) {
      const scenes = this._discover([{ domain: 'scene' }]);
      const sceneBtns = scenes.length ? this._wScenes(scenes.map(id => ['🎬', this._name(id), id]))
        : '<div class="hint" style="opacity:.6">No scenes found.</div>';
      return this._wHead('Scenes (auto)')
        + sceneBtns
        + this._wHead('Automations (auto)')
        + this._discoverToggles([{ domain: 'automation' }], 3, () => '⚙️')
        + this._wHead('Switches (auto)')
        + this._discoverToggles([{ domain: 'switch', exclude_dc: ['outlet'] }], 4, () => '🔌')
        + this._wHead('Helpers (auto)')
        + this._discoverToggles([{ domain: 'input_boolean' }], 3, () => '🎚️');
    }
    return this._wHead('Scenes')
      + this._wScenes([
        ['🌙', 'Good Night', c.auto_scene_night || ''],
        ['☀️', 'Morning', c.auto_scene_morning || ''],
        ['🚪', 'Away', c.auto_scene_away || ''],
        ['🎬', 'Movie', c.auto_scene_movie || ''],
        ['🎉', 'Party', c.auto_scene_party || ''],
        ['🏠', 'Home', c.auto_scene_home || ''],
      ])
      + this._wHead('Relays')
      + this._wGrid(4,
        this._wToggleTile('1️⃣', c.auto_relay1_name || (c.auto_relay1 ? this._name(c.auto_relay1) : 'Relay 1'), c.auto_relay1 || '')
        + this._wToggleTile('2️⃣', c.auto_relay2_name || (c.auto_relay2 ? this._name(c.auto_relay2) : 'Relay 2'), c.auto_relay2 || '')
        + this._wToggleTile('3️⃣', c.auto_relay3_name || (c.auto_relay3 ? this._name(c.auto_relay3) : 'Relay 3'), c.auto_relay3 || '')
        + this._wToggleTile('4️⃣', c.auto_relay4_name || (c.auto_relay4 ? this._name(c.auto_relay4) : 'Relay 4'), c.auto_relay4 || ''))
      + (() => {
          const ex = [1, 2, 3, 4, 5, 6].map(n => {
            const id = c[`auto_extra_${n}_entity`];
            return id ? this._wToggleTile('⚙️', c[`auto_extra_${n}_name`] || this._name(id), id) : '';
          }).filter(Boolean).join('');
          return ex ? this._wHead('More') + this._wGrid(4, ex) : '';
        })()
      + this._wHead('Automations')
      + this._wGrid(3,
        this._wToggleTile('💡', 'Motion', c.auto_motion_lights || '')
        + this._wToggleTile('🌇', 'Sunset', c.auto_sunset_lights || '')
        + this._wToggleTile('🚪', 'Door', c.auto_door_alerts || '')
        + this._wToggleTile('🪫', 'Low-batt', c.auto_low_batt || '')
        + this._wToggleTile('🔥', 'Smoke→fan', c.auto_smoke_fan || ''))
      + this._wHead('Modes')
      + this._wGrid(3,
        this._wToggleTile('🌙', 'Night', c.auto_night_mode || '')
        + this._wToggleTile('✈️', 'Vacation', c.auto_vacation_mode || '')
        + this._wToggleTile('👤', 'Guest', c.auto_guest_mode || ''))
      + this._wHead('Voice (Alexa)')
      + this._wGrid(2,
        this._wButtonTile('🗣️', 'Lights off', c.auto_alexa || '', 'Send')
        + this._wButtonTile('🗣️', 'Good night', c.auto_alexa || '', 'Send'))
      + this._wHead('Tuya Timers')
      + this._wTimer('Outlet 1', c.tuya_sw1 || '', c.tuya_sw1_on || '', c.tuya_sw1_off || '', c.tuya_sw1_timer || '')
      + this._wTimer('Outlet 2', c.tuya_sw2 || '', c.tuya_sw2_on || '', c.tuya_sw2_off || '', c.tuya_sw2_timer || '');
  }

  /* ── LIGHTING view: lights with brightness + scenes ── */
  _viewLighting() {
    const c = this.config;
    /* auto-discover: all light entities (each gets brightness control) */
    if (this._autoOn('lighting')) {
      const lights = this._discover([{ domain: 'light' }]);
      let rows = lights.length ? lights.map(id => this._wLight(this._name(id), id)).join('') : '<div class="hint" style="opacity:.6">No light entities found.</div>';
      return this._wHead('Lights (auto)')
        + rows
        + this._wHead('All Lights')
        + this._wGrid(3,
          this._wButtonTile('🔆', 'All On', c.light_all_on || '', 'On')
          + this._wButtonTile('🌑', 'All Off', c.light_all_off || '', 'Off')
          + this._wToggleTile('🔄', 'Adaptive', c.light_adaptive || ''));
    }
    const grp = (head, body) => body ? this._wHead(head) + body : '';
    const lights = [
      c.light1       && this._wLight(c.light1_name       || this._name(c.light1), c.light1),
      c.light2       && this._wLight(c.light2_name       || this._name(c.light2), c.light2),
      c.light3       && this._wLight(c.light3_name       || this._name(c.light3), c.light3),
      c.light_zigbee && this._wLight(c.light_zigbee_name || this._name(c.light_zigbee), c.light_zigbee),
      ...[1, 2, 3, 4, 5, 6].map(n => {
        const id = c[`light_extra_${n}_entity`];
        return id ? this._wLight(c[`light_extra_${n}_name`] || this._name(id), id) : '';
      }),
    ].filter(Boolean).join('');
    const all = [
      c.light_all_on   && this._wButtonTile('🔆', 'All On', c.light_all_on, 'On'),
      c.light_all_off  && this._wButtonTile('🌑', 'All Off', c.light_all_off, 'Off'),
      c.light_adaptive && this._wToggleTile('🔄', 'Adaptive', c.light_adaptive),
    ].filter(Boolean).join('');
    const out = grp('Lights', lights) + grp('All Lights', all ? this._wGrid(3, all) : '');
    return out || '<div class="hint" style="opacity:.6;padding:18px">No lighting entities configured. Add them in the editor → Lighting View.</div>';
  }

  /* ── SYSTEM view: server, ESP board, device status, temps ── */
  _viewSystem() {
    const c = this.config;
    /* same inheritance pattern as _viewBattery/_viewEnergy */
    const bf = (sysKey, mainKey) => (c[sysKey] && this._stateObj(c[sysKey])) ? c[sysKey] : (c[mainKey] || '');
    return this._wHead('Inverter & ESP')
      + this._wGrid(4,
        this._wTile('🌡️', 'Inv Temp', bf('sys_inv_temp', 'inv_temp'), '°C')
        + this._wTile('⚙️', 'Mode', bf('sys_work_mode', 'inverter_state'))
        + this._wTile('📟', 'C3', c.sys_c3_status || '')
        + this._wTile('🌡️', 'Board', c.sys_board_temp || '', '°C')
        + this._wTile('💨', 'Gas', c.sys_gas || '', 'ppm')
        + this._wTile('💡', 'Lux', c.sys_lux || '', 'lx')
        + this._wTile('📶', 'WiFi', c.sys_wifi || '', 'dBm')
        + this._wTile('🔌', 'Grid kWh', bf('sys_grid_meter', 'grid_active_power')))
      + this._wHead('Server')
      + this._wGrid(4,
        this._wTile('💾', 'CPU', c.sys_cpu || '', '%')
        + this._wTile('🧠', 'Memory', c.sys_memory || '', '%')
        + this._wTile('💿', 'Disk', c.sys_disk || '', '%')
        + this._wTile('⏱️', 'Uptime', c.sys_uptime || ''));
  }


  /* ═══════════════════════ POPUPS (more-info, PV voltage, tile control) ═══════════════════════ */
  /* Live camera feed without go2rtc: ask HA to sign the MJPEG stream proxy path for this
     camera entity, so the browser can render it directly as a continuous <img> stream
     (no JS polling needed — multipart MJPEG updates itself). Falls back to a periodically
     refreshed snapshot (entity_picture) if signing isn't available, e.g. very old HA.
     Resolved URLs are cached briefly so re-rendering the view each tick doesn't re-sign
     (and reconnect the stream) every time. */
  async _resolveCameraStream(entityId, forFullscreen = false) {
    if (!this._hass || !entityId) return null;
    const cache = this._camStreamCache || (this._camStreamCache = {});
    const hit = cache[entityId];
    if (hit && hit.expiresAt > Date.now() + 10000 && !forFullscreen) return hit.url;
    try {
      const ttl = forFullscreen ? 300 : 55;
      const res = await this._hass.callWS({
        type: 'auth/sign_path',
        path: `/api/camera_proxy_stream/${entityId}`,
        expires: ttl,
      });
      if (res && res.path) {
        const url = this._hass.hassUrl ? this._hass.hassUrl(res.path) : res.path;
        if (!forFullscreen) cache[entityId] = { url, expiresAt: Date.now() + ttl * 1000, mjpeg: true };
        return url;
      }
    } catch (e) { /* fall through to snapshot */ }
    const pic = this._attr(entityId, 'entity_picture');
    const url = pic ? (this._hass.hassUrl ? this._hass.hassUrl(pic) : pic) : null;
    if (url && !forFullscreen) cache[entityId] = { url, expiresAt: Date.now() + 5000, mjpeg: false };
    return url;
  }
  /* set/refresh every fallback camera <img> on the dashboard; called once after each
     render. Reuses the cached URL (see above) so an MJPEG stream isn't restarted every tick. */
  _refreshCameraStreams() {
    const imgs = this.shadowRoot.querySelectorAll('img.camStream[data-cam-id]');
    imgs.forEach(img => {
      const id = img.dataset.camId;
      if (!id) return;
      this._resolveCameraStream(id).then(url => {
        if (!url || !img.isConnected) return;
        if (img.src !== url) img.src = url;
      });
    });
  }
  _openCameraFullscreen(entityId, label, go2rtcUrl) {
    const ov = document.createElement('div');
    ov.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.18);display:flex;align-items:center;justify-content:center';
    ov.innerHTML = `<div style="position:relative;width:min(92vw,1280px);aspect-ratio:16/9;background:#000;border-radius:14px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.6);border:1px solid rgba(120,180,255,.3)">
      <div id="camFsBody" style="width:100%;height:100%"></div>
      <div style="position:absolute;top:10px;left:14px;font-size:14px;font-weight:700;color:#eaf4ff;text-shadow:0 1px 4px #000">${esc(label)}</div>
      <div id="camFsClose" style="position:absolute;top:8px;right:8px;width:34px;height:34px;border-radius:50%;background:rgba(0,0,0,.5);color:#eaf4ff;display:flex;align-items:center;justify-content:center;font-size:18px;cursor:pointer">✕</div>
    </div>`;
    const close = this._hostOverlay(ov);
    ov.addEventListener('click', e => { if (e.target === ov || e.target.id === 'camFsClose') close(); });
    const body = ov.querySelector('#camFsBody');
    if (go2rtcUrl) {
      body.innerHTML = `<iframe src="${esc(go2rtcUrl)}" allowfullscreen style="width:100%;height:100%;border:none"></iframe>`;
    } else {
      const img = document.createElement('img');
      img.style.cssText = 'width:100%;height:100%;object-fit:contain;background:#000';
      body.appendChild(img);
      this._resolveCameraStream(entityId, true).then(url => { if (url) img.src = url; });
    }
  }

  _fireMoreInfo(entityId) {
    this.dispatchEvent(new CustomEvent('hass-more-info',
      { detail: { entityId }, bubbles: true, composed: true }));
  }

  /* ── collapsible right-column tiles: shrink to a labelled tab anchored to
     the tile's own right edge (left increases as width shrinks), or restore
     to original geometry. Each tile is independent — no shared/synced state. ── */
  _setCollapsed(box, collapsed) {
    if (!box) return;
    if (box.dataset.origLeft === undefined) {
      box.dataset.origLeft = parseFloat(box.style.left);
      box.dataset.origWidth = parseFloat(box.style.width);
    }
    const origLeft = parseFloat(box.dataset.origLeft), origWidth = parseFloat(box.dataset.origWidth);
    const TABW = 34;
    box.classList.toggle('collapsed', collapsed);
    box.style.width = (collapsed ? TABW : origWidth) + 'px';
    box.style.left = (collapsed ? (origLeft + origWidth - TABW) : origLeft) + 'px';
  }

  /* ── left nav rail: one master toggle collapses ALL 9 tiles together to
     icon-only width, or restores full icon+label width. Left edge stays
     fixed (mirrors the right-column tiles, which anchor their right edge). ── */
  _setNavCompact(folded) {
    this._navCompact = folded;
    const N = SL.nav.tops.length;   // total nav tiles (9)
    const KEEP = 3;                 // first tiles that remain visible when folded
    this.shadowRoot.querySelectorAll('.navtile').forEach(t => {
      const i = +t.dataset.i;
      if (!folded) { t.classList.remove('folded'); t.style.transform = ''; t.style.opacity = ''; return; }
      if (i < KEEP) {
        // slide down into the bottom slot vacated by the hidden tiles
        const dy = SL.nav.tops[(N - KEEP) + i] - SL.nav.tops[i];
        t.classList.remove('folded');
        t.style.transform = `translateY(${dy}px)`;
        t.style.opacity = '1';
      } else {
        t.classList.add('folded');  // tiles 4..N hide
        t.style.transform = '';
        t.style.opacity = '';
      }
    });
    // slider button stays fixed at the bottom; only its glyph flips
    this._setTxt('#navToggleIcon', folded ? '\u25B4' : '\u25BE');
  }

  /* ── host-mounted overlay: mounts to document.body so modals escape the
     scaled .scaler / shadow DOM and render at true viewport size.
     Returns a close() that removes the node and untracks it. ── */
  /* Scoped accessibility pass: the card's interactive elements are plain <div>s
     identified by a small set of data-* hooks (already used consistently for click
     binding) rather than native <button>/<input> elements, so they're invisible to
     keyboard/screen-reader users by default. This assigns the right ARIA role +
     tabindex to each known pattern and makes Enter/Space activate them like a real
     button would. Not a full WCAG pass (focus order inside popups, live-region value
     announcements, etc. aren't covered) — but it makes every tap-target reachable and
     operable from a keyboard, which it wasn't at all before. Idempotent: safe to call
     after every re-render. */
  _a11yPass(root) {
    const r = root || this.shadowRoot;
    const switches = r.querySelectorAll('[data-toggle]');
    switches.forEach(el => {
      el.setAttribute('role', 'switch');
      el.setAttribute('aria-checked', el.classList.contains('on') ? 'true' : 'false');
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
    });
    const buttons = r.querySelectorAll('[data-more], [data-press], [data-scene], [data-cam-tap], .flipbtn, .tap, .navtile, .bottile, .stattile');
    buttons.forEach(el => {
      if (!el.hasAttribute('role')) el.setAttribute('role', 'button');
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
    });
    const selects = r.querySelectorAll('[data-select]');
    selects.forEach(el => { if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0'); });
    if (this._a11yKeyBound) return;
    this._a11yKeyBound = true;
    this.shadowRoot.addEventListener('keydown', e => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const el = e.target.closest('[role="button"],[role="switch"]');
      if (!el) return;
      e.preventDefault();
      el.click();
    });
  }

  _hostOverlay(node) {
    /* tagged so a future mount can sweep up any overlay left behind by an abnormal
       teardown (e.g. the card unloads before disconnectedCallback fires) — these mount
       on document.body, outside the card's own subtree, so normal DOM removal of the
       card element doesn't clean them up on its own. */
    node.classList.add('cl-overlay');
    (this._overlays || (this._overlays = [])).push(node);
    document.body.appendChild(node);
    return () => { node.remove(); this._overlays = (this._overlays || []).filter(n => n !== node); };
  }

  /* ── generic confirm sheet (host-mounted, inline-styled, lives outside the
     shadow DOM). onConfirm() runs only on accept. ── */
  _confirmSheet({ glyph, title, sub, btnText, col, onConfirm }) {
    const ov = document.createElement('div');
    ov.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.18);backdrop-filter:none;-webkit-backdrop-filter:none;display:flex;align-items:center;justify-content:center';
    ov.innerHTML =
      '<style>@keyframes clSlUp{from{transform:translateY(18px);opacity:0}to{transform:translateY(0);opacity:1}}</style>'
      + '<div style="background:linear-gradient(160deg,#1a2a40,#0d1a2e);border:1px solid rgba(255,255,255,.12);border-radius:20px;padding:24px 28px 20px;min-width:240px;max-width:300px;box-shadow:0 24px 60px rgba(0,0,0,.65);text-align:center;animation:clSlUp .18s ease">'
      +   '<div style="font-size:34px;margin-bottom:6px">' + glyph + '</div>'
      +   '<div style="font-size:15px;font-weight:700;color:#fff;margin-bottom:4px">' + esc(title) + '</div>'
      +   '<div style="font-size:12px;color:rgba(255,255,255,.45);margin-bottom:20px">' + esc(sub) + '</div>'
      +   '<div style="display:flex;gap:10px">'
      +     '<button id="clNo" style="flex:1;padding:11px 0;border-radius:12px;border:none;cursor:pointer;background:rgba(255,255,255,.08);color:rgba(255,255,255,.6);font-size:13px;font-weight:700">Cancel</button>'
      +     '<button id="clYes" style="flex:1;padding:11px 0;border-radius:12px;border:1.5px solid ' + col + ';cursor:pointer;background:' + col + '22;color:' + col + ';font-size:13px;font-weight:700">' + esc(btnText) + '</button>'
      +   '</div></div>';
    const close = this._hostOverlay(ov);
    ov.addEventListener('click', e => { if (e.target === ov || e.target.id === 'clNo') close(); });
    ov.querySelector('#clYes').addEventListener('click', () => { close(); onConfirm(); });
  }

  /* toggle-specific confirm (used by bottom-tile switches) */
  _confirmAction(label, isOn, onConfirm) {
    this._confirmSheet({
      glyph: isOn ? '\u{1F534}' : '\u{1F7E2}',
      title: (isOn ? 'Turn Off ' : 'Turn On ') + (label || 'device') + '?',
      sub: 'Confirm to ' + (isOn ? 'turn off' : 'turn on') + ' this device',
      btnText: isOn ? 'Turn Off' : 'Turn On',
      col: isOn ? 'rgba(255,90,90,1)' : 'rgba(60,220,120,1)',
      onConfirm,
    });
  }

  /* ── host-mounted info card: title + label/value rows (for WiFi/Bluetooth). ── */
  _statusPopup(title, rows) {
    const ov = document.createElement('div');
    ov.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.18);backdrop-filter:none;-webkit-backdrop-filter:none;display:flex;align-items:center;justify-content:center';
    const body = rows.length
      ? rows.map(([l, v, col]) =>
          '<div style="display:flex;justify-content:space-between;gap:18px;padding:8px 2px;border-bottom:1px solid rgba(150,200,255,.1)">'
          + '<span style="font-size:12px;color:#a8cae6">' + esc(l) + '</span>'
          + '<span style="font-size:14px;font-weight:650;color:' + (col || '#d8eeff') + '">' + esc(String(v)) + '</span></div>').join('')
      : '<div style="text-align:center;color:#7fa3c4;font-size:13px;padding:14px 0">No entity assigned</div>';
    ov.innerHTML =
      '<style>@keyframes clSlUp{from{transform:translateY(18px);opacity:0}to{transform:translateY(0);opacity:1}}</style>'
      + '<div style="background:linear-gradient(160deg,#1a2a40,#0d1a2e);border:1px solid rgba(120,180,255,.4);border-radius:18px;padding:18px 20px;min-width:260px;max-width:320px;box-shadow:0 24px 60px rgba(0,0,0,.65);animation:clSlUp .18s ease">'
      +   '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">'
      +     '<span style="color:#fff;font-size:14px;font-weight:700;letter-spacing:.04em">' + esc(title) + '</span>'
      +     '<span id="spClose" style="color:#a8cae6;font-size:22px;cursor:pointer;line-height:1">\u00d7</span></div>'
      +   body + '</div>';
    const close = this._hostOverlay(ov);
    ov.addEventListener('click', e => { if (e.target === ov || e.target.id === 'spClose') close(); });
  }

  /* ── Home Assistant power menu: restart core / reboot host / shut down, each
     guarded by a confirm sheet. ── */
  _powerMenu() {
    const ov = document.createElement('div');
    ov.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.18);backdrop-filter:none;-webkit-backdrop-filter:none;display:flex;align-items:center;justify-content:center';
    const item = (id, glyph, label, sub, col) =>
      '<div id="' + id + '" style="display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:12px;cursor:pointer;background:rgba(255,255,255,.04);border:1px solid rgba(150,200,255,.12);margin-bottom:8px">'
      + '<span style="font-size:20px">' + glyph + '</span>'
      + '<div style="text-align:left"><div style="font-size:14px;font-weight:700;color:' + col + '">' + label + '</div>'
      + '<div style="font-size:11px;color:rgba(255,255,255,.45)">' + sub + '</div></div></div>';
    ov.innerHTML =
      '<style>@keyframes clSlUp{from{transform:translateY(18px);opacity:0}to{transform:translateY(0);opacity:1}}</style>'
      + '<div style="background:linear-gradient(160deg,#1a2a40,#0d1a2e);border:1px solid rgba(120,180,255,.4);border-radius:18px;padding:18px 18px 14px;min-width:280px;max-width:320px;box-shadow:0 24px 60px rgba(0,0,0,.65);animation:clSlUp .18s ease">'
      +   '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">'
      +     '<span style="color:#fff;font-size:14px;font-weight:700;letter-spacing:.04em">HOME ASSISTANT</span>'
      +     '<span id="pmClose" style="color:#a8cae6;font-size:22px;cursor:pointer;line-height:1">\u00d7</span></div>'
      +   item('pmRestart', '\u{1F504}', 'Restart Home Assistant', 'Core reloads (~30s)', '#ffd24a')
      +   item('pmReboot',  '\u{1F501}', 'Reboot Host', 'Full HAOS restart', '#ff8a5a')
      +   item('pmShutdown','\u23FB',    'Shut Down Host', 'Powers off the system', '#ff5a5a')
      + '</div>';
    const close = this._hostOverlay(ov);
    ov.addEventListener('click', e => { if (e.target === ov || e.target.id === 'pmClose') close(); });
    ov.querySelector('#pmRestart').addEventListener('click', () => { close(); this._confirmSheet({ glyph: '\u{1F504}', title: 'Restart Home Assistant?', sub: 'Core will be unavailable for ~30 seconds', btnText: 'Restart', col: 'rgba(255,180,60,1)', onConfirm: () => this._hass.callService('homeassistant', 'restart', {}) }); });
    ov.querySelector('#pmReboot').addEventListener('click', () => { close(); this._confirmSheet({ glyph: '\u{1F501}', title: 'Reboot Host?', sub: 'The whole system will restart', btnText: 'Reboot', col: 'rgba(255,138,90,1)', onConfirm: () => this._hass.callService('hassio', 'host_reboot', {}) }); });
    ov.querySelector('#pmShutdown').addEventListener('click', () => { close(); this._confirmSheet({ glyph: '\u23FB', title: 'Shut Down Host?', sub: 'System powers off — manual restart needed', btnText: 'Shut Down', col: 'rgba(255,90,90,1)', onConfirm: () => this._hass.callService('hassio', 'host_shutdown', {}) }); });
  }

  /* ── month calendar popup (host-mounted): grid + event dots + month event
     list, prev/next navigation. Events fetched from configured calendar
     entities via the REST calendars endpoint. ── */
  _calendarPopup() {
    this._calMonth = new Date(); this._calMonth.setDate(1);
    const ov = document.createElement('div');
    ov.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.18);backdrop-filter:none;-webkit-backdrop-filter:none;display:flex;align-items:center;justify-content:center';
    ov.innerHTML = '<style>@keyframes clSlUp{from{transform:translateY(18px);opacity:0}to{transform:translateY(0);opacity:1}}'
      + '.cl-cal-day{aspect-ratio:1;display:flex;flex-direction:column;align-items:center;justify-content:center;border-radius:9px;font-size:14px;color:#cfe0f2;cursor:default;position:relative}'
      + '.cl-cal-day.dow{color:#5e83a6;font-size:10px;font-weight:700;letter-spacing:.5px;aspect-ratio:auto;padding:2px 0}'
      + '.cl-cal-day.today{background:rgba(60,160,255,.28);color:#fff;font-weight:700}'
      + '.cl-cal-day.sel{outline:1.5px solid rgba(120,200,255,.7)}'
      + '.cl-cal-day .dot{position:absolute;bottom:5px;width:5px;height:5px;border-radius:50%;background:#39d353}'
      + '.cl-ev{display:flex;gap:10px;padding:8px 4px;border-bottom:1px solid rgba(150,200,255,.1)}'
      + '</style>'
      + '<div style="background:linear-gradient(160deg,#1a2a40,#0d1a2e);border:1px solid rgba(120,180,255,.4);border-radius:20px;padding:18px 20px;width:340px;max-width:92%;box-shadow:0 24px 60px rgba(0,0,0,.65);animation:clSlUp .18s ease">'
      +   '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">'
      +     '<span id="calPrev" style="cursor:pointer;color:#a8cae6;font-size:20px;padding:0 8px">\u2039</span>'
      +     '<span id="calTitle" style="color:#fff;font-size:15px;font-weight:700;letter-spacing:.03em"></span>'
      +     '<span id="calNext" style="cursor:pointer;color:#a8cae6;font-size:20px;padding:0 8px">\u203a</span>'
      +     '<span id="calClose" style="position:absolute;right:18px;top:14px;color:#7fa3c4;font-size:22px;cursor:pointer">\u00d7</span></div>'
      +   '<div id="calClock" style="text-align:center;color:#7fa3c4;font-size:12px;margin-bottom:10px"></div>'
      +   '<div id="calGrid" style="display:grid;grid-template-columns:repeat(7,1fr);gap:3px"></div>'
      +   '<div id="calEvents" style="margin-top:12px;max-height:150px;overflow-y:auto"></div>'
      + '</div>';
    const close = this._hostOverlay(ov);
    ov.addEventListener('click', e => { if (e.target === ov || e.target.id === 'calClose') close(); });
    ov.querySelector('#calPrev').addEventListener('click', () => { this._calMonth.setMonth(this._calMonth.getMonth() - 1); this._renderCalendar(ov); });
    ov.querySelector('#calNext').addEventListener('click', () => { this._calMonth.setMonth(this._calMonth.getMonth() + 1); this._renderCalendar(ov); });
    const now = new Date();
    ov.querySelector('#calClock').textContent = now.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) + '  \u00b7  ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this._renderCalendar(ov);
  }

  async _renderCalendar(ov) {
    const m = this._calMonth, year = m.getFullYear(), month = m.getMonth();
    const today = new Date();
    const first = new Date(year, month, 1), days = new Date(year, month + 1, 0).getDate();
    const lead = first.getDay();
    ov.querySelector('#calTitle').textContent = m.toLocaleDateString([], { month: 'long', year: 'numeric' });
    const dows = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    let cells = dows.map(d => `<div class="cl-cal-day dow">${d}</div>`).join('');
    for (let i = 0; i < lead; i++) cells += '<div class="cl-cal-day"></div>';
    for (let d = 1; d <= days; d++) {
      const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
      cells += `<div class="cl-cal-day${isToday ? ' today' : ''}" data-day="${d}">${d}<span class="dot" style="display:none"></span></div>`;
    }
    ov.querySelector('#calGrid').innerHTML = cells;
    const evBox = ov.querySelector('#calEvents');
    const cals = this.config.calendar_entities || [];
    if (!cals.length) { evBox.innerHTML = '<div style="text-align:center;color:#7fa3c4;font-size:12px;padding:8px 0">No calendars configured</div>'; return; }
    evBox.innerHTML = '<div style="text-align:center;color:#7fa3c4;font-size:12px;padding:8px 0">Loading events\u2026</div>';
    const start = new Date(year, month, 1).toISOString(), end = new Date(year, month + 1, 0, 23, 59, 59).toISOString();
    let events = [];
    try {
      const all = await Promise.all(cals.map(c => this._hass.callApi('GET', `calendars/${encodeURIComponent(c)}?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`).catch(() => [])));
      events = all.flat().filter(Boolean);
    } catch (e2) { console.warn('casa-luna: calendar fetch failed', e2); events = []; }
    if (this._calMonth.getMonth() !== month || this._calMonth.getFullYear() !== year) return;  // user navigated away
    const byDay = {};
    events.forEach(e => {
      const ds = e.start?.dateTime || e.start?.date; if (!ds) return;
      const dt = new Date(ds); if (dt.getMonth() === month && dt.getFullYear() === year) (byDay[dt.getDate()] ||= []).push({ dt, allDay: !e.start?.dateTime, summary: e.summary || '(no title)' });
    });
    Object.keys(byDay).forEach(d => { const cell = ov.querySelector(`[data-day="${d}"] .dot`); if (cell) cell.style.display = 'block'; });
    const renderList = (filterDay) => {
      const list = Object.entries(byDay).filter(([d]) => !filterDay || +d === filterDay)
        .flatMap(([d, evs]) => evs.map(ev => ({ d: +d, ...ev }))).sort((a, b) => a.dt - b.dt);
      evBox.innerHTML = list.length ? list.map(ev =>
        `<div class="cl-ev"><span style="color:#5bc8ff;font-size:12px;min-width:54px;font-weight:600">${ev.allDay ? String(ev.d).padStart(2, '0') + ' all-day' : ev.dt.toLocaleDateString([], { day: '2-digit' }) + ' ' + ev.dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>`
        + `<span style="color:#d8eeff;font-size:13px">${esc(ev.summary)}</span></div>`).join('')
        : '<div style="text-align:center;color:#7fa3c4;font-size:12px;padding:8px 0">No events</div>';
    };
    renderList(null);
    ov.querySelectorAll('[data-day]').forEach(cell => cell.addEventListener('click', () => {
      ov.querySelectorAll('.cl-cal-day').forEach(c => c.classList.remove('sel'));
      cell.classList.add('sel'); renderList(+cell.dataset.day);
    }));
  }

  /* ── weather details popup (host-mounted): current conditions + forecast. ── */
  _weatherPopup() {
    const c = this.config, wEnt = c.weather_entity;
    const stt = this._hass?.states?.[wEnt];
    const EM = { 'clear-night': '\u{1F319}', cloudy: '\u2601\uFE0F', fog: '\u{1F32B}\uFE0F', hail: '\u{1F328}\uFE0F', lightning: '\u{1F329}\uFE0F', 'lightning-rainy': '\u26C8\uFE0F', partlycloudy: '\u26C5', pouring: '\u{1F327}\uFE0F', rainy: '\u{1F327}\uFE0F', snowy: '\u2744\uFE0F', 'snowy-rainy': '\u{1F328}\uFE0F', sunny: '\u2600\uFE0F', windy: '\u{1F4A8}', 'windy-variant': '\u{1F4A8}', exceptional: '\u26A0\uFE0F' };
    const a = stt?.attributes || {};
    const cond = stt?.state || '--';
    const tu = a.temperature_unit || '\u00b0';
    const rows = [];
    const push = (l, v, u = '') => { if (v != null && v !== '') rows.push([l, `${v}${u}`]); };
    push('Humidity', a.humidity, '%');
    push('Pressure', a.pressure, a.pressure_unit ? ' ' + a.pressure_unit : ' hPa');
    push('Wind', a.wind_speed != null ? Math.round(a.wind_speed) : null, (a.wind_speed_unit ? ' ' + a.wind_speed_unit : ' km/h') + (a.wind_bearing != null ? ' ' + this._dirFromDeg(+a.wind_bearing) : ''));
    push('Visibility', a.visibility, a.visibility_unit ? ' ' + a.visibility_unit : ' km');
    push('Feels like', a.apparent_temperature != null ? Math.round(a.apparent_temperature) : null, tu);
    push('UV index', a.uv_index);
    const fc = Array.isArray(a.forecast) ? a.forecast.slice(0, 5) : [];
    const fcHtml = fc.map(f => {
      const d = new Date(f.datetime);
      const lbl = f.templow != null ? d.toLocaleDateString([], { weekday: 'short' }) : d.toLocaleTimeString([], { hour: '2-digit' });
      const hi = f.temperature != null ? Math.round(f.temperature) + '\u00b0' : '--';
      const lo = f.templow != null ? `<span style="color:#7fa3c4">${Math.round(f.templow)}\u00b0</span>` : '';
      return `<div style="flex:1;text-align:center"><div style="font-size:10px;color:#a8cae6">${lbl}</div>
        <div style="font-size:20px;margin:2px 0">${EM[f.condition] || '\u00b7'}</div>
        <div style="font-size:12px;font-weight:650;color:#eaf4ff">${hi}</div>${lo ? `<div style="font-size:11px">${lo}</div>` : ''}</div>`;
    }).join('');
    const ov = document.createElement('div');
    ov.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.18);backdrop-filter:none;-webkit-backdrop-filter:none;display:flex;align-items:center;justify-content:center';
    ov.innerHTML = '<style>@keyframes clSlUp{from{transform:translateY(18px);opacity:0}to{transform:translateY(0);opacity:1}}</style>'
      + '<div style="background:linear-gradient(160deg,#1a2a40,#0d1a2e);border:1px solid rgba(120,180,255,.4);border-radius:20px;padding:18px 20px;width:330px;max-width:92%;box-shadow:0 24px 60px rgba(0,0,0,.65);animation:clSlUp .18s ease;position:relative">'
      +   '<span id="wxClose" style="position:absolute;right:16px;top:12px;color:#7fa3c4;font-size:22px;cursor:pointer">\u00d7</span>'
      +   `<div style="display:flex;align-items:center;gap:12px;margin-bottom:14px"><div style="font-size:40px">${EM[cond] || '\u26C5'}</div>`
      +     `<div><div style="font-size:30px;font-weight:800;color:#eaf4ff;line-height:1">${a.temperature != null ? Math.round(a.temperature) + tu : '--'}</div>`
      +     `<div style="font-size:13px;color:#a8cae6;text-transform:capitalize">${esc(String(cond).replace(/_|-/g, ' '))}</div></div></div>`
      +   (rows.length ? rows.map(([l, v]) => `<div style="display:flex;justify-content:space-between;padding:6px 2px;border-bottom:1px solid rgba(150,200,255,.1)"><span style="font-size:12px;color:#a8cae6">${l}</span><span style="font-size:13px;font-weight:650;color:#d8eeff">${esc(v)}</span></div>`).join('') : '')
      +   (fcHtml ? `<div style="display:flex;gap:4px;margin-top:14px">${fcHtml}</div>` : (stt ? '' : '<div style="text-align:center;color:#7fa3c4;font-size:12px;padding:8px 0">No weather entity configured</div>'))
      + '</div>';
    const close = this._hostOverlay(ov);
    ov.addEventListener('click', e => { if (e.target === ov || e.target.id === 'wxClose') close(); });
  }

  /* ── header status icons: per-role colour from live state ── */
  _iconColor(role) {
    const c = this.config, dim = '#5a7a9a';
    const live = (id) => { const s = this._st(id); return s != null && !['unavailable', 'unknown', ''].includes(String(s).toLowerCase()); };
    if (role === 'wifi') {
      const id = c.sys_wifi; if (!id || !live(id)) return dim;
      const n = this._num(id, NaN);                       // RSSI in dBm (negative)
      if (Number.isFinite(n) && n < 0) return n >= -60 ? '#39d353' : n >= -75 ? '#ffd24a' : '#ff5a5a';
      return ['on', 'connected', 'home', 'true'].includes(String(this._st(id)).toLowerCase()) ? '#39d353' : '#ff5a5a';
    }
    if (role === 'bt') {
      const id = c.sys_bluetooth; if (!id || !live(id)) return dim;
      const st = String(this._st(id)).toLowerCase();
      const n = this._num(id, NaN);
      if (['on', 'connected', 'true'].includes(st) || (Number.isFinite(n) && n > 0)) return '#39d353';
      return dim;
    }
    if (role === 'cam') {
      const cams = [c.sec_cam1, c.sec_cam2].filter(Boolean);
      if (!cams.length) return dim;
      const states = cams.map(id => String(this._st(id) ?? '').toLowerCase());
      if (states.some(s => ['streaming', 'recording', 'idle', 'on'].includes(s))) return '#39d353';
      if (states.every(s => ['unavailable', 'unknown', ''].includes(s))) return '#ff5a5a';
      return '#ffd24a';
    }
    /* power: green when CPU healthy (if bound), else neutral cyan = system up */
    if (role === 'power') {
      const id = c.sys_cpu; if (id && live(id)) { const n = this._num(id, 0); return n < 70 ? '#39d353' : n < 90 ? '#ffd24a' : '#ff5a5a'; }
      return '#22c3ff';
    }
    return dim;
  }

  _updateStatusIcons() {
    ['wifi', 'power', 'bt', 'cam'].forEach(role => {
      const el = this._q('#si_' + role);
      if (el) el.style.color = this._iconColor(role);
    });
  }

  _tapTile(n) {
    const id = this.config[`_extra_tile_${n}_entity`];
    if (!id) return;
    this._tilePopup(n);
  }

  /* ── Bottom-tile popup: domain-aware control sheet ──
     switch/outlet → big toggle. (Other domains added incrementally.) */
  _tilePopup(n) {
    const c = this.config;
    const id = c[`_extra_tile_${n}_entity`];
    if (!id) return;
    const dom = id.split('.')[0];
    const root = this.shadowRoot.querySelector('.scaler') || this.shadowRoot;
    const existing = root.querySelector('#tilePopup');
    if (existing) existing.remove();

    const label = c[`_extra_tile_${n}_label`] || this._name(id) || 'Device';
    const st = this._st(id);
    const on = ['on', 'open', 'home', 'unlocked', 'playing', 'heat', 'cool', 'auto'].includes(String(st).toLowerCase());

    /* metric rows (room-card style): power/current/energy/runtime, shown when present */
    const lc = this._lastChanged(id);
    const pwrAttr = this._attr(id, 'current_power_w') ?? this._attr(id, 'power') ?? this._attr(id, 'power_w');
    const curAttr = this._attr(id, 'current_a') ?? this._attr(id, 'current');
    const energyAttr = this._attr(id, 'today_energy_kwh') ?? this._attr(id, 'energy_kwh');
    const metrics = [];
    if (pwrAttr != null) metrics.push(['Power', `${this._dec(pwrAttr)} W`, '#5bc8ff']);
    if (curAttr != null) metrics.push(['Current', `${this._dec(curAttr)} A`, '#5bc8ff']);
    if (energyAttr != null) metrics.push(['Today', `${this._dec(energyAttr)} kWh`, '#ffd24a']);
    if (lc != null) metrics.push([on ? 'On for' : 'Off for', this._durTime(lc), '#a8cae6']);
    if (lc != null) metrics.push(['Changed', this._relTime(lc), '#7fa3c4']);
    const metricRows = metrics.map(([l, v, col]) =>
      `<div style="display:flex;justify-content:space-between;padding:7px 2px;border-bottom:1px solid rgba(150,200,255,.1)">
        <span style="font-size:12px;color:#a8cae6">${l}</span>
        <span style="font-size:14px;font-weight:650;color:${col}">${esc(String(v))}</span></div>`).join('');
    const moreLink = (txt) => `<div id="tpMore" style="margin-top:12px;text-align:center;font-size:12px;color:#5bc8ff;cursor:pointer">${txt}</div>`;

    /* ── room-card dcard: full device card hosted in popup ── */
    const RC = RC_ICONS;
    let dcard = '', extra = '';
    if (dom === 'light') {
      const bri = this._attr(id, 'brightness');
      const briPct = bri != null ? Math.round(bri / 2.55) : (on ? 100 : 0);
      dcard = `
        <div class="dcard ${on ? 'on-y' : ''}" style="width:100%">
          <div class="top-h ${on ? 'bg-y' : ''}">
            <div class="i-ring ${on ? 'ry' : ''}" id="tpRing"><svg id="tpSvg" viewBox="0 0 24 24" width="28" height="28" class="${on ? 'tileBulbOn' : ''}">${RC.bulb}</svg></div>
            <div class="on-badge ${on ? 'ba-y' : 'ba-off'}">${on ? 'ON' : 'OFF'}</div>
          </div>
          <div class="bot-h">
            <div class="c-name">${esc(label)}</div>
            <div class="c-sub ${on ? 'sub-y' : 'sub-off'}" style="display:block">${on ? 'On' : 'Off'}</div>
            <div class="bright-bar-wrap">
              <div class="bright-track" id="tpBriTrack"><div class="bright-fill" id="tpBriFill" style="width:${briPct}%"></div><div class="bright-thumb" id="tpBriThumb" style="left:${briPct}%"></div></div>
              <span class="bright-val" id="tpBriVal">${briPct}%</span>
            </div>
          </div>
        </div>`;
    } else if (dom === 'fan') {
      const pct = this._attr(id, 'percentage');
      dcard = `
        <div class="dcard ${on ? 'on-c' : ''}" style="width:100%">
          <div class="top-h ${on ? 'bg-c' : ''}">
            <div class="i-ring ${on ? 'rc' : ''}" id="tpRing"><svg id="tpSvg" viewBox="0 0 24 24" width="28" height="28" class="${on ? 'tileSpin' : ''}" style="color:${on ? 'rgba(0,225,255,0.95)' : 'rgba(180,180,180,0.45)'}">${RC.fan}</svg></div>
            <div class="on-badge ${on ? 'ba-c' : 'ba-off'}">${on ? 'ON' : 'OFF'}</div>
          </div>
          <div class="bot-h">
            <div class="c-name">${esc(label)}</div>
            <div class="c-sub ${on ? 'sub-c' : 'sub-off'}" style="display:block">${on ? (pct != null ? pct + '%' : 'Running') : 'Off'}</div>
            <div class="spd-open-btn ${on ? 'fan-on' : ''}" id="tpFanToggle">${on ? 'Turn Off' : 'Turn On'}</div>
          </div>
        </div>`;
      extra = `<div style="display:flex;gap:8px;margin-top:12px">
        ${[['Low', 33], ['Med', 66], ['High', 100]].map(([lbl, p]) =>
          `<div class="spd-chip ${pct != null && Math.abs(pct - p) <= 17 ? 'sel' : ''}" data-pct="${p}">${lbl}</div>`).join('')}
      </div>`;
    } else if (dom === 'switch') {
      dcard = `
        <div class="dcard ${on ? 'on-gr' : ''}" style="width:100%">
          <div class="top-h ${on ? 'bg-gr' : ''}">
            <div class="i-ring ${on ? 'rgr' : ''}" id="tpRing"><svg id="tpSvg" viewBox="0 0 24 24" width="28" height="28" class="${on ? 'tileSocketOn' : ''}">${RC.plug}</svg></div>
            <div class="on-badge ${on ? 'ba-gr' : 'ba-off'}">${on ? 'ON' : 'OFF'}</div>
          </div>
          <div class="bot-h">
            <div class="c-name">${esc(label)}</div>
            <div class="c-sub ${on ? 'sub-gr' : 'sub-off'}" style="display:block">${on ? 'On' : 'Off'}</div>
            ${pwrAttr != null ? `<div class="socket-stat"><span class="socket-stat-lbl">POWER</span><span class="socket-stat-val">${this._dec(pwrAttr)} W</span></div>
            <div class="socket-bar"><div class="socket-fill" style="width:${Math.min(100, (+pwrAttr) / 20)}%"></div></div>` : ''}
            <div class="spd-open-btn ${on ? 'fan-on' : ''}" id="tpSwToggle" style="margin-top:6px">${on ? 'Turn Off' : 'Turn On'}</div>
          </div>
        </div>`;
    } else if (dom === 'climate') {
      const cur = this._attr(id, 'current_temperature');
      const target = this._attr(id, 'temperature');
      const modes = this._attr(id, 'hvac_modes') || ['off', 'heat', 'cool', 'auto'];
      const modeBtns = modes.map(m =>
        `<div class="spd-chip ${m === st ? 'sel' : ''}" data-mode="${m}" style="text-transform:capitalize;padding:7px 0;font-size:11px">${m}</div>`).join('');
      dcard = `
        <div style="text-align:center;padding:4px 0 12px">
          <div style="font-size:11px;color:#7fa3c4">CURRENT</div>
          <div style="font-size:30px;font-weight:700;color:#5bc8ff">${cur != null ? (+cur).toFixed(1) + '°' : '--'}</div>
        </div>
        <div style="display:flex;align-items:center;justify-content:center;gap:18px;padding:0 0 14px">
          <div id="tpTempDown" style="width:42px;height:42px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.08);border:1.5px solid rgba(150,200,255,.3);font-size:22px;color:#fff">−</div>
          <div style="text-align:center;min-width:70px"><div style="font-size:10px;color:#7fa3c4">TARGET</div>
            <div id="tpTarget" style="font-size:26px;font-weight:700;color:#ffd24a">${target != null ? (+target).toFixed(1) + '°' : '--'}</div></div>
          <div id="tpTempUp" style="width:42px;height:42px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.08);border:1.5px solid rgba(150,200,255,.3);font-size:22px;color:#fff">+</div>
        </div>
        <div style="display:flex;gap:6px">${modeBtns}</div>`;
    } else if (dom === 'lock') {
      const locked = String(st).toLowerCase() === 'locked';
      dcard = `<div style="display:flex;flex-direction:column;align-items:center;gap:12px;padding:6px 0 14px">
          <div style="font-size:30px;font-weight:700;color:${locked ? '#ff8a5a' : '#5ae06e'}">${locked ? '🔒 Locked' : '🔓 Unlocked'}</div>
          <div id="tpLockBtn" class="spd-open-btn" style="width:auto;padding:10px 28px">${locked ? 'Unlock' : 'Lock'}</div>
        </div>`;
    } else if (dom === 'cover') {
      dcard = `<div style="text-align:center;padding:6px 0 12px"><div style="font-size:26px;font-weight:700;color:${on ? '#5ae06e' : '#7fd4ff'}">${this._cap(st ?? '--')}</div></div>
        <div style="display:flex;gap:8px">
          <div id="tpCoverOpen" class="spd-chip">Open</div><div id="tpCoverStop" class="spd-chip">Stop</div><div id="tpCoverClose" class="spd-chip">Close</div>
        </div>`;
    } else if (dom === 'binary_sensor') {
      const dc = this._attr(id, 'device_class') || '';
      const isOpen = String(st).toLowerCase() === 'on';
      const word = /door|window|opening/.test(dc) ? (isOpen ? 'Open' : 'Closed') : /motion|occupancy|presence/.test(dc) ? (isOpen ? 'Detected' : 'Clear') : (isOpen ? 'On' : 'Off');
      dcard = `<div style="text-align:center;padding:10px 0 14px"><div style="font-size:34px;font-weight:700;color:${isOpen ? '#ff8a5a' : '#5ae06e'}">${word}</div></div>`;
    } else {
      const unit = this._attr(id, 'unit_of_measurement') || '';
      dcard = `<div style="text-align:center;padding:10px 0 14px"><div style="font-size:36px;font-weight:700;color:#5bc8ff">${st ?? '--'}<span style="font-size:16px;color:#a8cae6"> ${esc(unit)}</span></div></div>`;
    }

    const ov = document.createElement('div');
    ov.id = 'tilePopup';
    ov.style.cssText = 'position:absolute;inset:0;z-index:60;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.18)';
    ov.innerHTML = `<div style="min-width:300px;max-width:82%;background:rgba(10,20,38,.97);border:1.5px solid rgba(120,180,255,.4);border-radius:18px;padding:18px 20px;box-shadow:0 12px 44px rgba(0,0,0,.6)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <span style="color:#fff;font-size:15px;font-weight:700;letter-spacing:.04em">${esc(label.toUpperCase())}</span>
        <span id="tpClose" style="color:#a8cae6;font-size:22px;cursor:pointer;line-height:1">×</span>
      </div>
      ${dcard}
      ${extra}
      ${metricRows ? `<div style="margin-top:12px">${metricRows}</div>` : ''}
      ${moreLink('More history ›')}</div>`;

    ov.addEventListener('click', (e) => {
      if (e.target === ov || e.target.id === 'tpClose') { ov.remove(); return; }
      if (e.target.id === 'tpMore') { ov.remove(); this._fireMoreInfo(id); return; }
    });
    // ring/icon tap toggles (light, switch via ring; fan/switch via button)
    ov.querySelector('#tpRing')?.addEventListener('click', () => { this._hass.callService('homeassistant', 'toggle', { entity_id: id }); ov.remove(); });
    ov.querySelector('#tpFanToggle')?.addEventListener('click', () => { this._hass.callService('homeassistant', 'toggle', { entity_id: id }); ov.remove(); });
    ov.querySelector('#tpSwToggle')?.addEventListener('click', () => { ov.remove(); this._confirmAction(label, on, () => this._hass.callService('homeassistant', 'toggle', { entity_id: id })); });
    // light brightness drag/click (room-card behavior: brightness = pct*2.55)
    const track = ov.querySelector('#tpBriTrack');
    if (track) {
      const setFromX = (clientX) => {
        const r = track.getBoundingClientRect();
        let pct = Math.round(((clientX - r.left) / r.width) * 100);
        pct = Math.max(1, Math.min(100, pct));
        ov.querySelector('#tpBriFill').style.width = pct + '%';
        ov.querySelector('#tpBriThumb').style.left = pct + '%';
        ov.querySelector('#tpBriVal').textContent = pct + '%';
        return pct;
      };
      let dragging = false;
      track.addEventListener('pointerdown', (e) => { dragging = true; setFromX(e.clientX); track.setPointerCapture(e.pointerId); });
      track.addEventListener('pointermove', (e) => { if (dragging) setFromX(e.clientX); });
      track.addEventListener('pointerup', (e) => { dragging = false; const pct = setFromX(e.clientX); this._hass.callService('light', 'turn_on', { entity_id: id, brightness: Math.round(pct * 2.55) }); });
    }
    // fan speed chips
    ov.querySelectorAll('[data-pct]').forEach(b => b.addEventListener('click', () => {
      this._hass.callService('fan', 'set_percentage', { entity_id: id, percentage: +b.dataset.pct }); ov.remove();
    }));
    // climate
    const tgtEl = ov.querySelector('#tpTarget');
    const stepTemp = (delta) => { const cur = parseFloat(this._attr(id, 'temperature')) || 20; const next = Math.round((cur + delta) * 2) / 2; if (tgtEl) tgtEl.textContent = next.toFixed(1) + '°'; this._hass.callService('climate', 'set_temperature', { entity_id: id, temperature: next }); };
    ov.querySelector('#tpTempUp')?.addEventListener('click', () => stepTemp(0.5));
    ov.querySelector('#tpTempDown')?.addEventListener('click', () => stepTemp(-0.5));
    ov.querySelectorAll('[data-mode]').forEach(b => b.addEventListener('click', () => { this._hass.callService('climate', 'set_hvac_mode', { entity_id: id, hvac_mode: b.dataset.mode }); ov.remove(); }));
    // lock
    ov.querySelector('#tpLockBtn')?.addEventListener('click', () => { const locked = String(st).toLowerCase() === 'locked'; this._hass.callService('lock', locked ? 'unlock' : 'lock', { entity_id: id }); ov.remove(); });
    // cover
    ov.querySelector('#tpCoverOpen')?.addEventListener('click', () => { this._hass.callService('cover', 'open_cover', { entity_id: id }); ov.remove(); });
    ov.querySelector('#tpCoverClose')?.addEventListener('click', () => { this._hass.callService('cover', 'close_cover', { entity_id: id }); ov.remove(); });
    ov.querySelector('#tpCoverStop')?.addEventListener('click', () => { this._hass.callService('cover', 'stop_cover', { entity_id: id }); ov.remove(); });
    root.appendChild(ov);
  }

  _moreInfoTile(n) {
    const id = this.config[`_extra_tile_${n}_entity`];
    if (id) this._fireMoreInfo(id);
  }

  /* ══════════════ BACKGROUND VARIANTS (same files/logic) ══════════════ */
  /* Robust weather detection (ported from khan-skycard): tries configured + common entities */
  /* ═══════════════════════ WEATHER & BACKGROUND ═══════════════════════ */
  _wxCondition() {
    const candidates = [
      this.config.weather_entity, 'weather.home', 'weather.forecast_home',
      'weather.home_hourly', 'weather.home_daily', 'weather.open_meteo', 'weather.openweathermap',
    ].filter(Boolean);
    let state = null;
    for (const eid of candidates) {
      const s = this._hass?.states[eid];
      if (s && s.state && s.state !== 'unavailable' && s.state !== 'unknown') {
        state = s.state.toLowerCase().replace(/-/g, ''); break;
      }
    }
    if (!state) return 'clear';
    if (state.includes('thunder') || state.includes('lightning')) return 'thunderstorm';
    if (state.includes('snow') || state.includes('sleet') || state.includes('hail')) return 'snowy';
    if (state.includes('rain') || state.includes('drizzle') || state.includes('shower') || state.includes('pour')) return 'rainy';
    if (state.includes('fog') || state.includes('mist') || state.includes('haze')) return 'fog';
    if (state.includes('cloud') || state.includes('overcast'))
      return (state.includes('partly') || state.includes('few') || state.includes('scattered')) ? 'partlycloudy' : 'cloudy';
    return 'clear';
  }
  /* Twinkling star field SVG (night only) — ported from khan-skycard */
  _starField(count) {
    let seed = Math.floor(Date.now() / 86400000);
    const rng = () => { seed = (seed * 1664525 + 1013904223) & 0xffffffff; return (seed >>> 0) / 0xffffffff; };
    const COLORS = ['#ffffff','#ffffff','#e8eeff','#ffe8d0','#ffd0a0','#ccdeff','#fff8e8','#d0e8ff'];
    let svg = '';
    for (let i = 0; i < count; i++) {
      const x = (rng()*100).toFixed(2), y = (rng()*92).toFixed(2);
      const r = (0.4+rng()*1.5).toFixed(2), op = (0.18+rng()*0.70).toFixed(2);
      const col = COLORS[Math.floor(rng()*COLORS.length)];
      const twk = rng() > 0.80, dur = (1.6+rng()*2.8).toFixed(1);
      svg += `<circle cx="${x}%" cy="${y}%" r="${r}" fill="${col}" opacity="${op}"${twk ? ` style="animation:clTwinkle ${dur}s ease-in-out infinite;animation-delay:-${(rng()*parseFloat(dur)).toFixed(1)}s"` : ''}/>`;
    }
    return svg;
  }
  /* Weather particle overlay (rain/shower, snow, thunderstorm+lightning, fog) — ported from khan-skycard */
  _buildWxLayer(el, condition, isDay) {
    if (!el) return;
    let html = '';
    if (condition === 'rainy' || condition === 'thunderstorm') {
      const count = condition === 'thunderstorm' ? 55 : 38;
      for (let i = 0; i < count; i++) {
        const l = (i*79%100).toFixed(1), h = (1+(i%3)*0.5).toFixed(1);
        const d = (0.45+(i%6)*0.08).toFixed(2), op = (0.25+(i%4)*0.08).toFixed(2);
        const delay = -((i*0.11)%parseFloat(d)).toFixed(2);
        html += `<div style="position:absolute;top:0;left:${l}%;width:${h}px;height:14px;background:rgba(180,210,255,${op});border-radius:1px;animation:clRain ${d}s linear ${delay}s infinite"></div>`;
      }
      if (condition === 'thunderstorm')
        html += `<div style="position:absolute;inset:0;background:rgba(200,220,255,0.04);animation:clLightning 5.8s ease-in-out infinite"></div>`;
    }
    if (condition === 'snowy') {
      for (let i = 0; i < 38; i++) {
        const l = (i*83%100).toFixed(1), s = 2+(i%4);
        const d = (2.8+(i%5)*0.6).toFixed(1), delay = -((i*0.4)%parseFloat(d)).toFixed(1);
        const op = (0.35+(i%3)*0.12).toFixed(2);
        html += `<div style="position:absolute;top:0;left:${l}%;width:${s}px;height:${s}px;border-radius:50%;background:rgba(228,240,255,${op});animation:clSnow ${d}s ease-in-out ${delay}s infinite"></div>`;
      }
    }
    if (condition === 'fog') {
      const fc = isDay ? 'rgba(172,198,212,' : 'rgba(88,118,142,';
      for (let i = 0; i < 5; i++) {
        const top = 8+i*9, dur = (7+i*2).toFixed(1), ddur = (parseFloat(dur)*2.8).toFixed(0);
        const op = (0.22+(i%3)*0.07).toFixed(2), hh = 14+(i%3)*8;
        html += `<div style="position:absolute;top:${top}%;left:-10%;right:-10%;height:${hh}px;background:linear-gradient(90deg,transparent,${fc}${op}),transparent);filter:blur(${2+i}px);animation:clFogDrift ${ddur}s ease-in-out -${(i*2.1).toFixed(1)}s infinite alternate"></div>`;
      }
    }
    el.innerHTML = html;
  }
  _bgVariantKey() {
    // Background math identical to khan-skycard: bell + sun-arc position (t) drive dawn/dusk.
    const sun = this._sunData();
    const isDay = !sun.night;
    const bell = sun.bell ?? 0.5;
    const isDawn = isDay && bell < 0.22 && sun.t < 0.5;
    const isDusk = isDay && bell < 0.22 && sun.t >= 0.5;
    const cond = this._wxCondition();
    if (cond === 'partlycloudy') return isDay ? 'casa-luna-partlycloudy-day' : 'casa-luna-partlycloudy-night';
    if (cond === 'cloudy') return isDay ? 'casa-luna-cloudy-day' : 'casa-luna-cloudy-night';
    if (cond === 'thunderstorm') return 'casa-luna-thunderstorm';
    if (cond === 'rainy') return isDay ? 'casa-luna-rainy-day' : 'casa-luna-rainy-night';
    if (cond === 'snowy') return 'casa-luna-snowy-day';
    if (cond === 'fog') return 'casa-luna-fog-day';
    if (isDawn) return 'casa-luna-clear-dawn';
    if (isDusk) return 'casa-luna-clear-dusk';
    return isDay ? 'casa-luna-clear-day' : 'casa-luna-clear-night';
  }
  _setBackground(force) {
    const key = this._bgVariantKey();
    if (!force && key === this._bgKey) return;
    this._bgKey = key;
    const BASE = this.config.background_path.replace(/\/$/, '');
    const showEl = this._q(this._bgFlip ? '#bgA' : '#bgB');
    const hideEl = this._q(this._bgFlip ? '#bgB' : '#bgA');
    const img = new Image();
    img.onload = () => { showEl.src = img.src; showEl.style.opacity = 1; hideEl.style.opacity = 0; };
    img.onerror = () => { showEl.src = `${BASE}/casa-luna.png`; showEl.style.opacity = 1; hideEl.style.opacity = 0; };
    img.src = `${BASE}/${key}.png`;
    this._bgFlip = !this._bgFlip;
    // —— weather system: stars (night) + particle overlay (by condition) ——
    const sun = this._sunData();
    const isDay = !sun.night;
    const cond = this._wxCondition();
    const starsEl = this._q('#wxStars');
    if (starsEl) {
      if (!isDay) { if (this._starsKey !== 'on') { starsEl.innerHTML = this._starField(55); this._starsKey = 'on'; } starsEl.style.opacity = '1'; }
      else { starsEl.style.opacity = '0'; this._starsKey = 'off'; }
    }
    if (this._wxKey !== cond + isDay) {
      this._buildWxLayer(this._q('#wxLayer'), cond, isDay);
      this._wxKey = cond + isDay;
    }
  }

  /* ══════════════ UPDATE (every hass change / 15 s tick) ══════════════ */
  /* ═══════════════════════ UPDATE — live values (every hass change / 15s) ═══════════════════════ */
  _update(tick = false) {
    if (!this._built || !this._hass) return;
    const c = this._lc || this.config;
    this._applyTheme();

    /* clock */
    const now = new Date();
    if (now.getMinutes() !== this._lastMinute || tick) {
      this._lastMinute = now.getMinutes();
      this._setTxt('#hTime', now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
      this._setTxt('#hDay', now.toLocaleDateString([], { weekday: 'long' }).toUpperCase());
      this._setTxt('#hDate', now.toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase());
    }

    /* weather header */
    const wEnt = c.weather_entity;
    const temp = c.weather_temp_entity ? this._num(c.weather_temp_entity, NaN) : parseFloat(this._attr(wEnt, 'temperature'));
    const tu = this._attr(wEnt, 'temperature_unit') || '°C';
    this._setTxt('#hTemp', Number.isFinite(temp) ? `${Math.round(temp)}${tu}` : '--');
    const cond = this._st(wEnt) || '';
    this._setTxt('#hCond', cond.replace(/_/g,' ').replace(/partlycloudy/i,'partly cloudy').replace(/clear-night/i,'clear').toUpperCase());
    const wind = c.weather_wind_entity ? this._num(c.weather_wind_entity, NaN) : parseFloat(this._attr(wEnt, 'wind_speed'));
    const wdir = c.weather_dir_entity ? this._st(c.weather_dir_entity) : this._dirFromDeg(parseFloat(this._attr(wEnt, 'wind_bearing')));
    this._setTxt('#hWind', `⌖ ${Number.isFinite(wind) ? Math.round(wind) : '--'} ${this._attr(wEnt, 'wind_speed_unit') || 'km/h'}    ⌃ ${wdir || '--'}`);
    this._drawWeatherArt(cond);

    /* sun arc */
    this._updateArc();

    /* power flows */
    const pvW = this._pvSum();
    const loadW = this._invLoadW();
    /* Grid flow-line value: combined L1+L2+L3 when 3-phase toggled on, else single-phase.
       Magnitude only (direction/colour handled in _updateFlows from the same net). */
    const hasPhases = !!(c.grid_phase_a || c.grid_phase_b || c.grid_phase_c);
    const gridFlowW = Math.abs(this._gridNetW());
    this._setTxt('#gridW', gridFlowW >= 1000 ? `${this._dec(gridFlowW / 1000)} kW` : `${Math.round(gridFlowW)} W`);
    /* Battery flow-line top value now = battery POWER, colored to match flow (set in flow block below) */
    /* Below-line volts: grid volt (hidden when 3-phase on), battery volt (always shown) */
    const gridVoltEl = this._qi('gridVolt');
    if (gridVoltEl) {
      if (c._show_phase && hasPhases) { gridVoltEl.setAttribute('opacity', '0'); }
      else {
        gridVoltEl.setAttribute('opacity', '1');
        const gv = this._num(c.grid_voltage, NaN);
        gridVoltEl.textContent = Number.isFinite(gv) ? `${this._decEnt(c.grid_voltage)} V` : '--';
      }
    }
    /* Battery voltage now shown below the cylinder (inside cylinder box), pair when batt2 on */
    // battery voltage now shown in the stats row (#bVolt); cylinder voltage removed

    /* battery + pole stub flow animations driven by live power values */
    this._updateFlows();

    /* EV banner values */
    if (c._show_ev) {
      const evP = this._watts(c.charger_power, NaN);
      const evA = this._num(c.charger_current, NaN);
      const evS = this._num(c.charger_soc, NaN);
      this._setTxt('#evPowerVal', Number.isFinite(evP) ? (evP >= 1000 ? `${(evP/1000).toFixed(1)}k` : `${Math.round(evP)}`) : '--');
      this._setTxt('#evCurrentVal', Number.isFinite(evA) ? `${this._fmt(evA)}` : '--');
      this._setTxt('#evSocVal', Number.isFinite(evS) ? `${Math.round(evS)}%` : '--');
      const eta = c.charger_eta && this._hass?.states?.[c.charger_eta];
      this._setTxt('#evEtaVal', eta ? String(eta.state) : '--');
      const stSo = this._stateObj(c.charger_state);
      this._setTxt('#evStateVal', stSo ? (this._hass?.formatEntityState?.(stSo) ?? this._cap(stSo.state)) : '--');
    }
    this._fillBar('pv', pvW / Math.max(c.pv_max_power, 1), '#43ea13', 10);
    this._fillBar('pwr', loadW / Math.max(c.inverter_max_power, 1), '#0a8aea', 10);

    /* GOODWE box EMS/Operation mode card — only present when phase tile is hidden
       (the freed-space card). Reuses Energy View's already-configured entities. */
    if (!c._show_phase) {
      const emsSo = this._stateObj(c.en_ems_mode);
      this._setTxt('#goodweEmsVal', emsSo ? (this._hass?.formatEntityState?.(emsSo) ?? this._cap(emsSo.state)) : '--');
      const opSo = this._stateObj(c.en_op_mode);
      this._setTxt('#goodweOpVal', opSo ? (this._hass?.formatEntityState?.(opSo) ?? this._cap(opSo.state)) : '--');
    }

    /* stat tiles */
    const loadRaw = this._num(c.consump, NaN);
    const tempColor = v => v >= c.thresh_temp_critical ? '#ff5040' : v >= c.thresh_temp_warn ? '#ffaa28' : '#46e05a';
    const cellTemp = (entId) => {
      let v = this._num(entId, NaN);
      /* some BMS/inverter integrations report cell temp in tenths of a degree;
         enable "Cell temp ×10" in the editor to correct (replaces old goodwe name-match). */
      if (Number.isFinite(v) && c.cell_temp_x10) v *= 10;
      return v;
    };
    // LOAD tile
    const loadEl2 = this._q('#v_load');
    if (loadEl2) {
      if (!c.consump || !Number.isFinite(loadRaw)) {
        loadEl2.textContent = '--';
      } else {
        loadEl2.textContent = this._powerEnt(c.consump);
      }
      loadEl2.style.color = '#50c8ff';
    }
    // GRID IMP / GRID EXP tiles
    this._setTxt('#v_gimp', this._kwhEnt(c.grid_import_today));
    this._setColor('#v_gimp', '#ffb45a');
    this._setTxt('#v_gexp', c.grid_export_energy ? this._kwhEnt(c.grid_export_energy) : '--');
    this._setColor('#v_gexp', '#7ce05a');
    // BATT CHG / DIS dual tile
    this._setTxt('#v_bchg', this._kwhEnt(c.today_batt_chg));
    this._setTxt('#v_bdis', this._kwhEnt(c.batt_dis));

    /* inverter */
    const invT = this._num(c.inv_temp, NaN);
    this._setTxt('#invStatus', Number.isFinite(invT) ? `Temp: ${this._decEnt(c.inv_temp)} °C` : 'Operating');
    const invErrSt = c.inverter_error ? this._st(c.inverter_error) : '';
    const errEl = this._q('#invErr');
    if (errEl) {
      const clean = !invErrSt || /^(0|ok|none|no\s*error|normal|clear|off|nan|unknown|unavailable)$/i.test(invErrSt);
      errEl.textContent = clean ? '\u2713 No Errors' : `\u26a0 ${this._cap(invErrSt)}`;
      errEl.style.color = clean ? '#46e05a' : '#ff5040';
    }
    /* phase flip tile: front = grid phase pwr/volt, back = inverter pwr/volt (3 values each, no L1/L2 prefixes) */
    const phaseVal = (id) => { const v = this._num(id, NaN); return Number.isFinite(v) ? v.toFixed(1) : '--'; };
    const phaseKw = (id) => { const v = this._watts(id, NaN); return Number.isFinite(v) ? `${this._dec(v / 1000)}` : '--'; };
    const setRow = (sel, vals) => { const el = this._q(sel); if (el) { const h = vals.map(v => `<span style="flex:1;text-align:center">${v}</span>`).join(''); if (el._h !== h) { el.innerHTML = h; el._h = h; } } };
    setRow('#phaseRowP', [phaseKw(c.grid_phase_a), phaseKw(c.grid_phase_b), phaseKw(c.grid_phase_c)]);
    setRow('#phaseRowV', [phaseVal(c.grid_phase_a_volt), phaseVal(c.grid_phase_b_volt), phaseVal(c.grid_phase_c_volt)]);
    setRow('#invRowP', [phaseKw(c.inv_l1_power), phaseKw(c.inv_l2_power), phaseKw(c.inv_l3_power)]);
    setRow('#invRowV', [phaseVal(c.inv_l1_volt), phaseVal(c.inv_l2_volt), phaseVal(c.inv_l3_volt)]);
    const loadPct = Math.min(100, Math.max(0, loadW / Math.max(c.inverter_max_power, 1) * 100));
    const loadCol = loadPct >= c.thresh_load_critical ? '#ff5040' : loadPct >= c.thresh_load_warn ? '#ffaa28' : '#46e05a';
    /* 6-block gauge: light blocks proportional to load% */
    const litBlocks = Math.round(loadPct / 100 * 6);
    for (let i = 0; i < 6; i++) {
      const blk = this._q(`#donutBlk${i}`);
      if (blk) {
        blk.setAttribute('opacity', i < litBlocks ? '1' : '0');
        blk.setAttribute('stroke', loadCol);
      }
    }
    this._setTxt('#donutPct', `${Math.round(loadPct)}%`);

    /* inverter row tiles */
    /* capacity compute — khan logic: battery_cap_unit picks Ah or kWh field.
       NOTE: battery_full_wh/ah are plain numbers (not entities) → use Number(), not _num().
       Only battery_voltage is an entity → _num() reads its state. */
    const capUnit = (c.battery_cap_unit || 'kwh').toLowerCase();
    const fullWh1 = capUnit === 'ah'
      ? ((Number(c.battery_full_ah) || 0) * this._num(c.battery_voltage, 51.2))
      : ((Number(c.battery_full_wh) || 0) * 1000);
    const cap2Unit = (c.battery2_cap_unit || capUnit).toLowerCase();
    const fullWh2 = c._show_battery2
      ? (cap2Unit === 'ah'
          ? ((Number(c.battery2_full_ah) || 0) * this._num(c.battery2_voltage, 51.2))
          : ((Number(c.battery2_full_wh) || 0) * 1000)) || fullWh1
      : 0;
    const fullWh = fullWh1 + fullWh2;
    const soc = this._num(c.battery_soc, NaN);

    /* battery / mode / right column
       This user's sensor: positive bP = discharging, negative bP = charging
       (opposite of standard convention, so we invert the MODE text labels) */
    const bP = this._watts(c.battery_power) * (c.invert_battery_power ? -1 : 1);
    let modeTxt = 'IDLE', modeCol = '#a8cae6';
    if (bP > 50)  { modeTxt = 'DISCHARGING'; modeCol = '#22c3ff'; }
    if (bP < -50) { modeTxt = 'CHARGING';    modeCol = '#46e05a'; }
    const mv = this._q('#modeVal');
    if (mv) { mv.textContent = this._t(modeTxt); mv.style.color = modeCol; }
    // inverter state (work_mode entity) — e.g. On-Grid / Off-Grid / Backup
    const invSo = this._stateObj(c.inverter_state);
    const invSt = invSo && this._hass.formatEntityState ? this._hass.formatEntityState(invSo)
                : (invSo ? this._cap(invSo.state) : '');
    this._setTxt('#invState', invSt || '--');

    // Khan-style battery fill — single or dual (split) cylinder
    if (c._show_battery2) {
      const soc1 = this._num(c.battery_soc, NaN);
      const soc2 = this._num(c.battery2_soc, NaN);
      const applyFill = (socV, barId, hlId, pctId, boltId, powEnt, invKey) => {
        const fill = Number.isFinite(socV) ? this._battFill(socV) : null;
        const bf = this._q(barId), bh = this._q(hlId), pct = this._q(pctId), bolt = this._q(boltId);
        if (fill && bf) { bf.setAttribute('y', fill.y); bf.setAttribute('height', fill.height); bf.setAttribute('fill', fill.color); bf.setAttribute('filter', fill.filter); }
        if (fill && bh) { bh.setAttribute('y', fill.y); bh.setAttribute('height', fill.height); }
        if (pct) { pct.textContent = Number.isFinite(socV) ? Math.round(socV) + '%' : '--%'; if (fill) pct.setAttribute('fill', fill.textColor); }
        const bP = this._watts(powEnt) * (c[invKey] ? -1 : 1);
        if (bolt) bolt.setAttribute('opacity', bP < -50 ? '1' : '0');
      };
      applyFill(soc1, '#battFillBar1', '#battFillHL1', '#cylPct1', '#battBoltGroup1', c.battery_power, 'invert_battery_power');
      applyFill(soc2, '#battFillBar2', '#battFillHL2', '#cylPct2', '#battBoltGroup2', c.battery2_power, 'invert_battery_power');
      const wrap = this._q('#battIconWrap');
      const bPany = Math.abs(this._watts(c.battery_power)) + Math.abs(this._watts(c.battery2_power));
      if (wrap) wrap.setAttribute('filter', bPany >= 50 ? 'url(#iconGlowBlue)' : '');
    } else {
      const soc = this._num(c.battery_soc, NaN);
      const fill = Number.isFinite(soc) ? this._battFill(soc) : null;
      const bf = this._q('#battFillBar'), bh = this._q('#battFillHL');
      const pct = this._q('#cylPct'), bolt = this._q('#battBoltGroup');
      const wrap = this._q('#battIconWrap');
      if (fill && bf) {
        bf.setAttribute('y', fill.y); bf.setAttribute('height', fill.height);
        bf.setAttribute('fill', fill.color); bf.setAttribute('filter', fill.filter);
      }
      if (fill && bh) { bh.setAttribute('y', fill.y); bh.setAttribute('height', fill.height); }
      if (pct) { pct.textContent = Number.isFinite(soc) ? soc+'%' : '--%'; if (fill) pct.setAttribute('fill', fill.textColor); }
      const bP = this._watts(c.battery_power) * (c.invert_battery_power ? -1 : 1);
      if (bolt) bolt.setAttribute('opacity', bP < -50 ? '1' : '0');
      if (wrap) wrap.setAttribute('filter', Math.abs(bP) >= 50 ? 'url(#iconGlowBlue)' : '');
    }
    this._dualVal('#battVolt', c.battery_voltage, c.battery2_voltage, 'V');
    this._dualVal('#bCur', c.battery_current, c.battery2_current, 'A');
    /* Capacity = REMAINING (khan logic: SOC% × full). Dual battery → sum of both. */
    let remWh;
    if (c._show_battery2) {
      const s1 = this._num(c.battery_soc, NaN), s2 = this._num(c.battery2_soc, NaN);
      remWh = (Number.isFinite(s1) ? fullWh1 * s1 / 100 : 0) + (Number.isFinite(s2) ? fullWh2 * s2 / 100 : 0);
    } else {
      remWh = (fullWh && Number.isFinite(soc)) ? fullWh * soc / 100 : 0;
    }
    this._setTxt('#bC', remWh ? this._kwh(remWh / 1000) : '--');
    /* battery box cell rows: Cell Temp (T1|T2), BMS Temp, Cell Volt (min|max) */
    {
      const t1 = cellTemp(c.battery_temp1), t2 = cellTemp(c.battery_temp2);
      const ts1 = Number.isFinite(t1) ? this._fmt(t1) : '--';
      const ts2 = Number.isFinite(t2) ? this._fmt(t2) : null;
      this._setTxt('#bCtmp', ts2 ? `${ts1}|${ts2}°C` : (Number.isFinite(t1) ? `${ts1}°C` : '--'));
      this._setColor('#bCtmp', Number.isFinite(t1) ? tempColor(t1) : '#eaf4ff');
      this._dualVal('#bBms', c.battery_mos, c.battery2_mos, '°C');
      const mv = this._num(c.battery_mos, NaN);
      this._setColor('#bBms', Number.isFinite(mv) ? tempColor(mv) : '#eaf4ff');
      let mn = this._num(c.battery_min_cell, NaN), mx = this._num(c.battery_max_cell, NaN);
      let mnRaw = this._st(c.battery_min_cell), mxRaw = this._st(c.battery_max_cell);
      /* guard: if sensors are swapped (min>max), display sorted low|high */
      if (Number.isFinite(mn) && Number.isFinite(mx) && mn > mx) { const t = mn; mn = mx; mx = t; const tr = mnRaw; mnRaw = mxRaw; mxRaw = tr; }
      const mns = Number.isFinite(mn) ? this._dec(mnRaw) : '--', mxs = Number.isFinite(mx) ? this._dec(mxRaw) : '--';
      this._setTxt('#bCv', (Number.isFinite(mn) || Number.isFinite(mx)) ? `${mns}|${mxs}` : '--');
      /* cell-voltage health colour: red critical, orange low/high, green normal — worse of min/max wins */
      const cvCrit = Number(c.thresh_cell_v_critical) || 3.0, cvLow = Number(c.thresh_cell_v_low) || 3.1, cvHigh = Number(c.thresh_cell_v_high) || 3.65;
      const cellVColor = v => !Number.isFinite(v) ? null : v <= cvCrit ? 3 : (v <= cvLow || v >= cvHigh) ? 2 : 1;
      const sev = Math.max(cellVColor(mn) || 0, cellVColor(mx) || 0);
      this._setColor('#bCv', sev === 3 ? '#ff5040' : sev === 2 ? '#ffaa28' : sev === 1 ? '#7ce05a' : '#7ce05a');
    }
    /* Endurance (khan logic): driven by battery power, not house load.
       Discharging → time to empty; Charging → ETA to full (cyan, labeled ETA).
       casa-luna sign: bP>0 discharging, bP<0 charging (already invert-normalized). */
    let endHours = NaN, endText = '--', isETA = false;
    if (c._show_battery2) {
      const soc1 = this._num(c.battery_soc, NaN), soc2 = this._num(c.battery2_soc, NaN);
      const p1 = this._watts(c.battery_power) * (c.invert_battery_power ? -1 : 1);
      const p2 = this._watts(c.battery2_power) * (c.invert_battery_power ? -1 : 1);
      const totalRemWh = (Number.isFinite(soc1) ? soc1 / 100 * fullWh1 : 0) + (Number.isFinite(soc2) ? soc2 / 100 * fullWh2 : 0);
      const totalCapWh = fullWh1 + fullWh2;
      const totalPower = p1 + p2;
      if (totalCapWh > 0) {
        if (totalPower > 10) { endHours = totalRemWh / totalPower; }
        else if (totalPower < -10) { endHours = Math.max(0, (totalCapWh - totalRemWh) / Math.abs(totalPower)); isETA = true; }
      }
    } else {
      const capWh = fullWh1;
      const remWhFinal = Number.isFinite(soc) ? soc / 100 * capWh : 0;
      if (capWh > 0) {
        if (bP > 10) { endHours = remWhFinal / bP; }
        else if (bP < -10) { endHours = Math.max(0, (capWh - remWhFinal) / Math.abs(bP)); isETA = true; }
      }
    }
    endText = this._fmtEndurance(endHours);
    this._setTxt('#bE', endText);
    this._setColor('#bE', isETA ? '#00d7ff' : '#d8eeff');
    const bELbl = this._q('#bELbl'); if (bELbl) bELbl.textContent = isETA ? 'ETA' : (c.label_endurance || 'Endurance');
    /* battery back face now shows PV strings (filled below) */

    /* production / consumption boxes */
    this._setTxt('#prTotal', this._kwhEnt(c.today_pv));
    const pvP = [c.pv1_power, c.pv2_power, c.pv3_power, c.pv4_power, c.pv5_power, c.pv6_power];
    const pvV = [c.pv1_voltage, c.pv2_voltage, c.pv3_voltage, c.pv4_voltage, c.pv5_voltage, c.pv6_voltage];
    /* match the tile build: only the strings that actually have an entity configured */
    let pvSlots = 0; const pvMax = c._show_pv_extra ? 6 : 2;
    for (let i = 0; i < pvMax; i++) if (pvP[i] && this._stateObj(pvP[i])) pvSlots = i + 1;
    pvSlots = Math.max(1, pvSlots);
    for (let i = 0; i < pvSlots; i++) {
      const pEnt = pvP[i], vEnt = pvV[i];
      const pEl = this._q(`#prPc${i}`);
      if (pEl) pEl.textContent = pEnt ? this._powerEnt(pEnt) : '--';
      const vEl = this._q(`#prVc${i}`);
      if (vEl) vEl.textContent = vEnt ? `${this._decEnt(vEnt)} V` : '--';
    }
    /* battery back face: all 6 PV strings (power + volt) */
    for (let i = 0; i < 6; i++) {
      const pe = this._q(`#bPV${i + 1}P`);
      if (pe) pe.textContent = pvP[i] ? this._powerEnt(pvP[i]) : '--';
      const ve = this._q(`#bPV${i + 1}V`);
      if (ve) ve.textContent = pvV[i] ? `${this._decEnt(pvV[i])} V` : '--';
    }
    this._setTxt('#cnTotal', this._kwhEnt(c.today_load));
    /* grid imp/exp now shown in middle tiles (#v_gimp / #v_gexp) */
    /* inverter summary tiles */
    const pvTs = this._tileState('pv');
    this._setTxt('#itImp', c.total_import ? this._kwhEnt(c.total_import) : '--');
    this._setTxt('#itExp', c.total_export ? this._kwhEnt(c.total_export) : '--');
    this._setTxt('#itPv',  pvTs.custom ? this._rawTile(pvTs.entity) : this._kwhEnt(c.total_pv));
    /* totals tiles → white when customized */
    ['imp','exp','pv'].forEach(k => { const ts=this._tileState(k); const el=this._q('#it'+(k==='imp'?'Imp':k==='exp'?'Exp':'Pv')); if(el&&ts.custom) el.style.color='#ffffff'; });
    if (c.history_charts) {
      this._drawHistory('#prChart', c.pv_total_power || c.pv1_power || c.pv2_power, SL.r_prod[2] - 24, SL.r_prod[3] - 38);
      this._drawHistory('#cnChart', c.consump, SL.r_cons[2] - 24, SL.r_cons[3] - 38);
    }

    /* events: derived from extra-tile entities' last_changed */
    this._renderEvents();

    /* bottom tiles */
    this._updateBottomTiles();

    /* header status icons */
    this._updateStatusIcons();

    /* detail view refresh + background */
    if (this._activeView !== 'dashboard' && !this._panelBusy) this._renderDetail();
    this._setBackground();
  }

  /* refresh the 6 bottom tiles: value, state colour, live room-card icon animation */
  /* drive battery + grid flow-line animations from live power (colours, dash speed, glow) */
  /* signed net grid power: sum of L1/L2/L3 when 3-phase is toggled on (and phases
     set), else single-phase. Same source feeds the flow magnitude AND direction. */
  _gridNetW() {
    const c = this.config;
    const hasPhases = !!(c.grid_phase_a || c.grid_phase_b || c.grid_phase_c);
    const v = (c._show_phase && hasPhases)
      ? this._watts(c.grid_phase_a) + this._watts(c.grid_phase_b) + this._watts(c.grid_phase_c)
      : this._watts(c.grid_active_power);
    return v * (c.invert_grid_power ? -1 : 1);
  }
  /* combined inverter load: sum of L1/L2/L3 backup power when 3-phase is toggled on
     (and inverter phases set), else house consumption. Feeds INV LOAD % + PWR bar. */
  _invLoadW() {
    const c = this.config;
    /* dedicated "this inverter's own output" entity takes priority — needed when other
       PV inverters also feed the house directly, so total consumption isn't a fair
       proxy for THIS inverter's load (e.g. Victron + separate AC-coupled PV inverters). */
    if (c.inverter_output_power) return Math.abs(this._watts(c.inverter_output_power));
    const hasInv = !!(c.inv_l1_power || c.inv_l2_power || c.inv_l3_power);
    return (c._show_phase && hasInv)
      ? Math.abs(this._watts(c.inv_l1_power) + this._watts(c.inv_l2_power) + this._watts(c.inv_l3_power))
      : this._watts(c.consump);
  }

  _updateFlows() {
    const c = this.config;
      const bP  = this._watts(c.battery_power) * (c.invert_battery_power ? -1 : 1);
      const gW  = this._gridNetW();
      const battActive = Math.abs(bP) > 50;
      const poleActive = Math.abs(gW) > 10;
      const flowDur = w => (Math.max(0.5, 3.0 - (Math.min(Math.abs(w), 8000) / 8000) * 2.5)).toFixed(2) + 's';
      const battDur = flowDur(bP), poleDur = flowDur(gW);
      /* Battery colours — inverted per user setup:
         bP > 50 = discharge → orange, bP < -50 = charge → green */
      const battDischarging = bP >  50;
      const battCharging    = bP < -50;
      const battGlow = battDischarging ? 'rgba(224,120,0,0.30)' : battCharging ? 'rgba(57,255,20,0.30)' : 'rgba(156,163,175,0.20)';
      const battCore = battDischarging ? '#e07800'              : battCharging ? '#39ff14'               : '#9ca3af';
      /* flow-line battery value = battery power, colored to match flow */
      const loadWel = this._qi('loadW');
      if (loadWel) {
        const pw = Math.abs(bP);
        loadWel.textContent = pw >= 1000 ? `${this._dec(pw / 1000)} kW` : `${Math.round(pw)} W`;
        loadWel.setAttribute('fill', battCore);
      }

      /* Pole colours — exact khan-skycard:
         importing (gW > 10): dark orange #e07800
         exporting (gW < -10): neon green #39ff14 */
      const gridImporting = gW >  10;
      const gridExporting = gW < -10;
      const poleGlow = gridImporting ? 'rgba(224,120,0,0.30)' : gridExporting ? 'rgba(57,255,20,0.30)' : 'rgba(156,163,175,0.20)';
      const poleCore = gridImporting ? '#e07800'              : gridExporting ? '#39ff14'               : '#9ca3af';

      /* BUILD 2: dirty-check each attribute write — this loop fires on every battery/grid
         power update (the most frequent real _update() trigger) across 12 elements x up to
         4 attrs. Steady-state power (same dur/color for many consecutive passes) previously
         rewrote all of them every time; now skipped when unchanged. Cache child <animate>
         lookup on the element too, so it isn't re-walked every pass. */
      const drive = (ids, active, dur, glow, core, reverse = false) => {
        ids.forEach(([id, isGlow]) => {
          const el = this._qi(id); if (!el) return;
          const op = active ? '1' : '0';
          if (el._clOp !== op) { el.setAttribute('opacity', op); el._clOp = op; }
          const strokeCol = isGlow ? glow : core;
          if (el._clStroke !== strokeCol) { el.setAttribute('stroke', strokeCol); el._clStroke = strokeCol; }
          const a = el._clAnim !== undefined ? el._clAnim : (el._clAnim = el.querySelector('animate'));
          if (a) {
            if (a._clDur !== dur) { a.setAttribute('dur', dur); a._clDur = dur; }
            /* dot travel direction: forward = path dir (battery→home / discharge);
               reverse = opposite (home→battery / charge). cycle from data-cyc. */
            let cyc = a.getAttribute('data-cyc');
            if (cyc === null) { cyc = a.getAttribute('from'); a.setAttribute('data-cyc', cyc); }
            const from = reverse ? '0' : cyc, to = reverse ? cyc : '0';
            const dirChanged = a._clRev !== undefined && a._clRev !== reverse;
            if (a._clFrom !== from) { a.setAttribute('from', from); a._clFrom = from; }
            if (a._clTo   !== to)   { a.setAttribute('to',   to);   a._clTo   = to; }
            a._clRev = reverse;
            /* changing from/to on a LIVE repeatCount=indefinite SMIL animation via
               setAttribute does not reliably restart it in Chromium — it keeps playing
               the OLD direction until explicitly restarted. Force it only when the
               direction actually flips, so normal ticks (same direction) don't reset
               the animation's phase and cause visible stutter. */
            if (dirChanged && typeof a.beginElement === 'function') {
              try { a.beginElement(); } catch (e) { /* unsupported in some engines — color/arrow still correct */ }
            }
          }
        });
      };
      /* battery: charging reverses dot flow (home→battery) */
      drive([['battHGlow',true],['battHCore',false],['battVGlow',true],['battVCore',false],['battDGlow',true],['battDCore',false]], battActive, battDur, battGlow, battCore, battCharging);
      drive([['poleHGlow',true],['poleHCore',false],['poleVGlow',true],['poleVCore',false],['poleDGlow',true],['poleDCore',false]], poleActive, poleDur, poleGlow, poleCore, gridExporting);

      // Battery dynamic arrow: discharging → house end (D); charging → battery end (A)
      const battArrD = this._qi('battArrD');
      const battArrA = this._qi('battArrA');
      if (battArrD) { battArrD.setAttribute('opacity', battActive && battDischarging ? '1' : '0'); battArrD.setAttribute('stroke', battCore); }
      if (battArrA) { battArrA.setAttribute('opacity', battActive && battCharging ? '1' : '0'); battArrA.setAttribute('stroke', battCore); }

      // Pole dynamic arrow: importing → house end (R, ►); exporting → grid end (P, ◄)
      const poleArrR = this._qi('poleArrR');
      const poleArrP = this._qi('poleArrP');
      if (poleArrR) { poleArrR.setAttribute('opacity', poleActive && gridImporting ? '1' : '0'); poleArrR.setAttribute('stroke', poleCore); }
      if (poleArrP) { poleArrP.setAttribute('opacity', poleActive && gridExporting ? '1' : '0'); poleArrP.setAttribute('stroke', poleCore); }
  }

  _updateBottomTiles() {
    const c = this.config;
    for (let n = 1; n <= 6; n++) {
      const id = c[`_extra_tile_${n}_entity`];
      const el = this._q(`#bt${n}`);
      if (!el) continue;
      if (!id) { el.textContent = '—'; continue; }
      const st = this._st(id);
      let u = this._attr(id, 'unit_of_measurement') || '';
      if (!u && id.startsWith('climate.') && /^-?\\d/.test(String(st))) u = '\u00b0C';
      el.textContent = st === null ? '--' : `${st}${u ? ' ' + u : ''}`.toUpperCase().slice(0, 16);
      const onState = ['on', 'open', 'home', 'auto', 'heat', 'cool', 'playing', 'unlocked'].includes(String(st).toLowerCase());
      el.style.color = onState ? '#5ae06e'
        : ['off', 'closed', 'disarmed', 'locked'].includes(String(st).toLowerCase()) ? '#eaf3ff' : '#7fd4ff';
      /* live icon animation by icon type + on-state (room-card style) */
      const iconWrap = this._q(`#btIcon${n}`);
      const tile = this._q(`#bottile${n}`);
      if (iconWrap) {
        const ic = c[`_extra_tile_${n}_icon`];
        const span = iconWrap.querySelector('span');
        const svg = iconWrap.querySelector('svg');
        const clearAnim = (e) => e && e.classList.remove('tileSpin', 'tileBulbOn', 'tileSocketOn', 'tileRgbOn', 'tileFlameOn', 'tileSnowOn', 'tileWaterOn', 'tileHeatOn');
        clearAnim(svg);
        if (svg && RC_ICONS[ic]) {
          // room-card color behavior: each device type its own on-colour; dim grey when off
          const off = 'rgba(180,180,180,0.45)';
          if (ic === 'fan') { if (span) span.style.color = onState ? 'rgba(0,225,255,0.95)' : off; if (onState) svg.classList.add('tileSpin'); }
          else if (ic === 'bulb') { if (span) span.style.color = onState ? 'rgba(255,220,70,0.95)' : off; if (onState) svg.classList.add('tileBulbOn'); const rays = svg.querySelector('.bulb-rays'); if (rays) rays.setAttribute('opacity', onState ? '1' : '0'); }
          else if (ic === 'plug') { if (span) span.style.color = onState ? 'rgba(80,240,140,0.95)' : off; if (onState) svg.classList.add('tileSocketOn'); }
          else if (ic === 'flame') { if (span) span.style.color = onState ? 'rgba(255,90,40,0.95)' : off; if (onState) svg.classList.add('tileFlameOn'); }
          else if (ic === 'snow') { if (span) span.style.color = onState ? 'rgba(0,210,255,0.95)' : off; if (onState) svg.classList.add('tileSnowOn'); }
          else if (ic === 'water') { if (span) span.style.color = onState ? 'rgba(60,170,255,0.95)' : off; if (onState) svg.classList.add('tileWaterOn'); }
          else if (ic === 'heat') { if (span) span.style.color = onState ? 'rgba(255,150,50,0.95)' : off; if (onState) svg.classList.add('tileHeatOn'); }
        }
      }
      if (tile) tile.style.animation = onState ? 'clTilePulse 2.8s ease-in-out infinite' : '';
    }
  }

  /* ═══════════════════════ SUN / MOON / FLOW / ARC RENDERING ═══════════════════════ */
  _dirFromDeg(d) {
    if (!Number.isFinite(d)) return '';
    return ['N','NE','E','SE','S','SW','W','NW'][Math.round(d / 45) % 8];
  }

  _fillBar(id, frac, col, n) {
    frac = Math.min(1, Math.max(0, frac));
    const lit = Math.round(frac * n);
    /* lit cylinder: top shadow → bright highlight band → mid → bottom shadow */
    const litBg = `linear-gradient(to bottom, ${col}99 0%, #ffffffcc 40%, ${col} 58%, ${col}88 78%, ${col}55 100%)`;
    const dimBg = 'linear-gradient(to bottom, rgba(255,255,255,.04) 0%, rgba(255,255,255,.20) 42%, rgba(255,255,255,.10) 60%, rgba(0,0,0,.18) 100%)';
    this.shadowRoot.querySelectorAll(`.seg-${id}`).forEach(s => {
      const i = +s.dataset.i;
      s.style.background = i < lit ? litBg : dimBg;
    });
    this._setTxt(`#${id}Pct`, `${Math.round(frac * 100)}%`);
  }

  /* sun position on the arc from sun.sun */
  _sunData() {
    const attrs = this._hass?.states[this.config.sun || 'sun.sun']?.attributes;
    let rise = '06:00', set = '18:00';
    let t = 0.5, night = false, bell = 0.5;
    const nearestTime = iso => {
      if (!iso) return null;
      try {
        const future = new Date(iso);
        if ((future - Date.now()) > 18 * 3600000) future.setDate(future.getDate() - 1);
        return String(future.getHours()).padStart(2, '0') + ':' + String(future.getMinutes()).padStart(2, '0');
      } catch (e) { return null; }
    };
    if (attrs) {
      rise = nearestTime(attrs.next_rising)  || rise;
      set  = nearestTime(attrs.next_setting) || set;
      const toMin = ts => { const p = ts.split(':').map(Number); return p[0] * 60 + p[1]; };
      const now = new Date();
      const nowMin = now.getHours() * 60 + now.getMinutes();
      const RISE = toMin(rise), SET = toMin(set);
      const dayLen = SET - RISE;
      t = dayLen > 0 ? Math.max(0, Math.min(1, (nowMin - RISE) / dayLen)) : 0.5;
      if (attrs.elevation != null) {
        night = parseFloat(attrs.elevation) < 0;
        bell = Math.max(0, Math.sin(Math.max(0, parseFloat(attrs.elevation)) * Math.PI / 180));
      } else {
        night = nowMin < RISE || nowMin > SET;
        bell  = 1 - Math.pow(Math.abs(2 * t - 1), 1.5);
      }
    }
    // Asymmetric arc v3.2: L(-29,161) → Peak(299,40) → R(607,161)
    // Peak x = midpoint of (-29+607)/2 = 289 → biased slightly right to 299 for visual balance
    const bx = Math.round((1 - t) * (1 - t) * (-29) + 2 * (1 - t) * t * 289 + t * t * 607);
    const by = Math.round((1 - t) * (1 - t) * 161   + 2 * (1 - t) * t * 40  + t * t * 161);
    // Moon: same asymmetric arc, SAME direction as sun (rises east/left, sets west/right)
    let mx = 289, my = 161;
    if (night) {
      const toMin2 = ts => { const p = ts.split(':').map(Number); return p[0] * 60 + p[1]; };
      const RISE2 = toMin2(rise), SET2 = toMin2(set);
      const nowMin2 = new Date().getHours() * 60 + new Date().getMinutes();
      const dayLen2 = SET2 > RISE2 ? SET2 - RISE2 : 0;
      const nightLen = Math.max(1, 1440 - dayLen2);
      let tMoon = nowMin2 >= SET2 ? (nowMin2 - SET2) / nightLen : (nowMin2 + 1440 - SET2) / nightLen;
      tMoon = Math.max(0, Math.min(1, tMoon));
      mx = Math.round((1 - tMoon) * (1 - tMoon) * (-29) + 2 * (1 - tMoon) * tMoon * 289 + tMoon * tMoon * 607);
      my = Math.round((1 - tMoon) * (1 - tMoon) * 161 + 2 * (1 - tMoon) * tMoon * 40  + tMoon * tMoon * 161);
    }
    return { rise, set, night, bell, bx, by, mx, my, t };
  }

  _moonPhase() {
    const known = new Date('2026-05-16T10:01:00Z').getTime();
    const cycle = 29.530588853 * 24 * 3600 * 1000;
    return ((Date.now() - known) % cycle + cycle) % cycle / cycle;
  }

  _moonSVG(phase) {
    const p = ((phase % 1) + 1) % 1;
    const illum = 0.5 - 0.5 * Math.cos(p * Math.PI * 2);
    const r = 26, uid = 'ms' + Math.abs(Math.round(p * 1000));
    if (illum < 0.01) return `<circle cx="0" cy="0" r="${r}" fill="rgba(10,18,45,0.55)"/>`;
    const full = illum > 0.93, waxing = p < 0.5;
    const cx_s = (waxing ? -1 : 1) * r * (1 - Math.cos(p * Math.PI * 2));
    const gxPct = waxing ? '64%' : '36%';
    if (full) {
      return `<defs><radialGradient id="${uid}sg" cx="50%" cy="28%" r="68%">
        <stop offset="0%" stop-color="#f8faff"/><stop offset="45%" stop-color="#c8d0e0"/><stop offset="100%" stop-color="#7a8090"/>
        </radialGradient></defs>
        <circle cx="0" cy="0" r="${r}" fill="rgba(8,15,45,0.60)"/>
        <circle cx="0" cy="0" r="${r}" fill="url(#${uid}sg)"/>
        <circle cx="0" cy="0" r="${r}" fill="none" stroke="rgba(220,235,255,0.65)" stroke-width="1.5"/>`;
    }
    return `<defs><radialGradient id="${uid}sg" cx="${gxPct}" cy="28%" r="68%">
        <stop offset="0%" stop-color="#f0f4ff"/><stop offset="40%" stop-color="#c8d0e0"/><stop offset="100%" stop-color="#7a8090"/>
      </radialGradient>
      <mask id="${uid}lm"><rect x="-50" y="-50" width="100" height="100" fill="black"/>
        <circle cx="0" cy="0" r="${r}" fill="white"/>
        <circle cx="${cx_s.toFixed(2)}" cy="0" r="${r}" fill="black"/></mask></defs>
      <circle cx="0" cy="0" r="${r}" fill="rgba(8,15,45,0.60)"/>
      <circle cx="0" cy="0" r="${r}" fill="url(#${uid}sg)" mask="url(#${uid}lm)"/>
      <circle cx="0" cy="0" r="${r}" fill="none" stroke="rgba(220,235,255,0.55)" stroke-width="1.5" mask="url(#${uid}lm)"/>`;
  }

  /* ══ PV wave helpers (identical to khan-skycard) ══ */
  _flowLevel(w, type) {
    if (type === 'solar') {
      if (w < 200)  return { dur: 4,   size: 1.8, count: 6  };
      if (w < 600)  return { dur: 3.2, size: 2.2, count: 12 };
      if (w < 1200) return { dur: 2.7, size: 2.5, count: 20 };
      if (w < 2500) return { dur: 2.4, size: 2.8, count: 30 };
      if (w < 4000) return { dur: 1.8, size: 3.2, count: 42 };
      if (w < 6000) return { dur: 1.2, size: 3.5, count: 55 };
      return { dur: 0.9, size: 3.8, count: 65 };
    }
    if (w < 150)  return { dur: 4,   size: 1.8, count: 4  };
    if (w < 500)  return { dur: 3.2, size: 2.2, count: 8  };
    if (w < 1000) return { dur: 2.7, size: 2.5, count: 14 };
    if (w < 2000) return { dur: 2.4, size: 2.8, count: 22 };
    if (w < 3000) return { dur: 1.8, size: 3.2, count: 30 };
    if (w < 4500) return { dur: 1.5, size: 3.5, count: 40 };
    return { dur: 0.9, size: 3.8, count: 50 };
  }

  _buildPvWaveHTML(bx, by, pvT) {
    if (pvT <= 10) return '';
    const fl = this._flowLevel(pvT, 'solar');
    const sY = by + 28, cp1Y = by + 70, cp2Y = by + 90;
    /* end extended ~2.5 dashes longer (301 → 341) and moved 3px left (281 → 278) */
    const pD = 'M ' + bx.toFixed(1) + ',' + sY.toFixed(1) +
               ' C ' + bx.toFixed(1) + ',' + cp1Y.toFixed(1) +
               ' 278,' + cp2Y.toFixed(1) + ' 278,341';
    const col = 'rgba(255,232,60,.95)', gc = 'rgba(255,190,20,.55)';
    const dD = (fl.dur * 0.8).toFixed(2);
    const dL = (8 + fl.size * 1.5).toFixed(1);
    const gL = (6 + fl.size * 1.2).toFixed(1);
    const dT = (parseFloat(dL) + parseFloat(gL)).toFixed(1);
    let h = '';
    // Glow track
    h += '<path d="' + pD + '" fill="none" stroke="' + gc + '" stroke-width="6" stroke-dasharray="' + dL + ' ' + gL + '" stroke-linecap="round" opacity="0.25" filter="url(#arcSunF2)"><animate attributeName="stroke-dashoffset" from="' + dT + '" to="0" dur="' + dD + 's" repeatCount="indefinite" calcMode="linear"/></path>';
    // White spine
    h += '<path d="' + pD + '" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="1.8" stroke-dasharray="' + dL + ' ' + gL + '" stroke-linecap="round"><animate attributeName="stroke-dashoffset" from="' + dT + '" to="0" dur="' + dD + 's" repeatCount="indefinite" calcMode="linear"/></path>';
    // Yellow core
    h += '<path d="' + pD + '" fill="none" stroke="' + col + '" stroke-width="1.0" stroke-dasharray="' + dL + ' ' + gL + '" stroke-linecap="round" opacity="0.85"><animate attributeName="stroke-dashoffset" from="' + dT + '" to="0" dur="' + dD + 's" repeatCount="indefinite" calcMode="linear"/></path>';
    // Wave particles
    const wD = [
      { amp: 6,  dur: fl.dur * 0.9, ox: 0, op: 0.9, sc: 'rgba(255,255,255,0.92)', dLen: '3.0', dGap: '40.0' },
      { amp: 10, dur: fl.dur * 1.1, ox: 3, op: 0.6, sc: col,                       dLen: '4.5', dGap: '50.0' },
    ];
    const wc = Math.min(2, Math.max(1, Math.round(fl.count / 5)));
    for (let wi = 0; wi < wc; wi++) {
      const w = wD[wi];
      const sC = Math.round(fl.count * 0.5);
      const sD = w.dur.toFixed(2);
      const sCy = (parseFloat(w.dLen) + parseFloat(w.dGap)).toFixed(1);
      for (let si = 0; si < sC; si++) {
        const fr = si / sC, ph = fr * Math.PI * 2;
        const sY2 = (w.amp * Math.sin(ph + wi * 1.1)).toFixed(1);
        const sX  = (w.ox + w.amp * 0.3 * Math.cos(ph * 0.5)).toFixed(1);
        const sDe = (fr * w.dur % w.dur).toFixed(3);
        const sO  = (w.op * (0.5 + 0.5 * Math.abs(Math.sin(ph))) * 0.6).toFixed(2);
        h += '<g transform="translate(' + sX + ',' + sY2 + ')"><path d="' + pD + '" fill="none" stroke="' + w.sc + '" stroke-width="1.2" stroke-dasharray="' + w.dLen + ' ' + w.dGap + '" stroke-linecap="round" opacity="' + sO + '"><animate attributeName="stroke-dashoffset" from="' + sCy + '" to="0" dur="' + sD + 's" begin="-' + sDe + 's" repeatCount="indefinite" calcMode="linear"/></path></g>';
      }
    }
    return h;
  }

  _updateArc() {
    const root = this.shadowRoot;
    const getEl = id => root.getElementById(id);
    const sun = this._sunData();
    const isDay = !sun.night;
    const bell = sun.bell ?? 0.5;

    // rise/set labels
    this._setTxt('#tRise', sun.rise);
    this._setTxt('#tSet', sun.set);

    // Arc track opacity
    const dayT = getEl('sunArcTrack'), nightT = getEl('sunArcNight');
    if (dayT)   dayT.setAttribute('opacity',   isDay ? '0.50' : '0.15');
    if (nightT) nightT.setAttribute('opacity', isDay ? '0.04' : '0.45');

    // ── Dynamic sun: bell-based radius + colour temperature (exact skycard logic) ──
    const sunGroup = getEl('arcSunGroup');
    if (sunGroup) {
      sunGroup.setAttribute('opacity', isDay ? '1' : '0');
      if (isDay) {
        const coreR = Math.round(14 + bell * 8);         // 14 (horizon) → 22 (zenith)
        const rL1   = Math.round(coreR * 1.7);
        const rL2   = Math.round(coreR * 2.9);
        const rL3   = Math.round(coreR * 5.8);
        const rL4   = Math.round(coreR * 11);
        // Colour temperature: deep orange at horizon → white at zenith
        const c1 = bell < 0.15 ? 'rgba(255,220,120,1)' : 'rgba(255,255,220,1)';
        const c2 = bell < 0.15 ? 'rgba(255,180,60,1)'  : 'rgba(255,240,160,1)';
        const c3 = bell < 0.15 ? 'rgba(255,120,20,1)'  : 'rgba(255,210,80,1)';
        const c4 = bell < 0.15 ? 'rgba(255,80,0,1)'    : 'rgba(255,170,30,1)';
        const o1 = (0.75 + bell * 0.20).toFixed(2);
        const o2 = (0.45 + bell * 0.20).toFixed(2);
        const o3 = (0.22 + bell * 0.12).toFixed(2);
        const o4 = (0.10 + bell * 0.08).toFixed(2);
        const coreIn  = bell < 0.15 ? '#fff4d0' : '#ffffff';
        const coreMid = bell < 0.15 ? '#ffd060' : '#fffbe8';
        const coreOut = bell < 0.15 ? '#ff8020' : '#ffe090';
        // Move all layers to current sun position
        ['sunL4','sunL3','sunL2','sunL1','sunCore'].forEach(id => {
          const e = getEl(id); if (!e) return;
          e.setAttribute('cx', sun.bx); e.setAttribute('cy', sun.by);
        });
        const sl4 = getEl('sunL4'); if (sl4) { sl4.setAttribute('r', rL4); sl4.setAttribute('opacity', o4); }
        const sl3 = getEl('sunL3'); if (sl3) { sl3.setAttribute('r', rL3); sl3.setAttribute('opacity', o3); }
        const sl2 = getEl('sunL2'); if (sl2) { sl2.setAttribute('r', rL2); sl2.setAttribute('opacity', o2); }
        const sl1 = getEl('sunL1'); if (sl1) { sl1.setAttribute('r', rL1); sl1.setAttribute('opacity', o1); }
        const sCore = getEl('sunCore'); if (sCore) sCore.setAttribute('r', coreR);
        // Update gradient stop colours per elevation (live colour temperature)
        const _updGrad = (gradId, centerColor) => {
          const g = root.getElementById(gradId); if (!g) return;
          const stops = g.querySelectorAll('stop');
          if (stops[0]) stops[0].setAttribute('stop-color', centerColor);
          const transparent = centerColor.replace(/,1\)$/, ',0)');
          if (stops[1]) stops[1].setAttribute('stop-color', transparent);
        };
        _updGrad('sunGlowG1', c1); _updGrad('sunGlowG2', c2);
        _updGrad('sunGlowG3', c3); _updGrad('sunGlowG4', c4);
        const sg = root.getElementById('sunCoreGD');
        if (sg) {
          const stops = sg.querySelectorAll('stop');
          if (stops[0]) stops[0].setAttribute('stop-color', coreIn);
          if (stops[1]) stops[1].setAttribute('stop-color', coreMid);
          if (stops[2]) stops[2].setAttribute('stop-color', coreOut);
        }
      }
    }

    // ── Moon: position + phase-accurate SVG, rebuilt only on meaningful phase change ──
    const moonSvgGroup = getEl('moonSvgGroup');
    if (sun.night) {
      if (moonSvgGroup) {
        moonSvgGroup.setAttribute('transform', `translate(${sun.mx},${sun.my})`);
        moonSvgGroup.setAttribute('opacity', '1');
        const currentPhase = this._moonPhase();
        if (Math.abs(currentPhase - this._prevMoonPhase) > 0.005) {
          this._prevMoonPhase = currentPhase;
          const inner = getEl('moonSvgInner');
          if (inner) inner.innerHTML = this._moonSVG(currentPhase);
        }
      }
    } else {
      this._prevMoonPhase = -1;
      if (moonSvgGroup) moonSvgGroup.setAttribute('opacity', '0');
    }

    // ── PV wave: double-buffer A/B, rebuild only on tier/position change ──
    const pvTotal = this._pvSum();
    const _pvTier = pvTotal <= 10 ? 0
      : pvTotal < 200  ? 1 : pvTotal < 600  ? 2 : pvTotal < 1200 ? 3
      : pvTotal < 2500 ? 4 : pvTotal < 4000 ? 5 : pvTotal < 6000 ? 6 : 7;
    const needsRebuild = _pvTier !== this._prevPvTier
      || sun.bx !== this._prevPvWaveBx
      || sun.by !== this._prevPvWaveBy;
    if (needsRebuild) {
      this._prevPvTier   = _pvTier;
      this._prevPvWaveBx = sun.bx;
      this._prevPvWaveBy = sun.by;
      /* Double-buffer swap: there are two wave groups (pvFlowGroupA / pvFlowGroupB).
         Only one is visible (opacity 1) at a time. To redraw, we rebuild the *hidden*
         group's SVG content first, then flip both groups' opacity in the same tick.
         This avoids the flash/flicker that would occur if we instead mutated the
         currently-visible group's innerHTML directly while it's on screen. */
      const activeSlot = this._pvSlot;
      const nextSlot   = activeSlot === 'A' ? 'B' : 'A';
      const nextGroup  = getEl('pvFlowGroup' + nextSlot);
      const activeGroup = getEl('pvFlowGroup' + activeSlot);
      if (nextGroup && activeGroup) {
        nextGroup.innerHTML = this._buildPvWaveHTML(sun.bx, sun.by, pvTotal);
        nextGroup.setAttribute('opacity', '1');
        activeGroup.setAttribute('opacity', '0');
        this._pvSlot = nextSlot;
      }
    }

    // ── PV power bubble: floats just right of sun (skycard exact logic) ──
    const pvBubbleG = getEl('pvBubbleGroup');
    if (pvBubbleG) {
      const pvKw = pvTotal >= 1000 ? this._dec(pvTotal / 1000) + ' kW' : pvTotal.toFixed(0) + ' W';
      const pvShow = pvTotal > 10 && !sun.night;
      pvBubbleG.setAttribute('opacity', pvShow ? '1' : '0');
      if (pvShow) {
        // Banner 104×28; clamp x so it doesn't exit viewBox right edge (≈607)
        const bxp = Math.min(sun.bx + 22, 546);
        const byp = Math.max(sun.by - 28, 0);
        pvBubbleG.setAttribute('transform', `translate(${bxp},${byp})`);
        const txtEl = getEl('pvBubbleVal');
        if (txtEl) txtEl.textContent = pvKw + ' ⚡';
      }
    }
  }

  /* header weather art (simple dynamic set) */
  _drawWeatherArt(cond) {
    const g = this._q('#hWxArt'); if (!g) return;
    const c = (cond || '').toLowerCase();
    let art = '';
    const sun = `<circle cx="14" cy="-6" r="15" fill="none" stroke="#ffd24a" stroke-width="3"/>
      <g stroke="#ffd24a" stroke-width="2.4" stroke-linecap="round">
        <line x1="14" y1="-29" x2="14" y2="-24"/><line x1="-9" y1="-6" x2="-4" y2="-6"/><line x1="32" y1="-6" x2="37" y2="-6"/></g>`;
    const cloud = `<ellipse cx="2" cy="13" rx="32" ry="17" fill="#dde9fa"/><ellipse cx="24" cy="10" rx="18" ry="13" fill="#c3d4ec"/>`;
    const rain = `<g stroke="#6db7ff" stroke-width="2.4" stroke-linecap="round">
      <line x1="-8" y1="28" x2="-12" y2="38"/><line x1="4" y1="28" x2="0" y2="38"/><line x1="16" y1="28" x2="12" y2="38"/></g>`;
    const snow = `<g fill="#eaf4ff"><circle cx="-8" cy="32" r="2.4"/><circle cx="6" cy="35" r="2.4"/><circle cx="18" cy="31" r="2.4"/></g>`;
    const bolt = `<path d="M6 24 L-2 38 H4 L0 50 L12 36 H5 Z" fill="#ffd24a"/>`;
    if (c.includes('thunder')) art = cloud + bolt;
    else if (c.includes('snow') || c.includes('sleet')) art = cloud + snow;
    else if (c.includes('rain') || c.includes('drizzle') || c.includes('pour')) art = cloud + rain;
    else if (c.includes('partly')) art = sun + cloud;
    else if (c.includes('cloud') || c.includes('overcast') || c.includes('fog')) art = cloud;
    else if (c.includes('night')) art = `<path d="M20 -16 a14 14 0 1 0 4 26 a11 11 0 0 1 -4 -26 Z" fill="#e8efff"/>`;
    else art = sun;
    const wrapped = `<svg width="50" height="60" viewBox="-10 -30 60 70" style="display:block;overflow:visible">${art}</svg>`;
    if (g._last !== art) { g.innerHTML = wrapped; g._last = art; }
  }

  /* sparkline + chart from HA history API (cached, throttled) */
  async _fetchHistory(ent, minutes) {
    if (!ent || !this._hass) return null;
    const key = `${ent}|${minutes}`;
    const cache = this._histCache[key];
    if (cache && Date.now() - cache.t < 5 * 60 * 1000) return cache.pts;
    try {
      const start = new Date(Date.now() - minutes * 60000).toISOString();
      const res = await this._hass.callApi('GET',
        `history/period/${start}?filter_entity_id=${ent}&minimal_response&no_attributes`);
      const arr = (res?.[0] || []).map(r => parseFloat(r.state ?? r.s)).filter(Number.isFinite);
      this._histCache[key] = { t: Date.now(), pts: arr };
      return arr;
    } catch { return cache?.pts || null; }
  }
  async _drawSpark(sel, ent, color) {
    const svg = this._q(sel); if (!svg || !ent) return;
    const pts = await this._fetchHistory(ent, 240);
    const path = svg.querySelector('path'); if (!path) return;
    path.setAttribute('stroke', color);
    if (!pts || pts.length < 2) { path.setAttribute('d', ''); return; }
    const w = svg.clientWidth || 160, h = 40;
    const min = Math.min(...pts), max = Math.max(...pts), span = (max - min) || 1;
    const step = Math.max(1, Math.floor(pts.length / 40));
    let d = '';
    for (let i = 0, k = 0; i < pts.length; i += step, k++) {
      const x = 4 + (i / (pts.length - 1)) * (w - 8);
      const y = h - 6 - ((pts[i] - min) / span) * (h - 14);
      d += (k ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1) + ' ';
    }
    path.setAttribute('d', d);
  }
  async _drawHistory(sel, ent, w, h) {
    // sel points to the chart svg id (e.g. '#prChart'); we fill both .fill and line paths
    const svg = this._q(sel); if (!svg || !ent) return;
    const linePath = svg.querySelector('path:not(.fill)');
    const fillPath = svg.querySelector('path.fill');
    if (!linePath) return;
    const pts = await this._fetchHistory(ent, 24 * 60);
    if (!pts || pts.length < 2) return;
    const min = Math.min(...pts), max = Math.max(...pts), span = (max - min) || 1;
    const SCALE_W = 30;            // left gutter for scale labels
    const x0 = SCALE_W + 2, plotW = w - SCALE_W - 6;
    const step = Math.max(1, Math.floor(pts.length / 60));
    let d = '', firstX = 0, lastX = 0, peakX = 0, peakY = 0, peakV = -Infinity;
    for (let i = 0, k = 0; i < pts.length; i += step, k++) {
      const x = x0 + (i / (pts.length - 1)) * plotW;
      const y = h - 5 - ((pts[i] - min) / span) * (h - 12);
      if (k === 0) firstX = x;
      lastX = x;
      if (pts[i] > peakV) { peakV = pts[i]; peakX = x; peakY = y; }
      d += (k ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1) + ' ';
    }
    linePath.setAttribute('d', d);
    if (fillPath) {
      const fillD = d + `L${lastX.toFixed(1)} ${h} L${firstX.toFixed(1)} ${h} Z`;
      fillPath.setAttribute('d', fillD);
    }
    // ── scale + gridlines + baseline + peak marker (rebuilt each draw) ──
    svg.querySelectorAll('.gOverlay').forEach(el => el.remove());
    const NS = 'http://www.w3.org/2000/svg';
    const mk = (tag, attrs, txt) => { const e = document.createElementNS(NS, tag); e.setAttribute('class', 'gOverlay'); for (const k in attrs) e.setAttribute(k, attrs[k]); if (txt != null) e.textContent = txt; svg.appendChild(e); return e; };
    // round max up to a clean number for the scale
    const niceMax = (v) => { if (v <= 0) return 1; const p = Math.pow(10, Math.floor(Math.log10(v))); const n = v / p; const m = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10; return m * p; };
    const top = niceMax(max), mid = top / 2;
    const fmt = (v) => v >= 1000 ? (v / 1000).toFixed(1) + 'k' : (v % 1 ? v.toFixed(1) : String(v));
    const yTop = 4, yMid = h / 2, yBase = h - 5;
    // gridlines
    [yTop, yMid].forEach(yy => mk('line', { x1: x0, y1: yy, x2: w - 2, y2: yy, stroke: 'rgba(255,255,255,.09)', 'stroke-width': '1' }));
    mk('line', { x1: x0, y1: yBase, x2: w - 2, y2: yBase, stroke: 'rgba(255,255,255,.20)', 'stroke-width': '1' });
    // scale labels (right-aligned in gutter)
    const tx = SCALE_W - 3;
    mk('text', { x: tx, y: yTop + 7, 'text-anchor': 'end', 'font-size': '8.5', fill: '#8fb0cc' }, fmt(top));
    mk('text', { x: tx, y: yMid + 3, 'text-anchor': 'end', 'font-size': '8.5', fill: '#8fb0cc' }, fmt(mid));
    mk('text', { x: tx, y: yBase, 'text-anchor': 'end', 'font-size': '8.5', fill: '#8fb0cc' }, '0');
    // x-axis time labels (history spans ~24h ending now): left=24h ago, mid=12h ago, right=now
    {
      const now = new Date();
      const hhmm = (d) => String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
      const tMid = new Date(now.getTime() - 12 * 3600000);
      const tStart = new Date(now.getTime() - 24 * 3600000);
      const ty = h - 0.5;
      mk('text', { x: x0, y: ty, 'text-anchor': 'start', 'font-size': '7.5', fill: '#6f90ac' }, hhmm(tStart));
      mk('text', { x: x0 + plotW / 2, y: ty, 'text-anchor': 'middle', 'font-size': '7.5', fill: '#6f90ac' }, hhmm(tMid));
      mk('text', { x: w - 2, y: ty, 'text-anchor': 'end', 'font-size': '7.5', fill: '#6f90ac' }, 'now');
    }
    // peak marker: dot + dark chip with white text
    if (Number.isFinite(peakV) && peakV > 0) {
      mk('circle', { cx: peakX.toFixed(1), cy: peakY.toFixed(1), r: '2.6', fill: '#fff' });
      const chipTxt = `peak ${fmt(peakV)}`;
      /* measure the actual rendered text width via a temporary, invisible probe element
         rather than approximating ~5.2px/character — a fixed per-char estimate assumes
         English-average glyph width and sizes the chip wrong for wider scripts (Cyrillic,
         accented Latin, etc.) now that the card supports 15 languages. */
      const probe = document.createElementNS(NS, 'text');
      probe.setAttribute('class', 'gOverlay');
      probe.setAttribute('font-size', '8.5'); probe.setAttribute('font-weight', '700'); probe.setAttribute('opacity', '0');
      probe.textContent = chipTxt;
      svg.appendChild(probe);
      const textW = probe.getBBox().width;
      probe.remove();
      const chipW = textW + 14;
      let chipX = peakX + 6; if (chipX + chipW > w - 2) chipX = peakX - 6 - chipW;
      const chipY = Math.max(2, peakY - 14);
      mk('rect', { x: chipX.toFixed(1), y: chipY.toFixed(1), width: chipW.toFixed(1), height: '12', rx: '3', fill: 'rgba(0,0,0,.6)', stroke: 'rgba(255,255,255,.2)', 'stroke-width': '0.6' });
      mk('text', { x: (chipX + chipW / 2).toFixed(1), y: (chipY + 8.5).toFixed(1), 'text-anchor': 'middle', 'font-size': '8.5', 'font-weight': '700', fill: '#fff' }, chipTxt);
    }
  }

  /* ═══════════════════════ RECENT EVENTS ═══════════════════════ */
  /* Live activity feed: watches the configured event entities (automations, motion, doors,
     relays, etc.), shows each one's current state + how long ago it last changed, sorted
     most-recent first. Entities come from config.events_entities (editable in the editor);
     if empty, auto-discovers automations + motion/door/safety binary_sensors. */
  _renderEvents() {
    const c = this.config;
    let ids = (c.events_entities && c.events_entities.length) ? c.events_entities.slice()
      : this._discover([
          { domain: 'automation' },
          { domain: 'binary_sensor', device_class: ['motion', 'occupancy', 'door', 'window', 'gas', 'smoke', 'safety'] },
        ]);
    const rows = [];
    for (const id of ids) {
      const s = this._hass?.states?.[id];
      if (!s) continue;
      const changed = s.last_changed || s.last_updated;
      const changedMs = changed ? new Date(changed).getTime() : null;
      const ago = changedMs ? this._relTime(changedMs) : '';
      const unit = s.attributes?.unit_of_measurement || '';
      let val = `${s.state}${unit ? ' ' + unit : ''}`;
      let col = '#7fd4ff';
      const dom = id.split('.')[0];
      if (dom === 'binary_sensor') {
        const dc = s.attributes?.device_class || '';
        const on = ['on', 'open'].includes(String(s.state).toLowerCase());
        if (/gas|smoke|carbon|safety/.test(dc)) { val = on ? 'ALERT' : 'Clear'; col = on ? '#ff5a5a' : '#7fa3c4'; }
        else if (/door|window|opening|garage/.test(dc)) { val = on ? 'Open' : 'Closed'; col = on ? '#ffb45a' : '#7fa3c4'; }
        else if (/motion/.test(dc)) { val = on ? 'Motion' : 'Clear'; col = on ? '#ffb45a' : '#7fa3c4'; }
        else if (/occupancy|presence/.test(dc)) { val = on ? 'Occupied' : 'Clear'; col = on ? '#ffb45a' : '#7fa3c4'; }
        else if (/moisture|water/.test(dc)) { val = on ? 'Wet' : 'Dry'; col = on ? '#ff5a5a' : '#7fa3c4'; }
        else { val = on ? 'Triggered' : 'Clear'; col = on ? '#ffb45a' : '#7fa3c4'; }
      } else if (dom === 'automation') { const en = String(s.state) === 'on'; val = en ? 'Enabled' : 'Off'; col = en ? '#5ae06e' : '#7fa3c4'; }
      rows.push({ name: this._name(id), value: val, ago, ts: changedMs || 0, col });
    }
    rows.sort((a, b) => b.ts - a.ts);
    const html = rows.slice(0, 12).map(r =>
      `<div style="position:relative;display:flex;align-items:baseline;justify-content:space-between;gap:8px;height:30px;padding:0 14px">
        <span style="font-size:11px;color:#cce4ff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1">${esc(r.name)}</span>
        <span style="font-size:11px;font-weight:650;color:${r.col};white-space:nowrap;flex-shrink:0">${esc(String(r.value))}</span>
        <span style="font-size:10px;color:#7fa3c4;white-space:nowrap;flex-shrink:0;min-width:48px;text-align:right">${esc(r.ago)}</span>
      </div>`).join('') || '<div class="hint" style="padding:10px 14px">No recent events. Add automations or sensors in the editor → Recent Events.</div>';
    const el = this._q('#evRows');
    if (el && el._h !== html) { el.innerHTML = html; el._h = html; }
  }
}

/* ════════════════════════════════════════════════════════════════════
   EDITOR — compact sectioned editor, same key names
   ════════════════════════════════════════════════════════════════════ */
class CasaLunaEditor extends HTMLElement {
  setConfig(config) {
    this._config = { ...config };
    if (this._ownChange) return;     // ignore HA echo of our own change
    this._render();
  }
  set hass(h) {
    const first = !this._hass;
    this._hass = h;
    if (first && !this._rendered) { this._render(); return; }
    this.querySelectorAll('ha-selector').forEach(e => { e.hass = h; });
  }
  connectedCallback() { this._attached = true; if (!this._rendered) this._render(); }

  _fireChanged() {
    this._ownChange = true;
    this.dispatchEvent(new CustomEvent('config-changed',
      { detail: { config: { ...this._config } }, bubbles: true, composed: true }));
    clearTimeout(this._ownChangeTimer);
    this._ownChangeTimer = setTimeout(() => { this._ownChange = false; }, 0);
  }

  _set(key, value) {
    if (this._config[key] === value) return;
    this._config = { ...this._config, [key]: value };
    this._fireChanged();
    // re-render only on structural keys (toggles that show/hide content)
    if (/^_show_|^_extra_tile_\d+_enabled$|^_extra_tile_\d+_entity$|_enabled$|battery_cap_unit|battery2_cap_unit/.test(key)) this._render();
  }

  /* jump a section open + scroll to it (used by on-card pencil via attribute) */
  focusSection(id) {
    if (!this._sectionOpen) this._sectionOpen = {};
    this._sectionOpen[id] = true;
    this._render();
    requestAnimationFrame(() => {
      const el = this.querySelector(`[data-sec="${id}"]`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  _render() {
    if (!this._hass || !this._config) return;
    if (!this._sectionOpen) this._sectionOpen = {};
    const cfg = this._config;

    const style = `<style>
      :host{display:block;font-family:var(--paper-font-body1_-_font-family,inherit)}
      .ed-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:16px;align-items:start}
      .ed-grid > .section{grid-column:auto}
      .ed-grid > .section.wide{grid-column:1 / -1}
      @media (max-width:760px){ .ed-grid{display:block} }
      .section{margin-bottom:14px;border:1px solid var(--divider-color,rgba(0,0,0,.12));border-radius:10px;overflow:hidden}
      .hdr{display:flex;align-items:center;gap:10px;padding:10px 14px;background:var(--secondary-background-color,rgba(0,0,0,.04));
        font-size:.82rem;font-weight:650;letter-spacing:.4px;text-transform:uppercase;color:var(--secondary-text-color);cursor:pointer;user-select:none}
      .chev{display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:5px;
        background:var(--card-background-color,#fff);border:1px solid var(--divider-color,rgba(0,0,0,.15));font-size:.7rem;flex-shrink:0}
      .chip{margin-left:auto;font-size:.72rem;font-weight:600;text-transform:none;padding:2px 10px;border-radius:20px;
        background:var(--card-background-color,#fff);border:1px solid var(--divider-color,rgba(0,0,0,.15));color:var(--primary-text-color)}
      .chip.on{background:var(--primary-color,#03a9f4);border-color:var(--primary-color,#03a9f4);color:#fff}
      .body{padding:12px 14px 4px}
      .sub{margin:8px 0;border:1px dashed var(--divider-color,rgba(0,0,0,.18));border-radius:8px;overflow:hidden}
      .sub .hdr{background:transparent;font-size:.75rem;padding:8px 12px}
      .fld{display:block;position:relative;border:1px solid var(--divider-color,rgba(0,0,0,.42));border-radius:5px;
        padding:6px 12px;background:var(--input-fill-color,var(--secondary-background-color,rgba(0,0,0,.04)));margin-bottom:12px}
      .fld label{display:block;font-size:.7rem;color:var(--secondary-text-color);margin-bottom:2px}
      .fld input{display:block;width:100%;border:none;outline:none;background:transparent;color:var(--primary-text-color);font-size:.95rem;font-family:inherit}
      .lblrow{font-size:.78rem;color:var(--secondary-text-color);margin:0 2px 4px}
      .badge{font-size:.65rem;font-weight:650;color:var(--primary-color,#03a9f4)}
      ha-selector{width:100%;display:block;margin-bottom:12px}
      .grid2{display:grid;grid-template-columns:1fr 1fr;gap:8px}
      .info{font-size:.72rem;line-height:1.5;color:var(--secondary-text-color);background:var(--secondary-background-color,rgba(0,0,0,.04));
        border:1px solid var(--divider-color,rgba(0,0,0,.10));border-radius:7px;padding:7px 10px;margin-bottom:10px}
      .divider{height:1px;background:var(--divider-color,rgba(0,0,0,.08));margin:4px 0 12px}
      .pill{position:relative;display:inline-block;width:40px;height:22px;flex-shrink:0;cursor:pointer}
      /* entity row — quiet single line, tap to expand */
      .erow{border-bottom:1px solid var(--divider-color,rgba(0,0,0,.08))}
      .erow:last-child{border-bottom:none}
      .erow-head{display:flex;align-items:center;gap:9px;padding:9px 4px;cursor:pointer;user-select:none}
      .erow-head:hover{background:var(--secondary-background-color,rgba(0,0,0,.03))}
      .erow-dot{flex-shrink:0;width:8px;height:8px;border-radius:50%}
      .erow-dot.live{background:#39d353}
      .erow-dot.stale{background:#e3b341}
      .erow-dot.none{background:var(--divider-color,rgba(0,0,0,.25))}
      .erow-lbl{font-size:.86rem;font-weight:550;color:var(--primary-text-color);white-space:nowrap;flex-shrink:0}
      .erow-ent{flex:1;text-align:right;font-size:.72rem;color:var(--secondary-text-color);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:ui-monospace,monospace}
      .erow-chev{flex-shrink:0;font-size:.7rem;color:var(--secondary-text-color);width:12px;text-align:center}
      .erow.open .erow-head{background:var(--secondary-background-color,rgba(0,0,0,.04))}
      .erow-body{padding:8px 4px 4px}
      .erow-body ha-selector{width:100%;display:block}
    </style>`;

    const shell = document.createElement('div');
    shell.className = 'ed-grid';
    shell.innerHTML = style;

    const section = (id, icon, title, rows, opts = {}) => {
      if (this._sectionOpen[id] === undefined) this._sectionOpen[id] = (id === 'general');
      const open = this._sectionOpen[id];
      const sec = document.createElement('div');
      sec.className = opts.sub ? 'sub' : (opts.wide ? 'section wide' : 'section');
      sec.dataset.sec = id;
      const hdr = document.createElement('div');
      hdr.className = 'hdr';
      const chev = document.createElement('span'); chev.className = 'chev'; chev.textContent = open ? '▼' : '▶';
      hdr.appendChild(chev);
      const t = document.createElement('span'); t.textContent = `${icon} ${title}`; hdr.appendChild(t);
      hdr.addEventListener('click', () => { this._sectionOpen[id] = !open; this._render(); });
      if (opts.toggleKey) {
        const chip = document.createElement('span');
        chip.className = 'chip' + (opts.toggleOn ? ' on' : '');
        chip.textContent = opts.toggleOn ? '✓ Enabled' : '＋ Enable';
        chip.addEventListener('click', e => { e.stopPropagation(); this._set(opts.toggleKey, !opts.toggleOn); });
        hdr.appendChild(chip);
      }
      sec.appendChild(hdr);
      if (open && !opts.hidden) {
        const body = document.createElement('div'); body.className = 'body';
        rows.forEach(r => r && body.appendChild(r));
        sec.appendChild(body);
      }
      return sec;
    };

    const picker = (key, label, optional = false) => {
      const wrap = document.createElement('div');
      const lbl = document.createElement('div'); lbl.className = 'lblrow';
      lbl.textContent = label + (optional ? '  (optional)' : '');
      const cur = cfg[key];
      if (cur && this._hass.states[cur]) {
        const b = document.createElement('span'); b.className = 'badge';
        b.textContent = '  → ' + this._hass.states[cur].state; lbl.appendChild(b);
      }
      const sel = document.createElement('ha-selector');
      sel.hass = this._hass; sel.selector = { entity: {} }; sel.value = cfg[key] || '';
      sel.addEventListener('value-changed', e => { e.stopPropagation(); this._set(key, e.detail.value || ''); });
      wrap.appendChild(lbl); wrap.appendChild(sel);
      return wrap;
    };

    const textField = (key, label, ph = '') => {
      const wrap = document.createElement('div'); wrap.className = 'fld';
      const lbl = document.createElement('label'); lbl.textContent = label;
      const inp = document.createElement('input'); inp.type = 'text'; inp.placeholder = ph;
      inp.value = cfg[key] !== undefined ? String(cfg[key]) : '';
      inp.addEventListener('change', e => this._set(key, e.target.value));
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') e.target.blur(); });
      wrap.appendChild(lbl); wrap.appendChild(inp);
      return wrap;
    };

    const numberField = (key, label, min, max, step, unit = '') => {
      const wrap = document.createElement('div'); wrap.className = 'fld';
      const lbl = document.createElement('label'); lbl.textContent = unit ? `${label} (${unit})` : label;
      const inp = document.createElement('input'); inp.type = 'number';
      inp.min = min; inp.max = max; inp.step = step;
      inp.value = (cfg[key] !== undefined && cfg[key] !== '') ? String(cfg[key]) : '';
      inp.addEventListener('change', e => {
        let v = parseFloat(e.target.value); if (isNaN(v)) return;
        v = Math.min(max, Math.max(min, v)); if (step >= 1) v = Math.round(v);
        e.target.value = String(v); this._set(key, v);
      });
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') e.target.blur(); });
      wrap.appendChild(lbl); wrap.appendChild(inp);
      return wrap;
    };

    const rangeField = (key, label, min, max, step, unit = '') => {
      const wrap = document.createElement('div'); wrap.className = 'fld';
      const cur = (cfg[key] !== undefined && cfg[key] !== '') ? cfg[key] : min;
      const lbl = document.createElement('label'); lbl.textContent = `${label}: ${cur}${unit}`;
      const inp = document.createElement('input'); inp.type = 'range';
      inp.min = min; inp.max = max; inp.step = step; inp.value = cur; inp.style.width = '100%';
      inp.addEventListener('input', e => { lbl.textContent = `${label}: ${e.target.value}${unit}`; });
      inp.addEventListener('change', e => this._set(key, parseFloat(e.target.value)));
      wrap.appendChild(lbl); wrap.appendChild(inp);
      return wrap;
    };

    const colorField = (key, label, def) => {
      const wrap = document.createElement('div'); wrap.className = 'fld';
      const lbl = document.createElement('label'); lbl.textContent = label;
      const inp = document.createElement('input'); inp.type = 'color';
      inp.value = cfg[key] || def || '#000000';
      inp.style.cssText = 'width:100%;height:34px;padding:2px;background:transparent;border:1px solid rgba(120,180,255,.22);border-radius:8px;cursor:pointer';
      inp.addEventListener('change', e => this._set(key, e.target.value));
      wrap.appendChild(lbl); wrap.appendChild(inp);
      return wrap;
    };

    const listField = (key, label) => {
      const wrap = document.createElement('div'); wrap.className = 'fld';
      const lbl = document.createElement('label'); lbl.textContent = label + '  (comma-separated entity ids)';
      const inp = document.createElement('input'); inp.type = 'text';
      inp.value = (cfg[key] || []).join(', ');
      inp.addEventListener('change', e => this._set(key, e.target.value.split(',').map(s => s.trim()).filter(Boolean)));
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') e.target.blur(); });
      wrap.appendChild(lbl); wrap.appendChild(inp);
      return wrap;
    };

    const grid2 = (...els) => { const g = document.createElement('div'); g.className = 'grid2'; els.forEach(e => { if (e) g.appendChild(e); }); return g; };
    const info = txt => { const d = document.createElement('div'); d.className = 'info'; d.textContent = txt; return d; };
    const divider = () => { const d = document.createElement('div'); d.className = 'divider'; return d; };

    /* full-width CSS pill switch row (label + hint + toggle) — matches khan switchRow */
    const switchRow = (key, labelText, hintText = '', defaultOn = false) => {
      const wrap = document.createElement('div');
      wrap.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px';
      const left = document.createElement('div'); left.style.flex = '1';
      const lbl = document.createElement('div'); lbl.className = 'lblrow'; lbl.style.margin = '0'; lbl.textContent = labelText;
      left.appendChild(lbl);
      if (hintText) { const h = document.createElement('div'); h.style.cssText = 'font-size:.66rem;color:var(--secondary-text-color);line-height:1.4'; h.textContent = hintText; left.appendChild(h); }
      const on = (key in cfg) ? !!cfg[key] : !!defaultOn;
      const tgl = document.createElement('span');
      tgl.style.cssText = `position:relative;flex-shrink:0;width:34px;height:19px;cursor:pointer;border-radius:10px;transition:background .2s;background:${on ? 'var(--primary-color,#03a9f4)' : 'var(--divider-color,rgba(0,0,0,.25))'}`;
      const knb = document.createElement('span');
      knb.style.cssText = `position:absolute;top:2.5px;left:${on ? '17.5px' : '2.5px'};width:14px;height:14px;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.35);transition:left .2s`;
      tgl.appendChild(knb);
      tgl.addEventListener('click', () => { this._set(key, !on); this._render(); });
      wrap.appendChild(left); wrap.appendChild(tgl);
      return wrap;
    };

    /* ENTITY ROW — global standard: one quiet line at rest, tap to expand.
       Rest:     ● Label .................. entity.id (dimmed, or "— none —")
       Expanded: [Rename label input] + [entity picker]   (nothing else)
       Label falls back to defaultLabel; entity falls back to none. */
    const entityRow = (entityKey, defaultLabel, labelKey) => {
      const expanded = !!this._rowOpen?.[entityKey];
      const g = document.createElement('div'); g.className = 'erow' + (expanded ? ' open' : '');

      const curId = cfg[entityKey] || '';
      const live = curId && this._hass?.states?.[curId];
      const labelText = (cfg[labelKey] !== undefined && cfg[labelKey] !== '') ? String(cfg[labelKey]) : defaultLabel;

      /* ---- rest line (always shown, acts as the tap target) ---- */
      const head = document.createElement('div'); head.className = 'erow-head';
      const dot = document.createElement('span'); dot.className = 'erow-dot ' + (live ? 'live' : (curId ? 'stale' : 'none'));
      const lbl = document.createElement('span'); lbl.className = 'erow-lbl'; lbl.textContent = labelText;
      const ent = document.createElement('span'); ent.className = 'erow-ent'; ent.textContent = curId || '— none —';
      const chev = document.createElement('span'); chev.className = 'erow-chev'; chev.textContent = expanded ? '▾' : '▸';
      head.appendChild(dot); head.appendChild(lbl); head.appendChild(ent); head.appendChild(chev);
      head.addEventListener('click', () => {
        if (!this._rowOpen) this._rowOpen = {};
        this._rowOpen[entityKey] = !expanded;
        this._render();
      });
      g.appendChild(head);

      /* ---- expanded body: optional rename + pick ---- */
      if (expanded) {
        const body = document.createElement('div'); body.className = 'erow-body';

        if (labelKey) {
          const lf = document.createElement('div'); lf.className = 'fld';
          const ll = document.createElement('label'); ll.textContent = 'Label';
          const li = document.createElement('input'); li.type = 'text'; li.placeholder = defaultLabel;
          li.value = (cfg[labelKey] !== undefined && cfg[labelKey] !== '') ? String(cfg[labelKey]) : '';
          li.addEventListener('change', e => this._set(labelKey, e.target.value));
          li.addEventListener('keydown', e => { if (e.key === 'Enter') e.target.blur(); });
          lf.appendChild(ll); lf.appendChild(li); body.appendChild(lf);
        }

        const pl = document.createElement('div'); pl.className = 'lblrow'; pl.style.margin = '0 2px 3px';
        pl.textContent = 'Entity';
        if (live) { const b = document.createElement('span'); b.className = 'badge'; b.textContent = '  → ' + this._hass.states[curId].state; pl.appendChild(b); }
        const sel = document.createElement('ha-selector');
        sel.hass = this._hass; sel.selector = { entity: {} }; sel.value = curId;
        sel.addEventListener('value-changed', e => { e.stopPropagation(); this._set(entityKey, e.detail.value || ''); });
        body.appendChild(pl); body.appendChild(sel);

        g.appendChild(body);
      }
      return g;
    };

    /* ═══ SECTIONS ═══ */
    /* eg(entityKey, defaultLabel) → tap-to-expand entity row, picker only.
       egL(...) → same, PLUS a Label rename input — use only for captions the card's
       render code actually reads back (label_<entityKey>). Most captions are fixed
       template text, not config-driven, so a rename input for them would save to
       config and silently do nothing — eg() now defaults to not offering it. */
    const eg = (entityKey, defaultLabel) =>
      entityRow(entityKey, defaultLabel, null);
    const egL = (entityKey, defaultLabel) =>
      entityRow(entityKey, defaultLabel, `label_${entityKey}`);

    /* Battery capacity group — Ah/kWh radio + the matching plain number field.
       Ranges/steps copied from khan: Ah 0–999 step 1; kWh 0–999.99 step 0.01.
       kWh is stored as kWh and converted ×1000 → Wh internally by the card. */
    const capGroup = (titleText, unitKey, ahKey, whKey) => {
      const wrap = document.createElement('div'); wrap.style.marginBottom = '14px';
      const lbl = document.createElement('div'); lbl.className = 'lblrow'; lbl.textContent = titleText;
      wrap.appendChild(lbl);
      const unit = cfg[unitKey] || 'ah';
      const radioWrap = document.createElement('div');
      radioWrap.style.cssText = 'display:flex;gap:18px;margin-bottom:10px';
      const rName = 'bcr_' + unitKey;
      ['ah', 'kwh'].forEach(u => {
        const l = document.createElement('label');
        l.style.cssText = 'display:flex;align-items:center;gap:6px;font-size:.82rem;cursor:pointer;color:var(--primary-text-color)';
        const rb = document.createElement('input');
        rb.type = 'radio'; rb.name = rName; rb.value = u; rb.checked = unit === u;
        rb.style.accentColor = 'var(--primary-color,#03a9f4)';
        rb.addEventListener('change', () => { if (rb.checked) this._set(unitKey, u); });
        l.appendChild(rb); l.appendChild(document.createTextNode(u === 'ah' ? 'Ah (Amp-hours)' : 'kWh'));
        radioWrap.appendChild(l);
      });
      wrap.appendChild(radioWrap);
      wrap.appendChild(unit === 'ah'
        ? numberField(ahKey, 'Battery Capacity', 0, 999, 1, 'Ah')
        : numberField(whKey, 'Battery Capacity', 0, 999.99, 0.01, 'kWh'));
      return wrap;
    };

    /* —— BASIC / ADVANCED split ——
       Basic view shows only the sections needed to get a working card. Everything else
       is hidden behind one toggle (off by default) so the editor isn't an overwhelming
       wall of 25 sections on first open. Pure show/hide — no config/section changes.
       Implemented by intercepting appendChild so the 25 existing section() calls below
       stay untouched: advanced ones are simply dropped when _show_advanced is off. */
    const ADVANCED_SECTIONS = new Set([
      'phaseflip', 'ev', 'thresholds', 'appearance', 'textsizes',
      'nav_cameras', 'nav_energy', 'nav_plugs', 'nav_battery', 'nav_climate',
      'nav_security', 'nav_automation', 'nav_lighting', 'recent_events', 'nav_system', 'testing'
    ]);
    const showAdv = !!cfg._show_advanced;
    const rawAppend = shell.appendChild.bind(shell);
    shell.appendChild = (node) => {
      if (!showAdv && node && node.dataset && ADVANCED_SECTIONS.has(node.dataset.sec)) return node;
      return rawAppend(node);
    };

    /* advanced toggle banner (spans both columns) */
    const advBanner = document.createElement('div');
    advBanner.className = 'section wide';
    advBanner.style.cssText = 'margin-bottom:14px';
    const advHdr = document.createElement('div');
    advHdr.className = 'hdr';
    advHdr.style.cursor = 'default';
    const advT = document.createElement('span');
    advT.textContent = showAdv ? '🛠️ Advanced settings shown' : '✨ Basic view';
    advHdr.appendChild(advT);
    const advChip = document.createElement('span');
    advChip.className = 'chip' + (showAdv ? ' on' : '');
    advChip.textContent = showAdv ? '✓ Advanced' : '＋ Show advanced';
    advChip.style.cursor = 'pointer';
    advChip.addEventListener('click', e => { e.stopPropagation(); this._set('_show_advanced', !showAdv); });
    advHdr.appendChild(advChip);
    advBanner.appendChild(advHdr);
    rawAppend(advBanner);

    shell.appendChild(section('general', '⚙️', 'General', [
      textField('title', 'Title', 'CASA LUNA'),
      textField('inverter_name', 'Inverter Name', 'e.g. My Inverter'),
      divider(),
      capGroup('Battery Capacity', 'battery_cap_unit', 'battery_full_ah', 'battery_full_wh'),
      capGroup('Battery 2 Capacity', 'battery2_cap_unit', 'battery2_full_ah', 'battery2_full_wh'),
      divider(),
      numberField('pv_max_power', 'PV Array Max Power', 0, 30000, 100, 'W'),
      numberField('inverter_max_power', 'Inverter Max Power', 0, 20000, 100, 'W'),
      divider(),
      numberField('lower_section_offset', 'Flow diagram vertical offset', -80, 80, 1, 'SVG units (− = up)'),
      divider(),
      textField('background_path', 'Background Image Path', '/local/community/casa-luna/sky'),
    ]));

    shell.appendChild(section('toggles', '🎚️', 'Toggles', [
      info('Enable or disable cards. Disabled cards are hidden from the dashboard.'),
      switchRow('_show_bars', '📊 PV / PWR bars', 'Both bottom capsule bars', true),
      switchRow('_show_phase', '🔀 Phase / Inverter tile', 'Show the 3-phase + inverter tile (with flip)', true),
      switchRow('_show_battstats', '🔋 Battery value tile', 'Show battery stats (flip → 6 PV strings)', true),
      switchRow('_show_pvtile', '☀️ PV PWR/VOLT tile', 'Show the small PV power/voltage tile next to the battery', true),
      switchRow('_show_pv_extra', '☀️ Extra PV strings', 'Enable PV3–PV6', false),
      switchRow('_show_ev', '🚗 EV / car charger tile', 'Show the EV charger tile', false),
      switchRow('_show_battery2', '🔋 Secondary battery', 'Enable a second battery pack', false),
      divider(),
      switchRow('history_charts', '📈 History charts', 'Fetch & render sparkline/chart history (disable to cut HA history-API calls)', true),
    ]));

    shell.appendChild(section('weather', '☀️', 'Weather & Sun', [
      eg('weather_entity', 'WEATHER'),
      eg('weather_temp_entity', 'TEMPERATURE'),
      eg('weather_wind_entity', 'WIND SPEED'),
      eg('weather_dir_entity', 'WIND DIR'),
      eg('sun', 'SUN'),
    ]));

    shell.appendChild(section('solar', '🔆', 'Solar', [
      eg('pv1_power', 'PV1 POWER'),
      eg('pv2_power', 'PV2 POWER'),
      eg('pv_total_power', 'PV TOTAL POWER'),
      eg('pv1_voltage', 'PV1 VOLT'),
      eg('pv2_voltage', 'PV2 VOLT'),
      section('solar_extra', '➕', 'Extra PV Strings', [
        eg('pv3_power', 'PV3 POWER'),
        eg('pv4_power', 'PV4 POWER'),
        eg('pv5_power', 'PV5 POWER'),
        eg('pv6_power', 'PV6 POWER'),
        eg('pv3_voltage', 'PV3 VOLT'),
        eg('pv4_voltage', 'PV4 VOLT'),
        eg('pv5_voltage', 'PV5 VOLT'),
        eg('pv6_voltage', 'PV6 VOLT'),
      ], { sub: true }),
      divider(),
      eg('today_pv', "TODAY'S PV"),
      egL('total_pv', 'TOTAL PV (lifetime)'),
      textField('label_today_production', "Today's Production — caption", "TODAY'S PRODUCTION"),
    ]));

    shell.appendChild(section('grid', '🔌', 'Grid', [
      switchRow('invert_grid_power', '🔄 Invert grid power sign', 'Enable if positive = exporting (e.g. GoodWe active_power)'),
      divider(),
      eg('grid_active_power', 'GRID POWER'),
      eg('grid_voltage', 'GRID VOLT'),
      info('GRID IMPORT/EXPORT = today (daily-resetting sensor). TOTAL = lifetime cumulative. These should normally be different sensors — but if your inverter only exposes one, it\'s fine to use it for both.'),
      egL('grid_import_today', 'GRID IMPORT (today)'),
      egL('grid_export_energy', 'GRID EXPORT (today)'),
      eg('total_import', 'TOTAL IMPORT (lifetime)'),
      eg('total_export', 'TOTAL EXPORT (lifetime)'),
      textField('label_total_imp', 'Total Import — caption', 'TOTAL IMP'),
      textField('label_total_exp', 'Total Export — caption', 'TOTAL EXP'),
      divider(),
      egL('consump', 'LOAD'),
      eg('today_load', "TODAY'S LOAD"),
      textField('label_today_consumption', "Today's Consumption — caption", "TODAY'S CONSUMPTION"),
    ]));

    shell.appendChild(section('phaseflip', '🔄', 'Phase / Inverter Tile', [
      info('One flip tile: front shows grid 3-phase power/volt, back shows inverter L1–L3 power/volt.'),
      textField('label_phase_title', 'Front title', 'GRID PHASES'),
      eg('grid_phase_a', 'PHASE L1'),
      eg('grid_phase_a_volt', 'L1 VOLT'),
      eg('grid_phase_b', 'PHASE L2'),
      eg('grid_phase_b_volt', 'L2 VOLT'),
      eg('grid_phase_c', 'PHASE L3'),
      eg('grid_phase_c_volt', 'L3 VOLT'),
      divider(),
      textField('label_inv_title', 'Back title', 'INVERTER'),
      eg('inv_l1_power', 'Inverter L1 Power'),
      eg('inv_l2_power', 'Inverter L2 Power'),
      eg('inv_l3_power', 'Inverter L3 Power'),
      eg('inv_l1_volt', 'Inverter L1 Volt'),
      eg('inv_l2_volt', 'Inverter L2 Volt'),
      eg('inv_l3_volt', 'Inverter L3 Volt'),
      divider(),
      info('Optional — for hybrid setups where other inverters also feed the house directly. If set, INV LOAD % uses this inverter\'s own output instead of total house consumption.'),
      eg('inverter_output_power', 'Inverter Output Power'),
    ]));

    shell.appendChild(section('inverter', '🔄', 'Inverter Status', [
      egL('inverter_state', 'INV STATE'),
      eg('inv_temp', 'INVERTER TEMP'),
      eg('inverter_error', 'INVERTER ERROR'),
    ]));

    shell.appendChild(section('battery', '🔋', 'Battery', [
      switchRow('invert_battery_power', '🔄 Invert battery power sign', 'Enable if positive = discharging'),
      divider(),
      eg('battery_soc', 'BATTERY SOC'),
      eg('battery_power', 'BATTERY POWER'),
      eg('battery_current', 'BATTERY CURRENT'),
      eg('battery_voltage', 'BATTERY VOLT'),
      eg('battery_temp1', 'TEMP 1'),
      eg('battery_temp2', 'TEMP 2'),
      switchRow('cell_temp_x10', '🌡️ Cell temp ×10', 'Enable if cell temps read 10× too low (e.g. shows 3.3 instead of 33°C)'),
      eg('battery_mos', 'BMS TEMP'),
      eg('battery_min_cell', 'MIN CELL'),
      eg('battery_max_cell', 'MAX CELL'),
      divider(),
      info('Captions for the battery stat rows shown in the MODE panel (top right of the dashboard).'),
      textField('label_cell_temp', 'Cell Temp row — caption', 'Cell Temp'),
      textField('label_bms_temp', 'BMS Temp row — caption', 'BMS Temp'),
      textField('label_cell_volt', 'Cell Volt row — caption', 'Cell Volt'),
      textField('label_batt_current', 'Battery Current row — caption', 'BATT CURRENT'),
      textField('label_capacity', 'Capacity row — caption', 'CAPACITY'),
      textField('label_endurance', 'Endurance row — caption', 'Endurance'),
      divider(),
      info('BATT CHARGE and DISCHARGE are two different sensors (energy in vs out). If one reads ~1000× the other, check that both report the same unit (Wh vs kWh) in Developer Tools.'),
      eg('today_batt_chg', 'BATT CHARGE'),
      eg('batt_dis', 'Batt Discharge'),
      textField('label_chg_dis', 'Charge/Discharge — caption', 'CHG / DIS'),
      section('battery2', '🔋', 'Secondary Battery', [
        eg('battery2_soc', 'BATT2 SOC'),
        eg('battery2_power', 'BATT2 POWER'),
        eg('battery2_current', 'BATT2 CURRENT'),
        eg('battery2_voltage', 'BATT2 VOLT'),
        eg('battery2_mos', 'BATT2 BMS'),
      ], { sub: true }),
    ]));

    shell.appendChild(section('ev', '🚗', 'EV / Car Charger', [
      eg('charger_state', 'CHARGER STATE'),
      eg('charger_power', 'CHARGER POWER'),
      eg('charger_current', 'CHARGER CURRENT'),
      eg('charger_soc', 'CAR SOC'),
      eg('charger_eta', 'CHARGE ETA'),
      numberField('charger_battery_capacity_wh', 'EV Battery Capacity', 0, 200000, 1, 'Wh'),
    ]));

    /* Bottom 6 tiles — each its own subsection with enable toggle */
    const bottomRows = [];
    for (let i = 1; i <= 6; i++) {
      const on = !!cfg[`_extra_tile_${i}_enabled`];
      /* entity picker + explicit Clear button (reliable removal, no fallback) */
      const entWrap = picker(`_extra_tile_${i}_entity`, 'Entity');
      if (cfg[`_extra_tile_${i}_entity`]) {
        const clr = document.createElement('button');
        clr.textContent = '✕ Clear entity';
        clr.style.cssText = 'margin-top:6px;padding:5px 12px;font-size:.78rem;cursor:pointer;border:1px solid var(--divider-color,rgba(0,0,0,.2));border-radius:6px;background:var(--card-background-color,#fff);color:var(--primary-text-color)';
        clr.addEventListener('click', () => this._set(`_extra_tile_${i}_entity`, ''));
        entWrap.appendChild(clr);
      }
      bottomRows.push(section(`bottom_tile_${i}`, on ? '✅' : '⬜', `Bottom Tile ${i}`, [
        textField(`_extra_tile_${i}_label`, 'Label text', `Tile ${i}`),
        textField(`_extra_tile_${i}_icon`, 'Icon — animated: flame,snow,water,heat,fan,bulb,plug · static: home,bolt,batt,therm,shield,gear,sun,pump,irrig,warn'),
        entWrap,
      ], { sub: true, toggleKey: `_extra_tile_${i}_enabled`, toggleOn: on, hidden: !on }));
    }
    shell.appendChild(section('bottom', '🎛️', 'Bottom Tiles (1–6)', bottomRows));

    shell.appendChild(section('thresholds', '⚡', 'Thresholds', [
      info('When a value crosses these, it turns amber (warn) or red (critical).'),
      grid2(
        numberField('thresh_temp_warn', 'Temp Warn', 0, 200, 1, '°C'),
        numberField('thresh_temp_critical', 'Temp Critical', 0, 200, 1, '°C'),
      ),
      grid2(
        numberField('thresh_cell_v_low', 'Cell V Low', 0, 5, 0.01, 'V'),
        numberField('thresh_cell_v_critical', 'Cell V Critical', 0, 5, 0.01, 'V'),
      ),
      grid2(
        numberField('thresh_cell_v_high', 'Cell V High', 0, 5, 0.01, 'V'),
      ),
      grid2(
        numberField('thresh_soc_low', 'SOC Low', 0, 100, 1, '%'),
        numberField('thresh_soc_critical', 'SOC Critical', 0, 100, 1, '%'),
      ),
      grid2(
        numberField('thresh_load_warn', 'Load Warn', 0, 100, 1, '%'),
        numberField('thresh_load_critical', 'Load Critical', 0, 100, 1, '%'),
      ),
    ]));

    shell.appendChild(section('appearance', '🎨', 'Appearance', [
      info('Global background tint, opacity and blur applied to all tiles, nav buttons and bars. Defaults match the current design.'),
      colorField('ui_bg_color', 'Background colour', '#000000'),
      rangeField('ui_bg_opacity', 'Background opacity', 0, 100, 1, '%'),
      rangeField('ui_blur', 'Background blur', 0, 30, 1, 'px'),
      divider(),
      rangeField('edge_dim_opacity', '🌑 Edge dim overlay', 0, 100, 1, '%'),
      info('Tap the clock to open a month calendar. Add calendar entities to show their events.'),
      listField('calendar_entities', 'Calendar entities'),
    ]));

    shell.appendChild(section('textsizes', '🔠', 'Text Sizes', [
      info('Font size (px) for each group. Defaults match the current design — change only what you want bigger or smaller.'),
      grid2(
        numberField('sz_soc', 'Battery SOC %', 8, 48, 1, 'px'),
        numberField('sz_mode', 'Mode word', 8, 40, 1, 'px'),
      ),
      grid2(
        numberField('sz_invstate', 'Inverter state', 8, 30, 1, 'px'),
        numberField('sz_invload', 'INV Load %', 8, 40, 1, 'px'),
      ),
      grid2(
        numberField('sz_flow_power', 'Flow line — power', 8, 32, 1, 'px'),
        numberField('sz_flow_volt', 'Flow line — voltage', 8, 28, 1, 'px'),
      ),
      grid2(
        numberField('sz_batbox_label', 'Battery box — labels', 8, 24, 1, 'px'),
        numberField('sz_batbox_value', 'Battery box — values', 8, 30, 1, 'px'),
      ),
      grid2(
        numberField('sz_tile_label', 'Middle tiles — labels', 8, 24, 1, 'px'),
        numberField('sz_tile_value', 'Middle tiles — values', 8, 34, 1, 'px'),
      ),
      grid2(
        numberField('sz_prodcons_total', 'Prod/Cons totals', 8, 30, 1, 'px'),
        numberField('sz_pvtile', 'PV PWR tile', 8, 28, 1, 'px'),
      ),
      grid2(
        numberField('sz_bottile_label', 'Bottom tiles — labels', 8, 24, 1, 'px'),
        numberField('sz_bottile_value', 'Bottom tiles — values', 8, 30, 1, 'px'),
      ),
      numberField('sz_totals_value', 'Inverter totals — values', 8, 30, 1, 'px'),
    ]));

    /* ── Per-view entity configuration (every field from the 9 nav panels) ── */
    shell.appendChild(section('nav_cameras', '📷', 'Cameras', [
      info('Pick a camera entity and it just works — streams live via Home Assistant\'s own camera proxy, no extra setup. Leave "Stream base URL" empty unless you run go2rtc.'),
      textField('camera_stream_base', 'go2rtc base URL (optional — for lower-latency WebRTC)', 'http://192.168.3.109:1984'),
      picker('sec_cam1', 'Camera 1 (Front)', true),
      picker('sec_cam2', 'Camera 2 (Gate)', true),
    ]));

    shell.appendChild(section('nav_energy', '⚡', 'Energy View', [
      info('Monitoring rows + GoodWe inverter controls. Leave blank to show a dimmed slot.'),
      picker('en_pv1', 'PV1 Power', true), picker('en_pv2', 'PV2 Power', true),
      picker('en_grid_power', 'Grid Power', true), picker('en_load', 'House Load', true),
      picker('en_backup', 'Backup Load', true), picker('en_work_mode', 'Work Mode', true),
      divider(),
      picker('en_backup_supply', 'Backup supply (switch)', true),
      picker('en_ems_mode', 'EMS mode (select)', true),
      picker('en_op_mode', 'Operation mode (select)', true),
      picker('en_export_switch', 'Grid export limit (switch)', true),
      picker('en_export_limit', 'Export limit (number)', true),
      picker('en_dod_holding', 'DOD holding (switch)', true),
      picker('en_soc_protect', 'SoC protection (number)', true),
      picker('en_dod_ongrid', 'DoD on-grid (number)', true),
      picker('en_dod_offgrid', 'DoD off-grid (number)', true),
      picker('en_eco_power', 'Eco mode power (number)', true),
      picker('en_ems_power', 'EMS power (number)', true),
      picker('en_grid_switch', 'Grid switch (Tuya)', true),
      picker('en_sync_time', 'Sync time (button)', true),
    ], { wide: true }));

    shell.appendChild(section('nav_plugs', '🔌', 'Smart Plugs View', [
      info('Smart plugs — pick a switch, optionally name it and add a power sensor. Tap a plug tile to toggle. Empty slots are hidden.'),
      picker('plug_1_entity', 'Plug 1', true), textField('plug_1_name', 'Plug 1 — name'), picker('plug_1_power', 'Plug 1 — power', true),
      picker('plug_2_entity', 'Plug 2', true), textField('plug_2_name', 'Plug 2 — name'), picker('plug_2_power', 'Plug 2 — power', true),
      picker('plug_3_entity', 'Plug 3', true), textField('plug_3_name', 'Plug 3 — name'), picker('plug_3_power', 'Plug 3 — power', true),
      picker('plug_4_entity', 'Plug 4', true), textField('plug_4_name', 'Plug 4 — name'), picker('plug_4_power', 'Plug 4 — power', true),
      picker('plug_5_entity', 'Plug 5', true), textField('plug_5_name', 'Plug 5 — name'), picker('plug_5_power', 'Plug 5 — power', true),
      picker('plug_6_entity', 'Plug 6', true), textField('plug_6_name', 'Plug 6 — name'), picker('plug_6_power', 'Plug 6 — power', true),
    ], { wide: true }));

    shell.appendChild(section('nav_battery', '🔋', 'Battery View', [
      info('These are separate from the main General/Battery section above. Leave blank to automatically use the same entities as the main battery box.'),
      picker('bat_soc', 'State of Charge', true), picker('bat_voltage', 'Voltage', true),
      picker('bat_current', 'Current', true), picker('bat_power', 'Power', true),
      picker('bat_remain', 'Remaining', true),
      picker('bat_cellmax', 'Cell Max', true), picker('bat_cellmin', 'Cell Min', true),
      picker('bat_temp1', 'Temp 1', true), picker('bat_temp2', 'Temp 2', true), picker('bat_mos', 'MOS Temp', true),
      divider(),
      picker('bat_charge_enable', 'Charging enable (switch)', true),
      picker('bat_discharge_enable', 'Discharging enable (switch)', true),
      picker('bat_force_charge', 'Force charge (switch)', true),
      picker('bat_soc_limit', 'Charge SoC limit (number)', true),
    ], { wide: true }));

    shell.appendChild(section('nav_climate', '🌡️', 'Climate View', [
      switchRow('auto_discover_climate', 'Auto-discover', 'Show all climate.* + temp/humidity sensors automatically (ignores manual picks below).'),
      info('Pick an entity and optionally give it a custom name. Empty slots are hidden.'),
      picker('clim_ac', 'AC (climate)', true), textField('clim_ac_name', 'AC — name', 'AC'),
      picker('clim_fridge_temp', 'Fridge Temp', true), textField('clim_fridge_temp_name', 'Fridge Temp — name', 'Fridge'),
      picker('clim_fridge_door', 'Fridge Door', true), textField('clim_fridge_door_name', 'Fridge Door — name', 'Door'),
      picker('clim_fridge_power', 'Fridge Power', true), textField('clim_fridge_power_name', 'Fridge Power — name', 'Power'),
      picker('clim_ambient', 'Room Temp', true), textField('clim_ambient_name', 'Room Temp — name', 'Room'),
      picker('clim_humidity', 'Humidity', true), textField('clim_humidity_name', 'Humidity — name', 'Humidity'),
      picker('clim_lux', 'Light Level', true), textField('clim_lux_name', 'Light Level — name', 'Lux'),
      picker('clim_window_ac', 'Window→AC off (switch)', true),
      picker('clim_schedule', 'AC schedule (switch)', true),
      divider(),
      info('Extra entities (rooms, sensors). Pick + name each; leave empty to skip.'),
      picker('clim_extra_1_entity', 'Extra 1', true), textField('clim_extra_1_name', 'Extra 1 — name'),
      picker('clim_extra_2_entity', 'Extra 2', true), textField('clim_extra_2_name', 'Extra 2 — name'),
      picker('clim_extra_3_entity', 'Extra 3', true), textField('clim_extra_3_name', 'Extra 3 — name'),
      picker('clim_extra_4_entity', 'Extra 4', true), textField('clim_extra_4_name', 'Extra 4 — name'),
      picker('clim_extra_5_entity', 'Extra 5', true), textField('clim_extra_5_name', 'Extra 5 — name'),
      picker('clim_extra_6_entity', 'Extra 6', true), textField('clim_extra_6_name', 'Extra 6 — name'),
    ], { wide: true }));

    shell.appendChild(section('nav_security', '🛡️', 'Security View', [
      switchRow('auto_discover_security', 'Auto-discover', 'Show all cameras + gas/smoke/motion/door binary_sensors automatically.'),
      info('Pick + name each. Empty slots are hidden.'),
      picker('sec_flame', 'Flame', true), textField('sec_flame_name', 'Flame — name', 'Flame'),
      picker('sec_gas_analog', 'Gas (analog)', true), textField('sec_gas_analog_name', 'Gas — name', 'Gas'),
      picker('sec_gas_digital', 'Gas Alert', true), textField('sec_gas_digital_name', 'Gas Alert — name', 'Gas Alert'),
      picker('sec_motion', 'Motion', true), textField('sec_motion_name', 'Motion — name', 'Motion'),
      picker('sec_door1', 'Front Door', true), textField('sec_door1_name', 'Front Door — name', 'Front Door'),
      picker('sec_window1', 'Window', true), textField('sec_window1_name', 'Window — name', 'Window'),
      picker('sec_scene_arm', 'Arm Away (scene)', true),
      picker('sec_scene_disarm', 'Disarm (scene)', true),
      picker('sec_scene_night', 'Night (scene)', true),
      picker('sec_motion_alert', 'Motion alert (switch)', true),
      divider(),
      info('Extra entities. Pick + name each; leave empty to skip.'),
      picker('sec_extra_1_entity', 'Extra 1', true), textField('sec_extra_1_name', 'Extra 1 — name'),
      picker('sec_extra_2_entity', 'Extra 2', true), textField('sec_extra_2_name', 'Extra 2 — name'),
      picker('sec_extra_3_entity', 'Extra 3', true), textField('sec_extra_3_name', 'Extra 3 — name'),
      picker('sec_extra_4_entity', 'Extra 4', true), textField('sec_extra_4_name', 'Extra 4 — name'),
      picker('sec_extra_5_entity', 'Extra 5', true), textField('sec_extra_5_name', 'Extra 5 — name'),
      picker('sec_extra_6_entity', 'Extra 6', true), textField('sec_extra_6_name', 'Extra 6 — name'),
    ], { wide: true }));

    shell.appendChild(section('nav_automation', '⚙️', 'Automation View', [
      switchRow('auto_discover_automation', 'Auto-discover', 'Show all scenes + automations + switches + helpers automatically.'),
      info('Scenes, relays, automations, modes, Alexa, and Tuya timers.'),
      picker('auto_scene_night', 'Good Night (scene)', true),
      picker('auto_scene_morning', 'Morning (scene)', true),
      picker('auto_scene_away', 'Away (scene)', true),
      picker('auto_scene_movie', 'Movie (scene)', true),
      picker('auto_scene_party', 'Party (scene)', true),
      picker('auto_scene_home', 'Home (scene)', true),
      divider(),
      info('Relays — pick + rename each. Empty slots are hidden.'),
      picker('auto_relay1', 'Relay 1', true), textField('auto_relay1_name', 'Relay 1 — name', 'Relay 1'),
      picker('auto_relay2', 'Relay 2', true), textField('auto_relay2_name', 'Relay 2 — name', 'Relay 2'),
      picker('auto_relay3', 'Relay 3', true), textField('auto_relay3_name', 'Relay 3 — name', 'Relay 3'),
      picker('auto_relay4', 'Relay 4', true), textField('auto_relay4_name', 'Relay 4 — name', 'Relay 4'),
      divider(),
      info('Extra switches/automations. Pick + name each; leave empty to skip.'),
      picker('auto_extra_1_entity', 'Extra 1', true), textField('auto_extra_1_name', 'Extra 1 — name'),
      picker('auto_extra_2_entity', 'Extra 2', true), textField('auto_extra_2_name', 'Extra 2 — name'),
      picker('auto_extra_3_entity', 'Extra 3', true), textField('auto_extra_3_name', 'Extra 3 — name'),
      picker('auto_extra_4_entity', 'Extra 4', true), textField('auto_extra_4_name', 'Extra 4 — name'),
      picker('auto_extra_5_entity', 'Extra 5', true), textField('auto_extra_5_name', 'Extra 5 — name'),
      picker('auto_extra_6_entity', 'Extra 6', true), textField('auto_extra_6_name', 'Extra 6 — name'),
      divider(),
      picker('auto_motion_lights', 'Motion lights (automation)', true),
      picker('auto_sunset_lights', 'Sunset lights (automation)', true),
      picker('auto_door_alerts', 'Door alerts (automation)', true),
      picker('auto_low_batt', 'Low-battery (automation)', true),
      picker('auto_smoke_fan', 'Smoke→fan (automation)', true),
      divider(),
      picker('auto_night_mode', 'Night Mode (input_boolean)', true),
      picker('auto_vacation_mode', 'Vacation Mode (input_boolean)', true),
      picker('auto_guest_mode', 'Guest Mode (input_boolean)', true),
      picker('auto_alexa', 'Alexa media_player', true),
      divider(),
      info('Tuya timers: pick the outlet switch + 2 input_datetime helpers (ON/OFF) + an input_boolean (timer enable). An HA automation reads these helpers to do the switching.'),
      picker('tuya_sw1', 'Outlet 1 switch', true),
      picker('tuya_sw1_on', 'Outlet 1 ON time (input_datetime)', true),
      picker('tuya_sw1_off', 'Outlet 1 OFF time (input_datetime)', true),
      picker('tuya_sw1_timer', 'Outlet 1 timer enable (input_boolean)', true),
      picker('tuya_sw2', 'Outlet 2 switch', true),
      picker('tuya_sw2_on', 'Outlet 2 ON time (input_datetime)', true),
      picker('tuya_sw2_off', 'Outlet 2 OFF time (input_datetime)', true),
      picker('tuya_sw2_timer', 'Outlet 2 timer enable (input_boolean)', true),
    ], { wide: true }));

    shell.appendChild(section('nav_lighting', '💡', 'Lighting View', [
      switchRow('auto_discover_lighting', 'Auto-discover', 'Show all light.* entities automatically (each with brightness).'),
      info('Pick + name each. Empty slots are hidden.'),
      picker('light1', 'Light 1 (Living Room)', true), textField('light1_name', 'Light 1 — name', 'Living Room'),
      picker('light2', 'Light 2 (Bedroom)', true), textField('light2_name', 'Light 2 — name', 'Bedroom'),
      picker('light3', 'Light 3 (Kitchen)', true), textField('light3_name', 'Light 3 — name', 'Kitchen'),
      picker('light_zigbee', 'Zigbee Light', true), textField('light_zigbee_name', 'Zigbee Light — name', 'Zigbee Light'),
      picker('light_all_on', 'All On (script)', true),
      picker('light_all_off', 'All Off (script)', true),
      picker('light_adaptive', 'Adaptive lighting (switch)', true),
      divider(),
      info('Extra lights. Pick + name each; leave empty to skip.'),
      picker('light_extra_1_entity', 'Extra 1', true), textField('light_extra_1_name', 'Extra 1 — name'),
      picker('light_extra_2_entity', 'Extra 2', true), textField('light_extra_2_name', 'Extra 2 — name'),
      picker('light_extra_3_entity', 'Extra 3', true), textField('light_extra_3_name', 'Extra 3 — name'),
      picker('light_extra_4_entity', 'Extra 4', true), textField('light_extra_4_name', 'Extra 4 — name'),
      picker('light_extra_5_entity', 'Extra 5', true), textField('light_extra_5_name', 'Extra 5 — name'),
      picker('light_extra_6_entity', 'Extra 6', true), textField('light_extra_6_name', 'Extra 6 — name'),
    ], { wide: true }));

    shell.appendChild(section('recent_events', '📋', 'Recent Events', [
      info('Entities watched in the Recent Events box (sorted by most-recent change). Leave empty to auto-show automations + motion/door/safety sensors.'),
      listField('events_entities', 'Watched entities'),
    ]));

    shell.appendChild(section('nav_system', '🖥️', 'System View', [
      picker('sys_inv_temp', 'Inverter Temp', true), picker('sys_work_mode', 'Work Mode', true),
      picker('sys_c3_status', 'C3 Status', true), picker('sys_board_temp', 'Board Temp', true),
      picker('sys_gas', 'Gas Level', true), picker('sys_lux', 'Light Level', true),
      picker('sys_wifi', 'WiFi Signal', true), picker('sys_bluetooth', 'Bluetooth', true), picker('sys_grid_meter', 'Grid Meter', true),
      picker('sys_cpu', 'CPU', true), picker('sys_memory', 'Memory', true),
      picker('sys_disk', 'Disk', true), picker('sys_uptime', 'Uptime', true),
    ]));

    shell.appendChild(section('testing', '🧪', 'Testing', [
      switchRow('_demo_mode', 'Demo Mode',
        'Fills in any unset or unavailable entity with plausible mock data, so every tile, popup and animation can be tested with zero real entities. ' +
        'Configured entities that ARE available keep showing their real values. Taps/toggles on mock entities only change the mock — real devices and services are never called. ' +
        'A "DEMO MODE" badge appears on the card while this is on.'),
    ]));

    this.innerHTML = '';
    this.appendChild(shell);
    this._rendered = true;
  }
}

/* ── register (collision-safe) ── */
if (!customElements.get('casa-luna')) customElements.define('casa-luna', CasaLuna);
if (!customElements.get('casa-luna-editor')) customElements.define('casa-luna-editor', CasaLunaEditor);
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'casa-luna',
  name: 'Casa Luna',
  description: 'Casa Luna by The Khan — energy dashboard — scenic background, live energy flows, clickable navigation.',
  preview: false,
});
console.info(`%c CASA-LUNA %c v${VERSION} `, 'background:#0a2a55;color:#7fd4ff;font-weight:700', 'background:#123;color:#9ae63c');
})();
