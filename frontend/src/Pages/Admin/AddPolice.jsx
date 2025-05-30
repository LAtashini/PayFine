import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../../assets/images/logo.png';

const AddPolice = () => {
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const userName = localStorage.getItem("adminName") || "Admin ";

    const [formData, setFormData] = useState({
        officerId: '',
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        PoliceStation: '',  
        court: '',
        registeredDate: new Date().toISOString().split('T')[0]
    });

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password.trim() !== formData.confirmPassword.trim()) {
            setError("Passwords don't match!");
            return;
        }

        const token = localStorage.getItem("adminToken");
        if (!token) {
            alert("You are not logged in. Please log in again.");
            navigate("/login");
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:4000/api/admin/add-police',
                {
                    officerId: formData.officerId,
                    email: formData.email,
                    password: formData.password,
                    name: formData.name,
                    PoliceStation: formData.PoliceStation,  
                    court: formData.court,
                    registeredDate: formData.registeredDate
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 201 || response.status === 200) {
                alert('Police officer added successfully!');
                navigate('/ViewAllPolice');
            } else {
                setError('Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Error adding police officer:', error);
            setError(error.response?.data?.message || 'Server error');
        }
    };

    const toggleUserDropdown = () => {
        setIsUserDropdownOpen(!isUserDropdownOpen);
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
                        <Link to="/AdminDashboard" className="block py-2.5 px-4 bg-purple-800 rounded hover:bg-purple-900 text-center font-bold">Dashboard</Link>
                        <Link to="/AddPoliceOfficer" className="block py-2.5 px-4 bg-purple-800 rounded hover:bg-purple-900 text-center font-bold">Add Police Officer</Link>
                        <Link to="/ViewAllPolice" className="block py-2.5 px-4 bg-purple-800 rounded hover:bg-purple-900 text-center font-bold">View All Officers</Link>
                        <Link to="/ProvisionDetails" className="block py-2.5 px-4 bg-purple-800 rounded hover:bg-purple-900 text-center font-bold">Provision Details</Link>
                        <Link to="/ViewAllDrivers" className="block py-2.5 px-4 bg-purple-800 rounded hover:bg-purple-900 text-center font-bold">View All Drivers</Link>
                        <Link to="/PaidFine" className="block py-2.5 px-4 bg-purple-800 rounded hover:bg-purple-900 text-center font-bold">Paid Fine Tickets</Link>
                        <Link to="/PendingFine" className="block py-2.5 px-4 bg-purple-800 rounded hover:bg-purple-900 text-center font-bold">Pending Fine Tickets</Link>
                        <Link to="/AllFine" className="block py-2.5 px-4 bg-purple-800 rounded hover:bg-purple-900 text-center font-bold">All Fine Tickets</Link>
                        {/* <Link to="/Feedback" className="block py-2.5 px-4 bg-purple-800 rounded hover:bg-purple-900 text-center font-bold">Feedback</Link> */}
                    </nav>
                </div>
                <button
                    onClick={() => {
                        localStorage.removeItem('adminToken');
                        navigate('/');
                    }}
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
                                    <Link to="/AdminProfile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-100">Admin Profile</Link>
                                    <button
                                        onClick={() => {
                                            localStorage.removeItem('adminToken');
                                            navigate('/login');
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-100"
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
                        <h1 className="text-2xl font-semibold text-purple-800 mb-6">Add New Police Officer</h1>
                        {error && <p className="text-red-500">{error}</p>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[{ label: "Police Officer ID", name: "officerId", type: "text" },
                                { label: "Email", name: "email", type: "email" },
                                { label: "Password", name: "password", type: "password" },
                                { label: "Confirm Password", name: "confirmPassword", type: "password" },
                                { label: "Full Name", name: "name", type: "text" },
                                { label: "Police Station", name: "PoliceStation", type: "text" },  
                                { label: "Court", name: "court", type: "text" },
                                { label: "Registered Date", name: "registeredDate", type: "date" }]
                                    .map(({ label, name, type }) => (
                                        <div key={name}>
                                            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                                            <input
                                                id={name}
                                                name={name}
                                                type={type}
                                                value={formData[name]}
                                                onChange={handleChange}
                                                required={name !== 'court'}
                                                minLength={name.includes('password') ? 8 : undefined}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                            />
                                        </div>
                                    ))}
                            </div>
                            <div className="flex justify-end mt-6">
                                <button type="submit" className="px-6 py-2 bg-yellow-300 text-purple-900 rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-purple-500">
                                    Add Police Officer
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AddPolice;
