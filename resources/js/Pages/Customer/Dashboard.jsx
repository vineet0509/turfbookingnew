import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function CustomerDashboard({ bookings = [], user }) {
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const openCancel = (booking) => {
        setSelectedBooking(booking);
        setShowCancelModal(true);
    };

    const confirmCancel = () => {
        router.post(route('customer.bookings.cancel', selectedBooking.id));
        setShowCancelModal(false);
    };

    return (
        <CustomerLayout>
            <Head title="My Bookings" />

            <div className="animate-fade-in">
                <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white">My Bookings</h1>
                        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-2">Manage your upcoming sessions and match history</p>
                    </div>
                    <div className="flex gap-4">
                        <Link href={route('customer.passes')} className="btn-outline px-8 py-4 text-[10px] uppercase font-black tracking-widest border-white/10 hover:border-emerald-500/50">🎫 My Passes</Link>
                        <Link href="/" className="btn-primary px-8 py-4 text-[10px] uppercase font-black tracking-widest shadow-2xl shadow-emerald-500/20">+ Book New Turf</Link>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {bookings.map(b => (
                        <div key={b.id} className="glass-card panel p-10 group hover:border-emerald-500/20 transition-all relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">🏟️</div>
                            <div className="flex justify-between items-start mb-10">
                                <span className={`status-badge ${b.status} uppercase tracking-[0.2em] italic px-4 py-1.5`}>{b.status}</span>
                                <div className="text-right">
                                    <p className="text-[9px] font-black uppercase text-slate-700 tracking-widest">Reference</p>
                                    <p className="text-[10px] font-black text-white italic">#BK-{b.id.substring(0, 6).toUpperCase()}</p>
                                </div>
                            </div>
                            
                            <div className="mb-10">
                                <h3 className="text-3xl font-black italic uppercase tracking-tight text-white mb-1 leading-none">{b.turf?.name || 'Grand Arena'}</h3>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 italic">{b.tenant?.name || 'Olympic Hub'}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/5 mb-10">
                                <div>
                                    <p className="text-[9px] font-black uppercase text-slate-700 tracking-widest mb-1.5">Session Date</p>
                                    <p className="text-sm font-black text-white italic uppercase tracking-tight">{b.date}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black uppercase text-slate-700 tracking-widest mb-1.5">Match Time</p>
                                    <p className="text-sm font-black text-white italic uppercase tracking-tight">{b.slot?.start_time || '18:00'}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-[9px] font-black uppercase text-slate-700 tracking-widest mb-1.5">Paid Amount</p>
                                    <p className="text-3xl font-black text-emerald-400 italic">₹{b.total_amount}</p>
                                </div>
                            </div>

                            {b.status === 'confirmed' || b.status === 'paid' ? (
                                <div className="flex gap-4">
                                    <button className="btn-outline flex-1 py-4 text-[9px] uppercase font-black tracking-widest">Reschedule</button>
                                    <button onClick={() => openCancel(b)} className="btn-outline border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white flex-1 py-4 text-[9px] uppercase font-black tracking-widest">Cancel Match</button>
                                </div>
                            ) : (
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                                    <p className="text-[9px] font-black uppercase text-slate-700 tracking-widest italic">Session Protocol Locked</p>
                                </div>
                            )}
                        </div>
                    ))}
                    {bookings.length === 0 && (
                        <div className="col-span-full py-40 glass-panel text-center border-2 border-dashed border-white/5 rounded-[4rem]">
                            <div className="text-6xl mb-8 opacity-20">🎑</div>
                            <h3 className="text-3xl font-black uppercase italic tracking-tight text-white mb-2">No Active Bookings Detected</h3>
                            <p className="text-slate-600 font-bold uppercase text-[10px] tracking-widest mb-12 italic">You haven't initialized any arena sessions in our network yet.</p>
                            <Link href="/" className="btn-primary px-16 py-5 text-[10px] uppercase font-black tracking-[0.3em] italic shadow-2xl shadow-emerald-500/20">Initialize My First Session →</Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Cancellation Modal */}
            {showCancelModal && (
                <div className="modal-overlay" onClick={() => setShowCancelModal(false)}>
                    <div className="modal-box glass-panel max-w-lg animate-slide-up p-12" onClick={e => e.stopPropagation()}>
                        <div className="text-5xl mb-8">⚠️</div>
                        <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white mb-6">Confirm Cancellation?</h2>
                        
                        <div className="p-8 bg-amber-500/5 border border-amber-500/10 rounded-[2rem] mb-10">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500 mb-6 italic">🛡️ Cancellation Policy</h4>
                            <ul className="space-y-4">
                                <li className="text-xs font-bold text-slate-400 flex gap-3">
                                    <span className="text-amber-500">⚡</span>
                                    <span>Matches can only be cancelled 30 minutes prior to session start.</span>
                                </li>
                                <li className="text-xs font-bold text-slate-400 flex gap-3">
                                    <span className="text-amber-500">⚡</span>
                                    <span>20% infrastructure charge applies for late cancellations.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-6 mb-12">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-600 italic ms-2">Cancellation Logic Reference</label>
                            <textarea rows="3" className="form-control font-bold text-sm bg-white/5 border-white/10" placeholder="Specify reason for protocol termination..."></textarea>
                        </div>

                        <div className="flex gap-6">
                            <button onClick={() => setShowCancelModal(false)} className="btn-outline flex-1 py-5 text-[10px] uppercase font-black tracking-widest italic">Abort</button>
                            <button onClick={confirmCancel} className="bg-rose-500 text-white rounded-[2rem] flex-1 py-5 font-black uppercase tracking-widest text-[10px] italic shadow-2xl shadow-rose-500/20">Terminate Match →</button>
                        </div>
                    </div>
                </div>
            )}
        </CustomerLayout>
    );
}

