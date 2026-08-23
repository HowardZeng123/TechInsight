// File: types/smartphone.ts

export interface SmartphoneSpecData {
  soc: string;
  ram: string;
  storage: string;
  display: string;
  battery: string;
  operatingSystem?: string;
  frontCamera?: string;
  rearCamera?: string;
  charging?: string;
  brightness?: string;
  refreshRate?: string;
  panelType?: string;
  weight?: string;
  dimensions?: string;
  waterResistance?: string;
}

export interface SmartphoneBenchmarkData {
  performanceScore?: number;
  cameraScore?: number;
  batteryScore?: number;
  displayScore?: number;
  designScore?: number;
  value?: number;
  overall?: number;

  antutu?: number | string;
  geekbenchSingle?: number | string;
  geekbenchMulti?: number | string;
  dxoMark?: number | string;

  batteryLifeCasual?: string;
  batteryLifeHeavy?: string;
}

export interface Deal {
  retailer: string;
  price: string;
  url: string;
  logoUrl?: string;
}

export interface Smartphone {
  id: string;
  name: string;
  image?: string;
  price?: string;
  originalPrice?: string;
  purchaseLink?: string;
  description?: string;
  longDescription?: string;
  reviewUrl?: string;
  specs: SmartphoneSpecData;
  benchmarks?: SmartphoneBenchmarkData;
  pros?: string[];
  cons?: string[];
  deals?: Deal[];
  similarPhoneIds?: string[];
  
  performanceAnalysis?: string;
  cameraAnalysis?: string;
  batteryAnalysis?: string;
  designAnalysis?: string;
  displayAnalysis?: string;
}

export interface SimilarSmartphone {
  id: string;
  name: string;
  image?: string;
  price?: string;
  soc?: string;
  ram?: string;
  storage?: string;
  display?: string;
  battery?: string;
  score?: number;
}
