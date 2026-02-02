"use client";

import React from "react";
import { useAuth } from "@/app/auth/AuthContext";

export default function LogoutButton() {
	const { logout } = useAuth();

	return (
		<button
			onClick={() => logout()}
			style={{
				padding: "8px 12px",
				borderRadius: 10,
				border: "1px solid #ddd",
				cursor: "pointer",
				fontWeight: 700,
			}}
		>
			Sair
		</button>
	);
}
