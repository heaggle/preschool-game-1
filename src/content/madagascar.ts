export type Province = {
  id: string;
  name: string;
  altName?: string;
  capital: string;
  zone: string;
};

export type Place = {
  id: string;
  name: string;
  province: string;
  emoji: string;
  hint: string;
};

export type Animal = {
  id: string;
  name: string;
  emoji: string;
};

export type Ethnicity = {
  id: string;
  name: string;
  region: string;
};

export const MADAGASCAR_FLAG = '🇲🇬';
export const MADAGASCAR_CAPITAL = 'Antananarivo';

export const PROVINCES: Province[] = [
  { id: 'antananarivo', name: 'Antananarivo', altName: 'Tananarive', capital: 'Antananarivo', zone: 'Centre' },
  { id: 'antsiranana', name: 'Antsiranana', altName: 'Diego-Suarez', capital: 'Antsiranana', zone: 'North' },
  { id: 'fianarantsoa', name: 'Fianarantsoa', capital: 'Fianarantsoa', zone: 'South-East' },
  { id: 'mahajanga', name: 'Mahajanga', altName: 'Majunga', capital: 'Mahajanga', zone: 'North-West' },
  { id: 'toamasina', name: 'Toamasina', altName: 'Tamatave', capital: 'Toamasina', zone: 'East' },
  { id: 'toliara', name: 'Toliara', altName: 'Tuléar', capital: 'Toliara', zone: 'South-West' },
];

export const PLACES: Place[] = [
  { id: 'rova', name: 'Rova of Antananarivo', province: 'antananarivo', emoji: '🏰', hint: "the Queen's palace" },
  { id: 'ambohimanga', name: 'Ambohimanga', province: 'antananarivo', emoji: '⛰️', hint: 'a royal hill' },
  { id: 'lake-anosy', name: 'Lake Anosy', province: 'antananarivo', emoji: '🏞️', hint: 'a lake in the capital' },
  { id: 'nosy-be', name: 'Nosy Be', province: 'antsiranana', emoji: '🏝️', hint: 'an island with beaches' },
  { id: 'amber-mountain', name: 'Amber Mountain', province: 'antsiranana', emoji: '🌋', hint: 'a park with waterfalls' },
  { id: 'emerald-sea', name: 'Emerald Sea', province: 'antsiranana', emoji: '🌊', hint: 'a turquoise lagoon' },
  { id: 'ranomafana', name: 'Ranomafana', province: 'fianarantsoa', emoji: '🌳', hint: 'a rainforest park' },
  { id: 'tsingy', name: 'Tsingy de Bemaraha', province: 'mahajanga', emoji: '🗻', hint: 'pointed limestone rocks' },
  { id: 'sainte-marie', name: 'Île Sainte-Marie', province: 'toamasina', emoji: '🐋', hint: 'whales visit here' },
  { id: 'pangalanes', name: 'Canal des Pangalanes', province: 'toamasina', emoji: '🛶', hint: 'a long waterway' },
  { id: 'andasibe', name: 'Andasibe-Mantadia', province: 'toamasina', emoji: '🐒', hint: 'home of the indri' },
  { id: 'baobabs', name: 'Avenue of the Baobabs', province: 'toliara', emoji: '🌴', hint: 'giant trees' },
  { id: 'isalo', name: 'Isalo National Park', province: 'toliara', emoji: '🏜️', hint: 'canyons and pools' },
  { id: 'anakao', name: 'Anakao', province: 'toliara', emoji: '🏖️', hint: 'beaches and Vezo fishing' },
];

export const ANIMALS: Animal[] = [
  { id: 'lemur', name: 'Lemur', emoji: '🐒' },
  { id: 'indri', name: 'Indri', emoji: '🙈' },
  { id: 'chameleon', name: 'Chameleon', emoji: '🦎' },
  { id: 'fossa', name: 'Fossa', emoji: '🐆' },
  { id: 'baobab', name: 'Baobab', emoji: '🌳' },
  { id: 'tortoise', name: 'Radiated tortoise', emoji: '🐢' },
  { id: 'gecko', name: 'Gecko', emoji: '🦎' },
  { id: 'frog', name: 'Mantella frog', emoji: '🐸' },
];

export const ETHNICITIES: Ethnicity[] = [
  { id: 'merina', name: 'Merina', region: 'Central highlands' },
  { id: 'betsileo', name: 'Betsileo', region: 'Southern highlands' },
  { id: 'betsimisaraka', name: 'Betsimisaraka', region: 'East coast' },
  { id: 'sakalava', name: 'Sakalava', region: 'West coast' },
  { id: 'bara', name: 'Bara', region: 'South' },
  { id: 'antandroy', name: 'Antandroy', region: 'Far south' },
  { id: 'antanosy', name: 'Antanosy', region: 'South-east' },
  { id: 'antaisaka', name: 'Antaisaka', region: 'South-east' },
  { id: 'tanala', name: 'Tanala', region: 'South-east forests' },
  { id: 'sihanaka', name: 'Sihanaka', region: 'Lake Alaotra' },
  { id: 'tsimihety', name: 'Tsimihety', region: 'North' },
  { id: 'antakarana', name: 'Antakarana', region: 'Far north' },
  { id: 'antambahoaka', name: 'Antambahoaka', region: 'South-east' },
  { id: 'antaifasy', name: 'Antaifasy', region: 'South-east' },
  { id: 'antaimoro', name: 'Antaimoro', region: 'South-east' },
  { id: 'mahafaly', name: 'Mahafaly', region: 'South-west' },
  { id: 'vezo', name: 'Vezo', region: 'South-west coast' },
  { id: 'bezanozano', name: 'Bezanozano', region: 'Centre-east' },
];
