import React from 'react';
import {useLoaderData} from "react-router-dom";
import foodImg from '../assets/Food-recipe.png';
import { BsStopwatchFill } from "react-icons/bs";
import { FaHeart } from "react-icons/fa6";

function RecipeItems(props) {

    const allRecipes=useLoaderData();
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
                                            30mins
                                            <BsStopwatchFill />
                                        </div>
                                        < FaHeart />
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