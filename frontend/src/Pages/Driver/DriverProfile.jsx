import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DriverProfile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        profilePicture: "",
        name: "",
        address: "",
        mobileNumber: "",
        licenseNumber: "",
        email: "",
    });
    const [editFields, setEditFields] = useState({
        name: false,
        address: false,
        mobileNumber: false,
        email: false,
    });
    const [editPassword, setEditPassword] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [name, setName] = useState('Driver');
    const token = localStorage.getItem("driverToken");
    const licenseId = localStorage.getItem("driverLid");

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
        const fetchUserData = async () => {
            if (!token || !licenseId) {
                alert("You are not logged in.");
                navigate('/signIn/driver');
                return;
            }

            try {
                const response = await fetch(`http://localhost:4000/api/driver/profile/${licenseId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await response.json();
                if (response.ok) {
                    setUser({
                        profilePicture: data.image || '',
                        name: data.name || '',
                        address: data.Address?.address || '',
                        mobileNumber: data.phoneNumber || '',
                        licenseNumber: data.LicenseNumber || '',
                        email: data.email || '',
                    });
                } else {
                    setError(data.message || 'Failed to fetch profile');
                }
            } catch (err) {
                console.error("Error fetching profile:", err);
                setError("Server error.");
            }
        };

        fetchUserData();
    }, [token, licenseId, navigate]);

    const toggleEditField = (field) => {
        setEditFields((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSave = async () => {
        if (!token || !licenseId) {
            alert("You are not logged in.");
            navigate('/signIn/driver');
            return;
        }

        if (editPassword) {
            if (newPassword !== confirmPassword) {
                alert("New passwords do not match!");
                return;
            }
            try {
                const response = await fetch(`http://localhost:4000/api/driver/change-password/${licenseId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ oldPassword, newPassword })
                });
                const data = await response.json();
                if (!response.ok) {
                    alert(data.message || "Failed to change password");
                    return;
                }
                alert("Password updated successfully!");
            } catch (err) {
                console.error("Error changing password:", err);
                alert("Server error.");
            }
        }

        try {
            const response = await fetch(`http://localhost:4000/api/driver/profile/${licenseId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    name: user.name,
                    Address: { address: user.address },
                    phoneNumber: user.mobileNumber,
                    email: user.email,
                })
            });
            const data = await response.json();
            if (response.ok) {
                alert("Profile updated successfully!");
            } else {
                alert(data.message || "Failed to update profile");
            }
        } catch (err) {
            console.error("Error updating profile:", err);
            alert("Server error.");
        }

        setEditFields({ name: false, address: false, mobileNumber: false, email: false });
        setEditPassword(false);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-slate-400 to-slate-500">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-left">
                <div className="flex justify-center">
                    <img src={user.profilePicture || 'https://www.w3schools.com/howto/img_avatar.png'} alt="Profile" className="w-24 h-24 rounded-full" />
                </div>
                {error && <p className="text-red-500 text-center mt-2">{error}</p>}

                <h2 className="text-center text-2xl font-semibold text-purple-900 my-4">Driver Profile</h2>

                {Object.keys(editFields).map((field, idx) => (
                    <div key={idx} className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                        <div className="flex justify-between items-center">
                            {editFields[field] ? (
                                <input
                                    type={field === "email" ? "email" : "text"}
                                    value={user[field]}
                                    onChange={(e) => setUser({ ...user, [field]: e.target.value })}
                                    className="mt-1 p-2 border border-gray-400 rounded-md w-full"
                                />
                            ) : (
                                <span className="mt-1 p-2 text-gray-800">{user[field]}</span>
                            )}
                            <button
                                onClick={() => toggleEditField(field)}
                                className="ml-2 text-purple-700 hover:text-purple-900 font-medium"
                            >
                                {editFields[field] ? "Cancel" : "Edit"}
                            </button>
                        </div>
                    </div>
                ))}

                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">License Number</label>
                    <span className="mt-1 p-2 text-gray-800">{user.licenseNumber}</span>
                </div>

                {editPassword && (
                    <div className="mt-4 space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Old Password</label>
                        <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="p-2 border border-gray-400 rounded-md w-full" />
                        <label className="block text-sm font-medium text-gray-700">New Password</label>
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="p-2 border border-gray-400 rounded-md w-full" />
                        <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="p-2 border border-gray-400 rounded-md w-full" />
                    </div>
                )}

                <div className="mt-4">
                    <button onClick={() => setEditPassword(!editPassword)} className="text-purple-700 hover:text-purple-900 font-medium">
                        {editPassword ? "Cancel Password Change" : "Change Password"}
                    </button>
                </div>

                <div className="mt-6">
                    <button onClick={handleSave} className="w-full bg-purple-700 text-white font-bold p-2 rounded hover:bg-purple-800">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DriverProfile;
