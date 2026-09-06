import React, { useState, useEffect } from 'react';
import { UserAccount, Claim, Language } from '../types';
import { translations } from '../translations';
import { submitClaim } from '../services/accountService';
import { SidePane } from './SidePane';

interface ClaimsViewProps {
  user: UserAccount;
  lang: Language;
  onClaimSubmitted: (newClaim: Claim) => void;
  isClaimTriggered?: boolean;
  onClaimTriggerHandled?: () => void;
}

export const ClaimsView: React.FC<ClaimsViewProps> = ({
  user,
  lang,
  onClaimSubmitted,
  isClaimTriggered,
  onClaimTriggerHandled,
}) => {
  const t = translations[lang] || translations.fr;

  const [isSidePaneOpen, setIsSidePaneOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(false);
  const [errorToast, setErrorToast] = useState('');

  // Form State
  const [selectedContractRef, setSelectedContractRef] = useState(
    user.contracts && user.contracts.length > 0 ? user.contracts[0].reference : ''
  );
  const [claimType, setClaimType] = useState<'vol' | 'casse' | 'accident' | 'vandalisme' | 'autre'>('vol');
  const [incidentDate, setIncidentDate] = useState(new Date().toISOString().slice(0, 10));
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [policeReportNumber, setPoliceReportNumber] = useState('');

  const claims = user.claims || [];

  useEffect(() => {
    if (isClaimTriggered) {
      if (user.contracts && user.contracts.length > 0 && !selectedContractRef) {
        setSelectedContractRef(user.contracts[0].reference);
      }
      setIsSidePaneOpen(true);
      if (onClaimTriggerHandled) onClaimTriggerHandled();
    }
  }, [isClaimTriggered, onClaimTriggerHandled, selectedContractRef, user.contracts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !location.trim()) {
      setErrorToast('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setSubmitting(true);
    setErrorToast('');

    const targetContract = user.contracts?.find((c) => c.reference === selectedContractRef);
    const bikeModel = targetContract ? targetContract.bikemodel : 'Vélo Bikelp';

    try {
      const res = await submitClaim(
        {
          contractReference: selectedContractRef || 'BK-GLOBAL',
          bikemodel: bikeModel,
          type: claimType,
          date: incidentDate,
          location,
          description,
          policeReportNumber: policeReportNumber || undefined,
        },
        user.email_account
      );

      if (res.success && res.claimId) {
        const newClaimObj: Claim = {
          id: res.claimId,
          contractReference: selectedContractRef || 'BK-GLOBAL',
          bikemodel: bikeModel,
          type: claimType,
          date: incidentDate,
          location,
          description,
          policeReportNumber: policeReportNumber || undefined,
          status: 'En cours d\'instruction',
          createdAt: new Date().toISOString().slice(0, 10),
        };

        onClaimSubmitted(newClaimObj);
        setIsSidePaneOpen(false);
        setSuccessToast(true);
        setDescription('');
        setLocation('');
        setPoliceReportNumber('');
        setTimeout(() => setSuccessToast(false), 4000);
      }
    } catch (err: any) {
      setErrorToast(err.message || t.error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white space-y-6">
      
      {/* Success Banner */}
      {successToast && (
        <div className="p-4 bg-black text-white rounded-none text-xs font-bold uppercase tracking-wider">
          {t.claimSubmittedSuccess}
        </div>
      )}

      {/* Claims List - Sharp 0px Border Radius, Full White */}
      <div className="space-y-4">
        {claims.length === 0 ? (
          <div className="border border-neutral-300 p-10 text-center rounded-none bg-white space-y-3">
            <p className="text-sm font-bold text-neutral-900">Aucun sinistre déclaré</p>
            <p className="text-xs text-neutral-500">
              En cas de vol, casse ou accident, cliquez sur le bouton contextuel ci-dessus pour déclarer votre sinistre.
            </p>
          </div>
        ) : (
          claims.map((claim) => (
            <div
              key={claim.id}
              className="border border-neutral-300 p-6 sm:p-8 rounded-none bg-white space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-neutral-400">#{claim.id}</span>
                  <span className="px-3 py-1 bg-black text-white rounded-full text-xs font-black uppercase tracking-wider">
                    {claim.type}
                  </span>
                </div>
                <span className="text-xs font-bold text-neutral-900 border border-neutral-300 px-3 py-1 rounded-full">
                  {claim.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="border border-neutral-300 p-3 rounded-none bg-white">
                  <span className="text-neutral-400 uppercase text-[10px] font-bold block mb-1">Vélo & Police</span>
                  <span className="font-bold text-neutral-900">{claim.bikemodel}</span>
                  <span className="text-[10px] font-mono text-neutral-500 block">({claim.contractReference})</span>
                </div>
                <div className="border border-neutral-300 p-3 rounded-none bg-white">
                  <span className="text-neutral-400 uppercase text-[10px] font-bold block mb-1">Date du sinistre</span>
                  <span className="font-bold text-neutral-900">{claim.date}</span>
                </div>
                <div className="border border-neutral-300 p-3 rounded-none bg-white">
                  <span className="text-neutral-400 uppercase text-[10px] font-bold block mb-1">Lieu</span>
                  <span className="font-bold text-neutral-900">{claim.location}</span>
                </div>
              </div>

              <div className="border border-neutral-300 p-4 rounded-none bg-white text-xs text-neutral-800 space-y-1">
                <span className="font-black text-neutral-900 uppercase text-[10px] block">Détails des faits</span>
                <p className="leading-relaxed">{claim.description}</p>
              </div>

              {claim.policeReportNumber && (
                <div className="text-xs font-mono text-neutral-600">
                  N° Procès-verbal police / plainte : <strong>{claim.policeReportNumber}</strong>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Side-Pane for Filing a Claim */}
      <SidePane
        isOpen={isSidePaneOpen}
        onClose={() => setIsSidePaneOpen(false)}
        title="Déclarer un sinistre"
        subtitle="Transmission directe au gestionnaire d'indemnisation"
        widthClass="max-w-lg"
        footer={
          <div className="flex gap-2 w-full">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 py-3.5 bg-black hover:bg-neutral-800 disabled:bg-neutral-400 text-white text-xs font-black rounded-full uppercase tracking-wider transition-colors cursor-pointer"
            >
              {submitting ? 'Envoi en cours...' : 'Envoyer la déclaration'}
            </button>
            <button
              type="button"
              onClick={() => setIsSidePaneOpen(false)}
              className="px-6 py-3.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-900 text-xs font-bold rounded-full cursor-pointer"
            >
              {t.cancel}
            </button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {errorToast && (
            <div className="p-3 bg-black text-white font-bold rounded-none">
              {errorToast}
            </div>
          )}

          <div>
            <label className="block font-bold text-neutral-800 mb-1 uppercase text-[10px]">
              Vélo concerné
            </label>
            <select
              value={selectedContractRef}
              onChange={(e) => setSelectedContractRef(e.target.value)}
              className="w-full p-3 bg-white border border-neutral-400 rounded-none font-bold text-neutral-900 focus:outline-hidden focus:border-black cursor-pointer"
            >
              {user.contracts?.map((c) => (
                <option key={c.reference} value={c.reference}>
                  {c.bikemodel} ({c.reference})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-neutral-800 mb-1.5 uppercase text-[10px]">
              Type de sinistre
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'vol', label: 'Vol' },
                { id: 'casse', label: 'Casse / Dommage' },
                { id: 'accident', label: 'Accident' },
                { id: 'vandalisme', label: 'Vandalisme' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setClaimType(item.id as any)}
                  className={`p-3 rounded-full font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                    claimType === item.id
                      ? 'bg-black text-white'
                      : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold text-neutral-800 mb-1 uppercase text-[10px]">Date du sinistre</label>
            <input
              type="date"
              required
              value={incidentDate}
              onChange={(e) => setIncidentDate(e.target.value)}
              className="w-full p-3 bg-white border border-neutral-400 rounded-none font-medium text-neutral-900 focus:outline-hidden focus:border-black"
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-800 mb-1 uppercase text-[10px]">Lieu précis</label>
            <input
              type="text"
              required
              placeholder="ex: 14 Rue Nationale, Lille"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 bg-white border border-neutral-400 rounded-none font-medium text-neutral-900 focus:outline-hidden focus:border-black"
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-800 mb-1 uppercase text-[10px]">Description détaillée</label>
            <textarea
              rows={4}
              required
              placeholder="Circonstances exactes du vol ou des dommages..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-white border border-neutral-400 rounded-none font-medium text-neutral-900 focus:outline-hidden focus:border-black"
            />
          </div>

          {claimType === 'vol' && (
            <div>
              <label className="block font-bold text-neutral-800 mb-1 uppercase text-[10px]">N° de Procès-verbal police / plainte</label>
              <input
                type="text"
                placeholder="ex: PV-2024/09812 - Commissariat"
                value={policeReportNumber}
                onChange={(e) => setPoliceReportNumber(e.target.value)}
                className="w-full p-3 bg-white border border-neutral-400 rounded-none font-medium text-neutral-900 font-mono focus:outline-hidden focus:border-black"
              />
            </div>
          )}

        </form>
      </SidePane>

    </div>
  );
};
