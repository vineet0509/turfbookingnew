import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function CustomerLayout({ children }) {
    const user = usePage().props.auth.user;
    const [showAboutModal, setShowAboutModal] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);

    useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Inter:wght@400;500;600&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    }, []);

    return (
        <div className="min-h-screen bg-[#0a0f16] text-white">
            {/* Customer Top Nav */}
            <nav className="h-24 px-10 flex items-center justify-between sticky top-0 z-50 bg-[#0a0f16]/80 backdrop-blur-xl border-b border-white/5">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">🏟️</span>
                    <span className="text-xl font-black uppercase tracking-tighter italic text-white">Turf<span className="text-emerald-500">Book</span></span>
                </div>

                <div className="flex items-center gap-8">
                    <div className="hidden md:flex gap-8">
                        <Link href={route('customer.dashboard')} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">My Bookings</Link>
                        <Link href={route('customer.passes')} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Elite Passes</Link>
                        <Link href={route('customer.profile')} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Profile</Link>
                    </div>
                    <div className="w-px h-6 bg-white/10"></div>
                    <div className="flex items-center gap-4">
                        <span className="text-[11px] font-bold text-slate-500 italic">Hi, {user.name.split(' ')[0]}! 👋</span>
                        <Link 
                            href={route('logout')} 
                            method="post" 
                            as="button"
                            className="bg-rose-500/10 border border-rose-500/20 text-rose-500 px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
                        >
                            Logout
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-10 py-12">
                {children}
            </main>

            {/* Footer */}
            <footer className="mt-20 py-12 border-t border-white/5 text-center">
                <div className="flex justify-center gap-8 mb-6">
                    <button onClick={() => setShowAboutModal(true)} className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-white">About Platform</button>
                    <button onClick={() => setShowContactModal(true)} className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-white">Get Support</button>
                    <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-white">Privacy Policy</Link>
                </div>
                <p className="text-[10px] font-black text-slate-800 tracking-[0.3em] uppercase">
                    © 2026 TurfBook | <span className="text-emerald-500">Powered by Vynkra Technologies</span>
                </p>
            </footer>

            {/* Modals */}
            {showAboutModal && (
                <div className="modal-overlay" onClick={() => setShowAboutModal(false)}>
                    <div className="modal-box glass-panel animate-slide-up" onClick={e => e.stopPropagation()}>
                        <h2 className="text-2xl font-black uppercase italic tracking-tight mb-6 text-white">🚀 About TurfBook</h2>
                        <div className="text-slate-400 font-medium text-sm leading-relaxed space-y-4">
                            <p>TurfBook is your companion for discovering and booking the best sports arenas in the city.</p>
                            <p>Our mission is to make sports accessible to everyone. Whether you're a weekend warrior or a professional athlete, we help you find the perfect pitch at the perfect time.</p>
                        </div>
                        <button className="btn-primary w-full mt-10 py-4 font-black uppercase tracking-widest text-[10px]" onClick={() => setShowAboutModal(false)}>Close</button>
                    </div>
                </div>
            )}

            {showContactModal && (
                <div className="modal-overlay" onClick={() => setShowContactModal(false)}>
                    <div className="modal-box glass-panel max-w-md animate-slide-up" onClick={e => e.stopPropagation()}>
                        <h2 className="text-2xl font-black uppercase italic tracking-tight mb-8 text-center text-white">📧 Player Support</h2>
                        <div className="space-y-4">
                            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-5">
                                <span className="text-2xl">✉️</span>
                                <div>
                                    <div className="font-black text-xs uppercase tracking-widest text-white mb-1">Support Email</div>
                                    <div className="text-xs font-bold text-slate-500">support@turfbook.com</div>
                                </div>
                            </div>
                            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-5">
                                <span className="text-2xl">📍</span>
                                <div>
                                    <div className="font-black text-xs uppercase tracking-widest text-white mb-1">Headquarters</div>
                                    <div className="text-xs font-bold text-slate-500">Vynkra Tech Park, Sector 4, MG Road</div>
                                </div>
                            </div>
                        </div>
                        <button className="btn-primary w-full mt-10 py-4 font-black uppercase tracking-widest text-[10px]" onClick={() => setShowContactModal(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}
