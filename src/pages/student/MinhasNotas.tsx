import React, { useState, useEffect } from 'react';
import {
    Plus, FileText, TrendingUp,
    Trash2, Edit3,
    BarChart3, Award, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './MinhasNotas.css';

interface ExamRecord {
    id: string;
    year: number;
    title: string;
    scores: {
        natureza: number;
        humanas: number;
        linguagens: number;
        matematica: number;
        redacao: number;
    };
    average?: number;
}

const MinhasNotas: React.FC = () => {
    const [records, setRecords] = useState<ExamRecord[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [newRecord, setNewRecord] = useState<Partial<ExamRecord>>({
        year: 2025,
        title: 'ENEM 2025',
        scores: { natureza: 0, humanas: 0, linguagens: 0, matematica: 0, redacao: 0 }
    });

    useEffect(() => {
        const saved = localStorage.getItem('enem_notas_historico');
        if (saved) setRecords(JSON.parse(saved));
    }, []);

    const saveRecords = (updated: ExamRecord[]) => {
        setRecords(updated);
        localStorage.setItem('enem_notas_historico', JSON.stringify(updated));
    };

    const handleAddRecord = () => {
        const avg = Object.values(newRecord.scores!).reduce((a, b) => a + b, 0) / 5;
        const record: ExamRecord = {
            id: Date.now().toString(),
            year: newRecord.year!,
            title: newRecord.title!,
            scores: newRecord.scores as any,
            average: parseFloat(avg.toFixed(1))
        };
        saveRecords([...records, record]);
        setIsModalOpen(false);
    };

    const handleDelete = (id: string) => {
        saveRecords(records.filter(r => r.id !== id));
    };

    const handleSync = () => {
        setIsSyncing(true);
        setTimeout(() => {
            const mockRecord: ExamRecord = {
                id: 'mock-1',
                year: 2024,
                title: 'ENEM 2024 (Sincronizado)',
                scores: { natureza: 712.5, humanas: 689.2, linguagens: 654.8, matematica: 842.1, redacao: 920 },
                average: 763.7
            };
            saveRecords([...records, mockRecord]);
            setIsSyncing(false);
            alert("Notas sincronizadas com sucesso via base INEP (Simulação)!");
        }, 2000);
    };

    return (
        <div className="notas-container">
            <header className="notas-header">
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900 }}>Minhas <span className="text-gradient">Notas</span> 📊</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Acompanhe seu histórico de desempenho e evolução acadêmica.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="sync-btn" onClick={handleSync} disabled={isSyncing}>
                        <RefreshCw size={18} className={isSyncing ? 'spin' : ''} />
                        {isSyncing ? 'SINCRONIZANDO...' : 'SINCRONIZAR GOV.BR'}
                    </button>
                    <button className="neon-button" onClick={() => setIsModalOpen(true)}>
                        <Plus size={18} /> LANÇAR NOTA
                    </button>
                </div>
            </header>

            <div className="stats-strip">
                <div className="glass-card stat-item">
                    <TrendingUp color="var(--primary)" />
                    <div>
                        <small>MELHOR MÉDIA</small>
                        <h3>{records.length > 0 ? Math.max(...records.map(r => r.average || 0)) : '--'}</h3>
                    </div>
                </div>
                <div className="glass-card stat-item">
                    <Award color="var(--secondary)" />
                    <div>
                        <small>VESTIBULARES</small>
                        <h3>{records.length}</h3>
                    </div>
                </div>
                <div className="glass-card stat-item">
                    <BarChart3 color="#10b981" />
                    <div>
                        <small>EVOLUÇÃO</small>
                        <h3>{records.length > 1 ? '+12%' : 'ESTÁVEL'}</h3>
                    </div>
                </div>
            </div>

            <div className="notas-grid">
                {records.length === 0 ? (
                    <div className="empty-state glass-card">
                        <FileText size={48} opacity={0.2} />
                        <h3>Nenhum registro encontrado</h3>
                        <p>Lançe suas notas manualmente ou sincronize com o governo.</p>
                    </div>
                ) : (
                    records.sort((a, b) => b.year - a.year).map(record => (
                        <motion.div
                            key={record.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card record-card"
                        >
                            <div className="card-top">
                                <div>
                                    <span className="year-tag">{record.year}</span>
                                    <h4>{record.title}</h4>
                                </div>
                                <div className="avg-badge">
                                    <small>MÉDIA</small>
                                    <strong>{record.average}</strong>
                                </div>
                            </div>

                            <div className="score-bars">
                                {Object.entries(record.scores).map(([label, value]) => (
                                    <div key={label} className="score-row">
                                        <span className="label">{label.charAt(0).toUpperCase() + label.slice(1)}</span>
                                        <div className="bar-wrapper">
                                            <div className="bar-fill" style={{ width: `${(value / 1000) * 100}%` }}></div>
                                            <span className="val">{value}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="card-actions">
                                <button className="icon-btn"><Edit3 size={16} /></button>
                                <button className="icon-btn delete" onClick={() => handleDelete(record.id)}><Trash2 size={16} /></button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Modal de Cadastro */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="modal-overlay">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="glass-card modal-content"
                        >
                            <div className="modal-header">
                                <h2>Registrar Novo Resultado</h2>
                                <p>Preencha as notas oficiais obtidas no vestibular.</p>
                            </div>

                            <div className="form-grid">
                                <div className="input-group">
                                    <label>Título do Exame</label>
                                    <input
                                        type="text"
                                        value={newRecord.title}
                                        onChange={e => setNewRecord({ ...newRecord, title: e.target.value })}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Ano</label>
                                    <input
                                        type="number"
                                        value={newRecord.year}
                                        onChange={e => setNewRecord({ ...newRecord, year: parseInt(e.target.value) })}
                                    />
                                </div>

                                {['natureza', 'humanas', 'linguagens', 'matematica', 'redacao'].map(key => (
                                    <div className="input-group" key={key}>
                                        <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                                        <input
                                            type="number"
                                            placeholder="0 - 1000"
                                            onChange={e => setNewRecord({
                                                ...newRecord,
                                                scores: { ...newRecord.scores!, [key]: parseFloat(e.target.value) }
                                            })}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="modal-footer">
                                <button className="ghost-btn" onClick={() => setIsModalOpen(false)}>CANCELAR</button>
                                <button className="neon-button" onClick={handleAddRecord}>SALVAR HISTÓRICO</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MinhasNotas;
