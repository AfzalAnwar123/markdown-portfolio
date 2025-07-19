import React from 'react';
import { useForm } from 'react-hook-form';
import { Material, MaterialCategory } from '../types/textile';

interface MaterialFormProps {
  material?: Material;
  onSubmit: (data: Omit<Material, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const materialCategories: { value: MaterialCategory; label: string }[] = [
  { value: 'fabric', label: 'Fabric' },
  { value: 'yarn', label: 'Yarn' },
  { value: 'thread', label: 'Thread' },
  { value: 'dye', label: 'Dye' },
  { value: 'chemical', label: 'Chemical' },
  { value: 'accessory', label: 'Accessory' },
  { value: 'packaging', label: 'Packaging' },
  { value: 'other', label: 'Other' },
];

export default function MaterialForm({ material, onSubmit, onCancel }: MaterialFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: material ? {
      name: material.name,
      category: material.category,
      unit: material.unit,
      costPerUnit: material.costPerUnit,
      supplier: material.supplier || '',
      description: material.description || '',
    } : {}
  });

  const onFormSubmit = (data: any) => {
    onSubmit({
      ...data,
      costPerUnit: parseFloat(data.costPerUnit),
    });
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">
        {material ? 'Edit Material' : 'Add New Material'}
      </h3>
      
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Material Name *
            </label>
            <input
              type="text"
              id="name"
              {...register('name', { required: 'Material name is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="e.g., Cotton Fabric, Polyester Thread"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category *
            </label>
            <select
              id="category"
              {...register('category', { required: 'Category is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="">Select a category</option>
              {materialCategories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
              Unit *
            </label>
            <input
              type="text"
              id="unit"
              {...register('unit', { required: 'Unit is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="e.g., yard, meter, kg, piece"
            />
            {errors.unit && (
              <p className="mt-1 text-sm text-red-600">{errors.unit.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="costPerUnit" className="block text-sm font-medium text-gray-700">
              Cost per Unit ($) *
            </label>
            <input
              type="number"
              step="0.01"
              id="costPerUnit"
              {...register('costPerUnit', { 
                required: 'Cost per unit is required',
                min: { value: 0, message: 'Cost must be positive' }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="0.00"
            />
            {errors.costPerUnit && (
              <p className="mt-1 text-sm text-red-600">{errors.costPerUnit.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="supplier" className="block text-sm font-medium text-gray-700">
              Supplier
            </label>
            <input
              type="text"
              id="supplier"
              {...register('supplier')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="Supplier name"
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            {...register('description')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            placeholder="Additional details about the material..."
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            {material ? 'Update' : 'Add'} Material
          </button>
        </div>
      </form>
    </div>
  );
}