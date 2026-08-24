import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, isAuthenticated, isDemoMode, backendOnline, toggleDemoMode, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navLinkClasses = ({ isActive }) =>
        `px-3 py-2 rounded-lg text-sm font-medium transition ${
            isActive
                ? 'bg-blue-700 text-white shadow-inner font-semibold'
                : 'text-blue-100 hover:bg-blue-600/80 hover:text-white'
        }`;

    return (
        <nav className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white shadow-lg sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Brand Logo */}
                    <div className="flex items-center gap-3">
                        <Link to="/" className="flex items-center gap-2.5 group">
                            <div className="w-9 h-9 rounded-xl bg-white text-blue-600 flex items-center justify-center font-black text-xl shadow-md group-hover:scale-105 transition-transform">
                                🏥
                            </div>
                            <div>
                                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white">HealthPlatform</span>
                                <span className="hidden sm:inline-block ml-2 text-[10px] bg-blue-500/40 text-blue-100 border border-blue-400/40 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                    AI Assistant
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
                        {isAuthenticated ? (
                            <>
                                <NavLink to="/patient/dashboard" className={navLinkClasses}>
                                    📊 Dashboard
                                </NavLink>
                                <NavLink to="/patient/timeline" className={navLinkClasses}>
                                    📅 Timeline
                                </NavLink>
                                <NavLink to="/patient/trends" className={navLinkClasses}>
                                    📈 Trends
                                </NavLink>
                                <NavLink to="/patient/assistant" className={navLinkClasses}>
                                    🤖 AI Assistant
                                </NavLink>

                                {/* Demo / Live Mode Pill */}
                                <button
                                    onClick={() => toggleDemoMode()}
                                    title={isDemoMode ? "Click to switch to Live Backend" : "Click to switch to Interactive Demo Mode"}
                                    className={`ml-2 text-xs font-semibold px-2.5 py-1 rounded-full border transition flex items-center gap-1.5 cursor-pointer ${
                                        isDemoMode
                                            ? 'bg-amber-500/20 text-amber-200 border-amber-400/40 hover:bg-amber-500/30'
                                            : backendOnline
                                                ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40 hover:bg-emerald-500/30'
                                                : 'bg-red-500/20 text-red-200 border-red-400/40'
                                    }`}
                                >
                                    <span className={`w-2 h-2 rounded-full ${
                                        isDemoMode ? 'bg-amber-300' : backendOnline ? 'bg-emerald-400' : 'bg-red-400'
                                    }`}></span>
                                    <span>{isDemoMode ? 'Demo Mode' : backendOnline ? 'Live API' : 'Backend Offline'}</span>
                                </button>

                                {/* User & Logout */}
                                <div className="flex items-center gap-3 pl-3 border-l border-blue-500/50">
                                    <div className="text-right hidden lg:block">
                                        <div className="text-xs font-bold leading-tight">{user.name}</div>
                                        <div className="text-[10px] text-blue-200 leading-tight truncate max-w-[120px]">{user.email}</div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-blue-800/80 hover:bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-blue-400/30 transition shadow-sm cursor-pointer"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => toggleDemoMode()}
                                    className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-white/10 text-blue-100 border-white/20 hover:bg-white/20 transition flex items-center gap-1.5 cursor-pointer"
                                >
                                    <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-400' : 'bg-amber-300'}`}></span>
                                    <span>{backendOnline ? 'Live API Connected' : 'Demo Ready'}</span>
                                </button>
                                <Link to="/login" className="text-sm text-blue-100 hover:text-white px-3 py-2 font-semibold transition">
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="text-sm bg-white text-blue-700 hover:bg-blue-50 font-bold px-4 py-2 rounded-lg shadow-sm transition"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Hamburger Button */}
                    <div className="md:hidden flex items-center gap-2">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-lg bg-blue-800/60 hover:bg-blue-800 text-white focus:outline-none"
                            aria-label="Toggle menu"
                        >
                            <span className="text-xl">{mobileMenuOpen ? '✕' : '☰'}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-blue-800 border-t border-blue-600 px-4 pt-2 pb-4 space-y-2">
                    {isAuthenticated ? (
                        <>
                            <div className="pb-2 mb-2 border-b border-blue-700 flex justify-between items-center">
                                <div>
                                    <div className="text-sm font-bold">{user.name}</div>
                                    <div className="text-xs text-blue-200">{user.email}</div>
                                </div>
                                <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${isDemoMode ? 'bg-amber-400 text-amber-950' : 'bg-emerald-400 text-emerald-950'}`}>
                                    {isDemoMode ? 'Demo Mode' : 'Live API'}
                                </span>
                            </div>
                            <NavLink to="/patient/dashboard" onClick={() => setMobileMenuOpen(false)} className={navLinkClasses}>
                                📊 Dashboard
                            </NavLink>
                            <NavLink to="/patient/timeline" onClick={() => setMobileMenuOpen(false)} className={navLinkClasses}>
                                📅 Timeline
                            </NavLink>
                            <NavLink to="/patient/trends" onClick={() => setMobileMenuOpen(false)} className={navLinkClasses}>
                                📈 Trends
                            </NavLink>
                            <NavLink to="/patient/assistant" onClick={() => setMobileMenuOpen(false)} className={navLinkClasses}>
                                🤖 AI Assistant
                            </NavLink>
                            <div className="pt-2 border-t border-blue-700 flex gap-2">
                                <button
                                    onClick={() => { toggleDemoMode(); setMobileMenuOpen(false); }}
                                    className="flex-1 text-xs py-2 bg-blue-900 rounded font-semibold text-center"
                                >
                                    Toggle {isDemoMode ? 'Live Mode' : 'Demo Mode'}
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex-1 text-xs py-2 bg-red-600 rounded font-semibold text-center"
                                >
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-2 pt-2">
                            <Link
                                to="/login"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block text-center py-2 bg-blue-700 rounded-lg font-semibold"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/register"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block text-center py-2 bg-white text-blue-700 rounded-lg font-bold"
                            >
                                Register Free
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
