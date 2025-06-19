import qdrantClient from "../db/qdrant.client.js";

const upsertPoint = async (embedding, metadata) => {
    try {
        const response = await qdrantClient.upsert(process.env.QDRANT_COLLECTION_NAME, {
            points: [
                {
                    id: metadata.id,
                    vector: { "vector": embedding },
                    payload: {
                        ...metadata,
                    }
                }
            ],
        });
        return response;
    } catch (error) {
        console.error('Error upserting point:', error.message);
        throw new Error('Failed to upsert point');
    }
}

export { upsertPoint };