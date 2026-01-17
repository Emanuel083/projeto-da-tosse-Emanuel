
export enum Screen {
  WELCOME = 'WELCOME',
  REGISTRATION = 'REGISTRATION',
  RECORDING = 'RECORDING',
  RESULT = 'RESULT',
  HISTORY = 'HISTORY',
  REPORT = 'REPORT'
}

export interface PatientData {
  name: string;
  birthDate: string;
  address: string;
  phone?: string;
  consent: boolean;
}

export interface DiagnosisProbabilities {
  pneumonia: number;
  bronchite: number;
  asma: number;
  normal: number;
}

export interface AnalysisResult {
  id: string;
  timestamp: number;
  probabilities: DiagnosisProbabilities;
  riskLevel: 'Baixo' | 'Moderado' | 'Elevado';
  audioDuration: number;
  clinicalNote: string;
}

export interface HistoryRecord {
  patient: PatientData;
  result: AnalysisResult;
}
