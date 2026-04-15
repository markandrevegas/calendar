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
const currentFormat = useCookie("calendar-format", {
	default: () => "dk",
	watch: true,
	maxAge: 60 * 60 * 24 * 36
})
</script>

<template>
	<div class="flex flex-1 flex-col">
		<div class="flex w-full justify-between">
			<span>{{ viewDate.getFullYear() }}</span>
			<LanguageSwitcher v-model="currentFormat" />
		</div>
		<div class="flex flex-1 flex-col justify-end pb-24">
			<div class="flex w-32 font-semibold whitespace-nowrap">
				<span class="text-abyssal inline-block w-[3.5ch] text-2xl">
					{{ currentWeekdayName }}
				</span>
				<span class="text-abyssal/60 inline-block w-[3.5ch] text-2xl">
					{{ currentMonthName }}
				</span>
			</div>
			<h1 class="text-abyssal tracking-min w-[3.5ch] text-[6rem] leading-none tabular-nums">
				{{ displayDayLabel }}
			</h1>
		</div>
	</div>
</template>
