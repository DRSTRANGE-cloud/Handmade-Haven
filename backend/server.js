import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import colors from 'colors'
import morgan from 'morgan'

import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'

import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import contactRoutes from './routes/contactRoutes.js'
import chatRoutes from './routes/chatRoutes.js'

// ✅ __dirname setup
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ✅ Load env
dotenv.config({ path: path.resolve(__dirname, '.env') })

console.log('ENV PATH:', path.resolve(__dirname, '.env'))
console.log(
  'MongoDB env configured:',
  Boolean(process.env.MONGODB_URI || process.env.MONGO_URI)
)

// ✅ Connect DB
connectDB()

// ✅ CREATE APP ONLY ONCE
const app = express()

// ✅ Middleware
app.use(cors({
  origin: ['https://handmade-haven-live.vercel.app', 'http://localhost:3000'],
  credentials: true
}))

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json())

// ✅ Routes (ALL HERE)
app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/chat', chatRoutes)

// ✅ PayPal config
app.get('/api/config/paypal', (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
)

// ✅ Static uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

// ✅ Production
if (process.env.NODE_ENV === 'production') {
  app.get('/', (req, res) => {
    res.send('API is running....')
  })
}
 else {
  app.get('/', (req, res) => {
    res.send('API is running....')
  })
}

// ✅ Error handlers
app.use(notFound)
app.use(errorHandler)

// ✅ Start server
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
})
