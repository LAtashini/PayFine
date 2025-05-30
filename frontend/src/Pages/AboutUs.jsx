import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AboutUs = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
                <section className="mb-12">
                    <h2 className="text-3xl font-bold text-purple-800 mb-6">About Our Online Fine Payment System</h2>
                    <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                        The Sri Lanka Police Online Fine Payment System is a digital platform
                        designed to streamline the process of paying traffic fines and other
                        penalties issued by the Sri Lanka Police.
                    </p>

                    <div className="bg-gray-100 p-4 rounded-lg">
                        <p className="text-gray-800">
                            Learn more about the history of Sri Lanka Police: {' '}
                            <a
                                href="https://www.police.lk/?page_id=211"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-3 inline-block bg-purple-900 hover:bg-purple-800 text-white font-medium py-2 px-4 rounded transition duration-300"
                            >
                                Visit Official History Page
                            </a>
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            (Link opens in new tab)
                        </p>
                    </div>
                </section>

                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    
                    <section className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-900 shadow-sm">
                        <div className="mb-4">
                            <h3 className="text-2xl font-bold text-blue-900">Our Vision</h3>
                        </div>
                        <div>
                            <p className="text-gray-700">
                                To become the leading digital platform for law enforcement
                                services in Sri Lanka, providing citizens with seamless access
                                to police services while enhancing transparency and efficiency
                                in fine collection.
                            </p>
                        </div>
                    </section>

            
                    <section className="bg-orange-50 p-6 rounded-lg border-l-4 border-orange-600 shadow-sm">
                        <div className="mb-4">
                            <h3 className="text-2xl font-bold text-orange-700">Our Mission</h3>
                        </div>
                        <div>
                            <p className="text-gray-700 mb-4">
                                Our mission is to leverage technology to simplify the fine
                                payment process, reduce corruption, and improve public trust
                                in law enforcement by providing a secure, user-friendly platform
                                that is accessible to all citizens of Sri Lanka.
                            </p>
                            <ul className="list-disc pl-5 text-gray-700 space-y-2">
                                <li>To digitalize police fine collection processes</li>
                                <li>To provide 24/7 access to fine payment services</li>
                                <li>To ensure transparency in fine collection</li>
                                <li>To reduce queues and waiting times at police stations</li>
                                <li>To integrate with other government digital services</li>
                            </ul>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default AboutUs;
