import React from 'react';
import foodRecipe from '../assets/Food-recipe.jpg'

function Home(props) {
    return (
        <section className="home">
            <div className="left">
                <h1>Food Recipe</h1>
                <h5>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus, consequatur cum ea expedita id iure ratione sit! A culpa dignissimos dolore facere porro temporibus? Beatae error iure neque unde voluptatem?</h5>
                <button>Share your recipe</button>
            </div>
            <div className="right">
                <img src={foodRecipe} width="320px" height="300px"/>
            </div>
            <div className="bg">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#d4f6e8" fillOpacity="1" d="M0,160L34.3,170.7C68.6,181,137,203,206,208C274.3,213,343,203,411,176C480,149,549,107,617,117.3C685.7,128,754,192,823,202.7C891.4,213,960,171,1029,149.3C1097.1,128,1166,128,1234,117.3C1302.9,107,1371,85,1406,74.7L1440,64L1440,320L1405.7,320C1371.4,320,1303,320,1234,320C1165.7,320,1097,320,1029,320C960,320,891,320,823,320C754.3,320,686,320,617,320C548.6,320,480,320,411,320C342.9,320,274,320,206,320C137.1,320,69,320,34,320L0,320Z"></path></svg>
            </div>
        </section>
    );
}

export default Home;