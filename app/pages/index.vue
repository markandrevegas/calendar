<script setup>
// State to store events: { "10.4.2026": { title: "Meeting", description: "..." } }
const events = ref({})
// Helper to format the key
const formatDateKey = (day, month, year) => `${day}.${month}.${year}`
const currentFormat = useCookie("calendar-format", {
	default: () => "dk",
	watch: true,
	maxAge: 60 * 60 * 24 * 36
})
const handleSaveEvent = (payload) => {
	const key = formatDateKey(payload.day, payload.month, payload.year)

	events.value[key] = {
		title: payload.title,
		description: payload.description
	}

	// Close modal after saving
	isModalOpen.value = false
}

const isModalOpen = ref(false)
const selectedDateData = ref({})
const openModal = (data) => {
	selectedDateData.value = data
	isModalOpen.value = true
}

const toggleFormat = () => {
	currentFormat.value = currentFormat.value === "dk" ? "us" : "dk"
}
</script>
<template>
	<div class="flex flex-col gap-12">
		<div class="flex justify-end px-2">
			<button @click="toggleFormat" class="bg-abyssal/20 text-abyssal flex items-center rounded-full px-3 py-1 text-[11px] font-bold tracking-widest uppercase">
				<span>{{ currentFormat === "dk" ? "DANISH" : "ENGLISH" }}</span>
			</button>
		</div>

		<ClientOnly>
			<CalendarGrid :format="currentFormat" :viewDate="new Date()" @select-date="openModal" />
			<EventModal :is-open="isModalOpen" :event-data="selectedDateData" :existing-event="events[formatDateKey(selectedDateData.day, selectedDateData.month, selectedDateData.year)]" @close="isModalOpen = false" @save="handleSaveEvent" />
			<template #fallback>
				<div class="bg-palladian/50 h-[300px] w-full animate-pulse rounded-3xl"></div>
			</template>
		</ClientOnly>
	</div>
</template>
