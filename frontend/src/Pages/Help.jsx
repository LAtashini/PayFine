import React, { useState, useRef, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer'; 

const Help = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const messagesEndRef = useRef(null);


    const automatedResponses = [
        "How can I assist you with your fine payment?",
        "You can pay your fines using credit/debit cards or online banking.",
        "For payment issues, please provide your reference number.",
        "Our support team will get back to you shortly.",
        "Thank you for contacting our support."
    ];

    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
        if (!isChatOpen && messages.length === 0) {
            setMessages([{ text: "Hello! How can we help you today?", sender: 'bot' }]);
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (inputMessage.trim() === '') return;

        const userMessage = { text: inputMessage, sender: 'user' };
        setMessages([...messages, userMessage]);
        setInputMessage('');

        setTimeout(() => {
            const randomResponse = automatedResponses[Math.floor(Math.random() * automatedResponses.length)];
            const botMessage = { text: randomResponse, sender: 'bot' };
            setMessages(prev => [...prev, botMessage]);
        }, 1000);
    };

    return (
        <div className="flex flex-col min-h-screen" style={{ background: 'linear-gradient(to right, #041e42 0%, #ffffff 100%)' }}>
            <Header />

            <main className="flex-grow p-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-white mb-4">Help Center</h1>
                    <p className="text-gray-200 mb-8">Find answers to common questions or get support from our team.</p>

                    <div className="mb-12">
                        <h2 className="text-2xl font-semibold text-white mb-4">Frequently Asked Questions</h2>
                        <div className="space-y-4">
                            <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
                                <h3 className="text-lg font-medium text-white">How do I pay my fine online?</h3>
                                <p className="text-gray-200 mt-2">You can pay your fine by logging into your account and selecting the payment option.</p>
                            </div>
                            <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
                                <h3 className="text-lg font-medium text-white">What payment methods are accepted?</h3>
                                <p className="text-gray-200 mt-2">We accept credit/debit cards, PayPal, and bank transfers.</p>
                            </div>
                            <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
                                <h3 className="text-lg font-medium text-white">How long does payment processing take?</h3>
                                <p className="text-gray-200 mt-2">Payments are typically processed within 1-2 business days.</p>
                            </div>
                        </div>
                    </div>

                
                    <button
                        onClick={toggleChat}
                        className="fixed bottom-8 right-8 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-full shadow-lg transition-colors duration-200 flex items-center z-50"
                    >
                        {isChatOpen ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                Close Chat
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                                </svg>
                                Need Help?
                            </>
                        )}
                    </button>

            
                    {isChatOpen && (
                        <div className="fixed bottom-24 right-8 w-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-50">
                            <div className="bg-puprle-600 text-white p-4 rounded-t-lg flex justify-between items-center">
                                <h3 className="font-semibold text-lg">Support Chat</h3>
                                <button
                                    onClick={toggleChat}
                                    className="text-white hover:text-gray-200 focus:outline-none"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex-1 p-4 overflow-y-auto max-h-96">
                                {messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`mb-3 p-3 rounded-lg max-w-xs ${message.sender === 'bot' ? 'bg-gray-100 text-gray-800 mr-auto' : 'bg-green-100 text-gray-800 ml-auto'}`}
                                    >
                                        {message.text}
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 flex">
                                <input
                                    type="text"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 border border-gray-300 rounded-l-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                <button
                                    type="submit"
                                    className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-r-lg transition-colors duration-200"
                                >
                                    Send
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Help;
