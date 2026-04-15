<script setup>
import { computed } from "vue"

const props = defineProps({
	viewDate: { type: Date, required: true },
	selectedDay: { type: Number, required: true },
	format: { type: String, default: "dk" }
})

const displayDate = computed(() => new Date(props.viewDate.getFullYear(), props.viewDate.getMonth(), props.selectedDay))

const currentMonthName = computed(() => {
	const monthIndex = props.viewDate.getMonth()
	
	if (props.format === "dk") {
		const daMonths = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"]
		return daMonths[monthIndex]
	} else {
		const enMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
		return enMonths[monthIndex]
	}
})

const currentWeekdayName = computed(() => {
	if (props.format === "dk") {
		const days = ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"]
		return days[displayDate.value.getDay()]
	}
	return displayDate.value.toLocaleString("en-US", { weekday: "short" })
})

const displayDayLabel = computed(() => String(props.selectedDay).padStart(2, "0"))
</script>

<template>
	<div class="flex flex-col flex-1 justify-center">
		<div class="flex w-fit flex-col">
			<div class="flex justify-between whitespace-nowrap text-4xl font-semibold ">
				<span class="text-abyssal">
					{{ currentWeekdayName }}
				</span>
				<span class="text-abyssal/60">
					{{ currentMonthName }}
				</span>
			</div>

			<h1 class="text-abyssal font-mono tracking-min text-[7.75rem] leading-none tabular-nums">
				{{ displayDayLabel }}
			</h1>

			<span class="hidden">{{ viewDate.getFullYear() }}</span>
		</div>
	</div>
</template>
