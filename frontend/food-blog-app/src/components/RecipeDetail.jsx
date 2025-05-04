import React, {useState, useEffect, useContext} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BsStopwatchFill, BsArrowLeft } from 'react-icons/bs';
import { FaHeart, FaUtensils } from 'react-icons/fa';
import { AuthContext } from './AuthContext';

function RecipeDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isLoggedIn } = useContext(AuthContext);
    const [favItems, setFavItems] = useState(JSON.parse(localStorage.getItem("fav")) || []);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/recipe/${id}`);
                setRecipe(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [id]);
    
    const toggleFavorite = () => {
        if (!isLoggedIn) return;

        const updatedFavItems = favItems.some(item => item._id === recipe._id)
            ? favItems.filter(item => item._id !== recipe._id)
            : [...favItems, recipe];


        localStorage.setItem("fav", JSON.stringify(updatedFavItems));
        setFavItems(updatedFavItems);
    };


    if (loading) return <div className="loading">Loading recipe...</div>;
    if (error) return <div className="error">Error: {error}</div>;
    if (!recipe) return <div className="not-found">Recipe not found</div>;


    const isFavorite = favItems.some(item => item._id === recipe._id);
    const difficulty =
        recipe.time <= 10 ? "Easy" :
            recipe.time <= 20 ? "Medium" : "Hard";


    return (
        <div className="recipe-detail-container">
            <button onClick={() => navigate(-1)} className="back-button">
                <BsArrowLeft /> Back to recipes
            </button>


            <div className="recipe-header">
                <div className="recipe-image-container">
                    <img
                        src={`http://localhost:5000/images/${recipe.coverImage}`}
                        alt={recipe.title}
                        className="recipe-image"
                    />
                    <div className={`difficulty-badge ${difficulty.toLowerCase()}`}>
                        {difficulty}
                    </div>
                    {isLoggedIn && (
                        <button
                            onClick={toggleFavorite}
                            className={`favorite-button ${isFavorite ? 'active' : ''}`}
                        >
                            <FaHeart />
                        </button>
                    )}
                </div>


                <div className="recipe-meta">
                    <h1>{recipe.title}</h1>
                    <div className="recipe-categories">
                        {recipe.categories?.map(category => (
                            <span key={category} className="category-badge">
           {category}
       </span>
                        ))}
                    </div>
                    <div className="meta-items">
           <span className="meta-item">
             <BsStopwatchFill /> {recipe.time}
           </span>
                        <span className="meta-item">
             <FaUtensils /> {recipe.category || 'Main Course'}
           </span>
                    </div>
                </div>
            </div>


            <div className="recipe-content">
                <div className="ingredients-section">
                    <h2>Ingredients</h2>
                    <ul className="ingredients-list">
                        {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 ? (
                            recipe.ingredients.length === 1
                                ? recipe.ingredients[0].split(',').map((ingredient, index) => (
                                    <li key={index}>{ingredient.trim()}</li>
                                ))
                                : recipe.ingredients.map((ingredient, index) => (
                                    <li key={index}>{ingredient.trim()}</li>
                                ))
                        ) : (
                            <li>No ingredients listed</li>
                        )}
                    </ul>


                </div>

                <div className="instructions-section">
                    <h2>Instructions</h2>
                    <div className="instructions-text">
                        {recipe.instructions.split('\n').map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RecipeDetail;