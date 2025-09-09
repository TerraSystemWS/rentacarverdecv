type Slide = {
	id: number;
	background: string;
	title1: string;
	title2: string;
	title3: string;
	subtitle: string;
	buttonText: string;
	buttonLink: string;
	carImage: string;
};

const slidesMock: Slide[] = [
	{
		id: 1,
		background: "/assets/images/slider-car/slider-bg.jpg",
		title1: "Todos os descontos só para você",
		title2: "Precisa ir a algum lado?",
		title3: "Escolha o mais confortável para si",
		subtitle: "Melhor oferta de Cabo Verde!!!!!",
		buttonText: "Contate agora",
		buttonLink: "#",
		carImage: "/assets/images/slider-car/slider-car-01.png",
	},
	{
		id: 2,
		background: "/assets/images/slider-car/slider-bg.jpg",
		title1: "Todos os descontos para si",
		title2: "Precisa de um transporte?",
		title3: "Escolha o mais confortável para si",
		subtitle: "Melhor oferta de Cabo Verde!!!!!",
		buttonText: "Contact Now",
		buttonLink: "#",
		carImage: "/assets/images/slider-car/slider-car-02.png",
	},
];

const MainSlider = () => {
	return (
		<>
			<div className="slider-block">
				<div className="rev_slider_wrapper">
					<div className="rev_slider carrent-slider">
						<ul>
							{slidesMock.map((slide) => (
								<li
									key={slide.id}
									data-transition="fade"
									data-slotamount="default"
									data-easein="Power4.easeInOut"
									data-easeout="Power4.easeInOut"
									data-masterspeed="2000"
									data-rotate="0"
									data-fstransition="fade"
									data-fsmasterspeed="1500"
									data-fsslotamount="7"
									data-saveperformance="off"
									data-title="materialize Material"
									data-description=""
								>
									{/* Imagem principal */}
									<img
										src={slide.background}
										alt=""
										data-bgposition="center center"
										data-bgfit="cover"
										data-bgrepeat="no-repeat"
										className="rev-slidebg"
										data-no-retina
									/>

									{/* Texto 1 */}
									<div className="tp-caption tp-resizeme rev-subheading">
										{slide.title1}
									</div>

									{/* Texto 2 */}
									<div
										className="tp-caption tp-resizeme rev-subheading"
										style={{
											color: "#e91e22",
											fontFamily: "exo, sans-serif",
											fontWeight: 800,
										}}
									>
										{slide.title2}
									</div>

									{/* Texto 3 */}
									<div
										className="tp-caption tp-resizeme NotGeneric-Title"
										style={{
											color: "#000000",
											fontFamily: "exo, sans-serif",
											fontWeight: 900,
											textTransform: "uppercase",
										}}
									>
										{slide.title3}
									</div>

									{/* Subtítulo */}
									<div className="tp-caption rev-subheading tp-resizeme">
										{slide.subtitle}
									</div>

									{/* Botão */}
									<div
										className="tp-caption tp-resizeme"
										style={{
											fontWeight: "bold",
											fontFamily: "exo, sans-serif",
										}}
									>
										<a
											href={slide.buttonLink}
											className="button black-button slider-button"
										>
											{slide.buttonText}
										</a>
									</div>

									{/* Imagem do carro */}
									<div className="tp-caption tp-resizeme">
										<img
											src="/assets/images/dummy.png"
											alt=""
											data-lazyload={slide.carImage}
											data-ww="['805','805','500','350']"
											data-hh="['auto']"
										/>
									</div>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</>
	);
};
export default MainSlider;
