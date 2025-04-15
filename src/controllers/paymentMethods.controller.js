import { asyncHandler } from "../utils/asyncHandler.js";
import { cardDetails } from "../models/cardDetails.model.js";
import { validationResult } from "express-validator";

const createPaymentMethod = asyncHandler(async (req, res) => {

    const user_id = req.user._id;
    const {card_number, card_holder, expiry_date } = req.body;
    const card = await cardDetails.create({ user_id, card_number, card_holder, expiry_date });
    res.status(201).json({
        message: "Card details created successfully",
        card,
    });
});

const getAllPaymentMethods = asyncHandler(async (req, res) => {

    const user_id = req.user._id;
    const cards = await cardDetails.find({ user_id });
    res.status(200).json({
        message: "Payment methods fetched successfully",
        cards,
    });
});

const updatePaymentMethod = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { card_number, card_holder, expiry_date} = req.body;
    const expiryDate = new Date(expiry_date);

    const card = await cardDetails.findByIdAndUpdate(id, { card_number, card_holder, expiryDate }, { new: true });
    if (!card) {
        res.status(400).json({
            message: "Payment Method not found",
        });
        return;
    }
    res.status(200).json({
        message: "Payment Method details updated successfully",
        card,
    });
});

const deletePaymentMethod = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const card = await cardDetails.findByIdAndDelete(id);
    if (!card) {
        res.status(400).json({
            message: "Payment Method not found",
        });
        return;
    }
    res.status(200).json({
        message: "Payment Method deleted successfully",
    });
});

const getPaymentMethodById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const card = await cardDetails.findById(id);
    if (!card) {
        res.status(400).json({
            message: "Payment Method not found",
        });
        return;
    }
    res.status(200).json({
        message: "Payment Method details fetched successfully",
        card,
    });
});

export { createPaymentMethod, getAllPaymentMethods, updatePaymentMethod , deletePaymentMethod , getPaymentMethodById  };
