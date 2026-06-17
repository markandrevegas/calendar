export function useEventPayload() {
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
			displayDate: `${day}.${month}.${year}`,
			title,
			description
		}
	}

	return {
		buildEventPayload
	}
}
