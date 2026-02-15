/**
 * WikipediaService — Busca conteúdo educacional da Wikipedia PT-BR
 *
 * Usa a MediaWiki API para buscar resumos e textos explicativos
 * sobre qualquer tópico do Ensino Médio. 100% gratuito, sem API key.
 *
 * Endpoint: https://pt.wikipedia.org/w/api.php
 *
 * Cache em memória para evitar requisições duplicadas.
 */

interface WikiExtract {
    title: string;
    extract: string;
    pageid: number;
    url: string;
}

interface CacheEntry {
    data: WikiExtract | null;
    timestamp: number;
}

const CACHE = new Map<string, CacheEntry>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutos

/**
 * Mapeamento de tópicos das trilhas BNCC para termos de busca mais
 * específicos na Wikipedia. Se o tópico não estiver aqui, usa o próprio nome.
 */
const TOPIC_SEARCH_MAP: Record<string, string> = {
    // Matemática
    'Função Afim': 'Função afim',
    'Função Quadrática': 'Função quadrática',
    'Função Exponencial': 'Função exponencial',
    'Função Logarítmica': 'Função logarítmica',
    'Razões Trigonométricas': 'Razão trigonométrica',
    'Ciclo Trigonométrico': 'Ciclo trigonométrico',
    'Funções Trigonométricas': 'Função trigonométrica',
    'Lei dos Senos e Cossenos': 'Lei dos cossenos',
    'Logaritmos': 'Logaritmo',
    'Propriedades de Logaritmos': 'Logaritmo',
    'Equações Exponenciais': 'Equação exponencial',
    'Aplicações: juros compostos, pH': 'Juros compostos',
    'Probabilidade': 'Probabilidade',
    'Probabilidade Condicional': 'Probabilidade condicional',
    'Eventos Independentes': 'Independência (probabilidade)',
    'Distribuições': 'Distribuição de probabilidade',
    'Princípio Fundamental da Contagem': 'Análise combinatória',
    'Permutações': 'Permutação',
    'Combinações': 'Combinação (matemática)',
    'Arranjos': 'Arranjo (matemática)',
    'Média, Mediana, Moda': 'Medidas de tendência central',
    'Desvio Padrão': 'Desvio padrão',
    'Gráficos Estatísticos': 'Gráfico estatístico',
    'Interpretação de Dados': 'Estatística descritiva',
    'Termo Geral PA': 'Progressão aritmética',
    'Soma de PA': 'Progressão aritmética',
    'Interpolação Aritmética': 'Progressão aritmética',
    'Problemas Contextualizados': 'Progressão aritmética',
    'Termo Geral PG': 'Progressão geométrica',
    'Soma de PG Finita': 'Progressão geométrica',
    'Soma de PG Infinita': 'Série geométrica',
    'Aplicações': 'Progressão geométrica',
    'Prismas': 'Prisma (geometria)',
    'Cilindros': 'Cilindro',
    'Cones': 'Cone',
    'Esferas': 'Esfera',
    'Volume e Área': 'Geometria espacial',
    'Distância entre Pontos': 'Geometria analítica',
    'Equação da Reta': 'Equação da reta',
    'Circunferência': 'Circunferência',
    'Cônicas': 'Secção cônica',

    // Humanas
    'Revolução Industrial': 'Revolução Industrial',
    'Revolução Francesa': 'Revolução Francesa',
    'Revolução Russa': 'Revolução Russa',
    'Transformações do séc. XX': 'Século XX',
    'Guerra Fria': 'Guerra Fria',
    'Guerras Mundiais': 'Primeira Guerra Mundial',
    'Conflitos Contemporâneos': 'Conflitos armados contemporâneos',
    'Geopolítica': 'Geopolítica',
    'Globalização Econômica': 'Globalização',
    'Blocos Econômicos': 'Bloco econômico',
    'Cadeias Produtivas Globais': 'Cadeia de valor',
    'Desigualdade Mundial': 'Desigualdade social',
    'Mudanças Climáticas': 'Mudanças climáticas',
    'Desmatamento': 'Desmatamento',
    'Acordos Ambientais': 'Acordo de Paris (2015)',
    'Desenvolvimento Sustentável': 'Desenvolvimento sustentável',
    'Contratualistas': 'Contratualismo',
    'Liberalismo': 'Liberalismo',
    'Marx e o Socialismo': 'Socialismo',
    'Democracia': 'Democracia',
    'Ética Kantiana': 'Ética kantiana',
    'Utilitarismo': 'Utilitarismo',
    'Ética Aristotélica': 'Ética a Nicômaco',
    'Ética Contemporânea': 'Ética',
    'Brasil Colônia': 'Brasil Colônia',
    'Ciclos Econômicos': 'Ciclos econômicos do Brasil',
    'Independência': 'Independência do Brasil',
    'Império': 'Império do Brasil',
    'República Velha': 'República Velha',
    'Era Vargas': 'Era Vargas',
    'Ditadura Militar': 'Ditadura militar no Brasil (1964-1985)',
    'Redemocratização': 'Redemocratização do Brasil',
    'Urbanização': 'Urbanização',
    'Segregação Socioespacial': 'Segregação urbana',
    'Mobilidade Urbana': 'Mobilidade urbana',
    'Periferização': 'Periferia',
    'Durkheim': 'Émile Durkheim',
    'Weber': 'Max Weber',
    'Marx': 'Karl Marx',
    'Sociologia Contemporânea': 'Sociologia',

    // Natureza
    'Cinemática': 'Cinemática',
    'Dinâmica (Leis de Newton)': 'Leis de Newton',
    'Energia e Trabalho': 'Energia mecânica',
    'Quantidade de Movimento': 'Quantidade de movimento',
    'Temperatura e Calor': 'Calor',
    'Leis da Termodinâmica': 'Leis da termodinâmica',
    'Máquinas Térmicas': 'Máquina térmica',
    'Dilatação': 'Dilatação térmica',
    'Reflexão': 'Reflexão (física)',
    'Refração': 'Refração',
    'Lentes e Espelhos': 'Lente',
    'Óptica da Visão': 'Óptica',
    'Corrente Elétrica': 'Corrente elétrica',
    'Resistores': 'Resistor',
    'Circuitos': 'Circuito elétrico',
    'Campo Magnético': 'Campo magnético',
    'Ligações Iônicas': 'Ligação iônica',
    'Ligações Covalentes': 'Ligação covalente',
    'Ligações Metálicas': 'Ligação metálica',
    'Geometria Molecular': 'Geometria molecular',
    'Balanceamento': 'Equação química',
    'Estequiometria': 'Estequiometria',
    'Tipos de Reações': 'Reação química',
    'Cálculos Químicos': 'Cálculo estequiométrico',
    'Hidrocarbonetos': 'Hidrocarboneto',
    'Funções Orgânicas': 'Função orgânica',
    'Isomeria': 'Isomeria',
    'Polímeros': 'Polímero',
    'Leis de Mendel': 'Leis de Mendel',
    'Genética Molecular': 'Genética molecular',
    'Engenharia Genética': 'Engenharia genética',
    'Herança Ligada ao Sexo': 'Herança genética ligada ao sexo',
    'Cadeias Alimentares': 'Cadeia alimentar',
    'Ciclos Biogeoquímicos': 'Ciclo biogeoquímico',
    'Biomas Brasileiros': 'Biomas do Brasil',
    'Impactos Ambientais': 'Impacto ambiental',
    'Seleção Natural': 'Seleção natural',
    'Especiação': 'Especiação',
    'Evidências Evolutivas': 'Evolução',
    'Origem da Vida': 'Origem da vida',

    // Linguagens
    'Interpretação Textual': 'Interpretação de texto',
    'Intertextualidade': 'Intertextualidade',
    'Inferência': 'Inferência',
    'Tipos de Texto': 'Tipologia textual',
    'Variação Regional': 'Variação linguística',
    'Variação Social': 'Sociolinguística',
    'Norma Culta vs Popular': 'Norma culta',
    'Preconceito Linguístico': 'Preconceito linguístico',
    'Metáfora': 'Metáfora',
    'Metonímia': 'Metonímia',
    'Hipérbole': 'Hipérbole (figura de linguagem)',
    'Ironia': 'Ironia',
    'Antítese': 'Antítese',
    'Conectivos': 'Conjunção (gramática)',
    'Referência Textual': 'Coesão textual',
    'Progressão Temática': 'Coerência textual',
    'Paralelismo': 'Paralelismo (retórica)',
    'Editorial': 'Editorial',
    'Crônica': 'Crônica',
    'Artigo de Opinião': 'Artigo de opinião',
    'Resenha': 'Resenha',
    'Romantismo Brasileiro': 'Romantismo no Brasil',
    'Realismo/Naturalismo': 'Realismo (literatura)',
    'Parnasianismo': 'Parnasianismo',
    'Simbolismo': 'Simbolismo',
    'Semana de 1922': 'Semana de Arte Moderna',
    '1ª Fase Modernista': 'Modernismo no Brasil',
    '2ª Fase Modernista': 'Modernismo no Brasil',
    '3ª Fase Modernista': 'Modernismo no Brasil',
    'Machado de Assis': 'Machado de Assis',
    'Clarice Lispector': 'Clarice Lispector',
    'Guimarães Rosa': 'Guimarães Rosa',
    'Literatura Marginal': 'Literatura marginal',
    'Concordância Verbal': 'Concordância verbal',
    'Concordância Nominal': 'Concordância nominal',
    'Regência': 'Regência verbal',
    'Crase': 'Crase',
    'Estrutura da Redação': 'Dissertação',
    'Tese e Argumentação': 'Argumentação',
    'Proposta de Intervenção': 'Redação do ENEM',
    'Repertório Sociocultural': 'Redação do ENEM',
};

/**
 * Busca o resumo explicativo de um tópico na Wikipedia PT-BR.
 * Retorna título, texto resumido, e URL da página.
 */
export async function fetchTopicContent(topic: string): Promise<WikiExtract | null> {
    // 1) Check cache
    const cached = CACHE.get(topic);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
    }

    // 2) Determinar termo de busca
    const searchTerm = TOPIC_SEARCH_MAP[topic] || topic;

    try {
        // 3) Buscar extract da Wikipedia
        const params = new URLSearchParams({
            action: 'query',
            prop: 'extracts',
            exintro: '1',
            explaintext: '1',
            titles: searchTerm,
            format: 'json',
            origin: '*',
            redirects: '1',
        });

        const resp = await fetch(`https://pt.wikipedia.org/w/api.php?${params.toString()}`);
        if (!resp.ok) throw new Error(`Wikipedia API error: ${resp.status}`);

        const data = await resp.json();
        const pages = data?.query?.pages;
        if (!pages) throw new Error('Invalid Wikipedia response');

        // Pegar o primeiro (e único) resultado
        const pageId = Object.keys(pages)[0];
        const page = pages[pageId];

        // Se a página não existe (id negativo)
        if (!page || page.missing !== undefined || !page.extract) {
            // Tentar busca por search
            const searchResult = await searchWikipedia(topic);
            if (searchResult) {
                CACHE.set(topic, { data: searchResult, timestamp: Date.now() });
                return searchResult;
            }
            CACHE.set(topic, { data: null, timestamp: Date.now() });
            return null;
        }

        const result: WikiExtract = {
            title: page.title,
            extract: cleanExtract(page.extract),
            pageid: parseInt(pageId),
            url: `https://pt.wikipedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, '_'))}`,
        };

        CACHE.set(topic, { data: result, timestamp: Date.now() });
        return result;
    } catch (error) {
        console.warn(`[WikipediaService] Falha ao buscar "${topic}":`, error);
        CACHE.set(topic, { data: null, timestamp: Date.now() });
        return null;
    }
}

/**
 * Busca com fallback: pesquisa por palavras-chave e pega o melhor resultado.
 */
async function searchWikipedia(query: string): Promise<WikiExtract | null> {
    try {
        const params = new URLSearchParams({
            action: 'query',
            list: 'search',
            srsearch: query,
            srlimit: '1',
            format: 'json',
            origin: '*',
        });

        const resp = await fetch(`https://pt.wikipedia.org/w/api.php?${params.toString()}`);
        const data = await resp.json();
        const results = data?.query?.search;
        if (!results || results.length === 0) return null;

        const title = results[0].title;

        // Agora buscar o extract dessa página
        const extractParams = new URLSearchParams({
            action: 'query',
            prop: 'extracts',
            exintro: '1',
            explaintext: '1',
            titles: title,
            format: 'json',
            origin: '*',
        });

        const extractResp = await fetch(`https://pt.wikipedia.org/w/api.php?${extractParams.toString()}`);
        const extractData = await extractResp.json();
        const pages = extractData?.query?.pages;
        if (!pages) return null;

        const pageId = Object.keys(pages)[0];
        const page = pages[pageId];
        if (!page || !page.extract) return null;

        return {
            title: page.title,
            extract: cleanExtract(page.extract),
            pageid: parseInt(pageId),
            url: `https://pt.wikipedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, '_'))}`,
        };
    } catch {
        return null;
    }
}

/**
 * Busca conteúdo para vários tópicos em paralelo (max 3 simultâneos).
 */
export async function fetchMultipleTopics(topics: string[]): Promise<Map<string, WikiExtract | null>> {
    const results = new Map<string, WikiExtract | null>();
    const batchSize = 3;

    for (let i = 0; i < topics.length; i += batchSize) {
        const batch = topics.slice(i, i + batchSize);
        const fetches = batch.map(async (topic) => {
            const result = await fetchTopicContent(topic);
            results.set(topic, result);
        });
        await Promise.all(fetches);
    }

    return results;
}

/**
 * Limpa o extract da Wikipedia para exibição.
 */
function cleanExtract(text: string): string {
    return text
        .replace(/\n{3,}/g, '\n\n')       // Remove excesso de quebras
        .replace(/\s{2,}/g, ' ')           // Normaliza espaços
        .replace(/== .+ ==/g, '')          // Remove headers wiki
        .replace(/\[\d+\]/g, '')           // Remove referências [1], [2]
        .trim();
}

/**
 * Retorna a URL de uma página na Wikipedia PT para um tópico.
 */
export function getWikipediaUrl(topic: string): string {
    const searchTerm = TOPIC_SEARCH_MAP[topic] || topic;
    return `https://pt.wikipedia.org/wiki/${encodeURIComponent(searchTerm.replace(/ /g, '_'))}`;
}
