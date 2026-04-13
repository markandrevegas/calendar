// nuxt.config.ts
import { defineNuxtConfig } from "nuxt/config"
import tailwindcss from "@tailwindcss/vite"

export default defineNuxtConfig({
	future: {
		compatibilityVersion: 4
	},
	compatibilityDate: "2026-04-10",
	app: {
		baseURL: process.env.NUXT_APP_BASE_URL || "/"
	},
	srcDir: "app/",
	components: [
		{
			path: "~/components",
			pathPrefix: false
		}
	],
	vite: {
		build: {
      sourcemap: false, 
    },
		css: {
      devSourcemap: false
    },
    plugins: [
      tailwindcss()
    ],
    optimizeDeps: {
      include: ["@vue/devtools-core", "@vue/devtools-kit"]
    }
  },
	postcss: {
    plugins: {
      autoprefixer: {},
    },
  },
	devtools: { enabled: true }
})
