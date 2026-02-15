import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Building2, GraduationCap, CreditCard, Search, Loader2 } from 'lucide-react';
import { AdminCrudService, type Plan, type School, type Teacher } from '@/services/AdminCrudService';
import { fetchAdminDashboardPayload, type StudentAdminRecord } from '@/services/adminApi';

export default function StudentRegistrationForm() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [schools, setSchools] = useState<School[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [students, setStudents] = useState<StudentAdminRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [saving, setSaving] = useState<string | null>(null);
    const [message, setMessage] = useState('');

    useEffect(() => { loadAll(); }, []);

    const loadAll = async () => {
        setIsLoading(true);
        const [planData, schoolData, teacherData, dashData] = await Promise.all([
            AdminCrudService.listPlans(),
            AdminCrudService.listSchools(),
            AdminCrudService.listTeachers(),
            fetchAdminDashboardPayload().catch(() => ({ students: [], availableYears: [] })),
        ]);
        setPlans(planData);
        setSchools(schoolData);
        setTeachers(teacherData);
        setStudents(dashData.students.filter(s => s.role === 'student'));
        setIsLoading(false);
    };

    const filteredStudents = students.filter(s =>
        !search.trim() ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase())
    );

    const handleEnroll = async (studentId: string, field: string, value: string | null) => {
        setSaving(studentId);
        try {
            const student = students.find(s => s.userId === studentId);
            if (!student) return;
            await AdminCrudService.enrollStudent({
                userId: studentId,
                fullName: student.name,
                email: student.email,
                planId: field === 'plan' ? value : null,
                schoolId: field === 'school' ? value : null,
                teacherId: field === 'teacher' ? value : null,
            });
            setMessage(`Aluno ${student.name} atualizado com sucesso!`);
            setTimeout(() => setMessage(''), 3000);
        } finally {
            setSaving(null);
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-lg font-bold text-white">Matrícula de Alunos</h3>
                <p className="text-sm text-white/40">Atribua planos, escolas e professores aos alunos cadastrados.</p>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-white/30 pointer-events-none" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar aluno por nome ou e-mail..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple/50"
                />
            </div>

            {/* Message */}
            {message && (
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-green-400 bg-green-400/10 rounded-xl px-4 py-2.5 border border-green-400/20"
                >
                    {message}
                </motion.div>
            )}

            {isLoading ? (
                <div className="py-12 text-center text-white/40 text-sm">Carregando alunos...</div>
            ) : filteredStudents.length === 0 ? (
                <div className="py-12 text-center text-white/40 text-sm">Nenhum aluno encontrado.</div>
            ) : (
                <div className="space-y-2">
                    {filteredStudents.map(student => (
                        <div
                            key={student.userId}
                            className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-3"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-purple/10 flex items-center justify-center shrink-0">
                                    <UserPlus className="w-4 h-4 text-purple-light" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="font-medium text-white text-sm truncate">{student.name}</h4>
                                    <p className="text-xs text-white/40 truncate">{student.email}</p>
                                </div>
                                {saving === student.userId && (
                                    <Loader2 className="w-4 h-4 animate-spin text-purple-light shrink-0" />
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                {/* Plan */}
                                <div>
                                    <label className="flex items-center gap-1 text-[10px] text-white/30 uppercase mb-1">
                                        <CreditCard className="w-3 h-3" /> Plano
                                    </label>
                                    <select
                                        defaultValue=""
                                        onChange={(e) => handleEnroll(student.userId, 'plan', e.target.value || null)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-purple/50"
                                    >
                                        <option value="" className="bg-dark-surface">Sem plano</option>
                                        {plans.filter(p => p.is_active).map(p => (
                                            <option key={p.id} value={p.id} className="bg-dark-surface">{p.name} — R$ {p.price.toFixed(2)}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* School */}
                                <div>
                                    <label className="flex items-center gap-1 text-[10px] text-white/30 uppercase mb-1">
                                        <Building2 className="w-3 h-3" /> Escola
                                    </label>
                                    <select
                                        defaultValue=""
                                        onChange={(e) => handleEnroll(student.userId, 'school', e.target.value || null)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-purple/50"
                                    >
                                        <option value="" className="bg-dark-surface">Sem escola</option>
                                        {schools.filter(s => s.is_active).map(s => (
                                            <option key={s.id} value={s.id} className="bg-dark-surface">{s.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Teacher */}
                                <div>
                                    <label className="flex items-center gap-1 text-[10px] text-white/30 uppercase mb-1">
                                        <GraduationCap className="w-3 h-3" /> Professor
                                    </label>
                                    <select
                                        defaultValue=""
                                        onChange={(e) => handleEnroll(student.userId, 'teacher', e.target.value || null)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-purple/50"
                                    >
                                        <option value="" className="bg-dark-surface">Sem professor</option>
                                        {teachers.filter(t => t.is_active).map(t => (
                                            <option key={t.id} value={t.id} className="bg-dark-surface">{t.full_name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
