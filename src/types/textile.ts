export interface Material {
  id: string;
  name: string;
  category: MaterialCategory;
  unit: string;
  costPerUnit: number;
  supplier?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Process {
  id: string;
  name: string;
  category: ProcessCategory;
  costType: 'fixed' | 'per_unit' | 'per_hour';
  cost: number;
  timeRequired?: number; // in minutes
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LaborRate {
  id: string;
  position: string;
  hourlyRate: number;
  benefits?: number;
  region?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  materials: ProductMaterial[];
  processes: ProductProcess[];
  laborTime: number; // in minutes
  overheadPercentage: number;
  profitMarginPercentage: number;
  totalCost: number;
  sellingPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductMaterial {
  materialId: string;
  material: Material;
  quantity: number;
  cost: number;
}

export interface ProductProcess {
  processId: string;
  process: Process;
  quantity?: number;
  cost: number;
}

export interface CostBreakdown {
  materialCost: number;
  processCost: number;
  laborCost: number;
  overheadCost: number;
  totalDirectCost: number;
  profitMargin: number;
  sellingPrice: number;
}

export type MaterialCategory = 
  | 'fabric'
  | 'yarn'
  | 'thread'
  | 'dye'
  | 'chemical'
  | 'accessory'
  | 'packaging'
  | 'other';

export type ProcessCategory =
  | 'weaving'
  | 'knitting'
  | 'dyeing'
  | 'printing'
  | 'finishing'
  | 'cutting'
  | 'sewing'
  | 'embroidery'
  | 'quality_control'
  | 'packaging'
  | 'other';

export interface CostingSession {
  id: string;
  name: string;
  products: Product[];
  totalValue: number;
  createdAt: Date;
  updatedAt: Date;
}