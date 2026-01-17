
import React, { useState, useEffect } from 'react';
import { Screen, PatientData, AnalysisResult, HistoryRecord } from './types';
import WelcomeScreen from './components/WelcomeScreen';
import RegistrationForm from './components/RegistrationForm';
import RecordingScreen from './components/RecordingScreen';
import AnalysisResultScreen from './components/AnalysisResult';
import HistoryExport from './components/HistoryExport';
import MedicalReport from './components/MedicalReport';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.WELCOME);
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [lastResult, setLastResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('tosse_history');
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const saveToHistory = (record: HistoryRecord) => {
    let updated: HistoryRecord[];
    if (editingRecordId) {
      // Replace existing record if editing
      updated = history.map(h => h.result.id === editingRecordId ? record : h);
      setEditingRecordId(null);
    } else {
      // Add new record
      updated = [record, ...history];
    }
    setHistory(updated);
    localStorage.setItem('tosse_history', JSON.stringify(updated));
  };

  const navigateTo = (screen: Screen) => setCurrentScreen(screen);

  const downloadHistory = () => {
    if (history.length === 0) {
      alert("Nenhum histórico disponível para descarregar.");
      return;
    }

    let textData = "PROJECTO DA TOSSE - RELATÓRIO DE HISTÓRICO\n";
    textData += "========================================\n\n";

    history.forEach((record, index) => {
      const date = new Date(record.result.timestamp).toLocaleString('pt-PT');
      textData += `Diagnóstico #${history.length - index}\n`;
      textData += `Data e Hora: ${date}\n`;
      textData += `Nome do Paciente: ${record.patient.name}\n`;
      textData += `Parecer Clínico: ${record.result.clinicalNote}\n`;
      textData += `Resultados de Análise:\n`;
      textData += `  - Probabilidade de Pneumonia: ${record.result.probabilities.pneumonia}%\n`;
      textData += `  - Probabilidade de Bronquite: ${record.result.probabilities.bronchite}%\n`;
      textData += `  - Probabilidade de Asma: ${record.result.probabilities.asma}%\n`;
      textData += `  - Probabilidade de Normalidade: ${record.result.probabilities.normal}%\n`;
      textData += "----------------------------------------\n\n";
    });

    const blob = new Blob([textData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", url);
    downloadAnchorNode.setAttribute("download", `historico_diagnosticos_${new Date().toISOString().slice(0, 10)}.txt`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    URL.revokeObjectURL(url);
  };

  const deleteRecord = (id: string) => {
    const updated = history.filter(h => h.result.id !== id);
    setHistory(updated);
    localStorage.setItem('tosse_history', JSON.stringify(updated));
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.WELCOME:
        return (
          <WelcomeScreen
            onStart={() => navigateTo(Screen.REGISTRATION)}
            onHistory={() => navigateTo(Screen.HISTORY)}
            onDownload={downloadHistory}
          />
        );
      case Screen.REGISTRATION:
        return (
          <RegistrationForm
            initialData={patientData}
            onConfirm={(data) => {
              setPatientData(data);
              navigateTo(Screen.RECORDING);
            }}
            onBack={() => navigateTo(Screen.WELCOME)}
          />
        );
      case Screen.RECORDING:
        return (
          <RecordingScreen
            onComplete={(result) => {
              setLastResult(result);
              if (patientData) {
                saveToHistory({ patient: patientData, result });
              }
              navigateTo(Screen.RESULT);
            }}
            onBack={() => navigateTo(Screen.REGISTRATION)}
          />
        );
      case Screen.RESULT:
        return lastResult ? (
          <AnalysisResultScreen
            result={lastResult}
            onNewTest={() => {
              setEditingRecordId(null);
              navigateTo(Screen.REGISTRATION);
            }}
            onViewHistory={() => {
              setEditingRecordId(null);
              navigateTo(Screen.HISTORY);
            }}
            onHome={() => {
              setEditingRecordId(null);
              navigateTo(Screen.WELCOME);
            }}
          />
        ) : null;
      case Screen.HISTORY:
        return (
          <HistoryExport
            records={history}
            onBack={() => navigateTo(Screen.WELCOME)}
            onViewReport={(record) => {
              setPatientData(record.patient);
              setLastResult(record.result);
              navigateTo(Screen.REPORT);
            }}
            onDelete={deleteRecord}
            onEdit={(record) => {
              setPatientData(record.patient);
              setEditingRecordId(record.result.id);
              navigateTo(Screen.REGISTRATION);
            }}
          />
        );
      case Screen.REPORT:
        return patientData && lastResult ? (
          <MedicalReport
            patient={patientData}
            result={lastResult}
            onBack={() => navigateTo(Screen.HISTORY)}
          />
        ) : null;
      default:
        return <WelcomeScreen onStart={() => navigateTo(Screen.REGISTRATION)} />;
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-gray-100 dark:bg-black print:bg-white print:p-0">
      <div className="w-full max-w-[480px] bg-white dark:bg-background-dark min-h-screen shadow-2xl relative flex flex-col overflow-hidden print:max-w-none print:shadow-none print:min-h-0">
        {renderScreen()}
      </div>
    </div>
  );
};

export default App;
