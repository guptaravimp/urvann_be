const mongoose=require("mongoose");

const DBConnection=async()=>{
    try{
        const connectionOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 1, // Important for serverless environments
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            bufferCommands: false, // Important for serverless
            bufferMaxEntries: 0, // Important for serverless
            connectTimeoutMS: 10000,
            retryWrites: true,
            w: 'majority'
        };

        await mongoose.connect(process.env.MONGODB_URL, connectionOptions);
        console.log("✅ Connected to MongoDB successfully");
        
        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('⚠️ MongoDB disconnected');
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('MongoDB connection closed through app termination');
            process.exit(0);
        });

    }catch(error){
        console.error("❌ Error connecting to MongoDB:", error);
        console.error("MongoDB URL:", process.env.MONGODB_URL ? "Set" : "Not set");
        process.exit(1);
    }
}

module.exports=DBConnection;