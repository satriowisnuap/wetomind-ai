export type FeatureType =
  | 'BEDAH_KARAKTER'
  | 'KOMPAS_KARIR'
  | 'PETA_PERBAIKAN'
  | 'UJI_JODOH'
  | 'SINERGI_REKAN';

export interface WetonData {
  hariJawa: string;
  pasaran: string;
  neptuHari: number;
  neptuPasaran: number;
  totalNeptu: number;
  tanggalLahir: string;
}

export interface ChatMessage {
  role: 'user' | 'model' | 'error';
  text: string;
}

export interface ChatRequestPayload {
  feature: FeatureType;
  birthdate: string;
  birthdatePartner?: string;
  userName: string;
  partnerName?: string;
  userMessage: string;
  history?: ChatMessage[];
}
