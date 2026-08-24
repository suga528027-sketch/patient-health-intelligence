import React, { useState, useRef, useEffect } from 'react';
import { reportService } from '../services/api';

const DEFAULT_WELCOME = {
    sender: 'assistant',
    text: `### Clinical Decision Support & AI Consultation Assistant

This system synthesizes information across all verified clinical documents in your record — including **Laboratory Chemistry**, **Diagnostic Imaging (Radiology)**, **Pathology / Histopathology**, and **Inpatient Hospital Summaries**.

**Suggested Inquiries:**
- *"Summarize findings from my recent chest radiograph."*
- *"Explain the microscopic diagnosis of my thyroid biopsy."*
- *"List active discharge medications, dosages, and administration schedule."*
- *"Compare blood pressure and fasting glucose trends across consecutive panels."*`,
    sources: []
};

const SUGGESTED_PROMPTS = [
    "Explain my Chest X-Ray",
    "Review Thyroid Biopsy",
    "Active Discharge Medications",
    "Compare Blood Pressure",
    "Fasting Glucose & HbA1c",
    "Lipid Profile Analysis"
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
                text: data.answer || "I have completed the clinical analysis of your records.",
                sources: data.sources || []
            }]);
        } catch (err) {
            console.error("Chat request failed", err);
            setMessages(prev => [...prev, {
                sender: 'assistant',
                text: "An error occurred while communicating with the clinical RAG engine. Please ensure network connectivity.",
                sources: []
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleClearChat = () => {
        if (window.confirm("Reset consultation transcript?")) {
            setMessages([DEFAULT_WELCOME]);
            localStorage.removeItem(CHAT_STORAGE_KEY);
        }
    };

    const formatName = (name) => {
        return (name || '').replace(/_/g, ' ');
    };

    // Simple markdown-to-HTML parser for headers, bullet points, bold text, and tables
    const renderFormattedText = (content) => {
        if (!content) return null;

        const lines = content.split('\n');
        return (
            <div className="space-y-2 text-xs sm:text-sm leading-relaxed text-slate-800">
                {lines.map((line, idx) => {
                    const trimmed = line.trim();

                    // Header 3
                    if (trimmed.startsWith('### ')) {
                        return <h4 key={idx} className="font-bold text-sm sm:text-base text-[#0F172A] mt-2 mb-1">{trimmed.replace('### ', '')}</h4>;
                    }
                    // Header 2
                    if (trimmed.startsWith('## ')) {
                        return <h3 key={idx} className="font-bold text-base text-[#0F172A] mt-2 mb-1">{trimmed.replace('## ', '')}</h3>;
                    }
                    // Bullet point
                    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                        const bulletText = trimmed.substring(2);
                        return (
                            <div key={idx} className="flex items-start gap-2 pl-2">
                                <span className="text-[#1C355E] font-bold">•</span>
                                <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(bulletText) }} />
                            </div>
                        );
                    }
                    // Numbered list
                    if (/^\d+\.\s/.test(trimmed)) {
                        return (
                            <div key={idx} className="flex items-start gap-2 pl-2">
                                <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmed) }} />
                            </div>
                        );
                    }
                    // Table line
                    if (trimmed.startsWith('|')) {
                        if (trimmed.includes('---')) return null;
                        const cells = trimmed.split('|').filter(c => c.trim().length > 0);
                        return (
                            <div key={idx} className="grid grid-cols-4 sm:grid-cols-5 gap-1 bg-slate-50 p-2 rounded border border-slate-200 text-[11px] font-medium text-slate-700">
                                {cells.map((cell, cIdx) => (
                                    <div key={cIdx} className="truncate" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(cell.trim()) }} />
                                ))}
                            </div>
                        );
                    }
                    // Blank line
                    if (!trimmed) {
                        return <div key={idx} className="h-1"></div>;
                    }
                    // Paragraph
                    return <p key={idx} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }} />;
                })}
            </div>
        );
    };

    const formatInlineMarkdown = (text) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 font-bold">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code class="bg-slate-100 text-slate-800 px-1 py-0.5 rounded text-xs border border-slate-300">$1</code>');
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Header Banner */}
            <div className="bg-[#1C355E] text-white py-6 px-4 sm:px-6 lg:px-8 border-b border-[#15294A]">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                            Retrieval-Augmented Clinical Intelligence
                        </div>
                        <h1 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                            Clinical AI Consultation Assistant
                        </h1>
                        <p className="text-xs text-slate-200 mt-0.5">
                            Cross-modal semantic reasoning over laboratory, radiology, pathology, and clinical records
                        </p>
                    </div>

                    <button
                        onClick={handleClearChat}
                        className="text-xs text-slate-200 hover:text-white font-medium px-3 py-1.5 rounded border border-white/30 hover:bg-white/10 transition cursor-pointer self-start sm:self-center"
                    >
                        Reset Transcript
                    </button>
                </div>
            </div>

            {/* Chat Workspace */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
                {/* Suggested Inquiries Chips */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                    <span className="font-semibold text-slate-500 shrink-0">Sample Inquiries:</span>
                    {SUGGESTED_PROMPTS.map((prompt, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleSend(prompt)}
                            className="bg-white hover:bg-slate-100 text-slate-700 font-medium px-3 py-1.5 rounded border border-slate-300 shadow-2xs transition whitespace-nowrap shrink-0 cursor-pointer"
                        >
                            {prompt}
                        </button>
                    ))}
                </div>

                {/* Chat Message Window */}
                <div className="bg-white rounded border border-slate-300 shadow-xs flex flex-col h-[calc(100vh-280px)] overflow-hidden">
                    <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5 bg-[#F8FAFC]">
                        {messages.map((m, index) => {
                            const isAssistant = m.sender === 'assistant';
                            return (
                                <div key={index} className={`flex ${isAssistant ? 'justify-start' : 'justify-end'} animate-fade-in`}>
                                    <div
                                        className={`max-w-[90%] sm:max-w-[80%] rounded p-4 sm:p-5 border ${
                                            isAssistant
                                                ? 'bg-white text-slate-800 border-slate-300 shadow-2xs'
                                                : 'bg-[#1C355E] text-white border-[#15294A] shadow-xs'
                                        }`}
                                    >
                                        {isAssistant ? (
                                            renderFormattedText(m.text)
                                        ) : (
                                            <p className="text-xs sm:text-sm font-medium whitespace-pre-line leading-relaxed">
                                                {m.text}
                                            </p>
                                        )}

                                        {/* Source citations */}
                                        {isAssistant && m.sources && m.sources.length > 0 && (
                                            <div className="mt-4 pt-3 border-t border-slate-200">
                                                <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                                                    Clinical Evidence Citations ({m.sources.length}):
                                                </div>
                                                <div className="grid sm:grid-cols-2 gap-2">
                                                    {m.sources.map((src, sIdx) => (
                                                        <div
                                                            key={sIdx}
                                                            className="bg-slate-50 border border-slate-300 rounded p-2.5 text-[11px] text-slate-700 space-y-1"
                                                        >
                                                            <div className="font-bold text-[#0F172A] flex items-center justify-between">
                                                                <span>{formatName(src.reportType)}</span>
                                                                <span className="text-[10px] text-slate-400 font-normal">Record #{src.reportId}</span>
                                                            </div>
                                                            <div className="text-[10px] text-slate-500">
                                                                Dated: {new Date(src.uploadedAt).toLocaleDateString()}
                                                            </div>
                                                            <div className="text-slate-600 italic line-clamp-2 text-[10px] bg-white p-1.5 rounded border border-slate-200">
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
                                <div className="bg-white rounded p-4 border border-slate-300 flex items-center space-x-3 shadow-2xs">
                                    <div className="w-4 h-4 border-2 border-[#1C355E] border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-xs text-slate-600 font-medium">Cross-referencing clinical documents...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Bar */}
                    <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3 sm:p-4 bg-white border-t border-slate-200 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Type a clinical question (e.g. review chest X-ray findings, explain biopsy, list medications)..."
                            className="flex-1 border border-slate-300 rounded px-4 py-2.5 text-xs sm:text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#1C355E] focus:border-[#1C355E]"
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className={`px-5 py-2.5 rounded font-semibold text-xs sm:text-sm text-white transition flex items-center gap-1.5 cursor-pointer ${
                                loading || !input.trim()
                                    ? 'bg-slate-300 cursor-not-allowed'
                                    : 'bg-[#1C355E] hover:bg-[#15294A]'
                            }`}
                        >
                            <span>Submit</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
