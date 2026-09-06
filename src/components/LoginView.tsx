import React, { useState } from 'react';
import { Language, UserAccount } from '../types';
import { translations } from '../translations';
import { loginUser, getStoredAppsScriptUrl, setStoredAppsScriptUrl } from '../services/accountService';
import { SidePane } from './SidePane';

interface LoginViewProps {
  onLoginSuccess: (user: UserAccount, isLiveSheet?: boolean) => void;
  lang: Language;
  onLanguageChange: (newLang: Language) => void;
  onOpenAppsScriptSidePane?: () => void;
}

const languageLabels: Record<Language, string> = {
  fr: 'Français',
  en: 'English',
  nl: 'Nederlands',
  de: 'Deutsch',
};

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  lang,
  onLanguageChange,
}) => {
  const t = translations[lang] || translations.fr;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isForgotSidePaneOpen, setIsForgotSidePaneOpen] = useState(false);
  const [isSheetSidePaneOpen, setIsSheetSidePaneOpen] = useState(false);
  const [customScriptUrl, setCustomScriptUrl] = useState(getStoredAppsScriptUrl());

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMessage(t.invalidCredentials);
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const result = await loginUser(email, password, customScriptUrl);
      if (result.success && result.user) {
        onLoginSuccess(result.user, result.isLiveSheet);
      } else {
        setErrorMessage(result.error || t.invalidCredentials);
      }
    } catch (err: any) {
      setErrorMessage(err.message || t.error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveScriptUrl = () => {
    setStoredAppsScriptUrl(customScriptUrl);
    setIsSheetSidePaneOpen(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between selection:bg-black selection:text-white">
      
      {/* Top Header */}
      <div className="max-w-6xl w-full mx-auto p-4 sm:p-6 flex items-center justify-between">
        <a href="https://bikelp.com" target="_blank" rel="noopener noreferrer" className="flex items-center">
          <img
            src="https://civilprom.s3.eu-north-1.amazonaws.com/Bikelp_ico_black.svg"
            alt="Bikelp Icon"
            style={{ width: '70px', height: '70px' }}
            className="object-contain"
          />
        </a>

        <div className="flex items-center gap-3">
          <div className="relative inline-flex items-center">
            {/* Mirror element determining dynamic width strictly from the selected text */}
            <span
              aria-hidden="true"
              style={{
                fontFamily: "'Civilprom', sans-serif",
                fontSize: '16px',
                fontWeight: 600,
                padding: '10px 18px',
                visibility: 'hidden',
                whiteSpace: 'nowrap',
                userSelect: 'none',
              }}
            >
              {languageLabels[lang] || 'Français'}
            </span>
            <select
              aria-label="Sélectionner la langue"
              value={lang}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              style={{
                background: '#000',
                color: '#fff',
                borderRadius: '13px',
                fontSize: '16px',
                fontWeight: 600,
                fontFamily: "'Civilprom', sans-serif",
                border: 'none',
                padding: '10px 18px',
                cursor: 'pointer',
                textAlign: 'center',
              }}
              className="absolute inset-0 w-full h-full appearance-none focus:outline-hidden hover:opacity-95 transition-all"
            >
              <option value="fr" style={{ color: '#000', backgroundColor: '#fff' }}>Français</option>
              <option value="en" style={{ color: '#000', backgroundColor: '#fff' }}>English</option>
              <option value="nl" style={{ color: '#000', backgroundColor: '#fff' }}>Nederlands</option>
              <option value="de" style={{ color: '#000', backgroundColor: '#fff' }}>Deutsch</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Card - Center div */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <h1
          id="login-page-title"
          style={{
            fontFamily: 'Alternative, Gochi, cursive, sans-serif',
            fontSize: '30px',
            fontWeight: 500,
            letterSpacing: '0px',
            cursor: 'default',
            marginBottom: '24px',
            textAlign: 'center',
          }}
          className="text-neutral-950 text-center"
        >
          {t.loginTitle}
        </h1>

        <div
          id="login-card"
          style={{
            boxShadow: 'rgb(17 17 26 / 4%) 0px 4px 16px, rgb(17 17 26 / 6%) 0px 8px 24px, rgb(17 17 26 / 2%) 0px 16px 56px',
            border: '1px solid #b0b0b073',
            borderRadius: '20px',
          }}
          className="w-full max-w-md bg-white p-8 sm:p-10 space-y-6"
        >
          {errorMessage && (
            <div
              id="login-error-message"
              style={{
                borderRadius: '20px',
                background: '#fff',
                color: '#af1f1f',
                textAlign: 'left',
                fontSize: '16px',
                padding: '0px',
              }}
              className="font-medium"
            >
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                style={{
                  fontFamily: "'Civilprom', sans-serif",
                  textTransform: 'none',
                  letterSpacing: '0px',
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#000',
                  cursor: 'default',
                }}
                className="block mb-1.5"
              >
                {t.emailLabel}
              </label>
              <input
                id="login-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
                style={{
                  borderRadius: '13px',
                  border: '1px solid #dbdbdb',
                  color: '#000',
                  padding: '15px 15px',
                  textAlign: 'center',
                  fontSize: '18px',
                }}
                className="w-full bg-white placeholder-neutral-400 focus:outline-hidden focus:border-black"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  style={{
                    fontFamily: "'Civilprom', sans-serif",
                    textTransform: 'none',
                    letterSpacing: '0px',
                    fontSize: '18px',
                    fontWeight: 600,
                    color: '#000',
                    cursor: 'default',
                  }}
                  className="block"
                >
                  {t.passwordLabel}
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotSidePaneOpen(true)}
                  style={{
                    color: '#3556ec',
                    fontSize: '16px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                  }}
                >
                  {t.forgotPassword}
                </button>
              </div>
              <input
                id="login-password-input"
                type="text"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.passwordPlaceholder}
                style={{
                  borderRadius: '13px',
                  border: '1px solid #dbdbdb',
                  color: '#000',
                  padding: '15px 15px',
                  textAlign: 'center',
                  fontSize: '18px',
                }}
                className="w-full bg-white placeholder-neutral-400 focus:outline-hidden focus:border-black"
              />
            </div>

            <div className="space-y-3 pt-2">
              <button
                id="login-submit-btn"
                type="submit"
                disabled={loading}
                style={{
                  boxShadow: 'inset 0 1px 1px #ffffff00, 0 1px 2px #ffffff38, 0 4px 4px #ffffff26, 0 7px 0 -12px #b625ad, inset 0 6px 12px #ffffff45',
                  fontSize: '20px',
                  background: 'linear-gradient(192deg, #b625ad, #891281)',
                  color: '#ffffff',
                  fontWeight: 700,
                  padding: '14px 25px 15px 25px',
                  borderRadius: '15px',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  textDecoration: 'none',
                  width: '100%',
                }}
                className="transition-opacity hover:opacity-95 active:opacity-90 disabled:opacity-50"
              >
                {loading ? 'Connexion en cours...' : 'Connexion'}
              </button>

              <a
                id="subscribe-bikelp-btn"
                href="https://bikelp.com/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  boxShadow: 'inset 0 1px 1px #ffffff00, 0 1px 2px #ffffff38, 0 4px 4px #ffffff26, 0 7px 0 -12px #b625ad, inset 0 6px 12px #ffffff45',
                  fontSize: '20px',
                  background: '#3e1475',
                  color: '#ffffff',
                  fontWeight: 700,
                  padding: '14px 25px 15px 25px',
                  borderRadius: '15px',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  display: 'block',
                  textAlign: 'center',
                  width: '100%',
                }}
                className="transition-opacity hover:opacity-95 active:opacity-90"
              >
                Souscrire
              </a>
            </div>
          </form>

        </div>

        <div className="text-center mt-5 mb-8 pb-4">
          <a
            id="back-to-main-site-link"
            href="https://bikelp.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#3556ec',
              fontSize: '16px',
              fontWeight: 600,
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            Retourner au site principal
          </a>
        </div>
      </div>

      {/* Forgot Password Side-Pane */}
      <SidePane
        isOpen={isForgotSidePaneOpen}
        onClose={() => setIsForgotSidePaneOpen(false)}
        widthClass="max-w-md"
        footer={
          <div className="w-full space-y-3">
            <a
              id="support-email-btn"
              href="mailto:support@bikelp.com"
              style={{
                fontSize: '20px',
                background: '#000',
                color: '#ffffff',
                fontWeight: 700,
                padding: '14px 25px 15px 25px',
                borderRadius: '15px',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'none',
                display: 'block',
                textAlign: 'center',
                width: '100%',
              }}
              className="transition-opacity hover:opacity-95 active:opacity-90"
            >
              support@bikelp.com
            </a>
            <button
              id="close-forgot-sidepane-btn"
              type="button"
              onClick={() => setIsForgotSidePaneOpen(false)}
              style={{
                fontSize: '20px',
                background: '#000',
                color: '#ffffff',
                fontWeight: 700,
                padding: '14px 25px 15px 25px',
                borderRadius: '15px',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'none',
                display: 'block',
                textAlign: 'center',
                width: '100%',
              }}
              className="transition-opacity hover:opacity-95 active:opacity-90"
            >
              Fermer
            </button>
          </div>
        }
      >
        <div className="bg-white">
          <p
            style={{
              fontSize: '18px',
              fontWeight: 600,
              lineHeight: '30px',
              color: '#000',
              marginTop: '-10px',
            }}
          >
            Pour des raisons de sécurité, la réinitialisation du mot de passe s'effectue auprès de notre support client ou par le lien de récupération envoyé sur votre adresse email.
          </p>
        </div>
      </SidePane>

      {/* Google Sheet Config Side-Pane */}
      <SidePane
        isOpen={isSheetSidePaneOpen}
        onClose={() => setIsSheetSidePaneOpen(false)}
        title="Configuration Google Sheet"
        subtitle="Lier votre propre tableur Apps Script Web App"
        widthClass="max-w-md"
        footer={
          <div className="flex gap-2 w-full">
            <button
              onClick={handleSaveScriptUrl}
              style={{ borderRadius: '20px' }}
              className="flex-1 py-3 bg-black text-white text-xs font-bold uppercase cursor-pointer"
            >
              Enregistrer
            </button>
            <button
              onClick={() => setIsSheetSidePaneOpen(false)}
              style={{ borderRadius: '20px' }}
              className="px-5 py-3 bg-neutral-200 text-neutral-900 text-xs font-bold cursor-pointer"
            >
              Annuler
            </button>
          </div>
        }
      >
        <div className="space-y-4 text-xs bg-white">
          <label className="block font-bold text-neutral-900 uppercase text-[10px]">
            URL de déploiement Web App
          </label>
          <input
            type="url"
            placeholder="https://script.google.com/macros/s/.../exec"
            value={customScriptUrl}
            onChange={(e) => setCustomScriptUrl(e.target.value)}
            style={{ borderRadius: '20px' }}
            className="w-full p-3 bg-white border border-neutral-400 font-mono text-xs focus:outline-hidden focus:border-black"
          />
        </div>
      </SidePane>

    </div>
  );
};
