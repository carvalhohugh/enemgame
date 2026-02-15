/**
 * Dados BNCC — Competências e Habilidades do Ensino Médio
 *
 * Estrutura baseada na Base Nacional Comum Curricular.
 * Atualizado para incluir segmentação por ano (1º, 2º e 3º) do Ensino Médio.
 */

import type { AreaId } from '@/context/StudyProgressContext';

export type AnoEscolar = 1 | 2 | 3;

export interface BnccHabilidade {
    id: string;           // Código BNCC, ex: EM13MAT301
    titulo: string;       // Nome legível da habilidade
    descricao: string;    // Descrição BNCC resumida
    topicos: string[];    // Tópicos que cobrem essa habilidade
    ano: AnoEscolar;      // Ano sugerido do Ensino Médio
}

export interface BnccCompetencia {
    id: string;           // Ex: 'C1', 'C2'
    titulo: string;
    descricao: string;
    habilidades: BnccHabilidade[];
}

export interface BnccArea {
    id: AreaId;
    titulo: string;
    cor: string;            // Cor hex para UI
    icone: string;          // Nome do ícone lucide
    competencias: BnccCompetencia[];
}

export const BNCC_DATA: BnccArea[] = [
    /* ═══════════════════════════════════════════════
       MATEMÁTICA E SUAS TECNOLOGIAS
       ═══════════════════════════════════════════════ */
    {
        id: 'matematica', titulo: 'Matemática e suas Tecnologias',
        cor: '#8B5CF6', icone: 'Calculator',
        competencias: [
            {
                id: 'C1', titulo: 'Números e Funções',
                descricao: 'Utilizar estratégias, conceitos e procedimentos matemáticos para interpretar situações em diversos contextos.',
                habilidades: [
                    {
                        id: 'EM13MAT101', titulo: 'Conjuntos Numéricos',
                        descricao: 'Interpretar criticamente situações econômicas, sociais e fatos relativos às ciências da natureza.',
                        topicos: ['Conjuntos Numéricos', 'Intervalos Reais', 'Operações com Conjuntos'],
                        ano: 1,
                    },
                    {
                        id: 'EM13MAT301', titulo: 'Funções',
                        descricao: 'Resolver e elaborar problemas do cotidiano que envolvem funções.',
                        topicos: ['Função Afim', 'Função Quadrática', 'Gráficos de Funções', 'Inequações'],
                        ano: 1,
                    },
                    {
                        id: 'EM13MAT302', titulo: 'Função Exponencial',
                        descricao: 'Construir modelos usando funções exponenciais para resolver problemas.',
                        topicos: ['Potenciação', 'Equações Exponenciais', 'Função Exponencial', 'Gráficos'],
                        ano: 1,
                    },
                    {
                        id: 'EM13MAT315', titulo: 'Logaritmos',
                        descricao: 'Investigar e registrar sequências numéricas usando escalas logarítmicas.',
                        topicos: ['Definição de Logaritmo', 'Propriedades Operatórias', 'Função Logarítmica', 'Equações Logarítmicas'],
                        ano: 1,
                    },
                ],
            },
            {
                id: 'C2', titulo: 'Geometria',
                descricao: 'Utilizar noções de geometria para descrever e resolver problemas do mundo físico e de outras áreas.',
                habilidades: [
                    {
                        id: 'EM13MAT201', titulo: 'Geometria Plana',
                        descricao: 'Utilizar conceitos geométricos para resolver problemas de áreas e perímetros.',
                        topicos: ['Polígonos', 'Semelhança de Triângulos', 'Teorema de Tales', 'Áreas de Figuras Planas'],
                        ano: 1,
                    },
                    {
                        id: 'EM13MAT302', titulo: 'Trigonometria',
                        descricao: 'Aplicar razões trigonométricas no triângulo retângulo e na circunferência.',
                        topicos: ['Razões Trigonométricas', 'Ciclo Trigonométrico', 'Funções Seno e Cosseno', 'Lei dos Senos e Cossenos'],
                        ano: 2,
                    },
                    {
                        id: 'EM13MAT401', titulo: 'Geometria Espacial',
                        descricao: 'Resolver problemas envolvendo medidas de grandezas geométricas em 3D.',
                        topicos: ['Prismas e Pirâmides', 'Cilindros e Cones', 'Esferas', 'Volumes e Áreas de Superfície'],
                        ano: 2,
                    },
                    {
                        id: 'EM13MAT405', titulo: 'Geometria Analítica',
                        descricao: 'Utilizar conceitos de geometria analítica para resolver problemas algébricos e geométricos.',
                        topicos: ['Ponto e Reta', 'Circunferência', 'Cônicas', 'Distância entre Pontos'],
                        ano: 3,
                    },
                ],
            },
            {
                id: 'C3', titulo: 'Estatística e Probabilidade',
                descricao: 'Propor ou participar de ações para investigar desafios do mundo contemporâneo.',
                habilidades: [
                    {
                        id: 'EM13MAT310', titulo: 'Análise Combinatória',
                        descricao: 'Resolver problemas de contagem por meio de princípios e técnicas.',
                        topicos: ['Princípio Fundamental da Contagem', 'Permutações', 'Arranjos e Combinações', 'Anagramas'],
                        ano: 2,
                    },
                    {
                        id: 'EM13MAT501', titulo: 'Probabilidade',
                        descricao: 'Investigar relações entre números e contextos probabilísticos.',
                        topicos: ['Definição de Probabilidade', 'Probabilidade Condicional', 'Eventos Independentes', 'Teorema de Bayes'],
                        ano: 3,
                    },
                    {
                        id: 'EM13MAT503', titulo: 'Estatística',
                        descricao: 'Resolver problemas que envolvam representação e análise de dados estatísticos.',
                        topicos: ['Medidas de Tendência Central', 'Medidas de Dispersão', 'Gráficos e Tabelas', 'Interpretação de Dados'],
                        ano: 3,
                    },
                ],
            },
            {
                id: 'C4', titulo: 'Álgebra Avançada',
                descricao: 'Compreender estruturas algébricas avançadas.',
                habilidades: [
                    {
                        id: 'EM13MAT313', titulo: 'Sequências',
                        descricao: 'Reconhecer padrões em sequências numéricas.',
                        topicos: ['Progressão Aritmética (PA)', 'Progressão Geométrica (PG)', 'Soma de Termos'],
                        ano: 1,
                    },
                    {
                        id: 'EM13MAT314', titulo: 'Matrizes e Sistemas',
                        descricao: 'Resolver problemas utilizando matrizes e sistemas lineares.',
                        topicos: ['Operações com Matrizes', 'Determinantes', 'Sistemas Lineares', 'Escalonamento'],
                        ano: 2,
                    },
                    {
                        id: 'EM13MAT316', titulo: 'Números Complexos',
                        descricao: 'Operar com números complexos na forma algébrica e trigonométrica.',
                        topicos: ['Forma Algébrica', 'Forma Trigonométrica', 'Operações', 'Plano de Argand-Gauss'],
                        ano: 3,
                    },
                    {
                        id: 'EM13MAT317', titulo: 'Polinômios',
                        descricao: 'Aplicar conceitos de polinômios e equações algébricas.',
                        topicos: ['Grau e Valor Numérico', 'Divisão de Polinômios', 'Equações Polinomiais', 'Relações de Girard'],
                        ano: 3,
                    },
                ],
            },
        ],
    },

    /* ═══════════════════════════════════════════════
       CIÊNCIAS HUMANAS E SUAS TECNOLOGIAS
       ═══════════════════════════════════════════════ */
    {
        id: 'humanas', titulo: 'Ciências Humanas e suas Tecnologias',
        cor: '#F59E0B', icone: 'Globe',
        competencias: [
            {
                id: 'C1', titulo: 'História',
                descricao: 'Analisar processos políticos, econômicos, sociais e culturais ao longo do tempo.',
                habilidades: [
                    {
                        id: 'EM13CHS101', titulo: 'História Antiga e Medieval',
                        descricao: 'Identificar e analisar processos de formação das sociedades antigas e medievais.',
                        topicos: ['Grécia e Roma', 'Feudalismo', 'Mundo Islâmico', 'Civilizações Orientais'],
                        ano: 1,
                    },
                    {
                        id: 'EM13CHS102', titulo: 'Idade Moderna',
                        descricao: 'Analisar as transformações na Europa e suas influências globais.',
                        topicos: ['Renascimento', 'Reformas Religiosas', 'Absolutismo', 'Expansão Marítima'],
                        ano: 1,
                    },
                    {
                        id: 'EM13CHS103', titulo: 'Brasil Colônia',
                        descricao: 'Compreender a formação da sociedade brasileira colonial.',
                        topicos: ['Economia Açucareira', 'Escravidão', 'Mineração', 'Revoltas Coloniais'],
                        ano: 1,
                    },
                    {
                        id: 'EM13CHS104', titulo: 'Era das Revoluções',
                        descricao: 'Analisar as revoluções burguesas e industriais.',
                        topicos: ['Revolução Industrial', 'Revolução Francesa', 'Iluminismo', 'Independências na América'],
                        ano: 2,
                    },
                    {
                        id: 'EM13CHS105', titulo: 'Brasil Império',
                        descricao: 'Analisar o processo de consolidação do Estado brasileiro.',
                        topicos: ['Primeiro Reinado', 'Período Regencial', 'Segundo Reinado', 'Abolição da Escravatura'],
                        ano: 2,
                    },
                    {
                        id: 'EM13CHS106', titulo: 'Mundo Contemporâneo',
                        descricao: 'Analisar conflitos e transformações do século XX.',
                        topicos: ['Guerras Mundiais', 'Guerra Fria', 'Nazifascismo', 'Descolonização Afro-Asiática'],
                        ano: 3,
                    },
                    {
                        id: 'EM13CHS107', titulo: 'Brasil República',
                        descricao: 'Analisar a história política e social do Brasil republicano.',
                        topicos: ['República Velha', 'Era Vargas', 'Ditadura Militar', 'Redemocratização'],
                        ano: 3,
                    },
                ],
            },
            {
                id: 'C2', titulo: 'Geografia',
                descricao: 'Analisar a formação de territórios e as relações entre sociedade e natureza.',
                habilidades: [
                    {
                        id: 'EM13CHS201', titulo: 'Geografia Física',
                        descricao: 'Compreender a dinâmica dos elementos naturais.',
                        topicos: ['Cartografia', 'Geologia e Relevo', 'Climatologia', 'Hidrografia'],
                        ano: 1,
                    },
                    {
                        id: 'EM13CHS202', titulo: 'Geografia Humana',
                        descricao: 'Analisar a dinâmica populacional e a organização do espaço.',
                        topicos: ['Demografia', 'Urbanização', 'Migrações', 'Estrutura Agrária'],
                        ano: 2,
                    },
                    {
                        id: 'EM13CHS203', titulo: 'Geografia Econômica',
                        descricao: 'Compreender as relações econômicas globais e locais.',
                        topicos: ['Indústria', 'Energia', 'Transportes', 'Comércio Internacional'],
                        ano: 2,
                    },
                    {
                        id: 'EM13CHS204', titulo: 'Geopolítica e Brasil',
                        descricao: 'Analisar o papel do Brasil no cenário internacional e questões territoriais.',
                        topicos: ['Geopolítica Mundial', 'Conflitos Atuais', 'Regionalização do Brasil', 'Amazônia'],
                        ano: 3,
                    },
                ],
            },
            {
                id: 'C3', titulo: 'Filosofia e Sociologia',
                descricao: 'Refletir sobre o indivíduo, a sociedade e a cultura.',
                habilidades: [
                    {
                        id: 'EM13CHS301', titulo: 'Fundamentos da Filosofia',
                        descricao: 'Compreender o surgimento do pensamento filosófico.',
                        topicos: ['Pré-Socráticos', 'Sócrates, Platão e Aristóteles', 'Filosofia Medieval', 'Lógica'],
                        ano: 1,
                    },
                    {
                        id: 'EM13CHS302', titulo: 'Introdução à Sociologia',
                        descricao: 'Compreender os conceitos fundamentais da sociologia.',
                        topicos: ['Socialização', 'Cultura', 'Instituições Sociais', 'Estratificação Social'],
                        ano: 1,
                    },
                    {
                        id: 'EM13CHS303', titulo: 'Filosofia Moderna e Política',
                        descricao: 'Analisar as teorias políticas modernas.',
                        topicos: ['Racionalismo e Empirismo', 'Contratualistas', 'Iluminismo', 'Kant e Hegel'],
                        ano: 2,
                    },
                    {
                        id: 'EM13CHS304', titulo: 'Teoria Sociológica Clássica',
                        descricao: 'Analisar as contribuições dos clássicos da sociologia.',
                        topicos: ['Durkheim', 'Weber', 'Marx', 'Sociologia no Brasil'],
                        ano: 2,
                    },
                    {
                        id: 'EM13CHS305', titulo: 'Filosofia Contemporânea',
                        descricao: 'Debater questões éticas e existenciais contemporâneas.',
                        topicos: ['Existencialismo', 'Escola de Frankfurt', 'Bioética', 'Filosofia da Ciência'],
                        ano: 3,
                    },
                    {
                        id: 'EM13CHS306', titulo: 'Sociologia Contemporânea',
                        descricao: 'Analisar temas contemporâneos da sociedade.',
                        topicos: ['Movimentos Sociais', 'Cidadania e Direitos Humanos', 'Mundo do Trabalho', 'Globalização'],
                        ano: 3,
                    },
                ],
            },
        ],
    },

    /* ═══════════════════════════════════════════════
       CIÊNCIAS DA NATUREZA E SUAS TECNOLOGIAS
       ═══════════════════════════════════════════════ */
    {
        id: 'natureza', titulo: 'Ciências da Natureza e suas Tecnologias',
        cor: '#10B981', icone: 'Atom',
        competencias: [
            {
                id: 'C1', titulo: 'Física',
                descricao: 'Analisar fenômenos naturais e processos tecnológicos utilizando modelos da Física.',
                habilidades: [
                    {
                        id: 'EM13CNT101', titulo: 'Cinemática',
                        descricao: 'Descrever e analisar o movimento dos corpos.',
                        topicos: ['Movimento Uniforme', 'Movimento Uniformemente Variado', 'Vetores', 'Lançamento de Projéteis'],
                        ano: 1,
                    },
                    {
                        id: 'EM13CNT102', titulo: 'Dinâmica',
                        descricao: 'Analisar as causas do movimento e as leis de Newton.',
                        topicos: ['Leis de Newton', 'Força de Atrito', 'Trabalho e Energia', 'Quantidade de Movimento'],
                        ano: 1,
                    },
                    {
                        id: 'EM13CNT103', titulo: 'Termologia',
                        descricao: 'Compreender os fenômenos térmicos.',
                        topicos: ['Escalas Termométricas', 'Calorimetria', 'Termodinâmica', 'Dilatação'],
                        ano: 2,
                    },
                    {
                        id: 'EM13CNT104', titulo: 'Ondulatória e Óptica',
                        descricao: 'Analisar fenômenos ondulatórios e a luz.',
                        topicos: ['Ondas', 'Acústica', 'Espelhos e Lentes', 'Refração e Reflexão'],
                        ano: 2,
                    },
                    {
                        id: 'EM13CNT105', titulo: 'Eletromagnetismo',
                        descricao: 'Compreender os fenômenos elétricos e magnéticos.',
                        topicos: ['Eletrostática', 'Eletrodinâmica (Circuitos)', 'Magnetismo', 'Indução Eletromagnética'],
                        ano: 3,
                    },
                    {
                        id: 'EM13CNT106', titulo: 'Física Moderna',
                        descricao: 'Introduzir conceitos da física do século XX.',
                        topicos: ['Relatividade', 'Física Quântica', 'Radioatividade', 'Partículas Elementares'],
                        ano: 3,
                    },
                ],
            },
            {
                id: 'C2', titulo: 'Química',
                descricao: 'Investigar a composição, estrutura e transformação da matéria.',
                habilidades: [
                    {
                        id: 'EM13CNT201', titulo: 'Química Geral',
                        descricao: 'Compreender a estrutura da matéria e a tabela periódica.',
                        topicos: ['Modelos Atômicos', 'Tabela Periódica', 'Ligações Químicas', 'Forças Intermoleculares'],
                        ano: 1,
                    },
                    {
                        id: 'EM13CNT202', titulo: 'Funções Inorgânicas',
                        descricao: 'Identificar e nomear compostos inorgânicos.',
                        topicos: ['Ácidos e Bases', 'Sais e Óxidos', 'Reações Químicas', 'Balanceamento'],
                        ano: 1,
                    },
                    {
                        id: 'EM13CNT203', titulo: 'Físico-Química I',
                        descricao: 'Analisar soluções e propriedades coligativas.',
                        topicos: ['Soluções e Concentração', 'Propriedades Coligativas', 'Termoquímica', 'Cálculo Estequiométrico'],
                        ano: 2,
                    },
                    {
                        id: 'EM13CNT204', titulo: 'Físico-Química II',
                        descricao: 'Estudar a velocidade e o equilíbrio das reações.',
                        topicos: ['Cinética Química', 'Equilíbrio Químico', 'Eletroquímica', 'Radioatividade'],
                        ano: 2,
                    },
                    {
                        id: 'EM13CNT205', titulo: 'Química Orgânica I',
                        descricao: 'Introduzir o estudo dos compostos de carbono.',
                        topicos: ['Cadeias Carbônicas', 'Hidrocarbonetos', 'Funções Oxigenadas', 'Isomeria'],
                        ano: 3,
                    },
                    {
                        id: 'EM13CNT206', titulo: 'Química Orgânica II e Ambiental',
                        descricao: 'Aprofundar em reações orgânicas e química ambiental.',
                        topicos: ['Funções Nitrogenadas', 'Reações Orgânicas', 'Polímeros', 'Química Ambiental'],
                        ano: 3,
                    },
                ],
            },
            {
                id: 'C3', titulo: 'Biologia',
                descricao: 'Analisar e compreender os seres vivos e suas interações.',
                habilidades: [
                    {
                        id: 'EM13CNT301', titulo: 'Citologia e Metabolismo',
                        descricao: 'Estudar a célula e seus processos energéticos.',
                        topicos: ['Membrana e Organelas', 'Respiração Celular', 'Fotossíntese', 'Divisão Celular'],
                        ano: 1,
                    },
                    {
                        id: 'EM13CNT302', titulo: 'Histologia e Embriologia',
                        descricao: 'Compreender a formação e os tecidos dos organismos.',
                        topicos: ['Tecidos Animais', 'Desenvolvimento Embrionário', 'Reprodução', 'Métodos Contraceptivos'],
                        ano: 1,
                    },
                    {
                        id: 'EM13CNT303', titulo: 'Diversidade dos Seres Vivos',
                        descricao: 'Classificar e estudar os reinos dos seres vivos.',
                        topicos: ['Vírus e Bactérias', 'Reino Protista e Fungi', 'Reino Plantae (Botânica)', 'Reino Animalia (Zoologia)'],
                        ano: 2,
                    },
                    {
                        id: 'EM13CNT304', titulo: 'Fisiologia Humana',
                        descricao: 'Compreender o funcionamento dos sistemas do corpo humano.',
                        topicos: ['Sistema Digestório', 'Sistema Circulatório', 'Sistema Nervoso', 'Sistema Endócrino'],
                        ano: 2,
                    },
                    {
                        id: 'EM13CNT305', titulo: 'Genética',
                        descricao: 'Estudar a hereditariedade e a biologia molecular.',
                        topicos: ['Leis de Mendel', 'Grupos Sanguíneos', 'Biotecnologia', 'Engenharia Genética'],
                        ano: 3,
                    },
                    {
                        id: 'EM13CNT306', titulo: 'Ecologia e Evolução',
                        descricao: 'Analisar as relações ecológicas e a evolução das espécies.',
                        topicos: ['Cadeias Alimentares', 'Ciclos Biogeoquímicos', 'Teorias Evolutivas', 'Impactos Ambientais'],
                        ano: 3,
                    },
                ],
            },
        ],
    },

    /* ═══════════════════════════════════════════════
       LINGUAGENS E SUAS TECNOLOGIAS
       ═══════════════════════════════════════════════ */
    {
        id: 'linguagens', titulo: 'Linguagens e suas Tecnologias',
        cor: '#EF4444', icone: 'BookOpen',
        competencias: [
            {
                id: 'C1', titulo: 'Língua Portuguesa e Literatura',
                descricao: 'Compreender o funcionamento da língua e a produção literária.',
                habilidades: [
                    {
                        id: 'EM13LP01', titulo: 'Fundamentos da Língua',
                        descricao: 'Compreender as variações linguísticas e funções da linguagem.',
                        topicos: ['Funções da Linguagem', 'Variação Linguística', 'Figuras de Linguagem', 'Fonética e Fonologia'],
                        ano: 1,
                    },
                    {
                        id: 'EM13LP02', titulo: 'Literatura: Origens',
                        descricao: 'Estudar as origens da literatura e movimentos iniciais.',
                        topicos: ['Gêneros Literários', 'Trovadorismo', 'Humanismo', 'Classicismo'],
                        ano: 1,
                    },
                    {
                        id: 'EM13LP03', titulo: 'Literatura: Era Colonial e Nacional',
                        descricao: 'Analisar os movimentos literários no Brasil.',
                        topicos: ['Barroco', 'Arcadismo', 'Romantismo', 'Realismo e Naturalismo'],
                        ano: 2,
                    },
                    {
                        id: 'EM13LP04', titulo: 'Gramática: Morfologia e Sintaxe',
                        descricao: 'Aprofundar o estudo da estrutura gramatical.',
                        topicos: ['Classes de Palavras', 'Análise Sintática', 'Orações Coordenadas', 'Orações Subordinadas'],
                        ano: 2,
                    },
                    {
                        id: 'EM13LP05', titulo: 'Modernismo e Contemporaneidade',
                        descricao: 'Estudar o Modernismo brasileiro e a literatura atual.',
                        topicos: ['Pré-Modernismo', 'Semana de 22', 'Gerações Modernistas', 'Literatura Contemporânea'],
                        ano: 3,
                    },
                    {
                        id: 'EM13LP06', titulo: 'Redação ENEM',
                        descricao: 'Dominar a estrutura da redação dissertativo-argumentativa.',
                        topicos: ['Estrutura Dissertativa', 'Competências de Avaliação', 'Coesão e Coerência', 'Proposta de Intervenção'],
                        ano: 3,
                    },
                ],
            },
            {
                id: 'C2', titulo: 'Artes e Educação Física',
                descricao: 'Valorizar a produção artística e as práticas corporais.',
                habilidades: [
                    {
                        id: 'EM13LGG101', titulo: 'História da Arte',
                        descricao: 'Conhecer a evolução das artes visuais.',
                        topicos: ['Arte Pré-Histórica e Antiga', 'Renascimento', 'Vanguardas Europeias', 'Arte Contemporânea'],
                        ano: 1,
                    },
                    {
                        id: 'EM13LGG102', titulo: 'Cultura Corporal',
                        descricao: 'Compreender a importância da atividade física e cultura corporal.',
                        topicos: ['Esportes Coletivos', 'Dança e Expressão', 'Ginástica e Saúde', 'Jogos e Brincadeiras'],
                        ano: 2,
                    },
                    {
                        id: 'EM13LGG103', titulo: 'Arte Brasileira',
                        descricao: 'Valorizar a produção artística nacional.',
                        topicos: ['Arte Indígena e Africana', 'Barroco Brasileiro', 'Modernismo na Arte', 'Cinema e Teatro Brasileiro'],
                        ano: 3,
                    },
                ],
            },
            {
                id: 'C3', titulo: 'Língua Inglesa',
                descricao: 'Ampliar a capacidade de comunicação em língua inglesa.',
                habilidades: [
                    {
                        id: 'EM13LGG201', titulo: 'Inglês: Leitura e Interpretação I',
                        descricao: 'Desenvolver estratégias de leitura em inglês.',
                        topicos: ['Skimming e Scanning', 'Vocabulário Básico', 'Presente e Passado Simples', 'Cognatos'],
                        ano: 1,
                    },
                    {
                        id: 'EM13LGG202', titulo: 'Inglês: Gramática e Texto',
                        descricao: 'Aprofundar conhecimentos gramaticais e textuais.',
                        topicos: ['Tempos Futuros e Perfeitos', 'Modais', 'Voz Passiva', 'Conectivos'],
                        ano: 2,
                    },
                    {
                        id: 'EM13LGG203', titulo: 'Inglês: ENEM e Vestibulares',
                        descricao: 'Preparar para as questões de inglês dos exames.',
                        topicos: ['Interpretação Avançada', 'Phrasal Verbs', 'Questões Comentadas', 'Atualidades em Inglês'],
                        ano: 3,
                    },
                ],
            },
        ],
    },
];

/* ── Helpers ── */
export function getAreaById(id: AreaId): BnccArea | undefined {
    return BNCC_DATA.find((a) => a.id === id);
}

export function getHabilidade(areaId: AreaId, habId: string): BnccHabilidade | undefined {
    const area = getAreaById(areaId);
    if (!area) return undefined;
    for (const comp of area.competencias) {
        const hab = comp.habilidades.find((h) => h.id === habId);
        if (hab) return hab;
    }
    return undefined;
}

export function getAllHabilidades(areaId: AreaId): BnccHabilidade[] {
    const area = getAreaById(areaId);
    if (!area) return [];
    return area.competencias.flatMap((c) => c.habilidades);
}

export function getTotalHabilidades(): number {
    return BNCC_DATA.reduce(
        (total, area) => total + area.competencias.reduce(
            (sub, comp) => sub + comp.habilidades.length, 0
        ), 0
    );
}

export function getHabilidadesPorAno(areaId: AreaId, ano: AnoEscolar): BnccHabilidade[] {
    return getAllHabilidades(areaId).filter((h) => h.ano === ano);
}
