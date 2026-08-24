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
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded bg-[#1C355E] text-white font-bold text-xl shadow-xs">
                    +
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-[#0F172A]">
                    Clinical Health Record Sign In
                </h2>
                <p className="text-xs text-slate-500">
                    Enter your authenticated credentials or access the clinical demo
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
                        <div className="text-center">
                            <span className="text-xs text-slate-500 font-medium">Or test drive instantly</span>
                        </div>
                        <button
                            type="button"
                            onClick={handleDemoLogin}
                            className="mt-3 w-full py-2 text-[#1C355E] bg-slate-50 hover:bg-slate-100 font-semibold rounded text-xs border border-slate-300 transition cursor-pointer"
                        >
                            Enter 1-Click Interactive Demo
                        </button>
                    </div>

                    <div className="text-center pt-2 border-t border-slate-100">
                        <p className="text-xs text-slate-600">
                            Don't have a registered account?{' '}
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
