<script setup>
import { computed } from "vue"

const props = defineProps({
	viewDate: { type: Date, required: true },
	selectedDay: { type: Number, required: true },
	format: { type: String, default: "dk" }
})

const daMonths = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"]

const displayDate = computed(() => new Date(props.viewDate.getFullYear(), props.viewDate.getMonth(), props.selectedDay))

const currentMonthName = computed(() => {
	const monthIndex = props.viewDate.getMonth()
	return props.format === "dk" ? daMonths[monthIndex] : props.viewDate.toLocaleString("en-US", { month: "long" })
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
	<div class="flex flex-1 items-start px-1">
		<div class="flex min-h-0 flex-1 items-start px-2">
			<div class="flex w-fit flex-col">
				<div class="border-abyssal/10 flex items-center gap-1 border-b pb-1 whitespace-nowrap">
					<span class="text-abyssal text-xl font-bold">
						{{ currentWeekdayName }}
					</span>
					<span class="text-abyssal/50 text-xl font-bold">
						{{ currentMonthName }}
					</span>
				</div>

				<h1 class="text-abyssal w-full text-8xl leading-none font-semibold tracking-min tabular-nums">
					{{ displayDayLabel }}
				</h1>

				<span class="hidden">
					{{ viewDate.getFullYear() }}
				</span>
			</div>
		</div>
	</div>
</template>
