"use client";

import { useEffect, useRef } from "react";

interface LayerStyle {
	color?: string;
	fontFamily?: string;
	fontWeight?: string | number;
	textTransform?:
		| "none"
		| "capitalize"
		| "uppercase"
		| "lowercase"
		| "full-width"
		| "full-size-kana";
	zIndex?: number;
	[key: string]: string | number | undefined;
}

interface LayerData {
	x: string;
	hoffset: string;
	y: string;
	voffset: string;
	fontsize?: string;
	lineheight?: string;
	start: string;
	visibility?: string;
}

interface Layer {
	type: string;
	className: string;
	content: string;
	data: LayerData;
	style?: LayerStyle;
}

interface Slide {
	id: number;
	bgImage: string;
	layers: Layer[];
}

const MainSlider = () => {
	const sliderRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Inicialização do Revolution Slider será feita pelo script global
	}, []);

	const slides: Slide[] = [
		{
			id: 1,
			bgImage: "/assets/images/slider-car/slider-bg.jpg",
			layers: [
				{
					type: "text",
					className: "tp-caption tp-resizeme rev-subheading",
					content: "All discount just for you",
					data: {
						x: "['left','left','left','center']",
						hoffset: "['105','105','75','-85']",
						y: "['middle']",
						voffset: "['-163','-163','-130','-130']",
						fontsize: "['22','22','22','22']",
						lineheight: "['30','30','30','30']",
						start: "800",
					},
				},
				{
					type: "text",
					className: "tp-caption tp-resizeme rev-subheading",
					content: "Need A Ride?",
					data: {
						x: "['left','left','left','center']",
						hoffset: "['102','102','75','-75']",
						y: "['middle']",
						voffset: "['-110','-110','-90','-90']",
						fontsize: "['60','60','45','45']",
						lineheight: "['60','60','60','60']",
						start: "1000",
					},
					style: {
						color: "#e91e22",
						fontFamily: "'Exo', sans-serif",
						fontWeight: 800,
					},
				},
				{
					type: "text",
					className: "tp-caption tp-resizeme NotGeneric-Title",
					content: "Choose your<br> Comfortable Taxi",
					data: {
						x: "['left','left','left','center']",
						hoffset: "['103','103','75','0']",
						y: "['middle']",
						voffset: "['0']",
						fontsize: "['60','60','45','45']",
						lineheight: "['75','75','60','60']",
						start: "1000",
					},
					style: {
						color: "#000000",
						fontFamily: "'Exo', sans-serif",
						fontWeight: 900,
						textTransform: "uppercase" as const,
					},
				},
				{
					type: "text",
					className: "tp-caption rev-subheading tp-resizeme",
					content: "Best worldwide car hire deals!!!!!",
					data: {
						x: "['left','left','left','center']",
						hoffset: "['105','105','75','-28']",
						y: "['middle']",
						voffset: "['95','95','75','75']",
						fontsize: "['24']",
						lineheight: "['20']",
						start: "800",
					},
				},
				{
					type: "button",
					className: "tp-caption tp-resizeme",
					content:
						'<a href=\'#\' class=\'button black-button slider-button\' data-fontsize=\'["22","22","22","22"]\'>Contact Now</a>',
					data: {
						x: "['left','left','left','center']",
						hoffset: "['105','105','75','-105']",
						y: "['middle']",
						voffset: "['150','150','135','120']",
						fontsize: "['22']",
						lineheight: "['45']",
						start: "1200",
					},
					style: {
						fontWeight: "bold",
						fontFamily: "'Exo', sans-serif",
					},
				},
				{
					type: "image",
					className: "tp-caption tp-resizeme",
					content:
						"<img src='/assets/images/dummy.png' alt='' data-lazyload='/assets/images/slider-car/slider-car-01.png' data-ww='[\"805\",\"805\",\"500\",\"350\"]' data-hh='[\"auto\"]'>",
					data: {
						x: "['right','right','right','center']",
						hoffset: "['0','-15','30','-10']",
						y: "['middle','middle','middle','bottom']",
						voffset: "['15','15','0','0']",
						visibility: "['on','on','on','off']",
						start: "1500",
					},
				},
			],
		},
		{
			id: 2,
			bgImage: "/assets/images/slider-car/slider-bg.jpg",
			layers: [
				// Adicione as camadas para o segundo slide aqui
			],
		},
	];

	return (
		<div className="slider-block">
			<div className="rev_slider_wrapper">
				<div className="rev_slider carrent-slider" ref={sliderRef}>
					<ul>
						{slides.map((slide) => (
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
								{/* Imagem de fundo */}
								<img
									src={slide.bgImage}
									alt=""
									data-bgposition="center center"
									data-bgfit="cover"
									data-bgrepeat="no-repeat"
									className="rev-slidebg"
									data-no-retina
								/>

								{/* Renderizar camadas */}
								{slide.layers.map((layer, index) => (
									<div
										key={index}
										className={layer.className}
										data-type={layer.type}
										data-x={layer.data.x}
										data-hoffset={layer.data.hoffset}
										data-y={layer.data.y}
										data-voffset={layer.data.voffset}
										data-fontsize={layer.data.fontsize}
										data-lineheight={layer.data.lineheight}
										data-width="none"
										data-height="none"
										data-whitespace="nowrap"
										data-transform_idle="o:1;"
										data-transform_in="y:[100%];z:0;rX:0deg;rY:0;rZ:0;sX:1;sY:1;skX:0;skY:0;opacity:0;s:600;e:Power4.easeInOut;"
										data-transform_out="y:[100%];s:1000;e:Power2.easeInOut;s:1000;e:Power2.easeInOut;"
										data-mask_in="x:0px;y:[100%];s:inherit;e:inherit;"
										data-mask_out="x:inherit;y:inherit;s:inherit;e:inherit;"
										data-start={layer.data.start}
										data-splitin="none"
										data-splitout="none"
										data-responsive_offset="on"
										style={{
											zIndex: 5 + index,
											color: "#464646",
											fontWeight: 600,
											fontFamily: "inherit",
											...layer.style,
										}}
										dangerouslySetInnerHTML={{ __html: layer.content }}
									/>
								))}
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
};

export default MainSlider;
