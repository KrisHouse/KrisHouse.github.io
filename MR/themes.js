/* =========================================================================
   THE CHOSEN LAND — visual directions
   Three cartographic treatments of the same map + data. Each defines colours,
   a faction (bloc) palette, fonts and texture. The engine paints the map from
   these. Tweak any value to taste.
   ========================================================================= */

const THEMES = [
  {
    id: "atlas",
    name: "Old Atlas",
    blurb: "Muted hand-inked classic. Soft parchment, hairline coasts, faction colours as gentle washes.",
    font: "'Spectral', Georgia, serif",
    texture: "paper",
    vars: {
      sea: "#aebfc2", seaEdge: "#9aabae",
      border: "#6f5a3c", borderW: "0.8",
      ink: "#4a3a22", inkHalo: "rgba(248,242,225,0.85)",
      hover: "#7a6038", select: "#3c2d16",
      panel: "#efe6cf", panelInk: "#4a3a22"
    },
    blocColor: { concord:"#9fb4c2", pact:"#c69a92", compact:"#a0b8a3", hegemony:"#cdb487", unaligned:"#ddd2b6", church:"#b4a4c4", windsor:"#c8b080" },
    unrevealedColor: "#cec8b8",
    label: { transform:"none", spacing:"0.01em", weight:600, scale:1.0 }
  },
  {
    id: "survey",
    name: "Diplomatic Survey",
    blurb: "Clean modern cartography. Crisp white seas, confident flat faction colours, a tidy ledger legend.",
    font: "'Archivo', system-ui, sans-serif",
    texture: "none",
    vars: {
      sea: "#e8eef1", seaEdge: "#d4dee2",
      border: "#33414a", borderW: "1.1",
      ink: "#1f2a30", inkHalo: "rgba(255,255,255,0.9)",
      hover: "#11181d", select: "#0c1013",
      panel: "#ffffff", panelInk: "#1f2a30"
    },
    blocColor: { concord:"#4f7fa6", pact:"#b05c54", compact:"#4e8c6a", hegemony:"#c79a3e", unaligned:"#b7b0a0", church:"#7a5fa6", windsor:"#c47a30" },
    unrevealedColor: "#c8d0d4",
    label: { transform:"none", spacing:"0.005em", weight:600, scale:1.0 }
  },
  {
    id: "engraved",
    name: "Engraved Sepia",
    blurb: "Antique copperplate. Dark hatched sea, warm sepia lands, small-caps engraving and a ruled border.",
    font: "'IM Fell English SC', 'Spectral', serif",
    texture: "engrave",
    vars: {
      sea: "#241d13", seaEdge: "#3a2f1d",
      border: "#3c2c18", borderW: "0.9",
      ink: "#2c2012", inkHalo: "rgba(229,214,180,0.85)",
      hover: "#5a4322", select: "#241608",
      panel: "#e7d6b2", panelInk: "#2c2012"
    },
    blocColor: { concord:"#a7b196", pact:"#c69277", compact:"#9aa79f", hegemony:"#cbb079", unaligned:"#cab98f", church:"#9a8aaa", windsor:"#b89060" },
    unrevealedColor: "#4a3f2c",
    label: { transform:"uppercase", spacing:"0.06em", weight:400, scale:0.96 }
  }
];

window.THEMES = THEMES;
