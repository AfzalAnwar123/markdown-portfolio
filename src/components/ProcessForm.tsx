import React from 'react';
import { useForm } from 'react-hook-form';
import { Process, ProcessCategory } from '../types/textile';

interface ProcessFormProps {
  process?: Process;
  onSubmit: (data: Omit<Process, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const processCategories: { value: ProcessCategory; label: string }[] = [
  { value: 'weaving', label: 'Weaving' },
  { value: 'knitting', label: 'Knitting' },
  { value: 'dyeing', label: 'Dyeing' },
  { value: 'printing', label: 'Printing' },
  { value: 'finishing', label: 'Finishing' },
  { value: 'cutting', label: 'Cutting' },
  { value: 'sewing', label: 'Sewing' },
  { value: 'embroidery', label: 'Embroidery' },
  { value: 'quality_control', label: 'Quality Control' },
  { value: 'packaging', label: 'Packaging' },
  { value: 'other', label: 'Other' },
];

const costTypes = [
  { value: 'fixed', label: 'Fixed Cost' },
  { value: 'per_unit', label: 'Per Unit' },
  { value: 'per_hour', label: 'Per Hour' },
];

export default function ProcessForm({ process, onSubmit, onCancel }: ProcessFormProps) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: process ? {
      name: process.name,
      category: process.category,
      costType: process.costType,
      cost: process.cost,
      timeRequired: process.timeRequired || 0,
      description: process.description || '',
    } : {
      costType: 'fixed'
    }
  });

  const costType = watch('costType');

  const onFormSubmit = (data: any) => {
    onSubmit({
      ...data,
      cost: parseFloat(data.cost),
      timeRequired: data.timeRequired ? parseInt(data.timeRequired) : undefined,
    });
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">
        {process ? 'Edit Process' : 'Add New Process'}
      </h3>
      
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Process Name *
            </label>
            <input
              type="text"
              id="name"
              {...register('name', { required: 'Process name is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="e.g., Screen Printing, Cut & Sew"
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
              {processCategories.map((cat) => (
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
            <label htmlFor="costType" className="block text-sm font-medium text-gray-700">
              Cost Type *
            </label>
            <select
              id="costType"
              {...register('costType', { required: 'Cost type is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              {costTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.costType && (
              <p className="mt-1 text-sm text-red-600">{errors.costType.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="cost" className="block text-sm font-medium text-gray-700">
              Cost ($) *
            </label>
            <input
              type="number"
              step="0.01"
              id="cost"
              {...register('cost', { 
                required: 'Cost is required',
                min: { value: 0, message: 'Cost must be positive' }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="0.00"
            />
            {errors.cost && (
              <p className="mt-1 text-sm text-red-600">{errors.cost.message}</p>
            )}
          </div>

          {costType === 'per_hour' && (
            <div>
              <label htmlFor="timeRequired" className="block text-sm font-medium text-gray-700">
                Time Required (minutes)
              </label>
              <input
                type="number"
                id="timeRequired"
                {...register('timeRequired', { 
                  min: { value: 1, message: 'Time must be at least 1 minute' }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="60"
              />
              {errors.timeRequired && (
                <p className="mt-1 text-sm text-red-600">{errors.timeRequired.message}</p>
              )}
            </div>
          )}
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
            placeholder="Additional details about the process..."
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
            {process ? 'Update' : 'Add'} Process
          </button>
        </div>
      </form>
    </div>
  );
}