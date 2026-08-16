"use client";

import React from "react";
import Link from "next/link";
import { Post } from "@/lib/api/types";
import { API_BASE_URL } from "@/lib/api/endpoints";
import AdSlot from "../AdSlot";

interface BlogSidebarProps {
	recentPosts: Post[];
	currentSlug?: string;
}

const BlogSidebar: React.FC<BlogSidebarProps> = ({ recentPosts, currentSlug }) => {
	const getImageSrc = (url?: string | null) => {
		if (!url) return "/assets/images/blog/blog-two.png";
		if (url.startsWith("/uploads")) return `${API_BASE_URL}${url}`;
		return url;
	};

	const others = recentPosts.filter((p) => p.slug !== currentSlug).slice(0, 4);

	return (
		<div className="col-md-4 blog-sidebar">
			<div className="blog-content-right nevy-bg">
				{/* Posts Recentes */}
				<div className="widget widget_popular_posts clearfix">
					<h4 className="widget-title">Novidades Recentes</h4>
					<div className="widget-content">
						{others.length === 0 && (
							<p className="text-sm opacity-60">Sem outras novidades por agora.</p>
						)}
						{others.map((post) => (
							<div className="post-content clearfix" key={post.id}>
								<div className="image-content">
									<Link href={`/posts/${post.slug}`}>
										<img src={getImageSrc(post.imageUrl)} alt={post.title} />
									</Link>
								</div>
								<div className="post-info">
									<h5 className="widget-post-title">
										<Link href={`/posts/${post.slug}`}>{post.title}</Link>
									</h5>
									<span className="post-date">
										{post.createdAt ? new Date(post.createdAt).toLocaleDateString("pt-PT") : ""}
									</span>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Publicidade — campanha(s) reais do painel para o placement SIDEBAR */}
				<div className="widget widget_adds clearfix">
					<AdSlot placement="SIDEBAR" />
				</div>
			</div>
		</div>
	);
};

export default BlogSidebar;
