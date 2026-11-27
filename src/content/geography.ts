export type Continent = {
  id: string;
  name: string;
  emoji: string;
};

export type Country = {
  id: string;
  name: string;
  flag: string;
  languages: string[];
  greeting: string;
  continent: string;
};

export const CONTINENTS: Continent[] = [
  { id: 'africa', name: 'Africa', emoji: '🦁' },
  { id: 'asia', name: 'Asia', emoji: '🐼' },
  { id: 'europe', name: 'Europe', emoji: '🏰' },
  { id: 'north-america', name: 'North America', emoji: '🦅' },
  { id: 'south-america', name: 'South America', emoji: '🌴' },
  { id: 'antarctica', name: 'Antarctica', emoji: '🐧' },
  { id: 'oceania', name: 'Oceania', emoji: '🦘' },
];

export const COUNTRIES: Country[] = [
  { id: 'madagascar', name: 'Madagascar', flag: '🇲🇬', languages: ['Malagasy', 'French'], greeting: 'Salama', continent: 'africa' },
  { id: 'france', name: 'France', flag: '🇫🇷', languages: ['French'], greeting: 'Bonjour', continent: 'europe' },
  { id: 'uk', name: 'United Kingdom', flag: '🇬🇧', languages: ['English'], greeting: 'Hello', continent: 'europe' },
  { id: 'usa', name: 'United States', flag: '🇺🇸', languages: ['English'], greeting: 'Hi', continent: 'north-america' },
  { id: 'canada', name: 'Canada', flag: '🇨🇦', languages: ['English', 'French'], greeting: 'Hello', continent: 'north-america' },
  { id: 'spain', name: 'Spain', flag: '🇪🇸', languages: ['Spanish'], greeting: 'Hola', continent: 'europe' },
  { id: 'italy', name: 'Italy', flag: '🇮🇹', languages: ['Italian'], greeting: 'Ciao', continent: 'europe' },
  { id: 'germany', name: 'Germany', flag: '🇩🇪', languages: ['German'], greeting: 'Hallo', continent: 'europe' },
  { id: 'brazil', name: 'Brazil', flag: '🇧🇷', languages: ['Portuguese'], greeting: 'Olá', continent: 'south-america' },
  { id: 'egypt', name: 'Egypt', flag: '🇪🇬', languages: ['Arabic'], greeting: 'Ahlan', continent: 'africa' },
  { id: 'kenya', name: 'Kenya', flag: '🇰🇪', languages: ['Swahili', 'English'], greeting: 'Jambo', continent: 'africa' },
  { id: 'india', name: 'India', flag: '🇮🇳', languages: ['Hindi'], greeting: 'Namaste', continent: 'asia' },
  { id: 'china', name: 'China', flag: '🇨🇳', languages: ['Mandarin'], greeting: 'Nǐ hǎo', continent: 'asia' },
  { id: 'japan', name: 'Japan', flag: '🇯🇵', languages: ['Japanese'], greeting: 'Konnichiwa', continent: 'asia' },
  { id: 'australia', name: 'Australia', flag: '🇦🇺', languages: ['English'], greeting: "G'day", continent: 'oceania' },
];

export function countryById(id: string): Country | undefined {
  return COUNTRIES.find((country) => country.id === id);
}
