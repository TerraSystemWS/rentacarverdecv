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

export type LoginRequest = { email: string; password: string };

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
	// Contagens para a tendência das caixas: últimos 30 dias vs. 30 anteriores.
	newUsers30d: number;
	newUsersPrev30d: number;
	newBookings30d: number;
	newBookingsPrev30d: number;
	unreadRecipients: number;
	totalIncome: number;
	dailyIncome: number;
	weeklyIncome: number;
	monthlyIncome: number;
	pendingIncome: number;
	monthlyRevenue: Record<string, number>;
	revenueByStatus: Record<string, number>;
};

// Local de levantamento/devolução (Operações → Locais no dashboard).
export type RentalLocation = {
	id: number;
	name: string;
	address: string | null;
	active: boolean;
	sortOrder: number;
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
	vehicle_id: number;
	customer_name: string;
	vehicle_title: string;
	status: "PENDENTE" | "APROVADA" | "PAGA" | "EM_CURSO" | "CONCLUÍDA" | "CANCELADA";
	payment_status?: "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED";
	merchant_ref?: string;
	start_at: string;
	end_at: string;
	grand_total: number;
	created_at: string;
	has_extra_driver?: boolean;
	voucher_code?: string | null;
	discount_percent?: number | null;
	pickup_location?: string | null;
	return_location?: string | null;
	subtotal?: number;
	iva_rate?: number;
	iva_amount?: number;
	picked_up_at?: string | null;
	returned_at?: string | null;
	has_license_photo?: boolean;
};

export type PagedBookings = {
	content: BookingRow[];
	page: number;
	size: number;
	total_elements: number;
	total_pages: number;
};


// Mensagens do dashboard — ver ContactMessageController
export type MessageSource = "FORM" | "EMAIL" | "REPLY" | "SYSTEM";

// Uma conversa na lista (id = 1.ª mensagem da conversa).
export type MessageThreadSummary = {
	id: number;
	name: string;
	email: string;
	subject: string | null;
	preview: string;
	source: MessageSource;
	lastDirection: "IN" | "OUT";
	lastFailed: boolean;
	count: number;
	unread: number;
	read: boolean;
	createdAt: string;
	lastAt: string;
};

export type MessageAttachment = {
	id: number;
	filename: string;
	contentType: string;
	size: number;
	// Ver AttachmentPolicy no backend: WARN pede confirmação antes de
	// descarregar; BLOCKED não tem ficheiro no servidor.
	risk: "SAFE" | "WARN" | "BLOCKED";
	blockedReason: "DANGEROUS_TYPE" | "TOO_LARGE" | null;
};

export type MessageItem = {
	id: number;
	direction: "IN" | "OUT";
	source: MessageSource;
	name: string;
	email: string;
	toEmail: string | null;
	subject: string | null;
	message: string;
	html: string | null; // já sanitizado no backend
	read: boolean;
	sentBy: string | null;
	deliveryStatus: "PENDING" | "SENT" | "FAILED" | null;
	deliveryError: string | null;
	createdAt: string;
	attachments: MessageAttachment[];
};

export type MessageThread = {
	id: number;
	name: string;
	email: string;
	subject: string | null;
	canReply: boolean;
	messages: MessageItem[];
};

// --- Full Vehicle Types ---

export type VehicleImage = {
	id?: number;
	url: string;
};

export type Vehicle = {
	id?: number;
	slug?: string;
	make: string;
	model: string;
	year: number;
	licensePlate: string;
	pricePerDay: number;
	available: boolean;
	status?: "ACTIVE" | "MAINTENANCE" | "ARCHIVED";
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
	status?: "ACTIVE" | "ARCHIVED";
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
	// Envio aos subscritores da newsletter (feito pelo servidor na 1.ª publicação)
	newsletterSentAt?: string | null;
	newsletterRecipients?: number | null;
};

export type GalleryItem = {
	id?: number;
	title?: string;
	imageUrl: string;
	category?: string;
	description?: string;
	createdAt?: string;
};

export type Advertisement = {
	id?: number;
	title: string;
	imageUrl: string;
	linkUrl?: string;
	placement: "BANNER" | "SIDEBAR" | "POPUP";
	active: boolean;
	status?: "ACTIVE" | "ARCHIVED";
	priority: number;
	clickCount?: number;
	vehicleId?: number | null;
	vehicleTitle?: string | null;
	voucherId?: number | null;
	voucherCode?: string | null;
	createdAt?: string;
	updatedAt?: string;
};

export type Driver = {
	id?: number;
	name: string;
	description: string;
	imageUrl: string;
	status?: "ACTIVE" | "ARCHIVED";
};

export type Subscriber = {
	id: number;
	email: string;
	createdAt: string;
};

export type Voucher = {
	id?: number;
	code: string;
	discountPercent: number;
	scope: "ALL" | "VEHICLE" | "CLASS";
	vehicleId?: number | null;
	vehicleTitle?: string | null;
	classType?: string | null;
	active: boolean;
	maxUses?: number | null;
	usedCount?: number;
	validFrom?: string | null;
	validUntil?: string | null;
	maxUsesPerCustomer?: number | null;
	usable?: boolean;
};

export type Invoice = {
	id: number;
	documentNumber: string;
	bookingId: number;
	vehicleTitle: string;
	customerName: string;
	customerEmail: string | null;
	customerNif: string | null;
	totalAmount: string;
	subtotal?: string | null;
	ivaRate?: string | null;
	ivaAmount?: string | null;
	createdAt: string;
};

export type CompanyProfile = {
	name: string;
	legalName: string | null;
	nif: string;
	address: string | null;
	email: string | null;
	logoUrl: string | null;
	ivaRate?: string;
	facebookUrl?: string | null;
	instagramUrl?: string | null;
	twitterUrl?: string | null;
	whatsappUrl?: string | null;
};

export type CustomerProfile = {
	id: string;
	username: string;
	email: string;
	fullName: string | null;
	phone: string | null;
	address: string | null;
	zipCode: string | null;
	city: string | null;
	countryCode: string | null;
	country: string | null;
	nationality: string | null;
	birthDate: string | null;
	placeOfBirth: string | null;
	idNumber: string | null;
	idIssuedBy: string | null;
	idIssuedAt: string | null;
	idExpiresAt: string | null;
	licenseNumber: string | null;
	licenseIssuedBy: string | null;
	licenseIssuedAt: string | null;
	licenseExpiresAt: string | null;
	hasLicensePhoto: boolean;
	licensePhotoUploadedAt: string | null;
	profileComplete: boolean;
};

export type MediaAsset = {
	id: number;
	originalFilename: string;
	storedFilename: string;
	url: string;
	category: string;
	contentType?: string | null;
	sizeBytes?: number | null;
	uploadedAt: string;
};

export type PostComment = {
	id: number;
	authorName: string;
	message: string;
	createdAt: string;
};

export type AppNotification = {
	id: number;
	type: "BOOKING" | "CONTACT_MESSAGE";
	title: string;
	body: string | null;
	linkUrl: string | null;
	relatedEntityId: number | null;
	read: boolean;
	createdAt: string;
};

// GET /public/payment/{bookingId} — ver PaymentController.summary()
export type PaymentSummary = {
	bookingId: number;
	vehicle: string;
	startDate: string;
	endDate: string;
	hasExtraDriver: boolean;
	discountPercent: number | null;
	totalPrice: number;
	amountCve: number;
	status: string;
	paymentStatus: string;
	merchantRef: string | null;
	payable: boolean;
	customerName: string | null;
	customerEmail: string | null;
	billingAddress: string | null;
	billingCity: string | null;
	billingPostCode: string | null;
	billingCountryCode: string | null;
	profileComplete: boolean;
	lastAttempt?: {
		merchantRef: string;
		status: string;
		panMasked: string | null;
		errorMessage: string | null;
		createdAt: string;
		respondedAt: string | null;
	};
};

// POST /public/payment/init/{bookingId}
export type PaymentInitResponse = {
	actionUrl: string;
	fields: Record<string, string>;
};
