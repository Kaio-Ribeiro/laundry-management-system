'use client';

import { useState, useEffect } from 'react';
import { Users2, Plus, Edit, Trash2, Droplets, ArrowLeft } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Order {
  id: string;
  status: string;
  createdAt: string;
}

interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  orders?: Order[];
}

export default function SellerCustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    isActive: true,
  });

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
      } else {
        setError('Erro ao carregar clientes');
      }
    } catch {
      setError('Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const url = editingCustomer ? `/api/customers/${editingCustomer.id}` : '/api/customers';
      const method = editingCustomer ? 'PUT' : 'POST';
      
      const submitData = { ...formData, isActive: true };
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        setSuccess(editingCustomer ? 'Cliente atualizado com sucesso!' : 'Cliente criado com sucesso!');
        setShowForm(false);
        setEditingCustomer(null);
        setFormData({
          name: '',
          email: '',
          phone: '',
          address: '',
          isActive: true,
        });
        fetchCustomers();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erro ao salvar cliente');
      }
    } catch {
      setError('Erro ao salvar cliente');
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email || '',
      phone: customer.phone,
      address: customer.address || '',
      isActive: customer.isActive,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.')) return;

    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('Cliente excluído com sucesso!');
        fetchCustomers();
      } else {
        setError('Erro ao excluir cliente');
      }
    } catch {
      setError('Erro ao excluir cliente');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        setSuccess(`Cliente ${!currentStatus ? 'ativado' : 'desativado'} com sucesso!`);
        fetchCustomers();
      } else {
        setError('Erro ao alterar status do cliente');
      }
    } catch {
      setError('Erro ao alterar status do cliente');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCustomer(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      isActive: true,
    });
    setError('');
    setSuccess('');
  };

  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    } else if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  // Filtrar clientes baseado no termo de busca
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchCustomers();
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
                <p className="text-sm text-gray-500">Gerenciar Clientes</p>
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
            <h2 className="text-2xl font-bold text-gray-800">Gerenciar Clientes</h2>
            <p className="text-gray-600">Visualize e gerencie os clientes da lavanderia</p>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Cliente
          </Button>
        </div>

        {/* Campo de Busca */}
        <div className="mb-6">
          <Input
            placeholder="Buscar cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500 max-w-sm"
          />
        </div>

        {/* Modal de Formulário */}
        {showForm && (
          <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl border border-gray-200 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-gray-900">
                    {editingCustomer ? 'Editar Cliente' : 'Novo Cliente'}
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
                    <Label htmlFor="name" className="text-gray-900 font-medium">Nome Completo</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-gray-900 font-medium">Telefone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address" className="text-gray-900 font-medium">Endereço (opcional)</Label>
                    <textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Rua, número, bairro, cidade..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900"
                    />
                  </div>
                  <div className="flex gap-2 pt-4 border-t">
                    <Button type="submit" className="bg-blue-500 hover:bg-blue-600 flex-1">
                      {editingCustomer ? 'Atualizar' : 'Criar'}
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
              <Users2 className="w-5 h-5" />
              Clientes Cadastrados ({filteredCustomers.length})
              {searchTerm && (
                <span className="text-sm font-normal text-gray-500">
                  de {customers.length} total
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 text-gray-900 font-semibold">Nome</th>
                    <th className="text-left py-2 text-gray-900 font-semibold">Telefone</th>
                    <th className="text-left py-2 text-gray-900 font-semibold">E-mail</th>
                    <th className="text-left py-2 text-gray-900 font-semibold">Status</th>
                    <th className="text-left py-2 text-gray-900 font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 text-gray-900 font-medium">{customer.name}</td>
                      <td className="py-3 text-gray-900">{formatPhone(customer.phone)}</td>
                      <td className="py-3 text-gray-900">{customer.email || '-'}</td>
                      <td className="py-3">
                        <button
                          onClick={() => handleToggleStatus(customer.id, customer.isActive)}
                          className={`px-2 py-1 rounded-full text-xs cursor-pointer hover:opacity-80 transition-opacity ${
                            customer.isActive 
                              ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          {customer.isActive ? 'Ativo' : 'Inativo'}
                        </button>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(customer)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(customer.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredCustomers.length === 0 && customers.length > 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500">
                        Nenhum cliente encontrado para &apos;{searchTerm}&apos;
                      </td>
                    </tr>
                  )}
                  {customers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500">
                        Nenhum cliente cadastrado
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