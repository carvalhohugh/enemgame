import { motion } from 'framer-motion';
import type { ClanId } from '@/services/ClanService';

/* ───────────────────── Clan Metadata ───────────────────── */
export interface ClanInfo {
    id: ClanId;
    name: string;
    motto: string;
    color: string;
    gradient: string;
    emoji: string;
    description: string;
    traits: string[];
}

export const CLANS: Record<ClanId, ClanInfo> = {
    fenix: {
        id: 'fenix',
        name: 'Clã Fênix',
        motto: 'Das cinzas, mais forte.',
        color: '#f97316',
        gradient: 'from-orange-500 to-red-600',
        emoji: '🔥',
        description:
            'Os guerreiros da Fênix nunca desistem. Cada erro é combustível para renascer com mais força. São resilientes, apaixonados e transformam dificuldades em vitória.',
        traits: ['Resiliência', 'Paixão', 'Renascimento', 'Garra'],
    },
    lobo: {
        id: 'lobo',
        name: 'Clã Lobo',
        motto: 'Inteligência é a maior arma.',
        color: '#6366f1',
        gradient: 'from-indigo-500 to-purple-600',
        emoji: '🐺',
        description:
            'Os estrategistas do Lobo dominam pela inteligência. Planejam cada passo, estudam padrões e nunca entram despreparados. Disciplina e estratégia são seu DNA.',
        traits: ['Estratégia', 'Disciplina', 'Trabalho em equipe', 'Frieza'],
    },
    aguia: {
        id: 'aguia',
        name: 'Clã Águia',
        motto: 'Visão acima de tudo.',
        color: '#eab308',
        gradient: 'from-yellow-500 to-amber-600',
        emoji: '🦅',
        description:
            'Os visionários da Águia enxergam além. Com foco preciso e visão macro, identificam oportunidades onde outros veem caos. Velocidade mental e precisão cirúrgica.',
        traits: ['Visão', 'Foco', 'Precisão', 'Velocidade'],
    },
    dragao: {
        id: 'dragao',
        name: 'Clã Dragão',
        motto: 'Poder absoluto. Domínio total.',
        color: '#ef4444',
        gradient: 'from-red-500 to-rose-700',
        emoji: '🐉',
        description:
            'Os imperadores do Dragão dominam tudo que tocam. Força de vontade inabalável, determinação brutais e fome insaciável por excelência. Quando um Dragão ataca, não existe defesa.',
        traits: ['Poder', 'Determinação', 'Domínio', 'Excelência'],
    },
};

/* ───────────────────── Mascot SVGs ───────────────────── */

function FenixMascot({ size = 200 }: { size?: number }) {
    return (
        <motion.svg
            width={size}
            height={size}
            viewBox="0 0 200 200"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 10 }}
        >
            {/* Fire aura */}
            <motion.circle cx="100" cy="100" r="90" fill="url(#fenix-glow)" opacity={0.3}
                animate={{ r: [85, 95, 85] }} transition={{ repeat: Infinity, duration: 2 }}
            />
            {/* Body */}
            <path d="M100 30 C60 50 50 90 60 120 Q70 150 100 170 Q130 150 140 120 C150 90 140 50 100 30Z" fill="url(#fenix-body)" />
            {/* Wings */}
            <path d="M60 90 Q20 60 30 30 Q50 50 70 70Z" fill="#fb923c" opacity={0.9} />
            <path d="M140 90 Q180 60 170 30 Q150 50 130 70Z" fill="#fb923c" opacity={0.9} />
            {/* Crown / crest */}
            <path d="M85 40 L90 20 L100 35 L110 20 L115 40Z" fill="#fbbf24" />
            {/* Eyes */}
            <circle cx="85" cy="75" r="6" fill="white" />
            <circle cx="115" cy="75" r="6" fill="white" />
            <circle cx="87" cy="74" r="3" fill="#1a1a2e" />
            <circle cx="117" cy="74" r="3" fill="#1a1a2e" />
            {/* Eye sparkle */}
            <circle cx="88" cy="72" r="1.5" fill="white" />
            <circle cx="118" cy="72" r="1.5" fill="white" />
            {/* Determined beak/mouth */}
            <path d="M93 88 L100 95 L107 88" fill="none" stroke="#7c2d12" strokeWidth="2.5" strokeLinecap="round" />
            {/* Fire tail */}
            <motion.path
                d="M90 160 Q80 180 95 190 Q100 175 105 190 Q120 180 110 160"
                fill="#f97316"
                animate={{
                    d: [
                        "M90 160 Q80 180 95 190 Q100 175 105 190 Q120 180 110 160",
                        "M90 160 Q75 185 95 195 Q100 170 105 195 Q125 185 110 160",
                        "M90 160 Q80 180 95 190 Q100 175 105 190 Q120 180 110 160"
                    ]
                }}
                transition={{ repeat: Infinity, duration: 1.5 }}
            />
            {/* Gradients */}
            <defs>
                <radialGradient id="fenix-glow" cx="50%" cy="50%">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="fenix-body" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fb923c" />
                    <stop offset="50%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#ea580c" />
                </linearGradient>
            </defs>
        </motion.svg>
    );
}

function LoboMascot({ size = 200 }: { size?: number }) {
    return (
        <motion.svg
            width={size}
            height={size}
            viewBox="0 0 200 200"
            initial={{ scale: 0, x: -50 }}
            animate={{ scale: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 12 }}
        >
            {/* Aura */}
            <motion.circle cx="100" cy="100" r="88" fill="url(#lobo-glow)" opacity={0.25}
                animate={{ opacity: [0.2, 0.35, 0.2] }} transition={{ repeat: Infinity, duration: 3 }}
            />
            {/* Body */}
            <ellipse cx="100" cy="115" rx="55" ry="65" fill="url(#lobo-body)" />
            {/* Ears */}
            <path d="M60 65 L55 25 L80 55Z" fill="#818cf8" />
            <path d="M140 65 L145 25 L120 55Z" fill="#818cf8" />
            <path d="M63 60 L60 35 L77 55Z" fill="#c7d2fe" />
            <path d="M137 60 L140 35 L123 55Z" fill="#c7d2fe" />
            {/* Face */}
            <ellipse cx="100" cy="90" rx="40" ry="35" fill="#a5b4fc" />
            {/* Eyes — sharp, strategic */}
            <path d="M78 80 L88 75 L88 85Z" fill="#1e1b4b" />
            <path d="M122 80 L112 75 L112 85Z" fill="#1e1b4b" />
            <circle cx="85" cy="79" r="1.5" fill="#c7d2fe" />
            <circle cx="115" cy="79" r="1.5" fill="#c7d2fe" />
            {/* Snout */}
            <ellipse cx="100" cy="96" rx="12" ry="8" fill="#c7d2fe" />
            <ellipse cx="100" cy="93" rx="5" ry="3" fill="#312e81" />
            {/* Confident smirk */}
            <path d="M92 100 Q100 107 108 100" fill="none" stroke="#312e81" strokeWidth="2" strokeLinecap="round" />
            {/* Chest fur */}
            <path d="M80 120 Q100 110 120 120 Q115 140 100 145 Q85 140 80 120Z" fill="#c7d2fe" opacity={0.6} />
            {/* Gradients */}
            <defs>
                <radialGradient id="lobo-glow" cx="50%" cy="50%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="lobo-body" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
            </defs>
        </motion.svg>
    );
}

function AguiaMascot({ size = 200 }: { size?: number }) {
    return (
        <motion.svg
            width={size}
            height={size}
            viewBox="0 0 200 200"
            initial={{ scale: 0, y: -40 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 10 }}
        >
            {/* Glow */}
            <motion.circle cx="100" cy="100" r="90" fill="url(#aguia-glow)" opacity={0.2}
                animate={{ r: [85, 95, 85] }} transition={{ repeat: Infinity, duration: 2.5 }}
            />
            {/* Wings spread */}
            <motion.path d="M100 80 Q50 50 15 35 Q30 70 55 85Z" fill="#eab308"
                animate={{
                    d: [
                        "M100 80 Q50 50 15 35 Q30 70 55 85Z",
                        "M100 80 Q50 45 10 30 Q30 65 55 85Z",
                        "M100 80 Q50 50 15 35 Q30 70 55 85Z"
                    ]
                }} transition={{ repeat: Infinity, duration: 2 }}
            />
            <motion.path d="M100 80 Q150 50 185 35 Q170 70 145 85Z" fill="#eab308"
                animate={{
                    d: [
                        "M100 80 Q150 50 185 35 Q170 70 145 85Z",
                        "M100 80 Q150 45 190 30 Q170 65 145 85Z",
                        "M100 80 Q150 50 185 35 Q170 70 145 85Z"
                    ]
                }} transition={{ repeat: Infinity, duration: 2 }}
            />
            {/* Body */}
            <ellipse cx="100" cy="110" rx="40" ry="50" fill="url(#aguia-body)" />
            {/* Head */}
            <circle cx="100" cy="70" r="28" fill="#fbbf24" />
            {/* Eyes — piercing */}
            <circle cx="88" cy="65" r="7" fill="white" />
            <circle cx="112" cy="65" r="7" fill="white" />
            <circle cx="90" cy="64" r="4" fill="#78350f" />
            <circle cx="114" cy="64" r="4" fill="#78350f" />
            <circle cx="91" cy="62" r="1.5" fill="white" />
            <circle cx="115" cy="62" r="1.5" fill="white" />
            {/* Eyebrows — focused */}
            <line x1="80" y1="56" x2="92" y2="58" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="120" y1="56" x2="108" y2="58" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
            {/* Beak */}
            <path d="M95 74 L100 85 L105 74Z" fill="#b45309" />
            {/* Crown feathers */}
            <path d="M90 48 L92 35 L96 47Z" fill="#d97706" />
            <path d="M98 45 L100 30 L102 45Z" fill="#d97706" />
            <path d="M104 48 L108 35 L110 47Z" fill="#d97706" />
            {/* Gradients */}
            <defs>
                <radialGradient id="aguia-glow" cx="50%" cy="50%">
                    <stop offset="0%" stopColor="#eab308" />
                    <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="aguia-body" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="60%" stopColor="#92400e" />
                    <stop offset="100%" stopColor="#78350f" />
                </linearGradient>
            </defs>
        </motion.svg>
    );
}

function DragaoMascot({ size = 200 }: { size?: number }) {
    return (
        <motion.svg
            width={size}
            height={size}
            viewBox="0 0 200 200"
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 80, damping: 12 }}
        >
            {/* Fiery aura */}
            <motion.circle cx="100" cy="100" r="92" fill="url(#dragao-glow)" opacity={0.3}
                animate={{ opacity: [0.2, 0.4, 0.2] }} transition={{ repeat: Infinity, duration: 1.8 }}
            />
            {/* Body */}
            <ellipse cx="100" cy="115" rx="50" ry="60" fill="url(#dragao-body)" />
            {/* Head */}
            <path d="M60 75 Q60 40 100 35 Q140 40 140 75 Q140 95 100 100 Q60 95 60 75Z" fill="#dc2626" />
            {/* Horns */}
            <path d="M65 55 L50 20 L75 50Z" fill="#991b1b" />
            <path d="M135 55 L150 20 L125 50Z" fill="#991b1b" />
            {/* Spikes */}
            <path d="M95 35 L100 15 L105 35Z" fill="#b91c1c" />
            {/* Eyes — powerful, commanding */}
            <path d="M78 68 L90 62 L90 74Z" fill="#fbbf24" />
            <path d="M122 68 L110 62 L110 74Z" fill="#fbbf24" />
            <circle cx="86" cy="68" r="2" fill="#1a1a2e" />
            <circle cx="114" cy="68" r="2" fill="#1a1a2e" />
            {/* Nostrils with smoke */}
            <circle cx="92" cy="82" r="3" fill="#7f1d1d" />
            <circle cx="108" cy="82" r="3" fill="#7f1d1d" />
            <motion.circle cx="88" cy="78" r="2" fill="#fca5a5" opacity={0.5}
                animate={{ cy: [78, 70, 65], opacity: [0.5, 0.2, 0] }}
                transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
            />
            <motion.circle cx="112" cy="78" r="2" fill="#fca5a5" opacity={0.5}
                animate={{ cy: [78, 70, 65], opacity: [0.5, 0.2, 0] }}
                transition={{ repeat: Infinity, duration: 2, repeatDelay: 1.3 }}
            />
            {/* Fierce mouth */}
            <path d="M88 90 L93 94 L97 88 L100 92 L103 88 L107 94 L112 90" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
            {/* Chest scales */}
            <path d="M82 115 Q100 105 118 115 Q115 130 100 138 Q85 130 82 115Z" fill="#fca5a5" opacity={0.3} />
            {/* Tail hint */}
            <motion.path d="M60 150 Q40 160 35 175 Q50 167 55 155" fill="#dc2626"
                animate={{
                    d: [
                        "M60 150 Q40 160 35 175 Q50 167 55 155",
                        "M60 150 Q35 165 30 180 Q50 170 55 155",
                        "M60 150 Q40 160 35 175 Q50 167 55 155"
                    ]
                }} transition={{ repeat: Infinity, duration: 2 }}
            />
            {/* Gradients */}
            <defs>
                <radialGradient id="dragao-glow" cx="50%" cy="50%">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="dragao-body" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#991b1b" />
                </linearGradient>
            </defs>
        </motion.svg>
    );
}

/* ───────────────────── Public Component ───────────────────── */

export const MASCOT_COMPONENTS: Record<ClanId, React.FC<{ size?: number }>> = {
    fenix: FenixMascot,
    lobo: LoboMascot,
    aguia: AguiaMascot,
    dragao: DragaoMascot,
};

export function ClanMascot({ clanId, size = 200 }: { clanId: ClanId; size?: number }) {
    const Component = MASCOT_COMPONENTS[clanId];
    return <Component size={size} />;
}
