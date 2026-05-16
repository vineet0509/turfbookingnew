import { Head, Link } from '@inertiajs/react';

export default function BookingSuccess({ tenant, booking }) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 sm:px-6 lg:px-8">
            <Head title={`Booking Confirmed - ${tenant.name}`} />

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
                    
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
                    <p className="text-gray-500 mb-6">Your booking reference is <span className="font-bold text-indigo-600">{booking.booking_ref}</span></p>
                    
                    <div className="text-left bg-gray-50 p-4 rounded-md mb-6 border border-gray-200">
                        <h3 className="font-semibold text-gray-800 mb-3 border-b pb-2">Booking Details</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                            <p><span className="font-medium text-gray-900">Name:</span> {booking.customer_name}</p>
                            <p><span className="font-medium text-gray-900">Turf:</span> {booking.turf.name}</p>
                            <p><span className="font-medium text-gray-900">Date:</span> {booking.slot.date}</p>
                            <p><span className="font-medium text-gray-900">Time:</span> {booking.slot.start_time.substring(0, 5)} - {booking.slot.end_time.substring(0, 5)}</p>
                            <p><span className="font-medium text-gray-900">Amount Paid:</span> ₹{booking.total_amount}</p>
                        </div>
                    </div>

                    <Link href={route('tenant.home', tenant.subdomain)} className="text-indigo-600 hover:text-indigo-500 font-medium">
                        &larr; Return to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
