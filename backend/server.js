import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import colors from 'colors'
import morgan from 'morgan'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname2 = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname2, '.env') })
console.log('ENV PATH:', path.resolve(__dirname2, '.env'))
console.log('MONGO_URI:', process.env.MONGO_URI)

connectDB()

const app = express()

app.use(cors({
  origin: ['https://handmade-haven-sandy.vercel.app', 'http://localhost:3000'],
  credentials: true
}))

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json())

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)

app.get('/api/config/paypal', (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
)

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')))

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  )
} else {
  app.get('/', (req, res) => {
    res.send('API is running....')
  })
}

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
)
