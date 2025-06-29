import { useContext } from "react";
import SessionContext from "../context/SessionContext";
import SearchButton from "./SearchButton";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import supabase from "../supabase/supabase-client";

export default function Header() {
    const navigate = useNavigate();
    const { session } = useContext(SessionContext);

    // const getSession = async () => {
    //     const { data } = await supabase.auth.getSession();
    //     if (data.session) {
    //         console.log(data);
    //         setSession(data);                
    //         } else {
    //             setSession(null)
    //         }
    // }

    const signOut = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) console.log(error);
        alert('Signed out');
        // getSession();
        navigate("/");
    }

    // useEffect(() => {
    //     getSession();
    // }, []);

    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /> </svg>
                    </div>
                {!session ? (
                    <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        <li><Link to="/register" className="secondary"> Register </Link></li>
                        <li><Link to="/login" className="secondary"> Login </Link></li>
                    </ul>
                ) : (
                    <ul className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        <li>
                            <summary>Hey <Link to="/profile">{session?.user.user_metadata.first_name}</Link> </summary>
                        </li>
                        <li>
                            <Link to="/account">Account</Link>
                        </li>
                        <li><button onClick={signOut}>Logout</button></li>
                    </ul>
                )}
            </div>
        </div>
            <div className="navbar-center">
                <Link to="/" className="text-xl">VAULT</Link>
                {/* <a className="btn btn-ghost text-xl">VAULT</a> */}
            </div>
        <div className="navbar-end">
                {/* bottone di ricerca */}
                <SearchButton />
            <button className="btn btn-ghost btn-circle">
                <div className="indicator">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">      
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /> 
                    </svg>
                    <span className="badge badge-xs badge-primary indicator-item"></span>
                </div>
            </button>
        </div>
        </div>
    );
}