import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import logo from '../../assets/images/logo.png';
import jsPDF from 'jspdf';
import "jspdf-autotable";

const DriversPaidFine = () => {
    const [paidFines, setPaidFines] = useState([]);
    const [filteredFines, setFilteredFines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [filter, setFilter] = useState('all');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const userName = "John Doe";
    const userProfilePic = "https://via.placeholder.com/40";
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
        const fetchPaidFines = async () => {
            const token = localStorage.getItem('driverToken');
            const licenseId = localStorage.getItem('driverLid');

            if (!token || !licenseId) {
                alert('You are not logged in. Please sign in.');
                navigate('/signIn/driver');
                return;
            }

            try {
                const response = await fetch(`http://localhost:4000/api/driver/paid/${licenseId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await response.json();

                if (response.ok) {
                    setPaidFines(data);
                    setFilteredFines(data);
                } else {
                    console.error('Error fetching paid fines:', data);
                    setError(data.message || 'Failed to load paid fines');
                }
            } catch (err) {
                console.error('Error fetching paid fines:', err);
                setError(err.message || 'Server error. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchPaidFines();
    }, []);


    // Apply filters
    useEffect(() => {
        let filtered = [...paidFines];

        // Time period filter
        const now = new Date();
        switch (filter) {
            case 'today':
                filtered = filtered.filter(fine => {
                    const paidDate = new Date(fine.paidDate);
                    return paidDate.toDateString() === now.toDateString();
                });
                break;
            case 'week':
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - now.getDay());
                filtered = filtered.filter(fine => {
                    const paidDate = new Date(fine.paidDate);
                    return paidDate >= startOfWeek;
                });
                break;
            case 'month':
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                filtered = filtered.filter(fine => {
                    const paidDate = new Date(fine.paidDate);
                    return paidDate >= startOfMonth;
                });
                break;
            default:
                // 'all' - no time filter
                break;
        }

        // Date range filter
        if (startDate && endDate) {
            filtered = filtered.filter(fine => {
                const paidDate = new Date(fine.paidDate);
                return paidDate >= startDate && paidDate <= endDate;
            });
        }

        setFilteredFines(filtered);
    }, [paidFines, filter, startDate, endDate]);

    const handleSearch = () => {
        // The useEffect above will handle the filtering automatically
        console.log('Searching with current filters');
    };

    const handleReset = () => {
        setFilter('all');
        setStartDate(null);
        setEndDate(null);
    };

    const toggleUserDropdown = () => {
        setIsUserDropdownOpen(!isUserDropdownOpen);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-800"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-red-500 text-center">
                    <p className="text-xl font-semibold">Error loading paid fines</p>
                    <p className="mt-2">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }


    const generateReceipt = (fine) => {
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text('Fine Payment Receipt', 105, 20, null, null, 'center');

        doc.setFontSize(12);
        doc.text(`Reference No: ${fine.referenceNo}`, 20, 40);
        doc.text(`Provision: ${fine.provision}`, 20, 50);
        doc.text(`Vehicle Number: ${fine.vehicleNo}`, 20, 60);
        doc.text(`Issued Date: ${new Date(fine.issuedDate).toLocaleDateString()}`, 20, 70);
        doc.text(`Paid Date: ${fine.paidDate ? new Date(fine.paidDate).toLocaleDateString() : 'N/A'}`, 20, 80);
        doc.text(`Amount Paid (LKR): ${fine.amount.toFixed(2)}`, 20, 90);

        doc.text('Thank you for your payment!', 20, 110);

        doc.save(`FineReceipt-${fine.referenceNo}.pdf`);
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
                        <Link to="/DriverDashboard" className="block py-2.5 px-4 rounded transition duration-200 bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">
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
                        <Link to="/Notifications" className="block py-2.5 px-4 rounded transition duration-200 bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">
                            Notifications
                        </Link>
                        {/* <Link to="/Feedback" className="block py-2.5 px-4 rounded bg-purple-800 hover:bg-purple-900 text-center font-bold">Feedback</Link> */}

                    </nav>
                </div>

                {/* Logout Button at the bottom */}
                <button
                    onClick={() => {
                        localStorage.removeItem('driverToken');
                        localStorage.removeItem('driverLid');
                        window.location.href = '/';
                    }}
                    className="block w-full py-2.5 px-4 rounded transition duration-200 bg-purple-700 text-white hover:bg-purple-800 text-center font-bold"
                >
                    Logout
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-auto">
                {/* Updated Header */}
                <header className="bg-purple-900 shadow-sm p-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <span className="text-3xl font-bold">
                            <span className="text-white">Pay</span>
                            <span className="text-blue-400">Fine</span>
                        </span>
                    </div>

                    <div className="flex items-center space-x-6">
                        {/* Navigation Links */}
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

                        {/* User Dropdown */}
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

                {/* Body */}
                <main className="flex-1 p-6 bg-gray-100 overflow-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-purple-800">Paid Fines</h1>
                        <div className="text-sm text-gray-500">
                            Showing {filteredFines.length} of {paidFines.length} paid fines
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                            {/* Left side - Time period filter */}
                            <div className="w-full md:w-1/2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setFilter('all')}
                                        className={`px-3 py-1 rounded ${filter === 'all' ? 'bg-purple-700 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                                    >
                                        All
                                    </button>
                                    <button
                                        onClick={() => setFilter('today')}
                                        className={`px-3 py-1 rounded ${filter === 'today' ? 'bg-purple-700 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                                    >
                                        Today
                                    </button>
                                    <button
                                        onClick={() => setFilter('week')}
                                        className={`px-3 py-1 rounded ${filter === 'week' ? 'bg-purple-700 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                                    >
                                        This Week
                                    </button>
                                    <button
                                        onClick={() => setFilter('month')}
                                        className={`px-3 py-1 rounded ${filter === 'month' ? 'bg-purple-700 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                                    >
                                        This Month
                                    </button>
                                </div>
                            </div>

                            {/* Right side - Date range filter and buttons */}
                            <div className="w-full md:w-1/2">
                                <div className="flex flex-col md:flex-row gap-4">
                                    {/* Date range filter */}
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                                        <div className="flex space-x-2">
                                            <DatePicker
                                                selected={startDate}
                                                onChange={date => setStartDate(date)}
                                                selectsStart
                                                startDate={startDate}
                                                endDate={endDate}
                                                placeholderText="From Date"
                                                className="w-full p-1 border rounded focus:ring-purple-500 focus:border-purple-500"
                                            />
                                            <DatePicker
                                                selected={endDate}
                                                onChange={date => setEndDate(date)}
                                                selectsEnd
                                                startDate={startDate}
                                                endDate={endDate}
                                                minDate={startDate}
                                                placeholderText="To Date"
                                                className="w-full p-1 border rounded focus:ring-purple-500 focus:border-purple-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex items-end space-x-2">
                                        <button
                                            onClick={handleSearch}
                                            className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
                                        >
                                            Search
                                        </button>
                                        <button
                                            onClick={handleReset}
                                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Paid Fines Table */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        {filteredFines.length === 0 ? (
                            <div className="p-8 text-center">
                                <p className="text-gray-500 text-lg">No paid fines found</p>
                                <p className="text-gray-400 mt-2">No records match your current filters</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference No</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provision</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle No</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (LKR)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredFines.map((fine) => (
                                            <tr key={fine._id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        onClick={() => generateReceipt(fine)}
                                                        className="text-purple-600 hover:text-purple-900"
                                                    >
                                                        View Receipt
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {fine.referenceNo}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {fine.provision}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {fine.vehicleNo}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Date(fine.issuedDate).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Date(fine.paidDate).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {fine.amount.toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DriversPaidFine;