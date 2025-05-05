import React, {useState, useContext, useEffect} from 'react';
import Modal from "./Modal.jsx";
import InputForm from "./InputForm.jsx";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from './AuthContext.jsx';
import logo from '../assets/recipe-hub-logo.png';

function NavBar() {
    const [isOpen, setIsOpen] = useState(false);
    const {isLoggedIn, user, logout} = useContext(AuthContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:5000/recipe/categories');
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
                setCategories([
                    'breakfast', 'lunch', 'dinner', 'dessert',
                    'fast-food', 'pizza', 'kottu', 'burgers',
                    'snacks', 'smoothies', 'salads', 'beverages'
                ]);
            }
        };
        fetchCategories();
    }, []);

    const handleAuthClick = () => {
        if (isLoggedIn) {
            logout();
            navigate('/');
        } else {
            setIsOpen(true);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
        }
    };

    const handleCategorySelect = (category) => {
        navigate(`/category/${category}`);
        setShowDropdown(false);
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
                        <img src={logo} alt="logo" className="logo" onClick={() => navigate('/')} style={{cursor: 'pointer'}} />
                    </div>

                    <div className="search-container">
                        <form className="search-bar" onSubmit={handleSearch}>
                            <input
                                type="text"
                                placeholder="Search recipes..."
                                className="search-input"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit" className="search-button">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                                </svg>
                            </button>
                        </form>
                    </div>

                    <nav className="nav-links">
                        <ul>
                            <li>
                                <NavLink
                                    to="/"
                                    className={({isActive}) => isActive ? "active" : ""}
                                    onClick={(e) => {
                                        if (!isLoggedIn) {
                                            e.preventDefault();
                                            handleAuthClick();
                                        }
                                    }}
                                >
                                    Home
                                </NavLink>
                            </li>

                            <li className="dropdown-container">
                                <div
                                    className="dropdown-toggle"
                                    onClick={() => setShowDropdown(!showDropdown)}
                                >
                                    All Recipes
                                    <span className={`dropdown-arrow ${showDropdown ? 'open' : ''}`}>▼</span>
                                </div>
                                {showDropdown && (
                                    <div className="dropdown-menu">
                                        <div
                                            className="dropdown-item"
                                            onClick={() => {
                                                navigate('/all-recipes');
                                                setShowDropdown(false);
                                            }}
                                        >
                                            All Recipes
                                        </div>
                                        <div className="dropdown-divider"></div>
                                        {categories.map(category => (
                                            <div
                                                key={category}
                                                className="dropdown-item"
                                                onClick={() => handleCategorySelect(category)}
                                            >
                                                {category.charAt(0).toUpperCase() + category.slice(1)}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </li>

                            <li>
                                <NavLink
                                    to={isLoggedIn ? "/myRecipe" : "#"}
                                    className={({isActive}) => isActive ? "active" : ""}
                                    onClick={(e) => !isLoggedIn && handleAuthClick()}
                                >
                                    My Recipes
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to={isLoggedIn ? "/favRecipe" : "#"}
                                    className={({isActive}) => isActive ? "active" : ""}
                                    onClick={(e) => !isLoggedIn && handleAuthClick()}
                                >
                                    Favourites
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