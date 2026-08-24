import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register, loginAsDemo } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            await register(name, email, password);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed. Email may already be in use.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-slate-900">
            {/* High-definition Hospital Architectural Background with Overlay */}
            <div 
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-25 filter scale-105"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=2000&q=80')`
                }}
            ></div>

            {/* Deep Navy Gradient Vignette */}
            <div className="absolute inset-0 z-0 bg-gradient-to-tr from-[#0A192F] via-[#102A4E]/90 to-[#0F294A]/80 backdrop-blur-[1.5px]"></div>

            {/* Centered Main Split Card */}
            <div className="relative z-10 max-w-4xl w-full grid md:grid-cols-12 rounded-2xl overflow-hidden shadow-2xl border border-white/20 backdrop-blur-md">
                {/* Left Panel: Deep Navy Medical Principles */}
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
                                    Patient Portal
                                </span>
                                <span className="text-[10px] text-slate-300">
                                    Account Creation
                                </span>
                            </div>
                        </div>

                        <div className="pt-1">
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                                Unified Longitudinal Health Dossier
                            </h2>
                            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                                Join your laboratory reports, imaging scans, and pathology evaluations in one place.
                            </p>
                        </div>
                    </div>

                    {/* Creative Quote Card */}
                    <div className="bg-white/10 hover:bg-white/15 backdrop-blur-sm p-4 rounded-xl border border-white/15 transition duration-300 space-y-2">
                        <p className="text-xs italic text-slate-100 leading-relaxed">
                            "Health is a state of complete physical, mental, and social well-being and not merely the absence of disease."
                        </p>
                        <div className="flex items-center justify-between text-[11px] text-blue-200 font-semibold pt-1">
                            <span>— World Health Organization</span>
                            <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded text-slate-200">WHO Charter</span>
                        </div>
                    </div>

                    {/* Security & Isolation Footnote */}
                    <div className="pt-2 border-t border-white/15 text-[11px] text-slate-300 space-y-1">
                        <div className="font-semibold text-white flex items-center gap-1.5">
                            <span className="text-emerald-400">🛡️</span>
                            <span>Patient Data Privacy & Security</span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed">
                            Cryptographically signed tokens and isolated tenant medical vaults.
                        </p>
                    </div>
                </div>

                {/* Right Panel: Registration Form */}
                <div className="md:col-span-7 bg-white/95 backdrop-blur-lg p-8 sm:p-10 flex flex-col justify-center space-y-5">
                    <div>
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1C355E] uppercase tracking-wider bg-blue-50 border border-blue-200/60 px-2.5 py-1 rounded-full mb-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#1C355E]"></span>
                            <span>New Patient Enrollment</span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
                            Create Health Profile
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">
                            Register your account to begin optical document ingestion
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-600 text-red-800 text-xs p-3 font-medium rounded-r">
                            {error}
                        </div>
                    )}

                    <form className="space-y-3.5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Full Name
                            </label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1C355E] focus:border-transparent transition shadow-2xs"
                                placeholder="Alex Morgan"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1C355E] focus:border-transparent transition shadow-2xs"
                                placeholder="patient@example.com"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1C355E] focus:border-transparent transition shadow-2xs"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Confirm
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                            {loading ? 'Creating Profile...' : 'Complete Registration'}
                        </button>
                    </form>

                    <div className="relative border-t border-slate-200 pt-3">
                        <button
                            type="button"
                            onClick={() => { loginAsDemo(); navigate('/patient/dashboard'); }}
                            className="w-full py-2 text-[#1C355E] bg-blue-50/70 hover:bg-blue-100/80 font-bold rounded-lg text-xs border border-blue-200 transition cursor-pointer flex items-center justify-center gap-1.5"
                        >
                            <span>⚡</span>
                            <span>Enter 1-Click Interactive Clinical Demo</span>
                        </button>
                    </div>

                    <div className="text-center pt-1 border-t border-slate-100">
                        <p className="text-xs text-slate-600">
                            Already have an active patient record?{' '}
                            <Link to="/login" className="font-semibold text-[#026CB6] hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
