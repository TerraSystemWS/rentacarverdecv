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
};

export type UserRow = {
	id: number;
	full_name: string;
	email: string | null;
	phone: string | null;
	is_active: boolean;
	created_at: string;
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
	status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
	start_at: string;
	end_at: string;
	grand_total: number;
	currency: string;
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
	is_main?: boolean;
};

export type PriceDetail = {
	id?: number;
	condition_text: string; // e.g., "1-3 days"
	price: number;
};

export type OverviewItem = {
	id?: number;
	icon?: string;
	text: string; // e.g., "Automatic", "4 Doors"
};

export type Feature = {
	id?: number;
	name: string; // e.g., "Air Conditioning"
	available: boolean;
};

export type Vehicle = {
	id?: number;
	title: string;
	rent_per_day: number;
	rent_currency: string;
	rent_text?: string;
	description?: string;
	images?: VehicleImage[];
	price_details?: PriceDetail[]; // Note: Backend uses 'priceDetails' (camelCase)? Let's check consistency. 
	// Wait, the backend shows: vehicle.getPriceDetails(). It likely serializes to camelCase or snake_case depending on config.
	// The existing 'VehicleRow' used snake_case for 'rent_per_day'.
	// Assuming standard Java serialization often defaults to camelCase unless @JsonProperty is used.
	// However, the existing 'VehicleRow' has 'rent_per_day'.
	// Let's stick to matching the likely JSON output. If the backend is standard Spring Boot + Jackson, it's camelCase by default.
	// BUT the 'VehicleRow' in this file has 'rent_per_day'. It implies the database or DTO mapping might vary.
	// I will double check the backend snippet. 
	// Backend: existingVehicle.setRentPerDay(vehicleDetails.getRentPerDay());
	// If the backend accepts snake_case JSON, good. If not, we might need adjustments.
	// Let's use camelCase for the full object to match typical Java binding, 
	// but the Row type suggests a possibility of snake_case.
	// Let's assume camelCase for the Nested Objects as per standard Spring, but I'll write 'priceDetails' here.

	priceDetails?: PriceDetail[];
	overviewItems?: OverviewItem[];
	features?: Feature[];

	created_at?: string;
	updated_at?: string;
};

