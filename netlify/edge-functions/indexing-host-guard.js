// A production artifact is also reachable at Netlify aliases and immutable URLs.
// Restrict those hosts without blocking public pages on the clinic domain.
export default async function handler(request, context) {
  const response = await context.next();
  const hostname = new URL(request.url).hostname.toLowerCase();
  if (!['novamovementatelier.com.au', 'www.novamovementatelier.com.au'].includes(hostname)) {
    const restricted = new Response(response.body, response);
    restricted.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return restricted;
  }
  // Preserve page-specific restrictions, including private pages.
  return response;
}
