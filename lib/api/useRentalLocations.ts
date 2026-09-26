"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL, endpoints } from "@/lib/api/endpoints";
import type { RentalLocation } from "@/lib/api/types";

/**
 * Locais ativos de levantamento/devolução (Operações → Locais no dashboard).
 * Os formulários de reserva só aceitam locais desta lista — o backend valida
 * o id e guarda o nome na reserva.
 */
export function useRentalLocations() {
	const [locations, setLocations] = useState<RentalLocation[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	useEffect(() => {
		let cancelled = false;
		fetch(`${API_BASE_URL}${endpoints.locations.list}`)
			.then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
			.then((data: RentalLocation[]) => {
				if (!cancelled) setLocations(data || []);
			})
			.catch(() => {
				if (!cancelled) setError(true);
			})
			.finally(() => {
				if (!cancelled) setLoading(false);
			});
		return () => {
			cancelled = true;
		};
	}, []);

	return { locations, loading, error };
}
