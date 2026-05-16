import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showAboutModal, setShowAboutModal] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    // Import Inter font directly for global consistency
    useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    }, []);

    const getMenuItems = () => {
        if (user.role === 'super_admin') {
            return [
                { id: 'overview', label: 'Platform Overview', icon: '📊', route: 'admin.dashboard' },
                { id: 'arenas', label: 'Manage Arenas', icon: '🏟️', route: 'admin.arenas' },
                { id: 'revenue', label: 'Revenue Analytics', icon: '📈', route: 'admin.revenue' },
                { id: 'settings', label: 'Global Settings', icon: '⚙️', route: 'admin.settings' },
            ];
        } else if (user.role === 'owner') {
            return [
                { id: 'dashboard', label: 'Dashboard', icon: '📊', route: 'owner.dashboard' },
                { id: 'turfs', label: 'Manage Turfs', icon: '🏟️', route: 'owner.turfs' },
                { id: 'players', label: 'Registered Players', icon: '👥', route: 'owner.players' },
                { id: 'payments', label: 'Transaction Logs', icon: '💰', route: 'owner.payments' },
                { id: 'billing', label: 'Billing & Plans', icon: '💎', route: 'owner.billing' },
                { id: 'settings', label: 'Arena Settings', icon: '⚙️', route: 'owner.settings' },
            ];
        } else {
            return [
                { id: 'bookings', label: 'My Bookings', icon: '🏟️', route: 'customer.dashboard' },
                { id: 'passes', label: 'My Passes', icon: '🎫', route: 'customer.passes' },
                { id: 'profile', label: 'Player Profile', icon: '👤', route: 'customer.profile' },
            ];
        }
    };

    const menuItems = getMenuItems();
    
    // Determine active tab based on route name
    const currentRoute = route().current();
    let activeTab = 'dashboard';
    if (user.role === 'customer') activeTab = 'bookings';
    if (user.role === 'super_admin') activeTab = 'overview';

    menuItems.forEach(item => {
        if (currentRoute === item.route) {
            activeTab = item.id;
        }
    });

    return (
        <div className="app-shell">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <span className="logo-icon">🏟️</span>
                    <span className="logo-text">TurfBook</span>
                </div>

                <nav className="nav-menu">
                    {menuItems.map((item) => (
                        <Link
                            key={item.id}
                            href={route(item.route)}
                            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="sidebar-support-card group">
                    <div className="support-title">Terminal Help</div>
                    <p>Contact the Vynkra Node operators for technical deployment assistance.</p>
                    <div className="support-links">
                        <button onClick={() => setShowAboutModal(true)}>Info</button>
                        <button onClick={() => setShowContactModal(true)}>Operator</button>
                    </div>
                </div>

                <div className="sidebar-footer">
                    <div className="user-info">
                        <div className="avatar">{user.name.charAt(0)}</div>
                        <div className="user-details">
                            <div className="user-name">{user.name}</div>
                            <div className="user-role">{user.role === 'owner' ? 'Arena Owner' : (user.role === 'super_admin' ? 'Super Admin' : 'Athlete')}</div>
                        </div>
                    </div>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="logout-premium"
                    >
                        <span>⏻</span>
                    </Link>
                </div>
                
                <div className="powered-by-sidebar">
                    <p>POWERED BY</p>
                    <span className="text-emerald-500 font-black text-[10px] tracking-widest">VYNKRA TECHNOLOGIES</span>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-area">
                {/* Top Bar */}
                <header className="topbar">
                    <div className="topbar-left">
                        <h1 className="page-title italic uppercase tracking-tighter font-black text-2xl">{header || 'Platform Control Center'}</h1>
                        <span className="topbar-sub">Welcome back, {user.name}! 👋</span>
                    </div>
                    
                    <div className="topbar-right flex items-center gap-6">
                        <div className="today-badge bg-white/5 border border-white/5 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400">
                            📅 {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>

                        {user.role === 'owner' && (
                            <div className="trial-alert-badge bg-amber-500/10 border border-amber-500/20 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-amber-500 flex items-center gap-2 cursor-pointer hover:bg-amber-500/20 transition-all">
                                🎁 <span>TRIAL ENDS IN 5 DAYS</span>
                            </div>
                        )}

                        <div className="relative">
                            <button 
                                onClick={() => setShowNotifications(!showNotifications)}
                                className={`w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all ${showNotifications ? 'bg-white/10 border-emerald-500/30' : ''}`}
                            >
                                <span className="text-xl">🔔</span>
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 border-2 border-[#0a0f16] rounded-full flex items-center justify-center text-[8px] font-black text-white">2</span>
                            </button>

                            {showNotifications && (
                                <div className="absolute right-0 mt-4 w-80 bg-[#161b22] border border-white/10 rounded-2xl shadow-2xl p-6 z-50 animate-fade-in">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Activity Feed</h3>
                                        <button className="text-[10px] font-black uppercase text-slate-500 hover:text-white">Clear All</button>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-all">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-sm">✅</div>
                                            <div>
                                                <div className="text-[11px] font-bold text-white leading-tight">New booking confirmed for Arjun Kumar</div>
                                                <div className="text-[9px] font-bold text-slate-500 mt-1 uppercase">2 mins ago</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-all">
                                            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center text-sm">🚨</div>
                                            <div>
                                                <div className="text-[11px] font-bold text-white leading-tight">Payment pending for slot #BK892</div>
                                                <div className="text-[9px] font-bold text-slate-500 mt-1 uppercase">1 hour ago</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {user.role === 'owner' && (
                            <Link href={route('owner.dashboard', { tab: 'dashboard' })} className="btn-premium px-8 py-3.5 text-[10px] shadow-[0_10px_30px_rgba(16,185,129,0.2)]">
                                + New Booking
                            </Link>
                        )}
                        {user.role === 'customer' && (
                            <Link href="/" className="btn-premium px-8 py-3.5 text-[10px] shadow-[0_10px_30px_rgba(16,185,129,0.2)]">
                                + Book New Turf
                            </Link>
                        )}
                    </div>
                </header>

                {/* Page Content */}
                <div className="content">
                    {children}
                </div>
            </main>

            {/* Modals */}
            {showAboutModal && (
                <div className="modal-overlay" onClick={() => setShowAboutModal(false)}>
                    <div className="modal-box glass-panel animate-slide-up" onClick={e => e.stopPropagation()}>
                        <h2 className="text-2xl font-black uppercase italic tracking-tight mb-6 text-white">🚀 About TurfBook</h2>
                        <div className="text-slate-400 font-medium text-sm leading-relaxed space-y-4">
                            <p>TurfBook is a premium Sports Management Solution developed by <strong>Vynkra Technologies</strong>. We specialize in helping arena owners automate their business operations.</p>
                            <p>From manual entry to automated digital scheduling, we provide the tools you need to grow your sports community. Our platform is built on transparency, reliability, and high performance.</p>
                        </div>
                        <button className="btn-primary w-full mt-10 py-4 font-black uppercase tracking-widest text-[10px]" onClick={() => setShowAboutModal(false)}>Close</button>
                    </div>
                </div>
            )}

            {showContactModal && (
                <div className="modal-overlay" onClick={() => setShowContactModal(false)}>
                    <div className="modal-box glass-panel max-w-md animate-slide-up" onClick={e => e.stopPropagation()}>
                        <h2 className="text-2xl font-black uppercase italic tracking-tight mb-8 text-center text-white">📧 Contact Support</h2>
                        <div className="space-y-4">
                            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-5">
                                <span className="text-2xl">✉️</span>
                                <div>
                                    <div className="font-black text-xs uppercase tracking-widest text-white mb-1">Technical Support</div>
                                    <div className="text-xs font-bold text-slate-500">support@vynkra.com</div>
                                </div>
                            </div>
                            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-5">
                                <span className="text-2xl">📞</span>
                                <div>
                                    <div className="font-black text-xs uppercase tracking-widest text-white mb-1">Business Inquiries</div>
                                    <div className="text-xs font-bold text-slate-500">+91 98765 43210</div>
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
