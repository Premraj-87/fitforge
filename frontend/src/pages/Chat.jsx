import { useState, useRef, useEffect } from 'react';
import api from '../services/api';

const Chat = () => {
    const [messages, setMessages] = useState([
        { id: 1, text: "System initialized. How can I assist with your fitness protocol today?", sender: "bot" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e?.preventDefault();
        if (!input.trim()) return;

        const userMessage = { id: Date.now(), text: input, sender: "user" };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const res = await api.post('/chat', { message: input });
            const botMessage = { id: Date.now() + 1, text: res.data.reply, sender: "bot" };
            setMessages(prev => [...prev, botMessage]);
        } catch (err) {
            console.error('Chat error:', err);
            const errorMsg = { id: Date.now() + 1, text: "Communication error. Please try again.", sender: "bot" };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    const suggestions = [
        "Log weight 75",
        "What are my macros?",
        "Check my streak",
        "Substitute bench press"
    ];

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col pt-4 animate-in fade-in duration-500">
            <div className="flex justify-between items-end border-b border-slate-200 pb-6 mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">AI Logic Core</h2>
                    <p className="text-slate-500 text-sm mt-2 font-mono uppercase tracking-widest">Protocol Assistant</p>
                </div>
            </div>

            <div className="flex-1 bg-white border border-slate-200 flex flex-col overflow-hidden">
                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[75%] p-4 text-sm transition-all duration-300 hover:scale-[1.01] ${msg.sender === 'user'
                                ? 'bg-slate-900 text-white border border-slate-900 shadow-md'
                                : 'bg-white text-slate-900 border border-slate-200 shadow-sm'
                                }`}
                            >
                                <p className="leading-relaxed">{msg.text}</p>
                                <span className={`block mt-2 text-[9px] font-mono uppercase tracking-widest ${msg.sender === 'user' ? 'text-slate-400 opacity-75' : 'text-slate-400'}`}>
                                    {msg.sender === 'user' ? 'You' : 'System Coach'}
                                </span>
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex justify-start">
                            <div className="max-w-[75%] p-4 bg-white border border-slate-200 flex space-x-2">
                                <div className="w-1.5 h-1.5 bg-slate-900 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-1.5 h-1.5 bg-slate-900 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-1.5 h-1.5 bg-slate-900 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-6 bg-white border-t border-slate-200">
                    <div className="flex space-x-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                        {suggestions.map((suggestion, idx) => (
                            <button
                                key={idx}
                                onClick={() => { setInput(suggestion); }}
                                className="whitespace-nowrap px-4 py-2 border border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-colors"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSend} className="flex space-x-4">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Query the system..."
                            className="flex-1 bg-white border border-slate-300 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-slate-900 transition-colors"
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="bg-slate-900 text-white px-8 py-3 text-sm font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
                        >
                            Transmit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Chat;
