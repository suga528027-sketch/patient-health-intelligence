import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const Navbar = () => {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <nav className="bg-blue-600 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">HealthPlatform</Link>
                <div>
                    {user ? (
                        <>
                            <span className="mr-4">Hello, {user.name}</span>
                            <Link to="/patient/dashboard" className="mr-4 hover:underline">Dashboard</Link>
                            <Link to="/patient/timeline" className="mr-4 hover:underline">Timeline</Link>
                            <Link to="/patient/trends" className="mr-4 hover:underline">Trends</Link>
                            <Link to="/patient/assistant" className="mr-4 hover:underline">AI Assistant</Link>
                            <button onClick={handleLogout} className="bg-blue-800 px-3 py-1 rounded hover:bg-blue-900 transition">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="mr-4 hover:underline">Login</Link>
                            <Link to="/register" className="hover:underline">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
