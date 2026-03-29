import express from 'express'
import asyncHandler from 'express-async-handler'
import { GoogleGenerativeAI } from '@google/generative-ai'
import Order from '../models/orderModel.js'
import Product from '../models/productModel.js'
import { protect } from '../middleware/authMiddleware.js'
import {
  buildRuleBasedReply,
  shouldUseRuleBasedReply,
} from '../utils/chatbotFallbacks.js'

const router = express.Router()

const responseCache = new Map()
const CACHE_TTL_MS = 5 * 60 * 1000
const MODEL_CANDIDATES = ['gemini-1.5-flash-latest', 'gemini-pro']

const getGenAI = () => {
  if (!process.env.GEMINI_API_KEY) {
    return null
  }

  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
}

const pruneCache = () => {
  const now = Date.now()

  for (const [key, value] of responseCache.entries()) {
    if (now - value.createdAt > CACHE_TTL_MS) {
      responseCache.delete(key)
    }
  }
}

const makeCacheKey = (userId, message) =>
  `${String(userId)}:${message.trim().toLowerCase()}`

const buildOrdersContext = (orders) =>
  orders.length > 0
    ? orders
        .map(
          (order) => `Order ID: ${order._id}
Status: ${
  order.isDelivered
    ? 'Delivered'
    : order.isPaid || order.paymentMethod === 'COD'
    ? 'Processing'
    : 'Pending Payment'
}
Payment: ${order.paymentMethod} | Paid: ${order.isPaid ? 'Yes' : 'No'}
Total: Rs.${order.totalPrice}
Items: ${order.orderItems.map((item) => item.name).join(', ')}
Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}`
        )
        .join('\n---\n')
    : 'No orders found for this user.'

const buildProductsContext = (products) =>
  products
    .map(
      (product) =>
        `${product.name} | Rs.${product.price} | Rating: ${product.rating}/5 | Category: ${product.category} | ID: ${product._id}`
    )
    .join('\n')

const buildPrompt = ({ user, userOrders, topProducts, message, conversationHistory }) => `
You are a helpful, warm customer support assistant for Handmade Haven, an Indian handicrafts marketplace.

Platform facts:
- Handmade decor, sculptures, wall art, jewelry boxes, and gift items
- Payments: PayPal and Cash on Delivery
- Standard delivery: 5-7 business days
- Returns: 7-day return policy for damaged items
- Support email: support@handmadehaven.live

Current user:
- Name: ${user.name}
- Email: ${user.email}

Recent orders:
${buildOrdersContext(userOrders)}

Top products:
${buildProductsContext(topProducts)}

Recent conversation:
${conversationHistory
  .slice(-8)
  .map((entry) => `${entry.role}: ${entry.content}`)
  .join('\n')}

Instructions:
- Answer in under 150 words
- Be concise and practical
- If asked about orders, use the supplied order data
- If recommending products, mention names and prices
- If you cannot verify something from the data, say so clearly
- Do not invent policies or order statuses

User message:
${message}
`

const getAiReply = async ({ prompt }) => {
  const genAI = getGenAI()

  if (!genAI) {
    throw new Error('Missing GEMINI_API_KEY')
  }

  let lastError

  for (const modelName of MODEL_CANDIDATES) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName })
      const result = await model.generateContent(prompt)
      const reply = result.response.text()?.trim()

      if (reply) {
        return reply
      }
    } catch (error) {
      lastError = error
    }
  }

  throw lastError || new Error('Unable to generate AI reply')
}

const chatController = async (req, res) => {
  const { message, conversationHistory = [] } = req.body

  if (!message || !message.trim()) {
    return res.status(400).json({ message: 'Message is required' })
  }

  const userOrders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('_id isPaid isDelivered totalPrice orderItems createdAt paymentMethod')

  const topProducts = await Product.find({})
    .sort({ rating: -1 })
    .limit(5)
    .select('name price rating category _id')

  const fallbackReply = buildRuleBasedReply({
    message,
    userName: req.user.name,
    userOrders,
    topProducts,
  })

  const safeHistory = Array.isArray(conversationHistory)
    ? conversationHistory.filter(
        (entry) =>
          entry &&
          typeof entry.content === 'string' &&
          (entry.role === 'user' || entry.role === 'assistant')
      )
    : []

  pruneCache()
  const cacheKey = makeCacheKey(req.user._id, message)
  const cached = responseCache.get(cacheKey)

  if (cached && Date.now() - cached.createdAt <= CACHE_TTL_MS) {
    return res.json({
      reply: cached.reply,
      updatedHistory: [
        ...safeHistory.slice(-8),
        { role: 'user', content: message },
        { role: 'assistant', content: cached.reply },
      ],
    })
  }

  if (shouldUseRuleBasedReply(message)) {
    responseCache.set(cacheKey, {
      reply: fallbackReply,
      createdAt: Date.now(),
    })

    return res.json({
      reply: fallbackReply,
      updatedHistory: [
        ...safeHistory.slice(-8),
        { role: 'user', content: message },
        { role: 'assistant', content: fallbackReply },
      ],
    })
  }

  let reply = fallbackReply

  try {
    reply = await getAiReply({
      prompt: buildPrompt({
        user: req.user,
        userOrders,
        topProducts,
        message,
        conversationHistory: safeHistory,
      }),
    })
  } catch (error) {
    console.error('Chat AI error:', error)
  }

  responseCache.set(cacheKey, {
    reply,
    createdAt: Date.now(),
  })

  return res.json({
    reply,
    updatedHistory: [
      ...safeHistory.slice(-8),
      { role: 'user', content: message },
      { role: 'assistant', content: reply },
    ],
  })
}

router.post('/', protect, asyncHandler(chatController))

router.get(
  '/orders/:id',
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)

    if (!order) {
      res.status(404)
      throw new Error('Order not found')
    }

    if (order.user.toString() !== req.user._id.toString()) {
      res.status(401)
      throw new Error('Not authorized')
    }

    res.json(order)
  })
)

export default router
