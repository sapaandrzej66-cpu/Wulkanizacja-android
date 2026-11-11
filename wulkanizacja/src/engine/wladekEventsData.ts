/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WladekMiniEvent, Point } from '../types/game';

export interface WladekEventDefinition {
  type: string;
  title: string;
  description: string;
  pos: Point;
  stationId?: 'station1' | 'station2';
  penaltyText: string;
  resolvedMessage: string;
  wladekSpeech: string;
  impactEffect: 'compressor' | 'montazownica' | 'wywazarka' | 'office' | 'patience' | 'weights' | 'generic';
}

export const WLADEK_50_EVENTS: WladekEventDefinition[] = [
  // --- KOMPRESOR & PNEUMATYKA (1-7) ---
  {
    type: 'compressor_off',
    title: 'Władek wyłączył główny kompresor!',
    description: 'Władek oparł się o czerwony grzyb wyłącznika awaryjnego. Klucze pneumatyczne straciły ciśnienie!',
    pos: { x: 16, y: 8 },
    penaltyText: 'Klucze pneumatyczne nie mają powietrza!',
    resolvedMessage: 'Kompresor nabija ciśnienie 12 bar! Klucze znów działają.',
    wladekSpeech: 'Oj, ja tolko palcem dotknął! Czemu on taki czerwony i duży?!',
    impactEffect: 'compressor'
  },
  {
    type: 'compressor_drain_valve',
    title: 'Władek odkręcił zawór odwadniacza!',
    description: 'Władek chciał "spuścić trochę pary" i odkręcił kurek na dole zbiornika kompresora. Powietrze ucieka z sykiem!',
    pos: { x: 16, y: 8 },
    penaltyText: 'Ciśnienie w układzie spada do zera!',
    resolvedMessage: 'Zawór odwadniacza dokręcony! Ciśnienie ustabilizowane.',
    wladekSpeech: 'Szefie, tam woda leciała, ja myślał że to kran do herbaty!',
    impactEffect: 'compressor'
  },
  {
    type: 'hose_disconnect',
    title: 'Władek rozpiął szybkozłączkę pneumatyczną!',
    description: 'Władek potknął się o wąż i wyrwał szybkozłączkę ze ściany na Stanowisku 1.',
    pos: { x: 15, y: 3 },
    stationId: 'station1',
    penaltyText: 'Brak zasilania powietrzem na Stanowisku 1!',
    resolvedMessage: 'Wąż wpięty z powrotem w gniazdo szybkozłączki!',
    wladekSpeech: 'Sam wystrzelił! Przysięgam, jak z armaty huknęło!',
    impactEffect: 'compressor'
  },
  {
    type: 'hose_disconnect_s2',
    title: 'Władek zawiązał węzeł na przewodzie powietrznym!',
    description: 'Władek chciał zabezpieczyć wąż na Stanowisku 2 i związał go na supeł żeglarski.',
    pos: { x: 15, y: 14 },
    stationId: 'station2',
    penaltyText: 'Zaciśnięty wąż blokuje klucz na Stanowisku 2!',
    resolvedMessage: 'Węzeł rozplątany, powietrze płynie swobodnie.',
    wladekSpeech: 'Mój dziadek na kutrze takie węzły wiązał, to na sztorm dobre!',
    impactEffect: 'compressor'
  },
  {
    type: 'pressure_regulator_tampered',
    title: 'Władek przestawił reduktor ciśnienia na 1.5 bara!',
    description: 'Władek pokręcił gałką manometru na Stanowisku 1. Klucz udarowy zaledwie tyka.',
    pos: { x: 16, y: 8 },
    penaltyText: 'Zbyt małe ciśnienie robocze na poduszkach i kluczach!',
    resolvedMessage: 'Reduktor ustawiony ponownie na optymalne 8.5 bara!',
    wladekSpeech: 'Ja myślał że to radio! Kręciłem, ale żadnej stacji nie znalazłem.',
    impactEffect: 'compressor'
  },
  {
    type: 'chewing_gum_in_quickcoupler',
    title: 'Guma do żucia w gnieździe szybkozłączki!',
    description: 'Władek odłożył gumę "na chwilę" do końcówki pneumatycznej przy Stanowisku 1.',
    pos: { x: 15, y: 3 },
    stationId: 'station1',
    penaltyText: 'Zatkany przepływ powietrza na Stanowisku 1!',
    resolvedMessage: 'Guma usunięta, szybkozłączka przedmuchana!',
    wladekSpeech: 'To była guma Turbo z obrazkiem Mercedesa! Jeszcze miała smak!',
    impactEffect: 'compressor'
  },
  {
    type: 'safety_valve_pull',
    title: 'Władek pociągnął kółko zaworu bezpieczeństwa!',
    description: 'Przenikliwy gwizd zaworu 16 bar ogłuszył całą ekipę.',
    pos: { x: 16, y: 8 },
    penaltyText: 'Awaryjny zrzut powietrza z butli!',
    resolvedMessage: 'Zawór zamknięty, kompresor dobija powietrze.',
    wladekSpeech: 'Myślałem że to dzwonek na przerwę śniadaniową!',
    impactEffect: 'compressor'
  },

  // --- MONTAŻOWNICA & STOPKI (8-15) ---
  {
    type: 'montazownica_jam',
    title: 'Władek zablokował montażownicę na Stanowisku 1!',
    description: 'Władek wcisnął łyżkę montażową między szczęki zaciskowe stołu obrotowego.',
    pos: { x: 9, y: 2 },
    stationId: 'station1',
    penaltyText: 'Montażownica 1 zablokowana!',
    resolvedMessage: 'Łyżka wyjęta, stół obrotowy znów kręci bez oporów.',
    wladekSpeech: 'Ona sama tam wpadła! Stół się zakręcił jak karuzela!',
    impactEffect: 'montazownica'
  },
  {
    type: 'montazownica_jam_s2',
    title: 'Władek zaciął ramię pomocnicze na Stanowisku 2!',
    description: 'Władek zablokował ramię Run-Flat w skrajnym dolnym położeniu.',
    pos: { x: 9, y: 15 },
    stationId: 'station2',
    penaltyText: 'Montażownica 2 unieruchomiona!',
    resolvedMessage: 'Ramię pomocnicze odblokowane pneumatycznie.',
    wladekSpeech: 'Chciałem sprawdzić czy to ramię podniesie Darka!',
    impactEffect: 'montazownica'
  },
  {
    type: 'soap_paste_swap',
    title: 'Władek zamienił pastę montażową na pastę BHP do rąk!',
    description: 'Władek postawił wiadro z pastą piaskową obok montażownicy na Stanowisku 1.',
    pos: { x: 9, y: 2 },
    stationId: 'station1',
    penaltyText: 'Opona nie chce wejść na felgę przez brak poślizgu!',
    resolvedMessage: 'Prawdziwa pasta wulkanizacyjna wróciła na swoje miejsce.',
    wladekSpeech: 'Obie pachną mydłem, kto by to odróżnił?!',
    impactEffect: 'montazownica'
  },
  {
    type: 'bead_breaker_pedal_stuck',
    title: 'Władek zablokował pedał zbijaka opon!',
    description: 'Pod pedał montażownicy na Stanowisku 2 wpadła drewniana klocko-podkładka Władka.',
    pos: { x: 9, y: 15 },
    stationId: 'station2',
    penaltyText: 'Zbijak stopki nie reaguje na nacisk!',
    resolvedMessage: 'Klocek usunięty spod pedału roboczego.',
    wladekSpeech: 'To był mój podnóżek! Ja na nim siedziałem i patrzyłem!',
    impactEffect: 'montazownica'
  },
  {
    type: 'montazownica_jaw_reversed',
    title: 'Władek przestawił szczęki zaciskowe na felgi 24 cale!',
    description: 'Władek rozkręcił zakres stołu montażownicy na Stanowisku 1.',
    pos: { x: 9, y: 2 },
    stationId: 'station1',
    penaltyText: 'Szczęki nie łapią standardowych felg 15-17 cali!',
    resolvedMessage: 'Szczęki ustawione na standardowy zakres osobowy.',
    wladekSpeech: 'Myślałem że od razu będziemy koła od traktora robić!',
    impactEffect: 'montazownica'
  },
  {
    type: 'paste_bucket_spill',
    title: 'Władek wylał pędzle z pastą montażową na posadzkę!',
    description: 'Śliska plama przy montażownicy na Stanowisku 1 grozi poślizgiem mechaników.',
    pos: { x: 9, y: 2 },
    stationId: 'station1',
    penaltyText: 'Śliska strefa wokół montażownicy 1!',
    resolvedMessage: 'Posadzka posypana sorbentem i wytarta do sucha.',
    wladekSpeech: 'Ten pędzel sam mi z rąk wyleciał! Bardzo śliska ta maź!',
    impactEffect: 'montazownica'
  },
  {
    type: 'air_inflator_pedal_lock',
    title: 'Władek zablokował pistolet do pompowania!',
    description: 'Wąż pistoletu inflatora zaplątał się o kolumnę montażownicy na Stanowisku 2.',
    pos: { x: 9, y: 15 },
    stationId: 'station2',
    penaltyText: 'Brak możliwości napompowania koła na Stanowisku 2!',
    resolvedMessage: 'Wąż odplątany, manometr sprawny.',
    wladekSpeech: 'Wąż się owinął jak pyton na filmie przyrodniczym!',
    impactEffect: 'montazownica'
  },
  {
    type: 'duckhead_loosened',
    title: 'Władek poluzował śrubę głowicy montażowej!',
    description: 'Głowica "kaczy dziób" na Stanowisku 1 rusza się na boki i może porysować felgę.',
    pos: { x: 9, y: 2 },
    stationId: 'station1',
    penaltyText: 'Głowica montażowa rozregulowana!',
    resolvedMessage: 'Kaczy dziób dokręcony i wyjustowany.',
    wladekSpeech: 'Ja tylko sprawdzałem czy ten dziób dziobie!',
    impactEffect: 'montazownica'
  },

  // --- WYWAŻARKA & CIĘŻARKI (16-23) ---
  {
    type: 'weights_spilled',
    title: 'Władek rozsypał ciężarki wyważające!',
    description: 'Władek zawadził łokciem o organizer ciężarków klejonych i cynkowych przy wyważarce.',
    pos: { x: 13, y: 2 },
    stationId: 'station1',
    penaltyText: 'Ciężarki rozsypane po całej posadzce!',
    resolvedMessage: 'Ciężarki pozbierane i posegregowane wg gramatury.',
    wladekSpeech: 'Ojojoj! Kto to tak blisko krawędzi postawił?! Same spadły!',
    impactEffect: 'weights'
  },
  {
    type: 'wywazarka_tamper',
    title: 'Władek rozkalibrował wyważarkę na Stanowisku 1!',
    description: 'Władek poprzestawiał jednostki pomiarowe z gramów na uncje i zmienił kalibrację.',
    pos: { x: 13, y: 2 },
    stationId: 'station1',
    penaltyText: 'Wyważarka 1 pokazuje bzdurne wartości!',
    resolvedMessage: 'Wyważarka przekalibrowana kołem wzorcowym na gramy!',
    wladekSpeech: 'Guziki tak ładnie pikały! Ja myślał że to gra w tetrisa!',
    impactEffect: 'wywazarka'
  },
  {
    type: 'wywazarka_tamper_s2',
    title: 'Władek wrzucił monetę do bębna wyważarki 2!',
    description: 'Moneta 5 zł hałasuje w osłonie koła i zakłóca odczyt wyważarki na Stanowisku 2.',
    pos: { x: 13, y: 15 },
    stationId: 'station2',
    penaltyText: 'Wyważarka 2 wykrywa fikcyjne bicie koła!',
    resolvedMessage: 'Moneta wyjęta (trafiła do skarbonki warsztatowej)!',
    wladekSpeech: 'Na szczęście wrzuciłem! Żeby dobrze wyważało!',
    impactEffect: 'wywazarka'
  },
  {
    type: 'quick_nut_hidden',
    title: 'Władek schował nakrętkę szybkomocującą wyważarki!',
    description: 'Władek wziął nakrętkę szybkomocującą z wyważarki 1 i położył na oknie.',
    pos: { x: 13, y: 2 },
    stationId: 'station1',
    penaltyText: 'Brak nakrętki mocującej koło na wyważarce 1!',
    resolvedMessage: 'Nakrętka odnaleziona i założona na wał.',
    wladekSpeech: 'Taki ładny czarny krążek ze skrzydełkami, jak bączek do kręcenia!',
    impactEffect: 'wywazarka'
  },
  {
    type: 'balancer_hood_switch',
    title: 'Władek wygiął mikrostyk osłony wyważarki!',
    description: 'Wyważarka na Stanowisku 2 myśli, że pokrywa ochronna jest stale otwarta.',
    pos: { x: 13, y: 15 },
    stationId: 'station2',
    penaltyText: 'Wyważarka 2 nie chce wystartować silnika obrotowego!',
    resolvedMessage: 'Czujnik pokrywy wyprostowany i przetestowany.',
    wladekSpeech: 'Ja tylko klapą machałem, bo gorąco było i wiatrak robiłem!',
    impactEffect: 'wywazarka'
  },
  {
    type: 'cone_adapter_jumble',
    title: 'Władek pomieszał stożki centrujące do felg!',
    description: 'Stożki do piast BMW, Audi i busów leżą w jednym bezładnym stosie.',
    pos: { x: 13, y: 2 },
    stationId: 'station1',
    penaltyText: 'Janusz traci czas na szukanie odpowiedniego stożka!',
    resolvedMessage: 'Stożki ułożone na wieszaku według średnic.',
    wladekSpeech: 'Wieżę z nich budowałem, jak piramidy w Egipcie!',
    impactEffect: 'wywazarka'
  },
  {
    type: 'weights_spilled_s2',
    title: 'Władek rozsypał ciężarki klejone na Stanowisku 2!',
    description: 'Paski ciężarków 5g przykleiły się do podeszwy buta Władka.',
    pos: { x: 13, y: 15 },
    stationId: 'station2',
    penaltyText: 'Ciężarki klejone porozrzucane po Stanowisku 2!',
    resolvedMessage: 'Ciężarki odklejone od buta Władka i odłożone do kasetki.',
    wladekSpeech: 'Same się do buta przykleiły! Ja mam magnes w stopie chyba!',
    impactEffect: 'weights'
  },
  {
    type: 'sonar_sensor_dirty',
    title: 'Władek zakleił taśmą laser wyważarki 3D!',
    description: 'Władek nakleił naklejkę z gumy do żucia na oczko sonaru pomiarowego.',
    pos: { x: 13, y: 2 },
    stationId: 'station1',
    penaltyText: 'Laser nie widzi szerokości felgi!',
    resolvedMessage: 'Soczewka lasera wyczyszczona alkoholem izopropylowym.',
    wladekSpeech: 'Świeciło mi po oczach na czerwono, to zakleiłem!',
    impactEffect: 'wywazarka'
  },

  // --- NARZĘDZIA & WÓZKI (24-30) ---
  {
    type: 'stolen_wrench_17',
    title: 'Władek schował nasadkę 17mm do czajnika!',
    description: 'Najbardziej potrzebna nasadka do śrub kół zniknęła z wózka narzędziowego.',
    pos: { x: 15, y: 3 },
    stationId: 'station1',
    penaltyText: 'Brak klucza 17mm na Stanowisku 1!',
    resolvedMessage: 'Nasadka wyłowiona z czajnika i wytarta.',
    wladekSpeech: 'Gotowałem wodę, patrzę – leży żelastwo na stole, to wrzuciłem!',
    impactEffect: 'generic'
  },
  {
    type: 'stolen_wrench_19',
    title: 'Władek zabrał nasadkę 19mm i poszedł na parking!',
    description: 'Władek badał średnicę rury wydechowej Passata kluczem nasadowym 19mm.',
    pos: { x: 3, y: 7 },
    penaltyText: 'Brak klucza 19mm na wózku narzędziowym!',
    resolvedMessage: 'Klucz 19mm odebrany Władkowi i odłożony na magnes.',
    wladekSpeech: 'Mierzyłem tłumik! Idealnie 19 milimetrów kaliber!',
    impactEffect: 'generic'
  },
  {
    type: 'torque_wrench_maxed',
    title: 'Władek przestawił klucz dynamometryczny na 350 Nm!',
    description: 'Władek dokręcił regulację klucza dyno na opór. Śruby kół mogłyby pęknąć!',
    pos: { x: 15, y: 14 },
    stationId: 'station2',
    penaltyText: 'Klucz dynamometryczny rozkalibrowany!',
    resolvedMessage: 'Klucz ustawiony z powrotem na fabryczne 120 Nm.',
    wladekSpeech: 'Im mocniej dokręcone, tym bezpieczniej! Koło nie odpadnie!',
    impactEffect: 'generic'
  },
  {
    type: 'tool_cart_rolled_away',
    title: 'Władek przepchnął wózek narzędziowy pod bramę!',
    description: 'Wózek z narzędziami zjechał ze stanowiska i stoi przy wjeździe.',
    pos: { x: 7, y: 7 },
    penaltyText: 'Mechanicy muszą biegać po narzędzia przez pół hali!',
    resolvedMessage: 'Wózek odprowadzony na Stanowisko 2 i zablokowany hamulec.',
    wladekSpeech: 'On tak lekko na kółkach jechał! Hulajnoga normalnie!',
    impactEffect: 'generic'
  },
  {
    type: 'greased_ratchet_handle',
    title: 'Władek wysmarował rączkę grzechotki smarem miedziowym!',
    description: 'Władek "konserwował" narzędzia i pokrył grzechotkę grubą warstwą miedzi.',
    pos: { x: 15, y: 3 },
    stationId: 'station1',
    penaltyText: 'Klucz ślizga się w dłoniach Majstra Mirka!',
    resolvedMessage: 'Narzędzia odtłuszczone zmywaczem do hamulców.',
    wladekSpeech: 'Miedź to zdrowie! Żeby nie rdzewiało od potu rąk!',
    impactEffect: 'generic'
  },
  {
    type: 'missing_valve_tool',
    title: 'Władek zgubił wkrętak do zaworków!',
    description: 'Kluczyk do zaworów leży w korytku odpływowym posadzki.',
    pos: { x: 11, y: 8 },
    penaltyText: 'Nie ma czym wykręcać maszynek z wentyli!',
    resolvedMessage: 'Kluczyk wyciągnięty magnesem i umyty.',
    wladekSpeech: 'Wypadł mi jak szukałem monety pod kratką!',
    impactEffect: 'generic'
  },
  {
    type: 'jack_stands_tower',
    title: 'Władek zbudował wieżę z podstawek warsztatowych kobyłek!',
    description: 'Niestabilna konstrukcja z 4 kobyłek chwieje się na środku przejścia.',
    pos: { x: 11, y: 8 },
    penaltyText: 'Zagracone przejście między Stanowiskiem 1 a 2!',
    resolvedMessage: 'Kobyłki rozłożone bezpiecznie pod ścianą.',
    wladekSpeech: 'Konstrukcja inżynieryjna! Wieża Eiffla wulkanizacji!',
    impactEffect: 'generic'
  },

  // --- BIURO & POCZEKALNIA & ELEKTRYKA (31-38) ---
  {
    type: 'fuse_blown',
    title: 'Władek wybił bezpieczniki w biurze!',
    description: 'Władek podłączył jednocześnie stary czajnik spiralny, farelkę i toster w biurze.',
    pos: { x: 21, y: 17 },
    penaltyText: 'Kasa fiskalna i komputer w biurze wyłączone!',
    resolvedMessage: 'Bezpiecznik załączony w skrzynce rozdzielczej!',
    wladekSpeech: 'Chciałem tylko herbatkę zagotować i stópki ogrzać!',
    impactEffect: 'office'
  },
  {
    type: 'coffee_empty',
    title: 'Władek wypił całą kawę z ekspresu w poczekalni!',
    description: 'Ekspres w poczekalni wyświetla błąd braku wody i ziaren. Władek wypił 6 podwójnych espresso.',
    pos: { x: 18, y: 17 },
    penaltyText: 'Klienci w poczekalni nie mają dostępu do kawy!',
    resolvedMessage: 'Woda i ziarna kawy uzupełnione w ekspresie.',
    wladekSpeech: 'Ojej, jakie to dobre było! Serce mi bije jak silnik TDI!',
    impactEffect: 'patience'
  },
  {
    type: 'printer_paper_jam',
    title: 'Władek zaciął drukarkę fiskalną!',
    description: 'Władek włożył do podajnika papieru paragonowego papierek po cukierku "Irys".',
    pos: { x: 21, y: 17 },
    penaltyText: 'Nie można wydrukować paragonu dla klienta!',
    resolvedMessage: 'Papierek usunięty, rolka termiczna załadowana poprawnie.',
    wladekSpeech: 'Ja myślałem że to kosz na śmieci! Taka szczelina akurat!',
    impactEffect: 'office'
  },
  {
    type: 'tv_channel_jammed',
    title: 'Władek przełączył telewizor w poczekalni na telenowelę!',
    description: 'Kierowcy zamiast rajdów WRC muszą oglądać 1420. odcinek serialu "Namiętność w stepie".',
    pos: { x: 18, y: 17 },
    penaltyText: 'Cierpliwość klientów w poczekalni spada 2x szybciej!',
    resolvedMessage: 'Kanał motorsportu przywrócony pilotem.',
    wladekSpeech: 'Ale szefie, teraz Don Roberto wyzna miłość Marii! Zobaczcie sami!',
    impactEffect: 'patience'
  },
  {
    type: 'nap_in_armchair',
    title: 'Władek uciął sobie drzemkę na skórzanej kanapie VIP!',
    description: 'Władek chrapie w ubraniu roboczym na kanapie przeznaczonej dla klientów.',
    pos: { x: 18, y: 17 },
    penaltyText: 'Klienci nie mają gdzie usiąść w poczekalni!',
    resolvedMessage: 'Władek obudzony i skierowany do kącika herbaty.',
    wladekSpeech: 'Chrrr... pfff... ja tylko oczy na minutkę zamknąłem...',
    impactEffect: 'patience'
  },
  {
    type: 'ac_remote_freeze',
    title: 'Władek ustawił klimatyzację na 16°C w trybie Turbo!',
    description: 'W poczekalni zrobiło się jak w chłodni rybnej. Klienci szczękają zębami.',
    pos: { x: 18, y: 17 },
    penaltyText: 'Zimno w poczekalni denerwuje klientów!',
    resolvedMessage: 'Klimatyzacja ustawiona na komfortowe 22°C.',
    wladekSpeech: 'Dla świeżości! Opony lubią chłodne powietrze, to pomyślałem że klienci też!',
    impactEffect: 'patience'
  },
  {
    type: 'krówki_candies_stolen',
    title: 'Władek zjadł wszystkie darmowe krówki dla klientów!',
    description: 'Szklana miska z firmowymi krówkami na ladzie jest pusta, wszędzie leżą papierki.',
    pos: { x: 21, y: 17 },
    penaltyText: 'Brak darmowych słodyczy przy kasie!',
    resolvedMessage: 'Nowa paczka krówek wsypana do miski.',
    wladekSpeech: 'Mój cukier spadł! To była kwestia przeżycia!',
    impactEffect: 'patience'
  },
  {
    type: 'stamp_ink_spill',
    title: 'Władek rozlał tusz do pieczątek na faktury!',
    description: 'Czerwony tusz zalał biurko i formularze zleceń w kasie.',
    pos: { x: 21, y: 17 },
    penaltyText: 'Bałagan na biurku opóźnia rozliczenia!',
    resolvedMessage: 'Biurko przetarte, nowe czyste druki przygotowane.',
    wladekSpeech: 'Poduszka tuszowa była sucha, to chciałem dolać kropelkę!',
    impactEffect: 'office'
  },

  // --- KLIENCI & PARKING (39-44) ---
  {
    type: 'customer_conspiracy_theory',
    title: 'Władek zagaduje klienta teoriami spiskowymi o oponach!',
    description: 'Władek tłumaczy kierowcy Passata, że zimówki to wymysł korporacji i lepiej naciąć oponę nożem do chleba.',
    pos: { x: 3, y: 7 },
    penaltyText: 'Klient zaczyna mieć wątpliwości i traci cierpliwość!',
    resolvedMessage: 'Majster Mirek uspokoił klienta profesjonalnym wyjaśnieniem.',
    wladekSpeech: 'Prawdę mu mówiłem! Mój wujek całe życie na letnich po lodzie jeździł!',
    impactEffect: 'patience'
  },
  {
    type: 'parking_cones_maze',
    title: 'Władek ułożył labirynt z pachołków na parkingu!',
    description: 'Nowo przyjeżdżające samochody nie mogą wjechać na stanowiska.',
    pos: { x: 3, y: 7 },
    penaltyText: 'Zablokowany płynny wjazd na stanowiska!',
    resolvedMessage: 'Pachołki ustawione na obrzeżach parkingu.',
    wladekSpeech: 'To był tor przeszkód na prawo jazdy! Sprawdzałem czy umieją parkować!',
    impactEffect: 'generic'
  },
  {
    type: 'dirty_rag_window_cleaning',
    title: 'Władek umył przednią szybę klienta szmatą od smaru!',
    description: 'Czarne smugi na szybie luksusowego Mercedesa rozwścieczyły kierowcę.',
    pos: { x: 3, y: 7 },
    penaltyText: 'Ryzyko utraty reputacji u klienta!',
    resolvedMessage: 'Szyba wymyta płynem do szyb z alkoholem i mikrofibrą na błysk!',
    wladekSpeech: 'Chciałem dobrze! Gratisowa usługa mycia szyb w pakiecie!',
    impactEffect: 'patience'
  },
  {
    type: 'oil_slick_parking',
    title: 'Władek rozlał płyn do spryskiwaczy na wjeździe!',
    description: 'Śliska plama zimowego płynu z denaturatem przed bramą wjazdową.',
    pos: { x: 6, y: 7 },
    penaltyText: 'Samochody ślizgają się na wjeździe!',
    resolvedMessage: 'Wjazd spłukany myjką ciśnieniową.',
    wladekSpeech: 'Pachniało poziomkami, to wąchałem i mi bańka z rąk poleciała!',
    impactEffect: 'generic'
  },
  {
    type: 'dog_petting_distraction',
    title: 'Władek przyprowadził bezpańskiego psa do warsztatu!',
    description: 'Wesoły kundelek biega po hali i szczeka na kręcące się koła na wyważarce.',
    pos: { x: 11, y: 8 },
    penaltyText: 'Piesek odciąga uwagę mechaników od pracy!',
    resolvedMessage: 'Piesek wyprowadzony na parking i poczęstowany kiełbaską.',
    wladekSpeech: 'Nazwałem go Bieżnik! Będzie naszym psem stróżującym!',
    impactEffect: 'generic'
  },
  {
    type: 'customer_advice_air_pressure',
    title: 'Władek doradził klientowi napompowanie opon do 6 barów!',
    description: 'Władek wmawiał kierowcy Seicento, że twarde koło to zero oporów toczenia i auto poleci jak rakieta.',
    pos: { x: 3, y: 7 },
    penaltyText: 'Zdezorientowany klient kłóci się przy podnośniku!',
    resolvedMessage: 'Mirek wytłumaczył klientowi tabliczkę ciśnień na słupku B.',
    wladekSpeech: 'Kamień musi być, nie opona! Wtedy paliwo oszczędza!',
    impactEffect: 'patience'
  },

  // --- MAGAZYN OPON & REGAŁY (45-50) ---
  {
    type: 'tire_pyramid_fallen',
    title: 'Władek przewrócił piramidę opon w magazynie!',
    description: 'Stos 12 opon zimowych 205/55R16 rozsypał się po posadzce magazynu.',
    pos: { x: 21, y: 4 },
    penaltyText: 'Zastawione przejście do regałów z oponami!',
    resolvedMessage: 'Opony ułożone w bezpieczny stos na palecie.',
    wladekSpeech: 'Ja tylko tę z samego dołu chciałem wyciągnąć! Taka jenga oponiarska!',
    impactEffect: 'generic'
  },
  {
    type: 'tire_rolling_contest',
    title: 'Władek potoczył wielką oponę przez całą halę!',
    description: 'Opona od busa potoczyła się prosto pod nogi Majstra Mirka.',
    pos: { x: 11, y: 5 },
    stationId: 'station1',
    penaltyText: 'Praca na Stanowisku 1 przerwana!',
    resolvedMessage: 'Opona zatrzymana i odtoczona do magazynu.',
    wladekSpeech: 'Patrzcie jak prosto idzie! Zero bicia, idealna geometria!',
    impactEffect: 'generic'
  },
  {
    type: 'labels_swapped_tires',
    title: 'Władek zamienił naklejki rozmiarów opon!',
    description: 'Władek poprzeklejał etykiety: opony 15 cali mają naklejki 19 cali.',
    pos: { x: 23, y: 2 },
    penaltyText: 'Zamieszanie z doborem opon z magazynu!',
    resolvedMessage: 'Rozmiary zweryfikowane z napisów na profilu opony.',
    wladekSpeech: 'Ładniejsze były te duże cyfry! 19 lepiej brzmi niż 15!',
    impactEffect: 'generic'
  },
  {
    type: 'donut_hidden_in_tire',
    title: 'Władek schował pączka z lukrem wewnątrz nowej opony Michelin!',
    description: 'Seba omal nie zamontował opony z pączkiem w środku na felgę.',
    pos: { x: 20, y: 2 },
    penaltyText: 'Opona wymagała inspekcji przed montażem!',
    resolvedMessage: 'Pączek zabezpieczony (Władek go dokończył).',
    wladekSpeech: 'To był mój schowek na czarną godzinę! Z marmoladą różaną!',
    impactEffect: 'generic'
  },
  {
    type: 'tire_chalk_graffiti',
    title: 'Władek pomalował kredą wulkanizacyjną uśmieszki na oponach!',
    description: 'Zamiast oznaczeń LP/PP (Lewy Przód/Prawy Przód) na oponach są buźki i serduszka.',
    pos: { x: 21, y: 4 },
    penaltyText: 'Trudność w identyfikacji stron kół klienta!',
    resolvedMessage: 'Kreda zmyta i koła prawidłowo opisane.',
    wladekSpeech: 'Żeby klientowi było weselej jak spojrzy na koło!',
    impactEffect: 'generic'
  },
  {
    type: 'tire_rack_climbing',
    title: 'Władek wszedł na najwyższą półkę regału magazynowego!',
    description: 'Władek wspiął się na 3 metry i boi się zejść.',
    pos: { x: 23, y: 2 },
    penaltyText: 'Cały warsztat patrzy na Władka zamiast pracować!',
    resolvedMessage: 'Władek bezpiecznie sprowadzony po drabinie warsztatowej.',
    wladekSpeech: 'Stąd widać całe miasto! I dach Biedronki naprzeciwko!',
    impactEffect: 'generic'
  }
];

export function getRandomWladekEvent(): WladekEventDefinition {
  return WLADEK_50_EVENTS[Math.floor(Math.random() * WLADEK_50_EVENTS.length)];
}
