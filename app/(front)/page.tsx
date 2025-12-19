import MainSlider from "../ui/front/minis/mainSlider";
import CheckVehicleArea from "../ui/front/CheckVehicleArea";
import PopularVehicleBlock from "../ui/front/PopularVehicleBlock";
// import Headi from "./ui/front/head";
import RegularVehicleBlock from "../ui/front/RegularVehicleBlock";
import FunFactsBlock from "../ui/front/FunFactsBlock";
import DriverBlock from "../ui/front/DriverBlock";
import AppBlock from "../ui/front/AppBlock";
import CompanyBrandBlock from "../ui/front/CompanyBrandBlock";
import BlogArea from "../ui/front/BlogArea";

const vehiclesData = [
	{
		id: 1,
		title: "Economy Sedan",
		image: "/assets/images/popular/popular-01.png",
		rentPerDay: "$50",
		rentPerKm: "$0.50",
		link: "/vehicles/economy-sedan",
	},
	{
		id: 2,
		title: "Luxury SUV",
		image: "/assets/images/popular/popular-02.png",
		rentPerDay: "$120",
		rentPerKm: "$1.20",
		link: "/vehicles/luxury-suv",
	},
	{
		id: 3,
		title: "Minivan",
		image: "/assets/images/popular/popular-03.png",
		rentPerDay: "$80",
		rentPerKm: "$0.80",
		link: "/vehicles/minivan",
	},
	{
		id: 4,
		title: "Sports Car",
		image: "/assets/images/popular/popular-04.png",
		rentPerDay: "$150",
		rentPerKm: "$1.50",
		link: "/vehicles/sports-car",
	},
	{
		id: 5,
		title: "Compact Car",
		image: "/assets/images/popular/popular-05.png",
		rentPerDay: "$40",
		rentPerKm: "$0.40",
		link: "/vehicles/compact-car",
	},
];

// app/page.tsx (Home)
export const metadata = {
	title: "Página Inicial", // vai gerar: "Página Inicial — Rent a Car Verde"
	description: "Alugue o seu carro em Cabo Verde de forma fácil e rápida",
};

const Home = () => {
	return (
		<>
			<MainSlider />
			{/* Divider */}
			<div className="vehicle-section-divider night-rider">
				<div className="contoiner-fluid">
					<div className="row">
						<div className="col-md-12">
							<div className="section-divider-content">
								<div className="vehicle-border">
									<img src="/assets/images/block-car01.png" alt="car-item" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* fim do divider */}
			<CheckVehicleArea />
			{/* <!-- /.vehicle-multi-border --> */}
			<div className="vehicle-multi-border yellow-black"></div>
			<PopularVehicleBlock />
			{/* <PopularVehicleBlock vehicles={vehiclesData} /> */}
			{/* RegularVehicleBlock */}
			<RegularVehicleBlock />
			{/* fun facts block */}
			<FunFactsBlock />
			{/* motoristas */}
			<DriverBlock />
			{/* mobile app */}
			<AppBlock />
			{/* parceiros */}
			<CompanyBrandBlock />
			{/* Blog Area */}
			<BlogArea />
		</>
	);
};

export default Home;

// import Script from "next/script";

// const Home = () => {
// 	return (
// 		<>
// 			<div className="slider-block">
// 				<div className="rev_slider_wrapper">
// 					<div className="rev_slider carrent-slider">
// 						<ul>
// 							{/* <!-- slide 1 -->  */}
// 							<li
// 								data-transition="fade"
// 								data-slotamount="default"
// 								data-easein="Power4.easeInOut"
// 								data-easeout="Power4.easeInOut"
// 								data-masterspeed="2000"
// 								data-rotate="0"
// 								data-fstransition="fade"
// 								data-fsmasterspeed="1500"
// 								data-fsslotamount="7"
// 								data-saveperformance="off"
// 								data-title="materialize Material"
// 								data-description=""
// 							>
// 								{/* <!-- main image --> */}
// 								<img
// 									src="/assets/images/slider-car/slider-bg.jpg"
// 									alt=""
// 									data-bgposition="center center"
// 									data-bgfit="cover"
// 									data-bgrepeat="no-repeat"
// 									className="rev-slidebg"
// 									data-no-retina
// 								/>

// 								{/* <!-- layer no 1 --> */}
// 								<div
// 									className="tp-caption tp-resizeme rev-subheading"
// 									data-type="text"
// 									data-x="['left','left','left','center']"
// 									data-hoffset="['105','105','75','-85']"
// 									data-y="['middle']"
// 									data-voffset="['-163','-163','-130','-130']"
// 									data-fontsize="['22','22','22','22']"
// 									data-lineheight="['30','30','30','30']"
// 									data-width="none"
// 									data-height="none"
// 									data-whitespace="nowrap"
// 									data-transform_idle="o:1;"
// 									data-transform_in="y:[100%];z:0;rX:0deg;rY:0;rZ:0;sX:1;sY:1;skX:0;skY:0;opacity:0;s:600;e:Power4.easeInOut;"
// 									data-transform_out="y:[100%];s:1000;e:Power2.easeInOut;s:1000;e:Power2.easeInOut;"
// 									data-mask_in="x:0px;y:[100%];s:inherit;e:inherit;"
// 									data-mask_out="x:inherit;y:inherit;s:inherit;e:inherit;"
// 									data-start="800"
// 									data-splitin="none"
// 									data-splitout="none"
// 									data-responsive_offset="on"
// 									style={{
// 										zIndex: 5,
// 										color: "#464646",
// 										fontWeight: 600,
// 										fontFamily: "inherit",
// 									}}
// 								>
// 									Todos os descontos só para você
// 								</div>

// 								{/* <!-- layer no 2 --> */}
// 								<div
// 									className="tp-caption tp-resizeme rev-subheading"
// 									data-type="text"
// 									data-x="['left','left','left','center']"
// 									data-hoffset="['102','102','75','-75']"
// 									data-y="['middle']"
// 									data-voffset="['-110','-110','-90','-90']"
// 									data-whitespace="nowrap"
// 									data-transform_idle="o:1;"
// 									data-fontsize="['60','60','45','45']"
// 									data-lineheight="['60','60','60','60']"
// 									data-transform_in="y:[100%];z:0;rX:0deg;rY:0;rZ:0;sX:1;sY:1;skX:0;skY:0;opacity:0;s:600;e:Power4.easeInOut;"
// 									data-transform_out="y:[100%];s:1000;e:Power2.easeInOut;s:1000;e:Power2.easeInOut;"
// 									data-mask_in="x:0px;y:[100%];s:inherit;e:inherit;"
// 									data-mask_out="x:inherit;y:inherit;s:inherit;e:inherit;"
// 									data-start="1000"
// 									data-splitin="none"
// 									data-splitout="none"
// 									data-responsive_offset="on"
// 									style={{
// 										zIndex: 6,
// 										color: "#e91e22",
// 										fontFamily: "exo, sans-serif",
// 										fontWeight: 800,
// 									}}
// 								>
// 									Precisa ir a algum lado?
// 								</div>

// 								{/* <!-- layer no 3 --> */}
// 								<div
// 									className="tp-caption tp-resizeme NotGeneric-Title"
// 									data-type="text"
// 									data-x="['left','left','left','center']"
// 									data-hoffset="['103','103','75','0']"
// 									data-y="['middle']"
// 									data-voffset="['0']"
// 									data-whitespace="nowrap"
// 									data-transform_idle="o:1;"
// 									data-fontsize="['60','60','45','45']"
// 									data-lineheight="['75','75','60','60']"
// 									data-transform_in="y:[100%];z:0;rX:0deg;rY:0;rZ:0;sX:1;sY:1;skX:0;skY:0;opacity:0;s:600;e:Power4.easeInOut;"
// 									data-transform_out="y:[100%];s:1000;e:Power2.easeInOut;s:1000;e:Power2.easeInOut;"
// 									data-mask_in="x:0px;y:[100%];s:inherit;e:inherit;"
// 									data-mask_out="x:inherit;y:inherit;s:inherit;e:inherit;"
// 									data-start="1000"
// 									data-splitin="none"
// 									data-splitout="none"
// 									data-responsive_offset="on"
// 									style={{
// 										zIndex: 7,
// 										color: "#000000",
// 										fontFamily: "exo, sans-serif",
// 										fontWeight: 900,
// 										textTransform: "uppercase",
// 									}}
// 								>
// 									Escolha o mais
// 									<br /> comfortavel para si
// 								</div>

// 								{/* <!-- layer no 4 --> */}
// 								<div
// 									className="tp-caption rev-subheading tp-resizeme"
// 									data-type="text"
// 									data-x="['left','left','left','center']"
// 									data-hoffset="['105','105','75','-28']"
// 									data-y="['middle']"
// 									data-voffset="['95','95','75','75']"
// 									data-fontsize="['24']"
// 									data-lineheight="['20']"
// 									data-width="none"
// 									data-height="none"
// 									data-whitespace="nowrap"
// 									data-transform_idle="o:1;"
// 									data-transform_in="y:[100%];z:0;rX:0deg;rY:0;rZ:0;sX:1;sY:1;skX:0;skY:0;opacity:0;s:600;e:Power4.easeInOut;"
// 									data-transform_out="y:[100%];s:1000;e:Power2.easeInOut;s:1000;e:Power2.easeInOut;"
// 									data-mask_in="x:0px;y:[100%];s:inherit;e:inherit;"
// 									data-mask_out="x:inherit;y:inherit;s:inherit;e:inherit;"
// 									data-start="800"
// 									data-splitin="none"
// 									data-splitout="none"
// 									data-responsive_offset="on"
// 									style={{
// 										zIndex: 5,
// 										color: "#464646",
// 										fontWeight: 600,
// 										fontFamily: "inherit",
// 									}}
// 								>
// 									Melhor oferta de Cabo Verde!!!!!
// 								</div>

// 								{/* <!-- layer no 5 --> */}
// 								<div
// 									className="tp-caption tp-resizeme"
// 									data-x="['left','left','left','center']"
// 									data-hoffset="['105','105','75','-105']"
// 									data-y="['middle']"
// 									data-voffset="['150','150','135','120']"
// 									data-fontsize="['22']"
// 									data-lineheight="['45']"
// 									data-width="none"
// 									data-height="none"
// 									data-whitespace="nowrap"
// 									data-transform_idle="o:1;"
// 									data-style_hover="cursor:default;"
// 									data-transform_in="y:[100%];z:0;rX:0deg;rY:0;rZ:0;sX:1;sY:1;skX:0;skY:0;opacity:0;s:600;e:Power4.easeInOut;"
// 									data-transform_out="y:[100%];s:600;e:Power2.easeInOut;s:600;e:Power2.easeInOut;"
// 									data-mask_in="x:0px;y:[100%];s:inherit;e:inherit;"
// 									data-mask_out="x:inherit;y:inherit;s:inherit;e:inherit;"
// 									data-start="1200"
// 									data-splitin="none"
// 									data-splitout="none"
// 									data-responsive_offset="on"
// 									style={{
// 										zIndex: 7,
// 										fontWeight: "bold",
// 										fontFamily: "exo, sans-serif",
// 									}}
// 								>
// 									<a
// 										href="#"
// 										className="button black-button slider-button"
// 										data-fontsize="['22','22','22','22']"
// 									>
// 										Contate agora
// 									</a>
// 								</div>

// 								{/* <!-- layer no 6 --> */}
// 								<div
// 									className="tp-caption tp-resizeme"
// 									data-x="['right','right','right','center']"
// 									data-hoffset="['0','-15','30','-10']"
// 									data-y="['middle','middle','middle','bottom']"
// 									data-voffset="['15','15','0','0']"
// 									data-transform_idle="o:1;"
// 									data-visibility="['on','on','on','off']"
// 									data-transform_in="z:0;rX:0;rY:0;rZ:0;sX:0.9;sY:0.9;skX:0;skY:0;opacity:0;s:300;e:Power3.easeInOut;"
// 									data-transform_out="auto:auto;s:600;"
// 									data-splitin="none"
// 									data-start="1500"
// 									data-type="image"
// 									data-responsive_offset="on"
// 									data-width="none"
// 									data-height="none"
// 									data-no-retina
// 								>
// 									<img
// 										src="/assets/images/dummy.png"
// 										alt=""
// 										data-lazyload="/assets/images/slider-car/slider-car-01.png"
// 										data-ww="['805','805','500','350']"
// 										data-hh="['auto']"
// 									/>
// 								</div>
// 							</li>
// 							{/* <!-- /.slide 1 --> */}
// 							{/* <!-- slide 1 -->  */}
// 							<li
// 								data-transition="fade"
// 								data-slotamount="default"
// 								data-easein="Power4.easeInOut"
// 								data-easeout="Power4.easeInOut"
// 								data-masterspeed="2000"
// 								data-rotate="0"
// 								data-fstransition="fade"
// 								data-fsmasterspeed="1500"
// 								data-fsslotamount="7"
// 								data-saveperformance="off"
// 								data-title="materialize Material"
// 								data-description=""
// 							>
// 								{/* <!-- main image --> */}
// 								<img
// 									src="/assets/images/slider-car/slider-bg.jpg"
// 									alt=""
// 									data-bgposition="center center"
// 									data-bgfit="cover"
// 									data-bgrepeat="no-repeat"
// 									className="rev-slidebg"
// 									data-no-retina
// 								/>

// 								{/* <!-- layer no 1 --> */}
// 								<div
// 									className="tp-caption tp-resizeme rev-subheading"
// 									data-type="text"
// 									data-x="['left','left','left','center']"
// 									data-hoffset="['105','105','75','-85']"
// 									data-y="['middle']"
// 									data-voffset="['-163','-163','-130','-130']"
// 									data-fontsize="['22','22','22','22']"
// 									data-lineheight="['30','30','30','30']"
// 									data-width="none"
// 									data-height="none"
// 									data-whitespace="nowrap"
// 									data-transform_idle="o:1;"
// 									data-transform_in="y:[100%];z:0;rX:0deg;rY:0;rZ:0;sX:1;sY:1;skX:0;skY:0;opacity:0;s:600;e:Power4.easeInOut;"
// 									data-transform_out="y:[100%];s:1000;e:Power2.easeInOut;s:1000;e:Power2.easeInOut;"
// 									data-mask_in="x:0px;y:[100%];s:inherit;e:inherit;"
// 									data-mask_out="x:inherit;y:inherit;s:inherit;e:inherit;"
// 									data-start="800"
// 									data-splitin="none"
// 									data-splitout="none"
// 									data-responsive_offset="on"
// 									style={{
// 										zIndex: 5,
// 										color: "#464646",
// 										fontWeight: 600,
// 										fontFamily: "inherit",
// 									}}
// 								>
// 									Todos os descontos para si
// 								</div>

// 								{/* <!-- layer no 2 --> */}
// 								<div
// 									className="tp-caption tp-resizeme rev-subheading"
// 									data-type="text"
// 									data-x="['left','left','left','center']"
// 									data-hoffset="['102','102','75','-75']"
// 									data-y="['middle']"
// 									data-voffset="['-110','-110','-90','-90']"
// 									data-whitespace="nowrap"
// 									data-transform_idle="o:1;"
// 									data-fontsize="['60','60','45','45']"
// 									data-lineheight="['60','60','60','60']"
// 									data-transform_in="y:[100%];z:0;rX:0deg;rY:0;rZ:0;sX:1;sY:1;skX:0;skY:0;opacity:0;s:600;e:Power4.easeInOut;"
// 									data-transform_out="y:[100%];s:1000;e:Power2.easeInOut;s:1000;e:Power2.easeInOut;"
// 									data-mask_in="x:0px;y:[100%];s:inherit;e:inherit;"
// 									data-mask_out="x:inherit;y:inherit;s:inherit;e:inherit;"
// 									data-start="1000"
// 									data-splitin="none"
// 									data-splitout="none"
// 									data-responsive_offset="on"
// 									style={{
// 										zIndex: 6,
// 										color: "#e91e22",
// 										fontFamily: "exo, sans-serif",
// 										fontWeight: 800,
// 									}}
// 								>
// 									Precisa de um transporte?
// 								</div>

// 								{/* <!-- layer no 3 --> */}
// 								<div
// 									className="tp-caption tp-resizeme NotGeneric-Title"
// 									data-type="text"
// 									data-x="['left','left','left','center']"
// 									data-hoffset="['103','103','75','0']"
// 									data-y="['middle']"
// 									data-voffset="['0']"
// 									data-whitespace="nowrap"
// 									data-transform_idle="o:1;"
// 									data-fontsize="['60','60','45','45']"
// 									data-lineheight="['75','75','60','60']"
// 									data-transform_in="y:[100%];z:0;rX:0deg;rY:0;rZ:0;sX:1;sY:1;skX:0;skY:0;opacity:0;s:600;e:Power4.easeInOut;"
// 									data-transform_out="y:[100%];s:1000;e:Power2.easeInOut;s:1000;e:Power2.easeInOut;"
// 									data-mask_in="x:0px;y:[100%];s:inherit;e:inherit;"
// 									data-mask_out="x:inherit;y:inherit;s:inherit;e:inherit;"
// 									data-start="1000"
// 									data-splitin="none"
// 									data-splitout="none"
// 									data-responsive_offset="on"
// 									style={{
// 										zIndex: 7,
// 										color: "#000000",
// 										fontFamily: "exo, sans-serif",
// 										fontWeight: 900,
// 										textTransform: "uppercase",
// 									}}
// 								>
// 									Escolha o mais
// 									<br /> comfortavel para si
// 								</div>

// 								{/* <!-- layer no 4 --> */}
// 								<div
// 									className="tp-caption rev-subheading tp-resizeme"
// 									data-type="text"
// 									data-x="['left','left','left','center']"
// 									data-hoffset="['105','105','75','-28']"
// 									data-y="['middle']"
// 									data-voffset="['95','95','75','75']"
// 									data-fontsize="['24']"
// 									data-lineheight="['20']"
// 									data-width="none"
// 									data-height="none"
// 									data-whitespace="nowrap"
// 									data-transform_idle="o:1;"
// 									data-transform_in="y:[100%];z:0;rX:0deg;rY:0;rZ:0;sX:1;sY:1;skX:0;skY:0;opacity:0;s:600;e:Power4.easeInOut;"
// 									data-transform_out="y:[100%];s:1000;e:Power2.easeInOut;s:1000;e:Power2.easeInOut;"
// 									data-mask_in="x:0px;y:[100%];s:inherit;e:inherit;"
// 									data-mask_out="x:inherit;y:inherit;s:inherit;e:inherit;"
// 									data-start="800"
// 									data-splitin="none"
// 									data-splitout="none"
// 									data-responsive_offset="on"
// 									style={{
// 										zIndex: 5,
// 										color: "#464646",
// 										fontWeight: 600,
// 										fontFamily: "inherit",
// 									}}
// 								>
// 									Melhor oferta de Cabo Verde!!!!!
// 								</div>

// 								{/* <!-- layer no 5 --> */}
// 								<div
// 									className="tp-caption tp-resizeme"
// 									data-x="['left','left','left','center']"
// 									data-hoffset="['105','105','75','-105']"
// 									data-y="['middle']"
// 									data-voffset="['150','150','135','120']"
// 									data-fontsize="['22']"
// 									data-lineheight="['45']"
// 									data-width="none"
// 									data-height="none"
// 									data-whitespace="nowrap"
// 									data-transform_idle="o:1;"
// 									data-style_hover="cursor:default;"
// 									data-transform_in="y:[100%];z:0;rX:0deg;rY:0;rZ:0;sX:1;sY:1;skX:0;skY:0;opacity:0;s:600;e:Power4.easeInOut;"
// 									data-transform_out="y:[100%];s:600;e:Power2.easeInOut;s:600;e:Power2.easeInOut;"
// 									data-mask_in="x:0px;y:[100%];s:inherit;e:inherit;"
// 									data-mask_out="x:inherit;y:inherit;s:inherit;e:inherit;"
// 									data-start="1200"
// 									data-splitin="none"
// 									data-splitout="none"
// 									data-responsive_offset="on"
// 									style={{
// 										zIndex: 7,
// 										fontWeight: "bold",
// 										fontFamily: "Exo, sans-serif",
// 									}}
// 								>
// 									<a
// 										href="#"
// 										className="button black-button slider-button"
// 										data-fontsize="['22','22','22','22']"
// 									>
// 										Contact Now
// 									</a>
// 								</div>

// 								{/* <!-- layer no 6 --> */}
// 								<div
// 									className="tp-caption tp-resizeme"
// 									data-x="['right','right','right','center']"
// 									data-hoffset="['0','-15','30','-10']"
// 									data-y="['middle','middle','middle','bottom']"
// 									data-voffset="['15','15','0','0']"
// 									data-transform_idle="o:1;"
// 									data-visibility="['on','on','on','off']"
// 									data-transform_in="z:0;rX:0;rY:0;rZ:0;sX:0.9;sY:0.9;skX:0;skY:0;opacity:0;s:300;e:Power3.easeInOut;"
// 									data-transform_out="auto:auto;s:600;"
// 									data-splitin="none"
// 									data-start="1500"
// 									data-type="image"
// 									data-responsive_offset="on"
// 									data-width="none"
// 									data-height="none"
// 									data-no-retina
// 								>
// 									<img
// 										src="/assets/images/dummy.png"
// 										alt=""
// 										data-lazyload="/assets/images/slider-car/slider-car-01.png"
// 										data-ww="['805','805','500','350']"
// 										data-hh="['auto']"
// 									/>
// 								</div>
// 							</li>
// 							{/* <!--<!-- /.slide 1 -->*/}
// 						</ul>
// 					</div>
// 					{/* <!--<!-- /.revolution slider -->*/}
// 				</div>
// 				{/* <!--<!-- /.slider wrapper -->*/}
// 			</div>
// 			{/* <!-- ====== Section divider ====== -->  */}
// 			<div className="vehicle-section-divider night-rider">
// 				<div className="contoiner-fluid">
// 					<div className="row">
// 						<div className="col-md-12">
// 							<div className="section-divider-content">
// 								<div className="vehicle-border">
// 									<img src="/assets/images/block-car01.png" alt="car-item" />
// 								</div>
// 							</div>
// 						</div>
// 					</div>
// 				</div>
// 			</div>
// 		</>
// 	);
// };

// export default Home;
