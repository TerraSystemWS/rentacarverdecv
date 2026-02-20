// lib/api/endpoints.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8090";

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
		create: "/dashboard/users",
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
		create: "/dashboard/bookings",
		update: (id: number) => `/dashboard/bookings/${id}`,
		updateStatus: (id: number) => `/dashboard/bookings/${id}/status`,
		delete: (id: number) => `/dashboard/bookings/${id}`,
		createPublic: "/public/bookings",
	},
	messages: {
		list: (limit = 100) => `/dashboard/messages?limit=${limit}`,
	},
	partners: {
		list: "/public/partners",
		dashboard: "/dashboard/partners",
		create: "/dashboard/partners",
		update: (id: number) => `/dashboard/partners/${id}`,
		delete: (id: number) => `/dashboard/partners/${id}`,
	},
	posts: {
		list: "/public/posts",
		get: (slug: string) => `/public/posts/${slug}`,
		dashboard: "/dashboard/posts",
		create: "/dashboard/posts",
		update: (id: number) => `/dashboard/posts/${id}`,
		delete: (id: number) => `/dashboard/posts/${id}`,
	},
	gallery: {
		list: "/public/gallery",
		dashboard: "/dashboard/gallery",
		create: "/dashboard/gallery",
		update: (id: number) => `/dashboard/gallery/${id}`,
		delete: (id: number) => `/dashboard/gallery/${id}`,
	},
	ads: {
		list: "/public/ads",
		dashboard: "/dashboard/ads",
		create: "/dashboard/ads",
		update: (id: number) => `/dashboard/ads/${id}`,
		delete: (id: number) => `/dashboard/ads/${id}`,
	},
	content: {
		public: "/public/content",
		dashboard: "/dashboard/content",
		update: "/dashboard/content",
	},
	settings: {
		backupDb: "/dashboard/settings/backup/database",
		restoreDb: "/dashboard/settings/restore/database",
		backupUploads: "/dashboard/settings/backup/uploads",
		restoreUploads: "/dashboard/settings/restore/uploads",
	}
};
