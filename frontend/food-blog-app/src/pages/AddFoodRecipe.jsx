import React from 'react';

function AddFoodRecipe(props) {
    return (
        <>
            <div className='container'>
                <form className='form'>
                    <div className='form-control'>
                        <label>Title</label>
                        <input type="text" className='input' name="title"></input>
                    </div>
                    <div className='form-control'>
                        <label>Time</label>
                        <input type="text" className='input' name="time"></input>
                    </div>
                    <div className='form-control'>
                        <label>Ingredients</label>
                        <textarea type="text" className='input-textarea' name="ingredients" rows="5" ></textarea>
                    </div>
                    <div className='form-control'>
                        <label>Instructions</label>
                        <textarea type="text" className='input-textarea' name="instructions" rows="5"></textarea>
                    </div>
                    <div className='form-control'>
                        <label>Recipe Image</label>
                        <input type="file" className='input' name="file"></input>
                    </div>
                    <button type="submit">Add Recipe</button>
                </form>
            </div>
        </>
    );
}

export default AddFoodRecipe;