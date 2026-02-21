import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Cell
} from 'recharts';
import {
    DollarSign, FileCheck, AlertCircle, Clock,
    Plus, Search, Download
} from 'lucide-react';
import './AdminModules.css';

const FINANCIAL_FLOW = [
    { type: 'Entradas', value: 45000, color: '#10b981' },
    { type: 'Saídas', value: 12500, color: '#f43f5e' },
    { type: 'Comissões', value: 8700, color: '#f59e0b' },
];

const CONTRACTS = [
    { id: 'CTR-A92J', client: 'Colégio Santa Teresa', value: 12400, status: 'Aberto', due: '15/05/2026' },
    { id: 'CTR-B25K', client: 'Escola Municipal X', value: 3500, status: 'Pendente', due: '10/04/2026' },
    { id: 'CTR-L01M', client: 'Prefeitura de SP (Convênio)', value: 85000, status: 'Aberto', due: '01/06/2026' },
];

const Financeiro: React.FC = () => {
    return (
        <div className="admin-module-container">
            <header className="module-header">
                <div>
                    <h1>Gestão <span className="highlight">Financeira</span> 💰</h1>
                    <p>Controle de fluxo de caixa, contratos e faturamento recorrente.</p>
                </div>
                <div className="header-actions">
                    <button className="neon-button"><Search size={18} /> BUSCAR</button>
                    <button className="neon-button primary"><Plus size={18} /> NOVO LANÇAMENTO</button>
                </div>
            </header>

            <div className="stats-grid">
                <div className="stat-card glass-card">
                    <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent)' }}>
                        <DollarSign size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="label">SALDO LÍQUIDO</span>
                        <span className="value">R$ 23.800</span>
                        <span className="trend positive">Fluxo saudável</span>
                    </div>
                </div>

                <div className="stat-card glass-card">
                    <div className="stat-icon" style={{ background: 'rgba(244, 63, 94, 0.1)', color: 'var(--secondary)' }}>
                        <AlertCircle size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="label">CONTRATOS PENDENTES</span>
                        <span className="value">08</span>
                        <span className="trend negative">Atenção urgente</span>
                    </div>
                </div>

                <div className="stat-card glass-card">
                    <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                        <Clock size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="label">PROJEÇÃO PRÓX. MÊS</span>
                        <span className="value">R$ 48.000</span>
                        <span className="trend">Baseado em contratos</span>
                    </div>
                </div>
            </div>

            <div className="charts-layout full-width">
                <div className="chart-card glass-card">
                    <div className="card-header">
                        <h3>Distribuição de Fluxo (Mensal)</h3>
                        <Download size={18} />
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={FINANCIAL_FLOW} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis type="number" stroke="var(--text-secondary)" fontSize={12} />
                                <YAxis dataKey="type" type="category" stroke="var(--text-primary)" fontSize={14} width={100} />
                                <Tooltip
                                    contentStyle={{ background: 'var(--sidebar-bg)', border: '1px solid var(--bg-card-border)' }}
                                />
                                <Bar dataKey="value" barSize={30}>
                                    {FINANCIAL_FLOW.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="table-card glass-card">
                <div className="card-header">
                    <h3>Gestão de Contratos</h3>
                    <FileCheck size={20} color="var(--primary)" />
                </div>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID CONTRATO</th>
                            <th>CLIENTE / ESCOLA</th>
                            <th>VALOR TOTAL</th>
                            <th>VENCIMENTO</th>
                            <th>STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {CONTRACTS.map((c, i) => (
                            <tr key={i}>
                                <td className="id-code">{c.id}</td>
                                <td className="strong">{c.client}</td>
                                <td>R$ {c.value.toLocaleString()}</td>
                                <td style={{ opacity: 0.8 }}>{c.due}</td>
                                <td>
                                    <span className={`badge-${c.status === 'Aberto' ? 'active' : 'pending'}`}>
                                        {c.status.toUpperCase()}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Financeiro;
