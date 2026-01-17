
import React from 'react';
// @ts-ignore
import logoCombined from '../src/assets/logo_combined.png';

interface Props {
  onStart: () => void;
  onHistory: () => void;
  onDownload: () => void;
}

const WelcomeScreen: React.FC<Props> = ({ onStart, onHistory, onDownload }) => {
  return (
    <div className="flex-1 flex flex-col bg-blue-50 dark:bg-background-dark relative overflow-hidden">

      {/* Header */}
      <header className="p-6 flex items-center justify-center gap-2">
        <span className="material-symbols-outlined text-blue-500 text-2xl">pulmonology</span>
        <h1 className="text-sm font-bold text-gray-900 dark:text-white">Projecto da TOSSE</h1>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col px-8 pb-10 pt-4 items-center">

        {/* Central Illustration Area */}
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-xs">

          {/* Dashed Circle Graphic */}

          {/* Visual Container */}
          <div className="relative size-72 mb-2 flex items-center justify-center">
            {/* Outer Ring - Stronger Blue & Thicker Border with Shadow */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-blue-400 dark:border-blue-500/50 shadow-lg shadow-blue-500/20"></div>

            {/* Inner Background */}
            <div className="absolute inset-4 rounded-full bg-white/60 dark:bg-blue-900/10 backdrop-blur-sm shadow-inner overflow-hidden">
              {/* Custom Logo Image - Clipped inside the circle */}
              <div className="w-full h-full flex items-center justify-center p-6">
                <img
                  src={logoCombined}
                  alt="Lungs and Coughing Person"
                  className="w-full h-full object-contain filter drop-shadow-sm opacity-90"
                />
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Bem-vindo ao</h2>
            <h2 className="text-3xl font-bold text-blue-500">Projecto da TOSSE</h2>
            <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed max-w-[280px] mx-auto mt-4">
              Sistema inteligente de análise acústica para auxílio no diagnóstico de patologias respiratórias através do som da tosse.
            </p>
          </div>

          {/* Navigation Icons - Moved Up */}
          <div className="grid grid-cols-2 gap-6 w-full px-4 mb-8">
            <MenuButton icon="medical_services" label="Diagnósticos" onClick={onHistory} />
            <MenuButton icon="download" label="Download" onClick={onDownload} />
          </div>

          {/* Main Action Button */}
          <button
            onClick={onStart}
            className="w-full h-14 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mb-6"
          >
            <span className="material-symbols-outlined">mic</span>
            Iniciar Novo Diagnóstico
          </button>

          <button className="text-xs font-bold text-blue-400 hover:text-blue-500 transition-colors mb-4">
            Como funciona?
          </button>

        </div>
      </div>
    </div>
  );
};

const MenuButton = ({ icon, label, onClick }: { icon: string, label: string, onClick: () => void }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center gap-2 hover:opacity-80 transition-opacity group"
  >
    <div className="size-10 rounded-full bg-blue-50 dark:bg-zinc-800 flex items-center justify-center text-blue-500 dark:text-blue-400">
      <span className="material-symbols-outlined text-xl">{icon}</span>
    </div>
    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide group-hover:text-blue-500">{label}</span>
  </button>
);

export default WelcomeScreen;
