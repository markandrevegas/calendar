<script setup>
import { useEventModalState } from "@/composables/useEventModalState"

const props = defineProps({
	isOpen: Boolean,
	eventData: { type: Object, default: () => ({}) },
	existingEvents: { type: Array, default: () => [] },
	onClose: { type: Function, default: null }
})

const emit = defineEmits(["close", "save"])

const { isCreating, title, description, selectedDate, hasEvents, showContent, submitEvent, close } = useEventModalState(props, emit)
</script>

<template>
	<div class="relative flex h-full w-full flex-col overflow-hidden bg-white">
		<Transition name="content-fade">
			<div v-if="showContent" class="inset-shadow-xl relative flex h-full w-full flex-col rounded-t-4xl border border-slate-200 bg-white px-6">
				<!-- Header -->
				<section>
					<div class="text-abyssal flex w-full items-center justify-between pt-4">
						<button class="flex size-8 items-center justify-center rounded-full text-abyssal transition-colors"><BackArrow @click="close" class="size-8" /></button>
						
						<h2 class="text-lg font-semibold tracking-tighter">
							{{ isCreating ? "Create new" : "Events" }}
						</h2>
						<button class="flex size-8 items-center justify-center rounded-full text-white transition-colors" @click="isCreating = !isCreating" :aria-label="isCreating ? 'Close form' : 'Create event'">
							<span class="text-abyssal text-xl leading-none transition-transform duration-200" :class="{ 'rotate-45': isCreating }"> + </span>
						</button>
					</div>
					<!--<p v-if="!hasEvents && !isCreating" class="text-abyssal font-medium">No events scheduled.</p>
					<p v-else class="text-abyssal font-medium">Saved events for this date.</p>-->
				</section>

				<!-- Body -->
				<div v-if="hasEvents && !isCreating" class="flex flex-col gap-4">
					<!-- events list -->
				</div>

				<!-- Form -->
				<div v-else-if="isCreating" class="flex flex-col gap-4">
					<div class="flex flex-col gap-1">
						<label for="title" class="text-abyssal text-sm font-medium"> Title </label>
						<input id="title" v-model="title" class="rounded-md border px-3 py-2" type="text" />
					</div>

					<div class="flex flex-col gap-1">
						<label for="description" class="text-abyssal text-sm font-medium"> Description </label>
						<textarea id="description" v-model="description" class="rounded-md border px-3 py-2" rows="4" />
					</div>

					<div class="flex flex-col gap-1">
						<label for="date" class="text-abyssal text-sm font-medium"> Date </label>
						<input id="date" v-model="selectedDate" type="date" class="rounded-md border px-3 py-2" />
					</div>

					<button @click="submitEvent" class="bg-ember hover:bg-ember/90 rounded-md px-4 py-2 text-white transition-colors">Save</button>
				</div>
			</div>
		</Transition>
	</div>
</template>

<style scoped>
.content-fade-enter-active {
	transition:
		opacity 450ms ease,
		transform 450ms ease;
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

.modal-mask {
	position: fixed;
	inset: 0;
	z-index: 50;
}
</style>
