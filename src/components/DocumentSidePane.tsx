import React from 'react';
import { Contract, UserAccount, Language } from '../types';
import { translations } from '../translations';
import { SidePane } from './SidePane';

interface DocumentSidePaneProps {
  isOpen: boolean;
  onClose: () => void;
  contract: Contract;
  user: UserAccount;
  documentType: 'policy_ipid' | 'certificate';
  lang: Language;
}

export const DocumentSidePane: React.FC<DocumentSidePaneProps> = ({
  isOpen,
  onClose,
  contract,
  user,
  documentType,
  lang,
}) => {
  const t = translations[lang] || translations.fr;

  const handlePrint = () => {
    window.print();
  };

  const title = documentType === 'policy_ipid'
    ? 'Conditions Générales & Résumé IPID'
    : 'Attestation d\'Assurance';

  return (
    <SidePane
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={`Police N° ${contract.reference} • ${contract.bikemodel}`}
      widthClass="max-w-2xl"
      footer={
        <>
          <div className="text-xs text-neutral-500 font-mono">
            {contract.documentlink ? (
              <a
                href={contract.documentlink}
                target="_blank"
                rel="noreferrer"
                className="underline font-bold text-neutral-900"
              >
                Ouvrir PDF original
              </a>
            ) : (
              <span>Document officiel Bikelp</span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-6 py-2.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-900 text-xs font-bold rounded-full transition-colors cursor-pointer"
            >
              Imprimer
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold rounded-full transition-colors cursor-pointer"
            >
              {t.close}
            </button>
          </div>
        </>
      }
    >
      <div className="space-y-6 bg-white">
        
        {/* Assuré & Compagnie Details */}
        <div className="grid grid-cols-2 gap-4 border border-neutral-300 p-4 rounded-none bg-white">
          <div>
            <span className="text-[11px] font-bold uppercase text-neutral-400 block mb-1">Assuré</span>
            <p className="font-bold text-neutral-900 text-sm">{user.firstname_account} {user.familyname_account}</p>
            <p className="text-xs text-neutral-600">{user.streetandnumber_account}</p>
            <p className="text-xs text-neutral-600">{user.postalcode_account} {user.birthcity_account}</p>
            <p className="text-xs text-neutral-600 font-mono">{user.email_account}</p>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-bold uppercase text-neutral-400 block mb-1">Compagnie</span>
            <p className="font-bold text-neutral-900 text-sm">BIKELP Assurance</p>
            <p className="text-xs text-neutral-600">Police #{contract.reference}</p>
            <p className="text-xs font-bold text-neutral-900 mt-1">Statut : {contract.status}</p>
          </div>
        </div>

        {/* Contract Key Summary */}
        <div className="border border-neutral-300 p-4 rounded-none bg-white space-y-3">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-neutral-400 block uppercase text-[10px] font-bold mb-0.5">Vélo assuré</span>
              <p className="font-bold text-neutral-950 text-sm">{contract.bikemodel}</p>
            </div>
            <div>
              <span className="text-neutral-400 block uppercase text-[10px] font-bold mb-0.5">Valeur assurée TTC</span>
              <p className="font-bold text-neutral-950 text-sm">{Number(contract.bikevalue || 0).toLocaleString()} €</p>
            </div>
            <div>
              <span className="text-neutral-400 block uppercase text-[10px] font-bold mb-0.5">Cotisation</span>
              <p className="font-bold text-neutral-950">{contract.subscriptionamount} € / {contract.subscriptionrecurringtype}</p>
            </div>
            <div>
              <span className="text-neutral-400 block uppercase text-[10px] font-bold mb-0.5">Date d'effet</span>
              <p className="font-bold text-neutral-950">{contract.startdate || 'Souscription'}</p>
            </div>
          </div>
          {contract.gearsextended && (
            <div className="pt-2 border-t border-neutral-200 text-xs">
              <span className="text-neutral-400 block uppercase text-[10px] font-bold mb-0.5">Accessoires couverts ({contract.valuegearsextended} €)</span>
              <p className="font-medium text-neutral-900">{contract.gearsextended}</p>
            </div>
          )}
        </div>

        {/* Content Document */}
        {documentType === 'policy_ipid' ? (
          <div className="space-y-4 text-xs text-neutral-700 leading-relaxed">
            <div>
              <h4 className="font-black text-neutral-900 uppercase tracking-wide mb-1 text-xs">1. Garanties souscrites</h4>
              <p className="mb-2">
                Le présent contrat a pour objet de couvrir le vélo désigné contre les risques de vol, tentative de vol avec agression ou effraction, ainsi que les dommages matériels accidentels et la casse.
              </p>
              <p>
                Plafond d'indemnisation vélo : <strong>{Number(contract.bikevalue || 0).toLocaleString()} €</strong>.
              </p>
            </div>

            <div>
              <h4 className="font-black text-neutral-900 uppercase tracking-wide mb-1 text-xs">2. Protection antivol obligatoire</h4>
              <p>
                Pour bénéficier de la garantie vol en extérieur, le vélo doit être attaché à un point fixe inamovible par le cadre avec un antivol homologué (FUB 2 roues, Sold Secure Gold ou ART 2).
              </p>
            </div>

            <div>
              <h4 className="font-black text-neutral-900 uppercase tracking-wide mb-1 text-xs">3. Délais de déclaration</h4>
              <p>
                En cas de vol : dépôt de plainte auprès des autorités dans les 48h et transmission du dossier sur l'espace client. En cas de casse : déclaration dans les 5 jours ouvrés.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-xs text-neutral-700 leading-relaxed text-center py-4">
            <p className="font-bold text-sm text-neutral-950">
              ATTESTATION DE COUVERTURE EN COURS DE VALIDITÉ
            </p>
            <p>
              Bikelp certifie que le vélo mentionné ci-dessus est valablement garanti au titre du contrat <strong>#{contract.reference}</strong> souscrit par <strong>{user.firstname_account} {user.familyname_account}</strong>.
            </p>
            <div className="p-4 border border-neutral-300 rounded-none inline-block text-left text-xs font-mono bg-white">
              <p>Émis par Bikelp SAS</p>
              <p>Document numérique à valeur probante</p>
            </div>
          </div>
        )}

      </div>
    </SidePane>
  );
};
