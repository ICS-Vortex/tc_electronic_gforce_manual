import path from 'path';

/** VIRPIL Controls brand guide v1.1 — aligned with linktool/scripts/export-doc-pdf.mjs */
export const LINKTOOL_ROOT = 'c:\\Users\\Vortex\\Documents\\Development\\linktool';
export const OSWALD_DIR = path.join(
  LINKTOOL_ROOT,
  'node_modules',
  '@fontsource',
  'oswald',
  'files'
);
export const LOGO_PATH = path.join(LINKTOOL_ROOT, 'logo.png');

export const BRAND = {
  red: { r: 229 / 255, g: 0, b: 17 / 255 },
  black: { r: 0, g: 0, b: 0 },
  white: { r: 1, g: 1, b: 1 },
  darkGrey: { r: 46 / 255, g: 30 / 255, b: 34 / 255 },
  lightGrey: { r: 147 / 255, g: 149 / 255, b: 152 / 255 },
  lightestGrey: { r: 241 / 255, g: 241 / 255, b: 241 / 255 },
  rule: { r: 207 / 255, g: 207 / 255, b: 207 / 255 },
  darkBlue: { r: 59 / 255, g: 65 / 255, b: 115 / 255 },
};

export const PANEL_LABELS = new Set([
  'Recall', 'Quick Store', 'Editing', 'Store', 'Effects', 'Mix', 'Layout', 'Routing',
  'Audio', 'MIDI', 'Input/Output', 'The Letterbox', 'Delete',
  'POWER', 'IN/OUT KNOBS', 'CARD SLOT', 'BILLBOARD', 'METERS',
  'OVERALL BYPASS', 'TUNER', 'TEMPO', 'ARROW KEYS', 'THE PARAMETER WHEEL',
  'THE VALUE WHEEL', 'ENTER, EXIT', 'EFFECT BYPASS', 'NOISE GATE',
  'Compressor', 'Filters', 'The Source', 'The Input',
  'PARAMETRIC EQ', 'RESONANCE', 'WAH WAH', 'PHASER', 'TREMOLO / PAN',
  'INTELLIGENT PITCHER', 'STEREO DELAY', 'DUAL DELAY', 'REVERB', 'CHORUS/FLANGER',
  'FLANGER CLASSIC', 'QUAD TAP DELAY', 'Config.', 'Utility', 'Billboard',
]);

export function isPanelLabel(text) {
  const t = text.trim();
  if (PANEL_LABELS.has(t)) return true;
  if (t.length > 0 && t.length < 48 && t === t.toUpperCase() && /[A-Z]/.test(t) && !/[а-яіїєґ]/i.test(t)) {
    return true;
  }
  return false;
}

export const FOOTER_TITLE = 'TC ELECTRONIC G-FORCE — UA MANUAL';
