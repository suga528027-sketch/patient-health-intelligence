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
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded bg-[#1C355E] text-white font-bold text-xl shadow-xs">
                    +
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-[#0F172A]">
                    Patient Portal Registration
                </h2>
                <p className="text-xs text-slate-500">
                    Create your personal clinical health record account
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
                <div className="bg-white py-8 px-6 sm:px-10 border border-slate-300 rounded shadow-xs space-y-6">
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-600 text-red-800 text-xs p-3 font-medium">
                            {error}
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={handleSubmit}>
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
                                placeholder="Dr. John Doe / Alex Morgan"
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
                                Confirm Password
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

                    <div className="relative border-t border-slate-200 pt-4">
                        <button
                            type="button"
                            onClick={() => { loginAsDemo(); navigate('/patient/dashboard'); }}
                            className="w-full py-2 text-[#1C355E] bg-slate-50 hover:bg-slate-100 font-semibold rounded text-xs border border-slate-300 transition cursor-pointer"
                        >
                            Enter 1-Click Interactive Demo
                        </button>
                    </div>

                    <div className="text-center pt-2 border-t border-slate-100">
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
