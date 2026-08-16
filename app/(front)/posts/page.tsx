import React from "react";
import PageHeader from "../../ui/front/PageHeader";
import BlogGrid from "../../ui/front/blog/BlogGrid";
import BlogSidebar from "../../ui/front/blog/postSidebar";
import { endpoints, SERVER_API_BASE_URL } from "@/lib/api/endpoints";
import { Post } from "@/lib/api/types";

const PostPage = async () => {
	let posts: Post[] = [];
	try {
		const res = await fetch(`${SERVER_API_BASE_URL}${endpoints.posts.list}`, { cache: 'no-store' });
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
									<h2 className="available-title" style={{ margin: 0 }}>Novidades Recentes</h2>
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
						<BlogSidebar recentPosts={posts} />
					</div>
				</div>
			</div>
		</>
	);
};

export default PostPage;
