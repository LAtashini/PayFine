import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiDownload, FiSearch } from 'react-icons/fi';
import logo from '../../assets/images/logo.png';

const AllFine = () => {
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const userName = localStorage.getItem("adminName") || "Admin   ";
    const userProfilePic = localStorage.getItem("adminPic") || "https://via.placeholder.com/40";
    const [activeFilter, setActiveFilter] = useState('all');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [fines, setFines] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAllFines = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("adminToken");
                const response = await fetch('http://localhost:4000/api/admin/all-tickets', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (response.ok) {
                    console.log("Fetched All Fines:", data);
                    setFines(data);
                } else {
                    console.error(data.message || "Failed to fetch all fines");
                }
            } catch (error) {
                console.error("Error fetching all fines:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllFines();
    }, []);


    const toggleUserDropdown = () => {
        setIsUserDropdownOpen(!isUserDropdownOpen);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/AdminSignUp");
    };

    const handleFilterClick = async (filter) => {
        setActiveFilter(filter);
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem("adminToken");
            let query = '';
            if (filter === 'paid') {
                query = '?status=paid';
            } else if (filter === 'pending') {
                query = '?status=unpaid';
            } else if (filter === 'expired') {
                query = '?status=expired';
            } 

            const response = await fetch(`http://localhost:4000/api/admin/all-tickets${query}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                console.log(`Fetched fines for filter ${filter}:`, data);
                setFines(data);
            } else {
                setError(data.message || "Failed to fetch filtered fines");
            }
        } catch (err) {
            console.error("Error fetching filtered fines:", err);
            setError("Server error while fetching filtered fines");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!fromDate || !toDate) {
            alert("Please select both from and to dates.");
            return;
        }

        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem("adminToken");
            
            const fromISO = new Date(fromDate).toISOString();
            const toISO = new Date(toDate).toISOString();

            const query = `?fromDate=${fromISO}&toDate=${toISO}`;
            const response = await fetch(`http://localhost:4000/api/admin/all-tickets${query}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                console.log("Fetched fines for date range:", data);
                setFines(data);
            } else {
                setError(data.message || "Failed to fetch fines for date range");
            }
        } catch (err) {
            console.error("Error fetching date range fines:", err);
            setError("Server error while fetching date range fines");
        } finally {
            setLoading(false);
        }
    };


    const handleDownload = async (fineId) => {
        try {
            const token = localStorage.getItem("adminToken");
            const response = await fetch(`http://localhost:4000/api/admin/download-ticket/${fineId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                alert("Failed to download fine ticket.");
                return;
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `FineTicket_${fineId}.pdf`; 
            document.body.appendChild(link); 
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error("Error downloading fine ticket:", err);
            
        }
    };


    return (
        <div className="flex h-screen bg-gray-100">
            
            <div className="bg-gray-800 text-white w-64 py-7 px-2 shadow-lg flex flex-col justify-between">
                <div>
                    
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
                        
                    </nav>
                </div>

                <button
                    onClick={handleLogout}
                    className="block w-full py-2.5 px-4 rounded transition duration-200 bg-purple-800 text-white hover:bg-purple-900 text-center font-bold mt-4"
                >
                    Logout
                </button>
            </div>

            
            <div className="flex-1 flex flex-col">
                
                <header className="bg-purple-900 shadow-sm p-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <span className="text-3xl font-bold">
                            <span className="text-white">Pay</span>
                            <span className="text-blue-400">Fine</span>
                        </span>
                    </div>
                    <div className='hidden md:flex space-x-6'>

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
                            <button onClick={toggleUserDropdown} className="flex items-center focus:outline-none">
                                <img
                                    src={'https://www.w3schools.com/howto/img_avatar.png'}
                                    alt="User Profile"
                                    className="w-10 h-10 rounded-full"
                                />                            <span className="ml-2 text-white">{userName}</span>
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
                    </div>
                </header>

                
                <main className="flex-1 p-6 bg-gray-100 overflow-auto">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h1 className="text-2xl font-semibold text-blue-800 mb-6">All Fine Tickets</h1>

                        
                        <div className="flex flex-wrap gap-2 mb-6">
                            <button
                                onClick={() => handleFilterClick('all')}
                                className={`px-4 py-2 rounded-md ${activeFilter === 'all' ? 'bg-purple-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            >
                                All Fines
                            </button>
                            <button
                                onClick={() => handleFilterClick('paid')}
                                className={`px-4 py-2 rounded-md ${activeFilter === 'paid' ? 'bg-purple-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            >
                                Paid
                            </button>
                            
                            <button
                                onClick={() => handleFilterClick('expired')}
                                className={`px-4 py-2 rounded-md ${activeFilter === 'expired' ? 'bg-purple-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            >
                                Expired
                            </button>
                        </div>

                        
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

                        
                        <div className="overflow-x-auto w-full max-w-[75vw]">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference No</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Police ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issued Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {fines.map((fine) => (
                                        <tr key={fine.id} className={
                                            fine.status === 'expired' ? 'bg-red-50' :
                                                fine.status === 'pending' ? 'bg-yellow-50' : ''
                                        }>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => handleDownload(fine._id)}
                                                    className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100"
                                                    title="Download"
                                                >
                                                    <FiDownload size={18} />
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fine.referenceNo}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fine.licenseId}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fine.policeId?.policeId || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fine.totalAmount}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fine.issuedDate ? new Date(fine.issuedDate).toLocaleDateString() : 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fine.expiredDate ? new Date(fine.expiredDate).toLocaleDateString() : 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fine.paidDate ? new Date(fine.paidDate).toLocaleDateString() : '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${fine.status === 'paid'
                                                    ? 'bg-green-100 text-green-800'
                                                    : fine.status === 'expired'
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {fine.status === 'paid' ? 'Paid' :
                                                        fine.status === 'expired' ? 'Expired' : 'Pending'}
                                                </span>
                                            </td>
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

export default AllFine;
