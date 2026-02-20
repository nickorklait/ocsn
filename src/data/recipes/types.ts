export interface RecipeProductRef {
  type: 'erp' | 'name';
  value: string;
}

export interface Recipe {
  id: string;
  title: string;
  timeLabel: string;
  shortDescription: string;
  steps: string[];
  tip?: string;
  productRefs: RecipeProductRef[];
  imageUrl?: string;
}

