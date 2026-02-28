import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Menu } from 'lucide-react';

const Topbar = ({ setSidebarOpen }) => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [showNotifications, setShowNotifications] = useState(false);
    const [currentQuote, setCurrentQuote] = useState(null);

    const motivationalQuotes = [
        { text: "The worst thing I can be is the same as everybody else.", author: "Arnold Schwarzenegger" },
        { text: "There is no limit to what you can achieve.", author: "Ronnie Coleman" },
        { text: "Sell yourself short on nutrition and you're selling yourself short on maximizing your physique development.", author: "Dorian Yates" },
        { text: "Consistency is the key to achieving and maintaining a great physique.", author: "Jay Cutler" },
        { text: "Vision creates faith and faith creates willpower.", author: "Arnold Schwarzenegger" },
        { text: "I don't eat for taste, I eat for function.", author: "Jay Cutler" }
    ];

    const toggleNotifications = () => {
        if (!showNotifications) {
            const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
            setCurrentQuote(randomQuote);
        }
        setShowNotifications(!showNotifications);
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    return (
        <header className="sticky top-0 right-0 left-0 lg:left-64 h-20 bg-white flex items-center justify-between px-6 lg:px-10 z-10 border-b border-slate-200">
            <div className="flex items-center">
                <button onClick={() => setSidebarOpen?.(true)} className="p-2 -ml-2 mr-4 text-slate-900 lg:hidden hover:bg-slate-50 transition-colors">
                    <Menu size={20} className="stroke-[1.5]" />
                </button>

                {/* Search Bar */}
                <div className="hidden md:flex items-center bg-transparent border-b border-slate-300 py-2 w-64 focus-within:border-slate-900 transition-colors">
                    <Search size={16} className="text-slate-400 mr-3 stroke-[1.5]" />
                    <input
                        type="text"
                        placeholder="Search metrics..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                const q = searchQuery.toLowerCase();
                                if (q.includes('workout') || q.includes('exercise') || q.includes('plan')) {
                                    navigate('/dashboard/workout');
                                } else if (q.includes('diet') || q.includes('food') || q.includes('nutrition') || q.includes('meal')) {
                                    navigate('/dashboard/diet');
                                } else if (q.includes('progress') || q.includes('stat') || q.includes('chart')) {
                                    navigate('/dashboard/progress');
                                } else if (q.includes('leaderboard') || q.includes('rank') || q.includes('score')) {
                                    navigate('/dashboard/leaderboard');
                                } else if (q.includes('setting') || q.includes('profile') || q.includes('account')) {
                                    navigate('/dashboard/settings');
                                } else if (q.includes('chat') || q.includes('assistant') || q.includes('ai')) {
                                    navigate('/dashboard/chat');
                                } else {
                                    alert(`Unknown command: "${searchQuery}".Try keywords like 'workout', 'diet', 'progress', or 'settings'.`);
                                }
                                setSearchQuery('');
                            }
                        }}
                        className="bg-transparent border-none outline-none w-full text-sm text-slate-800 placeholder-slate-400"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-6 relative">
                <button
                    onClick={toggleNotifications}
                    className={`relative transition - colors ${showNotifications ? 'text-slate-900' : 'text-slate-400 hover:text-slate-900'} `}
                >
                    <Bell size={20} className="stroke-[1.5]" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-slate-900 rounded-full"></span>
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                    <div className="absolute top-12 right-12 w-80 bg-white border border-slate-200 shadow-xl p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Incoming Transmission</h4>
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        </div>
                        {currentQuote && (
                            <div className="space-y-4">
                                <p className="text-sm font-medium text-slate-900 leading-relaxed">
                                    "{currentQuote.text}"
                                </p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">
                                    — {currentQuote.author}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                <div onClick={() => navigate('/dashboard/settings')} className="flex items-center space-x-3 cursor-pointer group pl-6 border-l border-slate-200">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-slate-900 leading-tight group-hover:underline decoration-1 underline-offset-2">{user?.name || 'User'}</p>
                    </div>
                    <div className="w-8 h-8 bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-900 border border-slate-300">
                        {getInitials(user?.name)}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
