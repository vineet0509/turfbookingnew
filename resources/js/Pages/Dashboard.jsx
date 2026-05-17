import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePage } from '@inertiajs/react';

export default function Dashboard() {
    const { props } = usePage();
    const navigate = useNavigate();
    const user = props.auth.user;

    useEffect(() => {
        if (user) {
            if (user.role === 'super_admin') {
                navigate('/admin/dashboard', { replace: true });
            } else if (user.role === 'owner') {
                navigate('/owner/dashboard', { replace: true });
            } else {
                navigate('/customer/dashboard', { replace: true });
            }
        }
    }, [user, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#0a0f16]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
    );
}
