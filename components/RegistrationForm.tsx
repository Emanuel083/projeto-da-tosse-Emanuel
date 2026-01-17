
import React, { useState } from 'react';
import { PatientData } from '../types';

interface Props {
  onConfirm: (data: PatientData) => void;
  onBack: () => void;
  initialData?: PatientData | null;
}

const RegistrationForm: React.FC<Props> = ({ onConfirm, onBack, initialData }) => {
  const [formData, setFormData] = useState<Partial<PatientData>>(initialData || {
    name: '',
    birthDate: '',
    address: '',
    phone: '',
    consent: false
  });

  const isValid = formData.name && formData.birthDate && formData.address && formData.consent;

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-background-dark">
      <div className="flex items-center p-4 justify-between border-b border-gray-100 dark:border-gray-800">
        <button onClick={onBack} className="text-[#111418] dark:text-white flex size-12 items-center">
          <span className="material-symbols-outlined">arrow_back_ios</span>
        </button>
        <h2 className="text-[#111418] dark:text-white text-lg font-bold flex-1 text-center pr-12 tracking-tight">Cadastro do Utente</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mb-8">
          <h3 className="text-[#111418] dark:text-white text-2xl font-bold pb-2">Identificação</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
            Preencha os dados do paciente para o processamento da análise bioacústica.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 pb-2">Nome Completo</label>
            <input
              type="text"
              placeholder="Ex: João da Silva"
              className="w-full h-14 rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-primary focus:border-primary px-4 transition-all"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 pb-2">Data de Nascimento</label>
              <input
                type="text"
                placeholder="DD/MM/AAAA"
                maxLength={10}
                className="w-full h-14 rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-primary focus:border-primary px-4 transition-all font-mono"
                value={formData.birthDate || ''}
                onChange={(e) => {
                  let v = e.target.value.replace(/\D/g, '');
                  if (v.length >= 5) v = `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4, 8)}`;
                  else if (v.length >= 3) v = `${v.slice(0, 2)}/${v.slice(2)}`;
                  setFormData({ ...formData, birthDate: v });
                }}
              />
            </div>
            <div className="w-24">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 pb-2">Idade</label>
              <div className="w-full h-14 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  {(() => {
                    if (!formData.birthDate || formData.birthDate.length !== 10) return '-';
                    const [d, m, y] = formData.birthDate.split('/').map(Number);
                    const birth = new Date(y, m - 1, d);
                    if (isNaN(birth.getTime())) return '-';
                    const diff = Date.now() - birth.getTime();
                    const age = Math.floor(diff / (31557600000));
                    return age >= 0 ? age : '-';
                  })()}
                </span>
                <span className="text-xs text-gray-400 ml-1">Anos</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 pb-2">Morada / Bairro</label>
            <input
              type="text"
              placeholder="Ex: Rua Direita, Bairro de Alvalade"
              className="w-full h-14 rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-primary focus:border-primary px-4 transition-all"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 pb-2">Número de Telefone <span className="text-gray-300 font-normal">(Opcional)</span></label>
            <input
              type="tel"
              placeholder="+244 9XX XXX XXX"
              className="w-full h-14 rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-primary focus:border-primary px-4 transition-all"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="mt-8 p-5 rounded-2xl bg-primary/5 border border-primary/10 flex gap-4 items-start group cursor-pointer select-none" onClick={() => setFormData({ ...formData, consent: !formData.consent })}>
            <div className="pt-0.5">
              <input
                id="consent"
                type="checkbox"
                className="w-6 h-6 text-primary rounded-lg border-gray-300 dark:border-gray-600 focus:ring-primary transition-all"
                checked={formData.consent}
                onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <label htmlFor="consent" className="text-xs font-semibold leading-relaxed text-gray-600 dark:text-gray-300 pointer-events-none">
              Consentimento Ético: O Utente aceita realizar o teste e autoriza o processamento local dos dados para análise?
            </label>
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-gray-100 dark:border-gray-800">
        <button
          disabled={!isValid}
          onClick={() => onConfirm(formData as PatientData)}
          className={`w-full h-16 rounded-2xl font-bold text-lg text-white transition-all transform active:scale-[0.98] ${isValid ? 'bg-primary shadow-xl shadow-primary/20' : 'bg-gray-200 dark:bg-gray-800 cursor-not-allowed opacity-50'}`}
        >
          Confirmar e Prosseguir
        </button>
      </div>
    </div>
  );
};

export default RegistrationForm;
