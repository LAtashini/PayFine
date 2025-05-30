import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import logo from '../../assets/images/logo.png';

const COLORS = ['#0088FE', '#FF8042'];

const AdminDashboard = () => {
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [stats, setStats] = useState({
        officers: 0,
        paidTickets: 0,
        pendingTickets: 0,
        drivers: 0,
        provisions: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const userName = localStorage.getItem("adminName") || "Admin ";
    const userProfilePic = localStorage.getItem("adminPic") || "https://via.placeholder.com/40";

    const toggleUserDropdown = () => setIsUserDropdownOpen(!isUserDropdownOpen);
    const handleLogout = () => {
        localStorage.clear();
        navigate("/AdminSignUp");
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('adminToken');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const BASE_URL = 'http://localhost:4000';

                const [officersRes, provisionsRes, driversRes, paidFinesRes, pendingFinesRes] = await Promise.all([
                    axios.get(`${BASE_URL}/api/admin/police`, config),
                    axios.get(`${BASE_URL}/api/admin/provisions`, config),
                    axios.get(`${BASE_URL}/api/admin/drivers`, config),
                    axios.get(`${BASE_URL}/api/admin/paid-tickets`, config),
                    axios.get(`${BASE_URL}/api/admin/pending-tickets`, config),
                ]);

                setStats({
                    officers: officersRes.data.length ?? 0,
                    provisions: provisionsRes.data.length ?? 0,
                    drivers: driversRes.data.length ?? 0,
                    paidTickets: paidFinesRes.data.length ?? 0,
                    pendingTickets: pendingFinesRes.data.length ?? 0,
                });
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="bg-gray-800 text-white w-64 py-7 px-2 shadow-lg flex flex-col justify-between">
                <div>
                    <div className="flex flex-col items-center mb-6">
                        <img src={logo} alt="PayFine Logo" className="h-12 w-12 rounded-full border-2 border-white mb-2" />
                        <span className="text-2xl font-semibold">
                            <span className="text-white">Pay</span><span className="text-blue-400">Fine</span>
                        </span>
                    </div>
                    <nav className="space-y-2">
                        <SidebarLink to="/AdminDashboard" label="Dashboard" />
                        <SidebarLink to="/AddPolice" label="Add Police Officer" />
                        <SidebarLink to="/ViewAllPolice" label="View All Officers" />
                        <SidebarLink to="/ProvisionDetails" label="Provision Details" />
                        <SidebarLink to="/ViewAllDrivers" label="View All Drivers" />
                        <SidebarLink to="/PaidFine" label="Paid Fine Tickets" />
                        <SidebarLink to="/PendingFine" label="Pending Fine Tickets" />
                        <SidebarLink to="/AllFine" label="All Fine Tickets" />
                    </nav>
                </div>
                <button onClick={handleLogout} className="block w-full py-2.5 px-4 rounded bg-purple-800 hover:bg-purple-900 text-white mt-4 font-bold">
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

                <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h1 className="text-2xl font-semibold text-blue-800 mb-4">Admin Dashboard Overview</h1>
                        {loading ? (
                            <p>Loading dashboard...</p>
                        ) : error ? (
                            <p className="text-red-600">{error}</p>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <DashboardCard title="Total Officers" value={stats.officers} color="blue" />
                                    <DashboardCard title="Paid Tickets" value={stats.paidTickets} color="green" />
                                    <DashboardCard title="Pending Tickets" value={stats.pendingTickets} color="yellow" />
                                    <DashboardCard title="Total Drivers" value={stats.drivers} color="purple" />
                                    <DashboardCard title="Provisions" value={stats.provisions} color="indigo" />
                                </div>

                                
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                                    
                                    <div className="bg-white p-4 rounded shadow">
                                        <h2 className="text-lg font-semibold text-blue-800 mb-2">Total Users</h2>
                                        <BarChart width={300} height={250} data={[
                                            { name: 'Drivers', value: stats.drivers },
                                            { name: 'Officers', value: stats.officers },
                                        ]}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="value" fill="#8884d8" />
                                        </BarChart>
                                    </div>

                                    
                                    <div className="bg-white p-4 rounded shadow">
                                        <h2 className="text-lg font-semibold text-blue-800 mb-2">Tickets Status</h2>
                                        <PieChart width={250} height={250}>
                                            <Pie data={[
                                                { name: 'Paid', value: stats.paidTickets },
                                                { name: 'Pending', value: stats.pendingTickets },
                                            ]} dataKey="value" cx="50%" cy="50%" outerRadius={80}>
                                                <Cell fill={COLORS[0]} />
                                                <Cell fill={COLORS[1]} />
                                            </Pie>
                                            <Legend />
                                        </PieChart>
                                    </div>

                                    
                                    <div className="bg-white p-4 rounded shadow">
                                        <h2 className="text-lg font-semibold text-blue-800 mb-2">Provisions Overview</h2>
                                        <BarChart width={300} height={250} data={[
                                            { name: 'Total Provisions', value: stats.provisions },
                                        ]}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="value" fill="#82ca9d" />
                                        </BarChart>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

const SidebarLink = ({ to, label }) => (
    <Link to={to} className="block py-2.5 px-4 rounded bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">
        {label}
    </Link>
);

const DashboardCard = ({ title, value, color }) => (
    <div className={`bg-${color}-50 p-4 rounded-lg border border-${color}-200`}>
        <h3 className={`text-lg font-medium text-${color}-800`}>{title}</h3>
        <p className={`text-2xl font-bold mt-2 text-${color}-900`}>{value}</p>
    </div>
);

export default AdminDashboard;
