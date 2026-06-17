import { MotionPlugin } from "@vueuse/motion"

export default defineNuxtPlugin((nuxtApp) => {
	// console.log("motion plugin loaded")
	nuxtApp.vueApp.use(MotionPlugin)
})
