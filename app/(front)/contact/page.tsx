"use client";

import { useContent } from "@/app/context/ContentContext";

const Contact = () => {
	const { content } = useContent();

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

								<div className="contact">
									<h4>
										<i className="fa fa-user-circle"></i> Redes sociais
									</h4>
									<div className="social-icon">
										<a href="#">
											<i className="fa fa-facebook"></i>
										</a>
										<a href="#">
											<i className="fa fa-twitter"></i>
										</a>
										<a href="#">
											<i className="fa fa-instagram"></i>
										</a>
										<a href="#">
											<i className="fa fa-google-plus"></i>
										</a>
									</div>
								</div>
							</div>
						</div>

						{/* Coluna direita */}
						<div className="col-md-8">
							<div className="contact-us-content-right">
								<form action="#">
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
												/>
											</div>
											<div className="col-sm-6">
												<input
													type="email"
													placeholder="Email*"
													className="form-control Email"
												/>
											</div>
											<div className="col-md-12">
												<input
													type="search"
													placeholder="Website*"
													className="form-control website"
												/>
											</div>
											<div className="col-md-12">
												<textarea
													rows={2}
													cols={80}
													defaultValue="A sua mensagem"
												></textarea>
											</div>
										</div>
										<div className="subimt-button clearfix">
											<input
												type="submit"
												value="Enviar"
												className="submit yellow-button"
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
