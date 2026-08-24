import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEMO_USER } from '../data/mockHealthData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                return JSON.parse(storedUser);
            } catch (e) {
                return null;
            }
        }
        return null;
    });

    const [token, setToken] = useState(() => localStorage.getItem('token') || null);
    
    // Default isDemoMode to true if on Vercel and no token exists, or if explicit demo flag is set
    const [isDemoMode, setIsDemoMode] = useState(() => {
        const savedDemo = localStorage.getItem('is_demo_mode');
        if (savedDemo !== null) return savedDemo === 'true';
        // Auto-enable demo mode if on Vercel and no custom API URL is set
        return window.location.hostname.includes('vercel.app') && !import.meta.env.VITE_API_URL;
    });

    const [backendOnline, setBackendOnline] = useState(false);

    // Check backend health status
    useEffect(() => {
        const checkBackend = async () => {
            try {
                const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 2500);
                const res = await fetch(`${baseUrl}/ai/test`, { signal: controller.signal });
                clearTimeout(timeoutId);
                setBackendOnline(res.ok);
            } catch (e) {
                setBackendOnline(false);
            }
        };

        checkBackend();
        const interval = setInterval(checkBackend, 30000);
        return () => clearInterval(interval);
    }, []);

    const login = (userData, jwtToken) => {
        setUser(userData);
        setToken(jwtToken);
        localStorage.setItem('user', JSON.stringify(userData));
        if (jwtToken) {
            localStorage.setItem('token', jwtToken);
        }
    };

    const loginAsDemo = () => {
        setIsDemoMode(true);
        localStorage.setItem('is_demo_mode', 'true');
        login(DEMO_USER, 'demo-jwt-token-sample');
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    const toggleDemoMode = (enabled) => {
        const nextState = enabled !== undefined ? enabled : !isDemoMode;
        setIsDemoMode(nextState);
        localStorage.setItem('is_demo_mode', String(nextState));
        if (nextState && !user) {
            loginAsDemo();
        }
    };

    const value = {
        user,
        token,
        isAuthenticated: !!user,
        isDemoMode,
        backendOnline,
        login,
        loginAsDemo,
        logout,
        toggleDemoMode
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
