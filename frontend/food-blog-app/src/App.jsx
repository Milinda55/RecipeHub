import React from "react";
import './App.css';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Home from "./pages/Home.jsx";

const router = createBrowserRouter([
    {path:"/",element:<Home/>}
])

function App() {

  return (
    <>
        <RouterProvider router={router}></RouterProvider>
    </>
  )
}

export default App
