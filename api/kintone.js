export const config = { runtime: 'edge' };
export default async function handler(req) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date'); // 例: 2026-07-13（JSTでの対象日）
  const token = searchParams.get('token');
  const domain = searchParams.get('domain');
  const app = searchParams.get('app') || '6';
  if (!date || !token || !domain) {
    return new Response(JSON.stringify({ error: 'Missing parameters' }), { status: 400, headers });
  }

  const f1 = '\u30c9\u30ed\u30c3\u30d7\u30c0\u30a6\u30f3_0'; // 受付結果
  const v1 = '\u6210\u7d04';         // 成約
  const v2 = '\u30ad\u30e3\u30f3\u30bb\u30eb'; // キャンセル
  const v3 = '\u8cb7\u53d6\u4e0d\u53ef'; // 買取不可
  const f2 = '\u66f4\u65b0\u65e5\u6642'; // 更新日時（UPDATED_TIME）

  // 対象日（JST 00:00:00〜翌日00:00:00）をKintoneクエリのタイムゾーン付き日時で指定
  const [y, m, d] = date.split('-').map(Number);
  const startJst = `${date}T00:00:00+09:00`;
  const nextDateObj = new Date(Date.UTC(y, m - 1, d + 1)); // 日付計算のみに使用（時差の影響を受けない）
  const nextDateStr = nextDateObj.toISOString().slice(0, 10);
  const endJst = `${nextDateStr}T00:00:00+09:00`;

  const query = `${f1} in ("${v1}","${v2}","${v3}") and ${f2} >= "${startJst}" and ${f2} < "${endJst}"`;
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
