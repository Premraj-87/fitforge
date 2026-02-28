import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowLeft } from 'lucide-react';
import api from '../services/api';

const PublicExercises = () => {
    const [exercises, setExercises] = useState([]);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [loading, setLoading] = useState(true);

    const categories = ['All', 'Chest', 'Back', 'Shoulders', 'Legs', 'Arms', 'Core'];

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const res = await api.get('/data/exercises');
                setExercises(res.data);
            } catch (err) {
                console.error("Failed to fetch exercises", err);
            } finally {
                setLoading(false);
            }
        };
        fetchExercises();
    }, []);

    const filteredExercises = exercises.filter(ex => {
        const muscle = ex.targetMuscle || '';
        const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase()) || muscle.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = activeCategory === 'All' || muscle.toLowerCase() === activeCategory.toLowerCase();
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 sm:p-12 animate-in fade-in duration-500">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6">
                    <div>
                        <Link to="/" className="text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-2 text-sm font-bold uppercase tracking-widest mb-6">
                            <ArrowLeft size={16} /> Return to Base
                        </Link>
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Movement Database</h1>
                        <p className="text-slate-500 mt-2">Verified kinetic movements sourced from Muscle & Strength.</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-10 space-y-6">
                    <div className="bg-white border border-slate-200 p-2 flex items-center rounded-2xl shadow-sm focus-within:border-slate-900 focus-within:ring-4 focus-within:ring-slate-100 transition-all duration-300">
                        <Search size={20} className="text-slate-400 mx-4" />
                        <input
                            type="text"
                            placeholder="Search movement database..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-transparent border-none outline-none py-3 text-slate-900 font-medium placeholder:font-normal"
                        />
                    </div>

                    <div className="flex overflow-x-auto pb-4 scrollbar-none gap-3">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`whitespace-nowrap px-6 py-2.5 text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-300 ${activeCategory === cat
                                    ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10'
                                    : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-400 hover:text-slate-900 hover:shadow-sm'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="text-center text-slate-400 font-mono text-sm py-20 animate-pulse">Initializing Database...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredExercises.map((ex, idx) => (
                            <div key={idx} className="bg-white border border-slate-200 p-8 rounded-2xl hover:-translate-y-1 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-300 transition-all duration-300 group flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-6">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 bg-slate-100 px-3 py-1 rounded-full">{ex.targetMuscle}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-slate-700 transition-colors">{ex.name}</h3>
                                </div>
                                <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100">
                                    <div className="text-xs font-mono text-slate-500 bg-slate-50 px-3 py-1 rounded-lg">Eq: {ex.equipment || 'None'}</div>
                                    <a href={ex.link} target="_blank" rel="noreferrer" className="text-xs font-bold uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors flex items-center gap-1">
                                        View Data →
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && filteredExercises.length === 0 && (
                    <div className="text-center text-slate-500 py-20">No correlating movements found in the database.</div>
                )}
            </div>
        </div>
    );
};

export default PublicExercises;
