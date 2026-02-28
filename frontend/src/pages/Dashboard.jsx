import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import api from '../services/api';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [progress, setProgress] = useState(null);
    const [plans, setPlans] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const weightData = [
        { day: 'Mon', weight: 74 },
        { day: 'Tue', weight: 73.8 },
        { day: 'Wed', weight: 73.5 },
        { day: 'Thu', weight: 73.2 },
        { day: 'Fri', weight: 72.8 },
        { day: 'Sat', weight: 72.5 },
        { day: 'Sun', weight: 72 },
    ];

    const consistencyData = [
        { name: 'M', score: 100 },
        { name: 'T', score: 100 },
        { name: 'W', score: 85 },
        { name: 'T', score: 90 },
        { name: 'F', score: 100 },
    ];

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [progressRes, plansRes] = await Promise.all([
                    api.get('/progress'),
                    api.get('/plans')
                ]);
                setProgress(progressRes.data);
                setPlans(plansRes.data);
            } catch (err) {
                console.error('Failed to load dashboard data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    // Format Data for Charts
    const formattedWeightData = progress?.weightHistory?.length > 0
        ? progress.weightHistory.map(entry => ({
            day: new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' }),
            weight: entry.value
        })).slice(-7) // Get last 7 entries
        : weightData;

    const currentWeight = progress?.weightHistory?.length > 0
        ? progress.weightHistory[progress.weightHistory.length - 1].value
        : user?.weight || '--';

    // Calculate dynamic statuses
    const workout = plans?.workoutPlan;
    const diet = plans?.dietPlan;

    // A protocol is "Completed" if there are NO incomplete modules left in the current week, 
    // OR if they logged a workout *today* in the progress array.
    const todayStr = new Date().toDateString();
    const isWorkoutCompleted =
        (progress?.workoutHistory?.some(entry => new Date(entry.date).toDateString() === todayStr && entry.completed)) ||
        (workout && workout.days?.every(d => d.isCompleted));

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="text-sm font-medium text-slate-400 animate-pulse">Loading modules...</div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Welcome Banner */}
            <div className="bg-white border border-slate-200 p-8 sm:p-10 flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">System Status: Active</span>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome back, {user?.name?.split(' ')[0] || 'Athlete'}.</h2>
                    <p className="text-slate-500 text-sm">
                        {workout && diet ? `You have ${workout.days?.length || 0} training modules scheduled for your current protocol.` : "Please generate your baseline plans to begin."}
                    </p>
                </div>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-8 border border-slate-200 flex flex-col justify-between hover:border-slate-400 transition-colors">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Module 01</p>
                            <h3 className="text-xl font-bold text-slate-900">Workout Protocol</h3>
                            <p className="text-sm text-slate-500 mt-2">
                                {workout ? `${workout.programType} • ${workout.days?.[0]?.exercises?.length || 0} Movements` : 'No plan established'}
                            </p>
                        </div>
                        <div className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${isWorkoutCompleted ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                            {isWorkoutCompleted ? 'Completed' : 'Pending'}
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard/workout')}
                        className={`w-full py-3 text-sm font-medium transition-colors ${isWorkoutCompleted ? 'bg-green-900 text-white hover:bg-green-800' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                    >
                        {isWorkoutCompleted ? 'Protocol Logged' : (workout ? 'Initialize Session' : 'Setup Protocol')}
                    </button>
                </div>

                <div className="bg-white p-8 border border-slate-200 flex flex-col justify-between hover:border-slate-400 transition-colors">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Module 02</p>
                            <h3 className="text-xl font-bold text-slate-900">Nutrition Targets</h3>
                            <p className="text-sm text-slate-500 mt-2">
                                {diet ? `${diet.dailyTarget?.calories || 0} kcal • ${diet.dailyTarget?.protein || 0}P / ${diet.dailyTarget?.carbs || 0}C / ${diet.dailyTarget?.fats || 0}F` : 'No metrics generated'}
                            </p>
                        </div>
                        <div className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                            {diet ? 'Active' : 'Missing'}
                        </div>
                    </div>
                    <button onClick={() => navigate('/dashboard/diet')} className="w-full py-3 bg-white border border-slate-300 text-slate-900 text-sm font-medium hover:bg-slate-50 transition-colors">
                        {diet ? 'Log Data' : 'Generate Metrics'}
                    </button>
                </div>
            </div>

            {/* Analytics Section */}
            <div className="flex items-center justify-between mb-2 mt-12 border-b border-slate-200 pb-4">
                <h3 className="text-lg font-bold text-slate-900">Metrics Dashboard</h3>
                <button onClick={() => navigate('/dashboard/progress')} className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
                    View Complete Report →
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart */}
                <div className="bg-white p-8 border border-slate-200 lg:col-span-2 flex flex-col">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h4 className="font-semibold text-slate-900 text-sm">Mass Progression</h4>
                            <p className="text-[10px] uppercase tracking-widest text-slate-400 mt-1">7-Day Trajectory</p>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-bold text-slate-900 font-mono">{currentWeight} <span className="text-sm text-slate-400 font-sans">kg</span></span>
                            <p className="text-[10px] font-bold text-slate-500 mt-1">
                                Latest Record
                            </p>
                        </div>
                    </div>
                    <div className="flex-1 min-h-[250px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={formattedWeightData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} dy={10} />
                                <YAxis domain={['dataMin - 1', 'dataMax + 1']} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} dx={-10} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '0', border: '1px solid #e2e8f0', boxShadow: 'none' }}
                                    itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                                />
                                <Line type="monotone" dataKey="weight" stroke="#0f172a" strokeWidth={2} dot={{ r: 3, fill: '#0f172a', strokeWidth: 0 }} activeDot={{ r: 5, fill: '#0f172a', stroke: '#fff', strokeWidth: 2 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Small Stats Container */}
                <div className="flex flex-col gap-6">
                    {/* Streak Card */}
                    <div className="bg-slate-900 text-white p-8 border border-slate-900 flex-1 flex flex-col justify-between">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Consistency</p>
                            <h4 className="font-semibold">Active Streak</h4>
                        </div>
                        <div className="mt-8">
                            <span className="text-5xl font-bold font-mono tracking-tighter">{progress?.streak ?? 0}</span>
                            <span className="text-sm text-slate-400 ml-2">Days</span>
                        </div>
                    </div>

                    {/* Mini Bar Chart */}
                    <div className="bg-white p-8 border border-slate-200 flex-1 flex flex-col justify-between">
                        <div className="mb-6">
                            <h4 className="font-semibold text-slate-900 text-sm">Adherence Ratio</h4>
                        </div>
                        <div className="h-24 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={consistencyData} margin={{ top: 0, right: 0, left: 0, bottom: -10 }}>
                                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '0', border: '1px solid #e2e8f0', boxShadow: 'none' }} />
                                    <Bar dataKey="score" fill="#cbd5e1" barSize={16} activeBar={{ fill: '#0f172a' }} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
