import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logo from '../../assets/images/logo.png';

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

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const policeId = localStorage.getItem("policeId");
                if (!policeId) {
                    console.warn("Police ID not found in local storage.");
                    return;
                }

                // Fetch reported fines data
                const fineResponse = await axios.get(`http://localhost:4000/api/police/reported-fine/${policeId}`);
                console.log("Fetched dashboard data:", fineResponse.data);

                setDashboardMetrics({
                    reportedFineCount: fineResponse.data.count || 0,
                    reportedFineAmount: `LKR ${fineResponse.data.amount || 0}`,
                    policeStation: fineResponse.data.station || "N/A",
                    court: fineResponse.data.court || "N/A"
                });

                // Fetch police profile data
                const profileResponse = await axios.get(`http://localhost:4000/api/police/profile/${policeId}`);
                console.log("Fetched police profile:", profileResponse.data);

                const police = profileResponse.data.police || profileResponse.data;
                setUserName(police.name || "Officer");
                setUserProfilePic(police.profilePic || "https://via.placeholder.com/40");

            } catch (error) {
                console.error("Error fetching police dashboard or profile data:", error);
            }
        };

        fetchDashboardData();
    }, []);

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
                        <Link to="/ViewReportedFine" className="block py-2.5 px-4 rounded bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">
                            View Reported Fine
                        </Link>
                    </nav>
                </div>

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
                <header className="bg-purple-900 shadow-sm p-4 flex justify-between items-center">
                    <div>
                        <span className="text-3xl font-bold text-white">Pay<span className="text-blue-400">Fine</span></span>
                    </div>
                    <div className="relative">
                        <button onClick={toggleUserDropdown} className="flex items-center focus:outline-none">
                            <img
                                src={'https://www.w3schools.com/howto/img_avatar.png'}
                                alt="User Profile"
                                className="w-10 h-10 rounded-full"
                            />
                            <span className="ml-2 text-white">{userName}</span>
                            <svg className="w-6 h-6 ml-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {isUserDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-slate-400 rounded-md shadow-lg py-1">
                                <Link to="/PoliceProfile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-700 hover:text-white">
                                    Edit Profile
                                </Link>
                                <button
                                    onClick={() => {
                                        localStorage.removeItem("authToken");
                                        localStorage.removeItem("policeId");
                                        window.location.href = "/login";
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-700 hover:text-white"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                <main className="flex-1 p-6 bg-gray-300">
                    <h1 className="text-2xl font-semibold text-purple-900 mb-6">Police Dashboard</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        {/* Cards showing fetched data */}
                        <DashboardCard title="Reported Fine Count" value={dashboardMetrics.reportedFineCount} icon="📄" color="blue" />
                        <DashboardCard title="Reported Fine Amount" value={dashboardMetrics.reportedFineAmount} icon="💰" color="green" />
                        <DashboardCard title="Police Station" value={dashboardMetrics.policeStation} icon="🏢" color="purple" />
                        <DashboardCard title="Court" value={dashboardMetrics.court} icon="⚖️" color="yellow" />
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
