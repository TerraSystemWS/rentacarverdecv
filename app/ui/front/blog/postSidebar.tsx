"use client";

import React from "react";

interface PopularPost {
	img: string;
	title: string;
	date: string;
	href?: string;
}

interface CategoryItem {
	name: string;
	count: number;
	href?: string;
}

interface BlogSidebarProps {
	popularPosts: PopularPost[];
	categories: CategoryItem[];
	adImage: string;
	tags: string[];
}

const BlogSidebar: React.FC<BlogSidebarProps> = ({
	popularPosts,
	categories,
	adImage,
	tags,
}) => {
	return (
		<div className="col-md-4 blog-sidebar">
			<div className="blog-content-right nevy-bg">
				{/* Popular Posts */}
				<div className="widget widget_popular_posts clearfix">
					<h4 className="widget-title">Popular Posts</h4>
					<div className="widget-content">
						{popularPosts.map((post, idx) => (
							<div className="post-content clearfix" key={idx}>
								<div className="image-content">
									<a href={post.href || "#"}>
										<img src={post.img} alt={post.title} />
									</a>
								</div>
								<div className="post-info">
									<h5 className="widget-post-title">
										<a href={post.href || "#"}>{post.title}</a>
									</h5>
									<span className="post-date">{post.date}</span>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Categories */}
				<div className="widget widget_categories clearfix">
					<h4 className="widget-title">Categories</h4>
					<ul>
						{categories.map((cat, idx) => (
							<li key={idx}>
								<a href={cat.href || "#"}>{cat.name}</a>
								<span className="count">{cat.count}</span>
							</li>
						))}
					</ul>
				</div>

				{/* Ad Banner */}
				<div className="widget widget_adds clearfix">
					<h4 className="widget-title">Ad Unit</h4>
					<div className="add-image">
						<a href="#">
							<img src={adImage} alt="blog-add" />
						</a>
					</div>
				</div>

				{/* Tag Cloud */}
				<div className="widget widget_tagcloud clearfix">
					<h4 className="widget-title">Tag Cloud</h4>
					<div className="tagcloud">
						{tags.map((tag, idx) => (
							<a href="#" key={idx} title={tag}>
								{tag}
							</a>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default BlogSidebar;
