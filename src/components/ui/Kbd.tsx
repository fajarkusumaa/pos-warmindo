import React from 'react';
import { cn } from '../../utils/cn';

export const Kbd: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <kbd className={cn('font-sans text-xs font-bold rounded-md px-[7px] py-[3px]', className)}>{children}</kbd>
);
