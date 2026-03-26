import mongoose from 'mongoose'

const MONGO_URI = 'mongodb://farhankhan:farhankhan@cluster0-shard-00-00.c3zhj.mongodb.net:27017,cluster0-shard-00-01.c3zhj.mongodb.net:27017,cluster0-shard-00-02.c3zhj.mongodb.net:27017/?ssl=true&authSource=admin&retryWrites=true&w=majority&appName=Cluster0'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
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