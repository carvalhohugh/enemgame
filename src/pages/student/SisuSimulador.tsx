import React, { useState, useEffect } from 'react';
import {
    Search, Target,
    ArrowRight, MapPin,
    CheckCircle,
    XCircle, Filter,
    AlertCircle, Info
} from 'lucide-react';
import { motion } from 'framer-motion';
import './SisuSimulador.css';

interface University {
    id: string;
    name: string;
    location: string;
    course: string;
    cutoff: number;
    trend: 'up' | 'down' | 'stable';
}

const MOCK_UNIVERSITIES: University[] = [
    { id: '1', name: 'USP - Universidade de São Paulo', location: 'São Paulo - SP', course: 'Medicina', cutoff: 812.5, trend: 'up' },
    { id: '2', name: 'UFRJ - Federal do Rio de Janeiro', location: 'Rio de Janeiro - RJ', course: 'Direito', cutoff: 765.2, trend: 'stable' },
    { id: '3', name: 'UFMG - Federal de Minas Gerais', location: 'Belo Horizonte - MG', course: 'Engenharia Civil', cutoff: 742.8, trend: 'down' },
    { id: '4', name: 'UnB - Universidade de Brasília', location: 'Brasília - DF', course: 'Relações Internacionais', cutoff: 735.4, trend: 'up' },
    { id: '5', name: 'UFRGS - Federal do Rio Grande do Sul', location: 'Porto Alegre - RS', course: 'Psicologia', cutoff: 728.1, trend: 'stable' },
    { id: '6', name: 'UFPE - Federal de Pernambuco', location: 'Recife - PE', course: 'Ciência da Computação', cutoff: 715.6, trend: 'up' },
    { id: '7', name: 'UFC - Federal do Ceará', location: 'Fortaleza - CE', course: 'Medicina', cutoff: 798.2, trend: 'up' },
    { id: '8', name: 'UFSC - Federal de Santa Catarina', location: 'Florianópolis - SC', course: 'Arquitetura', cutoff: 725.5, trend: 'stable' },
    { id: '9', name: 'UFBA - Federal da Bahia', location: 'Salvador - BA', course: 'Odontologia', cutoff: 738.9, trend: 'up' },
    { id: '10', name: 'Unicamp', location: 'Campinas - SP', course: 'Engenharia de Software', cutoff: 785.4, trend: 'up' },
    { id: '11', name: 'UFPR - Federal do Paraná', location: 'Curitiba - PR', course: 'Medicina Veterinária', cutoff: 712.3, trend: 'down' },
    { id: '12', name: 'UFG - Federal de Goiás', location: 'Goiânia - GO', course: 'Agronomia', cutoff: 685.7, trend: 'stable' }
];

const SisuSimulador: React.FC = () => {
    const [userAverage, setUserAverage] = useState<number>(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('Todos');

    useEffect(() => {
        const savedRecords = localStorage.getItem('enem_notas_historico');
        if (savedRecords) {
            const records = JSON.parse(savedRecords);
            if (records.length > 0) {
                const latest = records.sort((a: any, b: any) => b.year - a.year)[0];
                setUserAverage(latest.average || 0);
            }
        }
    }, []);

    const getProbability = (cutoff: number) => {
        const diff = userAverage - cutoff;
        if (diff >= 10) return { label: 'ALTA', color: '#10b981', icon: <CheckCircle size={16} />, status: 'safe' };
        if (diff >= -10) return { label: 'MÉDIA', color: '#f59e0b', icon: <AlertCircle size={16} />, status: 'warning' };
        return { label: 'BAIXA', color: '#ef4444', icon: <XCircle size={16} />, status: 'danger' };
    };

    const filteredUnis = MOCK_UNIVERSITIES.filter(uni =>
        (uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            uni.course.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (selectedCourse === 'Todos' || uni.course === selectedCourse)
    );

    return (
        <div className="sisu-container">
            <header className="sisu-header">
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900 }}>Simulador <span className="text-gradient">Sisu</span> 🎓</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Compare sua média com as notas de corte reais e preveja sua aprovação.</p>
                </div>
                <div className="user-score-display glass-card">
                    <div className="score-main">
                        <small>SUA MÉDIA ATUAL</small>
                        <h2>{userAverage > 0 ? userAverage : '--'}</h2>
                    </div>
                    <Target color="var(--primary)" size={32} opacity={0.5} />
                </div>
            </header>

            <div className="sisu-search-bar glass-card">
                <div className="search-input">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Buscar universidade ou curso..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="filter-select">
                    <Filter size={18} />
                    <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                        <option value="Todos">Todos os Cursos</option>
                        <option value="Medicina">Medicina</option>
                        <option value="Direito">Direito</option>
                        <option value="Engenharia Civil">Engenharia Civil</option>
                        <option value="Ciência da Computação">Ciência da Computação</option>
                        <option value="Psicologia">Psicologia</option>
                        <option value="Relações Internacionais">Relações Internacionais</option>
                    </select>
                </div>
            </div>

            <div className="sisu-grid">
                {filteredUnis.map(uni => {
                    const prob = getProbability(uni.cutoff);
                    return (
                        <motion.div
                            key={uni.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`glass-card uni-card ${prob.status}`}
                        >
                            <div className="uni-info">
                                <span className="course-tag">{uni.course}</span>
                                <h4>{uni.name}</h4>
                                <div className="location">
                                    <MapPin size={12} /> {uni.location}
                                </div>
                            </div>

                            <div className="uni-data">
                                <div className="data-item">
                                    <small>NOTA DE CORTE</small>
                                    <strong>{uni.cutoff}</strong>
                                    <span className={`trend ${uni.trend}`}>
                                        {uni.trend === 'up' ? '▲' : uni.trend === 'down' ? '▼' : '●'}
                                    </span>
                                </div>
                                <div className="data-item">
                                    <small>PROBABILIDADE</small>
                                    <div className="prob-status" style={{ color: prob.color }}>
                                        {prob.icon} {prob.label}
                                    </div>
                                </div>
                            </div>

                            <div className="prob-gauge">
                                <div className="gauge-bg">
                                    <motion.div
                                        className="gauge-fill"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(100, (userAverage / uni.cutoff) * 100)}%` }}
                                        style={{ backgroundColor: prob.color }}
                                    />
                                </div>
                            </div>

                            <button className="view-details-btn">
                                VER DETALHES <ArrowRight size={14} />
                            </button>
                        </motion.div>
                    );
                })}
            </div>

            <aside className="sisu-tips glass-card">
                <h3><Info size={18} /> Dicas do Especialista</h3>
                <ul>
                    <li>Universidades com bônus regional podem mudar sua posição.</li>
                    <li>Sua nota está {userAverage > 750 ? 'excelente' : 'em evolução'}. Foco em Redação para subir a média!</li>
                    <li>O Sisu 2026 terá maior peso em Matemática para cursos de Exatas.</li>
                </ul>
            </aside>
        </div>
    );
};

export default SisuSimulador;
