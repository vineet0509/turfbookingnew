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
        <div className="min-h-screen bg-[#f6f8fb] text-[#0f172a] bg-mesh relative overflow-hidden">
            {/* Mesh gradient glow orbs */}
            <div className="glow-orb orb-1"></div>
            <div className="glow-orb orb-2"></div>
            <div className="glow-orb orb-3"></div>

            {/* Customer Top Nav */}
            <nav className="h-24 px-10 flex items-center justify-between sticky top-0 z-50 bg-[#f6f8fb]/80 backdrop-blur-xl border-b border-[rgba(15,23,42,0.06)] shadow-sm">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">🏟️</span>
                    <span className="text-xl font-black uppercase tracking-tighter italic text-[var(--text-primary)]">Turf<span className="text-[var(--accent)]">Book</span></span>
                </div>

                <div className="flex items-center gap-8">
                    <div className="hidden md:flex gap-8">
                        <Link href={route('customer.dashboard')} className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">My Bookings</Link>
                        <Link href={route('customer.passes')} className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Elite Passes</Link>
                        <Link href={route('customer.profile')} className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Profile</Link>
                    </div>
                    <div className="w-px h-6 bg-[rgba(15,23,42,0.1)]"></div>
                    <div className="flex items-center gap-4">
                        <span className="text-[11px] font-bold text-[var(--text-muted)] italic">Hi, {user.name.split(' ')[0]}! 👋</span>
                        <Link 
                            href={route('logout')} 
                            method="post" 
                            as="button"
                            className="bg-rose-500/5 border border-rose-500/10 text-rose-600 px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                        >
                            Logout
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-10 py-12 relative z-10">
                {children}
            </main>

            {/* Footer */}
            <footer className="mt-20 py-12 border-t border-[rgba(15,23,42,0.06)] text-center relative z-10">
                <div className="flex justify-center gap-8 mb-6">
                    <button onClick={() => setShowAboutModal(true)} className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)]">About Platform</button>
                    <button onClick={() => setShowContactModal(true)} className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)]">Get Support</button>
                    <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)]">Privacy Policy</Link>
                </div>
                <p className="text-[10px] font-black text-[var(--text-muted)] tracking-[0.3em] uppercase italic">
                    © 2026 TurfBook | <span className="text-[var(--accent)]">Powered by Vynkra Technologies</span>
                </p>
            </footer>

            {/* Modals */}
            {showAboutModal && (
                <div className="modal-overlay" onClick={() => setShowAboutModal(false)}>
                    <div className="modal-box glass-panel animate-slide-up" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setShowAboutModal(false)} className="modal-close-btn">✕</button>
                        <h2 className="text-2xl font-black uppercase italic tracking-tight mb-6 text-[var(--text-primary)]">🚀 About TurfBook</h2>
                        <div className="text-[var(--text-secondary)] font-medium text-sm leading-relaxed space-y-4">
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
                        <button onClick={() => setShowContactModal(false)} className="modal-close-btn">✕</button>
                        <h2 className="text-2xl font-black uppercase italic tracking-tight mb-8 text-center text-[var(--text-primary)]">📧 Player Support</h2>
                        <div className="space-y-4">
                            <div className="p-5 rounded-2xl bg-[var(--bg-light-alt)] border border-[rgba(15,23,42,0.06)] flex items-center gap-5">
                                <span className="text-2xl">✉️</span>
                                <div>
                                    <div className="font-black text-xs uppercase tracking-widest text-[var(--text-primary)] mb-1">Support Email</div>
                                    <div className="text-xs font-bold text-[var(--text-secondary)]">support@turfbook.com</div>
                                </div>
                            </div>
                            <div className="p-5 rounded-2xl bg-[var(--bg-light-alt)] border border-[rgba(15,23,42,0.06)] flex items-center gap-5">
                                <span className="text-2xl">📍</span>
                                <div>
                                    <div className="font-black text-xs uppercase tracking-widest text-[var(--text-primary)] mb-1">Headquarters</div>
                                    <div className="text-xs font-bold text-[var(--text-secondary)]">Vynkra Tech Park, Sector 4, MG Road</div>
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
