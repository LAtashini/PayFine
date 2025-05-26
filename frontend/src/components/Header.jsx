import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';

const Header = () => {
    const navigate = useNavigate();

    return (
        <header className="w-full bg-gray-800 shadow-md">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <div
                    className="flex items-center space-x-3 cursor-pointer"
                    onClick={() => navigate('/')}
                >
                    <img src={logo} alt="PayFine Logo" className="h-12 w-12 rounded-full border-2 border-white" />
                    <span className="text-2xl font-bold">
                        <span className="text-white">Pay</span>
                        <span className="text-blue-400">Fine</span>
                    </span>
                </div>
                <nav className="hidden md:flex space-x-8">
                    <button
                        className="text-gray-300 hover:text-white font-medium transition duration-300"
                        onClick={() => navigate('/')}
                    >
                        Home
                    </button>
                    <button
                        className="text-gray-300 hover:text-white font-medium transition duration-300"
                        onClick={() => navigate('/AboutUs')}
                    >
                        About Us
                    </button>
                    <button
                        className="text-gray-300 hover:text-white font-medium transition duration-300"
                        onClick={() => navigate('/ContactUs')}
                    >
                        Contact Us
                    </button>
                    <button
                        className="text-gray-300 hover:text-white font-medium transition duration-300"
                        onClick={() => navigate('/Help')}
                    >
                        Help
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default Header;