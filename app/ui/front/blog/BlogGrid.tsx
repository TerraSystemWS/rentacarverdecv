"use client";

import React from "react";
import Link from "next/link";

export type AuthorInfo =
	| string
	| {
		name: string;
		role?: string;
		avatarUrl?: string;
	};

// export type BlogPostData = {
// 	id: number | string;
// 	slug?: string;
// 	img: string;
// 	date: string;
// 	author: AuthorInfo;
// 	title: string;
// 	views: number;
// 	likes: number;
// 	comments: number;
// };

import { Post } from "@/lib/api/types";
import { API_BASE_URL } from "@/lib/api/endpoints";

interface BlogPostProps {
	post: Post;
}

const BlogPost: React.FC<BlogPostProps> = ({ post }) => {
	const postHref = `/posts/${post.slug}`;
	const formattedDate = post.createdAt ? new Date(post.createdAt).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' }) : "";

	const getImageSrc = (url: string | undefined | null) => {
		if (!url) return "/assets/images/blog/blog-1.jpg";
		if (url.startsWith('blob:') || url.startsWith('data:')) return url;
		if (url.startsWith('/uploads')) {
			return `${API_BASE_URL}${url}`;
		}
		return url;
	};

	return (
		<article className="post">
			<figure className="post-thumb">
				<Link href={postHref}>
					<img src={getImageSrc(post.imageUrl)} alt={post.title} />
				</Link>
			</figure>

			<div className="post-content">
				<div className="entry-meta">
					<span className="entry-date nevy-bg">{formattedDate}</span>
					<span className="entry-author red-bg">
						<i className="fa fa-user" />
						{post.author || "Admin"}
					</span>
				</div>

				<h2 className="entry-title">
					<Link href={postHref}>{post.title}</Link>
				</h2>

				<div className="entry-footer">
					<div className="entry-footer-meta">
						<span className="entry-view">
							<i className="fa fa-eye" />
							0
						</span>

						<span className="entry-like">
							<Link href={postHref}>
								<i className="fa fa-heart-o" />
								0
							</Link>
						</span>

						<span className="entry-comments">
							<Link href={`${postHref}#comments`}>
								<i className="fa fa-comments" />
								0
							</Link>
						</span>
					</div>
				</div>
			</div>
		</article>
	);
};

interface BlogGridProps {
	posts: Post[];
}

const BlogGrid: React.FC<BlogGridProps> = ({ posts }) => {
	return (
		<div className="blog-content-left">
			<div className="row">
				{posts.map((post) => (
					<div className="col-md-6 col-sm-6 col-xs-6" key={post.id}>
						<BlogPost post={post} />
					</div>
				))}
			</div>
		</div>
	);
};

export default BlogGrid;
