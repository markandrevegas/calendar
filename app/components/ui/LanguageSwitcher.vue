<script setup>
const props = defineProps({
	modelValue: { type: String, required: true }
})

const emit = defineEmits(["update:modelValue"])

const toggleFormat = () => {
	const newValue = props.modelValue === "dk" ? "us" : "dk"
	emit("update:modelValue", newValue)
}
</script>

<template>
	<div class="flex justify-end px-2">
		<button @click="toggleFormat" class="bg-abyssal/20 text-abyssal hover:bg-abyssal/30 flex items-center rounded-full px-3 py-1 text-[11px] font-bold tracking-widest uppercase transition-colors">
			<span>{{ modelValue === "dk" ? "DANISH" : "ENGLISH" }}</span>
		</button>
	</div>
</template>
