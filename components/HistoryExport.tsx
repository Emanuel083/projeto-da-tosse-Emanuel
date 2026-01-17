
import React from 'react';
import { HistoryRecord } from '../types';

interface Props {
  records: HistoryRecord[];
  onBack: () => void;
  onViewReport: (record: HistoryRecord) => void;
  onDelete: (id: string) => void;
  onEdit: (record: HistoryRecord) => void;
}

const HistoryExport: React.FC<Props> = ({ records, onBack, onViewReport, onDelete, onEdit }) => {
  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <header className="sticky top-0 z-10 bg-white dark:bg-background-dark border-b border-gray-100 dark:border-gray-800 p-4 flex items-center justify-between">
        <button onClick={onBack} className="text-[#111418] dark:text-white flex size-10 items-center">
          <span className="material-symbols-outlined">arrow_back_ios</span>
        </button>
        <h2 className="text-lg font-bold flex-1 text-center dark:text-white pr-10">Histórico</h2>
      </header>

      <div className="p-4">
        <h3 className="text-lg font-bold dark:text-white">Registros Recentes</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Acompanhe a evolução respiratória</p>

        {records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <span className="material-symbols-outlined text-6xl mb-4">history</span>
            <p>Nenhum diagnóstico realizado ainda.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {records.map((record) => (
              <div
                key={record.result.id}
                className="flex flex-col gap-3 p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all group"
              >
                <div className="flex gap-4 cursor-pointer" onClick={() => onViewReport(record)}>
                  <div className="flex flex-col items-center">
                    <div className={`size-10 rounded-full flex items-center justify-center ${record.result.riskLevel === 'Elevado' ? 'bg-red-50 text-red-500' : 'bg-primary/10 text-primary'}`}>
                      <span className="material-symbols-outlined">pulmonology</span>
                    </div>
                    <div className="w-[2px] grow bg-gray-100 dark:bg-gray-800 mt-2"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold dark:text-white">Risco: {record.result.riskLevel}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(record.result.timestamp).toLocaleString('pt-PT')}
                        </p>
                      </div>
                      <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors">chevron_right</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 font-medium">Utente: {record.patient.name}</p>
                  </div>
                </div>

                {/* Actions Buttons */}
                <div className="flex gap-2 pl-14">
                  <button
                    onClick={(e) => { e.stopPropagation(); onEdit(record); }}
                    className="flex-1 h-9 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                    Editar
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Tem certeza que deseja apagar este registro?')) onDelete(record.result.id);
                    }}
                    className="flex-1 h-9 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                    Apagar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-auto p-4 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-3">
        <button onClick={onBack} className="w-full h-14 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold rounded-xl transition-all">
          Voltar à Tela Inicial
        </button>
        <div className="h-6"></div>
      </div>
    </div>
  );
};

export default HistoryExport;
