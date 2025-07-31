import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    console.log('process.env.MONGO_URI',process.env.MONGODB_URI);
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    })

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline)
  } catch (error) {
    console.error(`Error: ${error}`.red.underline.bold)
    process.exit(1)
  }
}

export default connectDB
