import cloudinary from 'cloudinary';
import { Image } from '../models/images.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const uploadImage = asyncHandler( async (req, res) => {

  const { path } = req.file;
  const { type } = req.body;

  // Process the uploaded image here

  try {
    const result = await cloudinary.v2.uploader.upload(path);
    const image = new Image({
      url: result.url,
      public_id: result.public_id,
      type: type,
    });

    await image.save();
    res.status(200).json({ message: 'Image uploaded successfully', image });

  } catch (error) {
    console.error("Error uploading image:", error);
    return res.status(500).json({ error: "Failed to upload image" });
  }
  }
);

const deleteImage = asyncHandler( async (req, res) => {
  const { id } = req.params;
  console.log(req.params);
  try {
    const image = await Image.findByIdAndDelete(id);
    const result = await cloudinary.v2.uploader.destroy(image.public_id);
    console.log(image);
    console.log(result);
    res.status(200).json({ message: "Image deleted successfully" });
      }
   catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ error: "Failed to delete image" });
  }
});

const getImageById = asyncHandler( async (req, res) => {
  const {id} = req.params;

  try{
  const result = await cloudinary.v2.api.resource(id);
  return res.status(200).json({'url': result.url , 'public_id': result.public_id });
  }
  catch (error) {
    console.log("Error getting image:", error);
    return res.status(500).json({ message: "Failed to get image", error: error });
  }
});

export {deleteImage, uploadImage, getImageById}
