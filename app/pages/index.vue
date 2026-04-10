<script setup>
const currentFormat = ref("dk")

const toggleFormat = () => {
	currentFormat.value = currentFormat.value === "dk" ? "us" : "dk"
}
</script>
<template>
	<div class="flex flex-col gap-12">
		<div class="flex justify-end px-2">
			<button @click="toggleFormat" class="bg-abyssal/20 text-abyssal flex items-center gap-2 rounded-full p-1 pl-3 text-sm font-medium transition-all active:scale-95">
				<span>{{ currentFormat === "dk" ? "Dansk" : "English" }}</span>
				<div class="bg-abyssal/50 text-palladian flex h-6 w-6 items-center justify-center rounded-full">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7" />
					</svg>
				</div>
			</button>
		</div>

		<CalendarGrid :format="currentFormat" :viewDate="new Date()" />
	</div>
</template>
