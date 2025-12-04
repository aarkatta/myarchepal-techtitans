# Responsive Design Guidelines

This document outlines the responsive behavior strategies for the Archaeology Dashboard application. These rules apply to layout, typography, and component states across different viewports.

## 1. Breakpoints
We utilize a mobile-first approach. Default styles apply to mobile, with overrides for larger screens using min-width media queries.

| Device Category | Breakpoint (min-width) | Token         |
|-----------------|------------------------|---------------|
| Mobile (Default)| 0px                    | `base`        |
| Tablet          | 768px                  | `md`          |
| Desktop         | 1024px                 | `lg`          |
| Wide Desktop    | 1440px                 | `xl`          |

## 2. Global Layout Specs

### Container Widths
To prevent content from stretching on ultra-wide monitors, use a centered container with a maximum width.
* **Mobile/Tablet:** 100% width with `1rem` (16px) horizontal padding.
* **Desktop (`lg`):** Max-width `1200px`, centered.
* **Wide (`xl`):** Max-width `1400px`, centered.

### Main Grid System
The dashboard uses a CSS Grid layout for the main content area (Site Cards).
* **Mobile:** 1 column (1fr).
* **Tablet (`md`):** 2 columns (1fr 1fr).
* **Desktop (`lg`):** 3 columns (repeat(3, 1fr)).
* **Wide (`xl`):** 4 columns (repeat(4, 1fr)).

## 3. Component Behaviors

### A. Stats Overview (Top Cards)
* **Mobile:** Flex-direction `column` (stacked vertical).
    * *Spacing:* `1rem` gap between cards.
* **Tablet/Desktop:** Flex-direction `row` (horizontal).
    * *Spacing:* `1.5rem` gap.
    * *Sizing:* Each card takes equal width (`flex: 1`).

### B. Navigation / Sidebar
* **Mobile/Tablet (< 1024px):**
    * Sidebar is **hidden** by default.
    * Hamburger menu triggers a slide-out drawer or modal navigation.
* **Desktop (>= 1024px):**
    * Sidebar is **fixed/sticky** on the left.
    * Main content has `margin-left` equal to sidebar width (approx `250px`).

### C. Site Cards (Individual Items)
* **Image Aspect Ratio:**
    * **Mobile:** `16:9` (landscape) to save vertical space.
    * **Desktop:** `4:3` or `1:1` depending on image focus, ensuring consistency across the grid.
* **Actions:**
    * **Mobile:** "Edit/View" buttons stretch full width for easier touch targets.
    * **Desktop:** Buttons align right or use icon-only triggers to save space.

## 4. Typography & Spacing

### Font Scaling
Use fluid typography or specific steps for headings to maximize screen real estate.
* **H1 (Page Title):**
    * Mobile: `1.5rem` (24px)
    * Desktop: `2rem` (32px)
* **H2/Card Titles:**
    * Mobile: `1.25rem` (20px)
    * Desktop: `1.5rem` (24px)

### Touch Targets
* On touch devices (`base` to `md`), all interactive elements (buttons, inputs, list items) must have a minimum height/width of **44px**.
* Spacing between clickable elements should be at least `8px`.

## 5. CSS Implementation Reference (Tailwind Example)
* **Grid:** `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`
* **Stats:** `flex flex-col md:flex-row gap-4`
* **Container:** `px-4 mx-auto max-w-7xl`