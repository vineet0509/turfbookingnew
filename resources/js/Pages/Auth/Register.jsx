import { Head, Link, useForm } from '@inertiajs/react';

export default function Register({ isSubdomain, tenant }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const themeColor = isSubdomain ? 'blue' : 'emerald';
    const roleTitle = isSubdomain ? 'Athlete Identity' : 'Arena Ownership';
    const subTitle = isSubdomain ? `Join ${tenant?.name} Network` : 'Join the #1 arena management ecosystem';

    return (
        <div className="min-h-screen bg-[#0a0f16] flex items-center justify-center p-6 selection:bg-emerald-500 selection:text-black">
            <Head title={isSubdomain ? `Join ${tenant?.name}` : "Join TurfBook"} />
            
            <div className={`absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(${isSubdomain ? '59,130,246' : '16,185,129'},0.05)_0%,transparent_50%)] pointer-events-none`}></div>
            
            <div className="w-full max-w-2xl">
                <div className="text-center mb-12">
                    <div className="flex justify-center items-center gap-3 mb-6">
                        <span className="text-4xl">{isSubdomain ? '🏃' : '🏟️'}</span>
                        <span className="text-3xl font-black uppercase tracking-tighter italic text-white">
                            {isSubdomain ? tenant?.name : 'Turf'}<span className={isSubdomain ? 'text-blue-500' : 'text-emerald-500'}>{isSubdomain ? '' : 'Book'}</span>
                        </span>
                    </div>
                    <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white mb-3">Initialize {roleTitle}</h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 italic">{subTitle}</p>
                </div>

                <div className="glass-panel p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 text-8xl opacity-5 font-black italic tracking-tighter uppercase leading-none">JOIN</div>
                    
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


