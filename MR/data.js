/* =========================================================================
   THE CHOSEN LAND — world data
   Everything here is PLACEHOLDER lore. Edit freely: rename empires, rewrite
   blurbs, add/remove cities, reassign factions. The map reads from this file.
   - Each empire's `members` are the real-world countries it is built from
     (used only to draw its shape — players never see these names).
   - `bloc` must match one of the BLOCS ids below (drives faction colouring).
   ========================================================================= */

const BLOCS = [
  { id: "concord",  name: "The Western Concord",        short: "Concord",  note: "Maritime trade-republics & old crowns" },
  { id: "pact",     name: "The Imperial Pact",          short: "Pact",     note: "Central monarchies bound by treaty" },
  { id: "compact",  name: "The Northern Compact",        short: "Compact",  note: "Cold-water kingdoms of the north" },
  { id: "hegemony", name: "The Eastern Hegemony",        short: "Hegemony", note: "The expansionist powers of the east" },
  { id: "unaligned",name: "Unaligned States",            short: "Unaligned",note: "The contested middle — courted by all" },
  { id: "church",   name: "Church of Heavenly Father",   short: "Church",   note: "A sacred compact of faith before crown" },
  { id: "windsor",  name: "Windsor Family",              short: "Windsor",  note: "A dynastic league bound by blood and title" },
];

const EMPIRES = {
  "Iberia": {
    members: ["Portugal","Spain","Andorra"],
    bloc: "concord",
    seat: "?",
    capital: "?",
    cities: ["?"],
    blurb: "?"
  },
  "Franc": {
    members: ["France","Monaco"],
    bloc: "concord",
    seat: "Divided by the Churches",
    capital: "Palis",
    cities: ["Palis","Underground Catacombs"],
    blurb: "Franc has a long history of animosity with Windsor. The magical side of the country is divided by the major churches with no clear leadership."
  },
  "Erland": {
    members: ["Ireland"],
    bloc: "church",
    seat: "?",
    capital: "Dulin",
    cities: ["Dulin","?","?","?"],
    blurb: "Gained independence from Windsor after a turbulent period. The Church of Heavenly Father has a strong presence in the country."
  },
  "Windsor": {
    members: ["United Kingdom"],
    bloc: "windsor",
    seat: "Windsor Family",
    capital: "Londan",
    cities: ["Londan","Klofron","Enrod","?"],
    blurb: "A nation that has once ruled dominant. Though it appears to have undergone a shift from a monarchy to a constitutional monarchy, the royal family is still very much in power... until it isn't."
  },
  "Prussia": {
    members: ["Germany","Netherlands","Belgium","Luxembourg"],
    bloc: "pact",
    seat: "Führer",
    capital: "Berlo",
    cities: ["Berlo","?"],
    blurb: "A powerful nation that has united under the leadership of the Führer, both on the mundane, political side and the magical side."
  },
  "Ostarrichi": {
    members: ["Switzerland","Austria","Liechtenstein","Slovenia"],
    bloc: "pact",
    seat: "Prussia",
    capital: "Wien",
    cities: ["Wien","Church of Nature's headquarters"],
    blurb: "Also known as the Land of Music, the Green Kingdom, and the Nation of Forest. A country that has been claimed by Prussia before the world war breaks out. Where the headquarters of the Church of Nature are."
  },
  "Pollonia": {
    members: ["Poland"],
    bloc: "pact",
    seat: "?",
    capital: "?",
    cities: ["?","?"],
    blurb: "?"
  },
  "Czechoslovak": {
    members: ["Czechia","Slovakia"],
    bloc: "pact",
    seat: "?",
    capital: "?",
    cities: ["?","?"],
    blurb: "?"
  },
  "Pannonia": {
    members: ["Hungary","Romania","Moldova"],
    bloc: "pact",
    capital: "Arvágy",
    cities: ["Arvágy","Doru","Karpat","Sereth"],
    blurb: "Grain-rich plains ringed by mountains. Pannonia joined the Pact for protection and now wonders whether protection and ownership are the same thing.",
    unrevealed: true
  },
  "Sverige": {
    members: ["Norway","Sweden","Denmark","Finland","Iceland","Faeroe Is."],
    bloc: "compact",
    capital: "?",
    cities: ["?","?","?","?"],
    blurb: "?"
  },
  "Rus Federation": {
    members: ["Russia","Ukraine","Belarus","Estonia","Latvia","Lithuania"],
    bloc: "hegemony",
    seat: "?",
    capital: "Moskva",
    cities: ["Moskva","Church of Darkness's headquarters","?"],
    blurb: "A rising power. Where the Church of Darkness has a strong presence."
  },
  "Enoria": {
    members: ["Italy","San Marino","Vatican","Malta"],
    bloc: "unaligned",
    seat: "Papal State",
    capital: "?",
    cities: ["?","Papal State","?"],
    blurb: "Where the Church of Heavenly Father's influence is most concentrated."
  },
  "Illyrian Confederacy": {
    members: ["Croatia","Bosnia and Herz.","Serbia","Montenegro","Kosovo","Macedonia","Albania"],
    bloc: "unaligned",
    capital: "Spalato",
    cities: ["Spalato","Vrenj","Skar","Dukat"],
    blurb: "A patchwork of mountain peoples who agree on little but their independence. The powder-keg coast where every great war is rumoured to begin.",
    unrevealed: true
  },
  "Graeci": {
    members: ["Greece","Bulgaria","Cyprus","N. Cyprus"],
    bloc: "unaligned",
    seat: "?",
    capital: "?",
    cities: ["?","Church of Sun's headquarters","Church of Moonlight's headquarters","?"],
    blurb: "?"
  },
  "Anatolia": {
    members: ["Turkey"],
    bloc: "unaligned",
    capital: "Qonya",
    cities: ["Qonya","Adramyt","Trabezon","Halikar"],
    blurb: "The hinge between continents and the keeper of the warm-water gates. A sultanate in decline that everyone underestimates exactly once.",
    unrevealed: true
  },
};

window.WORLD = { BLOCS, EMPIRES, TITLE: "The Chosen Land" };
