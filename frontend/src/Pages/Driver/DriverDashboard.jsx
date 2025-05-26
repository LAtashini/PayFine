import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../../assets/images/logo.png';

const DriverDashboard = () => {
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [userName, setUserName] = useState('User');
    const [userProfilePic, setUserProfilePic] = useState('https://www.w3schools.com/howto/img_avatar.png');
    const [dashboardMetrics, setDashboardMetrics] = useState({
        pendingFineCount: 0,
        pendingFineAmount: 'LKR 0',
        paidFineCount: 0,
        paidFineAmount: 'LKR 0'
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDriverData = async () => {
            const token = localStorage.getItem('driverToken');
            const licenseId = localStorage.getItem('driverLicenseId');

            if (!token || !licenseId) {
                alert('You are not logged in. Please sign in.');
                navigate('/signIn/driver');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:4000/api/driver/dashboard/${licenseId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = response.data;
                setDashboardMetrics({
                    pendingFineCount: data.pendingFineCount || 0,
                    pendingFineAmount: `LKR ${data.pendingFineAmount || 0}`,
                    paidFineCount: data.paidFineCount || 0,
                    paidFineAmount: `LKR ${data.paidFineAmount || 0}`
                });

                if (data.user) {
                    setUserName(data.user.name || 'User');
                    setUserProfilePic(data.user.image || 'https://via.placeholder.com/40');
                }
            } catch (error) {
                console.error('Error fetching driver dashboard data:', error);
                alert('Failed to fetch dashboard data. Please try again.');
            }
        };

        fetchDriverData();
    }, [navigate]);

    const toggleUserDropdown = () => {
        setIsUserDropdownOpen(!isUserDropdownOpen);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
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
                    </nav>
                </div>
                <button
                    onClick={() => {
                        localStorage.removeItem('driverToken');
                        localStorage.removeItem('driverLicenseId');
                        window.location.href = '/';
                    }}
                    className="block w-full py-2.5 px-4 rounded bg-purple-700 hover:bg-purple-800 text-center font-bold"
                >
                    Logout
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-auto">
                {/* Header */}
                <header className="bg-purple-900 shadow-sm p-4 flex justify-between items-center">
                    <div className="text-3xl font-bold text-white">Pay<span className="text-blue-400">Fine</span></div>
                    <div className="relative">
                        <button onClick={toggleUserDropdown} className="flex items-center focus:outline-none">
                            <img
                                src={'https://www.w3schools.com/howto/img_avatar.png'}
                                alt="User Profile"
                                className="w-10 h-10 rounded-full"
                            />
                            <span className="ml-2 text-white">{userName}</span>
                            <svg className="w-6 h-6 ml-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>
                        {isUserDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-slate-400 rounded-md shadow-lg py-1">
                                <Link to="/Driverprofile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-700 hover:text-white">Edit Profile</Link>
                                <button
                                    onClick={() => {
                                        localStorage.removeItem('driverToken');
                                        localStorage.removeItem('driverLicenseId');
                                        window.location.href = '/login';
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-700 hover:text-white"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                {/* Dashboard Metrics */}
                <main className="flex-1 p-6 bg-gray-300">
                    <h1 className="text-2xl font-semibold text-purple-900 mb-6">Driver Dashboard</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <DashboardCard label="Pending Fine Count" value={dashboardMetrics.pendingFineCount} />
                        <DashboardCard label="Pending Fine Amount" value={dashboardMetrics.pendingFineAmount} />
                        <DashboardCard label="Paid Fine Count" value={dashboardMetrics.paidFineCount} />
                        <DashboardCard label="Paid Fine Amount" value={dashboardMetrics.paidFineAmount} />
                    </div>
                </main>
            </div>
        </div>
    );
};

const DashboardCard = ({ label, value }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
        <div className="bg-purple-100 p-3 rounded-full">
            <svg className="w-8 h-8 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
        </div>
        <div className="ml-4">
            <p className="text-gray-600">{label}</p>
            <p className="text-2xl font-bold text-purple-900">{value}</p>
        </div>
    </div>
);

export default DriverDashboard;
