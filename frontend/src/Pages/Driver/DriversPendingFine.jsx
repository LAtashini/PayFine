import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.png';

const DriversPendingFine = () => {
    const [pendingFines, setPendingFines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const userName = "User";
    const userProfilePic = "https://via.placeholder.com/40";
    const [driverInfo, setDriverInfo] = useState({});
    const [name, setName] = useState('Driver');

    useEffect(() => {
        const token = localStorage.getItem('driverToken');
        const licenseId = localStorage.getItem('driverLid');

        if (!token || !licenseId) return;

        const fetchDriverProfile = async () => {
            try {
                const response = await fetch(`http://localhost:4000/api/driver/profile/${licenseId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await response.json();

                if (response.ok) {
                    setName(data.name);
                } else {
                    console.error('Failed to fetch driver profile', data);
                }
            } catch (err) {
                console.error('Error fetching driver profile:', err);
            }
        };

        fetchDriverProfile();
    }, []);

    useEffect(() => {
        const fetchDriverInfo = async () => {
            const token = localStorage.getItem('driverToken');
            const licenseId = localStorage.getItem('driverLid');

            if (!token || !licenseId) {
                alert('You are not logged in. Please sign in again.');
                navigate('/signIn/driver');
                return;
            }

            try {
                const response = await fetch(`http://localhost:4000/api/driver/profile/${licenseId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await response.json();
                if (response.ok) {
                    setDriverInfo(data);
                } else {
                    console.error('Error fetching driver info:', data);
                }
            } catch (err) {
                console.error('Error fetching driver info:', err);
            }
        };

        fetchDriverInfo();
    }, [navigate]);

    const handlePayNowWithPayHere = async (fine) => {
        const token = localStorage.getItem('driverToken');
        try {
            
            const response = await fetch(`http://localhost:4000/api/driver/fine/pay/${fine.referenceNo}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const data = await response.json();
                console.error('Error updating fine status:', data.message);
                alert('Failed to update fine status: ' + (data.message || 'Unknown error'));
                return;
            }

            
            const merchantId = "1230578";
            const returnUrl = "http://localhost:3000/payment-success";
            const cancelUrl = "http://localhost:3000/payment-cancel";
            const notifyUrl = "http://localhost:3000/payhere-notify";

            const firstName = driverInfo.name?.split(" ")[0] || "First";
            const lastName = driverInfo.name?.split(" ").slice(1).join(" ") || "Last";
            const email = driverInfo.email || "example@example.com";
            const phone = driverInfo.phoneNumber || "0770000000";
            const address = driverInfo.Address?.address || "Colombo";

            const orderId = fine.referenceNo;

            const form = document.createElement("form");
            form.method = "POST";
            form.action = "https://sandbox.payhere.lk/pay/checkout";

            const fields = {
                merchant_id: merchantId,
                return_url: returnUrl,
                cancel_url: cancelUrl,
                notify_url: notifyUrl,
                order_id: orderId,
                items: `Fine Payment - ${fine.provision}`,
                amount: fine.amount,
                currency: "LKR",
                first_name: firstName,
                last_name: lastName,
                email: email,
                phone: phone,
                address: address,
                city: "Colombo",
                country: "Sri Lanka",
            };

            Object.entries(fields).forEach(([key, value]) => {
                const input = document.createElement("input");
                input.type = "hidden";
                input.name = key;
                input.value = value;
                form.appendChild(input);
            });

            document.body.appendChild(form);
            form.submit();

        } catch (error) {
            console.error('Error:', error);
            alert('Server error while updating fine status.');
        }
    };

    useEffect(() => {
        const fetchPendingFines = async () => {
            const token = localStorage.getItem('driverToken');
            const licenseId = localStorage.getItem('driverLid');

            if (!token || !licenseId) {
                alert('You are not logged in. Please sign in again.');
                navigate('/signIn/driver');
                return;
            }

            try {
                const response = await fetch(`http://localhost:4000/api/driver/pending/${licenseId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await response.json();

                if (response.ok) {
                    console.log(data);
                    setPendingFines(data);
                } else {
                    console.error('Error fetching pending fines:', data);
                    setPendingFines([]);
                }
            } catch (err) {
                console.error('Error fetching pending fines:', err);
                setPendingFines([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPendingFines();
    }, [navigate]);


    const handlePayNow = (fineId) => {
        alert(`Payment initiated for fine ${fineId}`);
        setPendingFines(pendingFines.filter(fine => fine._id !== fineId));
    };

    const toggleUserDropdown = () => {
        setIsUserDropdownOpen(!isUserDropdownOpen);
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-800"></div>
        </div>
    );

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
                    <nav className="space-y-4">
                        <Link to="/DriverDashboard" className="block py-2.5 px-4 rounded transition duration-200 bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">
                            Dashboard
                        </Link>
                        <Link to="/DriversPendingFine" className="block py-2.5 px-4 rounded transition duration-200 bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">
                            Driver's Pending Fine
                        </Link>
                        <Link to="/DriversPaidFine" className="block py-2.5 px-4 rounded transition duration-200 bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">
                            Driver's Paid Fine
                        </Link>
                        <Link to="/DriverProvisionDetails" className="block py-2.5 px-4 rounded transition duration-200 bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">
                            Provision Details
                        </Link>
                        <Link to="/Notifications" className="block py-2.5 px-4 rounded transition duration-200 bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">
                            Notifications
                        </Link>
                        

                    </nav>
                </div>

                <button
                    onClick={() => {
                        localStorage.removeItem('driverToken');
                        localStorage.removeItem('driverLicenseId');
                        window.location.href = '/';
                    }}
                    className="block w-full py-2.5 px-4 rounded transition duration-200 bg-purple-700 text-white hover:bg-purple-800 text-center font-bold"
                >
                    Logout
                </button>
            </div>


            <div className="flex-1 flex flex-col overflow-auto">

                <header className="bg-purple-900 shadow-sm p-4 flex justify-between items-center">
                    <div className="flex items-center">
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
                            <button
                                onClick={toggleUserDropdown}
                                className="flex items-center focus:outline-none"
                            >
                                <img
                                    src={'https://www.w3schools.com/howto/img_avatar.png'}
                                    alt="User Profile"
                                    className="w-10 h-10 rounded-full"
                                />
                                <span className="ml-2 text-white">{name}</span>
                                <svg
                                    className="w-6 h-6 ml-2 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </button>
                            {isUserDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-slate-400 rounded-md shadow-lg py-1">
                                    <Link
                                        to="/Driverprofile"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-700 hover:text-white"
                                    >
                                        Edit Profile
                                    </Link>
                                    <button
                                        onClick={() => {
                                            localStorage.removeItem('authToken');
                                            window.location.href = '/login';
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-700 hover:text-white"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6 bg-gray-100 overflow-auto">
                    <h1 className="text-2xl font-semibold text-purple-800 mb-6">Pending Fines</h1>

                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference No</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provision</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle No</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issued Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expired Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Court Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (LKR)</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {pendingFines.length > 0 ? (
                                        pendingFines.map((fine) => (
                                            <tr key={fine._id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fine.referenceNo}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fine.provision}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fine.vehicleNo}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Date(fine.issuedDate).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Date(fine.expiredDate).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {fine.courtDate ? new Date(fine.courtDate).toLocaleDateString() : 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fine.amount.toFixed(2)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        onClick={() => handlePayNowWithPayHere(fine)}
                                                        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                                                    >
                                                        Pay Now
                                                    </button>

                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                                                No pending fines found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DriversPendingFine;
