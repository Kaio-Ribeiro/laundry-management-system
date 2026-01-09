'use client';

import { useState, useEffect } from 'react';
import { Package, Plus, Edit, Trash2, Droplets } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Service {
  id: string;
  name: string;
  price: number;
  commission: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    commission: '',
    isActive: true,
  });

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      } else {
        setError('Erro ao carregar serviços');
      }
    } catch {
      setError('Erro ao carregar serviços');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validação do preço
    if (!formData.price || parseFloat(formData.price) < 0) {
      setError('Preço deve ser um valor válido maior ou igual a zero');
      return;
    }

    // Validação da comissão (opcional)
    if (formData.commission && parseFloat(formData.commission) < 0) {
      setError('Comissão deve ser um valor válido maior ou igual a zero');
      return;
    }

    try {
      const url = editingService ? `/api/services/${editingService.id}` : '/api/services';
      const method = editingService ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          commission: formData.commission ? parseFloat(formData.commission) : 0
        }),
      });

      if (response.ok) {
        setSuccess(editingService ? 'Serviço atualizado com sucesso!' : 'Serviço criado com sucesso!');
        setShowForm(false);
        setEditingService(null);
        setFormData({
          name: '',
          price: '',
          commission: '',
          isActive: true,
        });
        fetchServices();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erro ao salvar serviço');
      }
    } catch {
      setError('Erro ao salvar serviço');
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      price: service.price.toString(),
      commission: service.commission.toString(),
      isActive: service.isActive,
    });
    setShowForm(true);
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/services/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !currentStatus
        }),
      });

      if (response.ok) {
        setSuccess(`Serviço ${!currentStatus ? 'ativado' : 'desativado'} com sucesso!`);
        fetchServices();
      } else {
        setError('Erro ao alterar status do serviço');
      }
    } catch {
      setError('Erro ao alterar status do serviço');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este serviço?')) return;

    try {
      const response = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('Serviço excluído com sucesso!');
        fetchServices();
      } else {
        setError('Erro ao excluir serviço');
      }
    } catch {
      setError('Erro ao excluir serviço');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingService(null);
    setFormData({
      name: '',
      price: '',
      commission: '',
      isActive: true,
    });
    setError('');
    setSuccess('');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  // Filtrar serviços baseado no termo de busca
  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
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
                <p className="text-sm text-gray-500">Gerenciar Serviços</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => window.history.back()}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                ← Voltar
              </button>
              <span className="text-sm text-gray-600">Admin</span>
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
            <h2 className="text-2xl font-bold text-gray-800">Gerenciar Serviços</h2>
            <p className="text-gray-600">Cadastre e gerencie os serviços oferecidos pela lavanderia</p>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Serviço
          </Button>
        </div>

        {/* Campo de Busca */}
        <div className="mb-6">
          <Input
            placeholder="Buscar serviço..."
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
                    {editingService ? 'Editar Serviço' : 'Novo Serviço'}
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
                    <Label htmlFor="name" className="text-gray-900 font-medium">Nome do Serviço</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: Lavagem completa"
                      className="bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="price" className="text-gray-900 font-medium">Preço (R$)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="0.00"
                      className="bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="commission" className="text-gray-900 font-medium">Comissão (R$) - Opcional</Label>
                    <Input
                      id="commission"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.commission}
                      onChange={(e) => setFormData({ ...formData, commission: e.target.value })}
                      placeholder="0.00"
                      className="bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex gap-2 pt-4 border-t">
                    <Button type="submit" className="bg-blue-500 hover:bg-blue-600 flex-1">
                      {editingService ? 'Atualizar' : 'Criar'}
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
              <Package className="w-5 h-5" />
              Serviços Cadastrados ({filteredServices.length})
              {searchTerm && (
                <span className="text-sm font-normal text-gray-500">
                  de {services.length} total
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
                    <th className="text-left py-2 text-gray-900 font-semibold">Preço</th>
                    <th className="text-left py-2 text-gray-900 font-semibold">Comissão</th>
                    <th className="text-left py-2 text-gray-900 font-semibold">Status</th>
                    <th className="text-left py-2 text-gray-900 font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServices.map((service) => (
                    <tr key={service.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 text-gray-900">{service.name}</td>
                      <td className="py-3 text-gray-900">
                        {formatPrice(service.price)}
                      </td>
                      <td className="py-3 text-gray-900">
                        {formatPrice(service.commission)}
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => handleToggleStatus(service.id, service.isActive)}
                          className={`px-2 py-1 rounded-full text-xs cursor-pointer hover:opacity-80 transition-opacity ${
                            service.isActive 
                              ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          {service.isActive ? 'Ativo' : 'Inativo'}
                        </button>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(service)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(service.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredServices.length === 0 && services.length > 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500">
                        Nenhum serviço encontrado para &apos;{searchTerm}&apos;
                      </td>
                    </tr>
                  )}
                  {services.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500">
                        Nenhum serviço cadastrado
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