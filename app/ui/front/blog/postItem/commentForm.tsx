// app/ui/front/blog/postItem/CommentForm.tsx
"use client";

import React, { useState } from "react";

const CommentForm = () => {
	const [form, setForm] = useState({
		name: "",
		email: "",
		url: "",
		message: "",
	});

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Comentário enviado:", form);
		// Aqui você pode enviar para API no futuro
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
											placeholder="Name*"
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
										<input
											type="text"
											name="url"
											id="url"
											placeholder="Website*"
											className="form-controllar"
											value={form.url}
											onChange={handleChange}
										/>
									</p>
								</div>

								<div className="col-md-12">
									<p>
										<textarea
											name="message"
											id="message"
											rows={3}
											placeholder="Write a Comment...."
											className="form-controllar"
											value={form.message}
											onChange={handleChange}
											required
										/>
									</p>
								</div>

								<div className="col-md-12">
									<p className="form-submit">
										<button
											type="submit"
											id="submit"
											className="button nevy-bg"
										>
											Posta o comentario
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
