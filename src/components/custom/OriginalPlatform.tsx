import { useMemo, useState } from 'react';
import { CheckCircle2, Flame, Lock, RotateCcw, Target, Trophy } from 'lucide-react';
import { areas, badges, currentUser, dailyQuestion, ranking } from '@/data/mockData';

export default function OriginalPlatform() {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const isCorrect = selectedAnswer === dailyQuestion.correctAnswer;
  const unlockedBadges = useMemo(() => badges.filter((badge) => badge.unlocked), []);

  const onSelectAnswer = (index: number) => {
    if (showResult) {
      return;
    }

    setSelectedAnswer(index);
    setShowResult(true);
  };

  const onResetQuestion = () => {
    setSelectedAnswer(null);
    setShowResult(false);
  };

  return (
    <section className="mx-auto w-full max-w-6xl space-y-6 px-5 pb-10 md:px-8">
      <article className="glass rounded-3xl border border-purple/20 p-6">
        <p className="text-sm text-white/65">Plataforma original estabilizada</p>
        <h3 className="mt-2 font-poppins text-3xl font-bold">Ola, {currentUser.name}</h3>
        <div className="mt-5 grid gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-white/60">Nivel</p>
            <p className="mt-1 text-xl font-bold text-purple-light">{currentUser.level}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-white/60">XP</p>
            <p className="mt-1 text-xl font-bold text-gold">{currentUser.xp.toLocaleString('pt-BR')}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-white/60">Sequencia</p>
            <p className="mt-1 inline-flex items-center gap-2 text-xl font-bold text-orange-400">
              <Flame className="h-4 w-4" />
              {currentUser.streak} dias
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-white/60">Ranking</p>
            <p className="mt-1 text-xl font-bold text-emerald-400">#{currentUser.rank}</p>
          </div>
        </div>
      </article>

      <article className="glass rounded-3xl border border-white/10 p-6">
        <h4 className="font-poppins text-xl font-bold">Trilhas de estudo</h4>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {areas.map((area) => (
            <div key={area.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-white">{area.icon} {area.name}</p>
                <p className="text-sm text-white/70">{area.progress}%</p>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-dark-deeper">
                <div className="h-full rounded-full bg-gradient-to-r from-purple to-gold" style={{ width: `${area.progress}%` }} />
              </div>
              <p className="mt-2 text-xs text-white/60">{area.completedQuests}/{area.totalQuests} questoes</p>
            </div>
          ))}
        </div>
      </article>

      <article className="glass rounded-3xl border border-white/10 p-6">
        <h4 className="font-poppins text-xl font-bold">Simulado rapido (funcao original)</h4>
        <p className="mt-2 text-sm text-white/70">{dailyQuestion.question}</p>
        <div className="mt-4 space-y-2">
          {dailyQuestion.options.map((option, index) => {
            const active = selectedAnswer === index;
            const right = showResult && index === dailyQuestion.correctAnswer;
            const wrong = showResult && active && !right;

            return (
              <button
                key={option}
                type="button"
                onClick={() => onSelectAnswer(index)}
                disabled={showResult}
                className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                  right
                    ? 'border-emerald-400/50 bg-emerald-500/15'
                    : wrong
                      ? 'border-red-400/50 bg-red-500/15'
                      : active
                        ? 'border-purple/50 bg-purple/20'
                        : 'border-white/10 bg-white/5 hover:border-white/30'
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-sm">
            <p className={isCorrect ? 'text-emerald-300' : 'text-red-300'}>
              {isCorrect ? 'Resposta correta. +50 XP' : 'Resposta incorreta.'}
            </p>
            <p className="mt-2 text-white/80">{dailyQuestion.explanation}</p>
            <button
              type="button"
              onClick={onResetQuestion}
              className="mt-3 inline-flex items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-xs hover:border-white/40"
            >
              <RotateCcw className="h-3 w-3" />
              Tentar novamente
            </button>
          </div>
        )}
      </article>

      <div className="grid gap-6 lg:grid-cols-2">
        <article className="glass rounded-3xl border border-white/10 p-6">
          <h4 className="font-poppins text-xl font-bold">Ranking</h4>
          <div className="mt-4 space-y-2">
            {ranking.slice(0, 8).map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 p-3">
                <p className="text-sm text-white">
                  <span className="mr-2 font-bold text-gold">#{item.rank}</span>
                  {item.name}
                </p>
                <p className="text-xs text-white/70">Nv. {item.level}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="glass rounded-3xl border border-white/10 p-6">
          <h4 className="font-poppins text-xl font-bold">Conquistas</h4>
          <p className="mt-1 text-xs text-white/65">{unlockedBadges.length}/{badges.length} badges desbloqueadas</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {badges.slice(0, 8).map((badge) => (
              <div key={badge.id} className="rounded-xl border border-white/10 bg-black/20 p-3">
                <p className="text-sm font-semibold text-white">
                  {badge.unlocked ? <CheckCircle2 className="mr-1 inline h-4 w-4 text-emerald-400" /> : <Lock className="mr-1 inline h-4 w-4 text-white/40" />}
                  {badge.name}
                </p>
                <p className="mt-1 text-xs text-white/60">{badge.description}</p>
              </div>
            ))}
          </div>
        </article>
      </div>

      <footer className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center text-xs text-white/60">
        <p className="inline-flex items-center gap-2">
          <Trophy className="h-4 w-4 text-gold" />
          Plataforma original ativa e estabilizada.
        </p>
        <p className="mt-1 inline-flex items-center gap-2">
          <Target className="h-4 w-4 text-purple-light" />
          Use esta aba para trilhas, simulado, ranking e conquistas.
        </p>
      </footer>
    </section>
  );
}
