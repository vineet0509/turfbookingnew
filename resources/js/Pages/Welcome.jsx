import { Link, Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';

const cities = [
    { name: 'Indore', state: 'Madhya Pradesh', venues: '79+ live venues', popular: 'Heavens Turf And Cafe', price: '1,000', img: '/images/cities/indore.png' },
    { name: 'Mumbai', state: 'Maharashtra', venues: '12+ live venues', popular: 'Maharashtra Turf Club', price: '3,300', img: '/images/cities/mumbai.png' },
    { name: 'Kolkata', state: 'West Bengal', venues: '4+ live venues', popular: 'Kasba Turf', price: '2,000', img: '/images/cities/kolkata.png' },
    { name: 'Delhi', state: 'Delhi', venues: '5+ live venues', popular: 'Narayana Singh Sports Club', price: '1,000', img: '/images/cities/delhi.png' },
    { name: 'Ahmedabad', state: 'Gujarat', venues: '10+ live venues', popular: 'Ace Turf Box', price: '1,300', img: '/images/cities/ahmedabad.png' },
    { name: 'Hyderabad', state: 'Telangana', venues: '9+ live venues', popular: 'Nex Arena Attapur', price: '2,400', img: '/images/cities/hyderabad.png' }
];

export default function Welcome({ auth, tenants = [], plans = [] }) {
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
        plan_id: '',
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
        <div className="bg-[#f6f8fb] min-h-screen text-[#0f172a] selection:bg-[#0f172a]/10 selection:text-[#0f172a] font-sans bg-mesh relative overflow-hidden">
            <Head title="Welcome to TurfBook | Sports Arena Management Platform" />

            {/* Mesh gradient glow orbs matching Vynkra */}
            <div className="glow-orb orb-1"></div>
            <div className="glow-orb orb-2"></div>
            <div className="glow-orb orb-3"></div>

            {/* Navigation */}
            <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-[#f6f8fb]/85 backdrop-blur-xl py-3 sm:py-4 border-b border-[rgba(15,23,42,0.06)] shadow-sm' : 'py-4 sm:py-8'}`}>
                <div className="container mx-auto px-4 sm:px-10 flex justify-between items-center">
                    <div className="flex items-center gap-1.5 sm:gap-3">
                        <span className="text-xl sm:text-3xl">🏟️</span>
                        <span className="text-base sm:text-2xl font-black uppercase tracking-tighter italic text-[var(--text-primary)]">
                            Turf<span className="text-[var(--accent)]">Book</span>
                        </span>
                    </div>
                    
                    <div className="hidden lg:flex items-center gap-12">
                        <a href="#features" className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all">Features</a>
                        <a href="#pricing" className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all">Pricing</a>
                        <a href="#demo" className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all">Live Demo</a>
                        <button onClick={() => setActiveModal('about')} className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all">About Us</button>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-6">
                        {auth.user ? (
                            <Link href={route('dashboard')} className="bg-[var(--text-primary)] text-white px-4 sm:px-8 py-2 sm:py-3 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md">Dashboard →</Link>
                        ) : (
                            <>
                                <button onClick={() => setActiveModal('login')} className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all">Sign In</button>
                                <button onClick={() => setActiveModal('register')} className="bg-[var(--text-primary)] text-white px-4 sm:px-8 py-2 sm:py-3 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md">Get Started</button>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="hero pt-48 pb-32 relative">
                <div className="container mx-auto px-10 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[rgba(15,23,42,0.035)] border border-[rgba(15,23,42,0.06)] text-[var(--text-primary)] text-[10px] font-black uppercase tracking-widest mb-10 animate-fade-in">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                        🚀 #1 Sports Arena Management Tool
                    </div>
                    
                    <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter text-[var(--text-primary)] mb-10 leading-[0.95] animate-slide-up">
                        Run Your Arena <br />
                        <span className="text-gradient">Like a Pro</span>
                    </h1>
                    
                    <p className="text-lg md:text-xl font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-16 max-w-2xl mx-auto leading-relaxed italic animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        The complete platform to manage bookings, payments, and customers for Cricket, Football, Badminton, and more. 
                        Automate your business operations and focus on the game.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row justify-center gap-8 mt-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                        <button onClick={() => setActiveModal('register')} className="bg-[var(--text-primary)] text-white px-12 py-5 rounded-full text-xs font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-md">Start Free Trial →</button>
                        <a href="#demo" className="bg-white border border-[rgba(15,23,42,0.08)] text-[var(--text-primary)] px-12 py-5 rounded-full text-xs font-black uppercase tracking-[0.2em] hover:bg-[var(--bg-light-alt)] transition-all shadow-sm">Watch Demo</a>
                    </div>

                    {/* Sports Infrastructure Showcase */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 max-w-6xl mx-auto animate-fade-in" style={{ animationDelay: '0.6s' }}>
                        {[
                            { name: 'Elite Cricket', icon: '🏏', img: '/brain/3cef1dc0-9cab-4f1c-86ef-c6841161c311/cricket_turf_bg_1778939696050.png', color: 'border-emerald-500/20' },
                            { name: 'Pro Football', icon: '⚽', img: '/brain/3cef1dc0-9cab-4f1c-86ef-c6841161c311/football_turf_bg_1778939721662.png', color: 'border-blue-500/20' },
                            { name: 'Badminton Pro', icon: '🏸', img: '/brain/3cef1dc0-9cab-4f1c-86ef-c6841161c311/badminton_court_bg_1778939744671.png', color: 'border-rose-500/20' }
                        ].map((sport, i) => (
                            <div key={i} className={`group relative h-80 rounded-[24px] overflow-hidden border border-[rgba(15,23,42,0.06)] bg-white/80 backdrop-blur-md transition-all duration-700 hover:scale-[1.02] hover:-translate-y-2 cursor-pointer shadow-sm hover:shadow-lg hover:border-[rgba(15,23,42,0.12)]`}>
                                <img src={sport.img} className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700 grayscale-[0.3] group-hover:grayscale-0" alt={sport.name} />
                                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                                <div className="absolute bottom-10 left-10 text-left">
                                    <div className="text-4xl mb-4 drop-shadow-[0_4px_10px_rgba(0,0,0,0.15)]">{sport.icon}</div>
                                    <h3 className="text-2xl font-black uppercase italic tracking-tighter text-[var(--text-primary)]">{sport.name}</h3>
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] mt-2">Active Node Infrastructure</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </header>

            {/* Live Stats Strip */}
            <div className="stats-strip border-y border-[rgba(15,23,42,0.06)] bg-white/50 py-16">
                <div className="container mx-auto px-10 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    <div>
                        <span className="stat-num text-6xl font-black italic tracking-tighter text-gradient">500+</span>
                        <span className="stat-label block text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mt-2">Arenas Managed</span>
                    </div>
                    <div>
                        <span className="stat-num text-6xl font-black italic tracking-tighter text-gradient">1M+</span>
                        <span className="stat-label block text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mt-2">Bookings Processed</span>
                    </div>
                    <div>
                        <span className="stat-num text-6xl font-black italic tracking-tighter text-gradient">99.9%</span>
                        <span className="stat-label block text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mt-2">System Uptime</span>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <section id="features" className="py-40">
                <div className="container mx-auto px-10">
                    <div className="text-center mb-32">
                        <h2 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter mb-4 text-[var(--text-primary)]">Everything you need to <span className="text-gradient">Win</span></h2>
                        <p className="text-[var(--text-secondary)] font-bold uppercase tracking-widest text-[10px] italic">Powerful features to automate your sports business</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                        {[
                            { icon: '🌐', title: 'Branded Website', desc: 'Get your own unique subdomain instantly to accept bookings 24/7.' },
                            { icon: '💳', title: 'Digital Payments', desc: 'Secure Razorpay integration for instant online payments and automated receipts.' },
                            { icon: '🕐', title: 'Slot Management', desc: 'Easily configure pricing, weekend rates, and block slots for private events.' },
                            { icon: '📱', title: 'Customer Portal', desc: 'A dedicated space for your players to manage their bookings and reschedule slots.' }
                        ].map((feature, i) => (
                            <div key={i} className="p-12 rounded-[24px] bg-white border border-[rgba(15,23,42,0.06)] hover:border-[rgba(15,23,42,0.12)] hover:shadow-lg transition-all duration-300 group shadow-sm">
                                <div className="text-5xl mb-10 group-hover:scale-110 transition-transform duration-500">{feature.icon}</div>
                                <h3 className="text-2xl font-black uppercase tracking-tight mb-4 text-[var(--text-primary)] italic">{feature.title}</h3>
                                <p className="text-[var(--text-secondary)] font-bold text-sm leading-relaxed uppercase">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Explore Venues by City Section matching reference screenshot */}
            <section id="cities" className="py-40 bg-white/40 border-t border-[rgba(15,23,42,0.06)] relative z-10">
                <div className="container mx-auto px-10">
                    <div className="text-center mb-32">
                        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[rgba(99,102,241,0.05)] border border-[rgba(99,102,241,0.1)] text-[var(--accent)] text-[10px] font-black uppercase tracking-widest mb-8">
                            🗺️ Nationwide Coverage
                        </div>
                        <h2 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter mb-4 text-[var(--text-primary)]">
                            Discover Arenas in <span className="text-gradient">Top Cities</span>
                        </h2>
                        <p className="text-[var(--text-secondary)] font-bold uppercase tracking-widest text-[10px] italic">
                            Book premium sports venues across major hubs instantly
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {cities.map((city, i) => (
                            <div key={i} className="group rounded-[24px] overflow-hidden bg-white border border-[rgba(15,23,42,0.06)] hover:border-[rgba(15,23,42,0.12)] hover:shadow-lg transition-all duration-500 flex flex-col shadow-sm">
                                {/* Image part with state tag */}
                                <div className="h-56 relative overflow-hidden bg-slate-100">
                                    <img 
                                        src={city.img} 
                                        alt={city.name} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute top-6 left-6 px-4 py-1.5 bg-slate-900/80 backdrop-blur-md rounded-full text-[8px] font-black uppercase tracking-widest text-white shadow-sm">
                                        {city.state}
                                    </div>
                                </div>
                                
                                {/* Text details */}
                                <div className="p-8 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-2xl font-black uppercase tracking-tighter text-[var(--text-primary)] italic">
                                            {city.name}
                                        </h3>
                                        <p className="text-xs font-bold text-[var(--text-secondary)] mt-2 uppercase tracking-wide">
                                            {city.venues} &middot; <span className="text-[var(--text-muted)]">{city.popular}</span>
                                        </p>
                                    </div>
                                    
                                    <div className="mt-8 pt-6 border-t border-[rgba(15,23,42,0.04)] flex justify-between items-center">
                                        <div>
                                            <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] block">Starting From</span>
                                            <span className="text-xl font-black italic text-[var(--accent)]">₹{city.price}</span>
                                        </div>
                                        <button 
                                            onClick={() => { registerForm.setData('role', 'customer'); setActiveModal('register'); }} 
                                            className="text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)] group-hover:text-[var(--accent)] hover:translate-x-1 transition-all flex items-center gap-2 italic bg-transparent border-none cursor-pointer"
                                        >
                                            Explore city →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Demo Section */}
            <section id="demo" className="py-40 bg-white/40 border-y border-[rgba(15,23,42,0.06)]">
                <div className="container mx-auto px-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                        <div className="lg:pe-16">
                            <div className="inline-block px-4 py-1.5 rounded-full bg-[rgba(99,102,241,0.05)] border border-[rgba(99,102,241,0.1)] text-[var(--accent)] text-[10px] font-black uppercase tracking-widest mb-8">
                                🎮 Player Experience
                            </div>
                            <h2 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter mb-8 leading-[0.85] text-[var(--text-primary)]">
                                Test as a <br />
                                <span className="text-gradient">Customer</span>
                            </h2>
                            <p className="text-[var(--text-secondary)] font-bold text-lg leading-relaxed mb-12 italic uppercase tracking-widest max-w-xl">
                                Want to see what your players will see? Register as a customer to browse turfs, book matches, and manage your schedule.
                            </p>
                            <button onClick={() => { registerForm.setData('role', 'customer'); setActiveModal('register'); }} className="btn-outline border-[rgba(15,23,42,0.12)] text-[var(--text-primary)] px-12 py-5 text-xs font-black uppercase tracking-widest hover:bg-[var(--text-primary)] hover:text-white transition-all rounded-full">Register as Customer →</button>
                        </div>
                        
                        <div className="space-y-12">
                            <div className="p-12 rounded-[24px] bg-white border border-[rgba(15,23,42,0.06)] max-w-md mx-auto relative group hover:border-[rgba(15,23,42,0.12)] hover:shadow-lg transition-all shadow-sm">
                                <div className="flex items-center gap-6 mb-10">
                                    <div className="w-16 h-16 rounded-full bg-[var(--gradient-glow)] flex items-center justify-center text-3xl font-black italic shadow-md">A</div>
                                    <div>
                                        <h4 className="text-xl font-black text-[var(--text-primary)] italic uppercase tracking-tight">Arjun Kumar</h4>
                                        <p className="text-[10px] font-black text-[var(--accent)] uppercase tracking-widest">Verified Pro Athlete</p>
                                    </div>
                                </div>
                                <div className="bg-[var(--bg-light-alt)] p-8 rounded-[16px] border border-[rgba(15,23,42,0.04)] border-l-4 border-[var(--accent)] relative overflow-hidden">
                                    <div className="text-[9px] font-black text-[var(--accent)] uppercase tracking-widest mb-2">Upcoming Match</div>
                                    <div className="text-2xl font-black text-[var(--text-primary)] italic uppercase tracking-tight">Green Arena - Slot A</div>
                                    <div className="text-[var(--text-secondary)] font-bold text-xs uppercase tracking-widest mt-1">Today, 08:00 PM</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-32">
                <div className="container mx-auto px-10 text-center">
                    <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-6 text-[var(--text-primary)]">Simple <span className="text-gradient">Pricing</span></h2>
                    <p className="text-[var(--text-secondary)] font-bold max-w-lg mx-auto text-sm mb-20 leading-relaxed italic uppercase tracking-widest">Start with our 10-day free trial. No credit card required.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: 'Starter', price: '499', features: ['1 Arena Ground', '100 Bookings / mo', 'Digital Calendar', 'Email Alerts'] },
                            { name: 'Pro Arena', price: '999', popular: true, features: ['3 Arena Grounds', 'Unlimited Bookings', 'Razorpay Integration', 'Analytics Dashboard'] },
                            { name: 'Club Elite', price: '1999', features: ['10+ Arena Grounds', 'Unlimited Everything', 'WhatsApp Automations', 'Dedicated Support'] }
                        ].map((plan, i) => (
                            <div key={i} className={`p-10 rounded-[24px] bg-white border border-[rgba(15,23,42,0.06)] flex flex-col items-center relative transition-all duration-500 hover:scale-[1.02] hover:shadow-lg ${plan.popular ? 'border-[#6366f1]/30 bg-[#6366f1]/[0.01]' : ''}`}>
                                {plan.popular && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--text-primary)] text-white text-[8px] font-black uppercase tracking-[0.3em] px-6 py-1.5 rounded-full shadow-md">Most Popular</div>}
                                <h3 className="text-xl font-black uppercase tracking-tight italic mb-8 text-[var(--text-primary)] leading-none">{plan.name}</h3>
                                <div className="price flex items-baseline justify-center gap-1 mb-10">
                                    <span className="text-xl font-black uppercase tracking-tighter italic text-[var(--text-muted)]">₹</span>
                                    <span className={`text-6xl font-black tracking-tighter italic ${plan.popular ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'}`}>{plan.price}</span>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">/mo</span>
                                </div>
                                <ul className="space-y-4 mb-12 flex-1 w-full">
                                    {plan.features.map(f => (
                                        <li key={f} className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] flex items-center gap-3">
                                            <span className="text-emerald-500">✓</span> {f}
                                        </li>
                                    ))}
                                </ul>
                                <button onClick={() => setActiveModal('register')} className={`w-full py-6 rounded-full font-black uppercase tracking-[0.3em] text-[10px] italic transition-all ${plan.popular ? 'bg-[var(--text-primary)] text-white hover:bg-slate-800 shadow-md' : 'border border-[rgba(15,23,42,0.12)] text-[var(--text-secondary)] hover:bg-[var(--bg-light-alt)]'}`}>
                                    Get Started
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer matching Vynkra's elegant dark contrast grounding */}
            <footer className="pt-40 pb-16 border-t border-[rgba(255,255,255,0.05)] bg-[#090d16] text-[#94a3b8]">
                <div className="container mx-auto px-10">
                    <div className="flex flex-col md:flex-row justify-between gap-20 mb-32">
                        <div className="md:w-1/3">
                            <div className="flex items-center gap-4 mb-10">
                                <span className="text-4xl">🏟️</span>
                                <span className="text-3xl font-black uppercase tracking-tighter italic text-white">Turf<span className="text-[#06b6d4]">Book</span></span>
                            </div>
                            <p className="text-slate-400 font-bold italic text-base leading-relaxed uppercase tracking-widest">
                                The all-in-one operating system for sports arena management. Empowering turf owners to scale operations.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-20 flex-1">
                            {[
                                { 
                                    title: 'Platform', 
                                    links: ['Features', 'Pricing', 'Live Demo'],
                                    hrefs: { 'Features': '#features', 'Pricing': '#pricing', 'Live Demo': '#demo' }
                                },
                                { 
                                    title: 'Access Center', 
                                    links: ['Login to Portal', 'Deploy New Arena', 'Athlete Network'],
                                    actions: { 
                                        'Login to Portal': () => setActiveModal('login'), 
                                        'Deploy New Arena': () => setActiveModal('register'),
                                        'Athlete Network': () => {
                                            setActiveModal('register');
                                            registerForm.setData('role', 'customer');
                                        }
                                    } 
                                },
                                { 
                                    title: 'Intelligence', 
                                    links: ['About Us', 'Contact Support', 'Node Status'], 
                                    actions: { 'About Us': () => setActiveModal('about'), 'Contact Support': () => setActiveModal('contact') } 
                                },
                                { 
                                    title: 'Governance', 
                                    links: ['Privacy Protocol', 'Terms of Service', 'Cookie Policy'], 
                                    actions: { 'Terms of Service': () => setActiveModal('terms') } 
                                },
                            ].map((col, i) => (
                                <div key={i}>
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white mb-10 italic"># {col.title}</h4>
                                    <ul className="space-y-5">
                                        {col.links.map(link => (
                                            <li key={link}>
                                                {col.hrefs && col.hrefs[link] ? (
                                                    <a href={col.hrefs[link]} className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8] hover:text-[#06b6d4] transition-all text-left">
                                                        {link}
                                                    </a>
                                                ) : (
                                                    <button 
                                                        onClick={() => col.actions && col.actions[link] ? col.actions[link]() : null}
                                                        className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8] hover:text-[#06b6d4] transition-all text-left bg-transparent border-none p-0 cursor-pointer"
                                                    >
                                                        {link}
                                                    </button>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 italic">
                            © 2026 TurfBook Master Control. All Rights Reserved.
                        </p>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 italic">
                            Managed by <span className="text-[#06b6d4]">Vynkra Intelligence Node</span>
                        </p>
                    </div>
                </div>
            </footer>

            {/* Modals with Scroll-Safe Flex Containers */}
            {activeModal === 'login' && (
                <div className="modal-overlay" onClick={closeAllModals}>
                    <div className="modal-box flex flex-col p-0 animate-slide-up" onClick={e => e.stopPropagation()}>
                        <button onClick={closeAllModals} className="modal-close-btn">✕</button>
                        <div className="overflow-y-auto p-6 sm:p-12 max-h-[90vh] flex-1">
                            <div className="text-6xl mb-10 drop-shadow-[0_4px_10px_rgba(0,0,0,0.1)]">🔐</div>
                            <h2 className="text-4xl font-black uppercase tracking-tighter italic mb-2 text-[var(--text-primary)]">Welcome Back</h2>
                            <p className="text-[var(--text-secondary)] font-black uppercase tracking-[0.2em] text-[9px] mb-10 italic ms-1">Access your operational intelligence center.</p>

                            <form onSubmit={onLoginSubmit} className="space-y-6">
                                <div className="form-group">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] mb-4 ms-2">Authentication Key (Email)</label>
                                    <input 
                                        type="email" 
                                        className="form-control py-4 italic text-sm" 
                                        placeholder="operator@vynkra.com"
                                        value={loginForm.data.email}
                                        onChange={e => loginForm.setData('email', e.target.value)}
                                        required
                                    />
                                    {loginForm.errors.email && <div className="text-rose-500 text-[10px] font-black mt-2 uppercase italic tracking-widest ms-2">{loginForm.errors.email}</div>}
                                </div>
                                <div className="form-group">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] mb-4 ms-2">Access Cipher (Password)</label>
                                    <input 
                                        type="password" 
                                        className="form-control py-4 italic text-sm" 
                                        placeholder="••••••••••••" 
                                        value={loginForm.data.password}
                                        onChange={e => loginForm.setData('password', e.target.value)}
                                        required
                                    />
                                    {loginForm.errors.password && <div className="text-rose-500 text-[10px] font-black mt-2 uppercase italic tracking-widest ms-2">{loginForm.errors.password}</div>}
                                </div>
                                <button type="submit" disabled={loginForm.processing} className="btn-premium w-full py-4 text-xs font-black uppercase italic tracking-[0.3em]">
                                    {loginForm.processing ? 'DECRYPTING...' : 'INITIALIZE SESSION →'}
                                </button>
                            </form>
                            
                            <p className="text-center mt-12 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] italic">
                                Missing an arena node? <button onClick={() => setActiveModal('register')} className="text-[var(--accent)] ms-1 hover:underline bg-transparent border-none p-0 cursor-pointer">Deploy New Node</button>
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {activeModal === 'register' && (
                <div className="modal-overlay" onClick={closeAllModals}>
                    <div className="modal-box flex flex-col p-0 animate-slide-up" onClick={e => e.stopPropagation()}>
                        <button onClick={closeAllModals} className="modal-close-btn">✕</button>
                        <div className="overflow-y-auto p-6 sm:p-12 max-h-[90vh] flex-1">
                            <div className="text-6xl mb-10 drop-shadow-[0_4px_10px_rgba(0,0,0,0.1)]">{registerForm.data.role === 'customer' ? '🏃' : '🏟️'}</div>
                            <h2 className="text-3xl font-black uppercase tracking-tighter italic mb-2 text-[var(--text-primary)]">
                                {registerForm.data.role === 'customer' ? 'Athlete Join' : 'Deploy Arena'}
                            </h2>
                            <p className="text-[var(--text-secondary)] font-black uppercase tracking-[0.2em] text-[9px] mb-10 italic ms-1">
                                {registerForm.data.role === 'customer' ? 'Join the global athlete network.' : 'Join the #1 sports management platform.'}
                            </p>

                            <form onSubmit={onRegisterSubmit} className="space-y-6">
                                <div className="form-group">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] mb-4 ms-2">Identity Signature (Full Name)</label>
                                    <input 
                                        type="text" 
                                        className="form-control py-4 italic text-sm" 
                                        placeholder="Arjun Kumar" 
                                        value={registerForm.data.name}
                                        onChange={e => registerForm.setData('name', e.target.value)}
                                        required
                                    />
                                    {registerForm.errors.name && <div className="text-rose-500 text-[10px] font-black mt-2 uppercase italic tracking-widest ms-2">{registerForm.errors.name}</div>}
                                </div>
                                <div className="form-group">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] mb-4 ms-2">Contact Protocol (Email)</label>
                                    <input 
                                        type="email" 
                                        className="form-control py-4 italic text-sm" 
                                        placeholder="operator@vynkra.com" 
                                        value={registerForm.data.email}
                                        onChange={e => registerForm.setData('email', e.target.value)}
                                        required
                                    />
                                    {registerForm.errors.email && <div className="text-rose-500 text-[10px] font-black mt-2 uppercase italic tracking-widest ms-2">{registerForm.errors.email}</div>}
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="form-group">
                                        <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] mb-4 ms-2">Secure Cipher</label>
                                        <input 
                                            type="password" 
                                            className="form-control py-4 italic text-sm" 
                                            placeholder="••••••••" 
                                            value={registerForm.data.password}
                                            onChange={e => registerForm.setData('password', e.target.value)}
                                            required
                                        />
                                        {registerForm.errors.password && <div className="text-rose-500 text-[10px] font-black mt-2 uppercase italic tracking-widest ms-2">{registerForm.errors.password}</div>}
                                    </div>
                                    <div className="form-group">
                                        <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] mb-4 ms-2">Verify Cipher</label>
                                        <input 
                                            type="password" 
                                            className="form-control py-4 italic text-sm" 
                                            placeholder="••••••••" 
                                            value={registerForm.data.password_confirmation}
                                            onChange={e => registerForm.setData('password_confirmation', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                {registerForm.data.role === 'customer' && (
                                    <div className="form-group animate-fade-in">
                                        <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] mb-4 ms-2">Select Arena Ground</label>
                                        <select 
                                            className="form-control py-4 italic text-sm bg-white"
                                            value={registerForm.data.tenant_id}
                                            onChange={e => registerForm.setData('tenant_id', e.target.value)}
                                            required
                                        >
                                            <option value="">-- Discover Available Turfs --</option>
                                            {tenants.map(t => (
                                                <option key={t.id} value={t.id}>{t.name} - {t.city}</option>
                                            ))}
                                        </select>
                                        <p className="mt-4 text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-widest ms-2 italic">Select the arena you want to join. You can book slots here after registration.</p>
                                    </div>
                                )}

                                {registerForm.data.role === 'owner' && (
                                    <div className="form-group animate-fade-in">
                                        <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] mb-4 ms-2">Select Your Operations Plan</label>
                                        <select 
                                            className="form-control py-4 italic text-sm bg-white"
                                            value={registerForm.data.plan_id}
                                            onChange={e => registerForm.setData('plan_id', e.target.value)}
                                            required
                                        >
                                            <option value="">-- Choose Scaling Tier --</option>
                                            {plans.map(p => (
                                                <option key={p.id} value={p.id}>{p.display_name} - ₹{p.price_monthly}/mo</option>
                                            ))}
                                        </select>
                                        <p className="mt-4 text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-widest ms-2 italic">Select the plan that fits your arena scale. You can upgrade later.</p>
                                    </div>
                                )}

                                <button type="submit" disabled={registerForm.processing} className="btn-premium w-full py-4 text-xs font-black uppercase italic tracking-[0.3em] shadow-md">
                                    {registerForm.processing ? 'INITIALIZING...' : 'COMMENCE DEPLOYMENT →'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* About Modal */}
            {activeModal === 'about' && (
                <div className="modal-overlay" onClick={closeAllModals}>
                    <div className="modal-box max-w-xl flex flex-col p-0 animate-slide-up" onClick={e => e.stopPropagation()}>
                        <button onClick={closeAllModals} className="modal-close-btn">✕</button>
                        <div className="overflow-y-auto p-6 sm:p-12 max-h-[90vh] flex-1">
                            <div className="absolute bottom-0 right-0 p-12 text-5xl opacity-[0.03] font-black italic tracking-tighter uppercase leading-none pointer-events-none text-[var(--text-primary)]">STORY</div>
                            
                            <div className="flex items-center gap-6 mb-12">
                                <div className="w-16 h-16 rounded-full bg-[rgba(16,185,129,0.05)] flex items-center justify-center text-3xl italic font-black shadow-md">🚀</div>
                                <div>
                                    <h2 className="text-3xl font-black uppercase italic tracking-tighter text-[var(--text-primary)]">Our Story</h2>
                                    <p className="text-[8px] font-black uppercase tracking-[0.3em] text-[var(--accent)] italic">Transforming Arena Management since 2026</p>
                                </div>
                            </div>

                            <div className="space-y-12">
                                <div className="text-[var(--text-secondary)] font-bold leading-relaxed space-y-6 text-base uppercase tracking-widest italic">
                                    <p>TurfBook was born out of a simple observation: sports arena owners were spending too much time on administrative paperwork and not enough time growing their athletic communities.</p>
                                    <p>Partnering with <strong className="text-[var(--text-primary)]">Vynkra Technologies</strong>, we've built a multi-tenant operating system that scales businesses seamlessly.</p>
                                    
                                    <div className="p-6 bg-[rgba(16,185,129,0.02)] border-l-4 border-[var(--accent)] rounded-e-2xl">
                                        <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-[var(--accent)] mb-2 italic">The Mission</h4>
                                        <p className="text-xs text-[var(--text-secondary)] italic font-black">To build the world's most powerful operating system for sports communities.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                                    {[
                                        { label: 'Arenas', value: '500+', color: 'text-[var(--accent-warm)]' },
                                        { label: 'Players', value: '10k+', color: 'text-[var(--accent)]' },
                                        { label: 'Uptime', value: '99.9%', color: 'text-amber-500' },
                                        { label: 'Support', value: '24/7', color: 'text-emerald-500' }
                                    ].map((stat, i) => (
                                        <div key={i} className="p-6 rounded-[20px] bg-[var(--bg-light-alt)] border border-[rgba(15,23,42,0.04)] text-center shadow-sm">
                                            <div className={`text-3xl font-black italic tracking-tighter ${stat.color}`}>{stat.value}</div>
                                            <div className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] mt-3 italic">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
