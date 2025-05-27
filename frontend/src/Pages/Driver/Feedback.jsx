import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logo from '../../assets/images/logo.png';

const Feedback = () => {
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [userName, setUserName] = useState("Driver");
    const [userProfilePic, setUserProfilePic] = useState("https://via.placeholder.com/40");
    const [feedback, setFeedback] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
        rating: 0
    });
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const fetchDriverData = async () => {
            try {
                const response = await axios.get('/api/driver/data', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (response.data.user) {
                    setUserName(response.data.user.name || "Driver");
                    setUserProfilePic(response.data.user.profilePic || "https://via.placeholder.com/40");
                }
            } catch (error) {
                console.error("Error fetching driver data:", error);
            }
        };

        fetchDriverData();
    }, []);

    const toggleUserDropdown = () => {
        setIsUserDropdownOpen(!isUserDropdownOpen);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFeedback(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRatingChange = (rating) => {
        setFeedback(prev => ({
            ...prev,
            rating
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Feedback submitted:', feedback);
        setSubmitted(true);
        // Here you would typically send the feedback to your backend
        // axios.post('/api/feedback', feedback, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar - Identical to DriverDashboard */}
            <div className="bg-gray-800 text-white w-64 py-7 px-2 shadow-lg flex flex-col justify-between">
                <div>
                    <div className="flex flex-col items-center mb-6">
                        <img src={logo} alt="PayFine Logo" className="h-12 w-12 rounded-full border-2 border-white mb-2" />
                        <span className="text-2xl font-semibold">
                            <span className="text-white">Pay</span>
                            <span className="text-blue-400">Fine</span>
                        </span>
                    </div>

                    <nav className="space-y-4">
                        <Link to="/DriverDashboard" className="block py-2.5 px-4 rounded bg-purple-800 hover:bg-purple-900 text-center font-bold">Dashboard</Link>
                        <Link to="/DriversPendingFine" className="block py-2.5 px-4 rounded bg-purple-800 hover:bg-purple-900 text-center font-bold">Driver's Pending Fine</Link>
                        <Link to="/DriversPaidFine" className="block py-2.5 px-4 rounded bg-purple-800 hover:bg-purple-900 text-center font-bold">Driver's Paid Fine</Link>
                        <Link to="/DriverProvisionDetails" className="block py-2.5 px-4 rounded bg-purple-800 hover:bg-purple-900 text-center font-bold">Provision Details</Link>
                        <Link to="/Notifications" className="block py-2.5 px-4 rounded bg-purple-800 hover:bg-purple-900 text-center font-bold">Notifications</Link>
                        <Link to="/Feedback" className="block py-2.5 px-4 rounded bg-purple-800 hover:bg-purple-900 text-center font-bold">Feedback</Link>
                    </nav>
                </div>

                <button
                    onClick={() => {
                        localStorage.removeItem('driverToken');
                        localStorage.removeItem('driverLicenseId');
                        window.location.href = '/';
                    }}
                    className="block w-full py-2.5 px-4 rounded transition duration-200 bg-purple-700 text-white hover:bg-purple-800 text-center font-bold"
                >
                    Logout
                </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-auto">
                {/* Header - Identical to DriverDashboard */}
                <header className="bg-purple-900 shadow-sm p-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <span className="text-3xl font-bold">
                            <span className="text-white">Pay</span>
                            <span className="text-blue-400">Fine</span>
                        </span>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="hidden md:flex items-center space-x-6">
                            <Link to="/" className="text-white hover:text-purple-300 transition duration-200">
                                Home
                            </Link>
                            <Link to="/AboutUs" className="text-white hover:text-purple-300 transition duration-200">
                                About Us
                            </Link>
                            <Link to="/ContactUs" className="text-white hover:text-purple-300 transition duration-200">
                                Contact Us
                            </Link>
                            <Link to="/help" className="text-white hover:text-purple-300 transition duration-200">
                                Help
                            </Link>
                        </div>

                        <div className="relative">
                            <button
                                onClick={toggleUserDropdown}
                                className="flex items-center focus:outline-none"
                            >
                                <img
                                    src={userProfilePic}
                                    alt="User Profile"
                                    className="w-10 h-10 rounded-full"
                                />
                                <span className="ml-2 text-white">{userName}</span>
                                <svg
                                    className="w-6 h-6 ml-2 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </button>
                            {isUserDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-slate-400 rounded-md shadow-lg py-1">
                                    <Link
                                        to="/Driverprofile"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-700 hover:text-white"
                                    >
                                        Edit Profile
                                    </Link>
                                    <button
                                        onClick={() => {
                                            localStorage.removeItem('authToken');
                                            window.location.href = '/login';
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-700 hover:text-white"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Feedback Form Content */}
                <main className="flex-1 p-6 bg-gray-300">
                    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
                        <h1 className="text-2xl font-bold text-purple-900 mb-6">Give Us Your Feedback</h1>

                        {submitted ? (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                                <p>Thank you for your feedback! We appreciate your input.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-gray-700 mb-2" htmlFor="name">
                                            Your Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={feedback.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2" htmlFor="email">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={feedback.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-gray-700 mb-2" htmlFor="subject">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={feedback.subject}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                        required
                                    />
                                </div>

                                <div className="mb-6">
                                    <label className="block text-gray-700 mb-2">
                                        Rating
                                    </label>
                                    <div className="flex space-x-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => handleRatingChange(star)}
                                                className={`text-2xl ${feedback.rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-gray-700 mb-2" htmlFor="message">
                                        Your Feedback
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={feedback.message}
                                        onChange={handleChange}
                                        rows="5"
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                        required
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-6 rounded-lg transition duration-200"
                                >
                                    Submit Feedback
                                </button>
                            </form>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Feedback;