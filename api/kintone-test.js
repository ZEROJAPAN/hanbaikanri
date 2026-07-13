export const config = { runtime: 'edge' };
export default async function handler(req) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');
  const domain = searchParams.get('domain');
  const app = searchParams.get('app') || '6';
  if (!token || !domain) {
    return new Response(JSON.stringify({ error: 'Missing parameters' }), { status: 400, headers });
  }
  const url = `https://${domain}/k/v1/records.json?app=${app}&totalCount=true&limit=5`;
  try {
    const res = await fetch(url, {
      headers: { 'X-Cybozu-API-Token': token },
    });
    const data = await res.text();
    return new Response(data, { status: res.status, headers });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers });
  }
}
