"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { endpoints, API_BASE_URL } from "@/lib/api/endpoints";

interface GalleryItem {
	id: number;
	imageUrl: string;
	title: string;
}

const Footer = () => {
	const [gallery, setGallery] = useState<GalleryItem[]>([]);

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
											<Link href="#">
												<i className="fa fa-map-marker"></i>Cidadela - Rua da
												Independência
											</Link>
										</li>
									</ul>
								</div>
								<div className="widget widget_newsletter">
									<h3 className="widget-title">Subscrever</h3>
									<form
										action="#"
										className="subscribes-newsletter"
										method="get"
									>
										<label>Subscreva as novidades</label>
										<div className="input-group">
											<input
												type="search"
												name="s"
												placeholder="Your email"
												className="form-controller"
											/>
											<span className="input-group-btn">
												<button type="submit" className="btn btn-primary">
													<span className="fa fa-paper-plane"></span>
												</button>
											</span>
										</div>
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
										<Link href="#">
											<i className="fa fa-instagram"></i>
										</Link>
										<Link href="#">
											<i className="fa fa-heart"></i>
										</Link>
										<Link href="#">
											<i className="fa fa-facebook"></i>
										</Link>
										<Link href="#">
											<i className="fa fa-twitter"></i>
										</Link>
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
