"use client";

import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useLocale, useTranslations } from "next-intl";
import { Clock } from "lucide-react";
import { dateFnsLocale, PICKER_DATE_FORMAT } from "@/lib/i18n/dateLocale";
import { useVehicleTerms } from "@/lib/i18n/useVehicleTerms";
import { useFormatPrice } from "@/lib/i18n/format";
import VehicleGallery from "./veiculoGalery";
import PopularVehicleBlock from "../../PopularVehicleBlock";
import VehicleReviews from "../../reviews/VehicleReviews";
import { endpoints } from "@/lib/api/endpoints";
import {
	Car,
	Settings2,
	Gauge,
	Users as UsersIcon,
	Fuel,
	Briefcase,
	Zap,
	DoorOpen,
	Cpu,
	Wallet
} from "lucide-react";

import { Vehicle } from "@/lib/api/types";
import { useAuth } from "@/app/auth/AuthContext";
import { API_BASE_URL } from "@/lib/api/endpoints";
import { cvToIso, localDateString, parseLocalDate } from "@/lib/utils/cvTime";
import { useRentalLocations } from "@/lib/api/useRentalLocations";
import { tr, trList } from "@/lib/i18n/translate";
import { rememberedVoucher } from "@/lib/voucherParam";
import DiscountRibbon from "../DiscountRibbon";

interface VehicleSingleProps {
	vehicle: Vehicle;
}

const VehicleSingle: React.FC<VehicleSingleProps> = ({ vehicle }) => {
	const { user, isAuthenticated, authFetch } = useAuth();
	const t = useTranslations("carDetail");
	const tv = useTranslations("vehicle");
	const tSearch = useTranslations("search");
	const tExpiry = useTranslations("unpaidExpiry");
	const locale = useLocale();
	const term = useVehicleTerms();
	const price = useFormatPrice();
	const [formData, setFormData] = useState({
		pickupLocation: "",
		returnLocation: "",
		startDate: "",
		endDate: "",
		startTime: "10:00",
		endTime: "10:00",
		hasExtraDriver: false,
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [message, setMessage] = useState<{ type: 'success' | 'error', text: React.ReactNode } | null>(null);
	const [bookedIntervals, setBookedIntervals] = useState<{ start: Date; end: Date }[]>([]);
	const { locations, loading: locationsLoading } = useRentalLocations();

	// Código promocional: validado pela API (/public/vouchers/validate) só para
	// mostrar o desconto antes de reservar; quem o aplica de facto é a criação
	// da reserva (VoucherService.redeem), que volta a validar tudo.
	const [voucherInput, setVoucherInput] = useState("");
	const [voucher, setVoucher] = useState<{ code: string; percent: number } | null>(null);
	const [voucherError, setVoucherError] = useState<string | null>(null);
	const [voucherChecking, setVoucherChecking] = useState(false);

	const applyVoucher = async (raw: string) => {
		const code = raw.trim().toUpperCase();
		setVoucherError(null);
		if (!code) {
			setVoucher(null);
			return;
		}
		setVoucherChecking(true);
		try {
			const res = await authFetch(endpoints.vouchers.validate(code, vehicle.id));
			const data = await res.json().catch(() => ({}));
			if (res.ok && data.discountPercent) {
				setVoucher({ code, percent: data.discountPercent });
			} else {
				setVoucher(null);
				setVoucherError(data.message || t("voucher.invalid"));
			}
		} catch {
			setVoucher(null);
			setVoucherError(t("errors.connection"));
		} finally {
			setVoucherChecking(false);
		}
	};

	// Código vindo do link do email (?voucher=…) — pré-preenchido e já validado.
	useEffect(() => {
		if (!vehicle.id) return;
		const code = rememberedVoucher();
		if (code) {
			setVoucherInput(code);
			applyVoucher(code);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [vehicle.id]);

	// Total estimado, com as mesmas contas da API (dias inteiros, mínimo 1;
	// condutor extra 3300 CVE/dia; desconto do voucher sobre o total).
	const estimate = (() => {
		if (!formData.startDate || !formData.endDate || !vehicle.pricePerDay) return null;
		const start = new Date(cvToIso(formData.startDate, formData.startTime));
		const end = new Date(cvToIso(formData.endDate, formData.endTime));
		if (!(end > start)) return null;
		const days = Math.max(1, Math.floor((end.getTime() - start.getTime()) / 86_400_000));
		const base = Number(vehicle.pricePerDay) * days + (formData.hasExtraDriver ? 3300 * days : 0);
		const total = voucher ? base * (100 - voucher.percent) / 100 : base;
		return { days, base, total };
	})();

	// Com os locais carregados, pré-seleciona o primeiro para levantamento e
	// devolução (o cliente pode mudar qualquer um).
	useEffect(() => {
		if (locations.length === 0) return;
		setFormData(prev => ({
			...prev,
			pickupLocation: prev.pickupLocation || String(locations[0].id),
			returnLocation: prev.returnLocation || String(locations[0].id),
		}));
	}, [locations]);

	useEffect(() => {
		if (!vehicle.id) return;
		let cancelled = false;
		fetch(`${API_BASE_URL}${endpoints.vehicles.bookedDates(vehicle.id)}`)
			.then(res => res.ok ? res.json() : [])
			.then((data: { startDate: string; endDate: string }[]) => {
				if (cancelled) return;
				setBookedIntervals(
					(data || []).map(d => ({ start: new Date(d.startDate), end: new Date(d.endDate) }))
				);
			})
			.catch(() => { /* não bloquear o formulário se a consulta falhar */ });
		return () => { cancelled = true; };
	}, [vehicle.id]);

	const rangeOverlapsBooking = (start: Date, end: Date) =>
		bookedIntervals.some(b => start < b.end && end > b.start);

	const getImageSrc = (url: string) => {
		if (!url) return "";
		if (url.startsWith('/uploads')) {
			return `${API_BASE_URL}${url} `;
		}
		return url;
	};

	const galleryImages = vehicle.images?.map(img => ({
		src: getImageSrc(img.url),
		alt: `${vehicle.make} ${vehicle.model} `
	})) || [];

	const overview = [
		{ label: t("specs.class"), value: term(vehicle.classType), icon: Car },
		{ label: t("specs.gearbox"), value: term(vehicle.gearbox), icon: Settings2 },
		{ label: t("specs.mileage"), value: vehicle.mileage, icon: Gauge },
		{ label: t("specs.seats"), value: vehicle.maxPassengers, icon: UsersIcon },
		{ label: t("specs.fuel"), value: term(vehicle.fuelType), icon: Fuel },
		{ label: t("specs.luggage"), value: vehicle.maxLuggage, icon: Briefcase },
		{ label: t("specs.consumption"), value: vehicle.fuelUsage, icon: Zap },
		{ label: t("specs.doors"), value: vehicle.doors, icon: DoorOpen },
		{ label: t("specs.engine"), value: vehicle.engineCapacity, icon: Cpu },
		{ label: t("specs.deposit"), value: vehicle.deposit ? `${vehicle.deposit} CVE` : "", icon: Wallet },
	];

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value, type } = e.target;
		if (type === 'checkbox') {
			const checked = (e.target as HTMLInputElement).checked;
			setFormData(prev => ({ ...prev, [name]: checked }));
		} else {
			setFormData(prev => ({ ...prev, [name]: value }));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!isAuthenticated || !user?.id) {
			setMessage({ type: 'error', text: t("errors.loginRequired") });
			return;
		}

		if (!formData.startDate || !formData.endDate || !formData.pickupLocation || !formData.returnLocation) {
			setMessage({ type: 'error', text: t("errors.requiredFields") });
			return;
		}

		// Hora escolhida = hora de Cabo Verde (onde se levanta a viatura).
		const start = new Date(cvToIso(formData.startDate, formData.startTime));
		const end = new Date(cvToIso(formData.endDate, formData.endTime));

		if (start >= end) {
			setMessage({ type: 'error', text: t("errors.returnBeforePickup") });
			return;
		}

		if (rangeOverlapsBooking(start, end)) {
			setMessage({ type: 'error', text: t("errors.alreadyBooked") });
			return;
		}

		setIsSubmitting(true);
		setMessage(null);

		try {
			const res = await authFetch("/public/bookings", {
				method: "POST",
				body: JSON.stringify({
					vehicleId: vehicle.id,
					userId: user.id,
					startDate: start.toISOString(),
					endDate: end.toISOString(),
					hasExtraDriver: formData.hasExtraDriver,
					pickupLocationId: Number(formData.pickupLocation),
					returnLocationId: Number(formData.returnLocation),
					// Escrito mas não "Aplicado" também vai — a API valida e responde com o erro.
					voucherCode: voucherInput.trim() ? voucherInput.trim().toUpperCase() : undefined
				})
			});

			if (res.ok) {
				const bookingData = await res.json();
				setMessage({ type: 'success', text: t("success") });

				// Redirect to payment page after a short delay
				setTimeout(() => {
					window.location.href = `/payment/${bookingData.id}`;
				}, 1500);
			} else {
				const errorData = await res.json().catch(() => ({ message: t("errors.generic") }));
				if (errorData.code === "PROFILE_INCOMPLETE") {
					setMessage({
						type: 'error',
						text: t.rich("errors.profileIncomplete", {
							message: errorData.message,
							link: (chunks) => <a href="/profile?tab=dados" className="font-bold underline">{chunks}</a>,
						}),
					});
				} else if (errorData.code === "EMAIL_NOT_VERIFIED") {
					setMessage({
						type: 'error',
						text: t.rich("errors.emailNotVerified", {
							message: errorData.message,
							link: (chunks) => <a href="/profile" className="font-bold underline">{chunks}</a>,
						}),
					});
				} else {
					setMessage({ type: 'error', text: errorData.message || t("errors.generic") });
				}
			}
		} catch (error) {
			console.error("Booking error:", error);
			setMessage({ type: 'error', text: t("errors.connection") });
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<>
			<div className="vehicle-single-block vehicle-padding">
				<div className="container">
					<div className="row">
						{/* Main content */}
						<div className="col-md-8">
							<VehicleGallery images={galleryImages} />
							{/* Vehicle Info */}
							<div className="vehicle-single-content">
								<div className="tb mb-block">
									<div className="tb-cell mb-block">
										<h2 className="vehicle-single-title">{vehicle.make} {vehicle.model} ({vehicle.year})</h2>
									</div>
									<div className="tb-cell mb-block">
										<h2 className="pull-right rent-price">
											{t("pricePerDay", { price: price(vehicle.pricePerDay) })}
										</h2>
									</div>
								</div>

								{/* Overview */}
								<div className="vehicle-overview">
									<h3 className="overview-title">{t("details")}</h3>
									<ul className="grid grid-cols-2 md:grid-cols-3 gap-6">
										{overview.map((item, idx) => {
											const Icon = item.icon;
											return (
												<li key={idx} className="flex items-center gap-3">
													<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary shadow-sm border border-primary/5">
														<Icon className="w-5 h-5" />
													</div>
													<div className="flex flex-col">
														<span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">{item.label}</span>
														<span className="text-sm font-extrabold text-foreground leading-tight">{item.value || tv("notAvailable")}</span>
													</div>
												</li>
											);
										})}
									</ul>
								</div>

								{/* Features */}
								<div className="vehicle-internal-features">
									<div className="row">
										<div className="col-md-6">
											<h3 className="features-title">{t("internalFeatures")}</h3>
											<ul className="features-list">
												{trList(vehicle, "internalFeatures", locale).map((feature, idx) => (
													<li key={idx}>{feature}</li>
												))}
												{trList(vehicle, "internalFeatures", locale).length === 0 && (
													<li className="text-muted-foreground opacity-50 italic">{t("none")}</li>
												)}
											</ul>
										</div>
										<div className="col-md-6">
											<h3 className="features-title">{t("externalFeatures")}</h3>
											<ul className="features-list">
												{trList(vehicle, "externalFeatures", locale).map((feature, idx) => (
													<li key={idx}>{feature}</li>
												))}
												{trList(vehicle, "externalFeatures", locale).length === 0 && (
													<li className="text-muted-foreground opacity-50 italic">{t("none")}</li>
												)}
											</ul>
										</div>
									</div>
								</div>
							</div>
							<div className="hidden-md hidden-lg text-center extend-btn">
								<span className="extend-icon">
									<i className="fa fa-angle-down"></i>
								</span>
							</div>
						</div>
						{/* Sidebar */}
						<div className="col-md-4">
							<div className="vehicle-sidebar pd-zero">
								<form className="advance-search-query search-query-two" onSubmit={handleSubmit}>
									<h2 className="form-title">{t("bookTitle")}</h2>
									<div className="form-content available-filter">
										<DiscountRibbon percent={vehicle.discountPercent} inline />

										{message && (
											<div role={message.type === 'error' ? 'alert' : 'status'} className={`p-4 mb-4 text-sm rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
												{message.text}
											</div>
										)}

										{!isAuthenticated && (
											<div className="p-4 mb-6 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
												<i className="fa fa-info-circle mr-2"></i>
												{t.rich("loginRequired", { strong: (chunks) => <a href="/login"><strong>{chunks}</strong></a> })}
											</div>
										)}

										<div className="regular-search">
											<div className="form-group">
												<label className="text-uppercase">{t("pickupLocation")}</label>
												<div className="input">
													<i className="fa fa-map-marker"></i>
													<select
														name="pickupLocation"
														value={formData.pickupLocation}
														onChange={handleInputChange}
														className="form-controller"
														required
														disabled={!isAuthenticated || locationsLoading}
													>
														<option value="">{locationsLoading ? tSearch("loadingLocations") : tSearch("chooseLocation")}</option>
														{locations.map((l) => (
															<option key={l.id} value={l.id}>{tr(l, "name", locale)}</option>
														))}
													</select>
												</div>

												<label className="text-uppercase">{t("returnLocation")}</label>
												<div className="input">
													<i className="fa fa-map-marker"></i>
													<select
														name="returnLocation"
														value={formData.returnLocation}
														onChange={handleInputChange}
														className="form-controller"
														required
														disabled={!isAuthenticated || locationsLoading}
													>
														<option value="">{locationsLoading ? tSearch("loadingLocations") : tSearch("chooseLocation")}</option>
														{locations.map((l) => (
															<option key={l.id} value={l.id}>{tr(l, "name", locale)}</option>
														))}
													</select>
												</div>

												<label>{t("pickupDate")}</label>
												<div className="input relative">
													<i className="fa fa-calendar absolute right-3 top-3 text-gray-400 z-10 pointer-events-none"></i>
													<DatePicker
														selected={formData.startDate ? parseLocalDate(formData.startDate) : null}
														onChange={(date: Date | null) => {
															setFormData(prev => ({
																...prev,
																startDate: date ? localDateString(date) : ""
															}));
														}}
														dateFormat={PICKER_DATE_FORMAT}
														locale={dateFnsLocale(locale)}
														minDate={new Date()}
														excludeDateIntervals={bookedIntervals}
														className="form-controller w-full bg-transparent"
														placeholderText={tSearch("datePlaceholder")}
														required
														disabled={!isAuthenticated}
													/>
												</div>

												<label>{t("returnDate")}</label>
												<div className="input relative">
													<i className="fa fa-calendar absolute right-3 top-3 text-gray-400 z-10 pointer-events-none"></i>
													<DatePicker
														selected={formData.endDate ? parseLocalDate(formData.endDate) : null}
														onChange={(date: Date | null) => {
															setFormData(prev => ({
																...prev,
																endDate: date ? localDateString(date) : ""
															}));
														}}
														dateFormat={PICKER_DATE_FORMAT}
														locale={dateFnsLocale(locale)}
														minDate={formData.startDate ? parseLocalDate(formData.startDate) ?? new Date() : new Date()}
														excludeDateIntervals={bookedIntervals}
														className="form-controller w-full bg-transparent"
														placeholderText={tSearch("datePlaceholder")}
														required
														disabled={!isAuthenticated}
													/>
												</div>

												<div className="row">
													<div className="col-xs-6">
														<label>{t("pickupTime")}</label>
														<div className="input">
															<i className="fa fa-clock-o"></i>
															<input
																type="time"
																name="startTime"
																value={formData.startTime}
																onChange={handleInputChange}
																className="form-controller"
																required
																disabled={!isAuthenticated}
															/>
														</div>
													</div>
													<div className="col-xs-6">
														<label>{t("returnTime")}</label>
														<div className="input">
															<i className="fa fa-clock-o"></i>
															<input
																type="time"
																name="endTime"
																value={formData.endTime}
																onChange={handleInputChange}
																className="form-controller"
																required
																disabled={!isAuthenticated}
															/>
														</div>
													</div>
												</div>
											</div>

											<div className="mt-4 mb-2 flex items-center">
												<input
													type="checkbox"
													id="hasExtraDriver"
													name="hasExtraDriver"
													checked={formData.hasExtraDriver}
													onChange={handleInputChange}
													disabled={!isAuthenticated}
													className="w-5 h-5 mr-3 text-green-600 rounded focus:ring-green-500 cursor-pointer"
												/>
												<label htmlFor="hasExtraDriver" className="text-gray-700 m-0 cursor-pointer select-none">
													{t("extraDriver")} <span className="text-green-600 font-bold">{t("extraDriverPrice")}</span>
												</label>
											</div>
										</div>

										<div className="mt-4">
											<label htmlFor="voucherCode" className="text-uppercase">{t("voucher.label")}</label>
											<div className="flex gap-2">
												<div className="input flex-1">
													<i className="fa fa-tag"></i>
													<input
														id="voucherCode"
														type="text"
														value={voucherInput}
														onChange={(e) => {
															setVoucherInput(e.target.value.toUpperCase());
															setVoucher(null);
															setVoucherError(null);
														}}
														onKeyDown={(e) => {
															if (e.key === "Enter") {
																e.preventDefault();
																applyVoucher(voucherInput);
															}
														}}
														placeholder={t("voucher.placeholder")}
														className="form-controller uppercase tracking-wider"
														autoComplete="off"
														disabled={!isAuthenticated}
													/>
												</div>
												<button
													type="button"
													onClick={() => applyVoucher(voucherInput)}
													disabled={!isAuthenticated || voucherChecking || !voucherInput.trim()}
													// "!": o CSS legado põe todos os botões deste formulário a branco.
													className="h-12 self-start px-4 rounded-lg border border-green-600 !bg-white !text-green-700 font-bold !text-sm hover:!bg-green-50 disabled:opacity-50"
												>
													{voucherChecking ? "…" : t("voucher.apply")}
												</button>
											</div>
											{voucher && (
												<p role="status" className="mt-2 text-sm font-semibold text-green-700">
													{t("voucher.applied", { code: voucher.code, percent: voucher.percent })}
												</p>
											)}
											{voucherError && <p role="alert" className="mt-2 text-sm text-red-700">{voucherError}</p>}
										</div>

										{estimate && (
											<div className="mt-4 p-3 rounded-lg bg-green-50 border border-green-200 flex justify-between items-baseline">
												<span className="text-sm text-gray-700">{t("voucher.estimate", { days: estimate.days })}</span>
												<span className="text-right">
													{voucher && <span className="block text-xs text-gray-500 line-through">{price(estimate.base)}</span>}
													<span className="font-black text-green-700 text-lg">{price(estimate.total)}</span>
												</span>
											</div>
										)}

										{/* O servidor cancela as reservas por pagar ao fim de 2 h (BookingExpiryService). */}
										<p className="mt-4 mb-0 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
											<Clock className="h-4 w-4 mt-0.5 shrink-0" aria-hidden="true" />
											<span>{tExpiry("formNote")}</span>
										</p>

										<div className="check-vehicle-footer">
											<button
												type="submit"
												className="button yellow-button w-full disabled:opacity-50"
												disabled={isSubmitting || !isAuthenticated}
											>
												{isSubmitting ? t("submitting") : t("submit")}
											</button>
										</div>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>

			{vehicle.id && <VehicleReviews vehicleId={vehicle.id} average={vehicle.ratingAverage} />}

			<PopularVehicleBlock />
		</>
	);
};

export default VehicleSingle;
