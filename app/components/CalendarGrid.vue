<script setup>
const props = defineProps({
	viewDate: { type: Date, default: () => new Date() },
	format: { type: String, default: "dk" }
})

const isDk = computed(() => props.format === "dk")
const daMonths = ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"]

const currentMonthName = computed(() => {
	const monthIndex = props.viewDate.getMonth()
	return props.format === "dk" ? daMonths[monthIndex] : props.viewDate.toLocaleString("en-US", { month: "long" })
})

const currentWeekdayName = computed(() => {
	if (props.format === "dk") {
		// Custom mapping or native:
		const days = ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"]
		return days[props.viewDate.getDay()]
	}
	return props.viewDate.toLocaleString("en-US", { weekday: "short" })
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
	const isThisMonth = props.viewDate.getMonth() === today.getMonth() && props.viewDate.getFullYear() === today.getFullYear()
	if (!isThisMonth) return "future"
	if (day < today.getDate()) return "past"
	if (day === today.getDate()) return "today"
	return "future"
}
</script>

<template>
	<div class="w-full select-none">
		<div class="mb-10 px-2">
			<div class="flex flex-col items-baseline">
				<h1 class="tracking-min text-abyssal text-7xl font-bold">{{ viewDate.getDate() }}</h1>
				<div class="mb-2 flex w-full justify-between">
					<span class="text-abyssal text-5xl font-semibold tracking-tight">
						{{ currentMonthName }}
					</span>
					<div class="text-muted2 ml-auto self-end text-xl font-medium uppercase">
						{{ currentWeekdayName }}
					</div>
				</div>
				<span class="text-abyssal text-lg">{{ viewDate.getFullYear() }}</span>
			</div>
		</div>

		<div class="mb-4 grid grid-cols-7">
			<span v-for="(label, index) in labels" :key="`${format}-${index}`" class="text-abyssal/50 text-center text-sm font-bold"> {{ label }} </span>
		</div>

		<div class="grid grid-cols-7 gap-1">
			<div v-for="n in startOffset" :key="'empty-' + n" class="flex aspect-square items-center justify-center">
				<div class="bg-palladian h-2 w-2 rounded-full"></div>
			</div>

			<div v-for="day in daysInMonth" :key="day" class="flex aspect-square items-center justify-center">
				<div
					class="h-full w-full rounded-full transition-all duration-300"
					:class="{
						'bg-abyssal': getDayState(day) === 'past',
						'bg-ember': getDayState(day) === 'today',
						'bg-abyssal/50': getDayState(day) === 'future'
					}"
				></div>
			</div>
		</div>
	</div>
</template>
