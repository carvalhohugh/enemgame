import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, School, User, Mail, Phone, CreditCard, Ticket, Loader2 } from 'lucide-react';
import { AdminCrudService, type Plan, type School as SchoolType, type Teacher } from '@/services/AdminCrudService';
import { Link } from 'react-router-dom';

export default function PublicEnrollmentPage() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(true);
    const [schools, setSchools] = useState<SchoolType[]>([]);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        schoolId: '',
        planId: '',
        coupon: '',
    });

    const [appliedTeacher, setAppliedTeacher] = useState<Teacher | null>(null);
    const [couponError, setCouponError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        async function loadData() {
            const [s, p, t] = await Promise.all([
                AdminCrudService.listSchools(),
                AdminCrudService.listPlans(),
                AdminCrudService.listTeachers()
            ]);
            setSchools(s.filter(i => i.is_active));
            setPlans(p.filter(i => i.is_active));
            setTeachers(t.filter(i => i.is_active));
            setLoading(false);
        }
        loadData();
    }, []);

    const handleApplyCoupon = () => {
        if (!form.coupon) return;
        const teacher = teachers.find(t => t.coupon_code?.toUpperCase() === form.coupon.toUpperCase());
        if (teacher) {
            setAppliedTeacher(teacher);
            setCouponError('');
        } else {
            setAppliedTeacher(null);
            setCouponError('Cupom inválido ou expirado.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulação de delay de API
        await new Promise(r => setTimeout(r, 1500));

        // Aqui chamaria a API real de cadastro
        console.log("Cadastro realizado:", { ...form, teacherId: appliedTeacher?.id });

        setIsSubmitting(false);
        setSuccess(true);
    };

    const selectedPlan = plans.find(p => p.id === form.planId);

    if (loading) return <div className="min-h-screen bg-dark flex items-center justify-center text-white">Carregando...</div>;

    if (success) {
        return (
            <div className="min-h-screen bg-dark flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-white/5 border border-white/10 p-8 rounded-2xl text-center"
                >
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Matrícula Realizada!</h2>
                    <p className="text-white/60 mb-6">
                        Obrigado, {form.name.split(' ')[0]}. Seus dados foram recebidos.
                        <br />Em breve você receberá um e-mail com seus dados de acesso.
                    </p>
                    <Link to="/" className="btn-primary inline-flex">
                        Voltar para Home
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark text-white font-inter selection:bg-purple/30">
            {/* Header Simples */}
            <header className="fixed top-0 w-full z-50 bg-dark/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="font-poppins font-bold text-xl">
                        ENEM<span className="text-gold">Game</span>
                    </div>
                    <Link to="/" className="text-sm text-white/60 hover:text-white transition-colors">
                        Já tenho conta
                    </Link>
                </div>
            </header>

            <main className="pt-24 pb-12 px-4">
                <div className="max-w-lg mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold font-poppins mb-2">Garanta sua vaga</h1>
                        <p className="text-white/60">Preencha o formulário abaixo para iniciar sua jornada rumo à aprovação.</p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
                    >
                        {/* Progress Steps */}
                        <div className="flex border-b border-white/5">
                            <button
                                onClick={() => step > 1 && setStep(1)}
                                className={`flex-1 py-3 text-sm font-medium transition-colors ${step >= 1 ? 'text-purple-light bg-purple/5' : 'text-white/30'}`}
                            >
                                1. Dados
                            </button>
                            <button
                                onClick={() => step > 2 && setStep(2)}
                                className={`flex-1 py-3 text-sm font-medium transition-colors ${step >= 2 ? 'text-purple-light bg-purple/5' : 'text-white/30'}`}
                            >
                                2. Acadêmico
                            </button>
                            <button
                                className={`flex-1 py-3 text-sm font-medium transition-colors ${step >= 3 ? 'text-purple-light bg-purple/5' : 'text-white/30'}`}
                            >
                                3. Plano
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {step === 1 && (
                                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                                    <div>
                                        <label className="block text-xs uppercase text-white/40 font-semibold mb-1.5 ml-1">Nome Completo</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 w-5 h-5 text-white/20" />
                                            <input
                                                required
                                                value={form.name}
                                                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                                                className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-purple/50"
                                                placeholder="Seu nome"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase text-white/40 font-semibold mb-1.5 ml-1">E-mail</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 w-5 h-5 text-white/20" />
                                            <input
                                                required
                                                type="email"
                                                value={form.email}
                                                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                                                className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-purple/50"
                                                placeholder="seu@email.com"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase text-white/40 font-semibold mb-1.5 ml-1">WhatsApp</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3 w-5 h-5 text-white/20" />
                                            <input
                                                required
                                                type="tel"
                                                value={form.phone}
                                                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                                                className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-purple/50"
                                                placeholder="(00) 00000-0000"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (form.name && form.email && form.phone) setStep(2);
                                        }}
                                        className="w-full btn-primary mt-4 flex items-center justify-center gap-2"
                                    >
                                        Próximo <ChevronRight className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                                    <div>
                                        <label className="block text-xs uppercase text-white/40 font-semibold mb-1.5 ml-1">Escola / Instituição</label>
                                        <div className="relative">
                                            <School className="absolute left-3 top-3 w-5 h-5 text-white/20" />
                                            <select
                                                required
                                                value={form.schoolId}
                                                onChange={e => setForm(p => ({ ...p, schoolId: e.target.value }))}
                                                className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-purple/50 appearance-none"
                                            >
                                                <option value="" className="bg-dark">Selecione sua escola</option>
                                                {schools.map(s => (
                                                    <option key={s.id} value={s.id} className="bg-dark">{s.name} ({s.city})</option>
                                                ))}
                                                <option value="other" className="bg-dark">Outra / Não listada</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className=" flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="px-4 py-2.5 rounded-xl border border-white/10 text-white/60 hover:bg-white/5 transition-colors"
                                        >
                                            Voltar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (form.schoolId) setStep(3);
                                            }}
                                            className="flex-1 btn-primary flex items-center justify-center gap-2"
                                        >
                                            Próximo <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                    <div>
                                        <label className="block text-xs uppercase text-white/40 font-semibold mb-3 ml-1">Escolha seu Plano</label>
                                        <div className="space-y-3">
                                            {plans.map(plan => (
                                                <div
                                                    key={plan.id}
                                                    onClick={() => setForm(p => ({ ...p, planId: plan.id }))}
                                                    className={`cursor-pointer p-4 rounded-xl border transition-all ${form.planId === plan.id
                                                            ? 'bg-purple/10 border-purple/50 ring-1 ring-purple/50'
                                                            : 'bg-black/20 border-white/10 hover:border-white/20'
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h3 className="font-semibold text-white">{plan.name}</h3>
                                                        <span className="font-bold text-lg text-white">
                                                            {plan.price === 0 ? 'Grátis' : `R$ ${plan.price.toFixed(2)}`}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-white/50">{plan.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs uppercase text-white/40 font-semibold mb-1.5 ml-1">Tem um cupom?</label>
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <Ticket className="absolute left-3 top-3 w-5 h-5 text-white/20" />
                                                <input
                                                    value={form.coupon}
                                                    onChange={e => setForm(p => ({ ...p, coupon: e.target.value.toUpperCase() }))}
                                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-purple/50 uppercase"
                                                    placeholder="Código do Professor"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleApplyCoupon}
                                                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10"
                                            >
                                                Aplicar
                                            </button>
                                        </div>
                                        {couponError && <p className="text-xs text-red-400 mt-1 ml-1">{couponError}</p>}
                                        {appliedTeacher && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="mt-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                                                    <Check className="w-4 h-4 text-green-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-green-400">Cupom Aplicado!</p>
                                                    <p className="text-xs text-green-400/70">
                                                        Indicação: {appliedTeacher.full_name}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>

                                    <div className="pt-4 border-t border-white/10 flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setStep(2)}
                                            className="px-4 py-3 rounded-xl border border-white/10 text-white/60 hover:bg-white/5 transition-colors"
                                        >
                                            Voltar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={!form.planId || isSubmitting}
                                            className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <>
                                                    <CreditCard className="w-5 h-5" />
                                                    Finalizar Matrícula
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </form>
                    </motion.div>

                    <p className="text-center text-xs text-white/30 mt-6">
                        Ao se matricular, você concorda com nossos Termos de Uso e Política de Privacidade.
                    </p>
                </div>
            </main>
        </div>
    );
}
