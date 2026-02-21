import React, { useState } from 'react';
import {
    Search, Users, Plus,
    DollarSign, Video, Swords
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Relatorios from './Relatorios';
import Financeiro from './Financeiro';
import DataImport from './DataImport';
import './InstitutionalPanel.css';

type TabType = 'dashboard' | 'alunos' | 'professores' | 'escolas' | 'planos' | 'financeiro' | 'salas' | 'arena' | 'relatorios' | 'import';

interface Room {
    id: string;
    title: string;
    professor: string;
    youtubeUrl: string;
    status: 'online' | 'scheduled' | 'finished';
    startTime: string;
}

interface ArenaRoom {
    id: string;
    name: string;
    year: number;
    subject: string;
    difficulty: 'Fácil' | 'Médio' | 'Difícil' | 'Elite';
    activePlayers: number;
}

const InstitutionalPanel: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('dashboard');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<TabType | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [rooms] = useState<Room[]>([
        { id: '1', title: 'Revisão de Biologia: Genética', professor: 'Dr. Silva', youtubeUrl: 'https://youtube.com/live/abc', status: 'online', startTime: '14:00' },
        { id: '2', title: 'Matemática Financeira', professor: 'Prof. Ana', youtubeUrl: 'https://youtube.com/live/xyz', status: 'scheduled', startTime: '16:00' },
    ]);

    const [arenaRooms] = useState<ArenaRoom[]>([
        { id: '1', name: 'Grande Batalha do Cosmos', year: 2023, subject: 'Ciências da Natureza', difficulty: 'Elite', activePlayers: 124 },
        { id: '2', name: 'Duelo de Humanas', year: 2022, subject: 'Ciências Humanas', difficulty: 'Médio', activePlayers: 45 },
    ]);

    const renderDashboard = () => (
        <>
            <div className="stats-grid">
                {[
                    { label: "Total Alunos", val: "12.450", icon: <Users />, color: "var(--primary)" },
                    { label: "Receita Prevista", val: "R$ 425k", icon: <DollarSign />, color: "var(--accent)" },
                    { label: "Aulas Online", val: rooms.filter(r => r.status === 'online').length.toString(), icon: <Video />, color: "var(--secondary)" },
                    { label: "Arena Global", val: arenaRooms.length.toString(), icon: <Swords />, color: "#f59e0b" },
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
                    <h3 className="section-title"><Video size={20} /> Aulas em Tempo Real</h3>
                    <table className="admin-table">
                        <thead><tr><th>TÍTULO</th><th>PROFESSOR</th><th>STATUS</th></tr></thead>
                        <tbody>
                            {rooms.map(r => (
                                <tr key={r.id}>
                                    <td>{r.title}</td>
                                    <td>{r.professor}</td>
                                    <td><span className={`status-badge ${r.status}`}>{r.status === 'online' ? 'AO VIVO' : 'AGENDADO'}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
                <section className="glass-card section-card">
                    <h3 className="section-title"><Swords size={20} /> Salas de Batalha (Arena)</h3>
                    <table className="admin-table">
                        <thead><tr><th>NOME</th><th>ANO</th><th>JOGADORES</th></tr></thead>
                        <tbody>
                            {arenaRooms.map(a => (
                                <tr key={a.id}>
                                    <td>{a.name}</td>
                                    <td>{a.year}</td>
                                    <td>
                                        <div className="player-count">
                                            <Users size={12} /> {a.activePlayers}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </div>
        </>
    );

    const renderTable = (type: TabType) => {
        const headersMap: Record<string, string[]> = {
            alunos: ['NOME', 'CLÃ', 'CADASTRO', 'STATUS', 'AÇÕES'],
            professores: ['NOME', 'CUPOM', 'COMISSÃO', 'EMAIL', 'AÇÕES'],
            escolas: ['NOME', 'CONTRATOS', 'ALUNOS', 'VALOR', 'AÇÕES'],
            planos: ['NOME', 'VALOR', 'VIGÊNCIA', 'DESCRIÇÃO', 'AÇÕES'],
        };

        const headers = headersMap[type as string] || [];

        return (
            <div className="glass-card table-wrapper">
                <div className="table-filters">
                    <div className="search-bar">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder={`Buscar ${type}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="neon-button mini" onClick={() => { setModalType(type); setShowModal(true); }}>
                        <Plus size={16} /> NOVO CADASTRO
                    </button>
                </div>
                <table className="admin-table">
                    <thead>
                        <tr>
                            {headers.map(h => <th key={h}>{h}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td colSpan={headers.length} style={{ textAlign: 'center', padding: '40px 0', opacity: 0.5 }}>Carregando dados de {type}...</td></tr>
                    </tbody>
                </table>
            </div>
        );
    };

    const renderArenaMgmt = () => (
        <div className="arena-mgmt">
            <div className="glass-card table-wrapper">
                <div className="table-header" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3>Salas Ativas na Arena</h3>
                    <button className="neon-button primary mini">+ NOVA BATALHA</button>
                </div>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>SALA</th>
                            <th>QUESTÕES</th>
                            <th>DIFICULDADE</th>
                            <th>STATUS</th>
                            <th>JOGADORES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {arenaRooms.map(room => (
                            <tr key={room.id} className="room-card">
                                <td>{room.name}</td>
                                <td>{room.subject} ({room.year})</td>
                                <td><span className={`diff-tag ${room.difficulty.toLowerCase()}`}>{room.difficulty}</span></td>
                                <td><span className="status-badge online">ATIVO</span></td>
                                <td>{room.activePlayers} JOGADORES</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderFinanceiro = () => <Financeiro />;
    const renderRelatorios = () => <Relatorios />;
    const renderImport = () => <DataImport />;

    return (
        <div className="admin-container">
            <header className="admin-header">
                <h1 className="text-gradient">Painel Institucional</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Gestão centralizada de usuários, infraestrutura e finanças.</p>
            </header>

            <nav className="glass-card admin-nav">
                {[
                    { id: 'dashboard', label: 'Dashboard' },
                    { id: 'alunos', label: 'Alunos' },
                    { id: 'professores', label: 'Professores' },
                    { id: 'escolas', label: 'Escolas' },
                    { id: 'financeiro', label: 'Financeiro' },
                    { id: 'relatorios', label: 'Relatórios' },
                    { id: 'import', label: 'Importação' },
                ].map(tab => (
                    <button
                        key={tab.id}
                        className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id as TabType)}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'dashboard' && renderDashboard()}
                    {activeTab === 'arena' && renderArenaMgmt()}
                    {activeTab === 'financeiro' && renderFinanceiro()}
                    {activeTab === 'relatorios' && renderRelatorios()}
                    {activeTab === 'import' && renderImport()}
                    {['alunos', 'professores', 'escolas', 'planos'].includes(activeTab) && renderTable(activeTab)}
                </motion.div>
            </AnimatePresence>

            {showModal && (
                <div className="modal-overlay">
                    <div className="glass-card admin-modal">
                        <h2>Novo Cadastro: {modalType?.toUpperCase()}</h2>
                        <div className="admin-form">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Nome Completo</label>
                                    <input type="text" placeholder="Nome..." />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" placeholder="email@exemplo.com" />
                                </div>
                            </div>
                            <div className="form-actions">
                                <button className="neon-button alt" onClick={() => setShowModal(false)}>CANCELAR</button>
                                <button className="neon-button primary" onClick={() => setShowModal(false)}>SALVAR</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InstitutionalPanel;
