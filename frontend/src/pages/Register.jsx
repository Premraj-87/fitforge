import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '',
        age: '', weight: '', height: '', goal: 'Fat Loss', gender: 'male',
        activityLevel: '1.2', equipment: 'None', experienceLevel: 'Beginner'
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            await register(formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans flex flex-col items-center justify-center p-6 sm:p-12 animate-in fade-in duration-500">
            <div className="absolute top-10 left-10">
                <Link to="/" className="text-xl font-bold tracking-tight text-slate-900">FitForge.</Link>
            </div>

            <div className="w-full max-w-2xl bg-white p-8 sm:p-12 mt-12 mb-12 border border-slate-200">
                <div className="mb-10 border-b border-slate-200 pb-6">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Initialize Profile</h2>
                    <p className="text-sm text-slate-500">Required variables for algorithm calibration.</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 mb-6 text-sm border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-6">
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-l-2 border-slate-900 pl-3">I. Account</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Full Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 bg-white border border-slate-300 focus:outline-none focus:border-slate-900 transition-colors text-sm" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 bg-white border border-slate-300 focus:outline-none focus:border-slate-900 transition-colors text-sm" placeholder="john@example.com" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Password</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full px-4 py-3 bg-white border border-slate-300 focus:outline-none focus:border-slate-900 transition-colors text-sm" placeholder="Minimum 6 characters" />
                        </div>
                    </div>

                    <div className="space-y-6 pt-6 border-t border-slate-100">
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-l-2 border-slate-900 pl-3">II. Biometrics</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Age</label>
                                <input type="number" name="age" value={formData.age} onChange={handleChange} required className="w-full px-4 py-3 bg-white border border-slate-300 focus:outline-none focus:border-slate-900 text-sm" placeholder="Years" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Weight</label>
                                <input type="number" name="weight" value={formData.weight} onChange={handleChange} required className="w-full px-4 py-3 bg-white border border-slate-300 focus:outline-none focus:border-slate-900 text-sm" placeholder="KG" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Height</label>
                                <input type="number" name="height" value={formData.height} onChange={handleChange} required className="w-full px-4 py-3 bg-white border border-slate-300 focus:outline-none focus:border-slate-900 text-sm" placeholder="CM" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Gender</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-300 focus:outline-none focus:border-slate-900 text-sm">
                                    <option value="male">Male</option><option value="female">Female</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Activity</label>
                                <select name="activityLevel" value={formData.activityLevel} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-300 focus:outline-none focus:border-slate-900 text-sm">
                                    <option value="1.2">Sedentary</option>
                                    <option value="1.375">Light</option>
                                    <option value="1.55">Moderate</option>
                                    <option value="1.725">Active</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Gear</label>
                                <select name="equipment" value={formData.equipment} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-300 focus:outline-none focus:border-slate-900 text-sm">
                                    <option value="None">None</option><option value="Basic Home">Home</option><option value="Full Gym">Gym</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Level</label>
                                <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-300 focus:outline-none focus:border-slate-900 text-sm">
                                    <option value="Beginner">Beginner</option><option value="Intermediate">Intermed.</option><option value="Advanced">Advanced</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-2">
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">Objective</label>
                            <div className="grid grid-cols-3 gap-3">
                                {['Fat Loss', 'Muscle Gain', 'Maintenance'].map((goal) => (
                                    <label key={goal} className={`cursor-pointer px-4 py-3 border text-center text-sm font-medium transition-colors ${formData.goal === goal ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'}`}>
                                        <input type="radio" name="goal" value={goal} onChange={handleChange} checked={formData.goal === goal} className="sr-only" />
                                        {goal}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-slate-900 text-white font-medium py-4 text-sm hover:bg-slate-800 transition-colors mt-8 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Processing...' : 'Complete Setup'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm border-t border-slate-100 pt-6">
                    <span className="text-slate-500">Existing profile? </span>
                    <Link to="/login" className="text-slate-900 font-medium hover:underline">Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
