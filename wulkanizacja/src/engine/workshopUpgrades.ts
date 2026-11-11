/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Upgrade } from '../types/game';

export const WORKSHOP_100_UPGRADES: Upgrade[] = [
  // =========================================================================
  // 1. MASZYNY & URZĄDZENIA GŁÓWNE (EQUIPMENT) - 20 ULEPSZEŃ
  // =========================================================================
  {
    id: 'turbo_compressor',
    name: 'Kompresor śrubowy 12 bar ze zbiornikiem 500L',
    category: 'equipment',
    cost: 450,
    purchased: false,
    description: 'Błyskawiczne zasilanie kluczy pneumatycznych. Brak spadków ciśnienia.',
    icon: 'wind',
    multiplierEffect: '+35% prędkości kluczy udarowych',
    tier: 1
  },
  {
    id: 'laser_balancer',
    name: 'Laserowa wyważarka 3D z sonarem szerokości',
    category: 'equipment',
    cost: 650,
    purchased: false,
    description: 'Automatyczny bezdotykowy pomiar parametrów koła i wskaźnik laserowy punktu klejenia.',
    icon: 'gauge',
    multiplierEffect: '2x szybsze wyważanie kół',
    tier: 1
  },
  {
    id: 'auto_montazownica',
    name: 'Montażownica automatyczna z ramieniem RunFlat',
    category: 'equipment',
    cost: 800,
    purchased: false,
    description: 'Pneumatyczne ramię wspomagające i system bezłyżkowy Leverless chroniący ranty felg.',
    icon: 'wrench',
    multiplierEffect: '+40% tempa zmiany opon',
    tier: 2
  },
  {
    id: 'hydraulic_rapid_lift',
    name: 'Podnośniki elektrohydrauliczne Rapid Lift',
    category: 'equipment',
    cost: 550,
    purchased: false,
    description: 'Podwójne siłowniki hydrauliczne podnoszące i opuszczające auto w 12 sekund.',
    icon: 'zap',
    multiplierEffect: '2x szybszy podnośnik aut',
    tier: 1
  },
  {
    id: 'wheel_washer',
    name: 'Automatyczna myjka do kół z granulatem',
    category: 'equipment',
    cost: 700,
    purchased: false,
    description: 'Czyści felgi i opony pod ciśnieniem z pyłu hamulcowego przed wyważeniem.',
    icon: 'sparkles',
    multiplierEffect: '+30 zł do każdego zlecenia',
    tier: 2
  },
  {
    id: 'nitrogen_station',
    name: 'Generator azotu N2 z podwójną filtracją',
    category: 'equipment',
    cost: 950,
    purchased: false,
    description: 'Pompowanie kół czystym azotem gwarantuje stabilne ciśnienie w każdych warunkach.',
    icon: 'flame',
    multiplierEffect: '+40 zł zysku z pompowania N2',
    tier: 2
  },
  {
    id: 'tpms_diagnostic_kit',
    name: 'Programator i tester czujników TPMS Pro',
    category: 'equipment',
    cost: 1100,
    purchased: false,
    description: 'Bezprzewodowe klonowanie i programowanie czujników ciśnienia w kołach.',
    icon: 'award',
    multiplierEffect: '+50 zł za serwis czujników TPMS',
    tier: 3
  },
  {
    id: 'bead_bazooka',
    name: 'Pneumatyczny inflator zbiornikowy Bazooka 12L',
    category: 'equipment',
    cost: 380,
    purchased: false,
    description: 'Błyskawiczne uderzenie sprężonym powietrzem do osadzania opornych opon na feldze.',
    icon: 'zap',
    multiplierEffect: '+25% tempa na montażownicy',
    tier: 1
  },
  {
    id: 'rim_straightener',
    name: 'Hydrauliczna prostownica do felg aluminiowych',
    category: 'equipment',
    cost: 1450,
    purchased: false,
    description: 'Tłoczek z czujnikiem zegarowym do naprawy skrzywionych rantów felg.',
    icon: 'wrench',
    multiplierEffect: '+60 zł bonusu za prostowanie',
    tier: 3
  },
  {
    id: 'induction_heater',
    name: 'Podgrzewacz indukcyjny do zapieczonych śrub',
    category: 'equipment',
    cost: 520,
    purchased: false,
    description: 'Rozgrzewa zapieczone śruby w 5 sekund bez użycia otwartego ognia palnika.',
    icon: 'flame',
    multiplierEffect: 'Brak opóźnień przy rdzy',
    tier: 2
  },
  {
    id: 'vulcanizing_autoclave',
    name: 'Wulkanizator termopress do napraw na gorąco',
    category: 'equipment',
    cost: 1250,
    purchased: false,
    description: 'Trwała wulkanizacja uszkodzeń bocznych opony metodą wgrzewania na gorąco.',
    icon: 'shield',
    multiplierEffect: '+45 zł za naprawy opon ciężkich',
    tier: 3
  },
  {
    id: 'tire_truer_lathe',
    name: 'Maszyna do optymalizacji bicia kół Road Force',
    category: 'equipment',
    cost: 2100,
    purchased: false,
    description: 'Rolka dociskowa imitująca nacisk 600 kg na koło podczas wyważania.',
    icon: 'gauge',
    multiplierEffect: '+15% reputacji z każdego auta',
    tier: 4
  },
  {
    id: 'mobile_scissor_lift',
    name: 'Pomocnicze podnośniki nożycowe niskiego profilu',
    category: 'equipment',
    cost: 1600,
    purchased: false,
    description: 'Ułatwia obsługę aut sportowych z obniżonym zawieszeniem bez podkładania desek.',
    icon: 'zap',
    multiplierEffect: '+20% tempa podnoszenia aut',
    tier: 3
  },
  {
    id: 'bead_breaker_mega',
    name: 'Zbijak stopki pneumatyczny dwukierunkowy',
    category: 'equipment',
    cost: 620,
    purchased: false,
    description: 'Nacisk 3.5 tony bez problemu zrywa stopkę opon typu RunFlat i opon dostawczych.',
    icon: 'wrench',
    multiplierEffect: '+30% tempa demontażu opon',
    tier: 2
  },
  {
    id: 'central_vacuum_exhaust',
    name: 'Centralny odciąg pyłu i oparów wulkanizacyjnych',
    category: 'equipment',
    cost: 900,
    purchased: false,
    description: 'Czyste powietrze w hali warsztatowej, mechanicy pracują bez zmęczenia.',
    icon: 'wind',
    multiplierEffect: '+10% tempa wszystkich pracowników',
    tier: 2
  },
  {
    id: 'ultrasonic_parts_cleaner',
    name: 'Myjka ultradźwiękowa do śrub i nakrętek',
    category: 'equipment',
    cost: 480,
    purchased: false,
    description: 'Błyskawicznie czyści gwinty z brudu, piasku i starych smarów.',
    icon: 'sparkles',
    multiplierEffect: '+15 zł napiwku od każdego klienta',
    tier: 1
  },
  {
    id: 'tire_spreader_led',
    name: 'Pneumatyczny rozpychacz opon z oświetleniem LED',
    category: 'equipment',
    cost: 590,
    purchased: false,
    description: 'Umożliwia dokładną inspekcję wnętrza karkasu opony pod kątem pęknięć kordu.',
    icon: 'gauge',
    multiplierEffect: '+25% tempa inspekcji opon',
    tier: 2
  },
  {
    id: 'studding_gun',
    name: 'Pneumatyczna kolcownica do opon zimowych',
    category: 'equipment',
    cost: 1350,
    purchased: false,
    description: 'Montaż kolców rajdowych i skandynawskich do opon na lód.',
    icon: 'award',
    multiplierEffect: '+70 zł za specjalistyczne usługi',
    tier: 3
  },
  {
    id: 'pneumatic_wheel_lift',
    name: 'Winda pneumatyczna do unoszenia ciężkich kół',
    category: 'equipment',
    cost: 1150,
    purchased: false,
    description: 'Automatycznie unosi koła SUV i dostawcze na wał wyważarki bez wysiłku mechanika.',
    icon: 'shield',
    multiplierEffect: '+25% tempa Janusza i Mirka',
    tier: 3
  },
  {
    id: 'heavy_industrial_rotary_lift',
    name: 'Tytanowy podnośnik 5.5T dla busów i aut pancernych',
    category: 'equipment',
    cost: 3200,
    purchased: false,
    description: 'Pozwala na bezproblemową obsługę największych aut dostawczych i elektryków.',
    icon: 'shield',
    multiplierEffect: '+50 zł marży na autach dostawczych',
    tier: 5
  },

  // =========================================================================
  // 2. NARZĘDZIA & WYPOSAŻENIE WARSZTATOWE (TOOLS) - 20 ULEPSZEŃ
  // =========================================================================
  {
    id: 'titanium_wrenches',
    name: 'Zestaw kluczy udarowych 1/2" Titanium Pro',
    category: 'tools',
    cost: 320,
    purchased: false,
    description: 'Niezwykle lekkie kompozytowe klucze udarowe o momencie 1850 Nm.',
    icon: 'wrench',
    multiplierEffect: '+50% tempa odkręcania kół',
    tier: 1
  },
  {
    id: 'bubblegum_paste',
    name: 'Pasta montażowa Premium o zapachu gumy balonowej',
    category: 'tools',
    cost: 180,
    purchased: false,
    description: 'Wysoki poślizg ułatwia wciąganie opony, a zapach niweluje woń spalonej gumy.',
    icon: 'sparkles',
    multiplierEffect: '+20% tempa nakładania opon',
    tier: 1
  },
  {
    id: 'torque_sticks_set',
    name: 'Nasadki udarowe z ogranicznikiem momentu Torsion',
    category: 'tools',
    cost: 290,
    purchased: false,
    description: 'Zapobiega przeciągnięciu gwintów i urwaniu szpilek piasty.',
    icon: 'shield',
    multiplierEffect: 'Zero uszkodzeń śrub u klientów',
    tier: 1
  },
  {
    id: 'digital_torque_wrench',
    name: 'Cyfrowy klucz dynamometryczny z sygnałem dźwiękowym',
    category: 'tools',
    cost: 490,
    purchased: false,
    description: 'Precyzyjne dociągnięcie koła momentem zadanym przez producenta auta (110-180 Nm).',
    icon: 'award',
    multiplierEffect: '+20 zł napiwku za profesjonalizm',
    tier: 2
  },
  {
    id: 'rim_protector_sleeves',
    name: 'Teflonowe nakładki ochronne na nasadki i łyżki',
    category: 'tools',
    cost: 160,
    purchased: false,
    description: 'Gwarantują brak zarysowań na drogich felgach polerowanych i lakierowanych.',
    icon: 'shield',
    multiplierEffect: '+0.2 do reputacji za brak rys',
    tier: 1
  },
  {
    id: 'automatic_hose_reels',
    name: 'Pneumatyczne zwijadła bębnowe z wężem zbrojonym 15m',
    category: 'tools',
    cost: 340,
    purchased: false,
    description: 'Węże nie plączą się po podłodze hali, pracownicy poruszają się swobodnie.',
    icon: 'wind',
    multiplierEffect: '+15% prędkości chodu mechaników',
    tier: 1
  },
  {
    id: 'cordless_brushless_impact',
    name: 'Akumulatorowe klucze bezszczotkowe 18V Milwaukee',
    category: 'tools',
    cost: 720,
    purchased: false,
    description: 'Mobilność bez kabli i węży pozwala na błyskawiczne odkręcanie kół na parkingu.',
    icon: 'zap',
    multiplierEffect: '+30% tempa prac zewnętrznych',
    tier: 2
  },
  {
    id: 'valve_core_remover_speed',
    name: 'Szybkie wykrętaki zaworów z manometrem',
    category: 'tools',
    cost: 140,
    purchased: false,
    description: 'Błyskawiczne spuszczanie powietrza z koła w 2 sekundy.',
    icon: 'gauge',
    multiplierEffect: '+20% tempa przygotowania koła',
    tier: 1
  },
  {
    id: 'brass_wire_wheel_hub_cleaners',
    name: 'Szczotki czołowe z mosiądzu do czyszczenia piast',
    category: 'tools',
    cost: 220,
    purchased: false,
    description: 'Dokładne usuwanie rdzy z czoła piasty zapobiega wibracjom kierownicy.',
    icon: 'sparkles',
    multiplierEffect: '+15 zł za usługę czyszczenia piast',
    tier: 1
  },
  {
    id: 'heavy_duty_bead_roller',
    name: 'Radełka dociskowe łożyskowane do łatek radialnych',
    category: 'tools',
    cost: 190,
    purchased: false,
    description: 'Perfekcyjne usuwanie pęcherzyków powietrza spod wklejanej łatki wulkanizacyjnej.',
    icon: 'wrench',
    multiplierEffect: '+25% tempa napraw przebić',
    tier: 1
  },
  {
    id: 'pneumatic_tread_cutter',
    name: 'Nacinarka do pogłębiania bieżnika opon Regroover',
    category: 'tools',
    cost: 640,
    purchased: false,
    description: 'Precyzyjne odnawianie rowków odprowadzających wodę w oponach.',
    icon: 'flame',
    multiplierEffect: '+40 zł za nacinanie opon',
    tier: 2
  },
  {
    id: 'zinc_clip_weights_stock',
    name: 'Magazyn ciężarków cynkowych EcoZinc (5-60g)',
    category: 'tools',
    cost: 270,
    purchased: false,
    description: 'Ekologiczne ciężarki nabijane idealnie dopasowane do rantów felg stalowych.',
    icon: 'shield',
    multiplierEffect: 'Zawsze dostępne ciężarki 0-60g',
    tier: 1
  },
  {
    id: 'black_adhesive_weights',
    name: 'Ciężarki klejone czarne matowe Slim 5g',
    category: 'tools',
    cost: 310,
    purchased: false,
    description: 'Dyskretne ciężarki klejone niewidoczne za ramionami czarnych felg aluminiowych.',
    icon: 'sparkles',
    multiplierEffect: '+10 zł bonusu do felg alu',
    tier: 1
  },
  {
    id: 'tire_tread_depth_laser',
    name: 'Laserowy miernik głębokości bieżnika z wydrukiem',
    category: 'tools',
    cost: 430,
    purchased: false,
    description: 'Wykrywa nierównomierne zużycie opon i złą geometrię zawieszenia auta.',
    icon: 'gauge',
    multiplierEffect: '+20 zł za wydruk diagnostyki',
    tier: 2
  },
  {
    id: 'tubeless_repair_cord_kit',
    name: 'Wzmocnione kordy butylowe i sznury SealPro',
    category: 'tools',
    cost: 210,
    purchased: false,
    description: 'Naprawa przebicia gwoździem bez konieczności zdejmowania opony z felgi.',
    icon: 'shield',
    multiplierEffect: '+35% tempa łatania opon',
    tier: 1
  },
  {
    id: 'pneumatic_jack_airbag',
    name: 'Podnośnik pneumatyczny typu Bałwanek 3.5T',
    category: 'tools',
    cost: 510,
    purchased: false,
    description: 'Potrójna poduszka powietrzna do błyskawicznego podnoszenia aut przed warsztatem.',
    icon: 'wind',
    multiplierEffect: '+25% tempa pracy na zewnątrz',
    tier: 2
  },
  {
    id: 'bead_sealer_liquid_pro',
    name: 'Uszczelniacz rantu felgi Bead Sealer Black',
    category: 'tools',
    cost: 170,
    purchased: false,
    description: 'Likwiduje mikro-nieszczelności na starych, utlenionych felgach aluminiowych.',
    icon: 'shield',
    multiplierEffect: 'Eliminacja reklamacji na ubytki',
    tier: 1
  },
  {
    id: 'chrome_valve_stems_luxury',
    name: 'Zestaw chromowanych wentyli skręcanych z metalu',
    category: 'tools',
    cost: 260,
    purchased: false,
    description: 'Eleganckie wentyle skręcane dla aut sportowych i luksusowych.',
    icon: 'sparkles',
    multiplierEffect: '+25 zł marży na wentylach alu',
    tier: 1
  },
  {
    id: 'adhesive_weight_scraper_soft',
    name: 'Skrobaki kompozytowe do usuwania starych taśm klejących',
    category: 'tools',
    cost: 150,
    purchased: false,
    description: 'Błyskawiczne usuwanie pozostałości pianki klejącej bez rysowania lakieru felgi.',
    icon: 'wrench',
    multiplierEffect: '+20% tempa przygotowania felgi',
    tier: 1
  },
  {
    id: 'wheel_stud_thread_restorer',
    name: 'Zestaw narzynek do regeneracji uszkodzonych gwintów',
    category: 'tools',
    cost: 370,
    purchased: false,
    description: 'Naprawa przekręconych gwintów na miejscu, bez odsyłania klienta do tokarza.',
    icon: 'award',
    multiplierEffect: '+40 zł za naprawę gwintu',
    tier: 2
  },

  // =========================================================================
  // 3. POCZEKALNIA & KOMFORT KLIENTA (COMFORT) - 15 ULEPSZEŃ
  // =========================================================================
  {
    id: 'coffee_machine_deluxe',
    name: 'Ciśnieniowy ekspres do kawy ziarnistej DeLonghi',
    category: 'comfort',
    cost: 350,
    purchased: false,
    description: 'Pyszne espresso i cappuccino dla czekających kierowców.',
    icon: 'coffee',
    multiplierEffect: '+30% cierpliwości klientów',
    tier: 1
  },
  {
    id: 'air_conditioning',
    name: 'Klimatyzacja inwerterowa z nawiewem jonizującym',
    category: 'comfort',
    cost: 400,
    purchased: false,
    description: 'Idealna temperatura 21°C w upalne lato i ciepło w mroźne zimowe dni.',
    icon: 'wind',
    multiplierEffect: '-25% utraty cierpliwości',
    tier: 1
  },
  {
    id: 'vip_lounge_tv',
    name: 'Telewizor 65" 4K z kanałem Rajdy & Motorsport',
    category: 'comfort',
    cost: 480,
    purchased: false,
    description: 'Klienci oglądają zmagania WRC i Formuły 1, zapominając o upływającym czasie.',
    icon: 'tv',
    multiplierEffect: '+15 zł napiwku od każdego klienta',
    tier: 2
  },
  {
    id: 'vending_machine',
    name: 'Automat z zimnymi napojami i przekąskami',
    category: 'comfort',
    cost: 550,
    purchased: false,
    description: 'Pasywny zysk z zimnej coli, batoników i orzeszków.',
    icon: 'dollar-sign',
    multiplierEffect: '+20 zł pasywnego zysku z każdego auta',
    tier: 2
  },
  {
    id: 'leather_sofas_luxury',
    name: 'Skórzane kanapy klubowe Chesterfield',
    category: 'comfort',
    cost: 620,
    purchased: false,
    description: 'Wyjątkowo wygodne fotele sprawiają, że klienci czują się jak w salonie VIP.',
    icon: 'sparkles',
    multiplierEffect: '+0.3 do średniej oceny klientów',
    tier: 2
  },
  {
    id: 'wifi6_mesh_router',
    name: 'Superszybki światłowód i Wi-Fi 6 Mesh dla gości',
    category: 'comfort',
    cost: 280,
    purchased: false,
    description: 'Przedstawiciele handlowi mogą pracować na laptopie podczas wymiany kół.',
    icon: 'zap',
    multiplierEffect: '+15% cierpliwości klientów biznesowych',
    tier: 1
  },
  {
    id: 'massage_chair_vip',
    name: 'Fotel z masażem shiatsu i podgrzewaniem',
    category: 'comfort',
    cost: 890,
    purchased: false,
    description: 'Relaksujący masaż pleców zamienia oczekiwanie w czysty odpoczynek.',
    icon: 'sparkles',
    multiplierEffect: '+25 zł napiwku od zrelaksowanych kierowców',
    tier: 3
  },
  {
    id: 'water_dispenser_cold_hot',
    name: 'Dystrybutor wody źródlanej z gazowaniem',
    category: 'comfort',
    cost: 210,
    purchased: false,
    description: 'Darmowa orzeźwiająca woda z bąbelkami i plasterkiem cytryny.',
    icon: 'wind',
    multiplierEffect: '+10% cierpliwości klientów',
    tier: 1
  },
  {
    id: 'magazine_rack_auto_swiat',
    name: 'Stojak z najnowszą prasą motoryzacyjną',
    category: 'comfort',
    cost: 160,
    purchased: false,
    description: 'Świeże wydania Auto Świat, Motor i Classicauto na stoliku.',
    icon: 'award',
    multiplierEffect: '+10% cierpliwości starszych klientów',
    tier: 1
  },
  {
    id: 'kids_play_corner',
    name: 'Kącik zabaw dla dzieci z torem Matchbox',
    category: 'comfort',
    cost: 320,
    purchased: false,
    description: 'Dzieci zajęte zabawą klockami i autkami, rodzice czekają w pełnym spokoju.',
    icon: 'sparkles',
    multiplierEffect: '+20% cierpliwości klientów z dziećmi',
    tier: 1
  },
  {
    id: 'phone_charging_station',
    name: 'Stacja szybkiego ładowania telefonów z indukcją',
    category: 'comfort',
    cost: 240,
    purchased: false,
    description: 'Kable USB-C, Lightning i bezprzewodowe ładowarki na stolikach.',
    icon: 'zap',
    multiplierEffect: '+10 zł napiwku od młodzieży',
    tier: 1
  },
  {
    id: 'heated_floor_waiting_room',
    name: 'Ogrzewanie podłogowe w poczekalni i biurze',
    category: 'comfort',
    cost: 750,
    purchased: false,
    description: 'Ciepła podłoga podczas zimowych mrozów podnosi standard warsztatu.',
    icon: 'flame',
    multiplierEffect: '+0.25 do reputacji warsztatu',
    tier: 3
  },
  {
    id: 'retro_arcade_cabinet',
    name: 'Automat retro z grami wyścigowymi Sega Rally',
    category: 'comfort',
    cost: 1100,
    purchased: false,
    description: 'Klienci rywalizują o najlepszy czas okrążenia na kierownicy z force feedback!',
    icon: 'award',
    multiplierEffect: '+35 zł zysku z automatów',
    tier: 3
  },
  {
    id: 'air_purifier_hepa_carbon',
    name: 'Oczyszczacz powietrza z filtrem HEPA i węglem',
    category: 'comfort',
    cost: 390,
    purchased: false,
    description: 'Pochłania wszelkie zapachy gumy i spalin docierające z hali warsztatowej.',
    icon: 'shield',
    multiplierEffect: '+15% cierpliwości klientów',
    tier: 2
  },
  {
    id: 'branded_keychain_freebies',
    name: 'Pudełko z firmowymi zawieszkami i zapachami do aut',
    category: 'comfort',
    cost: 290,
    purchased: false,
    description: 'Upominek "Choinka zapachowa Wulkanizacja 24H" do każdego zlecenia.',
    icon: 'sparkles',
    multiplierEffect: '+0.2 do reputacji za każdy gratis',
    tier: 1
  },

  // =========================================================================
  // 4. POSKROMIENIE WŁADKA & BHP (WLADEK) - 15 ULEPSZEŃ
  // =========================================================================
  {
    id: 'tea_corner_wladek',
    name: 'Kącik relaksu z samowarem i herbatą dla Władka',
    category: 'wladek',
    cost: 300,
    purchased: false,
    description: 'Wygodny fotel i nielimitowana czarna herbata z cukrem odciągają Władka od maszyn.',
    icon: 'coffee',
    multiplierEffect: '-65% częstotliwości psot Władka',
    tier: 1
  },
  {
    id: 'magnetic_tool_racks',
    name: 'Mocne listwy magnetyczne na narzędzia',
    category: 'wladek',
    cost: 250,
    purchased: false,
    description: 'Klucze same wskakują na ścianę, Władkowi trudniej je podwędzić i ukryć.',
    icon: 'shield',
    multiplierEffect: 'Zabezpiecza narzędzia przed chowaniem',
    tier: 1
  },
  {
    id: 'fuse_stabilizer',
    name: 'Automatyczne bezpieczniki z autorestartem w biurze',
    category: 'wladek',
    cost: 320,
    purchased: false,
    description: 'Gdy Władek włączy czajnik i nagrzewnicę naraz, prąd wraca samoczynnie w sekundę.',
    icon: 'zap',
    multiplierEffect: 'Natychmiastowy reset korków',
    tier: 1
  },
  {
    id: 'locked_weight_dispenser',
    name: 'Kasetka na ciężarki wyważające z zamkiem szyfrowym',
    category: 'wladek',
    cost: 220,
    purchased: false,
    description: 'Koniec z rozsypanymi ołowianymi ciężarkami po całej posadzce warsztatu.',
    icon: 'shield',
    multiplierEffect: 'Odporność na rozsypywanie ciężarków',
    tier: 1
  },
  {
    id: 'compressor_lockout_cover',
    name: 'Plexi osłona na wyłącznik awaryjny kompresora',
    category: 'wladek',
    cost: 190,
    purchased: false,
    description: 'Żółta klapka zabezpieczająca chroni czerwony grzybek przed przypadkowym trąceniem biodrem.',
    icon: 'shield',
    multiplierEffect: '-80% wyłączeń kompresora',
    tier: 1
  },
  {
    id: 'bluetooth_tool_trackers',
    name: 'Lokalizatory Bluetooth z piszczykiem na klucze',
    category: 'wladek',
    cost: 380,
    purchased: false,
    description: 'Gdy klucz zniknie, wciskasz przycisk i zgubiona nasadka głośno piszczy pod szafką!',
    icon: 'award',
    multiplierEffect: 'Natychmiastowe odnajdywanie kluczy',
    tier: 2
  },
  {
    id: 'sunflower_seeds_station',
    name: 'Wielki zapas prażonych pestek słonecznika z solą',
    category: 'wladek',
    cost: 150,
    purchased: false,
    description: 'Władek siada na oponie i łuska słonecznik przez 2 godziny, nie wchodząc pod koła.',
    icon: 'coffee',
    multiplierEffect: '-40% wałęsania się Władka',
    tier: 1
  },
  {
    id: 'ukrainian_disco_radio',
    name: 'Radioodbiornik budowlany z muzyką dla Władka',
    category: 'wladek',
    cost: 270,
    purchased: false,
    description: 'Władek tańczy w kąciku zamiast zagadywać mechaników podczas wyważania koła.',
    icon: 'tv',
    multiplierEffect: '-50% zagadywania mechaników',
    tier: 1
  },
  {
    id: 'anti_trip_floor_marking',
    name: 'Żółto-czarne pasy ostrzegawcze i strefy bezpieczeństwa',
    category: 'wladek',
    cost: 240,
    purchased: false,
    description: 'Władek instynktownie omija strefy wokół podnośników hydraulicznych.',
    icon: 'shield',
    multiplierEffect: 'Zmniejsza blokowanie przejść',
    tier: 1
  },
  {
    id: 'crossword_puzzle_stash',
    name: 'Roczna prenumerata krzyżówek panoramicznych "100 Panoramicznych"',
    category: 'wladek',
    cost: 160,
    purchased: false,
    description: 'Władek z długopisem w ręku główkuje nad hasłami na 6 liter.',
    icon: 'award',
    multiplierEffect: '-30% incydentów w biurze',
    tier: 1
  },
  {
    id: 'heavy_ear_protection_3m',
    name: 'Nauszniki przeciwhałasowe 3M Peltor dla ekipy',
    category: 'wladek',
    cost: 310,
    purchased: false,
    description: 'Mechanicy nie słyszą zagadywania Władka i pracują w idealnym skupieniu.',
    icon: 'shield',
    multiplierEffect: '+15% odporności na rozproszenie',
    tier: 2
  },
  {
    id: 'anti_static_wristbands',
    name: 'Antystatyczne opaski uziemiające dla Władka',
    category: 'wladek',
    cost: 180,
    purchased: false,
    description: 'Władek przestaje "kopać prądem" i resetować elektronikę w wyważarce.',
    icon: 'zap',
    multiplierEffect: '-90% awarii płyty wyważarki',
    tier: 1
  },
  {
    id: 'industrial_sweeper_manual',
    name: 'Mechaniczna zamiatarka do posadzki dla Władka',
    category: 'wladek',
    cost: 490,
    purchased: false,
    description: 'Dajesz Władkowi pożyteczne zajęcie – czyści warsztat i czuje się dumny!',
    icon: 'sparkles',
    multiplierEffect: '+0.15 reputacji za czystość hali',
    tier: 2
  },
  {
    id: 'reinforced_tire_rack_anchors',
    name: 'Stalowe kotwy podłogowe do regałów z oponami',
    category: 'wladek',
    cost: 360,
    purchased: false,
    description: 'Regały magazynowe nie zachwieją się, nawet gdy Władek oprze się o nie całą masą.',
    icon: 'shield',
    multiplierEffect: 'Zero ryzyka przewrócenia regału',
    tier: 2
  },
  {
    id: 'diploma_honorary_assistant',
    name: 'Złoty Dyplom "Honorowy Asystent Głównego Majstra"',
    category: 'wladek',
    cost: 420,
    purchased: false,
    description: 'Władek wisi z dyplomem na ścianie biura – czuje się doceniony i mniej broi.',
    icon: 'award',
    multiplierEffect: '-50% wszystkich incydentów Władka',
    tier: 2
  },

  // =========================================================================
  // 5. SZKOLENIA & KWALIFIKACJE MECHANIKÓW (TRAINING) - 15 ULEPSZEŃ
  // =========================================================================
  {
    id: 'worker_training',
    name: 'Certyfikowane szkolenie wulkanizacyjne Masterclass',
    category: 'training',
    cost: 500,
    purchased: false,
    description: 'Podstawowe szkolenie z optymalizacji procesów warsztatowych dla całej ekipy.',
    icon: 'award',
    multiplierEffect: '+25% tempa wszystkich mechaników',
    tier: 1
  },
  {
    id: 'runflat_certified_course',
    name: 'Kurs obsługi opon niskoprofilowych i Run-Flat',
    category: 'training',
    cost: 680,
    purchased: false,
    description: 'Darek i Seba montują najtwardsze opony 20-calowe bez kropli potu.',
    icon: 'award',
    multiplierEffect: '+35% tempa wymiany opon sportowych',
    tier: 2
  },
  {
    id: 'f1_pitstop_drills',
    name: 'Trening zespołowy Pit-Stop Formuły 1',
    category: 'training',
    cost: 920,
    purchased: false,
    description: 'Perfekcyjna koordynacja ruchów w parach na Stanowisku 1 i 2.',
    icon: 'zap',
    multiplierEffect: '+30% prędkości przy 2 autach na raz',
    tier: 3
  },
  {
    id: 'dynamic_balancing_course',
    name: 'Szkolenie z wyważania dynamicznego i optymalizacji felg',
    category: 'training',
    cost: 580,
    purchased: false,
    description: 'Janusz uczy się obracać oponę względem felgi tak, by zużyć minimum ciężarków.',
    icon: 'gauge',
    multiplierEffect: '+40% tempa wyważania Janusza',
    tier: 2
  },
  {
    id: 'mechanic_ergonomics_seminar',
    name: 'Seminarium ergonomii pracy i zdrowego kręgosłupa',
    category: 'training',
    cost: 390,
    purchased: false,
    description: 'Mirek przestaje narzekać na krzyż i pracuje ze stałą, wysoką werwą.',
    icon: 'shield',
    multiplierEffect: '+20% tempa pracy Majstra Mirka',
    tier: 1
  },
  {
    id: 'ev_tire_safety_course',
    name: 'Certyfikat obsługi kół samochodów elektrycznych (EV)',
    category: 'training',
    cost: 840,
    purchased: false,
    description: 'Specjalistyczna wiedza o oponach z pianką wygłuszającą i wysokim indeksem nośności.',
    icon: 'zap',
    multiplierEffect: '+35 zł za obsługę aut elektrycznych',
    tier: 3
  },
  {
    id: 'hot_vulcanization_specialist',
    name: 'Specjalizacja naprawy opon rolniczych i ciężarowych',
    category: 'training',
    cost: 760,
    purchased: false,
    description: 'Darek staje się lokalnym ekspertem od wklejania wkładów radialnych wielowarstwowych.',
    icon: 'wrench',
    multiplierEffect: '+45 zł marży na naprawach karkasów',
    tier: 2
  },
  {
    id: 'customer_service_mastery',
    name: 'Warsztaty kulturalnej i bezstresowej obsługi klienta',
    category: 'training',
    cost: 440,
    purchased: false,
    description: 'Mechanicy z uśmiechem tłumaczą klientom zawiłości techniczne bez zniecierpliwienia.',
    icon: 'sparkles',
    multiplierEffect: '+0.3 do reputacji warsztatu',
    tier: 2
  },
  {
    id: 'pneumatic_system_tuning',
    name: 'Kurs kalibracji i konserwacji układów pneumatycznych',
    category: 'training',
    cost: 490,
    purchased: false,
    description: 'Mirek sam czyści odwadniacze i naolejacze, zapobiegając awariom.',
    icon: 'wind',
    multiplierEffect: 'Zmniejsza ryzyko awarii o 50%',
    tier: 2
  },
  {
    id: 'racing_setup_certification',
    name: 'Kurs geometrii i ustawiania kół do motorsportu',
    category: 'training',
    cost: 1100,
    purchased: false,
    description: 'Kąty pochylenia i zbieżność pod rajdy i zawody driftowe przyciągają sportowców.',
    icon: 'award',
    multiplierEffect: '+80 zł za ustawienia sportowe',
    tier: 3
  },
  {
    id: 'tpms_sensor_cloning_training',
    name: 'Szkolenie z programowania czujników TPMS bezprzewodowo',
    category: 'training',
    cost: 610,
    purchased: false,
    description: 'Seba programuje uniwersalne sensory Autel w mniej niż 60 sekund.',
    icon: 'zap',
    multiplierEffect: '+30% tempa kodowania TPMS',
    tier: 2
  },
  {
    id: 'aluminum_welding_course',
    name: 'Kurs spawania metodą TIG pękniętych felg aluminiowych',
    category: 'training',
    cost: 1250,
    purchased: false,
    description: 'Profesjonalne uzupełnianie ubytków materiału na rantach felg ze stopów lekkich.',
    icon: 'flame',
    multiplierEffect: '+90 zł za regenerację felgi',
    tier: 4
  },
  {
    id: 'tire_wear_forensics_course',
    name: 'Zaawansowana diagnostyka ścierania bieżnika',
    category: 'training',
    cost: 530,
    purchased: false,
    description: 'Błyskawiczne wykrywanie luzów w zawieszeniu na podstawie śladów na gumie.',
    icon: 'gauge',
    multiplierEffect: '+20 zł za płatną ekspertyzę',
    tier: 2
  },
  {
    id: 'speed_demounting_tricks',
    name: 'Sekretne techniki szybkiego zbijania opon bez łyżki',
    category: 'training',
    cost: 670,
    purchased: false,
    description: 'Darek demonstruje triki przyspieszające pracę na montażownicy o jedną trzecią.',
    icon: 'wrench',
    multiplierEffect: '+25% tempa montażu u Darka',
    tier: 2
  },
  {
    id: 'chief_master_degree',
    name: 'Tytuł Mistrza Rzemiosła Wulkanizacyjnego dla Mirka',
    category: 'training',
    cost: 1600,
    purchased: false,
    description: 'Oficjalny dyplom Izby Rzemieślniczej wisi w złotej ramie nad kasą fiskalną.',
    icon: 'award',
    multiplierEffect: '+0.5 do reputacji i +15% cen usług',
    tier: 4
  },

  // =========================================================================
  // 6. WARSZTAT & MARKETING I ROZWÓJ BIZNESU (MARKETING) - 15 ULEPSZEŃ
  // =========================================================================
  {
    id: 'neon_sign_24h',
    name: 'Wielki neon LED "WULKANIZACJA 24H"',
    category: 'marketing',
    cost: 550,
    purchased: false,
    description: 'Świecący w nocy neon widoczny z drogi krajowej z odległości 2 kilometrów.',
    icon: 'sparkles',
    multiplierEffect: '+30% częstszy napływ klientów',
    tier: 1
  },
  {
    id: 'epoxy_industrial_floor',
    name: 'Lustrzana posadzka żywiczna odporna na oleje i chemikalia',
    category: 'marketing',
    cost: 850,
    purchased: false,
    description: 'Antypoślizgowa posadzka w szarym połysku – warsztat wygląda jak fabryka Porsche.',
    icon: 'sparkles',
    multiplierEffect: '+15% szybkości poruszania się',
    tier: 2
  },
  {
    id: 'local_radio_campaign',
    name: 'Chwytliwy dżingiel w lokalnym Radiu Eska i Złote Przeboje',
    category: 'marketing',
    cost: 720,
    purchased: false,
    description: '"Przebita opona? Wpadaj do Mirka!" – każdy kierowca w powiecie zna ten numer.',
    icon: 'tv',
    multiplierEffect: '+40% więcej oczekujących aut',
    tier: 2
  },
  {
    id: 'taxi_fleet_contract',
    name: 'Stały kontrakt z korporacją Taxi "Super Taxi"',
    category: 'marketing',
    cost: 1200,
    purchased: false,
    description: 'Gwarantowany stały strumień taksówek na sezonową zmianę opon i wyważanie.',
    icon: 'award',
    multiplierEffect: 'Gwarantowany napływ klientów',
    tier: 3
  },
  {
    id: 'google_maps_top_ranking',
    name: 'Profil Google Maps z 500 opiniami 5.0 gwiazdek',
    category: 'marketing',
    cost: 640,
    purchased: false,
    description: 'Pierwsze miejsce w wynikach wyszukiwania "wulkanizacja blisko mnie".',
    icon: 'award',
    multiplierEffect: '+0.4 do reputacji warsztatu',
    tier: 2
  },
  {
    id: 'online_booking_app',
    name: 'System rezerwacji online i powiadomień SMS o gotowości auta',
    category: 'marketing',
    cost: 590,
    purchased: false,
    description: 'Kierowcy otrzymują SMS: "Twoje auto jest gotowe do odbioru". Zero nerwów.',
    icon: 'zap',
    multiplierEffect: '+25% cierpliwości wszystkich kierowców',
    tier: 2
  },
  {
    id: 'branded_overalls_crew',
    name: 'Firmowe kombinezony robocze z haftowanym logo i imieniem',
    category: 'marketing',
    cost: 380,
    purchased: false,
    description: 'Profesjonalny wygląd ekipy budzi natychmiastowe zaufanie właścicieli drogich aut.',
    icon: 'shield',
    multiplierEffect: '+15 zł napiwku z każdego auta',
    tier: 1
  },
  {
    id: 'solar_panels_roof',
    name: 'Fotowoltaika dachowa 10 kWp z magazynem energii',
    category: 'marketing',
    cost: 1800,
    purchased: false,
    description: 'Darmowy prąd do zasilania kompresora i podnośników obniża koszty stałe.',
    icon: 'zap',
    multiplierEffect: '+20 zł czystego zysku z każdego auta',
    tier: 4
  },
  {
    id: 'tire_hotel_storage_hall',
    name: 'Rozbudowa hali: Sezonowa Przechowalnia Opon (Hotel dla Kół)',
    category: 'marketing',
    cost: 2400,
    purchased: false,
    description: 'Przechowywanie 800 kompletów kół klientów w stałej temperaturze i wilgotności.',
    icon: 'dollar-sign',
    multiplierEffect: '+50 zł stałego przychodu z każdego auta',
    tier: 4
  },
  {
    id: 'roadside_assistance_van',
    name: 'Mobilny bus serwisowy Wulkanizacja Mobilna 24h',
    category: 'marketing',
    cost: 3500,
    purchased: false,
    description: 'Pomoc drogowa dla aut unieruchomionych na autostradzie z przebitym kołem.',
    icon: 'zap',
    multiplierEffect: '+100 zł zysku z zleceń specjalnych',
    tier: 5
  },
  {
    id: 'courier_fleet_contract',
    name: 'Umowa na obsługę floty 40 busów kurierskich DPD i InPost',
    category: 'marketing',
    cost: 1950,
    purchased: false,
    description: 'Cykliczna wymiana opon w autach dostawczych z gwarancją terminu.',
    icon: 'award',
    multiplierEffect: '+30% stałych zleceń na busy',
    tier: 4
  },
  {
    id: 'illuminated_parking_lot',
    name: 'Asfaltowy parking z oświetleniem LED i numerowanymi miejscami',
    category: 'marketing',
    cost: 950,
    purchased: false,
    description: 'Bezpieczny, przestronny parking eliminujący ryzyko stłuczki przed warsztatem.',
    icon: 'shield',
    multiplierEffect: '+2 miejsca w kolejce oczekujących',
    tier: 3
  },
  {
    id: 'loyalty_stamp_card',
    name: 'Program lojalnościowy "5. wymiana gratis lub darmowe wyważenie"',
    category: 'marketing',
    cost: 310,
    purchased: false,
    description: 'Klienci wracają co sezon z pieczątkami w portfelu.',
    icon: 'award',
    multiplierEffect: '+15% szansy na wysoki napiwek',
    tier: 1
  },
  {
    id: 'influencer_sponsorship',
    name: 'Współpraca z kanałem motoryzacyjnym "Młody Mechanik"',
    category: 'marketing',
    cost: 1400,
    purchased: false,
    description: 'Odcinek nagrany w naszym warsztacie zdobył 1.5 miliona wyświetleń na YouTube!',
    icon: 'tv',
    multiplierEffect: '+0.5 do reputacji i tłumy fanów',
    tier: 3
  },
  {
    id: 'franchise_golden_wulkan',
    name: 'Złota Statuetka i Tytuł "Wulkanizacja Roku w Polsce"',
    category: 'marketing',
    cost: 5000,
    purchased: false,
    description: 'Najwyższe wyróżnienie w branży oponiarskiej. Kolejki chętnych ustawiają się o świcie!',
    icon: 'award',
    multiplierEffect: '+50% zysku ze wszystkich usług',
    tier: 5
  }
];

export function getUpgradesByCategory(category?: string): Upgrade[] {
  if (!category || category === 'all') return WORKSHOP_100_UPGRADES;
  return WORKSHOP_100_UPGRADES.filter(u => u.category === category);
}
