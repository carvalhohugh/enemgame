import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import './Calendario.css';

const Calendario: React.FC = () => {

    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const weekDays = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];

    return (
        <div className="calendar-container">
            <div className="calendar-main section">
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Meu Planejamento 🗓️</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>Faltam 245 dias para o ENEM. Mantenha o foco!</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <button className="neon-button" style={{ padding: '8px' }}><Plus size={20} /></button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: '8px' }}>
                            <ChevronLeft size={16} style={{ cursor: 'pointer' }} />
                            <strong style={{ minWidth: '120px', textAlign: 'center' }}>FEVEREIRO 2026</strong>
                            <ChevronRight size={16} style={{ cursor: 'pointer' }} />
                        </div>
                    </div>
                </header>

                <div className="glass-card" style={{ padding: '24px' }}>
                    <div className="calendar-grid">
                        {weekDays.map(d => <div key={d} className="calendar-day-header">{d}</div>)}
                        {days.map(d => (
                            <div key={d} className={`calendar-day ${d === 19 ? 'today' : ''}`}>
                                <span className="day-number">{d}</span>
                                {d % 2 === 0 && <div className="event-dot study" title="Estudo Planejado" />}
                                {d % 7 === 1 && <div className="event-dot school" title="Prova Escolar" />}
                                {d === 25 && <div className="event-dot work" title="Plantão Trabalho" />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <aside className="agenda-sidebar">
                <div className="glass-card" style={{ padding: '24px' }}>
                    <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CalendarIcon size={20} /> Ordem do Dia
                    </h3>
                    <div className="agenda-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div className="agenda-item">
                            <div style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700 }}>09:00 - 10:30</div>
                            <div style={{ fontWeight: 600 }}>📚 Matemática: Funções</div>
                        </div>
                        <div className="agenda-item" style={{ borderColor: 'var(--clan-titas)' }}>
                            <div style={{ fontSize: '0.7rem', color: 'var(--clan-titas)', fontWeight: 700 }}>14:00 - 17:00</div>
                            <div style={{ fontWeight: 600 }}>🏛️ Escola: Simulado</div>
                        </div>
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '24px' }}>
                    <h3 style={{ marginBottom: '16px' }}>Legenda de Herói</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className="event-dot study" style={{ width: 12, height: 12, borderRadius: '2px' }} />
                            Missão de Estudo
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className="event-dot school" style={{ width: 12, height: 12, borderRadius: '2px' }} />
                            Eventos Escolares
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className="event-dot work" style={{ width: 12, height: 12, borderRadius: '2px' }} />
                            Trabalho / Extra
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default Calendario;
