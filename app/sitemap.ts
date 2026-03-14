import { MetadataRoute } from 'next';
import { API_BASE_URL, endpoints } from '@/lib/api/endpoints';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://rentacarverde.cv';

    try {
        // Fetch all vehicles
        const vehiclesReq = await fetch(`${API_BASE_URL}${endpoints.vehicles.list(100)}`, { cache: 'no-store' });
        const vehicles = await vehiclesReq.json();

        // Fetch all posts
        const postsReq = await fetch(`${API_BASE_URL}${endpoints.posts.list}`, { cache: 'no-store' });
        const posts = await postsReq.json();

        // Map vehicles to sitemap entries
        const vehicleUrls = Array.isArray(vehicles) ? vehicles.map((car: any) => ({
            url: `${baseUrl}/cars/${car.id}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        })) : [];

        // Map posts to sitemap entries
        const postUrls = Array.isArray(posts) ? posts.map((post: any) => ({
            url: `${baseUrl}/posts/${post.slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        })) : [];

        // Static routes
        const routes = ['', '/cars', '/about', '/contact', '/posts', '/gallery'].map((route) => ({
            url: `${baseUrl}${route}`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: route === '' ? 1 : 0.9,
        }));

        return [...routes, ...vehicleUrls, ...postUrls];
    } catch (e) {
        console.error("Error generating sitemap:", e);
        // Fallback to static routes
        return [
            '', '/cars', '/about', '/contact', '/posts', '/gallery'
        ].map((route) => ({
            url: `${baseUrl}${route}`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: route === '' ? 1 : 0.9,
        }));
    }
}
