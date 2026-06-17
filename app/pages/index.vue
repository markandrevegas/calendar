<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue"

import { useCalendarNavigation } from "@/composables/useCalendarNavigation"
import { useCalendarSelection } from "@/composables/useCalendarSelection"
import { useEventStore } from "@/composables/useEventStore"

const { currentViewDate, transitionName, goToNextMonth, goToPreviousMonth } = useCalendarNavigation()

const { selected } = useCalendarSelection()

const { events, addEvent } = useEventStore()

const handleSelectDate = (payload) => {
	selected.value = payload
}

const handleSaveEvent = (payload) => {
	addEvent(payload)
}

const gestureStartX = ref(0)
const isPointerActive = ref(false)
const swipeDirection = ref("next")
const isDesktop = ref(false)
const DESKTOP_BREAKPOINT = 1024

const containerEl = ref(null)

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

const updateViewportMode = () => {
	if (!import.meta.client) return
	isDesktop.value = window.innerWidth >= DESKTOP_BREAKPOINT
}

onMounted(() => {
	updateViewportMode()
	window.addEventListener("resize", updateViewportMode)
})

onBeforeUnmount(() => {
	window.removeEventListener("resize", updateViewportMode)
})

const currentFormat = useCookie("calendar-format", {
	default: () => "dk",
	watch: true,
	maxAge: 60 * 60 * 24 * 36
})
</script>
<template>
	<div class="relative flex h-full min-h-0 flex-1 flex-col">
		<CalendarHeader :view-date="currentViewDate" :selected-date="selected" :format="currentFormat" />
		<ClientOnly>
			<div class="relative flex h-full min-h-0 w-full flex-1 touch-pan-y flex-col overflow-hidden select-none" @touchstart.passive="handleTouchStart" @touchend.passive="handleTouchEnd" @pointerdown="handlePointerDown" @pointerup="handlePointerUp" @pointercancel="handlePointerCancel" ref="containerEl">
				<Transition :name="transitionName" mode="out-in">
					<CalendarGrid :active-day="selected" :format="currentFormat" :viewDate="currentViewDate" :events="events" @select-date="handleSelectDate" @save-event="handleSaveEvent" />
				</Transition>
			</div>

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
