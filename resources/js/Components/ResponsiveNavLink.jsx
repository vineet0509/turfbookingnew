import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`flex w-full items-start border-l-4 py-2 pe-4 ps-3 ${
                active
                    ? 'border-emerald-400 bg-emerald-400/10 text-emerald-400 focus:border-emerald-300 focus:bg-emerald-400/20 focus:text-emerald-300'
                    : 'border-transparent text-slate-400 hover:border-slate-700 hover:bg-white/5 hover:text-slate-100 focus:border-slate-700 focus:bg-white/5 focus:text-slate-100'
            } text-base font-medium transition duration-150 ease-in-out focus:outline-none ${className}`}
        >
            {children}
        </Link>
    );
}
