import { SERVER_API_BASE_URL, endpoints } from "@/lib/api/endpoints";
import type { Advertisement, PublicReviews } from "@/lib/api/types";
import HomePage from "../ui/front/v2/HomePage";

// Banners das publicidades lidos no servidor: o topo da página já vem com o
// layout certo (banner ou foto), sem saltar quando os anúncios chegam.
async function bannerAds(): Promise<Advertisement[]> {
	try {
		const res = await fetch(`${SERVER_API_BASE_URL}${endpoints.ads.list("BANNER")}`, {
			next: { revalidate: 60 },
			signal: AbortSignal.timeout(2000),
		});
		if (!res.ok) return [];
		const data = await res.json();
		return Array.isArray(data) ? data : [];
	} catch {
		return [];
	}
}

// Avaliações aprovadas (testemunhos) — também no servidor, para aparecerem no HTML.
async function reviews(): Promise<PublicReviews | null> {
	try {
		const res = await fetch(`${SERVER_API_BASE_URL}${endpoints.reviews.public(9)}`, {
			next: { revalidate: 60 },
			signal: AbortSignal.timeout(2000),
		});
		return res.ok ? await res.json() : null;
	} catch {
		return null;
	}
}

export default async function Home() {
	const [ads, reviewData] = await Promise.all([bannerAds(), reviews()]);
	return <HomePage bannerAds={ads} reviews={reviewData} />;
}
