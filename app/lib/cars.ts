// cars.ts
export type Car = {
	id: number;
	modelo: string;
	precoDia: number;
	precoKm: number;
	imagem: string;
	link?: string;
};

export const carros: Car[] = [];
