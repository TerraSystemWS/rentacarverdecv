// BlogArea.tsx
"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import { useState, useEffect } from "react";
import { endpoints, API_BASE_URL } from "@/lib/api/endpoints";
import { Post as BlogPost } from "@/lib/api/types";
import Link from "next/link";

export default function BlogArea() {
	const [posts, setPosts] = useState<BlogPost[]>([]);

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const res = await fetch(`${API_BASE_URL}${endpoints.posts.list}`);
				if (res.ok) {
					const data = await res.json();
					setPosts(data.slice(0, 6)); // Show only latest 6
				}
			} catch (error) {
				console.error("Error fetching posts:", error);
			}
		};
		fetchPosts();
	}, []);

	const getImageSrc = (url: string | undefined | null) => {
		if (!url) return "/assets/images/blog/blog-two.png";
		if (url.startsWith('blob:') || url.startsWith('data:')) return url;
		if (url.startsWith('/uploads')) {
			return `${API_BASE_URL}${url}`;
		}
		return url;
	};

	if (posts.length === 0) return null;

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
										<Link href={`/posts/${post.slug}`}>
											<img
												src={getImageSrc(post.imageUrl)}
												alt={post.title}
												className="w-full h-48 object-cover"
											/>
										</Link>
									</figure>
									<div className="post-content p-4">
										<div className="flex items-center justify-between mb-2 text-sm text-gray-500">
											<span className="bg-blue-500 text-white px-2 py-1 rounded">
												{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ""}
											</span>
											<span className="bg-red-500 text-white px-2 py-1 rounded flex items-center gap-1">
												<i className="fa fa-user"></i> {post.author || "Admin"}
											</span>
										</div>
										<h2 className="entry-title text-lg font-semibold mb-2">
											<Link href={`/posts/${post.slug}`} className="hover:text-red-500">
												{post.title}
											</Link>
										</h2>
										<div className="flex gap-4 text-gray-500 text-sm">
											<span className="flex items-center gap-1">
												<i className="fa fa-eye"></i> 0
											</span>
											<span className="flex items-center gap-1">
												<Link href={`/posts/${post.slug}`}>
													<i className="fa fa-heart-o"></i> 0
												</Link>
											</span>
											<span className="flex items-center gap-1">
												<Link href={`/posts/${post.slug}#comments`}>
													<i className="fa fa-comments"></i> 0
												</Link>
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
						<Link href="/posts" className="view-all-btn">
							Ver Todos
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
