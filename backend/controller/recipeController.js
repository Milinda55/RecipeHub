const Recipes = require('../models/recipe');
const multer = require('multer');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images')
    },
    filename: function (req, file, cb) {
        const filename = Date.now() + '-' + file.fieldname
        cb(null, filename)
    }
})


const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 }  })


const getRecipes = async (req, res) => {
    try {
        const recipes = await Recipes.find({})
            .sort({ createdAt: -1 });

        const transformedRecipes = recipes.map(recipe => {
            if (!recipe.categories || recipe.categories.length === 0) {
                return {
                    ...recipe._doc,
                    categories: ['uncategorized']
                };
            }
            return recipe;
        });


        res.json(transformedRecipes);
    } catch (err) {
        console.error('Error fetching recipes:', err);
        res.status(500).json({ message: 'Server error' });
    }
};


const getRecipe = async (req, res) => {
    try {
        const recipe = await Recipes.findById(req.params.id)
            .populate('createdBy', 'username email');

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        res.json(recipe);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}


const addRecipes = async (req, res) => {
    try {
        const { title, ingredients, instructions, time, categories } = req.body;


        let ingredientsArray;
        let categoriesArray;

        try {
            ingredientsArray = JSON.parse(ingredients);
            categoriesArray = JSON.parse(categories);
        } catch (e) {
            // If parsing fails, handle as strings
            ingredientsArray = ingredients.split(',').map(item => item.trim());
            categoriesArray = [categories].flat(); // Handle both string and array
        }


        const newRecipe = await Recipes.create({
            title,
            ingredients: ingredientsArray,
            instructions,
            time: parseInt(time) || 0,
            categories: categoriesArray,
            coverImage: req.file?.filename || 'default-recipe.jpg',
            createdBy: req.user.id
        });


        res.status(201).json(newRecipe);
    } catch (err) {
        console.error('Error creating recipe:', err);
        res.status(500).json({ message: 'Error creating recipe' });
    }
}


const editRecipe = async (req, res) => {
    try {
        const { title, ingredients, instructions, time, categories } = req.body;
        const recipe = await Recipes.findById(req.params.id);


        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        if (recipe.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const ingredientsArray = Array.isArray(ingredients)
            ? ingredients
            : ingredients.split(',').map(item => item.trim());


        const categoriesArray = Array.isArray(categories)
            ? categories
            : [categories];


        const updatedData = {
            title,
            ingredients: ingredientsArray,
            instructions,
            time: parseInt(time) || 0,
            categories: categoriesArray,
            coverImage: req.file?.filename || recipe.coverImage
        };


        const updatedRecipe = await Recipes.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true }
        );


        res.json(updatedRecipe);
    } catch (err) {
        res.status(500).json({ message: 'Error updating recipe' });
    }
}


const deleteRecipe = async (req, res) => {
    try {
        // console.log("Deleting recipe:", req.params.id);
        // console.log("User making request:", req.user);

        const recipe = await Recipes.findById(req.params.id);


        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        // console.log("Recipe creator:", recipe.createdBy.toString());
        // console.log("Request user:", req.user.id.toString());


        if (recipe.createdBy.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }


        await Recipes.deleteOne({ _id: req.params.id });
        res.json({ message: 'Recipe deleted successfully' });
    } catch (err) {
        console.error('Delete error:', err);
        res.status(500).json({ message: 'Error deleting recipe', error:err.message });
    }
}


const getCategories = async (req, res) => {
    try {
        const categories = [
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
        ];
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching categories' });
    }
};


module.exports = {getRecipes, getRecipe, addRecipes, editRecipe, deleteRecipe, getCategories, upload}
