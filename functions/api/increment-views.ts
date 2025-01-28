/// <reference types="@cloudflare/workers-types" />

interface Env {
  PAGE_VIEWS: KVNamespace;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  try {
    const { env } = context;
    
    if (!env?.PAGE_VIEWS) {
      throw new Error('PAGE_VIEWS KV namespace is not configured');
    }

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
  } catch (error) {
    console.error('Error processing page views:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
} 