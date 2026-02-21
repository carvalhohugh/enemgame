import React, { useState } from 'react';
import {
    Swords, Users,
    DollarSign, Search, Plus, Edit2, Trash2,
    X, ArrowUpRight, ArrowDownRight, CreditCard, Video,
    Calendar, Youtube
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './InstitutionalPanel.css';

type TabType = 'dashboard' | 'alunos' | 'professores' | 'escolas' | 'planos' | 'financeiro' | 'salas' | 'arena';

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

    const [rooms, setRooms] = useState<Room[]>([
        { id: '1', title: 'Revisão de Biologia: Genética', professor: 'Dr. Silva', youtubeUrl: 'https://youtube.com/live/abc', status: 'online', startTime: '14:00' },
        { id: '2', title: 'Matemática Financeira', professor: 'Prof. Ana', youtubeUrl: 'https://youtube.com/live/xyz', status: 'scheduled', startTime: '16:00' },
    ]);

    const [arenaRooms, setArenaRooms] = useState<ArenaRoom[]>([
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
                                    <td><span className="player-count">{a.activePlayers}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </div>
        </>
    );

    const renderSalas = () => (
        <div className="glass-card table-wrapper">
            <div className="table-header" style={{ padding: '0 24px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Gestão de Salas de Aula (Videoconferência)</h3>
                <button className="neon-button" onClick={() => { setModalType('salas'); setShowModal(true); }}>
                    <Video size={16} /> CRIAR SALA AO VIVO
                </button>
            </div>
            <div className="rooms-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', padding: '24px' }}>
                {rooms.map(room => (
                    <div key={room.id} className="glass-card room-card" style={{ padding: '20px', border: '1px solid var(--bg-card-border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <span className={`status-badge ${room.status}`}>{room.status.toUpperCase()}</span>
                            <div className="action-btns">
                                <button className="action-btn edit"><Edit2 size={14} /></button>
                                <button className="action-btn delete" onClick={() => setRooms(prev => prev.filter(p => p.id !== room.id))}><Trash2 size={14} /></button>
                            </div>
                        </div>
                        <h4 style={{ marginBottom: '8px' }}>{room.title}</h4>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                            <p style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={14} /> Prof: {room.professor}</p>
                            <p style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} /> Início: {room.startTime}</p>
                        </div>
                        <div className="youtube-link" style={{ background: 'rgba(255,0,0,0.1)', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                            <Youtube size={16} color="#ff0000" />
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{room.youtubeUrl}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderArenaMgmt = () => (
        <div className="glass-card table-wrapper">
            <div className="table-header" style={{ padding: '0 24px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Configuração de Salas da Arena</h3>
                <button className="neon-button" onClick={() => { setModalType('arena'); setShowModal(true); }}>
                    <Plus size={16} /> NOVA SALA DE BATALHA
                </button>
            </div>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>NOME DA SALA</th>
                        <th>ANO ENEM</th>
                        <th>ÁREA DO CONHECIMENTO</th>
                        <th>DIFICULDADE</th>
                        <th>JOGADORES ATIVOS</th>
                        <th>AÇÕES</th>
                    </tr>
                </thead>
                <tbody>
                    {arenaRooms.map(room => (
                        <tr key={room.id}>
                            <td style={{ fontWeight: 700 }}>{room.name}</td>
                            <td>{room.year}</td>
                            <td>{room.subject}</td>
                            <td><span className={`diff-tag ${room.difficulty.toLowerCase()}`}>{room.difficulty}</span></td>
                            <td>{room.activePlayers}</td>
                            <td>
                                <div className="action-btns">
                                    <button className="action-btn edit"><Edit2 size={16} /></button>
                                    <button className="action-btn delete"><Trash2 size={16} onClick={() => setArenaRooms(prev => prev.filter(p => p.id !== room.id))} /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
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
                        {[
                            { id: '1', desc: 'Assinatura Premium', cat: 'Vendas', date: '20-02-24', val: 29.90, type: 'entrada' },
                            { id: '2', desc: 'Infraestrutura Cloud', cat: 'Custo', date: '19-02-24', val: 340.00, type: 'saida' },
                        ].map(tx => (
                            <tr key={tx.id}>
                                <td>{tx.desc}</td>
                                <td><span className="category-tag">{tx.cat}</span></td>
                                <td>{tx.date}</td>
                                <td className={tx.type === 'entrada' ? 'text-success' : 'text-danger'}>
                                    {tx.type === 'entrada' ? '+' : '-'} R$ {tx.val.toFixed(2)}
                                </td>
                                <td><span className={`status-badge ${tx.type}`}>{tx.type.toUpperCase()}</span></td>
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
                        <tr><td colSpan={headers?.length + 1} style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>Utilize a busca ou adicione um novo registro</td></tr>
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
                    <p>Gestão administrativa da base de usuários, parceiros e jogabilidade.</p>
                </div>
            </header>

            <nav className="admin-nav glass-card">
                {[
                    { id: 'dashboard', label: 'Dashboard' },
                    { id: 'salas', label: 'Salas Criadas' },
                    { id: 'arena', label: 'Gerenciar Arena' },
                    { id: 'alunos', label: 'Alunos' },
                    { id: 'professores', label: 'Professores' },
                    { id: 'escolas', label: 'Escolas' },
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
                        {activeTab === 'salas' && renderSalas()}
                        {activeTab === 'arena' && renderArenaMgmt()}
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
                                <h2>
                                    {modalType === 'salas' ? 'Criar Sala de Videoconferência' :
                                        modalType === 'arena' ? 'Criar Nova Sala de Arena' :
                                            `Cadastrar ${modalType?.toUpperCase()}`}
                                </h2>
                                <button className="close-btn" onClick={() => setShowModal(false)}><X /></button>
                            </div>
                            <form className="admin-form" onSubmit={(e) => { e.preventDefault(); setShowModal(false); }}>
                                <div className="form-grid">
                                    {modalType === 'salas' ? (
                                        <>
                                            <div className="form-group full">
                                                <label>Título da Aula / Live</label>
                                                <input type="text" placeholder="Ex: Maratona de Redação 2024" required />
                                            </div>
                                            <div className="form-group">
                                                <label>ProfessorResponsável</label>
                                                <input type="text" placeholder="Nome do Prof" required />
                                            </div>
                                            <div className="form-group">
                                                <label>Link do YouTube Stream (API)</label>
                                                <input type="url" placeholder="https://youtube.com/live/..." required />
                                            </div>
                                            <div className="form-group">
                                                <label>Data / Hora</label>
                                                <input type="datetime-local" required />
                                            </div>
                                        </>
                                    ) : modalType === 'arena' ? (
                                        <>
                                            <div className="form-group full">
                                                <label>Nome do Evento na Arena</label>
                                                <input type="text" placeholder="Ex: Torneio de Verão Alpha" required />
                                            </div>
                                            <div className="form-group">
                                                <label>Ano do ENEM</label>
                                                <select><option>2023</option><option>2022</option><option>2021</option></select>
                                            </div>
                                            <div className="form-group">
                                                <label>Área do Conhecimento</label>
                                                <select><option>Todas</option><option>Matemática</option><option>Linguagens</option><option>Natureza</option><option>Humanas</option></select>
                                            </div>
                                            <div className="form-group">
                                                <label>Dificuldade Global</label>
                                                <select><option>Fácil</option><option>Médio</option><option>Difícil</option><option>Elite</option></select>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="form-group">
                                                <label>Nome / Identificador</label>
                                                <input type="text" placeholder="Ex: João Silva" required />
                                            </div>
                                            <div className="form-group">
                                                <label>E-mail / Login</label>
                                                <input type="email" placeholder="email@exemplo.com" required />
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="form-actions">
                                    <button type="button" className="neon-button alt" onClick={() => setShowModal(false)}>CANCELAR</button>
                                    <button type="submit" className="neon-button">{modalType === 'salas' ? 'INICIAR LIVE' : 'SALVAR REGISTRO'}</button>
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
