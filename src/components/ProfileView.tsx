import React, { useState, useEffect } from 'react';
import { UserAccount, Language } from '../types';
import { translations } from '../translations';
import { updateUserProfile } from '../services/accountService';
import { SidePane } from './SidePane';

interface ProfileViewProps {
  user: UserAccount;
  onUpdateUser: (updated: UserAccount) => void;
  lang: Language;
  isLiveSheet?: boolean;
  isEditTriggered?: boolean;
  onEditTriggerHandled?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onUpdateUser,
  lang,
  isEditTriggered,
  onEditTriggerHandled,
}) => {
  const t = translations[lang] || translations.fr;

  const [isEditSidePaneOpen, setIsEditSidePaneOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstname_account: user.firstname_account || '',
    familyname_account: user.familyname_account || '',
    email_account: user.email_account || '',
    password_account: user.password_account || '',
    phone_account: user.phone_account || '',
    dateofbirth_account: user.dateofbirth_account || '',
    birthcity_account: user.birthcity_account || '',
    birthcountry_account: user.birthcountry_account || '',
    streetandnumber_account: user.streetandnumber_account || '',
    postalcode_account: user.postalcode_account || '',
  });

  useEffect(() => {
    if (isEditTriggered) {
      setIsEditSidePaneOpen(true);
      if (onEditTriggerHandled) onEditTriggerHandled();
    }
  }, [isEditTriggered, onEditTriggerHandled]);

  const [saving, setSaving] = useState(false);
  const [successToast, setSuccessToast] = useState(false);
  const [errorToast, setErrorToast] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessToast(false);
    setErrorToast('');

    try {
      const result = await updateUserProfile(user.email_account, formData);
      if (result.success) {
        const updated = result.updatedUser || { ...user, ...formData };
        onUpdateUser(updated);
        setSuccessToast(true);
        setIsEditSidePaneOpen(false);
        setTimeout(() => setSuccessToast(false), 4000);
      } else {
        setErrorToast(result.error || t.error);
      }
    } catch (err: any) {
      setErrorToast(err.message || t.error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white space-y-6">
      
      {/* Success Notification */}
      {successToast && (
        <div className="p-4 bg-black text-white rounded-none text-xs font-bold uppercase tracking-wider">
          {t.profileUpdateSuccess}
        </div>
      )}

      {/* Sharp Profile Fields Grid - 0px radius, full white, no background contrast */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Prénom */}
        <div className="border border-neutral-300 p-4 rounded-none bg-white">
          <span className="text-[11px] font-bold uppercase text-neutral-400 block mb-1">Prénom</span>
          <p className="text-base font-bold text-neutral-900">{user.firstname_account || '—'}</p>
        </div>

        {/* Nom */}
        <div className="border border-neutral-300 p-4 rounded-none bg-white">
          <span className="text-[11px] font-bold uppercase text-neutral-400 block mb-1">Nom</span>
          <p className="text-base font-bold text-neutral-900">{user.familyname_account || '—'}</p>
        </div>

        {/* Email */}
        <div className="border border-neutral-300 p-4 rounded-none bg-white">
          <span className="text-[11px] font-bold uppercase text-neutral-400 block mb-1">Email</span>
          <p className="text-base font-bold text-neutral-900 font-mono">{user.email_account}</p>
        </div>

        {/* Téléphone */}
        <div className="border border-neutral-300 p-4 rounded-none bg-white">
          <span className="text-[11px] font-bold uppercase text-neutral-400 block mb-1">Téléphone</span>
          <p className="text-base font-bold text-neutral-900">{user.phone_account || '—'}</p>
        </div>

        {/* Date de naissance */}
        <div className="border border-neutral-300 p-4 rounded-none bg-white">
          <span className="text-[11px] font-bold uppercase text-neutral-400 block mb-1">Date de naissance</span>
          <p className="text-base font-bold text-neutral-900">{user.dateofbirth_account || '—'}</p>
        </div>

        {/* Ville & Pays de naissance */}
        <div className="border border-neutral-300 p-4 rounded-none bg-white">
          <span className="text-[11px] font-bold uppercase text-neutral-400 block mb-1">Lieu de naissance</span>
          <p className="text-base font-bold text-neutral-900">
            {user.birthcity_account ? `${user.birthcity_account}, ${user.birthcountry_account}` : '—'}
          </p>
        </div>

        {/* Voie et numéro */}
        <div className="border border-neutral-300 p-4 rounded-none bg-white">
          <span className="text-[11px] font-bold uppercase text-neutral-400 block mb-1">Voie & numéro</span>
          <p className="text-base font-bold text-neutral-900">{user.streetandnumber_account || '—'}</p>
        </div>

        {/* Code postal */}
        <div className="border border-neutral-300 p-4 rounded-none bg-white">
          <span className="text-[11px] font-bold uppercase text-neutral-400 block mb-1">Code postal</span>
          <p className="text-base font-bold text-neutral-900">{user.postalcode_account || '—'}</p>
        </div>

        {/* Mot de passe */}
        <div className="border border-neutral-300 p-4 rounded-none bg-white md:col-span-2">
          <span className="text-[11px] font-bold uppercase text-neutral-400 block mb-1">Mot de passe</span>
          <p className="text-base font-bold text-neutral-900 font-mono">••••••••••••</p>
        </div>

      </div>

      {/* Side-Pane Form for Profile Edit */}
      <SidePane
        isOpen={isEditSidePaneOpen}
        onClose={() => setIsEditSidePaneOpen(false)}
        title="Modifier mon profil"
        subtitle="Mise à jour directe dans le Google Sheet"
        widthClass="max-w-lg"
        footer={
          <div className="flex gap-2 w-full">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-3.5 bg-black hover:bg-neutral-800 disabled:bg-neutral-400 text-white text-xs font-black rounded-full uppercase tracking-wider transition-colors cursor-pointer"
            >
              {saving ? t.saving : t.save}
            </button>
            <button
              type="button"
              onClick={() => setIsEditSidePaneOpen(false)}
              className="px-6 py-3.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-900 text-xs font-bold rounded-full cursor-pointer"
            >
              {t.cancel}
            </button>
          </div>
        }
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {errorToast && (
            <div className="p-3 bg-black text-white font-bold rounded-none">
              {errorToast}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-neutral-800 mb-1 uppercase text-[10px]">Prénom</label>
              <input
                type="text"
                name="firstname_account"
                required
                value={formData.firstname_account}
                onChange={handleChange}
                className="w-full p-3 bg-white border border-neutral-400 rounded-none font-medium text-neutral-900 focus:outline-hidden focus:border-black"
              />
            </div>
            <div>
              <label className="block font-bold text-neutral-800 mb-1 uppercase text-[10px]">Nom</label>
              <input
                type="text"
                name="familyname_account"
                required
                value={formData.familyname_account}
                onChange={handleChange}
                className="w-full p-3 bg-white border border-neutral-400 rounded-none font-medium text-neutral-900 focus:outline-hidden focus:border-black"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-neutral-800 mb-1 uppercase text-[10px]">Email</label>
            <input
              type="email"
              name="email_account"
              required
              value={formData.email_account}
              onChange={handleChange}
              className="w-full p-3 bg-white border border-neutral-400 rounded-none font-medium text-neutral-900 focus:outline-hidden focus:border-black"
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-800 mb-1 uppercase text-[10px]">Mot de passe</label>
            <input
              type="text"
              name="password_account"
              required
              value={formData.password_account}
              onChange={handleChange}
              className="w-full p-3 bg-white border border-neutral-400 rounded-none font-medium text-neutral-900 font-mono focus:outline-hidden focus:border-black"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-neutral-800 mb-1 uppercase text-[10px]">Téléphone</label>
              <input
                type="tel"
                name="phone_account"
                value={formData.phone_account}
                onChange={handleChange}
                className="w-full p-3 bg-white border border-neutral-400 rounded-none font-medium text-neutral-900 focus:outline-hidden focus:border-black"
              />
            </div>
            <div>
              <label className="block font-bold text-neutral-800 mb-1 uppercase text-[10px]">Date de naissance</label>
              <input
                type="date"
                name="dateofbirth_account"
                value={formData.dateofbirth_account}
                onChange={handleChange}
                className="w-full p-3 bg-white border border-neutral-400 rounded-none font-medium text-neutral-900 focus:outline-hidden focus:border-black"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-neutral-800 mb-1 uppercase text-[10px]">Ville de naissance</label>
              <input
                type="text"
                name="birthcity_account"
                value={formData.birthcity_account}
                onChange={handleChange}
                className="w-full p-3 bg-white border border-neutral-400 rounded-none font-medium text-neutral-900 focus:outline-hidden focus:border-black"
              />
            </div>
            <div>
              <label className="block font-bold text-neutral-800 mb-1 uppercase text-[10px]">Pays de naissance</label>
              <input
                type="text"
                name="birthcountry_account"
                value={formData.birthcountry_account}
                onChange={handleChange}
                className="w-full p-3 bg-white border border-neutral-400 rounded-none font-medium text-neutral-900 focus:outline-hidden focus:border-black"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-neutral-800 mb-1 uppercase text-[10px]">Voie & numéro</label>
            <input
              type="text"
              name="streetandnumber_account"
              value={formData.streetandnumber_account}
              onChange={handleChange}
              className="w-full p-3 bg-white border border-neutral-400 rounded-none font-medium text-neutral-900 focus:outline-hidden focus:border-black"
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-800 mb-1 uppercase text-[10px]">Code postal</label>
            <input
              type="text"
              name="postalcode_account"
              value={formData.postalcode_account}
              onChange={handleChange}
              className="w-full p-3 bg-white border border-neutral-400 rounded-none font-medium text-neutral-900 focus:outline-hidden focus:border-black"
            />
          </div>
        </form>
      </SidePane>

    </div>
  );
};
