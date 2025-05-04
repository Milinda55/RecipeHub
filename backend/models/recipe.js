const mongoose = require('mongoose');
const recipeSchema = mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },
    ingredients: {
        type: [Array],
        required: true,
        validate: {
            validator: function(v) {
                return v.length > 0;
            },
            message: 'At least one ingredient is required'
        }
    },
    instructions: {
        type: String,
        required: true,
        trim: true
    },
    time: {
        type: String
    },

    categories: {
        type: [String],
        required: true,
        enum: [
            'breakfast',
            'lunch',
            'dinner',
            'dessert',
            'fast-food',
            'pizza',
            'kottu',
            'burgers',
            'snacks',
            'smoothies',
            'salads',
            'beverages',
            'pasta',
            'street-food'
        ],
        default: ['main-meal']
    },

    coverImage: {
        type: String
    },
    createdBy: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    }

}, {timestamps: true});

recipeSchema.index({
    title: 'text',
    ingredients: 'text',
    instructions: 'text',
    categories: 'text'
});

module.exports = mongoose.model("Recipes", recipeSchema);