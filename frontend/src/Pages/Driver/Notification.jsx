import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logo from '../../assets/images/logo.png';

const Notification = () => {
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [userName, setUserName] = useState("Driver");
    const [userProfilePic, setUserProfilePic] = useState("https://via.placeholder.com/40");
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'new_fine',
            title: 'New Traffic Fine Issued',
            description: 'Speeding violation on Galle Road, Colombo 03 - 75km/h in a 50km/h zone',
            amount: 'LKR 5,000',
            date: '2023-06-15',
            time: '14:30',
            isRead: false,
            fineId: 'FN-2023-00158',
            location: 'Colombo 03',
            vehicle: 'NP-ABC-1234'
        },
        {
            id: 2,
            type: 'reminder',
            title: 'Payment Due Reminder',
            description: 'Your fine is due in 3 days - please pay before June 18 to avoid penalties',
            amount: 'LKR 7,500',
            date: '2023-06-10',
            time: '09:15',
            isRead: true,
            fineId: 'FN-2023-00123',
            location: 'Kandy',
            vehicle: 'NP-XYZ-4567'
        },
        {
            id: 3,
            type: 'payment_confirmed',
            title: 'Payment Received',
            description: 'Your payment has been processed successfully',
            amount: 'LKR 3,000',
            date: '2023-06-05',
            time: '16:45',
            isRead: true,
            fineId: 'FN-2023-00098',
            location: 'Galle',
            vehicle: 'NP-DEF-8910'
        }
    ]);

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

    const markAsRead = (id) => {
        setNotifications(notifications.map(notification =>
            notification.id === id ? { ...notification, isRead: true } : notification
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(notification => ({
            ...notification,
            isRead: true
        })));
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar - Exact match to DriverDashboard */}
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
                        <Link to="/DriverDashboard"
                            className="block py-2.5 px-4 rounded transition duration-200 bg-purple-800 text-white hover:bg-purple-900 text-center font-bold"
                        >
                            Dashboard
                        </Link>
                        <Link to="/DriversPendingFine" className="block py-2.5 px-4 rounded transition duration-200 bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">
                            Driver's Pending Fine
                        </Link>
                        <Link to="/DriversPaidFine" className="block py-2.5 px-4 rounded transition duration-200 bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">
                            Driver's Paid Fine
                        </Link>
                        <Link to="/DriverProvisionDetails" className="block py-2.5 px-4 rounded transition duration-200 bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">
                            Provision Details
                        </Link>
                        <Link to="/Notification" className="block py-2.5 px-4 rounded transition duration-200 bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">
                            Notifications
                        </Link>
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
                {/* Header - Same as Driver Dashboard */}
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
                                    src={'https://www.w3schools.com/howto/img_avatar.png'}
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

                {/* Notification Content */}
                <main className="flex-1 p-6 bg-gray-300">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-purple-900">Notifications</h1>
                        <button
                            onClick={markAllAsRead}
                            className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded transition duration-200"
                        >
                            Mark All as Read
                        </button>
                    </div>

                    <div className="space-y-4">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`bg-white p-5 rounded-lg shadow-md border-l-4 ${notification.isRead ? 'border-gray-300' : 'border-purple-600'}`}
                            >
                                <div className="flex justify-between">
                                    <div className="flex items-start">
                                        <div className={`p-2 rounded-full mr-4 ${notification.type === 'new_fine' ? 'bg-red-100 text-red-600' :
                                            notification.type === 'reminder' ? 'bg-yellow-100 text-yellow-600' :
                                                'bg-green-100 text-green-600'
                                            }`}>
                                            {notification.type === 'new_fine' ? (
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                                                </svg>
                                            ) : notification.type === 'reminder' ? (
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                            ) : (
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                </svg>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className={`text-lg font-semibold ${notification.isRead ? 'text-gray-700' : 'text-purple-900'}`}>
                                                {notification.title}
                                            </h3>
                                            <p className="text-gray-600 mt-1">{notification.description}</p>
                                            <div className="mt-2 flex items-center text-sm text-gray-500">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                </svg>
                                                <span>{notification.date} at {notification.time}</span>
                                                <span className="mx-2">•</span>
                                                <span className="font-medium">{notification.amount}</span>
                                            </div>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                                    Fine ID: {notification.fineId}
                                                </span>
                                                <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                                    Vehicle: {notification.vehicle}
                                                </span>
                                                <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                                    Location: {notification.location}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {!notification.isRead && (
                                        <button
                                            onClick={() => markAsRead(notification.id)}
                                            className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                                        >
                                            Mark as read
                                        </button>
                                    )}
                                </div>
                                {notification.type === 'new_fine' && (
                                    <div className="mt-4 flex space-x-3">
                                        <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition duration-200">
                                            Pay Now
                                        </button>
                                        <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition duration-200">
                                            View Details
                                        </button>
                                        <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition duration-200">
                                            Dispute Fine
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Notification;