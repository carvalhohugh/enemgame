export interface BNCCTheme {
    id: string;
    title: string;
    description: string;
}

export interface BNCCYear {
    year: string;
    themes: BNCCTheme[];
}

export interface BNCCComponent {
    name: string;
    icon: string;
    color: string;
    years: BNCCYear[];
}

export const BNCC_CURRICULUM: BNCCComponent[] = [
    {
        name: "Matemática",
        icon: "calculate",
        color: "var(--primary)",
        years: [
            {
                year: "1º Ano",
                themes: [
                    { id: "mat1_1", title: "Conjuntos Numéricos", description: "Números reais, intervalos e operações." },
                    { id: "mat1_2", title: "Funções de 1º Grau", description: "Gráficos, coeficientes e aplicações." },
                    { id: "mat1_3", title: "Geometria Plana", description: "Triângulos, polígonos e áreas." }
                ]
            },
            {
                year: "2º Ano",
                themes: [
                    { id: "mat2_1", title: "Trigonometria", description: "Ciclo trigonométrico e identidades." },
                    { id: "mat2_2", title: "Análise Combinatória", description: "Permutação, arranjo e combinação." },
                    { id: "mat2_3", title: "Geometria Espacial", description: "Prismas, pirâmides e volumes." }
                ]
            },
            {
                year: "3º Ano",
                themes: [
                    { id: "mat3_1", title: "Probabilidade", description: "Eventos, condicionais e distribuições." },
                    { id: "mat3_2", title: "Números Complexos", description: "Forma algébrica e trigonométrica." },
                    { id: "mat3_3", title: "Matrizes e Determinantes", description: "Sistemas lineares e aplicações." }
                ]
            }
        ]
    },
    {
        name: "Ciências da Natureza",
        icon: "biotech",
        color: "var(--accent)",
        years: [
            {
                year: "1º Ano",
                themes: [
                    { id: "nat1_1", title: "Cinemática", description: "Movimento uniforme e variado." },
                    { id: "nat1_2", title: "Ecologia", description: "Cadeias alimentares e biomas." },
                    { id: "nat1_3", title: "Modelos Atômicos", description: "Evolução e estrutura da matéria." }
                ]
            },
            {
                year: "2º Ano",
                themes: [
                    { id: "nat2_1", title: "Termodinâmica", description: "Calor, temperatura e leis." },
                    { id: "nat2_2", title: "Fisiologia Humana", description: "Sistemas do corpo humano." },
                    { id: "nat2_3", title: "Estequiometria", description: "Cálculos e reações químicas." }
                ]
            },
            {
                year: "3º Ano",
                themes: [
                    { id: "nat3_1", title: "Eletrodinâmica", description: "Circuitos, corrente e potência." },
                    { id: "nat3_2", title: "Genética", description: "Lois de Mendel e biotecnologia." },
                    { id: "nat3_3", title: "Radioatividade", description: "Emissões e decaimento nuclear." }
                ]
            }
        ]
    },
    {
        name: "Linguagens",
        icon: "translate",
        color: "var(--secondary)",
        years: [
            {
                year: "1º Ano",
                themes: [
                    { id: "lin1_1", title: "Funções da Linguagem", description: "Relações entre emissor e receptor." },
                    { id: "lin1_2", title: "Quinhentismo", description: "Literatura de informação e jesuítica." },
                    { id: "lin1_3", title: "Variedades Linguísticas", description: "Contextos sociais e regionais." }
                ]
            },
            {
                year: "3º Ano",
                themes: [
                    { id: "lin3_1", title: "Modernismo", description: "Semana de Arte Moderna e fases." },
                    { id: "lin3_2", title: "Análise Sintática", description: "Estrutura das orações e períodos." },
                    { id: "lin3_3", title: "Figuras de Linguagem", description: "Metáforas, ironias e personificações." }
                ]
            }
        ]
    },
    {
        name: "Ciências Humanas",
        icon: "landmark",
        color: "var(--primary-glow)",
        years: [
            {
                year: "1º Ano",
                themes: [
                    { id: "hum1_1", title: "Grécia e Roma Antiga", description: "Política, democracia e cidadania na Antiguidade." },
                    { id: "hum1_2", title: "Globalização", description: "Redes mundiais, economia e cultura global." },
                    { id: "hum1_3", title: "Filosofia Pré-Socrática", description: "O surgimento do pensamento racional." }
                ]
            },
            {
                year: "2º Ano",
                themes: [
                    { id: "hum2_1", title: "Brasil Colônia", description: "Ciclos econômicos, escravidão e resistência." },
                    { id: "hum2_2", title: "Geopolítica Mundial", description: "Conflitos, organismos internacionais e poder." },
                    { id: "hum2_3", title: "Sociologia Clássica", description: "Marx, Durkheim e Weber." }
                ]
            },
            {
                year: "3º Ano",
                themes: [
                    { id: "hum3_1", title: "Ditadura Militar no Brasil", description: "Antecedentes, repressão e redemocratização." },
                    { id: "hum3_2", title: "Urbanização Brasileira", description: "Crescimento das cidades, segregação e problemas urbanos." },
                    { id: "hum3_3", title: "Ética e Política Contemporânea", description: "Desafios Éticos no mundo pós-moderno." }
                ]
            }
        ]
    }
];
