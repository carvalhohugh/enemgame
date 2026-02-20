/**
 * Serviço para curadoria de conteúdo acadêmico BNCC.
 * Integração com APIs externas (Wikipedia/MediaWiki) para resumos dinâmicos.
 */

export interface AcademicContent {
    title: string;
    summary: string;
    sourceUrl: string;
    thumbnail?: string;
}

export interface RelatedVideo {
    id: string;
    title: string;
    thumbnail: string;
    channelTitle: string;
}

export const ContentService = {
    fetchTopicSummary: async (topic: string): Promise<AcademicContent> => {
        try {
            const url = `https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Conteúdo não encontrado');
            const data = await response.json();
            return {
                title: data.title,
                summary: data.extract,
                sourceUrl: data.content_urls.desktop.page,
                thumbnail: data.thumbnail?.source
            };
        } catch (error) {
            console.error('Erro ao buscar conteúdo acadêmico:', error);
            return {
                title: topic,
                summary: `Não foi possível carregar o resumo detalhado para "${topic}". Recomendamos consultar o material didático oficial.`,
                sourceUrl: '#'
            };
        }
    },

    fetchRelatedVideos: async (topic: string): Promise<RelatedVideo[]> => {
        try {
            // Utilizando o OEmbed do YouTube ou uma busca simulada via API pública (no-key)
            // Para este protótipo, simulamos resultados baseados em canais educativos conhecidos
            // const searchTerms = encodeURIComponent(`${topic} aula enem`);

            // Nota: Em produção aqui entraria a chamada de API do YouTube Data V3
            // Simulamos a resposta para manter a agilidade sem expor chaves
            return [
                {
                    id: "dQw4w9WgXcQ", // Exemplo fixo para UI
                    title: `Aula Completa: ${topic}`,
                    thumbnail: `https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg`,
                    channelTitle: "Professor Master"
                },
                {
                    id: "lY2yjAdbW94",
                    title: `Resumo Rápido de ${topic}`,
                    thumbnail: `https://img.youtube.com/vi/lY2yjAdbW94/mqdefault.jpg`,
                    channelTitle: "ENEM em Foco TV"
                }
            ];
        } catch (error) {
            console.error('Erro ao buscar vídeos:', error);
            return [];
        }
    }
};
