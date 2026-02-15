import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, DollarSign, Clock, Users } from 'lucide-react';
import { AdminCrudService, type Plan } from '@/services/AdminCrudService';

export default function PlansManager() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

    useEffect(() => {
        loadPlans();
    }, []);

    const loadPlans = async () => {
        setIsLoading(true);
        const data = await AdminCrudService.listPlans();
        setPlans(data);
        setIsLoading(false);
    };

    const handleSave = async (plan: Omit<Plan, 'id' | 'created_at' | 'updated_at'>) => {
        if (editingPlan) {
            await AdminCrudService.updatePlan(editingPlan.id, plan);
        } else {
            await AdminCrudService.createPlan(plan);
        }
        setShowForm(false);
        setEditingPlan(null);
        await loadPlans();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este plano?')) return;
        await AdminCrudService.deletePlan(id);
        await loadPlans();
    };

    const openEdit = (plan: Plan) => {
        setEditingPlan(plan);
        setShowForm(true);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-white">Planos</h3>
                    <p className="text-sm text-white/40">Gerencie os planos de assinatura da plataforma.</p>
                </div>
                <button
                    onClick={() => { setEditingPlan(null); setShowForm(true); }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple/20 hover:bg-purple/30 text-purple-light font-medium text-sm transition-all border border-purple/20"
                >
                    <Plus className="w-4 h-4" />
                    Novo Plano
                </button>
            </div>

            {isLoading ? (
                <div className="py-12 text-center text-white/40 text-sm">Carregando planos...</div>
            ) : plans.length === 0 ? (
                <div className="py-12 text-center text-white/40 text-sm">Nenhum plano cadastrado.</div>
            ) : (
                <div className="grid gap-3 md:grid-cols-2">
                    {plans.map(plan => (
                        <motion.div
                            key={plan.id}
                            layout
                            className="bg-white/5 rounded-xl border border-white/5 p-4 space-y-3"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <h4 className="font-semibold text-white">{plan.name}</h4>
                                    <p className="text-xs text-white/40 mt-0.5">{plan.description}</p>
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={() => openEdit(plan)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                                        <Pencil className="w-3.5 h-3.5 text-white/40" />
                                    </button>
                                    <button onClick={() => handleDelete(plan.id)} className="p-1.5 rounded-lg hover:bg-red-400/10 transition-colors">
                                        <Trash2 className="w-3.5 h-3.5 text-red-400/50" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-xs text-white/50">
                                <span className="flex items-center gap-1">
                                    <DollarSign className="w-3 h-3" />
                                    R$ {plan.price.toFixed(2)}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {plan.duration_months} {plan.duration_months === 1 ? 'mês' : 'meses'}
                                </span>
                                {plan.max_students && (
                                    <span className="flex items-center gap-1">
                                        <Users className="w-3 h-3" />
                                        {plan.max_students} alunos
                                    </span>
                                )}
                            </div>

                            {plan.features.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                    {plan.features.map((f, i) => (
                                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/40">{f}</span>
                                    ))}
                                </div>
                            )}

                            <div className="flex items-center gap-2">
                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${plan.is_active ? 'bg-green-500/10 text-green-400' : 'bg-red-400/10 text-red-400'}`}>
                                    {plan.is_active ? 'Ativo' : 'Inativo'}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Form Modal */}
            <AnimatePresence>
                {showForm && (
                    <PlanFormModal
                        plan={editingPlan}
                        onSave={handleSave}
                        onClose={() => { setShowForm(false); setEditingPlan(null); }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function PlanFormModal({ plan, onSave, onClose }: {
    plan: Plan | null;
    onSave: (data: Omit<Plan, 'id' | 'created_at' | 'updated_at'>) => void;
    onClose: () => void;
}) {
    const [form, setForm] = useState({
        name: plan?.name || '',
        description: plan?.description || '',
        price: plan?.price || 0,
        duration_months: plan?.duration_months || 1,
        max_students: plan?.max_students || null as number | null,
        features: plan?.features || [] as string[],
        is_active: plan?.is_active ?? true,
    });
    const [newFeature, setNewFeature] = useState('');

    const addFeature = () => {
        if (!newFeature.trim()) return;
        setForm(prev => ({ ...prev, features: [...prev.features, newFeature.trim()] }));
        setNewFeature('');
    };

    const removeFeature = (i: number) => {
        setForm(prev => ({ ...prev, features: prev.features.filter((_, idx) => idx !== i) }));
    };

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
                    <h3 className="font-semibold text-white">{plan ? 'Editar Plano' : 'Novo Plano'}</h3>
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10"><X className="w-5 h-5 text-white/50" /></button>
                </div>

                <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
                    <div>
                        <label className="block text-xs text-white/50 mb-1 uppercase">Nome</label>
                        <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple/50" />
                    </div>
                    <div>
                        <label className="block text-xs text-white/50 mb-1 uppercase">Descrição</label>
                        <input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple/50" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs text-white/50 mb-1 uppercase">Preço (R$)</label>
                            <input type="number" min={0} step={0.01} value={form.price} onChange={e => setForm(p => ({ ...p, price: parseFloat(e.target.value) || 0 }))}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple/50" />
                        </div>
                        <div>
                            <label className="block text-xs text-white/50 mb-1 uppercase">Duração (meses)</label>
                            <input type="number" min={1} value={form.duration_months} onChange={e => setForm(p => ({ ...p, duration_months: parseInt(e.target.value) || 1 }))}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple/50" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-white/50 mb-1 uppercase">Máx. Alunos (vazio = ilimitado)</label>
                        <input type="number" min={1} value={form.max_students ?? ''} onChange={e => setForm(p => ({ ...p, max_students: e.target.value ? parseInt(e.target.value) : null }))}
                            placeholder="Ilimitado"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple/50" />
                    </div>
                    <div>
                        <label className="block text-xs text-white/50 mb-1 uppercase">Funcionalidades</label>
                        <div className="flex gap-2 mb-2">
                            <input value={newFeature} onChange={e => setNewFeature(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && addFeature()}
                                placeholder="Ex: Correção de redação AI"
                                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple/50" />
                            <button onClick={addFeature} className="px-3 py-2 rounded-lg bg-purple/20 text-purple-light text-sm">+</button>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {form.features.map((f, i) => (
                                <span key={i} className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-white/5 text-white/60">
                                    {f}
                                    <button onClick={() => removeFeature(i)}><X className="w-3 h-3" /></button>
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" checked={form.is_active} onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))} id="plan-active" className="rounded" />
                        <label htmlFor="plan-active" className="text-sm text-white/60">Plano ativo</label>
                    </div>
                </div>

                <div className="flex gap-3 p-4 border-t border-white/10">
                    <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 text-white/60 text-sm font-medium transition-colors hover:bg-white/10">Cancelar</button>
                    <button onClick={() => onSave(form)} className="flex-1 px-4 py-2.5 rounded-xl bg-purple hover:bg-purple-light text-white text-sm font-semibold transition-colors">Salvar</button>
                </div>
            </motion.div>
        </motion.div>
    );
}
