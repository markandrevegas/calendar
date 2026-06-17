<script setup>
import { computed, ref, watch, onBeforeUnmount } from "vue"

const props = defineProps({
	viewDate: { type: Date, required: true },
	selectedDate: { type: Object, default: null },
	format: { type: String, default: "dk" }
})

const currentMonthName = computed(() => {
	const monthIndex = props.viewDate.getMonth()
	const months = props.format === "dk" ? ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"] : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

	return months[monthIndex]
})

const currentFormat = useCookie("calendar-format", {
	default: () => "dk",
	watch: true,
	maxAge: 60 * 60 * 24 * 36
})

const monthKey = computed(() => {
	return `${props.viewDate.getFullYear()}-${props.viewDate.getMonth()}`
})

const createTodayDate = () => {
	const today = new Date()
	return new Date(today.getFullYear(), today.getMonth(), today.getDate())
}

const createSelectedDate = (selectedDate) => {
	if (!selectedDate?.year || !selectedDate?.month || !selectedDate?.day) return null

	return new Date(selectedDate.year, selectedDate.month - 1, selectedDate.day)
}

const currentDisplayDate = ref(createTodayDate())
const nextDisplayDate = ref(null)
const isDateSwitching = ref(false)
const isIncomingMounted = ref(false)
let dateSwitchTimer = null
let dateSwitchFrame = null
const dateSwitchDuration = 450

const clearDateSwitchTimer = () => {
	if (!dateSwitchTimer) return

	clearTimeout(dateSwitchTimer)
	dateSwitchTimer = null
}

const clearDateSwitchFrame = () => {
	if (!dateSwitchFrame) return

	cancelAnimationFrame(dateSwitchFrame)
	dateSwitchFrame = null
}

const formatWeekday = (date) => {
	if (!date) return ""

	if (props.format === "dk") {
		const days = ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"]
		return days[date.getDay()]
	}

	return date.toLocaleString("en-US", { weekday: "short" })
}

const formatDayLabel = (date) => {
	if (!date) return ""

	return String(date.getDate()).padStart(2, "0")
}

const leavingWeekdayName = ref("")
const leavingDayLabel = ref("")
const enteringWeekdayName = ref("")
const enteringDayLabel = ref("")

leavingWeekdayName.value = formatWeekday(currentDisplayDate.value)
leavingDayLabel.value = formatDayLabel(currentDisplayDate.value)

const currentWeekdayName = computed(() => formatWeekday(currentDisplayDate.value))
const currentDayLabel = computed(() => formatDayLabel(currentDisplayDate.value))
const nextWeekdayName = computed(() => formatWeekday(nextDisplayDate.value))
const nextDayLabel = computed(() => formatDayLabel(nextDisplayDate.value))

const isSameDate = (left, right) => {
	if (!left || !right) return false
	return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth() && left.getDate() === right.getDate()
}

/*const isSameDate = (left, right) => {
	if (!left || !right) return false

	return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth() && left.getDate() === right.getDate()
}*/

watch(
	() => props.selectedDate,
	(newSelectedDate) => {
		const nextDate = createSelectedDate(newSelectedDate)

		if (!nextDate || isSameDate(currentDisplayDate.value, nextDate)) {
			return
		}

		clearDateSwitchTimer()
		clearDateSwitchFrame()

		// Set up exactly what the incoming text should say
		enteringWeekdayName.value = formatWeekday(nextDate)
		enteringDayLabel.value = formatDayLabel(nextDate)

		nextDisplayDate.value = nextDate
		isIncomingMounted.value = true
		isDateSwitching.value = false

		dateSwitchFrame = window.requestAnimationFrame(() => {
			dateSwitchFrame = window.requestAnimationFrame(() => {
				isDateSwitching.value = true
				dateSwitchFrame = null
			})
		})

		dateSwitchTimer = window.setTimeout(() => {
			currentDisplayDate.value = nextDate

			// Commit the next date text to be the permanent current text
			leavingWeekdayName.value = enteringWeekdayName.value
			leavingDayLabel.value = enteringDayLabel.value

			nextDisplayDate.value = null
			isIncomingMounted.value = false
			isDateSwitching.value = false
			dateSwitchTimer = null
		}, dateSwitchDuration)
	},
	{ immediate: true, deep: true }
)

onBeforeUnmount(() => {
	clearDateSwitchTimer()
	clearDateSwitchFrame()
})
</script>

<template>
	<div class="flex h-72 flex-col">
		<div class="flex w-full justify-between">
			<span class="bg-abyssal flex items-center rounded-full px-3 py-1 text-[11px] font-bold tracking-widest text-slate-100 uppercase tabular-nums">{{ viewDate.getFullYear() }}</span>
			<LanguageSwitcher v-model="currentFormat" />
		</div>

		<div class="flex flex-1 flex-col justify-center">
			<div class="flex w-32 items-center gap-1 font-semibold whitespace-nowrap">
				<div class="date-slot text-abyssal inline-block w-[3.5ch] text-2xl" aria-live="polite">
					<span :class="['date-line date-line--current', { 'is-leaving': isDateSwitching }]">
						{{ leavingWeekdayName }}
					</span>
					<span v-if="isIncomingMounted" :class="['date-line date-line--incoming', { 'is-entering': isDateSwitching }]">
						{{ enteringWeekdayName }}
					</span>
				</div>

				<div class="date-slot text-ember inline-block w-[3.5ch] text-2xl" aria-live="polite">
					<span :class="['date-line date-line--current', { 'is-leaving': isDateSwitching }]">
						{{ leavingDayLabel }}
					</span>
					<span v-if="isIncomingMounted" :class="['date-line date-line--incoming', { 'is-entering': isDateSwitching }]">
						{{ enteringDayLabel }}
					</span>
				</div>
			</div>

			<Transition name="header-fade" mode="out-in">
				<h1 :key="monthKey" class="text-abyssal text-[3rem] leading-none tracking-tight tabular-nums">
					{{ currentMonthName }}
				</h1>
			</Transition>
		</div>
	</div>
</template>

<style scoped>
.header-fade-enter-active,
.header-fade-leave-active {
	transition: opacity 260ms ease;
}

.header-fade-enter-from,
.header-fade-leave-to {
	opacity: 0;
}

.header-fade-enter-to,
.header-fade-leave-from {
	opacity: 1;
}
.date-slot {
	position: relative;
	height: 1.2em;
	overflow: hidden;
}

.date-line {
	position: absolute;
	inset: 0;
	/* Updated duration to 450ms to match duration: 0.45 */
	transition:
		transform 450ms cubic-bezier(0.22, 1, 0.36, 1),
		opacity 450ms cubic-bezier(0.22, 1, 0.36, 1);
	transform: translateY(0);
	opacity: 1;
	will-change: transform, opacity;
}

/* 1. Incoming item starts at 6px down and completely hidden */
.date-line--incoming {
	transform: translateY(6px);
	opacity: 0;
}

/* 2. Current item slides UP by 6px and fades out as it leaves */
.date-line--current.is-leaving {
	transform: translateY(-6px);
	opacity: 0;
}

/* 3. Incoming item slides UP into its final rest position (0) and fades in */
.date-line--incoming.is-entering {
	transform: translateY(0);
	opacity: 1;
}
</style>
