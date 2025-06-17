import { UnknownDataName } from "../interfaces/dataName.js";

export const unknownDataNames: UnknownDataName[] = [];
//TODO ADD ENGLISH
const synonyms: [string[], string][] = [
  [["Aldersgruppe", "Age group"], "AgeGroup"],
  [["Antal brugere", "Number of users"], "NumberOfUsers"],
  [["Længde"], "Length"],
  [["Bredde"], "Width"],
  [["Højde"], "TotalHeight"],
  [
    ["Længde af sikkerhedszone", "Sikkerhedsområdets længde"],
    "SafetyZoneLength",
  ],
  [
    ["Bredde af sikkerhedszone", "Sikkerhedsområdets bredde"],
    "SafetyZoneWidth",
  ],
  [["Maks. faldhøjde", "Free fall height", "Faldhøjde"], "FreeFallHeight"],
  [["Faldunderlag", "Safety zone", "Sikkerhedsområde"], "SafetyZone"],
];

const lookupMap = new Map<string, string>();

for (const [keys, normalizedValue] of synonyms) {
  for (const key of keys) {
    lookupMap.set(key.toLowerCase(), normalizedValue);
  }
}

export default function productDataNormalizer(
  dataName: string,
  source: string,
  url: string
): string {
  return (
    lookupMap.get(dataName.toLowerCase()) ||
    logUnkownDataName(dataName, source, url)
  );
}

function logUnkownDataName(
  dataName: string,
  source: string,
  url: string
): string {
  unknownDataNames.push({
    dataName,
    source,
    url,
  });

  return dataName;
}
