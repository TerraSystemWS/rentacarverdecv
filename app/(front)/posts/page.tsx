import { use } from "react";
import PageHeader from "../../ui/front/PageHeader";
import BlogGrid from "../../ui/front/blog/BlogGrid";
import { posts } from "../../lib/posts";
import BlogSidebar from "../../ui/front/blog/postSidebar";
import { postSidebarData } from "../../lib/postSidebar";

const Post = ({ params }: { params: Promise<{ slug: string }> }) => {
	const { slug } = use(params);

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
							<BlogGrid posts={posts} />
						</div>
						<BlogSidebar
							popularPosts={postSidebarData.popularPosts}
							categories={postSidebarData.categories}
							tags={postSidebarData.tags}
							adImage={postSidebarData.adImage}
						/>
						;
					</div>
				</div>
			</div>
		</>
	);
};

export default Post;
