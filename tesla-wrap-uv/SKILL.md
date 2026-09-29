---
name: tesla-wrap-uv
description: Create Tesla custom-wrap PNGs from the official UV templates for Model 3 or Model Y, preserving character artwork and applying the standard UV-to-3D panel directions automatically. Use when a user asks for a Tesla wrap, skin, UV texture, or Paint Shop custom design.
---

# Tesla 3D Wrap UV

Build a vehicle-ready texture, not merely a flat poster that looks correct in the UV atlas. Treat every invocation as a new job with no inherited vehicle, theme, artwork, output path, placement, or rotation settings.

## Required selection

Start by asking the user to make these choices, even if an earlier conversation or an old output appears to contain answers. Only values explicitly supplied in the current invocation count.

1. Choose **Model 3** or **Model Y**.
2. Resolve the exact year/generation and trim from the current folders in [Tesla's official custom-wraps repository](https://github.com/teslamotors/custom-wraps). Never infer the trim from “2025款” alone.
3. Choose the theme: upload existing artwork, point to a specific asset, or describe a new theme to generate. Ask for the desired subject, visual style, main colors, and whether the user wants hood/side/rear placement.

Do not silently reuse a character, theme, image, local file, directory, or transform from another run. Do not mention prior designs as defaults.

Typical official template families include `model3`, `model3-2024-base`, `model3-2024-performance`, `modely`, `modely-2025-base`, `modely-2025-premium`, `modely-2025-performance`, and `modely-l`. Recheck the repository because the list may change.

## Preserve the subject

- Treat supplied character art as the identity source. Preserve its face, proportions, colors, silhouette, shell/clothes/accessories, and expression.
- Use deterministic resize, mirror, rotate, position, and UV masking. Do not ask an image model to redraw the subject unless the user explicitly requests reinterpretation.
- Keep eyes, faces, and identifying features away from panel seams, windows, wheel arches, mirrors, and UV-island edges.
- Avoid text and directional logos by default; UV mirroring can make them unreadable.

## Decide whether the subject may repeat

Classify the main artwork before composing. Full-car coverage does not mean filling every UV island with duplicate characters.

- A compact circular avatar, cute head icon, badge, small abstract symbol, or artwork explicitly designed as a repeating tile may be repeated with consistent scale and spacing.
- A full-body character, irregular silhouette, scene, or other unique hero illustration is a single motif. Place at most one hero on each physical view: one on the front hood, one on the rear, one on the left side, and one on the right side. Multiple UV islands belonging to the same physical view still count as one view.
- Background textures and small supporting decorations may repeat without duplicating the hero subject.
- If the user wants a tiled look but provides only a full-body or irregular hero, do not silently tile it. Create a circular-avatar derivative only when the user explicitly asks for that transformation; otherwise use the one-per-view layout.
- When classification is ambiguous, default to the one-per-view hero layout without adding a calibration or approval step.

## Blend the subject into the wrap

The subject should feel printed into the same visual system as the surrounding pattern, not pasted onto a separate card.

- Do not add a solid white/cream rectangle, square card, hard frame, or isolated backing plaque behind a full-body or irregular hero unless the user explicitly requests that graphic treatment. A supplied circular avatar or badge may keep its intentional boundary.
- Place the transparent subject directly into the composition and build the transition from the wrap itself: use a palette-matched contour, irregular soft halo, splash shape, broken-edge pixels, halftone, brush texture, or nearby motifs that continue behind and around the subject.
- Match the transition to the background style. Pixel backgrounds use stepped or dithered pixel edges; water patterns use waves, bubbles, foam, and splashes; comic patterns use bursts or halftone. Do not solve every style with the same generic box.
- Let some small background motifs overlap the subject's outer silhouette to create depth, but keep the face and identifying features clear.
- Preserve subject identity while integrating it. Do not redraw, distort, or heavily stylize the face merely to match the background.
- When prompting a generated background or transition, include: `integrated edge transition, color-matched contour, surrounding motifs flow behind and around the subject`; include the negative constraint: `no hard rectangular frame, no solid backing card, no isolated sticker-on-box effect`.
- Inspect the result at panel scale. If the subject still reads as a pasted image inside a box, revise the transition before export.

## Orientation is a 3D requirement

Never decide orientation by asking whether the flat atlas “looks upright.” A graphic may need to look sideways or upside down in the PNG to appear upright on the 3D car.

Read and apply [references/orientation-matrix.md](references/orientation-matrix.md). Use the shared Tesla UV mapping by default:

- front hood: rotate 180°;
- rear panels: keep normal 0° direction;
- left side: rotate clockwise 90°;
- right side: rotate counterclockwise 90°.

Do not require the user to upload a calibration texture or return screenshots before producing the wrap. Generate the requested final designs directly. Calibration is an exception used only when the user reports an actual mismatch on a specific template or when a newly added official template has a materially different UV topology.

For character pairs on opposite sides, apply their side rotation independently. Mirroring is optional and aesthetic; it does not replace the required 90° rotations.

## Composition and export

- Use the selected official `template.png` alpha as the authoritative final mask.
- Compose per UV island; do not paint one unconstrained image across seams.
- Prefer 1024×1024 PNG with transparent pixels outside UV islands and keep the file below 1 MB. Use 512×512 only when necessary.
- Use a filename safe for Tesla import: ASCII letters, digits, `_` or `-`, ending in `.png`.
- The reusable deterministic compositor is [scripts/build_wrap.mjs](scripts/build_wrap.mjs). Give it a JSON config with the exact template, art/background paths, and calibrated layer transforms.
- Preserve earlier versions unless the user explicitly authorizes deletion.

## Acceptance report

Return:

- chosen vehicle/template folder;
- output file path, dimensions, size, and transparency check;
- rotation/mirroring matrix applied to hood, rear, left side, and right side;
- whether the standard mapping or an exception mapping was used.

Do not make 3D preview a prerequisite for delivery. If the user later reports a mismatch, correct that exact panel without changing the general defaults silently.
