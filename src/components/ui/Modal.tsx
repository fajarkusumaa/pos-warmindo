import React, { useEffect, useRef } from 'react';
import { cn } from '../../utils/cn';

/** Open dialogs, innermost last — only the top one reacts to Escape. */
const stack: object[] = [];

interface ModalProps {
  labelledBy: string;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

/** Overlay + dialog shell: Escape and backdrop close it, focus moves in and is restored on close. */
export const Modal: React.FC<ModalProps> = ({ labelledBy, onClose, children, className }) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    const first =
      dialog?.querySelector<HTMLElement>('[data-autofocus]') ??
      dialog?.querySelector<HTMLElement>('button, input, select, textarea');
    first?.focus();
    const token = {};
    stack.push(token);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && stack[stack.length - 1] === token) onCloseRef.current();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      stack.splice(stack.indexOf(token), 1);
      document.removeEventListener('keydown', onKey);
      previous?.focus?.();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="absolute inset-0" onClick={onClose} aria-hidden />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className={cn('relative max-h-full overflow-hidden flex flex-col shadow-[0_24px_64px_rgba(0,0,0,0.5)]', className)}
      >
        {children}
      </div>
    </div>
  );
};
