export class RoomItemResponse {
    constructor({ id, name, image, price, description }) {
        this.id = id;
        this.name = name;
        this.image = image;
        this.price = price;
        this.description = description;
    }
}

export class RoomResponse {
    constructor({ id, name, description, room_type, items, created_at, updated_at }) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.room_type = room_type;
        this.items = items.map(item => new RoomItemResponse(item));
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}