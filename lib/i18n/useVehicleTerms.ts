"use client";

import { useTranslations } from "next-intl";

// Os atributos das viaturas vêm da BD em PT e com grafias variadas
// ("ELETRICO", "DISEL", "Automático"...). Normaliza para uma chave e traduz;
// um valor desconhecido aparece tal como está.
const normalize = (v: string) =>
	v.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z]/g, "");

const ALIASES: Record<string, string> = {
	// combustível
	gasolina: "fuel.gasoline", gasoline: "fuel.gasoline", petrol: "fuel.gasoline",
	diesel: "fuel.diesel", disel: "fuel.diesel", gasoleo: "fuel.diesel",
	eletrico: "fuel.electric", electrico: "fuel.electric", electric: "fuel.electric",
	hibrido: "fuel.hybrid", hybrid: "fuel.hybrid",
	etanol: "fuel.ethanol",
	// caixa
	automatico: "gearbox.automatic", automatica: "gearbox.automatic", automatic: "gearbox.automatic",
	manual: "gearbox.manual",
	// categoria
	compacto: "category.compact", suv: "category.suv", luxo: "category.luxury",
	economico: "category.economy", carrinha: "category.van", intermediario: "category.intermediate",
	stationwagon: "category.stationWagon", carrinhacomercial: "category.van",
	microonibus: "category.minibus", minibus: "category.minibus",
};

/** Chave canónica de um termo (ex: "DISEL" e "Diesel" → "fuel.diesel"), ou o valor normalizado. */
export function vehicleTermKey(value: string | null | undefined): string {
	if (!value) return "";
	const n = normalize(value);
	return ALIASES[n] ?? n;
}

/** Dois valores de atributo representam o mesmo termo? (usado nos filtros de /cars) */
export function sameVehicleTerm(a: string | null | undefined, b: string | null | undefined): boolean {
	return !!a && !!b && vehicleTermKey(a) === vehicleTermKey(b);
}

export function useVehicleTerms() {
	const t = useTranslations("vehicleTerms");
	return (value: string | null | undefined): string => {
		if (!value) return "";
		const key = ALIASES[normalize(value)];
		return key && t.has(key) ? t(key) : value;
	};
}
