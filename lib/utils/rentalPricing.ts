// Aluguer por períodos de 24 h — as mesmas contas da API (RentalPricing.java):
// em cada período de 24 h, as horas que sobram contam até 2 h nada
// (tolerância), de 2 h a 12 h meia diária, mais de 12 h uma diária. Ao
// reservar o mínimo é 1 diária. O condutor extra segue a mesma regra.

export const EXTRA_DRIVER_PER_DAY = 3300;
const DAY_MIN = 24 * 60;
const TOLERANCE_MIN = 2 * 60;
const HALF_MIN = 12 * 60;

/** Meios dias de um tempo qualquer, sem mínimo. */
export function halfDaysFor(minutes: number): number {
	if (minutes <= 0) return 0;
	let units = Math.floor(minutes / DAY_MIN) * 2;
	const rest = minutes % DAY_MIN;
	if (rest > HALF_MIN) units += 2;
	else if (rest > TOLERANCE_MIN) units += 1;
	return units;
}

/** Diárias de um aluguer (1, 1.5, 2, …): mínimo 1. */
export function rentalDays(start: Date, end: Date): number {
	const minutes = Math.floor((end.getTime() - start.getTime()) / 60_000);
	return Math.max(2, halfDaysFor(minutes)) / 2;
}

/** Preço de um aluguer (sem voucher). */
export function rentalPrice(pricePerDay: number, extraDriver: boolean, days: number): number {
	return (pricePerDay + (extraDriver ? EXTRA_DRIVER_PER_DAY : 0)) * days;
}
