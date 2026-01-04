'use client';

import { useState, useEffect } from 'react';
import { Users, ShoppingCart, Droplets, Plus } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ManagementCard from '@/components/ManagementCard';

interface Customer {
  id: string;
  name: string;
  phone?: string;
}

interface Service {
  id: string;
  name: string;
  price: number;
}

export default function SellerPage() {
  const router = useRouter();
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  
  const [customerForm, setCustomerForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  
  const [orderForm, setOrderForm] = useState({
    customerId: '',
    serviceId: '',
    quantity: 1,
    notes: ''
  });

  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerForm),
      });

      if (response.ok) {
        setSuccess('Cliente cadastrado com sucesso!');
        setShowCustomerModal(false);
        setCustomerForm({ name: '', email: '', phone: '', address: '' });
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erro ao cadastrar cliente');
      }
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
      setError('Erro ao cadastrar cliente');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
      }
    } catch {
      console.error('Erro ao carregar clientes');
    }
  };

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      if (response.ok) {
        const data = await response.json();
        setServices(data.filter((service: Service & {isActive: boolean}) => service.isActive));
      }
    } catch {
      console.error('Erro ao carregar serviços');
    }
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderForm),
      });

      if (response.ok) {
        setSuccess('Pedido criado com sucesso!');
        setShowOrderModal(false);
        setOrderForm({
          customerId: '',
          serviceId: '',
          quantity: 1,
          notes: ''
        });
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erro ao criar pedido');
      }
    } catch {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const handleCancelCustomer = () => {
    setShowCustomerModal(false);
    setCustomerForm({ name: '', email: '', phone: '', address: '' });
    clearMessages();
  };

  const handleCancelOrder = () => {
    setShowOrderModal(false);
    setOrderForm({ customerId: '', serviceId: '', quantity: 1, notes: '' });
    clearMessages();
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  useEffect(() => {
    fetchCustomers();
    fetchServices();
  }, []);

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
          {/* Alerts */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="mb-4 bg-green-50 border-green-200 text-green-700">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Painel de Vendas</h2>
            <p className="mt-1 text-gray-600">Gerencie clientes e crie novos pedidos</p>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
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

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Ações Rápidas</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={() => setShowCustomerModal(true)}
                className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <Plus className="h-5 w-5 text-blue-600" />
                <span className="text-blue-700 font-medium">Cadastro Rápido Cliente</span>
              </button>
              <button 
                onClick={() => setShowOrderModal(true)}
                className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
              >
                <ShoppingCart className="h-5 w-5 text-green-600" />
                <span className="text-green-700 font-medium">Criar Pedido</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 mb-8">
            <ManagementCard
              icon={Users}
              iconColor="bg-blue-500"
              title="Gerenciar Clientes"
              subtitle="Clientes"
              actionText="Ver Todos os Clientes"
              actionColor="text-blue-600"
              onClick={() => router.push('/seller/customers')}
            />

            <ManagementCard
              icon={ShoppingCart}
              iconColor="bg-green-500"
              title="Gestão de Pedidos"
              subtitle="Criar e Acompanhar Pedidos"
              actionText="Gerenciar Pedidos"
              actionColor="text-green-600"
              onClick={() => router.push('/seller/orders')}
            />
          </div>
        </div>
      </div>

      {/* Modal Cadastrar Cliente */}
      {showCustomerModal && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-gray-200 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-900">Cadastrar Cliente</CardTitle>
                <button
                  onClick={handleCancelCustomer}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold w-8 h-8 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleCustomerSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-gray-900 font-medium">Nome Completo</Label>
                  <Input
                    id="name"
                    value={customerForm.name}
                    onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                    className="bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-gray-900 font-medium">Telefone</Label>
                  <Input
                    id="phone"
                    value={customerForm.phone}
                    onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                    placeholder="(11) 99999-9999"
                    className="bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-gray-900 font-medium">E-mail (opcional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerForm.email}
                    onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                    className="bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="address" className="text-gray-900 font-medium">Endereço (opcional)</Label>
                  <textarea
                    id="address"
                    value={customerForm.address}
                    onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
                    placeholder="Rua, número, bairro, cidade..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900"
                  />
                </div>
                <div className="flex gap-2 pt-4 border-t">
                  <Button type="submit" disabled={loading} className="bg-blue-500 hover:bg-blue-600 flex-1">
                    {loading ? 'Cadastrando...' : 'Cadastrar'}
                  </Button>
                  <Button 
                    type="button" 
                    className="bg-red-500 hover:bg-red-600 text-white flex-1"
                    onClick={handleCancelCustomer}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </div>
        </div>
      )}

      {/* Modal Criar Pedido */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-gray-200 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-900">Criar Pedido</CardTitle>
                <button
                  onClick={handleCancelOrder}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold w-8 h-8 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleOrderSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="customerId" className="text-gray-900 font-medium">Cliente</Label>
                  <select
                    id="customerId"
                    value={orderForm.customerId}
                    onChange={(e) => setOrderForm({ ...orderForm, customerId: e.target.value })}
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900"
                    required
                  >
                    <option value="">Selecione um cliente</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} {customer.phone && `- ${customer.phone}`}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="serviceId" className="text-gray-900 font-medium">Serviço</Label>
                  <select
                    id="serviceId"
                    value={orderForm.serviceId}
                    onChange={(e) => setOrderForm({ ...orderForm, serviceId: e.target.value })}
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900"
                    required
                  >
                    <option value="">Selecione um serviço</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name} - R$ {service.price.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="quantity" className="text-gray-900 font-medium">Quantidade</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={orderForm.quantity}
                    onChange={(e) => setOrderForm({ ...orderForm, quantity: parseInt(e.target.value) || 1 })}
                    className="bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="notes" className="text-gray-900 font-medium">Observações (opcional)</Label>
                  <textarea
                    id="notes"
                    value={orderForm.notes}
                    onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                    placeholder="Instruções especiais ou observações..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900"
                  />
                </div>
                <div className="flex gap-2 pt-4 border-t">
                  <Button type="submit" disabled={loading} className="bg-blue-500 hover:bg-blue-600 flex-1">
                    {loading ? 'Criando...' : 'Criar'}
                  </Button>
                  <Button 
                    type="button" 
                    className="bg-red-500 hover:bg-red-600 text-white flex-1"
                    onClick={handleCancelOrder}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </div>
        </div>
      )}
    </div>
  );
}