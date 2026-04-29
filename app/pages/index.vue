<script setup>
// State to store events by date: { "10.4.2026": [{ title: "Meeting", description: "..." }] }
const events = ref({})
// Helper to format the key
const formatDateKey = (day, month, year) => `${day}.${month}.${year}`
const currentViewDate = ref(new Date())
const gestureStartX = ref(0)
const isPointerActive = ref(false)
const swipeDirection = ref("next")
const isDesktop = ref(false)
const DESKTOP_BREAKPOINT = 1024

const monthViewKey = computed(() => `${currentViewDate.value.getFullYear()}-${currentViewDate.value.getMonth()}`)

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

const startGesture = (clientX) => {
	gestureStartX.value = clientX
	isPointerActive.value = true
}

const endGesture = (clientX) => {
	if (!isPointerActive.value) return

	isPointerActive.value = false
	const deltaX = clientX - gestureStartX.value

	if (Math.abs(deltaX) < 40) return

	if (deltaX < 0) {
		goToNextMonth()
		return
	}

	goToPreviousMonth()
}

const handleTouchStart = (event) => {
	if (isDesktop.value) return
	startGesture(event.changedTouches[0]?.clientX || 0)
}

const handleTouchEnd = (event) => {
	if (isDesktop.value) return
	endGesture(event.changedTouches[0]?.clientX || 0)
}

const handlePointerDown = (event) => {
	if (isDesktop.value) return
	if (event.pointerType === "mouse" && event.button !== 0) return
	startGesture(event.clientX)
}

const handlePointerUp = (event) => {
	if (isDesktop.value) return
	endGesture(event.clientX)
}

const handlePointerCancel = () => {
	isPointerActive.value = false
}

const handleKeydown = (event) => {
	if (!isDesktop.value) return

	if (event.key === "ArrowLeft") {
		event.preventDefault()
		goToPreviousMonth()
	}

	if (event.key === "ArrowRight") {
		event.preventDefault()
		goToNextMonth()
	}
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

const transitionName = computed(() => (swipeDirection.value === "next" ? "month-next" : "month-prev"))

const handleSaveEvent = (payload) => {
	const key = formatDateKey(payload.day, payload.month, payload.year)

	if (!events.value[key]) {
		events.value[key] = []
	}

	events.value[key].push({
		title: payload.title,
		description: payload.description,
		date: payload.date,
		displayDate: payload.displayDate
	})

	// Close modal after saving
	isModalOpen.value = false
}

const isModalOpen = ref(false)
const selectedDateData = ref({})
const openModal = (data) => {
	selectedDateData.value = data
	isModalOpen.value = true
}

const currentFormat = useCookie("calendar-format", {
	default: () => "dk",
	watch: true,
	maxAge: 60 * 60 * 24 * 36
})

// Lifted state logic
const getInitialSelectedDay = (date) => {
	const today = new Date()
	const isCurrentMonth = 
		date.getMonth() === today.getMonth() && 
		date.getFullYear() === today.getFullYear()

    if (isCurrentMonth) {
        return today.getDate()
    }
    return 1
}

const selectedDay = ref(getInitialSelectedDay(currentViewDate.value))

// Watch for month changes to reset selection
watch(currentViewDate, (newDate) => {
	selectedDay.value = getInitialSelectedDay(newDate)
})

const handleDateSelection = (data) => {
	// If it's a different day, just update the header highlight
	if (selectedDay.value !== data.day) {
		selectedDay.value = data.day
		return
	}
	// If clicking the same day again, open modal
	openModal(data)
}
</script>
<template>
	<div class="flex flex-1 h-full min-h-0 flex-col gap-6">
		<ClientOnly>
			<CalendarHeader :view-date="currentViewDate" :selected-day="selectedDay" :format="currentFormat" />
			<div class="relative min-h-0 flex-1 flex flex-col justify-between touch-pan-y overflow-hidden select-none" @touchstart.passive="handleTouchStart" @touchend.passive="handleTouchEnd" @pointerdown="handlePointerDown" @pointerup="handlePointerUp" @pointercancel="handlePointerCancel">
				<Transition :name="transitionName" mode="out-in">
					<CalendarGrid :key="monthViewKey" :format="currentFormat" :viewDate="currentViewDate" :events="events" class="min-h-0 flex-1" @select-date="openModal" />
				</Transition>
			</div>
			<EventModal :is-open="isModalOpen" :event-data="selectedDateData" :existing-events="events[formatDateKey(selectedDateData.day, selectedDateData.month, selectedDateData.year)] || []" @close="isModalOpen = false" @save="handleSaveEvent" />
			<template #fallback>
				<div class="bg-palladian/50 h-[300px] w-full animate-pulse rounded-3xl"></div>
			</template>
		</ClientOnly>
	</div>
</template>

<style scoped>
.month-next-enter-active,
.month-next-leave-active,
.month-prev-enter-active,
.month-prev-leave-active {
	transition:
		transform 0.28s ease,
		opacity 0.28s ease;
}

.month-next-enter-from,
.month-prev-leave-to {
	opacity: 0;
	transform: translateX(18%);
}

.month-next-leave-to,
.month-prev-enter-from {
	opacity: 0;
	transform: translateX(-18%);
}
</style>
