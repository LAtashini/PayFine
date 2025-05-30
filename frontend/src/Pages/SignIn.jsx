import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminImage from '../assets/images/driverlogin.jpg';
import PoliceImage from '../assets/images/police.jpeg';
import DriverImage from '../assets/images/driverlogin.jpg';
import Header from '../components/Header';
import Footer from '../components/Footer';

const SignIn = () => {
    const { role } = useParams();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegisterRedirect = () => {
        if (role === 'driver') {
            navigate('/SignUp');
        } else if (role === 'admin') {
            navigate('/AdminSignUp');
        } else if (role === 'police') {
            navigate('/PoliceSignUp');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        let endpoint = '';
        if (role === 'driver') endpoint = '/api/driver/login';
        else if (role === 'admin') endpoint = '/api/admin/login';
        else if (role === 'police') endpoint = '/api/police/login';

        try {
            const response = await fetch(`http://localhost:4000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();

            if (response.ok) {
    
                console.log(data)
                const userId = data[role]?._id || data[role]?.id;
                localStorage.setItem(`${role}Token`, data.token);

                localStorage.setItem(`${role}Name`, data[role]?.name || '');
                localStorage.setItem(`${role}Pic`, data[role]?.image || '');
                localStorage.setItem(`${role}Id`, userId);
                if (role === 'police') {
                    localStorage.setItem("policeId", data.officer?.id || data.officer?.policeId || '');
                    localStorage.setItem("policeOfficerName", data.police?.name);

                }
                if (role === 'driver') {
                    localStorage.setItem("driverLid", data.driver?.LicenseNumber);
                    localStorage.setItem("driverNIC", data.driver?.IDNumber || data.driver?.nic);
                }



            
                if (role === 'driver') navigate('/DriverDashboard');
                else if (role === 'police') navigate('/PoliceDashboard');
                else if (role === 'admin') navigate('/AdminDashboard');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Server error. Please try again.');
        }
    };

    const getImageByRole = () => {
        if (role === 'admin') return AdminImage;
        if (role === 'police') return PoliceImage;
        return DriverImage;
    };

    return (
        <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(to right, #041e42 0%, #ffffff 100%)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
            <Header />
            <div className="flex-1 flex items-center justify-center py-8 px-4 mb-8">
                <div className="bg-white rounded-xl shadow-lg flex flex-col md:flex-row overflow-hidden w-full max-w-4xl h-[600px]">
                    <div className="md:w-1/2 relative flex flex-col items-center justify-center p-4">
                        {role === 'police' ? (
                            <div className="flex flex-col items-center justify-center p-4">
                                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg mb-4">
                                    <img src={PoliceImage} alt="Police Profile" className="w-full h-full object-cover" />
                                </div>
                                <h2 className="text-2xl font-bold text-purple-900 text-center">Sri Lanka Traffic Police</h2>
                                <p className="mt-2 text-gray-600 text-center">Official Login Portal</p>
                            </div>
                        ) : (
                            <div className="w-full h-full">
                                <img src={getImageByRole()} alt={`${role} login`} className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>
                    <div className="md:w-1/2 bg-purple-800 text-white p-8 flex flex-col justify-center">
                        <h2 className="text-2xl font-bold text-center mb-6">Sign In as {role.charAt(0).toUpperCase() + role.slice(1)}</h2>
                        {error && <p className="text-red-500 text-center">{error}</p>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 rounded-md bg-white text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                            </div>
                            <div>
                                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 rounded-md bg-white text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                            </div>
                            <div className="text-right">
                                {role === 'police' ? (
                                    <span className="text-sm text-blue-200">Contact Admin if you forgot password</span>
                                ) : (
                                    <button type="button" onClick={() => navigate('/forgot-password')} className="text-sm text-blue-200 hover:underline hover:text-white transition-colors">Forgot Password?</button>
                                )}
                            </div>
                            <button type="submit" className="w-full bg-yellow-400 text-purple-900 font-semibold py-2 rounded-md hover:bg-yellow-300 transition-colors shadow-md">Sign In</button>
                            {role !== 'police' && (
                                <div className="text-center text-sm mt-4">Don't have an account?{' '}<button type="button" onClick={handleRegisterRedirect} className="text-blue-200 hover:underline hover:text-white transition-colors">Register here</button></div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
            <div className="mt-auto"><Footer /></div>
        </div>
    );
};
export default SignIn;
