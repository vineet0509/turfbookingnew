import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-[#f6f8fb] pt-6 sm:justify-center sm:pt-0 selection:bg-[#0f172a]/10 relative overflow-hidden bg-mesh">
            {/* Mesh gradient glow orbs */}
            <div className="glow-orb orb-1"></div>
            <div className="glow-orb orb-2"></div>
            <div className="glow-orb orb-3"></div>

            <div className="animate-fade-in z-10">
                <Link href="/" className="flex items-center gap-4 group">
                    <span className="text-5xl">🏟️</span>
                    <span className="text-4xl font-black uppercase tracking-tighter italic text-[var(--text-primary)]">
                        Turf<span className="text-gradient">Book</span>
                    </span>
                </Link>
            </div>

            <div className="mt-12 w-full modal-box max-w-md animate-slide-up z-10">
                {children}
            </div>
        </div>
    );
}
