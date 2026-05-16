import { Link, Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Welcome({ auth, tenants = [] }) {
    const [activeModal, setActiveModal] = useState(null); // 'login', 'register', 'terms', 'about', 'contact'
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [scrolled, setScrolled] = useState(false);

    // Login Form
    const loginForm = useForm({
        email: '',
        password: '',
        remember: false,
    });

    // Register Form
    const registerForm = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'owner', // Default to owner
        tenant_id: '',
    });

    const onLoginSubmit = (e) => {
        e.preventDefault();
        loginForm.post(route('login'), {
            onFinish: () => loginForm.reset('password'),
        });
    };

    const onRegisterSubmit = (e) => {
        e.preventDefault();
        registerForm.post(route('register'), {
            onFinish: () => registerForm.reset('password', 'password_confirmation'),
        });
    };

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const closeAllModals = () => setActiveModal(null);

    const demoSlots = [
        { time: '06:00 PM', status: 'available' },
        { time: '07:00 PM', status: 'available' },
        { time: '08:00 PM', status: 'taken' },
        { time: '09:00 PM', status: 'available' },
        { time: '10:00 PM', status: 'taken' },
        { time: '11:00 PM', status: 'available' },
    ];

    return (
        <div className="bg-[#03070c] min-h-screen text-white selection:bg-emerald-500/30 selection:text-white font-inter bg-mesh">
            <Head title="Welcome to TurfBook" />

            {/* Navigation */}
            <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-black/80 backdrop-blur-xl py-4 border-b border-white/5' : 'py-8'}`}>
                <div className="container mx-auto px-10 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">🏟️</span>
                        <span className="text-2xl font-black uppercase tracking-tighter italic">
                            Turf<span className="text-emerald-500">Book</span>
                        </span>
                    </div>
                    
                    <div className="hidden lg:flex items-center gap-12">
                        <a href="#features" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">Features</a>
                        <a href="#pricing" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">Pricing</a>
                        <a href="#demo" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">Live Demo</a>
                        <button onClick={() => setActiveModal('about')} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">About Us</button>
                    </div>

                    <div className="flex items-center gap-6">
                        {auth.user ? (
                            <Link href={route('dashboard')} className="bg-emerald-500 text-black px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20">Dashboard →</Link>
                        ) : (
                            <>
                                <button onClick={() => setActiveModal('login')} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">Sign In</button>
                                <button onClick={() => setActiveModal('register')} className="bg-emerald-500 text-black px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20">Get Started</button>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="hero pt-48 pb-32">
                <div className="container mx-auto px-10 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,transparent_70%)] pointer-events-none"></div>
                    
                    <div className="inline-block px-6 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-10 animate-fade-in">
                        🚀 #1 Sports Arena Management Tool
                    </div>
                    <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter text-white mb-10 leading-[0.85] animate-slide-up">
                        Run Your Arena <br />
                        <span className="text-gradient">Like a Pro</span>
                    </h1>
                    <p className="text-lg md:text-xl font-bold text-slate-500 uppercase tracking-widest mb-16 max-w-2xl mx-auto leading-relaxed italic animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        The complete platform to manage bookings, payments, and customers for Cricket, Football, Badminton, and more. 
                        Automate your business and focus on the game.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row justify-center gap-8 mt-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                        <button onClick={() => setActiveModal('register')} className="bg-emerald-500 text-black px-12 py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-emerald-400 transition-all shadow-2xl shadow-emerald-500/40">Start Free Trial →</button>
                        <a href="#demo" className="bg-white/5 border border-white/10 text-white px-12 py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all">Watch Demo</a>
                    </div>

                    {/* Sports Categories */}
                    <div className="flex flex-wrap justify-center gap-4 mt-24 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                        {['🏏 Cricket', '⚽ Football', '🏸 Badminton', '🎾 Tennis', '🏀 Basketball'].map(sport => (
                            <div key={sport} className="px-6 py-3 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-emerald-500 transition-all cursor-default">
                                {sport}
                            </div>
                        ))}
                    </div>
                </div>
            </header>

            {/* Live Stats Strip */}
            <div className="stats-strip border-y border-white/5 bg-white/[0.01] py-16">
                <div className="container mx-auto px-10 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    <div>
                        <span className="stat-num text-6xl font-black text-white italic tracking-tighter">500+</span>
                        <span className="stat-label block text-[10px] font-black uppercase tracking-widest text-slate-600 mt-2">Arenas Managed</span>
                    </div>
                    <div>
                        <span className="stat-num text-6xl font-black text-white italic tracking-tighter">1M+</span>
                        <span className="stat-label block text-[10px] font-black uppercase tracking-widest text-slate-600 mt-2">Bookings Processed</span>
                    </div>
                    <div>
                        <span className="stat-num text-6xl font-black text-white italic tracking-tighter">99.9%</span>
                        <span className="stat-label block text-[10px] font-black uppercase tracking-widest text-slate-600 mt-2">System Uptime</span>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <section id="features" className="py-40">
                <div className="container mx-auto px-10">
                    <div className="text-center mb-32">
                        <h2 className="text-6xl md:text-7xl font-black uppercase italic tracking-tighter mb-4">Everything you need to <span className="text-gradient">Win</span></h2>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] italic">Powerful features to automate your sports business</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                        {[
                            { icon: '🌐', title: 'Branded Website', desc: 'Get your own unique subdomain instantly to accept bookings 24/7.' },
                            { icon: '💳', title: 'Digital Payments', desc: 'Secure Razorpay integration for instant online payments and automated receipts.' },
                            { icon: '🕐', title: 'Slot Management', desc: 'Easily configure pricing, weekend rates, and block slots for private events.' },
                            { icon: '📱', title: 'Customer Portal', desc: 'A dedicated space for your players to manage their bookings and reschedule slots.' }
                        ].map((feature, i) => (
                            <div key={i} className="p-12 rounded-[3.5rem] bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all group hover:border-emerald-500/20">
                                <div className="text-5xl mb-10 group-hover:scale-110 transition-transform duration-500">{feature.icon}</div>
                                <h3 className="text-2xl font-black uppercase tracking-tight mb-4 text-white italic">{feature.title}</h3>
                                <p className="text-slate-500 font-bold text-sm leading-relaxed uppercase">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Demo Section */}
            <section id="demo" className="py-40 bg-emerald-500/5">
                <div className="container mx-auto px-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                        <div className="lg:pe-16">
                            <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-8">
                                🎮 Player Experience
                            </div>
                            <h2 className="text-6xl md:text-7xl font-black uppercase italic tracking-tighter mb-8 leading-[0.85]">
                                Test as a <br />
                                <span className="text-gradient">Customer</span>
                            </h2>
                            <p className="text-slate-400 font-bold text-lg leading-relaxed mb-12 italic uppercase tracking-widest max-w-xl">
                                Want to see what your players will see? You can register as a customer to browse turfs, book matches, and manage your schedule.
                            </p>
                            <button onClick={() => { registerForm.setData('role', 'customer'); setActiveModal('register'); }} className="btn-outline border-blue-500/20 text-blue-400 px-12 py-5 text-xs font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all">Register as Customer →</button>
                        </div>
                        
                        <div className="space-y-12">
                            <div className="glass-panel p-12 rounded-[4rem] panel max-w-md mx-auto relative group hover:border-emerald-500/20 transition-all">
                                <div className="flex items-center gap-6 mb-10">
                                    <div className="w-16 h-16 rounded-[1.5rem] bg-blue-500 flex items-center justify-center text-3xl font-black italic shadow-2xl shadow-blue-500/20">A</div>
                                    <div>
                                        <h4 className="text-xl font-black text-white italic uppercase tracking-tight">Arjun Kumar</h4>
                                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Verified Pro Athlete</p>
                                    </div>
                                </div>
                                <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 border-l-4 border-emerald-500 relative overflow-hidden">
                                    <div className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-2">Upcoming Match</div>
                                    <div className="text-2xl font-black text-white italic uppercase tracking-tight">Green Arena - Slot A</div>
                                    <div className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Today, 08:00 PM</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-48">
                <div className="container mx-auto px-10 text-center">
                    <h2 className="text-7xl md:text-9xl font-black uppercase italic tracking-tighter mb-8">Simple <span className="text-emerald-500">Pricing</span></h2>
                    <p className="text-slate-400 font-bold max-w-xl mx-auto text-xl mb-32 leading-relaxed italic uppercase tracking-widest">Start with our 10-day free trial. No credit card required.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            { name: 'Starter', price: '499', features: ['1 Arena Ground', '100 Bookings / mo', 'Digital Calendar', 'Email Alerts'] },
                            { name: 'Pro Arena', price: '999', popular: true, features: ['3 Arena Grounds', 'Unlimited Bookings', 'Razorpay Integration', 'Analytics Dashboard'] },
                            { name: 'Club Elite', price: '1999', features: ['10+ Arena Grounds', 'Unlimited Everything', 'WhatsApp Automations', 'Dedicated Support'] }
                        ].map((plan, i) => (
                            <div key={i} className={`p-16 rounded-[4rem] bg-white/[0.02] border border-white/5 flex flex-col items-center relative transition-all duration-500 hover:scale-[1.02] ${plan.popular ? 'border-emerald-500/30 bg-emerald-500/[0.01]' : ''}`}>
                                {plan.popular && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-black text-[9px] font-black uppercase tracking-[0.3em] px-8 py-2 rounded-full shadow-2xl shadow-emerald-500/20">Most Popular</div>}
                                <h3 className="text-3xl font-black uppercase tracking-tight italic mb-10 text-white leading-none">{plan.name}</h3>
                                <div className="price flex items-baseline justify-center gap-1 mb-16">
                                    <span className="text-2xl font-black uppercase tracking-tighter italic text-slate-600">₹</span>
                                    <span className={`text-8xl font-black tracking-tighter italic ${plan.popular ? 'text-emerald-500' : 'text-white'}`}>{plan.price}</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">/mo</span>
                                </div>
                                <ul className="space-y-6 mb-20 flex-1 w-full">
                                    {plan.features.map(f => (
                                        <li key={f} className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-4">
                                            <span className="text-emerald-500">✅</span> {f}
                                        </li>
                                    ))}
                                </ul>
                                <button onClick={() => setActiveModal('register')} className={`w-full py-6 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-[10px] italic transition-all ${plan.popular ? 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-2xl shadow-emerald-500/20' : 'border-2 border-white/10 text-white hover:bg-white/5'}`}>
                                    Get Started
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="pt-40 pb-16 border-t border-white/5 bg-black/40">
                <div className="container mx-auto px-10">
                    <div className="flex flex-col md:flex-row justify-between gap-20 mb-32">
                        <div className="md:w-1/3">
                            <div className="flex items-center gap-4 mb-10">
                                <span className="text-4xl">🏟️</span>
                                <span className="text-3xl font-black uppercase tracking-tighter italic text-white">Turf<span className="text-emerald-500">Book</span></span>
                            </div>
                            <p className="text-slate-600 font-bold italic text-lg leading-relaxed uppercase tracking-widest">
                                The all-in-one operating system for sports arena management. Empowering turf owners to scale their business since 2026.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-20 flex-1">
                            {[
                                { title: 'Platform', links: ['Features', 'Pricing', 'Live Demo', 'Mobile App'] },
                                { title: 'Company', links: ['About Us', 'Contact Support', 'Success Stories'], actions: { 'About Us': () => setActiveModal('about'), 'Contact Support': () => setActiveModal('contact') } },
                                { title: 'Legal', links: ['Privacy Protocol', 'Terms of Service', 'Cookie Policy'], actions: { 'Terms of Service': () => setActiveModal('terms') } },
                            ].map((col, i) => (
                                <div key={i}>
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white mb-10 italic"># {col.title}</h4>
                                    <ul className="space-y-5">
                                        {col.links.map(link => (
                                            <li key={link}>
                                                <button 
                                                    onClick={() => col.actions && col.actions[link] ? col.actions[link]() : null}
                                                    className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-emerald-400 transition-all text-left"
                                                >
                                                    {link}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-800 italic">
                            © 2026 TurfBook Master Control. All Rights Reserved.
                        </p>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-800 italic">
                            Managed by <span className="text-emerald-500">Vynkra Intelligence Node</span>
                        </p>
                    </div>
                </div>
            </footer>

            {/* Modals */}
            {activeModal === 'login' && (
                <div className="modal-overlay" onClick={closeAllModals}>
                    <div className="modal-box animate-slide-up" onClick={e => e.stopPropagation()}>
                        <button onClick={closeAllModals} className="modal-close-btn">✕</button>
                        <div className="text-6xl mb-10 drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">🔐</div>
                        <h2 className="text-4xl font-black uppercase tracking-tighter italic mb-2 text-white">Welcome Back</h2>
                        <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-[9px] mb-10 italic ms-1">Access your operational intelligence center.</p>

                        <form onSubmit={onLoginSubmit} className="space-y-10">
                            <div className="form-group">
                                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-4 ms-2">Authentication Key (Email)</label>
                                <input 
                                    type="email" 
                                    className="form-control py-6 italic text-sm bg-white/5 border-white/5" 
                                    placeholder="operator@vynkra.com"
                                    value={loginForm.data.email}
                                    onChange={e => loginForm.setData('email', e.target.value)}
                                    required
                                />
                                {loginForm.errors.email && <div className="text-rose-500 text-[10px] font-black mt-2 uppercase italic tracking-widest ms-2">{loginForm.errors.email}</div>}
                            </div>
                            <div className="form-group">
                                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-4 ms-2">Access Cipher (Password)</label>
                                <input 
                                    type="password" 
                                    className="form-control py-6 italic text-sm bg-white/5 border-white/5" 
                                    placeholder="••••••••••••" 
                                    value={loginForm.data.password}
                                    onChange={e => loginForm.setData('password', e.target.value)}
                                    required
                                />
                                {loginForm.errors.password && <div className="text-rose-500 text-[10px] font-black mt-2 uppercase italic tracking-widest ms-2">{loginForm.errors.password}</div>}
                            </div>
                            <button type="submit" disabled={loginForm.processing} className="btn-premium w-full py-8 text-xs font-black uppercase italic tracking-[0.3em] shadow-[0_20px_50px_rgba(16,185,129,0.3)]">
                                {loginForm.processing ? 'DECRYPTING...' : 'INITIALIZE SESSION →'}
                            </button>
                        </form>
                        
                        <p className="text-center mt-16 text-[10px] font-black uppercase tracking-[0.2em] text-slate-800 italic">
                            Missing an arena node? <button onClick={() => setActiveModal('register')} className="text-emerald-500 ms-1 hover:underline">Deploy New Node</button>
                        </p>
                    </div>
                </div>
            )}

            {activeModal === 'register' && (
                <div className="modal-overlay" onClick={closeAllModals}>
                    <div className="modal-box animate-slide-up" onClick={e => e.stopPropagation()}>
                        <button onClick={closeAllModals} className="modal-close-btn">✕</button>
                        <div className="text-6xl mb-10 drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]">{registerForm.data.role === 'customer' ? '🏃' : '🏟️'}</div>
                        <h2 className="text-4xl font-black uppercase tracking-tighter italic mb-2 text-white">
                            {registerForm.data.role === 'customer' ? 'Athlete Join' : 'Deploy Arena'}
                        </h2>
                        <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-[9px] mb-10 italic ms-1">
                            {registerForm.data.role === 'customer' ? 'Join the global athlete network.' : 'Join the #1 sports management platform.'}
                        </p>

                        <form onSubmit={onRegisterSubmit} className="space-y-10">
                            <div className="form-group">
                                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-4 ms-2">Identity Signature (Full Name)</label>
                                <input 
                                    type="text" 
                                    className="form-control py-6 italic text-sm bg-white/5 border-white/5" 
                                    placeholder="Arjun Kumar" 
                                    value={registerForm.data.name}
                                    onChange={e => registerForm.setData('name', e.target.value)}
                                    required
                                />
                                {registerForm.errors.name && <div className="text-rose-500 text-[10px] font-black mt-2 uppercase italic tracking-widest ms-2">{registerForm.errors.name}</div>}
                            </div>
                            <div className="form-group">
                                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-4 ms-2">Contact Protocol (Email)</label>
                                <input 
                                    type="email" 
                                    className="form-control py-6 italic text-sm bg-white/5 border-white/5" 
                                    placeholder="operator@vynkra.com" 
                                    value={registerForm.data.email}
                                    onChange={e => registerForm.setData('email', e.target.value)}
                                    required
                                />
                                {registerForm.errors.email && <div className="text-rose-500 text-[10px] font-black mt-2 uppercase italic tracking-widest ms-2">{registerForm.errors.email}</div>}
                            </div>
                            <div className="grid grid-cols-2 gap-10">
                                <div className="form-group">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-4 ms-2">Secure Cipher</label>
                                    <input 
                                        type="password" 
                                        className="form-control py-6 italic text-sm bg-white/5 border-white/5" 
                                        placeholder="••••••••" 
                                        value={registerForm.data.password}
                                        onChange={e => registerForm.setData('password', e.target.value)}
                                        required
                                    />
                                    {registerForm.errors.password && <div className="text-rose-500 text-[10px] font-black mt-2 uppercase italic tracking-widest ms-2">{registerForm.errors.password}</div>}
                                </div>
                                <div className="form-group">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-4 ms-2">Verify Cipher</label>
                                    <input 
                                        type="password" 
                                        className="form-control py-6 italic text-sm bg-white/5 border-white/5" 
                                        placeholder="••••••••" 
                                        value={registerForm.data.password_confirmation}
                                        onChange={e => registerForm.setData('password_confirmation', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            {registerForm.data.role === 'customer' && (
                                <div className="form-group animate-fade-in">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-4 ms-2">Select Arena Ground</label>
                                    <select 
                                        className="form-control py-6 italic text-sm bg-white/5 border-white/5"
                                        value={registerForm.data.tenant_id}
                                        onChange={e => registerForm.setData('tenant_id', e.target.value)}
                                        required
                                    >
                                        <option value="">-- Discover Available Turfs --</option>
                                        {tenants.map(t => (
                                            <option key={t.id} value={t.id}>{t.name} - {t.city}</option>
                                        ))}
                                    </select>
                                    <p className="mt-4 text-[8px] font-bold text-slate-600 uppercase tracking-widest ms-2 italic">Select the arena you want to join. You can book slots here after registration.</p>
                                </div>
                            )}

                            <button type="submit" disabled={registerForm.processing} className="btn-premium w-full py-8 text-xs font-black uppercase italic tracking-[0.3em] shadow-[0_20px_50px_rgba(16,185,129,0.3)]">
                                {registerForm.processing ? 'INITIALIZING...' : 'COMMENCE DEPLOYMENT →'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* About Modal */}
            {activeModal === 'about' && (
                <div className="modal-overlay" onClick={closeAllModals}>
                    <div className="modal-box max-w-3xl animate-slide-up" onClick={e => e.stopPropagation()}>
                        <div className="absolute top-0 right-0 p-16 text-[12rem] opacity-[0.03] font-black italic tracking-tighter uppercase leading-none pointer-events-none">STORY</div>
                        <button onClick={closeAllModals} className="modal-close-btn">✕</button>
                        
                        <div className="flex items-center gap-8 mb-20">
                            <div className="w-24 h-24 rounded-[2.5rem] bg-emerald-500/10 flex items-center justify-center text-5xl italic font-black shadow-2xl">🚀</div>
                            <div>
                                <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white">Our Story</h2>
                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-400 italic">Transforming Arena Management since 2026</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-20">
                            <div className="text-slate-500 font-bold leading-relaxed space-y-8 text-lg uppercase tracking-widest italic">
                                <p>TurfBook was born out of a simple observation: sports arena owners were spending too much time on paperwork and phone calls, and not enough time growing their communities.</p>
                                <p>Partnering with <strong className="text-white">Vynkra Technologies</strong>, we've built a system that doesn't just manage bookings—it scales businesses. We believe that every ground, from the smallest cage to the largest stadium, deserves professional-grade digital tools.</p>
                                
                                <div className="p-8 bg-emerald-500/5 border-l-4 border-emerald-500 rounded-e-3xl">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 mb-3 italic">The Mission</h4>
                                    <p className="text-sm text-slate-600 italic font-black">To build the world's most intuitive and powerful operating system for sports communities.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                {[
                                    { label: 'Active Arenas', value: '500+', color: 'text-emerald-500' },
                                    { label: 'Daily Players', value: '10k+', color: 'text-blue-500' },
                                    { label: 'Uptime', value: '99.9%', color: 'text-amber-500' },
                                    { label: 'Expert Support', value: '24/7', color: 'text-rose-500' }
                                ].map((stat, i) => (
                                    <div key={i} className="p-10 rounded-[3rem] bg-white/5 border border-white/5 text-center">
                                        <div className={`text-4xl font-black italic tracking-tighter ${stat.color}`}>{stat.value}</div>
                                        <div className="text-[9px] font-black uppercase tracking-widest text-slate-800 mt-3 italic">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
