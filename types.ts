export interface BoundingBox {
  ymin: number;
  xmin: number;
  ymax: number;
  xmax: number;
}

export interface AnalysisResult {
  problemIdentified: string;
  isCorrect: boolean | null;
  errorBoundingBox?: BoundingBox | null;
  solutionSteps: string[];
  feedback: string;
  keyConcepts: string[];
  learningPath: string;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface UploadedImage {
  file: File;
  previewUrl: string;
  base64: string;
}