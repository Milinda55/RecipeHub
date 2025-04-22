import React, {useState} from 'react';
import Modal from "./Modal.jsx";
import InputForm from "./InputForm.jsx";

function NavBar() {
    const [isOpen,setIsOpen]=useState(false)

    const checkLogin=()=> {
        setIsOpen(true)
    }

    return (
        <>
            <header>
                <h2>Food Blog</h2>
                <ul>
                    <li>Home</li>
                    <li>My Recipe</li>
                    <li>Favourites</li>
                    <li onClick={checkLogin}>Login</li>
                </ul>
            </header>

            { (isOpen) && <Modal onClose={()=>setIsOpen(false)}><InputForm setIsOpen={()=>setIsOpen(false)} /></Modal> }


        </>
    );
}

export default NavBar;