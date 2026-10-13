# PSQ-APP-V2.8R2A — PREVIEW STANDARD LOCK

Status: **LOCKED**  
Scope: Paper Squishy Factory · 60 current characters + future expansions  
Applies to: app previews, thumbnails and visual QA  
Does **not** modify printable A4 masters.

## 1. Core rule: PREVIEW and PRINT are different layers

Every character keeps its original print assets for download/printing. The app must never use a cropped preview as the print source.

Required print assets:
- `front_print`
- `back_print`
- `coloring`
- `coloring_back`

Required preview assets:
1. `hero`
2. `front_print`
3. `back_print`
4. `coloring`
5. `coloring_back`
6. `editor_asset`
7. `character_card`
8. `tutorial`
9. `mockup`

The viewer always exposes **9/9 views**. No fallback to the old 8-view model is accepted.

## 2. Master preview canvas

All nine preview images must use one common visual canvas:

- Canvas: **1600 × 1600 px**
- Color space: **sRGB**
- Format: **WebP**
- Quality target: **90–92**
- Preferred file size: **≤ 900 KB**
- Hard file-size ceiling: **1.2 MB**
- Background: `#FFF9F1` for color art/editorial previews; pure white allowed for line-art coloring previews
- Safe margin: **120 px** minimum on every side
- No transparent edges that affect perceived scaling

## 3. Shared visual occupancy

The subject must be centered optically, not only mathematically.

### Hero / Editor / Mockup
- Target subject occupancy: **76%** of the usable width/height
- Allowed range: **72–80%**
- Center drift from canvas center: max **24 px** per axis

### Front / Back pair
- Target max-dimension occupancy: **78%**
- Use **one shared scale factor** for the pair
- Front/back max-dimension difference after normalization: **≤ 3%**
- Center offset difference: **≤ 20 px**
- Both must include the complete cut/bridge geometry when that geometry belongs to the printable design

### Coloring front / Coloring back pair
- Target max-dimension occupancy: **78%**
- Use **one shared scale factor** for the pair
- Size difference between front and back: **≤ 2.5%**
- Center offset difference: **≤ 16 px**
- Line weight must be visually consistent across the pair
- Cutline style and spacing must match

This is a hard QA rule: a coloring front and coloring back pair cannot pass if one appears visibly larger or smaller than the other.

## 4. Front/back geometry rule

The physical assembly rule remains authoritative:

- The back is a **true rear view**, not a duplicated front.
- The rear artwork must be mapped to the same physical silhouette system as the front.
- When the print geometry requires it, the back asset is horizontally mirrored **at asset-generation time** so that front and back align physically after assembly.
- The app preview displays the stored back asset exactly as authored.
- The viewer must **never mirror the back again**.

## 5. Cutline / bridge standard

Print masters:
- Bridge/cutline offset: **2–3 mm** from the art boundary where applicable
- Dotted cutline must be clean, continuous and non-self-intersecting
- No accidental secondary contour outside the intended cut path
- Front and back cut geometry must correspond physically

Preview images:
- Preserve the visible cut/bridge geometry when the purpose of the view is printable front/back/coloring
- Do not add extra decorative outlines that alter the perceived scale

## 6. Character card standard

`character_card.webp` is an app card, not a miniature A4 page.

- Canvas: 1600 × 1600
- Main character image area: approx. **58–64%** of canvas height
- Title and collection label remain legible at desktop and mobile sizes
- Character art must occupy at least **60%** of the available card width
- Avoid large empty lower areas
- Card content must remain visually centered inside the square preview

## 7. Tutorial standard — benchmark locked to the stronger legacy layout

The tutorial must follow the stronger visual language of the earlier high-quality tutorials (e.g. the Donita-style composition), not a long sparse A4 page.

Required structure:
- Top title: **“Cómo armar a [Personaje]”**
- Character / product hero in the upper composition
- Front and back pieces clearly visible and large enough to compare
- Five-step visual sequence:
  1. **Imprimí**
  2. **Recortá**
  3. **Pegá**
  4. **Rellená**
  5. **Cerrá**
- Each step should include an icon or mini visual, not text only
- Minimum tutorial text size in the 1600 px master: **34 px**
- Step labels: **≥ 30 px**
- No full-page A4 screenshot inside the tutorial preview
- No large unused blank region

## 8. Thumbnail standard

All thumbnail cards use the preview assets, never the A4 originals.

- Thumbnail viewport: square
- `object-fit: contain`
- Same internal padding for all nine views
- No per-character crop hacks
- Active state border must not change image scale

## 9. Viewer standard

- Exactly **9 views** per character
- Counter: `1 / 9` through `9 / 9`
- Same stage dimensions for every character
- Preview image remains centered and visually dominant
- Desktop target displayed artwork size: approx. **600–760 px** on the longest side where viewport allows
- Mobile target: **80–90%** of available media width without clipping
- Viewer arrows must not overlap artwork
- Print button only appears on printable views
- Print action always points to original print assets, never preview assets

## 10. QA tolerances

A character fails QA if any of these conditions occur:

- Missing any of the 9 previews
- Coloring front/back size mismatch > 2.5%
- Front/back size mismatch > 3%
- Subject clipped or touching safe margin
- Subject visibly off-center
- Back accidentally shows front-facing art
- Viewer mirrors the back a second time
- Tutorial uses a sparse full-page A4 screenshot instead of the tutorial composition
- Thumbnail uses a different crop/scale logic from the main preview
- Print button resolves to a preview asset

## 11. Benchmark and rollout rule

Mimi Medusa is the active pilot for this standard. Mimi is not considered MASTER until all nine views pass this spec.

After Mimi passes:
- Freeze Mimi as **MASTER PREVIEW APPROVED**
- Generate all remaining characters from the same spec
- Run automated pair-size checks on Front/Back and Coloring Front/Back
- Run manual visual spot-check on each collection
- Only then publish the 60-character rollout

## 12. Naming and storage

Preview path convention:

`v2.8/previews/<collection_slug>/<character_slug>/<asset_key>.webp`

Print assets remain in their existing authoritative print locations.

## 13. Freeze policy

This standard is now the only accepted preview standard for Paper Squishy Factory V2.8 and later unless explicitly superseded by a numbered revision.

Any future change must increment the standard version and document the changed tolerance or layout rule.