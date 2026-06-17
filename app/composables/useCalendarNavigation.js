import { ref, computed, onMounted, onBeforeUnmount } from "vue"

export function useCalendarNavigation() {
	const currentViewDate = ref(new Date())
	const swipeDirection = ref("next")
	const isDesktop = ref(false)

	const DESKTOP_BREAKPOINT = 1024

	const shiftMonth = (offset) => {
		const nextDate = new Date(currentViewDate.value)
		nextDate.setMonth(nextDate.getMonth() + offset)
		currentViewDate.value = nextDate
	}

	const goToPreviousMonth = () => {
		swipeDirection.value = "prev"
		shiftMonth(-1)
	}

	const goToNextMonth = () => {
		swipeDirection.value = "next"
		shiftMonth(1)
	}

	const handleKeydown = (event) => {
		if (!isDesktop.value) return

		if (event.key === "ArrowLeft") goToPreviousMonth()
		if (event.key === "ArrowRight") goToNextMonth()
	}

	const updateViewportMode = () => {
		if (!import.meta.client) return
		isDesktop.value = window.innerWidth >= DESKTOP_BREAKPOINT
	}

	onMounted(() => {
		updateViewportMode()
		window.addEventListener("resize", updateViewportMode)
		window.addEventListener("keydown", handleKeydown)
	})

	onBeforeUnmount(() => {
		window.removeEventListener("resize", updateViewportMode)
		window.removeEventListener("keydown", handleKeydown)
	})

	const monthViewKey = computed(() => `${currentViewDate.value.getFullYear()}-${currentViewDate.value.getMonth()}`)

	const transitionName = computed(() => (swipeDirection.value === "next" ? "month-next" : "month-prev"))

	return {
		currentViewDate,
		swipeDirection,
		isDesktop,
		monthViewKey,
		transitionName,
		goToNextMonth,
		goToPreviousMonth
	}
}
