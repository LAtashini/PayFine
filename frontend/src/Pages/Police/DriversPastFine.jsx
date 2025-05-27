import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';

const DriversPastFine = () => {
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [licenseNumber, setLicenseNumber] = useState('');
    const [pastFines, setPastFines] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [userName, setUserName] = useState('Loading...');
    const userProfilePic = "https://via.placeholder.com/40";

    const toggleUserDropdown = () => {
        setIsUserDropdownOpen(!isUserDropdownOpen);
    };

    useEffect(() => {
        const fetchOfficerAndFines = async () => {
            const policeId = localStorage.getItem("policeId");
            if (!policeId) {
                setUserName("Unknown Officer");
                console.warn("Police ID not found in local storage.");
                return;
            }

            try {
                setLoading(true);
                const res = await fetch(`http://localhost:4000/api/police/profile/${policeId}`);
                const data = await res.json();

                if (res.ok) {
                    const officerName = data?.police?.name || data?.name || "Officer";
                    setUserName(officerName);

                    const finesRes = await fetch(`http://localhost:4000/api/police/reported-fine-by-officer/${encodeURIComponent(officerName)}`);
                    const finesData = await finesRes.json();

                    if (finesRes.ok) {
                        setPastFines(finesData.fines);
                    } else {
                        setError(finesData.message || "Error fetching reported fines.");
                        setPastFines([]);
                    }
                } else {
                    setUserName("Officer");
                    setError(data.message || "Error fetching officer name.");
                    setPastFines([]);
                }
            } catch (error) {
                console.error("Error fetching officer name or fines:", error);
                setUserName("Officer");
                setError("Server error fetching fines.");
                setPastFines([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOfficerAndFines();
    }, []);

    // 🔍 Filter fines based on licenseNumber input
    const filteredFines = licenseNumber
        ? pastFines.filter(fine => fine.licenseId?.toLowerCase().includes(licenseNumber.toLowerCase()))
        : pastFines;

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
                        <Link to="/PoliceDashboard" className="block py-2.5 px-4 rounded transition bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">Dashboard</Link>
                        <Link to="/AddNewFine" className="block py-2.5 px-4 rounded transition bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">Add New Fine</Link>
                        <Link to="/DriversPastFine" className="block py-2.5 px-4 rounded transition bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">Drivers Past Fines</Link>
                        <Link to="/RevenueLicense" className="block py-2.5 px-4 rounded transition bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">Revenue License</Link>
                        {/* <Link to="/ViewReportedFine" className="block py-2.5 px-4 rounded transition bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">View Reported Fine</Link> */}
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
            <div className="flex-1 flex flex-col">
                <header className="bg-purple-900 shadow-sm p-4 flex justify-between items-center">
                    <div>
                        <span className="text-3xl font-bold">
                            <span className="text-white">Pay</span>
                            <span className="text-blue-400">Fine</span>
                        </span>
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
                                <img src={'https://www.w3schools.com/howto/img_avatar.png'} alt="User Profile" className="w-10 h-10 rounded-full" />
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
                    </div>
                </header>

                <main className="flex-1 p-6 bg-gray-300">
                    <h1 className="text-2xl font-semibold text-purple-900 mb-6">Drivers Past Fines</h1>

                    <div className="mb-6">
                        <div className="flex items-center">
                            <input
                                type="text"
                                placeholder="Enter Driving License Number"
                                value={licenseNumber}
                                onChange={(e) => setLicenseNumber(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-700"
                            />
                        </div>
                        {loading && <p className="text-gray-600 mt-2">Loading...</p>}
                        {error && <p className="text-red-600 mt-2">{error}</p>}
                    </div>

                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full">
                            <thead className="bg-purple-900 text-white">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Fine ID</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase">License ID</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Vehicle Number</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Place</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Issued Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredFines.length > 0 ? filteredFines.map((fine, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-purple-700 font-medium">#{fine._referenceNo || fine.referenceNo}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{fine.licenseId}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{fine.vehicleNo}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{fine.place}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{new Date(fine.issuedDate).toLocaleDateString()}</td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="5" className="text-center p-4 text-gray-500">No fines found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DriversPastFine;
