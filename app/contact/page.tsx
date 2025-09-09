const Contact = () => {
	return (
		<>
			{/* ====== Cabeçalho da Página ====== */}
			<div className="page-header nevy-bg">
				<div className="container">
					<div className="row">
						<div className="col-md-12">
							<h2 className="page-title">Contacto</h2>
							<p className="page-description yellow-color">Fale connosco</p>
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
								<h2 className="title">
									Contacte-nos
									<br /> em direto
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
									<p>
										112/B - Rua 08/A Melbourne <br />
										Austrália
									</p>
								</div>

								<div className="contact">
									<h4>
										<i className="fa fa-phone"></i> Telefone
									</h4>
									<p>
										+88 0215469875 <br />
										666 35874692050
									</p>
								</div>

								<div className="contact">
									<h4>
										<i className="fa fa-envelope"></i> Email
									</h4>
									<p>
										exemplo@dominio.com <br /> exemplomail@dominio.com
									</p>
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
								<h3 className="subtitle">Encontre a nossa localização</h3>
								<h2 className="title color-nevy">Mapa &amp; Direções</h2>
							</div>
							<div className="header-map-content">
								<iframe
									height="550"
									src="https://www.google.com/maps/embed/v1/place?key=AIzaSyC871wKM6aoCLSV_pT3xBVsYzNGXaDh7Pw&q=121+King+St,Melbourne+VIC+3000,Australia"
									allowFullScreen
								></iframe>
							</div>
							<p>
								Descubra como chegar até nós a partir da sua localização atual
							</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Contact;
