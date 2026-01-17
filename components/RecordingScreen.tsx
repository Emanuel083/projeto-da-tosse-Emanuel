
import React, { useState, useEffect, useRef } from 'react';
import { AnalysisResult } from '../types';
import { AntigravityEngine } from '../lib/antigravity';

interface Props {
  onComplete: (result: AnalysisResult) => void;
  onBack: () => void;
}

const RecordingScreen: React.FC<Props> = ({ onComplete, onBack }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [noiseLevel, setNoiseLevel] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number>();

  const steps = [
    'Limpando Ruído (Wiener)',
    'Extraindo MFCC',
    'Inferência TFLite'
  ];

  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => setTimer(t => t + 100), 100);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    if (isAnalyzing) {
      const stepInterval = setInterval(() => {
        setProcessingStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
      }, 1000);
      return () => clearInterval(stepInterval);
    }
  }, [isAnalyzing]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 256;

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      setIsRecording(true);
      drawWaveform();

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateNoise = () => {
        if (!isRecording && !analyserRef.current) return;
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setNoiseLevel(Math.floor((average / 255) * 100));
        if (streamRef.current?.active) {
          animationFrameRef.current = requestAnimationFrame(updateNoise);
        }
      };
      updateNoise();

    } catch (err) {
      console.error("Error accessing microphone", err);
      alert("Erro ao aceder ao microfone. Verifique as permissões.");
      onBack();
    }
  };

  const drawWaveform = () => {
    if (!analyserRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      if (!isRecording) return;
      requestAnimationFrame(render);
      analyserRef.current!.getByteTimeDomainData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#ef4444';
      ctx.lineCap = 'round';
      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvas.height / 2;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
      }
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };
    render();
  };

  const stopAndAnalyze = async () => {
    setIsRecording(false);
    setIsAnalyzing(true);

    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());

    const engine = AntigravityEngine.getInstance();
    const mockBlob = new Blob([], { type: 'audio/wav' });
    const result = await engine.processAudio(mockBlob, timer / 1000);

    onComplete(result);
  };

  const formatTime = (ms: number) => {
    const totalSeconds = ms / 1000;
    return totalSeconds.toFixed(1) + 's';
  };

  useEffect(() => {
    startRecording();
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  if (isAnalyzing) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-background-dark">
        <div className="relative mb-12">
          <div className="w-28 h-28 border-[4px] border-primary/5 border-t-primary rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-4xl animate-pulse">analytics</span>
          </div>
        </div>

        <h3 className="text-2xl font-black mb-2 dark:text-white tracking-tight">Em Processamento</h3>
        <p className="text-gray-400 dark:text-gray-500 mb-10 text-sm font-medium uppercase tracking-widest">Processamento Bioacústico Local</p>

        <div className="w-full max-w-xs space-y-4">
          {steps.map((step, idx) => (
            <div key={idx} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-500 ${idx <= processingStep ? 'bg-primary/5 border-primary/20 opacity-100' : 'bg-transparent border-gray-100 opacity-30'}`}>
              <div className={`size-8 rounded-full flex items-center justify-center ${idx <= processingStep ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                {idx < processingStep ? (
                  <span className="material-symbols-outlined text-sm">check</span>
                ) : (
                  <span className={`size-2 rounded-full bg-current ${idx === processingStep ? 'animate-ping' : ''}`}></span>
                )}
              </div>
              <span className={`text-sm font-bold ${idx <= processingStep ? 'text-primary' : 'text-gray-400'}`}>{step}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 text-white overflow-hidden">
      <header className="flex items-center p-6 justify-between">
        <button onClick={onBack} className="size-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-all">
          <span className="material-symbols-outlined">close</span>
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 mb-1">Captura Acústica</h2>
          <div className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-red-500 animate-pulse"></span>
            <p className="text-[12px] font-mono text-zinc-400">16kHz / 16-bit / Mono</p>
          </div>
        </div>
        <div className="size-10"></div>
      </header>

      <div className="flex-1 flex flex-col justify-center px-8 relative">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <canvas ref={canvasRef} width={400} height={200} className="w-full h-48 z-10 filter drop-shadow-[0_0_15px_rgba(25,127,230,0.3)]" />

        <div className="mt-16 text-center z-10">
          <p className="text-7xl font-mono font-black tracking-tighter mb-2 text-white">{formatTime(timer)}</p>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.3em]">Buffer Temporal</p>
        </div>
      </div>

      <div className="p-8 space-y-6 bg-zinc-900/80 backdrop-blur-md rounded-t-[48px] border-t border-white/5 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <div className="flex gap-4">
          <div className="flex-1 bg-white/5 rounded-3xl p-5 border border-white/5">
            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-2">Ruído Ambiente</p>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-black font-mono">{noiseLevel}</span>
              <span className="text-[10px] font-bold text-zinc-600 mb-1">dB SPL</span>
              <div className="flex-1 h-1.5 bg-zinc-800 rounded-full ml-2 mb-1.5 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${noiseLevel > 60 ? 'bg-red-500' : noiseLevel > 40 ? 'bg-yellow-500' : 'bg-green-500'}`}
                  style={{ width: `${noiseLevel}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-3xl p-6 border border-white/5 flex gap-5 items-center">
          <div className="size-12 rounded-2xl bg-red-600 flex items-center justify-center shrink-0 shadow-lg shadow-red-900/20">
            <span className="material-symbols-outlined text-white text-2xl">info</span>
          </div>
          <p className="text-sm leading-relaxed text-zinc-300 font-bold italic">
            "Tussa naturalmente a 20cm do microfone."
          </p>
        </div>

        <button
          onClick={stopAndAnalyze}
          className="w-full h-24 bg-red-600 hover:bg-red-500 rounded-[32px] flex items-center justify-between px-8 text-xl font-black shadow-2xl shadow-red-900/50 transition-all active:scale-95 group"
        >
          <div className="flex flex-col items-start">
            <span className="text-white">PARAR E ANALISAR</span>
            <span className="text-[10px] text-white/50 tracking-widest">INFERÊNCIA LOCAL</span>
          </div>
          <div className="size-14 rounded-2xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-3xl">stop_circle</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default RecordingScreen;
