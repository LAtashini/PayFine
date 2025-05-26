import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';

const DriverProvisionDetails = () => {
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const userName = "John Doe";
    const userProfilePic = "https://via.placeholder.com/40";
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const [provisionData, setProvisionData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const toggleUserDropdown = () => {
        setIsUserDropdownOpen(!isUserDropdownOpen);
    };

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // const provisionData = [
    //     { fineId: 100, section: 'Section 32', provision: 'Revenue License to be displayed on motor vehicles and produced when required.', amount: 1500.00 },
    //     { fineId: 102, section: 'Section 128B', provision: 'Driving a special purpose vehicle without obtaining a licence.', amount: 1000.00 },
    //     { fineId: 103, section: 'Section 128A', provision: 'Failure to obtain authorization to drive a vehicle loaded with chemicals, hazardous waste, &e.', amount: 2000.00 },
    //     { fineId: 104, section: 'section 130', provision: 'Failure to have a Licence to drive a specific class of vehicles.', amount: 1000.00 },
    //     { fineId: 105, section: 'Section 135', provision: 'Failure to carry a Driving Licence when driving.', amount: 2000.00 },
    //     { fineId: 106, section: 'Section 139A', provision: 'Driving a special purpose vehicle without obtaining a licence', amount: 2000.00 },
    //     { fineId: 107, section: 'Section 148', provision: 'Failure to comply with road rules.', amount: 2000.00 },
    // ];

    const sortedData = React.useMemo(() => {
        let sortableData = [...provisionData];
        if (sortConfig.key) {
            sortableData.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableData;
    }, [provisionData, sortConfig]);


    useEffect(() => {
        const fetchProvisionDetails = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/driver/provisions');
                const data = await response.json();

                if (response.ok) {
                    setProvisionData(data);
                } else {
                    setError(data.message || 'Failed to fetch provisions');
                }
            } catch (err) {
                setError(err.message || 'Server error');
            } finally {
                setLoading(false);
            }
        };

        fetchProvisionDetails();
    }, []);


    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar - matching DriverDashboard exactly */}
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

                {/* Logout Button at the bottom */}
                <button
                    onClick={() => alert('Logout clicked')}
                    className="block w-full py-2.5 px-4 rounded transition duration-200 bg-purple-700 text-white hover:bg-purple-800 text-center font-bold"
                >
                    Logout
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-purple-900 shadow-sm p-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <span className="text-3xl font-bold">
                            <span className="text-white">Pay</span>
                            <span className="text-blue-400">Fine</span>
                        </span>
                    </div> {/* Empty div for balance */}

                    <div className="flex items-center space-x-6">
                        {/* Navigation Links */}
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

                        {/* User Dropdown */}
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
                                    <Link to="/UserProfile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-700 hover:text-white">
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
                    </div>
                </header>

                {/* Body */}
                <main className="flex-1 p-6 bg-gray-300 overflow-auto">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Provision Details</h2>
                        <p className="text-gray-600 italic mb-6">You can sort data here</p>

                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white rounded-lg overflow-hidden">
                                <thead className="bg-purple-800 text-white">
                                    <tr>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                                            onClick={() => requestSort('fineId')}
                                        >
                                            Fine ID
                                            {sortConfig.key === 'fineId' && (
                                                <span className="ml-1">
                                                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                                </span>
                                            )}
                                        </th>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                                            onClick={() => requestSort('section')}
                                        >
                                            Section of Act
                                            {sortConfig.key === 'section' && (
                                                <span className="ml-1">
                                                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                                </span>
                                            )}
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                            Provision
                                        </th>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                                            onClick={() => requestSort('amount')}
                                        >
                                            Fine Amount
                                            {sortConfig.key === 'amount' && (
                                                <span className="ml-1">
                                                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                                </span>
                                            )}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {sortedData.map((item, index) => (
                                        <tr key={item.fineId} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {item.fineId}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {item.section}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {item.provision}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {item.amount.toFixed(2)}
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

export default DriverProvisionDetails;