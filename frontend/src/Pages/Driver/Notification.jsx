import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import axios from 'axios';

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const [userName, setUserName] = useState("Driver");
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [name, setName] = useState('Driver');

    useEffect(() => {
        const token = localStorage.getItem('driverToken');
        const licenseId = localStorage.getItem('driverLid');

        if (!token || !licenseId) return;

        const fetchDriverProfile = async () => {
            try {
                const response = await fetch(`http://localhost:4000/api/driver/profile/${licenseId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await response.json();

                if (response.ok) {
                    setName(data.name);
                } else {
                    console.error('Failed to fetch driver profile', data);
                }
            } catch (err) {
                console.error('Error fetching driver profile:', err);
            }
        };

        fetchDriverProfile();
    }, []);

    useEffect(() => {
        const fetchNotifications = async () => {
            const nic = localStorage.getItem('driverNIC');
            const token = localStorage.getItem('driverToken');

            if (!nic || !token) {
                alert("Login required");
                console.log("Missing NIC or token", { nic, token });
                return;
            }

            try {
                console.log("Fetching notifications for NIC:", nic);
                const response = await axios.get(`http://localhost:4000/api/notifications/fetch/${nic}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                console.log("Response from server:", response);
                console.log("Fetched notifications:", response.data);
                setNotifications(response.data || []);
            } catch (err) {
                console.error("Error fetching notifications:", err);
            }
        };


        fetchNotifications();
    }, []);


    const toggleUserDropdown = () => {
        setIsUserDropdownOpen(!isUserDropdownOpen);
    };

    return (
        <div className="flex h-screen bg-gray-100">
        
            <div className="bg-gray-800 text-white w-64 py-7 px-2 shadow-lg flex flex-col justify-between">
                <div>
                    <div className="flex flex-col items-center mb-6">
                        <img src={logo} alt="PayFine Logo" className="h-12 w-12 rounded-full border-2 border-white mb-2" />
                        <span className="text-2xl font-semibold">
                            <span className="text-white">Pay</span><span className="text-blue-400">Fine</span>
                        </span>
                    </div>
                    <nav className="space-y-4">
                        <Link to="/DriverDashboard" className="block py-2.5 px-4 rounded bg-purple-800 hover:bg-purple-900 text-center font-bold">Dashboard</Link>
                        <Link to="/DriversPendingFine" className="block py-2.5 px-4 rounded bg-purple-800 hover:bg-purple-900 text-center font-bold">Driver's Pending Fine</Link>
                        <Link to="/DriversPaidFine" className="block py-2.5 px-4 rounded bg-purple-800 hover:bg-purple-900 text-center font-bold">Driver's Paid Fine</Link>
                        <Link to="/DriverProvisionDetails" className="block py-2.5 px-4 rounded bg-purple-800 hover:bg-purple-900 text-center font-bold">Provision Details</Link>
                        <Link to="/Notifications" className="block py-2.5 px-4 rounded bg-purple-800 hover:bg-purple-900 text-center font-bold">Notifications</Link>
            
                    </nav>
                </div>
                <button onClick={() => { localStorage.clear(); window.location.href = '/'; }} className="block py-2.5 px-4 rounded bg-purple-700 hover:bg-purple-800 text-center font-bold">
                    Logout
                </button>
            </div>

        
            <div className="flex-1 flex flex-col overflow-auto">
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
                                <span className="ml-2 text-white">{name}</span>
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
                <main className="flex-1 p-6 bg-gray-300">
                    <h1 className="text-2xl font-semibold text-purple-900 mb-6">Notifications</h1>

                    {notifications.length === 0 ? (
                        <p className="text-gray-600">No notifications found.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {notifications.map((notif, index) => (
                                <div key={index} className="bg-white p-4 rounded-lg shadow-md border border-purple-500 flex flex-col justify-between h-full">
                                    <div className="space-y-1 mb-4">
                                        <h3 className="text-lg font-bold text-purple-800 break-words">{notif.referenceNo}</h3>
                                        <p className="text-sm text-gray-700"><span className="font-medium">Vehicle Number:</span> {notif.vehicleNumber}</p>
                                        <p className="text-sm text-gray-700"><span className="font-medium">Amount:</span> LKR {notif.amount}</p>
                                        <p className="text-sm text-gray-700"><span className="font-medium">Issued:</span> {new Date(notif.issuedDate).toLocaleDateString()}</p>
                                        {notif.courtDate && (
                                            <p className="text-sm text-gray-700"><span className="font-medium">Court:</span> {new Date(notif.courtDate).toLocaleDateString()}</p>
                                        )}
                                        <p className="text-sm font-semibold text-yellow-600 mt-15">{notif.status.toUpperCase()}</p>
                                    </div>
                            
                                </div>

                            ))}
                        </div>

                    )}
                </main>

            </div>
        </div>
    );
};

export default Notification;
