/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Plus, FileText, Search, Clock } from 'lucide-react';
import { Note } from '../types';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';

interface HomeScreenProps {
  key?: React.Key;
  notes: Note[];
  onNewNote: () => void;
  onViewNote: (id: string) => void;
}

/**
 * The main dashboard screen displaying a grid of summarized notes.
 */
export function HomeScreen({ notes, onNewNote, onViewNote }: HomeScreenProps) {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredNotes = notes.filter(note => 
    note.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.originalText.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col">
      {/* Header Area */}
      <header className="px-8 pt-12 pb-6 sticky top-0 z-40 bg-slate-50/80 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">Notes</h1>
            <p className="text-slate-500 mt-1 text-lg">Your AI-summarized insights</p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/60 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-sm backdrop-blur-sm transition-all"
              />
            </div>
            <Button variant="primary" size="lg" onClick={onNewNote} className="shrink-0 gap-2">
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">New Note</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-8 py-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
              <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                <FileText className="w-12 h-12 text-indigo-300" />
              </div>
              <h2 className="text-2xl font-semibold text-slate-800 mb-2">No notes yet</h2>
              <p className="text-slate-500 max-w-md mb-8">
                Take a photo of your handwritten notes or upload an image to generate an AI summary.
              </p>
              <Button variant="primary" size="lg" onClick={onNewNote}>
                <Plus className="w-5 h-5 mr-2" />
                Create First Note
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note) => (
                <motion.div
                  key={note.id}
                  layoutId={`card-${note.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4 }}
                  onClick={() => onViewNote(note.id)}
                  className="cursor-pointer group"
                >
                  <GlassCard className="h-full flex flex-col p-6 hover:shadow-2xl hover:border-indigo-200 transition-all duration-300">
                    <div className="flex items-center text-xs font-medium text-slate-400 mb-4">
                      <Clock className="w-4 h-4 mr-1.5" />
                      {new Date(note.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-slate-800 mb-3 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
                      {note.summary.split('\n')[0] || 'Untitled Note'}
                    </h3>
                    
                    <p className="text-slate-600 text-sm line-clamp-3 mb-6 flex-1">
                      {note.summary}
                    </p>
                    
                    <div className="flex items-center gap-3 mt-auto pt-4 border-t border-slate-100">
                      <div className="flex -space-x-2">
                        {note.keyTakeaways.slice(0, 3).map((_, i) => (
                          <div key={i} className="w-6 h-6 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center">
                            <span className="text-[10px] font-bold text-indigo-600">{i + 1}</span>
                          </div>
                        ))}
                      </div>
                      <span className="text-xs font-medium text-slate-500">
                        {note.keyTakeaways.length} Key Points
                      </span>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
