import {
    RoomResponse,
    RoomItemResponse
} from '../models/room.response.models.js';

export function mapRoomToRoomResponse(room, products = []) {
    const roomItemsResponse = room.products.map(item => new RoomItemResponse({
        id: item.product_id._id,
        name: item.product_id.name,
        image: item.product_id.imageUrls[0] || "https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=1587&auto=format&fit=crop",
        price: item.product_id.price,
        description: item.product_id.description,
    }));

    return new RoomResponse({
        id: room.id,
        name: room.name,
        description: room.description,
        room_type: room.room_type,
        user_id: room.user_id,
        items: roomItemsResponse,
        created_at: room.created_at,
        updated_at: room.updated_at,
    });
}