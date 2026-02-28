import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Settings = () => {
    const { user, setUser, logout } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: '', age: '', weight: '', height: '', goal: '',
        activityLevel: '', equipment: '', experienceLevel: '', gender: 'male'
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [regenLoading, setRegenLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                age: user.age || '',
                weight: user.weight || '',
                height: user.height || '',
                goal: user.goal || '',
                activityLevel: user.activityLevel || '',
                equipment: user.equipment || '',
                experienceLevel: user.experienceLevel || '',
                gender: user.gender || 'male'
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const payload = {
                ...formData,
                age: Number(formData.age),
                weight: Number(formData.weight),
                height: Number(formData.height),
                activityLevel: Number(formData.activityLevel)
            };

            const res = await api.put('/users/profile', payload);
            setUser({ ...user, ...res.data });
            setMessage({ type: 'success', text: 'Variables updated successfully.' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed.' });
        } finally {
            setLoading(false);
        }
    };

    const handleRegeneratePlans = async () => {
        setRegenLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await api.post('/plans/generate');
            setMessage({ type: 'success', text: 'New protocols generated based on current parameters.' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Protocol generation failed.' });
        } finally {
            setRegenLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pt-4 pb-12">
            <div className="flex justify-between items-end border-b border-slate-200 pb-6 mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">System Preferences</h2>
                    <p className="text-slate-500 text-sm mt-2 font-mono uppercase tracking-widest">Configuration Panel</p>
                </div>
            </div>

            {message.text && (
                <div className={`p-4 text-sm border ${message.type === 'success' ? 'bg-slate-50 border-slate-900 text-slate-900' : 'bg-red-50 border-red-200 text-red-600'}`}>
                    <span className="font-mono uppercase tracking-widest font-bold text-[10px] block mb-1">
                        {message.type === 'success' ? 'System_Msg' : 'System_Err'}
                    </span>
                    {message.text}
                </div>
            )}

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <form onSubmit={handleUpdateProfile} className="bg-white border border-slate-200 p-8">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Biometric Parameters</h3>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Subject Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-300 focus:outline-none focus:border-slate-900 transition-colors text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Age</label>
                                    <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-300 focus:outline-none focus:border-slate-900 transition-colors text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Weight (KG)</label>
                                    <input type="number" name="weight" value={formData.weight} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-300 focus:outline-none focus:border-slate-900 transition-colors text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Height (CM)</label>
                                    <input type="number" name="height" value={formData.height} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-300 focus:outline-none focus:border-slate-900 transition-colors text-sm" />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100">
                                <h3 className="text-lg font-bold text-slate-900 mb-6">Objective Config</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Current Goal</label>
                                        <select name="goal" value={formData.goal} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-300 focus:outline-none focus:border-slate-900 text-sm">
                                            <option value="Fat Loss">Fat Loss</option>
                                            <option value="Muscle Gain">Muscle Gain</option>
                                            <option value="Maintenance">Maintenance</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Activity Level</label>
                                        <select name="activityLevel" value={formData.activityLevel} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-300 focus:outline-none focus:border-slate-900 text-sm">
                                            <option value="1.2">Sedentary</option>
                                            <option value="1.375">Light</option>
                                            <option value="1.55">Moderate</option>
                                            <option value="1.725">Active</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Equipment</label>
                                        <select name="equipment" value={formData.equipment} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-300 focus:outline-none focus:border-slate-900 text-sm">
                                            <option value="None">None</option><option value="Basic Home">Home</option><option value="Full Gym">Gym</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Experience</label>
                                        <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-300 focus:outline-none focus:border-slate-900 text-sm">
                                            <option value="Beginner">Beginner</option><option value="Intermediate">Intermed.</option><option value="Advanced">Advanced</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Gender</label>
                                        <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-300 focus:outline-none focus:border-slate-900 text-sm">
                                            <option value="male">Male</option><option value="female">Female</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8">
                                <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white px-8 py-3 text-sm font-medium hover:bg-slate-800 transition-colors disabled:opacity-50">
                                    {loading ? 'Saving...' : 'Apply Variables'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="space-y-6">
                    <div className="bg-white border border-slate-200 p-8">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Recalibrate System</h3>
                        <p className="text-sm text-slate-500 mb-6">Updating your parameters requires generating new regimen structures to reflect your biometric changes.</p>
                        <button
                            onClick={handleRegeneratePlans}
                            disabled={regenLoading}
                            className="w-full bg-white border border-slate-900 text-slate-900 px-8 py-3 text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
                        >
                            {regenLoading ? 'Generating...' : 'Force Recalibration'}
                        </button>
                    </div>

                    <div className="bg-white border border-red-200 p-8">
                        <h3 className="text-lg font-bold text-red-600 mb-4">System Overload</h3>
                        <p className="text-sm text-slate-500 mb-6">Disconnect from active session or purge account data.</p>
                        <button
                            onClick={logout}
                            className="w-full bg-red-50 text-red-600 border border-red-200 px-8 py-3 text-sm font-medium hover:bg-red-100 transition-colors"
                        >
                            Terminate Session
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
