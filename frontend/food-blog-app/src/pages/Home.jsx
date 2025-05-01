import React, {useState} from 'react';
import foodRecipe from '../assets/Food-recipe.png'
import NavBar from "../components/NavBar.jsx";
import Footer from "../components/Footer.jsx";
import RecipeItems from "../components/RecipeItems.jsx";
import {useNavigate} from "react-router-dom";
import Modal from "../components/Modal.jsx";
import InputForm from "../components/InputForm.jsx";
import heroImage from '../assets/burger.png'; // Replace with your high-quality hero image
// import pattern from '../assets/food-pattern.png'; // Decorative background pattern

function Home(props) {
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)

    const addRecipe=()=> {
        let token = localStorage.getItem("token")
        if (token) {
            navigate("/addRecipe")
        } else {
            setIsOpen(true)
        }
    }

    return (
        <div className="home-container">
            <section className="hero">
                <div className="hero-content">
                    <h1>Discover & Share Amazing Recipes</h1>
                    <p className="hero-subtitle">
                        Join our community of food enthusiasts and explore thousands of delicious recipes
                    </p>
                    <div className="hero-actions">
                        <button className="primary-btn" onClick={addRecipe}>
                            Share Your Recipe
                        </button>
                        <button className="secondary-btn" onClick={() => document.querySelector('.featured-recipes').scrollIntoView({ behavior: 'smooth' })}>
                            Browse Recipes
                        </button>
                    </div>
                </div>
                <div className="hero-image">
                    <img src={heroImage} alt="Foods" />
                </div>
            </section>

            <section className="categories">
                <h2>Popular Categories</h2>
                <div className="category-grid">
                    {['Breakfast', 'Lunch', 'Dinner', 'Desserts', 'Fast Food', 'Pizza', 'Kottu', 'Burgers', 'Snacks', 'Smoothies'].map((category) => (
                        <div key={category} className="category-card">
                            <div className="category-image">
                                <img src={`/categories/${category.toLowerCase()}.png`} alt={category} />
                            </div>
                            <h3>{category}</h3>
                        </div>
                    ))}
                </div>
            </section>

            <section className="featured-recipes">
                <div className="section-header">
                    <h2>Trending Recipes</h2>
                    <div className="view-all" onClick={() => navigate('/recipes')}>View All →</div>
                </div>
                <RecipeItems />
            </section>

            <section className="newsletter">
                <div className="newsletter-content">
                    <h2>Get Weekly Recipe Inspiration</h2>
                    <p>Sign up for our newsletter and receive the best recipes directly to your inbox</p>
                    <form className="newsletter-form">
                        <input type="email" placeholder="Your email address" required />
                        <button type="submit" className="primary-btn">Subscribe</button>
                    </form>
                </div>
            </section>

            {isOpen && (
                <Modal onClose={() => setIsOpen(false)}>
                    <InputForm setIsOpen={() => setIsOpen(false)} />
                </Modal>
            )}
        </div>
    );
}

export default Home;