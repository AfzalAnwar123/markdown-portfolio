import { Product, ProductMaterial, ProductProcess, CostBreakdown, LaborRate } from '../types/textile';

export function calculateMaterialCost(materials: ProductMaterial[]): number {
  return materials.reduce((total, item) => {
    return total + (item.material.costPerUnit * item.quantity);
  }, 0);
}

export function calculateProcessCost(processes: ProductProcess[]): number {
  return processes.reduce((total, item) => {
    if (item.process.costType === 'fixed') {
      return total + item.process.cost;
    } else if (item.process.costType === 'per_unit') {
      return total + (item.process.cost * (item.quantity || 1));
    } else if (item.process.costType === 'per_hour') {
      const hours = (item.process.timeRequired || 0) / 60;
      return total + (item.process.cost * hours);
    }
    return total;
  }, 0);
}

export function calculateLaborCost(laborTime: number, laborRates: LaborRate[]): number {
  if (laborRates.length === 0) return 0;
  
  // Use average labor rate if multiple rates exist
  const averageRate = laborRates.reduce((sum, rate) => sum + rate.hourlyRate + (rate.benefits || 0), 0) / laborRates.length;
  const hours = laborTime / 60;
  return averageRate * hours;
}

export function calculateCostBreakdown(
  product: Product,
  laborRates: LaborRate[]
): CostBreakdown {
  const materialCost = calculateMaterialCost(product.materials);
  const processCost = calculateProcessCost(product.processes);
  const laborCost = calculateLaborCost(product.laborTime, laborRates);
  
  const totalDirectCost = materialCost + processCost + laborCost;
  const overheadCost = totalDirectCost * (product.overheadPercentage / 100);
  const totalCostWithOverhead = totalDirectCost + overheadCost;
  const profitMargin = totalCostWithOverhead * (product.profitMarginPercentage / 100);
  const sellingPrice = totalCostWithOverhead + profitMargin;

  return {
    materialCost,
    processCost,
    laborCost,
    overheadCost,
    totalDirectCost,
    profitMargin,
    sellingPrice,
  };
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function calculateProfitability(sellingPrice: number, totalCost: number): {
  profit: number;
  margin: number;
  markup: number;
} {
  const profit = sellingPrice - totalCost;
  const margin = (profit / sellingPrice) * 100;
  const markup = (profit / totalCost) * 100;

  return {
    profit,
    margin,
    markup,
  };
}

export function generateCostReport(products: Product[], laborRates: LaborRate[]) {
  return products.map(product => ({
    product,
    breakdown: calculateCostBreakdown(product, laborRates),
    profitability: calculateProfitability(product.sellingPrice, product.totalCost),
  }));
}