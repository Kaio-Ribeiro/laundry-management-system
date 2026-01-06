'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Droplets } from 'lucide-react';

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') {
      return; // Ainda carregando a sessão
    }

    if (!session) {
      // Usuário não está logado, redirecionar para login
      router.push('/auth/login');
      return;
    }

    if (session.user.role !== 'SELLER') {
      // Usuário logado mas não é seller, redirecionar para dashboard
      router.push('/dashboard');
      return;
    }
  }, [session, status, router]);

  // Mostrar loading enquanto verifica a sessão ou aguarda redirecionamento
  if (status === 'loading' || !session || session.user.role !== 'SELLER') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-blue-500 rounded-lg animate-pulse">
            <Droplets className="w-8 h-8 text-white" />
          </div>
          <div className="text-lg font-medium text-gray-700">
            Verificando permissões...
          </div>
        </div>
      </div>
    );
  }

  // Se chegou até aqui, o usuário é seller
  return <>{children}</>;
}