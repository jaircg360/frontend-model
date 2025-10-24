/**
 * Tipos TypeScript para la API
 */

export type DatasetStatus = 'uploaded' | 'cleaning' | 'cleaned' | 'training' | 'trained' | 'error';

export type ModelType = 'regression' | 'classification' | 'clustering' | 'neural_network';

export type CleaningAction = 
  | 'remove_duplicates'
  | 'fill_nulls_mean'
  | 'fill_nulls_median'
  | 'fill_nulls_mode'
  | 'drop_nulls'
  | 'normalize'
  | 'standardize'
  | 'encode_categorical'
  | 'remove_outliers';

// ============= UPLOAD =============

export interface Dataset {
  id: string;
  file_name: string;
  file_path: string;
  status: DatasetStatus;
  rows: number;
  columns: number;
  column_types?: Record<string, string>;
  missing_values?: Record<string, number>;
  created_at: string;
  updated_at?: string;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  file_id?: string;
  file_name?: string;
  rows?: number;
  columns?: number;
  preview?: Record<string, any>[];
  column_info?: {
    dtypes: Record<string, string>;
    missing_values: Record<string, number>;
    missing_percentage: Record<string, number>;
    numeric_columns: string[];
    categorical_columns: string[];
    duplicates: number;
    agent_suggestions?: string[];
    warnings?: string;
  };
}

// ============= CLEAN =============

export interface CleaningRequest {
  file_id: string;
  actions: CleaningAction[];
  target_column?: string;
  fill_value?: any;
  encoding_method?: 'label' | 'onehot';
  outlier_method?: 'iqr' | 'zscore';
}

export interface CleaningResponse {
  success: boolean;
  message: string;
  file_id?: string;
  original_rows?: number;
  cleaned_rows?: number;
  actions_applied?: string[];
  preview?: Record<string, any>[];
  statistics?: {
    original_shape: [number, number];
    final_shape: [number, number];
    actions_results: Record<string, any>;
    summary: Record<string, any>;
  };
}

export interface CleaningRecommendations {
  success: boolean;
  file_id: string;
  analysis: {
    rows: number;
    columns: number;
    numeric_columns: string[];
    categorical_columns: string[];
    missing_values: Record<string, number>;
    duplicates: number;
  };
  recommendations: {
    priority_actions: string[];
    optional_actions: string[];
    reasons: Record<string, string>;
  };
  suggestions: string[];
  warnings?: string;
  next_step: string;
}

// ============= TRAIN =============

export interface TrainingRequest {
  file_id: string;
  model_type: ModelType;
  target_column: string;
  feature_columns: string[];
  test_size?: number;
  algorithm?: string;
  hyperparameters?: Record<string, any>;
}

export interface TrainingResponse {
  success: boolean;
  message: string;
  model_id?: string;
  model_type?: string;
  metrics?: Record<string, number>;
  feature_importance?: Record<string, number>;
  training_time?: number;
  predictions_sample?: Array<{
    actual: number;
    predicted: number;
    features: Record<string, any>;
  }>;
}

export interface Model {
  id: string;
  model_name: string;
  model_type: string;
  dataset_id: string;
  model_path: string;
  metrics: Record<string, number>;
  feature_importance?: Record<string, number>;
  hyperparameters?: Record<string, any>;
  created_at: string;
  status: string;
}

export interface ModelSuggestions {
  success: boolean;
  file_id: string;
  suggestions: {
    target_column: string;
    unique_values: number;
    recommended_type: string;
    recommended_algorithms: string[];
    explanation: string;
  };
}

// ============= AGENT =============

export interface AgentRequest {
  message: string;
  context?: Record<string, any>;
  file_id?: string;
}

export interface AgentResponse {
  success: boolean;
  message: string;
  suggestions?: string[];
  next_step?: string;
  warning?: string;
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  message: string;
}

// ============= DASHBOARD =============

export interface DashboardStats {
  success: boolean;
  stats: {
    total_datasets: number;
    total_models: number;
    total_cleaned_datasets: number;
    recent_datasets: Dataset[];
    recent_models: Model[];
    storage_used_mb: number;
  };
  message?: string;
}

export interface Activity {
  type: 'dataset' | 'model';
  action: string;
  name: string;
  id: string;
  timestamp: string;
  details: Record<string, any>;
}

export interface SystemInfo {
  success: boolean;
  info: {
    python_version: string;
    platform: string;
    processor: string;
    storage: {
      uploads_dir: string;
      models_dir: string;
      exports_dir: string;
      total_size_mb: number;
    };
    supabase: {
      configured: boolean;
      url: string;
    };
    limits: {
      max_file_size_mb: number;
      allowed_extensions: string[];
    };
  };
}

// ============= ERRORS =============

export interface ApiError {
  detail: string;
  status?: number;
}



