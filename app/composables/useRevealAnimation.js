import { ref, computed, watch } from "vue"

export function useRevealAnimation(isOpen, origin) {
	const isAnimating = ref(false)

	watch(isOpen, (open) => {
		if (!open) {
			isAnimating.value = false
			return
		}

		requestAnimationFrame(() => {
			isAnimating.value = true
		})
	})

	const circleStyle = computed(() => ({
		left: `${origin.value.x}px`,
		top: `${origin.value.y}px`,
		width: "24px",
		height: "24px",
		transform: isAnimating.value ? "translate(-50%, -50%) scale(120)" : "translate(-50%, -50%) scale(0)",
		transition: "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)"
	}))

	return {
		isAnimating,
		circleStyle
	}
}
