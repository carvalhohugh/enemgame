import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAuthProfile } from '@/context/AuthProfileContext';
// import { MobileNav } from './MobileNav'; // Todo: Implement MobileNav

export default function RootLayout() {
    const { profile } = useAuthProfile();

    if (!profile) {
        return <div className="min-h-screen bg-dark flex items-center justify-center text-white">Carregando perfil...</div>;
    }

    return (
        <div className="min-h-screen bg-dark text-white font-inter">
            {/* Sidebar for Desktop */}
            <div className="hidden lg:block">
                <Sidebar />
            </div>

            {/* Main Content */}
            <main className="lg:pl-64 min-h-screen transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Outlet />
                </div>
            </main>

            {/* Mobile Nav would go here */}
        </div>
    );
}
