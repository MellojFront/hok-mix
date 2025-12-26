export interface Ingredient {
  name: string;
  percentage: number;
  availableAmount?: number; // Имеющийся объем в граммах (опционально)
}

export interface Mix {
  id: string;
  title: string;
  description: string;
  ingredients: Ingredient[];
  createdAt: number;
  updatedAt: number;
  author_name?: string | null;
  is_official?: boolean;
  is_public?: boolean;
  created_by?: string | null;
}

export interface KnowledgeNote {
  id: string;
  title: string;
  content: string;
  category?: string;
  createdAt: number;
  updatedAt: number;
}

