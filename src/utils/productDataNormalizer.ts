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

export default function productDataNormalizer(dataName: string): string {
  return lookupMap.get(dataName.toLowerCase()) || dataName;
}

/*   
  ["Aldersgruppe", "Age group"],
  ["Antal brugere", "Number of users"],
  ["Brugergruppe"],
  ["Inclusive"],
  ["Produktkategori"],
  ["Produktlinje"],
  ["Produktnummer"],
  ["Længde", "Length"],
  ["Bredde", "Width"],
  ["Højde", "Total height"],
  ["Længde af sikkerhedszone", "Sikkerhedsområdets længde"],
  ["Bredde af sikkerhedszone", "Sikkerhedsområdets bredde"],
  ["Maks. faldhøjde", "Free fall height", "Faldhøjde"],
  ["Faldunderlag", "Safety zone", "Sikkerhedsområde"],
  ["Galvaniseret stål"],
  ["Aluminium platforme"],
  ["HPL sæde"],
  ["Kugleleje konstruktion"],
  ["Garanterede reservedele"],
  ["Forankringsmuligheder"],
  ["Samlingstid"],
  ["Nettovægt"],
  ["The height of the platforms"],
  ["tube slide platform height"],
  ["In accordance with norm EN"],
  ["Availability of spare parts"]
*/
/*   
  ["Aldersgruppe", "Age group"],
  ["Antal brugere", "Number of users"],
  ["Længde", "Length"],
  ["Bredde", "Width"],
  ["Højde", "Total height"],
  ["Længde af sikkerhedszone", "Sikkerhedsområdets længde"],
  ["Bredde af sikkerhedszone", "Sikkerhedsområdets bredde"],
  ["Maks. faldhøjde", "Free fall height", "Faldhøjde"],
  ["Faldunderlag", "Safety zone", "Sikkerhedsområde"],
*/
