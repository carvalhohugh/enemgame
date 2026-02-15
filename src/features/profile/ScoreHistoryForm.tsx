import { useState } from 'react';
import { X } from 'lucide-react';
import type { ExamScore, ExamType } from './types';
import { EXAM_TYPE_LABELS, SCORE_FIELDS } from './types';

interface ScoreHistoryFormProps {
    onSubmit: (score: ExamScore) => void;
    onCancel: () => void;
}

export default function ScoreHistoryForm({ onSubmit, onCancel }: ScoreHistoryFormProps) {
    const currentYear = new Date().getFullYear();
    const [form, setForm] = useState({
        type: 'enem' as ExamType,
        name: '',
        year: currentYear,
        linguagens: '',
        humanas: '',
        natureza: '',
        matematica: '',
        redacao: '',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const scores: ExamScore['scores'] = {};
        let total = 0;
        let count = 0;

        SCORE_FIELDS.forEach(field => {
            const val = parseFloat(form[field.key]);
            if (!isNaN(val) && val >= 0 && val <= field.max) {
                scores[field.key] = val;
                total += val;
                count++;
            }
        });

        if (count === 0) return; // At least one score required

        const examName = form.name || `${EXAM_TYPE_LABELS[form.type]} ${form.year}`;

        onSubmit({
            id: crypto.randomUUID(),
            type: form.type,
            name: examName,
            year: form.year,
            date: new Date().toISOString(),
            scores,
            totalScore: Math.round(total / count),
            notes: form.notes || undefined,
        });
    };

    return (
        <div className="bg-dark-surface rounded-2xl border border-white/10 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h3 className="font-semibold text-white">Registrar Nota</h3>
                <button onClick={onCancel} className="p-1 rounded-lg hover:bg-white/10 transition-colors">
                    <X className="w-5 h-5 text-white/50" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Exam Type & Year */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">Tipo</label>
                        <select
                            value={form.type}
                            onChange={(e) => setForm(prev => ({ ...prev, type: e.target.value as ExamType }))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple/50 transition-colors"
                        >
                            {Object.entries(EXAM_TYPE_LABELS).map(([key, label]) => (
                                <option key={key} value={key} className="bg-dark-surface">{label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">Ano</label>
                        <input
                            type="number"
                            min={2000}
                            max={currentYear + 1}
                            value={form.year}
                            onChange={(e) => setForm(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple/50 transition-colors"
                        />
                    </div>
                </div>

                {/* Name (optional) */}
                <div>
                    <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">Nome do Exame (opcional)</label>
                    <input
                        type="text"
                        placeholder={`${EXAM_TYPE_LABELS[form.type]} ${form.year}`}
                        value={form.name}
                        onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple/50 transition-colors"
                    />
                </div>

                {/* Score Inputs */}
                <div>
                    <label className="block text-xs text-white/50 mb-3 uppercase tracking-wider">Notas por Área</label>
                    <div className="space-y-2">
                        {SCORE_FIELDS.map(field => (
                            <div key={field.key} className="flex items-center gap-3">
                                <span className="text-lg w-8 text-center">{field.icon}</span>
                                <span className="flex-1 text-sm text-white/70">{field.label}</span>
                                <input
                                    type="number"
                                    min={0}
                                    max={field.max}
                                    step={0.1}
                                    placeholder="—"
                                    value={form[field.key]}
                                    onChange={(e) => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                                    className="w-24 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white text-right placeholder:text-white/20 focus:outline-none focus:border-purple/50 transition-colors"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Notes */}
                <div>
                    <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">Observações (opcional)</label>
                    <textarea
                        rows={2}
                        placeholder="Ex: Foquei mais em humanas nesse simulado..."
                        value={form.notes}
                        onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple/50 transition-colors resize-none"
                    />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 text-sm font-medium transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="flex-1 px-4 py-2.5 rounded-xl bg-purple hover:bg-purple-light text-white text-sm font-semibold transition-colors"
                    >
                        Salvar Nota
                    </button>
                </div>
            </form>
        </div>
    );
}
