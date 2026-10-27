import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Modal } from '../ui/Modal';

export const PageHeader: React.FC<{
  title: string;
  eyebrow?: string;
  subtitle?: string;
  children?: React.ReactNode;
}> = ({ title, eyebrow, subtitle, children }) => (
  <header className="flex flex-wrap items-end gap-3">
    <div className="flex-1 min-w-[240px] flex flex-col gap-1">
      {eyebrow && <p className="text-[13px] font-semibold text-w-ink-2">{eyebrow}</p>}
      <h1 className="font-display text-[30px] leading-tight font-bold tracking-[-0.5px] text-w-ink">{title}</h1>
      {subtitle && <p className="text-sm text-w-ink-2">{subtitle}</p>}
    </div>
    {children}
  </header>
);

export const Card: React.FC<React.HTMLAttributes<HTMLElement> & { as?: 'section' | 'div' }> = ({
  as: Tag = 'section',
  className,
  ...rest
}) => <Tag className={cn('bg-w-card border border-w-line rounded-[20px]', className)} {...rest} />;

type ButtonVariant = 'primary' | 'dark' | 'outline';

const BUTTON: Record<ButtonVariant, string> = {
  primary: 'bg-w-yolk text-w-ink hover:brightness-105',
  dark: 'bg-w-ink text-white hover:bg-black',
  outline: 'bg-w-card text-w-ink border border-w-line hover:border-w-line-strong',
};

export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; icon?: React.ReactNode }
> = ({ variant = 'outline', icon, className, children, type = 'button', ...rest }) => (
  <button
    type={type}
    className={cn(
      'h-[42px] shrink-0 flex items-center gap-2 px-4 rounded-[11px] text-[13px] font-bold transition disabled:opacity-50',
      BUTTON[variant],
      className,
    )}
    {...rest}
  >
    {icon}
    {children}
  </button>
);

export const Swatch: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <span className="flex items-center gap-1.5 text-xs text-w-ink-2">
    <span className="w-2.5 h-2.5 rounded-[3px]" style={{ backgroundColor: color }} aria-hidden />
    {label}
  </span>
);

export const SectionTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <h2 className={cn('text-base font-bold text-w-ink', className)}>{children}</h2>
);

/** Paper-themed dialog used for the owner panel's small "add / record" forms. */
export const PaperModal: React.FC<{
  title: string;
  onClose: () => void;
  onSubmit: () => void;
  submitLabel: string;
  submitDisabled?: boolean;
  children: React.ReactNode;
}> = ({ title, onClose, onSubmit, submitLabel, submitDisabled, children }) => (
  <Modal labelledBy="paper-modal-title" onClose={onClose} className="w-full max-w-[440px] rounded-[20px] bg-w-card text-w-ink">
    <form
      className="flex flex-col gap-5 p-6"
      onSubmit={(e) => {
        e.preventDefault();
        if (!submitDisabled) onSubmit();
      }}
    >
      <div className="flex items-center gap-3">
        <h2 id="paper-modal-title" className="flex-1 font-display text-xl font-bold">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="w-9 h-9 flex items-center justify-center rounded-full bg-w-paper hover:bg-w-sunk"
        >
          <X className="w-[18px] h-[18px]" />
        </button>
      </div>
      {children}
      <div className="flex justify-end gap-2.5">
        <Button onClick={onClose}>Batal</Button>
        <Button type="submit" variant="primary" disabled={submitDisabled}>
          {submitLabel}
        </Button>
      </div>
    </form>
  </Modal>
);

export const Field: React.FC<{
  label: string;
  icon?: React.ReactNode;
  children: React.ReactElement<React.InputHTMLAttributes<HTMLInputElement>>;
  className?: string;
}> = ({ label, icon, children, className }) => (
  <label className={cn('flex flex-col gap-1.5', className)}>
    <span className="text-[13px] font-semibold text-w-ink">{label}</span>
    <span className="h-11 flex items-center gap-2 px-3.5 rounded-[10px] bg-w-card outline outline-1 -outline-offset-1 outline-w-line-strong focus-within:outline-2 focus-within:outline-w-ink">
      {icon}
      {React.cloneElement(children, {
        className: cn(
          'flex-1 min-w-0 bg-transparent text-sm text-w-ink outline-none placeholder:text-w-ink-2/70',
          children.props.className,
        ),
      })}
    </span>
  </label>
);
