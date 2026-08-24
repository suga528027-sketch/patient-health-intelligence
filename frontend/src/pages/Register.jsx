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
        <div 
            className="relative min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: `linear-gradient(135deg, rgba(15, 35, 68, 0.82) 0%, rgba(10, 25, 47, 0.78) 100%), url('https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=2000&q=80')`
            }}
        >
            {/* Centered Main Split Card */}
            <div className="relative z-10 max-w-4xl w-full grid md:grid-cols-12 rounded-2xl overflow-hidden shadow-2xl border border-white/30 backdrop-blur-md">
                {/* Left Panel: Dedicated Medical Quotes */}
                <div className="md:col-span-5 bg-[#1C355E]/95 text-white p-8 sm:p-10 flex flex-col justify-center space-y-6 relative border-r border-white/10">
                    <div className="space-y-6 my-auto">
                        {/* Quote 1 */}
                        <div className="bg-white/10 backdrop-blur-sm p-5 rounded-xl border border-white/15 shadow-sm space-y-2.5">
                            <div className="text-2xl text-blue-300 font-serif leading-none">“</div>
                            <p className="text-sm sm:text-base italic text-slate-100 leading-relaxed font-light">
                                Health is a state of complete physical, mental, and social well-being and not merely the absence of disease.
                            </p>
                            <div className="text-xs text-blue-200 font-semibold pt-1 border-t border-white/10">
                                — World Health Organization (WHO)
                            </div>
                        </div>

                        {/* Quote 2 */}
                        <div className="bg-white/10 backdrop-blur-sm p-5 rounded-xl border border-white/15 shadow-sm space-y-2.5">
                            <div className="text-2xl text-blue-300 font-serif leading-none">“</div>
                            <p className="text-sm sm:text-base italic text-slate-100 leading-relaxed font-light">
                                The greatest wealth is health.
                            </p>
                            <div className="text-xs text-blue-200 font-semibold pt-1 border-t border-white/10">
                                — Virgil
                            </div>
                        </div>

                        {/* Quote 3 */}
                        <div className="bg-white/10 backdrop-blur-sm p-5 rounded-xl border border-white/15 shadow-sm space-y-2.5">
                            <div className="text-2xl text-blue-300 font-serif leading-none">“</div>
                            <p className="text-sm sm:text-base italic text-slate-100 leading-relaxed font-light">
                                Healing is a matter of time, but it is sometimes also a matter of opportunity.
                            </p>
                            <div className="text-xs text-blue-200 font-semibold pt-1 border-t border-white/10">
                                — Hippocrates
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Registration Form */}
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
                                className="w-full border border-slate-300 rounded px-3.5 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#1C355E] focus:border-[#1C355E]"
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
                                className="w-full border border-slate-300 rounded px-3.5 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#1C355E] focus:border-[#1C355E]"
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
                                    className="w-full border border-slate-300 rounded px-3.5 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#1C355E] focus:border-[#1C355E]"
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
                                    className="w-full border border-slate-300 rounded px-3.5 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#1C355E] focus:border-[#1C355E]"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-2.5 text-white font-semibold rounded text-sm transition cursor-pointer shadow-xs ${
                                loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#1C355E] hover:bg-[#15294A]'
                            }`}
                        >
                            {loading ? 'Creating Record...' : 'Complete Registration'}
                        </button>
                    </form>

                    <div className="relative border-t border-slate-200 pt-3">
                        <button
                            type="button"
                            onClick={() => { loginAsDemo(); navigate('/patient/dashboard'); }}
                            className="w-full py-2 text-[#1C355E] bg-blue-50/80 hover:bg-blue-100 font-bold rounded text-xs border border-blue-200 transition cursor-pointer flex items-center justify-center gap-1.5"
                        >
                            <span>⚡</span>
                            <span>Enter 1-Click Interactive Clinical Demo</span>
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
