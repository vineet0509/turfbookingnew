import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard() {
    const stats = [
        { label: 'Total Revenue', value: '₹1,24,500', icon: '💰', color: 'emerald' },
        { label: 'Active Bookings', value: '42', icon: '📋', color: 'blue' },
        { label: 'Registered Players', value: '850', icon: '👥', color: 'amber' },
        { label: 'System Uptime', value: '99.9%', icon: '⚡', color: 'rose' },
    ];

    const recentBookings = [
        { id: '#BK-8821', time: '06:00 PM', date: 'Oct 24, 2026', customer: 'Arjun Kumar', phone: '9876543210', turf: 'Main Court A', amount: '₹800', status: 'paid' },
        { id: '#BK-8822', time: '07:30 PM', date: 'Oct 24, 2026', customer: 'Sarah Khan', phone: '9822114455', turf: 'Premium Pitch', amount: '₹1200', status: 'pending' },
        { id: '#BK-8823', time: '09:00 PM', date: 'Oct 24, 2026', customer: 'John Doe', phone: '9988776655', turf: 'Main Court B', amount: '₹800', status: 'paid' },
        { id: '#BK-8824', time: '10:30 PM', date: 'Oct 24, 2026', customer: 'Rohan Singh', phone: '9122334455', turf: 'Box Cricket', amount: '₹600', status: 'cancelled' },
    ];

    return (
        <AuthenticatedLayout header="System Overview">
            <Head title="Dashboard" />

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Booking Ledger */}
                <div className="lg:col-span-2">
                    <div className="glass-card panel">
                        <div className="panel-header">
                            <h3>📋 Complete Booking Ledger</h3>
                            <div className="flex gap-3">
                                <input type="text" placeholder="Search bookings..." className="bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-xs font-bold text-white focus:outline-none focus:border-emerald-500/30" />
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
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentBookings.map((b, i) => (
                                        <tr key={i} className="hover:bg-white/[0.01] transition-all">
                                            <td>
                                                <div className="cell-primary">{b.time}</div>
                                                <div className="cell-sub">{b.date}</div>
                                            </td>
                                            <td>
                                                <div className="cell-primary">{b.customer}</div>
                                                <div className="cell-sub">{b.phone}</div>
                                            </td>
                                            <td className="text-sm font-bold text-slate-400">{b.turf}</td>
                                            <td>
                                                <span className="text-sm font-black text-white">{b.amount}</span>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${b.status}`}>{b.status}</span>
                                            </td>
                                            <td>
                                                <button className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-rose-500/10 hover:text-rose-500 transition-all">
                                                    <span className="text-xs">✕</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sidebar Cards */}
                <div className="space-y-10">
                    {/* Active Passes */}
                    <div className="glass-card panel">
                        <div className="panel-header">
                            <h3>🎫 Active Monthly Passes</h3>
                        </div>
                        <div className="p-6 space-y-6">
                            {[
                                { name: 'Arjun Kumar', left: 8, total: 12, end: 'Nov 12' },
                                { name: 'Sarah Khan', left: 3, total: 10, end: 'Oct 30' }
                            ].map((pass, i) => (
                                <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-sm font-black text-white">{pass.name}</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">{pass.left}/{pass.total} Left</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-to-r from-emerald-400 to-blue-500" 
                                            style={{ width: `${(pass.left/pass.total)*100}%` }}
                                        />
                                    </div>
                                    <div className="text-[9px] font-black uppercase tracking-widest text-slate-600 mt-3 flex justify-between">
                                        <span>Membership Card</span>
                                        <span>Ends: {pass.end}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Players */}
                    <div className="glass-card panel">
                        <div className="panel-header">
                            <h3>👥 Top Players</h3>
                        </div>
                        <div className="p-6 space-y-6">
                            {[
                                { name: 'Arjun Kumar', bookings: 42, color: 'from-emerald-400 to-emerald-600' },
                                { name: 'Sarah Khan', bookings: 38, color: 'from-blue-400 to-blue-600' },
                                { name: 'John Doe', bookings: 25, color: 'from-amber-400 to-amber-600' }
                            ].map((player, i) => (
                                <div key={i} className="flex items-center gap-4 group cursor-default">
                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${player.color} flex items-center justify-center font-black text-white shadow-lg`}>
                                        {player.name.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-black text-white group-hover:text-emerald-400 transition-all">{player.name}</div>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">{player.bookings} matches played</div>
                                    </div>
                                    <div className="text-emerald-500/20 text-xl font-black italic">#0{i+1}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
