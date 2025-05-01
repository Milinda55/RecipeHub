import React, {useEffect, useState} from 'react';
import {Link, useLoaderData} from "react-router-dom";
import foodImg from '../assets/Food-recipe.png';
import { BsStopwatchFill } from "react-icons/bs";
import { FaHeart } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import axios from "axios";

function RecipeItems(props) {

    const recipes=useLoaderData();
    const [allRecipes, setAllRecipes] = useState()
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    let path = window.location.pathname === "/myRecipe" ? true : false;
    let favItems = JSON.parse(localStorage.getItem("fav")) ?? []
    const [isFavRecipe, setIsFavRecipe] = useState(false)
    // console.log(allRecipes);

    useEffect(()=> {
        const token = localStorage.getItem("token")
        setIsLoggedIn(!!token)
        setAllRecipes(recipes)
    },[recipes])

    const filteredRecipes = path ? allRecipes : isLoggedIn ?
        allRecipes : allRecipes?.filter(recipe => !favItems.some(fav => fav._id === recipe._id))

    const onDelete=async(id)=> {
        await axios.delete(`http://localhost:5000/recipe/${id}`)
            .then((res)=>console.log(res))
        setAllRecipes(recipes=>recipes.filter(recipe=>recipe._id !== id))
        let filterItem = favItems.filter(recipe => recipe._id !== id)
        localStorage.setItem("fav", JSON.stringify(filterItem))


    }

    const favRecipe = (item) => {
        let filterItem = favItems.filter(recipe => recipe._id !== item._id)
        favItems = favItems.filter(recipe => recipe._id === item._id).length === 0 ? [...favItems, item] : filterItem
        localStorage.setItem("fav", JSON.stringify(favItems))
        setAllRecipes(prev => [...prev])
    }


    return (
        <>
            <div className='card-container'>
                {
                    filteredRecipes?.map((item, index) => {
                        return (
                            <div key={index} className='card'>
                                <img src={`http://localhost:5000/images/${item.coverImage}`} width="120px" height="100px"/>
                                <div className='card-body'>
                                    <div className='title'>{item.title}</div>
                                    <div className='icons'>
                                        <div className='timer'>
                                            <BsStopwatchFill />
                                            {item.time}
                                        </div>
                                        {(!path) ? (<FaHeart onClick={() => favRecipe(item)}
                                                            style={{
                                                                color: (favItems.some(res => res._id === item._id)) ? "red" : "",
                                                                cursor: isLoggedIn ? "pointer" : "not-allowed",
                                                                opacity: isLoggedIn ? 1 : 0.5
                                                            }}
                                                            title={isLoggedIn ? "" : "Login to save favorites"}
                                            />) : (
                                            <div className='action'>
                                                <Link to={`/editRecipe/${item._id}`} className="editIcon">< FaEdit /></Link>
                                                < MdDeleteOutline onClick={()=>onDelete(item._id)} className='deleteIcon' />
                                            </div>)
                                        }

                                    </div>

                                </div>

                            </div>
                        )
                    })
                }
            </div>

        </>
    );
}

export default RecipeItems;