# UI/UX Design System & Polish Guidelines (POS Warmindo)

Synthesized from:
- `ui-taste` (Uizze anti-slop playbooks & operational dashboards)
- `design-taste-frontend` (`tasteskill v2` — Achromatic Ledger commerce direction)
- `make-interfaces-feel-better` (Design engineering micro-principles)

---

## 1. Design Direction: Achromatic Ledger (Commerce / POS)

The interface is a high-speed transactional tool for fast cash registers and crisp financial dashboards.

- **Color Budget**: Under 1% colored pixels in the main chrome. The interface avoids arbitrary rainbow gradients, glowing blobs, and tinted cards.
- **Primary Ink & Surfaces**:
  - Ground: `#f8f8f8` (warm neutral off-white)
  - Surface / Cards: `#ffffff`
  - Raised Elements: `#eeeeee`
  - Borders: `#e6e6e6`
  - Rules: `#f0f0f0`
  - Main Ink: `#0a0a0a`
  - Muted Text: `#6b6b6b`
  - Accent / Key Data Series: `#1d5fbf` (used strictly on the primary metric/chart series)
  - Semantic Signals:
    - Positive / Lunas: `#2e7d32` (bg: `#dcfae5`, ink: `#04250e`)
    - Negative / Utang / Void: `#c4242a` (bg: `#ffedea`, ink: `#831c1e`)
    - Warning / Stok Rendah: `#92400e` (bg: `#fffbeb`, ink: `#92400e`)

---

## 2. Typography & Numerical Layout

- **Font Family**:
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;700&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
  ```
  Primary: `"Geist", Inter, system-ui, sans-serif`.
  Secondary (Keys, receipt IDs, hardware addresses): `"Geist Mono", monospace`.
- **Weights**: 400 (regular body), 500 (medium labels, table headers), 700 (currency totals only).
- **Tabular Figures**: Every price tag, subtotal, quantity stepper, and KPI metric **must** have:
  ```css
  font-variant-numeric: tabular-nums;
  ```
- **Text Wrapping**:
  - Headings: `text-wrap: balance;`
  - Descriptive notes / item descriptions: `text-wrap: pretty;`
- **Font Smoothing**: `-webkit-font-smoothing: antialiased;`

---

## 3. Surface & Geometry Engineering

1. **Concentric Border Radius**:
   $$\text{Outer Radius} = \text{Inner Radius} + \text{Padding}$$
   - Card radius: `8px` (`rounded-lg`)
   - Inner button/control radius with `4px` padding: `4px` to `6px`
   - Inputs / Controls height: `36px` to `44px`
2. **Shadows vs. Borders**:
   - Use crisp structural 1px borders (`border: 1px solid var(--border)`) for structural layout divisions.
   - Use subtle layered elevation shadows for dropdown menus and modal dialogs; zero ambient drop shadows on idle flat cards.
3. **Touch Targets**:
   - Cashier POS fast-order buttons: minimum `44px × 44px` touch hit area for mobile/tablets to prevent miss-clicks during peak hours.

---

## 4. Animation & Micro-Interactions

1. **Interruptible CSS Transitions**:
   Use CSS transitions (`ease-out`, ≤ 150ms) for hover and focus state changes rather than complex un-interruptible keyframes.
2. **Press Feedback (Scale on Press)**:
   For interactive POS action buttons (Add to Cart, Pay, Quick Cash amount buttons):
   ```css
   button:active {
     transform: scale(0.97);
     transition: transform 80ms ease-out;
   }
   ```
3. **Subtle Exits & Toasts**:
   - Notifications and toast messages exit gently with `translateY(-4px)` and fade out (`opacity: 0`), never jarringly collapsing height.
4. **Contextual Icon States**:
   - Use single-color inline SVGs with `currentColor`.
   - Outlined icons by default (`1.5px` - `1.75px` stroke); solid fill reserved strictly for active tab/selection.

---

## 5. POS Shell & Screen Layouts

1. **Cashier Fast-Order Shell**:
   - Left / Center: Interactive Menu Grid with quick categories (Mie Goreng, Mie Rebus, Minuman, Topping/Extra).
   - Right Rail: Current Order Ticket with live subtotal calculation, topping badges, instant quantity steppers, and large fast-pay buttons (Tunai Pas, 10k, 20k, 50k, 100k, QRIS).
2. **Owner Analytics Dashboard**:
   - Top: 3-4 peer KPI summary cards with tabular numbers (Omset Hari Ini, Total Transaksi, Rata-rata Keranjang, Produk Terlaris).
   - Center: Single crisp line chart (Geist tabular axis ticks, single ink line) displaying hourly/daily turnover.
   - Bottom: Best Seller ranking table with clean 44px rows and right-aligned numeric columns.
