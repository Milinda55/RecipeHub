import React, {useContext, useEffect, useState} from 'react';
import {Link, useLoaderData, useLocation, useNavigate} from "react-router-dom";
import foodImg from '../assets/Food-recipe.png';
import { BsStopwatchFill } from "react-icons/bs";
import { FaHeart } from "react-icons/fa6";
import {FaEdit, FaUtensils} from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import axios from "axios";
import {AuthContext} from "./AuthContext.jsx";


function RecipeItems({category}) {


    const recipes=useLoaderData();
    const [allRecipes, setAllRecipes] = useState([])
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    // const [isLoggedIn, setIsLoggedIn] = useState(false)
    const { isLoggedIn, user } = useContext(AuthContext);
    let path = window.location.pathname === "/myRecipe" ? true : false;
    // let favItem = JSON.parse(localStorage.getItem("fav")) ?? []
    const [favItems, setFavItems] = useState(JSON.parse(localStorage.getItem("fav")) || []);
    const [forceUpdate, setForceUpdate] = useState(0);
    // console.log(allRecipes);


    useEffect(() => {
        setAllRecipes(Array.isArray(recipes) ? recipes : []);
    }, [recipes]);


    useEffect(() => {
        const storedFavs = JSON.parse(localStorage.getItem("fav")) || [];
        setFavItems(storedFavs);
    }, [forceUpdate]);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await axios.get("http://localhost:5000/recipe");
                setAllRecipes(response.data);
            } catch (error) {
                console.error("Error fetching recipes:", error);
            }
        };
        fetchRecipes();
    }, []);

    useEffect(() => {
        if (category) {
            const filtered = allRecipes.filter(recipe =>
                recipe.categories?.some(cat =>
                    cat.toLowerCase() === category.toLowerCase()
                )
            );
            setFilteredRecipes(filtered);
        } else {
            setFilteredRecipes(allRecipes);
        }
    }, [allRecipes, category]);

    if (category && filteredRecipes.length === 0) {
        return <div className="no-recipes">No recipes found in this category</div>;
    }


    const onDelete = async(id) => {

        if (!window.confirm("Are you sure you want to delete this recipe?")) return;

        try {
            await axios.delete(`http://localhost:5000/recipe/${id}`, {
                headers: {
                    'authorization': 'bearer ' + localStorage.getItem("token")
                }
            });
            setAllRecipes(prev => prev.filter(recipe => recipe._id !== id));
            const updatedFavs = favItems.filter(recipe => recipe._id !== id);
            localStorage.setItem("fav", JSON.stringify(updatedFavs));
            setFavItems(updatedFavs);
        } catch (error) {
            console.error("Error deleting recipe:", error);
        }
    };


    const favRecipe = (item) => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }


        const isFavorited = favItems.some(fav => fav._id === item._id);
        const updatedFavs = isFavorited
            ? favItems.filter(recipe => recipe._id !== item._id)
            : [...favItems, item];
        localStorage.setItem("fav", JSON.stringify(updatedFavs))
        setFavItems(updatedFavs);
        setForceUpdate(prev => prev + 1);
    }


    const getFilteredRecipes = () => {
        if (!isLoggedIn) return [];


        switch(location.pathname) {
            case "/myRecipe/":
                return allRecipes
                    .filter(recipe => recipe._id === user?._id)
                    .sort((a, b) => a.title.localeCompare(b.title));
            case "/favRecipe/":
                return allRecipes
                    .filter(recipe => favItems.some(fav => fav._id === recipe._id))
                    .sort((a, b) => a.title.localeCompare(b.title));
            default:
                return [...allRecipes].sort((a, b) => a.title.localeCompare(b.title));
        }
    };



    if (recipes === undefined) {
        return <div className="loading">Loading recipes...</div>;
    }




    if (filteredRecipes.length === 0) {
        return (
            <div className="empty-state">
                {!isLoggedIn ? "Please log in to view recipes" :
                    location.pathname === "/myRecipe" ? "You haven't added any recipes yet" :
                        location.pathname === "/favRecipe" ? "No favorite recipes yet" :
                            "No recipes available"}
            </div>
        );
    }


    // const filteredRecipes = path ? allRecipes : isLoggedIn ?
    //     allRecipes : allRecipes?.filter(recipe => !favItem.some(fav => fav._id === recipe._id))




    return (
        <div className='recipe-grid'>
            {filteredRecipes?.map((item, index) => {
                const isFavourite = favItems.some(fav => fav._id === item._id);
                const getDifficulty = (time) => {
                    if (!time) return "Easy";


                    const timeNumber = typeof time === 'string'
                        ? parseInt(time.replace(/\D/g, ''), 10)
                        : Number(time);


                    if (isNaN(timeNumber)) return "Easy";


                    return timeNumber <= 10 ? "Easy" :
                        timeNumber <= 20 ? "Medium" : "Hard";
                };


                const difficulty = getDifficulty(item.time);




                return (
                    <div key={index} className='recipe-card'>
                        <div className='card-image-container'>
                            <img
                                src={`http://localhost:5000/images/${item.coverImage}`}
                                alt={item.title}
                                className='card-image'
                            />
                            <div className='card-badge'>{difficulty}</div>
                            <button
                                className={`favorite-btn ${isFavourite ? 'active' : ''}`}
                                onClick={() => isLoggedIn ? favRecipe(item) : setIsOpen(true)}
                                aria-label={isFavourite ? 'Remove from favorites' : 'Add to favorites'}
                            >
                                <FaHeart />
                            </button>
                        </div>


                        <div className="recipe-categories">
                            {item.categories?.map(category => (
                                <span key={category} className="category-badge">
           {category}
       </span>
                            ))}
                        </div>


                        <div className='card-content'>
                            <h3 className='card-title'>{item.title}</h3>
                            <div className='card-meta'>
                           <span className='meta-item'>
                               <BsStopwatchFill className='meta-icon' />
                               {item.time}
                           </span>
                                <span className='meta-item'>
                               <FaUtensils className='meta-icon' />
                                    {item.category || 'Main Course'}
                           </span>
                            </div>
                            <p className='card-description'>
                                {item.instructions || 'A delicious recipe you must try!'}
                            </p>
                            <div className='card-actions'>
                                <Link to={`/recipe/${item._id}`} className='view-btn'>
                                    View Recipe
                                </Link>
                                {path && (
                                    <div className='admin-actions'>
                                        <Link to={`/editRecipe/${item._id}`} className='edit-btn'>
                                            <FaEdit />
                                        </Link>
                                        <button
                                            onClick={() => onDelete(item._id)}
                                            className='delete-btn'
                                            aria-label='Delete recipe'
                                        >
                                            <MdDeleteOutline />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}


export default RecipeItems;
