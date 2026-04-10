# Nuxt 4 + Tailwind CSS 4 Starter

## Project Structure
This project uses the **Nuxt 4 directory structure**. All source files are located in the `app/` folder:
- `app/assets/css/main.css` (Tailwind & Global Styles)
- `app/components/`
- `app/pages/`
- `app/app.vue` (Main Entry)

## Tailwind CSS 4 Usage
Tailwind 4 is integrated via the `@tailwindcss/vite` plugin. 

### Configuration
There is **no tailwind.config.js**. To customize your theme, use the `@theme` block in `app/assets/css/main.css`:

```css
@theme {
  --color-primary: #3b82f6;
}