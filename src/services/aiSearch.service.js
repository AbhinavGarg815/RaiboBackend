import { Product } from '../models/product.model.js';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import qdrantClient from '../db/qdrant.client.js';

async function fetchEmbedding({ text, imageFile }) {
    const formData = new FormData();
    if (text) {
        formData.append('text_query', text);
    }
    if (imageFile) {
        const fileStream = fs.createReadStream(imageFile.path);
        formData.append('image', fileStream, {
            filename: imageFile.originalname,
            contentType: imageFile.mimetype,
        });
    }

    try {
        if (text && imageFile) {
            const clipResponse = await axios.post(`${process.env.CLIP_URL}/embed-image-text`, formData, {
                headers: {
                    ...formData.getHeaders(),
                },
            });
            return clipResponse.data.combined_embedding;
        } else if (text) {
            const clipResponse = await axios.post(`${process.env.CLIP_URL}/embed-text`, formData, {
                headers: {
                    ...formData.getHeaders(),
                }
            });
            return clipResponse.data.text_embedding;
        } else if (imageFile) {
            const clipResponse = await axios.post(`${process.env.CLIP_URL}/embed-image`, formData, {
                headers: {
                    ...formData.getHeaders(),
                }
            });
            return clipResponse.data.image_embedding;
        }
        throw new Error('Either text or imageFile must be provided');
    } catch (error) {
        console.error('Error fetching embedding:', error.message);
        throw new Error('Failed to fetch embedding');
    } finally {
        if (imageFile) {
            fs.unlink(imageFile.path, (err) => {
                if (err) throw err;
            });
        }
    }

}

async function queryQdrant(isText, isImageFile, embedding) {
    try {
        let filter = { must: [] };
        if (isText && isImageFile) {
            filter.must.push({ key: 'embedding_type', match: { value: 'combined' } });
        }
        else if (isText) {
            filter.must.push({ key: 'embedding_type', match: { value: 'text' } });
        } else if (isImageFile) {
            filter.must.push({ key: 'embedding_type', match: { value: 'image' } });
        }
        const qdrantResponse = await qdrantClient.query(process.env.QDRANT_COLLECTION_NAME,
            {
                "using": "vector",
                "query": embedding,
                "limit": 5, // Adjust the limit as needed
                "with_payload": true,
                "params": {
                    "exact": true,
                },
                "filter": filter
            }, {
            headers: {
                'Content-Type': 'application/json',
                'Api-Key': process.env.QDRANT_API_KEY,
            },
        });

        const result = qdrantResponse?.points || [];
        const reference_ids = result.map(point => point.payload.reference_id).filter(Boolean);
        const productIds = [];
        const seen = new Set();
        for (const id of reference_ids) {
            if (!seen.has(id)) {
                seen.add(id);
                productIds.push(id);
            }
        }
        return productIds;
        
    } catch (error) {
        console.error('Error querying Qdrant:', error);
        throw new Error('Failed to query Qdrant');
    }
}

export async function searchProducts({ text, imageFile }) {
    const embedding = await fetchEmbedding({ text, imageFile });
    if (!embedding || embedding.length === 0) {
        throw new Error('Failed to generate embedding');
    }
    const productIds = await queryQdrant(text ? true : false, imageFile ? true : false, embedding);
    console.info(productIds);
    return productIds;
}
