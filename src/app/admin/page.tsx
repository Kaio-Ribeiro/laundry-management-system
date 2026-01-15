"use client";

import React, { useEffect, useState } from 'react';
import { Users, Package, BarChart3, Droplets, Users2, Repeat } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ManagementCard from '@/components/ManagementCard';

type Stats = {
  activeOrders: number;
  revenueToday: number;
  newCustomers: number;
  totalCustomers: number;
};

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  
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
  const navigateToTransferences = () => {
    router.push('/admin/transferences');
  };

  useEffect(() => {
    let mounted = true;
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        if (!res.ok) throw new Error('failed');
        const data: Stats = await res.json();
        if (mounted) setStats(data);
      } catch (e) {
        console.error('Error fetching stats', e);
      } finally {
        if (mounted) setLoadingStats(false);
      }
    };
    fetchStats();
    return () => { mounted = false; };
  }, []);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

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
              <div className="text-2xl font-bold text-blue-600">
                {loadingStats ? '—' : stats?.activeOrders ?? 0}
              </div>
              <div className="text-sm text-gray-500">Pedidos Ativos</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <div className="text-2xl font-bold text-green-600">
                {loadingStats ? '—' : formatCurrency(stats?.revenueToday ?? 0)}
              </div>
              <div className="text-sm text-gray-500">Receita de Hoje</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <div className="text-2xl font-bold text-purple-600">{loadingStats ? '—' : stats?.newCustomers ?? 0}</div>
              <div className="text-sm text-gray-500">Novos Clientes</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <div className="text-2xl font-bold text-cyan-600">{loadingStats ? '—' : stats?.totalCustomers ?? 0}</div>
              <div className="text-sm text-gray-500">Total de Clientes</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <ManagementCard
              icon={Users}
              iconColor="bg-blue-500"
              title="Gerenciar Vendedores"
              subtitle="Vendedores"
              actionText="Ver Todos os Vendedores"
              actionColor="text-blue-600"
              onClick={navigateToUsers}
            />

            <ManagementCard
              icon={Package}
              iconColor="bg-green-500"
              title="Serviços e Produtos"
              subtitle="Serviços"
              actionText="Gerenciar Serviços"
              actionColor="text-green-600"
              onClick={navigateToServices}
            />

            <ManagementCard
              icon={Users2}
              iconColor="bg-cyan-500"
              title="Gerenciar Clientes"
              subtitle="Clientes"
              actionText="Ver Todos os Clientes"
              actionColor="text-cyan-600"
              onClick={navigateToCustomers}
            />

            <ManagementCard
              icon={BarChart3}
              iconColor="bg-purple-500"
              title="Relatórios e Análises"
              subtitle="Relatórios"
              actionText="Ver Relatórios"
              actionColor="text-purple-600"
              onClick={navigateToReports}
            />

            <ManagementCard
              icon={Repeat}
              iconColor="bg-yellow-500"
              title="Transferências"
              subtitle="Transferências"
              actionText="Gerenciar Transferências"
              actionColor="text-yellow-600"
              onClick={navigateToTransferences}
            />
          </div>
        </div>
      </div>
    </div>
  );
}