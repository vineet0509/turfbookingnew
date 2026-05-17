import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Dashboard({ tenant, bookings = [], customers = [], payments = [], initialTab = 'dashboard' }) {
    const [activeTab, setActiveTab] = useState(initialTab);
    const [showBookingModal, setShowBookingModal] = useState(false);

    const manualBookingForm = useForm({
        customer_name: '',
        customer_phone: '',
        date: new Date().toISOString().split('T')[0],
        time: '18:00',
        turf_id: tenant.turfs?.[0]?.id || '',
    });

    const addTurfForm = useForm({
        name: '',
        turf_type: 'cricket',
        capacity: 22,
        price_per_hour: 1000,
        weekend_price_per_hour: 1200,
        pitch_type: 'Natural Grass',
    });

    const [showTurfModal, setShowTurfModal] = useState(false);

    const submitManualBooking = (e) => {
        e.preventDefault();
        manualBookingForm.post(route('owner.bookings.manual'), {
            onSuccess: () => {
                setShowBookingModal(false);
                manualBookingForm.reset();
            },
        });
    };

    const submitAddTurf = (e) => {
        e.preventDefault();
        addTurfForm.post(route('owner.turfs.store'), {
            onSuccess: () => {
                setShowTurfModal(false);
                addTurfForm.reset();
            },
        });
    };

    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

    useEffect(() => {
        if (tenant?.turfs?.length > 0 && !manualBookingForm.data.turf_id) {
            manualBookingForm.setData('turf_id', tenant.turfs[0].id);
        }
    }, [tenant?.turfs]);

    const stats = [
        { label: 'Total Turfs', value: tenant.turfs?.length || 0, icon: '🏟️', color: 'emerald' },
        { label: 'Today\'s Bookings', value: bookings.filter(b => b.date === new Date().toISOString().split('T')[0]).length, icon: '📅', color: 'blue' },
        { label: 'Total Revenue', value: `₹${bookings.reduce((acc, b) => acc + (parseFloat(b.total_amount) || 0), 0)}`, icon: '💰', color: 'rose' },
        { label: 'Total Players', value: customers.length || 0, icon: '👥', color: 'amber' },
    ];

    const activePasses = tenant.passes || [];

    return (
        <AuthenticatedLayout header={activeTab.toUpperCase()}>
            <Head title="Owner Dashboard" />

            <div className="animate-fade-in">
                {/* Stats Row */}
                <div className="stats-row mb-16 px-0 pt-0">
                    {stats.map((s, i) => (
                        <div key={i} className="stat-card" data-color={s.color}>
                            <div className="stat-icon">{s.icon}</div>
                            <div className="stat-info">
                                <span className="stat-label">{s.label}</span>
                                <strong className="stat-value">{s.value}</strong>
                            </div>
                        </div>
                    ))}
                </div>

                {activeTab === 'dashboard' && (
                    <div className="dashboard-grid grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Booking Ledger (2/3) */}
                        <div className="lg:col-span-2 space-y-10">
                            <div className="panel glass-card">
                                <div className="panel-header">
                                    <h3 className="font-black italic uppercase tracking-tighter text-white">📋 Complete Booking Ledger</h3>
                                    <div className="flex gap-4">
                                        <input type="text" placeholder="Filter matches..." className="form-control py-2 px-4 text-[10px] w-48 border-white/5" />
                                        <button 
                                            onClick={() => setShowBookingModal(true)}
                                            className="bg-emerald-500 text-black px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
                                        >
                                            Manual Entry +
                                        </button>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>Time & Date</th>
                                                <th>Customer</th>
                                                <th>Turf</th>
                                                <th>Amount</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bookings.map(b => (
                                                <tr key={b.id} className="hover:bg-white/[0.02] transition-all">
                                                    <td>
                                                        <div className="cell-primary uppercase italic font-black">{b.slot?.start_time || b.start_time}</div>
                                                        <div className="cell-sub font-bold uppercase">{b.date}</div>
                                                    </td>
                                                    <td>
                                                        <div className="cell-primary font-bold">{b.customer?.name || b.customer_name}</div>
                                                        <div className="cell-sub font-bold">{b.customer_phone}</div>
                                                    </td>
                                                    <td className="uppercase font-black text-xs italic">{b.turf?.name}</td>
                                                    <td className="font-black text-emerald-400 italic">₹{b.total_amount}</td>
                                                    <td>
                                                        <span className={`status-badge ${b.status}`}>{b.status}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                            {bookings.length === 0 && (
                                                <tr>
                                                    <td colSpan="5" className="text-center py-20 text-slate-700 font-black uppercase tracking-[0.2em] text-xs italic">No activity logs found</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Actions (1/3) */}
                        <div className="space-y-10">
                            {/* Monthly Pass Monitor */}
                            <div className="panel glass-card">
                                <div className="panel-header">
                                    <h3 className="font-black italic uppercase tracking-tighter text-white">🎫 Monthly Pass Monitor</h3>
                                </div>
                                <div className="p-8 space-y-6">
                                    {activePasses.map((pass, i) => (
                                        <div key={i} className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 group hover:border-emerald-500/20 transition-all">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-[11px] font-black uppercase text-white tracking-tight">{pass.user?.name}</span>
                                                <span className="text-[9px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">{pass.bookings_used} / {pass.total_allowed} Matches</span>
                                            </div>
                                            <div className="progress-bar-container">
                                                <div className="progress-bar" style={{ width: `${(pass.bookings_used / pass.total_allowed) * 100}%` }}></div>
                                            </div>
                                            <div className="mt-3 text-[9px] font-bold text-slate-600 uppercase tracking-widest flex justify-between">
                                                <span>Ends: {pass.end_date}</span>
                                                <span className="text-emerald-500/50 italic">Priority Athlete</span>
                                            </div>
                                        </div>
                                    ))}
                                    {activePasses.length === 0 && (
                                        <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-3xl">
                                            <div className="text-4xl mb-4 opacity-20">🎑</div>
                                            <p className="text-[10px] font-black uppercase text-slate-700 tracking-widest italic">No active passes detected</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Top Performance Players */}
                            <div className="panel glass-card">
                                <div className="panel-header">
                                    <h3 className="font-black italic uppercase tracking-tighter text-white">👥 Top Athletes</h3>
                                </div>
                                <div className="p-8 space-y-6">
                                    {customers.slice(0, 5).map((c, i) => (
                                        <div key={i} className="flex items-center gap-4 group cursor-pointer hover:translate-x-2 transition-all">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                                                {c.name.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-xs font-black text-white uppercase tracking-tight italic">{c.name}</div>
                                                <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Premium Member</div>
                                            </div>
                                            <div className="text-xs font-black italic text-emerald-400">12 Wins</div>
                                        </div>
                                    ))}
                                    {customers.length === 0 && <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest text-center py-10 italic">Awaiting registration</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'turfs' && (
                    <div className="space-y-10">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Manage Arena Grounds</h2>
                                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">Configure and generate slots for your turfs</p>
                            </div>
                            <button 
                                onClick={() => setShowTurfModal(true)}
                                className="btn-premium px-8 py-4 text-[10px]"
                            >
                                Add New Ground +
                            </button>
                        </div>

                        <div className="turfs-grid">
                            {(tenant?.turfs || []).map(turf => (
                                <div key={turf.id} className="turf-card">
                                    <div className="turf-header">
                                        <h3 className="font-black italic uppercase tracking-tight text-white">{turf.name}</h3>
                                        <span className="status-badge active uppercase">Active Ground</span>
                                    </div>
                                    <div className="turf-details mb-8">
                                        <div className="detail-item font-bold uppercase italic text-[10px]"><span>⚽</span> {turf.turf_type}</div>
                                        <div className="detail-item font-bold uppercase italic text-[10px]"><span>📏</span> {turf.capacity} Players</div>
                                        <div className="detail-item font-bold uppercase italic text-[10px]"><span>💰</span> ₹{turf.price_per_hour}/hr</div>
                                        <div className="detail-item font-bold uppercase italic text-[10px]"><span>🌟</span> Premium Pitch</div>
                                    </div>
                                    <GenerateSlotsForm turfId={turf.id} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'players' && (
                    <div className="panel p-10">
                        <h3 className="text-2xl font-black uppercase tracking-tighter italic text-white mb-10">🏟️ Athlete Directory</h3>
                        <div className="overflow-x-auto">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Athlete Name</th>
                                        <th>Contact Intelligence</th>
                                        <th>Matches Played</th>
                                        <th className="text-right">Intelligence Access</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customers.map(c => (
                                        <tr key={c.id}>
                                            <td>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-emerald-400 uppercase italic text-sm">{c.name.charAt(0)}</div>
                                                    <div className="font-black text-white uppercase italic tracking-tight">{c.name}</div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="cell-primary text-xs font-bold">{c.email}</div>
                                                <div className="cell-sub uppercase font-black text-[9px] tracking-widest text-slate-600">Verified Identity</div>
                                            </td>
                                            <td><span className="badge font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 px-4 py-2">12 matches</span></td>
                                            <td className="text-right">
                                                <button className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] hover:tracking-[0.3em] transition-all italic">View Match History →</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {customers.length === 0 && <tr><td colSpan="4" className="text-center py-20 font-black uppercase tracking-widest text-slate-800 italic">No athletes registered in network</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'payments' && (
                    <div className="panel p-10">
                        <h3 className="text-2xl font-black uppercase tracking-tighter italic text-white mb-10">💰 Revenue Transaction Intelligence</h3>
                        <div className="overflow-x-auto">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Transaction Hash</th>
                                        <th>Timestamp</th>
                                        <th>Origin Athlete</th>
                                        <th>Value</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.map(p => (
                                        <tr key={p.id}>
                                            <td><code className="text-[10px] font-black text-emerald-400 uppercase italic tracking-widest bg-emerald-500/5 px-3 py-1 rounded-lg">#TX-{p.id.substring(0, 10)}</code></td>
                                            <td className="text-xs font-bold text-slate-500 uppercase">{p.created_at}</td>
                                            <td className="font-black text-white uppercase italic tracking-tight">{p.booking?.customer?.name || p.booking?.customer_name}</td>
                                            <td className="text-xl font-black text-emerald-400 italic">₹{p.amount}</td>
                                            <td><span className="status-badge success uppercase tracking-widest italic">Success</span></td>
                                        </tr>
                                    ))}
                                    {payments.length === 0 && <tr><td colSpan="5" className="text-center py-20 font-black uppercase tracking-widest text-slate-800 italic">No transaction records detected</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="panel p-12 max-w-5xl">
                        <h3 className="text-2xl font-black uppercase tracking-tighter italic text-white mb-12">⚙️ Arena Infrastructure Profile</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-600 italic">Arena Network Name</label>
                                    <input type="text" className="form-control text-sm font-bold tracking-tight bg-white/5" defaultValue={tenant.name} />
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-600 italic">Central Communications (Phone)</label>
                                    <input type="text" className="form-control text-sm font-bold tracking-tight bg-white/5" defaultValue={tenant.phone} />
                                </div>
                                <div className="p-10 bg-emerald-500/5 border border-emerald-500/10 rounded-[2.5rem] relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8 text-4xl opacity-5 group-hover:opacity-10 transition-opacity">💳</div>
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-8 italic">Revenue Gateway Integration</h4>
                                    <div className="space-y-6">
                                        <input type="password" placeholder="Razorpay Key ID" className="form-control border-emerald-500/10" />
                                        <input type="password" placeholder="Razorpay Secret Hash" className="form-control border-emerald-500/10" />
                                    </div>
                                    <p className="text-[9px] font-bold text-slate-600 mt-6 uppercase tracking-widest">Connect your production Razorpay keys to enable direct athlete settlements.</p>
                                </div>
                            </div>
                            <div className="space-y-10">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-600 italic">Operational City Hub</label>
                                        <input type="text" className="form-control text-sm font-bold tracking-tight bg-white/5" defaultValue={tenant.city} />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-600 italic">State / Province</label>
                                        <input type="text" className="form-control text-sm font-bold tracking-tight bg-white/5" defaultValue={tenant.state} />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-600 italic">Pincode / ZIP</label>
                                    <input type="text" className="form-control text-sm font-bold tracking-tight bg-white/5" defaultValue={tenant.pincode} />
                                </div>
                                <div className="p-10 bg-blue-500/5 border border-blue-500/10 rounded-[2.5rem] relative overflow-hidden group">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-8 italic">Monthly Pass Configuration</h4>
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-600 italic">Pass Price (₹)</label>
                                            <input type="number" className="form-control border-blue-500/10" defaultValue={tenant.monthly_pass_price} />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-600 italic">Included Sessions</label>
                                            <input type="number" className="form-control border-blue-500/10" defaultValue={tenant.monthly_pass_bookings} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-600 italic">Arena Technical Description</label>
                                    <textarea className="form-control h-32 text-sm font-bold tracking-tight bg-white/5 leading-relaxed" defaultValue={tenant.description}></textarea>
                                </div>
                                <div className="p-10 bg-slate-500/5 border border-white/5 rounded-[2.5rem]">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8 italic">Social Connectivity</h4>
                                    <div className="space-y-6">
                                        <input type="text" placeholder="Instagram URL" className="form-control bg-transparent" defaultValue={tenant.instagram_url} />
                                        <input type="text" placeholder="Facebook URL" className="form-control bg-transparent" defaultValue={tenant.facebook_url} />
                                        <input type="text" placeholder="WhatsApp Number" className="form-control bg-transparent" defaultValue={tenant.whatsapp_number} />
                                    </div>
                                </div>
                                <button className="btn-premium w-full py-6 text-xs uppercase font-black italic tracking-[0.3em] shadow-[0_20px_50px_rgba(16,185,129,0.2)]">Commit Configuration →</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Manual Booking Modal */}
                {showBookingModal && (
                    <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
                        <div className="modal-box animate-slide-up" onClick={e => e.stopPropagation()}>
                            <button onClick={() => setShowBookingModal(false)} className="modal-close-btn">✕</button>
                            <div className="text-5xl mb-6">📝</div>
                            <h2 className="text-3xl font-black uppercase tracking-tight italic mb-2 text-white">Manual Booking</h2>
                            <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-[9px] mb-10 italic ms-1">Enter a direct match record for your arena.</p>

                            <form onSubmit={submitManualBooking} className="space-y-8">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="form-group">
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 ms-2">Customer Name</label>
                                        <input 
                                            type="text" 
                                            className="form-control py-5 italic text-sm" 
                                            placeholder="Arjun Kumar" 
                                            value={manualBookingForm.data.customer_name}
                                            onChange={e => manualBookingForm.setData('customer_name', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 ms-2">Phone Number</label>
                                        <input 
                                            type="text" 
                                            className="form-control py-5 italic text-sm" 
                                            placeholder="9876543210" 
                                            value={manualBookingForm.data.customer_phone}
                                            onChange={e => manualBookingForm.setData('customer_phone', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="form-group">
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 ms-2">Match Date</label>
                                        <input 
                                            type="date" 
                                            className="form-control py-5 italic text-sm" 
                                            value={manualBookingForm.data.date}
                                            onChange={e => manualBookingForm.setData('date', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 ms-2">Start Time</label>
                                        <input 
                                            type="time" 
                                            className="form-control py-5 italic text-sm" 
                                            value={manualBookingForm.data.time}
                                            onChange={e => manualBookingForm.setData('time', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 ms-2">Select Ground</label>
                                    <select 
                                        className="form-control py-5 italic text-sm"
                                        value={manualBookingForm.data.turf_id}
                                        onChange={e => manualBookingForm.setData('turf_id', e.target.value)}
                                        required
                                    >
                                        {(tenant?.turfs || []).map(t => (
                                            <option key={t.id} value={t.id}>{t.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <button type="submit" disabled={manualBookingForm.processing} className="btn-premium w-full py-6 text-xs font-black uppercase italic tracking-[0.3em] shadow-[0_20px_50px_rgba(16,185,129,0.3)]">
                                    {manualBookingForm.processing ? 'RECORDING MATCH...' : 'COMMIT BOOKING →'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {showTurfModal && (
                    <div className="modal-overlay" onClick={() => setShowTurfModal(false)}>
                        <div className="modal-box animate-slide-up max-w-xl" onClick={e => e.stopPropagation()}>
                            <button onClick={() => setShowTurfModal(false)} className="modal-close-btn">✕</button>
                            <div className="text-5xl mb-6">🏟️</div>
                            <h2 className="text-3xl font-black uppercase tracking-tight italic mb-2 text-white">Deploy New Ground</h2>
                            <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-[9px] mb-10 italic ms-1">Register a new field in your arena infrastructure.</p>

                            <form onSubmit={submitAddTurf} className="space-y-8">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="form-group">
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 ms-2">Ground Name</label>
                                        <input 
                                            type="text" 
                                            className="form-control py-5 italic text-sm" 
                                            placeholder="Arena A - Premium" 
                                            value={addTurfForm.data.name}
                                            onChange={e => addTurfForm.setData('name', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 ms-2">Sport Intelligence</label>
                                        <select 
                                            className="form-control py-5 italic text-sm"
                                            value={addTurfForm.data.turf_type}
                                            onChange={e => addTurfForm.setData('turf_type', e.target.value)}
                                            required
                                        >
                                            <option value="cricket">Cricket</option>
                                            <option value="football">Football</option>
                                            <option value="badminton">Badminton</option>
                                            <option value="multi">Multi-Sport</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-8">
                                    <div className="form-group">
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 ms-2">Standard Rate</label>
                                        <input 
                                            type="number" 
                                            className="form-control py-5 italic text-sm" 
                                            placeholder="1000" 
                                            value={addTurfForm.data.price_per_hour}
                                            onChange={e => addTurfForm.setData('price_per_hour', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 ms-2">Weekend Rate</label>
                                        <input 
                                            type="number" 
                                            className="form-control py-5 italic text-sm" 
                                            placeholder="1200" 
                                            value={addTurfForm.data.weekend_price_per_hour}
                                            onChange={e => addTurfForm.setData('weekend_price_per_hour', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 ms-2">Player Capacity</label>
                                        <input 
                                            type="number" 
                                            className="form-control py-5 italic text-sm" 
                                            placeholder="22" 
                                            value={addTurfForm.data.capacity}
                                            onChange={e => addTurfForm.setData('capacity', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 ms-2">Surface Specification</label>
                                    <input 
                                        type="text" 
                                        className="form-control py-5 italic text-sm" 
                                        placeholder="Artificial Turf / Natural Grass / Clay" 
                                        value={addTurfForm.data.pitch_type}
                                        onChange={e => addTurfForm.setData('pitch_type', e.target.value)}
                                    />
                                </div>

                                <button type="submit" disabled={addTurfForm.processing} className="btn-premium w-full py-6 text-xs font-black uppercase italic tracking-[0.3em] shadow-[0_20px_50px_rgba(16,185,129,0.3)]">
                                    {addTurfForm.processing ? 'DEPLOYING INFRASTRUCTURE...' : 'INITIALIZE GROUND →'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

function GenerateSlotsForm({ turfId }) {
    const { data, setData, post, processing } = useForm({
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        start_time: '06:00',
        end_time: '23:00',
        slot_duration_minutes: 60,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('owner.turfs.slots.generate', turfId));
    };

    return (
        <form onSubmit={submit} className="bg-black/30 p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full group-hover:bg-emerald-500/10 transition-all"></div>
            <div className="flex items-center gap-4 mb-10">
                <span className="text-2xl">⚡</span>
                <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 italic">Auto-Generate Slot Intelligence</h5>
            </div>
            
            <div className="grid grid-cols-2 gap-8 mb-10">
                <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest ms-2 italic">Operation End Date</p>
                    <input type="date" className="form-control text-xs py-4 font-black tracking-widest bg-white/5" value={data.end_date} onChange={e => setData('end_date', e.target.value)} />
                </div>
                <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest ms-2 italic">Match Duration</p>
                    <select 
                        className="form-control text-xs py-4 font-black tracking-widest bg-white/5"
                        value={data.slot_duration_minutes} 
                        onChange={e => setData('slot_duration_minutes', e.target.value)}
                    >
                        <option value="60">1.0 Hour Session</option>
                        <option value="120">2.0 Hour Session</option>
                    </select>
                </div>
            </div>
            
            <button 
                type="submit" 
                disabled={processing} 
                className="w-full btn-premium py-5 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl"
            >
                {processing ? 'Processing Intelligence...' : 'Initialize Generation Cycle →'}
            </button>
        </form>
    );
}
