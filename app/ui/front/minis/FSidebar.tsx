"use client";

import { useAuth } from "@/app/auth/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserRound } from "lucide-react";
import { useTranslations } from "next-intl";
import Swal from "sweetalert2";

interface FSideBarProps {
	isOpen: boolean;
	onToggleSidebar: () => void;
}

const FSideBar = ({ isOpen, onToggleSidebar }: FSideBarProps) => {
	const router = useRouter();
	const t = useTranslations("sidebar");
	const { user, isAuthenticated, isLoading, logout } = useAuth();

	const roles: string[] =
		(user as any)?.roles ??
		(user as any)?.authorities?.map((a: any) => a.authority) ??
		[];

	const isAdmin = roles.includes("ROLE_ADMIN") || roles.includes("ADMIN");

	const displayName =
		(user as any)?.name ||
		(user as any)?.fullName ||
		(user as any)?.username ||
		(user as any)?.email ||
		t("guest");

	const description = !isAuthenticated
		? ""
		: (user as any)?.jobTitle || (isAdmin ? t("admin") : t("customer"));

	// A BD ainda não guarda foto de perfil; se um dia vier avatarUrl usa-se,
	// senão (ou se a imagem falhar) mostra as iniciais — ou um ícone sem sessão.
	const avatarUrl: string | undefined = (user as any)?.avatarUrl || undefined;
	const [avatarFailed, setAvatarFailed] = useState(false);
	const initials = isAuthenticated
		? displayName
				.split(/[\s@._-]+/)
				.filter(Boolean)
				.slice(0, 2)
				.map((w: string) => w[0]!.toUpperCase())
				.join("")
		: "";

	async function handleLogout(e: React.MouseEvent<HTMLAnchorElement>) {
		e.preventDefault();
		try {
			await logout();
		} finally {
			onToggleSidebar();
			router.replace("/"); // ou "/user/login"
		}
	}

	function go(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
		e.preventDefault();
		onToggleSidebar();
		router.push(href);
	}

	return (
		<div className="overlay-sidebar">
			<div className={isOpen ? "author-area open" : "author-area"}>
				<button className="closebtn" onClick={onToggleSidebar} aria-label={t("close")}>
					&times;
				</button>

				<div className="author-area-content">
					<div className="login-author">
						<div className="author-info">
							<div className="author-image yellow-border">
								{avatarUrl && !avatarFailed ? (
									<img src={avatarUrl} alt={displayName} onError={() => setAvatarFailed(true)} />
								) : (
									<span className="author-avatar-fallback" aria-label={displayName}>
										{initials || <UserRound className="w-6 h-6" aria-hidden="true" />}
									</span>
								)}
							</div>

							<div className="author-des">
								<h4 className="author-name">
									{isLoading ? "..." : displayName}
								</h4>
								<p className="author-description">
									{isLoading ? "" : description}
								</p>
							</div>
						</div>

						{/* MENU (layout original) */}
						<div className="author-menu">
							<ul className="yellow-color">
								{/* Se NÃO autenticado, mostra login e registo */}
								{!isAuthenticated ? (
									<>
										<li>
											<a href="/login" onClick={(e) => go(e, "/login")}>
												<i className="fa fa-sign-in"></i> {t("signIn")}
											</a>
										</li>
										<li>
											<a href="/register" onClick={(e) => go(e, "/register")}>
												<i className="fa fa-user-plus"></i> {t("register")}
											</a>
										</li>
									</>
								) : (
									<>
										{isAdmin ? (
											<li>
												<a
													href="/dashboard"
													onClick={(e) => go(e, "/dashboard")}
												>
													<i className="fa fa-user-circle-o"></i> {t("dashboard")}
												</a>
											</li>
										) : (
											<>
												<li>
													<a href="/profile" onClick={(e) => go(e, "/profile")}>
														<i className="fa fa-user-circle-o"></i> {t("profile")}
													</a>
												</li>
												<li>
													<a href="/profile" onClick={(e) => go(e, "/profile")}>
														<i className="fa fa-automobile"></i> {t("bookings")}
													</a>
												</li>
												<li>
													<a href="#" onClick={(e) => { e.preventDefault(); Swal.fire({ icon: "info", title: t("comingSoonTitle"), text: t("comingSoonText"), confirmButtonColor: "#3baa4e" }); }}>
														<i className="fa fa-envelope-open"></i> {t("messages")}
													</a>
												</li>
											</>
										)}

										<li>
											<a href="#" onClick={handleLogout}>
												<i className="fa fa-sign-out"></i> {t("signOut")}
											</a>
										</li>
									</>
								)}
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FSideBar;
