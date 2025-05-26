import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';

const RevenueLicense = () => {
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [licenseNumber, setLicenseNumber] = useState('');
    const [formData, setFormData] = useState({
        licenseNumber: '',
        referenceNumber: '',
        vehicleNumber: '',
        vehicleType: '',
        fuelType: '',
        ownerName: '',
        ownerAddress: '',
        issueDate: '',
        expireDate: ''
    });

    const toggleUserDropdown = () => {
        setIsUserDropdownOpen(!isUserDropdownOpen);
    };

    const formatDate = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        return date.toISOString().split('T')[0]; // "yyyy-MM-dd"
    };


    const handleSearch = async () => {
        if (!licenseNumber) {
            alert('Please enter a license number');
            return;
        }

        try {
            const res = await fetch(`http://localhost:4000/api/police/revenue/${licenseNumber}`);
            const data = await res.json();
            if (res.ok) {
                const formattedData = {
                    ...data,
                    issueDate: formatDate(data.issueDate),
                    expireDate: formatDate(data.expireDate),
                };
                setFormData(prev => ({ ...prev, ...formattedData }));
                console.log('Revenue license found:', formattedData);
            } else {
                alert(data.message || 'Revenue license not found');
            }

        } catch (error) {
            console.error('Error fetching revenue license:', error);
            alert('Server error. Please try again.');
        }
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                licenseNumber: formData.licenseNumber,
                vehicleNo: formData.vehicleNumber,
                referenceNo: formData.referenceNumber,
                vehicleType: formData.vehicleType,
                fuelType: formData.fuelType,
                ownerName: formData.ownerName,
                ownerAddress: formData.ownerAddress,
                issuedDate: formData.issueDate,
                expiredDate: formData.expireDate
            };

            const response = await fetch('http://localhost:4000/api/revenue/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                alert('Revenue license saved successfully!');
                setFormData({
                    referenceNumber: '',
                    vehicleNumber: '',
                    vehicleType: '',
                    fuelType: '',
                    ownerName: '',
                    ownerAddress: '',
                    issueDate: '',
                    expireDate: ''
                });
            } else {
                alert(data.message || 'Failed to save revenue license');
            }
        } catch (err) {
            console.error('Error saving revenue license:', err);
            alert('Server error saving revenue license');
        }
    };

    const [userName, setUserName] = useState("Loading...");
    useEffect(() => {
        const fetchOfficerName = async () => {
            const policeId = localStorage.getItem("policeId");
            if (!policeId) {
                setUserName("Unknown Officer");
                console.warn("Police ID not found.");
                return;
            }

            try {
                const res = await fetch(`http://localhost:4000/api/police/profile/${policeId}`);
                const data = await res.json();

                if (res.ok) {
                    setUserName(data?.police?.name || data?.name || "Officer");
                } else {
                    setUserName("Officer");
                    console.warn("Failed to fetch officer name:", data.message);
                }
            } catch (err) {
                setUserName("Officer");
                console.error("Error fetching officer name:", err);
            }
        };

        fetchOfficerName();
    }, []);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
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
                        {/* <Link to="/ViewReportedFine" className="block py-2.5 px-4 rounded transition duration-200 bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">
                            View Reported Fine
                        </Link> */}
                    </nav>
                </div>

                {/* Logout Button at the bottom */}
                <button
                    onClick={() => {
                        localStorage.removeItem("authToken");
                        localStorage.removeItem("policeId"); // Clear policeId too
                        window.location.href = "/";
                    }}
                    className="block w-full py-2.5 px-4 rounded bg-purple-700 text-white hover:bg-purple-800 text-center font-bold"
                >
                    Logout
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-auto">
                {/* Header */}
                <header className="bg-purple-900 shadow-sm p-4 flex justify-between items-center">
                    <div>
                        {/* Add your logo here */}
                    </div>
                    <div className="relative">
                        <button onClick={toggleUserDropdown} className="flex items-center focus:outline-none">
                            <img
                                src={'https://www.w3schools.com/howto/img_avatar.png'}
                                alt="User Profile"
                                className="w-10 h-10 rounded-full"
                            />
                            <span className="ml-2 text-white">{userName}</span>
                            <svg className="w-6 h-6 ml-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
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

                {/* Body */}
                <main className="flex-1 p-6 bg-gray-300 overflow-auto">
                    <h1 className="text-2xl font-semibold text-purple-900 mb-6">Revenue License</h1>

                    {/* Search Section */}
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <h2 className="text-xl font-semibold text-purple-800 mb-4">Search License</h2>
                        <div className="flex items-center">
                            <input
                                type="text"
                                placeholder="Enter Revenue License Number"
                                value={licenseNumber}
                                onChange={(e) => setLicenseNumber(e.target.value)}
                                className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-700"
                            />
                            <button
                                onClick={handleSearch}
                                className="bg-purple-700 text-white px-4 py-2 rounded-r-md hover:bg-purple-800"
                            >
                                Search
                            </button>
                        </div>
                    </div>

                    {/* License Details Form */}
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-purple-800 mb-4">License Details</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-gray-700 mb-2">Reference Number</label>
                                <input
                                    type="text"
                                    name="referenceNumber"
                                    value={formData.referenceNumber}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-700"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2">License Number</label>
                                <input
                                    type="text"
                                    name="licenseNumber"
                                    value={formData.licenseNumber}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-700"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2">Vehicle Number</label>
                                <input
                                    type="text"
                                    name="vehicleNumber"
                                    value={formData.vehicleNumber}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-700"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2">Vehicle Type</label>
                                <select
                                    name="vehicleType"
                                    value={formData.vehicleType}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-700"
                                    required
                                >
                                    <option value="">Select Vehicle Type</option>
                                    <option value="Car">Car</option>
                                    <option value="Motorcycle">Motorcycle</option>
                                    <option value="Van">Van</option>
                                    <option value="Bus">Bus</option>
                                    <option value="Lorry">Lorry</option>
                                    <option value="Three-Wheeler">Three-Wheeler</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2">Fuel Type</label>
                                <select
                                    name="fuelType"
                                    value={formData.fuelType}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-700"
                                    required
                                >
                                    <option value="">Select Fuel Type</option>
                                    <option value="Petrol">Petrol</option>
                                    <option value="Diesel">Diesel</option>
                                    <option value="Electric">Electric</option>
                                    <option value="Hybrid">Hybrid</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2">Owner Name</label>
                                <input
                                    type="text"
                                    name="ownerName"
                                    value={formData.ownerName}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-700"
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-gray-700 mb-2">Owner Address</label>
                                <textarea
                                    name="ownerAddress"
                                    value={formData.ownerAddress}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-700"
                                    required
                                    rows="3"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2">Issue Date</label>
                                <input
                                    type="date"
                                    name="issueDate"
                                    value={formData.issueDate}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-700"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2">Expire Date</label>
                                <input
                                    type="date"
                                    name="expireDate"
                                    value={formData.expireDate}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-700"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end mt-6">
                            <button
                                type="submit"
                                className="bg-yellow-400 text-purple-900 px-6 py-2 rounded hover:bg-yellow-300 font-semibold"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
};

export default RevenueLicense;