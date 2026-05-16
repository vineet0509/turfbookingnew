import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function SetupTenant() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        subdomain: '',
        city: '',
        phone: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('owner.setup'));
    };

    return (
        <AuthenticatedLayout header="Setup Your Arena">
            <Head title="Setup Business - TurfBook" />

            <div className="py-20 flex justify-center">
                <div className="w-full max-w-2xl animate-slide-up">
                    <div className="glass-card panel p-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full"></div>
                        
                        <div className="text-center mb-12">
                            <div className="text-5xl mb-6">🏟️</div>
                            <h2 className="text-3xl font-black uppercase tracking-tight italic text-white mb-3">Welcome to the Platform</h2>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Please complete your arena profile to get started.</p>
                        </div>

                        <form onSubmit={submit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-600 mb-3 ms-1">Business Name</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        placeholder="e.g. Green Arena" 
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        required
                                    />
                                    {errors.name && <div className="text-rose-500 text-[10px] font-black mt-2">{errors.name}</div>}
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-600 mb-3 ms-1">Subdomain</label>
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            className="form-control pr-32" 
                                            placeholder="green-arena"
                                            value={data.subdomain}
                                            onChange={e => setData('subdomain', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                                            required
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-700">.turfbook.com</span>
                                    </div>
                                    {errors.subdomain && <div className="text-rose-500 text-[10px] font-black mt-2">{errors.subdomain}</div>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-600 mb-3 ms-1">City</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        placeholder="e.g. Bangalore"
                                        value={data.city}
                                        onChange={e => setData('city', e.target.value)}
                                        required
                                    />
                                    {errors.city && <div className="text-rose-500 text-[10px] font-black mt-2">{errors.city}</div>}
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-600 mb-3 ms-1">Business Phone</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        placeholder="9876543210"
                                        value={data.phone}
                                        onChange={e => setData('phone', e.target.value)}
                                        required
                                    />
                                    {errors.phone && <div className="text-rose-500 text-[10px] font-black mt-2">{errors.phone}</div>}
                                </div>
                            </div>

                            <div className="pt-6">
                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="btn-premium w-full py-5 text-sm"
                                >
                                    {processing ? 'Processing...' : 'Launch My Arena Business →'}
                                </button>
                                <p className="text-center mt-6 text-[9px] font-black uppercase tracking-[0.2em] text-slate-700">
                                    By launching, you agree to our Platform Terms of Service.
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
