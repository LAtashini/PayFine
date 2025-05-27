import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logo from '../../assets/images/logo.png';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, Legend, ResponsiveContainer } from 'recharts';

const PoliceDashboard = () => {
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [userName, setUserName] = useState("Officer");
    const [userProfilePic, setUserProfilePic] = useState("https://via.placeholder.com/40");
    const [dashboardMetrics, setDashboardMetrics] = useState({
        reportedFineCount: 0,
        reportedFineAmount: "LKR 0",
        policeStation: "N/A",
        court: "N/A"
    });
    const [fines, setFines] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const policeId = localStorage.getItem("policeId");
                if (!policeId) {
                    console.warn("Police ID not found in local storage.");
                    return;
                }

                const profileResponse = await axios.get(`http://localhost:4000/api/police/profile/${policeId}`);
                const police = profileResponse.data.police || profileResponse.data;
                const officerName = police.name || "Officer";
                const station = police.station || "N/A";
                const court = police.court || "N/A";

                setUserName(officerName);
                setUserProfilePic(police.profilePic || "https://via.placeholder.com/40");

                const finesResponse = await axios.get(`http://localhost:4000/api/police/reported-fine-by-officer/${encodeURIComponent(officerName)}`);
                const officerFines = finesResponse.data.fines || [];
                const totalAmount = officerFines.reduce((sum, fine) => sum + (fine.totalAmount || fine.amount || 0), 0);

                setFines(officerFines);
                setDashboardMetrics({
                    reportedFineCount: officerFines.length,
                    reportedFineAmount: `LKR ${totalAmount}`,
                    policeStation: station,
                    court: court
                });
            } catch (error) {
                console.error("Error fetching police dashboard or profile data:", error);
            }
        };

        fetchDashboardData();
    }, []);

    const toggleUserDropdown = () => {
        setIsUserDropdownOpen(!isUserDropdownOpen);
    };

    // Prepare chart data
    const statusCounts = fines.reduce((acc, fine) => {
        acc[fine.status] = (acc[fine.status] || 0) + 1;
        return acc;
    }, {});
    const pieData = Object.keys(statusCounts).map(status => ({
        name: status,
        value: statusCounts[status]
    }));

    const dateCounts = fines.reduce((acc, fine) => {
        const date = new Date(fine.issuedDate).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});
    const barData = Object.keys(dateCounts).map(date => ({
        date,
        count: dateCounts[date]
    }));

    const dateAmount = fines.reduce((acc, fine) => {
        const date = new Date(fine.issuedDate).toLocaleDateString();
        acc[date] = (acc[date] || 0) + (fine.totalAmount || fine.amount || 0);
        return acc;
    }, {});
    const lineData = Object.keys(dateAmount).map(date => ({
        date,
        amount: dateAmount[date]
    }));

    const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1'];

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
                        <Link to="/PoliceDashboard" className="block py-2.5 px-4 rounded bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">
                            Dashboard
                        </Link>
                        <Link to="/AddNewFine" className="block py-2.5 px-4 rounded bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">
                            Add New Fine
                        </Link>
                        <Link to="/DriversPastFine" className="block py-2.5 px-4 rounded bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">
                            Drivers Past Fines
                        </Link>
                        <Link to="/RevenueLicense" className="block py-2.5 px-4 rounded bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">
                            Revenue License
                        </Link>
                    </nav>
                </div>
                <button
                    onClick={() => {
                        localStorage.removeItem("authToken");
                        localStorage.removeItem("policeId");
                        window.location.href = "/";
                    }}
                    className="block w-full py-2.5 px-4 rounded bg-purple-700 text-white hover:bg-purple-800 text-center font-bold"
                >
                    Logout
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-auto">
                <header className="bg-purple-900 shadow-sm p-4 flex justify-between items-center">
                    <div>
                        <span className="text-3xl font-bold text-white">Pay<span className="text-blue-400">Fine</span></span>
                    </div>
                    <div className="flex items-center space-x-6">
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
                                <div className="absolute right-0 mt-2 w-48 bg-slate-400 rounded-md shadow-lg py-1">
                                    <Link to="/PoliceProfile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-700 hover:text-white">
                                        Edit Profile
                                    </Link>
                                    <button onClick={() => { localStorage.clear(); window.location.href = "/login"; }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-700 hover:text-white">
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6 bg-gray-300">
                    <h1 className="text-2xl font-semibold text-purple-900 mb-6">Police Dashboard</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 h-40">
                        <DashboardCard title="Reported Fine Count" value={dashboardMetrics.reportedFineCount} icon="📄" color="blue" />
                        <DashboardCard title="Reported Fine Amount" value={dashboardMetrics.reportedFineAmount} icon="💰" color="green" />
                        <DashboardCard title="Police Station" value={dashboardMetrics.policeStation} icon="🏢" color="purple" />
                        <DashboardCard title="Court" value={dashboardMetrics.court} icon="⚖️" color="yellow" />
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="bg-white p-4 rounded shadow-md">
                            <h2 className="text-lg font-semibold text-center mb-4">Fines by Status</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="bg-white p-4 rounded shadow-md">
                            <h2 className="text-lg font-semibold text-center mb-4">Fines Issued Over Time</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={barData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="bg-white p-4 rounded shadow-md">
                            <h2 className="text-lg font-semibold text-center mb-4">Fine Amount Over Time</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={lineData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="amount" stroke="#82ca9d" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

const DashboardCard = ({ title, value, icon, color }) => (
    <div className={`bg-white p-6 rounded-lg shadow-md flex items-center`}>
        <div className={`bg-${color}-100 p-3 rounded-full`}>
            <span className="text-2xl">{icon}</span>
        </div>
        <div className="ml-4">
            <p className="text-gray-600">{title}</p>
            <p className={`text-2xl font-bold text-${color}-900`}>{value}</p>
        </div>
    </div>
);

export default PoliceDashboard;
