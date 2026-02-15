import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, GraduationCap, Building2 } from 'lucide-react';
import { AdminCrudService, type Teacher, type School } from '@/services/AdminCrudService';

export default function TeachersManager() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [schools, setSchools] = useState<School[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        setIsLoading(true);
        const [teacherData, schoolData] = await Promise.all([
            AdminCrudService.listTeachers(),
            AdminCrudService.listSchools(),
        ]);
        setTeachers(teacherData);
        setSchools(schoolData);
        setIsLoading(false);
    };

    const handleSave = async (teacher: Omit<Teacher, 'id' | 'created_at' | 'updated_at' | 'school_name'>) => {
        if (editingTeacher) {
            await AdminCrudService.updateTeacher(editingTeacher.id, teacher);
        } else {
            await AdminCrudService.createTeacher(teacher);
        }
        setShowForm(false);
        setEditingTeacher(null);
        await loadData();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este professor?')) return;
        await AdminCrudService.deleteTeacher(id);
        await loadData();
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-white">Professores</h3>
                    <p className="text-sm text-white/40">Gerencie os professores vinculados à plataforma.</p>
                </div>
                <button
                    onClick={() => { setEditingTeacher(null); setShowForm(true); }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple/20 hover:bg-purple/30 text-purple-light font-medium text-sm transition-all border border-purple/20"
                >
                    <Plus className="w-4 h-4" />
                    Novo Professor
                </button>
            </div>

            {isLoading ? (
                <div className="py-12 text-center text-white/40 text-sm">Carregando professores...</div>
            ) : teachers.length === 0 ? (
                <div className="py-12 text-center text-white/40 text-sm">Nenhum professor cadastrado.</div>
            ) : (
                <div className="space-y-2">
                    {teachers.map(teacher => (
                        <motion.div
                            key={teacher.id}
                            layout
                            className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5"
                        >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                                    <GraduationCap className="w-5 h-5 text-green-400" />
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-medium text-white text-sm truncate">{teacher.full_name}</h4>
                                        {teacher.coupon_code && (
                                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple/20 text-purple-light border border-purple/20">
                                                CUPOM: {teacher.coupon_code}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-white/40 mt-0.5">
                                        <span>{teacher.email}</span>
                                        {teacher.subject && (
                                            <span className="px-1.5 py-0.5 rounded bg-white/5 text-white/50">{teacher.subject}</span>
                                        )}
                                        {teacher.school_name && (
                                            <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{teacher.school_name}</span>
                                        )}
                                        {teacher.commission_rate && (
                                            <span className="text-green-400">Comissão: {teacher.commission_rate}%</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-1 shrink-0">
                                <button onClick={() => { setEditingTeacher(teacher); setShowForm(true); }} className="p-1.5 rounded-lg hover:bg-white/10">
                                    <Pencil className="w-3.5 h-3.5 text-white/40" />
                                </button>
                                <button onClick={() => handleDelete(teacher.id)} className="p-1.5 rounded-lg hover:bg-red-400/10">
                                    <Trash2 className="w-3.5 h-3.5 text-red-400/50" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {showForm && (
                    <TeacherFormModal
                        teacher={editingTeacher}
                        schools={schools}
                        onSave={handleSave}
                        onClose={() => { setShowForm(false); setEditingTeacher(null); }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function TeacherFormModal({ teacher, schools, onSave, onClose }: {
    teacher: Teacher | null;
    schools: School[];
    onSave: (data: Omit<Teacher, 'id' | 'created_at' | 'updated_at' | 'school_name'>) => void;
    onClose: () => void;
}) {
    const [form, setForm] = useState({
        full_name: teacher?.full_name || '',
        email: teacher?.email || '',
        subject: teacher?.subject || '',
        school_id: teacher?.school_id || null as string | null,
        coupon_code: teacher?.coupon_code || '',
        commission_rate: teacher?.commission_rate || 0,
        is_active: teacher?.is_active ?? true,
    });

    const subjects = ['Matemática', 'Redação', 'Linguagens', 'Ciências Humanas', 'Ciências da Natureza', 'Física', 'Química', 'Biologia', 'História', 'Geografia', 'Filosofia', 'Sociologia'];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="w-full max-w-md bg-dark-surface rounded-2xl border border-white/10 overflow-hidden"
            >
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <h3 className="font-semibold text-white">{teacher ? 'Editar Professor' : 'Novo Professor'}</h3>
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10"><X className="w-5 h-5 text-white/50" /></button>
                </div>

                <div className="p-5 space-y-4">
                    <div>
                        <label className="block text-xs text-white/50 mb-1 uppercase">Nome Completo</label>
                        <input value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple/50" />
                    </div>
                    <div>
                        <label className="block text-xs text-white/50 mb-1 uppercase">E-mail</label>
                        <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple/50" />
                    </div>
                    <div>
                        <label className="block text-xs text-white/50 mb-1 uppercase">Disciplina</label>
                        <select value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple/50">
                            <option value="" className="bg-dark-surface">Selecione...</option>
                            {subjects.map(s => <option key={s} value={s} className="bg-dark-surface">{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-white/50 mb-1 uppercase">Escola</label>
                        <select value={form.school_id ?? ''} onChange={e => setForm(p => ({ ...p, school_id: e.target.value || null }))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple/50">
                            <option value="" className="bg-dark-surface">Sem vínculo</option>
                            {schools.map(s => <option key={s.id} value={s.id} className="bg-dark-surface">{s.name}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs text-white/50 mb-1 uppercase">Código do Cupom</label>
                            <input value={form.coupon_code} onChange={e => setForm(p => ({ ...p, coupon_code: e.target.value.toUpperCase() }))}
                                placeholder="EX: PROFJUAN"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple/50" />
                        </div>
                        <div>
                            <label className="block text-xs text-white/50 mb-1 uppercase">Comissão (%)</label>
                            <input type="number" min={0} max={100} value={form.commission_rate} onChange={e => setForm(p => ({ ...p, commission_rate: parseFloat(e.target.value) || 0 }))}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple/50" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" checked={form.is_active} onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))} id="teacher-active" className="rounded" />
                        <label htmlFor="teacher-active" className="text-sm text-white/60">Professor ativo</label>
                    </div>
                </div>

                <div className="flex gap-3 p-4 border-t border-white/10">
                    <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 text-white/60 text-sm font-medium hover:bg-white/10">Cancelar</button>
                    <button onClick={() => onSave(form)} className="flex-1 px-4 py-2.5 rounded-xl bg-purple hover:bg-purple-light text-white text-sm font-semibold">Salvar</button>
                </div>
            </motion.div>
        </motion.div>
    );
}
