import { asyncHandler } from '../utils/asyncHandler.js';
import { Image } from '../models/images.model.js';
import { Product } from '../models/product.model.js';
import { searchProducts } from '../services/aiSearch.service.js';

const search = asyncHandler(async (req, res) => {
    const text = req.body.text_query || null;
    const imageFile = req.file || null;

    if (!text && !imageFile) {
        return res.status(400).json({ error: 'Either text or image is required for search' });
    }

    try {
        const products = await searchProducts({ text, imageFile });
        res.status(200).json({
            message: 'Search results retrieved successfully',
            products: products,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Failed to perform search' });
    }
});

export { search };