export const config = { runtime: 'edge' };

export default async function handler(req) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date');
  const token = searchParams.get('token');
  const domain = searchParams.get('domain');
  const app = searchParams.get('app') || '6';

  if (!date || !token || !domain) {
    return new Response(JSON.stringify({ error: 'Missing parameters' }), { status: 400, headers });
  }

  const f1 = '\u30c9\u30ed\u30c3\u30d7\u30c0\u30a6\u30f3_0';
  const v1 = '\u6210\u7d04';
  const v2 = '\u30ad\u30e3\u30f3\u30bb\u30eb';
  const v3 = '\u8cb7\u53d6\u4e0d\u53ef';
  const f2 = '\u53d7\u4ed8\u65e5\u4ed8';
  const query = `${f1} in ("${v1}","${v2}","${v3}") and ${f2}="${date}"`;
  const url = `https://${domain}/k/v1/records.json?app=${app}&query=${encodeURIComponent(query)}&totalCount=true&limit=500`;

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
