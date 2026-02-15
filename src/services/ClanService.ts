export type ClanId = 'fenix' | 'lobo' | 'aguia' | 'dragao';

export interface Clan {
    id: ClanId;
    name: string;
    color: string;
    description: string;
    motto: string;
    mascot: string; // URL or icon name
    traits: string[];
}

export const CLANS: Record<ClanId, Clan> = {
    fenix: {
        id: 'fenix',
        name: 'Fênix',
        color: 'var(--clan-fenix)',
        description: 'O clã do renascimento e da resiliência. Para estudantes que nunca desistem.',
        motto: '"Das cinzas, renasce a nota 1000."',
        mascot: 'Phoenix',
        traits: ['Resiliência', 'Superação', 'Foco'],
    },
    lobo: {
        id: 'lobo',
        name: 'Lobo',
        color: 'var(--clan-lobo)',
        description: 'O clã da estratégia e do trabalho em equipe. Para quem estuda com inteligência.',
        motto: '"A matilha estuda junta, vence junta."',
        mascot: 'Wolf',
        traits: ['Estratégia', 'Comunidade', 'Inteligência'],
    },
    aguia: {
        id: 'aguia',
        name: 'Águia',
        color: 'var(--clan-aguia)',
        description: 'O clã da visão e da precisão. Para quem busca a nota 1000.',
        motto: '"Visão clara, voo certeiro."',
        mascot: 'Eagle',
        traits: ['Visão', 'Precisão', 'Ambição'],
    },
    dragao: {
        id: 'dragao',
        name: 'Dragão',
        color: 'var(--clan-dragao)',
        description: 'O clã do poder e da constância. Para quem domina o conteúdo.',
        motto: '"Fogo no peito, nota na mão."',
        mascot: 'Dragon',
        traits: ['Poder', 'Constância', 'Domínio'],
    },
};

export const ClanService = {
    // Mock "Sorting Hat" logic. In reality, this would be based on a questionnaire.
    sortUser: (answers: Record<string, any>): ClanId => {
        // Simple random for demo if no real logic yet
        const clans: ClanId[] = ['fenix', 'lobo', 'aguia', 'dragao'];
        const randomIndex = Math.floor(Math.random() * clans.length);
        return clans[randomIndex];
    },

    getClan: (id: ClanId): Clan => {
        return CLANS[id];
    },

    getAllClans: (): Clan[] => {
        return Object.values(CLANS);
    }
};
