import { Material, Process, LaborRate, MaterialCategory, ProcessCategory } from '../types/textile';

export const sampleMaterials: Material[] = [
  {
    id: 'mat-001',
    name: 'Cotton Canvas',
    category: 'fabric' as MaterialCategory,
    unit: 'yard',
    costPerUnit: 8.50,
    supplier: 'Textile Suppliers Inc.',
    description: 'Heavy-duty cotton canvas, 10oz weight',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'mat-002',
    name: 'Polyester Thread',
    category: 'thread' as MaterialCategory,
    unit: 'spool',
    costPerUnit: 2.25,
    supplier: 'Thread Co.',
    description: 'High-strength polyester thread, 1000m spool',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: 'mat-003',
    name: 'Reactive Dye - Blue',
    category: 'dye' as MaterialCategory,
    unit: 'kg',
    costPerUnit: 45.00,
    supplier: 'Chemical Solutions Ltd.',
    description: 'High-quality reactive dye for cotton fabrics',
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17'),
  },
  {
    id: 'mat-004',
    name: 'Zipper - Metal',
    category: 'accessory' as MaterialCategory,
    unit: 'piece',
    costPerUnit: 1.75,
    supplier: 'Hardware Plus',
    description: '12 inch metal zipper, brass finish',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    id: 'mat-005',
    name: 'Wool Yarn',
    category: 'yarn' as MaterialCategory,
    unit: 'kg',
    costPerUnit: 32.00,
    supplier: 'Wool Masters',
    description: 'Premium merino wool yarn, 100% natural',
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-19'),
  },
];

export const sampleProcesses: Process[] = [
  {
    id: 'proc-001',
    name: 'Fabric Cutting',
    category: 'cutting' as ProcessCategory,
    costType: 'per_hour',
    cost: 25.00,
    timeRequired: 30,
    description: 'Professional fabric cutting service',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'proc-002',
    name: 'Industrial Sewing',
    category: 'sewing' as ProcessCategory,
    costType: 'per_hour',
    cost: 18.00,
    timeRequired: 45,
    description: 'High-speed industrial sewing machine work',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: 'proc-003',
    name: 'Screen Printing Setup',
    category: 'printing' as ProcessCategory,
    costType: 'fixed',
    cost: 75.00,
    description: 'Initial setup cost for screen printing',
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17'),
  },
  {
    id: 'proc-004',
    name: 'Screen Printing - Per Print',
    category: 'printing' as ProcessCategory,
    costType: 'per_unit',
    cost: 3.50,
    description: 'Cost per printed item',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    id: 'proc-005',
    name: 'Quality Inspection',
    category: 'quality_control' as ProcessCategory,
    costType: 'per_unit',
    cost: 1.25,
    description: 'Manual quality inspection per item',
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-19'),
  },
  {
    id: 'proc-006',
    name: 'Fabric Dyeing',
    category: 'dyeing' as ProcessCategory,
    costType: 'per_hour',
    cost: 35.00,
    timeRequired: 120,
    description: 'Professional dyeing service',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
];

export const sampleLaborRates: LaborRate[] = [
  {
    id: 'labor-001',
    position: 'Pattern Maker',
    hourlyRate: 22.00,
    benefits: 5.50,
    region: 'Local',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'labor-002',
    position: 'Sewing Machine Operator',
    hourlyRate: 16.00,
    benefits: 4.00,
    region: 'Local',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: 'labor-003',
    position: 'Quality Control Inspector',
    hourlyRate: 18.50,
    benefits: 4.50,
    region: 'Local',
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17'),
  },
  {
    id: 'labor-004',
    position: 'Finishing Specialist',
    hourlyRate: 20.00,
    benefits: 5.00,
    region: 'Local',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
  },
];

export function loadSampleData() {
  // Load sample data into localStorage if it doesn't exist
  const materials = localStorage.getItem('textile-materials');
  const processes = localStorage.getItem('textile-processes');
  const laborRates = localStorage.getItem('textile-labor-rates');

  if (!materials || JSON.parse(materials).length === 0) {
    localStorage.setItem('textile-materials', JSON.stringify(sampleMaterials));
  }

  if (!processes || JSON.parse(processes).length === 0) {
    localStorage.setItem('textile-processes', JSON.stringify(sampleProcesses));
  }

  if (!laborRates || JSON.parse(laborRates).length === 0) {
    localStorage.setItem('textile-labor-rates', JSON.stringify(sampleLaborRates));
  }
}