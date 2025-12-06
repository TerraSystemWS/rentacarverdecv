"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { useState } from "react";
// import SwiperCore, { Navigation, Pagination, Zoom } from "swiper";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/zoom";

interface GalleryImage {
	src: string;
	alt: string;
}

interface VehicleGalleryProps {
	images: GalleryImage[];
}

// SwiperCore.use([Navigation, Pagination, Zoom]);

const VehicleGallery: React.FC<VehicleGalleryProps> = ({ images }) => {
	const [thumbsSwiper, setThumbsSwiper] = useState(null);

	return (
		<main>
			<Swiper
				// style={{
				//   '--swiper-navigation-color': '#fff',
				//   '--swiper-pagination-color': '#fff',
				// }}
				loop={true}
				spaceBetween={10}
				navigation={true}
				thumbs={{ swiper: thumbsSwiper }}
				modules={[FreeMode, Navigation, Thumbs]}
				className="mySwiper2"
			>
				{/* <SwiperSlide key={idx}>
				<div className="swiper-zoom-container">
					<img src={img.src} alt={img.alt} />
				</div>
			</SwiperSlide> */}
				{images.map((img, idx) => (
					<SwiperSlide key={idx}>
						<img src={img.src} alt={img.alt} />
					</SwiperSlide>
				))}
			</Swiper>

			<Swiper
				// @ts-ignore
				onSwiper={setThumbsSwiper}
				loop={true}
				spaceBetween={10}
				slidesPerView={4}
				freeMode={true}
				watchSlidesProgress={true}
				modules={[FreeMode, Navigation, Thumbs]}
				className="mySwiper"
			>
				{images.map((img, idx) => (
					<SwiperSlide key={idx}>
						<img src={img.src} alt={img.alt} />
					</SwiperSlide>
				))}
			</Swiper>
		</main>
	);
};

export default VehicleGallery;
