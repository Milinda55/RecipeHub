import React from 'react';
import NavBar from "./NavBar.jsx";
import {Outlet} from "react-router-dom";
import Footer from "./Footer.jsx";

function MainNavigation(props) {
    return (
        <>
            <NavBar />
            <Outlet />
            <Footer />

        </>
    );
}

export default MainNavigation;