import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            await login(formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white font-sans p-6 animate-in fade-in duration-500">
            <div className="absolute top-10 left-10">
                <Link to="/" className="text-xl font-bold tracking-tight text-slate-900">FitForge.</Link>
            </div>

            <div className="w-full max-w-sm">
                <div className="mb-10 text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Account</h2>
                    <p className="text-sm text-slate-500">Enter your credentials to continue.</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 mb-6 text-sm border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-white border border-slate-300 focus:outline-none focus:border-slate-900 transition-colors text-sm"
                            placeholder="mail@example.com"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Password</label>
                        </div>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-white border border-slate-300 focus:outline-none focus:border-slate-900 transition-colors text-sm"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-slate-900 text-white font-medium py-3.5 text-sm hover:bg-slate-800 transition-colors disabled:opacity-50 mt-4"
                    >
                        {isSubmitting ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm border-t border-slate-100 pt-6">
                    <span className="text-slate-500">New user? </span>
                    <Link to="/register" className="text-slate-900 font-medium hover:underline">Register</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
