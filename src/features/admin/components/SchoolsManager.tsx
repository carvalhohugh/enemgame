import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Building2, MapPin, Mail, Phone } from 'lucide-react';
import { AdminCrudService, type School } from '@/services/AdminCrudService';

export default function SchoolsManager() {
    const [schools, setSchools] = useState<School[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingSchool, setEditingSchool] = useState<School | null>(null);

    useEffect(() => { loadSchools(); }, []);

    const loadSchools = async () => {
        setIsLoading(true);
        const data = await AdminCrudService.listSchools();
        setSchools(data);
        setIsLoading(false);
    };

    const handleSave = async (school: Omit<School, 'id' | 'created_at' | 'updated_at'>) => {
        if (editingSchool) {
            await AdminCrudService.updateSchool(editingSchool.id, school);
        } else {
            await AdminCrudService.createSchool(school);
        }
        setShowForm(false);
        setEditingSchool(null);
        await loadSchools();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir esta escola?')) return;
        await AdminCrudService.deleteSchool(id);
        await loadSchools();
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-white">Escolas</h3>
                    <p className="text-sm text-white/40">Gerencie as escolas parceiras da plataforma.</p>
                </div>
                <button
                    onClick={() => { setEditingSchool(null); setShowForm(true); }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple/20 hover:bg-purple/30 text-purple-light font-medium text-sm transition-all border border-purple/20"
                >
                    <Plus className="w-4 h-4" />
                    Nova Escola
                </button>
            </div>

            {isLoading ? (
                <div className="py-12 text-center text-white/40 text-sm">Carregando escolas...</div>
            ) : schools.length === 0 ? (
                <div className="py-12 text-center text-white/40 text-sm">Nenhuma escola cadastrada.</div>
            ) : (
                <div className="space-y-2">
                    {schools.map(school => (
                        <motion.div
                            key={school.id}
                            layout
                            className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5"
                        >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                                    <Building2 className="w-5 h-5 text-blue-400" />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="font-medium text-white text-sm truncate">{school.name}</h4>
                                    <div className="flex items-center gap-3 text-xs text-white/40 mt-0.5">
                                        {school.city && (
                                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{school.city}/{school.state}</span>
                                        )}
                                        {school.contact_email && (
                                            <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{school.contact_email}</span>
                                        )}
                                        {school.contact_phone && (
                                            <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{school.contact_phone}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-1 shrink-0">
                                <button onClick={() => { setEditingSchool(school); setShowForm(true); }} className="p-1.5 rounded-lg hover:bg-white/10">
                                    <Pencil className="w-3.5 h-3.5 text-white/40" />
                                </button>
                                <button onClick={() => handleDelete(school.id)} className="p-1.5 rounded-lg hover:bg-red-400/10">
                                    <Trash2 className="w-3.5 h-3.5 text-red-400/50" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {showForm && (
                    <SchoolFormModal
                        school={editingSchool}
                        onSave={handleSave}
                        onClose={() => { setShowForm(false); setEditingSchool(null); }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function SchoolFormModal({ school, onSave, onClose }: {
    school: School | null;
    onSave: (data: Omit<School, 'id' | 'created_at' | 'updated_at'>) => void;
    onClose: () => void;
}) {
    const [form, setForm] = useState({
        name: school?.name || '',
        cnpj: school?.cnpj || '',
        city: school?.city || '',
        state: school?.state || '',
        contact_email: school?.contact_email || '',
        contact_phone: school?.contact_phone || '',
        is_active: school?.is_active ?? true,
    });

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
                    <h3 className="font-semibold text-white">{school ? 'Editar Escola' : 'Nova Escola'}</h3>
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10"><X className="w-5 h-5 text-white/50" /></button>
                </div>

                <div className="p-5 space-y-4">
                    <div>
                        <label className="block text-xs text-white/50 mb-1 uppercase">Nome da Escola</label>
                        <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple/50" />
                    </div>
                    <div>
                        <label className="block text-xs text-white/50 mb-1 uppercase">CNPJ</label>
                        <input value={form.cnpj} onChange={e => setForm(p => ({ ...p, cnpj: e.target.value }))}
                            placeholder="00.000.000/0000-00"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple/50" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs text-white/50 mb-1 uppercase">Cidade</label>
                            <input value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple/50" />
                        </div>
                        <div>
                            <label className="block text-xs text-white/50 mb-1 uppercase">Estado</label>
                            <input value={form.state} onChange={e => setForm(p => ({ ...p, state: e.target.value }))}
                                placeholder="GO"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple/50" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-white/50 mb-1 uppercase">E-mail de Contato</label>
                        <input type="email" value={form.contact_email} onChange={e => setForm(p => ({ ...p, contact_email: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple/50" />
                    </div>
                    <div>
                        <label className="block text-xs text-white/50 mb-1 uppercase">Telefone</label>
                        <input value={form.contact_phone} onChange={e => setForm(p => ({ ...p, contact_phone: e.target.value }))}
                            placeholder="(00) 0000-0000"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple/50" />
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" checked={form.is_active} onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))} id="school-active" className="rounded" />
                        <label htmlFor="school-active" className="text-sm text-white/60">Escola ativa</label>
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
