import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";

function EditRecipe() {
    const [recipeData, setRecipeData]=useState({})
    const navigate = useNavigate()
    const{id}=useParams()

    useEffect(()=>{
        const getData=async()=>{
            await axios.get(`http://localhost:5000/recipe/${id}`)
                .then(response=>{
                    let res=response.data
                    setRecipeData({
                        title:res.title,
                        ingredients:res.ingredients.join(","),
                        instructions:res.instructions,
                        time:res.time
                    })
                })
        }
        getData()
    },[])

    const onHandleChange = (e)=> {
        // console.log(e.target.files[0])
        let val = (e.target.name === "ingredients") ? e.target.value.split(",") : (e.target.name === "file") ? e.target.files[0] : e.target.value
        setRecipeData(pre=>({...pre,[e.target.name]:val}))
    }

    const onHandleSubmit = async (e) => {
        e.preventDefault()
        console.log(recipeData)
        await axios.put(`http://localhost:5000/recipe/${id}`,recipeData, {
            headers:{
                'Content-Type':'multipart/form-data',
                'authorization':'bearer ' + localStorage.getItem("token")
            }
        })
            .then(()=>navigate("/myRecipe"))
    }

    return (
        <div className="form-container">
            <div className="form-header">
                <div className="form-header-back">
                    <h1 onClick={() => navigate(-1)}>&lt;</h1>
                    <h2>Share Your Recipe</h2>
                </div>
                <p>Update the details of your delicious recipe below</p>
            </div>

            <form className="recipe-form" onSubmit={onHandleSubmit}>
                <div className="form-grid">
                    <div className="form-group">
                        <label className="form-label">Recipe Title</label>
                        <input
                            type="text"
                            className="form-input"
                            name="title"
                            onChange={onHandleChange}
                            value={recipeData.title || ''}
                            placeholder="e.g. Creamy Garlic Pasta"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Preparation Time</label>
                        <input
                            type="text"
                            className="form-input"
                            name="time"
                            onChange={onHandleChange}
                            value={recipeData.time || ''}
                            placeholder="e.g. 30 mins"
                            required
                        />
                    </div>

                    <div className="form-group full-width">
                        <label className="form-label">Ingredients</label>
                        <textarea
                            className="form-textarea"
                            name="ingredients"
                            rows="5"
                            onChange={onHandleChange}
                            value={Array.isArray(recipeData.ingredients) ? recipeData.ingredients.join(',') : recipeData.ingredients || ''}
                            placeholder="Enter ingredients separated by commas (e.g. 2 cups flour, 1 tbsp sugar)"
                            required
                        ></textarea>
                    </div>

                    <div className="form-group full-width">
                        <label className="form-label">Instructions</label>
                        <textarea
                            className="form-textarea"
                            name="instructions"
                            rows="8"
                            onChange={onHandleChange}
                            value={recipeData.instructions || ''}
                            placeholder="Provide step-by-step instructions"
                            required
                        ></textarea>
                    </div>

                    <div className="form-group full-width">
                        <label className="form-label">Recipe Image</label>
                        <div className="file-upload">
                            <label htmlFor="file-upload" className="file-upload-label">
              <span className="file-upload-text">
                {recipeData.file ? recipeData.file.name : 'Choose a new image (optional)'}
              </span>
                                <span className="file-upload-button">Browse</span>
                            </label>
                            <input
                                id="file-upload"
                                type="file"
                                className="file-input"
                                name="file"
                                onChange={onHandleChange}
                                accept="image/*"
                            />
                        </div>
                        {recipeData.imageUrl && !recipeData.file && (
                            <p className="current-image-message">
                                Current image: <span>{recipeData.imageUrl}</span>
                            </p>
                        )}
                        <p className="file-hint">Upload a new image to replace the existing one</p>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="submit-button">
                        <span>Update Recipe</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditRecipe;