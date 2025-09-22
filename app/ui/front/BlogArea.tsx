// BlogArea.tsx
"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

interface Post {
	id: number;
	image: string;
	date: string;
	author: string;
	title: string;
	views: number;
	likes: number;
	comments: number;
}

const posts: Post[] = [
	{
		id: 1,
		image: "/assets/images/blog/blog-two.png",
		date: "25 Julho, 2025",
		author: "Johan",
		title: "Obtenha o melhor preço de táxi na sua cidade.",
		views: 35,
		likes: 9,
		comments: 5,
	},
	{
		id: 2,
		image: "/assets/images/blog/blog-two.png",
		date: "25 Julho, 2025",
		author: "Johan",
		title: "Como escolher o carro certo para sua viagem.",
		views: 42,
		likes: 12,
		comments: 7,
	},
	{
		id: 3,
		image: "/assets/images/blog/blog-three.png",
		date: "25 Julho, 2025",
		author: "Sibbir",
		title: "Dicas para economizar em viagens de táxi.",
		views: 28,
		likes: 5,
		comments: 3,
	},
	{
		id: 4,
		image: "/assets/images/blog/blog-three.png",
		date: "25 Julho, 2025",
		author: "Sibbir",
		title: "Melhores rotas para chegar rápido ao destino.",
		views: 50,
		likes: 15,
		comments: 8,
	},
];

export default function BlogArea() {
	return (
		<div className="blog-content-block pd-90 bg-gray-color">
			<div className="container">
				<div className="row tb default-margin-bottom theme-red">
					<div className="col-md-10 block-title-area tb-cell">
						<div className="heading-content style-one border">
							<h3 className="subtitle">Nossas Novidades</h3>
							<h2 className="title">
								Novidades - <span>Lê os nossos artigos</span>
							</h2>
						</div>
					</div>

					<div className="col-md-2 hidden-xs block-navigation-area tb-cell">
						<div className="item-navigation nav-right">
							<a href="#" className="previous-item">
								<i className="fa fa-angle-left"></i>
							</a>

							<a href="#" className="next-item">
								<i className="fa fa-angle-right"></i>
							</a>
						</div>
					</div>
				</div>

				<div className="vehicle-blog-slider slider-style-two ">
					{/* Blog Slider */}
					<Swiper
						modules={[Navigation]}
						navigation={{
							nextEl: ".next-item",
							prevEl: ".previous-item",
						}}
						spaceBetween={24}
						slidesPerView={1}
						breakpoints={{
							640: { slidesPerView: 1 },
							768: { slidesPerView: 2 },
							1024: { slidesPerView: 3 },
						}}
					>
						{posts.map((post) => (
							<SwiperSlide key={post.id} className="flex justify-center">
								<article className="bg-white shadow-md rounded-lg overflow-hidden w-full">
									<figure className="post-thumb">
										<a href="#">
											<img
												src={post.image}
												alt={post.title}
												className="w-full h-48 object-cover"
											/>
										</a>
									</figure>
									<div className="post-content p-4">
										<div className="flex items-center justify-between mb-2 text-sm text-gray-500">
											<span className="bg-blue-500 text-white px-2 py-1 rounded">
												{post.date}
											</span>
											<span className="bg-red-500 text-white px-2 py-1 rounded flex items-center gap-1">
												<i className="fa fa-user"></i> {post.author}
											</span>
										</div>
										<h2 className="entry-title text-lg font-semibold mb-2">
											<a href="#" className="hover:text-red-500">
												{post.title}
											</a>
										</h2>
										<div className="flex gap-4 text-gray-500 text-sm">
											<span className="flex items-center gap-1">
												<i className="fa fa-eye"></i> {post.views}
											</span>
											<span className="flex items-center gap-1">
												<a href="#">
													<i className="fa fa-heart-o"></i> {post.likes}
												</a>
											</span>
											<span className="flex items-center gap-1">
												<a href="#">
													<i className="fa fa-comments"></i> {post.comments}
												</a>
											</span>
										</div>
									</div>
								</article>
							</SwiperSlide>
						))}
					</Swiper>
				</div>

				<div className="block-navigation-area visible-xs-block">
					<div className="view-all-item clearfix">
						<a href="#" className="view-all-btn">
							Ver Todos
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
