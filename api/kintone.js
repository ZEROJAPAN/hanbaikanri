bash

cat /mnt/user-data/outputs/api/kintone.js
出力

export const config = { runtime: 'edge' };

export default async function handler(req) {
  // CORSヘッダー
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    const token = searchParams.get('token');
    const domain = searchParams.get('domain');
    const app = searchParams.get('app') || '6';

    if (!date || !token || !domain) {
      return new Response(JSON.stringify({ error: 'Missing parameters' }), { status: 400, headers });
    }

    // Kintone APIを呼び出し
    const query = `ドロップダウン_0 in ("成約","キャンセル","買取不可") and 受付日付="${date}"`;
    const url = `https://${domain}/k/v1/records.json?app=${app}&query=${encodeURIComponent(query)}&totalCount=true&limit=500`;

    const res = await fetch(url, {
      headers: { 'X-Cybozu-API-Token': token },
    });

    if (!res.ok) {
      const err = await res.text();
      return new Response(JSON.stringify({ error: err }), { status: res.status, headers });
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200, headers });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers });
  }
}
