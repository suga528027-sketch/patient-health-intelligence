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
        <div 
            className="relative min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: `linear-gradient(135deg, rgba(15, 35, 68, 0.82) 0%, rgba(10, 25, 47, 0.78) 100%), url('https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=2000&q=80')`
            }}
        >
            {/* Centered Main Split Card */}
            <div className="relative z-10 max-w-4xl w-full grid md:grid-cols-12 rounded-xl overflow-hidden shadow-2xl border border-white/30 backdrop-blur-md">
                {/* Left Panel: Deep Navy Medical Quotes & Philosophy */}
                <div className="md:col-span-5 bg-[#1C355E]/95 text-white p-8 sm:p-9 flex flex-col justify-between space-y-6 relative border-r border-white/10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-white text-[#1C355E] flex items-center justify-center font-bold text-lg shadow-sm">
                                +
                            </div>
                            <div>
                                <span className="font-bold text-xs tracking-wider uppercase text-slate-200 block leading-tight">
                                    Clinical Intelligence
                                </span>
                                <span className="text-[10px] text-slate-300">
                                    Hospital & Diagnostic System
                                </span>
                            </div>
                        </div>

                        <div className="pt-1">
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                                Empowering Longitudinal Patient Care
                            </h2>
                            <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                                Continuous health monitoring transforms reactive treatment into proactive wellness.
                            </p>
                        </div>
                    </div>

                    {/* Medical Quotes */}
                    <div className="space-y-3.5 border-y border-white/15 py-4">
                        <div className="bg-white/10 p-3.5 rounded border border-white/10 space-y-1">
                            <p className="text-xs italic text-slate-100 leading-relaxed">
                                "The greatest medicine of all is teaching people how not to need it."
                            </p>
                            <div className="text-[11px] text-blue-200 font-semibold pt-0.5">
                                — Hippocrates, Father of Medicine
                            </div>
                        </div>

                        <div className="bg-white/10 p-3.5 rounded border border-white/10 space-y-1">
                            <p className="text-xs italic text-slate-100 leading-relaxed">
                                "The good physician treats the disease; the great physician treats the patient who has the disease."
                            </p>
                            <div className="text-[11px] text-blue-200 font-semibold pt-0.5">
                                — Sir William Osler
                            </div>
                        </div>
                    </div>

                    {/* Clinical Feature Tags */}
                    <div className="space-y-1.5 text-xs text-slate-300">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                            <span>Automated Optical Diagnostic Extraction</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-300"></span>
                            <span>Longitudinal Baseline Delta Tracking</span>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Clean Sign In Form */}
                <div className="md:col-span-7 bg-white p-8 sm:p-10 flex flex-col justify-center space-y-6">
                    <div>
                        <div className="text-xs font-bold text-[#1C355E] uppercase tracking-wider mb-1">
                            Secure Portal Authentication
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
                            Sign In to Health Record
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Enter your registered credentials or launch the interactive clinical demo
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
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border border-slate-300 rounded px-3.5 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#1C355E] focus:border-[#1C355E] transition"
                                placeholder="patient@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border border-slate-300 rounded px-3.5 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#1C355E] focus:border-[#1C355E] transition"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-2.5 text-white font-semibold rounded text-sm transition cursor-pointer shadow-xs ${
                                loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#1C355E] hover:bg-[#15294A]'
                            }`}
                        >
                            {loading ? 'Authenticating...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="relative border-t border-slate-200 pt-4">
                        <button
                            type="button"
                            onClick={handleDemoLogin}
                            className="w-full py-2.5 text-[#1C355E] bg-blue-50/80 hover:bg-blue-100 font-bold rounded text-xs border border-blue-200 transition cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
                        >
                            <span>⚡</span>
                            <span>Enter 1-Click Interactive Clinical Demo</span>
                        </button>
                    </div>

                    <div className="text-center pt-1 border-t border-slate-100">
                        <p className="text-xs text-slate-600">
                            Don't have a registered record?{' '}
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
