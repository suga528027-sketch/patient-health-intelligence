import React, { useState, useRef, useEffect } from 'react';
import { reportService } from '../services/api';

const DEFAULT_WELCOME = {
    sender: 'assistant',
    text: `### 👋 Hello! I am your AI Patient Clinical Assistant

I can analyze and answer questions across all your medical records — including **Blood Tests**, **Radiology Scans (X-Ray/CT/MRI)**, **Pathology/Biopsies**, and **Hospital Discharge Summaries**.

**Try asking me:**
- *"What did my chest X-ray show?"*
- *"Explain my thyroid nodule biopsy findings."*
- *"What are my active discharge medications and doses?"*
- *"Compare my latest blood pressure and fasting glucose with my previous test."*`,
    sources: []
};

const SUGGESTED_PROMPTS = [
    "🩻 Explain my Chest X-Ray",
    "🔬 Review Thyroid Biopsy",
    "💊 My Discharge Medications",
    "🩺 Compare Blood Pressure",
    "🩸 Fasting Glucose & HbA1c",
    "🫀 Cholesterol Analysis"
];

const CHAT_STORAGE_KEY = 'healthplatform_chat_messages_v2';

const ChatPage = () => {
    const [messages, setMessages] = useState(() => {
        const stored = localStorage.getItem(CHAT_STORAGE_KEY);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                return [DEFAULT_WELCOME];
            }
        }
        return [DEFAULT_WELCOME];
    });

    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    }, [messages]);

    const handleSend = async (messageText) => {
        const textToSend = (messageText || input).trim();
        if (!textToSend || loading) return;

        setInput('');
        setMessages(prev => [...prev, { sender: 'user', text: textToSend, sources: [] }]);
        setLoading(true);

        try {
            const data = await reportService.sendChatMessage(textToSend);
            setMessages(prev => [...prev, {
                sender: 'assistant',
                text: data.answer || "I have analyzed your medical reports.",
                sources: data.sources || []
            }]);
        } catch (err) {
            console.error("Chat request failed", err);
            setMessages(prev => [...prev, {
                sender: 'assistant',
                text: "I encountered an error trying to process your request. Please ensure the backend server or demo mode is active.",
                sources: []
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleClearChat = () => {
        if (window.confirm("Clear all chat messages?")) {
            setMessages([DEFAULT_WELCOME]);
            localStorage.removeItem(CHAT_STORAGE_KEY);
        }
    };

    const formatName = (name) => {
        return (name || '').replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
    };

    // Simple markdown-to-HTML parser for bullet points, bold text, and tables
    const renderFormattedText = (content) => {
        if (!content) return null;

        const lines = content.split('\n');
        return (
            <div className="space-y-2 text-xs sm:text-sm leading-relaxed">
                {lines.map((line, idx) => {
                    const trimmed = line.trim();

                    // Header 3
                    if (trimmed.startsWith('### ')) {
                        return <h4 key={idx} className="font-extrabold text-sm sm:text-base text-slate-900 mt-2 mb-1">{trimmed.replace('### ', '')}</h4>;
                    }
                    // Header 2
                    if (trimmed.startsWith('## ')) {
                        return <h3 key={idx} className="font-black text-base text-slate-900 mt-2 mb-1">{trimmed.replace('## ', '')}</h3>;
                    }
                    // Bullet point
                    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                        const bulletText = trimmed.substring(2);
                        return (
                            <div key={idx} className="flex items-start gap-2 pl-2">
                                <span className="text-blue-500 font-bold">•</span>
                                <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(bulletText) }} />
                            </div>
                        );
                    }
                    // Numbered list
                    if (/^\d+\.\s/.test(trimmed)) {
                        return (
                            <div key={idx} className="flex items-start gap-2 pl-2 font-medium">
                                <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmed) }} />
                            </div>
                        );
                    }
                    // Table line
                    if (trimmed.startsWith('|')) {
                        if (trimmed.includes('---')) return null;
                        const cells = trimmed.split('|').filter(c => c.trim().length > 0);
                        return (
                            <div key={idx} className="grid grid-cols-4 sm:grid-cols-5 gap-1 bg-slate-100/80 p-1.5 rounded-lg text-[11px] font-medium border border-slate-200">
                                {cells.map((cell, cIdx) => (
                                    <div key={cIdx} className="truncate" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(cell.trim()) }} />
                                ))}
                            </div>
                        );
                    }
                    // Blank line
                    if (!trimmed) {
                        return <div key={idx} className="h-1.5"></div>;
                    }
                    // Paragraph
                    return <p key={idx} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }} />;
                })}
            </div>
        );
    };

    const formatInlineMarkdown = (text) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code class="bg-slate-200 text-slate-800 px-1 rounded text-xs">$1</code>');
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-100px)] flex flex-col space-y-4">
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xl shadow-md">
                        🤖
                    </div>
                    <div>
                        <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
                            Gemini AI Clinical Assistant
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                                Multi-Domain RAG
                            </span>
                        </h2>
                        <p className="text-xs text-slate-500">Query your Lab, Radiology, Pathology & Clinical records</p>
                    </div>
                </div>

                <button
                    onClick={handleClearChat}
                    className="text-xs text-slate-500 hover:text-red-600 font-bold px-3 py-1.5 rounded-lg border border-slate-200 hover:border-red-200 hover:bg-red-50 transition cursor-pointer self-end sm:self-center"
                >
                    🗑 Clear Conversation
                </button>
            </div>

            {/* Suggested Prompt Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
                <span className="font-bold text-slate-500 shrink-0">Suggestions:</span>
                {SUGGESTED_PROMPTS.map((prompt, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleSend(prompt.replace(/^[^\s]+\s/, ''))}
                        className="bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-semibold px-3 py-1.5 rounded-full border border-slate-200 hover:border-blue-300 shadow-2xs transition whitespace-nowrap shrink-0 cursor-pointer"
                    >
                        {prompt}
                    </button>
                ))}
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5 bg-slate-50/50">
                    {messages.map((m, index) => {
                        const isAssistant = m.sender === 'assistant';
                        return (
                            <div key={index} className={`flex ${isAssistant ? 'justify-start' : 'justify-end'} animate-fade-in`}>
                                <div
                                    className={`max-w-[90%] sm:max-w-[80%] rounded-2xl p-4 sm:p-5 shadow-sm border ${
                                        isAssistant
                                            ? 'bg-white text-slate-900 border-slate-200 rounded-tl-sm'
                                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-500 rounded-tr-sm'
                                    }`}
                                >
                                    {isAssistant ? (
                                        renderFormattedText(m.text)
                                    ) : (
                                        <p className="text-xs sm:text-sm font-medium whitespace-pre-line leading-relaxed">
                                            {m.text}
                                        </p>
                                    )}

                                    {/* Sources rendering */}
                                    {isAssistant && m.sources && m.sources.length > 0 && (
                                        <div className="mt-4 pt-3 border-t border-slate-200">
                                            <div className="text-[11px] font-bold text-indigo-700 flex items-center gap-1.5 mb-2">
                                                <span>📖 Verified Source Citations ({m.sources.length}):</span>
                                            </div>
                                            <div className="grid sm:grid-cols-2 gap-2">
                                                {m.sources.map((src, sIdx) => (
                                                    <div
                                                        key={sIdx}
                                                        className="bg-indigo-50/70 border border-indigo-200/80 rounded-xl p-2.5 text-[11px] text-slate-700 shadow-2xs space-y-1"
                                                    >
                                                        <div className="font-extrabold text-indigo-900 flex items-center justify-between">
                                                            <span>{formatName(src.reportType)}</span>
                                                            <span className="text-[10px] text-slate-400 font-normal">Doc #{src.reportId}</span>
                                                        </div>
                                                        <div className="text-[10px] text-slate-500">
                                                            {new Date(src.uploadedAt).toLocaleDateString()}
                                                        </div>
                                                        <div className="text-slate-600 italic line-clamp-2 text-[10px] bg-white/60 p-1.5 rounded border border-indigo-100">
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

                    {loading && (
                        <div className="flex justify-start animate-fade-in">
                            <div className="bg-white rounded-2xl rounded-tl-sm p-4 border border-slate-200 flex items-center space-x-3 shadow-sm">
                                <div className="flex space-x-1.5">
                                    <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2.5 h-2.5 bg-cyan-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                                <span className="text-xs text-slate-500 font-medium">Querying clinical records & Google Gemini...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Form */}
                <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3 sm:p-4 bg-white border-t border-slate-200 flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Ask about X-rays, biopsies, discharge medications, blood tests..."
                        className="flex-1 border border-slate-300 rounded-xl px-4 py-3 text-xs sm:text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className={`px-5 sm:px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white transition flex items-center gap-1.5 cursor-pointer shadow-sm ${
                            loading || !input.trim()
                                ? 'bg-slate-300 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                        }`}
                    >
                        <span>Send</span>
                        <span>➔</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatPage;
