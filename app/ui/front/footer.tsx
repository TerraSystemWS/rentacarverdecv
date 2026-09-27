"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { endpoints, API_BASE_URL } from "@/lib/api/endpoints";
import { authFetch } from "@/app/auth/api";
import { CompanyProfile } from "@/lib/api/types";
import PaymentBrands from "@/app/ui/front/payment/PaymentBrands";
import { useTranslations } from "next-intl";

interface GalleryItem {
	id: number;
	imageUrl: string;
	title: string;
}

const Footer = () => {
	const t = useTranslations("footer");
	const [gallery, setGallery] = useState<GalleryItem[]>([]);
	const [newsletterEmail, setNewsletterEmail] = useState("");
	const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
	const [company, setCompany] = useState<CompanyProfile | null>(null);

	async function handleNewsletterSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!newsletterEmail.trim()) return;
		setNewsletterStatus("sending");
		try {
			const res = await authFetch(endpoints.subscribers.create, {
				method: "POST",
				body: JSON.stringify({ email: newsletterEmail.trim() }),
				auth: false,
			});
			if (!res.ok) throw new Error();
			setNewsletterStatus("sent");
			setNewsletterEmail("");
		} catch {
			setNewsletterStatus("error");
		}
	}

	useEffect(() => {
		const fetchGallery = async () => {
			try {
				const res = await fetch(`${API_BASE_URL}${endpoints.gallery.list}`);
				if (res.ok) {
					const data = await res.json();
					setGallery(data.slice(0, 9)); // Get latest 9
				}
			} catch (error) {
				console.error("Error fetching gallery:", error);
			}
		};

		fetchGallery();
	}, []);

	useEffect(() => {
		fetch(`${API_BASE_URL}${endpoints.companyProfile.public}`)
			.then((res) => (res.ok ? res.json() : null))
			.then((data) => setCompany(data))
			.catch(() => { /* rodapé continua a funcionar sem estes dados */ });
	}, []);

	return (
		<>
			<div className="container footer-top-border">
				<div className="vehicle-multi-border yellow-black"></div>
			</div>

			<footer
				className="footer-block bg-black"
				style={{ backgroundImage: 'url("/assets/images/footer-bg.png")' }}
			>
				<div className="container">
					<div className="footer-top-block yellow-theme">
						<div className="row">
							<div className="col-md-3 col-sm-6">
								<div className="widget widget_about">
									<h3 className="widget-title">{t("aboutTitle")}</h3>
									<div className="widget-about-content">
										{/* <img src="/assets/images/car-logo.png" alt="logo" /> */}
										<Image
											width={181}
											height={25}
											src="/logo_b.svg"
											alt="Rent a Car Verde"
										/>
										<p>{t("aboutText")}</p>
										<Link href="/about" className="button">
											{t("learnMore")}
										</Link>
									</div>
								</div>
							</div>
							<div className="col-md-2 col-sm-6">
								<div className="widget widget_menu">
									<h3 className="widget-title">{t("usefulLinks")}</h3>
									<ul>
										<li>
											<Link href="/">{t("home")}</Link>
										</li>
										<li>
											<Link href="/#reservar">{t("book")}</Link>
										</li>
										<li>
											<Link href="/cars">{t("vehicles")}</Link>
										</li>
										<li>
											<Link href="/contact">{t("contact")}</Link>
										</li>
										<li>
											<Link href="/gallery">{t("gallery")}</Link>
										</li>
										<li>
											<Link href="/condicoes-gerais">{t("terms")}</Link>
										</li>
										<li>
											<Link href="/politica-cancelamento">{t("cancellation")}</Link>
										</li>
									</ul>
								</div>
							</div>

							<div className="col-md-3 col-sm-6">
								<div className="widget widget_hot_contact">
									<h3 className="widget-title">{t("contact")}</h3>
									<ul>
										<li>
											<Link href="mailto:reservas@rentacarverde.cv">
												<i className="fa fa-envelope"></i>
												reservas@rentacarverde.cv
											</Link>
										</li>
										<li>
											<Link href="tel:0002385810945">
												<i className="fa fa-phone"></i>(+238) 5810945
											</Link>
										</li>
										<li>
											<span className="text-[#ececec]">
												<i className="fa fa-map-marker"></i>{t("address")}
											</span>
										</li>
									</ul>
								</div>
								<div className="widget widget_newsletter">
									<h3 className="widget-title">{t("subscribe")}</h3>
									<form
										onSubmit={handleNewsletterSubmit}
										className="subscribes-newsletter"
									>
										<label>{t("subscribeLabel")}</label>
										<div className="input-group">
											<input
												type="email"
												name="s"
												placeholder={t("emailPlaceholder")}
												aria-label={t("emailPlaceholder")}
												className="form-controller"
												value={newsletterEmail}
												onChange={(e) => setNewsletterEmail(e.target.value)}
												required
											/>
											<span className="input-group-btn">
												<button type="submit" className="btn btn-primary" disabled={newsletterStatus === "sending"} aria-label={t("subscribeButton")}>
													<span className="fa fa-paper-plane"></span>
												</button>
											</span>
										</div>
										{newsletterStatus === "sent" && (
											<p style={{ marginTop: 8, fontSize: 12, color: "#3baa4e" }}>{t("subscribed")}</p>
										)}
										{newsletterStatus === "error" && (
											<p style={{ marginTop: 8, fontSize: 12, color: "#ff8080" }}>{t("subscribeError")}</p>
										)}
									</form>
								</div>
							</div>

							<div className="col-md-4 col-sm-6">
								<div className="widget widget_photo_gallery">
									<h3 className="widget-title">{t("gallery")}</h3>
									<ul className="photo-gallery-content">
										{gallery.length > 0 ? (
											gallery.map((item) => (
												<li key={item.id}>
													<Link href="/gallery">
														<div className="relative w-full h-[70px]">
															<img
																src={`${API_BASE_URL}${item.imageUrl}`}
																alt={item.title}
																className="object-cover w-full h-full"
																style={{ width: '85px', height: '85px', objectFit: 'cover' }}
															/>
														</div>
													</Link>
												</li>
											))
										) : (
											<p className="text-gray-500 text-sm">{t("noImages")}</p>
										)}
									</ul>
								</div>
							</div>
						</div>
					</div>

					{/* Marcas aceites no pagamento online — linha própria, centrada na página */}
					<div className="footer-payment-brands">
						<PaymentBrands />
					</div>

					<div className="footer-bottom-block">
						<div className="row">
							<div className="col-md-9">
								<div className="bottom-content-left">
									<p className="copyright">
										{t("copyright", { year: new Date().getFullYear() })}{" "}
										<Link href="https://terrasystem.cv">terrasystem.cv</Link>
									</p>

								</div>
							</div>
							<div className="col-md-3">
								<div className="bottom-content-right">
									<div className="social-profile">
										<span className="social-profole-title">{t("followUs")}</span>
										{company?.instagramUrl && (
											<Link href={company.instagramUrl} target="_blank" rel="noopener noreferrer">
												<i className="fa fa-instagram"></i>
											</Link>
										)}
										{company?.facebookUrl && (
											<Link href={company.facebookUrl} target="_blank" rel="noopener noreferrer">
												<i className="fa fa-facebook"></i>
											</Link>
										)}
										{company?.twitterUrl && (
											<Link href={company.twitterUrl} target="_blank" rel="noopener noreferrer">
												<i className="fa fa-twitter"></i>
											</Link>
										)}
										{company?.whatsappUrl && (
											<Link href={company.whatsappUrl} target="_blank" rel="noopener noreferrer">
												<i className="fa fa-whatsapp"></i>
											</Link>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</footer>
		</>
	);
};
export default Footer;
