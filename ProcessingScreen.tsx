/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Loader2, Sparkles, FileText, CheckCircle2 } from 'lucide-react';
import { summarizeNoteImage } from '../services/geminiService';
import { Note } from '../types';

interface ProcessingScreenProps {
  key?: React.Key;
  imageUrl: string;
  onComplete: (note: Note) => void;
  onError: (error: Error) => void;
}

/**
 * Screen displayed while the Gemini API is processing the image.
 */
export function ProcessingScreen({ imageUrl, onComplete, onError }: ProcessingScreenProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const processImage = async () => {
      try {
        // Simulate steps for better UX
        setTimeout(() => isMounted && setStep(1), 1500); // Uploading
        setTimeout(() => isMounted && setStep(2), 3000); // OCR
        setTimeout(() => isMounted && setStep(3), 5000); // Summarizing

        const result = await summarizeNoteImage(imageUrl);
        
        if (isMounted) {
          setStep(4); // Done
          setTimeout(() => {
            onComplete({
              id: Date.now().toString(),
              createdAt: Date.now(),
              imageUrl,
              ...result,
            });
          }, 1000);
        }
      } catch (error) {
        if (isMounted) {
          onError(error instanceof Error ? error : new Error('Unknown error occurred'));
        }
      }
    };

    processImage();

    return () => {
      isMounted = false;
    };
  }, [imageUrl, onComplete, onError]);

  const steps = [
    { icon: <FileText className="w-6 h-6" />, text: 'Preparing image...' },
    { icon: <Loader2 className="w-6 h-6 animate-spin" />, text: 'Extracting text (OCR)...' },
    { icon: <Sparkles className="w-6 h-6 text-amber-400" />, text: 'Generating smart summary...' },
    { icon: <CheckCircle2 className="w-6 h-6 text-emerald-500" />, text: 'Finalizing...' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-xl"
    >
      <div className="w-full max-w-md p-8 bg-white/10 border border-white/20 rounded-3xl shadow-2xl backdrop-blur-2xl text-center">
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 bg-indigo-500/30 rounded-full animate-ping" />
          <div className="absolute inset-2 bg-indigo-500/50 rounded-full animate-pulse" />
          <div className="absolute inset-4 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg">
            <Sparkles className="w-12 h-12 text-white animate-pulse" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-6">Analyzing Note</h2>

        <div className="space-y-4 text-left">
          {steps.map((s, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: step >= index ? 1 : 0.3, x: 0 }}
              className={`flex items-center space-x-4 p-4 rounded-xl transition-colors ${
                step === index ? 'bg-white/10 border border-white/20' : 'border border-transparent'
              }`}
            >
              <div className={`flex-shrink-0 ${step > index ? 'text-emerald-400' : 'text-indigo-300'}`}>
                {step > index ? <CheckCircle2 className="w-6 h-6" /> : s.icon}
              </div>
              <span className={`font-medium ${step >= index ? 'text-white' : 'text-slate-400'}`}>
                {s.text}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
