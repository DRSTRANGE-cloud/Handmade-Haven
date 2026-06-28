import mongoose from 'mongoose';
import dns from 'dns';

// Configure DNS servers for MongoDB Atlas (helps resolve SRV lookup issues)
const configureMongoDns = (mongoUri) => {
  if (!mongoUri.startsWith('mongodb+srv://')) {
    return;
  }

  const dnsServers = (
    process.env.MONGODB_DNS_SERVERS || '8.8.8.8,1.1.1.1'
  )
    .split(',')
    .map((server) => server.trim())
    .filter(Boolean);

  if (dnsServers.length) {
    dns.setServers(dnsServers);
  }
};

const connectDB = async () => {
  try {
    // Support both variable names
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error('MongoDB connection string is missing from environment variables.');
    }

    // Configure DNS before connecting
    configureMongoDns(mongoUri);

    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

export default connectDB;