import React, {useEffect, useState} from 'react';
import foodRecipe from '../assets/Food-recipe.png'
import NavBar from "../components/NavBar.jsx";
import Footer from "../components/Footer.jsx";
import RecipeItems from "../components/RecipeItems.jsx";
import {useNavigate} from "react-router-dom";
import Modal from "../components/Modal.jsx";
import InputForm from "../components/InputForm.jsx";
import heroImage from '../assets/burger.png';
import pattern from '../assets/food-pattern.png';

import heroImage1 from '../assets/hero-img/hero1.png';
import heroImage2 from '../assets/hero-img/hero2.png';
import heroImage3 from '../assets/hero-img/hero3.png';
import heroImage4 from '../assets/hero-img/hero4.png';
import heroImage5 from '../assets/hero-img/hero5.png';



function Home(props) {
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)
    const [currentSlide, setCurrentSlide] = useState(0);
    const heroImages = [heroImage1, heroImage2, heroImage3, heroImage4, heroImage5];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroImages.length);
        }, 3000); // Change slide every 3 seconds

        return () => clearInterval(interval);
    }, [heroImages.length]);

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

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

                <div className="hero-image-container">
                    <div className="hero-slider">
                        {heroImages.map((image, index) => (
                            <div
                                key={index}
                                className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
                            >
                                <img src={image} alt={`Delicious food ${index + 1}`} />
                            </div>
                        ))}
                    </div>
                    <div className="slider-dots">
                        {heroImages.map((_, index) => (
                            <button
                                key={index}
                                className={`dot ${index === currentSlide ? 'active' : ''}`}
                                onClick={() => goToSlide(index)}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
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
                    <div className="view-all" onClick={() => document.querySelector('.featured-recipes').scrollIntoView({ behavior: 'smooth' })}>View All →</div>
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