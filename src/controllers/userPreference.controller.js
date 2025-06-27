import { Category } from "../models/category.model";
import { Interaction } from "../models/interaction.model.js";
import { Product } from "../models/product.model.js";
import { UserPreference } from "../models/userPreferences.model.js";
import { generateUserEmbedding } from "../services/recommendation.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const updateUserPreference = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.body;

        const interactions = await Interaction.find({ userId }).sort({ timestamp: -1 });
        if (interactions.length === 0) {
            return res.status(404).json({ message: "No interactions found for user" });
        }

        let preferences = await UserPreference.findOne({ userId });
        if (!preferences) {
            preferences = new UserPreference({ userId });
        }

        const categoryMap = new Map();
        const totalPrice = 0;
        let priceCount = 0;
        let minPrice = Infinity;
        let maxPrice = 0;
        console.log(interactions);
        for (const interaction of interactions) {
            const product = await Product.findById(interaction.productId);
            if (!product) continue;

            const weight = preferences.interactionWeights[interaction.interactionType] || 1;

            const productCategory = await Category.findById(product.category_id);
            console.log("Product Category:", productCategory);
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
        await preferences.save();

        await generateUserEmbedding(userId);

        res.status(200).json({
            message: "User preferences updated successfully",
            preferences
        });
    } catch (error) {
        console.error('Error updating user preferences:', error);
        res.status(500).json({ message: "Internal server error" });
    }
})

export { updateUserPreference };