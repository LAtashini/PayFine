import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEdit, FiTrash2, FiX, FiCheck, FiPlus } from 'react-icons/fi';
import logo from '../../assets/images/logo.png';

const ViewAllDrivers = () => {
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const userName = localStorage.getItem("adminName") || "Admin User";
    const userProfilePic = localStorage.getItem("adminPic") || "https://via.placeholder.com/40";

    // Sample data - replace with API data
    const [drivers, setDrivers] = useState([
        {
            id: 'DR001',
            licenseNo: 'B1234567',
            name: 'John Doe',
            nic: '901234567V',
            email: 'john.doe@example.com',
            phone: '0712345678',
            registeredDate: '2023-01-15'
        },
        {
            id: 'DR002',
            licenseNo: 'B7654321',
            name: 'Jane Smith',
            nic: '987654321V',
            email: 'jane.smith@example.com',
            phone: '0776543210',
            registeredDate: '2023-02-20'
        }
    ]);

    const [editingDriver, setEditingDriver] = useState(null);
    const [editFormData, setEditFormData] = useState({
        licenseNo: '',
        name: '',
        nic: '',
        email: '',
        phone: ''
    });

    const toggleUserDropdown = () => {
        setIsUserDropdownOpen(!isUserDropdownOpen);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/AdminSignUp");
    };

    const handleEditClick = (driver) => {
        setEditingDriver(driver.id);
        setEditFormData({
            licenseNo: driver.licenseNo,
            name: driver.name,
            nic: driver.nic,
            email: driver.email,
            phone: driver.phone
        });
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({
            ...editFormData,
            [name]: value
        });
    };

    const handleCancelEdit = () => {
        setEditingDriver(null);
    };

    const handleUpdateDriver = () => {
        const updatedDrivers = drivers.map(driver => {
            if (driver.id === editingDriver) {
                return { ...driver, ...editFormData };
            }
            return driver;
        });

        setDrivers(updatedDrivers);
        setEditingDriver(null);
    };

    const handleDeleteDriver = (driverId) => {
        if (window.confirm('Are you sure you want to delete this driver?')) {
            const filteredDrivers = drivers.filter(driver => driver.id !== driverId);
            setDrivers(filteredDrivers);
        }
    };

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

                {/* Body with Drivers Table */}
                <main className="flex-1 p-6 bg-gray-100 overflow-auto">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h1 className="text-2xl font-semibold text-blue-800 mb-6">All Drivers</h1>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License No</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIC</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {drivers.map((driver) => (
                                        <React.Fragment key={driver.id}>
                                            <tr>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{driver.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {editingDriver === driver.id ? (
                                                        <input
                                                            type="text"
                                                            name="licenseNo"
                                                            value={editFormData.licenseNo}
                                                            onChange={handleEditFormChange}
                                                            className="w-full px-2 py-1 border rounded focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                    ) : (
                                                        driver.licenseNo
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {editingDriver === driver.id ? (
                                                        <input
                                                            type="text"
                                                            name="name"
                                                            value={editFormData.name}
                                                            onChange={handleEditFormChange}
                                                            className="w-full px-2 py-1 border rounded focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                    ) : (
                                                        driver.name
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {editingDriver === driver.id ? (
                                                        <input
                                                            type="text"
                                                            name="nic"
                                                            value={editFormData.nic}
                                                            onChange={handleEditFormChange}
                                                            className="w-full px-2 py-1 border rounded focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                    ) : (
                                                        driver.nic
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {editingDriver === driver.id ? (
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            value={editFormData.email}
                                                            onChange={handleEditFormChange}
                                                            className="w-full px-2 py-1 border rounded focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                    ) : (
                                                        driver.email
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {editingDriver === driver.id ? (
                                                        <input
                                                            type="text"
                                                            name="phone"
                                                            value={editFormData.phone}
                                                            onChange={handleEditFormChange}
                                                            className="w-full px-2 py-1 border rounded focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                    ) : (
                                                        driver.phone
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{driver.registeredDate}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    {editingDriver === driver.id ? (
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={handleUpdateDriver}
                                                                className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-100"
                                                                title="Update"
                                                            >
                                                                <FiCheck size={18} />
                                                            </button>
                                                            <button
                                                                onClick={handleCancelEdit}
                                                                className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100"
                                                                title="Cancel"
                                                            >
                                                                <FiX size={18} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => handleEditClick(driver)}
                                                                className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100"
                                                                title="Edit"
                                                            >
                                                                <FiEdit size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteDriver(driver.id)}
                                                                className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100"
                                                                title="Delete"
                                                            >
                                                                <FiTrash2 size={18} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        </React.Fragment>
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

export default ViewAllDrivers;