const normalizeMessage = (message = '') => message.trim().toLowerCase()

const formatPrice = (value) => `Rs.${Number(value || 0).toFixed(2)}`

const buildOrderSummary = (order) => {
  const shortId = String(order._id).slice(-8).toUpperCase()
  const status = order.isDelivered
    ? 'Delivered'
    : order.isPaid || order.paymentMethod === 'COD'
    ? 'Processing'
    : 'Pending payment'

  return `Order #${shortId}: ${status}, ${formatPrice(order.totalPrice)}, paid via ${order.paymentMethod}.`
}

export const buildRuleBasedReply = ({
  message,
  userName,
  userOrders = [],
  topProducts = [],
}) => {
  const text = normalizeMessage(message)

  if (!text) {
    return 'I am here to help with orders, products, shipping, and payments.'
  }

  if (text.includes('hello') || text.includes('hi') || text.includes('hey')) {
    return `Hi ${userName || 'there'}! Ask me about your orders, payments, shipping, or product recommendations.`
  }

  if (text.includes('order') || text.includes('track')) {
    if (userOrders.length) {
      return `You can track orders from your profile page. Your latest update: ${buildOrderSummary(
        userOrders[0]
      )}`
    }

    return 'You can track orders from your profile page under My Orders.'
  }

  if (text.includes('payment') || text.includes('pay') || text.includes('cod')) {
    return 'We support Cash on Delivery and PayPal. COD orders are paid when they are delivered.'
  }

  if (text.includes('ship') || text.includes('delivery')) {
    return 'Standard delivery usually takes 5 to 7 business days. Shipping is free above Rs.999, otherwise Rs.99.'
  }

  if (text.includes('return') || text.includes('refund') || text.includes('replace')) {
    return 'We offer a 7-day return policy for damaged items. You can contact support to start a return.'
  }

  if (text.includes('support') || text.includes('contact') || text.includes('help')) {
    return 'You can reach support at support@handmadehaven.live, or ask me about orders, products, and payments here.'
  }

  if (
    text.includes('recommend') ||
    text.includes('product') ||
    text.includes('buy') ||
    text.includes('gift')
  ) {
    if (topProducts.length) {
      const picks = topProducts
        .slice(0, 3)
        .map((product) => `${product.name} (${formatPrice(product.price)})`)
        .join(', ')

      return `Some popular picks are ${picks}. You can browse more on the products page.`
    }

    return 'You can explore our handmade decor, wall art, sculptures, and gift items on the products page.'
  }

  return 'I am here to help. Try asking about orders, products, shipping, returns, or payments.'
}

export const shouldUseRuleBasedReply = (message = '') => {
  const text = normalizeMessage(message)

  return [
    'order',
    'track',
    'payment',
    'pay',
    'cod',
    'ship',
    'delivery',
    'return',
    'refund',
    'replace',
    'support',
    'contact',
    'help',
  ].some((keyword) => text.includes(keyword))
}
