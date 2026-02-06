export interface MissingPersonData {
  name: string;
  age: string;
  lastKnownLocation: string;
  lastSeenDate: string;
  clothing: string;
  features: string;
  notes: string;
  image: File | null;
}

export interface AnalysisResult {
  personOverview: {
    summary: string;
    estimatedBiometrics: string;
    clothingAnalysis: string;
    distinctiveFeatures: string[];
  };
  potentialMatches: {
    id: string;
    confidence: number; // 0-100
    source: string;
    location: string;
    description: string;
  }[];
  searchLeads: {
    locationName: string;
    type: string;
    reason: string;
    address?: string;
  }[];
  movementPrediction: {
    prediction: string;
    radiusKm: number;
    timeElapsedAnalysis: string;
  };
  groundingUrls: {
    title: string;
    uri: string;
  }[];
}

export interface CaseRecord {
  id: string;
  timestamp: number;
  data: MissingPersonData;
  result: AnalysisResult;
}

export enum AppState {
  INPUT,
  ANALYZING,
  RESULTS,
  ERROR,
  HISTORY
}
