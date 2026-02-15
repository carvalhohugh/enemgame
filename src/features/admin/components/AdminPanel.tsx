import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, CreditCard, Building2, GraduationCap, LayoutDashboard, UserPlus } from 'lucide-react';
import { useAuthProfile } from '@/context/AuthProfileContext';
import AdminDashboardSection from './AdminDashboardSection';
import PlansManager from './PlansManager';
import SchoolsManager from './SchoolsManager';
import TeachersManager from './TeachersManager';
import StudentRegistrationForm from './StudentRegistrationForm';

type AdminTab = 'dashboard' | 'plans' | 'schools' | 'teachers' | 'students';

const TABS: { id: AdminTab; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'plans', label: 'Planos', icon: CreditCard },
    { id: 'schools', label: 'Escolas', icon: Building2 },
    { id: 'teachers', label: 'Professores', icon: GraduationCap },
    { id: 'students', label: 'Matrícula', icon: UserPlus },
];

export default function AdminPanel() {
    const { profile } = useAuthProfile();
    const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

    if (!profile.isAdmin) {
        return null;
    }

    return (
        <section className="relative py-10 overflow-hidden">
            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/15 px-4 py-2">
                        <ShieldCheck className="h-4 w-4 text-gold" />
                        <span className="text-sm font-medium text-gold">Painel Administrativo</span>
                    </div>
                    <h2 className="mt-4 font-poppins text-3xl font-bold text-white sm:text-4xl">
                        Gestão Educacional
                    </h2>
                    <p className="mt-2 max-w-2xl text-white/50 text-sm">
                        Gerencie planos, escolas, professores e alunos da plataforma.
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="mb-6 flex flex-wrap gap-1 rounded-xl bg-white/5 p-1 border border-white/5">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                                ? 'text-white'
                                : 'text-white/40 hover:text-white/70'
                                }`}
                        >
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="admin-tab"
                                    className="absolute inset-0 bg-white/10 rounded-lg border border-white/10"
                                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                />
                            )}
                            <tab.icon className="w-4 h-4 relative z-10" />
                            <span className="relative z-10 hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'dashboard' && <AdminDashboardSection />}
                    {activeTab === 'plans' && <PlansManager />}
                    {activeTab === 'schools' && <SchoolsManager />}
                    {activeTab === 'teachers' && <TeachersManager />}
                    {activeTab === 'students' && <StudentRegistrationForm />}
                </motion.div>
            </div>
        </section>
    );
}
