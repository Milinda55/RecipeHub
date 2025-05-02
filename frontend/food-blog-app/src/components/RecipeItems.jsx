import React, {useContext, useEffect, useState} from 'react';
import {Link, useLoaderData} from "react-router-dom";
import foodImg from '../assets/Food-recipe.png';
import { BsStopwatchFill } from "react-icons/bs";
import { FaHeart } from "react-icons/fa6";
import {FaEdit, FaUtensils} from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import axios from "axios";
import {AuthContext} from "./AuthContext.jsx";

function RecipeItems(props) {

    const recipes=useLoaderData();
    const [allRecipes, setAllRecipes] = useState()
    // const [isLoggedIn, setIsLoggedIn] = useState(false)
    let path = window.location.pathname === "/myRecipe" ? true : false;
    let favItems = JSON.parse(localStorage.getItem("fav")) ?? []
    const [isFavRecipe, setIsFavRecipe] = useState(false)
    // console.log(allRecipes);

    const { isLoggedIn } = useContext(AuthContext);

    useEffect(() => {
        setAllRecipes(recipes);
    }, [recipes]);

    const onDelete=async(id)=> {
        await axios.delete(`http://localhost:5000/recipe/${id}`)
            .then((res)=>console.log(res))
        setAllRecipes(recipes=>recipes.filter(recipe=>recipe._id !== id))
        let filterItem = favItems.filter(recipe => recipe._id !== id)
        localStorage.setItem("fav", JSON.stringify(filterItem))
    }

    const favRecipe = (item) => {
        if (!isLoggedIn) {
            return;
        }

        let filterItem = favItems.filter(recipe => recipe._id !== item._id)
        favItems = favItems.filter(recipe => recipe._id === item._id).length === 0 ? [...favItems, item] : filterItem
        localStorage.setItem("fav", JSON.stringify(favItems))
        setAllRecipes(prev => [...prev])
    }

    const filteredRecipes = path ? allRecipes : isLoggedIn ?
        allRecipes : allRecipes?.filter(recipe => !favItems.some(fav => fav._id === recipe._id))


    return (
        <div className='recipe-grid'>
            {filteredRecipes?.map((item, index) => {
                const isFavourite = favItems.some(res => res._id === item._id);
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