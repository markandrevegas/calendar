<script setup>
const currentFormat = useCookie('calendar-format', {
	default: () => 'dk',
	watch: true,
	maxAge: 60 * 60 * 24 * 36
})

const isModalOpen = ref(false)
const selectedDateData = ref({})
const openModal = (data) => {
	selectedDateData.value = data
	isModalOpen.value = true
}

const toggleFormat = () => {
	currentFormat.value = currentFormat.value === 'dk' ? 'us' : 'dk'
}
</script>
<template>
	<div class="flex flex-col gap-12">
		<div class="flex justify-end px-2">
			<button @click="toggleFormat" class="bg-abyssal/20 text-abyssal flex items-center rounded-full py-1 px-3 text-[11px] font-bold uppercase tracking-widest">
				<span>{{ currentFormat === 'dk' ? 'DANISH' : 'ENGLISH' }}</span>
			</button>
		</div>

		<ClientOnly>
			<CalendarGrid :format="currentFormat" :viewDate="new Date()" @select-date="openModal" />
			<EventModal :is-open="isModalOpen" :event-data="selectedDateData" @close="isModalOpen = false" />
			<template #fallback>
				<div class="h-[300px] w-full animate-pulse rounded-3xl bg-palladian/50"></div>
			</template>
		</ClientOnly>
	</div>
</template>
