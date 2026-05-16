import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Billing({ plans, currentSubscription, tenant }) {
    const { data, setData, post, processing } = useForm({
        plan_id: '',
        billing_cycle: 'monthly',
        razorpay_payment_id: '',
    });

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
    }, []);

    const handleSubscribe = (plan, cycle) => {
        if (!window.Razorpay) {
            alert('Razorpay SDK failed to load.');
            return;
        }

        const amount = cycle === 'yearly' ? plan.price_yearly : plan.price_monthly;

        const options = {
            key: 'rzp_test_key',
            amount: parseInt(amount * 100),
            currency: 'INR',
            name: 'TurfBook SaaS',
            description: `Subscription to ${plan.display_name} (${cycle})`,
            handler: function (response) {
                setData({
                    plan_id: plan.id,
                    billing_cycle: cycle,
                    razorpay_payment_id: response.razorpay_payment_id,
                });
            },
            prefill: {
                name: tenant?.name || 'Owner',
                email: tenant?.email || 'owner@example.com',
            },
            theme: { color: '#10B981' },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    useEffect(() => {
        if (data.razorpay_payment_id) {
            post(route('owner.subscribe'));
        }
    }, [data.razorpay_payment_id]);

    return (
        <AuthenticatedLayout header="Billing & Subscriptions">
            <Head title="Billing" />

            <div className="py-12 space-y-12">
                {/* Current Subscription Status */}
                <div className="glass-card panel p-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full"></div>
                    <h3 className="text-xl font-black uppercase tracking-tight italic text-white mb-8">Current Subscription</h3>
                    {currentSubscription ? (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-[2rem] flex flex-col md:flex-row justify-between gap-10">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <span className="text-3xl">💎</span>
                                    <div>
                                        <h4 className="text-2xl font-black uppercase italic tracking-tight text-white">{currentSubscription.plan.display_name}</h4>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Active Membership</p>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Status</p>
                                    <p className="font-black text-white uppercase tracking-tighter italic">{currentSubscription.status}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Billing Cycle</p>
                                    <p className="font-black text-white uppercase tracking-tighter italic">{currentSubscription.billing_cycle}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Valid Until</p>
                                    <p className="font-black text-white uppercase tracking-tighter italic">{currentSubscription.end_date}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-rose-500/5 border border-rose-500/10 rounded-[2rem]">
                            <p className="text-rose-400 font-bold">You do not have an active subscription. Please select a plan below to activate your account features.</p>
                        </div>
                    )}
                </div>

                {/* Available Plans */}
                <div>
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-4">Choose Your <span className="text-gradient">Plan</span></h2>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Scale your sports business with professional tools</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {plans.map(plan => (
                            <div key={plan.id} className={`pricing-card ${plan.display_name === 'Pro Arena' ? 'popular' : ''}`}>
                                {plan.display_name === 'Pro Arena' && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-full">Recommended</div>
                                )}
                                <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-2">{plan.display_name}</h3>
                                <div className="price text-gradient"><span>₹</span>{plan.price_monthly}<span>/mo</span></div>
                                
                                <ul className="space-y-4 my-10 flex-1">
                                    <li className="flex items-center gap-3 text-sm font-bold text-slate-400">
                                        <span className="text-emerald-500">✅</span> Max Turfs: {plan.max_turfs}
                                    </li>
                                    <li className="flex items-center gap-3 text-sm font-bold text-slate-400">
                                        <span className="text-emerald-500">✅</span> {plan.max_bookings_per_month === -1 ? 'Unlimited' : plan.max_bookings_per_month} Bookings / mo
                                    </li>
                                    {plan.features?.map((feature, idx) => (
                                        <li key={idx} className="flex items-center gap-3 text-sm font-bold text-slate-400">
                                            <span className="text-emerald-500">✅</span> {feature}
                                        </li>
                                    ))}
                                </ul>

                                <div className="grid gap-4 pt-6 mt-auto">
                                    <button 
                                        onClick={() => handleSubscribe(plan, 'monthly')}
                                        disabled={processing}
                                        className="btn btn-primary w-full py-4 text-[10px]"
                                    >
                                        Subscribe Monthly
                                    </button>
                                    <button 
                                        onClick={() => handleSubscribe(plan, 'yearly')}
                                        disabled={processing}
                                        className="btn btn-outline w-full py-4 text-[10px]"
                                    >
                                        Subscribe Yearly (₹{plan.price_yearly})
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
