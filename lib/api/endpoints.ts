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
		list: (limit = 100) => `/users?limit=${limit}`,
	},
	vehicles: {
		list: (limit = 100) => `/vehicles?limit=${limit}`,
		get: (id: number) => `/vehicles/${id}`,
		create: "/vehicles",
		update: (id: number) => `/vehicles/${id}`,
		delete: (id: number) => `/vehicles/${id}`,
	},
	bookings: {
		list: (limit = 100) => `/bookings?limit=${limit}`,
	},
	messages: {
		list: (limit = 100) => `/messages?limit=${limit}`,
	},
};
