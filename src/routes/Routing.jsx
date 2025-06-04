import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from '../pages/homepage';
import ErrorPage from '../pages/error';
import GenrePage from "../pages/genrepage";
import Layout from '../layout/Layout';

export function Routing() {
    return (
        <BrowserRouter>
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/games/:genre" element={<GenrePage />} />
                <Route path="*" element={<ErrorPage />} />
            </Route>
        </Routes>
        </BrowserRouter>
    );
}