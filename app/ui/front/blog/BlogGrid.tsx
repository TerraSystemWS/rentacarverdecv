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

export type BlogPostData = {
	id: number | string;
	slug: string;
	title: string;
	author: {
		name: string;
		role: string;
		avatarUrl: string;
	};
	coverImageUrl: string;
	date: string;
	views: number;
	likes: number;
	comments: number;
};

// export interface BlogPostData {
// 	id: number | string;
// 	slug: string;
// 	title: string;
// 	author: Author; // MESMO AUTHOR do SingleMainContent
// 	coverImageUrl: string;
// 	date: string;

// 	// estatísticas apenas para o card/listagem:
// 	views: number;
// 	likes: number;
// 	comments: number;
// }

interface BlogPostProps {
	post: BlogPostData;
}

const BlogPost: React.FC<BlogPostProps> = ({ post }) => {
	const postHref = `/posts/${post.slug}`;

	return (
		<article className="post">
			<figure className="post-thumb">
				<Link href={postHref}>
					<img src={post.coverImageUrl} alt={post.title} />
				</Link>
			</figure>

			<div className="post-content">
				<div className="entry-meta">
					<span className="entry-date nevy-bg">{post.date}</span>
					<span className="entry-author red-bg">
						<i className="fa fa-user" />
						{post.author.name}
					</span>
				</div>

				<h2 className="entry-title">
					<Link href={postHref}>{post.title}</Link>
				</h2>

				<div className="entry-footer">
					<div className="entry-footer-meta">
						<span className="entry-view">
							<i className="fa fa-eye" />
							{post.views}
						</span>

						<span className="entry-like">
							<Link href={postHref}>
								<i className="fa fa-heart-o" />
								{post.likes}
							</Link>
						</span>

						<span className="entry-comments">
							<Link href={`${postHref}#comments`}>
								<i className="fa fa-comments" />
								{post.comments}
							</Link>
						</span>
					</div>
				</div>
			</div>
		</article>
	);
};

interface BlogGridProps {
	posts: BlogPostData[];
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
