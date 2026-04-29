<script setup>
import { computed } from "vue"

const props = defineProps({
	viewDate: { type: Date, required: true },
	selectedDay: { type: Number, default: null }, // Changed to default null
	format: { type: String, default: "dk" }
})

// Only create the displayDate if a day is actually selected
const displayDate = computed(() => {
	if (!props.selectedDay) return null
	return new Date(props.viewDate.getFullYear(), props.viewDate.getMonth(), props.selectedDay)
})

const currentMonthName = computed(() => {
	const monthIndex = props.viewDate.getMonth()
	const months = props.format === "dk" 
		? ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"]
		: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
	
	return months[monthIndex]
})

const currentWeekdayName = computed(() => {
	if (!displayDate.value) return "" // Return empty string if no day selected

	if (props.format === "dk") {
		const days = ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"]
		return days[displayDate.value.getDay()]
	}
	return displayDate.value.toLocaleString("en-US", { weekday: "short" })
})

const displayDayLabel = computed(() => {
	return props.selectedDay ? String(props.selectedDay).padStart(2, "0") : ""
})

const currentFormat = useCookie("calendar-format", {
	default: () => "dk",
	watch: true,
	maxAge: 60 * 60 * 24 * 36
})
</script>

<template>
	<div class="flex flex-1 flex-col">
		<div class="flex w-full justify-between">
			<span class="text-abyssal/50 font-bold tabular-nums">{{ viewDate.getFullYear() }}</span>
			<LanguageSwitcher v-model="currentFormat" />
		</div>
		
		<div class="flex flex-1 flex-col justify-end">
			<!-- Wrap the Day/Weekday in a div that only shows if selectedDay is truthy -->
			<div class="flex w-32 font-semibold whitespace-nowrap transition-opacity duration-300" :class="{ 'opacity-0': !selectedDay, 'opacity-100': selectedDay }">
				<span class="text-abyssal inline-block w-[3.5ch] text-2xl">
					{{ currentWeekdayName }}
				</span>
				<span class="text-abyssal/60 inline-block w-[3.5ch] text-2xl">
					{{ displayDayLabel }}
				</span>
			</div>
			
			<!-- Month Name always shows -->
			<h1 class="text-abyssal tracking-tight text-[3rem] leading-none tabular-nums">
				{{ currentMonthName }}
			</h1>
		</div>
	</div>
</template>