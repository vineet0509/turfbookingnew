import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function AdminDashboard({ platformStats, tenants, revenueData, globalConfig, initialTab = 'overview' }) {
    const [activeTab, setActiveTab] = useState(initialTab);

    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

    const stats = [
        { label: 'Total Arenas', value: platformStats?.tenants?.total || 0, icon: '🏟️' },
        { label: 'Total Players', value: platformStats?.users?.total || 0, icon: '👥' },
        { label: 'Confirmed Bookings', value: platformStats?.bookings?.confirmed || 0, icon: '✅' },
        { label: 'Platform Revenue', value: `₹${platformStats?.revenue?.total || 0}`, icon: '💰' },
    ];

    const approveTenant = (id) => {
        router.post(route('admin.tenant.status', id), { status: 'approved' });
    };

    const suspendTenant = (id) => {
        router.post(route('admin.tenant.status', id), { status: 'suspended' });
    };

    return (
        <AuthenticatedLayout header="Platform Control Center">
            <Head title="Admin Master Intelligence" />

            <div className="animate-fade-in">
                {/* Master Stats */}
                <div className="stats-row mb-16 px-0 pt-0">
                    <div className="stat-card" data-color="blue">
                        <div className="stat-icon">🏟️</div>
                        <div className="stat-info">
                            <span className="stat-label">Total Arenas</span>
                            <strong className="stat-value">{platformStats?.tenants?.total || 0}</strong>
                        </div>
                    </div>
                    <div className="stat-card" data-color="emerald">
                        <div className="stat-icon">✅</div>
                        <div className="stat-info">
                            <span className="stat-label">Confirmed Bookings</span>
                            <strong className="stat-value">{platformStats?.bookings?.confirmed || 0}</strong>
                        </div>
                    </div>
                    <div className="stat-card" data-color="rose">
                        <div className="stat-icon">📈</div>
                        <div className="stat-info">
                            <span className="stat-label">Platform Revenue</span>
                            <strong className="stat-value">₹{platformStats?.revenue?.total || 0}</strong>
                        </div>
                    </div>
                    <div className="stat-card" data-color="amber">
                        <div className="stat-icon">👥</div>
                        <div className="stat-info">
                            <span className="stat-label">Total Players</span>
                            <strong className="stat-value">{platformStats?.users?.total || 0}</strong>
                        </div>
                    </div>
                </div>

                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-fade-in">
                        <div className="lg:col-span-2 glass-panel p-10 panel">
                            <div className="flex justify-between items-center mb-10 px-4">
                                <h3 className="text-2xl font-black uppercase tracking-tighter italic text-white">🏟️ Recent Arena Registrations</h3>
                                <button className="text-amber-500 text-[10px] font-black uppercase tracking-widest hover:underline">View All →</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Arena Name</th>
                                            <th>Owner</th>
                                            <th>Plan</th>
                                            <th>Status</th>
                                            <th className="text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tenants.slice(0, 5).map(tenant => (
                                            <tr key={tenant.id} className="hover:bg-white/[0.02] transition-all">
                                                <td>
                                                    <div className="font-black text-white uppercase tracking-tight italic">{tenant.name}</div>
                                                    <div className="text-[10px] font-bold text-amber-500/50 uppercase tracking-widest">{tenant.subdomain}.turfbook.com</div>
                                                </td>
                                                <td className="text-xs font-bold text-slate-500 italic uppercase">{tenant.owner?.name}</td>
                                                <td className="text-[10px] font-black text-emerald-400 uppercase tracking-widest italic">{tenant.subscription?.plan?.display_name || 'Free Trial'}</td>
                                                <td>
                                                    <span className={`status-badge ${tenant.status} uppercase italic tracking-widest px-3 py-1`}>{tenant.status}</span>
                                                </td>
                                                <td className="text-right space-x-3">
                                                    {tenant.status === 'pending' && (
                                                        <button onClick={() => approveTenant(tenant.id)} className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest">Approve</button>
                                                    )}
                                                    {tenant.status === 'approved' && (
                                                        <button onClick={() => suspendTenant(tenant.id)} className="bg-rose-500/10 border border-rose-500/20 text-rose-500 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest">Suspend</button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="space-y-10">
                            <div className="glass-panel p-10 bg-gradient-to-br from-amber-500/5 to-transparent border-amber-500/10 panel">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500 mb-10 italic">💎 Business Snapshot</h3>
                                <div className="space-y-8">
                                    <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 border-l-4 border-amber-500 relative overflow-hidden group">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Pending Approvals</span>
                                            <span className="text-2xl font-black text-amber-500 italic">{platformStats?.tenants?.pending}</span>
                                        </div>
                                        <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Arenas awaiting verification</p>
                                    </div>
                                    <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 border-l-4 border-emerald-500 relative overflow-hidden group">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Active Nodes</span>
                                            <span className="text-2xl font-black text-emerald-400 italic">{platformStats?.tenants?.total - platformStats?.tenants?.pending}</span>
                                        </div>
                                        <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Total revenue-generating units</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="panel glass-card bg-emerald-500/5 p-8 border-emerald-500/10">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-6 italic">System Integrity</h3>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10B981]"></div>
                                    <span className="text-[10px] font-black uppercase text-white tracking-widest italic">All protocols operational</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'arenas' && (
                    <div className="glass-panel p-10 animate-fade-in">
                        <h3 className="text-2xl font-black uppercase tracking-tighter italic text-white mb-10">Manage Arena Network</h3>
                        <div className="overflow-x-auto">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Identity Hash</th>
                                        <th>Arena Node</th>
                                        <th>Access URL</th>
                                        <th>Master Identity</th>
                                        <th>Infrastructure</th>
                                        <th>Protocol Status</th>
                                        <th className="text-right">Execution</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tenants.map(tenant => (
                                        <tr key={tenant.id}>
                                            <td className="text-[9px] font-black text-slate-700 uppercase tracking-widest">#{tenant.id.substring(0, 8)}</td>
                                            <td><div className="font-black text-white uppercase tracking-tight italic">{tenant.name}</div></td>
                                            <td><code className="text-[10px] font-black text-amber-500 bg-amber-500/5 px-2 py-1 rounded">{tenant.subdomain}.turfbook.com</code></td>
                                            <td className="text-xs font-bold text-slate-500 italic uppercase">{tenant.owner?.name}</td>
                                            <td><span className="badge font-black uppercase tracking-widest bg-white/5 text-slate-400 border-white/5 px-4 py-2">{tenant.turfs_count} Grounds</span></td>
                                            <td><span className={`status-badge ${tenant.status} uppercase italic tracking-widest px-3 py-1`}>{tenant.status}</span></td>
                                            <td className="text-right space-x-3">
                                                {tenant.status !== 'approved' ? (
                                                    <button onClick={() => approveTenant(tenant.id)} className="bg-amber-500 text-black px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-amber-500/20">Approve Node</button>
                                                ) : (
                                                    <button onClick={() => suspendTenant(tenant.id)} className="border border-rose-500/20 text-rose-500 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">Suspend Node</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'revenue' && (
                    <div className="glass-panel p-10 animate-fade-in">
                        <h3 className="text-2xl font-black uppercase tracking-tighter italic text-white mb-10">Network Revenue Intelligence</h3>
                        <div className="bg-gradient-to-r from-amber-500/10 to-transparent p-12 rounded-[3rem] border border-amber-500/10 mb-12 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-12 text-6xl opacity-5 font-black italic tracking-tighter uppercase">REVENUE</div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500 mb-4">Total Network Accumulated Earnings</p>
                            <div className="text-6xl font-black text-white italic tracking-tighter uppercase">₹{platformStats?.revenue?.total || 0}</div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Origin Node</th>
                                        <th>Protocol</th>
                                        <th>Value Settlement</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tenants.filter(t => t.status === 'approved').map(tenant => (
                                        <tr key={tenant.id}>
                                            <td className="text-xs font-bold text-slate-500 uppercase">2026-05-16</td>
                                            <td className="font-black text-white uppercase tracking-tight italic">{tenant.name}</td>
                                            <td className="text-[10px] font-black uppercase tracking-widest text-slate-600 italic">Subscription Renewal</td>
                                            <td className="text-xl font-black text-amber-500 italic">₹999.00</td>
                                            <td><span className="status-badge success uppercase italic tracking-widest">Settled</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="glass-panel p-12 animate-fade-in max-w-4xl">
                        <h3 className="text-2xl font-black uppercase tracking-tighter italic text-white mb-12">⚙️ Master Infrastructure Configuration</h3>
                        <form className="space-y-12">
                            <div className="p-10 bg-amber-500/5 border border-amber-500/10 rounded-[3rem] relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-10 text-5xl opacity-5 group-hover:opacity-10 transition-opacity">🔐</div>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500 mb-8 italic">Master Revenue Gateway Intelligence</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-600 italic ms-2">Razorpay Master Key ID</label>
                                        <input type="password" value="rzp_test_key" className="form-control font-black italic text-sm py-4 bg-black/30 border-amber-500/10" readOnly />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-600 italic ms-2">Razorpay Protocol Secret</label>
                                        <input type="password" value="••••••••••••" className="form-control font-black italic text-sm py-4 bg-black/30 border-amber-500/10" readOnly />
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-600 italic ms-2">Platform Master Name</label>
                                    <input type="text" value="TurfBook Master" className="form-control font-black italic text-sm py-4 bg-white/5" />
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-600 italic ms-2">Central Node Support Intelligence</label>
                                    <input type="email" value="support@vynkra.com" className="form-control font-black italic text-sm py-4 bg-white/5" />
                                </div>
                            </div>
                            <button type="button" className="btn-premium w-full py-6 text-xs uppercase font-black italic tracking-[0.3em] shadow-[0_20px_50px_rgba(245,158,11,0.2)] bg-amber-500 text-black border-none">Commit Platform Intelligence Cycle →</button>
                        </form>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
