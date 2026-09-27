"use client";

import FSideBar from "@/app/ui/front/minis/FSidebar";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
											<li>
												<Link href="/">{tn("home")}</Link>
											</li>
											<li>
												<Link href="/cars">{tn("cars")}</Link>
											</li>
											<li>
												<Link href="/about">{tn("about")}</Link>
											</li>
											<li>
												<Link href="/posts">{tn("news")}</Link>
											</li>
											<li>
												<Link href="/contact">{tn("contact")}</Link>
											</li>
										</ul>
									</div>
								</div>
							</nav>

							{/* Mobile */}
							<div className="mobile-menu-main hidden-md hidden-lg">
								<div className="menucontent overlaybg"></div>
								<div className="menuexpandermain slideRight">
									<a
										href=""
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

export default Header;
