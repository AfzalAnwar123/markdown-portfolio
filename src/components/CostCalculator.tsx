import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Material, Process, LaborRate, Product, ProductMaterial, ProductProcess } from '../types/textile';
import { calculateCostBreakdown, formatCurrency } from '../utils/calculations';

interface CostCalculatorProps {
  materials: Material[];
  processes: Process[];
  laborRates: LaborRate[];
  onSaveProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export default function CostCalculator({ materials, processes, laborRates, onSaveProduct }: CostCalculatorProps) {
  const [selectedMaterials, setSelectedMaterials] = useState<ProductMaterial[]>([]);
  const [selectedProcesses, setSelectedProcesses] = useState<ProductProcess[]>([]);
  const [productDetails, setProductDetails] = useState({
    name: '',
    description: '',
    laborTime: 0,
    overheadPercentage: 15,
    profitMarginPercentage: 20,
  });

  const addMaterial = () => {
    if (materials.length === 0) return;
    const material = materials[0];
    setSelectedMaterials([...selectedMaterials, {
      materialId: material.id,
      material,
      quantity: 1,
      cost: material.costPerUnit,
    }]);
  };

  const updateMaterial = (index: number, field: string, value: any) => {
    const updated = [...selectedMaterials];
    if (field === 'materialId') {
      const material = materials.find(m => m.id === value);
      if (material) {
        updated[index] = {
          ...updated[index],
          materialId: value,
          material,
          cost: material.costPerUnit * updated[index].quantity,
        };
      }
    } else if (field === 'quantity') {
      const quantity = parseFloat(value) || 0;
      updated[index] = {
        ...updated[index],
        quantity,
        cost: updated[index].material.costPerUnit * quantity,
      };
    }
    setSelectedMaterials(updated);
  };

  const removeMaterial = (index: number) => {
    setSelectedMaterials(selectedMaterials.filter((_, i) => i !== index));
  };

  const addProcess = () => {
    if (processes.length === 0) return;
    const process = processes[0];
    setSelectedProcesses([...selectedProcesses, {
      processId: process.id,
      process,
      quantity: 1,
      cost: process.cost,
    }]);
  };

  const updateProcess = (index: number, field: string, value: any) => {
    const updated = [...selectedProcesses];
    if (field === 'processId') {
      const process = processes.find(p => p.id === value);
      if (process) {
        updated[index] = {
          ...updated[index],
          processId: value,
          process,
          cost: process.cost,
        };
      }
    } else if (field === 'quantity') {
      const quantity = parseFloat(value) || 1;
      updated[index] = {
        ...updated[index],
        quantity,
        cost: updated[index].process.cost * quantity,
      };
    }
    setSelectedProcesses(updated);
  };

  const removeProcess = (index: number) => {
    setSelectedProcesses(selectedProcesses.filter((_, i) => i !== index));
  };

  const mockProduct: Product = {
    id: '',
    name: productDetails.name,
    description: productDetails.description,
    materials: selectedMaterials,
    processes: selectedProcesses,
    laborTime: productDetails.laborTime,
    overheadPercentage: productDetails.overheadPercentage,
    profitMarginPercentage: productDetails.profitMarginPercentage,
    totalCost: 0,
    sellingPrice: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const costBreakdown = calculateCostBreakdown(mockProduct, laborRates);

  const handleSave = () => {
    if (!productDetails.name.trim()) {
      alert('Please enter a product name');
      return;
    }

    onSaveProduct({
      name: productDetails.name,
      description: productDetails.description,
      materials: selectedMaterials,
      processes: selectedProcesses,
      laborTime: productDetails.laborTime,
      overheadPercentage: productDetails.overheadPercentage,
      profitMarginPercentage: productDetails.profitMarginPercentage,
      totalCost: costBreakdown.totalDirectCost + costBreakdown.overheadCost,
      sellingPrice: costBreakdown.sellingPrice,
    });

    // Reset form
    setSelectedMaterials([]);
    setSelectedProcesses([]);
    setProductDetails({
      name: '',
      description: '',
      laborTime: 0,
      overheadPercentage: 15,
      profitMarginPercentage: 20,
    });
  };

  return (
    <div className="space-y-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Cost Calculator</h2>
        
        {/* Product Details */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Product Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Name *</label>
              <input
                type="text"
                value={productDetails.name}
                onChange={(e) => setProductDetails({...productDetails, name: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="Enter product name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Labor Time (minutes)</label>
              <input
                type="number"
                value={productDetails.laborTime}
                onChange={(e) => setProductDetails({...productDetails, laborTime: parseInt(e.target.value) || 0})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Overhead (%)</label>
              <input
                type="number"
                value={productDetails.overheadPercentage}
                onChange={(e) => setProductDetails({...productDetails, overheadPercentage: parseFloat(e.target.value) || 0})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Profit Margin (%)</label>
              <input
                type="number"
                value={productDetails.profitMarginPercentage}
                onChange={(e) => setProductDetails({...productDetails, profitMarginPercentage: parseFloat(e.target.value) || 0})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows={2}
              value={productDetails.description}
              onChange={(e) => setProductDetails({...productDetails, description: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="Product description..."
            />
          </div>
        </div>

        {/* Materials Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Materials</h3>
            <button
              onClick={addMaterial}
              disabled={materials.length === 0}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Material
            </button>
          </div>
          
          {selectedMaterials.length === 0 ? (
            <p className="text-gray-500 italic">No materials added yet.</p>
          ) : (
            <div className="space-y-3">
              {selectedMaterials.map((item, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-md">
                  <select
                    value={item.materialId}
                    onChange={(e) => updateMaterial(index, 'materialId', e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  >
                    {materials.map((material) => (
                      <option key={material.id} value={material.id}>
                        {material.name} ({formatCurrency(material.costPerUnit)}/{material.unit})
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    step="0.1"
                    value={item.quantity}
                    onChange={(e) => updateMaterial(index, 'quantity', e.target.value)}
                    className="w-20 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="Qty"
                  />
                  <span className="w-20 text-sm text-gray-600">{item.material.unit}</span>
                  <span className="w-24 text-sm font-medium">{formatCurrency(item.cost)}</span>
                  <button
                    onClick={() => removeMaterial(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Processes Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Processes</h3>
            <button
              onClick={addProcess}
              disabled={processes.length === 0}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Process
            </button>
          </div>
          
          {selectedProcesses.length === 0 ? (
            <p className="text-gray-500 italic">No processes added yet.</p>
          ) : (
            <div className="space-y-3">
              {selectedProcesses.map((item, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-md">
                  <select
                    value={item.processId}
                    onChange={(e) => updateProcess(index, 'processId', e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  >
                    {processes.map((process) => (
                      <option key={process.id} value={process.id}>
                        {process.name} ({formatCurrency(process.cost)} {process.costType})
                      </option>
                    ))}
                  </select>
                  {item.process.costType === 'per_unit' && (
                    <input
                      type="number"
                      step="1"
                      value={item.quantity || 1}
                      onChange={(e) => updateProcess(index, 'quantity', e.target.value)}
                      className="w-20 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      placeholder="Qty"
                    />
                  )}
                  <span className="w-24 text-sm font-medium">{formatCurrency(item.cost)}</span>
                  <button
                    onClick={() => removeProcess(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Cost Breakdown</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Material Cost:</span>
            <span className="font-medium">{formatCurrency(costBreakdown.materialCost)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Process Cost:</span>
            <span className="font-medium">{formatCurrency(costBreakdown.processCost)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Labor Cost:</span>
            <span className="font-medium">{formatCurrency(costBreakdown.laborCost)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Overhead ({productDetails.overheadPercentage}%):</span>
            <span className="font-medium">{formatCurrency(costBreakdown.overheadCost)}</span>
          </div>
          <div className="border-t pt-3">
            <div className="flex justify-between">
              <span className="text-gray-900 font-medium">Total Direct Cost:</span>
              <span className="font-bold">{formatCurrency(costBreakdown.totalDirectCost + costBreakdown.overheadCost)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Profit Margin ({productDetails.profitMarginPercentage}%):</span>
              <span className="font-medium">{formatCurrency(costBreakdown.profitMargin)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-primary-600">
              <span>Selling Price:</span>
              <span>{formatCurrency(costBreakdown.sellingPrice)}</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleSave}
          disabled={!productDetails.name.trim()}
          className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Product
        </button>
      </div>
    </div>
  );
}