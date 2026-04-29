<script setup>
import { computed } from 'vue'

const props = defineProps({
	viewDate: { type: Date, default: () => new Date() },
	format: { type: String, default: "dk" },
	events: { type: Object, default: () => ({}) },
	selectedDay: { type: Number, default: null }
})

const emit = defineEmits(["select-date"])

const formatDateKey = (day) => `${day}.${props.viewDate.getMonth() + 1}.${props.viewDate.getFullYear()}`

const handleDateClick = (event, day) => {
	const eventData = {
		day,
		month: props.viewDate.getMonth() + 1,
		year: props.viewDate.getFullYear(),
		fullDate: new Date(props.viewDate.getFullYear(), props.viewDate.getMonth(), day)
	}
	// Send both the data and the pointer event to the parent
	emit("select-date", eventData, event)
}

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
	return props.format === "dk" 
		? ["M", "T", "O", "T", "F", "L", "S"] 
		: ["S", "M", "T", "W", "T", "F", "S"]
})

const endOffset = computed(() => {
	const currentCount = startOffset.value + daysInMonth.value
	return 42 - currentCount
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
</script>

<template>
	<div class="flex h-full min-h-0 w-full flex-col select-none">

		<div class="mt-auto mb-3 grid grid-cols-7">
			<span v-for="(label, index) in labels" :key="`${format}-${index}`" class="text-abyssal/50 text-center text-sm font-bold"> {{ label }} </span>
		</div>

		<div class="grid grid-cols-7 gap-1">
			<div v-for="n in startOffset" :key="'start-' + n" class="flex aspect-square items-center justify-center">
				<div class="bg-palladian h-2 w-2 rounded-full opacity-30"></div>
			</div>

			<div v-for="day in daysInMonth" :key="day" class="flex aspect-square items-center justify-center">
				<button
					@click="handleDateClick($event, day)"
					class="relative flex h-full w-full items-center justify-center rounded-full text-white tabular-nums transition-all duration-300"
					:class="{
						'bg-ember': selectedDay === day || getDayState(day) === 'today',
						'bg-abyssal': selectedDay !== day && getDayState(day) === 'past',
						'bg-abyssal/50': selectedDay !== day && getDayState(day) !== 'past'
					}"
				>
					<span v-if="hasEvent(day)" class="absolute top-1 text-[10px] leading-none text-white">•</span>

					<span class="hidden font-semibold">{{ day }}</span>
				</button>
			</div>

			<div v-for="n in endOffset" :key="'end-' + n" class="flex aspect-square items-center justify-center">
				<div class="bg-palladian h-2 w-2 rounded-full opacity-30"></div>
			</div>
		</div>
	</div>
</template>
