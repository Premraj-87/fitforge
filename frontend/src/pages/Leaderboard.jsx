import { useState, useEffect } from 'react';
import api from '../services/api';

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fallback mock data
    const mockLeaders = [
        { _id: '1', userId: { name: 'Prem Raj Anand' }, totalPoints: 1200, tier: 'Diamond' },
        { _id: '2', userId: { name: 'Prem Ranjan' }, totalPoints: 1150, tier: 'Gold' },
        { _id: '3', userId: { name: 'Anjali Desai' }, totalPoints: 980, tier: 'Silver' },
        { _id: '4', userId: { name: 'Vikram Singh' }, totalPoints: 850, tier: 'Bronze' },
        { _id: '5', userId: { name: 'Priya Verma' }, totalPoints: 600, tier: 'Bronze' },
    ];

    useEffect(() => {
        const fetchLeaderboard = async () => {
            const cachedLeaderboard = localStorage.getItem('cache_leaderboard');
            if (cachedLeaderboard) {
                setLeaders(JSON.parse(cachedLeaderboard));
                setLoading(false);
            }

            try {
                const res = await api.get('/leaderboard');
                if (res.data.length > 0) {
                    setLeaders(res.data);
                    localStorage.setItem('cache_leaderboard', JSON.stringify(res.data));
                } else {
                    setLeaders(mockLeaders);
                }
            } catch (err) {
                console.error('Failed to load leaderboard', err);
                if (!cachedLeaderboard) setLeaders(mockLeaders);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="text-sm font-medium text-slate-400 animate-pulse">Requesting hierarchy...</div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end border-b border-slate-200 pb-6">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">Leaderboard</h2>
                    <p className="text-slate-500 text-sm mt-2 font-mono uppercase tracking-widest">Global Ranks</p>
                </div>
            </div>

            <div className="bg-white border border-slate-200">
                <div className="px-8 py-4 bg-slate-50 border-b border-slate-200 flex items-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <span className="w-16 text-center">Rank</span>
                    <span className="w-64 ml-4">Subject</span>
                    <span className="w-32">Class</span>
                    <span className="flex-1 text-right">Points</span>
                </div>

                <ul className="divide-y divide-slate-100">
                    {leaders.map((leader, index) => (
                        <li key={leader._id} className="p-4 px-8 flex items-center hover:bg-slate-50 transition-colors">
                            <div className="w-16 text-center text-lg font-mono font-bold text-slate-900">
                                {index + 1}
                            </div>

                            <div className="w-64 ml-4">
                                <h4 className="text-sm font-semibold text-slate-900">{leader.userId?.name}</h4>
                            </div>

                            <div className="w-32">
                                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">
                                    {leader.tier}
                                </span>
                            </div>

                            <div className="flex-1 text-right">
                                <span className="font-mono text-lg font-bold text-slate-900">{leader.totalPoints}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Leaderboard;
