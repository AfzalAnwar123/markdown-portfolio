import React from 'react';
import { PlayIcon, LightBulbIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { loadSampleData } from '../data/sampleData';

interface QuickStartProps {
  onClose: () => void;
  onNavigate: (page: string) => void;
}

export default function QuickStart({ onClose, onNavigate }: QuickStartProps) {
  const handleLoadSampleData = () => {
    loadSampleData();
    alert('Sample data loaded successfully! You can now explore the application with realistic textile data.');
    window.location.reload(); // Reload to show the new data
  };

  const steps = [
    {
      title: 'Load Sample Data',
      description: 'Get started quickly with pre-populated materials, processes, and labor rates.',
      action: handleLoadSampleData,
      buttonText: 'Load Sample Data',
      icon: PlayIcon,
    },
    {
      title: 'Add Your Materials',
      description: 'Navigate to Materials section to add your own textile materials with costs.',
      action: () => onNavigate('materials'),
      buttonText: 'Go to Materials',
      icon: DocumentTextIcon,
    },
    {
      title: 'Calculate Product Costs',
      description: 'Use the Cost Calculator to build products and see real-time cost breakdowns.',
      action: () => onNavigate('calculator'),
      buttonText: 'Open Calculator',
      icon: LightBulbIcon,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary-100">
              <PlayIcon className="h-6 w-6 text-primary-600" aria-hidden="true" />
            </div>
            <div className="mt-3 text-center sm:mt-5">
              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                Welcome to Textile Costing!
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Get started with your textile cost management. Follow these steps to begin:
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {steps.map((step, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <step.icon className="h-6 w-6 text-primary-500" />
                  </div>
                  <div className="ml-3 flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{step.title}</h4>
                    <p className="mt-1 text-sm text-gray-500">{step.description}</p>
                    <button
                      onClick={step.action}
                      className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      {step.buttonText}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between">
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm"
              onClick={onClose}
            >
              Skip for now
            </button>
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}