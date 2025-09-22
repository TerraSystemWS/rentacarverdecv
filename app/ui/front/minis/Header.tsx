"use client";
import React, { useEffect } from "react";
import Link from "next/link";

const Header: React.FC = () => {
	useEffect(() => {
		// Este useEffect garante que o DOM está pronto antes de tentar anexar event listeners
		const initHeaderModals = () => {
			// Fechar search overlay
			const searchCloseBtn = document.querySelector(
				".overlay-scale .overlay-close"
			);
			if (searchCloseBtn) {
				searchCloseBtn.addEventListener("click", () => {
					const searchOverlay = document.querySelector(".overlay-scale");
					searchOverlay?.classList.remove("open");
				});
			}

			// Fechar sidebar overlay
			const sidebarCloseBtn = document.querySelector(
				".overlay-sidebar .closebtn"
			);
			if (sidebarCloseBtn) {
				sidebarCloseBtn.addEventListener("click", () => {
					const sidebarOverlay = document.querySelector(".overlay-sidebar");
					sidebarOverlay?.classList.remove("open");
				});
			}

			// Abrir search overlay
			const searchOpenBtn = document.querySelector(".search-open");
			if (searchOpenBtn) {
				searchOpenBtn.addEventListener("click", (e) => {
					e.preventDefault();
					const searchOverlay = document.querySelector(".overlay-scale");
					searchOverlay?.classList.add("open");
				});
			}

			// Abrir sidebar overlay
			const sidebarOpenBtn = document.querySelector(".trigger-overlay");
			if (sidebarOpenBtn) {
				sidebarOpenBtn.addEventListener("click", (e) => {
					e.preventDefault();
					const sidebarOverlay = document.querySelector(".overlay-sidebar");
					sidebarOverlay?.classList.add("open");
				});
			}
		};

		initHeaderModals();

		// Cleanup function
		return () => {
			// Remover event listeners se necessário
		};
	}, []);

	return (
		<>
			{/* ====== Header Top Area ====== */}
			<header className="header-top-area bg-nero">
				<div className="container">
					<div className="row">
						<div className="col-md-6 col-sm-7 hidden-xs">
							<div className="header-content-left">
								<ul className="header-top-menu">
									<li>
										<Link href="#" className="top-left-menu">
											<i className="fa fa-phone"></i>
											<span>Chamar - 01623 030020</span>
										</Link>
									</li>
									<li>
										<Link
											href="mailto:reservas@rentacarverde.cv"
											className="top-left-menu"
										>
											<i className="fa fa-envelope"></i>
											<span>reservas@rentacarverde.cv</span>
										</Link>
									</li>
								</ul>
							</div>
						</div>

						<div className="col-md-6 col-sm-5">
							<div className="header-content-right">
								<ul className="header-top-menu">
									<li>
										<Link href="#" className="language">
											<i className="fa fa-language"></i>
											<span>Linguas</span>
										</Link>
										<ul className="sub-menu">
											<li>
												<Link href="#">English</Link>
											</li>
											<li>
												<Link href="#">Español</Link>
											</li>
											<li>
												<Link href="#">Français</Link>
											</li>
											<li>
												<Link href="#">Português</Link>
											</li>
										</ul>
									</li>
								</ul>
								<ul className="header-top-menu">
									<li>
										<Link href="#" className="search-open">
											<i className="fa fa-search"></i>
										</Link>
									</li>
									<li>
										<Link href="#" className="trigger-overlay">
											<i className="fa fa-bars"></i>
										</Link>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</header>

			{/* ======= Header Modal Area =======*/}
			<div className="header-modal-area">
				{/* Modal Search */}
				<div className="overlay overlay-scale">
					<button type="button" className="overlay-close">
						&#x2716;
					</button>
					<div className="overlay__content">
						<form
							id="search-form"
							className="search-form outer"
							action="#"
							method="post"
						>
							<div className="input-group">
								<input
									type="text"
									className="input--full"
									placeholder="search text here ..."
								/>
							</div>
							<button className="btn text-uppercase search-button">
								Pesquisar
							</button>
						</form>
					</div>
				</div>

				<div className="overlay-sidebar">
					<div className="author-area">
						<Link href="#" className="closebtn">
							&times;
						</Link>
						<div className="author-area-content">
							<div className="login-author">
								<div className="author-info">
									<div className="author-image yellow-border">
										<img
											src="/assets/images/driver/driver-03.png"
											alt="author-image"
										/>
									</div>
									<div className="author-des">
										<h4 className="author-name">Mr. Johan Smith</h4>
										<p className="author-description">Programmer</p>
									</div>
								</div>
								<div className="author-menu">
									<ul className="yellow-color">
										<li>
											<Link href="">
												<i className="fa fa-user-circle-o"></i>Author Dashboard
											</Link>
										</li>
										<li>
											<Link href="">
												<i className="fa fa-envelope-open"></i>Your Inbox
											</Link>
										</li>
										<li>
											<Link href="">
												<i className="fa fa-location-arrow"></i>Track your texi
											</Link>
										</li>
										<li>
											<Link href="">
												<i className="fa fa-area-chart"></i>Your Bookings Status
											</Link>
										</li>
										<li>
											<Link href="">
												<i className="fa fa-automobile"></i>New Bookings
											</Link>
										</li>
										<li>
											<Link href="">
												<i className="fa fa-archive"></i>Your Bookings
											</Link>
										</li>
										<li>
											<Link href="">
												<i className="fa fa-money"></i>Your Deposit - $150.00
											</Link>
										</li>
										<li>
											<Link href="">
												<i className="fa fa-sign-out"></i>Sign Out
											</Link>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* ====== Header Nav Area ====== */}
			<header className="header-nav-area">
				<div className="container">
					<div className="row">
						<div className="col-md-3 col-sm-10 col-xs-10">
							<div className="site-logo">
								<Link href="/">
									<img src="/logo_b.png" alt="logo" />
								</Link>
							</div>
						</div>
						<div className="col-md-9 col-sm-2 col-xs-2 pd-right-0">
							<nav className="site-navigation top-navigation nav-style-one">
								<div className="menu-wrapper">
									<div className="menu-content">
										<ul className="menu-list">
											<li>
												<Link href="/">Home</Link>
												{/* <ul className="sub-menu">
													<li>
														<a href="index.html">Home Layout One</a>
													</li>
													<li>
														<a href="index02.html">Home Layout Two</a>
													</li>
													<li>
														<a href="index03.html">Home Layout Three</a>
													</li>
													<li>
														<a href="index04.html">Home Layout Four</a>
													</li>
													<li>
														<a href="index05.html">Home Layout Five</a>
													</li>
													<li>
														<a href="index06.html">Home Layout Six</a>
													</li>
													<li>
														<a href="index07.html">Home Layout Seven</a>
													</li>
													<li>
														<a href="index08.html">Home Layout Eight</a>
													</li>
													<li>
														<a href="index09.html">Home Layout Nine</a>
													</li>
													<li>
														<a href="index10.html">Home Layout Ten</a>
													</li>
												</ul> */}
											</li>
											{/* <li>
												<a href="/booking">Reservar</a>
											</li> */}
											<li>
												<Link href="/cars">Viaturas</Link>
												{/* <ul className="sub-menu">
													<li>
														<a href="car-category.html">Car Category 01</a>
													</li>
													<li>
														<a href="car-category-two.html">Car Category 02</a>
													</li>
													<li>
														<a href="car-category-three.html">
															Car Category 03
														</a>
													</li>
													<li>
														<a href="car-single-page.html">Car Single Page</a>
													</li>
												</ul> */}
											</li>
											{/* <li>
												<a href="#">Pages</a>
												<ul className="sub-menu">
													<li>
														<a href="comming-soon.html">Coming Soon</a>
													</li>
													<li>
														<a href="404.html">404</a>
													</li>
												</ul>
											</li> */}
											<li>
												<Link href="/about">Sobre Nós</Link>
											</li>
											<li>
												<Link href="/posts">Novidades</Link>
												{/* <ul className="sub-menu">
													<li>
														<a href="blog.html">Blog</a>
													</li>
													<li>
														<a href="blog-single.html">Single Post</a>
													</li>
												</ul> */}
											</li>
											<li>
												<Link href="/contact">Contato</Link>
											</li>
										</ul>
									</div>
								</div>
							</nav>

							{/* Mobile Main Menu */}
							<div className="mobile-menu-main hidden-md hidden-lg">
								<div className="menucontent overlaybg"> </div>
								<div className="menuexpandermain slideRight">
									<Link
										href={""}
										id="navtoggole-main"
										className="animated-arrow slideLeft menuclose"
									>
										<span></span>
									</Link>
								</div>

								<div id="mobile-main-nav" className="mb-navigation slideLeft">
									<div className="menu-wrapper">
										<div
											id="main-mobile-container"
											className="menu-content clearfix"
										></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</header>
		</>
	);
};

export default Header;
