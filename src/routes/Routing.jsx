import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from '../pages/homepage';
import ErrorPage from '../pages/error';
import GenrePage from "../pages/genrepage";
import GamePage from "../pages/gamepage";
import SearchPage from "../pages/searchpage";
import Layout from '../layout/Layout';
import RegisterPage from "../pages/register";
import LoginPage from "../pages/login";
import AccountPage from "../pages/account";
import ProfilePage from "../pages/profile";
import LayoutWithoutSidebar from "../layout/LayoutWithoutSidebar";

export function Routing() {
    return (
        <BrowserRouter>
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/games/:genre" element={<GenrePage />} />
                <Route path="/games/:slug/:id" element={<GamePage />} />
                <Route path="/search" element={<SearchPage />} />
            </Route>

            <Route element={<LayoutWithoutSidebar />}>
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="*" element={<ErrorPage />} />
            </Route>
        </Routes>
        </BrowserRouter>
    );
}