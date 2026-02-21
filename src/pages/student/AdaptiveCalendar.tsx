import React, { useState, useEffect } from 'react';
import {
    ChevronLeft,
    ChevronRight, Zap, BookOpen, Target, CheckCircle,
    Play, Square, Settings as SettingsIcon, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { XPService } from '../../services/XPService';
import './AdaptiveCalendar.css';

interface ScheduleItem {
    id: string;
    time: string;
    duration: string;
    subject: string;
    theme: string;
    type: 'theory' | 'practice' | 'video' | 'quiz';
    completed?: boolean;
}

const MOCK_SCHEDULE: ScheduleItem[] = [
    { id: '1', time: '08:00', duration: '1h 30m', subject: 'Matemática', theme: 'Análise Combinatória', type: 'theory' },
    { id: '2', time: '10:00', duration: '1h', subject: 'Redação', theme: 'Prática de Argumentação', type: 'practice' },
    { id: '3', time: '14:00', duration: '2h', subject: 'Humanas', theme: 'Idade Média', type: 'video' },
    { id: '4', time: '16:30', duration: '45m', subject: 'Simulado', theme: 'Revisão Semanal', type: 'quiz' },
];

const AdaptiveCalendar: React.FC = () => {
    const [viewDate, setViewDate] = useState(new Date());
    const [schedule, setSchedule] = useState<ScheduleItem[]>(MOCK_SCHEDULE);
    const [activeSession, setActiveSession] = useState<string | null>(null);
    const [secondsElapsed, setSecondsElapsed] = useState(0);
    const [showSettings, setShowSettings] = useState(false);

    // User Prefs
    const [hoursPerDay, setHoursPerDay] = useState(6);
    const [daysPerWeek, setDaysPerWeek] = useState(5);

    useEffect(() => {
        let interval: any;
        if (activeSession) {
            interval = setInterval(() => {
                setSecondsElapsed(prev => prev + 1);
            }, 1000);
        } else {
            setSecondsElapsed(0);
        }
        return () => clearInterval(interval);
    }, [activeSession]);

    const formatTimer = (sec: number) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleStartSession = (id: string) => {
        setActiveSession(id);
    };

    const handleFinishSession = (id: string) => {
        const isQualified = secondsElapsed >= 15 * 60; // 15 minutos

        setSchedule(prev => prev.map(item =>
            item.id === id ? { ...item, completed: true } : item
        ));

        setActiveSession(null);

        if (isQualified) {
            XPService.addXP(100);
            alert('Parabéns! Você estudou por mais de 15 minutos e ganhou 100 XP! 🚀');
        } else {
            alert('Sessão finalizada. Estude por pelo menos 15 minutos para ganhar XP.');
        }
    };

    const changeDay = (offset: number) => {
        const next = new Date(viewDate);
        next.setDate(viewDate.getDate() + offset);
        setViewDate(next);
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    return (
        <div className="adaptive-calendar-container">
            <header className="calendar-header">
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900 }}>Plano <span style={{ color: 'var(--primary)' }}>Adaptativo</span> 🗓️</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Sugestão dinâmica baseada no seu ritmo e metas do ENEM.</p>
                </div>

                <div className="date-picker-mini glass-card">
                    <button onClick={() => changeDay(-1)}><ChevronLeft size={20} /></button>
                    <span className={isToday(viewDate) ? 'today-highlight' : ''}>
                        {viewDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
                    </span>
                    <button onClick={() => changeDay(1)}><ChevronRight size={20} /></button>
                </div>
            </header>

            <div className="calendar-layout">
                <main className="timeline-container glass-card">
                    <div className="timeline-header">
                        <div className="day-selector">
                            {['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'].map((d) => {
                                const days = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
                                const dayIndex = viewDate.getDay();
                                const isCurrent = days[dayIndex] === d;
                                return (
                                    <button key={d} className={`day-btn ${isCurrent ? 'active' : ''}`}>{d}</button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="timeline-body">
                        {schedule.map((item, i) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className={`timeline-item ${item.completed ? 'completed' : ''}`}
                            >
                                <div className="time-col">
                                    <span className="time">{item.time}</span>
                                    <span className="duration">{item.duration}</span>
                                </div>
                                <div className="event-card glass-card">
                                    <div className={`status-line ${item.type}`}></div>
                                    <div className="event-info">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span className="event-subject">{item.subject}</span>
                                            {item.completed && <CheckCircle size={14} color="#10b981" />}
                                        </div>
                                        <h3 className="event-title">{item.theme}</h3>
                                    </div>
                                    <div className="event-actions">
                                        {item.completed ? (
                                            <span className="xp-badge">+100 XP</span>
                                        ) : activeSession === item.id ? (
                                            <div className="active-timer-group">
                                                <span className="live-timer">{formatTimer(secondsElapsed)}</span>
                                                <button className="neon-button mini finish-btn" onClick={() => handleFinishSession(item.id)}>
                                                    FINALIZAR <Square size={12} fill="white" />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                className="neon-button mini"
                                                disabled={!!activeSession}
                                                onClick={() => handleStartSession(item.id)}
                                            >
                                                INICIAR <Play size={12} fill="white" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </main>

                <aside className="calendar-sidebar">
                    <div className="glass-card smart-insights">
                        <h3><Zap size={18} color="var(--primary)" /> SMART INSIGHTS</h3>
                        <div className="insight-item">
                            <div className="insight-icon"><Target size={18} /></div>
                            <p>Seu rendimento em <strong>Probabilidade</strong> caiu 15%. Sugerimos reforço amanhã.</p>
                        </div>
                        <div className="insight-item">
                            <div className="insight-icon"><BookOpen size={18} /></div>
                            <p>Parabéns! Você concluiu 80% da trilha de <strong>Natureza</strong> desta semana.</p>
                        </div>
                    </div>

                    <div className="glass-card load-meter">
                        <h3>CARGA DE ESTUDO</h3>
                        <div className="meter-visual">
                            <div className="meter-fill" style={{ width: `${(schedule.filter(s => s.completed).length / schedule.length) * 100}%` }}></div>
                        </div>
                        <span className="meter-label">{schedule.filter(s => s.completed).length * 1.5}h / {hoursPerDay}h Diárias</span>
                    </div>

                    <div className="glass-card recommendations-sidebar">
                        <h3>📚 PARA VOCÊ</h3>
                        <div className="rec-list">
                            {[
                                { title: 'Redação: Coesão', type: 'Prática' },
                                { title: 'Cinemática Escalar', type: 'Teoria' },
                                { title: 'Brasil Colônia', type: 'Vídeo' }
                            ].map((rec, i) => (
                                <div key={i} className="rec-item">
                                    <div className="rec-info">
                                        <span className="rec-type">{rec.type}</span>
                                        <span className="rec-title">{rec.title}</span>
                                    </div>
                                    <ChevronRight size={14} />
                                </div>
                            ))}
                        </div>
                        <button className="view-all-link">Ver Hub Completo</button>
                    </div>

                    <button className="neon-button settings-btn" onClick={() => setShowSettings(true)}>
                        <SettingsIcon size={18} /> AJUSTAR DISPONIBILIDADE
                    </button>
                </aside>
            </div>

            <AnimatePresence>
                {showSettings && (
                    <div className="modal-overlay">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="glass-card settings-modal"
                        >
                            <div className="modal-header">
                                <h2>Configurar Rotina</h2>
                                <button className="close-btn" onClick={() => setShowSettings(false)}><X /></button>
                            </div>

                            <div className="settings-form">
                                <div className="form-group">
                                    <label>Horas de Estudo por Dia</label>
                                    <div className="range-group">
                                        <input
                                            type="range" min="1" max="12"
                                            value={hoursPerDay}
                                            onChange={(e) => setHoursPerDay(parseInt(e.target.value))}
                                        />
                                        <span className="range-val">{hoursPerDay}h</span>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Dias de Estudo por Semana</label>
                                    <select value={daysPerWeek} onChange={(e) => setDaysPerWeek(parseInt(e.target.value))}>
                                        <option value={5}>5 Dias (Foco Total)</option>
                                        <option value={6}>6 Dias (Intensivo)</option>
                                        <option value={7}>7 Dias (Elite)</option>
                                    </select>
                                </div>

                                <button className="neon-button save-settings" onClick={() => setShowSettings(false)}>
                                    SALVAR PREFERÊNCIAS
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdaptiveCalendar;
