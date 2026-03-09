"use client";

import { useAuth } from "@/app/auth/AuthContext";
import { useRouter } from "next/navigation";

interface FSideBarProps {
	isOpen: boolean;
	onToggleSidebar: () => void;
}

const FSideBar = ({ isOpen, onToggleSidebar }: FSideBarProps) => {
	const router = useRouter();
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
		"Faça login";

	const description =
		(user as any)?.jobTitle || (isAdmin ? "Admin" : "Cliente") || "Programmer";

	const avatar =
		(user as any)?.avatarUrl || "/assets/images/driver/driver-03.png";

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
				<button className="closebtn" onClick={onToggleSidebar}>
					&times;
				</button>

				<div className="author-area-content">
					<div className="login-author">
						<div className="author-info">
							<div className="author-image yellow-border">
								<img src={avatar} alt="author-image" />
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
								{/* Se NÃO autenticado, mostra só login */}
								{!isAuthenticated ? (
									<>
										<li>
											<a href="/login" onClick={(e) => go(e, "/login")}>
												<i className="fa fa-sign-in"></i> Sign In
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
													<i className="fa fa-user-circle-o"></i> Admin Dashboard
												</a>
											</li>
										) : (
											<>
												<li>
													<a href="/profile" onClick={(e) => go(e, "/profile")}>
														<i className="fa fa-user-circle-o"></i> O Meu Perfil
													</a>
												</li>
												<li>
													<a href="/profile" onClick={(e) => go(e, "/profile")}>
														<i className="fa fa-automobile"></i> As Minhas Reservas
													</a>
												</li>
												<li>
													<a href="#" onClick={(e) => { e.preventDefault(); alert("Em breve!"); }}>
														<i className="fa fa-envelope-open"></i> Mensagens
													</a>
												</li>
											</>
										)}

										<li>
											<a href="#" onClick={handleLogout}>
												<i className="fa fa-sign-out"></i> Sair
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
