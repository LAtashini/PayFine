import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';

const ViewReportedFine = () => {
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [fines, setFines] = useState([]);
    const [filteredFines, setFilteredFines] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const userName = "Police Officer";
    const userProfilePic = "https://via.placeholder.com/40";

    // Fetch data from the backend API
    useEffect(() => {
        const fetchFines = async () => {
            setIsLoading(true);
            try {
                const policeId = localStorage.getItem("policeId"); // Assuming this is saved on login
                const res = await fetch(`http://localhost:4000/api/police/reported-fine/${policeId}`);
                const data = await res.json();
                console.log("Fetched fines:", data);
                if (res.ok) {
                    const finesArray = data.fines || [];   // Safely extract the array
                    setFines(finesArray);
                    setFilteredFines(finesArray);
                } else {
                    alert(data.message || "Failed to fetch fines");
                }
            } catch (error) {
                console.error("Error fetching fines:", error);
                alert("Server error while fetching fines");
            } finally {
                setIsLoading(false);
            }
        };

        fetchFines();
    }, []);

    // Search functionality
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredFines(fines);
        } else {
            const filtered = fines.filter(fine =>
                fine.referenceNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                fine.licenseId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                fine.vehicleNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                fine.provision?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredFines(filtered);
        }
    }, [searchTerm, fines]);

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
                        <span className="text-2xl font-semibold"><span className="text-white">Pay</span><span className="text-blue-400">Fine</span></span>
                    </div>
                    <nav className="space-y-4">
                        <Link to="/PoliceDashboard" className="block py-2.5 px-4 rounded transition duration-200 bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">Dashboard</Link>
                        <Link to="/AddNewFine" className="block py-2.5 px-4 rounded transition duration-200 bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">Add New Fine</Link>
                        <Link to="/DriversPastFines" className="block py-2.5 px-4 rounded transition duration-200 bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">Drivers Past Fines</Link>
                        <Link to="/RevenueLicense" className="block py-2.5 px-4 rounded transition duration-200 bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">Revenue License</Link>
                        <Link to="/ViewReportedFine" className="block py-2.5 px-4 rounded transition duration-200 bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">View Reported Fine</Link>
                    </nav>
                </div>
                <button onClick={() => alert('Logout clicked')} className="block w-full py-2.5 px-4 rounded transition duration-200 bg-purple-700 text-white hover:bg-purple-800 text-center font-bold">Logout</button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-auto">
                <header className="bg-purple-900 shadow-sm p-4 flex justify-between items-center">
                    <div></div>
                    <div className="relative">
                        <button onClick={toggleUserDropdown} className="flex items-center focus:outline-none">
                            <img src={userProfilePic} alt="User Profile" className="w-10 h-10 rounded-full" />
                            <span className="ml-2 text-white">{userName}</span>
                            <svg className="w-6 h-6 ml-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                        {isUserDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-slate-400 rounded-md shadow-lg py-1">
                                <Link to="/PolicemanProfile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-700 hover:text-white">Edit Profile</Link>
                                <button onClick={() => alert('Logout clicked')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-700 hover:text-white">Logout</button>
                            </div>
                        )}
                    </div>
                </header>

                <main className="flex-1 p-6 bg-gray-300 overflow-auto">
                    <h1 className="text-2xl font-semibold text-purple-900 mb-6">View Reported Fines</h1>

                    {/* Search Box */}
                    <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
                        <div className="flex items-center">
                            <input
                                type="text"
                                placeholder="Search by Reference, License, Vehicle No, or Provision"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-700"
                            />
                            <button className="bg-purple-700 text-white px-4 py-2 rounded-r-md hover:bg-purple-800">Search</button>
                        </div>
                    </div>

                    {/* Fines Table */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        {isLoading ? (
                            <div className="p-6 text-center">Loading fines...</div>
                        ) : filteredFines.length === 0 ? (
                            <div className="p-6 text-center">No fines found matching your search criteria</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-purple-900">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Reference No</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">License ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Provision</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Vehicle No</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Total Amount</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Issued Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredFines.map((fine, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">{fine.referenceNo}</td>
                                                <td className="px-6 py-4">{fine.licenseId}</td>
                                                <td className="px-6 py-4">{fine.provision}</td>
                                                <td className="px-6 py-4">{fine.vehicleNo}</td>
                                                <td className="px-6 py-4">{fine.totalAmount?.toLocaleString()}</td>
                                                <td className="px-6 py-4">{fine.issuedDate?.substring(0, 10)}</td>
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

export default ViewReportedFine;
