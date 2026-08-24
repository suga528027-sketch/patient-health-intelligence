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
        <div className="min-h-[calc(100vh-64px)] bg-[#F8FAFC] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full grid md:grid-cols-12 shadow-sm rounded overflow-hidden border border-slate-300">
                {/* Left Side: Medical Importance & Philosophy */}
                <div className="md:col-span-5 bg-[#1C355E] text-white p-8 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded bg-white text-[#1C355E] flex items-center justify-center font-bold text-base shadow-xs">
                                +
                            </div>
                            <span className="font-bold text-sm tracking-wider uppercase text-slate-200">
                                Patient Onboarding
                            </span>
                        </div>

                        <div className="pt-2">
                            <h2 className="text-xl font-bold tracking-tight text-white leading-snug">
                                Your Centralized Health Record
                            </h2>
                            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                                Connect clinical blood tests, imaging radiographs, biopsies, and hospital discharges in one secure platform.
                            </p>
                        </div>
                    </div>

                    {/* Medical Quote */}
                    <div className="space-y-4 border-y border-white/15 py-5">
                        <blockquote className="space-y-1.5">
                            <p className="text-xs italic text-slate-200 leading-relaxed">
                                "Health is a state of complete physical, mental, and social well-being and not merely the absence of disease."
                            </p>
                            <footer className="text-[11px] font-semibold text-slate-400">
                                — World Health Organization (WHO)
                            </footer>
                        </blockquote>
                    </div>

                    {/* Privacy notice */}
                    <div className="text-xs text-slate-300 space-y-1">
                        <div className="font-semibold text-white">Patient Data Protection</div>
                        <p className="text-[11px] text-slate-400">
                            Encrypted 256-bit authentication and strict patient-isolated clinical indexing.
                        </p>
                    </div>
                </div>

                {/* Right Side: Registration Form */}
                <div className="md:col-span-7 bg-white p-8 sm:p-10 flex flex-col justify-center space-y-5">
                    <div>
                        <div className="text-xs font-bold text-[#1C355E] uppercase tracking-wider mb-1">
                            New Account Creation
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
                            Create Patient Profile
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Register your credentials to start uploading clinical documents
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-600 text-red-800 text-xs p-3 font-medium">
                            {error}
                        </div>
                    )}

                    <form className="space-y-3.5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border border-slate-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#1C355E] focus:border-[#1C355E]"
                                placeholder="Alex Morgan"
                            />
                        </div>

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

                        <div className="grid grid-cols-2 gap-3">
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
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Confirm
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full border border-slate-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#1C355E] focus:border-[#1C355E]"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-2.5 text-white font-semibold rounded text-sm transition cursor-pointer shadow-xs ${
                                loading ? 'bg-slate-400' : 'bg-[#1C355E] hover:bg-[#15294A]'
                            }`}
                        >
                            {loading ? 'Creating Record...' : 'Complete Registration'}
                        </button>
                    </form>

                    <div className="relative border-t border-slate-200 pt-3">
                        <button
                            type="button"
                            onClick={() => { loginAsDemo(); navigate('/patient/dashboard'); }}
                            className="w-full py-2 text-[#1C355E] bg-slate-50 hover:bg-slate-100 font-semibold rounded text-xs border border-slate-300 transition cursor-pointer"
                        >
                            Enter 1-Click Interactive Demo
                        </button>
                    </div>

                    <div className="text-center pt-1 border-t border-slate-100">
                        <p className="text-xs text-slate-600">
                            Already registered?{' '}
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
