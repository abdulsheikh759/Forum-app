import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../ContextApi/AuthContext";

const Header = () => {
      const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <nav className="bg-[#212121]  border-gray-500 border-b shadow-md absolute w-full z-10 top-0 right-0 left-0">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex h-16 items-center justify-between">

                    {/* LOGO */}
                    <div className="text-xl font-bold text-white cursor-pointer bg-gray-950 p-2 rounded-md ">
                        ForumApp
                    </div>

                    {/* AUTH BUTTONS */}
                    <div className="flex items-center gap-3">
                        {!user && (
                            <div className='flex items-center gap-3'>
                                <Link to={"/login"} className="px-4 py-2 text-sm rounded-md text-white font-bold   cursor-pointer hover:scale-105 hover:bg-blue-600 hover:text-white bg-gray-950">
                                    Login
                                </Link>


                                <Link to={"/signup"} className="px-4 py-2 text-sm rounded-md bg-gray-950  text-white font-bold hover:bg-blue-700 cursor-pointer hover:scale-105">
                                    Signup
                                </Link>
                            </div>
                        )}
                        {/*  LOGGED IN */}
                        {user && (
                            <>
                                <span className="text-sm text-gray-300">
                                    Hi, {user.username}
                                </span>

                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-1 bg-red-600 rounded hover:bg-red-700"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>

                </div>
            </div>
        </nav>
    );
}

export default Header