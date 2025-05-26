import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import { Html5QrcodeScanner } from "html5-qrcode";

const AddNewFine = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [formData, setFormData] = useState({
        // Driver Information
        driverName: '',
        address: '',
        licenseNumber: '',
        vehicleClass: '',
        nic: '',

        // Police Information
        officerId: '',
        officerName: '',
        court: '',

        // Date & Time
        issuedDate: new Date().toISOString().split('T')[0],
        issuedTime: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' }),
        expiredDate: '',
        courtDate: '',

        // Fine Information
        place: '',
        vehicleNumber: '',
        provision: '',
        amount: '',
        additionalProvisions: []
    });

    const [provisionsList, setProvisionsList] = useState([
        { name: 'Speeding', amount: '5000' },
        { name: 'Parking Violation', amount: '2000' },
        { name: 'Red Light Violation', amount: '7000' },
        { name: 'Illegal U-Turn', amount: '3000' },
        { name: 'No Seatbelt', amount: '1500' },
        { name: 'Drunk Driving', amount: '25000' }
    ]);

    const [newProvision, setNewProvision] = useState({
        name: '',
        amount: ''
    });


    const [officerName, setOfficerName] = useState('Loading...'); // Default placeholder

    useEffect(() => {
        const fetchOfficerName = async () => {
            const policeId = localStorage.getItem("policeId");
            if (!policeId) {
                console.warn("Police ID missing.");
                setOfficerName("Unknown Officer");
                return;
            }

            try {
                const res = await fetch(`http://localhost:4000/api/police/profile/${policeId}`);
                const data = await res.json();

                if (res.ok) {
                    const name = data?.police?.name || data?.name || "Officer";
                    setOfficerName(name);
                } else {
                    console.warn("Failed to fetch officer name:", data.message);
                    setOfficerName("Officer");
                }
            } catch (err) {
                console.error("Error fetching officer name:", err);
                setOfficerName("Officer");
            }
        };

        fetchOfficerName();
    }, []);

    const toggleUserDropdown = () => {
        setIsUserDropdownOpen(!isUserDropdownOpen);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Auto-fill amount when provision is selected
        if (name === 'provision') {
            const selectedProvision = [...provisionsList, ...formData.additionalProvisions]
                .find(p => p.name === value);
            if (selectedProvision) {
                setFormData(prev => ({
                    ...prev,
                    amount: selectedProvision.amount
                }));
            }
        }
    };



    const handleAddProvision = () => {
        if (newProvision.name && newProvision.amount) {
            const provisionExists = [...provisionsList, ...formData.additionalProvisions]
                .some(p => p.name === newProvision.name);

            if (provisionExists) {
                alert("This provision already exists!");
                return;
            }

            setFormData({
                ...formData,
                additionalProvisions: [...formData.additionalProvisions, newProvision]
            });
            setNewProvision({ name: '', amount: '' });
        }
    };

    const calculateTotalAmount = () => {
        let total = 0;
        if (formData.amount) {
            total += parseInt(formData.amount) || 0;
        }
        formData.additionalProvisions.forEach(provision => {
            total += parseInt(provision.amount) || 0;
        });
        return total;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const totalAmount = calculateTotalAmount();

        const mainAmount = parseInt(formData.amount);

        const policeId = localStorage.getItem("policeId");
        if (!policeId) {
            alert("Police ID missing. Please login again.");
            return;
        }

        if (!formData.licenseNumber || !formData.vehicleNumber) {
            alert("License Number and Vehicle Number are required.");
            return;
        }

        let provisionId = null;
        try {
            const provisionRes = await fetch(`http://localhost:4000/api/police/provisionByName/${encodeURIComponent(formData.provision)}`);


            const provisionData = await provisionRes.json();
            if (provisionRes.ok) {
                provisionId = provisionData._id;
            } else {
                alert(`Provision "${formData.provision}" not found in database.`);
                return;
            }
        } catch (err) {
            console.error("Error fetching provision:", err);
            alert("Error fetching provision from database.");
            return;
        }

        const fineData = {
            referenceNo: `REF-${Date.now()}`,
            policeId: policeId,
            licenseId: formData.licenseNumber,
            driverName: formData.driverName,
            address: formData.address,
            vehicleClass: formData.vehicleClass,
            nic: formData.nic,
            officerName: formData.officerName,
            place: formData.place,
            vehicleNo: formData.vehicleNumber,
            issuedDate: formData.issuedDate,
            issuedTime: formData.issuedTime,
            expiredDate: formData.expiredDate,
            court: formData.court,
            courtDate: formData.courtDate,
            provision: provisionId,
            amount: parseInt(formData.amount),
            additionalProvisions: formData.additionalProvisions,
            totalAmount: totalAmount
        };


        console.log('Submitting processed fine data:', fineData);

        try {
            const response = await fetch('http://localhost:4000/api/police/issue-fine', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(fineData)
            });

            const data = await response.json();
            if (response.ok) {
                alert(`Fine added successfully! Reference No: ${data.fine.referenceNo}`);
            } else {
                console.error('Server response:', data);
                alert(data.message || 'Failed to add fine');
            }
        } catch (err) {
            console.error('Error adding fine:', err);
            alert('Server error. Please try again.');
        }
    };

    const handleScanQR = () => {
        const scanner = new Html5QrcodeScanner(
            "qr-reader",
            { fps: 10, qrbox: 250 },
            false
        );

        scanner.render(
            (decodedText, decodedResult) => {
                console.log("QR Code Scanned:", decodedText);

                // Fix: Split by \n or newline properly
                const lines = decodedText.split(/\\n|\n/);  // Handles both \n or \\n in text
                const formUpdates = {};

                lines.forEach(line => {
                    const [key, value] = line.split(':').map(item => item.trim());
                    if (!key || !value) return; // Skip if no valid key-value

                    switch (key.toLowerCase()) {
                        case 'driversname':
                            formUpdates.driverName = value;
                            break;
                        case 'address':
                            formUpdates.address = value;
                            break;
                        case 'licensenumber':
                            formUpdates.licenseNumber = value;
                            break;
                        case 'classofvehicle':
                            formUpdates.vehicleClass = value;
                            break;
                        case 'nicnumber':
                            formUpdates.nic = value;
                            break;
                        default:
                            console.warn(`Unrecognized key: ${key}`);
                    }
                });

                console.log('Parsed QR data:', formUpdates);

                setFormData((prev) => ({
                    ...prev,
                    ...formUpdates
                }));

                scanner.clear();
                document.getElementById("qr-reader").innerHTML = ""; // Clear scanner
            },
            (errorMessage) => {
                console.warn("QR Scan error:", errorMessage);
            }
        );
    };


    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
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

                    <nav className="space-y-4">
                        <Link to="/PoliceDashboard" className="block py-2.5 px-4 rounded transition duration-200 bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">
                            Dashboard
                        </Link>
                        <Link to="/AddNewFine" className="block py-2.5 px-4 rounded transition duration-200 bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">
                            Add New Fine
                        </Link>
                        <Link to="/DriversPastFine" className="block py-2.5 px-4 rounded transition duration-200 bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">
                            Drivers Past Fines
                        </Link>
                        <Link to="/RevenueLicense" className="block py-2.5 px-4 rounded transition duration-200 bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">
                            Revenue License
                        </Link>
                        <Link to="/ViewReportedFine" className="block py-2.5 px-4 rounded transition duration-200 bg-purple-800 text-white hover:bg-purple-900 text-center font-bold">
                            View Reported Fine
                        </Link>
                    </nav>
                </div>

                {/* Logout Button at the bottom */}
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
                {/* Header */}
                <header className="bg-purple-900 shadow-sm p-4 flex justify-between items-center">
                    <div>
                        {/* Add your logo here */}
                    </div>
                    <div className="relative">
                        <button onClick={toggleUserDropdown} className="flex items-center focus:outline-none">
                            <img
                                src={'https://www.w3schools.com/howto/img_avatar.png'}
                                alt="User Profile"
                                className="w-10 h-10 rounded-full"
                            />
                            <span className="ml-2 text-white">{officerName}</span>
                            <svg className="w-6 h-6 ml-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>
                        {isUserDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                                <Link to="/PolicemanProfile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-100">
                                    Edit Profile
                                </Link>
                                <button
                                    onClick={() => alert('Logout clicked')}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-100"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                {/* Body */}
                <main className="flex-1 p-6 bg-gray-300 overflow-auto">
                    <h1 className="text-2xl font-semibold text-purple-800 mb-6">Add New Fine</h1>
                    {error && <p className="text-red-600">{error}</p>}
                    {loading && <p className="text-gray-700">Submitting...</p>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Driver Information Section */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold text-purple-800 mb-4">Driver Information</h2>

                            <div className="mb-4">
                                <button
                                    type="button"
                                    onClick={handleScanQR}
                                    className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800 flex items-center"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
                                    </svg>
                                    Scan Driver's License QR
                                </button>
                                <div id="qr-reader" style={{ width: "300px" }}></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 mb-2">Driver's Name</label>
                                    <input
                                        type="text"
                                        name="driverName"
                                        value={formData.driverName}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">License Number</label>
                                    <input
                                        type="text"
                                        name="licenseNumber"
                                        value={formData.licenseNumber}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">Class of Vehicle</label>
                                    <input
                                        type="text"
                                        name="vehicleClass"
                                        value={formData.vehicleClass}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">NIC Number</label>
                                    <input
                                        type="text"
                                        name="nic"
                                        value={formData.nic}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Police Information Section */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold text-purple-800 mb-4">Police Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-gray-700 mb-2">Police Officer ID</label>
                                    <input
                                        type="text"
                                        name="officerId"
                                        value={formData.officerId}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">Police Officer's Name</label>
                                    <input
                                        type="text"
                                        name="officerName"
                                        value={formData.officerName}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">Court</label>
                                    <input
                                        type="text"
                                        name="court"
                                        value={formData.court}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Date & Time Section */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold text-purple-800 mb-4">Date & Time</h2>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-gray-700 mb-2">Issued Date</label>
                                    <input
                                        type="date"
                                        name="issuedDate"
                                        value={formData.issuedDate}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">Issued Time</label>
                                    <input
                                        type="time"
                                        name="issuedTime"
                                        value={formData.issuedTime}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">Expired Date</label>
                                    <input
                                        type="date"
                                        name="expiredDate"
                                        value={formData.expiredDate}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">Court Date</label>
                                    <input
                                        type="date"
                                        name="courtDate"
                                        value={formData.courtDate}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Fine Information Section */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold text-purple-800 mb-4">Fine Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-700 mb-2">Place</label>
                                    <input
                                        type="text"
                                        name="place"
                                        value={formData.place}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">Vehicle Number</label>
                                    <input
                                        type="text"
                                        name="vehicleNumber"
                                        value={formData.vehicleNumber}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-700 mb-2">Select Provision</label>
                                    <select
                                        name="provision"
                                        value={formData.provision}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                    >
                                        <option value="">Select a provision</option>
                                        {provisionsList.map((provision, index) => (
                                            <option key={`default-${index}`} value={provision.name}>
                                                {provision.name} (LKR {provision.amount})
                                            </option>
                                        ))}
                                        {formData.additionalProvisions.map((provision, index) => (
                                            <option key={`additional-${index}`} value={provision.name}>
                                                {provision.name} (LKR {provision.amount})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">Amount (LKR)</label>
                                    <input
                                        type="text"
                                        name="amount"
                                        value={formData.amount}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Additional Provisions */}
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Additional Provisions</label>
                                <div className="flex space-x-2 mb-2">
                                    <input
                                        type="text"
                                        placeholder="Provision name"
                                        value={newProvision.name}
                                        onChange={(e) => setNewProvision({ ...newProvision, name: e.target.value })}
                                        className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Amount"
                                        value={newProvision.amount}
                                        onChange={(e) => setNewProvision({ ...newProvision, amount: e.target.value })}
                                        className="w-1/4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddProvision}
                                        className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
                                    >
                                        Add
                                    </button>
                                </div>

                                {formData.additionalProvisions.length > 0 && (
                                    <div className="border rounded p-2">
                                        {formData.additionalProvisions.map((provision, index) => (
                                            <div key={index} className="flex justify-between items-center p-1">
                                                <span>{provision.name} (LKR {provision.amount})</span>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const updated = [...formData.additionalProvisions];
                                                        updated.splice(index, 1);
                                                        setFormData({ ...formData, additionalProvisions: updated });
                                                    }}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Total Amount */}
                            <div className="mt-6 p-4 bg-purple-100 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-purple-800">Total Amount:</span>
                                    <span className="text-xl font-bold text-purple-900">
                                        LKR {calculateTotalAmount()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Submit and Reset Buttons */}
                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={() => {
                                    if (window.confirm("Are you sure you want to reset the form?")) {
                                        setFormData({
                                            driverName: '',
                                            address: '',
                                            licenseNumber: '',
                                            vehicleClass: '',
                                            nic: '',
                                            officerId: '',
                                            officerName: '',
                                            court: '',
                                            issuedDate: new Date().toISOString().split('T')[0],
                                            issuedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                            expiredDate: '',
                                            courtDate: '',
                                            place: '',
                                            vehicleNumber: '',
                                            provision: '',
                                            amount: '',
                                            additionalProvisions: []
                                        });
                                    }
                                }}
                                className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 font-semibold text-lg"
                            >
                                Reset Form
                            </button>
                            <button
                                type="submit"
                                className="bg-yellow-400 text-purple-900 px-6 py-3 rounded-lg hover:bg-purple-300font-semibold text-lg"
                            >
                                Add Fine
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
};

export default AddNewFine;
