const express = require('express');
const { getRecipe, addRecipes, editRecipe, deleteRecipe, upload, getCategories, getRecipes} = require("../controller/recipeController");
const verifyToken = require("../middleware/auth");
const router = express.Router();

router.get('/', getRecipes);
router.get('/:id', getRecipe);
router.post('/', upload.single('file'),verifyToken, addRecipes);
router.put('/:id', upload.single('file'),editRecipe);
router.delete('/:id', deleteRecipe);
router.get('/categories', getCategories);


module.exports = router;