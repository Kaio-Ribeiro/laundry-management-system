import { Users, ShoppingCart, Droplets, Plus } from 'lucide-react';

export default function SellerPage() {
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
                <p className="text-sm text-gray-500">Painel do Vendedor</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Bem-vindo, Vendedor</span>
              <button className="text-sm text-blue-600 hover:text-blue-700">Sair</button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Painel de Vendas</h2>
            <p className="mt-1 text-gray-600">Gerencie clientes e crie novos pedidos</p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 mb-8">
            <div className="bg-white overflow-hidden shadow-lg rounded-lg border border-gray-200 hover:shadow-xl transition-shadow">
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
                        Gestão de Clientes
                      </dt>
                      <dd className="text-lg font-semibold text-gray-900">
                        Cadastrar e Gerenciar
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Ver Clientes →
                  </button>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded">
                    Adicionar Novo
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-lg rounded-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 bg-green-500 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Gestão de Pedidos
                      </dt>
                      <dd className="text-lg font-semibold text-gray-900">
                        Criar e Acompanhar Pedidos
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                    Ver Pedidos →
                  </button>
                  <button className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded">
                    Novo Pedido
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Ações Rápidas</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <Plus className="h-5 w-5 text-blue-600" />
                <span className="text-blue-700 font-medium">Cadastrar Cliente</span>
              </button>
              <button className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <ShoppingCart className="h-5 w-5 text-green-600" />
                <span className="text-green-700 font-medium">Criar Pedido</span>
              </button>
              <button className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                <Users className="h-5 w-5 text-purple-600" />
                <span className="text-purple-700 font-medium">Buscar Cliente</span>
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-sm text-gray-500">Pedidos Hoje</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <div className="text-2xl font-bold text-green-600">3</div>
              <div className="text-sm text-gray-500">Pedidos Pendentes</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <div className="text-2xl font-bold text-purple-600">45</div>
              <div className="text-sm text-gray-500">Meus Clientes</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <div className="text-2xl font-bold text-cyan-600">R$ 485</div>
              <div className="text-sm text-gray-500">Vendas de Hoje</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}