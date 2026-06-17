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
	<div class="relative flex h-full w-full flex-col overflow-hidden bg-white shadow-xl">
		<Transition name="content-fade">
			<div v-if="showContent" class="relative flex h-full w-full flex-col px-6 shadow-2xl">
				<!-- Header -->
				<div class="mb-8">
					<div class="text-abyssal flex w-full items-center justify-between py-8">
						<h2 class="text-4xl font-semibold tracking-tighter">
							{{ isCreating ? "Create" : "Events" }}
						</h2>
						<PanelClose @click="close" class="size-8" />
					</div>
					<p v-if="!hasEvents && !isCreating" class="text-abyssal font-medium">No events scheduled.</p>

					<p v-else class="text-abyssal font-medium">Saved events for this date.</p>
				</div>

				<!-- Body -->
				<div v-if="hasEvents && !isCreating" class="flex flex-col gap-4">
					<!-- events list -->
				</div>

				<!-- Form -->
				<div v-else-if="isCreating">
					<input v-model="title" placeholder="Title" />
					<textarea v-model="description" placeholder="Description"></textarea>
					<input v-model="selectedDate" type="date" />

					<button @click="submitEvent">Save</button>
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
