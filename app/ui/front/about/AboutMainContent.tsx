// components/AboutMainContent.jsx
import Image from "next/image";

export default function AboutMainContent() {
	return (
		<div className="about-main-content mr-top-90">
			<div className="container">
				<div className="row">
					<div className="col-md-12">
						<div className="about-top-content">
							<div className="row">
								<div className="col-md-12">
									<div className="heading-content-three">
										<h2 className="title">
											Por que <br />
											nos escolher
										</h2>
										<h4 className="sub-title">
											Excelência e confiança em serviços de aluguel de veículos
										</h4>
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col-md-12">
									<h2 className="extra-big-title">
										Melhor serviço de aluguel de veículos — aproveite cada
										viagem com conforto
									</h2>
								</div>
								<div className="col-md-6">
									<div className="about-content-left">
										<p>
											Fundada em [ano de fundação], nossa empresa se dedica a
											oferecer serviços de aluguel de veículos com qualidade,
											segurança e conforto. Atendemos clientes em todo o país,
											garantindo que cada experiência seja prática e agradável,
											seja para viagens de negócios, lazer ou transporte diário.
										</p>
										<p>
											Nossa frota é moderna e regularmente inspecionada, com
											veículos para todas as necessidades e orçamentos. Com uma
											equipe treinada e comprometida, oferecemos suporte rápido
											e personalizado, assegurando a melhor experiência de
											mobilidade para cada cliente. Nossa missão é transformar
											cada viagem em um momento seguro e eficiente, sempre com
											transparência e responsabilidade.
										</p>
									</div>
								</div>
								<div className="col-md-6">
									<Image
										src="/assets/images/about/about-01.png"
										alt="imagem sobre nós"
										width={600}
										height={400}
										className="img-fluid"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
