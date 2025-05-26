import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';

const DriversPastFine = () => {
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [licenseNumber, setLicenseNumber] = useState('B1234567');
    const [pastFines, setPastFines] = useState([]);
    const userName = "Officer John";
    const userProfilePic = "https://via.placeholder.com/40";

    // More comprehensive mock data
    const mockPastFines = [
        { id: 1, provision: "Speeding (Exceeding 50km/h limit)", vehicleNumber: "ABC-1234", place: "Colombo - Galle Road", issuedDate: "2023-10-01", amount: "LKR 3,500" },
        { id: 2, provision: "Illegal Parking (No Parking Zone)", vehicleNumber: "XYZ-5678", place: "Kandy - Temple Road", issuedDate: "2023-10-05", amount: "LKR 2,000" },
        { id: 3, provision: "Red Light Violation", vehicleNumber: "DEF-9101", place: "Galle - Main Junction", issuedDate: "2023-10-10", amount: "LKR 5,000" },
        { id: 4, provision: "No Seatbelt", vehicleNumber: "GHI-1121", place: "Negombo - Beach Road", issuedDate: "2023-09-15", amount: "LKR 1,500" },
        { id: 5, provision: "Using Mobile Phone While Driving", vehicleNumber: "JKL-3141", place: "Colombo - Union Place", issuedDate: "2023-09-20", amount: "LKR 2,500" },
    ];

    useEffect(() => {
        // Load mock data automatically for screenshot purposes
        setPastFines(mockPastFines);
    }, []);

    const toggleUserDropdown = () => {
        setIsUserDropdownOpen(!isUserDropdownOpen);
    };

    const handleSearch = () => {
        if (licenseNumber) {
            // In a real app, this would filter data based on license number
            setPastFines(mockPastFines);
        } else {
            alert("Please enter a driving license number.");
        }
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
                        <Link to="/PoliceDashboard" className="block py-2.5 px-4 rounded transition duration-200 bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">
                            Dashboard
                        </Link>
                        <Link to="/AddNewFine" className="block py-2.5 px-4 rounded transition duration-200 bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">
                            Add New Fine
                        </Link>
                        <Link to="/DriversPastFine" className="block py-2.5 px-4 rounded transition duration-200 bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">
                            Drivers Past Fines
                        </Link>
                        <Link to="/RevenueLicense" className="block py-2.5 px-4 rounded transition duration-200 bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">
                            Revenue License
                        </Link>
                        <Link to="/ViewReportedFine" className="block py-2.5 px-4 rounded transition duration-200 bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">
                            View Reported Fine
                        </Link>
                    </nav>
                </div>

                <button
                    onClick={() => alert('Logout clicked')}
                    className="block w-full py-2.5 px-4 rounded transition duration-200 bg-purple-700 text-white hover:bg-purple-800 text-center font-bold"
                >
                    Logout
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-purple-900 shadow-sm p-4 flex justify-between items-center">
                    <div></div>
                    <div className="relative">
                        <button onClick={toggleUserDropdown} className="flex items-center focus:outline-none">
                            <img src={userProfilePic} alt="User Profile" className="w-10 h-10 rounded-full" />
                            <span className="ml-2 text-white">{userName}</span>
                            <svg className="w-6 h-6 ml-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {isUserDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-slate-400 rounded-md shadow-lg py-1">
                                <Link to="/PolicemanProfile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-700 hover:text-white">
                                    Edit Profile
                                </Link>
                                <button
                                    onClick={() => alert('Logout clicked')}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-700 hover:text-white"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 bg-gray-300">
                    <h1 className="text-2xl font-semibold text-purple-900 mb-6">Drivers Past Fines</h1>

                    {/* Search Section */}
                    <div className="mb-6 bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center">
                            <input
                                type="text"
                                placeholder="Enter Driving License Number"
                                value={licenseNumber}
                                onChange={(e) => setLicenseNumber(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-700"
                            />
                            <button
                                onClick={handleSearch}
                                className="bg-purple-700 text-white px-4 py-2 rounded-r-md hover:bg-purple-800 transition duration-200"
                            >
                                Search
                            </button>
                        </div>
                    </div>

                    {/* Results Section */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-purple-900 text-white">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Fine ID</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Provision</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Vehicle No.</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Place</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Issued Date</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {pastFines.map((fine) => (
                                    <tr key={fine.id} className="hover:bg-gray-50 transition duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-700">#{fine.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{fine.provision}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">{fine.vehicleNumber}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{fine.place}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{fine.issuedDate}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">{fine.amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="bg-gray-50 px-6 py-3 text-right text-sm font-medium text-gray-500">
                            Showing {pastFines.length} of {pastFines.length} records
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DriversPastFine;