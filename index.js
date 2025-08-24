const express=require("express");
const cors = require("cors");
const DBConnection = require("./config/DBConnection");
const plantRoutes = require("./routes/plantRoutes");
const imageUpload = require("./routes/imageUpload");
const fileupload=require("express-fileupload")
const {cloudinaryConnect}=require("./config/cloudinary")
const app=express();

require("dotenv").config();
const PORT=process.env.PORT || 5000;

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URL', 'CLOUD_NAME', 'API_KEY', 'API_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingEnvVars);
    console.error('Please create a .env file with the required variables');
    process.exit(1);
}

app.get("/",(req,res)=>{
    res.send("App is running fine");
})

// CORS configuration for production
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
}));

app.use(express.json());

app.use(fileupload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
}));

///database connection 
DBConnection()
cloudinaryConnect();

// mount the api routes in the app
app.use("/api/v1/plant",plantRoutes);
app.use("/api/v1/upload",imageUpload);

// Global error handling middleware
app.use((error, req, res, next) => {
    console.error('Error:', error);
    
    return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
    });
});

app.listen(PORT,()=>{
    console.log("✅ App is running on PORT", PORT)
    console.log("🌍 Environment:", process.env.NODE_ENV || 'development')
})