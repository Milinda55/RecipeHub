const mongoose = require('mongoose');
const recipeSchema = mongoose.Schema({

    title: {
        type: String,
        required: true,
    },
    ingredients: {
        type: String,
        required: true,
    },
    instructions: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    coverImage: {
        type: String,
        required: true,
    }

}, {timestamps: true});

module.exports = mongoose.model('recipe', recipeSchema);