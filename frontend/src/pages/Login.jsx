import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, loginAsDemo } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await login(email, password);
            navigate('/patient/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid email or password. Please verify credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleDemoLogin = () => {
        loginAsDemo();
        navigate('/patient/dashboard');
    };

    return (
        <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-slate-900">
            {/* High-definition Hospital Architectural Background with Overlay */}
            <div 
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-25 filter scale-105 transition-transform duration-10000"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=2000&q=80')`
                }}
            ></div>

            {/* Deep Navy & Cyan Gradient Vignette Overlays */}
            <div className="absolute inset-0 z-0 bg-gradient-to-tr from-[#0A192F] via-[#102A4E]/90 to-[#0F294A]/80 backdrop-blur-[1.5px]"></div>

            {/* Subtle Animated Medical Pulse Line in background */}
            <div className="absolute top-1/4 left-0 right-0 h-32 opacity-10 pointer-events-none overflow-hidden z-0">
                <svg className="w-full h-full text-cyan-400" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path
                        d="M0,60 L300,60 L320,10 L340,110 L360,40 L380,80 L400,60 L800,60 L820,10 L840,110 L860,40 L880,80 L900,60 L1200,60"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    />
                </svg>
            </div>

            {/* Centered Main Split Card */}
            <div className="relative z-10 max-w-4xl w-full grid md:grid-cols-12 rounded-2xl overflow-hidden shadow-2xl border border-white/20 backdrop-blur-md">
                {/* Left Panel: Deep Navy Medical Quotes & Philosophy */}
                <div className="md:col-span-5 bg-gradient-to-br from-[#1C355E] to-[#0E2344] text-white p-8 sm:p-9 flex flex-col justify-between space-y-6 relative">
                    {/* Watermark Medical Cross */}
                    <div className="absolute -right-8 -bottom-8 w-40 h-40 text-white/5 pointer-events-none select-none text-9xl font-bold flex items-center justify-center">
                        +
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white text-[#1C355E] flex items-center justify-center font-extrabold text-lg shadow-sm">
                                +
                            </div>
                            <div>
                                <span className="font-bold text-xs tracking-wider uppercase text-blue-200 block leading-tight">
                                    Clinical Intelligence
                                </span>
                                <span className="text-[10px] text-slate-300">
                                    Patient Health System
                                </span>
                            </div>
                        </div>

                        <div className="pt-1">
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                                Precision Diagnostics & Preventative Care
                            </h2>
                            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                                Transforming raw medical documents into actionable longitudinal health insights.
                            </p>
                        </div>
                    </div>

                    {/* Creative Quote Cards */}
                    <div className="space-y-3.5">
                        <div className="bg-white/10 hover:bg-white/15 backdrop-blur-sm p-3.5 rounded-xl border border-white/15 transition duration-300 space-y-1.5">
                            <p className="text-xs italic text-slate-100 leading-relaxed">
                                "The greatest medicine of all is teaching people how not to need it."
                            </p>
                            <div className="flex items-center justify-between text-[11px] text-blue-200 font-semibold pt-0.5">
                                <span>— Hippocrates</span>
                                <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded text-slate-200">Father of Medicine</span>
                            </div>
                        </div>

                        <div className="bg-white/10 hover:bg-white/15 backdrop-blur-sm p-3.5 rounded-xl border border-white/15 transition duration-300 space-y-1.5">
                            <p className="text-xs italic text-slate-100 leading-relaxed">
                                "The good physician treats the disease; the great physician treats the patient who has the disease."
                            </p>
                            <div className="flex items-center justify-between text-[11px] text-blue-200 font-semibold pt-0.5">
                                <span>— Sir William Osler</span>
                                <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded text-slate-200">Clinical Pioneer</span>
                            </div>
                        </div>
                    </div>

                    {/* Clinical Feature Tags */}
                    <div className="pt-2 border-t border-white/15 grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                        <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/10">
                            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                            <span>3072-D RAG Vectors</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/10">
                            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                            <span>Longitudinal Tracking</span>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Clean Institutional Sign In Form */}
                <div className="md:col-span-7 bg-white/95 backdrop-blur-lg p-8 sm:p-10 flex flex-col justify-center space-y-6">
                    <div>
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1C355E] uppercase tracking-wider bg-blue-50 border border-blue-200/60 px-2.5 py-1 rounded-full mb-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#1C355E]"></span>
                            <span>Secure Patient Portal</span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
                            Sign In to Health Record
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">
                            Enter your registered credentials or launch the interactive clinical workspace
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-600 text-red-800 text-xs p-3 font-medium rounded-r">
                            {error}
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1C355E] focus:border-transparent transition shadow-2xs"
                                    placeholder="patient@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1C355E] focus:border-transparent transition shadow-2xs"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-2.5 text-white font-semibold rounded-lg text-sm transition cursor-pointer shadow-sm ${
                                loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#1C355E] hover:bg-[#15294A] active:scale-[0.99]'
                            }`}
                        >
                            {loading ? 'Authenticating...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="relative border-t border-slate-200 pt-4">
                        <div className="text-center mb-3">
                            <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider bg-white px-2 relative -top-6">
                                Or Test Drive Instantly
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={handleDemoLogin}
                            className="w-full py-2.5 text-[#1C355E] bg-blue-50/70 hover:bg-blue-100/80 font-bold rounded-lg text-xs border border-blue-200 transition cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
                        >
                            <span>⚡</span>
                            <span>Enter 1-Click Interactive Clinical Demo</span>
                        </button>
                    </div>

                    <div className="text-center pt-2 border-t border-slate-100">
                        <p className="text-xs text-slate-600">
                            Don't have a registered health profile?{' '}
                            <Link to="/register" className="font-semibold text-[#026CB6] hover:underline">
                                Register now
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
