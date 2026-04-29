<script setup>
const props = defineProps({
	isOpen: Boolean,
	origin: { type: Object, default: () => ({ x: 0, y: 0 }) },
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
	<div v-if="isOpen" class="absolute inset-0 z-50 flex flex-col overflow-hidden">
		<!-- Backdrop -->
		<Transition appear name="fade">
			<div v-show="isOpen" class="bg-abyssal/60 absolute inset-0 backdrop-blur-[2px]" @click="emit('close')"></div>
		</Transition>

		<!-- Expanding Modal -->
		<Transition 
			appear 
			name="expand"
			@before-enter="(el) => {
				el.style.setProperty('--origin-x', `${origin.x}px`)
				el.style.setProperty('--origin-y', `${origin.y}px`)
			}"
		>
			<div v-show="isOpen" class="bg-palladian relative z-10 flex h-full w-full flex-col px-8 pt-12 pb-10 shadow-2xl">
				<!-- Handle (can also be used to close) -->
				<div class="mb-6 flex justify-center" @click="emit('close')">
					<div class="bg-abyssal/10 h-1.5 w-12 rounded-full cursor-pointer">X</div>
				</div>

				<!-- YOUR EXISTING CONTENT -->
				<div class="mb-8">
					<h2 class="text-abyssal mt-1 text-4xl font-semibold tracking-tighter">
						{{ !isCreating ? "Events" : "Create" }}
					</h2>
					<p v-if="!hasEvents && !isCreating" class="text-abyssal font-medium">No events scheduled.</p>
					<p v-else class="text-abyssal font-medium">Saved events for this date.</p>
				</div>

				<!-- ... rest of your existing body (hasEvents, forms, etc) ... -->
                <div v-if="hasEvents && !isCreating" class="flex flex-col gap-4">
                    <!-- ... -->
                </div>
                <!-- ... -->
			</div>
		</Transition>
	</div>
</template>

<style scoped>
.expand-enter-active {
	transition: clip-path 0.6s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.4s ease;
}
.expand-leave-active {
	transition: clip-path 0.4s cubic-bezier(0.4, 0, 1, 1);
}

/* 1. Start as a small orange circle at the button's location */
.expand-enter-from {
	background-color: #F26419; /* This is your bg-ember hex */
	clip-path: circle(24px at var(--origin-x) var(--origin-y));
}

/* 2. Expand to cover the entire screen */
.expand-enter-to, .expand-leave-from {
	clip-path: circle(150% at var(--origin-x) var(--origin-y));
}

/* 3. Collapse back to nothing on close */
.expand-leave-to {
	clip-path: circle(0px at var(--origin-x) var(--origin-y));
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.4s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>

