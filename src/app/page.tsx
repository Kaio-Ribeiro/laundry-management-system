import Link from 'next/link';
import { Droplets, Shirt, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Droplets className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">
                Clean<span className="text-blue-500">Wash</span>
              </h1>
            </div>
            <Link 
              href="/auth/login"
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Entrar
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        {/* Main Content */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Sistema Profissional de Gestão de Lavanderia
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simplifique as operações do seu negócio de lavanderia com nossa solução de gestão abrangente
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Shirt className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Gestão de Pedidos
            </h3>
            <p className="text-gray-600">
              Acompanhe e gerencie todos os pedidos de lavanderia de forma eficiente com atualizações em tempo real
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-cyan-100 rounded-full">
                <Sparkles className="w-6 h-6 text-cyan-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Serviço de Qualidade
            </h3>
            <p className="text-gray-600">
              Mantenha altos padrões com rastreamento abrangente de serviços e controle de qualidade
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Droplets className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Fresco e Limpo
            </h3>
            <p className="text-gray-600">
              Garanta que cada item atenda aos mais altos padrões de qualidade para satisfação do cliente
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
