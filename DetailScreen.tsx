/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Share2, Copy, Edit3, Check, FileText, ListTodo, Lightbulb, Sparkles } from 'lucide-react';
import { Note } from '../types';
import { Header } from '../components/Header';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';

interface DetailScreenProps {
  key?: React.Key;
  note: Note;
  onBack: () => void;
  onUpdate: (updatedNote: Note) => void;
}

/**
 * Screen displaying the detailed summary, key takeaways, and action items of a note.
 */
export function DetailScreen({ note, onBack, onUpdate }: DetailScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSummary, setEditedSummary] = useState(note.summary);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const textToCopy = `
Summary:
${note.summary}

Key Takeaways:
${note.keyTakeaways.map(t => `- ${t}`).join('\n')}

Action Items:
${note.actionItems.map(a => `- ${a}`).join('\n')}
    `.trim();

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleSave = () => {
    onUpdate({ ...note, summary: editedSummary });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col">
      <Header
        title="Note Details"
        onBack={onBack}
        rightAction={
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={handleCopy} title="Copy to clipboard">
              {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5 text-slate-600" />}
            </Button>
            <Button variant="ghost" size="icon" title="Share">
              <Share2 className="w-5 h-5 text-slate-600" />
            </Button>
          </div>
        }
      />

      <main className="flex-1 px-4 py-8 md:px-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Image & Original Text */}
          <div className="lg:col-span-4 space-y-6">
            <GlassCard className="p-4">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={note.imageUrl}
                  alt="Original Note"
                  className="w-full h-full object-cover"
                />
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="w-5 h-5 text-slate-400" />
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Original Text (OCR)</h3>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 max-h-64 overflow-y-auto text-sm text-slate-600 font-mono whitespace-pre-wrap border border-slate-100">
                {note.originalText}
              </div>
            </GlassCard>
          </div>

          {/* Right Column: AI Analysis */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Summary Section */}
            <motion.div layoutId={`card-${note.id}`}>
              <GlassCard className="p-8 border-indigo-100/50 shadow-indigo-900/5">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Sparkles className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Smart Summary</h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    className="text-indigo-600 hover:bg-indigo-50"
                  >
                    {isEditing ? (
                      <>
                        <Check className="w-4 h-4 mr-2" /> Save
                      </>
                    ) : (
                      <>
                        <Edit3 className="w-4 h-4 mr-2" /> Edit
                      </>
                    )}
                  </Button>
                </div>

                {isEditing ? (
                  <textarea
                    value={editedSummary}
                    onChange={(e) => setEditedSummary(e.target.value)}
                    className="w-full h-48 p-4 bg-white border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-slate-700 leading-relaxed"
                  />
                ) : (
                  <p className="text-lg text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {note.summary}
                  </p>
                )}
              </GlassCard>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Key Takeaways */}
              <GlassCard className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Lightbulb className="w-5 h-5 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800">Key Takeaways</h3>
                </div>
                <ul className="space-y-4">
                  {note.keyTakeaways.map((takeaway, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-sm font-bold mt-0.5 border border-amber-200">
                        {index + 1}
                      </span>
                      <span className="text-slate-700 leading-relaxed">{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>

              {/* Action Items */}
              <GlassCard className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <ListTodo className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800">Action Items</h3>
                </div>
                {note.actionItems.length > 0 ? (
                  <ul className="space-y-4">
                    {note.actionItems.map((item, index) => (
                      <li key={index} className="flex items-start space-x-3 group">
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-5 h-5 rounded border-2 border-emerald-300 group-hover:border-emerald-500 transition-colors cursor-pointer" />
                        </div>
                        <span className="text-slate-700 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    No action items identified.
                  </div>
                )}
              </GlassCard>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
