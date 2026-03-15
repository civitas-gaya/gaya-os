/**
 * Returns the app's base URL — automatically determined from environment:
 * - On Vercel: https://<VERCEL_URL>  (set automatically by Vercel per deployment)
 * - Locally:   http://localhost:<PORT>  (defaults to 5173)
 */
export function getBaseUrl(): string {
	if (process.env.VERCEL_URL) {
		return `https://${process.env.VERCEL_URL}`
	}
	return `http://localhost:${process.env.PORT ?? '5173'}`
}
