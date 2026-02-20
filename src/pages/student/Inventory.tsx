import React, { useState } from 'react';
import {
    Package, Shield, Zap, Gift,
    Search, X, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Inventory.css';

interface Item {
    id: string;
    name: string;
    description: string;
    rarity: 'comum' | 'raro' | 'epico' | 'lendario';
    type: 'gear' | 'badge' | 'consumable';
    image: string;
}

const MOCK_ITEMS: Item[] = [
    { id: '1', name: 'Penacho de Atena', description: '+15% de XP em Humanas', rarity: 'epico', type: 'gear', image: '🛡️' },
    { id: '2', name: 'Medalha do Fundador', description: 'Reconhecimento de pioneiro', rarity: 'lendario', type: 'badge', image: '🎖️' },
    { id: '3', name: 'Pergaminho de Sêneca', description: 'Buff de Foco (2h)', rarity: 'raro', type: 'consumable', image: '📜' },
    { id: '4', name: 'Escudo de Platão', description: 'Defesa contra erros (1x)', rarity: 'epico', type: 'gear', image: '🛡️' },
    { id: '5', name: 'Poção de Cafeína', description: 'Reset de Missões Diárias', rarity: 'comum', type: 'consumable', image: '🧪' },
];

const MOCK_FRIENDS = [
    { id: 'u1', name: "Gabriel Mestre", avatar: "👨‍🏫" },
    { id: 'u2', name: "Ana Fênix", avatar: "👩‍🚒" },
    { id: 'u3', name: "Lucas Sábio", avatar: "🧙‍♂️" },
];

const Inventory: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState<'all' | 'gear' | 'badges'>('all');
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [showGiftModal, setShowGiftModal] = useState(false);
    const [searchFriend, setSearchFriend] = useState('');

    const filteredItems = MOCK_ITEMS.filter(item => {
        if (selectedTab === 'gear') return item.type === 'gear';
        if (selectedTab === 'badges') return item.type === 'badge';
        return true;
    });

    const handleSendGift = (friendId: string) => {
        alert(`Item "${selectedItem?.name}" enviado para ${MOCK_FRIENDS.find(f => f.id === friendId)?.name}!`);
        setShowGiftModal(false);
        setSelectedItem(null);
    };

    return (
        <div className="inventory-container">
            <header className="inventory-header">
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900 }}>Meu <span style={{ color: 'var(--primary)' }}>Inventário</span> 📦</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Repositório de itens, amuletos e conquistas lendárias.</p>
                </div>

                <div className="inventory-nav glass-card">
                    <button className={selectedTab === 'all' ? 'active' : ''} onClick={() => setSelectedTab('all')}>TODOS</button>
                    <button className={selectedTab === 'gear' ? 'active' : ''} onClick={() => setSelectedTab('gear')}>EQUIPAMENTOS</button>
                    <button className={selectedTab === 'badges' ? 'active' : ''} onClick={() => setSelectedTab('badges')}>MEDALHAS</button>
                </div>
            </header>

            <div className="inventory-layout">
                <main className="inventory-grid">
                    {filteredItems.map(item => (
                        <motion.div
                            key={item.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`item-card glass-card ${item.rarity} ${selectedItem?.id === item.id ? 'selected' : ''}`}
                            onClick={() => setSelectedItem(item)}
                        >
                            <span className="item-icon">{item.image}</span>
                            <div className="item-info">
                                <span className="item-name">{item.name}</span>
                                <span className={`rarity-tag ${item.rarity}`}>{item.rarity.toUpperCase()}</span>
                            </div>
                        </motion.div>
                    ))}
                </main>

                <aside className="item-details-panel">
                    <AnimatePresence mode="wait">
                        {selectedItem ? (
                            <motion.div
                                key={selectedItem.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="glass-card detail-card"
                            >
                                <div className={`detail-visual ${selectedItem.rarity}`}>
                                    {selectedItem.image}
                                </div>
                                <div className="detail-content">
                                    <span className={`rarity-text ${selectedItem.rarity}`}>{selectedItem.rarity.toUpperCase()}</span>
                                    <h2>{selectedItem.name}</h2>
                                    <p>{selectedItem.description}</p>

                                    <div className="item-stats">
                                        <div className="stat">
                                            <Zap size={14} color="var(--primary)" />
                                            <span>Ativo: +5% Multiplicador</span>
                                        </div>
                                        <div className="stat">
                                            <Shield size={14} color="var(--secondary)" />
                                            <span>Tipo: {selectedItem.type.toUpperCase()}</span>
                                        </div>
                                    </div>

                                    <div className="detail-actions">
                                        <button className="neon-button equip-btn">
                                            {selectedItem.type === 'gear' ? 'EQUIPAR' : 'EXIBIR'}
                                        </button>
                                        <button className="neon-button alt gift-btn" onClick={() => setShowGiftModal(true)}>
                                            <Gift size={18} /> PRESENTEAR
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="glass-card empty-detail">
                                <Package size={48} opacity={0.2} />
                                <p>Selecione um item para ver detalhes e funcionalidades.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </aside>
            </div>

            <AnimatePresence>
                {showGiftModal && (
                    <div className="modal-overlay">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="glass-card gift-modal"
                        >
                            <div className="modal-header">
                                <h2>Presentear Amigo</h2>
                                <button className="close-btn" onClick={() => setShowGiftModal(false)}><X /></button>
                            </div>

                            <div className="gift-content">
                                <div className="gift-item-preview glass-card">
                                    <span>{selectedItem?.image}</span>
                                    <p>Enviando: <strong>{selectedItem?.name}</strong></p>
                                </div>

                                <div className="friend-search">
                                    <Search size={16} />
                                    <input
                                        type="text"
                                        placeholder="Buscar na lista de amigos..."
                                        value={searchFriend}
                                        onChange={(e) => setSearchFriend(e.target.value)}
                                    />
                                </div>

                                <div className="friends-list">
                                    {MOCK_FRIENDS.filter(f => f.name.toLowerCase().includes(searchFriend.toLowerCase())).map(friend => (
                                        <div key={friend.id} className="friend-item glass-card" onClick={() => handleSendGift(friend.id)}>
                                            <span className="friend-avatar">{friend.avatar}</span>
                                            <span>{friend.name}</span>
                                            <ChevronRight size={16} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Inventory;
