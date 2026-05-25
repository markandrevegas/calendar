<script setup>
import { computed } from "vue"

const props = defineProps({
	viewDate: { type: Date, required: true },
	selectedDay: { type: Number, default: null }, // Changed to default null
	format: { type: String, default: "dk" }
})

const currentMonthName = computed(() => {
	const monthIndex = props.viewDate.getMonth()
	const months = props.format === "dk" ? ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"] : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

	return months[monthIndex]
})

const currentWeekdayName = computed(() => {
	const date = new Date(props.viewDate.getFullYear(), props.viewDate.getMonth(), effectiveDay.value)

	if (props.format === "dk") {
		const days = ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"]
		return days[date.getDay()]
	}
	return date.toLocaleString("en-US", { weekday: "short" })
})

const displayDayLabel = computed(() => {
	return String(effectiveDay.value).padStart(2, "0")
})

const currentFormat = useCookie("calendar-format", {
	default: () => "dk",
	watch: true,
	maxAge: 60 * 60 * 24 * 36
})

const effectiveDay = computed(() => {
	return props.selectedDay ?? new Date().getDate()
})
const displayDate = computed(() => {
	return new Date(props.viewDate.getFullYear(), props.viewDate.getMonth(), effectiveDay.value)
})
</script>

<template>
	<div class="flex h-72 flex-col">
		<div class="flex w-full justify-between">
			<span class="text-abyssal/50 font-bold tabular-nums">{{ viewDate.getFullYear() }}</span>
			<LanguageSwitcher v-model="currentFormat" />
		</div>

		<div class="flex flex-1 flex-col justify-center">
			<!-- Wrap the Day/Weekday in a div that only shows if selectedDay is truthy -->
			<div class="flex w-32 font-semibold whitespace-nowrap transition-opacity duration-300">
				<span class="text-abyssal inline-block w-[3.5ch] text-2xl">
					{{ currentWeekdayName }}
				</span>
				<span class="text-abyssal/60 inline-block w-[3.5ch] text-2xl">
					{{ displayDayLabel }}
				</span>
			</div>

			<!-- Month Name always shows -->
			<h1 class="text-abyssal text-[3rem] leading-none tracking-tight tabular-nums">
				{{ currentMonthName }}
			</h1>
		</div>
	</div>
</template>
