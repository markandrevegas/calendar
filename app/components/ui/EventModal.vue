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
	<div v-if="isOpen" class="absolute inset-0 z-50 flex flex-col justify-end">
		
		<Transition
			appear
			enter-active-class="transition duration-400 ease-out"
			enter-from-class="opacity-0"
			enter-to-class="opacity-100"
			leave-active-class="transition duration-300 ease-in"
			leave-from-class="opacity-100"
			leave-to-class="opacity-0"
		>
			<div 
				v-show="isOpen"
				class="absolute inset-0 bg-abyssal/60 backdrop-blur-[2px]" 
				@click="emit('close')"
			></div>
		</Transition>

		<Transition
			appear
			enter-active-class="transition duration-400 ease-[cubic-bezier(0.32,0.72,0,1)]"
			enter-from-class="translate-y-full"
			enter-to-class="translate-y-0"
			leave-active-class="transition duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
			leave-from-class="translate-y-0"
			leave-to-class="translate-y-full"
		>
			<div 
				v-show="isOpen"
				class="bg-palladian relative z-10 w-full overflow-hidden rounded-t-[2.5rem] px-8 pb-10 pt-4 shadow-[0_-10px_40px_rgba(0,0,0,0.2)]"
				style="height: 50%;" 
			>
				<div class="mb-6 flex justify-center">
					<div class="h-1.5 w-12 rounded-full bg-abyssal/10"></div>
				</div>

				<div class="mb-8">
					<span class="text-ember text-[10px] font-black uppercase tracking-[0.2em] leading-none">Create Event</span>
					<h2 class="text-abyssal mt-1 text-5xl font-bold tracking-tighter leading-none">
						{{ eventData.day }}.{{ eventData.month }}
					</h2>
				</div>

				<div class="flex flex-col gap-4">
					<input
						type="text"
						placeholder="What's happening?"
						class="bg-white/80 border-palladian w-full rounded-2xl border px-5 py-4 text-base focus:bg-white focus:outline-none transition-colors"
					/>
					<button class="bg-abyssal text-palladian active:bg-slate w-full rounded-2xl py-5 text-[10px] font-bold uppercase tracking-[0.15em] transition-all active:scale-[0.98]">
						Add to Calendar
					</button>
				</div>
			</div>
		</Transition>
	</div>
</template>