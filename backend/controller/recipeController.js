const getRecipes = (req, res) => {
    res.json({message: 'Hello Recipes!'}
    )
}

const getRecipe = (req, res) => {
    res.json({message: 'Hello Recipe!'}
    )
}

const addRecipes = (req, res) => {
    res.json({message: 'Add Recipes!'}
    )
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