import { enGB, fr, pt } from "date-fns/locale";
import type { Locale as DateFnsLocale } from "date-fns";

// Locale do date-fns (react-datepicker) para cada língua do site.
const map: Record<string, DateFnsLocale> = { pt, en: enGB, fr };

export function dateFnsLocale(locale: string): DateFnsLocale {
	return map[locale] ?? pt;
}

// Formato de data mostrado nos datepickers (dd/mm/aaaa em todas as línguas
// do site — PT, EN (britânico) e FR usam dia/mês/ano).
export const PICKER_DATE_FORMAT = "dd/MM/yyyy";
