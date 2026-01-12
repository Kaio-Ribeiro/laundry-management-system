'use client';

import { useState, useEffect } from 'react';
import { Droplets, Repeat } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

type Transfer = {
  id: string;
  from: string;
  to: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
};

export default function TransferenciaPage() {
  const [from, setFrom] = useState<'Pix' | 'Dinheiro'>('Pix');
  const [to, setTo] = useState<'Pix' | 'Dinheiro'>('Dinheiro');
  const [amount, setAmount] = useState('');
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  const fetchTransfers = async () => {
    try {
      const response = await fetch('/api/transfers');
      if (response.ok) {
        const data = await response.json();
        setTransfers(data);
        setError('');
      } else {
        setError('Erro ao carregar transferências');
      }
    } catch {
      setError('Erro ao carregar transferências');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    const value = parseFloat(amount.replace(',', '.')) || 0;
    if (value <= 0) {
      setError('O valor deve ser maior que zero');
      setSubmitting(false);
      return;
    }
    if (from === to) {
      setError('Origem e destino devem ser diferentes');
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/transfers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to,
          amount: value
        })
      });

      if (response.ok) {
        setSuccess('Transferência realizada com sucesso!');
        setAmount('');
        fetchTransfers(); // Recarregar lista
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erro ao realizar transferência');
      }
    } catch {
      setError('Erro ao realizar transferência');
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  useEffect(() => {
    fetchTransfers();
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
                <p className="text-sm text-gray-500">Transferências</p>
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

        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <Repeat className="w-8 h-8 text-blue-500" />
              Transferências
            </h2>
            <p className="mt-1 text-gray-600">Transferências entre Pix e Dinheiro</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border border-gray-200 mb-6">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">De</label>
                <select
                  value={from}
                  onChange={(e) => setFrom(e.target.value as 'Pix' | 'Dinheiro')}
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900"
                >
                  <option>Pix</option>
                  <option>Dinheiro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Para</label>
                <select
                  value={to}
                  onChange={(e) => setTo(e.target.value as 'Pix' | 'Dinheiro')}
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900"
                >
                  <option>Pix</option>
                  <option>Dinheiro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0,00"
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900"
                />
              </div>

              <div className="sm:col-span-1">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-10 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors"
                >
                  {submitting ? 'Transferindo...' : 'Transferir'}
                </button>
              </div>
            </form>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Repeat className="w-5 h-5" />
                Histórico de Transferências ({transfers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 text-gray-900 font-semibold">Data</th>
                      <th className="text-left py-2 text-gray-900 font-semibold">Horário</th>
                      <th className="text-left py-2 text-gray-900 font-semibold">De</th>
                      <th className="text-left py-2 text-gray-900 font-semibold">Para</th>
                      <th className="text-right py-2 text-gray-900 font-semibold">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transfers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-500">
                          Nenhuma transferência realizada
                        </td>
                      </tr>
                    ) : (
                      transfers.map((t) => (
                        <tr key={t.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 text-gray-900 font-medium">
                            {new Date(t.createdAt).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="py-3 text-gray-900">
                            {new Date(t.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="py-3 text-gray-900">{t.from === 'PIX' ? 'Pix' : 'Dinheiro'}</td>
                          <td className="py-3 text-gray-900">{t.to === 'PIX' ? 'Pix' : 'Dinheiro'}</td>
                          <td className="py-3 text-gray-900 text-right font-medium">
                            {formatCurrency(t.amount)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
