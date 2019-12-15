import { Schema, model } from 'mongoose';

const devSchema = new Schema ({
    name: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
    bio: String,
    avatar: {
        type: String,
        required: true,
    },
    /**
     * Os campos likes e dislikes estão entre colchetes para indicar que são vetores
     * ou seja, irão armazenar um array de ids. Esses campos estão sendo relacionados
     * com o Schema Dev.
     */ 
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'Dev',
    }],
    dislikes: [{
        type: Schema.Types.ObjectId,
        ref: 'Dev',
    }],
},
{
    timestamps: true,
});

export default model('Dev', devSchema);
