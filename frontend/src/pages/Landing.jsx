import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Database, Scale, Zap, Shield, Target, Menu, X, ArrowRight } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Landing = () => {
    const { user } = useContext(AuthContext);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [legendQuote, setLegendQuote] = useState({ text: "", author: "" });

    useEffect(() => {
        const quotes = [
            { text: "The last three or four reps is what makes the muscle grow. This area of pain divides a champion from someone who is not.", author: "Arnold Schwarzenegger" },
            { text: "Everybody wants to be a bodybuilder, but nobody wants to lift no heavy-ass weights.", author: "Ronnie Coleman" },
            { text: "I don't eat for taste, I eat for function.", author: "Jay Cutler" },
            { text: "If you're capable of sending a man to the moon, you're capable of building a great body.", author: "Tom Platz" },
            { text: "Stimulate, do not annihilate.", author: "Lee Haney" },
            { text: "The iron never lies to you.", author: "Henry Rollins" },
            { text: "To be a champion, you must act like a champion.", author: "Lou Ferrigno" },
            { text: "Rule out the impossible and whatever is left, however improbable, must be the truth.", author: "Dorian Yates" }
        ];
        setLegendQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-slate-200">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
                    <div className="flex items-center space-x-4 md:space-x-10">
                        <h1 className="text-xl font-bold tracking-tight">FitForge.</h1>
                        <nav className="hidden md:flex space-x-6 text-sm font-medium">
                            <Link to="/exercises" className="text-slate-500 hover:text-slate-900 transition-colors">Exercises</Link>
                            <Link to="/nutrition" className="text-slate-500 hover:text-slate-900 transition-colors">Nutrition</Link>
                        </nav>
                    </div>
                    <div className="flex items-center space-x-3 sm:space-x-6 text-xs sm:text-sm font-medium">
                        {user ? (
                            <Link to="/dashboard" className="text-white bg-slate-900 px-4 sm:px-5 py-2 hover:bg-slate-800 transition-colors">
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" className="text-slate-500 hover:text-slate-900 transition-colors hidden sm:block">Sign In</Link>
                                <Link to="/register" className="text-white bg-slate-900 px-4 sm:px-5 py-2 hover:bg-slate-800 transition-colors">Start Building</Link>
                            </>
                        )}
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-slate-900 p-2 -mr-2">
                            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-slate-100 bg-white px-6 py-5 space-y-4 shadow-xl">
                        <Link to="/exercises" className="block text-slate-600 hover:text-slate-900 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Movement Database</Link>
                        <Link to="/nutrition" className="block text-slate-600 hover:text-slate-900 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Nutrition Database</Link>
                        {!user && (
                            <Link to="/login" className="block text-slate-600 hover:text-slate-900 font-medium sm:hidden" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
                        )}
                    </div>
                )}
            </header>

            <main>
                {/* Hero Section */}
                <section className="relative pt-32 sm:pt-40 pb-20 sm:pb-32 px-4 sm:px-6 overflow-hidden flex flex-col items-center text-center animate-in fade-in duration-700 z-0">
                    {/* Subtle Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-3xl -z-10 opacity-70"></div>

                    <div className="inline-block px-4 py-1.5 bg-white border border-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-widest mb-8 rounded-full shadow-sm">
                        System v2.0 Live
                    </div>
                    <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-slate-900 via-slate-800 to-slate-500 leading-[1.1] max-w-4xl pb-2">
                        Algorithmic physiology. <br className="hidden sm:block" />
                        Zero distractions.
                    </h1>
                    <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mt-6">
                        Stop guessing. FitForge calculates your Base Metabolic Rate, synthesizes your optimal macronutrient splits, and generates precise training protocols dynamically.
                    </p>
                    <div className="pt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/register" className="w-full sm:w-auto bg-slate-900 text-white font-medium px-8 py-4 text-sm hover:bg-slate-800 transition-colors uppercase tracking-widest flex items-center justify-center gap-2">
                            Initialize Protocol <Zap size={16} />
                        </Link>
                        <a href="#how-it-works" className="w-full sm:w-auto bg-white border border-slate-300 text-slate-900 font-medium px-8 py-4 text-sm hover:bg-slate-50 transition-colors uppercase tracking-widest text-center">
                            View Documentation
                        </a>
                    </div>
                </section>

                {/* Database Integration Banner */}
                <section className="border-y border-slate-200 bg-white py-12 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Data Integration</p>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">Powered by real kinetics.</h3>
                            <Link to="/exercises" className="inline-block bg-slate-100 text-slate-900 font-bold uppercase tracking-widest text-[10px] px-4 py-2 hover:bg-slate-200 transition-colors">
                                Explore Movement DB →
                            </Link>
                        </div>
                        <p className="text-slate-500 text-sm max-w-lg md:text-right">
                            Our training protocols don't use generic placeholders. We actively scrape and integrate hundreds of verified movements directly from the <strong>Muscle & Strength</strong> database to ensure your splits are biologically sound.
                        </p>
                    </div>
                </section>

                {/* How It Works Section */}
                <section id="how-it-works" className="py-20 sm:py-32 px-4 sm:px-6 max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">The Mathematics of Growth</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">How our system processes your biometrics to generate actionable regimens.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-10 border border-slate-200 hover:border-slate-300 hover:-translate-y-1 shadow-sm hover:shadow-md transition-all duration-300 group rounded-2xl">
                            <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Scale size={28} className="text-slate-700" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">1. Assessment</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                You input your age, weight, height, and activity level. We calculate your BMR using the Mifflin-St Jeor equation, establishing your thermodynamic baseline.
                            </p>
                        </div>
                        <div className="bg-white p-10 border border-slate-200 hover:border-slate-300 hover:-translate-y-1 shadow-sm hover:shadow-md transition-all duration-300 group rounded-2xl">
                            <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Activity size={28} className="text-slate-700" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">2. Synthesis</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                The system layers your goals (Fat Loss, Maintenance, Surplus) to generate strict macronutrient targets (Protein, Carbs, Fats) to fuel optimal recovery.
                            </p>
                        </div>
                        <div className="bg-white p-10 border border-slate-200 hover:border-slate-300 hover:-translate-y-1 shadow-sm hover:shadow-md transition-all duration-300 group rounded-2xl">
                            <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Database size={28} className="text-slate-700" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">3. Execution</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                We compile a custom Push/Pull/Legs or Full Body lifting protocol mapped specifically to the equipment you have available in your environment.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Benefits / Feature Grid */}
                <section className="relative py-20 sm:py-32 px-4 sm:px-6 bg-slate-950 text-white overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
                    <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-slate-800/50 rounded-full blur-[100px] pointer-events-none"></div>

                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="mb-20 text-center sm:text-left">
                            <h2 className="text-4xl sm:text-5xl font-black tracking-tighter mb-6 text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-500">Core Infrastructure</h2>
                            <p className="text-slate-400 max-w-2xl text-lg">Everything you need to track progression, nothing you don't.</p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 p-8 rounded-3xl hover:-translate-y-2 hover:border-slate-600 hover:shadow-2xl hover:shadow-slate-700/20 transition-all duration-300 group">
                                <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-slate-700 transition-all">
                                    <Target size={28} className="text-slate-300" strokeWidth={1.5} />
                                </div>
                                <h4 className="text-xl font-bold mb-3 text-slate-100">Macro Targeting</h4>
                                <p className="text-sm text-slate-400 leading-relaxed">Strict gram-level tracking for your daily nutritional requirements.</p>
                            </div>
                            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 p-8 rounded-3xl hover:-translate-y-2 hover:border-slate-600 hover:shadow-2xl hover:shadow-slate-700/20 transition-all duration-300 group">
                                <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-slate-700 transition-all">
                                    <Shield size={28} className="text-slate-300" strokeWidth={1.5} />
                                </div>
                                <h4 className="text-xl font-bold mb-3 text-slate-100">Equipment Filtering</h4>
                                <p className="text-sm text-slate-400 leading-relaxed">Routines adapt instantly based on whether you have a full gym or just bodyweight.</p>
                            </div>
                            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 p-8 rounded-3xl hover:-translate-y-2 hover:border-slate-600 hover:shadow-2xl hover:shadow-slate-700/20 transition-all duration-300 group">
                                <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-slate-700 transition-all">
                                    <Activity size={28} className="text-slate-300" strokeWidth={1.5} />
                                </div>
                                <h4 className="text-xl font-bold mb-3 text-slate-100">Progress Analytics</h4>
                                <p className="text-sm text-slate-400 leading-relaxed">Long-term trajectory graphs mapping your weight logs against your adherence streaks.</p>
                            </div>
                            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 p-8 rounded-3xl hover:-translate-y-2 hover:border-slate-600 hover:shadow-2xl hover:shadow-slate-700/20 transition-all duration-300 group">
                                <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-slate-700 transition-all">
                                    <Database size={28} className="text-slate-300" strokeWidth={1.5} />
                                </div>
                                <h4 className="text-xl font-bold mb-3 text-slate-100">Custom Plate Builder</h4>
                                <p className="text-sm text-slate-400 leading-relaxed">Construct custom dietary logs that mathematically pull against your caloric ceilings.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 sm:py-32 px-4 sm:px-6 bg-slate-50 border-t border-slate-100">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-slate-900 mb-6">Ready to commence?</h2>
                        <p className="text-slate-500 mb-10 text-lg sm:text-xl max-w-2xl mx-auto">Deploy your biometric profile and let the system calculate your optimal path forward.</p>
                        <Link to="/register" className="inline-block bg-slate-900 text-white font-medium px-10 py-5 text-sm hover:bg-slate-800 transition-colors uppercase tracking-widest shadow-sm w-full sm:w-auto">
                            Create System Account
                        </Link>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-slate-100 border-t border-slate-200 py-16 text-center text-slate-500 px-6">
                <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
                    <p className="text-base sm:text-lg italic text-slate-600 font-medium">"{legendQuote.text}"</p>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">— {legendQuote.author} —</p>
                    <div className="w-12 h-px bg-slate-300 my-2"></div>
                    <span className="text-sm font-black tracking-widest uppercase text-slate-900">FitForge Gym</span>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
