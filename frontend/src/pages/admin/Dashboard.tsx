import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Button } from '../../components/ui/Button';
import { toast } from 'sonner';

interface DashboardStats {
  totalUsers: number;
  totalVacations: number;
  pendingVacations: number;
  approvedVacations: number;
  rejectedVacations: number;
  departments: { name: string; count: number }[];
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalVacations: 0,
    pendingVacations: 0,
    approvedVacations: 0,
    rejectedVacations: 0,
    departments: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Buscar total de usuários
      const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Buscar estatísticas de férias
      const { data: vacations } = await supabase
        .from('vacation_periods')
        .select('status');

      const vacationStats = vacations?.reduce(
        (acc, curr) => {
          acc.total++;
          acc[curr.status]++;
          return acc;
        },
        { total: 0, pending: 0, approved: 0, rejected: 0 }
      );

      // Buscar estatísticas por departamento
      const { data: departments } = await supabase
        .from('users')
        .select('department')
        .not('department', 'is', null);

      const departmentStats = departments?.reduce((acc, curr) => {
        const dept = curr.department;
        acc[dept] = (acc[dept] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const departmentList = Object.entries(departmentStats || {}).map(([name, count]) => ({
        name,
        count
      }));

      setStats({
        totalUsers: totalUsers || 0,
        totalVacations: vacationStats?.total || 0,
        pendingVacations: vacationStats?.pending || 0,
        approvedVacations: vacationStats?.approved || 0,
        rejectedVacations: vacationStats?.rejected || 0,
        departments: departmentList
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      toast.error('Erro ao carregar estatísticas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        {loading ? (
          <div className="text-center">Carregando estatísticas...</div>
        ) : (
          <>
            {/* Cards de Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-gray-500 text-sm">Total de Usuários</h3>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-gray-500 text-sm">Total de Férias</h3>
                <p className="text-2xl font-bold">{stats.totalVacations}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-gray-500 text-sm">Férias Pendentes</h3>
                <p className="text-2xl font-bold text-yellow-500">{stats.pendingVacations}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-gray-500 text-sm">Férias Aprovadas</h3>
                <p className="text-2xl font-bold text-green-500">{stats.approvedVacations}</p>
              </div>
            </div>

            {/* Departamentos */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Usuários por Departamento</h2>
              <div className="space-y-4">
                {stats.departments.map((dept) => (
                  <div key={dept.name} className="flex items-center justify-between">
                    <span className="text-gray-700">{dept.name}</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-2">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{
                            width: `${(dept.count / stats.totalUsers) * 100}%`
                          }}
                        ></div>
                      </div>
                      <span className="text-gray-500">{dept.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ações Rápidas */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="w-full">
                  Criar Novo Usuário
                </Button>
                <Button variant="outline" className="w-full">
                  Aprovar Férias
                </Button>
                <Button variant="outline" className="w-full">
                  Gerar Relatório
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
} 