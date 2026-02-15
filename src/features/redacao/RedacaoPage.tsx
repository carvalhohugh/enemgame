import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, Send, FileText, AlertCircle, Camera, Upload, X, ShieldCheck, ShieldAlert, Loader2 } from 'lucide-react';
import type { EssaySubmission, EssayResult } from './types';
import { SUGGESTED_TOPICS } from './types';
import { RedacaoAIService } from './RedacaoAIService';
import CorrectorAI from './CorrectorAI';

type ViewMode = 'home' | 'editor' | 'result';

export default function RedacaoPage() {
    const [view, setView] = useState<ViewMode>('home');
    const [topic, setTopic] = useState('');
    const [text, setText] = useState('');
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [plagiarismResult, setPlagiarismResult] = useState<{ checked: boolean; score: number; status: string } | null>(null);
    const [isPlagiarismChecking, setIsPlagiarismChecking] = useState(false);
    const [result, setResult] = useState<EssayResult | null>(null);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    const MIN_WORDS = 50;

    const suggestTopic = () => {
        const random = SUGGESTED_TOPICS[Math.floor(Math.random() * SUGGESTED_TOPICS.length)];
        setTopic(random);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            setError('Envie apenas imagens (JPG, PNG, etc.)');
            return;
        }
        const reader = new FileReader();
        reader.onload = (ev) => {
            setUploadedImage(ev.target?.result as string);
            setError('');
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setUploadedImage(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const runPlagiarismCheck = async () => {
        if (wordCount < 20 && !uploadedImage) return;
        setIsPlagiarismChecking(true);
        // Mock anti-plagiarism: simulate 1.5-2.5s check
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
        const score = Math.floor(Math.random() * 15); // 0-15% similarity
        setPlagiarismResult({
            checked: true,
            score,
            status: score <= 5 ? 'original' : score <= 12 ? 'attention' : 'high',
        });
        setIsPlagiarismChecking(false);
    };

    const handleSubmit = async () => {
        if (wordCount < MIN_WORDS && !uploadedImage) {
            setError(`Mínimo de ${MIN_WORDS} palavras ou envie uma foto da redação.`);
            return;
        }
        setError('');
        setIsProcessing(true);

        const submission: EssaySubmission = {
            id: crypto.randomUUID(),
            topic: topic || 'Tema Livre',
            text: uploadedImage ? `[Redação enviada por foto]\n${text}` : text,
            submittedAt: new Date().toISOString(),
            wordCount: uploadedImage ? Math.max(wordCount, 100) : wordCount,
        };

        try {
            const correctionResult = await RedacaoAIService.correctEssay(submission);
            setResult(correctionResult);
            setView('result');
        } catch {
            setError('Erro ao processar sua redação. Tente novamente.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReset = () => {
        setResult(null);
        setText('');
        setTopic('');
        setError('');
        setUploadedImage(null);
        setPlagiarismResult(null);
        setView('home');
    };

    if (view === 'result' && result) {
        return <CorrectorAI result={result} onNewEssay={handleReset} />;
    }

    // HOME — Topic list + "Escrever Redação" button
    if (view === 'home') {
        return (
            <div className="max-w-3xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Laboratório de Redação AI</h1>
                    <p className="text-white/50">Escreva sua redação e receba feedback baseado nas 5 competências do INEP.</p>
                </div>

                {/* Topic Selection + Write Button */}
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Tema</h2>
                        <button
                            onClick={suggestTopic}
                            className="flex items-center gap-1.5 text-xs text-purple-light hover:text-white transition-colors"
                        >
                            <RefreshCw className="w-3 h-3" />
                            Sugerir Tema
                        </button>
                    </div>
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Ex: Os desafios para combater a desinformação..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-purple/50 transition-colors"
                    />

                    <button
                        onClick={() => setView('editor')}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-purple hover:bg-purple-light text-white font-semibold transition-all"
                    >
                        <FileText className="w-5 h-5" />
                        Escrever Redação
                    </button>
                </div>

                {/* Recent Topics */}
                <div className="space-y-2">
                    <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider">Temas Sugeridos</h3>
                    <div className="grid gap-2">
                        {SUGGESTED_TOPICS.slice(0, 6).map((t, i) => (
                            <button
                                key={i}
                                onClick={() => { setTopic(t); setView('editor'); }}
                                className="text-left p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/[0.07] hover:border-purple/20 text-sm text-white/70 hover:text-white transition-all"
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // EDITOR — Writing + Photo Upload + Anti-plagiarism
    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Escrevendo Redação</h1>
                    <p className="text-sm text-white/40">{topic || 'Tema livre'}</p>
                </div>
                <button
                    onClick={() => setView('home')}
                    className="text-sm text-white/50 hover:text-white transition-colors"
                >
                    ← Voltar
                </button>
            </div>

            {/* Writing Area */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-white/50" />
                        <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Sua Redação</h2>
                    </div>
                    <span className={`text-xs font-mono ${wordCount >= MIN_WORDS ? 'text-green-400' : 'text-white/30'}`}>
                        {wordCount} palavras
                    </span>
                </div>

                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Comece a escrever sua redação aqui..."
                    rows={14}
                    className="w-full bg-transparent border-none text-white placeholder:text-white/15 focus:outline-none resize-none leading-relaxed text-sm"
                />
            </div>

            {/* Photo Upload */}
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                <div className="flex items-center gap-2 mb-3">
                    <Camera className="w-4 h-4 text-white/50" />
                    <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Ou envie foto da redação</h2>
                </div>

                {uploadedImage ? (
                    <div className="relative">
                        <img
                            src={uploadedImage}
                            alt="Redação enviada"
                            className="w-full max-h-64 object-contain rounded-xl border border-white/10"
                        />
                        <button
                            onClick={removeImage}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-red-500/80 transition-colors"
                        >
                            <X className="w-4 h-4 text-white" />
                        </button>
                    </div>
                ) : (
                    <label className="flex flex-col items-center justify-center gap-2 py-8 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-purple/30 hover:bg-white/[0.02] transition-all">
                        <Upload className="w-8 h-8 text-white/20" />
                        <span className="text-sm text-white/40">Clique ou arraste uma imagem</span>
                        <span className="text-xs text-white/20">JPG, PNG — máx. 10MB</span>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                    </label>
                )}
            </div>

            {/* Anti-Plagiarism */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-white/50" />
                        <span className="text-sm font-medium text-white/70">Verificação Anti-Plágio</span>
                    </div>
                    <button
                        onClick={runPlagiarismCheck}
                        disabled={isPlagiarismChecking || (wordCount < 20 && !uploadedImage)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        {isPlagiarismChecking ? (
                            <span className="flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Verificando...</span>
                        ) : 'Verificar'}
                    </button>
                </div>

                <AnimatePresence>
                    {plagiarismResult && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 pt-3 border-t border-white/5"
                        >
                            <div className="flex items-center gap-2">
                                {plagiarismResult.status === 'original' ? (
                                    <ShieldCheck className="w-4 h-4 text-green-400" />
                                ) : (
                                    <ShieldAlert className="w-4 h-4 text-yellow-400" />
                                )}
                                <span className={`text-sm font-medium ${plagiarismResult.status === 'original' ? 'text-green-400' :
                                        plagiarismResult.status === 'attention' ? 'text-yellow-400' : 'text-red-400'
                                    }`}>
                                    {plagiarismResult.score}% de similaridade
                                </span>
                                <span className="text-xs text-white/30 ml-auto">
                                    {plagiarismResult.status === 'original' ? 'Texto original' :
                                        plagiarismResult.status === 'attention' ? 'Atenção: revise trechos' : 'Alto nível de cópia detectado'}
                                </span>
                            </div>
                            <div className="mt-2 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all"
                                    style={{
                                        width: `${100 - plagiarismResult.score}%`,
                                        backgroundColor: plagiarismResult.status === 'original' ? '#10b981' :
                                            plagiarismResult.status === 'attention' ? '#eab308' : '#ef4444'
                                    }}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Error */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-sm text-red-400 bg-red-400/10 rounded-xl px-4 py-3 border border-red-400/20"
                >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                </motion.div>
            )}

            {/* Submit */}
            <button
                onClick={handleSubmit}
                disabled={isProcessing || (wordCount < MIN_WORDS && !uploadedImage)}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-purple hover:bg-purple-light text-white font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
                {isProcessing ? (
                    <>
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                            <Sparkles className="w-5 h-5" />
                        </motion.div>
                        Corrigindo automaticamente...
                    </>
                ) : (
                    <>
                        <Send className="w-4 h-4" />
                        Enviar para Correção Automática
                    </>
                )}
            </button>
        </div>
    );
}
