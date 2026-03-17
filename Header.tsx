/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './Button';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

/**
 * A reusable header component for screens, supporting a back button and right-aligned actions.
 */
export function Header({ title, onBack, rightAction }: HeaderProps) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex items-center justify-between px-6 py-4 bg-white/40 backdrop-blur-2xl border-b border-white/20 sticky top-0 z-50"
    >
      <div className="flex items-center space-x-4">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack} aria-label="Go back">
            <ArrowLeft className="w-6 h-6" />
          </Button>
        )}
        <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
          {title}
        </h1>
      </div>
      {rightAction && <div>{rightAction}</div>}
    </motion.header>
  );
}
