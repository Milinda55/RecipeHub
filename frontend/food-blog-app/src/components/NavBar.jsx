import React, { useState, useContext } from 'react';
import Modal from "./Modal.jsx";
import InputForm from "./InputForm.jsx";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from './AuthContext.jsx';
import logo from '../assets/recipe-hub-logo.png';

function NavBar() {
    const [isOpen, setIsOpen] = useState(false);
    const { isLoggedIn, user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleAuthClick = () => {
        if (isLoggedIn) {
            logout();
            navigate('/');
        } else {
            setIsOpen(true);
        }
    };

    const handleProtectedNavClick = (path) => {
        if (!isLoggedIn) {
            setIsOpen(true);
        } else {
            navigate(path);
        }
    };

    return (
        <>
            <header>
                <img src={logo} alt="logo"/>
                <ul>
                    <li><NavLink to="/">Home</NavLink></li>
                    <li onClick={() => handleProtectedNavClick("/myRecipe")}>
                        <NavLink to={isLoggedIn ? "/myRecipe" : "#"}>My Recipe</NavLink>
                    </li>
                    <li onClick={() => handleProtectedNavClick("/favRecipe")}>
                        <NavLink to={isLoggedIn ? "/favRecipe" : "#"}>Favorites</NavLink>
                    </li>
                    <li onClick={handleAuthClick}>
                        <p className='login'>
                            {isLoggedIn ? `Logout (${user?.email})` : "Login"}
                        </p>
                    </li>
                </ul>
            </header>

            {isOpen && (
                <Modal onClose={() => setIsOpen(false)}>
                    <InputForm setIsOpen={() => setIsOpen(false)} />
                </Modal>
            )}
        </>
    );
}

export default NavBar;