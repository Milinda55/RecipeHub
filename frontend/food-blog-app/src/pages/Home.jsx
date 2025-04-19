import React from 'react';
import foodRecipe from '../assets/Food-recipe.png'
import NavBar from "../components/NavBar.jsx";
import Footer from "../components/Footer.jsx";

function Home(props) {
    return (
        <>
            <NavBar />
            <section className="home">
                <div className="left">
                    <h1>Food Recipe</h1>
                    <h5>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus, consequatur cum ea expedita id iure ratione sit! A culpa dignissimos dolore facere porro temporibus? Beatae error iure neque unde voluptatem?</h5>
                    <button>Share your recipe</button>
                </div>
                <div className="right">
                    <img src={foodRecipe} width="320px" height="300px"/>
                </div>
            </section>
        <div className='bg'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#d4f6e8" fillOpacity="1" d="M0,256L48,229.3C96,203,192,149,288,149.3C384,149,480,203,576,218.7C672,235,768,213,864,202.7C960,192,1056,192,1152,202.7C1248,213,1344,235,1392,245.3L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
        </div>
        <Footer />

        </>
    );
}

export default Home;