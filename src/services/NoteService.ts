export interface StudyNote {
    id: string;
    subject: string;
    theme: string;
    content: string;
    timestamp: Date;
}

const STORAGE_KEY = 'study_notes';

export const NoteService = {
    saveNote: (note: Omit<StudyNote, 'id' | 'timestamp'>): StudyNote => {
        const notes = NoteService.getNotes();
        const newNote: StudyNote = {
            ...note,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...notes, newNote]));
        return newNote;
    },

    getNotes: (): StudyNote[] => {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return [];
        try {
            return JSON.parse(data).map((n: any) => ({
                ...n,
                timestamp: new Date(n.timestamp)
            })).sort((a: any, b: any) => b.timestamp - a.timestamp);
        } catch (e) {
            console.error("Erro ao ler notas:", e);
            return [];
        }
    },

    getNotesBySubject: (subject: string): StudyNote[] => {
        return NoteService.getNotes().filter(n => n.subject === subject);
    },

    deleteNote: (id: string) => {
        const notes = NoteService.getNotes();
        const filtered = notes.filter(n => n.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    }
};
