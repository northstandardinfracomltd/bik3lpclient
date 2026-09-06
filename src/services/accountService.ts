import { UserAccount, Contract, Claim } from '../types';

// Default demo accounts matching the exact CSV schema format
export const DEMO_ACCOUNTS_RAW: Record<string, any>[] = [
  {
    language_account: 'fr',
    email_account: 'alexandre.dupont@email.com',
    password_account: 'velo2024',
    phone_account: '+33 6 12 34 56 78',
    firstname_account: 'Alexandre',
    familyname_account: 'Dupont',
    dateofbirth_account: '1988-05-14',
    birthcity_account: 'Lyon',
    birthcountry_account: 'France',
    streetandnumber_account: '24 Rue de la République',
    postalcode_account: '69002',
    
    // Contract 1 (VTT Électrique)
    startdate_contract1: '2024-01-15',
    reference_contract1: 'BK-2024-8841',
    status_contract1: 'Actif',
    bikemodel_contract1: 'Moustache Samedi 28.5 (VAE Urbain)',
    bikevalue_contract1: '3499.00',
    note_contract1: 'Antivol homologué Abus Granit X-Plus 540 enregistré. Gravage Paravol.',
    subscriptionamount_contract1: '14.90',
    subscriptionrecurringtype_contract1: 'Mensuel',
    paymentlink_contract1: 'https://bikelp.com/payment/update?ref=BK-2024-8841',
    documentlink_contract1: 'https://bikelp.com/docs/BK-2024-8841-police-ipid.pdf',
    gearsextended_contract1: 'Casque Kask Urban, Sacoches Ortlieb Roller Plus, Antivol U Abus',
    valuegearsextended_contract1: '450.00',

    // Contract 2 (Vélo de route)
    startdate_contract2: '2024-03-01',
    reference_contract2: 'BK-2024-9102',
    status_contract2: 'Actif',
    bikemodel_contract2: 'Canyon Ultimate CF SL 8',
    bikevalue_contract2: '4199.00',
    note_contract2: 'Usage cyclo-sportif. Marquage Recovelo.',
    subscriptionamount_contract2: '169.00',
    subscriptionrecurringtype_contract2: 'Annuel',
    paymentlink_contract2: 'https://bikelp.com/payment/update?ref=BK-2024-9102',
    documentlink_contract2: 'https://bikelp.com/docs/BK-2024-9102-police-ipid.pdf',
    gearsextended_contract2: 'Compteur GPS Garmin Edge 840, Casque Poc Ventral',
    valuegearsextended_contract2: '580.00',
  },
  {
    language_account: 'en',
    email_account: 'sarah.miller@bikelover.com',
    password_account: 'ridebike2024',
    phone_account: '+33 7 98 76 54 32',
    firstname_account: 'Sarah',
    familyname_account: 'Miller',
    dateofbirth_account: '1993-11-22',
    birthcity_account: 'London',
    birthcountry_account: 'Royaume-Uni',
    streetandnumber_account: '15 Boulevard Saint-Germain',
    postalcode_account: '75005',
    
    // Contract 1 (Vélo Cargo / Longtail)
    startdate_contract1: '2023-09-10',
    reference_contract1: 'BK-2023-7729',
    status_contract1: 'Actif',
    bikemodel_contract1: 'Tern GSD S10 LX (Cargo Électrique)',
    bikevalue_contract1: '5799.00',
    note_contract1: 'Assurance formule Tous Risques avec assistance dépannage 24/7.',
    subscriptionamount_contract1: '22.50',
    subscriptionrecurringtype_contract1: 'Mensuel',
    paymentlink_contract1: 'https://bikelp.com/payment/update?ref=BK-2023-7729',
    documentlink_contract1: 'https://bikelp.com/docs/BK-2023-7729-police-ipid.pdf',
    gearsextended_contract1: 'Sièges enfants Thule Yepp Maxi, Pack Barres Clubhouse, Antivol chaîne',
    valuegearsextended_contract1: '720.00',
  }
];

// Sample default claims to demonstrate the sinistres tab cleanly
export const INITIAL_CLAIMS: Record<string, Claim[]> = {
  'alexandre.dupont@email.com': [
    {
      id: 'SIN-20240412-1082',
      contractReference: 'BK-2024-8841',
      bikemodel: 'Moustache Samedi 28.5 (VAE Urbain)',
      type: 'casse',
      date: '2024-04-10',
      status: 'Validé',
      description: 'Chute suite à un nid de poule sur piste cyclable. Roue avant voilée et dérailleur endommagé. Réparation effectuée chez vélociste agréé.',
      location: 'Quai Victor Augagneur, Lyon',
      amountEstimated: '320 €',
      createdAt: '2024-04-12',
    }
  ],
  'sarah.miller@bikelover.com': []
};

export const DEFAULT_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyykpRoR9mEy22_sIPZvrKJUrnmgF8-UOJLGq7XVQvRto9rAGdTRZl_RsDVDTHLXZY/exec';

const APPS_SCRIPT_URL_STORAGE_KEY = 'bikelp_apps_script_url';

export function getStoredAppsScriptUrl(): string {
  const stored = localStorage.getItem(APPS_SCRIPT_URL_STORAGE_KEY);
  if (stored && stored.trim() !== '') {
    return stored.trim();
  }
  return DEFAULT_APPS_SCRIPT_URL;
}

export function setStoredAppsScriptUrl(url: string): void {
  localStorage.setItem(APPS_SCRIPT_URL_STORAGE_KEY, url.trim());
}

/**
 * Transforms raw sheet / CSV row object into standard UserAccount model with extracted contracts
 */
export function formatRawAccountToUser(rawData: Record<string, any>): UserAccount {
  const contracts: Contract[] = [];

  // Look for contract indices (e.g. 1, 2, 3...)
  for (let i = 1; i <= 10; i++) {
    const refKey = `reference_contract${i}`;
    const modelKey = `bikemodel_contract${i}`;
    
    // Check if contract exists on this row
    if (rawData[refKey] || rawData[modelKey] || (i === 1 && rawData.bikemodel_contract1)) {
      contracts.push({
        id: `contract${i}`,
        startdate: rawData[`startdate_contract${i}`] || '',
        reference: rawData[`reference_contract${i}`] || `BK-${1000 + i}`,
        status: rawData[`status_contract${i}`] || 'Actif',
        bikemodel: rawData[`bikemodel_contract${i}`] || 'Vélo Assuré',
        bikevalue: rawData[`bikevalue_contract${i}`] || '0',
        note: rawData[`note_contract${i}`] || '',
        subscriptionamount: rawData[`subscriptionamount_contract${i}`] || '0',
        subscriptionrecurringtype: rawData[`subscriptionrecurringtype_contract${i}`] || 'Mensuel',
        paymentlink: rawData[`paymentlink_contract${i}`] || 'https://bikelp.com',
        documentlink: rawData[`documentlink_contract${i}`] || '',
        gearsextended: rawData[`gearsextended_contract${i}`] || '',
        valuegearsextended: rawData[`valuegearsextended_contract${i}`] || '0',
      });
    }
  }

  const email = (rawData.email_account || '').toLowerCase().trim();
  const userClaims = INITIAL_CLAIMS[email] || [];

  return {
    language_account: rawData.language_account || 'fr',
    email_account: email,
    password_account: rawData.password_account || '',
    phone_account: rawData.phone_account || '',
    firstname_account: rawData.firstname_account || '',
    familyname_account: rawData.familyname_account || '',
    dateofbirth_account: rawData.dateofbirth_account || '',
    birthcity_account: rawData.birthcity_account || '',
    birthcountry_account: rawData.birthcountry_account || '',
    streetandnumber_account: rawData.streetandnumber_account || '',
    postalcode_account: rawData.postalcode_account || '',
    contracts,
    claims: userClaims,
    ...rawData,
  };
}

/**
 * Perform login either via Google Apps Script (if URL configured) or fallback to local in-memory dataset
 */
export async function loginUser(
  emailInput: string,
  passwordInput: string,
  scriptUrl?: string
): Promise<{ success: boolean; user?: UserAccount; error?: string; isLiveSheet?: boolean }> {
  const url = (scriptUrl || getStoredAppsScriptUrl()).trim();
  const cleanEmail = emailInput.trim().toLowerCase();
  const cleanPass = passwordInput.trim();

  // 1. If Google Apps Script URL is set, attempt live fetch
  if (url && url.startsWith('http')) {
    try {
      const endpoint = `${url}${url.includes('?') ? '&' : '?'}action=login&email=${encodeURIComponent(cleanEmail)}&password=${encodeURIComponent(cleanPass)}`;
      const res = await fetch(endpoint, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });
      
      const data = await res.json();
      if (data && data.success && data.user) {
        return {
          success: true,
          user: formatRawAccountToUser(data.user),
          isLiveSheet: true,
        };
      } else {
        return {
          success: false,
          error: data?.error || 'Identifiants incorrects sur le tableur Google Sheet.',
        };
      }
    } catch (err: any) {
      console.warn('Google Apps Script request error, checking fallback demo accounts:', err);
      // If network/CORS error on Apps Script, give helpful message
    }
  }

  // 2. Local Demo accounts validation
  const found = DEMO_ACCOUNTS_RAW.find(
    (acc) =>
      acc.email_account.toLowerCase() === cleanEmail &&
      acc.password_account === cleanPass
  );

  if (found) {
    return {
      success: true,
      user: formatRawAccountToUser(found),
      isLiveSheet: false,
    };
  }

  return {
    success: false,
    error: 'Adresse email ou mot de passe incorrect. Vérifiez vos identifiants ou utilisez un compte de test.',
  };
}

/**
 * Update user profile in Google Apps Script and local state
 */
export async function updateUserProfile(
  originalEmail: string,
  updatedFields: Partial<UserAccount>,
  scriptUrl?: string
): Promise<{ success: boolean; updatedUser?: UserAccount; error?: string; isLiveSheet?: boolean }> {
  const url = (scriptUrl || getStoredAppsScriptUrl()).trim();

  // If live Google Apps Script endpoint exists
  if (url && url.startsWith('http')) {
    try {
      const payload = {
        action: 'update_profile',
        original_email: originalEmail,
        ...updatedFields,
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8', // Plain text avoids CORS preflight issues in Google Apps Script
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data && data.success) {
        return {
          success: true,
          updatedUser: data.user ? formatRawAccountToUser(data.user) : undefined,
          isLiveSheet: true,
        };
      }
    } catch (err) {
      console.error('Error updating profile in Apps Script:', err);
    }
  }

  // Fallback: update in-memory demo account
  const accountIndex = DEMO_ACCOUNTS_RAW.findIndex(
    (acc) => acc.email_account.toLowerCase() === originalEmail.toLowerCase()
  );

  if (accountIndex !== -1) {
    DEMO_ACCOUNTS_RAW[accountIndex] = {
      ...DEMO_ACCOUNTS_RAW[accountIndex],
      ...updatedFields,
    };
    return {
      success: true,
      updatedUser: formatRawAccountToUser(DEMO_ACCOUNTS_RAW[accountIndex]),
      isLiveSheet: false,
    };
  }

  return {
    success: true,
    isLiveSheet: false,
  };
}

/**
 * Submit a new claim to Google Apps Script
 */
export async function submitClaim(
  claimData: Omit<Claim, 'id' | 'createdAt' | 'status'>,
  userEmail: string,
  scriptUrl?: string
): Promise<{ success: boolean; claimId?: string; error?: string }> {
  const url = (scriptUrl || getStoredAppsScriptUrl()).trim();
  const claimId = `SIN-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

  const newClaim: Claim = {
    ...claimData,
    id: claimId,
    status: 'En cours d\'instruction',
    createdAt: new Date().toISOString().slice(0, 10),
  };

  if (!INITIAL_CLAIMS[userEmail]) {
    INITIAL_CLAIMS[userEmail] = [];
  }
  INITIAL_CLAIMS[userEmail].unshift(newClaim);

  if (url && url.startsWith('http')) {
    try {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'submit_claim',
          email_account: userEmail,
          contract_ref: claimData.contractReference,
          bike_model: claimData.bikemodel,
          type: claimData.type,
          date: claimData.date,
          location: claimData.location,
          police_report: claimData.policeReportNumber || '',
          description: claimData.description,
        }),
      });
    } catch (err) {
      console.warn('Apps script submit claim warning:', err);
    }
  }

  return {
    success: true,
    claimId,
  };
}

/**
 * Test connectivity with user's Google Apps Script Web App URL
 */
export async function testAppsScriptConnection(url: string): Promise<{ success: boolean; message: string; details?: any }> {
  const cleanUrl = url.trim();
  if (!cleanUrl || !cleanUrl.startsWith('http')) {
    return { success: false, message: 'Veuillez saisir une URL valide commençant par https://script.google.com/...' };
  }

  try {
    const endpoint = `${cleanUrl}${cleanUrl.includes('?') ? '&' : '?'}action=ping`;
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    
    const data = await res.json();
    if (data && data.success) {
      return {
        success: true,
        message: `Connexion réussie ! Feuille active : "${data.sheetName || 'Feuille 1'}" avec ${data.totalUsers ?? 0} assuré(s) répertorié(s).`,
        details: data,
      };
    } else {
      return {
        success: false,
        message: data?.error || 'Réponse inattendue de l\'application Web Google Apps Script.',
      };
    }
  } catch (err: any) {
    return {
      success: false,
      message: `Impossible de joindre l'application Web Google Apps Script (${err.message || 'erreur réseau ou CORS'}). Vérifiez que l'accès au déploiement est réglé sur "Tout le monde" (Anyone).`,
    };
  }
}
