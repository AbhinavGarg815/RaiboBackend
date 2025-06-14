import axios from 'axios';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Image } from '../models/images.model.js';
import { Product } from '../models/product.model.js';

const searchByImage = asyncHandler(async (req, res) => {
    try {
        const { imageUrl } = req.body;

        if (!imageUrl) {
            return res.status(400).json({ error: 'Image URL is required' });
        }

        const clipResponse = await axios.post(`${process.env.CLIP_URL}/embed-image`, {
            image_url: imageUrl,
        });

        const embedding = clipResponse.data.image_features;

        if (!embedding || embedding.length === 0) {
            return res.status(400).json({ error: 'Failed to generate image embedding' });
        }

        const qdrantResponse = await axios.post(`${process.env.QDRANT_URL}/collections/${process.env.QDRANT_COLLECTION_NAME}/points/query`,
            {
                "using": "vector",
                "query": embedding,
                "limit": 10, // Adjust the limit as needed
                "with_payload": true,
            }, {
            headers: {
                'Content-Type': 'application/json',
                'Api-Key': process.env.QDRANT_API_KEY,
            },
        });

        const result = qdrantResponse.data.result?.points || [];
        const reference_ids = result.map(point => point.payload.reference_id).filter(Boolean);

        const productIds = [];
        const seen = new Set();
        for (const id of reference_ids) {
            if (!seen.has(id)) {
                seen.add(id);
                productIds.push(id);
            }
        }

        const products = await Product.find({ _id: { $in: productIds } })

        res.status(200).json({
            message: 'Search results retrieved successfully',
            products: products,
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to search by image' });
    }
});

const searchByText = asyncHandler(async (req, res) => {
    try {
        const { query } = req.body;

        if (!query) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        const clipResponse = await axios.post(`${process.env.CLIP_URL}/embed-text`, {
            text_query: query,
        });

        const embedding = clipResponse.data.text_features;

        if (!embedding || embedding.length === 0) {
            return res.status(400).json({ error: 'Failed to generate text embedding' });
        }

        const qdrantResponse = await axios.post(`${process.env.QDRANT_URL}/collections/${process.env.QDRANT_COLLECTION_NAME}/points/query`,
            {
                "using": "vector",
                "query": embedding,
                "limit": 10, // Adjust the limit as needed
                "with_payload": true,
            }, {
            headers: {
                'Content-Type': 'application/json',
                'Api-Key': process.env.QDRANT_API_KEY,
            },
        });

        const result = qdrantResponse.data.result?.points || [];
        const reference_ids = result.map(point => point.payload.reference_id).filter(Boolean);

        const productIds = [];
        const seen = new Set();
        for (const id of reference_ids) {
            if (!seen.has(id)) {
                seen.add(id);
                productIds.push(id);
            }
        }

        const products = await Product.find({ _id: { $in: productIds } });

        res.status(200).json({
            message: 'Search results retrieved successfully',
            products: products,
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to search by text' });
    }
});

const searchByTextAndImage = asyncHandler(async (req, res) => {
    try {
        const { imageUrl, text } = req.body;

        if (!text && !imageUrl) {
            return res.status(400).json({ error: 'At least one search parameter is required' });
        }

        console.log('Searching by text and image:', { imageUrl, text });

        const clipResponse = await axios.post(`${process.env.CLIP_URL}/embed-image-text`, {
            text_query: text,
            image_url: imageUrl,
        });

        const embedding = clipResponse.data.combined_features;

        const qdrantResponse = await axios.post(`${process.env.QDRANT_URL}/collections/${process.env.QDRANT_COLLECTION_NAME}/points/query`,
            {
                "using": "vector",
                "query": embedding,
                "limit": 10, // Adjust the limit as needed
                "with_payload": true,
            }, {
            headers: {
                'Content-Type': 'application/json',
                'Api-Key': process.env.QDRANT_API_KEY,
            },
        });

        const result = qdrantResponse.data.result?.points || [];
        const reference_ids = result.map(point => point.payload.reference_id).filter(Boolean);

        const productIds = [];
        const seen = new Set();
        for (const id of reference_ids) {
            if (!seen.has(id)) {
                seen.add(id);
                productIds.push(id);
            }
        }

        const products = await Product.find({ _id: { $in: productIds } });

        res.status(200).json({
            message: 'Search results retrieved successfully',
            products: products,
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to search by text and image' });
    }
});

export { searchByImage, searchByText, searchByTextAndImage };