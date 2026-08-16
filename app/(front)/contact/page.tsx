"use client";

import { useState, useEffect } from "react";
import { useContent } from "@/app/context/ContentContext";
import { authFetch } from "@/app/auth/api";
import { endpoints, API_BASE_URL } from "@/lib/api/endpoints";
import { CompanyProfile } from "@/lib/api/types";

const Contact = () => {
	const { content } = useContent();
	const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
	const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const [company, setCompany] = useState<CompanyProfile | null>(null);

	useEffect(() => {
		fetch(`${API_BASE_URL}${endpoints.companyProfile.public}`)
			.then((res) => (res.ok ? res.json() : null))
			.then(setCompany)
			.catch(() => { /* secção de redes sociais fica escondida se falhar */ });
	}, []);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
			setStatus("error");
			setErrorMsg("Preencha o nome, o email e a mensagem.");
			return;
		}
		setStatus("sending");
		setErrorMsg(null);
		try {
			const res = await authFetch(endpoints.messages.create, {
				method: "POST",
				body: JSON.stringify(form),
				auth: false,
			});
			if (!res.ok) {
				const body = await res.json().catch(() => null);
				throw new Error(body?.message || "Não foi possível enviar a mensagem.");
			}
			setStatus("sent");
			setForm({ name: "", email: "", subject: "", message: "" });
		} catch (err: any) {
			setStatus("error");
			setErrorMsg(err?.message || "Não foi possível enviar a mensagem. Tente novamente.");
		}
	}

	const data = content?.contact || {
		headerTitle: "Contacto",
		headerSubtitle: "Fale connosco",
		directTitle: "Contacte-nos em direto",
		address: "Cidadela - Rua da Independência, em frente ao 4° paragem de autocarro, a 40 m de Direção Geral Dos Transportes Rodoviário",
		phone: "+238 5810945",
		email: "reservas@rentacarverde.cv",
		mapTitle: "Mapa & Direções",
		mapSubtitle: "Encontre a nossa localização",
		mapDesc: "Descubra como chegar até nós a partir da sua localização atual",
	};

	return (
		<>
			{/* ====== Cabeçalho da Página ====== */}
			<div className="page-header nevy-bg">
				<div className="container">
					<div className="row">
						<div className="col-md-12">
							<h2 className="page-title">{data.headerTitle}</h2>
							<p className="page-description yellow-color">{data.headerSubtitle}</p>
						</div>
					</div>
				</div>
			</div>

			{/* ====== Contacte-nos ====== */}
			<div className="contact-us-area mr-top-60">
				<div className="container">
					<div className="row">
						<div className="col-md-12">
							<div className="heading-content-three">
								<h2 className="title" dangerouslySetInnerHTML={{ __html: data.directTitle.replace(/\n/g, '<br />') }}>
								</h2>
							</div>
						</div>
					</div>

					<div className="row">
						{/* Coluna esquerda */}
						<div className="col-md-4">
							<div className="contact-us-content-left">
								<div className="contact">
									<h4>
										<i className="fa fa-map-marker"></i> Morada
									</h4>
									<p>{data.address}</p>
								</div>

								<div className="contact">
									<h4>
										<i className="fa fa-phone"></i> Telefone
									</h4>
									<p>{data.phone}</p>
								</div>

								<div className="contact">
									<h4>
										<i className="fa fa-envelope"></i> Email
									</h4>
									<p>{data.email}</p>
								</div>

								{(company?.facebookUrl || company?.twitterUrl || company?.instagramUrl || company?.whatsappUrl) && (
									<div className="contact">
										<h4>
											<i className="fa fa-user-circle"></i> Redes sociais
										</h4>
										<div className="social-icon">
											{company?.facebookUrl && (
												<a href={company.facebookUrl} target="_blank" rel="noopener noreferrer">
													<i className="fa fa-facebook"></i>
												</a>
											)}
											{company?.twitterUrl && (
												<a href={company.twitterUrl} target="_blank" rel="noopener noreferrer">
													<i className="fa fa-twitter"></i>
												</a>
											)}
											{company?.instagramUrl && (
												<a href={company.instagramUrl} target="_blank" rel="noopener noreferrer">
													<i className="fa fa-instagram"></i>
												</a>
											)}
											{company?.whatsappUrl && (
												<a href={company.whatsappUrl} target="_blank" rel="noopener noreferrer">
													<i className="fa fa-whatsapp"></i>
												</a>
											)}
										</div>
									</div>
								)}
							</div>
						</div>

						{/* Coluna direita */}
						<div className="col-md-8">
							<div className="contact-us-content-right">
								<form onSubmit={handleSubmit}>
									<h3 className="from-title">Tem alguma questão?</h3>
									<i className="fa fa-paper-plane" aria-hidden="true"></i>
									<div className="input-content clearfix">
										<h4>Envie-nos um email</h4>
										<div className="row">
											<div className="col-sm-6">
												<input
													type="text"
													placeholder="Nome*"
													className="form-control"
													value={form.name}
													onChange={(e) => setForm({ ...form, name: e.target.value })}
													required
												/>
											</div>
											<div className="col-sm-6">
												<input
													type="email"
													placeholder="Email*"
													className="form-control Email"
													value={form.email}
													onChange={(e) => setForm({ ...form, email: e.target.value })}
													required
												/>
											</div>
											<div className="col-md-12">
												<input
													type="text"
													placeholder="Assunto"
													className="form-control website"
													value={form.subject}
													onChange={(e) => setForm({ ...form, subject: e.target.value })}
												/>
											</div>
											<div className="col-md-12">
												<textarea
													rows={2}
													cols={80}
													placeholder="A sua mensagem"
													value={form.message}
													onChange={(e) => setForm({ ...form, message: e.target.value })}
													required
												></textarea>
											</div>
										</div>
										{status === "sent" && (
											<p className="yellow-color" style={{ marginTop: 10 }}>
												Mensagem enviada! Entraremos em contacto em breve.
											</p>
										)}
										{status === "error" && errorMsg && (
											<p style={{ marginTop: 10, color: "#d9534f" }}>{errorMsg}</p>
										)}
										<div className="subimt-button clearfix">
											<input
												type="submit"
												value={status === "sending" ? "A enviar..." : "Enviar"}
												className="submit yellow-button"
												disabled={status === "sending"}
											/>
										</div>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* ====== Bloco do Mapa ====== */}
			<div className="map-block mr-btm-78">
				<div className="container">
					<div className="row">
						<div className="col-md-12">
							<div className="heading-content style-two">
								<h3 className="subtitle">{data.mapSubtitle}</h3>
								<h2 className="title color-nevy">{data.mapTitle}</h2>
							</div>
							<div className="header-map-content">
								<iframe
									height="550"
									src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5108.505257123504!2d-23.541741246858468!3d14.910647058540935!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935993ef308ba19%3A0xc205e3171f9678ea!2sRent%20A%20Car%20Verde!5e1!3m2!1spt-PT!2spt!4v1758321179322!5m2!1spt-PT!2spt"
									allowFullScreen
								></iframe>
							</div>
							<p>
								{data.mapDesc}
							</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Contact;
