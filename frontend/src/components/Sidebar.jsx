import { Link, useLocation } from 'react-router-dom';
import { Home, Dumbbell, Utensils, TrendingUp, Trophy, MessageSquare, Settings, X, Globe } from 'lucide-react';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
    const location = useLocation();

    const navItems = [
        { label: 'Overview', path: '/dashboard', icon: <Home size={20} className="stroke-[1.5]" /> },
        { label: 'Workout', path: '/dashboard/workout', icon: <Dumbbell size={20} className="stroke-[1.5]" /> },
        { label: 'Diet', path: '/dashboard/diet', icon: <Utensils size={20} className="stroke-[1.5]" /> },
        { label: 'Progress', path: '/dashboard/progress', icon: <TrendingUp size={20} className="stroke-[1.5]" /> },
        { label: 'Ranks', path: '/dashboard/leaderboard', icon: <Trophy size={20} className="stroke-[1.5]" /> },
        { label: 'AI Coach', path: '/dashboard/chat', icon: <MessageSquare size={20} className="stroke-[1.5]" /> },
    ];

    const bottomNavItems = [
        { label: 'Settings', path: '/dashboard/settings', icon: <Settings size={20} className="stroke-[1.5]" /> },
        { label: 'Public Site', path: '/', icon: <Globe size={20} className="stroke-[1.5]" /> }
    ];

    return (
        <aside className={`fixed inset-y-0 left-0 bg-white w-64 border-r border-slate-200 z-50 flex flex-col transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="h-20 flex items-center justify-between px-8 border-b border-slate-100 shrink-0">
                <Link to="/" onClick={() => setSidebarOpen?.(false)} className="text-xl font-bold tracking-tight text-slate-900 block w-full hover:opacity-75 transition-opacity">
                    FitForge.
                </Link>
                <button onClick={() => setSidebarOpen?.(false)} className="lg:hidden text-slate-400 hover:text-slate-900 p-2 -mr-2">
                    <X size={20} />
                </button>
            </div>

            <div className="flex-1 px-4 py-6 flex flex-col justify-between overflow-y-auto">
                <nav className="space-y-1">
                    <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Core</p>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.label}
                                to={item.path}
                                onClick={() => setSidebarOpen?.(false)}
                                className={`flex items-center space-x-3 px-4 py-3 text-sm transition-colors group ${isActive
                                    ? 'bg-slate-50 text-slate-900 font-semibold border-l-2 border-slate-900'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border-l-2 border-transparent'
                                    }`}
                            >
                                <div className={`${isActive ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-900'} transition-colors`}>
                                    {item.icon}
                                </div>
                                <span>{item.label}</span>
                            </Link>
                        )
                    })}
                </nav>

                <nav className="space-y-1 mb-6">
                    <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">System</p>
                    {bottomNavItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.label}
                                to={item.path}
                                onClick={() => setSidebarOpen?.(false)}
                                className={`flex items-center space-x-3 px-4 py-3 text-sm transition-colors group ${isActive
                                    ? 'bg-slate-50 text-slate-900 font-semibold border-l-2 border-slate-900'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border-l-2 border-transparent'
                                    }`}
                            >
                                <div className={`${isActive ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-900'} transition-colors`}>
                                    {item.icon}
                                </div>
                                <span>{item.label}</span>
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;
