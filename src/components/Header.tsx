import React from 'react';
import { ActiveTab, Language, UserAccount } from '../types';

interface HeaderProps {
  user: UserAccount;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  lang: Language;
  onLanguageChange: (newLang: Language) => void;
  onLogout: () => void;
  onOpenAppsScriptSidePane: () => void;
  isLiveSheet?: boolean;
  onContextualAction: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  activeTab,
  setActiveTab,
  onLogout,
  onContextualAction,
}) => {
  const tabs: { id: ActiveTab; label: string }[] = [
    { id: 'profile', label: 'Profil' },
    { id: 'contracts', label: 'Contrat(s)' },
    { id: 'claims', label: 'Sinistre(s)' },
    { id: 'preferences', label: 'Préférences' },
  ];

  const getContextualButtonLabel = () => {
    switch (activeTab) {
      case 'profile':
        return 'Modifier mes informations';
      case 'contracts':
        return 'Souscrire un nouveau vélo';
      case 'claims':
        return 'Déclarer un sinistre';
      case 'preferences':
        return 'Code Google Apps Script';
      default:
        return 'Action';
    }
  };

  return (
    <header className="bg-white pt-8 pb-4">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* Navigation Bar: Logo Icon + Gelule Tabs + Gelule Déconnexion */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
          {/* Logo icon-only before Profil */}
          <a
            href="https://bikelp.com"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center justify-center mr-2"
            title="Bikelp"
          >
            <img
              src="https://civilprom.s3.eu-north-1.amazonaws.com/Bikelp_ico_black.svg"
              alt="Bikelp Icon"
              className="h-10 w-10 object-contain"
            />
          </a>

          {/* Gelule Tabs */}
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`px-8 py-3.5 rounded-full text-base font-bold tracking-tight transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-[#981b8d] text-white shadow-sm'
                    : 'bg-black text-white hover:bg-neutral-800'
                }`}
              >
                {tab.label}
              </button>
            );
          })}

          {/* Gelule Déconnexion after Préférences */}
          <button
            id="btn-logout"
            onClick={onLogout}
            className="px-8 py-3.5 rounded-full text-base font-bold tracking-tight bg-black text-white hover:bg-neutral-800 transition-all whitespace-nowrap cursor-pointer shrink-0"
          >
            Déconnexion
          </button>
        </div>

        {/* Contextual button active tab */}
        <div>
          <button
            id="btn-contextual-active-tab"
            onClick={onContextualAction}
            className="px-8 py-3.5 bg-[#695af7] hover:bg-[#5b4be8] text-white text-base font-bold rounded-2xl tracking-tight transition-all cursor-pointer shadow-sm"
          >
            {getContextualButtonLabel()}
          </button>
        </div>

      </div>
    </header>
  );
};
