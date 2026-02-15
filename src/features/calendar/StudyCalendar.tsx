
import { useState } from 'react';

import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, BookOpen, Video } from 'lucide-react';

const DAYS_OF_WEEK = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

type EventType = 'class' | 'exam' | 'study';

interface CalendarEvent {
    id: string;
    title: string;
    date: Date;
    type: EventType;
    time: string;
}

// Mock events for the current month
const MOCK_EVENTS: CalendarEvent[] = [
    { id: '1', title: 'Aulão de Redação', date: new Date(new Date().setDate(new Date().getDate() + 1)), type: 'class', time: '19:00' },
    { id: '2', title: 'Simulado ENEM Dia 1', date: new Date(new Date().setDate(new Date().getDate() + 3)), type: 'exam', time: '13:00' },
    { id: '3', title: 'Revisão Matemática', date: new Date(new Date().setDate(new Date().getDate() + 5)), type: 'study', time: '14:00' },
    { id: '4', title: 'Mentoria em Grupo', date: new Date(new Date().setDate(new Date().getDate() + 8)), type: 'class', time: '20:00' },
];

export default function StudyCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month, 1).getDay();
    };

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);

    // Generate calendar grid
    const days = [];
    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="h-24 bg-white/5 rounded-lg opacity-50"></div>);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        // const _date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
        const dayEvents = MOCK_EVENTS.filter(e => e.date.getDate() === i && e.date.getMonth() === currentDate.getMonth());
        const isToday = new Date().getDate() === i && new Date().getMonth() === currentDate.getMonth();

        days.push(
            <div key={i} className={`h-24 bg-white/5 rounded-lg p-2 border ${isToday ? 'border-yellow-500' : 'border-white/10 hover:border-white/30'} transition-all relative overflow-hidden group`}>
                <span className={`text-sm font-semibold ${isToday ? 'text-yellow-500' : 'text-white/70'}`}>{i}</span>
                <div className="mt-1 space-y-1">
                    {dayEvents.map(event => (
                        <div key={event.id} className="text-[10px] p-1 rounded bg-indigo-500/20 text-indigo-200 truncate border border-indigo-500/30 flex items-center gap-1">
                            {event.type === 'class' && <Video size={10} />}
                            {event.type === 'exam' && <BookOpen size={10} />}
                            {event.type === 'study' && <Clock size={10} />}
                            {event.title}
                        </div>
                    ))}
                </div>
                {/* Add Event Button (Hover) */}
                <button className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 hover:bg-white/20 p-1 rounded">
                    <span className="text-[10px] text-white">+</span>
                </button>
            </div>
        );
    }

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    return (
        <div className="bg-[#121214] rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-500/10 rounded-lg">
                        <CalendarIcon className="text-yellow-500 w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Calendário de Estudos</h2>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <ChevronLeft className="w-5 h-5 text-white/70" />
                    </button>
                    <span className="text-white font-medium min-w-[120px] text-center">
                        {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <ChevronRight className="w-5 h-5 text-white/70" />
                    </button>
                </div>
            </div>

            {/* Week Headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
                {DAYS_OF_WEEK.map(day => (
                    <div key={day} className="text-center text-xs font-semibold text-white/40 uppercase tracking-wider py-2">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
                {days}
            </div>
        </div>
    );
}
