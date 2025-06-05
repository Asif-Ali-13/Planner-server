import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

export const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;
        // upload file on cloudinary
        const uploadResponse = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfully 
        fs.unlinkSync(localFilePath);
        return {
            url: uploadResponse.secure_url,
            public_id: uploadResponse.public_id
        }
    } catch (error) {
        fs.unlinkSync(localFilePath); // remove the locally saved temp files 
    }
}

export const deleteOnCloudinary = async (publicId) => {
    try{
        if(!publicId) return null;
        
        const deleteResponse = await cloudinary.uploader.destroy(publicId, {
            resource_type: "auto"
        });
        return deleteResponse;
    } catch (error) {
        return error;
    }
}