const File=require("../models/File")
const cloudinary = require('cloudinary').v2




function isFiletypeSupported(type, supportedType) {
    return supportedType.includes(type);
}



async function uploadFileToCloudinary(file,folder){
    const options={folder};
    options.resource_type="auto"
    
    if (file.tempFilePath) {
        return await cloudinary.uploader.upload(file.tempFilePath, options);
    } else if (file.data) {
        const stream = require('stream');
        const bufferStream = new stream.PassThrough();
        bufferStream.end(file.data);
        
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
            bufferStream.pipe(uploadStream);
        });
    } else {
        throw new Error('No file data available');
    }
}

exports.imageUpload=async(req,res)=>{
    try{

        const {name,tags,email}=req.body;
        
        if (!req.files || !req.files.imagefiles) {
            return res.status(400).json({
                success: false,
                message: "No image file provided"
            });
        }
        
        const file=req.files.imagefiles;

        const supportedType=["jpg","png","jpeg","avif","webp"]
        const fileType=file.name.split('.')[1].toLowerCase();

        if (!isFiletypeSupported(fileType, supportedType)) {
            return res.status(400).json({
                success: false,
                message: "File type is not supported"
            });
        }
        
        
        const response=await uploadFileToCloudinary(file,"techravibusiness");

        const fileData=await File.create({
           name,
           tags,
           email,
           imageUrl:response.secure_url,
        })

       res.json({
        success:true,
        message:"image uploaded successfully",
        imageUrl:response.secure_url,
       })
       
    }
    catch(error){
        console.error("Image upload error:", error)
        res.status(500).json({
            success:false,
            message:"Image upload failed",
            error: error.message
        })
    }
}






