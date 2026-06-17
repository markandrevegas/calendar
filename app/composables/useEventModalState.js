import { ref, computed, watch, onBeforeUnmount } from "vue"

/* -----------------------------
   helpers (pure)
----------------------------- */

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

const buildEventPayload = (eventData, selectedDate, title, description) => {
	if (!selectedDate) return null

	const [year, month, day] = selectedDate.split("-").map(Number)

	return {
		...eventData,
		day,
		month,
		year,
		fullDate: new Date(year, month - 1, day),
		date: selectedDate,
		displayDate: formatDisplayDate(selectedDate),
		title,
		description
	}
}

/* -----------------------------
   composable
----------------------------- */

export function useEventModalState(props, emit) {
	/* -----------------------------
     form state
  ----------------------------- */
	const isCreating = ref(false)
	const title = ref("")
	const description = ref("")
	const selectedDate = ref("")

	const hasEvents = computed(() => props.existingEvents.length > 0)

	/* -----------------------------
     animation state
  ----------------------------- */
	const showContent = ref(false)
	let closeTimer = null
	const closeContentDelay = 180

	const clearCloseTimer = () => {
		if (!closeTimer) return

		clearTimeout(closeTimer)
		closeTimer = null
	}

	/* -----------------------------
     lifecycle reset
  ----------------------------- */
	const resetState = () => {
		isCreating.value = false
		title.value = ""
		description.value = ""
		selectedDate.value = formatInputDate(props.eventData)
	}

	/* -----------------------------
     open / close orchestration
  ----------------------------- */
	watch(
		() => props.isOpen,
		(open) => {
			clearCloseTimer()

			if (!open) {
				showContent.value = false
				return
			}

			resetState()

			showContent.value = false

			setTimeout(() => {
				showContent.value = true
			}, 220)
		},
		{ immediate: true }
	)

	/* -----------------------------
     actions
  ----------------------------- */
	const submitEvent = () => {
		if (!title.value || !selectedDate.value) return

		const payload = buildEventPayload(props.eventData, selectedDate.value, title.value, description.value)

		emit("save", payload)
	}

	const close = () => {
		if (!showContent.value) return

		showContent.value = false
		clearCloseTimer()
		closeTimer = setTimeout(() => {
			closeTimer = null

			if (typeof props.onClose === "function") {
				props.onClose()
				return
			}

			emit("close")
		}, closeContentDelay)
	}

	onBeforeUnmount(() => {
		clearCloseTimer()
	})

	/* -----------------------------
     public API
  ----------------------------- */
	return {
		// form
		isCreating,
		title,
		description,
		selectedDate,
		hasEvents,

		// animation
		showContent,

		// actions
		submitEvent,
		close,

		// optional helper
		formatDisplayDate
	}
}
