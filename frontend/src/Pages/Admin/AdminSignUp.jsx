import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import adminImage from '../../assets/images/driverregister.png';

const AdminSignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        NIC: '',
        address: '',
        PoliceStation: '',
        gender: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:4000/api/admin/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                // Save token in localStorage under a consistent key
                localStorage.setItem('adminToken', data.token);
                alert('Admin registered successfully!');
                navigate('/AdminDashboard');
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError('Something went wrong. Please try again.');
        }
    };

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{
                background: 'linear-gradient(to right, #041e42 0%, #ffffff 100%)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
            }}
        >
            <Header />

            <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8">
                    <div className="hidden md:flex md:w-2/5 items-center justify-center">
                        <img src={adminImage} alt="Admin signing up" className="w-full h-auto max-h-[600px] object-contain" />
                    </div>

                    <div className="w-full md:w-3/5">
                        <div className="bg-purple-800 rounded-lg shadow-md p-6 h-full">
                            <h2 className="text-2xl font-bold text-white mb-6 text-center">Admin Registration</h2>
                            {error && <p className="text-red-400">{error}</p>}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-950">Personal Information</h3>
                                    <div>
                                        <label htmlFor="name" className="block text-sm text-black mb-1">Full Name*</label>
                                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-500 rounded-md" />
                                    </div>
                                    <div>
                                        <label htmlFor="NIC" className="block text-sm text-black mb-1">NIC Number*</label>
                                        <input type="text" id="NIC" name="NIC" value={formData.NIC} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-500 rounded-md" />
                                    </div>
                                    <div>
                                        <label htmlFor="address" className="block text-sm text-black mb-1">Address*</label>
                                        <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-500 rounded-md" />
                                    </div>
                                    <div>
                                        <label htmlFor="PoliceStation" className="block text-sm text-black mb-1">Police Station*</label>
                                        <input type="text" id="PoliceStation" name="PoliceStation" value={formData.PoliceStation} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-500 rounded-md" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-black mb-1">Gender*</label>
                                        <div className="flex space-x-4">
                                            {['male', 'female', 'other'].map(option => (
                                                <label key={option} className="inline-flex items-center">
                                                    <input type="radio" name="gender" value={option} checked={formData.gender === option} onChange={handleChange} required />
                                                    <span className="ml-2 text-black">{option.charAt(0).toUpperCase() + option.slice(1)}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-950">Account Information</h3>
                                    <div>
                                        <label htmlFor="email" className="block text-sm text-black mb-1">Email*</label>
                                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-500 rounded-md" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="password" className="block text-sm text-black mb-1">Password*</label>
                                            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required minLength={8} className="w-full px-3 py-2 border border-gray-500 rounded-md" />
                                        </div>
                                        <div>
                                            <label htmlFor="confirmPassword" className="block text-sm text-black mb-1">Confirm Password*</label>
                                            <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required minLength={8} className="w-full px-3 py-2 border border-gray-500 rounded-md" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-6">
                                    <span className="text-sm text-white">
                                        Already have an account?{' '}
                                        <button type="button" onClick={() => navigate('/signin/admin')} className="text-blue-200 hover:underline hover:text-white">Sign in</button>
                                    </span>
                                    <button type="submit" className="px-4 py-2 bg-yellow-400 text-purple-900 font-semibold rounded-md hover:bg-yellow-300">
                                        Register
                                    </button>
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

export default AdminSignUp;
