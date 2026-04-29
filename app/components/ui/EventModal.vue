<script setup>
const props = defineProps({
	isOpen: Boolean,
	eventData: { type: Object, default: () => ({}) },
	existingEvents: { type: Array, default: () => [] }
})

const emit = defineEmits(["close", "save"])

const isCreating = ref(false)
const title = ref("")
const description = ref("")
const selectedDate = ref("")
const hasEvents = computed(() => props.existingEvents.length > 0)

const formatInputDate = (eventData) => {
	if (!eventData?.year || !eventData?.month || !eventData?.day) return ""

	const month = String(eventData.month).padStart(2, "0")
	const day = String(eventData.day).padStart(2, "0")
	return `${eventData.year}-${month}-${day}`
}

const formatDisplayDate = (dateValue) => {
	if (!dateValue) return ""

	const [year, month, day] = dateValue.split("-")
	return `${day}.${month}.${year}`
}

// Reset state when modal opens
watch(
	() => props.isOpen,
	(val) => {
		if (val) {
			isCreating.value = false
			title.value = ""
			description.value = ""
			selectedDate.value = formatInputDate(props.eventData)
		}
	}
)

const submitEvent = () => {
	if (!title.value || !selectedDate.value) return

	const [year, month, day] = selectedDate.value.split("-").map(Number)

	emit("save", {
		...props.eventData,
		day,
		month,
		year,
		fullDate: new Date(year, month - 1, day),
		date: selectedDate.value,
		displayDate: formatDisplayDate(selectedDate.value),
		title: title.value,
		description: description.value
	})
}
</script>

<template>
	<div v-if="isOpen" class="absolute inset-0 z-50 flex flex-col justify-end">
		<Transition appear name="fade">
			<div v-show="isOpen" class="bg-abyssal/60 absolute inset-0 backdrop-blur-[2px]" @click="emit('close')"></div>
		</Transition>

		<Transition appear name="slide">
			<div v-show="isOpen" class="bg-palladian relative z-10 flex w-full flex-col justify-between rounded-t-[2.5rem] px-8 pt-4 pb-10 shadow-2xl" style="height: 60vh">
				<div class="mb-6 flex justify-center"><div class="bg-abyssal/10 h-1.5 w-12 rounded-full"></div></div>

				<div class="mb-8">
					<h2 class="text-abyssal mt-1 text-xl font-semibold tracking-tighter">
						{{ !isCreating ? "Events" : "Create Event" }}
					</h2>
					<p v-if="!hasEvents && !isCreating" class="text-abyssal font-medium">No events scheduled for this day.</p>
					<p v-else-if="!isCreating" class="text-abyssal font-medium">Saved events for this date.</p>
					<p v-else class="text-abyssal font-medium">Start typing</p>
				</div>

				<div v-if="hasEvents && !isCreating" class="flex flex-col gap-4">
					<div class="max-h-[28vh] space-y-3 overflow-y-auto pr-1">
						<article v-for="(event, index) in existingEvents" :key="`${event.title}-${index}`" class="rounded-2xl bg-white/70 px-5 py-4">
							<h3 class="text-abyssal text-sm font-semibold tracking-tight">
								{{ event.title }}
							</h3>
							<p class="text-abyssal/50 mt-1 text-[11px] font-bold tracking-[0.15em] uppercase">
								{{ event.displayDate }}
							</p>
							<p class="text-abyssal/70 mt-2 text-sm leading-relaxed italic">
								{{ event.description || "No description provided." }}
							</p>
						</article>
					</div>
					<button @click="isCreating = true" class="text-abyssal border-abyssal/20 mt-2 rounded-xl border py-3 text-[10px] font-bold tracking-widest uppercase">Add Event</button>
				</div>

				<div v-else-if="!isCreating" class="flex flex-col">
					<div class="bg-abyssal/5 mb-4 flex hidden h-16 w-16 items-center justify-center rounded-full">
						<svg xmlns="http://www.w3.org/2000/svg" class="text-abyssal/20 h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
						</svg>
					</div>

					<button @click="isCreating = true" class="bg-abyssal text-palladian w-full rounded-2xl py-5 text-[10px] font-bold tracking-[0.15em] uppercase transition-transform active:scale-95">Create Event</button>
				</div>

				<div v-else class="flex flex-col gap-4">
					<input v-model="title" type="text" placeholder="Event Title" class="box-border w-full min-w-0 rounded-2xl bg-white/80 px-5 py-4 text-base focus:outline-none" />
					<input v-model="selectedDate" type="date" class="box-border w-full min-w-0 rounded-2xl bg-white/80 px-5 py-4 text-base focus:outline-none" />
					<textarea v-model="description" placeholder="Description" rows="2" class="box-border w-full min-w-0 resize-none rounded-2xl bg-white/80 px-5 py-4 text-sm focus:outline-none"></textarea>
					<div class="flex gap-2">
						<button @click="isCreating = false" class="bg-slate2 text-abyssal rounded-2xl px-6 py-5 text-[10px] font-bold uppercase">Back</button>
						<button @click="submitEvent" class="bg-ember text-abyssal flex-1 rounded-2xl py-5 text-[10px] font-bold tracking-[0.15em] uppercase">Save</button>
					</div>
				</div>
			</div>
		</Transition>
	</div>
</template>
<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.4s;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
.slide-enter-active {
	transition: transform 0.4s cubic-bezier(0.32, 0.72, 0, 1);
}
.slide-leave-active {
	transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}
.slide-enter-from,
.slide-leave-to {
	transform: translateY(100%);
}
</style>

