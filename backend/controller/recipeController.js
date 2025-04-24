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

const upload = multer({ storage: storage })

const getRecipes = async (req, res) => {
    const recipes = await Recipes.find();
    return res.json(recipes);
}

const getRecipe = async (req, res) => {
    const recipe = await Recipes.findById(req.params.id);
    return res.json(recipe);
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

const editRecipe = async (req, res) => {
    const {title, ingredients, instructions, time} = req.body;
    let recipe = await Recipes.findById(req.params.id);

    try {
        if (recipe) {
            await Recipes.findByIdAndUpdate(req.params.id, req.body, {new:true});
            res.json({title, ingredients, instructions, time})
        }
    } catch (err) {
        return res.status(404).json({message: "Here an error comes"});
    }
}

const deleteRecipe = (req, res) => {
    res.json({message: 'Delete Recipe!'}
    )
}

module.exports = {getRecipes, getRecipe, addRecipes, editRecipe, deleteRecipe, upload}