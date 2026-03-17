/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

/**
 * A reusable card component with a glassmorphism effect.
 * Perfect for the iPad-like modern UI.
 */
export function GlassCard({ children, className = '', ...props }: GlassCardProps) {
  return (
    <div
      className={`bg-white/40 backdrop-blur-xl border border-white/30 shadow-xl rounded-3xl overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
