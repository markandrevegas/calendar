<script setup>
import { ref, watch, computed } from 'vue'

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

const revealRadius = ref(0)
const showContent = ref(false)

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      showContent.value = false
      revealRadius.value = 0

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          revealRadius.value = 2000
        })
      })

      setTimeout(() => {
        showContent.value = true
      }, 220)
    } else {
      showContent.value = false
      revealRadius.value = 0
    }
  }
)

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
	<div v-if="isOpen" class="modal-mask" :style="{ '--origin-x': `${origin.x}px`, '--origin-y': `${origin.y}px`, '--reveal-radius': `${revealRadius}px` }">
		<Transition name="content-fade">
			<div v-if="showContent" class="relative h-full w-full px-8 pt-12 pb-10 shadow-2xl">
				<!-- Handle -->
				<div class="mb-6 flex justify-center" @click="emit('close')">
					<div class="bg-abyssal/10 h-1.5 w-12 cursor-pointer rounded-full">X</div>
				</div>

				<!-- Header -->
				<div class="mb-8">
					<h2 class="text-abyssal mt-1 text-4xl font-semibold tracking-tighter">
						{{ !isCreating ? "Events" : "Create" }}
					</h2>

					<p v-if="!hasEvents && !isCreating" class="text-abyssal font-medium">No events scheduled.</p>

					<p v-else class="text-abyssal font-medium">Saved events for this date.</p>
				</div>

				<!-- Body -->
				<div v-if="hasEvents && !isCreating" class="flex flex-col gap-4">
					<!-- events -->
				</div>
			</div>
		</Transition>
	</div>
</template>

<style scoped>
.content-fade-enter-active {
  transition:
    opacity 450ms ease,
    transform 450ms cubic-bezier(0.16, 1, 0.3, 1);
}

.content-fade-leave-active {
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}

.content-fade-enter-from,
.content-fade-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

.content-fade-enter-to,
.content-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.reveal-layer {
  transition: clip-path 850ms cubic-bezier(0.16, 1, 0.3, .1);
  will-change: clip-path;
}
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 50;

	border-radius: inherit;

  background:
  radial-gradient(
    circle at center,
    #ff7a36,
    #f26419
  );

  clip-path: circle(
    var(--reveal-radius)
    at var(--origin-x) var(--origin-y)
  );

  transition:
    clip-path 850ms cubic-bezier(0.16, 1, 0.3, .1),
    opacity 250ms ease;

  will-change: clip-path;
}
</style>
