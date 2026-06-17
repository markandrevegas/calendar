import { ref } from "vue"

export function useEventStore() {
	const events = ref({})

	const formatDateKey = (day, month, year) => `${day}.${month}.${year}`

	const addEvent = (payload) => {
		const key = formatDateKey(payload.day, payload.month, payload.year)

		if (!events.value[key]) {
			events.value[key] = []
		}

		events.value[key].push({
			title: payload.title,
			description: payload.description,
			date: payload.date,
			displayDate: payload.displayDate
		})
	}

	const getEventsForDate = (day, month, year) => {
		const key = formatDateKey(day, month, year)
		return events.value[key] || []
	}

	return {
		events,
		addEvent,
		getEventsForDate,
		formatDateKey
	}
}
