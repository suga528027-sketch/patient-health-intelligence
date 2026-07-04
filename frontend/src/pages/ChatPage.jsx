import React, { useState, useRef, useEffect } from 'react';
import { reportService } from '../services/api';

const ChatPage = () => {
    const [messages, setMessages] = useState([
        {
            sender: 'assistant',
            text: 'Hello! I am your AI Patient Health Assistant. Ask me anything about your uploaded medical reports, trends, or comparisons (e.g., "compare my latest fasting glucose" or "did my blood pressure increase?").',
            sources: []
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userQuery = input;
        setInput('');
        
        // Add user message to UI
        setMessages(prev => [...prev, { sender: 'user', text: userQuery, sources: [] }]);
        setLoading(true);

        try {
            const data = await reportService.sendChatMessage(userQuery);
            // Add assistant response to UI
            setMessages(prev => [...prev, {
                sender: 'assistant',
                text: data.answer,
                sources: data.sources || []
            }]);
        } catch (err) {
            console.error("Chat request failed", err);
            setMessages(prev => [...prev, {
                sender: 'assistant',
                text: "I encountered an error trying to process your request. Please ensure the backend server and Qdrant are fully running.",
                sources: []
            }]);
        } finally {
            setLoading(false);
        }
    };

    const formatName = (name) => {
        return name.replace('_', ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
    };

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-4xl h-[calc(100vh-120px)] flex flex-col">
            <div className="bg-white rounded-xl shadow-md border flex-1 flex flex-col overflow-hidden">
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold">Gemini AI Patient Intelligence</h2>
                        <p className="text-xs text-blue-100 mt-0.5">Secure, automated RAG QA over your medical records</p>
                    </div>
                    <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
                    {messages.map((m, index) => {
                        const isAssistant = m.sender === 'assistant';
                        return (
                            <div key={index} className={`flex ${isAssistant ? 'justify-start' : 'justify-end'}`}>
                                <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm border ${
                                    isAssistant 
                                        ? 'bg-white text-gray-800 border-gray-150' 
                                        : 'bg-blue-600 text-white border-blue-500'
                                }`}>
                                    <p className="text-sm whitespace-pre-line leading-relaxed">{m.text}</p>
                                    
                                    {/* Sources rendering */}
                                    {isAssistant && m.sources && m.sources.length > 0 && (
                                        <div className="mt-4 pt-3 border-t border-gray-100">
                                            <div className="text-xs font-bold text-indigo-600 flex items-center gap-1.5 mb-2">
                                                📖 Source References ({m.sources.length}):
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {m.sources.map((src, sIdx) => (
                                                    <div key={sIdx} className="bg-indigo-50 border border-indigo-100 rounded-lg p-2 text-[11px] text-gray-700 max-w-[250px] shadow-sm">
                                                        <div className="font-bold text-indigo-700">
                                                            {formatName(src.reportType)} (ID: {src.reportId})
                                                        </div>
                                                        <div className="text-[10px] text-gray-400 mt-0.5">
                                                            Uploaded: {new Date(src.uploadedAt).toLocaleDateString()}
                                                        </div>
                                                        <div className="text-gray-500 mt-1 italic line-clamp-2">
                                                            "{src.snippet}"
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    
                    {/* Chat Loading */}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-white rounded-2xl p-4 border flex items-center space-x-3 shadow-sm">
                                <div className="flex space-x-1.5">
                                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                                <span className="text-xs text-gray-400 font-medium">Assistant is thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Chat Input */}
                <form onSubmit={handleSend} className="p-4 border-t bg-white flex gap-3">
                    <input 
                        type="text" 
                        value={input} 
                        onChange={e => setInput(e.target.value)}
                        placeholder="Ask about parameters, blood pressure, trend comparison, etc..."
                        className="flex-1 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        disabled={loading}
                        required
                    />
                    <button 
                        type="submit" 
                        disabled={loading || !input.trim()}
                        className={`px-6 py-3 rounded-xl font-bold text-sm text-white transition flex items-center gap-1.5 ${
                            loading || !input.trim() 
                                ? 'bg-gray-300 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                        }`}
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatPage;
