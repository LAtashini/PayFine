import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiEdit, FiSave, FiX, FiPlus } from 'react-icons/fi';
import logo from '../../assets/images/logo.png';

const ProvisionDetails = () => {
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const navigate = useNavigate();
    
    const userProfilePic = localStorage.getItem("adminPic") || "https://via.placeholder.com/40";
    const [provisions, setProvisions] = useState([]);

    useEffect(() => {
        const fetchProvisions = async () => {
            try {
                const res = await fetch("http://localhost:4000/api/admin/provisions");
                const data = await res.json();
                if (res.ok) {
                    setProvisions(data);
                    console.log(data);
                } else {
                    console.error("Failed to fetch provisions:", data.message);
                }
            } catch (err) {
                console.error("Error fetching provisions:", err);
            }
        };
        fetchProvisions();
    }, []);


    
    const [formData, setFormData] = useState({
        provisionId: '',
        sectionOfAct: '',
        fineAmount: ''
    });

    const [editingId, setEditingId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        provisionId: '',
        sectionOfAct: '',
        fineAmount: ''
    });

    const toggleUserDropdown = () => {
        setIsUserDropdownOpen(!isUserDropdownOpen);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/AdminSignUp");
    };

    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    
    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({
            ...editFormData,
            [name]: value
        });
    };

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch("http://localhost:4000/api/admin/provisions", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (res.ok) {
                setFormData({ provisionId: '', sectionOfAct: '', fineAmount: '' });
                
                window.location.reload();  

            } else {
                alert(data.message || "Failed to add provision.");
            }
        } catch (err) {
            console.error("Error adding provision:", err);
            alert("Error adding provision.");
        }
    };

    
    const handleEdit = (provision) => {
        setEditingId(provision._id);
        setEditFormData({
            provisionId: provision.provisionId,
            sectionOfAct: provision.sectionOfAct,
            fineAmount: provision.fineAmount
        });
    };

    
    const handleSaveEdit = async () => {
        const token = localStorage.getItem('adminToken');
        try {
            const res = await fetch(`http://localhost:4000/api/admin/provisions/${editingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(editFormData)
            });
            const data = await res.json();
            if (res.ok) {
                
                setProvisions(prev => prev.map(p => p._id === editingId ? data : p));
                setEditingId(null);
            } else {
                alert(data.message || 'Failed to update provision');
            }
        } catch (err) {
            console.error('Error updating provision:', err);
        }
    };


    
    const handleCancelEdit = () => {
        setEditingId(null);
    };

    
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this provision?")) return;
        try {
            const token = localStorage.getItem("authToken");
            const res = await fetch(`http://localhost:4000/api/admin/provisions/${id}`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (res.ok) {
                setProvisions(prev => prev.filter(prov => prov._id !== id));
            } else {
                alert(data.message || "Failed to delete provision.");
            }
        } catch (err) {
            console.error("Error deleting provision:", err);
            alert("Error deleting provision.");
        }
    };


    const [userName, setUserName] = useState('Loading...');
    useEffect(() => {
        const fetchAdminData = async () => {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                setUserName('Unknown Admin');
                console.warn('Admin token not found.');
                return;
            }

            try {
                const res = await fetch('http://localhost:4000/api/admin/dashboard', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await res.json();
                if (res.ok) {
                    
                    const adminName = localStorage.getItem("adminName");
                    setUserName(adminName);
                } else {
                    console.warn('Failed to fetch admin data:', data.message);
                    const adminName = localStorage.getItem("adminName");
                    setUserName(adminName);
                }
            } catch (err) {
                console.error('Error fetching admin data:', err);
                const adminName = localStorage.getItem("adminName");
                setUserName(adminName);
            }
        };

        fetchAdminData();
    }, []);


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
                        <h1 className="text-2xl font-semibold text-blue-800 mb-6">Provision Details</h1>

                        
                        <form onSubmit={handleSubmit} className="mb-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label htmlFor="provisionId" className="block text-sm font-medium text-gray-700 mb-1">
                                        Provision ID *
                                    </label>
                                    <input
                                        type="text"
                                        id="provisionId"
                                        name="provisionId"
                                        value={formData.provisionId}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="sectionOfAct" className="block text-sm font-medium text-gray-700 mb-1">
                                        Section of Act *
                                    </label>
                                    <input
                                        type="text"
                                        id="sectionOfAct"
                                        name="sectionOfAct"
                                        value={formData.sectionOfAct}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="fineAmount" className="block text-sm font-medium text-gray-700 mb-1">
                                        Fine Amount (LKR) *
                                    </label>
                                    <input
                                        type="text"
                                        id="fineAmount"
                                        name="fineAmount"
                                        value={formData.fineAmount}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="flex items-center justify-center px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <FiPlus className="mr-2" />
                                Add Provision
                            </button>
                        </form>

            
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provision ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section of Act</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fine Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {provisions.map((provision) => (
                                        <tr key={provision._id}>
                            
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {editingId === provision._id ? (
                                                    <input
                                                        type="text"
                                                        name="provisionId"
                                                        value={editFormData.provisionId}
                                                        onChange={handleEditInputChange}
                                                        className="w-full px-2 py-1 border rounded focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                ) : (
                                                    provision.fineId
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {editingId === provision._id ? (
                                                    <input
                                                        type="text"
                                                        name="sectionOfAct"
                                                        value={editFormData.sectionOfAct}
                                                        onChange={handleEditInputChange}
                                                        className="w-full px-2 py-1 border rounded focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                ) : (
                                                    provision.section
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {editingId === provision._id ? (
                                                    <input
                                                        type="text"
                                                        name="fineAmount"
                                                        value={editFormData.fineAmount}
                                                        onChange={handleEditInputChange}
                                                        className="w-full px-2 py-1 border rounded focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                ) : (
                                                    provision.amount
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                {editingId === provision._id ? (
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={handleSaveEdit}
                                                            className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-100"
                                                            title="Save"
                                                        >
                                                            <FiSave size={18} />
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
                                                            onClick={() => handleEdit(provision)}
                                                            className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100"
                                                            title="Edit"
                                                        >
                                                            <FiEdit size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(provision._id)}
                                                            className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100"
                                                            title="Delete"
                                                        >
                                                            <FiTrash2 size={18} />
                                                        </button>
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

export default ProvisionDetails;
