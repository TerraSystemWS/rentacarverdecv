"use client";

import { Bell, UserCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo_b.svg";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function Navbar() {
	return (
		<nav className="bg-white p-4 shadow">
			<div className="container mx-auto flex justify-between items-center">
				{/* Logo */}
				<Link href="/" className="flex items-center space-x-2">
					<Image src={logo} alt="Logo" width={120} height={120} />
				</Link>

				<div className="flex items-center space-x-6">
					{/* Notificações */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								className="text-gray-800 hover:text-gray-600"
							>
								<Bell className="w-5 h-5" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem>Reserva #123 confirmada</DropdownMenuItem>
							<DropdownMenuItem>Pagamento recebido</DropdownMenuItem>
							<DropdownMenuItem>Carro devolvido com sucesso</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					{/* User Profile */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								className="text-gray-800 hover:text-gray-600 flex items-center"
							>
								<UserCircle className="w-6 h-6" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem asChild>
								<Link href="/profile">Perfil</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link href="/alertas">Alertas</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link href="/logout">Logout</Link>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</nav>
	);
}
