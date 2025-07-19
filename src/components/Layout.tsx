import React, { ReactNode } from 'react';
import { 
  HomeIcon, 
  CubeIcon, 
  CogIcon, 
  UserGroupIcon, 
  DocumentTextIcon,
  CalculatorIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const navigation = [
  { name: 'Dashboard', href: 'dashboard', icon: HomeIcon },
  { name: 'Materials', href: 'materials', icon: CubeIcon },
  { name: 'Processes', href: 'processes', icon: CogIcon },
  { name: 'Labor Rates', href: 'labor', icon: UserGroupIcon },
  { name: 'Products', href: 'products', icon: DocumentTextIcon },
  { name: 'Cost Calculator', href: 'calculator', icon: CalculatorIcon },
  { name: 'Reports', href: 'reports', icon: ChartBarIcon },
];

export default function Layout({ children, currentPage, onPageChange }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex h-16 items-center justify-center border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Textile Costing</h1>
        </div>
        <nav className="mt-5 px-2">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = currentPage === item.href;
              return (
                <button
                  key={item.name}
                  onClick={() => onPageChange(item.href)}
                  className={`${
                    isActive
                      ? 'bg-primary-100 text-primary-900 border-r-2 border-primary-500'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex w-full items-center rounded-md px-2 py-2 text-left text-sm font-medium transition-colors`}
                >
                  <item.icon
                    className={`${
                      isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                    } mr-3 h-5 w-5 flex-shrink-0`}
                    aria-hidden="true"
                  />
                  {item.name}
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}