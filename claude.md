# claude.md

## Project Overview
Nuxt application using the `/app` directory structure.
Build artifacts are in `.nuxt`, `.output`, and `dist` (ignore these).

## Source of Truth
- All app code lives in `/app`
- Do not modify generated folders

## Coding Standards
- Use `<script setup lang="ts">`
- Prefer composables for reusable logic
- Keep components small and focused
- Use Tailwind for styling

## Architecture Rules
- No direct API calls inside components
- Use server routes or composables for data fetching
- Keep logic out of pages when possible

## File Structure
- app/components → UI components
- app/pages → routing
- app/composables → shared logic

## Do NOT
- Edit `.nuxt`, `.output`, or `dist`
- Introduce new state libraries without request
- Add global CSS frameworks

## When Adding Features
1. Check for existing composables
2. Reuse components
3. Follow existing patterns in `/app`

## Design Enforcement
- Follow design.md strictly
- Prefer removing UI over adding UI
- Do not introduce visual styles outside defined rules