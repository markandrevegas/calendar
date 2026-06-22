<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount, watch } from "vue"

import EventForm from "@/components/ui/EventForm.vue"

const emit = defineEmits(["select-date", "save-event"])

const props = defineProps({
	viewDate: { type: Date, default: () => new Date() },
	format: { type: String, default: "dk" },
	events: { type: Object, default: () => ({}) },
	selectedDay: { type: Number, default: null },
	activeDay: Object
})

const selectedDay = ref(null)
const expandedDay = ref(null)
const isExpanded = ref(false)
const gridRef = ref(null)
const overlayStyle = ref({})
const cellRefs = ref({})
let collapseTimer = null

const transitionMs = 420

const setCellRef = (day, el) => {
	if (el) {
		cellRefs.value[day] = el
		return
	}

	delete cellRefs.value[day]
}

const clearCollapseTimer = () => {
	if (collapseTimer) {
		clearTimeout(collapseTimer)
		collapseTimer = null
	}
}

const getCellRect = (day) => {
	const gridEl = gridRef.value
	const cellEl = cellRefs.value[day]

	if (!gridEl || !cellEl) return null

	const gridRect = gridEl.getBoundingClientRect()
	const cellRect = cellEl.getBoundingClientRect()

	return {
		left: cellRect.left - gridRect.left,
		top: cellRect.top - gridRect.top,
		width: cellRect.width,
		height: cellRect.height
	}
}

const getGridRect = () => {
	const gridEl = gridRef.value
	if (!gridEl) return null

	const rect = gridEl.getBoundingClientRect()

	return {
		left: 0,
		top: 0,
		width: rect.width,
		height: rect.height
	}
}

const applyRect = (rect, borderRadius) => {
	if (!rect) return

	overlayStyle.value = {
		left: `${rect.left}px`,
		top: `${rect.top}px`,
		width: `${rect.width}px`,
		height: `${rect.height}px`,
		borderRadius,
		transitionDuration: `${transitionMs}ms`
	}
}

const syncOverlayToCell = (day) => {
	applyRect(getCellRect(day), "9999px")
}

const syncOverlayToGrid = () => {
	applyRect(getGridRect(), "0px")
}

const finishClose = () => {
	clearCollapseTimer()
	expandedDay.value = null
	isExpanded.value = false
	overlayStyle.value = {}
}

const openDay = async (day) => {
	clearCollapseTimer()
	expandedDay.value = day
	isExpanded.value = false
	syncOverlayToCell(day)

	await nextTick()

	requestAnimationFrame(() => {
		requestAnimationFrame(() => {
			isExpanded.value = true
			syncOverlayToGrid()
		})
	})
}

const closeExpandedDay = () => {
	if (!expandedDay.value) return

	const day = expandedDay.value
	isExpanded.value = false
	syncOverlayToCell(day)

	clearCollapseTimer()
	collapseTimer = window.setTimeout(() => {
		finishClose()
	}, transitionMs + 30)
}

const onDateClick = (day) => {
	emit("select-date", {
		day,
		month: props.viewDate.getMonth() + 1,
		year: props.viewDate.getFullYear()
	})

	if (expandedDay.value === day) {
		closeExpandedDay()
		return
	}

	if (selectedDay.value === day) {
		openDay(day)
		return
	}

	selectedDay.value = day
	if (expandedDay.value) {
		closeExpandedDay()
	}
}

const close = (e) => {
	e.stopPropagation()
	closeExpandedDay()
}

const handleFormSave = (payload) => {
	emit("save-event", payload)
	closeExpandedDay()
}

const formatDateKey = (day) => `${day}.${props.viewDate.getMonth() + 1}.${props.viewDate.getFullYear()}`

const daysInMonth = computed(() => {
	return new Date(props.viewDate.getFullYear(), props.viewDate.getMonth() + 1, 0).getDate()
})

const startOffset = computed(() => {
	const firstDay = new Date(props.viewDate.getFullYear(), props.viewDate.getMonth(), 1).getDay()
	if (props.format === "dk") {
		return firstDay === 0 ? 6 : firstDay - 1
	}
	return firstDay
})

const labels = computed(() => {
	return props.format === "dk" ? ["M", "T", "O", "T", "F", "L", "S"] : ["S", "M", "T", "W", "T", "F", "S"]
})

const endOffset = computed(() => {
	const currentCount = startOffset.value + daysInMonth.value
	return 42 - currentCount
})

const monthGridKey = computed(() => {
	return `${props.viewDate.getFullYear()}-${props.viewDate.getMonth()}-${props.format}`
})

const expandedEventData = computed(() => {
	if (!expandedDay.value) return {}

	return {
		day: expandedDay.value,
		month: props.viewDate.getMonth() + 1,
		year: props.viewDate.getFullYear()
	}
})

const expandedExistingEvents = computed(() => {
	if (!expandedDay.value) return []

	const dateKey = formatDateKey(expandedDay.value)
	return props.events?.[dateKey] || []
})

const getDayState = (day) => {
	const today = new Date()
	const currentDate = new Date(props.viewDate.getFullYear(), props.viewDate.getMonth(), day)
	const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())

	if (currentDate < todayDate) return "past"
	if (currentDate.getTime() === todayDate.getTime()) return "today"
	return "future"
}

const hasEvent = (day) => {
	const dateKey = formatDateKey(day)
	return Array.isArray(props.events?.[dateKey]) && props.events[dateKey].length > 0
}

const activeEmberDay = computed(() => {
	return selectedDay.value ?? props.selectedDay ?? new Date().getDate()
})

const cellState = (day) => {
	const state = getDayState(day)
	const isActive = activeEmberDay.value === day
	const isPast = state === "past"
	return { isActive, isPast }
}

const handleResize = () => {
	if (!expandedDay.value) return

	if (isExpanded.value) {
		syncOverlayToGrid()
		return
	}

	syncOverlayToCell(expandedDay.value)
}

onMounted(() => {
	window.addEventListener("resize", handleResize)
})

onBeforeUnmount(() => {
	window.removeEventListener("resize", handleResize)
	clearCollapseTimer()
})

watch(
	() => [props.viewDate.getMonth(), props.viewDate.getFullYear()],
	() => {
		finishClose()
		selectedDay.value = null
	}
)
</script>

<template>
	<div class="flex h-full min-h-0 w-full flex-col select-none">
		<div class="mt-auto mb-3 grid grid-cols-7 transition-opacity duration-300" :class="expandedDay ? 'pointer-events-none opacity-0' : 'opacity-100'">
			<span v-for="(label, index) in labels" :key="`${format}-${index}`" class="text-abyssal/50 text-center text-sm font-bold"> {{ label }} </span>
		</div>

		<div ref="gridRef" class="relative">
			<Transition name="grid-fade" mode="out-in">
				<div :key="monthGridKey" :class="['grid grid-cols-7 gap-1', { 'pointer-events-none': expandedDay }]">
					<div v-for="n in startOffset" :key="'start-' + n" class="flex aspect-square items-center justify-center">
						<div class="bg-palladian h-2 w-2 rounded-full opacity-30"></div>
					</div>

					<div v-for="day in daysInMonth" :key="day" class="flex aspect-square items-center justify-center">
						<div
							:ref="(el) => setCellRef(day, el)"
							class="relative h-full w-full cursor-pointer overflow-hidden rounded-full transition-opacity duration-200"
							:class="[
								{
									'pointer-events-none opacity-0': expandedDay === day,
									'bg-ember': cellState(day).isActive && expandedDay !== day,
									'bg-abyssal/20': !cellState(day).isActive && cellState(day).isPast && expandedDay !== day,
									'bg-abyssal': !cellState(day).isActive && !cellState(day).isPast && expandedDay !== day
								}
							]"
							@click="onDateClick(day)"
						>
							<span v-if="hasEvent(day)" class="absolute top-1 left-1/2 -translate-x-1/2 text-[10px] leading-none text-white">•</span>
							<span class="absolute inset-0 flex hidden items-center justify-center font-semibold text-white tabular-nums">{{ day }}</span>
						</div>
					</div>

					<div v-for="n in endOffset" :key="'end-' + n" class="flex aspect-square items-center justify-center">
						<div class="bg-palladian h-2 w-2 rounded-full opacity-30"></div>
					</div>
				</div>
			</Transition>

			<div v-if="expandedDay" class="pointer-events-auto absolute z-20 overflow-hidden rounded-t-xl shadow-xl transition-[top,left,width,height,border-radius] duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)]" :style="overlayStyle" @transitionend="!isExpanded ? finishClose() : null">
				<EventForm :is-open="Boolean(expandedDay)" :event-data="expandedEventData" :existing-events="expandedExistingEvents" :on-close="closeExpandedDay" class="h-full w-full" @save="handleFormSave" />
			</div>
		</div>
	</div>
</template>

<style scoped>
.grid-fade-enter-active,
.grid-fade-leave-active {
	transition: opacity 260ms ease;
}

.grid-fade-enter-from,
.grid-fade-leave-to {
	opacity: 0;
}

.grid-fade-enter-to,
.grid-fade-leave-from {
	opacity: 1;
}
</style>
