// VAMOS MONTAR NOSSAS ROTAS
import React from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "../pages/Home/Home";
import { ListProductsPage } from "../pages/ListProducts/ListProductsPage";
import { AddProductsPage } from "../pages/AddProducts/AddProductsPage";
import { PageConference } from "../pages/PageConference/PageConference";

export const Rotas = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route path="/underDevelopment" element={<AddProductsPage />}></Route>
                <Route path="/listProducts" element={<ListProductsPage />}></Route>
                <Route path="/conference" element={<PageConference />} />
            </Routes>
        </BrowserRouter>
    )
}