"use client";

import React from "react";
import Link from "next/link";
import { useFormatter, useLocale, useTranslations } from "next-intl";

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
import { tr, trList } from "@/lib/i18n/translate";

interface BlogPostProps {
	post: Post;
}

const BlogPost: React.FC<BlogPostProps> = ({ post }) => {
	const t = useTranslations("posts");
	const format = useFormatter();
	const locale = useLocale();
	const postHref = `/posts/${post.slug}`;
	const formattedDate = post.createdAt ? format.dateTime(new Date(post.createdAt), { day: "2-digit", month: "short" }) : "";

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
					<img src={getImageSrc(post.imageUrl)} alt={tr(post, "title", locale)} />
				</Link>
			</figure>

			<div className="post-content">
				<div className="entry-meta">
					<span className="entry-date nevy-bg">{formattedDate}</span>
					<span className="entry-author green-bg">
						<i className="fa fa-user" />
						{post.author || t("defaultAuthor")}
					</span>
				</div>

				<h2 className="entry-title">
					<Link href={postHref}>{tr(post, "title", locale)}</Link>
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
