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
        <div className="min-h-[calc(100vh-64px)] bg-[#F8FAFC] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full grid md:grid-cols-12 shadow-sm rounded overflow-hidden border border-slate-300">
                {/* Left Side: Medical Importance & Quotes Banner */}
                <div className="md:col-span-5 bg-[#1C355E] text-white p-8 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded bg-white text-[#1C355E] flex items-center justify-center font-bold text-base shadow-xs">
                                +
                            </div>
                            <span className="font-bold text-sm tracking-wider uppercase text-slate-200">
                                Health Intelligence
                            </span>
                        </div>

                        <div className="pt-2">
                            <h2 className="text-xl font-bold tracking-tight text-white leading-snug">
                                Empowering Longitudinal Patient Care
                            </h2>
                            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                                Continuous health monitoring transforms reactive treatment into proactive wellness.
                            </p>
                        </div>
                    </div>

                    {/* Medical Quotes */}
                    <div className="space-y-4 border-y border-white/15 py-5">
                        <blockquote className="space-y-1.5">
                            <p className="text-xs italic text-slate-200 leading-relaxed">
                                "The greatest medicine of all is teaching people how not to need it."
                            </p>
                            <footer className="text-[11px] font-semibold text-slate-400">
                                — Hippocrates, Father of Medicine
                            </footer>
                        </blockquote>

                        <blockquote className="space-y-1.5 pt-2 border-t border-white/10">
                            <p className="text-xs italic text-slate-200 leading-relaxed">
                                "The good physician treats the disease; the great physician treats the patient who has the disease."
                            </p>
                            <footer className="text-[11px] font-semibold text-slate-400">
                                — Sir William Osler
                            </footer>
                        </blockquote>
                    </div>

                    {/* Clinical Pillars */}
                    <div className="space-y-2 text-xs text-slate-300">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            <span>Automated Optical Diagnostic Extraction</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                            <span>Longitudinal Baseline Delta Tracking</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Sign In Form */}
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
                        <div className="bg-red-50 border-l-4 border-red-600 text-red-800 text-xs p-3 font-medium">
                            {error}
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border border-slate-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#1C355E] focus:border-[#1C355E]"
                                placeholder="patient@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border border-slate-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#1C355E] focus:border-[#1C355E]"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-2.5 text-white font-semibold rounded text-sm transition cursor-pointer shadow-xs ${
                                loading ? 'bg-slate-400' : 'bg-[#1C355E] hover:bg-[#15294A]'
                            }`}
                        >
                            {loading ? 'Authenticating...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="relative border-t border-slate-200 pt-4">
                        <button
                            type="button"
                            onClick={handleDemoLogin}
                            className="w-full py-2 text-[#1C355E] bg-slate-50 hover:bg-slate-100 font-semibold rounded text-xs border border-slate-300 transition cursor-pointer"
                        >
                            Enter 1-Click Interactive Demo
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
