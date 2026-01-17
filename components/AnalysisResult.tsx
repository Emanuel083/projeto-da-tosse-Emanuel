
import React from 'react';
import { AnalysisResult } from '../types';

interface Props {
  result: AnalysisResult;
  onNewTest: () => void;
  onViewHistory: () => void;
  onHome: () => void;
}

const TRANSLATIONS: Record<string, string> = {
  pneumonia: 'Pneumonia',
  bronchite: 'Bronquite',
  asma: 'Asma',
  normal: 'Normal'
};

const AnalysisResultScreen: React.FC<Props> = ({ result, onNewTest, onViewHistory, onHome }) => {
  // Determine highest probability for the main card
  const entries = Object.entries(result.probabilities) as [string, number][];
  const sortedEntries = entries.sort(([, a], [, b]) => b - a);
  const [topKey, topProb] = sortedEntries[0];
  const topDiagnosis = TRANSLATIONS[topKey.toLowerCase()] || topKey;

  return (
    <div className="flex-1 flex flex-col bg-[#f8f9fa] dark:bg-background-dark overflow-y-auto">
      <header className="p-4 flex items-center justify-between bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-white/5 sticky top-0 z-20">
        <button onClick={onHome} className="text-[#111418] dark:text-white flex size-10 items-center">
          <span className="material-symbols-outlined">arrow_back_ios</span>
        </button>
        <h2 className="text-base font-bold dark:text-white tracking-tight flex-1 text-center pr-10">Resultados da Análise</h2>
        <span className="material-symbols-outlined text-gray-400">share</span>
      </header>

      <div className="p-6 space-y-6 pb-48">
        {/* Processing Checklist */}
        <div className="pt-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Processamento de Sinal</p>
          <div className="relative pl-2">
            {/* Vertical Line */}
            <div className="absolute left-[11px] top-2 bottom-4 w-[2px] bg-blue-100 dark:bg-blue-900/30 -z-10"></div>

            {[
              { label: 'Limpando Ruído (Wiener)', status: 'CONCLUÍDO' },
              { label: 'Extraindo MFCC', status: 'CONCLUÍDO' },
              { label: 'Inferência TFLite', status: 'FINALIZADO' }
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-4 mb-6 last:mb-0">
                <div className="size-6 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 ring-4 ring-white dark:ring-background-dark">
                  <span className="material-symbols-outlined text-sm font-bold">check</span>
                </div>
                <div className="flex flex-col -mt-0.5">
                  <span className="text-sm font-bold text-gray-800 dark:text-white leading-tight">{step.label}</span>
                  <span className="text-[10px] font-bold text-blue-500 leading-tight mt-0.5">{step.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Primary Diagnosis Card */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-[20px] p-6 border border-blue-100 dark:border-blue-500/10 flex items-center gap-4">
          <div className="size-12 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="material-symbols-outlined text-2xl">
              {topDiagnosis === 'Pneumonia' ? 'pulmonology' : topDiagnosis === 'Bronquite' ? 'airwave' : topDiagnosis === 'Asma' ? 'air' : 'health_and_safety'}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-1 mb-0.5">
              <h3 className="text-xl font-black text-gray-900 dark:text-white capitalize">{topDiagnosis}:</h3>
              <span className="text-xl font-black text-gray-900 dark:text-white">{Math.round(topProb)}%</span>
            </div>
            <p className="text-xs font-bold text-blue-500">Alta Probabilidade Detetada</p>
          </div>
        </div>

        {/* Probabilities List */}
        <div className="space-y-3">
          <h3 className="text-sm font-black text-gray-800 dark:text-white">Probabilidades de Diagnóstico</h3>
          <div className="space-y-3">
            {sortedEntries.map(([key, value]) => {
              const label = TRANSLATIONS[key.toLowerCase()] || key;
              return (
                <ProbabilityCard
                  key={key}
                  label={label}
                  value={Math.round(value)}
                  icon={label === 'Pneumonia' ? 'pulmonology' : label === 'Bronquite' ? 'airwave' : label === 'Asma' ? 'air' : 'check_circle'}
                />
              )
            })}
          </div>
        </div>

        {/* Disclaimer Box */}
        {/* Disclaimer Box */}
        <div className="p-5 bg-red-50 dark:bg-red-900/10 rounded-[20px] border border-red-100 dark:border-red-900/20 flex gap-4 items-start mb-8">
          <div className="size-6 flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-xl text-red-600 dark:text-red-500">warning</span>
          </div>
          <p className="text-[11px] leading-relaxed text-red-700 dark:text-red-300 font-bold">
            Atenção! Esta aplicação destina-se à análise bioacústica e não substitui o diagnóstico médico profissional. Em caso de sintomas graves, procure uma unidade de saúde.
          </p>
        </div>

      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white dark:bg-zinc-950 border-t border-gray-100 dark:border-white/5 z-30 flex flex-col gap-3">
        <button
          onClick={onNewTest}
          className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/25 active:scale-[0.98] transition-all"
        >
          Realizar Novo Teste
        </button>
        <button
          onClick={onViewHistory}
          className="w-full h-14 bg-white dark:bg-transparent text-primary dark:text-white border border-gray-200 dark:border-white/20 font-bold rounded-xl active:scale-[0.98] transition-all hover:bg-gray-50 dark:hover:bg-white/5"
        >
          Ver Histórico de Análises
        </button>
      </div>
    </div>
  );
};

interface ProbabilityCardProps {
  label: string;
  value: number;
  icon: string;
}

const ProbabilityCard: React.FC<ProbabilityCardProps> = ({ label, value, icon }) => {
  const isHigh = value > 40;
  return (
    <div className={`p-4 rounded-[16px] transition-all border bg-white dark:bg-zinc-900 border-gray-50 dark:border-white/5 shadow-sm`}>
      <div className="flex items-center gap-3 mb-3">
        <span className={`material-symbols-outlined text-2xl ${isHigh ? 'text-red-500' : 'text-gray-400'}`}>{icon}</span>
        <span className="flex-1 font-bold text-gray-700 dark:text-gray-200 capitalize">{label}</span>
        <span className={`font-black ${isHigh ? 'text-blue-600' : 'text-gray-500'}`}>{value}%</span>
      </div>
      <div className="h-1.5 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${isHigh ? 'bg-blue-600' : 'bg-gray-300'}`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
};

export default AnalysisResultScreen;
