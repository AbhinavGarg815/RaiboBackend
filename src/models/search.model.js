import mongoose , {Schema} from "mongoose";

const searchSchema = new Schema({
    searched_by:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    search_type: {
        type: String,
        enum: ['image', 'text'],
        required: true
    },

    search_data: {
        type: String,
        required: true
    }

});

export const Search = mongoose.model("Search", searchSchema);
