import React from "react";
import PageHeader from "../../ui/front/PageHeader";
import BlogGrid from "../../ui/front/blog/BlogGrid";
import BlogSidebar from "../../ui/front/blog/postSidebar";
import { postSidebarData } from "../../lib/postSidebar";
import { endpoints, API_BASE_URL } from "@/lib/api/endpoints";
import { Post } from "@/lib/api/types";

const PostPage = async () => {
	let posts: Post[] = [];
	try {
		const res = await fetch(`${API_BASE_URL}${endpoints.posts.list}`, { cache: 'no-store' });
		if (res.ok) {
			posts = await res.json();
		}
	} catch (error) {
		console.error("Error fetching posts:", error);
	}

	return (
		<>
			<PageHeader
				titulo="Novidades"
				descricao="Todo sobre os Nossos Carros e muito mais"
			/>

			<div className="blog-block bg-gray-color">
				<div className="container">
					<div className="row">
						<div className="col-md-8">
							<div className="post-filter-block clearfix">
								<div className="post-filter-area clearfix">
									<ul
										className="nav nav-tabs hidden-sm hidden-xs"
										role="tablist"
									>
										<li role="presentation" className="active">
											<a
												href="#home"
												aria-controls="home"
												role="tab"
												data-toggle="tab"
											>
												<span>Novidades</span>/<span>Recentes</span>
											</a>
										</li>
										<li role="presentation">
											<a
												href="#profile"
												aria-controls="profile"
												role="tab"
												data-toggle="tab"
											>
												Popular
											</a>
										</li>
										<li role="presentation">
											<a
												href="#messages"
												aria-controls="messages"
												role="tab"
												data-toggle="tab"
											>
												Trending
											</a>
										</li>
									</ul>
								</div>
							</div>
							{posts.length > 0 ? (
								<BlogGrid posts={posts} />
							) : (
								<div className="text-center py-10">
									<p className="text-muted">Nenhuma novidade encontrada no momento.</p>
								</div>
							)}
						</div>
						<BlogSidebar
							popularPosts={postSidebarData.popularPosts}
							categories={postSidebarData.categories}
							tags={postSidebarData.tags}
							adImage={postSidebarData.adImage}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default PostPage;
