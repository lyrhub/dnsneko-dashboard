export default {
  async fetch(request) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-DNSNEKO-USERNAME, X-DNSNEKO-API-KEY',
      'Access-Control-Max-Age': '86400',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const url = new URL(request.url);
    const targetPath = url.pathname.replace(/^\/proxy/, '');
    const targetUrl = `https://www.dnsneko.com/api/v1/dns${targetPath}${url.search}`;

    const headers = new Headers();
    const username = request.headers.get('X-DNSNEKO-USERNAME');
    const apiKey = request.headers.get('X-DNSNEKO-API-KEY');
    if (username) headers.set('X-DNSNEKO-USERNAME', username);
    if (apiKey) headers.set('X-DNSNEKO-API-KEY', apiKey);
    if (request.headers.get('Content-Type')) {
      headers.set('Content-Type', request.headers.get('Content-Type'));
    }

    const fetchOptions = { method: request.method, headers };
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      fetchOptions.body = await request.text();
    }

    try {
      const response = await fetch(targetUrl, fetchOptions);
      const responseBody = await response.text();
      return new Response(responseBody, {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': response.headers.get('Content-Type') || 'application/json' },
      });
    } catch (err) {
      return new Response(JSON.stringify({ code: 500, message: err.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};
