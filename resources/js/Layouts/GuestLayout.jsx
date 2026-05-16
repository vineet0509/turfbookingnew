import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-[#0a0f16] pt-6 sm:justify-center sm:pt-0 selection:bg-emerald-500">
            <div className="animate-fade-in">
                <Link href="/" className="flex items-center gap-4 group">
                    <span className="text-5xl">🏟️</span>
                    <span className="text-4xl font-black uppercase tracking-tighter italic text-white">
                        Turf<span className="text-gradient">Book</span>
                    </span>
                </Link>
            </div>

            <div className="mt-12 w-full modal-box max-w-md animate-slide-up">
                {children}
            </div>
        </div>
    );
}
