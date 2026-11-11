/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CarBodyType } from '../types/game';

export interface CarTemplate {
  model: string;
  bodyType: CarBodyType;
  color: string;
  plate: string;
  customer: string;
  quote?: string;
}

export const CAR_FLEET: CarTemplate[] = [
  // --- KLASYKI I IKONY POLSKIEJ SZOSY ---
  {
    model: 'Volkswagen Passat B5 1.9 TDI',
    bodyType: 'wagon',
    color: '#94a3b8', // Srebrny metalik
    plate: 'POS 54KL',
    customer: 'Pan Zdzisław (Sąsiad)',
    quote: 'Szefie, ten silnik przeżyje nas wszystkich, byle opony miały bieżnik!'
  },
  {
    model: 'Polonez Caro Plus 1.6 GSI',
    bodyType: 'hatchback',
    color: '#991b1b', // Bordowy
    plate: 'WPI 8820',
    customer: 'Pan Marian (Emeryt)',
    quote: 'Od nowości u mnie! Fabryczne dętki jeszcze pamiętają premiera Pawlaka.'
  },
  {
    model: 'Fiat 126p Maluch Town',
    bodyType: 'compact',
    color: '#ea580c', // Pomarańczowy
    plate: 'KRA 126P',
    customer: 'Młody pasjonat Bartek',
    quote: 'Proszę ostrożnie ze śrubami, felga trzyma się na honorze!'
  },
  {
    model: 'Daewoo Tico SX z Gazem',
    bodyType: 'compact',
    color: '#0284c7', // Błękitny
    plate: 'TK 44011',
    customer: 'Pani Wiesława',
    quote: 'Pali 4 litry gazu, ale przy 80 km/h bije mi kierownica jak młot udarowy.'
  },
  {
    model: 'Daewoo Lanos 1.5 16V Hatchback',
    bodyType: 'hatchback',
    color: '#16a34a', // Butelkowa zieleń
    plate: 'EL 872XP',
    customer: 'Pan Krzysiek',
    quote: 'Załóżcie mi jakieś dobre Dębice Frigo, zima zaskoczy drogowców!'
  },
  {
    model: 'Fiat Cinquecento 704cc Sporting',
    bodyType: 'compact',
    color: '#eab308', // Żółty kanarek
    plate: 'DW 4129A',
    customer: 'Student Dominik',
    quote: 'Moc 31 koni, opony jak od taczki, ale w mieście parkuję wszędzie.'
  },
  {
    model: 'FSO Żuk A-07 Sadownika',
    bodyType: 'truck',
    color: '#0d9488', // Morski turkus
    plate: 'RAD 0991',
    customer: 'Pan Waldek z Grójca',
    quote: 'Wiozę dwie tony jabłek, dajcie 4 atmosfery w tylne opony!'
  },
  {
    model: 'Skoda Felicia 1.3 Combi',
    bodyType: 'wagon',
    color: '#64748b', // Szary
    plate: 'CTR 8812',
    customer: 'Działkowiec Jan',
    quote: 'Tylko nie porysujcie kołpaków, to oryginały z Mladá Boleslav.'
  },
  {
    model: 'Opel Astra F 1.4 Classic',
    bodyType: 'wagon',
    color: '#71717a', // Grafitowy
    plate: 'SJZ 6192',
    customer: 'Pan Bogusław',
    quote: 'Progi już zjadła ruda, ale zawieszenie sztywne!'
  },

  // --- NIEMIECKIE LEGENDY I SŁUŻBOWE WOŁY ROBOCZE ---
  {
    model: 'Audi 80 B4 1.9 TDI "Beczka"',
    bodyType: 'sedan',
    color: '#334155', // Ciemny grafit
    plate: 'GDA 1994',
    customer: 'Pan Henryk',
    quote: 'Ocynk, panie! Za sto lat ten lakier będzie tak samo błyszczał.'
  },
  {
    model: 'Audi A4 B6 1.9 TDI Avant',
    bodyType: 'wagon',
    color: '#1e293b', // Granat metalik
    plate: 'PO 998ZZ',
    customer: 'Pan Tomasz (Handlowiec)',
    quote: 'Robię 60 tysięcy rocznie, wyważcie mi koła idealnie na zero.'
  },
  {
    model: 'Volkswagen Golf IV 1.9 TDI',
    bodyType: 'hatchback',
    color: '#1d4ed8', // Błękit Jazz Blue
    plate: 'ZS 34102',
    customer: 'Kamil z osiedla',
    quote: 'Czarne dymki lecą z rury, ale wulkanizacja ma być zrobiona po bożemu!'
  },
  {
    model: 'Volkswagen Golf II 1.6 D z szyberdachem',
    bodyType: 'hatchback',
    color: '#dc2626', // Marsrot
    plate: 'NO 1988',
    customer: 'Wojtek (Klasyki Olsztyn)',
    quote: 'Auto starsze ode mnie, felgi BBS RS po renowacji polerowane ranty.'
  },
  {
    model: 'BMW E46 320d Touring',
    bodyType: 'wagon',
    color: '#0f172a', // Czarny szafir
    plate: 'KRA 77XM',
    customer: 'Krystian (Młody Wilk)',
    quote: 'Tylny napęd na śniegu to poezja, dajcie opony z miękkiej mieszanki!'
  },
  {
    model: 'BMW E39 530d M-Pakiet',
    bodyType: 'sedan',
    color: '#09090b', // Karbonschwarz
    plate: 'WPR 530D',
    customer: 'Mecenas Radosław',
    quote: 'Komfort na autostradzie bezkonkurencyjny. Proszę o azot w kołach.'
  },
  {
    model: 'BMW E36 Coupe "Projekt Gruz"',
    bodyType: 'sport',
    color: '#7c3aed', // Fioletowy mat ze spoilerem
    plate: 'SC 2500',
    customer: 'Drifter Mati',
    quote: 'Zaspawany dyfer zjadł już trzeci komplet opon w tym tygodniu!'
  },
  {
    model: 'Mercedes-Benz W124 250D "Baleron"',
    bodyType: 'sedan',
    color: '#ca8a04', // Złoto-beżowy piaskowy
    plate: 'PO 124MB',
    customer: 'Taksówkarz Zygmunt',
    quote: 'Milion trzysta tysięcy na liczniku i ani razu nie stanął w trasie.'
  },
  {
    model: 'Mercedes W201 190E "Baby-Benz"',
    bodyType: 'sedan',
    color: '#047857', // Szmaragdowy
    plate: 'KR 190EE',
    customer: 'Profesor Nowak',
    quote: 'Proszę nie używać pneumatyka na maksa, śruby dokręcamy z wyczuciem.'
  },
  {
    model: 'Mercedes W211 E280 CDI Avantgarde',
    bodyType: 'sedan',
    color: '#cbd5e1', // Srebrny Iryd
    plate: 'WA 88721',
    customer: 'Pan Dyrektor Grzegorz',
    quote: 'Pneumatyczne zawieszenie Airmatic wymaga ostrożności przy podnoszeniu.'
  },

  // --- DOSTAWCZAKI, BLACHARKA I KURIERZY ---
  {
    model: 'Fiat Ducato Maxi "Kurier Express"',
    bodyType: 'van',
    color: '#facc15', // Żółty kurierski
    plate: 'WA 441DP',
    customer: 'Kurier Sebek',
    quote: 'Panowie, mam 120 paczek na pace i 15 minut do odjazdu na rejon!'
  },
  {
    model: 'Renault Master 2.3 dCi "Brygada Budowlana"',
    bodyType: 'van',
    color: '#ffffff', // Biały w zaprawie
    plate: 'RZE 884M',
    customer: 'Majster Stanisław',
    quote: 'Złapałem pręt zbrojeniowy na budowie, załatajcie od ręki sznurem!'
  },
  {
    model: 'Mercedes Sprinter 316 CDI Long',
    bodyType: 'van',
    color: '#94a3b8', // Srebrny
    plate: 'LU 5521A',
    customer: 'Kierowca Darek',
    quote: 'Koła wzmacniane z indeksem C, 8 warstw kordu. Dajcie 4.5 bara.'
  },
  {
    model: 'Volkswagen Transporter T4 "Ekipa Tynkarzy"',
    bodyType: 'van',
    color: '#0284c7', // Niebieski firmowy
    plate: 'BI 90114',
    customer: 'Pan Kazik',
    quote: 'Niezniszczalny wół roboczy. Wozi rusztowania i kielnie od 20 lat.'
  },
  {
    model: 'Ford Transit 2.0 TDCi "Serwis AGD"',
    bodyType: 'van',
    color: '#f8fafc', // Biały
    plate: 'GD 718TR',
    customer: 'Pan Mirek Serwisant',
    quote: 'Sprawdźcie też wentyle, bo z jednego powoli uchodziło powietrze.'
  },
  {
    model: 'FS Lublin II 2.4 Andoria "Warzywa-Owoce"',
    bodyType: 'van',
    color: '#84cc16', // Jasnozielony
    plate: 'LUB 4410',
    customer: 'Pani Halina z targu',
    quote: 'Kapusta i ziemniaki już zapakowane, wymieńcie lewy przód!'
  },

  // --- POPULARNE MIEJSKIE I KOMPAKTOWE ---
  {
    model: 'Toyota Yaris II 1.3 VVT-i',
    bodyType: 'hatchback',
    color: '#dc2626', // Czerwona strzała
    plate: 'KR 58190',
    customer: 'Pani Magda (Nauczycielka)',
    quote: 'Bardzo proszę sprawdzić czy koła są dobrze dokręcone, wożę dzieci.'
  },
  {
    model: 'Skoda Fabia I 1.4 MPI "Srebrna Strzała"',
    bodyType: 'hatchback',
    color: '#94a3b8',
    plate: 'WI 6739A',
    customer: 'Pan Tadeusz',
    quote: 'Rozsądny wybór rozsądnego Polaka. Tanie opony 14 cali poproszę.'
  },
  {
    model: 'Renault Clio III 1.2 16V',
    bodyType: 'hatchback',
    color: '#3b82f6', // Niebieski metalik
    plate: 'PO 24088',
    customer: 'Studentka Ania',
    quote: 'Świeci mi się taka mała kontrolka z oponką na desce rozdzielczej.'
  },
  {
    model: 'Peugeot 206 1.4 HDi z naklejką kota',
    bodyType: 'hatchback',
    color: '#a855f7', // Fioletowy
    plate: 'WWL 4501',
    customer: 'Pani Kasia',
    quote: 'Tylna belka trochę piszczy, ale opony chcę cichutkie wielosezonowe.'
  },
  {
    model: 'Ford Focus Mk1 1.8 TDDi',
    bodyType: 'hatchback',
    color: '#065f46', // Ciemnozielony
    plate: 'CB 71092',
    customer: 'Pan Andrzej',
    quote: 'Zawieszenie Control Blade trzyma w zakrętach jak przyklejone.'
  },
  {
    model: 'Opel Corsa C 1.0 EcoTec',
    bodyType: 'compact',
    color: '#f97316', // Pomarańczowy
    plate: 'PKN 1102',
    customer: 'Pani Monika',
    quote: 'Trzy cylindry pracują jak zegarek, potrzebuję dwóch nowych opon na przód.'
  },
  {
    model: 'Honda Civic VI "Ekonomiczna Hanka"',
    bodyType: 'hatchback',
    color: '#475569',
    plate: 'KSU 9918',
    customer: 'Rafał',
    quote: 'VTEC się załącza przy 5500 obrotów, bieżnik musi kleić do asfaltu.'
  },
  {
    model: 'Fiat Seicento 1.1 Sporting Abarth',
    bodyType: 'compact',
    color: '#e11d48', // Czerwony z białymi pasami
    plate: 'SB 33411',
    customer: 'Kuba KJS',
    quote: 'Dajcie mi opony semi-slick, jutro mam amatorski rajd w Tychach!'
  },

  // --- SUWY, CROSSOVERY I 4X4 ---
  {
    model: 'Dacia Duster 1.5 dCi 4x4',
    bodyType: 'suv',
    color: '#ca8a04', // Złoto-brązowy Atacama
    plate: 'GD 554TL',
    customer: 'Piotr (Wędkarz)',
    quote: 'Często jeżdżę po błocie nad jezioro, załóżcie profil All-Terrain!'
  },
  {
    model: 'Toyota RAV4 IV Hybrid',
    bodyType: 'suv',
    color: '#f8fafc', // Biała perła
    plate: 'WE 1029K',
    customer: 'Pani Doktor Ewa',
    quote: 'W hybrydzie koła muszą mieć niskie opory toczenia A-klasy.'
  },
  {
    model: 'Kia Sportage III 2.0 CRDi',
    bodyType: 'suv',
    color: '#0284c7',
    plate: 'SK 48190',
    customer: 'Pan Artur z rodziną',
    quote: 'Pakujemy się na narty do Zakopanego, wyważcie koła z najwyższą dbałością.'
  },
  {
    model: 'BMW X5 E53 3.0i z gazem',
    bodyType: 'suv',
    color: '#0f172a', // Czarny
    plate: 'DW 550X5',
    customer: 'Oskar "Szef"',
    quote: 'Szerokie kapcie 285 z tyłu na 19-calowej feldze. Będzie robota!'
  },
  {
    model: 'Audi Q7 3.0 TDI Quattro',
    bodyType: 'suv',
    color: '#475569', // Ciemnoszary
    plate: 'KR 777Q7',
    customer: 'Prezes Dariusz',
    quote: 'Masa 2.5 tony, pneumatyka. Podnośnik da radę go unieść?'
  },
  {
    model: 'Suzuki Grand Vitara 2.0 4WD',
    bodyType: 'suv',
    color: '#064e3b', // Ciemna leśna zieleń
    plate: 'NE 33219',
    customer: 'Leśniczy Jarosław',
    quote: 'Koło zapasowe wisi na klapie bagażnika, też trzeba dopompować.'
  },
  {
    model: 'Volvo XC90 D5 AWD Inscription',
    bodyType: 'suv',
    color: '#1e1b4b', // Granatowy
    plate: 'PO 900XC',
    customer: 'Architekt Michał',
    quote: 'Bezpieczeństwo na pierwszym miejscu. Felgi 20 cali z czujnikami TPMS.'
  },

  // --- SPORTOWE, TUNINGOWE I GŁOŚNE ---
  {
    model: 'Subaru Impreza WRX STI "Bulgot"',
    bodyType: 'sport',
    color: '#1d4ed8', // World Rally Blue ze złotymi felgami
    plate: 'K1 BOXER',
    customer: 'Kierowca Rajdowy Maciek',
    quote: 'Symetryczne AWD wymaga równego zużycia bieżnika na wszystkich 4 kołach!'
  },
  {
    model: 'Mazda MX-5 NB "Miatka"',
    bodyType: 'sport',
    color: '#15803d', // British Racing Green
    plate: 'W1 MIATA',
    customer: 'Miłośnik JDM Filip',
    quote: 'Lekki roadster, precyzyjne prowadzenie. Proszę o 2.0 bara równo.'
  },
  {
    model: 'Opel Calibra 2.0 16V "Legenda Tuningu"',
    bodyType: 'sport',
    color: '#dc2626', // Ognisty czerwony
    plate: 'KMY 16V',
    customer: 'Darek "Szybki"',
    quote: 'Szeroki zderzak z laminatu i aluminiowe felgi 17 cali z rantem.'
  },
  {
    model: 'Audi RS6 Avant Quattro 4.0 V8',
    bodyType: 'wagon',
    color: '#334155', // Szary Nardo Grey
    plate: 'W0 RS600',
    customer: 'Inwestor Jakub',
    quote: '600 koni mechanicznych. Felgi 22 cale, hamulce ceramiczne, zero rys!'
  },
  {
    model: 'Ford Mustang GT 5.0 V8',
    bodyType: 'sport',
    color: '#f59e0b', // Żółty Grabber Yellow
    plate: 'W5 MUSTG',
    customer: 'Bartek Fan Amerykanów',
    quote: 'Ryk V8 i dym spod kół. Tylne opony szybko się u mnie kończą!'
  },

  // --- LUKSUSOWE LIMUZYNY I SPECJALNE ---
  {
    model: 'Mercedes-Benz Klasy S W221 S500',
    bodyType: 'sedan',
    color: '#020617', // Czerń fortepianowa
    plate: 'W1 VIP99',
    customer: 'Biznesmen Aleksander',
    quote: 'Dyskrecja i najwyższa kultura pracy. Opony Run-Flat z homologacją MO.'
  },
  {
    model: 'Lexus LS400 4.0 V8 "Cisza Absolutna"',
    bodyType: 'sedan',
    color: '#cbd5e1', // Perłowy szampan
    plate: 'KR 400LS',
    customer: 'Kolekcjoner Japończyków',
    quote: 'Postawisz monetę na silniku i nie drgnie. Opony muszą być bezgłośne.'
  },
  {
    model: 'Tesla Model 3 Long Range Dual Motor',
    bodyType: 'sedan',
    color: '#f8fafc', // Biała perła
    plate: 'GD 33EV1',
    customer: 'Programista Tomek',
    quote: 'Pamiętajcie o gumowych podkładkach pod podnośnik, by nie uszkodzić baterii!'
  },
  {
    model: 'Mercedes Taxi 190D "Bocian Morski"',
    bodyType: 'sedan',
    color: '#fef08a', // Kość słoniowa taxi
    plate: 'GSP 01TX',
    customer: 'Pan Mieczysław z Postoju',
    quote: 'Czwarty milion kilometrów pyknął, opony zmieniam zawsze u was!'
  },
  {
    model: 'Polonez Milicja Obywatelska Retro',
    bodyType: 'sedan',
    color: '#0284c7', // Milicyjny niebieski z białym pasem
    plate: 'MO 1981',
    customer: 'Rekonstruktor Sierżant Walczak',
    quote: 'Obywatelu mechaniku, opony mają trzymać w pościgu za spekulantami!'
  },
  {
    model: 'Fiat Panda 1.2 "Pizzeria Bella Napoli"',
    bodyType: 'compact',
    color: '#15803d', // Włoska flaga
    plate: 'PO 4PIZZ',
    customer: 'Dostawca Luigi',
    quote: 'Pizza stygnie w bagażniku, załóżcie koło w 3 minuty a dostaniecie capricciosę!'
  }
];

export function getRandomCarTemplate(): CarTemplate {
  return CAR_FLEET[Math.floor(Math.random() * CAR_FLEET.length)];
}
