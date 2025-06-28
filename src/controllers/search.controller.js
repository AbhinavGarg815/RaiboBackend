      import { Image } from '../models/images.model.js';
      import { Product } from '../models/product.model.js';
      import { searchProducts } from '../services/aiSearch.service.js';
      import { Comment } from "../models/comment.model.js";
      import { ProductMapper } from "../mappers/product.mapper.js";
      import { asyncHandler } from '../utils/asyncHandler.js';
      
      const search = asyncHandler(async (req, res) => {
          const TIMEOUT = 15000; // 15 seconds
     
          const text = req.body.text_query || null;
          const user_id = req.user?._id;
          const imageFile = req.file || null;
     
          if (!text && !imageFile) {
              return res.status(400).json({ error: 'Either text or image is required for search' });
          }
         
          try {
             const productIds = await Promise.race([
                  searchProducts({ text, imageFile }),
                  new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), TIMEOUT))
              ]);
              const products = await Product.find({ _id: { $in: productIds } }).populate('category_id').populate('company_id');
              // Fetch image URLs from the Image model
              const productDetails = await Promise.all(products.map(async (product) => {
                  const isLikedByUser = user_id ? product.likedBy.includes(user_id) : false;
                  const comments = await Comment.find({ reference: product._id, onModel: 'Product', type: 'external', isDeleted: false })
                      .select('_id content parentComment');
                  const images = await Image.find({ _id: { $in: product.images } }).select('url');
                  return ProductMapper.toProductDetailResponse(product.toObject(), comments || [], isLikedByUser, images);
              }));
              const orderedProducts = productIds.map(id =>
                     productDetails.find(product => product._id.toString() === id)
             ).filter(Boolean);
             res.status(200).json({
                 message: 'Search results retrieved successfully',
                 products: orderedProducts,
             });
         } catch (error) {
             console.error(error.message);
             res.status(500).json({ error: 'Failed to perform search' });
         }
     });
     
     const textSearch = asyncHandler(async (req, res) => {
        const text = req.body.text_query;
        const user_id = req.user?._id;

        if (!text) {
            return res.status(400).json({ error: 'Text query is required for text search' });
        }

        try {
            const products = await Product.find({
                $or: [
                    { title: { $regex: text, $options: 'i' } },
                    { description: { $regex: text, $options: 'i' } }
                ]
            }).populate('category_id').populate('company_id');

            const productDetails = await Promise.all(products.map(async (product) => {
                const isLikedByUser = user_id ? product.likedBy.includes(user_id) : false;
                const comments = await Comment.find({ reference: product._id, onModel: 'Product', type: 'external', isDeleted: false })
                    .select('_id content parentComment');
                const images = await Image.find({ _id: { $in: product.images } }).select('url');
                return ProductMapper.toProductDetailResponse(product.toObject(), comments || [], isLikedByUser, images);
            }));

            res.status(200).json({
                message: 'Text search results retrieved successfully',
                products: productDetails,
            });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: 'Failed to perform text search' });
        }
     });
     
     export { search, textSearch };