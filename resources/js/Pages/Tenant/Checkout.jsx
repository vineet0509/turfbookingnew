import { Head, useForm, router } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Checkout({ tenant, slot, razorpayOrder, razorpayKeyId }) {
    const { data, setData, post, processing, errors } = useForm({
        customer_name: '',
        customer_phone: '',
        customer_email: '',
        razorpay_payment_id: '',
        razorpay_order_id: '',
        razorpay_signature: '',
    });

    useEffect(() => {
        // Load Razorpay script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
    }, []);

    const submit = (e) => {
        e.preventDefault();
        
        if (!window.Razorpay) {
            alert('Razorpay SDK failed to load. Are you online?');
            return;
        }

        const options = {
            key: razorpayKeyId,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            name: tenant.name,
            description: `Booking for ${slot.turf.name}`,
            image: tenant.logo || '',
            order_id: razorpayOrder.id,
            handler: function (response) {
                router.post(route('tenant.book', { subdomain: tenant.subdomain, slot: slot.id }), {
                    ...data,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature,
                });
            },
            prefill: {
                name: data.customer_name,
                email: data.customer_email,
                contact: data.customer_phone,
            },
            theme: {
                color: tenant.primary_color || '#10B981',
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
            alert(response.error.description);
        });
        rzp.open();
    };

    return (
        <div className="min-h-screen bg-[#0a0f16] text-white flex flex-col items-center py-20 sm:px-6 lg:px-8">
            <Head title={`Checkout - ${tenant.name}`} />

            <div className="sm:mx-auto sm:w-full sm:max-w-md animate-fade-in">
                <h2 className="text-center text-4xl font-black tracking-tight text-white uppercase italic">
                    Checkout
                </h2>
                <p className="mt-2 text-center text-sm font-bold uppercase tracking-widest text-slate-500">
                    {tenant.name} <span className="mx-2">•</span> {slot.turf.name}
                </p>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 py-10 px-6 shadow-2xl sm:rounded-3xl sm:px-10 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1" style={{ background: `linear-gradient(to right, ${tenant.primary_color || '#10B981'}, #3B82F6)` }} />
                    
                    <div className="mb-8 p-6 bg-black/30 rounded-2xl border border-white/5 shadow-inner">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Date</span>
                            <span className="font-extrabold text-white">{slot.date}</span>
                        </div>
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Time Slot</span>
                            <span className="font-extrabold text-white">{slot.start_time.substring(0, 5)} - {slot.end_time.substring(0, 5)}</span>
                        </div>
                        <div className="flex justify-between items-center border-t border-white/5 pt-4">
                            <span className="text-white font-black uppercase tracking-tighter text-lg">Total</span>
                            <span className="font-black text-emerald-400 text-3xl tracking-tighter">₹{slot.price}</span>
                        </div>
                    </div>

                    <form className="space-y-6" onSubmit={submit}>
                        <div>
                            <label htmlFor="name" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 ms-1">Full Name</label>
                            <input id="name" type="text" required value={data.customer_name} onChange={e => setData('customer_name', e.target.value)}
                                className="form-control" placeholder="John Doe" />
                            {errors.customer_name && <p className="mt-1 text-xs font-bold text-rose-500">{errors.customer_name}</p>}
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 ms-1">Phone Number</label>
                            <input id="phone" type="text" required value={data.customer_phone} onChange={e => setData('customer_phone', e.target.value)}
                                className="form-control" placeholder="+91 98765 43210" />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 ms-1">Email Address</label>
                            <input id="email" type="email" required value={data.customer_email} onChange={e => setData('customer_email', e.target.value)}
                                className="form-control" placeholder="john@example.com" />
                        </div>

                        <div className="pt-4">
                            <button type="submit" disabled={processing}
                                className="btn-premium w-full py-4 text-lg">
                                {processing ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Processing...
                                    </span>
                                ) : `Secure Pay ₹${slot.price}`}
                            </button>
                            <p className="text-[10px] text-center mt-4 text-slate-500 font-bold uppercase tracking-widest">
                                🔒 Secure Payment via Razorpay
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
