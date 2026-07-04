import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await authService.login(email, password);
            navigate('/patient/dashboard');
            window.location.reload(); // Refresh to update navbar state
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Check your credentials.');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Sign In</h2>
                {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-6 text-sm">{error}</div>}
                
                <form onSubmit={handleLogin}>
                    <div className="mb-5">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Email Address</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} 
                               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    </div>
                    <div className="mb-8">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} 
                               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold text-lg">
                        Login
                    </button>
                </form>
                <p className="mt-6 text-center text-gray-600">
                    Don't have an account? <Link to="/register" className="text-blue-600 font-semibold hover:underline">Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
