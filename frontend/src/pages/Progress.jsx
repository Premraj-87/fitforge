import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';

const ProgressTracker = () => {
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLogging, setIsLogging] = useState(false);
    const [newWeight, setNewWeight] = useState('');
    const [submitLoading, setSubmitLoading] = useState(false);

    const mockWeight = [
        { date: 'Mon', weight: 75 },
        { date: 'Tue', weight: 74.8 },
        { date: 'Wed', weight: 74.3 },
        { date: 'Thu', weight: 74.5 },
        { date: 'Fri', weight: 73.9 },
        { date: 'Sat', weight: 73.5 },
        { date: 'Sun', weight: 73 },
    ];

    useEffect(() => {
        const fetchProgress = async () => {
            const cachedProgress = localStorage.getItem('cache_progress');
            if (cachedProgress) {
                setProgress(JSON.parse(cachedProgress));
                setLoading(false);
            }

            try {
                const res = await api.get('/progress');
                setProgress(res.data);
                localStorage.setItem('cache_progress', JSON.stringify(res.data));
            } catch (err) {
                console.error('Failed to load progress', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProgress();
    }, []);

    const handleLogWeight = async (e) => {
        e.preventDefault();
        if (!newWeight) return;
        setSubmitLoading(true);
        try {
            const res = await api.post('/progress/weight', { weight: Number(newWeight) });
            setProgress(res.data);
            setIsLogging(false);
            setNewWeight('');
        } catch (err) {
            console.error('Failed to log weight', err);
        } finally {
            setSubmitLoading(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="text-sm font-medium text-slate-400 animate-pulse">Aggregating historical data...</div>
        </div>
    );

    const weightData = progress?.weightHistory?.length > 0
        ? progress.weightHistory.map((entry, index) => ({
            ...entry,
            date: `Log ${index + 1}`
        }))
        : mockWeight;

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end border-b border-slate-200 pb-6">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">Progress Analysis</h2>
                    <p className="text-slate-500 text-sm mt-2 font-mono uppercase tracking-widest">Historical Telemetry</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 text-white p-8 flex flex-col justify-between border border-slate-900">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-8">Consecutive Logins</p>
                    <div>
                        <span className="text-5xl font-mono tracking-tighter font-bold">{progress?.streak || 0}</span>
                        <span className="text-sm text-slate-400 ml-2">Days</span>
                    </div>
                </div>

                <div className="bg-white p-8 flex flex-col justify-between border border-slate-200">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-8">Completed Protocols</p>
                    <div>
                        <span className="text-5xl font-mono tracking-tighter font-bold text-slate-900">{progress?.workoutHistory?.length || 0}</span>
                        <span className="text-sm text-slate-400 ml-2">Sessions</span>
                    </div>
                </div>

                <div className="bg-white p-8 flex flex-col justify-between border border-slate-200">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-8">Adherence Ratio</p>
                    <div>
                        <span className="text-5xl font-mono tracking-tighter font-bold text-slate-900">{progress?.consistencyScore || 0}%</span>
                        <span className="text-sm text-slate-400 ml-2">Rate</span>
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 border border-slate-200">
                <div className="flex justify-between items-start mb-12 flex-col sm:flex-row gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Mass Trajectory</h3>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-2">Weight over time</p>
                    </div>

                    {isLogging ? (
                        <form onSubmit={handleLogWeight} className="flex space-x-2">
                            <input
                                type="number"
                                step="0.1"
                                value={newWeight}
                                onChange={(e) => setNewWeight(e.target.value)}
                                placeholder="75.0"
                                className="w-20 px-3 py-1.5 text-sm bg-white border border-slate-300 focus:outline-none focus:border-slate-900"
                                autoFocus
                                required
                            />
                            <button
                                type="submit"
                                disabled={submitLoading}
                                className="text-[10px] font-bold uppercase tracking-widest bg-slate-900 border border-slate-900 text-white px-4 py-2 hover:bg-slate-800 transition-colors disabled:opacity-50"
                            >
                                {submitLoading ? '...' : 'Save'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsLogging(false)}
                                className="text-[10px] font-bold uppercase tracking-widest bg-white border border-slate-200 text-slate-500 px-3 py-2 hover:bg-slate-50 transition-colors"
                            >
                                ✕
                            </button>
                        </form>
                    ) : (
                        <button
                            onClick={() => setIsLogging(true)}
                            className="text-[10px] font-bold uppercase tracking-widest bg-slate-50 border border-slate-200 text-slate-900 px-4 py-2 hover:bg-slate-100 transition-colors"
                        >
                            Record Entry
                        </button>
                    )}
                </div>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={weightData}>
                            <defs>
                                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="date"
                                axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} dy={10}
                            />
                            <YAxis domain={['dataMin - 3', 'dataMax + 3']} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} dx={-10} />
                            <Tooltip
                                cursor={{ fill: '#f8fafc', strokeWidth: 1 }}
                                contentStyle={{ borderRadius: '0', border: '1px solid #e2e8f0', boxShadow: 'none' }}
                                itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                            />
                            <Area type="monotone" dataKey={progress?.weightHistory?.length > 0 ? "value" : "weight"} stroke="#0f172a" strokeWidth={2} fillOpacity={1} fill="url(#colorWeight)" activeDot={{ r: 5, fill: '#0f172a', stroke: '#fff', strokeWidth: 2 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ProgressTracker;
