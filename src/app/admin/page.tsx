'use client';

import { Users, Package, BarChart3, Droplets, Users2 } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  
  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  const navigateToUsers = () => {
    router.push('/admin/users');
  };

  const navigateToServices = () => {
    router.push('/admin/services');
  };

  const navigateToCustomers = () => {
    router.push('/admin/customers');
  };

  const navigateToReports = () => {
    router.push('/admin/reports');
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Droplets className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  Clean<span className="text-blue-500">Wash</span>
                </h1>
                <p className="text-sm text-gray-500">Painel do Administrador</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Bem-vindo, Admin</span>
              <button 
                onClick={handleSignOut}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Visão Geral do Painel</h2>
            <p className="mt-1 text-gray-600">Gerencie as operações do seu negócio de lavanderia</p>
          </div>
          
          {/* Quick Stats */}
          <div className="mb-8 grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <div className="text-2xl font-bold text-blue-600">24</div>
              <div className="text-sm text-gray-500">Pedidos Ativos</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <div className="text-2xl font-bold text-green-600">R$ 1.245</div>
              <div className="text-sm text-gray-500">Receita de Hoje</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <div className="text-2xl font-bold text-purple-600">8</div>
              <div className="text-sm text-gray-500">Novos Clientes</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <div className="text-2xl font-bold text-cyan-600">156</div>
              <div className="text-sm text-gray-500">Total de Clientes</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div 
              onClick={navigateToUsers}
              className="bg-white overflow-hidden shadow-lg rounded-lg border border-gray-200 hover:shadow-xl transition-shadow cursor-pointer"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Gerenciar Vendedores
                      </dt>
                      <dd className="text-lg font-semibold text-gray-900">
                        Vendedores
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-blue-600 text-sm font-medium">
                    Ver Todos os Vendedores →
                  </span>
                </div>
              </div>
            </div>

            <div 
              onClick={navigateToServices}
              className="bg-white overflow-hidden shadow-lg rounded-lg border border-gray-200 hover:shadow-xl transition-shadow cursor-pointer"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 bg-green-500 rounded-lg flex items-center justify-center">
                      <Package className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Serviços e Produtos
                      </dt>
                      <dd className="text-lg font-semibold text-gray-900">
                        Gerenciar Preços
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-green-600 text-sm font-medium">
                    Gerenciar Serviços →
                  </span>
                </div>
              </div>
            </div>

            <div 
              onClick={navigateToCustomers}
              className="bg-white overflow-hidden shadow-lg rounded-lg border border-gray-200 hover:shadow-xl transition-shadow cursor-pointer"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 bg-cyan-500 rounded-lg flex items-center justify-center">
                      <Users2 className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Gerenciar Clientes
                      </dt>
                      <dd className="text-lg font-semibold text-gray-900">
                        Clientes
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-cyan-600 text-sm font-medium">
                    Ver Todos os Clientes →
                  </span>
                </div>
              </div>
            </div>

            <div 
              onClick={navigateToReports}
              className="bg-white overflow-hidden shadow-lg rounded-lg border border-gray-200 hover:shadow-xl transition-shadow cursor-pointer"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 bg-purple-500 rounded-lg flex items-center justify-center">
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Relatórios e Análises
                      </dt>
                      <dd className="text-lg font-semibold text-gray-900">
                        Relatórios
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-purple-600 text-sm font-medium">
                    Ver Relatórios →
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}