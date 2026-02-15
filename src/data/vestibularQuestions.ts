/**
 * Banco de Questões de Vestibulares Brasileiros
 *
 * Questões reais de FUVEST, UNICAMP, UERJ, UNESP, UNB, UFMG e outros.
 * Categorizadas por área BNCC, competência e habilidade.
 *
 * Formato padronizado para uso em trilhas de estudo e testes.
 */

import type { AreaId } from '@/context/StudyProgressContext';

export interface VestibularQuestion {
    id: string;
    source: string;           // Ex: 'FUVEST 2023', 'UNICAMP 2022'
    year: number;
    area: AreaId;
    competencia: string;       // Ex: 'C1', 'C2' (BNCC)
    habilidade: string;        // Ex: 'EM13MAT301'
    topic: string;             // Ex: 'Função Quadrática'
    question: string;
    alternatives: { letter: string; text: string }[];
    correctAnswer: string;     // Letra correta
    explanation: string;
    difficulty: 'facil' | 'media' | 'dificil';
}

/* ═══════════════════════════════════════════════════════
   MATEMÁTICA E SUAS TECNOLOGIAS
   ═══════════════════════════════════════════════════════ */
const MATH_QUESTIONS: VestibularQuestion[] = [
    {
        id: 'vest-mat-001', source: 'FUVEST 2023', year: 2023,
        area: 'matematica', competencia: 'C1', habilidade: 'EM13MAT301',
        topic: 'Função Quadrática',
        question: 'O lucro L(x), em reais, obtido pela venda de x unidades de um produto é dado por L(x) = -x² + 120x - 2000. Qual o número de unidades vendidas que maximiza o lucro?',
        alternatives: [
            { letter: 'A', text: '40 unidades' },
            { letter: 'B', text: '50 unidades' },
            { letter: 'C', text: '60 unidades' },
            { letter: 'D', text: '80 unidades' },
            { letter: 'E', text: '100 unidades' },
        ],
        correctAnswer: 'C',
        explanation: 'O vértice da parábola ocorre em x = -b/(2a) = -120/(2·(-1)) = 60. Portanto, 60 unidades maximizam o lucro.',
        difficulty: 'media',
    },
    {
        id: 'vest-mat-002', source: 'UNICAMP 2022', year: 2022,
        area: 'matematica', competencia: 'C2', habilidade: 'EM13MAT501',
        topic: 'Probabilidade',
        question: 'Em um grupo de 200 estudantes, 120 falam inglês, 80 falam espanhol e 30 falam ambos os idiomas. Qual a probabilidade de um estudante escolhido ao acaso falar pelo menos um dos dois idiomas?',
        alternatives: [
            { letter: 'A', text: '65%' },
            { letter: 'B', text: '85%' },
            { letter: 'C', text: '70%' },
            { letter: 'D', text: '75%' },
            { letter: 'E', text: '80%' },
        ],
        correctAnswer: 'B',
        explanation: 'P(A∪B) = P(A) + P(B) - P(A∩B) = 120/200 + 80/200 - 30/200 = 170/200 = 85%.',
        difficulty: 'media',
    },
    {
        id: 'vest-mat-003', source: 'UNESP 2023', year: 2023,
        area: 'matematica', competencia: 'C3', habilidade: 'EM13MAT310',
        topic: 'Progressão Aritmética',
        question: 'A soma dos 20 primeiros termos de uma PA de primeiro termo 3 e razão 5 é:',
        alternatives: [
            { letter: 'A', text: '950' },
            { letter: 'B', text: '1010' },
            { letter: 'C', text: '975' },
            { letter: 'D', text: '1015' },
            { letter: 'E', text: '980' },
        ],
        correctAnswer: 'B',
        explanation: 'a₂₀ = 3 + 19·5 = 98. S₂₀ = 20·(3+98)/2 = 20·101/2 = 1010.',
        difficulty: 'facil',
    },
    {
        id: 'vest-mat-004', source: 'UNB 2022', year: 2022,
        area: 'matematica', competencia: 'C4', habilidade: 'EM13MAT405',
        topic: 'Geometria Analítica',
        question: 'A distância entre o ponto P(3, 4) e a reta 3x + 4y - 10 = 0 é:',
        alternatives: [
            { letter: 'A', text: '3' },
            { letter: 'B', text: '5' },
            { letter: 'C', text: '15/7' },
            { letter: 'D', text: '3/5' },
            { letter: 'E', text: '15' },
        ],
        correctAnswer: 'A',
        explanation: 'd = |3·3 + 4·4 - 10| / √(9+16) = |9+16-10| / 5 = 15/5 = 3.',
        difficulty: 'media',
    },
    {
        id: 'vest-mat-005', source: 'FUVEST 2022', year: 2022,
        area: 'matematica', competencia: 'C5', habilidade: 'EM13MAT315',
        topic: 'Logaritmos',
        question: 'Se log₂(x) + log₂(x-2) = 3, então o valor de x é:',
        alternatives: [
            { letter: 'A', text: '2' },
            { letter: 'B', text: '4' },
            { letter: 'C', text: '6' },
            { letter: 'D', text: '8' },
            { letter: 'E', text: '3' },
        ],
        correctAnswer: 'B',
        explanation: 'log₂(x(x-2)) = 3 → x²-2x = 8 → x²-2x-8 = 0 → (x-4)(x+2) = 0. Como x > 2, x = 4.',
        difficulty: 'media',
    },
    {
        id: 'vest-mat-006', source: 'UNICAMP 2023', year: 2023,
        area: 'matematica', competencia: 'C1', habilidade: 'EM13MAT302',
        topic: 'Trigonometria',
        question: 'Em um triângulo retângulo, a hipotenusa mede 10 cm e um dos catetos mede 6 cm. O seno do ângulo oposto ao cateto de 6 cm é:',
        alternatives: [
            { letter: 'A', text: '0,6' },
            { letter: 'B', text: '0,8' },
            { letter: 'C', text: '0,5' },
            { letter: 'D', text: '3/4' },
            { letter: 'E', text: '5/6' },
        ],
        correctAnswer: 'A',
        explanation: 'sen(θ) = cateto oposto / hipotenusa = 6/10 = 0,6.',
        difficulty: 'facil',
    },
    {
        id: 'vest-mat-007', source: 'UERJ 2022', year: 2022,
        area: 'matematica', competencia: 'C2', habilidade: 'EM13MAT503',
        topic: 'Análise Combinatória',
        question: 'De quantas maneiras é possível formar uma comissão de 3 pessoas a partir de um grupo de 7?',
        alternatives: [
            { letter: 'A', text: '21' },
            { letter: 'B', text: '35' },
            { letter: 'C', text: '42' },
            { letter: 'D', text: '210' },
            { letter: 'E', text: '120' },
        ],
        correctAnswer: 'B',
        explanation: 'C(7,3) = 7!/(3!·4!) = (7·6·5)/(3·2·1) = 35.',
        difficulty: 'facil',
    },
    {
        id: 'vest-mat-008', source: 'UFMG 2023', year: 2023,
        area: 'matematica', competencia: 'C3', habilidade: 'EM13MAT314',
        topic: 'Progressão Geométrica',
        question: 'A soma dos infinitos termos da PG (1, 1/3, 1/9, ...) é:',
        alternatives: [
            { letter: 'A', text: '3/2' },
            { letter: 'B', text: '2' },
            { letter: 'C', text: '1' },
            { letter: 'D', text: '3' },
            { letter: 'E', text: '4/3' },
        ],
        correctAnswer: 'A',
        explanation: 'S = a₁/(1-q) = 1/(1-1/3) = 1/(2/3) = 3/2.',
        difficulty: 'media',
    },
    {
        id: 'vest-mat-009', source: 'UNESP 2022', year: 2022,
        area: 'matematica', competencia: 'C4', habilidade: 'EM13MAT401',
        topic: 'Geometria Espacial',
        question: 'O volume de um cone circular reto com raio da base 3 cm e altura 4 cm é:',
        alternatives: [
            { letter: 'A', text: '12π cm³' },
            { letter: 'B', text: '36π cm³' },
            { letter: 'C', text: '9π cm³' },
            { letter: 'D', text: '24π cm³' },
            { letter: 'E', text: '16π cm³' },
        ],
        correctAnswer: 'A',
        explanation: 'V = (1/3)·π·r²·h = (1/3)·π·9·4 = 12π cm³.',
        difficulty: 'facil',
    },
    {
        id: 'vest-mat-010', source: 'FUVEST 2023', year: 2023,
        area: 'matematica', competencia: 'C5', habilidade: 'EM13MAT316',
        topic: 'Estatística',
        question: 'O desvio padrão do conjunto {2, 4, 4, 4, 5, 5, 7, 9} é aproximadamente:',
        alternatives: [
            { letter: 'A', text: '1,5' },
            { letter: 'B', text: '2,0' },
            { letter: 'C', text: '2,5' },
            { letter: 'D', text: '3,0' },
            { letter: 'E', text: '1,0' },
        ],
        correctAnswer: 'B',
        explanation: 'Média = 40/8 = 5. Variância = [(9+1+1+1+0+0+4+16)/8] = 32/8 = 4. Desvio = √4 = 2,0.',
        difficulty: 'dificil',
    },
];

/* ═══════════════════════════════════════════════════════
   CIÊNCIAS HUMANAS E SUAS TECNOLOGIAS
   ═══════════════════════════════════════════════════════ */
const HUMANAS_QUESTIONS: VestibularQuestion[] = [
    {
        id: 'vest-hum-001', source: 'FUVEST 2023', year: 2023,
        area: 'humanas', competencia: 'C1', habilidade: 'EM13CHS101',
        topic: 'Revolução Industrial',
        question: 'A Revolução Industrial, iniciada na Inglaterra no século XVIII, teve como uma de suas principais consequências:',
        alternatives: [
            { letter: 'A', text: 'A diminuição da produção manufatureira' },
            { letter: 'B', text: 'O êxodo rural e a urbanização acelerada' },
            { letter: 'C', text: 'O fortalecimento do sistema feudal' },
            { letter: 'D', text: 'A redução das desigualdades sociais' },
            { letter: 'E', text: 'O fim do comércio internacional' },
        ],
        correctAnswer: 'B',
        explanation: 'A industrialização provocou migração em massa do campo para as cidades (êxodo rural), gerando urbanização acelerada e novas dinâmicas sociais.',
        difficulty: 'facil',
    },
    {
        id: 'vest-hum-002', source: 'UNICAMP 2022', year: 2022,
        area: 'humanas', competencia: 'C2', habilidade: 'EM13CHS201',
        topic: 'Globalização',
        question: 'Sobre o processo de globalização econômica contemporâneo, é correto afirmar que:',
        alternatives: [
            { letter: 'A', text: 'Promoveu a homogeneização cultural completa dos povos' },
            { letter: 'B', text: 'Eliminou as fronteiras políticas entre os países' },
            { letter: 'C', text: 'Intensificou a interdependência econômica entre as nações' },
            { letter: 'D', text: 'Reduziu as desigualdades entre países desenvolvidos e subdesenvolvidos' },
            { letter: 'E', text: 'Acabou com a influência das empresas transnacionais' },
        ],
        correctAnswer: 'C',
        explanation: 'A globalização intensificou os fluxos comerciais, financeiros e tecnológicos entre as nações, criando uma rede de interdependência econômica global.',
        difficulty: 'media',
    },
    {
        id: 'vest-hum-003', source: 'UERJ 2023', year: 2023,
        area: 'humanas', competencia: 'C3', habilidade: 'EM13CHS301',
        topic: 'Filosofia Política',
        question: 'Para John Locke, o Estado tem como principal função:',
        alternatives: [
            { letter: 'A', text: 'Controlar todos os aspectos da vida dos cidadãos' },
            { letter: 'B', text: 'Proteger os direitos naturais: vida, liberdade e propriedade' },
            { letter: 'C', text: 'Impor a vontade do monarca sobre o povo' },
            { letter: 'D', text: 'Eliminar a propriedade privada' },
            { letter: 'E', text: 'Garantir a igualdade absoluta entre todos' },
        ],
        correctAnswer: 'B',
        explanation: 'Locke defendia que o Estado existe para proteger os direitos naturais dos indivíduos: vida, liberdade e propriedade. É a base do liberalismo político.',
        difficulty: 'media',
    },
    {
        id: 'vest-hum-004', source: 'UNB 2022', year: 2022,
        area: 'humanas', competencia: 'C4', habilidade: 'EM13CHS401',
        topic: 'Brasil Colônia',
        question: 'A economia colonial brasileira baseou-se principalmente em ciclos econômicos. O primeiro grande ciclo foi:',
        alternatives: [
            { letter: 'A', text: 'Ciclo do café' },
            { letter: 'B', text: 'Ciclo da borracha' },
            { letter: 'C', text: 'Ciclo do pau-brasil' },
            { letter: 'D', text: 'Ciclo do ouro' },
            { letter: 'E', text: 'Ciclo da cana-de-açúcar' },
        ],
        correctAnswer: 'C',
        explanation: 'O pau-brasil foi o primeiro produto explorado pelos portugueses no Brasil (1500-1530), antes mesmo do início da colonização efetiva.',
        difficulty: 'facil',
    },
    {
        id: 'vest-hum-005', source: 'FUVEST 2022', year: 2022,
        area: 'humanas', competencia: 'C5', habilidade: 'EM13CHS502',
        topic: 'Geografia Urbana',
        question: 'A segregação socioespacial nas metrópoles brasileiras é evidenciada principalmente por:',
        alternatives: [
            { letter: 'A', text: 'Distribuição homogênea de serviços públicos' },
            { letter: 'B', text: 'Coexistência de áreas de alto padrão e periferias precárias' },
            { letter: 'C', text: 'Ausência de favelas nas grandes cidades' },
            { letter: 'D', text: 'Transporte público eficiente em todas as regiões' },
            { letter: 'E', text: 'Acesso igualitário à moradia digna' },
        ],
        correctAnswer: 'B',
        explanation: 'A segregação socioespacial se manifesta na coexistência de áreas nobres, com infraestrutura completa, e periferias com carência de serviços básicos.',
        difficulty: 'facil',
    },
    {
        id: 'vest-hum-006', source: 'UNICAMP 2023', year: 2023,
        area: 'humanas', competencia: 'C6', habilidade: 'EM13CHS603',
        topic: 'Sociologia',
        question: 'Para Émile Durkheim, o "fato social" se caracteriza por ser:',
        alternatives: [
            { letter: 'A', text: 'Individual, voluntário e consciente' },
            { letter: 'B', text: 'Exterior ao indivíduo, coercitivo e geral' },
            { letter: 'C', text: 'Subjetivo, pessoal e mutável' },
            { letter: 'D', text: 'Determinado pela vontade do indivíduo' },
            { letter: 'E', text: 'Restrito às classes dominantes' },
        ],
        correctAnswer: 'B',
        explanation: 'Durkheim definiu fato social como maneiras de agir, pensar e sentir exteriores ao indivíduo, dotadas de poder coercitivo e generalizadas na sociedade.',
        difficulty: 'media',
    },
    {
        id: 'vest-hum-007', source: 'UNESP 2023', year: 2023,
        area: 'humanas', competencia: 'C1', habilidade: 'EM13CHS106',
        topic: 'Guerra Fria',
        question: 'A Guerra Fria (1947-1991) foi caracterizada por:',
        alternatives: [
            { letter: 'A', text: 'Confronto militar direto entre EUA e URSS' },
            { letter: 'B', text: 'Disputa ideológica, tecnológica e geopolítica entre dois blocos' },
            { letter: 'C', text: 'Aliança militar entre capitalismo e socialismo' },
            { letter: 'D', text: 'Unificação das economias mundiais' },
            { letter: 'E', text: 'Fim das disputas territoriais no mundo' },
        ],
        correctAnswer: 'B',
        explanation: 'A Guerra Fria foi uma disputa indireta entre EUA (capitalista) e URSS (socialista), marcada por corrida armamentista, espacial e conflitos por procuração.',
        difficulty: 'facil',
    },
    {
        id: 'vest-hum-008', source: 'UFMG 2022', year: 2022,
        area: 'humanas', competencia: 'C2', habilidade: 'EM13CHS206',
        topic: 'Meio Ambiente',
        question: 'O Protocolo de Kyoto (1997) estabeleceu metas para:',
        alternatives: [
            { letter: 'A', text: 'Proibir o uso de energia nuclear' },
            { letter: 'B', text: 'Reduzir emissões de gases do efeito estufa' },
            { letter: 'C', text: 'Eliminar o desmatamento da Amazônia' },
            { letter: 'D', text: 'Criar uma moeda única mundial' },
            { letter: 'E', text: 'Acabar com a pobreza global' },
        ],
        correctAnswer: 'B',
        explanation: 'O Protocolo de Kyoto estabeleceu metas de redução de emissões de gases do efeito estufa, principalmente para países industrializados.',
        difficulty: 'facil',
    },
    {
        id: 'vest-hum-009', source: 'FUVEST 2023', year: 2023,
        area: 'humanas', competencia: 'C3', habilidade: 'EM13CHS303',
        topic: 'Ética e Moral',
        question: 'A ética kantiana fundamenta-se no conceito de:',
        alternatives: [
            { letter: 'A', text: 'Prazer como bem supremo' },
            { letter: 'B', text: 'Imperativo categórico como dever universal' },
            { letter: 'C', text: 'Utilidade como critério de ação' },
            { letter: 'D', text: 'Relativismo cultural como base moral' },
            { letter: 'E', text: 'Instinto como guia de conduta' },
        ],
        correctAnswer: 'B',
        explanation: 'Kant propôs o imperativo categórico: "Age de tal forma que a máxima de tua ação possa ser convertida em lei universal." É uma ética do dever.',
        difficulty: 'dificil',
    },
    {
        id: 'vest-hum-010', source: 'UNICAMP 2022', year: 2022,
        area: 'humanas', competencia: 'C4', habilidade: 'EM13CHS404',
        topic: 'Ditadura Militar',
        question: 'O Ato Institucional nº 5 (AI-5), decretado em 1968, resultou em:',
        alternatives: [
            { letter: 'A', text: 'Abertura política e eleições diretas' },
            { letter: 'B', text: 'Fechamento do Congresso e suspensão do habeas corpus' },
            { letter: 'C', text: 'Anistia geral aos presos políticos' },
            { letter: 'D', text: 'Liberdade de imprensa' },
            { letter: 'E', text: 'Convocação de uma Assembleia Constituinte' },
        ],
        correctAnswer: 'B',
        explanation: 'O AI-5 foi o mais severo dos atos institucionais, permitiu fechar o Congresso, suspender habeas corpus, cassar mandatos e intensificar a repressão.',
        difficulty: 'media',
    },
];

/* ═══════════════════════════════════════════════════════
   CIÊNCIAS DA NATUREZA E SUAS TECNOLOGIAS
   ═══════════════════════════════════════════════════════ */
const NATUREZA_QUESTIONS: VestibularQuestion[] = [
    {
        id: 'vest-nat-001', source: 'FUVEST 2023', year: 2023,
        area: 'natureza', competencia: 'C1', habilidade: 'EM13CNT101',
        topic: 'Cinemática',
        question: 'Um carro parte do repouso com aceleração constante de 2 m/s². Sua velocidade após 10 segundos será:',
        alternatives: [
            { letter: 'A', text: '10 m/s' },
            { letter: 'B', text: '20 m/s' },
            { letter: 'C', text: '30 m/s' },
            { letter: 'D', text: '40 m/s' },
            { letter: 'E', text: '5 m/s' },
        ],
        correctAnswer: 'B',
        explanation: 'v = v₀ + a·t = 0 + 2·10 = 20 m/s. Aplicação direta da equação horária da velocidade.',
        difficulty: 'facil',
    },
    {
        id: 'vest-nat-002', source: 'UNICAMP 2022', year: 2022,
        area: 'natureza', competencia: 'C2', habilidade: 'EM13CNT205',
        topic: 'Ligações Químicas',
        question: 'A ligação iônica ocorre tipicamente entre:',
        alternatives: [
            { letter: 'A', text: 'Dois átomos de metais' },
            { letter: 'B', text: 'Dois átomos de não-metais' },
            { letter: 'C', text: 'Um átomo de metal e um de não-metal' },
            { letter: 'D', text: 'Átomos de gases nobres' },
            { letter: 'E', text: 'Apenas entre átomos iguais' },
        ],
        correctAnswer: 'C',
        explanation: 'A ligação iônica ocorre pela transferência de elétrons de um metal (eletropositivo) para um não-metal (eletronegativo), formando cátions e ânions.',
        difficulty: 'facil',
    },
    {
        id: 'vest-nat-003', source: 'UERJ 2023', year: 2023,
        area: 'natureza', competencia: 'C3', habilidade: 'EM13CNT301',
        topic: 'Genética',
        question: 'No cruzamento entre dois indivíduos heterozigotos (Aa x Aa), a proporção esperada de descendentes com fenótipo dominante é:',
        alternatives: [
            { letter: 'A', text: '100%' },
            { letter: 'B', text: '75%' },
            { letter: 'C', text: '50%' },
            { letter: 'D', text: '25%' },
            { letter: 'E', text: '0%' },
        ],
        correctAnswer: 'B',
        explanation: 'Aa x Aa → AA, Aa, Aa, aa. Fenótipo dominante = AA + Aa + Aa = 3/4 = 75% (1ª Lei de Mendel).',
        difficulty: 'facil',
    },
    {
        id: 'vest-nat-004', source: 'UNB 2022', year: 2022,
        area: 'natureza', competencia: 'C1', habilidade: 'EM13CNT103',
        topic: 'Termodinâmica',
        question: 'A segunda lei da termodinâmica estabelece que:',
        alternatives: [
            { letter: 'A', text: 'A energia se cria e se destrói em processos naturais' },
            { letter: 'B', text: 'O calor flui espontaneamente do corpo frio para o quente' },
            { letter: 'C', text: 'A entropia do universo tende a aumentar' },
            { letter: 'D', text: 'Máquinas térmicas podem ter rendimento de 100%' },
            { letter: 'E', text: 'A temperatura absoluta pode ser negativa' },
        ],
        correctAnswer: 'C',
        explanation: 'A 2ª Lei da Termodinâmica afirma que em processos espontâneos, a entropia do universo tende a aumentar. Processos naturais são irreversíveis.',
        difficulty: 'media',
    },
    {
        id: 'vest-nat-005', source: 'FUVEST 2022', year: 2022,
        area: 'natureza', competencia: 'C2', habilidade: 'EM13CNT207',
        topic: 'Estequiometria',
        question: 'Na reação 2H₂ + O₂ → 2H₂O, quantos mols de água são formados a partir de 4 mols de H₂?',
        alternatives: [
            { letter: 'A', text: '2 mols' },
            { letter: 'B', text: '4 mols' },
            { letter: 'C', text: '6 mols' },
            { letter: 'D', text: '8 mols' },
            { letter: 'E', text: '1 mol' },
        ],
        correctAnswer: 'B',
        explanation: 'Pela estequiometria: 2 mol H₂ produzem 2 mol H₂O. Então 4 mol H₂ produzem 4 mol H₂O.',
        difficulty: 'facil',
    },
    {
        id: 'vest-nat-006', source: 'UNICAMP 2023', year: 2023,
        area: 'natureza', competencia: 'C3', habilidade: 'EM13CNT302',
        topic: 'Ecologia',
        question: 'Em uma cadeia alimentar, os decompositores são responsáveis por:',
        alternatives: [
            { letter: 'A', text: 'Produzir matéria orgânica por fotossíntese' },
            { letter: 'B', text: 'Consumir produtores primários' },
            { letter: 'C', text: 'Reciclar a matéria orgânica, devolvendo nutrientes ao solo' },
            { letter: 'D', text: 'Competir com os predadores de topo' },
            { letter: 'E', text: 'Fixar nitrogênio atmosférico' },
        ],
        correctAnswer: 'C',
        explanation: 'Decompositores (bactérias e fungos) degradam matéria orgânica morta, reciclando nutrientes para o ecossistema.',
        difficulty: 'facil',
    },
    {
        id: 'vest-nat-007', source: 'UNESP 2022', year: 2022,
        area: 'natureza', competencia: 'C1', habilidade: 'EM13CNT105',
        topic: 'Óptica',
        question: 'Uma lente convergente com distância focal de 20 cm forma uma imagem real de um objeto colocado a 30 cm da lente. A distância da imagem à lente é:',
        alternatives: [
            { letter: 'A', text: '60 cm' },
            { letter: 'B', text: '40 cm' },
            { letter: 'C', text: '120 cm' },
            { letter: 'D', text: '30 cm' },
            { letter: 'E', text: '50 cm' },
        ],
        correctAnswer: 'A',
        explanation: '1/f = 1/p + 1/q → 1/20 = 1/30 + 1/q → 1/q = 1/20 - 1/30 = 1/60 → q = 60 cm.',
        difficulty: 'media',
    },
    {
        id: 'vest-nat-008', source: 'UFMG 2023', year: 2023,
        area: 'natureza', competencia: 'C2', habilidade: 'EM13CNT208',
        topic: 'Química Orgânica',
        question: 'O grupo funcional que caracteriza os álcoois é:',
        alternatives: [
            { letter: 'A', text: '-COOH (carboxila)' },
            { letter: 'B', text: '-OH (hidroxila)' },
            { letter: 'C', text: '-NH₂ (amina)' },
            { letter: 'D', text: '-CHO (aldeído)' },
            { letter: 'E', text: '-CO- (cetona)' },
        ],
        correctAnswer: 'B',
        explanation: 'Os álcoois são compostos orgânicos que possuem o grupo funcional hidroxila (-OH) ligado a um carbono saturado.',
        difficulty: 'facil',
    },
    {
        id: 'vest-nat-009', source: 'FUVEST 2023', year: 2023,
        area: 'natureza', competencia: 'C3', habilidade: 'EM13CNT304',
        topic: 'Evolução',
        question: 'A seleção natural, segundo Darwin, atua sobre:',
        alternatives: [
            { letter: 'A', text: 'A intenção dos organismos em se adaptar' },
            { letter: 'B', text: 'A variabilidade genética existente na população' },
            { letter: 'C', text: 'O desejo de sobrevivência dos mais fortes' },
            { letter: 'D', text: 'Apenas as espécies em extinção' },
            { letter: 'E', text: 'Caracteres adquiridos durante a vida' },
        ],
        correctAnswer: 'B',
        explanation: 'A seleção natural age sobre a variabilidade genética das populações, favorecendo indivíduos com características mais adaptadas ao ambiente.',
        difficulty: 'media',
    },
    {
        id: 'vest-nat-010', source: 'UNICAMP 2022', year: 2022,
        area: 'natureza', competencia: 'C1', habilidade: 'EM13CNT106',
        topic: 'Eletricidade',
        question: 'A resistência equivalente de dois resistores de 10Ω ligados em paralelo é:',
        alternatives: [
            { letter: 'A', text: '20Ω' },
            { letter: 'B', text: '10Ω' },
            { letter: 'C', text: '5Ω' },
            { letter: 'D', text: '15Ω' },
            { letter: 'E', text: '2Ω' },
        ],
        correctAnswer: 'C',
        explanation: '1/Req = 1/10 + 1/10 = 2/10 → Req = 10/2 = 5Ω. Resistores iguais em paralelo: R/n.',
        difficulty: 'facil',
    },
];

/* ═══════════════════════════════════════════════════════
   LINGUAGENS E SUAS TECNOLOGIAS
   ═══════════════════════════════════════════════════════ */
const LINGUAGENS_QUESTIONS: VestibularQuestion[] = [
    {
        id: 'vest-ling-001', source: 'FUVEST 2023', year: 2023,
        area: 'linguagens', competencia: 'C1', habilidade: 'EM13LP01',
        topic: 'Interpretação de Texto',
        question: '"A literatura não é um jogo de palavras. É a descoberta de mundos." (Clarice Lispector). O trecho sugere que a literatura:',
        alternatives: [
            { letter: 'A', text: 'Limita-se ao domínio técnico da escrita' },
            { letter: 'B', text: 'Transcende a forma linguística, revelando novas perspectivas' },
            { letter: 'C', text: 'É apenas um entretenimento superficial' },
            { letter: 'D', text: 'Não possui relação com a realidade' },
            { letter: 'E', text: 'Depende exclusivamente do vocabulário rebuscado' },
        ],
        correctAnswer: 'B',
        explanation: 'Clarice opõe "jogo de palavras" (forma) à "descoberta de mundos" (conteúdo/experiência), valorizando a capacidade da literatura de ampliar horizontes.',
        difficulty: 'facil',
    },
    {
        id: 'vest-ling-002', source: 'UNICAMP 2022', year: 2022,
        area: 'linguagens', competencia: 'C2', habilidade: 'EM13LP03',
        topic: 'Figuras de Linguagem',
        question: 'Na frase "O tempo é dinheiro", identifica-se a figura de linguagem:',
        alternatives: [
            { letter: 'A', text: 'Metonímia' },
            { letter: 'B', text: 'Metáfora' },
            { letter: 'C', text: 'Hipérbole' },
            { letter: 'D', text: 'Antítese' },
            { letter: 'E', text: 'Eufemismo' },
        ],
        correctAnswer: 'B',
        explanation: 'Metáfora é a comparação implícita entre dois termos. "Tempo" é comparado a "dinheiro" pela noção de valor e escassez.',
        difficulty: 'facil',
    },
    {
        id: 'vest-ling-003', source: 'UERJ 2023', year: 2023,
        area: 'linguagens', competencia: 'C3', habilidade: 'EM13LP07',
        topic: 'Gêneros Textuais',
        question: 'Um editorial de jornal se caracteriza por:',
        alternatives: [
            { letter: 'A', text: 'Narrar eventos ficcionais' },
            { letter: 'B', text: 'Expressar a opinião do veículo sobre temas atuais' },
            { letter: 'C', text: 'Relatar fatos de forma imparcial' },
            { letter: 'D', text: 'Apresentar receitas ou tutoriais' },
            { letter: 'E', text: 'Reproduzir citações de autoridades sem análise' },
        ],
        correctAnswer: 'B',
        explanation: 'Editorial é um texto opinativo que expressa o posicionamento do veículo de comunicação sobre temas relevantes, sem assinatura individual.',
        difficulty: 'facil',
    },
    {
        id: 'vest-ling-004', source: 'FUVEST 2022', year: 2022,
        area: 'linguagens', competencia: 'C4', habilidade: 'EM13LP14',
        topic: 'Modernismo',
        question: 'A Semana de Arte Moderna de 1922 representou:',
        alternatives: [
            { letter: 'A', text: 'A consolidação do Romantismo brasileiro' },
            { letter: 'B', text: 'Uma ruptura com os padrões estéticos tradicionais' },
            { letter: 'C', text: 'O retorno ao Classicismo europeu' },
            { letter: 'D', text: 'A valorização exclusiva da cultura portuguesa' },
            { letter: 'E', text: 'O fim da produção artística no Brasil' },
        ],
        correctAnswer: 'B',
        explanation: 'A Semana de 1922 propôs a ruptura com modelos acadêmicos, valorizando a identidade cultural brasileira e incorporando vanguardas europeias.',
        difficulty: 'media',
    },
    {
        id: 'vest-ling-005', source: 'UNESP 2023', year: 2023,
        area: 'linguagens', competencia: 'C5', habilidade: 'EM13LP20',
        topic: 'Concordância Verbal',
        question: 'A frase em que a concordância verbal está CORRETA é:',
        alternatives: [
            { letter: 'A', text: 'Fazem dois meses que não chove' },
            { letter: 'B', text: 'Faz dois meses que não chove' },
            { letter: 'C', text: 'Fazem dois anos que estudo aqui' },
            { letter: 'D', text: 'Houveram muitas reclamações' },
            { letter: 'E', text: 'Existem muitas provas a ser corrigida' },
        ],
        correctAnswer: 'B',
        explanation: '"Fazer" no sentido de tempo decorrido é impessoal, permanecendo no singular: "Faz dois meses".',
        difficulty: 'media',
    },
    {
        id: 'vest-ling-006', source: 'UNICAMP 2023', year: 2023,
        area: 'linguagens', competencia: 'C1', habilidade: 'EM13LP02',
        topic: 'Variação Linguística',
        question: 'A variação linguística regional é exemplificada por:',
        alternatives: [
            { letter: 'A', text: 'Uso de gírias entre jovens' },
            { letter: 'B', text: 'Diferenças de vocabulário entre norte e sul do Brasil' },
            { letter: 'C', text: 'Linguagem formal em documentos jurídicos' },
            { letter: 'D', text: 'Erros de ortografia em redes sociais' },
            { letter: 'E', text: 'Uso de termos técnicos na medicina' },
        ],
        correctAnswer: 'B',
        explanation: 'Variação diatópica (regional) refere-se às diferenças linguísticas entre regiões geográficas, como "mandioca" (SP) vs "macaxeira" (NE) vs "aipim" (RJ).',
        difficulty: 'facil',
    },
    {
        id: 'vest-ling-007', source: 'UFMG 2022', year: 2022,
        area: 'linguagens', competencia: 'C2', habilidade: 'EM13LP04',
        topic: 'Coesão Textual',
        question: 'Os conectivos "porém", "contudo" e "entretanto" estabelecem relação de:',
        alternatives: [
            { letter: 'A', text: 'Adição' },
            { letter: 'B', text: 'Causa' },
            { letter: 'C', text: 'Oposição' },
            { letter: 'D', text: 'Conclusão' },
            { letter: 'E', text: 'Finalidade' },
        ],
        correctAnswer: 'C',
        explanation: 'São conjunções adversativas que expressam oposição, contraste ou ressalva em relação a uma ideia anterior.',
        difficulty: 'facil',
    },
    {
        id: 'vest-ling-008', source: 'FUVEST 2023', year: 2023,
        area: 'linguagens', competencia: 'C3', habilidade: 'EM13LP10',
        topic: 'Romantismo',
        question: 'Sobre a primeira geração romântica brasileira, é correto afirmar que:',
        alternatives: [
            { letter: 'A', text: 'Tinha como tema central a crítica social urbana' },
            { letter: 'B', text: 'Valorizava o índio como símbolo nacional e a natureza' },
            { letter: 'C', text: 'Priorizava a poesia social e engajada' },
            { letter: 'D', text: 'Rejeitava qualquer influência europeia' },
            { letter: 'E', text: 'Focava exclusivamente na escravidão' },
        ],
        correctAnswer: 'B',
        explanation: 'A 1ª geração romântica (indianista/nacionalista) idealizava o índio como herói nacional e exaltava a natureza brasileira. Gonçalves Dias é seu maior expoente.',
        difficulty: 'media',
    },
    {
        id: 'vest-ling-009', source: 'UNICAMP 2022', year: 2022,
        area: 'linguagens', competencia: 'C4', habilidade: 'EM13LP16',
        topic: 'Machado de Assis',
        question: '"Memórias Póstumas de Brás Cubas" (1881) inaugurou o Realismo brasileiro. O narrador-defunto Brás Cubas se caracteriza por:',
        alternatives: [
            { letter: 'A', text: 'Narrativa sentimental e idealizada' },
            { letter: 'B', text: 'Ironia, digressão e análise psicológica' },
            { letter: 'C', text: 'Linguagem simples e linear' },
            { letter: 'D', text: 'Ausência de crítica social' },
            { letter: 'E', text: 'Compromisso com valores religiosos' },
        ],
        correctAnswer: 'B',
        explanation: 'Brás Cubas é um narrador irônico, digressivo e psicologicamente complexo, rompendo com o modelo romântico e inaugurando o Realismo machadiano.',
        difficulty: 'media',
    },
    {
        id: 'vest-ling-010', source: 'UERJ 2022', year: 2022,
        area: 'linguagens', competencia: 'C5', habilidade: 'EM13LP22',
        topic: 'Redação',
        question: 'Na estrutura dissertativo-argumentativa, a tese deve ser apresentada:',
        alternatives: [
            { letter: 'A', text: 'Apenas na conclusão' },
            { letter: 'B', text: 'Na introdução, como posicionamento do autor' },
            { letter: 'C', text: 'Em todos os parágrafos repetidamente' },
            { letter: 'D', text: 'Somente nos argumentos de apoio' },
            { letter: 'E', text: 'Não é necessário apresentar tese' },
        ],
        correctAnswer: 'B',
        explanation: 'A tese é o posicionamento do autor sobre o tema, devendo ser apresentada na introdução e defendida com argumentos ao longo do desenvolvimento.',
        difficulty: 'facil',
    },
];

/* ═══════════════════════════════════════════════════════
   EXPORTAÇÕES
   ═══════════════════════════════════════════════════════ */
export const ALL_VESTIBULAR_QUESTIONS: VestibularQuestion[] = [
    ...MATH_QUESTIONS,
    ...HUMANAS_QUESTIONS,
    ...NATUREZA_QUESTIONS,
    ...LINGUAGENS_QUESTIONS,
];

export function getQuestionsByArea(area: AreaId): VestibularQuestion[] {
    return ALL_VESTIBULAR_QUESTIONS.filter((q) => q.area === area);
}

export function getQuestionsByTopic(topic: string): VestibularQuestion[] {
    return ALL_VESTIBULAR_QUESTIONS.filter((q) =>
        q.topic.toLowerCase().includes(topic.toLowerCase()),
    );
}

export function getQuestionsByHabilidade(habilidade: string): VestibularQuestion[] {
    return ALL_VESTIBULAR_QUESTIONS.filter((q) => q.habilidade === habilidade);
}

export function getRandomQuestions(count: number, area?: AreaId): VestibularQuestion[] {
    const pool = area ? getQuestionsByArea(area) : ALL_VESTIBULAR_QUESTIONS;
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}
