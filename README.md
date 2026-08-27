# The Fourth Kind — Specialty Coffee

> **"Coffee is an odyssey across sensory dimensions — where terroir meets celestial precision in every brew."**

The Fourth Kind is a minimalist luxury specialty coffee e-commerce web experience inspired by celestial aesthetics and single-origin micro-lot coffees.

---

## ✨ Features

- **Cinematic Canvas Starfield Engine**: Hardware-accelerated dynamic particle system simulating celestial cosmic dust and gentle ambient stars.
- **Scroll-Triggered Celestial Reveals**: Staggered typography and element glide animations built with zero external dependencies.
- **Vanilla JS Slide-out Cart Drawer**:
  - Live item counter badge and price totals
  - Quantity controls (increment / decrement / remove)
  - `localStorage` persistence across page navigations
  - Dynamic multi-level directory depth resolution
- **Micro-Lot Single Origin Pages**:
  - **Aurora Protocol**: Ethiopian Yirgacheffe Highlands
  - **Event Horizon**: Brazilian Cerrado Mineiro & Sul de Minas
  - **Nebula Drift**: Colombian Huila Andes
- **Responsive & Lightweight**: Pure HTML5, modern CSS3 (Flexbox/CSS Grid), and ES6+ JavaScript. No bloated frameworks or runtime overhead.

---

## 📁 Project Structure

```
The Fourth kind/
├── assets/
│   ├── css/
│   │   ├── cart.css            # White-themed sliding cart drawer styling
│   │   ├── footer.css          # Global site footer layout
│   │   ├── reveal.css          # Celestial scroll reveal transitions
│   │   └── style.css           # Main landing page styles & hero stage
│   ├── js/
│   │   ├── cart.js             # Cart management and localStorage engine
│   │   ├── particles.js        # HTML5 Canvas cosmic starfield animation
│   │   └── reveal.js           # Scroll-triggered text and element animations
│   └── images/
│       ├── logo.png            # Brand mark
│       ├── Vector.png          # High-resolution vector emblem
│       ├── brazilian_origin.png
│       ├── colombian_origin.png
│       ├── ethiopian_origin.png
│       ├── origin_brazil.jpg
│       ├── origin_colombia.jpg
│       └── origin_ethiopia.jpg
├── contact/
│   └── index.html              # Clean inquiry and contact portal
├── shop/
│   ├── aurora-protocol/
│   │   └── index.html          # Ethiopian origin product showcase
│   ├── event-horizon/
│   │   └── index.html          # Brazilian origin product showcase
│   ├── nebula-drift/
│   │   └── index.html          # Colombian origin product showcase
│   └── index.html              # Catalog overview and product selection
├── .gitignore
├── README.md
├── server.js                   # Zero-dependency local development server
└── index.html                  # Main homepage
```

---

## 🚀 Getting Started

No build tools or bundlers are required!

1. **Clone the repository:**
   ```bash
   git clone https://github.com/M-Ahsan-siddique/TheFourthKindV2.git
   cd TheFourthKindV2
   ```

2. **Run locally:**
   Start the built-in zero-dependency server:
   ```bash
   node server.js
   ```
   *Or simply double-click `index.html` to open directly in your browser.*

3. **Visit in browser:**
   Open `http://localhost:3000`.

---

## ☕ Technologies

- **HTML5**: Semantic, accessible markup.
- **CSS3**: Modern variables, flexbox, CSS grid, and GPU-accelerated keyframe animations.
- **JavaScript (ES6+)**: Modular vanilla JS without libraries or frameworks.
- **Google Fonts**: Inter & Kumbh Sans typography.

---

## 📜 License

&copy; 2026 The Fourth Kind. All rights reserved.
