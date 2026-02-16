// lib/api/types.ts
export type Role = "ADMIN" | "STAFF" | "CUSTOMER";

export type SessionUser = {
	id?: number;
	fullName: string;
	email: string;
	role: Role;
	username?: string;
	enabled?: boolean;
	roles?: Role[];
};

export type LoginRequest = { username: string; password: string };

export type AuthTokens = {
	accessToken: string;
	refreshToken: string;
	tokenType: string;
};

export type LoginResponse = AuthTokens & {
	user: SessionUser;
};

export type MeResponse = {
	id: string;
	username: string;
	email: string;
	enabled: boolean;
	roles: string[];
};

export type DashboardSummary = {
	users: number;
	vehicles: number;
	activeBookings: number;
	unreadRecipients: number;
	totalIncome: number;
	monthlyRevenue: Record<string, number>;
	revenueByStatus: Record<string, number>;
};

export type UserRow = {
	id: string; // UUID in backend
	full_name: string;
	email: string | null;
	phone?: string | null;
	is_active: boolean;
	created_at: string;
	roles?: string[];
};

export type VehicleRow = {
	id: number;
	title: string;
	rent_per_day: number | null;
	rent_currency: string | null;
	created_at: string;
};

export type BookingRow = {
	id: number;
	customer_name: string;
	vehicle_title: string;
	status: "PENDENTE" | "CONFIRMADA" | "EM_CURSO" | "CONCLUÍDA" | "CANCELADA";
	start_at: string;
	end_at: string;
	grand_total: number;
	created_at: string;
};


export type MessageRow = {
	id: number;
	sender_type: "system" | "admin";
	sender_name: string | null;
	subject: string;
	delivery: "in_app" | "email" | "sms" | "whatsapp";
	recipients: number;
	created_at: string;
};

// --- Full Vehicle Types ---

export type VehicleImage = {
	id?: number;
	url: string;
};

export type Vehicle = {
	id?: number;
	make: string;
	model: string;
	year: number;
	licensePlate: string;
	pricePerDay: number;
	available: boolean;
	images: VehicleImage[];
	classType?: string;
	gearbox?: string;
	mileage?: string;
	maxPassengers?: number;
	fuelType?: string;
	maxLuggage?: number;
	fuelUsage?: string;
	doors?: number;
	engineCapacity?: string;
	deposit?: number;
	internalFeatures?: string[];
	externalFeatures?: string[];
};

export type Partner = {
	id?: number;
	name: string;
	logoUrl?: string;
	websiteUrl?: string;
};

export type Post = {
	id?: number;
	title: string;
	slug: string;
	content: string;
	summary?: string;
	imageUrl?: string;
	author?: string;
	status: "DRAFT" | "PUBLISHED";
	createdAt?: string;
	updatedAt?: string;
};
