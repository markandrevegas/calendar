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
	<div class="flex flex-1 flex-col justify-center">
		<div class="flex flex-col">
			<div class="flex w-32 font-semibold whitespace-nowrap">
				<span class="text-3xl text-abyssal inline-block min-w-[3.5ch]">
					{{ currentWeekdayName }}
				</span>
				<span class="text-3xl text-abyssal/60 inline-block min-w-[3.5ch]">
					{{ currentMonthName }}
				</span>
			</div>

			<h1 class="text-abyssal tracking-min text-[6rem] w-[3.5ch] leading-none tabular-nums">
				{{ displayDayLabel }}
			</h1>

			<span class="hidden">{{ viewDate.getFullYear() }}</span>
		</div>
	</div>
</template>
