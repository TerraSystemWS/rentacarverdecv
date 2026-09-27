// app/ui/front/blog/postItem/CommentForm.tsx
"use client";

import React, { useState } from "react";
import { endpoints, API_BASE_URL } from "@/lib/api/endpoints";
import { useTranslations } from "next-intl";
import { clientLocale } from "@/lib/i18n/clientLocale";

interface Props {
	postSlug: string;
}

const CommentForm = ({ postSlug }: Props) => {
	const t = useTranslations("comments");
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
				headers: { "Content-Type": "application/json", "Accept-Language": clientLocale() },
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
						<h3 className="comment-reply-title">{t("title")}</h3>
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
											placeholder={t("name")}
											aria-label={t("name")}
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
											placeholder={t("email")}
											aria-label={t("email")}
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
											placeholder={t("message")}
											aria-label={t("message")}
											className="form-controllar"
											value={form.message}
											onChange={handleChange}
											required
										/>
									</p>
								</div>

								{status === "sent" && (
									<div className="col-md-12">
										<p style={{ color: "#2e7d32" }}>{t("sent")}</p>
									</div>
								)}
								{status === "error" && (
									<div className="col-md-12">
										<p style={{ color: "#c62828" }}>{t("error")}</p>
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
											{status === "sending" ? t("submitting") : t("submit")}
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
