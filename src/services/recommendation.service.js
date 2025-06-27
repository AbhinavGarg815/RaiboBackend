import qdrantClient from '../db/qdrant.client.js';
import { Category } from '../models/category.model.js';
import { Interaction } from '../models/interaction.model.js';
import { Product } from '../models/product.model.js';
import { UserPreference } from '../models/userPreferences.model.js';
import { v5 as uuidv5 } from 'uuid';
import { NAMESPACE } from '../constants.js';

async function generateUserEmbedding(userId) {
    try {
        const interactions = await Interaction.find({ userId }).sort({ timestamp: -1 }).limit(100);
        if (interactions.length === 0) {
            throw new Error('No interactions found for user');
        }

        const productIds = interactions.map(interaction => interaction.productId);
        const productEmbeddings = await qdrantClient.scroll(process.env.QDRANT_COLLECTION_NAME,
            {
                filter: {
                    must: [{
                        key: 'reference_id',
                        match: {
                            any: productIds.map(id => id.toString())
                        }
                    }, {
                        key: 'embedding_type',
                        match: {
                            value: 'combined'
                        }
                    }]
                },
                with_vector: true,
                limit: productIds.length
            }
        );

        if (productEmbeddings.length === 0) {
            throw new Error('No product embeddings found for user interactions');
        }

        const preferences = await UserPreference.findOne({ userId });
        if (!preferences) {
            throw new Error('No user preferences found');
        }
        const embeddingDim = productEmbeddings.points[0].vector.vector.length;
        const userEmbedding = new Array(embeddingDim).fill(0);
        let totalWeight = 0;

        for (const interaction of interactions) {
            const productEmbedding = productEmbeddings.points.find(embedding => embedding.payload.reference_id.toString() === interaction.productId.toString());
            if (productEmbedding) {
                const weight = preferences.interactionWeights[interaction.interactionType] || 1;

                const daysSinceInteraction = (Date.now() - interaction.timestamp.getTime()) / (1000 * 60 * 60 * 24);
                const timeDecay = Math.exp(-daysSinceInteraction / 30);
                const finalWeight = weight * timeDecay;
                for (let i = 0; i < embeddingDim; i++) {
                    userEmbedding[i] += productEmbedding.vector.vector[i] * finalWeight;
                }
                totalWeight += finalWeight;
            }
        }

        if (totalWeight > 0) {
            for (let i = 0; i < embeddingDim; i++) {
                userEmbedding[i] /= totalWeight;
            }
        }

        const pointId = uuidv5(userId.toString(), NAMESPACE);
        await qdrantClient.upsert(process.env.USER_EMBEDDINGS_COLLECTION, {
            points: [
                {
                    id: pointId,
                    vector: userEmbedding,
                    payload: {
                        userId: userId.toString(),
                        total_interactions: interactions.length,
                        last_updated: new Date().toISOString()
                    }
                }
            ]
        });

        console.log(`User embedding generated for user ${userId}`);
    } catch (error) {
        console.error(`Error generating user embedding for user ${userId}:`, error);
        throw new Error('Failed to generate user embedding');
    }
}

async function updateUserPreference(userId) {
    try {
        const interactions = await Interaction.find({ userId }).sort({ timestamp: -1 });
        if (interactions.length === 0) {
            return console.log(`No interactions found for user ${userId}`);
        }

        let preferences = await UserPreference.findOne({ userId });
        if (!preferences) {
            preferences = new UserPreference({ userId });
        }

        const categoryMap = new Map();
        let totalPrice = 0;
        let priceCount = 0;
        let minPrice = Infinity;
        let maxPrice = 0;
        for (const interaction of interactions) {
            const product = await Product.findById(interaction.productId);
            if (!product) continue;

            const weight = preferences.interactionWeights[interaction.interactionType] || 1;

            const productCategory = await Category.findById(product.category_id);
            const categoryScore = categoryMap.get(productCategory.name) || { score: 0, count: 0 };
            categoryScore.score += weight;
            categoryScore.count += 1;
            categoryMap.set(productCategory.name, categoryScore);

            totalPrice += product.price;
            priceCount += 1;
            minPrice = Math.min(minPrice, product.price);
            maxPrice = Math.max(maxPrice, product.price);
        }
        preferences.totalInteractions = interactions.length;

        preferences.categoryPreferences = Array.from(categoryMap.entries()).map(([category, data]) => ({
            category,
            score: data.score,
            interactionCount: data.count
        })).sort((a, b) => b.score - a.score);
        if (priceCount > 0) {
            preferences.pricePreferences = {
                average: totalPrice / priceCount,
                min: minPrice,
                max: maxPrice
            };
        }
        preferences.lastUpdated = new Date();
        // console.log(preferences);

        await preferences.save();

        await generateUserEmbedding(userId);

        console.log(`User preferences updated for user ${userId}`);
    } catch (error) {
        console.error('Error updating user preferences:', error.message);
        throw new Error('Failed to update user preferences');
    }
}

async function getContentBasedRecommendations(userId, limit = 10) {
    try {
        const userPoints = await qdrantClient.scroll(process.env.USER_EMBEDDINGS_COLLECTION, {
            "filter": {
                "must": [
                    {
                        "key": "userId",
                        "match": {
                            "value": userId.toString()
                        }
                    }
                ]
            },
            "with_vector": true,
        });

        if (!userPoints || userPoints.points.length === 0) {
            return [];
        }

        const userPreference = await UserPreference.findOne({ userId });
        const filters = {};

        if (userPreference && userPreference.categoryPreferences.length > 0) {
            const topCategories = userPreference.categoryPreferences.slice(0, 3).map(cp => cp.category);
            filters.category = topCategories;
        }

        // Print the query request before querying
        const queryRequest = {
            "using": "vector",
            "query": userPoints.points[0].vector,
            "limit": limit * 2,
            "score_threshold": 0.2,
            "with_payload": true,
            "filter": filters.category ? {
            "should": filters.category.map(cat => ({ "key": 'category', "match": { "value": cat } }))
            } : undefined
        };

        const similarProducts = await qdrantClient.query(process.env.QDRANT_COLLECTION_NAME, queryRequest);

        return similarProducts.points.slice(0, limit).map(product => ({
            "product_id": product.payload.reference_id,
            "similarity_score": product.score,
            "category": product.payload.category,
        }));
    } catch (error) {
        console.error('Error getting content-based recommendations:', error);
        return [];
    }
}

async function getUserRecommendations(userId, limit = 20) {
    try {
        let recommendations = [];
        const contentRecs = await getContentBasedRecommendations(userId, limit);
        recommendations.push(...contentRecs);
        const userInteractions = await Interaction.find({ userId }).distinct('productId');
        const uniqueRecs = recommendations.filter((rec, index, self) =>
            !userInteractions.includes(rec.product_id) && self.findIndex(r => r.product_id === rec.product_id) === index
        );
        return uniqueRecs;
    } catch (error) {
        console.error('Error getting user recommendations: ', error);
        throw error;
    }
}

export { generateUserEmbedding, updateUserPreference, getUserRecommendations, getContentBasedRecommendations };