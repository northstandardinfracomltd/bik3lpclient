export type Language = 'fr' | 'en' | 'nl' | 'de';

export interface Contract {
  id: string;
  startdate: string;
  reference: string;
  status: 'Actif' | 'En attente' | 'Suspendu' | 'Résilié' | string;
  bikemodel: string;
  bikevalue: number | string;
  note: string;
  subscriptionamount: number | string;
  subscriptionrecurringtype: 'Mensuel' | 'Annuel' | string;
  paymentlink: string;
  documentlink: string;
  gearsextended: string;
  valuegearsextended: number | string;
}

export interface Claim {
  id: string;
  contractReference: string;
  bikemodel: string;
  type: 'vol' | 'casse' | 'accident' | 'vandalisme' | 'autre';
  date: string;
  status: 'En cours d\'instruction' | 'En attente de pièces' | 'Validé' | 'Refusé' | 'Clôturé';
  description: string;
  location: string;
  policeReportNumber?: string;
  amountEstimated?: number | string;
  createdAt: string;
}

export interface UserAccount {
  language_account: Language | string;
  email_account: string;
  password_account: string;
  phone_account: string;
  firstname_account: string;
  familyname_account: string;
  dateofbirth_account: string;
  birthcity_account: string;
  birthcountry_account: string;
  streetandnumber_account: string;
  postalcode_account: string;
  
  // Contracts list
  contracts: Contract[];
  
  // Claims list
  claims?: Claim[];
  
  // Original raw data from CSV/Sheet if needed
  [key: string]: any;
}

export type ActiveTab = 'profile' | 'contracts' | 'claims' | 'preferences';
