<script setup>
const props = defineProps({
	viewDate: { type: Date, default: () => new Date() },
	format: { type: String, default: "dk" },
	events: { type: Object, default: () => ({}) }
})
const emit = defineEmits(["select-date"])
const getInitialSelectedDay = () => {
	const today = new Date()
	const lastDayOfMonth = new Date(props.viewDate.getFullYear(), props.viewDate.getMonth() + 1, 0).getDate()
	return Math.min(today.getDate(), lastDayOfMonth)
}

const selectedDay = ref(getInitialSelectedDay())
const formatDateKey = (day) => `${day}.${props.viewDate.getMonth() + 1}.${props.viewDate.getFullYear()}`
const handleDateClick = (day) => {
	if (selectedDay.value !== day) {
		selectedDay.value = day
		return
	}

	selectedDay.value = day
	const eventData = {
		day,
		month: props.viewDate.getMonth() + 1,
		year: props.viewDate.getFullYear(),
		fullDate: new Date(props.viewDate.getFullYear(), props.viewDate.getMonth(), day)
	}
	emit("select-date", eventData)
}
const isDk = computed(() => props.format === "dk")
const daMonths = ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "sep", "okt", "nov", "dec"]

const currentMonthName = computed(() => {
	const monthIndex = props.viewDate.getMonth()
	return props.format === "dk" ? daMonths[monthIndex] : props.viewDate.toLocaleString("en-US", { month: "long" })
})

const displayDay = computed(() => selectedDay.value ?? props.viewDate.getDate())
const displayDayLabel = computed(() => String(displayDay.value).padStart(2, "0"))
const displayDate = computed(() => new Date(props.viewDate.getFullYear(), props.viewDate.getMonth(), displayDay.value))

const currentWeekdayName = computed(() => {
	if (props.format === "dk") {
		const days = ["søn", "man", "tir", "ons", "tor", "fre", "lør"]
		return days[displayDate.value.getDay()]
	}
	return displayDate.value.toLocaleString("en-US", { weekday: "short" })
})

// 1. Calculate how many days in the current month
const daysInMonth = computed(() => {
	return new Date(props.viewDate.getFullYear(), props.viewDate.getMonth() + 1, 0).getDate()
})

// 2. Start Offset (US = Sun first, DK = Mon first)
const startOffset = computed(() => {
	const firstDay = new Date(props.viewDate.getFullYear(), props.viewDate.getMonth(), 1).getDay()
	if (props.format === "dk") {
		return firstDay === 0 ? 6 : firstDay - 1
	}
	return firstDay
})

// 3. Weekday Labels based on format
const labels = computed(() => {
	if (props.format === "dk") {
		return ["M", "T", "O", "T", "F", "L", "S"]
	} else {
		return ["S", "M", "T", "W", "T", "F", "S"]
	}
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

watch(
	() => [props.viewDate.getMonth(), props.viewDate.getFullYear()],
	() => {
		selectedDay.value = getInitialSelectedDay()
	}
)
</script>

<template>
	<div class="flex h-full min-h-0 w-full flex-col select-none">
		<CalendarHeader :view-date="props.viewDate" :selected-day="selectedDay" :format="props.format" />

		<div class="mt-auto mb-3 grid grid-cols-7">
			<span v-for="(label, index) in labels" :key="`${format}-${index}`" class="text-abyssal/50 text-center text-sm font-bold"> {{ label }} </span>
		</div>

		<div class="grid grid-cols-7 gap-1">
			<div v-for="n in startOffset" :key="'empty-' + n" class="flex aspect-square items-center justify-center">
				<div class="bg-palladian h-2 w-2 rounded-full"></div>
			</div>

			<div v-for="day in daysInMonth" :key="day" class="flex aspect-square items-center justify-center">
				<button
					@click="handleDateClick(day)"
					class="relative flex h-full w-full items-center justify-center rounded-full text-white tabular-nums transition-all duration-300"
					:class="{
						'bg-ember': selectedDay === day,
						'bg-abyssal': selectedDay !== day && getDayState(day) === 'past',
						'bg-abyssal/50': selectedDay !== day && getDayState(day) !== 'past'
					}"
				>
					<span v-if="hasEvent(day)" class="text-base leading-none text-white">*</span>
					<span v-else class="hidden font-semibold">{{ day }}</span>
				</button>
			</div>
		</div>
	</div>
</template>
