// components/AboutMainContent.jsx
import Image from "next/image";

interface AboutMainContentProps {
	content?: {
		mainTitle: string;
		mainSubtitle: string;
		bigTitle: string;
		p1: string;
		p2: string;
	};
}

export default function AboutMainContent({ content }: AboutMainContentProps) {
	// Fallback content if none provided
	const data = content || {
		mainTitle: "Por que \nnos escolher",
		mainSubtitle: "Excelência e confiança em serviços de aluguel de veículos",
		bigTitle: "Melhor serviço de aluguel de veículos — aproveite cada viagem com conforto",
		p1: "Fundada em [ano de fundação], nossa empresa se dedica a oferecer serviços de aluguel de veículos com qualidade, segurança e conforto. Atendemos clientes em todo o país, garantindo que cada experiência seja prática e agradável, seja para viagens de negócios, lazer ou transporte diário.",
		p2: "Nossa frota é moderna e regularmente inspecionada, com veículos para todas as necessidades e orçamentos. Com uma equipe treinada e comprometida, oferecemos suporte rápido e personalizado, assegurando a melhor experiência de mobilidade para cada cliente. Nossa missão é transformar cada viagem em um momento seguro e eficiente, sempre com transparência e responsabilidade."
	};

	return (
		<div className="about-main-content mr-top-90">
			<div className="container">
				<div className="row">
					<div className="col-md-12">
						<div className="about-top-content">
							<div className="row">
								<div className="col-md-12">
									<div className="heading-content-three">
										<h2 className="title" dangerouslySetInnerHTML={{ __html: data.mainTitle.replace(/\n/g, '<br />') }}>
										</h2>
										<h4 className="sub-title">
											{data.mainSubtitle}
										</h4>
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col-md-12">
									<h2 className="extra-big-title">
										{data.bigTitle}
									</h2>
								</div>
								<div className="col-md-6">
									<div className="about-content-left">
										<p>{data.p1}</p>
										<p>{data.p2}</p>
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
