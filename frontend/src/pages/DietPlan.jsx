import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const DietPlan = () => {
    const [diet, setDiet] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);

    const foodDatabase = [
        // Indian Proteins
        { id: 11, name: 'Paneer (Raw)', portion: '100g', calories: 265, protein: 18, carbs: 1.2, fats: 20, type: 'Protein' },
        { id: 12, name: 'Soya Chunks (Boiled)', portion: '50g (dry)', calories: 172, protein: 26, carbs: 16, fats: 0.5, type: 'Protein' },
        { id: 13, name: 'Dahi (Plain Curd)', portion: '150g', calories: 90, protein: 5, carbs: 7, fats: 4.5, type: 'Protein' },
        { id: 14, name: 'Chicken Curry (Home style)', portion: '200g', calories: 240, protein: 25, carbs: 8, fats: 12, type: 'Protein' },
        { id: 15, name: 'Egg Bhurji', portion: '2 eggs', calories: 170, protein: 13, carbs: 2, fats: 12, type: 'Protein' },
        { id: 16, name: 'Tofu (Firm)', portion: '100g', calories: 144, protein: 15, carbs: 3, fats: 8, type: 'Protein' },
        // Indian Carbs
        { id: 17, name: 'Roti (Whole Wheat)', portion: '1 piece', calories: 120, protein: 4, carbs: 22, fats: 3, type: 'Carbs' },
        { id: 18, name: 'White Rice (Cooked)', portion: '150g', calories: 195, protein: 4, carbs: 42, fats: 0.5, type: 'Carbs' },
        { id: 19, name: 'Toor Dal (Cooked)', portion: '150g', calories: 180, protein: 11, carbs: 32, fats: 1, type: 'Carbs' },
        { id: 20, name: 'Chana Masala', portion: '150g', calories: 240, protein: 12, carbs: 35, fats: 6, type: 'Carbs' },
        { id: 21, name: 'Rajma (Kidney Beans)', portion: '150g', calories: 210, protein: 10, carbs: 38, fats: 2, type: 'Carbs' },
        { id: 22, name: 'Poha', portion: '150g', calories: 250, protein: 5, carbs: 45, fats: 6, type: 'Carbs' },
        { id: 23, name: 'Idli', portion: '2 pieces', calories: 116, protein: 4, carbs: 24, fats: 0.4, type: 'Carbs' },
        { id: 24, name: 'Upma', portion: '150g', calories: 220, protein: 6, carbs: 35, fats: 7, type: 'Carbs' },
        { id: 25, name: 'Moong Dal Chilla', portion: '1 piece', calories: 130, protein: 6, carbs: 18, fats: 4, type: 'Carbs' },
        { id: 26, name: 'Sweet Potato (Shakarkandi)', portion: '150g', calories: 135, protein: 3, carbs: 31, fats: 0.2, type: 'Carbs' },
        // Veggies / Sides
        { id: 27, name: 'Mixed Veg Sabzi (Dry)', portion: '150g', calories: 120, protein: 3, carbs: 12, fats: 7, type: 'Veggies' },
        { id: 28, name: 'Bhindi Masala (Okra)', portion: '150g', calories: 140, protein: 3, carbs: 10, fats: 10, type: 'Veggies' },
        { id: 29, name: 'Palak Paneer', portion: '200g', calories: 280, protein: 14, carbs: 10, fats: 22, type: 'Veggies' },
        { id: 30, name: 'Cucumber Salad (Kachumber)', portion: '100g', calories: 20, protein: 1, carbs: 4, fats: 0, type: 'Veggies' },
        // Fats
        { id: 31, name: 'Desi Ghee', portion: '1 tbsp', calories: 130, protein: 0, carbs: 0, fats: 14, type: 'Fats' },
        { id: 32, name: 'Almonds (Badam)', portion: '30g', calories: 170, protein: 6, carbs: 6, fats: 15, type: 'Fats' },
        { id: 33, name: 'Walnuts (Akhrot)', portion: '30g', calories: 185, protein: 4, carbs: 4, fats: 18, type: 'Fats' },
        { id: 34, name: 'Peanuts (Roasted)', portion: '30g', calories: 160, protein: 7, carbs: 5, fats: 14, type: 'Fats' }
    ];

    const handleAddItem = (item) => {
        setSelectedItems([...selectedItems, item]);
    };

    const handleRemoveItem = (index) => {
        const newItems = [...selectedItems];
        newItems.splice(index, 1);
        setSelectedItems(newItems);
    };

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const res = await api.get('/plans');
                setDiet(res.data.dietPlan);
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
            <div className="text-sm font-medium text-slate-400 animate-pulse">Calculating nutrition logic...</div>
        </div>
    );

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const res = await api.post('/plans/generate');
            setDiet(res.data.dietPlan);
            window.location.reload();
        } catch (err) {
            console.error('Failed to generate plan', err);
        } finally {
            setIsGenerating(false);
        }
    };

    if (!diet) {
        return (
            <div className="p-12 bg-white border border-slate-200 text-center animate-in fade-in duration-500 max-w-2xl mx-auto mt-10">
                <h2 className="text-2xl font-bold mb-3 text-slate-900">No Diet Protocol</h2>
                <p className="text-slate-500 mb-8 text-sm">Generate your metrics to formulate a dietary structure.</p>
                <button onClick={handleGenerate} disabled={isGenerating} className="bg-slate-900 text-white px-6 py-3 text-sm font-medium hover:bg-slate-800 transition-colors disabled:opacity-50">
                    {isGenerating ? 'Computing...' : 'Generate Metrics'}
                </button>
            </div>
        );
    }

    const totalMealCals = diet.meals?.reduce((dayTotal, meal) =>
        dayTotal + meal.foodItems.reduce((mealTotal, item) => mealTotal + item.calories, 0)
        , 0) || 0;

    const customCals = selectedItems.reduce((acc, item) => acc + item.calories, 0);
    const customProtein = selectedItems.reduce((acc, item) => acc + item.protein, 0);
    const customCarbs = selectedItems.reduce((acc, item) => acc + item.carbs, 0);
    const customFats = selectedItems.reduce((acc, item) => acc + item.fats, 0);

    const calsDiff = diet.dailyTarget?.calories - customCals;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end border-b border-slate-200 pb-6">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">Dietary Logistics</h2>
                    <p className="text-slate-500 text-sm mt-2 font-mono uppercase tracking-widest">
                        Caloric Target: {diet.dailyTarget?.calories}
                    </p>
                </div>
            </div>

            {/* Main Calories & Macros Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Main Calorie Summary */}
                <div className="bg-white p-8 border border-slate-200 flex flex-col justify-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Total Energy</p>
                    <div className="text-4xl font-mono text-slate-900 tracking-tighter mb-1">{totalMealCals}</div>
                    <div className="text-sm text-slate-500 font-medium">Logged Current</div>
                </div>

                {/* Macros */}
                <div className="md:col-span-3 grid grid-cols-3 gap-6">
                    <div className="bg-white p-8 border border-slate-200 flex flex-col justify-between">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">Protein Target</p>
                        <div>
                            <span className="text-3xl font-mono text-slate-900 tracking-tighter">{diet.dailyTarget?.protein}</span>
                            <span className="text-sm font-bold text-slate-400 ml-1">g</span>
                        </div>
                    </div>
                    <div className="bg-white p-8 border border-slate-200 flex flex-col justify-between">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">Carb Target</p>
                        <div>
                            <span className="text-3xl font-mono text-slate-900 tracking-tighter">{diet.dailyTarget?.carbs}</span>
                            <span className="text-sm font-bold text-slate-400 ml-1">g</span>
                        </div>
                    </div>
                    <div className="bg-white p-8 border border-slate-200 flex flex-col justify-between">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">Fat Target</p>
                        <div>
                            <span className="text-3xl font-mono text-slate-900 tracking-tighter">{diet.dailyTarget?.fats}</span>
                            <span className="text-sm font-bold text-slate-400 ml-1">g</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Meals List */}
            <div className="space-y-6 mt-12">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Daily Schedule</h3>
                {diet.meals?.map((meal, index) => {
                    const mealCals = meal.foodItems.reduce((acc, curr) => acc + curr.calories, 0);
                    return (
                        <div key={index} className="bg-white border border-slate-200">
                            <div className="flex justify-between items-center bg-slate-50 px-8 py-4 border-b border-slate-200">
                                <div className="flex items-center space-x-4">
                                    <span className="text-xs font-mono font-bold text-slate-400">0{index + 1}</span>
                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">{meal.name}</h3>
                                </div>
                                <span className="text-xs font-mono font-bold text-slate-900">{mealCals} kcal</span>
                            </div>

                            <div className="px-8 py-6">
                                {meal.foodItems.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0 last:pb-0">
                                        <div className="flex flex-col w-1/3">
                                            <p className="font-semibold text-sm text-slate-900">{item.name}</p>
                                            <p className="text-xs text-slate-500 font-mono mt-1">{item.portion}</p>
                                        </div>
                                        <div className="hidden sm:flex flex-1 justify-center space-x-8 text-xs font-mono text-slate-500">
                                            <span className="w-12 text-center">{item.protein} P</span>
                                            <span className="w-12 text-center">{item.carbs} C</span>
                                            <span className="w-12 text-center">{item.fats} F</span>
                                        </div>
                                        <div className="w-16 text-right font-mono font-bold text-sm text-slate-900">
                                            {item.calories}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="pt-12 border-t border-slate-200 mt-16">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900">Custom Loadout</h3>
                        <p className="text-slate-500 text-sm mt-2 font-mono uppercase tracking-widest">
                            Build Your Protocol
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Database Selection */}
                    <div className="bg-white border border-slate-200 p-6 h-[500px] flex flex-col">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-6 border-b border-slate-100 pb-4">Approved Ingredients</h4>
                        <div className="overflow-y-auto pr-2 space-y-2 flex-1 scrollbar-thin scrollbar-thumb-slate-200">
                            {foodDatabase.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleAddItem(item)}
                                    className="w-full text-left p-3 hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors flex justify-between items-center group"
                                >
                                    <div>
                                        <span className="block text-sm font-bold text-slate-900">{item.name}</span>
                                        <span className="block text-[10px] font-mono text-slate-500 mt-1">{item.portion} • {item.calories} kcal</span>
                                    </div>
                                    <span className="text-xs font-bold text-slate-400 group-hover:text-slate-900 opacity-0 group-hover:opacity-100 transition-all">+ Add</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Current Custom Plate */}
                    <div className="bg-slate-900 text-white border border-slate-900 p-6 h-[500px] flex flex-col">
                        <div className="border-b border-slate-700 pb-4 mb-6">
                            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Active Log</h4>
                            <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
                                <div><span className="block text-slate-400">KCAL</span><span className={calsDiff < 0 ? 'text-red-400' : 'text-white'}>{Math.round(customCals)}</span></div>
                                <div><span className="block text-slate-400">PRO</span><span>{Math.round(customProtein)}</span></div>
                                <div><span className="block text-slate-400">CARB</span><span>{Math.round(customCarbs)}</span></div>
                                <div><span className="block text-slate-400">FAT</span><span>{Math.round(customFats)}</span></div>
                            </div>
                        </div>

                        <div className="overflow-y-auto pr-2 space-y-2 flex-1 scrollbar-thin scrollbar-thumb-slate-700">
                            {selectedItems.length === 0 ? (
                                <div className="text-center text-slate-500 text-sm mt-10">Select ingredients to build log.</div>
                            ) : (
                                selectedItems.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-800">
                                        <div>
                                            <span className="block text-xs font-bold text-slate-300">{item.name}</span>
                                            <span className="block text-[10px] font-mono text-slate-500">{item.calories} kcal</span>
                                        </div>
                                        <button onClick={() => handleRemoveItem(idx)} className="text-slate-500 hover:text-red-400 transition-colors text-xs font-bold uppercase tracking-widest px-2">Drop</button>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="pt-4 mt-auto border-t border-slate-700 space-y-2">
                            <div className="flex justify-between text-xs font-mono">
                                <span className="text-slate-400">Target: {diet.dailyTarget?.calories} kcal</span>
                                <span className={calsDiff < 0 ? 'text-red-400' : 'text-green-400'}>
                                    {calsDiff > 0 ? `+${Math.round(calsDiff)} Remaining` : `${Math.round(calsDiff)} Over`}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DietPlan;
