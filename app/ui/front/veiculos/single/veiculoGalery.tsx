"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { useState } from "react";
// import SwiperCore, { Navigation, Pagination, Zoom } from "swiper";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/zoom";
import { useTranslations } from "next-intl";
import ImageLightbox from "@/app/ui/front/ImageLightbox";
import { withWidth } from "@/lib/utils/media";

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
	// Imagem aberta em grande (com lupa e setas); null = fechada.
	const [open, setOpen] = useState<number | null>(null);
	const t = useTranslations("lightbox");

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
						<button type="button" className="block w-full cursor-zoom-in p-0 border-0 bg-transparent" onClick={() => setOpen(idx)} aria-label={t("open")}>
							<img src={withWidth(img.src, 1280)} alt={img.alt} />
						</button>
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
						<img src={withWidth(img.src, 320)} alt={img.alt} loading="lazy" />
					</SwiperSlide>
				))}
			</Swiper>

			{open !== null && (
				<ImageLightbox images={images} index={open} onClose={() => setOpen(null)} onIndexChange={setOpen} />
			)}
		</main>
	);
};

export default VehicleGallery;
