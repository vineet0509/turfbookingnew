import { Head, Link, useForm } from '@inertiajs/react';

export default function Register({ isSubdomain, tenant, tenants = [], plans = [] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: isSubdomain ? 'customer' : 'owner',
        tenant_id: isSubdomain ? (tenant?.id || '') : '',
        plan_id: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const themeColor = data.role === 'customer' ? 'blue' : 'emerald';
    const roleTitle = data.role === 'customer' ? 'Athlete Identity' : 'Arena Ownership';
    const subTitle = data.role === 'customer' ? (isSubdomain ? `Join ${tenant?.name} Network` : 'Join the global athlete network') : 'Join the #1 arena management ecosystem';

    return (
        <div className="min-h-screen bg-[#0a0f16] flex items-center justify-center p-6 selection:bg-emerald-500 selection:text-black">
            <Head title={isSubdomain ? `Join ${tenant?.name}` : "Join TurfBook"} />
            
            <div className={`absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(${isSubdomain ? '59,130,246' : '16,185,129'},0.05)_0%,transparent_50%)] pointer-events-none`}></div>
            
            <div className="w-full max-w-lg">
                <div className="text-center mb-12">
                    <div className="flex justify-center items-center gap-3 mb-6">
                        <span className="text-4xl">{isSubdomain ? '🏃' : '🏟️'}</span>
                        <span className="text-3xl font-black uppercase tracking-tighter italic text-white">
                            {isSubdomain ? tenant?.name : 'Turf'}<span className={isSubdomain ? 'text-blue-500' : 'text-emerald-500'}>{isSubdomain ? '' : 'Book'}</span>
                        </span>
                    </div>
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-2">Initialize {roleTitle}</h1>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 italic">{subTitle}</p>
                </div>

                <div className="glass-panel p-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 text-5xl opacity-5 font-black italic tracking-tighter uppercase leading-none">JOIN</div>
                    
                    {!isSubdomain && (
                        <div className="flex bg-white/5 p-1.5 rounded-2xl mb-10 border border-white/5 relative z-10">
                            <button 
                                onClick={() => setData('role', 'owner')}
                                className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${data.role === 'owner' ? 'bg-emerald-500 text-black shadow-xl shadow-emerald-500/20' : 'text-slate-500 hover:text-white'}`}
                            >
                                Arena Owner
                            </button>
                            <button 
                                onClick={() => setData('role', 'customer')}
                                className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${data.role === 'customer' ? 'bg-blue-500 text-black shadow-xl shadow-blue-500/20' : 'text-slate-500 hover:text-white'}`}
                            >
                                Athlete Player
                            </button>
                        </div>
                    )}
                    
                    <form onSubmit={submit} className="space-y-10 relative z-10">
                        <div className="space-y-8">
                            <div className="form-group">
                                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-3 ms-2">Full Name / Signature</label>
                                <input
                                    type="text"
                                    className="form-control py-6 italic text-sm bg-white/5 border-white/5"
                                    placeholder="Arjun Kumar"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                {errors.name && <div className="text-rose-500 text-[10px] font-black mt-2 uppercase italic tracking-widest ms-2">{errors.name}</div>}
                            </div>

                            <div className="form-group">
                                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-3 ms-2">Authentication Key (Email)</label>
                                <input
                                    type="email"
                                    className="form-control py-6 italic text-sm bg-white/5 border-white/5"
                                    placeholder="user@example.com"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                {errors.email && <div className="text-rose-500 text-[10px] font-black mt-2 uppercase italic tracking-widest ms-2">{errors.email}</div>}
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="form-group">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-3 ms-2">Secure Cipher</label>
                                    <input
                                        type="password"
                                        className="form-control py-6 italic text-sm bg-white/5 border-white/5"
                                        placeholder="••••••••"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                    />
                                    {errors.password && <div className="text-rose-500 text-[10px] font-black mt-2 uppercase italic tracking-widest ms-2">{errors.password}</div>}
                                </div>
                                <div className="form-group">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-3 ms-2">Verify Cipher</label>
                                    <input
                                        type="password"
                                        className="form-control py-6 italic text-sm bg-white/5 border-white/5"
                                        placeholder="••••••••"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {data.role === 'customer' && !isSubdomain && (
                                <div className="form-group animate-fade-in">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-3 ms-2 text-gradient">Select Preferred Arena Ground</label>
                                    <select 
                                        className="form-control py-6 italic text-sm bg-white/5 border-white/5"
                                        value={data.tenant_id}
                                        onChange={e => setData('tenant_id', e.target.value)}
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

                            {data.role === 'owner' && !isSubdomain && (
                                <div className="form-group animate-fade-in">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-3 ms-2 text-gradient">Select Your Operations Plan</label>
                                    <select 
                                        className="form-control py-6 italic text-sm bg-white/5 border-white/5"
                                        value={data.plan_id}
                                        onChange={e => setData('plan_id', e.target.value)}
                                        required
                                    >
                                        <option value="">-- Choose Scaling Tier --</option>
                                        {plans.map(p => (
                                            <option key={p.id} value={p.id}>{p.display_name} - ₹{p.price_monthly}/mo</option>
                                        ))}
                                    </select>
                                    <p className="mt-4 text-[8px] font-bold text-slate-600 uppercase tracking-widest ms-2 italic">Select the plan that fits your arena scale. You can upgrade later.</p>
                                </div>
                            )}
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={processing}
                                className={`w-full py-8 rounded-[2.5rem] font-black uppercase italic tracking-[0.3em] text-[11px] transition-all shadow-2xl ${isSubdomain ? 'bg-blue-500 text-white hover:bg-blue-400 shadow-blue-500/20' : 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-emerald-500/20'}`}
                            >
                                {processing ? 'COMMENCING DEPLOYMENT...' : `INITIALIZE ${isSubdomain ? 'ATHLETE' : 'OWNER'} REGISTRATION →`}
                            </button>
                        </div>

                        <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-700 italic">
                            Already registered? <Link href={route('login')} className="text-white hover:underline ms-1">Sign In Now</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}


