import { useState, useEffect } from 'react';
import api from '../services/api';

const WorkoutPlan = () => {
    const [workout, setWorkout] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isCompleting, setIsCompleting] = useState(false);
    const [completedMsg, setCompletedMsg] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [activeDayIndex, setActiveDayIndex] = useState(0);

    useEffect(() => {
        const fetchPlans = async () => {
            const cachedPlans = localStorage.getItem('cache_plans');
            if (cachedPlans) {
                setWorkout(JSON.parse(cachedPlans).workoutPlan);
                setLoading(false);
            }

            try {
                const res = await api.get('/plans');
                setWorkout(res.data.workoutPlan);
                localStorage.setItem('cache_plans', JSON.stringify(res.data));
            } catch (err) {
                console.error('Failed to load plans', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPlans();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="text-sm font-medium text-slate-400 animate-pulse">Retrieving protocol...</div>
        </div>
    );

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const res = await api.post('/plans/generate');
            setWorkout(res.data.workoutPlan);
            window.location.reload(); // Reload to update dashboard counts context cleanly
        } catch (err) {
            console.error('Failed to generate plan', err);
        } finally {
            setIsGenerating(false);
        }
    };

    if (!workout) {
        return (
            <div className="p-12 bg-white border border-slate-200 text-center animate-in fade-in duration-500 max-w-2xl mx-auto mt-10">
                <h2 className="text-2xl font-bold mb-3 text-slate-900">No Protocol Found</h2>
                <p className="text-slate-500 mb-8 text-sm">Generate an initial routine to begin logging workouts.</p>
                <button onClick={handleGenerate} disabled={isGenerating} className="bg-slate-900 text-white px-6 py-3 text-sm font-medium hover:bg-slate-800 transition-colors disabled:opacity-50">
                    {isGenerating ? 'Computing...' : 'Establish Plan'}
                </button>
            </div>
        );
    }

    const handleComplete = async () => {
        setIsCompleting(true);
        try {
            const res = await api.post('/progress/workout', {
                planId: workout._id,
                dayIndex: activeDayIndex
            });
            setCompletedMsg(`Module executed. +${res.data.pointsEarned} Points.`);
            setWorkout(res.data.workoutPlan); // Ensure the frontend gets the completed state back
        } catch (err) {
            console.error('Failed to log workout', err);
            setCompletedMsg('Failed to sync. Please retry.');
        } finally {
            setIsCompleting(false);
        }
    };

    const todayRoutine = workout.days?.[activeDayIndex];

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end border-b border-slate-200 pb-6">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">Current Regiment</h2>
                    <p className="text-slate-500 text-sm mt-2 font-mono uppercase tracking-widest">
                        Mode: {workout.programType}
                    </p>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-red-600 transition-colors disabled:opacity-50 flex items-center bg-slate-50 px-3 py-1.5 border border-slate-200 hover:border-red-200"
                >
                    {isGenerating ? 'Recalculating...' : 'Reset Protocol'}
                </button>
            </div>

            <div className="bg-white p-8 border border-slate-200">
                {/* Day Navigation Tabs */}
                {workout.days?.length > 1 && (
                    <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-100 pb-4">
                        {workout.days.map((d, idx) => (
                            <button
                                key={idx}
                                onClick={() => { setActiveDayIndex(idx); setCompletedMsg(''); }}
                                className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${activeDayIndex === idx
                                    ? 'bg-slate-900 text-white'
                                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                                    }`}
                            >
                                Day {idx + 1}
                            </button>
                        ))}
                    </div>
                )}

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-10 pb-6 border-b border-slate-100">
                    <div>
                        <div className="flex items-center space-x-3 mb-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Module Focus</p>
                            {todayRoutine?.isCompleted && (
                                <span className="bg-green-100 text-green-700 font-bold uppercase tracking-widest text-[9px] px-2 py-0.5 rounded-full">
                                    Completed
                                </span>
                            )}
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900">{todayRoutine?.day}</h3>
                    </div>
                    <div className="flex space-x-6 mt-4 sm:mt-0">
                        <div className="text-right">
                            <span className="block text-xl font-bold text-slate-900">{todayRoutine?.exercises?.length}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Movements</span>
                        </div>
                        <div className="text-right">
                            <span className="block text-xl font-bold text-slate-900">{todayRoutine?.duration}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Minutes</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {todayRoutine?.exercises?.map((ex, index) => (
                        <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-50 last:border-0 last:pb-0">
                            <div className="flex-1">
                                <div className="flex items-center space-x-4 mb-2">
                                    <span className="text-xs font-mono text-slate-400 w-6">0{index + 1}</span>
                                    <h4 className="font-semibold text-base text-slate-900">{ex.name}</h4>
                                </div>
                            </div>
                            <div className="ml-10 sm:ml-0 flex items-center space-x-8">
                                <div className="text-sm font-medium text-slate-700 w-24">
                                    {ex.sets} × {ex.reps}
                                </div>
                                <div className="text-xs text-slate-400 font-mono w-16 text-right">
                                    {ex.rest}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center sm:justify-between gap-4">
                    <button
                        onClick={handleComplete}
                        disabled={isCompleting || todayRoutine?.isCompleted}
                        className={`w-full sm:w-auto px-8 font-medium text-sm py-3.5 transition-colors disabled:opacity-50 ${todayRoutine?.isCompleted ? 'bg-green-900 text-white hover:bg-green-800' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                    >
                        {isCompleting ? 'Syncing...' : todayRoutine?.isCompleted ? 'Module Logged' : 'Execute Module'}
                    </button>
                    {completedMsg && !todayRoutine?.isCompleted && (
                        <span className={`text-sm font-bold uppercase tracking-widest ${completedMsg.includes('Failed') ? 'text-red-500' : 'text-slate-900'}`}>
                            {completedMsg}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WorkoutPlan;
