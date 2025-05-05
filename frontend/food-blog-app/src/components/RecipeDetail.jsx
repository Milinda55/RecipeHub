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

    const getDifficulty = (time) => {
        if (!time) return "Easy";

        const timeNumber = typeof time === 'string'
            ? parseInt(time.replace(/\D/g, ''), 10)
            : Number(time);

        if (isNaN(timeNumber)) return "Easy";

        return timeNumber <= 10 ? "Easy" :
            timeNumber <= 20 ? "Medium" : "Hard";
    };

    const difficulty = getDifficulty(recipe.time);


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
                        {(() => {
                            let ingredientsArray = [];

                            if (Array.isArray(recipe.ingredients)) {
                                ingredientsArray = recipe.ingredients.flatMap(item => {
                                    if (Array.isArray(item)) {
                                        return item.flatMap(i =>
                                            typeof i === 'string'
                                                ? i.split('\n').map(line => line.trim())
                                                : [String(i)]
                                        );
                                    }
                                    return typeof item === 'string'
                                        ? item.split('\n').map(line => line.trim())
                                        : [String(item)];
                                });
                            } else if (typeof recipe.ingredients === 'string') {
                                ingredientsArray = recipe.ingredients.includes('\n')
                                    ? recipe.ingredients.split('\n').map(line => line.trim())
                                    : recipe.ingredients.split(',').map(item => item.trim());
                            }

                            return ingredientsArray
                                .flat()
                                .map(item => {
                                    const cleanItem = typeof item === 'string'
                                        ? item.replace(/^\[|\]|"/g, '').trim()
                                        : String(item);
                                    return cleanItem;
                                })
                                .filter(item => item.length > 0)
                                .map((ingredient, index) => (
                                    <li key={index}>{ingredient}</li>
                                ));
                        })()}
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