/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Procedural generator and curated database with 1000+ distinct humorous Władek quotes

export const WLADEK_HANDCRAFTED_QUOTES: string[] = [
  'Szefie, ja tolko smatriu! Ale ten Janusz to za wolno śruby kręci, ja bym to raz-dwa łomem podważył!',
  'Panie Majster, a po co ten klucz dynamometryczny? Ręką czuć trzeba, a jak trzeszczy to znaczy że trzyma!',
  'Klucz 17 gdzieś tu leżał... To ja go schowałem do kieszeni, żeby nikt nie ukradł. Bezpieczniej u Władka!',
  'O, klient przyjechał! Idę mu powiedzieć, że zbieżność ma krzywą, rozrząd stuka i w ogóle to lepiej niech auto zostawi na noc!',
  'Ja w biurze tylko herbatkę z cytrynką robiłem... i te ciasteczka z szafki sprawdziłem, czy nie zwietrzały. Wszystkie zjadłem, świeże były!',
  'RunFlat? Eeee tam, panie kierowco, na twardej gumie plomby z zębów wypadają! Załóż pan dętkę z Żuka, miękko będzie jak na kanapie!',
  'Mirek! Te ciężarki do wyważania to ja ci poukładałem kolorami! Ładniej teraz na feldze wyglądają, symetrycznie po obu stronach!',
  'A ten podnośnik to do ilu ton podnosi? Bo jakbyśmy wjechali kombajnem Bizon, to wytrzyma czy posadzka pęknie?',
  'Szefie, kompresor coś dziwnie syczał, to ja w zawór kołek osinowy wbiłem! Teraz trzyma 15 barów, zegar aż się dookoła przekręcił!',
  'Kto to widział azotem koła pompować?! Powietrze za darmo z nieba leci, a pan za gaz płacisz! Daj pan dychę Władkowi, dmuchnę w wentyl!',
  'Darek, ty za dużo siły w rękach masz! Pół felgi aluminiowej z gwintem wyrwałeś! Trzeba było mnie zawołać, ja mam czucie w palcach!',
  'A wiecie co w telewizorze w poczekalni mówili? Że zima stulecia idzie! Już w sierpniu trzeba łańcuchy na koła zakładać!',
  'Ten pan w garniturze z Mercedesa jakiś nerwowy... Zaproponowałem mu herbatę z fusami w słoiku po majonezie, to dziwnie spojrzał!',
  'Pasta Biały Wilk to najlepsza rzecz na świecie! Nie tylko opona na felgę gładko wchodzi, ale i buty można napastować przed niedzielą!',
  'Szefie, a ten wentylek to w lewo czy w prawo gwintowany? Bo kręciłem w obie strony i teraz mam w ręku dwa kawałki...',
  'Ja nie przeszkadzam, ja przeprowadzam audyt stanowiskowy! Według moich obliczeń robicie za dużo przerw na papierosa, a za mało dla Władka!',
  'Seba, młody jesteś, życia nie znasz! Za moich czasów to się na feldze bez opony do domu wracało i iskry drogę oświetlały!',
  'Oooo, jaki ładny błyszczący klucz pneumatyczny! Wygląda jak pistolet z filmu science-fiction! Mogę z niego w niebo postrzelać?',
  'Klient prosił o wyważenie, ale ja popatrzyłem na koło i powiedziałem, że ziemia też jest krzywa i jakoś się kręci!',
  'Szefie, a może by tak na dachu warsztatu reklamę powiesić: "Wulkanizacja u Władka - szybko, tanio, a koła same odpadają"?',
  'Znalazłem na parkingu taką śrubkę z podkładką... Chyba z tego czerwonego Audi odpadła, ale auto już pojechało, to schowam do słoika!',
  'Majster Mirek na mnie krzyczy, że mu pod nogami stoję! A gdzie ja mam stać, jak na zewnątrz deszcz kropi, a tu ciepło od rury wydechowej bije?',
  'Zrobiłem porządek na wózku narzędziowym: duże klucze na dół, małe do kosza na śmieci, bo i tak nikt takich małych śrubek nie używa!',
  'Panie kierowco, ten bieżnik to ma jeszcze z pół milimetra! Do drutów daleko, do pierwszego śniegu spokojnie wystarczy!',
  'Uże idu, uże idu! Ale zanim pójdę, muszę jeszcze sprawdzić czy w radiu disco polo nie da się głośniej podkręcić!',
  'Szefie, ja bym chętnie podnośnikiem pomanewrował! W górę, w dół, jak na karuzeli w wesołym miasteczku!',
  'Jak w zimie przymarznie, to nie odmrażaczem, tylko czajnikiem wrzątku polewać! Szybko, ekologicznie i od razu herbata pachnie!',
  'Te felgi aluminiowe to za miękkie robią, z plasteliny chyba! U nas w kołchozie to były felgi ze stali pancernej, czołg mógł po nich przejechać!',
  'Wytarłem szmatą szybę w tym Passacie, a kierowca zamiast podziękować to krzyczy, że to była szmata ze smarem grafitowym...',
  'Kto wymyślił te czujniki ciśnienia TPMS?! Bateria padnie i na desce choinka! Trzeba kontrolkę taśmą czarną zakleić i po kłopocie!',
  'Mirek, daj mi ten palnik acetylenowy na pięć minut, parówki sobie w bułce podgrzeję!',
  'Ja słyszałem, że jak się oponę mlekiem nasączy, to guma robi się elastyczna jak u niemowlaka!',
  'Szefie, a jakbyśmy zamiast powietrza napompowali helu? Auto będzie lżejsze i mniej paliwa spali na autostradzie!',
  'Kierowco złoty, jak bije w kierownicę przy 140 km/h, to po prostu nie jedź 140, tylko 90 i nic nie będzie biło!',
  'Znalazłem na dnie beczki z olejem taką ładną złotą nakrętkę... Myślałem że to pierścionek zaręczynowy, a to korek od miski olejowej!'
];

// Combinatorial building blocks: 15 prefixes * 15 subjects * 10 observations * 10 punchlines = 22,500 combinations!
const PREFIXES = [
  'Szefie, ja tolko smatriu, ale',
  'Panie Majster, powiem krótko:',
  'Słuchaj no Mirek, prawda jest taka, że',
  'Janusz, odstaw tę herbatę, bo',
  'Seba, młody jesteś to posłuchaj starszego:',
  'Darek, nie denerwuj się, ale',
  'U nas w Kołomyi każdy mechanik wie, że',
  'Kierowco szanowny, bez obrazy, ale',
  'Słowo honoru wam daję,',
  'Ja tam w papiery nie patrzę, ale widzę że',
  'Ohoho, spojrzałem jednym okiem i wiem, że',
  'Spokojna wasza rozczochrana, bo',
  'Władek wam coś po ludzku wytłumaczy:',
  'Nie chcę nikogo stresować, ale',
  'Jak babcię kocham, przysięgam że'
];

const SUBJECTS = [
  'ta opona zimowa z bieżnikiem 1 milimetr',
  'ten zardzewiały zacisk hamulcowy z Passata',
  'ten chiński wentylek wkręcany na siłę',
  'ta krzywa felga aluminiowa po krawężniku',
  'ten stary kompresor jednotłokowy',
  'ta montażownica automatyczna ze stopką',
  'ta laserowa wyważarka z wyświetlaczem',
  'ta pasta montażowa Biały Wilk z wiadra',
  'ten klucz udarowy nastawiony na maksymalny moment',
  'ten podnośnik hydrauliczny dwukolumnowy',
  'ten komplet opon RunFlat o twardości kamienia',
  'ten zeszlifowany gwint w piaście koła',
  'ta opona wielosezonowa z bazaru',
  'ten czerwony kurek spustowy od powietrza',
  'ten wózek narzędziowy z porozrzucanymi nasadkami'
];

const OBSERVATIONS = [
  'tak dziwnie piszczy i rzęzi przy kręceniu,',
  'jak się młotkiem przez drewienko nie dopchnie,',
  'tak krzywo na osi siedzi że aż w zębach zgrzyta,',
  'tyle luzu ma w sobie co stara szafa gdańska,',
  'tak mocno zapieczone jest na amen,',
  'tak na boki majta przy każdym obrocie,',
  'pachnie jak spalony ebonit z transformatora,',
  'tak gładkie jest jak stół bilardowy w remizie,',
  'jak się na dwa metry rury nie założy to nie drgnie,',
  'gwizda głośniej niż lokomotywa parowa w Karpatach,'
];

const PUNCHLINES = [
  'ale do Niemca na handel jeszcze spokojnie obleci!',
  'dlatego Władek proponuje wypić kawkę i udawać że tak ma być!',
  'więc schowałem to do kieszeni, bo po co ma ludzi denerwować!',
  'i żaden diagnosta na stacji kontroli się nie zorientuje!',
  'także dawajcie szlifierkę kątową, w minutę to Władek wyrówna!',
  'a jak klient zapyta, to powiemy że to wersja sportowa rajdowa!',
  'bo w tych mądrych instrukcjach to same bzdury wypisują!',
  'i dlatego właśnie Władek powinien dostać premię dyrektorską!',
  'a do pierwszego śniegu to na pewno samo się ułoży!',
  'więc lepiej tego nie dotykać, niech stoi na słowo honoru!'
];

/**
 * Returns a deterministic or randomized quote from the bank of 1000+ quotes
 * Guaranteed to generate over 1000 completely unique, humorous workshop phrases.
 */
export function getWladekQuote(index?: number): string {
  // If specific index is provided (0 to 999)
  if (typeof index === 'number') {
    if (index < WLADEK_HANDCRAFTED_QUOTES.length) {
      return WLADEK_HANDCRAFTED_QUOTES[index];
    }
    const offset = index - WLADEK_HANDCRAFTED_QUOTES.length;
    const pIdx = offset % PREFIXES.length;
    const sIdx = Math.floor(offset / PREFIXES.length) % SUBJECTS.length;
    const oIdx = Math.floor(offset / (PREFIXES.length * SUBJECTS.length)) % OBSERVATIONS.length;
    const punchIdx = Math.floor(offset / (PREFIXES.length * SUBJECTS.length * OBSERVATIONS.length)) % PUNCHLINES.length;

    return `${PREFIXES[pIdx]} ${SUBJECTS[sIdx]} ${OBSERVATIONS[oIdx]} ${PUNCHLINES[punchIdx]}`;
  }

  // 15% chance to pick from handcrafted favorites, 85% procedural from combinatorial pool
  if (Math.random() < 0.15) {
    return WLADEK_HANDCRAFTED_QUOTES[Math.floor(Math.random() * WLADEK_HANDCRAFTED_QUOTES.length)];
  }

  const p = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
  const s = SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)];
  const o = OBSERVATIONS[Math.floor(Math.random() * OBSERVATIONS.length)];
  const punch = PUNCHLINES[Math.floor(Math.random() * PUNCHLINES.length)];

  return `${p} ${s} ${o} ${punch}`;
}

// Generate an indexed array of 1000 distinct quotes
export function generate1000Quotes(): string[] {
  const result: string[] = [];
  for (let i = 0; i < 1000; i++) {
    result.push(getWladekQuote(i));
  }
  return result;
}
