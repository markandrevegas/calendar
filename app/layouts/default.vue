<template>
	<div class="flex min-h-screen items-center justify-center bg-[#D4D4D2]">
		<main class="relative z-0 flex h-[667px] w-full max-w-[440px] min-w-0 flex-col overflow-hidden bg-[#E5E5E3] shadow-2xl transition-all duration-300 sm:rounded-[3rem] sm:border-[8px] sm:border-slate-900" style="height: clamp(667px, 90vh, 932px)">
			<div class="relative -top-[10px] hidden h-8 w-full items-center justify-center sm:flex">
				<div class="h-6 w-32 rounded-b-2xl bg-slate-900"></div>
			</div>

			<div class="min-w-0 flex-1 overflow-hidden px-6 py-8">
				<slot />
			</div>

			<div class="flex h-6 w-full items-center justify-center pb-2">
				<div class="h-1.5 w-32 rounded-full bg-slate-400/30"></div>
			</div>
		</main>
	</div>
</template>
