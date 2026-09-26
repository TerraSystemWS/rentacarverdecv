// lib/utils/cvTime.ts
// Datas/horas das reservas em hora de Cabo Verde (Atlantic/Cape_Verde, sempre
// UTC-1, sem hora de verão). O levantamento e a devolução acontecem em Cabo
// Verde — "10:00" escolhido no formulário é 10:00 em Cabo Verde,
// independentemente do país de onde o cliente reserva. Na BD fica o instante
// correto (em UTC).

export const CV_TIME_ZONE = "Atlantic/Cape_Verde";
const CV_OFFSET = "-01:00";

// "2026-10-10" + "10:00" (hora de Cabo Verde) -> ISO em UTC ("2026-10-10T11:00:00.000Z")
export function cvToIso(date: string, time: string): string {
	return new Date(`${date}T${time}:00${CV_OFFSET}`).toISOString();
}

// ISO -> { date: "2026-10-10", time: "10:00" } em hora de Cabo Verde (para
// preencher formulários de edição).
export function isoToCv(iso: string): { date: string; time: string } {
	const parts = new Intl.DateTimeFormat("en-CA", {
		timeZone: CV_TIME_ZONE,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hourCycle: "h23",
	}).formatToParts(new Date(iso));
	const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
	return { date: `${get("year")}-${get("month")}-${get("day")}`, time: `${get("hour")}:${get("minute")}` };
}

// Dia escolhido num date picker (meia-noite LOCAL do browser) -> "YYYY-MM-DD".
// Não usar toISOString() para isto: num browser em UTC+1 (ex: Portugal no
// verão), meia-noite local é 23:00 UTC do dia anterior e a data ficava errada.
export function localDateString(d: Date): string {
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	return `${y}-${m}-${day}`;
}

// "YYYY-MM-DD" -> Date à meia-noite LOCAL (para o date picker). new
// Date("2026-10-10") seria meia-noite UTC — em Cabo Verde (UTC-1) isso é dia 9
// às 23:00 e o picker mostrava o dia anterior.
export function parseLocalDate(value: string): Date | null {
	const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
	return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : null;
}
