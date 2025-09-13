import Image from "next/image";
import Link from "next/link";

const Footer = () => {
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
										<Link href="/" className="button">
											saber mais
										</Link>
									</div>
								</div>
							</div>
							<div className="col-md-2 col-sm-6">
								<div className="widget widget_menu">
									<h3 className="widget-title">Useful link</h3>
									<ul>
										<li>
											<Link href="/">Home</Link>
										</li>
										<li>
											<Link href="/reservar"> Reservar</Link>
										</li>
										<li>
											<Link href="/cars">Our car</Link>
										</li>
										<li>
											<Link href="contact">Contato</Link>
										</li>
										<li>
											<Link href="/">Reviews</Link>
										</li>
									</ul>
								</div>
							</div>

							<div className="col-md-3 col-sm-6">
								<div className="widget widget_hot_contact">
									<h3 className="widget-title">Contato</h3>
									<ul>
										<li>
											<Link href="mailto:reservas@rentacarverde.cv">
												<i className="fa fa-envelope"></i>
												reservas@rentacarverde.cv
											</Link>
										</li>
										<li>
											<Link href="tel:00000000000000">
												<i className="fa fa-phone"></i>(+000)00000000
											</Link>
										</li>
										<li>
											<Link href="#">
												<i className="fa fa-map-marker"></i>rua cabo verde
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
										<li>
											<Link href="#">
												<img
													src="/assets/images/instagram/instagram-01.png"
													alt="instagram"
												/>
											</Link>
										</li>
										<li>
											<Link href="#">
												<img
													src="/assets/images/instagram/instagram-02.png"
													alt="instagram"
												/>
											</Link>
										</li>
										<li>
											<Link href="#">
												<img
													src="/assets/images/instagram/instagram-03.png"
													alt="instagram"
												/>
											</Link>
										</li>
										<li>
											<Link href="#">
												<img
													src="/assets/images/instagram/instagram-04.png"
													alt="instagram"
												/>
											</Link>
										</li>
										<li>
											<Link href="#">
												<img
													src="/assets/images/instagram/instagram-05.png"
													alt="instagram"
												/>
											</Link>
										</li>
										<li>
											<Link href="#">
												<img
													src="/assets/images/instagram/instagram-06.png"
													alt="instagram"
												/>
											</Link>
										</li>
										<li>
											<Link href="#">
												<img
													src="/assets/images/instagram/instagram-07.png"
													alt="instagram"
												/>
											</Link>
										</li>
										<li>
											<Link href="#">
												<img
													src="/assets/images/instagram/instagram-08.png"
													alt="instagram"
												/>
											</Link>
										</li>
										<li>
											<Link href="#">
												<img
													src="/assets/images/instagram/instagram-09.png"
													alt="instagram"
												/>
											</Link>
										</li>
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
										Copyright &copy; 2017 TerraSystem - All Right Reserved{" "}
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
