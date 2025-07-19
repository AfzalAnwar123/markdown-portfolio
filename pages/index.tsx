import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Layout from '../src/components/Layout';
import MaterialForm from '../src/components/MaterialForm';
import ProcessForm from '../src/components/ProcessForm';
import CostCalculator from '../src/components/CostCalculator';
import QuickStart from '../src/components/QuickStart';
import { useTextileStorage } from '../src/hooks/useLocalStorage';
import { Material, Process, LaborRate, Product } from '../src/types/textile';
import { formatCurrency } from '../src/utils/calculations';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  ChartBarIcon,
  CubeIcon,
  CogIcon,
  UserGroupIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

export default function Home() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showMaterialForm, setShowMaterialForm] = useState(false);
  const [showProcessForm, setShowProcessForm] = useState(false);
  const [showQuickStart, setShowQuickStart] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | undefined>();
  const [editingProcess, setEditingProcess] = useState<Process | undefined>();

  const {
    materials,
    setMaterials,
    processes,
    setProcesses,
    laborRates,
    setLaborRates,
    products,
    setProducts,
  } = useTextileStorage();

  useEffect(() => {
    // Show quick start if no data exists
    const hasData = materials.length > 0 || processes.length > 0 || products.length > 0;
    if (!hasData && !localStorage.getItem('quickstart-dismissed')) {
      setShowQuickStart(true);
    }
  }, [materials.length, processes.length, products.length]);

  const addMaterial = (materialData: Omit<Material, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newMaterial: Material = {
      ...materialData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setMaterials([...materials, newMaterial]);
    setShowMaterialForm(false);
  };

  const updateMaterial = (materialData: Omit<Material, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingMaterial) return;
    const updatedMaterial: Material = {
      ...materialData,
      id: editingMaterial.id,
      createdAt: editingMaterial.createdAt,
      updatedAt: new Date(),
    };
    setMaterials(materials.map(m => m.id === editingMaterial.id ? updatedMaterial : m));
    setEditingMaterial(undefined);
    setShowMaterialForm(false);
  };

  const deleteMaterial = (id: string) => {
    if (confirm('Are you sure you want to delete this material?')) {
      setMaterials(materials.filter(m => m.id !== id));
    }
  };

  const addProcess = (processData: Omit<Process, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProcess: Process = {
      ...processData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProcesses([...processes, newProcess]);
    setShowProcessForm(false);
  };

  const updateProcess = (processData: Omit<Process, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingProcess) return;
    const updatedProcess: Process = {
      ...processData,
      id: editingProcess.id,
      createdAt: editingProcess.createdAt,
      updatedAt: new Date(),
    };
    setProcesses(processes.map(p => p.id === editingProcess.id ? updatedProcess : p));
    setEditingProcess(undefined);
    setShowProcessForm(false);
  };

  const deleteProcess = (id: string) => {
    if (confirm('Are you sure you want to delete this process?')) {
      setProcesses(processes.filter(p => p.id !== id));
    }
  };

  const addLaborRate = () => {
    const position = prompt('Enter position/role:');
    const rate = prompt('Enter hourly rate:');
    if (position && rate) {
      const newLaborRate: LaborRate = {
        id: uuidv4(),
        position,
        hourlyRate: parseFloat(rate),
        benefits: 0,
        region: 'Local',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setLaborRates([...laborRates, newLaborRate]);
    }
  };

  const deleteLaborRate = (id: string) => {
    if (confirm('Are you sure you want to delete this labor rate?')) {
      setLaborRates(laborRates.filter(l => l.id !== id));
    }
  };

  const saveProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProducts([...products, newProduct]);
    alert('Product saved successfully!');
  };

  const deleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Textile Costing Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your textile materials, processes, and calculate product costs.</p>
        </div>
        <button
          onClick={() => setShowQuickStart(true)}
          className="btn-secondary"
        >
          <LightBulbIcon className="h-4 w-4 mr-2" />
          Quick Start
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CubeIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Materials</dt>
                  <dd className="text-lg font-medium text-gray-900">{materials.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CogIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Processes</dt>
                  <dd className="text-lg font-medium text-gray-900">{processes.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Labor Rates</dt>
                  <dd className="text-lg font-medium text-gray-900">{laborRates.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Products</dt>
                  <dd className="text-lg font-medium text-gray-900">{products.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Products */}
      {products.length > 0 && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Products</h3>
            <div className="space-y-3">
              {products.slice(-5).map((product) => (
                <div key={product.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-md">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">
                      {product.materials.length} materials, {product.processes.length} processes
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(product.sellingPrice)}</p>
                    <p className="text-sm text-gray-500">Selling Price</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderMaterials = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Materials</h1>
        <button
          onClick={() => setShowMaterialForm(true)}
          className="btn-primary"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Material
        </button>
      </div>

      {showMaterialForm && (
        <MaterialForm
          material={editingMaterial}
          onSubmit={editingMaterial ? updateMaterial : addMaterial}
          onCancel={() => {
            setShowMaterialForm(false);
            setEditingMaterial(undefined);
          }}
        />
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {materials.length === 0 ? (
          <div className="text-center py-12">
            <CubeIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No materials</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding a new material.</p>
          </div>
        ) : (
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">Name</th>
                <th className="table-header-cell">Category</th>
                <th className="table-header-cell">Cost per Unit</th>
                <th className="table-header-cell">Unit</th>
                <th className="table-header-cell">Supplier</th>
                <th className="table-header-cell">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {materials.map((material) => (
                <tr key={material.id} className="table-row">
                  <td className="table-cell font-medium">{material.name}</td>
                  <td className="table-cell">
                    <span className="badge-primary">{material.category}</span>
                  </td>
                  <td className="table-cell">{formatCurrency(material.costPerUnit)}</td>
                  <td className="table-cell">{material.unit}</td>
                  <td className="table-cell">{material.supplier || '-'}</td>
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingMaterial(material);
                          setShowMaterialForm(true);
                        }}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteMaterial(material.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  const renderProcesses = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Processes</h1>
        <button
          onClick={() => setShowProcessForm(true)}
          className="btn-primary"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Process
        </button>
      </div>

      {showProcessForm && (
        <ProcessForm
          process={editingProcess}
          onSubmit={editingProcess ? updateProcess : addProcess}
          onCancel={() => {
            setShowProcessForm(false);
            setEditingProcess(undefined);
          }}
        />
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {processes.length === 0 ? (
          <div className="text-center py-12">
            <CogIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No processes</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding a new process.</p>
          </div>
        ) : (
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">Name</th>
                <th className="table-header-cell">Category</th>
                <th className="table-header-cell">Cost Type</th>
                <th className="table-header-cell">Cost</th>
                <th className="table-header-cell">Time Required</th>
                <th className="table-header-cell">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {processes.map((process) => (
                <tr key={process.id} className="table-row">
                  <td className="table-cell font-medium">{process.name}</td>
                  <td className="table-cell">
                    <span className="badge-secondary">{process.category}</span>
                  </td>
                  <td className="table-cell">
                    <span className="badge-warning">{process.costType}</span>
                  </td>
                  <td className="table-cell">{formatCurrency(process.cost)}</td>
                  <td className="table-cell">{process.timeRequired ? `${process.timeRequired} min` : '-'}</td>
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingProcess(process);
                          setShowProcessForm(true);
                        }}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteProcess(process.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  const renderLaborRates = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Labor Rates</h1>
        <button onClick={addLaborRate} className="btn-primary">
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Labor Rate
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {laborRates.length === 0 ? (
          <div className="text-center py-12">
            <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No labor rates</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding a new labor rate.</p>
          </div>
        ) : (
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">Position</th>
                <th className="table-header-cell">Hourly Rate</th>
                <th className="table-header-cell">Benefits</th>
                <th className="table-header-cell">Region</th>
                <th className="table-header-cell">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {laborRates.map((rate) => (
                <tr key={rate.id} className="table-row">
                  <td className="table-cell font-medium">{rate.position}</td>
                  <td className="table-cell">{formatCurrency(rate.hourlyRate)}</td>
                  <td className="table-cell">{formatCurrency(rate.benefits || 0)}</td>
                  <td className="table-cell">{rate.region || 'Local'}</td>
                  <td className="table-cell">
                    <button
                      onClick={() => deleteLaborRate(rate.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <button
          onClick={() => setCurrentPage('calculator')}
          className="btn-primary"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Product
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No products</h3>
            <p className="mt-1 text-sm text-gray-500">Use the cost calculator to create your first product.</p>
          </div>
        ) : (
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">Name</th>
                <th className="table-header-cell">Materials</th>
                <th className="table-header-cell">Processes</th>
                <th className="table-header-cell">Total Cost</th>
                <th className="table-header-cell">Selling Price</th>
                <th className="table-header-cell">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {products.map((product) => (
                <tr key={product.id} className="table-row">
                  <td className="table-cell font-medium">{product.name}</td>
                  <td className="table-cell">{product.materials.length}</td>
                  <td className="table-cell">{product.processes.length}</td>
                  <td className="table-cell">{formatCurrency(product.totalCost)}</td>
                  <td className="table-cell font-medium text-primary-600">{formatCurrency(product.sellingPrice)}</td>
                  <td className="table-cell">
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  const renderCalculator = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Cost Calculator</h1>
        <p className="mt-2 text-gray-600">Calculate product costs by selecting materials and processes.</p>
      </div>
      <CostCalculator
        materials={materials}
        processes={processes}
        laborRates={laborRates}
        onSaveProduct={saveProduct}
      />
    </div>
  );

  const renderContent = () => {
    switch (currentPage) {
      case 'materials':
        return renderMaterials();
      case 'processes':
        return renderProcesses();
      case 'labor':
        return renderLaborRates();
      case 'products':
        return renderProducts();
      case 'calculator':
        return renderCalculator();
      case 'reports':
        return (
          <div className="text-center py-12">
            <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Reports</h3>
            <p className="mt-1 text-sm text-gray-500">Coming soon...</p>
          </div>
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <>
      <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
        {renderContent()}
      </Layout>
      {showQuickStart && (
        <QuickStart
          onClose={() => {
            setShowQuickStart(false);
            localStorage.setItem('quickstart-dismissed', 'true');
          }}
          onNavigate={(page) => {
            setCurrentPage(page);
            setShowQuickStart(false);
          }}
        />
      )}
    </>
  );
}