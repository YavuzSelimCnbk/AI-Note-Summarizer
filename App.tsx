/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Note, ScreenState } from './types';
import { HomeScreen } from './screens/HomeScreen';
import { CameraScreen } from './screens/CameraScreen';
import { ProcessingScreen } from './screens/ProcessingScreen';
import { DetailScreen } from './screens/DetailScreen';

export default function App() {
  const [screen, setScreen] = useState<ScreenState>({ name: 'home' });
  const [notes, setNotes] = useState<Note[]>([]);

  // Load notes from local storage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('ai-notes');
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (e) {
        console.error('Failed to parse saved notes', e);
      }
    }
  }, []);

  // Save notes to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('ai-notes', JSON.stringify(notes));
  }, [notes]);

  const handleCapture = (base64Image: string) => {
    setScreen({ name: 'processing', imageUrl: base64Image });
  };

  const handleProcessingComplete = (newNote: Note) => {
    setNotes((prev) => [newNote, ...prev]);
    setScreen({ name: 'detail', noteId: newNote.id });
  };

  const handleProcessingError = (error: Error) => {
    console.error('Processing error:', error);
    alert('Failed to process the image. Please try again.');
    setScreen({ name: 'home' });
  };

  const handleUpdateNote = (updatedNote: Note) => {
    setNotes((prev) => prev.map((n) => (n.id === updatedNote.id ? updatedNote : n)));
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans selection:bg-indigo-200 selection:text-indigo-900">
      <AnimatePresence mode="wait">
        {screen.name === 'home' && (
          <HomeScreen
            key="home"
            notes={notes}
            onNewNote={() => setScreen({ name: 'camera' })}
            onViewNote={(id) => setScreen({ name: 'detail', noteId: id })}
          />
        )}
        
        {screen.name === 'camera' && (
          <CameraScreen
            key="camera"
            onCapture={handleCapture}
            onCancel={() => setScreen({ name: 'home' })}
          />
        )}
        
        {screen.name === 'processing' && (
          <ProcessingScreen
            key="processing"
            imageUrl={screen.imageUrl}
            onComplete={handleProcessingComplete}
            onError={handleProcessingError}
          />
        )}
        
        {screen.name === 'detail' && (
          <DetailScreen
            key="detail"
            note={notes.find((n) => n.id === screen.noteId)!}
            onBack={() => setScreen({ name: 'home' })}
            onUpdate={handleUpdateNote}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
