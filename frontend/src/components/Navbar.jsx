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
        `px-4 py-2.5 text-sm sm:text-base font-medium transition border-b-2 ${
            isActive
                ? 'border-white text-white font-bold bg-white/10'
                : 'border-transparent text-slate-200 hover:text-white hover:bg-white/5'
        }`;

    return (
        <header className="bg-[#1C355E] text-white shadow-sm sticky top-0 z-40 border-b border-[#15294a]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-18">
                    {/* Brand Logo & Institutional Title */}
                    <div className="flex items-center gap-4">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-9 h-9 rounded bg-white text-[#1C355E] flex items-center justify-center font-bold text-xl shadow-sm">
                                +
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-xl sm:text-2xl tracking-tight text-white leading-tight">
                                    HealthPlatform
                                </span>
                                <span className="text-xs text-slate-300 tracking-wider uppercase font-semibold">
                                    Clinical Intelligence System
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {isAuthenticated ? (
                            <>
                                <NavLink to="/patient/dashboard" className={navLinkClasses}>
                                    Dashboard
                                </NavLink>
                                <NavLink to="/patient/timeline" className={navLinkClasses}>
                                    Timeline
                                </NavLink>
                                <NavLink to="/patient/trends" className={navLinkClasses}>
                                    Biomarker Trends
                                </NavLink>
                                <NavLink to="/patient/assistant" className={navLinkClasses}>
                                    Clinical AI Assistant
                                </NavLink>

                                {/* Demo / Live Mode Status */}
                                <button
                                    onClick={() => toggleDemoMode()}
                                    title={isDemoMode ? "Click to switch to Live API Mode" : "Click to switch to Demo Mode"}
                                    className="ml-3 text-xs sm:text-sm font-medium px-3.5 py-1.5 rounded border border-white/20 bg-white/10 text-slate-100 hover:bg-white/20 transition flex items-center gap-2 cursor-pointer"
                                >
                                    <span className={`w-2.5 h-2.5 rounded-full ${
                                        isDemoMode ? 'bg-amber-400' : backendOnline ? 'bg-emerald-400' : 'bg-red-400'
                                    }`}></span>
                                    <span>{isDemoMode ? 'Demo Workspace' : backendOnline ? 'Live API' : 'Backend Offline'}</span>
                                </button>

                                {/* User & Logout */}
                                <div className="flex items-center gap-3 pl-4 ml-2 border-l border-white/20">
                                    <div className="text-right hidden lg:block">
                                        <div className="text-sm font-semibold text-white leading-tight">{user.name}</div>
                                        <div className="text-xs text-slate-300 leading-tight truncate max-w-[140px]">{user.email}</div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-transparent hover:bg-white/10 text-slate-200 hover:text-white text-xs sm:text-sm font-medium px-3.5 py-1.5 rounded border border-white/30 transition cursor-pointer"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => toggleDemoMode()}
                                    className="text-xs sm:text-sm font-medium px-3.5 py-1.5 rounded border border-white/20 bg-white/10 text-slate-100 hover:bg-white/20 transition flex items-center gap-2 cursor-pointer"
                                >
                                    <span className={`w-2.5 h-2.5 rounded-full ${backendOnline ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                                    <span>{backendOnline ? 'Live API Connected' : 'Demo Mode Ready'}</span>
                                </button>
                                <Link to="/login" className="text-sm sm:text-base text-slate-200 hover:text-white px-3 py-2 font-medium transition">
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="text-sm sm:text-base bg-white text-[#1C355E] hover:bg-slate-100 font-semibold px-4 py-2 rounded transition shadow-sm"
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
                            className="p-2 rounded bg-white/10 hover:bg-white/20 text-white focus:outline-none"
                            aria-label="Toggle menu"
                        >
                            <span className="text-2xl">{mobileMenuOpen ? '✕' : '☰'}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-[#15294A] border-t border-white/10 px-4 pt-3 pb-5 space-y-2">
                    {isAuthenticated ? (
                        <>
                            <div className="pb-3 mb-2 border-b border-white/10 flex justify-between items-center">
                                <div>
                                    <div className="text-base font-semibold text-white">{user.name}</div>
                                    <div className="text-xs text-slate-300">{user.email}</div>
                                </div>
                                <span className={`text-xs px-2.5 py-1 rounded font-semibold ${isDemoMode ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'}`}>
                                    {isDemoMode ? 'Demo Mode' : 'Live API'}
                                </span>
                            </div>
                            <NavLink to="/patient/dashboard" onClick={() => setMobileMenuOpen(false)} className={navLinkClasses}>
                                Dashboard
                            </NavLink>
                            <NavLink to="/patient/timeline" onClick={() => setMobileMenuOpen(false)} className={navLinkClasses}>
                                Timeline
                            </NavLink>
                            <NavLink to="/patient/trends" onClick={() => setMobileMenuOpen(false)} className={navLinkClasses}>
                                Biomarker Trends
                            </NavLink>
                            <NavLink to="/patient/assistant" onClick={() => setMobileMenuOpen(false)} className={navLinkClasses}>
                                Clinical AI Assistant
                            </NavLink>
                            <div className="pt-3 border-t border-white/10 flex gap-2">
                                <button
                                    onClick={() => { toggleDemoMode(); setMobileMenuOpen(false); }}
                                    className="flex-1 text-xs sm:text-sm py-2 bg-white/10 rounded font-medium text-center text-white"
                                >
                                    Toggle {isDemoMode ? 'Live Mode' : 'Demo Mode'}
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex-1 text-xs sm:text-sm py-2 bg-red-700 hover:bg-red-800 rounded font-medium text-center text-white"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-2 pt-2">
                            <Link
                                to="/login"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block text-center py-2.5 bg-white/10 text-white rounded font-medium text-sm"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/register"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block text-center py-2.5 bg-white text-[#1C355E] rounded font-semibold text-sm"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
};

export default Navbar;
