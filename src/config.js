export const appConfig = {
  siteName: '认字乐园',
  pricing: {
    productName: '认字乐园 Pro 会员',
    priceLabel: '$9.90 / 年',
    originalPriceLabel: '',
    benefitSummary: '解锁全部255个汉字关卡 + 多设备云端同步 + 后续内容持续更新',
    ctaLabel: '立即开通 Pro',
    checkoutUrl: import.meta.env.VITE_CHECKOUT_URL || 'https://weilailaius.lemonsqueezy.com/checkout/buy/7eadb201-f212-4c5e-ae61-1f3295ef46b3',
  },
  analytics: {
    debug: import.meta.env.DEV,
  },
}

export function hasCheckout() {
  return Boolean(appConfig.pricing.checkoutUrl)
}
