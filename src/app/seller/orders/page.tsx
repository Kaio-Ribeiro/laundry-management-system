'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Edit, Trash2, Droplets, ArrowLeft } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

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

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  subtotal: number;
  service: Service;
}

interface Order {
  id: string;
  status: string;
  totalPrice: number;
  notes?: string;
  createdAt: string;
  customer: Customer;
  orderItems: OrderItem[];
}

export default function SellerOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    customerId: '',
    serviceId: '',
    quantity: 1,
    notes: '',
    status: 'PENDING'
  });

  const statusOptions = [
    { value: 'PENDING', label: 'Pendente', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'IN_PROGRESS', label: 'Em Andamento', color: 'bg-blue-100 text-blue-700' },
    { value: 'COMPLETED', label: 'Concluído', color: 'bg-green-100 text-green-700' },
    { value: 'DELIVERED', label: 'Entregue', color: 'bg-purple-100 text-purple-700' }
  ];

  const getStatusInfo = (status: string) => {
    return statusOptions.find(option => option.value === status) || statusOptions[0];
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        setError('Erro ao carregar pedidos');
      }
    } catch {
      setError('Erro ao carregar pedidos');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const method = editingOrder ? 'PUT' : 'POST';
      const url = editingOrder ? `/api/orders/${editingOrder.id}` : '/api/orders';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(editingOrder ? 'Pedido atualizado com sucesso!' : 'Pedido criado com sucesso!');
        setShowForm(false);
        setEditingOrder(null);
        setFormData({
          customerId: '',
          serviceId: '',
          quantity: 1,
          notes: '',
          status: 'PENDING'
        });
        await fetchOrders(); // Recarregar a lista
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erro ao salvar pedido');
      }
    } catch {
      setError('Erro de conexão. Tente novamente.');
    }
  };

  const handleEdit = (order: Order) => {
    setEditingOrder(order);
    setFormData({
      customerId: order.customer.id,
      serviceId: order.orderItems[0]?.service.id || '',
      quantity: order.orderItems[0]?.quantity || 1,
      notes: order.notes || '',
      status: order.status
    });
    setShowForm(true);
  };

  const handleDelete = async (order: Order) => {
    if (!confirm('Tem certeza que deseja excluir este pedido? Esta ação não pode ser desfeita.')) return;
    
    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('Pedido excluído com sucesso!');
        await fetchOrders(); // Recarregar a lista
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erro ao excluir pedido');
      }
    } catch {
      setError('Erro de conexão. Tente novamente.');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingOrder(null);
    setFormData({
      customerId: '',
      serviceId: '',
      quantity: 1,
      notes: '',
      status: 'PENDING'
    });
    setError('');
    setSuccess('');
  };

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

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
                <p className="text-sm text-gray-500">Gerenciar Pedidos</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.push('/seller')}
                className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </button>
              <span className="text-sm text-gray-600">Vendedor</span>
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

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
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

        {/* Header da página */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Gerenciar Pedidos</h2>
            <p className="text-gray-600">Visualize e gerencie os pedidos da lavanderia</p>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Pedido
          </Button>
        </div>

        {/* Modal de Formulário */}
        {showForm && (
          <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl border border-gray-200 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-gray-900">
                    {editingOrder ? 'Editar Pedido' : 'Novo Pedido'}
                  </CardTitle>
                  <button
                    onClick={handleCancel}
                    className="text-gray-400 hover:text-gray-600 text-xl font-bold w-8 h-8 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="customerId" className="text-gray-900 font-medium">Cliente</Label>
                    <select
                      id="customerId"
                      value={formData.customerId}
                      onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                      className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:border-green-500 focus:ring-green-500 bg-white text-gray-900"
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
                      value={formData.serviceId}
                      onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                      className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:border-green-500 focus:ring-green-500 bg-white text-gray-900"
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
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                      className="bg-white text-gray-900 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>
                  {editingOrder && (
                    <div>
                      <Label htmlFor="status" className="text-gray-900 font-medium">Status</Label>
                      <select
                        id="status"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:border-green-500 focus:ring-green-500 bg-white text-gray-900"
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div>
                    <Label htmlFor="notes" className="text-gray-900 font-medium">Observações (opcional)</Label>
                    <textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Instruções especiais ou observações..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-green-500 focus:ring-green-500 bg-white text-gray-900"
                    />
                  </div>
                  <div className="flex gap-2 pt-4 border-t">
                    <Button type="submit" className="bg-blue-500 hover:bg-blue-600 flex-1">
                      {editingOrder ? 'Atualizar' : 'Criar'}
                    </Button>
                    <Button 
                      type="button" 
                      className="bg-red-500 hover:bg-red-600 text-white flex-1"
                      onClick={handleCancel}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </div>
          </div>
        )}

        {/* Listagem */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <ShoppingCart className="w-5 h-5" />
              Pedidos ({orders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 text-gray-900 font-semibold">Cliente</th>
                    <th className="text-left py-2 text-gray-900 font-semibold">Serviço</th>
                    <th className="text-left py-2 text-gray-900 font-semibold">Total</th>
                    <th className="text-left py-2 text-gray-900 font-semibold">Status</th>
                    <th className="text-left py-2 text-gray-900 font-semibold">Data</th>
                    <th className="text-left py-2 text-gray-900 font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const statusInfo = getStatusInfo(order.status);
                    return (
                      <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 text-gray-900 font-medium">{order.customer.name}</td>
                        <td className="py-3 text-gray-900">
                          {order.orderItems.map(item => `${item.service.name} (${item.quantity}x)`).join(', ')}
                        </td>
                        <td className="py-3 text-gray-900 font-medium">R$ {order.totalPrice.toFixed(2)}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="py-3 text-gray-900">
                          {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(order)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(order)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-500">
                        Nenhum pedido encontrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}