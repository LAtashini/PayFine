import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEdit, FiTrash2, FiX, FiCheck } from 'react-icons/fi';
import axios from 'axios';
import logo from '../../assets/images/logo.png';

const ViewAllPolice = () => {
    const [officers, setOfficers] = useState([]);
    const [editingOfficer, setEditingOfficer] = useState(null);
    const [editFormData, setEditFormData] = useState({
        name: '',
        station: '',
        court: '',
        email: ''
    });
    const [error, setError] = useState('');
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const userName = localStorage.getItem("adminName") || "Admin";
    const userProfilePic = localStorage.getItem("adminPic") || "https://via.placeholder.com/40";

    
    useEffect(() => {
        const fetchOfficers = async () => {
            const token = localStorage.getItem("adminToken");
            if (!token) {
                alert("You are not logged in. Please log in.");
                navigate("/login");
                return;
            }

            try {
                const response = await axios.get('http://localhost:4000/api/admin/police', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOfficers(response.data);
            } catch (err) {
                console.error("Error fetching officers:", err);
                setError('Failed to load officers. Please try again later.');
            }
        };
        fetchOfficers();
    }, [navigate]);

    const toggleUserDropdown = () => {
        setIsUserDropdownOpen(!isUserDropdownOpen);
    };

    const handleEditClick = (officer) => {
        setEditingOfficer(officer._id); 
        setEditFormData({
            name: officer.name,
            station: officer.station,
            court: officer.court,
            email: officer.email
        });
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCancelEdit = () => {
        setEditingOfficer(null);
    };

    const handleUpdateOfficer = () => {
        
        const updatedOfficers = officers.map(officer => {
            if (officer._id === editingOfficer) {
                return { ...officer, ...editFormData };
            }
            return officer;
        });
        setOfficers(updatedOfficers);
        setEditingOfficer(null);
    };

    const handleDeleteOfficer = async (officerId) => {
        if (window.confirm('Are you sure you want to delete this officer?')) {
    
            const filteredOfficers = officers.filter(officer => officer._id !== officerId);
            setOfficers(filteredOfficers);
            
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
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
                        <Link to="/AdminDashboard" className="block py-2.5 px-4 rounded bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">Dashboard</Link>
                        <Link to="/AddPolice" className="block py-2.5 px-4 rounded bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">Add Police Officer</Link>
                        <Link to="/ViewAllPolice" className="block py-2.5 px-4 rounded bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">View All Officers</Link>
                        <Link to="/ProvisionDetails" className="block py-2.5 px-4 rounded bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">Provision Details</Link>
                        <Link to="/ViewAllDrivers" className="block py-2.5 px-4 rounded bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">View All Drivers</Link>
                        <Link to="/PaidFine" className="block py-2.5 px-4 rounded bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">Paid Fine Tickets</Link>
                        <Link to="/PendingFine" className="block py-2.5 px-4 rounded bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">Pending Fine Tickets</Link>
                        <Link to="/AllFine" className="block py-2.5 px-4 rounded bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">All Fine Tickets</Link>
                        
                    </nav>
                </div>
                <button onClick={handleLogout}
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
                                    <Link to="/AdminProfile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100">Admin Profile</Link>
                                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-100">Logout</button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6 bg-gray-100 overflow-auto">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h1 className="text-2xl font-semibold text-purple-800 mb-6">All Police Officers</h1>
                        {error && <p className="text-red-500">{error}</p>}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3">Officer ID</th>
                                        <th className="px-6 py-3">Name</th>
                                        <th className="px-6 py-3">Station</th>
                                        <th className="px-6 py-3">Court</th>
                                        <th className="px-6 py-3">Email</th>
                                        <th className="px-6 py-3">Registered Date</th>
                                        <th className="px-6 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {officers.map(officer => (
                                        <tr key={officer._id}>
                                            <td className="px-6 py-4">{officer.policeId}</td>
                                            <td className="px-6 py-4">
                                                {editingOfficer === officer._id ? (
                                                    <input type="text" name="name" value={editFormData.name} onChange={handleEditFormChange} />
                                                ) : officer.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                {editingOfficer === officer._id ? (
                                                    <input type="text" name="station" value={editFormData.station} onChange={handleEditFormChange} />
                                                ) : officer.station}
                                            </td>
                                            <td className="px-6 py-4">
                                                {editingOfficer === officer._id ? (
                                                    <input type="text" name="court" value={editFormData.court} onChange={handleEditFormChange} />
                                                ) : officer.court}
                                            </td>
                                            <td className="px-6 py-4">
                                                {editingOfficer === officer._id ? (
                                                    <input type="email" name="email" value={editFormData.email} onChange={handleEditFormChange} />
                                                ) : officer.email}
                                            </td>
                                            <td className="px-6 py-4">{new Date(officer.registeredDate).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">
                                                {editingOfficer === officer._id ? (
                                                    <div className="flex space-x-2">
                                                        <button onClick={handleUpdateOfficer}><FiCheck /></button>
                                                        <button onClick={handleCancelEdit}><FiX /></button>
                                                    </div>
                                                ) : (
                                                    <div className="flex space-x-2">
                                                        <button onClick={() => handleEditClick(officer)}><FiEdit /></button>
                                                        <button onClick={() => handleDeleteOfficer(officer._id)}><FiTrash2 /></button>
                                                    </div>
                                                )}
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

export default ViewAllPolice;
