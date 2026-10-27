# DESIGN.md — POS Warmindo & Warkop Design System

**Archetype**: Achromatic Ledger (Commerce & SMB Point-of-Sales)  
**Target Platforms**: Web (POS Register & Owner Portal), Android Tablet/Handheld, Mobile

---

## 1. Color Palette & Tokens

The interface prioritizes extreme data clarity and speed. Main chrome contains no decorative color; color is strictly reserved for data state indicators and key metrics (under 1% color pixels).

```css
:root {
  /* Surfaces & Canvas */
  --ground: #f8f8f8;            /* Neutral off-white canvas */
  --surface: #ffffff;           /* Card and panel background */
  --raised: #eeeeee;            /* Hover and elevated states */
  --border: #e6e6e6;            /* Structural hairline borders */
  --rule: #f0f0f0;              /* Table and section dividers */
  --control: #d4d4d4;           /* Input outlines and idle controls */

  /* Typography / Ink */
  --text: #0a0a0a;              /* Primary text & money figures */
  --muted: #6b6b6b;             /* Secondary captions & meta labels */
  --accent: #141414;            /* Primary button fill (near-black) */

  /* Highlight & Data Series */
  --chart-primary: #1d5fbf;     /* Key series line & active chart point */
  --chart-grid: #e6e6e6;        /* Subtle 1px gridlines */

  /* Status Indicators */
  --positive: #2e7d32;          /* Paid, Success, Kembalian */
  --positive-bg: #dcfae5;
  --negative: #c4242a;          /* Void, Cancelled, Debt */
  --negative-bg: #ffedea;
  --warning: #92400e;           /* Low stock, Paper out */
  --warning-bg: #fffbeb;

  /* Sizing & Geometry */
  --radius-card: 8px;           /* Outer card radius */
  --radius-control: 6px;        /* Inner button / input radius */
  --touch-target-min: 44px;     /* Minimum touch dimension for POS */
  --gap: 12px;
  --pad: 20px;
}
```

---

## 2. Typography

- **Font Family**:
  - Primary UI & Numbers: `"Geist", Inter, -apple-system, sans-serif`
  - Monospace (Receipt IDs, ESC/POS byte previews, hardware MAC): `"Geist Mono", monospace`
- **Scale**:
  - `fs-title`: 24px / 600
  - `fs-section`: 16px / 600
  - `fs-kpi`: 30px / 700 (tabular numbers)
  - `fs-body`: 14px / 400
  - `fs-small`: 12px / 500
- **Rules**:
  - Every currency figure, subtotal, quantity stepper, and clock **must** use `font-variant-numeric: tabular-nums`.
  - Heading titles use `text-wrap: balance`.

---

## 3. UI Geometry & Component Rules

1. **Concentric Radii**: Outer surface `8px`, nested element `4px` - `6px` with `8px` - `12px` padding.
2. **Borders for Structure, Shadows for Elevation**:
   - Flat 1px borders (`#e6e6e6`) divide columns and panels.
   - Drop shadows are only used on modal dialogs and dropdown menus (`0 10px 25px -5px rgba(0,0,0,0.08)`).
3. **Buttons**:
   - Primary: Solid `#141414` fill, `#ffffff` text, `border-radius: 6px`.
   - Secondary: `#eeeeee` fill, `#0a0a0a` text.
   - Outlined: `1px solid #e6e6e6` border, transparent background.
   - Active state feedback: `scale(0.97)` on click/tap.
