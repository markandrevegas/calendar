<script setup>
const props = defineProps({
	isOpen: Boolean,
	eventData: {
		type: Object,
		default: () => ({})
	}
})

const emit = defineEmits(['close'])
</script>

<template>
	<Transition
		enter-active-class="transition duration-400 ease-[cubic-bezier(0.32,0.72,0 1)]"
		enter-from-class="opacity-0 translate-y-full"
		enter-to-class="opacity-100 translate-y-0"
		leave-active-class="transition duration-300 ease-[cubic-bezier(0.32,0.72,0 1)]"
		leave-from-class="opacity-100 translate-y-0"
		leave-to-class="opacity-0 translate-y-full"
	>
		<div v-if="isOpen" class="absolute inset-0 z-[100] flex flex-col justify-end">
			<Transition
				enter-active-class="transition duration-400"
				enter-from-class="opacity-0"
				enter-to-class="opacity-100"
				leave-active-class="transition duration-300"
				leave-from-class="opacity-100"
				leave-to-class="opacity-0"
			>
				<div v-if="isOpen" class="absolute inset-0 bg-abyssal/80 backdrop-blur-sm" @click="emit('close')"></div>
			</Transition>

			<div 
				class="bg-palladian relative z-10 w-full overflow-hidden rounded-t-[3rem] px-8 pb-10 pt-4 shadow-2xl transition-all"
				style="height: 50dvh;"
			>
				<div class="flex justify-center mb-6">
					<div class="h-1 w-16 rounded-full bg-abyssal/10"></div>
				</div>

				<div class="mb-8">
					<span class="text-ember text-sm font-black uppercase tracking-widest leading-none">Create Event</span>
					<h2 class="text-abyssal text-5xl font-bold tracking-tighter leading-none mt-1">
						{{ eventData.day }}.{{ eventData.month }}.{{ eventData.year }}
					</h2>
				</div>

				<div class="flex flex-col gap-5">
					<input
						type="text"
						placeholder="Event Title"
						class="bg-white w-full rounded-2xl border border-palladian/80 px-5 py-4 text-base focus:border-slate/50 focus:outline-none transition"
					/>
					<button class="bg-abyssal text-palladian w-full rounded-2xl py-5 text-xs font-bold uppercase tracking-widest active:scale-[0.98] transition-all">
						Save Event
					</button>
				</div>

				<div class="mt-8 flex justify-center">
					<button @click="emit('close')" class="text-muted2 text-xs font-medium uppercase tracking-wider">
						Close
					</button>
				</div>
			</div>
		</div>
	</Transition>
</template>