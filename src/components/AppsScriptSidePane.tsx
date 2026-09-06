import React, { useState } from 'react';
import { GOOGLE_APPS_SCRIPT_CODE } from '../utils/appsScriptCode';
import { SidePane } from './SidePane';
import { Language } from '../types';
import { translations } from '../translations';

interface AppsScriptSidePaneProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const AppsScriptSidePane: React.FC<AppsScriptSidePaneProps> = ({ isOpen, onClose, lang }) => {
  const [copied, setCopied] = useState(false);
  const t = translations[lang] || translations.fr;

  const handleCopy = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const csvHeaders = [
    'language_account', 'email_account', 'password_account', 'phone_account',
    'firstname_account', 'familyname_account', 'dateofbirth_account', 'birthcity_account',
    'birthcountry_account', 'streetandnumber_account', 'postalcode_account',
    'startdate_contract1', 'reference_contract1', 'status_contract1', 'bikemodel_contract1',
    'bikevalue_contract1', 'note_contract1', 'subscriptionamount_contract1',
    'subscriptionrecurringtype_contract1', 'paymentlink_contract1', 'documentlink_contract1',
    'gearsextended_contract1', 'valuegearsextended_contract1'
  ];

  return (
    <SidePane
      isOpen={isOpen}
      onClose={onClose}
      title="Code Google Apps Script"
      subtitle="Synchronisation directe avec votre tableur Google Sheet"
      widthClass="max-w-2xl"
      footer={
        <>
          <a
            href="https://script.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-neutral-900 underline"
          >
            Ouvrir Google Apps Script
          </a>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="px-6 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold rounded-full transition-colors cursor-pointer"
            >
              {copied ? 'Copié !' : 'Copier le script'}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-900 text-xs font-bold rounded-full transition-colors cursor-pointer"
            >
              {t.close}
            </button>
          </div>
        </>
      }
    >
      <div className="space-y-6 text-xs text-neutral-800 bg-white">
        
        {/* Instructions */}
        <div className="space-y-2">
          <h4 className="font-black text-sm uppercase text-neutral-950">Instructions d'installation :</h4>
          <ol className="list-decimal pl-5 space-y-1.5 text-neutral-700 leading-relaxed font-medium">
            <li>Dans votre Google Spreadsheet, assurez-vous que la <strong>Ligne 1</strong> contient les colonnes ci-dessous.</li>
            <li>Allez dans le menu <strong>Extensions &gt; Apps Script</strong>.</li>
            <li>Supprimez le code par défaut et collez le script ci-dessous.</li>
            <li>Cliquez sur <strong>Déployer &gt; Nouveau déploiement</strong>.</li>
            <li>Type : <strong>Application Web</strong> • Accès : <strong>Tout le monde (Anyone)</strong>.</li>
            <li>Copiez l'URL Web App générée et collez-la dans l'onglet <strong>Préférences</strong> de l'espace client.</li>
          </ol>
        </div>

        {/* CSV Columns Header Box */}
        <div className="bg-black text-neutral-100 p-4 rounded-none space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-neutral-400">En-têtes CSV (Ligne 1 de la feuille)</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(csvHeaders.join(','));
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="text-[11px] font-bold text-neutral-300 hover:text-white underline cursor-pointer"
            >
              Copier les colonnes
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto font-mono text-[11px]">
            {csvHeaders.map((col) => (
              <span key={col} className="bg-neutral-800 text-neutral-200 px-2 py-0.5 rounded-none border border-neutral-700">
                {col}
              </span>
            ))}
          </div>
        </div>

        {/* Script Code Block */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-black text-xs uppercase text-neutral-950">Code complet (Code.gs)</span>
            <button
              onClick={handleCopy}
              className="text-xs font-bold text-neutral-900 underline cursor-pointer"
            >
              {copied ? 'Copié dans le presse-papier' : 'Copier'}
            </button>
          </div>
          <pre className="bg-black text-neutral-200 p-4 rounded-none text-[11px] font-mono overflow-x-auto max-h-80 leading-relaxed border border-neutral-800">
            {GOOGLE_APPS_SCRIPT_CODE}
          </pre>
        </div>

      </div>
    </SidePane>
  );
};
