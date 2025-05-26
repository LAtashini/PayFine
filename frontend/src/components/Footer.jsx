import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate();

    return (
        <footer className="w-full bg-gray-800 text-white py-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        {/* Updated logo with white "Pay" and blue "Fine" */}
                        <div className="flex items-center">
                            <h3 className="text-2xl font-bold text-white">Pay</h3>
                            <h3 className="text-2xl font-bold text-blue-400">Fine</h3>
                        </div>
                        <p className="text-gray-400 mt-2">Simplifying fine management</p>

                        {/* Contact information from your image */}
                        <div className="mt-4 text-gray-300 space-y-1">
                            <div className="flex items-center">
                                <span className="mr-2">📞</span>
                                <span>+94714589202</span>
                            </div>
                            <div className="flex items-center">
                                <span className="mr-2">✉️</span>
                                <span>PayFine@gmail.com</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8 text-center">
                        <button
                            className="text-gray-300 hover:text-white transition duration-300"
                            onClick={() => navigate('/')}
                        >
                            Home
                        </button>
                        <button
                            className="text-gray-300 hover:text-white transition duration-300"
                            onClick={() => navigate('/AboutUs')}
                        >
                            About Us
                        </button>
                        <button
                            className="text-gray-300 hover:text-white transition duration-300"
                            onClick={() => navigate('/ContactUs')}
                        >
                            Contact Us
                        </button>
                        <button
                            className="text-gray-300 hover:text-white transition duration-300"
                            onClick={() => navigate('/Help')}
                        >
                            Help
                        </button>
                        <button
                            className="text-gray-300 hover:text-white transition duration-300"
                            onClick={() => navigate('/privacy')}
                        >
                            Privacy Policy
                        </button>
                    </div>
                </div>
                <div className="border-t border-gray-700 mt-6 pt-6 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} PayFine System. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;