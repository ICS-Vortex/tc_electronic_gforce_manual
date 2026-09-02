# tc_electronic_gforce_manual

Ukrainian user manual for the **TC Electronic G-Force** guitar effects processor.  
The PDF is built from Markdown using the same branded export pipeline as [VIRPIL Controls LinkTool](https://github.com/ICS-Vortex/linktool) (Puppeteer + VIRPIL brand CSS).

English menu names, button labels, parameter names, and preset names stay in English in the translated text.

---

## Prerequisites

| Requirement | Notes |
|-------------|--------|
| **Node.js** 18+ | For scripts and `npm install` |
| **LinkTool repo** | Clone [linktool](https://github.com/ICS-Vortex/linktool) locally. `export-gforce-pdf.mjs` loads `marked`, `puppeteer-core`, Oswald fonts, and the VIRPIL logo from LinkTool `node_modules`. |
| **Chromium browser** | Microsoft Edge or Google Chrome (used by Puppeteer for PDF export) |
| **Original manual PDF** | Place at `source/tc_electronic_g_force.PDF` |

### LinkTool path

`export-gforce-pdf.mjs` expects LinkTool at:

```
C:\Users\Vortex\Documents\Development\linktool
```

If your path differs, edit `linktoolRoot` at the top of `export-gforce-pdf.mjs` and run `npm install` inside LinkTool once:

```powershell
cd path\to\linktool
npm install
```

---

## Project structure

```
tc_electronic_g_force/
├── source/
│   └── tc_electronic_g_force.PDF      # Original English manual (input)
├── manuals/
│   ├── GForce.ua.part1.md           # Generated MD: safety + intro (part 1)
│   └── GForce.ua.part2.md           # Generated MD: main content (part 2)
├── out/                               # Build intermediates (gitignored)
│   ├── part1.pdf                      # Branded PDF: cover + TOC
│   ├── part2.pdf                      # Branded PDF: body sections
│   └── orig-*.pdf                     # Extracted original pages for merge
├── tc_electronic_g_force_UA.pdf       # Final output manual
├── translations.mjs                   # Combined page translations (generated)
├── pages_3_32_complete.mjs            # Translation fragments (edit these)
├── pages_33_52.mjs
├── pages_53_63_fragment.mjs
├── page_*.txt                         # Raw extracted English text (reference)
├── combine.mjs                        # Merges fragments → translations.mjs
├── generate-md.mjs                    # translations → Markdown
├── export-gforce-pdf.mjs              # Markdown → branded PDF (Puppeteer)
├── build_pdf.mjs                      # Full pipeline + merge with original pages
├── format_text.mjs                    # Text structuring (headings, lists)
├── manual-sections.mjs                # Section titles and page ranges
├── brand.mjs                          # Panel labels / brand helpers
└── package.json
```

---

## Quick start (full build)

```powershell
cd C:\Users\Vortex\Downloads\tc_electronic_g_force
npm install
npm run build
```

Output: `tc_electronic_g_force_UA.pdf` in the project root.

---

## npm scripts

| Script | Command | What it does |
|--------|---------|----------------|
| **build** | `npm run build` | Full pipeline: MD generation → PDF export → merge |
| **pdf** | `npm run pdf` | Same as `build` |
| **md** | `npm run md` | Regenerate `manuals/GForce.ua.part1.md` and `part2.md` from translations |
| **combine** | `npm run combine` | Merge `pages_*.mjs` fragments into `translations.mjs` |

### Step-by-step

```powershell
npm run combine   # 1. Build translations.mjs from page fragments
npm run md        # 2. Generate Markdown from translations
npm run pdf       # 3. Export PDFs and merge into final manual
```

---

## Build pipeline

```
pages_*.mjs  ──combine.mjs──►  translations.mjs
                                    │
                            generate-md.mjs
                                    │
                    manuals/GForce.ua.part1.md
                    manuals/GForce.ua.part2.md
                                    │
                         export-gforce-pdf.mjs (×2)
                                    │
                    out/part1.pdf  out/part2.pdf
                                    │
              source PDF pages 1, 2, 6 (original)
                                    │
                              build_pdf.mjs
                                    │
                    tc_electronic_g_force_UA.pdf
```

### Final PDF page order

1. Original page 1 (device photo)
2. Original page 2
3. **Part 1** — branded Ukrainian content (safety, compliance, table of contents)
4. Original page 6 (panel illustration)
5. **Part 2** — branded Ukrainian content (rest of the manual)

---

## Editing content

### Option A — Edit translation fragments (recommended for bulk updates)

1. Edit strings in `pages_3_32_complete.mjs`, `pages_33_52.mjs`, or `pages_53_63_fragment.mjs`.
2. Run:

```powershell
npm run combine
npm run md
npm run build
```

### Option B — Edit Markdown directly

1. Edit `manuals/GForce.ua.part1.md` or `manuals/GForce.ua.part2.md`.
2. Run `npm run pdf` (skips `generate-md.mjs` if you only changed MD).

To regenerate MD from translations after fragment edits, run `npm run md` first.

### Section layout

Section titles and source page ranges are defined in `manual-sections.mjs`.  
Adjust `PART1_SECTIONS` / `PART2_SECTIONS` if you reorganize content.

### UI terms in Markdown

`generate-md.mjs` wraps English UI names in backticks (e.g. `Recall`, `Enter`, `Parameter wheel`) so they render correctly in the branded PDF.

---

## Manual export details

`export-gforce-pdf.mjs` is adapted from LinkTool `scripts/export-doc-pdf.mjs`:

- VIRPIL Controls branding (logo, red section bands, typography)
- **Segoe UI** for body text, **Oswald** for headings
- Part 1: cover page + table of contents
- Part 2: `--content-only` (sections only, no duplicate cover)

Standalone export (without merge):

```powershell
node export-gforce-pdf.mjs manuals\GForce.ua.part1.md out\part1.pdf "TC Electronic G-Force"
node export-gforce-pdf.mjs manuals\GForce.ua.part2.md out\part2.pdf "TC Electronic G-Force" --content-only
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `Missing source PDF` | Copy the original manual to `source/tc_electronic_g_force.PDF` |
| `No supported Chromium browser` | Install Microsoft Edge or Google Chrome |
| Puppeteer / `marked` errors | Run `npm install` in the LinkTool repo; check `linktoolRoot` in `export-gforce-pdf.mjs` |
| Garbled symbols in PDF | Do not use pdf-lib-only text rendering for body copy; use this Markdown + Puppeteer pipeline |
| `node_modules` committed | `.gitignore` must be UTF-8 (not UTF-16). Patterns: `node_modules/`, `out/` |

---

## License / attribution

- Original manual: TC Electronic G-Force
- PDF branding assets and export tooling: VIRPIL Controls LinkTool workflow
- Ukrainian translation: maintained in this repository