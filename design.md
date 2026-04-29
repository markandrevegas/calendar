# design.md

## Design Philosophy
Inspired by Dieter Rams (Braun):
- Minimal
- Functional
- Unobtrusive
- Intentional

## Core Principles

### 1. Less, but better
- Every UI element must have a clear purpose
- Remove anything decorative
- No redundant buttons or labels

### 2. Visual restraint
- Limited color palette (neutral + 1 accent max)
- No gradients, shadows, or heavy effects
- Use spacing instead of borders where possible

### 3. Typography-first
- Typography carries hierarchy, not color
- Max 2 font sizes per section
- Avoid bold overuse

### 4. Functional clarity
- Every action must be obvious
- No hidden interactions unless standard (e.g. swipe)

### 5. Consistency
- Same interaction patterns everywhere
- Reuse components aggressively

## UI Rules

### Layout
- Grid-based
- Generous whitespace
- Align everything

## Component Guidelines

### Buttons
- Text only or minimal outline
- No heavy backgrounds

### Cards
- Avoid unless necessary
- Prefer simple stacked layout

### Forms
- Minimal fields only
- Inline validation, no modals

### Colors
- Background: white or near-white
- Text: near-black
- Accent: single muted color

### Interaction
- Fast and immediate
- No unnecessary transitions
- Feedback must be subtle

## Anti-patterns
- No gradients
- No drop shadows
- No skeuomorphism
- No complex animations
- No visual clutter

## Definition of Done (Design)
A feature is complete when:
- It can be understood instantly
- Nothing can be removed without breaking it

## Tailwind Token Rules

- Only use token-based classes:
  - bg-base-*
  - text-base-*
  - border-base-*
  - p-{xs|sm|md|lg|xl}

- No arbitrary values:
  - ❌ p-[13px]
  - ❌ text-[#333]

- No visual effects:
  - ❌ shadow
  - ❌ gradients
  - ❌ large border radius