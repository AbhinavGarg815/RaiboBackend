import mongoose from 'mongoose';
import { Room } from '../models/room.model.js';
import { Product } from '../models/product.model.js'; // Assuming a Product model exists
import { mapRoomToRoomResponse } from '../mappers/room.mapper.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const createRoom = asyncHandler(async (req, res) => {
    const { name, description, room_type } = req.body;
    const user_id = req.user._id;

    if (!name) {
        throw new ApiError(400, "Room name is required");
    }

    const room = await Room.create({
        name,
        description,
        room_type,
        user_id
    });

    if (!room) {
        throw new ApiError(500, "Failed to create room");
    }
    const roomResponse = mapRoomToRoomResponse(room);
 return res.status(201).json(new ApiResponse(201, roomResponse, "Room created successfully"));
});

const addProductToRoom = asyncHandler(async (req, res) => {
    const { roomId } = req.params;
    const { product_id, quantity } = req.body;
    const user_id = req.user._id;

    if (!product_id || !quantity || quantity < 1) {
        throw new ApiError(400, "Product ID and quantity (minimum 1) are required");
    }

    const room = await Room.findOne({ _id: roomId, user_id });

    if (!room) {
        throw new ApiError(404, "Room not found or does not belong to the user");
    }

    const product = await Product.findById(product_id);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    const existingProductIndex = room.products.findIndex(
        (item) => item.product_id.toString() === product_id
    );

    if (existingProductIndex > -1) {
        room.products[existingProductIndex].quantity += quantity;
    } else {
        room.products.push({ product_id: new mongoose.Types.ObjectId(product_id), quantity });
    }
    await room.save();

    // Fetch all products associated with the room after saving
    const updatedRoomWithProducts = await Room.findById(roomId).populate('products.product_id');
    const roomResponse = mapRoomToRoomResponse(updatedRoomWithProducts);
 return res.status(200).json(new ApiResponse(200, roomResponse, "Product added to room successfully"));
});

const removeProductFromRoom = asyncHandler(async (req, res) => {
    const { roomId } = req.params;
    const {product_id} = req.body;
    const user_id = req.user._id;

    const room = await Room.findOne({ _id: roomId, user_id });

    if (!room) {
        throw new ApiError(404, "Room not found or does not belong to the user");
    }

    const initialLength = room.products.length;
    room.products = room.products.filter(
        (item) => item.product_id.toString() !== product_id
    );

    if (room.products.length === initialLength) {
        throw new ApiError(404, "Product not found in the room");
    }

    await room.save();

    const roomResponse = mapRoomToRoomResponse(room);
 return res.status(200).json(new ApiResponse(200, roomResponse, "Product removed from room successfully"));
});

const getUserRooms = asyncHandler(async (req, res) => {
    const user_id = req.user._id;

    const rooms = await Room.find({ user_id }).populate('products.product_id');
    const roomResponses = rooms.map(room => mapRoomToRoomResponse(room));
    return res.status(200).json({
        rooms: roomResponses,
        message: "User rooms fetched successfully"}
    );
});

const deleteRoom = asyncHandler(async (req, res) => {
    const { roomId } = req.params;
    const user_id = req.user._id;

    const room = await Room.findOneAndDelete({ _id: roomId, user_id });

    if (!room) {
        throw new ApiError(404, "Room not found or does not belong to the user");
    }

    return res.status(200).json(new ApiResponse(200, null, "Room deleted successfully"));
});

const getRoomById = asyncHandler(async (req, res) => {
    const { roomId } = req.params;
    const user_id = req.user._id;
    const room = await Room.findById(roomId).populate('products.product_id');
    if (!room) {
        throw new ApiError(404, "Room not found");
    }
    const roomResponse = mapRoomToRoomResponse(room);
    return res.status(200).json(new ApiResponse(200, roomResponse, "Room fetched successfully"));
});


export {
    createRoom,
    addProductToRoom,
    removeProductFromRoom,
    getUserRooms,
    deleteRoom,
    getRoomById
};