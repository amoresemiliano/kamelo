export interface Ingredient {
  id: string;
  name: string;
  category: 'Esencia' | 'Cera/Alcohol' | 'Envase' | 'Mecha/Gatillo' | 'Etiqueta';
  unit: 'g' | 'ml' | 'unid';
  costPerUnitARS: number;
  stock: number;
  minStock: number;
  supplierId: string;
  supplierName: string;
}

export interface FormulaItem {
  ingredientId: string;
  ingredientName: string;
  quantity: number; // in g/ml/unid
  percentage: number; // percentage of total weight/vol
  unitCostARS: number;
}

export interface Formula {
  id: string;
  productName: string;
  category: 'Perfume' | 'Vela' | 'Difusor' | 'Cosmética';
  batchSizeGrams: number;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  items: FormulaItem[];
  suggestedMarginPercent: number;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phoneWhatsApp: string;
  minPurchaseARS: number;
  deliveryTimeDays: number;
}

export interface RequirementItem {
  ingredientId: string;
  ingredientName: string;
  requiredQty: number;
  unit: string;
  estimatedCostARS: number;
  formulaReferences: string[];
}

export interface SupplierRequirementGroup {
  supplierId: string;
  supplierName: string;
  minPurchaseARS: number;
  requirements: RequirementItem[];
  totalARS: number;
  meetsMinimum: boolean;
}

export interface MarketBenchmark {
  id: string;
  productName: string;
  kameloPriceARS: number;
  competitorAverageARS: number;
  competitorMinARS: number;
  competitorMaxARS: number;
  kameloMarginPercent: number;
  lastUpdated: string;
  status: 'Competitivo' | 'Oportunidad Aumento' | 'Precio Alto';
}

export interface CatalogProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  fragranceFamily: string;
  priceARS: number;
  format: string;
  inStock: boolean;
  topNotes: string;
  heartNotes: string;
  baseNotes: string;
  badge?: string;
}
