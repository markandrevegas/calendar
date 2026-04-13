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
const daMonths = ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"]

const currentMonthName = computed(() => {
	const monthIndex = props.viewDate.getMonth()
	return props.format === "dk" ? daMonths[monthIndex] : props.viewDate.toLocaleString("en-US", { month: "long" })
})

const displayDay = computed(() => selectedDay.value ?? props.viewDate.getDate())
const displayDayLabel = computed(() => String(displayDay.value).padStart(2, "0"))
const displayDate = computed(() => new Date(props.viewDate.getFullYear(), props.viewDate.getMonth(), displayDay.value))

const currentWeekdayName = computed(() => {
	if (props.format === "dk") {
		const days = ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"]
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
		<div class="flex flex-1 items-start px-1">
			<div class="flex min-h-0 flex-1 items-start px-2 py-2">
				<div class="flex w-full flex-col">
					<span class="text-abyssal/80 text-xl leading-none font-semibold">
						{{ currentMonthName }}
					</span>
					<span class="block text-abyssal text-3xl tracking-tight font-semibold">{{ currentWeekdayName }}</span>
					<h1 class="text-abyssal w-full overflow-hidden text-8xl tracking-min leading-none font-medium whitespace-nowrap tabular-nums">
						{{ displayDayLabel }}
					</h1>
					<span class="hidden text-abyssal text-[clamp(6rem,7vw,8rem)] leading-none">{{ viewDate.getFullYear() }}</span>
				</div>
			</div>
		</div>

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
					class="relative flex h-full w-full items-center justify-center rounded-full transition-all duration-300 text-white tabular-nums"
					:class="{
						'bg-ember': selectedDay === day,
						'bg-abyssal': selectedDay !== day && getDayState(day) === 'past',
						'bg-abyssal/50': selectedDay !== day && getDayState(day) !== 'past'
					}"
				>
					<span v-if="hasEvent(day)" class="text-base leading-none text-white">*</span>
					<span v-else class="font-semibold">{{ day }}</span>
				</button>
			</div>
		</div>
	</div>
</template>
