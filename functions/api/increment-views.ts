/// <reference types="@cloudflare/workers-types" />

interface Env {
  PAGE_VIEWS: KVNamespace;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { env } = context;
  
  // KVから現在のカウントを取得
  let views = await env.PAGE_VIEWS.get('total');
  let count = views ? parseInt(views) : 0;
  
  // カウントを1増やす
  count++;
  
  // 新しい値を保存
  await env.PAGE_VIEWS.put('total', count.toString());
  
  return new Response(JSON.stringify({ views: count }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
} 