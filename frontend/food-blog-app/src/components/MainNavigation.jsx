import React, {useState} from 'react';
import NavBar from "./NavBar.jsx";
import {Outlet} from "react-router-dom";
import Footer from "./Footer.jsx";

function MainNavigation(props) {

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredTitles, setFilteredTitles] = useState([]);


    const handleSearch = (term) => {
        setSearchTerm(term);

        const allTitles = document.querySelectorAll('.recipe-card h3');
        const matches = [];

        allTitles.forEach((el) => {
            const text = el.textContent.toLowerCase();
            const card = el.closest('.recipe-card');

            if (text.includes(term)) {
                matches.push(card);
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });

        const section = document.querySelector('.featured-recipes');
        section?.scrollIntoView({ behavior: 'smooth' });

        if (matches.length === 0) {
            setFilteredTitles([]); // no matches
        } else {
            setFilteredTitles(matches); // just to track state
        }
    };

    return (
        <>
            <NavBar onSearch={handleSearch} />
            <Outlet />
            <Footer />

        </>
    );
}

export default MainNavigation;