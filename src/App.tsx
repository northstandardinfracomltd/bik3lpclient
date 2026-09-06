import React, { useState } from 'react';
import { UserAccount, ActiveTab, Language, Claim } from './types';
import { Header } from './components/Header';
import { LoginView } from './components/LoginView';
import { ProfileView } from './components/ProfileView';
import { ContractsView } from './components/ContractsView';
import { ClaimsView } from './components/ClaimsView';
import { PreferencesView } from './components/PreferencesView';
import { AppsScriptSidePane } from './components/AppsScriptSidePane';
import { formatRawAccountToUser, DEMO_ACCOUNTS_RAW } from './services/accountService';

export default function App() {
  // Initialize with active demo account by default
  const [user, setUser] = useState<UserAccount | null>(() => formatRawAccountToUser(DEMO_ACCOUNTS_RAW[0]));
  const [activeTab, setActiveTab] = useState<ActiveTab>('profile');
  const [lang, setLang] = useState<Language>('fr');
  const [isLiveSheet, setIsLiveSheet] = useState(false);
  const [isAppsScriptSidePaneOpen, setIsAppsScriptSidePaneOpen] = useState(false);
  
  // Side-pane triggers from the contextual button
  const [isEditProfileTriggered, setIsEditProfileTriggered] = useState(false);
  const [isClaimTriggered, setIsClaimTriggered] = useState(false);
  const [isCodeTriggered, setIsCodeTriggered] = useState(false);

  const handleLoginSuccess = (loggedInUser: UserAccount, isLive?: boolean) => {
    setUser(loggedInUser);
    setIsLiveSheet(!!isLive);
    if (loggedInUser.language_account && ['fr', 'en', 'nl', 'de'].includes(loggedInUser.language_account)) {
      setLang(loggedInUser.language_account as Language);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('profile');
  };

  const handleUpdateUser = (updated: UserAccount) => {
    setUser(updated);
  };

  const handleClaimSubmitted = (newClaim: Claim) => {
    if (!user) return;
    setUser({
      ...user,
      claims: [newClaim, ...(user.claims || [])],
    });
  };

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    if (user) {
      setUser({
        ...user,
        language_account: newLang,
      });
    }
  };

  const handleContextualAction = () => {
    switch (activeTab) {
      case 'profile':
        setIsEditProfileTriggered(true);
        break;
      case 'contracts':
        window.open('https://bikelp.com', '_blank');
        break;
      case 'claims':
        setIsClaimTriggered(true);
        break;
      case 'preferences':
        setIsAppsScriptSidePaneOpen(true);
        break;
    }
  };

  // If not authenticated, display Login page
  if (!user) {
    return (
      <main className="min-h-screen bg-white text-neutral-900 selection:bg-black selection:text-white">
        <LoginView
          onLoginSuccess={handleLoginSuccess}
          lang={lang}
          onLanguageChange={handleLanguageChange}
          onOpenAppsScriptSidePane={() => setIsAppsScriptSidePaneOpen(true)}
        />
        <AppsScriptSidePane
          isOpen={isAppsScriptSidePaneOpen}
          onClose={() => setIsAppsScriptSidePaneOpen(false)}
          lang={lang}
        />
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-main text-neutral-900 selection:bg-black selection:text-white">
      
      {/* Header: Logo Icon + Gelule Tabs + Gelule Déconnexion + Contextual Button */}
      <Header
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        onLanguageChange={handleLanguageChange}
        onLogout={handleLogout}
        onOpenAppsScriptSidePane={() => setIsAppsScriptSidePaneOpen(true)}
        isLiveSheet={isLiveSheet}
        onContextualAction={handleContextualAction}
      />

      {/* Main Container - Pure Full White */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'profile' && (
          <ProfileView
            user={user}
            onUpdateUser={handleUpdateUser}
            lang={lang}
            isLiveSheet={isLiveSheet}
            isEditTriggered={isEditProfileTriggered}
            onEditTriggerHandled={() => setIsEditProfileTriggered(false)}
          />
        )}

        {activeTab === 'contracts' && (
          <ContractsView
            user={user}
            lang={lang}
          />
        )}

        {activeTab === 'claims' && (
          <ClaimsView
            user={user}
            lang={lang}
            onClaimSubmitted={handleClaimSubmitted}
            isClaimTriggered={isClaimTriggered}
            onClaimTriggerHandled={() => setIsClaimTriggered(false)}
          />
        )}

        {activeTab === 'preferences' && (
          <PreferencesView
            user={user}
            lang={lang}
            onLanguageChange={handleLanguageChange}
            onOpenAppsScriptSidePane={() => setIsAppsScriptSidePaneOpen(true)}
            isLiveSheet={isLiveSheet}
            isCodeTriggered={isCodeTriggered}
            onCodeTriggerHandled={() => setIsCodeTriggered(false)}
          />
        )}
      </main>

      {/* Side-Pane for Google Apps Script Code */}
      <AppsScriptSidePane
        isOpen={isAppsScriptSidePaneOpen}
        onClose={() => setIsAppsScriptSidePaneOpen(false)}
        lang={lang}
      />

    </div>
  );
}
