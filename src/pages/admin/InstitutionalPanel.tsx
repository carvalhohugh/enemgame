import React, { useState } from 'react';
import {
    Building2, TrendingUp, Swords, Users, GraduationCap,
    DollarSign, Search, Plus, MoreVertical, Edit2, Trash2,
    X, ArrowUpRight, ArrowDownRight, CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './InstitutionalPanel.css';

type TabType = 'dashboard' | 'alunos' | 'professores' | 'escolas' | 'planos' | 'financeiro';

interface Transaction {
    id: string;
    description: string;
    amount: number;
    type: 'entrada' | 'saida';
    date: string;
    category: string;
}

const MOCK_TRANSACTIONS: Transaction[] = [
    { id: '1', description: 'Assinatura Premium - Hugo V.', amount: 29.90, type: 'entrada', date: '2024-02-20', category: 'Assinaturas' },
    { id: '2', description: 'AWS Cloud Services', amount: 450.00, type: 'saida', date: '2024-02-19', category: 'Infraestrutura' },
    { id: '3', description: 'Parceria Colégio Alpha', amount: 1200.00, type: 'entrada', date: '2024-02-18', category: 'Escolas' },
    { id: '4', description: 'Marketing Google Ads', amount: 800.00, type: 'saida', date: '2024-02-17', category: 'Marketing' },
];

const InstitutionalPanel: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('dashboard');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<TabType | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const renderDashboard = () => (
        <>
            <div className="stats-grid">
                {[
                    { label: "Total Alunos", val: "12.450", icon: <Users />, color: "var(--primary)" },
                    { label: "Receita Prevista", val: "R$ 425k", icon: <DollarSign />, color: "var(--accent)" },
                    { label: "Engajamento", val: "89%", icon: <TrendingUp />, color: "var(--secondary)" },
                    { label: "Escolas Ativas", val: "142", icon: <Building2 />, color: "var(--clan-glacies)" },
                ].map((s, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i}
                        className="glass-card stat-item"
                    >
                        <div className="stat-icon" style={{ background: `${s.color}20`, color: s.color }}>{s.icon}</div>
                        <div>
                            <div className="stat-label">{s.label}</div>
                            <div className="stat-value">{s.val}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="dashboard-sections">
                <section className="glass-card section-card">
                    <h3 className="section-title"><Swords size={20} /> Salas Ativas</h3>
                    <table className="admin-table">
                        <thead><tr><th>SALA</th><th>ALUNOS</th><th>STATUS</th></tr></thead>
                        <tbody>
                            <tr><td>Torneio de Inverno</td><td>1.2k</td><td><span className="status-badge open">Aberta</span></td></tr>
                            <tr><td>X1 dos Heróis</td><td>450</td><td><span className="status-badge active">Em curso</span></td></tr>
                        </tbody>
                    </table>
                </section>
                <section className="glass-card section-card">
                    <h3 className="section-title"><GraduationCap size={20} /> Top Professores</h3>
                    <table className="admin-table">
                        <thead><tr><th>NOME</th><th>ADESÕES</th><th>CUPOM</th></tr></thead>
                        <tbody>
                            <tr><td>Ricardo Mat</td><td>154</td><td><span className="coupon-code">MATFAST20</span></td></tr>
                            <tr><td>Maria Letras</td><td>89</td><td><span className="coupon-code">LINGPRO</span></td></tr>
                        </tbody>
                    </table>
                </section>
            </div>
        </>
    );

    const renderFinanceiro = () => (
        <div className="finance-view">
            <div className="finance-summary stats-grid">
                <div className="glass-card stat-item">
                    <div className="stat-icon entrada"><ArrowUpRight /></div>
                    <div>
                        <div className="stat-label">TOTAL ENTRADAS</div>
                        <div className="stat-value text-success">R$ 14.250,30</div>
                    </div>
                </div>
                <div className="glass-card stat-item">
                    <div className="stat-icon saida"><ArrowDownRight /></div>
                    <div>
                        <div className="stat-label">TOTAL SAÍDAS</div>
                        <div className="stat-value text-danger">R$ 5.420,15</div>
                    </div>
                </div>
                <div className="glass-card stat-item">
                    <div className="stat-icon saldo"><CreditCard /></div>
                    <div>
                        <div className="stat-label">SALDO LÍQUIDO</div>
                        <div className="stat-value">R$ 8.830,15</div>
                    </div>
                </div>
            </div>

            <div className="glass-card table-wrapper">
                <div className="table-header">
                    <h3>Movimentação Financeira</h3>
                    <button className="neon-button mini">+ NOVA TRANSAÇÃO</button>
                </div>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>DESCRIÇÃO</th>
                            <th>CATEGORIA</th>
                            <th>DATA</th>
                            <th>VALOR</th>
                            <th>TIPO</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MOCK_TRANSACTIONS.map(tx => (
                            <tr key={tx.id}>
                                <td>{tx.description}</td>
                                <td><span className="category-tag">{tx.category}</span></td>
                                <td>{tx.date}</td>
                                <td className={tx.type === 'entrada' ? 'text-success' : 'text-danger'}>
                                    {tx.type === 'entrada' ? '+' : '-'} R$ {tx.amount.toFixed(2)}
                                </td>
                                <td>
                                    <span className={`status-badge ${tx.type}`}>
                                        {tx.type.toUpperCase()}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderTable = (type: TabType) => {
        const headersMap: Record<string, string[]> = {
            alunos: ['NOME', 'CLÃ', 'NÍVEL', 'PLANO', 'ÚLTIMO ACESSO'],
            professores: ['NOME', 'DISCIPLINA', 'ACESSOS', 'CUPOM', 'COMISSÃO'],
            escolas: ['NOME', 'CIDADE', 'ALUNOS', 'PLANO', 'CONTRATO'],
            planos: ['NOME', 'PREÇO', 'USUÁRIOS', 'RECURSOS', 'STATUS']
        };
        const headers = headersMap[type as keyof typeof headersMap];

        const mockDataMap: Record<string, Record<string, string | number>[]> = {
            alunos: [
                { nome: 'Hugo Vasconcelos', cla: 'Cosmos', nivel: 12, plano: 'Premium', acesso: 'Hoje' },
                { nome: 'Ana Julia', cla: 'Ignis', nivel: 8, plano: 'Basic', acesso: 'Há 2 dias' },
            ],
            professores: [
                { nome: 'Prof. Sérgio', discip: 'Matemática', acessos: 1240, cupom: 'SERGINHO10', comissao: 'R$ 840,00' },
            ],
            escolas: [
                { nome: 'Colégio Alpha', cidade: 'São Paulo', alunos: 450, plano: 'Pro', contrato: 'Ativo' },
            ],
            planos: [
                { nome: 'Gamer Premium', preco: 'R$ 29,90', user: 'Individual', recursos: 'Full + Arena', status: 'Ativo' },
            ]
        };
        const mockData = mockDataMap[type as keyof typeof mockDataMap];

        return (
            <div className="glass-card table-wrapper">
                <div className="table-filters">
                    <div className="search-bar">
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder={`Buscar ${type}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="neon-button" onClick={() => { setModalType(type); setShowModal(true); }}>
                        <Plus size={16} /> NOVO REGISTRO
                    </button>
                </div>
                <table className="admin-table">
                    <thead>
                        <tr>
                            {headers?.map((h: string) => <th key={h}>{h}</th>)}
                            <th>AÇÕES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockData?.map((item: Record<string, string | number>, i: number) => (
                            <tr key={i}>
                                {Object.values(item).map((val: string | number, j) => <td key={j}>{val}</td>)}
                                <td>
                                    <div className="action-btns">
                                        <button className="action-btn edit"><Edit2 size={16} /></button>
                                        <button className="action-btn delete"><Trash2 size={16} /></button>
                                        <button className="action-btn more"><MoreVertical size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="admin-container">
            <header className="admin-header">
                <div>
                    <h1>Painel Institucional 🛡️</h1>
                    <p>Gestão administrativa da base de usuários e parceiros.</p>
                </div>
            </header>

            <nav className="admin-nav glass-card">
                {[
                    { id: 'dashboard', label: 'Visão Geral' },
                    { id: 'alunos', label: 'Alunos' },
                    { id: 'professores', label: 'Professores' },
                    { id: 'escolas', label: 'Escolas' },
                    { id: 'planos', label: 'Planos' },
                    { id: 'financeiro', label: 'Financeiro' },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id as TabType); setSearchTerm(''); }}
                        className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>

            <main className="admin-content">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'dashboard' && renderDashboard()}
                        {activeTab === 'financeiro' && renderFinanceiro()}
                        {['alunos', 'professores', 'escolas', 'planos'].includes(activeTab) && renderTable(activeTab)}
                    </motion.div>
                </AnimatePresence>
            </main>

            <AnimatePresence>
                {showModal && (
                    <div className="modal-overlay">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="glass-card admin-modal"
                        >
                            <div className="modal-header">
                                <h2>Cadastrar {modalType?.toUpperCase()}</h2>
                                <button className="close-btn" onClick={() => setShowModal(false)}><X /></button>
                            </div>
                            <form className="admin-form" onSubmit={(e) => { e.preventDefault(); setShowModal(false); }}>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Nome Completo</label>
                                        <input type="text" placeholder="Ex: João Silva" required />
                                    </div>
                                    <div className="form-group">
                                        <label>E-mail / Login</label>
                                        <input type="email" placeholder="email@exemplo.com" required />
                                    </div>
                                    {modalType === 'alunos' && (
                                        <div className="form-group">
                                            <label>Clã</label>
                                            <select><option>Cosmos</option><option>Ignis</option><option>Glacies</option><option>Silva</option></select>
                                        </div>
                                    )}
                                    {modalType === 'professores' && (
                                        <div className="form-group">
                                            <label>Disciplina</label>
                                            <input type="text" placeholder="Ex: Matemática" />
                                        </div>
                                    )}
                                </div>
                                <div className="form-actions">
                                    <button type="button" className="neon-button alt" onClick={() => setShowModal(false)}>CANCELAR</button>
                                    <button type="submit" className="neon-button">SALVAR REGISTRO</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default InstitutionalPanel;
