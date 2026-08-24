import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, loginAsDemo, backendOnline } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await authService.login(email, password);
            login(data.user, data.token);
            navigate('/patient/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please check your credentials or test with Demo Mode.');
        } finally {
            setLoading(false);
        }
    };

    const handleDemoLogin = () => {
        loginAsDemo();
        navigate('/patient/dashboard');
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50">
            <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-slate-200 w-full max-w-md space-y-6">
                <div className="text-center space-y-2">
                    <div className="inline-flex p-3 rounded-2xl bg-blue-50 text-blue-600 text-3xl mb-1">
                        🔐
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Welcome Back</h2>
                    <p className="text-xs sm:text-sm text-slate-500">Sign in to your patient health portal</p>
                </div>

                {/* 1-Click Demo Login Banner */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 text-center space-y-2">
                    <div className="text-xs font-bold text-blue-900">Want to test drive without registering?</div>
                    <button
                        type="button"
                        onClick={handleDemoLogin}
                        className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                        <span>⚡ 1-Click Instant Demo Login</span>
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-xs sm:text-sm font-medium flex items-start gap-2">
                        <span>⚠️</span>
                        <span>{error}</span>
                    </div>
                )}

                <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-slate-200"></div>
                    <span className="flex-shrink mx-3 text-xs text-slate-400 font-semibold uppercase">Or Sign In</span>
                    <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-1.5">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-1.5">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm cursor-pointer ${
                            loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Authenticating...</span>
                            </>
                        ) : (
                            <span>Sign In</span>
                        )}
                    </button>
                </form>

                <p className="text-center text-xs sm:text-sm text-slate-500">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-600 font-bold hover:underline">
                        Register Free
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
