import { v2 as cloudinary } from 'cloudinary';

export const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

cloudinary.config(cloudinaryConfig);

export const isCloudinaryConfigured = () => (
  Boolean(cloudinaryConfig.cloud_name)
  && Boolean(cloudinaryConfig.api_key)
  && Boolean(cloudinaryConfig.api_secret)
);

export default cloudinary;
