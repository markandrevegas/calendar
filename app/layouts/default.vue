<template>
	<div class="flex min-h-screen items-center justify-center">
		<main class="relative z-0 flex w-full flex-col overflow-hidden bg-slate-50 transition-all duration-300 sm:h-full sm:max-h-[932px] sm:min-h-[667px] sm:w-[440px] sm:rounded-[3rem] sm:border-[8px] sm:border-slate-900 sm:shadow-2xl md:my-auto" style="transform: translate(0, 0);">
			<div class="relative -top-[10px] hidden h-8 w-full items-center justify-center sm:flex">
				<div class="h-6 w-32 rounded-b-2xl bg-slate-900"></div>
			</div>

			<div class="relative flex min-w-0 flex-1 flex-col overflow-hidden px-6">
				<slot></slot>
			</div>

			<div class="hidden h-6 w-full items-center justify-center pb-2 sm:flex">
				<div class="h-1.5 w-32 rounded-full bg-slate-400/30"></div>
			</div>
		</main>
	</div>
</template>
