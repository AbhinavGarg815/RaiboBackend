import { Interaction } from "../models/interaction.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
// import { updateUserPreference } from "./userPreference.controller.js";
import { updateUserPreference } from "../services/recommendation.service.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";

const trackInteraction = asyncHandler(async (req, res) => {
    try {
        const { userId, productId, interactionType, interactionValue } = req.body;

        if (!userId || !productId || !interactionType) {
            return res.status(400).json({
                message: "Missing required fields"
            });
        }

        const validInteractionTypes = ["view", "click", "add_to_cart", "purchase", "like", "share", "review"];
        if (!validInteractionTypes.includes(interactionType)) {
            return res.status(400).json({
                message: "Invalid interaction type"
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        const interaction = new Interaction({
            userId,
            productId,
            interactionType,
            interactionValue: interactionValue || 1,
        });

        await interaction.save();

        await updateUserPreference(userId);

        res.status(201).json({
            message: "Interaction tracked successfully",
            interaction,
        });
    } catch (error) {
        console.error("Error tracking interaction:", error);
        res.status(500).json({
            message: "Failed to track interaction",
            error: error.message,
        });
    }
});

export { trackInteraction };