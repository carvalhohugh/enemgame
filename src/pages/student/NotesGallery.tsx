import React, { useState, useEffect } from 'react';
import {
    BookOpen, FileText, Search, Trash2,
    X, Calendar, Clock, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NoteService } from '../../services/NoteService';
import type { StudyNote } from '../../services/NoteService';
import './NotesGallery.css';

const NotesGallery: React.FC = () => {
    const [notes, setNotes] = useState<StudyNote[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedNote, setSelectedNote] = useState<StudyNote | null>(null);

    useEffect(() => {
        loadNotes();
    }, []);

    const loadNotes = () => {
        setNotes(NoteService.getNotes());
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm("Deseja realmente excluir esta anotação?")) {
            NoteService.deleteNote(id);
            loadNotes();
        }
    };

    const filteredNotes = notes.filter(n =>
        n.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.theme.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const groupedNotes = filteredNotes.reduce((acc, note) => {
        if (!acc[note.subject]) acc[note.subject] = [];
        acc[note.subject].push(note);
        return acc;
    }, {} as Record<string, StudyNote[]>);

    return (
        <div className="notes-gallery-container">
            <header className="notes-header">
                <div>
                    <h1>Minhas <span style={{ color: 'var(--primary)' }}>Anotações</span> 📒</h1>
                    <p>Todo o seu conhecimento organizado sistematicamente.</p>
                </div>
                <div className="notes-search glass-card">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Buscar em temas ou conteúdo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            <div className="notes-content">
                {Object.entries(groupedNotes).length === 0 ? (
                    <div className="empty-notes glass-card">
                        <FileText size={64} opacity={0.1} />
                        <h3>Nenhuma anotação encontrada</h3>
                        <p>Comece a estudar no Hub para registrar seus insights.</p>
                        <button className="neon-button" style={{ marginTop: '16px' }}>IR PARA O HUB</button>
                    </div>
                ) : (
                    Object.entries(groupedNotes).map(([subject, subjectNotes]) => (
                        <section key={subject} className="subject-section">
                            <h2 className="subject-tag"><BookOpen size={20} /> {subject.toUpperCase()}</h2>
                            <div className="notes-grid">
                                {subjectNotes.map(note => (
                                    <motion.div
                                        key={note.id}
                                        whileHover={{ scale: 1.02, translateY: -5 }}
                                        className="glass-card note-card"
                                        onClick={() => setSelectedNote(note)}
                                    >
                                        <div className="note-card-header">
                                            <span className="note-theme">{note.theme}</span>
                                            <button className="delete-btn" onClick={(e) => handleDelete(note.id, e)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <p className="note-preview">{note.content}</p>
                                        <div className="note-card-footer">
                                            <span><Calendar size={12} /> {note.timestamp.toLocaleDateString()}</span>
                                            <ArrowRight size={16} className="arrow" />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    ))
                )}
            </div>

            <AnimatePresence>
                {selectedNote && (
                    <div className="modal-overlay" onClick={() => setSelectedNote(null)}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="glass-card note-detail-modal"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="modal-header">
                                <div className="modal-title-group">
                                    <span className="subject-label">{selectedNote.subject}</span>
                                    <h2>{selectedNote.theme}</h2>
                                </div>
                                <button className="close-btn" onClick={() => setSelectedNote(null)}><X /></button>
                            </div>
                            <div className="modal-meta">
                                <span><Calendar size={14} /> {selectedNote.timestamp.toLocaleDateString()}</span>
                                <span><Clock size={14} /> {selectedNote.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className="note-full-content">
                                {selectedNote.content.split('\n').map((para, i) => (
                                    <p key={i}>{para}</p>
                                ))}
                            </div>
                            <div className="modal-actions">
                                <button className="neon-button" onClick={() => setSelectedNote(null)}>FECHAR</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotesGallery;
