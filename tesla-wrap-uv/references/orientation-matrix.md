# Standard Tesla UV orientation

All angles are clockwise rotations applied to an upright source image before it is placed in the flat UV atlas. `flop` means horizontal mirroring before rotation.

These are shared UV-to-3D orientation rules, not historical job data. Apply them automatically to Model 3 and Model Y official wrap templates unless a user reports a confirmed exception.

| Physical car area | Flat-atlas transform | Expected 3D result |
|---|---:|---|
| Front hood / front-facing top panel | 180° | upright when viewed on the front of the car |
| Rear / tail panels | 0° | normal source direction |
| Left side panels | 90° clockwise | head toward roof, feet toward ground |
| Right side panels | 90° counterclockwise, equivalent to 270° clockwise | head toward roof, feet toward ground |

The same direction applies to repeated characters, asymmetric icons, arrows, and text-like artwork on that physical area. A flat UV texture is expected to show the hood artwork upside down and side artwork lying sideways.

## Known official-template island mapping

For `modely-2025-base/template.png`:

- the large upper-centre trapezoid is the front hood and uses 180°;
- the topmost narrow horizontal strip is a front bumper/crash-beam island and also uses 180°;
- the body islands on the atlas left use 90° clockwise;
- the body islands on the atlas right use 90° counterclockwise.

Do not infer physical identity from which island is closest to the top edge of the PNG. In this template, both the topmost narrow strip and the large trapezoid below it belong to front-facing areas and require the same 180° direction. Rear/tail islands keep 0°.

## Mirroring

- Rotation fixes upright direction; mirroring controls which way a character faces along the car.
- Do not mirror readable text.
- For paired characters, mirror only when the composition benefits from both characters facing toward the front or toward each other.

## Simplified workflow

1. Resolve the exact official template.
2. Identify front hood, rear, left-side, and right-side islands from their physical groups.
3. Apply the standard transforms above.
4. Keep faces and identifying details away from seams and wheel arches.
5. Export the final designs directly; do not require a calibration upload.

## Exception handling

Only create a calibration texture after an actual reported mismatch or for an unfamiliar template whose island layout cannot be classified. The agent performs that diagnosis; the user should not be given an extra validation step by default.
