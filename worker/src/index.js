/**
 * Cloudflare Worker - PayPal 支付 API
 * 处理订单创建、支付验证等后端逻辑
 */

// CORS 配置
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// PayPal API 基础 URL
const PAYPAL_API = {
  sandbox: 'https://api-m.sandbox.paypal.com',
  live: 'https://api-m.paypal.com',
};

// 套餐配置
const PLANS = {
  monthly: {
    id: 'monthly',
    name: '月度会员',
    price: 9.9,
    currency: 'USD',
    duration: 30,
  },
  yearly: {
    id: 'yearly',
    name: '年度会员',
    price: 99,
    currency: 'USD',
    duration: 365,
  },
};

/**
 * 获取 PayPal Access Token
 */
async function getPayPalAccessToken(env) {
  const mode = env.PAYPAL_MODE || 'sandbox';
  const clientId = mode === 'live' ? env.PAYPAL_LIVE_CLIENT_ID : env.PAYPAL_SANDBOX_CLIENT_ID;
  const secret = mode === 'live' ? env.PAYPAL_LIVE_SECRET : env.PAYPAL_SANDBOX_SECRET;
  
  const auth = btoa(`${clientId}:${secret}`);
  const apiUrl = PAYPAL_API[mode];
  
  const response = await fetch(`${apiUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  
  if (!response.ok) {
    throw new Error('Failed to get PayPal access token');
  }
  
  const data = await response.json();
  return data.access_token;
}

/**
 * 创建 PayPal 订单
 */
async function createPayPalOrder(planId, env) {
  const plan = PLANS[planId];
  if (!plan) {
    throw new Error('Invalid plan');
  }
  
  const accessToken = await getPayPalAccessToken(env);
  const mode = env.PAYPAL_MODE || 'sandbox';
  const apiUrl = PAYPAL_API[mode];
  
  const orderData = {
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: plan.currency,
        value: plan.price.toFixed(2),
      },
      description: plan.name,
    }],
    application_context: {
      brand_name: '认字乐园',
      landing_page: 'NO_PREFERENCE',
      user_action: 'PAY_NOW',
      return_url: 'https://recognize-chinese-characters.online/#/payment-success',
      cancel_url: 'https://recognize-chinese-characters.online/#/payment-cancel',
    },
  };
  
  const response = await fetch(`${apiUrl}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create order: ${error}`);
  }
  
  return await response.json();
}

/**
 * 验证并捕获 PayPal 订单
 */
async function capturePayPalOrder(orderId, env) {
  const accessToken = await getPayPalAccessToken(env);
  const mode = env.PAYPAL_MODE || 'sandbox';
  const apiUrl = PAYPAL_API[mode];
  
  const response = await fetch(`${apiUrl}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to capture order: ${error}`);
  }
  
  return await response.json();
}

/**
 * 主处理函数
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // 处理 CORS 预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    
    try {
      // 路由处理
      if (url.pathname === '/api/plans' && request.method === 'GET') {
        // 获取套餐列表
        return new Response(JSON.stringify({ plans: Object.values(PLANS) }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (url.pathname === '/api/orders/create' && request.method === 'POST') {
        // 创建订单
        const { planId } = await request.json();
        const order = await createPayPalOrder(planId, env);
        
        return new Response(JSON.stringify(order), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (url.pathname === '/api/orders/capture' && request.method === 'POST') {
        // 捕获订单（支付完成后）
        const { orderId } = await request.json();
        const result = await capturePayPalOrder(orderId, env);
        
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      // 404
      return new Response('Not Found', { 
        status: 404,
        headers: corsHeaders,
      });
      
    } catch (error) {
      console.error('Error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};
