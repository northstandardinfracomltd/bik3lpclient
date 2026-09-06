import React, { useEffect } from 'react';

interface SidePaneProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  widthClass?: string;
  showCloseButton?: boolean;
}

export const SidePane: React.FC<SidePaneProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  widthClass = 'max-w-xl',
  showCloseButton = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className={`w-screen ${widthClass} bg-white shadow-2xl flex flex-col justify-between rounded-none`}>
          
          {/* Header */}
          {(title || subtitle || showCloseButton) && (
            <div className="p-6 flex items-start justify-between bg-white">
              <div>
                {title && <h3 className="text-xl font-black tracking-tight text-neutral-950 uppercase">{title}</h3>}
                {subtitle && <p className="text-xs text-neutral-500 mt-1">{subtitle}</p>}
              </div>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full bg-black text-white text-xs font-black uppercase tracking-wider transition-colors cursor-pointer hover:bg-neutral-800"
                >
                  Fermer
                </button>
              )}
            </div>
          )}

          {/* Body Content */}
          <div className="p-6 overflow-y-auto flex-1 text-sm text-neutral-900 bg-white">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="p-6 bg-white flex items-center justify-between gap-3">
              {footer}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
