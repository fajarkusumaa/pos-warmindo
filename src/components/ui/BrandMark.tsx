import React from 'react';
import { cn } from '../../utils/cn';

/** Yolk "88" square used in the register top bar and owner sidebar. */
export const BrandMark: React.FC<{ className?: string }> = ({ className }) => (
  <div
    aria-hidden
    className={cn(
      'shrink-0 flex items-center justify-center bg-w-yolk text-w-ink font-display font-extrabold',
      className,
    )}
  >
    88
  </div>
);
