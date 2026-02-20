import React, { useState } from 'react';
import { ShoppingBag, Zap, User, Palette, Sparkles, Shield, Lightbulb, Trophy, Star } from 'lucide-react';
import './Loja.css';

const ITEMS = [
    {
        id: 1,
        nome: "Boost XP 2x (1h)",
        desc: "Dobra todo o XP ganho em batalhas e trilhas por uma hora.",
        preco: 1000,
        cat: "Arena",
        rarity: "Raro",
        icon: <Zap size={44} color="var(--primary)" />
    },
    {
        id: 2,
        nome: "Dica do Oráculo",
        desc: "Permite visualizar a explicação de uma questão antes de responder na Arena.",
        preco: 500,
        cat: "Arena",
        rarity: "Épico",
        icon: <Lightbulb size={44} color="var(--secondary)" />
    },
    {
        id: 3,
        nome: "Escudo de Platina",
        desc: "Protege sua barra de vida contra uma resposta errada em batalhas.",
        preco: 800,
        cat: "Arena",
        rarity: "Raro",
        icon: <Shield size={44} color="var(--accent)" />
    },
    {
        id: 4,
        nome: "Skin Cyber Fênix",
        desc: "Visual lendário exclusivo para membros do clã Fênix.",
        preco: 5000,
        cat: "Skins",
        rarity: "Lendário",
        icon: <Palette size={44} color="var(--clan-fenix)" />
    },
    {
        id: 5,
        nome: "Lupa do INEP",
        desc: "Elimina automaticamente duas alternativas incorretas em uma questão.",
        preco: 1200,
        cat: "Arena",
        rarity: "Lendário",
        icon: <Sparkles size={44} color="gold" />
    },
    {
        id: 6,
        nome: "Avatar Mestre Titã",
        desc: "Exiba sua força com este avatar exclusivo de elite.",
        preco: 2500,
        cat: "Perfil",
        rarity: "Raro",
        icon: <User size={44} color="var(--clan-titas)" />
    },
];

const Loja: React.FC = () => {
    const [activeTab, setActiveTab] = useState("Tudo");

    const filteredItems = activeTab === "Tudo" ? ITEMS : ITEMS.filter(i => i.cat === activeTab);

    return (
        <div className="store-container">
            <header className="store-header">
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Mercado Negro 🛒</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Equipe-se com artefatos poderosos para dominar o ENEM.</p>
                </div>
                <div className="xp-balance-card glass-card">
                    <div className="xp-info">
                        <Zap size={20} fill="var(--primary)" color="var(--primary)" />
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700 }}>SEU SALDO</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>12.450 <span style={{ color: 'var(--primary)', fontSize: '0.8rem' }}>XP</span></div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="store-navigation">
                <div className="tabs-container">
                    {["Tudo", "Arena", "Skins", "Perfil"].map(cat => (
                        <button
                            key={cat}
                            className={`tab-btn ${activeTab === cat ? 'active' : ''}`}
                            onClick={() => setActiveTab(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <div className="store-stats">
                    <Trophy size={16} color="gold" /> <span>5 Itens Desbloqueados</span>
                </div>
            </div>

            <div className="items-grid">
                {filteredItems.map(item => (
                    <div key={item.id} className={`glass-card item-card rarity-${item.rarity.toLowerCase()}`}>
                        <div className="rarity-badge">{item.rarity}</div>
                        <div className="item-visual">
                            <div className="visual-glow"></div>
                            {item.icon}
                        </div>
                        <div className="item-details">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                <h3 className="item-name">{item.nome}</h3>
                                <div className="item-price-tag">
                                    <Star size={12} fill="currentColor" /> {item.preco}
                                </div>
                            </div>
                            <p className="item-desc">{item.desc}</p>
                        </div>
                        <button className="neon-button buy-btn">
                            <ShoppingBag size={18} /> RESGATAR AGORA
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Loja;
