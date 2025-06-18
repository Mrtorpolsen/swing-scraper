import { UnknownDataName } from "../interfaces/dataName.js";

export const unknownDataNames: UnknownDataName[] = [];

const synonyms: [string[], string][] = [
  [["Produktnummer"], "productNumber"],
  [["Produktlinje"], "productLine"],
  [["Produktkategori"], "productCategory"],
  [["Aldersgruppe", "Age Range", "Age group"], "ageGroup"],
  [["Antal brugere", "Number of users"], "numberOfUsers"],
  [["Inclusive"], "inclusive"],
  [["Længde", "Length"], "length"],
  [["Bredde", "Width"], "width"],
  [["Højde", "Height", "Total height"], "height"],
  [
    [
      "Længde af sikkerhedszone",
      "Safety Area Length",
      "Sikkerhedsområdets længde",
    ],
    "lengthOfSecurityZone",
  ],
  [
    [
      "Bredde af sikkerhedszone",
      "Safety Area Width",
      "Sikkerhedsområdets bredde",
    ],
    "widthOfSecurityZone",
  ],
  [
    ["Maks. Faldhøjde", "Fall Height", "Free fall height", "Faldhøjde"],
    "freeFallHeight",
  ],
  [
    ["Faldunderlag", "Safety Area", "Safety zone", "Sikkerhedsområde"],
    "safetyZoneM2",
  ],
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
): [string, boolean] {
  const normalized = lookupMap.get(dataName.toLowerCase());
  if (normalized) {
    return [normalized, true];
  } else {
    const logged = logUnkownDataName(dataName, source, url);
    return [logged, false];
  }
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
