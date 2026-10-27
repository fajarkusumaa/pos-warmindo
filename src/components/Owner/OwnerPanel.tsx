import React, { useEffect, useRef } from 'react';
import { OwnerPage, OwnerSidebar } from './OwnerSidebar';

interface OwnerPanelProps extends React.ComponentProps<typeof OwnerSidebar> {
  children: React.ReactNode;
}

/** Paper canvas with the ink sidebar; each page scrolls inside the main column. */
export const OwnerPanel: React.FC<OwnerPanelProps> = ({ children, ...sidebar }) => {
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [sidebar.active]);

  return (
    <div className="theme-paper h-full flex bg-w-paper text-w-ink">
      <OwnerSidebar {...sidebar} />
      <main ref={mainRef} className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-[1600px] px-8 py-7">{children}</div>
      </main>
    </div>
  );
};

export type { OwnerPage };
