import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from '../pages/homepage';
import ErrorPage from '../pages/error';
import GenrePage from "../pages/genrepage";
import GamePage from "../pages/gamepage";
import SearchPage from "../pages/searchpage";
import Layout from '../layout/Layout';

export function Routing() {
    return (
        <BrowserRouter>
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/games/:genre" element={<GenrePage />} />
                <Route path="/games/:slug/:id" element={<GamePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="*" element={<ErrorPage />} />
            </Route>
        </Routes>
        </BrowserRouter>
    );
}