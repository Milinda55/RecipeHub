import React from "react";
import './App.css';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Home from "./pages/Home.jsx";
import MainNavigation from "./components/MainNavigation.jsx";
import axios from "axios";
import AddFoodRecipe from "./pages/AddFoodRecipe.jsx";
import EditRecipe from "./pages/EditRecipe.jsx";
import { AuthProvider } from './components/AuthContext.jsx';
import RecipeDetail from "./components/RecipeDetail.jsx";

const getAllRecipes = async() => {
    let allRecipes=[];
    await axios.get(`${import.meta.env.VITE_API_BASE_URL}/recipe`).then(res=>{
        allRecipes=res.data
    })
    return allRecipes
}

const getMyRecipe = async()=> {
    let user = JSON.parse(localStorage.getItem("user"))
    let allRecipes = await getAllRecipes()
    return allRecipes.filter(item=>item.createdBy===user._id)
}

const getFavRecipes=()=> {
    return JSON.parse(localStorage.getItem("fav"))
}

const router = createBrowserRouter([

    {path:"/",element:<MainNavigation/>,children:[
            {path:"/",element:<Home/>, loader:getAllRecipes},
            {path:"/myRecipe", element:<Home />, loader:getMyRecipe},
            {path:"/favRecipe", element:<Home />, loader:getFavRecipes},
            {path:"/addRecipe", element:<AddFoodRecipe />},
            {path:"/editRecipe/:id", element:<EditRecipe />},
            { path: "/editRecipe/:id", element: <EditRecipe /> },
            {
                path: "/recipe/:id",
                element: <RecipeDetail/>,
                loader: async ({params}) => {
                    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/recipe/${params.id}`);
                    return response.data;
                }
            },
            { path: "/all-recipes", element: <Home showAllRecipes={true} /> }
        ]},

])

function App() {

  return (
    <AuthProvider>
        <RouterProvider router={router}></RouterProvider>
    </AuthProvider>
  )
}

export default App
