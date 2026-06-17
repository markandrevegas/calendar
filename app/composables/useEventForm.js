import { ref, watch } from "vue"

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

export function useEventForm(props) {
	const isCreating = ref(false)
	const title = ref("")
	const description = ref("")
	const selectedDate = ref("")

	const resetForm = () => {
		isCreating.value = false
		title.value = ""
		description.value = ""
		selectedDate.value = formatInputDate(props.eventData)
	}

	watch(
		() => props.isOpen,
		(open) => {
			if (open) resetForm()
		}
	)

	return {
		isCreating,
		title,
		description,
		selectedDate,
		resetForm,
		formatDisplayDate
	}
}
