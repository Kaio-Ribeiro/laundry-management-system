'use client';

import { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, Droplets, Eye, EyeOff } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'SELLER',
    isActive: true,
  });

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        // Filtrar apenas vendedores
        const sellers = data.filter((user: User) => user.role === 'SELLER');
        setUsers(sellers);
      } else {
        setError('Erro ao carregar vendedores');
      }
    } catch {
        setError('Erro ao carregar vendedores');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users';
      const method = editingUser ? 'PUT' : 'POST';
      
      // Sempre definir role como SELLER
      const submitData = { ...formData, role: 'SELLER' };
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        setSuccess(editingUser ? 'Vendedor atualizado com sucesso!' : 'Vendedor criado com sucesso!');
        setShowForm(false);
        setEditingUser(null);
        setFormData({
          name: '',
          email: '',
          password: '',
          role: 'SELLER',
          isActive: true,
        });
        fetchUsers();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erro ao salvar vendedor');
      }
    } catch {
      setError('Erro ao salvar vendedor');
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      isActive: user.isActive,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este vendedor? Esta ação não pode ser desfeita.')) return;

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('Vendedor excluído com sucesso!');
        fetchUsers();
      } else {
        setError('Erro ao excluir vendedor');
      }
    } catch {
      setError('Erro ao excluir vendedor');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        setSuccess(`Vendedor ${!currentStatus ? 'ativado' : 'desativado'} com sucesso!`);
        fetchUsers();
      } else {
        setError('Erro ao alterar status do vendedor');
      }
    } catch {
      setError('Erro ao alterar status do vendedor');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingUser(null);
    setShowPassword(false);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'SELLER',
      isActive: true,
    });
    setError('');
    setSuccess('');
  };

  // Filtrar vendedores baseado no termo de busca
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchUsers();
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
                <p className="text-sm text-gray-500">Gerenciar Vendedores</p>
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
            <h2 className="text-2xl font-bold text-gray-800">Gerenciar Vendedores</h2>
            <p className="text-gray-600">Cadastre e gerencie vendedores</p>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Vendedor
          </Button>
        </div>

        {/* Campo de Busca */}
        <div className="mb-6">
          <Input
            placeholder="Buscar vendedor..."
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
                    {editingUser ? 'Editar Vendedor' : 'Novo Vendedor'}
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
                    <Label htmlFor="email" className="text-gray-900 font-medium">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password" className="text-gray-900 font-medium">
                      {editingUser ? 'Nova Senha (deixe vazio para manter)' : 'Senha'}
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                        required={!editingUser}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4 border-t">
                    <Button type="submit" className="bg-blue-500 hover:bg-blue-600 flex-1">
                      {editingUser ? 'Atualizar' : 'Criar'}
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
              <Users className="w-5 h-5" />
              Vendedores Cadastrados ({filteredUsers.length})
              {searchTerm && (
                <span className="text-sm font-normal text-gray-500">
                  de {users.length} total
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
                    <th className="text-left py-2 text-gray-900 font-semibold">E-mail</th>
                    <th className="text-left py-2 text-gray-900 font-semibold">Status</th>
                    <th className="text-left py-2 text-gray-900 font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 text-gray-900">{user.name}</td>
                      <td className="py-3 text-gray-900">{user.email}</td>
                      <td className="py-3">
                        <button
                          onClick={() => handleToggleStatus(user.id, user.isActive)}
                          className={`px-2 py-1 rounded-full text-xs cursor-pointer hover:opacity-80 transition-opacity ${
                            user.isActive 
                              ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          {user.isActive ? 'Ativo' : 'Inativo'}
                        </button>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && users.length > 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-500">
                        Nenhum vendedor encontrado para &apos;{searchTerm}&apos;
                      </td>
                    </tr>
                  )}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-500">
                        Nenhum vendedor cadastrado
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