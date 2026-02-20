import React, { useState } from 'react';
import { Video, FileText, X, GraduationCap, ExternalLink, Loader2 } from 'lucide-react';
import StudyQuiz from './StudyQuiz';
import { ContentService } from '../../services/ContentService';
import type { AcademicContent } from '../../services/ContentService';
import { motion, AnimatePresence } from 'framer-motion';
import './Trilhas.css';


const CONTENT_DATA = [
    {
        area: "Matemática",
        color: "var(--primary)",
        contents: [
            { id: 1, title: "Função afim", type: "video", duration: "12min", status: "Concluído" },
            { id: 2, title: "Geometria plana", type: "text", duration: "15min", status: "Em progresso" },
            { id: 3, title: "Probabilidade", type: "exercise", duration: "20 questões", status: "Bloqueado" },
        ]
    },
    {
        area: "Linguagens",
        color: "var(--secondary)",
        contents: [
            { id: 4, title: "Modernismo no Brasil", type: "video", duration: "18min", status: "Novo" },
            { id: 5, title: "Figuras de linguagem", type: "text", duration: "10min", status: "Novo" },
        ]
    }
];

interface TrailContent {
    id: number;
    title: string;
    type: string;
    duration: string;
    status: string;
}

const Trilhas: React.FC = () => {
    const [selectedYear, setSelectedYear] = useState("3º Ano");
    const [selectedContent, setSelectedContent] = useState<TrailContent | null>(null);
    const [academicData, setAcademicData] = useState<AcademicContent | null>(null);
    const [isLoadingContent, setIsLoadingContent] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);

    const handleStudy = async (content: TrailContent) => {
        setSelectedContent(content);
        setIsLoadingContent(true);
        const data = await ContentService.fetchTopicSummary(content.title);
        setAcademicData(data);
        setIsLoadingContent(false);
    };

    const handleQuizComplete = (success: boolean) => {
        if (success) {
            alert("Parabéns! Conteúdo dominado. +500 XP");
        }
        setSelectedContent(null);
        setAcademicData(null);
        setShowQuiz(false);
    };

    return (
        <div className="trilhas-container">
            <header className="trilhas-filters">
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
                        Trilhas <span style={{ color: 'var(--clan-color)' }}>BNCC</span> 📚
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Jornada de conhecimento organizada por competências reais.</p>
                </div>
                <div className="years-selector">
                    {["1º Ano", "2º Ano", "3º Ano"].map(year => (
                        <button
                            key={year}
                            className={`year-btn ${selectedYear === year ? 'active' : ''}`}
                            onClick={() => setSelectedYear(year)}
                        >
                            {year}
                        </button>
                    ))}
                </div>
            </header>

            <div className="content-tracks">
                {CONTENT_DATA.map((track, i) => (
                    <section key={i} className="track-lane">
                        <div className="lane-header">
                            <div
                                className="lane-indicator"
                                style={{ width: '4px', height: '24px', background: track.color, borderRadius: '2px' }}
                            />
                            {track.area}
                        </div>
                        <div className="content-cards-row">
                            {track.contents.map(content => (
                                <motion.div
                                    key={content.id}
                                    whileHover={{ translateY: -5 }}
                                    className="glass-card content-card"
                                >
                                    <div className="content-icon" style={{ borderColor: track.color, color: track.color }}>
                                        {(content.type === 'video' || content.type === 'exercise') ? <Video size={20} /> : <FileText size={20} />}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ marginBottom: '4px' }}>{content.title}</h4>
                                        <div className="content-meta">
                                            <span>{content.type.toUpperCase()}</span>
                                            <span style={{ opacity: 0.5 }}>•</span>
                                            <span>{content.duration}</span>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                        <span style={{
                                            fontSize: '0.7rem',
                                            fontWeight: 700,
                                            color: content.status === 'Concluído' ? 'var(--accent)' : 'var(--text-secondary)'
                                        }}>
                                            {content.status}
                                        </span>
                                        <button
                                            className="neon-button"
                                            style={{ padding: '6px 12px', fontSize: '0.7rem' }}
                                            disabled={content.status === 'Bloqueado'}
                                            onClick={() => handleStudy(content)}
                                        >
                                            ESTUDAR
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>

            <AnimatePresence>
                {selectedContent && (
                    <div className="content-overlay">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            className="glass-card study-modal"
                        >
                            <button
                                className="close-btn"
                                onClick={() => { setSelectedContent(null); setAcademicData(null); setShowQuiz(false); }}
                            >
                                <X size={24} />
                            </button>

                            {!showQuiz ? (
                                <>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--clan-color)', marginBottom: '16px' }}>
                                        <GraduationCap size={32} />
                                        <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '1px' }}>CONTEÚDO PREMIUM</span>
                                    </div>

                                    <h1 style={{ fontSize: '2.5rem', marginBottom: '24px', fontWeight: 900 }}>{selectedContent.title}</h1>

                                    {isLoadingContent ? (
                                        <div style={{ padding: '60px', textAlign: 'center' }}>
                                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ color: 'var(--primary)', marginBottom: '16px' }}>
                                                <Loader2 size={48} />
                                            </motion.div>
                                            <p style={{ color: 'var(--text-secondary)' }}>Consultando base de conhecimento...</p>
                                        </div>
                                    ) : (
                                        <div className="study-body">
                                            {academicData?.thumbnail && (
                                                <img src={academicData.thumbnail} alt={academicData.title} style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '12px', marginBottom: '24px', border: '1px solid var(--bg-card-border)' }} />
                                            )}
                                            <p style={{ lineHeight: '1.8', color: '#cbd5e1', fontSize: '1.15rem' }}>
                                                {academicData?.summary}
                                            </p>

                                            <div style={{ marginTop: '32px', padding: '24px', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '16px', border: '1px solid var(--bg-card-border)' }}>
                                                <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    🔍 Fonte do Especialista
                                                </h3>
                                                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                                                    Conteúdo sincronizado para os objetivos do ENEM 2026.
                                                </p>
                                                <a href={academicData?.sourceUrl} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
                                                    Ler artigo completo <ExternalLink size={14} />
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    <div style={{ marginTop: '40px', display: 'flex', gap: '16px' }}>
                                        <button className="neon-button" style={{ flex: 1, opacity: 0.5 }} disabled>VÍDEO AULA (EM BREVE)</button>
                                        <button
                                            className="neon-button"
                                            style={{ flex: 1, background: 'var(--accent)' }}
                                            onClick={() => setShowQuiz(true)}
                                            disabled={isLoadingContent}
                                        >
                                            INICIAR QUIZ DE COMBATE
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <StudyQuiz
                                    topic={selectedContent.title}
                                    onComplete={handleQuizComplete}
                                />
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Trilhas;
