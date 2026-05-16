import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function TenantHome({ tenant, turfs }) {
    const auth = usePage().props.auth;
    const [selectedTurf, setSelectedTurf] = useState(turfs[0]?.id || null);

    const activeTurf = turfs.find(t => t.id === selectedTurf);

    return (
        <div className="min-h-screen bg-[#0a0f16] text-white selection:bg-emerald-500 font-inter">
            <Head title={`${tenant.name} - TurfBook`} />
            
            {/* Navigation */}
            <nav className="bg-black/40 backdrop-blur-xl border-b border-white/5 py-6 sticky top-0 z-50">
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-2xl shadow-lg">
                            🏟️
                        </div>
                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-tighter italic leading-none">
                                {tenant.name}
                            </h1>
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400 mt-1">Powered by TurfBook</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-8">
                        {auth.user ? (
                            <Link href={route('customer.dashboard')} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">My Bookings</Link>
                        ) : (
                            <Link href={route('login')} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">Sign In</Link>
                        )}
                        <a href={`tel:${tenant.phone}`} className="btn-premium py-3 px-6 text-[10px]">Call Now</a>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-6 py-16 animate-fade-in">
                {/* Hero / About */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
                    <div className="animate-slide-up">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-8">
                            Welcome to {tenant.city || 'our Arena'}
                        </div>
                        <h2 className="text-7xl font-black uppercase italic tracking-tighter leading-[0.9] mb-10">
                            The Ultimate <br />
                            <span className="text-gradient">Gaming Experience</span>
                        </h2>
                        <p className="text-slate-400 font-bold text-lg leading-relaxed max-w-xl">
                            {tenant.description || `Welcome to ${tenant.name}. We provide professional-grade sports facilities for athletes and hobbyists alike. Experience the game like never before.`}
                        </p>
                        <div className="flex gap-6 mt-12">
                            <div className="flex flex-col">
                                <span className="text-3xl font-black text-white italic tracking-tighter uppercase">{turfs.length}</span>
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">Total Grounds</span>
                            </div>
                            <div className="w-px h-10 bg-white/10 mx-4"></div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-black text-white italic tracking-tighter uppercase">24/7</span>
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">Availability</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="relative">
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-500/10 blur-3xl rounded-full animate-pulse"></div>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/10 blur-3xl rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                        <div className="glass-card panel p-12 relative z-10">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-3xl">📍</div>
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Our Location</h4>
                                    <p className="font-bold text-white">{tenant.address || 'Innovation Park, Bangalore'}</p>
                                </div>
                            </div>
                            <button className="btn border-2 border-white/10 w-full py-5 text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-all">Open in Google Maps →</button>
                        </div>
                    </div>
                </div>

                {/* Turf Selection & Booking */}
                <div id="booking" className="mb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-4">Book Your <span className="text-gradient">Session</span></h2>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Select a ground to view available time slots</p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 mb-16">
                        {turfs.map(turf => (
                            <button 
                                key={turf.id}
                                onClick={() => setSelectedTurf(turf.id)}
                                className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border
                                    ${selectedTurf === turf.id ? 'bg-emerald-500 border-emerald-400 text-white shadow-[0_10px_30px_rgba(16,185,129,0.3)] scale-105' : 
                                      'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                            >
                                {turf.name}
                            </button>
                        ))}
                    </div>

                    {activeTurf && (
                        <div className="animate-fade-in">
                            <div className="glass-card panel p-12 overflow-hidden relative">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-blue-500"></div>
                                
                                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 mb-12">
                                    <div>
                                        <h3 className="text-3xl font-black uppercase italic tracking-tight text-white mb-3">{activeTurf.name}</h3>
                                        <div className="flex gap-4">
                                            <span className="status-badge active uppercase">{activeTurf.turf_type}</span>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                                👤 Max {activeTurf.capacity} Players
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Price per Hour</p>
                                        <p className="text-5xl font-black text-emerald-400 tracking-tighter italic">₹{activeTurf.price_per_hour}</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ms-1">Available Slots Today</h4>
                                    {activeTurf.slots && activeTurf.slots.length > 0 ? (
                                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                            {activeTurf.slots.filter(s => s.status === 'available').map(slot => (
                                                <Link
                                                    key={slot.id}
                                                    href={route('tenant.checkout', { subdomain: tenant.subdomain, slot: slot.id })}
                                                    className="group p-5 rounded-[2rem] bg-white/[0.03] border border-white/10 hover:bg-emerald-500 hover:border-emerald-400 transition-all text-center"
                                                >
                                                    <div className="text-xs font-black text-white group-hover:text-white mb-2">{slot.start_time.substring(0, 5)}</div>
                                                    <div className="text-[10px] font-black text-emerald-400 group-hover:text-white uppercase tracking-widest italic">Book Now</div>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-16 text-center bg-black/20 rounded-[3rem] border border-white/5">
                                            <p className="text-slate-600 font-black uppercase tracking-widest text-xs">No slots available for today. Please check back later.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="py-20 border-t border-white/5 bg-black/20">
                <div className="container mx-auto px-6 text-center">
                    <div className="flex flex-col items-center gap-6 mb-12">
                        <div className="text-4xl">🏟️</div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter italic">{tenant.name}</h2>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Your premium sports destination in {tenant.city || 'the city'}</p>
                    </div>
                    <div className="flex justify-center gap-10 mb-12">
                        {['About', 'Rules', 'Contact'].map(link => (
                            <a key={link} href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-emerald-400 transition-all">{link}</a>
                        ))}
                    </div>
                    <div className="pt-10 border-t border-white/5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-800">
                            &copy; 2026 {tenant.name}. | Powered by <span className="text-emerald-500">TurfBook Technologies</span>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
