// Worker for serving static assets
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Handle root path
    if (url.pathname === '/') {
      url.pathname = '/index.html';
    }

    // Serve static assets with proper cache headers
    const response = await env.ASSETS.fetch(url, request);

    if (response.status === 200) {
      const headers = new Headers(response.headers);

      // Add cache headers for static assets
      if (url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico)$/)) {
        headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      } else {
        headers.set('Cache-Control', 'public, max-age=3600');
      }

      // Security headers
      headers.set('X-Content-Type-Options', 'nosniff');
      headers.set('X-Frame-Options', 'DENY');

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }

    return response;
  },
};