import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import driverImage from '../../assets/images/driverregister.png';

const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        address: '',
        licenseNumber: '',
        licenseIssedDate: '',
        licenseExpiredDate: '',
        idNumber: '',
        phoneNumber: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password.trim() !== formData.confirmPassword.trim()) {
            setError("Passwords do not match");
            return;
        }

        const payload = {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
            Address: { address: formData.address },
            LicenseNumber: formData.licenseNumber,
            LicenseIssedDate: formData.licenseIssedDate,
            LicenseExpiredDate: formData.licenseExpiredDate,
            IDNumber: formData.idNumber,
            phoneNumber: formData.phoneNumber
        };

        try {
            const response = await fetch('http://localhost:4000/api/driver/dregister', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('driverToken', data.token);
                localStorage.setItem('driverLicenseId', data.driver.LicenseNumber);
                localStorage.setItem('driverName', data.driver.name);
                alert('Registration successful! Redirecting to dashboard.');
                navigate('/DriverDashboard');
            } else {
                console.error('Server response:', data);
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError('Server error. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(to right, #041e42 0%, #ffffff 100%)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
            <Header />
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8">
                    <div className="hidden md:flex md:w-2/5 items-center justify-center">
                        <img src={driverImage} alt="Driver signing up" className="w-full h-auto max-h-[600px] object-contain" />
                    </div>
                    <div className="w-full md:w-3/5">
                        <div className="bg-purple-800 rounded-lg shadow-md p-6 h-full">
                            <h2 className="text-2xl font-bold text-white mb-6 text-center">Driver Registration</h2>
                            {error && <p className="text-red-500">{error}</p>}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-950">Personal Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-950" />
                                        <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-950" />
                                    </div>
                                    <input type="text" name="idNumber" placeholder="NIC Number" value={formData.idNumber} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-950" />
                                    <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-950" />
                                    <input type="tel" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-950" />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-950">License Information</h3>
                                    <input type="text" name="licenseNumber" placeholder="License Number" value={formData.licenseNumber} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-950" />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input type="date" name="licenseIssedDate" placeholder="Issue Date" value={formData.licenseIssedDate} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-950" />
                                        <input type="date" name="licenseExpiredDate" placeholder="Expiry Date" value={formData.licenseExpiredDate} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-950" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-950">Account Information</h3>
                                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-950" />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-950" />
                                        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-950" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-6">
                                    <span className="text-sm text-white">Already have an account? <button type="button" onClick={() => navigate('/signIn/driver')} className="text-blue-200 hover:underline">Sign in</button></span>
                                    <button type="submit" className="px-4 py-2 bg-yellow-400 text-purple-900 font-semibold rounded-md">Register</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};
export default SignUp;
