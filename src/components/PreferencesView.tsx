import React, { useState, useEffect } from 'react';
import { UserAccount, Language } from '../types';
import { translations } from '../translations';
import { getStoredAppsScriptUrl, setStoredAppsScriptUrl, testAppsScriptConnection } from '../services/accountService';

interface PreferencesViewProps {
  user: UserAccount;
  lang: Language;
  onLanguageChange: (newLang: Language) => void;
  isLiveSheet?: boolean;
  onOpenAppsScriptSidePane: () => void;
  isCodeTriggered?: boolean;
  onCodeTriggerHandled?: () => void;
}

export const PreferencesView: React.FC<PreferencesViewProps> = ({
  lang,
  onLanguageChange,
  onOpenAppsScriptSidePane,
  isCodeTriggered,
  onCodeTriggerHandled,
}) => {
  const t = translations[lang] || translations.fr;

  const [scriptUrl, setScriptUrl] = useState(getStoredAppsScriptUrl());
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (isCodeTriggered) {
      onOpenAppsScriptSidePane();
      if (onCodeTriggerHandled) onCodeTriggerHandled();
    }
  }, [isCodeTriggered, onOpenAppsScriptSidePane, onCodeTriggerHandled]);

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setStoredAppsScriptUrl(scriptUrl);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setTestResult(null);
    try {
      const res = await testAppsScriptConnection(scriptUrl);
      setTestResult(res);
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Erreur lors du test de connexion.',
      });
    } finally {
      setTestingConnection(false);
    }
  };

  return (
    <div className="bg-white space-y-6">
      
      {savedSuccess && (
        <div className="p-4 bg-black text-white rounded-none text-xs font-bold uppercase tracking-wider">
          {t.saved} ! URL Google Sheet synchronisée.
        </div>
      )}

      {/* Preferences Grid - Sharp 0px Border Radius, Full White */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Langue */}
        <div className="border border-neutral-300 p-6 rounded-none bg-white space-y-3">
          <span className="text-[11px] font-bold uppercase text-neutral-400 block">Langue de l'interface</span>
          <div className="flex flex-wrap gap-2">
            {[
              { code: 'fr', label: 'Français (FR)' },
              { code: 'en', label: 'English (EN)' },
              { code: 'nl', label: 'Nederlands (NL)' },
              { code: 'de', label: 'Deutsch (DE)' },
            ].map((item) => (
              <button
                key={item.code}
                onClick={() => onLanguageChange(item.code as Language)}
                className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider transition-colors cursor-pointer ${
                  lang === item.code
                    ? 'bg-black text-white'
                    : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="border border-neutral-300 p-6 rounded-none bg-white space-y-3">
          <span className="text-[11px] font-bold uppercase text-neutral-400 block">Communications & Alertes</span>
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer text-xs font-bold text-neutral-900">
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded-none accent-black" />
              <span>Notifications de prélèvement et renouvellement</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer text-xs font-bold text-neutral-900">
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded-none accent-black" />
              <span>Alertes suivi de sinistre par email</span>
            </label>
          </div>
        </div>

        {/* Connexion Google Sheet Web App */}
        <div className="border border-neutral-300 p-6 rounded-none bg-white md:col-span-2 space-y-4">
          <span className="text-[11px] font-bold uppercase text-neutral-400 block">
            Connexion Google Sheet Web App
          </span>
          <form onSubmit={handleSaveUrl} className="space-y-3">
            <input
              type="url"
              placeholder="https://script.google.com/macros/s/.../exec"
              value={scriptUrl}
              onChange={(e) => setScriptUrl(e.target.value)}
              className="w-full p-3 bg-white border border-neutral-400 rounded-none text-xs font-mono text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:border-black"
            />
            
            {testResult && (
              <div
                className={`p-3 text-xs font-bold rounded-none ${
                  testResult.success
                    ? 'bg-neutral-100 text-neutral-900 border-l-4 border-black'
                    : 'bg-neutral-100 text-neutral-900 border-l-4 border-neutral-400'
                }`}
              >
                {testResult.message}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                className="px-8 py-3.5 bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-wider rounded-full transition-colors cursor-pointer"
              >
                Enregistrer l'URL
              </button>
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testingConnection}
                className="px-8 py-3.5 bg-neutral-100 hover:bg-neutral-200 disabled:opacity-50 text-neutral-900 text-xs font-black uppercase tracking-wider rounded-full transition-colors cursor-pointer"
              >
                {testingConnection ? 'Test en cours...' : 'Tester la connexion'}
              </button>
              <button
                type="button"
                onClick={onOpenAppsScriptSidePane}
                className="px-8 py-3.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-black uppercase tracking-wider rounded-full transition-colors cursor-pointer"
              >
                Voir le code Google Apps Script
              </button>
            </div>
          </form>
        </div>

      </div>

    </div>
  );
};
