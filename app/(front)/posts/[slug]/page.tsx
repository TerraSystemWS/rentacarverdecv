import PageHeader from "@/app/ui/front/PageHeader";
import Comments from "@/app/ui/front/blog/postItem/coments";
import SingleMainContent from "@/app/ui/front/blog/postItem/SingleMainContent";
import BlogSidebar from "@/app/ui/front/blog/postSidebar";
import { postSidebarData } from "@/app/lib/postSidebar";
import CommentForm from "@/app/ui/front/blog/postItem/commentForm";
import { endpoints, API_BASE_URL } from "@/lib/api/endpoints";
import { Post } from "@/lib/api/types";
import { notFound } from "next/navigation";

// 1. Updated Type: params is now a Promise
type BlogSinglePageProps = {
	params: Promise<{
		slug: string;
	}>;
};

export const commentsData = [
	{
		id: 1,
		autor: "João Silva",
		mensagem: "Post muito bom!",
		data: "2024-01-10",
		avatar: "/assets/images/default-avatar.png",
		respostas: [],
	},
	{
		id: 2,
		autor: "Maria Souza",
		mensagem: "Ajudou bastante, obrigado!",
		data: "2024-01-12",
		avatar: "/assets/images/default-avatar.png",
		respostas: [],
	},
];
// 2. Component must be async to await params
const BlogSinglePage = async ({ params }: BlogSinglePageProps) => {
	// 3. Await the params
	const { slug } = await params;

	if (!slug) {
		return notFound();
	}

	let post: Post | null = null;
	try {
		const res = await fetch(`${API_BASE_URL}${endpoints.posts.get(slug)}`, { cache: 'no-store' });
		if (res.ok) {
			post = await res.json();
		}
	} catch (error) {
		console.error("Error fetching post:", error);
	}

	if (!post) {
		return notFound();
	}

	return (
		<main>
			<PageHeader
				titulo={post.title}
				descricao={post.summary || "Leia mais sobre esta novidade."}
			/>

			<div className="blog-single-block bg-gray-color pd-btm-60">
				<div className="container">
					<div className="row">
						{/* Blog single Content */}
						<div className="col-md-8">
							<SingleMainContent
								title={post.title}
								author={{ name: post.author || "Admin", role: "Author", avatarUrl: "/assets/images/default-avatar.png" }}
								coverImageUrl={post.imageUrl?.startsWith('/uploads') ? `${API_BASE_URL}${post.imageUrl}` : (post.imageUrl || "/assets/images/blog/blog-1.jpg")}
								date={post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ""}
								categories={[]}
								tags={[]}
								firstParagraph={post.content.split('\n')[0]}
								secondParagraph={post.content.split('\n').slice(1).join('\n')}
								gallery={[]}
								navigation={undefined}
								socialLinks={undefined}
							/>

							<Comments comentarios={commentsData} />
							<CommentForm />
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
		</main>
	);
};

export default BlogSinglePage;
