import React from 'react';
import {Link, useLoaderData} from "react-router-dom";
import foodImg from '../assets/Food-recipe.png';
import { BsStopwatchFill } from "react-icons/bs";
import { FaHeart } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

function RecipeItems(props) {

    const allRecipes=useLoaderData();
    let path = window.location.pathname === "/myRecipe" ? true : false;
    console.log(allRecipes);
    return (
        <>
            <div className='card-container'>
                {
                    allRecipes?.map((item, index) => {
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
                                        {(!path) ? < FaHeart /> :
                                            <div className='action'>
                                                <Link to={`/editRecipe/${item._id}`} className="editIcon">< FaEdit /></Link>
                                                < MdDeleteOutline className='deleteIcon' />
                                            </div>
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