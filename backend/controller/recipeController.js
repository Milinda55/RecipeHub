const Recipes = require('../models/recipe');

const getRecipes = (req, res) => {
    res.json({message: 'Hello Recipes!'}
    )
}

const getRecipe = (req, res) => {
    res.json({message: 'Hello Recipe!'}
    )
}

const addRecipes = async (req, res) => {
    const {title, ingredients, instructions, time} = req.body;

    if (!title || !ingredients || !instructions) {
        res.json({message: 'Required fields cannot be empty!'})
    }

    const newRecipe = await Recipes.create({
        title, ingredients, instructions, time
    });
    return res.json(newRecipe);
}

const editRecipe = (req, res) => {
    res.json({message: 'Edit Recipe!'}
    )
}

const deleteRecipe = (req, res) => {
    res.json({message: 'Delete Recipe!'}
    )
}

module.exports = {getRecipes, getRecipe, addRecipes, editRecipe, deleteRecipe}