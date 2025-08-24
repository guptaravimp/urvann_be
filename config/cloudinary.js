const cloudinary = require('cloudinary').v2

exports.cloudinaryConnect=()=>{
    try{
        // Validate required environment variables
        if (!process.env.CLOUD_NAME || !process.env.API_KEY || !process.env.API_SECRET) {
            throw new Error('Missing Cloudinary environment variables');
        }

        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET,
        });

        console.log('Cloudinary configured successfully');
        
        // Test the connection
        cloudinary.api.ping()
            .then(() => console.log(' Cloudinary connection test successful'))
            .catch(err => console.error(' Cloudinary connection test failed:', err));
            
    }catch(error){
        console.error(' Cloudinary configuration error:', error);
        process.exit(1);
    }
}