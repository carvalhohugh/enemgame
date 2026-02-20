import React, { useState } from 'react';
import {
    BookOpen, ChevronRight, Video,
    Play, Info, ExternalLink, Loader2,
    ArrowLeft, GraduationCap, FileText, Save, PenTool, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContentService } from '../../services/ContentService';
import type { AcademicContent, RelatedVideo } from '../../services/ContentService';
import { BNCC_CURRICULUM } from '../../data/BNCCObjects';
import type { BNCCComponent, BNCCTheme } from '../../data/BNCCObjects';
import { NoteService } from '../../services/NoteService';
import './StudyHub.css';

const StudyHub: React.FC = () => {
    const [selectedStep, setSelectedStep] = useState<'subject' | 'year' | 'theme' | 'study' | 'questions'>('subject');
    const [selectedComp, setSelectedComp] = useState<BNCCComponent | null>(null);
    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const [selectedTheme, setSelectedTheme] = useState<BNCCTheme | null>(null);

    const [academicData, setAcademicData] = useState<AcademicContent | null>(null);
    const [videos, setVideos] = useState<RelatedVideo[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentVideo, setCurrentVideo] = useState<string | null>(null);

    // Note states
    const [showNotes, setShowNotes] = useState(false);
    const [noteContent, setNoteContent] = useState('');
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

    const handleSaveNote = () => {
        if (!selectedTheme || !selectedComp || !noteContent.trim()) return;
        setSaveStatus('saving');
        NoteService.saveNote({
            subject: selectedComp.name,
            theme: selectedTheme.title,
            content: noteContent
        });
        setTimeout(() => {
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        }, 800);
    };

    const handleBack = () => {
        if (selectedStep === 'year') setSelectedStep('subject');
        else if (selectedStep === 'theme') setSelectedStep('year');
        else if (selectedStep === 'study') setSelectedStep('theme');
    };

    const startStudy = async (theme: BNCCTheme) => {
        setSelectedTheme(theme);
        setSelectedStep('study');
        setIsLoading(true);

        try {
            const [summary, vids] = await Promise.all([
                ContentService.fetchTopicSummary(theme.title),
                ContentService.fetchRelatedVideos(theme.title)
            ]);
            setAcademicData(summary);
            setVideos(vids);
            if (vids.length > 0) setCurrentVideo(vids[0].id);
        } catch (error) {
            console.error("Erro ao carregar estudos:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const renderSubjectSelector = () => (
        <div className="hub-grid">
            {BNCC_CURRICULUM.map((comp) => (
                <motion.button
                    key={comp.name}
                    whileHover={{ scale: 1.02, translateY: -5 }}
                    onClick={() => { setSelectedComp(comp); setSelectedStep('year'); }}
                    className="glass-card comp-card"
                    style={{ '--accent-color': comp.color } as any}
                >
                    <div className="comp-icon">
                        <BookOpen size={32} />
                    </div>
                    <div>
                        <h3>{comp.name}</h3>
                        <p>{comp.years.length} Anos Disponíveis</p>
                    </div>
                    <ChevronRight className="arrow" />
                </motion.button>
            ))}
        </div>
    );

    const renderYearSelector = () => (
        <div className="hub-grid mini">
            {selectedComp?.years.map((y) => (
                <motion.button
                    key={y.year}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => { setSelectedYear(y.year); setSelectedStep('theme'); }}
                    className="glass-card year-card"
                >
                    <span className="year-label">{y.year}</span>
                    <p>{y.themes.length} Tópicos BNCC</p>
                </motion.button>
            ))}
        </div>
    );

    const renderThemeSelector = () => {
        const yearObj = selectedComp?.years.find(y => y.year === selectedYear);
        return (
            <div className="theme-list">
                {yearObj?.themes.map((theme) => (
                    <motion.div
                        key={theme.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card theme-item"
                        onClick={() => startStudy(theme)}
                    >
                        <div className="theme-info">
                            <h4>{theme.title}</h4>
                            <p>{theme.description}</p>
                        </div>
                        <button className="neon-button study-btn">
                            INICIAR <Play size={14} fill="white" />
                        </button>
                    </motion.div>
                ))}
            </div>
        );
    };

    const renderStudyMode = () => (
        <div className="study-focus-mode">
            {isLoading ? (
                <div className="hub-loader">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                        <Loader2 size={48} color="var(--primary)" />
                    </motion.div>
                    <p>Sincronizando com a Base de Conhecimento...</p>
                </div>
            ) : (
                <div className="study-layout">
                    <div className="study-main">
                        <div className="video-player-wrapper glass-card">
                            {currentVideo ? (
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${currentVideo}?autoplay=0`}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <div className="no-video">
                                    <Video size={48} opacity={0.2} />
                                    <p>Nenhuma vídeo-aula encontrada para este tema.</p>
                                </div>
                            )}
                        </div>

                        <div className="video-playlist">
                            <h4 style={{ marginBottom: '16px', fontSize: '1rem', fontWeight: 800 }}>VÍDEO-AULAS RELACIONADAS</h4>
                            <div className="playlist-items">
                                {videos.map(v => (
                                    <div
                                        key={v.id}
                                        className={`playlist-item ${currentVideo === v.id ? 'active' : ''}`}
                                        onClick={() => setCurrentVideo(v.id)}
                                    >
                                        <img src={v.thumbnail} alt={v.title} />
                                        <div className="v-info">
                                            <span className="v-title">{v.title}</span>
                                            <span className="v-channel">{v.channelTitle}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="study-content glass-card">
                        <div className="content-header">
                            <h2 style={{ fontSize: '2rem', fontWeight: 900 }}>{academicData?.title}</h2>
                            <div className="content-badges">
                                <span className="badge">BNCC</span>
                                <span className="badge">ENEM 2026</span>
                            </div>
                        </div>

                        <div className="content-body">
                            <p>{academicData?.summary}</p>

                            <div className="expert-source">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', marginBottom: '10px' }}>
                                    <Info size={18} />
                                    <strong>Nota Técnica</strong>
                                </div>
                                <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Este conteúdo foi curado sistematicamente para atender aos critérios de avaliação do INEP.</p>
                                <a href={academicData?.sourceUrl} target="_blank" rel="noreferrer" className="source-link">
                                    VER BASE COMPLETA <ExternalLink size={14} />
                                </a>
                            </div>
                        </div>

                        <div className="study-actions">
                            <button className="neon-button" style={{ flex: 1 }} onClick={() => setShowNotes(!showNotes)}>
                                <FileText size={18} /> {showNotes ? 'FECHAR NOTAS' : 'FAZER ANOTAÇÕES'}
                            </button>
                            <button className="neon-button" style={{ flex: 1, background: 'var(--accent)' }} onClick={() => setSelectedStep('questions')}>
                                <CheckCircle size={18} /> RESOLVER QUESTÕES
                            </button>
                        </div>
                    </div>

                    <AnimatePresence>
                        {showNotes && (
                            <motion.div
                                initial={{ x: 300, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 300, opacity: 0 }}
                                className="notepad-panel glass-card"
                            >
                                <div className="notepad-header">
                                    <h3><PenTool size={18} /> Bloco de Notas</h3>
                                    <button className="save-btn" onClick={handleSaveNote} disabled={saveStatus === 'saving'}>
                                        {saveStatus === 'saving' ? '...' : (saveStatus === 'saved' ? 'SALVO!' : <Save size={18} />)}
                                    </button>
                                </div>
                                <textarea
                                    placeholder="Comece suas anotações aqui..."
                                    value={noteContent}
                                    onChange={(e) => setNoteContent(e.target.value)}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );

    const renderQuestionsScreen = () => (
        <div className="questions-screen glass-card">
            <div className="quiz-header">
                <h2>Simulado Rápido: {selectedTheme?.title}</h2>
                <div className="quiz-progress-bar">
                    <div className="q-fill" style={{ width: '40%' }}></div>
                </div>
            </div>

            <div className="question-body">
                <span className="q-number">QUESTÃO 01 DE 05</span>
                <p className="q-text">
                    Considerando o tema "{selectedTheme?.title}" no contexto do ENEM, qual das alternativas abaixo melhor descreve a principal competência avaliada?
                </p>

                <div className="options-list">
                    {[
                        'Análise crítica de fontes históricas e literárias.',
                        'Resolução de problemas complexos com lógica matemática.',
                        'Interpretação de textos e fenômenos naturais.',
                        'Aplicação de conhecimentos técnicos em situações reais.'
                    ].map((opt, i) => (
                        <button key={i} className="option-btn">
                            <span className="opt-letter">{'ABCD'[i]}</span>
                            {opt}
                        </button>
                    ))}
                </div>
            </div>

            <div className="quiz-footer">
                <button className="neon-button" style={{ background: 'rgba(255,255,255,0.05)' }} onClick={() => setSelectedStep('study')}>
                    VOLTAR PARA O CONTEÚDO
                </button>
                <button className="neon-button">PRÓXIMA QUESTÃO <ArrowLeft size={18} style={{ rotate: '180deg' }} /></button>
            </div>
        </div>
    );

    return (
        <div className="study-hub-container">
            <header className="hub-header">
                <div>
                    {selectedStep !== 'subject' && (
                        <button className="back-btn" onClick={handleBack}>
                            <ArrowLeft size={18} /> VOLTAR
                        </button>
                    )}
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginTop: '8px' }}>
                        Hub de <span style={{ color: 'var(--clan-color)' }}>Estudos</span> 🚀
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {selectedStep === 'subject' && "Selecione um componente curricular para começar."}
                        {selectedStep === 'year' && `Expandindo ${selectedComp?.name}...`}
                        {selectedStep === 'theme' && `Tópicos do ${selectedYear}`}
                        {selectedStep === 'study' && `Foco Ativo: ${selectedTheme?.title}`}
                    </p>
                </div>

                <div className="hub-stats glass-card">
                    <GraduationCap size={20} color="var(--primary)" />
                    <div>
                        <span className="label">QUESTÕES HOJE</span>
                        <span className="val">12/50</span>
                    </div>
                </div>
            </header>

            <main className="hub-content">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedStep}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                    >
                        {selectedStep === 'subject' && renderSubjectSelector()}
                        {selectedStep === 'year' && renderYearSelector()}
                        {selectedStep === 'theme' && renderThemeSelector()}
                        {selectedStep === 'study' && renderStudyMode()}
                        {selectedStep === 'questions' && renderQuestionsScreen()}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};

export default StudyHub;
