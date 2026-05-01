// Cloudflare Worker — Lemon Squeezy Webhook Handler
// 部署到 Cloudflare Workers，接收付款成功通知，写入 Supabase

import { createClient } from '@supabase/supabase-js'
import { createHmac, timingSafeEqual } from 'node:crypto'

export default {
  async fetch(request, env) {
    // 只接受 POST
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 })
    }

    const body = await request.text()

    // 验证 Lemon Squeezy 签名
    const signature = request.headers.get('x-signature')
    if (!signature || !env.LEMONSQUEEZY_WEBHOOK_SECRET) {
      return new Response('Unauthorized', { status: 401 })
    }

    const hmac = createHmac('sha256', env.LEMONSQUEEZY_WEBHOOK_SECRET)
    hmac.update(body)
    const digest = hmac.digest('hex')

    const sigBuffer = Buffer.from(signature, 'hex')
    const digestBuffer = Buffer.from(digest, 'hex')

    if (sigBuffer.length !== digestBuffer.length || !timingSafeEqual(sigBuffer, digestBuffer)) {
      return new Response('Invalid signature', { status: 401 })
    }

    // 解析事件
    let event
    try {
      event = JSON.parse(body)
    } catch {
      return new Response('Bad Request', { status: 400 })
    }

    const eventName = event.meta?.event_name
    console.log('Received event:', eventName)

    // 只处理订单成功事件
    if (eventName !== 'order_created') {
      return new Response('OK', { status: 200 })
    }

    // 提取用户邮箱和订单信息
    const orderData = event.data?.attributes
    const userEmail = orderData?.user_email
    const orderId = event.data?.id
    const status = orderData?.status // 'paid'

    if (!userEmail || status !== 'paid') {
      return new Response('OK', { status: 200 })
    }

    // 连接 Supabase
    const supabase = createClient(
      env.SUPABASE_URL,
      env.SUPABASE_SERVICE_ROLE_KEY
    )

    // 通过邮箱找到 user_id
    const { data: users, error: userError } = await supabase
      .from('auth.users')
      .select('id')
      .eq('email', userEmail)
      .limit(1)

    // auth.users 不能直接查，用 admin API
    const { data: { users: adminUsers }, error: adminError } = await supabase.auth.admin.listUsers()

    if (adminError) {
      console.error('Failed to list users:', adminError)
      return new Response('Internal Error', { status: 500 })
    }

    const user = adminUsers?.find(u => u.email === userEmail)

    if (!user) {
      // 用户不存在（未注册就购买），先记录邮箱，等用户注册后可以匹配
      console.log('User not found for email:', userEmail, '— storing pending subscription')
      const { error: pendingError } = await supabase
        .from('pending_subscriptions')
        .upsert({
          email: userEmail,
          order_id: orderId,
          status: 'active',
          created_at: new Date().toISOString(),
        }, { onConflict: 'email' })

      if (pendingError) console.error('pending_subscriptions upsert error:', pendingError)
      return new Response('OK', { status: 200 })
    }

    // 写入 user_subscriptions
    const { error: subError } = await supabase
      .from('user_subscriptions')
      .upsert({
        user_id: user.id,
        order_id: orderId,
        status: 'active',
        expires_at: null, // 永久
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })

    if (subError) {
      console.error('user_subscriptions upsert error:', subError)
      return new Response('Internal Error', { status: 500 })
    }

    console.log('Subscription activated for user:', user.id)
    return new Response('OK', { status: 200 })
  }
}
