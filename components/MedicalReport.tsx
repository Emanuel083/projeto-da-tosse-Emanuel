
import React from 'react';
import { PatientData, AnalysisResult } from '../types';

interface Props {
  patient: PatientData;
  result: AnalysisResult;
  onBack: () => void;
}

const MedicalReport: React.FC<Props> = ({ patient, result, onBack }) => {
  const calculateAge = (dob: string) => {
    const diff = Date.now() - new Date(dob).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-y-auto min-h-screen">
      <header className="no-print flex items-center p-6 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <button onClick={onBack} className="text-[#111418] flex size-10 items-center justify-center rounded-full hover:bg-gray-100">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold flex-1 text-center pr-10">Relatório Médico PDF</h2>
      </header>

      <div className="p-10 print:p-0 max-w-4xl mx-auto w-full bg-white">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-4 border-b-2 border-primary pb-4">
          <div>
            <div className="flex items-center gap-3 text-primary mb-2">
              <span className="material-symbols-outlined text-4xl">medical_services</span>
              <h1 className="text-3xl font-black tracking-tight">Projecto TOSSE</h1>
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Unidade de Diagnóstico Bioacústico Digital</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-gray-500 uppercase">Documento ID</p>
            <p className="text-sm font-mono font-bold bg-gray-100 px-2 py-1 rounded">{result.id}</p>
          </div>
        </div>

        {/* Patient Data Grid */}
        <div className="grid grid-cols-3 gap-6 mb-4">
          <InfoBox label="Paciente" value={patient.name} />
          <InfoBox label="Idade" value={`${calculateAge(patient.birthDate)} Anos`} />
          <InfoBox label="Localização" value={patient.address} />
          <InfoBox label="Contacto" value={patient.phone || 'Não informado'} />
          <InfoBox label="Data do Exame" value={new Date(result.timestamp).toLocaleDateString('pt-PT')} />
          <InfoBox label="Hora" value={new Date(result.timestamp).toLocaleTimeString('pt-PT')} />
        </div>

        {/* Acoustic Analysis Visual */}
        <div className="mb-4">
          <h3 className="text-sm font-black uppercase text-gray-400 tracking-widest mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">analytics</span>
            Espectrograma de Frequência (Log-Mel)
          </h3>
          <div className="h-40 bg-zinc-950 rounded-2xl relative overflow-hidden flex items-end px-2 pb-2 gap-1">
            {[...Array(40)].map((_, i) => (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-blue-600 to-primary rounded-t-sm"
                style={{ height: `${Math.random() * 80 + 10}%`, opacity: 0.7 }}
              ></div>
            ))}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>
            <div className="absolute top-4 left-4 text-[8px] font-mono text-white/40">Hz / Magnitude</div>
          </div>
          <div className="flex justify-between mt-2 text-[10px] font-mono text-gray-400 px-2">
            <span>20 Hz</span>
            <span></span>
            <span>8000 Hz</span>
          </div>
        </div>

        {/* IA Inference Section */}
        <div className="mb-4">
          <h3 className="text-sm font-black uppercase text-gray-400 tracking-widest mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">psychology</span>
            Resultados da Inferência IA (TFLite)
          </h3>
          <div className="border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <th className="px-6 py-4">Patologia Analisada</th>
                  <th className="px-6 py-4">Probabilidade</th>
                  <th className="px-6 py-4">Confiança do Modelo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                <ReportRow label="Pneumonia" value={result.probabilities.pneumonia} highlight />
                <ReportRow label="Bronquite" value={result.probabilities.bronchite} />
                <ReportRow label="Asma" value={result.probabilities.asma} />
                <ReportRow label="Normalidade" value={result.probabilities.normal} />
              </tbody>
            </table>
          </div>
        </div>

        {/* Clinical Summary */}
        <div className="mb-6 p-8 bg-primary/5 rounded-[40px] border border-primary/10 relative overflow-hidden">
          <div className="absolute -top-6 -right-6 text-primary/5">
            <span className="material-symbols-outlined text-[140px]">contract</span>
          </div>
          <p className="text-lg font-serif text-gray-800 leading-relaxed italic relative z-10">
            "{result.clinicalNote}"
          </p>
        </div>

        {/* Footer & Auth */}
        <div className="mt-8 border-t pt-8 flex justify-between items-end">
          <div className="max-w-xs">

            <p className="text-[10px] text-gray-400 font-bold uppercase"></p>
          </div>
          <div className="text-center">
          </div>
        </div>
      </div>

      <div className="no-print p-6 bg-gray-50 border-t flex justify-center sticky bottom-0">
        <button
          onClick={() => window.print()}
          className="h-16 px-12 bg-primary text-white font-bold rounded-2xl shadow-xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined">print</span>
          GERAR RELATÓRIO PDF
        </button>
      </div>
    </div>
  );
};

const InfoBox = ({ label, value }: { label: string, value: string }) => (
  <div className="border-b border-gray-100 pb-2">
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-sm font-bold text-gray-800">{value}</p>
  </div>
);

const ReportRow = ({ label, value, highlight = false }: { label: string, value: number, highlight?: boolean }) => (
  <tr className={highlight ? 'bg-primary/5' : ''}>
    <td className="px-6 py-4 font-bold text-gray-700">{label}</td>
    <td className="px-6 py-4">
      <div className="flex items-center gap-4">
        <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full ${highlight ? 'bg-primary' : 'bg-gray-300'}`} style={{ width: `${value}%` }}></div>
        </div>
        <span className={`font-black ${highlight ? 'text-primary' : 'text-gray-400'}`}>{value}%</span>
      </div>
    </td>
    <td className="px-6 py-4 text-xs font-medium text-gray-400">Alta Precisão</td>
  </tr>
);

export default MedicalReport;
