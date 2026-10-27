import React from 'react';
import { cn } from '../../utils/cn';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  className?: string;
}

/** 40×24 switch from the owner screens: leaf when on, warm grey when off. */
export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label, className }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange(!checked)}
    className={cn(
      'w-10 h-6 shrink-0 flex p-[3px] rounded-full transition-colors',
      checked ? 'bg-w-leaf justify-end' : 'bg-w-toggle-off justify-start',
      className,
    )}
  >
    <span className="w-[18px] h-[18px] rounded-full bg-white shadow-sm" />
  </button>
);
