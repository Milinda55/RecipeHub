import React, {useEffect, useState} from 'react';
import Modal from "./Modal.jsx";
import InputForm from "./InputForm.jsx";
import {NavLink} from "react-router-dom";

function NavBar() {
    const [isOpen,setIsOpen]=useState(false)
    let token=localStorage.getItem("token")
    const [isLogin,setIsLogin]=useState(token ? false : true);

    useEffect(()=>{
        setIsLogin(token ? false : true)
    },[token])

    const checkLogin=()=> {

        if(token) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setIsLogin(true);
        }
        else {
            setIsOpen(true)
        }
    }

    return (
        <>
            <header>
                <h2>Food Blog</h2>
                <ul>
                    <li><NavLink to="/">Home</NavLink></li>
                    <li><NavLink to="/myRecipe">My Recipe</NavLink></li>
                    <li><NavLink to="/favRecipe">Favourites</NavLink></li>
                    <li onClick={checkLogin}><p className='login'>{ (isLogin)? "Login" : "Logout" }</p></li>
                </ul>
            </header>

            { (isOpen) && <Modal onClose={()=>setIsOpen(false)}><InputForm setIsOpen={()=>setIsOpen(false)} /></Modal> }


        </>
    );
}

export default NavBar;