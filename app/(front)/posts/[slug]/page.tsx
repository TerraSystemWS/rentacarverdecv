import PageHeader from "@/app/ui/front/PageHeader";
import Comments from "@/app/ui/front/blog/postItem/coments";
import SingleMainContent from "@/app/ui/front/blog/postItem/SingleMainContent";
import { textToHtml } from "@/lib/utils/legacyText";
import BlogSidebar from "@/app/ui/front/blog/postSidebar";
import CommentForm from "@/app/ui/front/blog/postItem/commentForm";
import { endpoints, API_BASE_URL, SERVER_API_BASE_URL } from "@/lib/api/endpoints";
import { Post } from "@/lib/api/types";
import { notFound } from "next/navigation";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import { tr } from "@/lib/i18n/translate";

type BlogSinglePageProps = {
	params: Promise<{
		slug: string;
	}>;
};

const BlogSinglePage = async ({ params }: BlogSinglePageProps) => {
	const { slug } = await params;
	const t = await getTranslations("posts");
	const format = await getFormatter();
	const locale = await getLocale();

	if (!slug) {
		return notFound();
	}

	let post: Post | null = null;
	let allPosts: Post[] = [];
	try {
		const [postRes, listRes] = await Promise.all([
			fetch(`${SERVER_API_BASE_URL}${endpoints.posts.get(slug)}`, { cache: 'no-store' }),
			fetch(`${SERVER_API_BASE_URL}${endpoints.posts.list}`, { cache: 'no-store' }),
		]);
		if (postRes.ok) {
			post = await postRes.json();
		}
		if (listRes.ok) {
			allPosts = await listRes.json();
		}
	} catch (error) {
		console.error("Error fetching post:", error);
	}

	if (!post) {
		return notFound();
	}

	// Navegação Anterior/Seguinte com base na ordem cronológica real das
	// novidades publicadas — antes eram sempre links "#" que não iam a lado
	// nenhum.
	const currentIndex = allPosts.findIndex((p) => p.slug === slug);
	const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : undefined;
	const nextPost = currentIndex >= 0 && currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : undefined;

	return (
		<main>
			<PageHeader
				titulo={tr(post, "title", locale)}
				descricao={tr(post, "summary", locale) || t("readMore")}
			/>

			<div className="blog-single-block bg-gray-color pd-btm-60">
				<div className="container">
					<div className="row">
						{/* Blog single Content */}
						<div className="col-md-8">
							<SingleMainContent
								title={tr(post, "title", locale)}
								author={{ name: post.author || t("defaultAuthor"), role: t("authorRole"), avatarUrl: "/assets/images/default-avatar.png" }}
								coverImageUrl={post.imageUrl?.startsWith('/uploads') ? `${API_BASE_URL}${post.imageUrl}` : (post.imageUrl || "/assets/images/blog/blog-1.jpg")}
								date={post.createdAt ? format.dateTime(new Date(post.createdAt), { dateStyle: "long" }) : ""}
								categories={[]}
								tags={[]}
								contentHtml={textToHtml(tr(post, "content", locale))}
								gallery={[]}
								navigation={{
									prevUrl: prevPost ? `/posts/${prevPost.slug}` : undefined,
									nextUrl: nextPost ? `/posts/${nextPost.slug}` : undefined,
								}}
								socialLinks={undefined}
							/>

							<Comments postSlug={slug} />
							<CommentForm postSlug={slug} />
						</div>

						<BlogSidebar recentPosts={allPosts} currentSlug={slug} />
					</div>
				</div>
			</div>
		</main>
	);
};

export default BlogSinglePage;
