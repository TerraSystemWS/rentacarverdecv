"use client";

import Header from "./minis/Header";
import HeaderModals from "./minis/headerModals";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
	// Dados do menu - pode ser movido para um arquivo externo ou API
	const menuData = {
		items: [
			{
				label: "Home",
				href: "#",
				submenu: [
					{ label: "Home Layout One", href: "index.html" },
					{ label: "Home Layout Two", href: "index02.html" },
					{ label: "Home Layout Three", href: "index03.html" },
					{ label: "Home Layout Four", href: "index04.html" },
					{ label: "Home Layout Five", href: "index05.html" },
					{ label: "Home Layout Six", href: "index06.html" },
					{ label: "Home Layout Seven", href: "index07.html" },
					{ label: "Home Layout Eight", href: "index08.html" },
					{ label: "Home Layout Nine", href: "index09.html" },
					{ label: "Home Layout Ten", href: "index10.html" },
				],
			},
			{
				label: "Reservas",
				href: "car-single-page.html",
			},
			{
				label: "Carros",
				href: "#",
				submenu: [
					{ label: "Car Category 01", href: "car-category.html" },
					{ label: "Car Category 02", href: "car-category-two.html" },
					{ label: "Car Category 03", href: "car-category-three.html" },
					{ label: "Car Single Page", href: "car-single-page.html" },
				],
			},
			{
				label: "Pages",
				href: "#",
				submenu: [
					{ label: "Coming Soon", href: "comming-soon.html" },
					{ label: "404", href: "404.html" },
				],
			},
			{
				label: "Sobre",
				href: "about.html",
			},
			{
				label: "Novidades",
				href: "#",
				submenu: [
					{ label: "Blog", href: "blog.html" },
					{ label: "Single Post", href: "blog-single.html" },
				],
			},
			{
				label: "Contato",
				href: "/contact",
			},
		],
	};

	return (
		<>
			<Header />
			<HeaderModals />

			<header className="header-nav-area">
				<div className="container">
					<div className="row">
						<div className="col-md-3 col-sm-10 col-xs-10">
							<div className="site-logo">
								<Link href="/">
									<Image width={181} height={25} src="/logo_b.svg" alt="logo" />
								</Link>
							</div>
						</div>
						<div className="col-md-9 col-sm-2 col-xs-2 pd-right-0">
							<nav className="site-navigation top-navigation nav-style-one">
								<div className="menu-wrapper">
									<div className="menu-content">
										<ul className="menu-list">
											{menuData.items.map((item, index) => (
												<li key={index}>
													<Link href={item.href}>{item.label}</Link>
													{item.submenu && (
														<ul className="sub-menu">
															{item.submenu.map((subItem, subIndex) => (
																<li key={subIndex}>
																	<a href={subItem.href}>{subItem.label}</a>
																</li>
															))}
														</ul>
													)}
												</li>
											))}
										</ul>
									</div>
								</div>
							</nav>

							<div className="mobile-menu-main hidden-md hidden-lg">
								<div className="menucontent overlaybg"> </div>
								<div className="menuexpandermain slideRight">
									<a
										id="navtoggole-main"
										className="animated-arrow slideLeft menuclose"
									>
										<span></span>
									</a>
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

export default Navbar;
