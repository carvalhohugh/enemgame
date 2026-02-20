import React, { useState, useEffect } from 'react';
import { PenTool, Info, Sparkles, Send } from 'lucide-react';
import './Redacao.css';

const TEMAS_PADRAO = [
    { id: 1, titulo: "Caminhos para combater a intolerância religiosa no Brasil", tipo: "ENEM Oficial" },
    { id: 2, titulo: "Os impactos das redes sociais na saúde mental dos jovens", tipo: "Cunho Social" },
    { id: 3, titulo: "Desafios para a formação educacional de surdos no Brasil", tipo: "ENEM Oficial" },
    { id: 4, titulo: "A democratização do acesso ao cinema no Brasil", tipo: "ENEM Oficial" },
    { id: 5, titulo: "Crise climática e a responsabilidade civil no século XXI", tipo: "Humanidade" },
];

const COMPETENCIAS = [
    { id: 1, nome: "Domínio da Norma Culta", desc: "Demonstrar domínio da modalidade escrita formal da língua portuguesa." },
    { id: 2, nome: "Compreensão da Proposta", desc: "Compreender a proposta de redação e aplicar conceitos de várias áreas." },
    { id: 3, nome: "Organização das Informações", desc: "Selecionar, relacionar, organizar e interpretar informações em defesa de um ponto de vista." },
    { id: 4, nome: "Conhecimento de Coesão", desc: "Demonstrar conhecimento dos mecanismos linguísticos necessários para a construção da argumentação." },
    { id: 5, nome: "Proposta de Intervenção", desc: "Elaborar proposta de intervenção para o problema abordado, respeitando os direitos humanos." },
];

const Redacao: React.FC = () => {
    const [tema, setTema] = useState(TEMAS_PADRAO[0]);
    const [essay, setEssay] = useState("");

    useEffect(() => {
        // Sorteia um novo tema ao entrar na página
        const sorteado = TEMAS_PADRAO[Math.floor(Math.random() * TEMAS_PADRAO.length)];
        setTema(sorteado);
    }, []);

    return (
        <div className="redacao-container">
            <header className="theme-banner">
                <span className="theme-badge">{tema.tipo}</span>
                <h1 style={{ fontSize: '2rem', marginBottom: '16px' }}>{tema.titulo}</h1>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <button className="neon-button" onClick={() => setTema(TEMAS_PADRAO[Math.floor(Math.random() * TEMAS_PADRAO.length)])}>
                        <Sparkles size={16} /> Novo Tema
                    </button>
                    <button className="neon-button" style={{ background: 'rgba(255,255,255,0.1)', boxShadow: 'none' }}>
                        <Info size={16} /> Ver Textos de Apoio
                    </button>
                </div>
            </header>

            <div className="editor-layout">
                <div className="editor-main">
                    <textarea
                        className="essay-editor"
                        placeholder="Comece seu texto aqui seguindo as normas do ENEM..."
                        value={essay}
                        onChange={(e) => setEssay(e.target.value)}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                        <button className="neon-button" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Send size={18} /> Enviar para Avaliação
                        </button>
                    </div>
                </div>

                <aside className="competencies-sidebar">
                    <h3 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <PenTool size={20} /> Competências
                    </h3>
                    {COMPETENCIAS.map((comp) => (
                        <div key={comp.id} className="competency-card">
                            <div className="comp-header">
                                <span>C{comp.id}</span>
                                <span className="comp-score">--- / 200</span>
                            </div>
                            <p className="comp-desc">{comp.desc}</p>
                        </div>
                    ))}

                    <div className="glass-card" style={{ padding: '20px', marginTop: 'auto' }}>
                        <h4 style={{ marginBottom: '8px' }}>Dica do Mestre</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            Lembre-se de usar pelo menos dois conectivos por parágrafo para garantir uma boa nota na C4!
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Redacao;
