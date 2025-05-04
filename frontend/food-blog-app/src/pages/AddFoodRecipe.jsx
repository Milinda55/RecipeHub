import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {FaCheck} from "react-icons/fa";


function AddFoodRecipe() {
    const [recipeData, setRecipeData]=useState({
        categories: []
    });
    const [availableCategories, setAvailableCategories] = useState([]);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const navigate = useNavigate()


    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/recipes/categories");
                setAvailableCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
                setAvailableCategories([
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
                ]);
            }
        };
        fetchCategories();
    }, []);




    const onHandleChange = (e)=> {
        // console.log(e.target.files[0])
        let val = (e.target.name === "ingredients") ? e.target.value.split(",") : (e.target.name === "file") ? e.target.files[0] : e.target.value
        setRecipeData(pre=>({...pre,[e.target.name]:val}))
    }


    const handleCategoryToggle = (category) => {
        setRecipeData(prev => {
            if (prev.categories.includes(category)) {
                return {
                    ...prev,
                    categories: prev.categories.filter(c => c !== category)
                };
            } else {
                return {
                    ...prev,
                    categories: [...prev.categories, category]
                };
            }
        });
    };


    const onHandleSubmit = async (e) => {
        e.preventDefault()
        console.log(recipeData)
        try {
            const formData = new FormData();
            Object.entries(recipeData).forEach(([key, value]) => {
                if (key === 'ingredients' || key === 'categories') {
                    formData.append(key, JSON.stringify(value));
                } else if (key === 'file') {
                    formData.append('coverImage', value);
                } else {
                    formData.append(key, value);
                }
            });


            await axios.post("http://localhost:5000/recipe", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'authorization': 'bearer ' + localStorage.getItem("token")
                }
            });
            navigate("/");
        } catch (error) {
            console.error("Error submitting recipe:", error);
        }
    }


    return (
        <div className="form-container">
            <div className="form-header">
                <div className="form-header-back">
                    <h1 onClick={() => navigate(-1)}>&lt;</h1>
                    <h2>Share Your Recipe</h2>
                </div>


                <p>Fill in the details below to add your delicious recipe to our collection</p>
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
                            placeholder="Provide step-by-step instructions"
                            required
                        ></textarea>
                    </div>


                    <div className="form-group full-width">
                        <label className="form-label">Recipe Image</label>
                        <div className="file-upload">
                            <label htmlFor="file-upload" className="file-upload-label">
             <span className="file-upload-text">
               {recipeData.file ? recipeData.file.name : 'Choose an image...'}
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
                                required
                            />
                        </div>
                        <p className="file-hint">Upload a high-quality image of your finished dish</p>
                    </div>
                </div>


                <div className="form-actions">
                    <button type="submit" className="submit-button">
                        <span>Add Recipe</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 5v14M5 12h14"/>
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    );
}


export default AddFoodRecipe;
