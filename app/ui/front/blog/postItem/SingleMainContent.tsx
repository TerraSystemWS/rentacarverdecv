import Image from "next/image";
import React from "react";
import Link from "next/link";

export type LinkItem = { label: string; href: string };
export type GalleryItem = { src: string; alt?: string; href?: string };
export interface Author {
	name: string;
	role: string;
	avatarUrl?: string;
}
export interface NavigationLinks {
	prevUrl?: string;
	nextUrl?: string;
}
export interface SocialLinks {
	instagram?: string;
	heart?: string;
	facebook?: string;
	twitter?: string;
}

export interface SingleMainContentProps {
	title: string;
	author: Author;
	navigation?: NavigationLinks;
	coverImageUrl: string;
	coverImageAlt?: string;
	date: string;
	categories?: LinkItem[];
	tags?: LinkItem[];
	firstParagraph?: string;
	secondParagraph?: string;
	gallery?: GalleryItem[];
	socialLinks?: SocialLinks;
}

const SingleMainContent: React.FC<SingleMainContentProps> = ({
	title,
	author,
	navigation,
	coverImageUrl,
	coverImageAlt = "blog",
	date,
	categories = [],
	tags = [],
	firstParagraph,
	secondParagraph,
	gallery = [],
	socialLinks,
}) => {
	// Mantendo exatamente as classes do seu HTML original para o CSS existente funcionar
	return (
		<div className="single-main-content">
			<article className="post-content">
				<div className="entry-header">
					<h2 className="entry-title">{title}</h2>
				</div>

				<div className="author-content clearfix hidden-xs">
					<div className="entry-author pull-left">
						<div className="author-image">
							{/* Usando a imagem do autor ou o fallback do seu HTML original */}
							<img
								src={author.avatarUrl || "assets/images/author.jpg"}
								alt="author"
							/>
						</div>

						<div className="author-details">
							<h4 className="author-name">{author.name}</h4>
							<p className="author-designation">{author.role}</p>
						</div>
					</div>

					<div className="post-navigation block-navigation-area yellow-theme">
						<div className="item-navigation pull-right">
							<Link href={navigation?.prevUrl || "#"} className="previous-item">
								<i className="fa fa-angle-left"></i>
							</Link>
							<Link href={navigation?.nextUrl || "#"} className="next-item">
								<i className="fa fa-angle-right"></i>
							</Link>
						</div>
					</div>
				</div>

				<figure className="post-thumb">
					<img src={coverImageUrl} alt={coverImageAlt} />
				</figure>

				<div className="single-post">
					<div className="entry-meta">
						<div className="entry-date">
							<div className="meta-title">Date</div>
							<Link href="#">{date}</Link>
						</div>

						{categories.length > 0 && (
							<div className="entry-category">
								<div className="meta-title">Category</div>
								{categories.map((cat, idx) => (
									<React.Fragment key={idx}>
										<Link href={cat.href}>{cat.label}</Link>
										{idx < categories.length - 1 && ", "}
									</React.Fragment>
								))}
							</div>
						)}

						{tags.length > 0 && (
							<div className="entry-tag">
								<div className="meta-title">Tag</div>
								{tags.map((tag, idx) => (
									<React.Fragment key={idx}>
										<Link href={tag.href}>{tag.label}</Link>
										{idx < tags.length - 1 && ", "}
									</React.Fragment>
								))}
							</div>
						)}
					</div>

					<div className="entry-content">
						{firstParagraph && <p>{firstParagraph}</p>}

						{gallery.length > 0 && (
							<div className="gallery gallery-columns-4">
								{gallery.map((item, index) => (
									<figure className="gallery-item" key={index}>
										<Link href={item.href || "#"}>
											<img src={item.src} alt={item.alt || "blog"} />
										</Link>
									</figure>
								))}
							</div>
						)}

						{secondParagraph && <p>{secondParagraph}</p>}
					</div>
				</div>

				<div className="entry-share">
					<span className="meta-name">Share:</span>
					{socialLinks?.instagram && (
						<Link href={socialLinks.instagram}>
							<i className="fa fa-instagram"></i>
						</Link>
					)}
					{socialLinks?.heart && (
						<Link href={socialLinks.heart}>
							<i className="fa fa-heart"></i>
						</Link>
					)}
					{socialLinks?.facebook && (
						<Link href={socialLinks.facebook}>
							<i className="fa fa-facebook"></i>
						</Link>
					)}
					{socialLinks?.twitter && (
						<Link href={socialLinks.twitter}>
							<i className="fa fa-twitter"></i>
						</Link>
					)}
				</div>
			</article>
		</div>
	);
};

export default SingleMainContent;
