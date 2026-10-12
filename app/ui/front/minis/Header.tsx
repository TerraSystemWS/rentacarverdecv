"use client";

import FSideBar from "@/app/ui/front/minis/FSidebar";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslations } from "next-intl";

const Header = () => {
	const router = useRouter();
	const t = useTranslations("header");
	const tn = useTranslations("nav");
	const [isOpen, setIsOpen] = useState(false);
	const [isPesquisaOpen, setIsPesquisaOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	// Menu do site em telemóvel. Era aberto pelo jQuery do template
	// (carrent.min.js), que no Next.js não chega a correr; agora é estado React
	// com as mesmas classes menuopen/menuclose do CSS do template.
	const [isNavOpen, setIsNavOpen] = useState(false);
	const pathname = usePathname();
	const navState = isNavOpen ? "menuopen" : "menuclose";

	// Fecha o menu ao mudar de página.
	useEffect(() => {
		setIsNavOpen(false);
	}, [pathname]);

	const navLinks = [
		{ href: "/", label: tn("home") },
		{ href: "/cars", label: tn("cars") },
		{ href: "/about", label: tn("about") },
		{ href: "/posts", label: tn("news") },
		{ href: "/contact", label: tn("contact") },
	];

	function handleSearch(e: React.FormEvent) {
		e.preventDefault();
		setIsPesquisaOpen(false);
		router.push(searchQuery.trim() ? `/cars?q=${encodeURIComponent(searchQuery.trim())}` : "/cars");
	}

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
										<a href="tel:02385810945" className="top-left-menu">
											<i className="fa fa-phone"></i>
											<span>{t("call")} - +238 581 09 45</span>
										</a>
									</li>
									<li>
										<a
											href="mailto:reservas@rentacarverde.cv"
											className="top-left-menu"
										>
											<i className="fa fa-envelope"></i>
											<span>reservas@rentacarverde.cv</span>
										</a>
									</li>
								</ul>
							</div>
						</div>

						<div className="col-md-6 col-sm-5">
							<div className="header-content-right">
								<ul className="header-top-menu">
									<li>
										<LanguageSwitcher />
									</li>
									<li>
										<a
											href="#"
											className="search-open"
											aria-label={t("openSearch")}
											onClick={() => setIsPesquisaOpen(!isPesquisaOpen)}
										>
											<i className="fa fa-search"></i>
										</a>
									</li>

									<li>
										<a
											href="#"
											className="trigger-overlay"
											aria-label={t("openMenu")}
											onClick={() => setIsOpen(!isOpen)}
										>
											<i className="fa fa-bars"></i>
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</header>

			{/* ===== Header Modal====== */}
			<div className="header-modal-area">
				{/* Modal Search */}
				<div
					className={`overlay overlay-scale ${isPesquisaOpen ? "open" : ""}`}
				>
					<button
						type="button"
						className="overlay-close"
						aria-label={t("close")}
						onClick={() => setIsPesquisaOpen(false)}
					>
						&#x2716;
					</button>

					<div className="overlay__content">
						<form
							id="search-form"
							className="search-form outer"
							onSubmit={handleSearch}
						>
							<div className="input-group">
								<input
									type="text"
									className="input--full"
									placeholder={t("searchPlaceholder")}
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
							</div>

							<button type="submit" className="btn text-uppercase search-button">
								{t("search")}
							</button>
						</form>
					</div>
				</div>

				{/* Sidebar */}
				<FSideBar onToggleSidebar={() => setIsOpen(!isOpen)} isOpen={isOpen} />
			</div>

			{/* ====== Header Nav Area ====== */}
			<header className="header-nav-area">
				<div className="container">
					<div className="row">
						<div className="col-md-3 col-sm-10 col-xs-10">
							<div className="site-logo">
								<Link href="/">
									<img src="/logo_b.svg" alt="Rent a Car Verde" />
								</Link>
							</div>
						</div>

						<div className="col-md-9 col-sm-2 col-xs-2 pd-right-0">
							<nav className="site-navigation top-navigation nav-style-one">
								<div className="menu-wrapper">
									<div className="menu-content">
										<ul className="menu-list">
											{navLinks.map((l) => (
												<li key={l.href}>
													<Link href={l.href}>{l.label}</Link>
												</li>
											))}
										</ul>
									</div>
								</div>
							</nav>

							{/* Mobile */}
							<div className="mobile-menu-main hidden-md hidden-lg">
								<div
									className={`menucontent overlaybg ${navState}`}
									onClick={() => setIsNavOpen(false)}
								></div>
								<div className="menuexpandermain slideRight">
									<a
										href="#"
										role="button"
										aria-label={t("openMenu")}
										aria-expanded={isNavOpen}
										className={`animated-arrow slideLeft ${navState}`}
										onClick={(e) => {
											e.preventDefault();
											setIsNavOpen((v) => !v);
										}}
									>
										<span></span>
									</a>
								</div>

								<div className={`mb-navigation slideLeft ${navState}`}>
									<div className="menu-wrapper">
										<div className="menu-content clearfix">
											<ul className="menu-list">
												{navLinks.map((l) => (
													<li key={l.href} className={pathname === l.href ? "current-menu-item" : undefined}>
														<Link href={l.href} onClick={() => setIsNavOpen(false)}>
															{l.label}
														</Link>
													</li>
												))}
											</ul>
										</div>
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
