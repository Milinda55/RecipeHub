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
        if (typeof ingredients === 'string') {

            ingredientsArray = ingredients.split(',')
                .map(item => item.trim())
                .filter(item => item.length > 0);
        } else if (Array.isArray(ingredients)) {

            ingredientsArray = ingredients.flatMap(item =>
                typeof item === 'string' ? item.split(',').map(i => i.trim()) : item
            ).filter(item => item && item.length > 0);
        } else {
            ingredientsArray = [];
        }

        let categoriesArray;
        if (typeof categories === 'string') {
            try {
                categoriesArray = JSON.parse(categories);
            } catch {
                categoriesArray = [categories];
            }
        } else if (Array.isArray(categories)) {
            categoriesArray = categories;
        } else {
            categoriesArray = [];
        }



        const newRecipe = await Recipes.create({
            title,
            ingredients: ingredientsArray,
            instructions,
            time,
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

        const ingredientsArray = typeof ingredients === 'string'
            ? ingredients.split(',').map(item => item.trim()).filter(item => item)
            : Array.isArray(ingredients) ? ingredients : [];

        // Process categories
        let categoriesArray;
        if (typeof categories === 'string') {
            try {
                categoriesArray = JSON.parse(categories);
            } catch {
                categoriesArray = [categories];
            }
        } else if (Array.isArray(categories)) {
            categoriesArray = categories;
        } else {
            categoriesArray = recipe.categories;
        }


        const updatedData = {
            title,
            ingredients: ingredientsArray,
            instructions,
            time,
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
        console.error('Full update error:', {
            message: err.message,
            stack: err.stack,
            body: req.body,
            file: req.file
        });
        res.status(500).json({
            message: 'Error updating recipe',
            error: err.message
        });
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
        const allCategories = [
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
        res.json(allCategories);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching categories' });
    }

};

const searchRecipes = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        const recipes = await Recipe.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { categories: { $regex: query, $options: 'i' } }
            ]
        });

        res.json(recipes);
    } catch (err) {
        res.status(500).json({ message: 'Error searching recipes' });
    }
};


module.exports = {getRecipes, getRecipe, addRecipes, editRecipe, deleteRecipe, getCategories, searchRecipes, upload}
