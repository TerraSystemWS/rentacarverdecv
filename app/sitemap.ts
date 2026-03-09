import { MetadataRoute } from 'next';
import { API_BASE_URL } from '@/lib/api/endpoints';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://rentacarverdecv.com'; // Adjust exactly to your real domain

    try {
        // Fetch all vehicles
        const vehiclesReq = await fetch(`${API_BASE_URL}/public/vehicles`, { cache: 'no-store' });
        const vehicles = await vehiclesReq.json();

        // Map vehicles to sitemap entries
        const vehicleUrls = Array.isArray(vehicles) ? vehicles.map((car: any) => ({
            url: `${baseUrl}/cars/${car.id}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        })) : [];

        // Static routes
        const routes = ['', '/cars', '/about', '/contact', '/posts', '/gallery'].map((route) => ({
            url: `${baseUrl}${route}`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: route === '' ? 1 : 0.9,
        }));

        return [...routes, ...vehicleUrls];
    } catch (e) {
        console.error("Error generating sitemap:", e);
        // Fallback to static routes
        return [
            {
                url: baseUrl,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 1,
            }
        ];
    }
}
