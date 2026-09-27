// lib/api/endpoints.ts

// Usado pelo browser (client components, <img src>, URLs em HTML/meta tags)
// — tem de ser um endereço que o BROWSER do utilizador consiga resolver, por
// isso é sempre "localhost:PORTA" (a porta publicada do Docker), nunca o nome
// de um serviço do docker-compose.
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8090";

// Usado só por Server Components / código que corre dentro do próprio
// processo Next.js (SSR, generateMetadata, sitemap) — esse código corre
// DENTRO do container do frontend, onde "localhost:8090" é o próprio
// frontend, não o backend (estão em containers diferentes). Sem esta
// distinção, qualquer fetch feito num Server Component falhava sempre em
// Docker (connection refused), mesmo com o backend saudável — foi o que
// causava "Veículo não encontrado" na página de um veículo específico.
// INTERNAL_API_BASE_URL (sem NEXT_PUBLIC_, nunca é exposta ao browser) deve
// apontar para o nome do serviço Docker, ex: "http://backend:8090".
export const SERVER_API_BASE_URL = process.env.INTERNAL_API_BASE_URL || API_BASE_URL;

export const endpoints = {
	auth: {
		login: "/auth/login",
		me: "/auth/me",
		refresh: "/auth/refresh",
		logout: "/auth/logout",
		profile: "/auth/profile",
		licensePhoto: "/auth/profile/license-photo",
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
		get: (idOrSlug: number | string) => `/public/vehicles/${idOrSlug}`,
		dashboardList: "/dashboard/vehicles",
		create: "/dashboard/vehicles",
		update: (id: number) => `/dashboard/vehicles/${id}`,
		updateAvailability: (id: number) => `/dashboard/vehicles/${id}/availability`,
		updateStatus: (id: number) => `/dashboard/vehicles/${id}/status`,
		delete: (id: number) => `/dashboard/vehicles/${id}`,
		bookedDates: (id: number) => `/public/vehicles/${id}/booked-dates`,
	},
	bookings: {
		list: (limit = 100) => `/dashboard/bookings?limit=${limit}`,
		completed: "/dashboard/bookings/completed",
		me: "/dashboard/bookings/me",
		meHistory: (page = 0, size = 6) => `/dashboard/bookings/me/history?page=${page}&size=${size}`,
		create: "/dashboard/bookings",
		update: (id: number) => `/dashboard/bookings/${id}`,
		updateStatus: (id: number) => `/dashboard/bookings/${id}/status`,
		delete: (id: number) => `/dashboard/bookings/${id}`,
		createPublic: "/public/bookings",
		licensePhoto: (id: number) => `/dashboard/bookings/${id}/documents/license-photo`,
	},
	messages: {
		// Conversas (formulário de Contacto + caixa de email reservas@). Os ids
		// são da 1.ª mensagem de cada conversa.
		list: () => "/dashboard/messages",
		thread: (id: number) => `/dashboard/messages/${id}`,
		unreadCount: "/dashboard/messages/unread-count",
		mailStatus: "/dashboard/messages/mail-status",
		markRead: (id: number) => `/dashboard/messages/${id}/read`,
		markUnread: (id: number) => `/dashboard/messages/${id}/unread`,
		delete: (id: number) => `/dashboard/messages/${id}`,
		reply: (id: number) => `/dashboard/messages/${id}/reply`,
		compose: "/dashboard/messages/compose",
		resend: (messageId: number) => `/dashboard/messages/items/${messageId}/resend`,
		attachment: (attachmentId: number) => `/dashboard/messages/attachments/${attachmentId}`,
		create: "/public/messages",
	},
	subscribers: {
		list: "/dashboard/subscribers",
		delete: (id: number) => `/dashboard/subscribers/${id}`,
		unsubscribe: "/public/subscribers/unsubscribe",
		create: "/public/subscribers",
	},
	vouchers: {
		list: "/dashboard/vouchers",
		create: "/dashboard/vouchers",
		update: (id: number) => `/dashboard/vouchers/${id}`,
		delete: (id: number) => `/dashboard/vouchers/${id}`,
		validate: (code: string, vehicleId?: number) =>
			`/public/vouchers/validate?code=${encodeURIComponent(code)}${vehicleId ? `&vehicleId=${vehicleId}` : ""}`,
	},
	// Locais de levantamento/devolução (Operações → Locais).
	reviews: {
		public: (limit = 9) => `/public/reviews?limit=${limit}`,
		mine: "/dashboard/reviews/mine",
		dashboard: "/dashboard/reviews",
		status: (id: number) => `/dashboard/reviews/${id}/status`,
		delete: (id: number) => `/dashboard/reviews/${id}`,
	},
	themes: {
		active: "/public/theme",
		preview: (id: number) => `/public/themes/${id}`,
		dashboard: "/dashboard/themes",
		create: "/dashboard/themes",
		update: (id: number) => `/dashboard/themes/${id}`,
		activate: (id: number) => `/dashboard/themes/${id}/activate`,
		delete: (id: number) => `/dashboard/themes/${id}`,
	},
	destinationPlaces: {
		list: "/public/destination-places",
		dashboard: "/dashboard/destination-places",
		create: "/dashboard/destination-places",
		update: (id: number) => `/dashboard/destination-places/${id}`,
		delete: (id: number) => `/dashboard/destination-places/${id}`,
	},
	locations: {
		list: "/public/locations",
		dashboard: "/dashboard/locations",
		create: "/dashboard/locations",
		update: (id: number) => `/dashboard/locations/${id}`,
		delete: (id: number) => `/dashboard/locations/${id}`,
	},
	partners: {
		list: "/public/partners",
		dashboard: "/dashboard/partners",
		create: "/dashboard/partners",
		update: (id: number) => `/dashboard/partners/${id}`,
		delete: (id: number) => `/dashboard/partners/${id}`,
		updateStatus: (id: number) => `/dashboard/partners/${id}/status`,
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
	drivers: {
		list: "/public/drivers",
		dashboard: "/dashboard/drivers",
		create: "/dashboard/drivers",
		update: (id: number) => `/dashboard/drivers/${id}`,
		delete: (id: number) => `/dashboard/drivers/${id}`,
		updateStatus: (id: number) => `/dashboard/drivers/${id}/status`,
	},
	ads: {
		list: (placement: string) => `/public/ads?placement=${encodeURIComponent(placement)}`,
		click: (id: number) => `/public/ads/${id}/click`,
		dashboard: "/dashboard/ads",
		create: "/dashboard/ads",
		update: (id: number) => `/dashboard/ads/${id}`,
		delete: (id: number) => `/dashboard/ads/${id}`,
		updateStatus: (id: number) => `/dashboard/ads/${id}/status`,
	},
	archived: {
		summary: "/dashboard/archived",
	},
	media: {
		list: (category?: string) => `/dashboard/media${category ? `?category=${encodeURIComponent(category)}` : ""}`,
		upload: "/dashboard/media/upload",
		delete: (id: number) => `/dashboard/media/${id}`,
	},
	comments: {
		list: (slug: string) => `/public/posts/${slug}/comments`,
		create: (slug: string) => `/public/posts/${slug}/comments`,
	},
	content: {
		public: "/public/content",
		dashboard: "/dashboard/content",
		update: "/dashboard/content",
		stats: "/public/stats",
	},
	settings: {
		backupDb: "/dashboard/settings/backup/database",
		restoreDb: "/dashboard/settings/restore/database",
		backupUploads: "/dashboard/settings/backup/uploads",
		restoreUploads: "/dashboard/settings/restore/uploads",
	},
	payment: {
		summary: (bookingId: number) => `/public/payment/${bookingId}`,
		init: (bookingId: number) => `/public/payment/init/${bookingId}`,
	},
	notifications: {
		list: "/dashboard/notifications",
		unreadCount: "/dashboard/notifications/unread-count",
		markRead: (id: number) => `/dashboard/notifications/${id}/read`,
		markAllRead: "/dashboard/notifications/read-all",
		stream: "/dashboard/notifications/stream",
	},
	invoices: {
		list: "/dashboard/invoices",
		mine: "/dashboard/invoices/mine",
		pdf: (id: number) => `/dashboard/invoices/${id}/pdf`,
		verify: (doc: string, sig: string) => `/public/invoices/verify?doc=${encodeURIComponent(doc)}&sig=${encodeURIComponent(sig)}`,
	},
	companyProfile: {
		get: "/dashboard/company-profile",
		update: "/dashboard/company-profile",
		logo: "/dashboard/company-profile/logo",
		public: "/public/company-profile",
	},
};
