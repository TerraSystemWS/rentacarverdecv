import PageHeader from "@/app/ui/front/PageHeader";
import Comments from "@/app/ui/front/blog/postItem/coments";
import SingleMainContent from "@/app/ui/front/blog/postItem/SingleMainContent";
import { posts } from "@/app/lib/posts";
import BlogSidebar from "@/app/ui/front/blog/postSidebar";
import { postSidebarData } from "@/app/lib/postSidebar";
import CommentForm from "@/app/ui/front/blog/postItem/commentForm";

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
		return <div>Slug não fornecido</div>;
	}

	const post = posts.find((p) => p.slug === slug);

	if (!post) {
		return <div>Post não encontrado</div>;
	}

	return (
		<main>
			<PageHeader
				titulo="Stories details"
				descricao="Watch our story details"
			/>

			<div className="blog-single-block bg-gray-color pd-btm-60">
				<div className="container">
					<div className="row">
						{/* Blog single Content */}
						<div className="col-md-8">
							<SingleMainContent
								title={post.title}
								author={post.author}
								coverImageUrl={post.coverImageUrl}
								date={post.date}
								categories={post.categories}
								tags={post.tags}
								firstParagraph={post.firstParagraph}
								secondParagraph={post.secondParagraph}
								gallery={post.gallery}
								navigation={post.navigation}
								socialLinks={post.socialLinks}
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
