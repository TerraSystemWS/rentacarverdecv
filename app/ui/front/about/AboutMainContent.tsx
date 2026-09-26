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
										{/* HTML do editor de texto rico (sanitizado no backend); valores
										    antigos em texto simples continuam a funcionar. */}
										<div dangerouslySetInnerHTML={{ __html: asHtml(data.p1) }} />
										<div dangerouslySetInnerHTML={{ __html: asHtml(data.p2) }} />
									</div>
								</div>
								<div className="col-md-6">
									<Image
										src="/assets/images/about/rentcv_art.png"
										alt="imagem sobre nós"
										width={555}
										height={350}
										className="img-fluid rounded-3xl object-cover shadow-lg shadow-black/10"
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

function asHtml(value: string | undefined): string {
	if (!value) return "";
	if (/<[a-z][\s\S]*>/i.test(value)) return value;
	const escaped = value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	return `<p>${escaped}</p>`;
}
