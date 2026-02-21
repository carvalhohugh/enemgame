import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, Cell
} from 'recharts';
import {
    TrendingUp, Users, School, DollarSign,
    ArrowUpRight, ArrowDownRight, Filter, Download
} from 'lucide-react';
import './AdminModules.css';

const MOCK_GROWTH = [
    { name: 'Jan', inscricoes: 45 },
    { name: 'Fev', inscricoes: 52 },
    { name: 'Mar', inscricoes: 48 },
    { name: 'Abr', inscricoes: 70 },
    { name: 'Mai', inscricoes: 61 },
    { name: 'Jun', inscricoes: 85 },
];

const MOCK_COMMISSIONS = [
    { name: 'Prof. Ricardo', valor: 1250 },
    { name: 'Prof. Ana', valor: 2100 },
    { name: 'Prof. Carlos', valor: 850 },
    { name: 'Prof. Marina', valor: 3400 },
];

const SCHOOL_STATS = [
    { name: 'Escola D. Bosco', students: 120, revenue: 5400 },
    { name: 'Colégio Alpha', students: 85, revenue: 3800 },
    { name: 'Inst. Educare', students: 210, revenue: 9200 },
];

const COLORS = ['#6366f1', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6'];

const Relatorios: React.FC = () => {
    return (
        <div className="admin-module-container">
            <header className="module-header">
                <div>
                    <h1>Relatórios <span className="highlight">Estratégicos</span> 📊</h1>
                    <p>Visão geral de crescimento, comissões e performance escolar.</p>
                </div>
                <div className="header-actions">
                    <button className="neon-button"><Filter size={18} /> FILTRAR</button>
                    <button className="neon-button primary"><Download size={18} /> EXPORTAR PDF</button>
                </div>
            </header>

            <div className="stats-grid">
                <div className="stat-card glass-card">
                    <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>
                        <Users size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="label">NOVAS INSCRIÇÕES (MÊS)</span>
                        <span className="value">342</span>
                        <span className="trend positive"><ArrowUpRight size={14} /> +12% vs mês ant.</span>
                    </div>
                </div>

                <div className="stat-card glass-card">
                    <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent)' }}>
                        <TrendingUp size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="label">CRESCIMENTO ANUAL</span>
                        <span className="value">156%</span>
                        <span className="trend positive"><ArrowUpRight size={14} /> Meta batida</span>
                    </div>
                </div>

                <div className="stat-card glass-card">
                    <div className="stat-icon" style={{ background: 'rgba(244, 63, 94, 0.1)', color: 'var(--secondary)' }}>
                        <DollarSign size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="label">TOTAL COMISSÕES</span>
                        <span className="value">R$ 12.450</span>
                        <span className="trend negative"><ArrowDownRight size={14} /> -3% vs previsto</span>
                    </div>
                </div>
            </div>

            <div className="charts-layout">
                <div className="chart-card glass-card">
                    <h3>Novas Inscrições por Período</h3>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={MOCK_GROWTH}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} />
                                <YAxis stroke="var(--text-secondary)" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ background: 'var(--sidebar-bg)', border: '1px solid var(--bg-card-border)' }}
                                    labelStyle={{ color: 'var(--text-primary)' }}
                                />
                                <Line type="monotone" dataKey="inscricoes" stroke="var(--primary)" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card glass-card">
                    <h3>Top 5 Comissões (Professores)</h3>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={MOCK_COMMISSIONS}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} />
                                <YAxis stroke="var(--text-secondary)" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ background: 'var(--sidebar-bg)', border: '1px solid var(--bg-card-border)' }}
                                />
                                <Bar dataKey="valor" fill="var(--clan-cosmos)">
                                    {MOCK_COMMISSIONS.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="table-card glass-card">
                <div className="card-header">
                    <h3>Alunos por Escola Parceira</h3>
                    <School size={20} color="var(--primary)" />
                </div>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ESCOLA</th>
                            <th>ALUNOS CADASTRADOS</th>
                            <th>FATURAMENTO ESTIMADO</th>
                            <th>STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {SCHOOL_STATS.map((s, i) => (
                            <tr key={i}>
                                <td className="strong">{s.name}</td>
                                <td>{s.students}</td>
                                <td className="success">R$ {s.revenue.toLocaleString()}</td>
                                <td><span className="badge-active">ATIVO</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Relatorios;
