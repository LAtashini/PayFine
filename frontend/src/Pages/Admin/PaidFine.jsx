import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiDownload } from 'react-icons/fi';
import logo from '../../assets/images/logo.png';

const PaidFine = () => {
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const userName = localStorage.getItem("adminName") || "Admin ";
    const userProfilePic = localStorage.getItem("adminPic") || "https://via.placeholder.com/40";
    const [activeFilter, setActiveFilter] = useState('all');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    // Sample data - replace with API data
    const [fines, setFines] = useState([
        {
            id: 'FN001',
            referenceNo: 'REF-2023-001',
            licenseId: 'B1234567',
            policeId: 'PO001',
            amount: '5000 LKR',
            paidDate: '2023-05-15',
            status: 'paid'
        },
        {
            id: 'FN002',
            referenceNo: 'REF-2023-002',
            licenseId: 'B7654321',
            policeId: 'PO002',
            amount: '3000 LKR',
            paidDate: '2023-05-18',
            status: 'paid'
        },
        {
            id: 'FN003',
            referenceNo: 'REF-2023-003',
            licenseId: 'B9876543',
            policeId: 'PO003',
            amount: '7000 LKR',
            paidDate: '2023-05-20',
            status: 'paid'
        }
    ]);

    const toggleUserDropdown = () => {
        setIsUserDropdownOpen(!isUserDropdownOpen);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/AdminSignUp");
    };

    const handleFilterClick = (filter) => {
        setActiveFilter(filter);
        // Here you would typically fetch data based on the filter
        // For now, we'll just change the active filter state
    };

    const handleSearch = () => {
        // Here you would typically fetch data based on the date range
        // For now, we'll just log the dates
        console.log('Searching from:', fromDate, 'to:', toDate);
    };

    const handleDownload = (fineId) => {
        // Handle download logic for the specific fine
        alert(`Downloading fine ticket ${fineId}`);
    };

    // Filter fines based on active filter (this is simplified - you would typically fetch from API)
    const filteredFines = fines.filter(fine => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'today') return fine.paidDate === new Date().toISOString().split('T')[0];
        // Add more complex filtering for week/month as needed
        return true;
    });

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar - Updated with logo and consistent styling */}
            <div className="bg-gray-800 text-white w-64 py-7 px-2 shadow-lg flex flex-col justify-between">
                <div>
                    {/* Updated Logo Section */}
                    <div className="flex flex-col items-center mb-6">
                        <img src={logo} alt="PayFine Logo" className="h-12 w-12 rounded-full border-2 border-white mb-2" />
                        <span className="text-2xl font-semibold">
                            <span className="text-white">Pay</span>
                            <span className="text-blue-400">Fine</span>
                        </span>
                    </div>

                    <nav className="space-y-2">
                        <Link to="/AdminDashboard" className="block py-2.5 px-4 rounded transition duration-200 bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">
                            Dashboard
                        </Link>
                        <Link to="/AddPolice" className="block py-2.5 px-4 rounded transition duration-200 bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">
                            Add Police Officer
                        </Link>
                        <Link to="/ViewAllPolice" className="block py-2.5 px-4 rounded transition duration-200 bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">
                            View All Officers
                        </Link>
                        <Link to="/ProvisionDetails" className="block py-2.5 px-4 rounded transition duration-200 bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">
                            Provision Details
                        </Link>
                        <Link to="/ViewAllDrivers" className="block py-2.5 px-4 rounded transition duration-200 bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">
                            View All Drivers
                        </Link>
                        <Link to="/PaidFine" className="block py-2.5 px-4 rounded transition duration-200 bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">
                            Paid Fine Tickets
                        </Link>
                        <Link to="/PendingFine" className="block py-2.5 px-4 rounded transition duration-200 bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">
                            Pending Fine Tickets
                        </Link>
                        <Link to="/AllFine" className="block py-2.5 px-4 rounded transition duration-200 bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">
                            All Fine Tickets
                        </Link>
                        <Link to="/Feedback" className="block py-2.5 px-4 rounded transition duration-200 bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">
                            Feedback
                        </Link>
                    </nav>
                </div>

                <button
                    onClick={handleLogout}
                    className="block w-full py-2.5 px-4 rounded transition duration-200 bg-purple-800 text-white hover:bg-purple-900 text-center font-bold"
                >
                    Logout
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header - Updated with user dropdown */}
                <header className="bg-purple-900 shadow-sm p-4 flex justify-between items-center">
                    <div></div>
                    <div className="relative">
                        <button onClick={toggleUserDropdown} className="flex items-center focus:outline-none">
                            <img src={userProfilePic} alt="User" className="w-10 h-10 rounded-full" />
                            <span className="ml-2 text-white">{userName}</span>
                            <svg className="w-6 h-6 ml-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {isUserDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                                <Link to="/AdminProfile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100">
                                    Admin Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-100"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                {/* Body */}
                <main className="flex-1 p-6 bg-gray-100 overflow-auto">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h1 className="text-2xl font-semibold text-blue-800 mb-6">Paid Fine Tickets</h1>

                        {/* Filter Buttons */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            <button
                                onClick={() => handleFilterClick('all')}
                                className={`px-4 py-2 rounded-md ${activeFilter === 'all' ? 'bg-purple-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            >
                                All Fines
                            </button>
                            <button
                                onClick={() => handleFilterClick('today')}
                                className={`px-4 py-2 rounded-md ${activeFilter === 'today' ? 'bg-purple-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            >
                                Today
                            </button>
                            <button
                                onClick={() => handleFilterClick('week')}
                                className={`px-4 py-2 rounded-md ${activeFilter === 'week' ? 'bg-purple-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            >
                                This Week
                            </button>
                            <button
                                onClick={() => handleFilterClick('month')}
                                className={`px-4 py-2 rounded-md ${activeFilter === 'month' ? 'bg-purple-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            >
                                This Month
                            </button>
                        </div>

                        {/* Date Range Search */}
                        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                            <h3 className="text-lg font-medium text-gray-700 mb-3">Search by Date Range</h3>
                            <div className="flex flex-wrap items-center gap-4">
                                <div>
                                    <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700 mb-1">
                                        From Date
                                    </label>
                                    <input
                                        type="date"
                                        id="fromDate"
                                        value={fromDate}
                                        onChange={(e) => setFromDate(e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="toDate" className="block text-sm font-medium text-gray-700 mb-1">
                                        To Date
                                    </label>
                                    <input
                                        type="date"
                                        id="toDate"
                                        value={toDate}
                                        onChange={(e) => setToDate(e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                                <button
                                    onClick={handleSearch}
                                    className="flex items-center justify-center px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-6"
                                >
                                    <FiSearch className="mr-2" />
                                    Search
                                </button>
                            </div>
                        </div>

                        {/* Fines Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference No</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Police ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid Date</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredFines.map((fine) => (
                                        <tr key={fine.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => handleDownload(fine.id)}
                                                    className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100"
                                                    title="Download"
                                                >
                                                    <FiDownload size={18} />
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fine.referenceNo}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fine.licenseId}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fine.policeId}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fine.amount}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fine.paidDate}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PaidFine;