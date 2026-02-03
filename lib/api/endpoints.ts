// lib/api/endpoints.ts
export const endpoints = {
	auth: {
		login: "/auth/login",
		me: "/auth/me",
		refresh: "/auth/refresh",
		logout: "/auth/logout",
	},
	dashboard: {
		summary: "/dashboard/summary",
	},
	users: {
		list: (limit = 100) => `/dashboard/users?limit=${limit}`,
	},
	vehicles: {
		list: (limit = 100) => `/public/vehicles?limit=${limit}`,
		get: (id: number) => `/public/vehicles/${id}`,
		create: "/dashboard/vehicles",
		update: (id: number) => `/dashboard/vehicles/${id}`,
		delete: (id: number) => `/dashboard/vehicles/${id}`,
	},
	bookings: {
		list: (limit = 100) => `/dashboard/bookings?limit=${limit}`,
	},
	messages: {
		list: (limit = 100) => `/dashboard/messages?limit=${limit}`,
	},
};
