import React, { useState } from 'react';
import { UserAccount, Contract, Language } from '../types';
import { translations } from '../translations';
import { DocumentSidePane } from './DocumentSidePane';

interface ContractsViewProps {
  user: UserAccount;
  lang: Language;
}

export const ContractsView: React.FC<ContractsViewProps> = ({ user, lang }) => {
  const t = translations[lang] || translations.fr;

  const [selectedDocContract, setSelectedDocContract] = useState<Contract | null>(null);
  const [docType, setDocType] = useState<'policy_ipid' | 'certificate'>('policy_ipid');

  const contracts = user.contracts || [];

  const handleOpenDoc = (contract: Contract, type: 'policy_ipid' | 'certificate') => {
    setSelectedDocContract(contract);
    setDocType(type);
  };

  return (
    <div className="bg-white space-y-6">
      
      {/* Empty state */}
      {contracts.length === 0 && (
        <div className="border border-neutral-300 p-10 text-center rounded-none bg-white space-y-4">
          <p className="text-sm font-bold text-neutral-900">Aucun contrat actif</p>
          <a
            href="https://bikelp.com"
            target="_blank"
            rel="noreferrer"
            className="inline-block px-8 py-3.5 bg-black text-white text-xs font-black uppercase tracking-wider rounded-full cursor-pointer"
          >
            Souscrire sur bikelp.com
          </a>
        </div>
      )}

      {/* Contracts List - Sharp 0px border radius, Full White */}
      <div className="space-y-6">
        {contracts.map((contract, index) => (
          <div
            key={contract.id || index}
            className="border border-neutral-300 p-6 sm:p-8 rounded-none bg-white space-y-6"
          >
            {/* Top row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-xs font-bold text-neutral-400 block mb-1">
                  POLICE #{contract.reference || `BK-${index + 1}`} • STATUT : {contract.status || 'ACTIF'}
                </span>
                <h2 className="text-2xl font-black text-neutral-950 uppercase tracking-tight">
                  {contract.bikemodel || 'Vélo non spécifié'}
                </h2>
              </div>

              <div className="sm:text-right">
                <span className="text-[11px] font-bold uppercase text-neutral-400 block">Cotisation</span>
                <p className="text-2xl font-black text-neutral-950">
                  {contract.subscriptionamount} € <span className="text-xs font-normal text-neutral-500">/ {contract.subscriptionrecurringtype}</span>
                </p>
              </div>
            </div>

            {/* Grid properties - Sharp 0px */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="border border-neutral-300 p-3 rounded-none bg-white">
                <span className="text-neutral-400 uppercase text-[10px] font-bold block mb-1">Valeur assurée</span>
                <span className="font-black text-neutral-950 text-sm">
                  {Number(contract.bikevalue || 0).toLocaleString()} €
                </span>
              </div>
              <div className="border border-neutral-300 p-3 rounded-none bg-white">
                <span className="text-neutral-400 uppercase text-[10px] font-bold block mb-1">Date d'effet</span>
                <span className="font-bold text-neutral-900">
                  {contract.startdate || 'Immédiate'}
                </span>
              </div>
              <div className="border border-neutral-300 p-3 rounded-none bg-white">
                <span className="text-neutral-400 uppercase text-[10px] font-bold block mb-1">Fréquence</span>
                <span className="font-bold text-neutral-900">
                  {contract.subscriptionrecurringtype || 'Mensuel'}
                </span>
              </div>
              <div className="border border-neutral-300 p-3 rounded-none bg-white">
                <span className="text-neutral-400 uppercase text-[10px] font-bold block mb-1">Référence</span>
                <span className="font-mono font-bold text-neutral-900">
                  {contract.reference}
                </span>
              </div>
            </div>

            {/* Accessoires */}
            {(contract.gearsextended || Number(contract.valuegearsextended) > 0) && (
              <div className="border border-neutral-300 p-4 rounded-none bg-white text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-neutral-900 uppercase text-[11px]">
                  <span>Accessoires & équipements</span>
                  {contract.valuegearsextended && (
                    <span className="font-mono">Plafond : {contract.valuegearsextended} €</span>
                  )}
                </div>
                <p className="text-neutral-700">
                  {contract.gearsextended || 'Accessoires déclarés à la souscription.'}
                </p>
              </div>
            )}

            {/* Notes */}
            {contract.note && (
              <div className="border border-neutral-300 p-4 rounded-none bg-white text-xs text-neutral-800">
                <span className="font-black uppercase text-[10px] block mb-1">Observations</span>
                <p>{contract.note}</p>
              </div>
            )}

            {/* Action Bar: Gelule Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  id={`btn-open-policy-sidepane-${contract.id}`}
                  onClick={() => handleOpenDoc(contract, 'policy_ipid')}
                  className="px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-black uppercase tracking-wider rounded-full transition-colors cursor-pointer"
                >
                  Conditions Générales & IPID
                </button>

                <button
                  id={`btn-open-cert-sidepane-${contract.id}`}
                  onClick={() => handleOpenDoc(contract, 'certificate')}
                  className="px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-black uppercase tracking-wider rounded-full transition-colors cursor-pointer"
                >
                  Attestation d'Assurance
                </button>
              </div>

              {contract.paymentlink ? (
                <a
                  href={contract.paymentlink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-7 py-3 bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-wider rounded-full transition-colors"
                >
                  Mettre à jour le paiement
                </a>
              ) : (
                <button
                  onClick={() => alert(`Mise à jour du paiement pour contrat ${contract.reference}`)}
                  className="px-7 py-3 bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-wider rounded-full transition-colors cursor-pointer"
                >
                  Mettre à jour le paiement
                </button>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* Side-Pane for Document Viewer */}
      {selectedDocContract && (
        <DocumentSidePane
          isOpen={!!selectedDocContract}
          onClose={() => setSelectedDocContract(null)}
          contract={selectedDocContract}
          user={user}
          documentType={docType}
          lang={lang}
        />
      )}

    </div>
  );
};
