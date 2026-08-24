import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
    const { isAuthenticated, loginAsDemo, backendOnline } = useAuth();
    const navigate = useNavigate();

    const handleTryDemo = () => {
        loginAsDemo();
        navigate('/patient/dashboard');
    };

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Top Notification Banner */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white text-xs sm:text-sm py-2 px-4 text-center font-medium shadow-inner flex items-center justify-center gap-2">
                <span>✨ Powered by <strong>Google Gemini 2.5 Flash</strong> & <strong>Qdrant Vector Engine</strong></span>
                <span className="hidden sm:inline">|</span>
                <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs">
                    <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-400' : 'bg-amber-300 animate-pulse'}`}></span>
                    {backendOnline ? 'Live Backend Connected' : 'Interactive Demo Ready'}
                </span>
            </div>

            {/* Hero Section */}
            <header className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-3xl mx-auto space-y-6">
                        <div className="inline-flex items-center gap-2 bg-blue-100/80 border border-blue-200 text-blue-800 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold shadow-sm">
                            <span>🏥 Intelligent Clinical Intelligence for Patients</span>
                        </div>
                        
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                            Understand Your Medical Reports in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Plain English</span>
                        </h1>
                        
                        <p className="text-lg sm:text-xl text-slate-600 leading-relaxed">
                            Upload complex lab PDFs, track longitudinal biomarker trends over time, compare test differences automatically, and converse with an intelligent clinical RAG assistant.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            {isAuthenticated ? (
                                <Link
                                    to="/patient/dashboard"
                                    className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all text-center flex items-center justify-center gap-2"
                                >
                                    <span>Go to My Dashboard</span>
                                    <span>➔</span>
                                </Link>
                            ) : (
                                <>
                                    <button
                                        onClick={handleTryDemo}
                                        className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-98 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                                    >
                                        <span>⚡ Try Instant 1-Click Demo</span>
                                    </button>
                                    <Link
                                        to="/register"
                                        className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-100 text-slate-800 font-semibold rounded-xl border border-slate-300 shadow-sm transition-all text-center"
                                    >
                                        Create Free Account
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Social proof / stats */}
                        <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto border-t border-slate-200 mt-10">
                            <div>
                                <div className="text-2xl sm:text-3xl font-extrabold text-blue-600">100%</div>
                                <div className="text-xs text-slate-500 font-medium mt-0.5">Automated PDF Parsing</div>
                            </div>
                            <div>
                                <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600">3072-D</div>
                                <div className="text-xs text-slate-500 font-medium mt-0.5">Vector Search Accuracy</div>
                            </div>
                            <div>
                                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">&lt; 1 sec</div>
                                <div className="text-xs text-slate-500 font-medium mt-0.5">Gemini Response Speed</div>
                            </div>
                            <div>
                                <div className="text-2xl sm:text-3xl font-extrabold text-cyan-600">9+</div>
                                <div className="text-xs text-slate-500 font-medium mt-0.5">Key Biomarkers Tracked</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Background decorative blob */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-200/40 via-indigo-200/30 to-cyan-200/40 rounded-full blur-3xl pointer-events-none -z-0"></div>
            </header>

            {/* Core Features Grid */}
            <section className="py-16 bg-white border-y border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <h2 className="text-xs sm:text-sm font-bold text-blue-600 uppercase tracking-wider">End-to-End Capabilities</h2>
                        <p className="text-3xl font-bold text-slate-900 mt-2">Everything You Need to Master Your Health Data</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all hover:-translate-y-1">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl mb-5">
                                📑
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Automated PDF Parsing</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Upload standard clinical PDFs. Our pipeline extracts raw text, tokenizes key biomarkers, and indexes them into semantic vector embeddings.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all hover:-translate-y-1">
                            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-2xl mb-5">
                                🤖
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Gemini Layperson Summaries</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Transforms dense clinical jargon and cryptic ranges into clear, encouraging, layperson-friendly medical explanations with actionable insights.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all hover:-translate-y-1">
                            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl mb-5">
                                ⚖️
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Longitudinal Comparison</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Automatically compares consecutive lab reports, highlighting risk shifts (e.g. +16 mmHg BP increase or +20 mg/dL glucose spike) with color-coded deltas.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all hover:-translate-y-1">
                            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-2xl mb-5">
                                💬
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">RAG Clinical Chatbot</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Ask arbitrary questions about your health history. The assistant performs Qdrant semantic vector search to cite specific report excerpts accurately.
                            </p>
                        </div>

                        {/* Feature 5 */}
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all hover:-translate-y-1">
                            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-2xl mb-5">
                                📈
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Interactive Trend Analytics</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Visualize continuous biomarker trajectories with dual blood pressure curves, glucose progressions, and clinical normal reference range bands.
                            </p>
                        </div>

                        {/* Feature 6 */}
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all hover:-translate-y-1">
                            <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center text-2xl mb-5">
                                📅
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Chronological Health Timeline</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                A single unified timeline mapping out all your checkups, consultations, prescriptions, and lab panels over months and years.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Architecture / Tech Stack Showcase */}
            <section className="py-16 bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Architecture</span>
                        <h2 className="text-3xl font-bold mt-2">Enterprise-Grade Clinical Stack</h2>
                        <p className="text-slate-400 mt-2 text-sm">
                            Built with modern reactive microservices, vector search, and Google GenAI foundation models.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5">
                            <div className="text-cyan-400 font-bold text-sm mb-1">Frontend Layer</div>
                            <div className="text-lg font-bold text-white">React 19 & TailwindCSS</div>
                            <div className="text-xs text-slate-400 mt-2">Vite build, Recharts time-series, Context API state management.</div>
                        </div>

                        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5">
                            <div className="text-blue-400 font-bold text-sm mb-1">Backend REST API</div>
                            <div className="text-lg font-bold text-white">Spring Boot 3.2 (Java 17)</div>
                            <div className="text-xs text-slate-400 mt-2">Spring Security, JWT stateless tokens, Apache PDFBox text extraction.</div>
                        </div>

                        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5">
                            <div className="text-indigo-400 font-bold text-sm mb-1">AI & Vector Store</div>
                            <div className="text-lg font-bold text-white">Gemini 2.5 & Qdrant</div>
                            <div className="text-xs text-slate-400 mt-2">3072-dim embeddings, RAG contextual retrieval, structured JSON prompt synthesis.</div>
                        </div>

                        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5">
                            <div className="text-emerald-400 font-bold text-sm mb-1">Relational Database</div>
                            <div className="text-lg font-bold text-white">PostgreSQL & Docker</div>
                            <div className="text-xs text-slate-400 mt-2">ACID-compliant storage for patient profiles, medical reports, and lab metrics.</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Interactive Demo Call to Action */}
            <section className="py-16 bg-gradient-to-b from-slate-50 to-blue-50">
                <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
                    <div className="inline-block p-3 bg-blue-100 text-blue-600 rounded-2xl text-3xl">
                        🚀
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900">
                        Ready to experience Patient Health Intelligence?
                    </h2>
                    <p className="text-slate-600 text-base max-w-xl mx-auto">
                        Test drive the platform with preloaded realistic lab reports, biomarker trends, and interactive Gemini RAG chat right now.
                    </p>
                    <div className="pt-2 flex flex-col sm:flex-row justify-center gap-4">
                        <button
                            onClick={handleTryDemo}
                            className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer"
                        >
                            Launch Interactive Demo Mode ➔
                        </button>
                        <Link
                            to="/login"
                            className="px-8 py-3.5 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-xl border border-slate-300 shadow-sm transition-all"
                        >
                            Sign In with Existing Account
                        </Link>
                    </div>
                    <p className="text-xs text-slate-400 pt-6">
                        ⚠️ <em>Disclaimer: This application is an educational & proof-of-concept AI health assistant. It does not replace professional medical diagnosis or clinical advice.</em>
                    </p>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
