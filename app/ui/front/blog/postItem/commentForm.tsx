// app/ui/front/blog/postItem/CommentForm.tsx
"use client";

import React, { useState } from "react";
import { endpoints, API_BASE_URL } from "@/lib/api/endpoints";

interface Props {
	postSlug: string;
}

const CommentForm = ({ postSlug }: Props) => {
	const [form, setForm] = useState({
		name: "",
		email: "",
		message: "",
	});
	const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
		setStatus("sending");
		try {
			const res = await fetch(`${API_BASE_URL}${endpoints.comments.create(postSlug)}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					authorName: form.name.trim(),
					authorEmail: form.email.trim(),
					message: form.message.trim(),
				}),
			});
			if (!res.ok) throw new Error();
			setStatus("sent");
			setForm({ name: "", email: "", message: "" });
			// Recarrega a página para o novo comentário aparecer na lista (o
			// componente Comments busca a lista no seu próprio efeito).
			setTimeout(() => window.location.reload(), 800);
		} catch {
			setStatus("error");
		}
	};

	return (
		<div id="respond" className="comment-respond box-radius bg-gray-color">
			<div className="comments-main-content bg-white-color">
				<div className="row">
					<div className="col-md-12">
						<h3 className="comment-reply-title">Deixe um comentario</h3>
					</div>
				</div>

				<div className="row">
					<div className="col-md-12">
						<form id="comment_form" name="commentForm" onSubmit={handleSubmit}>
							<div className="row">
								<div className="col-md-6 col-sm-6 padding-right">
									<p>
										<input
											type="text"
											name="name"
											placeholder="Nome*"
											className="form-controllar"
											value={form.name}
											onChange={handleChange}
											required
										/>
									</p>
								</div>

								<div className="col-md-6 col-sm-6">
									<p>
										<input
											type="email"
											name="email"
											placeholder="Email*"
											className="form-controllar"
											value={form.email}
											onChange={handleChange}
											required
										/>
									</p>
								</div>

								<div className="col-md-12">
									<p>
										<textarea
											name="message"
											id="message"
											rows={3}
											placeholder="Escreva um comentário...."
											className="form-controllar"
											value={form.message}
											onChange={handleChange}
											required
										/>
									</p>
								</div>

								{status === "sent" && (
									<div className="col-md-12">
										<p style={{ color: "#2e7d32" }}>Comentário publicado, obrigado!</p>
									</div>
								)}
								{status === "error" && (
									<div className="col-md-12">
										<p style={{ color: "#c62828" }}>Não foi possível publicar o comentário. Tente de novo.</p>
									</div>
								)}

								<div className="col-md-12">
									<p className="form-submit">
										<button
											type="submit"
											id="submit"
											className="button nevy-bg"
											disabled={status === "sending"}
										>
											{status === "sending" ? "A publicar..." : "Postar o comentario"}
										</button>
									</p>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CommentForm;
