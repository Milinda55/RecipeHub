const express = require('express');
const {getRecipes, getRecipe, addRecipes, editRecipe, deleteRecipe} = require("../controller/recipeController");
const router = express.Router();

router.get('/', getRecipes);
router.get('/:id', getRecipe);
router.post('/', addRecipes);
router.put('/:id', editRecipe);
router.delete('/:id', deleteRecipe);


module.exports = router;