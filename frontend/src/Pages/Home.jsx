import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaUserShield, FaUserCog } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import policeLogo from '../assets/images/police.jpeg';
import backgroundImage from '../assets/images/background.jpg'; // Import your background image

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            {/* Main content with background image */}
            <main
                className="flex-grow bg-cover bg-center bg-no-repeat bg-fixed"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            >
                {/* Overlay to improve readability (optional) */}
                <div className="bg-black bg-opacity-50 w-full h-full">
                    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto p-8">
                        {/* Police Logo */}
                        <img
                            src={policeLogo}
                            alt="Police Department Logo"
                            className="h-24 w-24 mb-6 rounded-full border-4 border-white shadow-lg"
                        />

                        {/* Title */}
                        <h1 className="text-4xl font-bold mb-4 text-white text-center">
                            Welcome to <span className="text-white">Pay</span>
                            <span className="text-blue-400">Fine</span>
                        </h1>

                        {/* Description paragraph */}
                        <p className="text-lg text-white text-center mb-6 max-w-2xl">
                            A modern solution for managing and paying traffic fines efficiently.
                            Our system connects drivers, police officers, and administrators
                            in one secure platform.
                        </p>

                        <h2 className="text-xl font-semibold mb-12 text-white">Select Your Role to Sign In</h2>

                        {/* Role cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                            {/* Driver Card */}
                            <div
                                className="flex flex-col items-center justify-center bg-white bg-opacity-90 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:bg-gray-50"
                                onClick={() => navigate('/signIn/driver')}
                            >
                                <div className="bg-purple-100 p-6 rounded-full mb-4">
                                    <FaUser className="text-purple-800 text-4xl" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Driver</h3>
                                <p className="text-gray-600 text-center mb-4">Sign in as a driver to view and pay your fines</p>
                                <button className="bg-purple-800 text-white py-2 px-6 rounded-lg font-medium hover:bg-purple-900 transition duration-300">
                                    Sign In
                                </button>
                            </div>

                            {/* Police Card */}
                            <div
                                className="flex flex-col items-center justify-center bg-white bg-opacity-90 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:bg-gray-50"
                                onClick={() => navigate('/signIn/police')}
                            >
                                <div className="bg-blue-100 p-6 rounded-full mb-4">
                                    <FaUserShield className="text-blue-800 text-4xl" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Police</h3>
                                <p className="text-gray-600 text-center mb-4">Sign in as an officer to issue and manage fines</p>
                                <button className="bg-blue-800 text-white py-2 px-6 rounded-lg font-medium hover:bg-blue-900 transition duration-300">
                                    Sign In
                                </button>
                            </div>

                            {/* Admin Card */}
                            <div
                                className="flex flex-col items-center justify-center bg-white bg-opacity-90 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:bg-gray-50"
                                onClick={() => navigate('/signIn/admin')}
                            >
                                <div className="bg-red-100 p-6 rounded-full mb-4">
                                    <FaUserCog className="text-red-800 text-4xl" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Admin</h3>
                                <p className="text-gray-600 text-center mb-4">Sign in to manage the system and view reports</p>
                                <button className="bg-red-800 text-white py-2 px-6 rounded-lg font-medium hover:bg-red-900 transition duration-300">
                                    Sign In
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Home;