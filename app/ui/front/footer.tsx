"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { endpoints, API_BASE_URL } from "@/lib/api/endpoints";
import { authFetch } from "@/app/auth/api";
import { CompanyProfile } from "@/lib/api/types";
import PaymentBrands from "@/app/ui/front/payment/PaymentBrands";

interface GalleryItem {
	id: number;
	imageUrl: string;
	title: string;
}

const Footer = () => {
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
									<h3 className="widget-title">Sobre Nós</h3>
									<div className="widget-about-content">
										{/* <img src="/assets/images/car-logo.png" alt="logo" /> */}
										<Image
											width={181}
											height={25}
											src="/logo_b2.svg"
											alt="logo"
										/>
										<p>
											Oferecemos a liberdade de explorar as ilhas de Cabo Verde
											ao seu ritmo, com uma frota de carros moderna e fiável
											para tornar a sua viagem inesquecível.
										</p>
										<Link href="/about" className="button">
											saber mais
										</Link>
									</div>
								</div>
							</div>
							<div className="col-md-2 col-sm-6">
								<div className="widget widget_menu">
									<h3 className="widget-title">Links Úteis</h3>
									<ul>
										<li>
											<Link href="/">Início</Link>
										</li>
										<li>
											<Link href="/#reservar"> Reservar</Link>
										</li>
										<li>
											<Link href="/cars">Veículos</Link>
										</li>
										<li>
											<Link href="/contact">Contacto</Link>
										</li>
										<li>
											<Link href="/gallery">Galeria</Link>
										</li>
										<li>
											<Link href="/condicoes-gerais">Condições Gerais</Link>
										</li>
										<li>
											<Link href="/politica-cancelamento">Cancelamento e Reembolso</Link>
										</li>
									</ul>
								</div>
							</div>

							<div className="col-md-3 col-sm-6">
								<div className="widget widget_hot_contact">
									<h3 className="widget-title">Contacto</h3>
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
												<i className="fa fa-map-marker"></i>Cidadela - Rua da
												Independência - Praia, Ilha de Santiago, Cabo Verde
											</span>
										</li>
									</ul>
								</div>
								<div className="widget widget_newsletter">
									<h3 className="widget-title">Subscrever</h3>
									<form
										onSubmit={handleNewsletterSubmit}
										className="subscribes-newsletter"
									>
										<label>Subscreva as novidades</label>
										<div className="input-group">
											<input
												type="email"
												name="s"
												placeholder="O seu email"
												className="form-controller"
												value={newsletterEmail}
												onChange={(e) => setNewsletterEmail(e.target.value)}
												required
											/>
											<span className="input-group-btn">
												<button type="submit" className="btn btn-primary" disabled={newsletterStatus === "sending"}>
													<span className="fa fa-paper-plane"></span>
												</button>
											</span>
										</div>
										{newsletterStatus === "sent" && (
											<p style={{ marginTop: 8, fontSize: 12, color: "#3baa4e" }}>Subscrito com sucesso!</p>
										)}
										{newsletterStatus === "error" && (
											<p style={{ marginTop: 8, fontSize: 12, color: "#ff8080" }}>Não foi possível subscrever. Tente de novo.</p>
										)}
									</form>
								</div>
							</div>

							<div className="col-md-4 col-sm-6">
								<div className="widget widget_photo_gallery">
									<h3 className="widget-title">Galeria</h3>
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
											<p className="text-gray-500 text-sm">Sem imagens disponíveis.</p>
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
										Copyright &copy; {new Date().getFullYear()} TerraSystem - All Right Reserved{" "}
										<Link href="https://terrasystem.cv">terrasystem.cv</Link>
									</p>

								</div>
							</div>
							<div className="col-md-3">
								<div className="bottom-content-right">
									<div className="social-profile">
										<span className="social-profole-title">Siga-nos:</span>
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
