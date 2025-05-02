import React, { useState, useContext } from 'react';
import Modal from "./Modal.jsx";
import InputForm from "./InputForm.jsx";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from './AuthContext.jsx';
import logo from '../assets/recipe-hub-logo.png';

function NavBar() {
    const [isOpen, setIsOpen] = useState(false);
    const {isLoggedIn, user, logout} = useContext(AuthContext);
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
                <div className="header-container">

                    <div className="logo-container">
                        <img src={logo} alt="logo" className="logo"/>
                    </div>

                    {/* Search Bar - Centered */}
                    <div className="search-container">
                        <div className="search-bar">
                            <input
                                type="text"
                                placeholder="Search recipes..."
                                className="search-input"
                            />
                            <button className="search-button">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     viewBox="0 0 16 16">
                                    <path
                                        d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <nav className="nav-links">
                        <ul>
                            <li>
                                <NavLink to="/" className={({isActive}) => isActive ? "active" : ""}>Home</NavLink>
                            </li>
                            <li onClick={() => handleProtectedNavClick("/myRecipe")}>
                                <NavLink
                                    to={isLoggedIn ? "/myRecipe" : "#"}
                                    className={({isActive}) => isActive ? "active" : ""}
                                >
                                    Recipes
                                </NavLink>
                            </li>
                            <li onClick={() => handleProtectedNavClick("/favRecipe")}>
                                <NavLink
                                    to={isLoggedIn ? "/favRecipe" : "#"}
                                    className={({isActive}) => isActive ? "active" : ""}
                                >
                                    Favorites
                                </NavLink>
                            </li>
                            <li onClick={handleAuthClick} className="auth-item">
                                <p className='auth-button'>
                                    {isLoggedIn ? (
                                        <>
                                            <span className="user-email">{user?.email}</span>
                                            <span className="logout-text">Logout</span>
                                        </>
                                    ) : "Login"}
                                </p>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>

            {isOpen && (
                <Modal onClose={() => setIsOpen(false)}>
                    <InputForm setIsOpen={() => setIsOpen(false)}/>
                </Modal>
            )}
        </>
    );
}

export default NavBar;