
export interface TransformationResult {
  imageUrl: string;
  timestamp: number;
  promptUsed: string;
}

export interface AppState {
  originalImage: string | null;
  transformedImage: string | null;
  isLoading: boolean;
  error: string | null;
  history: TransformationResult[];
}
