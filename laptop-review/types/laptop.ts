// File: types/laptop.ts

export interface SpecData {
    cpu: string;
    gpu: string;
    ram: string;
    storage: string;
    display: string;
    battery: string;
    operatingSystem?: string;
    brightness?: string;
    colorGamut?: string;
    charging?: string;
    webcamResolution?: string;
    panelType?: string; 
    refreshRate?: string;
  }
  
  export interface BenchmarkData {
    
    gaming?: number;
    productivity?: number;
    content?: number;
    battery?: number; 
    display?: number; 
    build?: number;   
    value?: number;
    overall?: number;
    performanceScore?: number; 
    designScore?: number; 
    keyboardScore?: number;
    trackpadScore?: number;
    speakersScore?: number;
    webcamScore?: number;
    portsScore?: number;
  
    // 
    cinebenchR23Multi?: number | string;
    cinebenchR23Single?: number | string;
    geekbenchV6Single?: number | string;
    geekbenchV6Multi?: number | string;
    timeSpy?: number | string; 
    wildlifeExtreme?: number | string; 
    geekbenchCompute?: number | string;
    pcMark10?: string; 
  
    
    pluggedGeekbenchSingle?: number | string;
    pluggedGeekbenchMulti?: number | string;
    unpluggedGeekbenchSingle?: number | string;
    unpluggedGeekbenchMulti?: number | string;
  
     
     batteryLifeCasual?: string; 
     batteryLifeVideo?: string;  
     batteryLifeHeavy?: string;  
  
  }
  
  export interface Deal {
      retailer: string;
      price: string;
      url: string;
      logoUrl?: string;
  }
  
  export interface Laptop {
    id: string;
    name: string;
    image?: string;
    price?: string;
    originalPrice?: string;
    purchaseLink?: string;
    description?: string;
    longDescription?: string;
    reviewUrl?: string;
    specs: SpecData;
    benchmarks?: BenchmarkData;
    pros?: string[];
    cons?: string[];
    dimensions?: string;
    weight?: string;
    portsLeft?: string[];
    portsRight?: string[];
    deals?: Deal[];
    similarLaptopIds?: string[];
    
    performanceAnalysis?: string;
    batteryAnalysis?: string;
    designAnalysis?: string;
    displayAnalysis?: string;
    keyboardAnalysis?: string;
    trackpadAnalysis?: string;
    speakersAnalysis?: string;
    webcamAnalysis?: string;
    portsAnalysis?: string;
  }
  
  export interface SimilarLaptop {
    id: string;
    name: string;
    image?: string;
    price?: string;
    cpu?: string;
    gpu?: string;
    ram?: string;
    storage?: string;
    display?: string;
    battery?: string;
    score?: number;
  }
  
  // Props cho component UI
  export interface LaptopDetailPageUIProps {
    laptop: Laptop;
    similarLaptops?: SimilarLaptop[];
  }