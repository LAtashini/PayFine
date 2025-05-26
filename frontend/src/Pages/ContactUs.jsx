import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import contactImage from '../assets/images/contactus.jpg'; // Make sure this image exists

const ContactUs = () => {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Contact form submitted');
        alert('Your message has been sent successfully!');
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

            <div className="flex-1 flex items-center justify-center py-8 px-4 mb-8">
                <div className="bg-white rounded-xl shadow-lg flex flex-col md:flex-row overflow-hidden w-full max-w-4xl h-[600px]">
                    {/* Left Image section - No background color */}
                    <div className="md:w-1/2 flex items-center justify-center p-8">
                        <img
                            src={contactImage}
                            alt="Contact us"
                            className="w-full h-full object-contain"
                        />
                    </div>

                    {/* Right Form section */}
                    <div className="md:w-1/2 bg-purple-800 text-white p-8 flex flex-col justify-center">
                        <h2 className="text-2xl font-bold text-center mb-6">Contact Us</h2>
                        <p className="text-center mb-6">
                            Have questions? Send us a message and we'll respond promptly.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Name*"
                                        required
                                        className="w-full px-4 py-2 rounded-md bg-white text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="email"
                                        placeholder="Email*"
                                        required
                                        className="w-full px-4 py-2 rounded-md bg-white text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    />
                                </div>
                            </div>

                            <div>
                                <input
                                    type="text"
                                    placeholder="Subject*"
                                    required
                                    className="w-full px-4 py-2 rounded-md bg-white text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                />
                            </div>

                            <div>
                                <textarea
                                    placeholder="Your Message*"
                                    rows="4"
                                    required
                                    className="w-full px-4 py-2 rounded-md bg-white text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-yellow-400 text-purple-900 font-semibold py-2 rounded-md hover:bg-yellow-300 transition-colors shadow-md"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="mt-auto">
                <Footer />
            </div>
        </div>
    );
};

export default ContactUs;