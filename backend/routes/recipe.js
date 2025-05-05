const express = require('express');
const { getRecipe, addRecipes, editRecipe, deleteRecipe, upload, getCategories, getRecipes, searchRecipes} = require("../controller/recipeController");
const verifyToken = require("../middleware/auth");
const router = express.Router();

router.get('/', getRecipes);
router.get('/:id', getRecipe);
router.post('/', upload.single('file'),verifyToken, addRecipes);
router.put('/:id', verifyToken, upload.single('file'), editRecipe);
router.delete('/:id', verifyToken, deleteRecipe);
router.get('/categories', getCategories);
router.get('/search', searchRecipes);

module.exports = router;