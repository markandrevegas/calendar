import { ref } from "vue"

export function useCalendarSelection() {
	const selected = ref(null)
	const modalOpen = ref(false)

	const selectDate = (payload) => {
		const isSameDay = selected.value && selected.value.day === payload.day && selected.value.month === payload.month && selected.value.year === payload.year

		if (!isSameDay || !selected.value) {
			selected.value = payload
			return
		}
		modalOpen.value = true
	}

	const closeModal = () => {
		modalOpen.value = false
	}

	return {
		selected,
		modalOpen,
		selectDate,
		closeModal
	}
}
