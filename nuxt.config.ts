// nuxt.config.ts
import { defineNuxtConfig } from "nuxt/config"
import tailwindcss from "@tailwindcss/vite"

export default defineNuxtConfig({
	future: {
		compatibilityVersion: 4
	},
	compatibilityDate: "2026-04-10",
	srcDir: "app/",

	vite: {
		optimizeDeps: {
			include: ["@vue/devtools-core", "@vue/devtools-kit"]
		},
		plugins: [tailwindcss()]
	},

	devtools: { enabled: true }
})
