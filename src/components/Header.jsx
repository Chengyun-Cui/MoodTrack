import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    
    useEffect(() => {
        const logged = true; // test:true delete later
        // const logged = localStorage.getItem("isLoggedIn") === "true"; 
        setIsLoggedIn(logged);
    }, [location]);
    
    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        setIsLoggedIn(false);
        navigate("/auth");
    };
    
    const isAuthPage = location.pathname === "/auth";
    
    return (
        <header className="w-full bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            MoodTrack
                        </h1>

                        {isAuthPage && (
                            <span className="ml-3 text-sm text-gray-500">Welcome</span>
                        )}
                    </div>
                    
                    {!isAuthPage && isLoggedIn && (
                        <nav className="hidden sm:flex space-x-8">
                            <Link 
                                to="/home" 
                                className={`text-sm font-medium transition-colors ${
                                    location.pathname === '/home' 
                                        ? 'text-blue-600 font-bold border-b-2 border-blue-600 pb-1' 
                                        : 'text-gray-700 hover:text-blue-600'
                                }`}
                                style={{ textDecoration: 'none' }}
                            >
                                Home
                            </Link>
                            <Link 
                                to="/trends" 
                                className={`text-sm font-medium transition-colors ${
                                    location.pathname === '/trends' 
                                        ? 'text-blue-600 font-bold border-b-2 border-blue-600 pb-1' 
                                        : 'text-gray-700 hover:text-blue-600'
                                }`}
                                style={{ textDecoration: 'none' }}
                            >
                                Trends
                            </Link>
                        </nav>
                    )}
                    
                    {!isAuthPage && isLoggedIn && (
                        <button 
                            onClick={handleLogout}
                            className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors px-4 py-2 rounded-md hover:bg-red-50"
                        >
                            Logout
                        </button>
                    )}
                    
                    {(isAuthPage || !isLoggedIn) && (
                        <div className="w-20"></div>
                    )}
                </div>
                
                {!isAuthPage && isLoggedIn && (
                    <nav className="sm:hidden pb-3 flex justify-center space-x-6">
                        <Link 
                            to="/home" 
                            className={`text-sm ${
                                location.pathname === '/home' 
                                    ? 'text-blue-600 font-bold' 
                                    : 'text-gray-700'
                            }`}
                            style={{ textDecoration: 'none' }}
                        >
                            Home
                        </Link>
                        <Link 
                            to="/trends" 
                            className={`text-sm ${
                                location.pathname === '/trends' 
                                    ? 'text-blue-600 font-bold' 
                                    : 'text-gray-700'
                            }`}
                            style={{ textDecoration: 'none' }}
                        >
                            Trends
                        </Link>
                        <button 
                            onClick={handleLogout}
                            className="text-sm font-medium text-red-600"
                        >
                            Logout
                        </button>
                    </nav>
                )}
            </div>
        </header>
    );
}