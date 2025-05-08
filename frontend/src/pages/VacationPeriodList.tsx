import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useVacation } from '../context/VacationContext';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { formatDate, getCurrentYear } from '../utils/helpers';
import { 
  Search, Plus, Edit, Trash, Filter, Calendar, CheckCircle, 
  XCircle, Clock, AlertTriangle 
} from 'lucide-react';

const VacationPeriodList: React.FC = () => {
  const { users, vacationPeriods, deleteVacationPeriod, updateVacationStatus } = useVacation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [yearFilter, setYearFilter] = useState<number>(getCurrentYear());
  
  // Filter vacation periods based on search term, status, and year
  const filteredPeriods = vacationPeriods.filter(period => {
    const employee = users.find(u => u.id === period.userId);
    const matchesSearch = !searchTerm || 
                          (employee && employee.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = !statusFilter || period.status === statusFilter;
    const matchesYear = period.year === yearFilter;
    
    return matchesSearch && matchesStatus && matchesYear;
  });

  // Get available years from vacation periods
  const availableYears = Array.from(
    new Set(vacationPeriods.map(period => period.year))
  ).sort((a, b) => b - a); // Sort descending

  // Get status badge variant based on status
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'danger';
      default:
        return 'default';
    }
  };

  // Get status text based on status
  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Aprovado';
      case 'pending':
        return 'Pendente';
      case 'rejected':
        return 'Rejeitado';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Períodos de Férias</h1>
          <p className="mt-2 text-lg text-gray-500">
            Gerencie os períodos de férias dos funcionários
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link to="/vacation-periods/new">
            <Button 
              variant="primary" 
              size="lg"
              leftIcon={<Plus size={20} />}
              className="bg-primary-600 hover:bg-primary-700"
            >
              Novo Período
            </Button>
          </Link>
        </div>
      </div>
      
      <Card>
        <CardHeader className="bg-primary-50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-500" />
              </div>
              <input
                type="text"
                className="h-12 bg-white border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5"
                placeholder="Buscar por funcionário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-44">
              <select
                className="h-12 bg-white border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Todos os status</option>
                <option value="pending">Pendente</option>
                <option value="approved">Aprovado</option>
                <option value="rejected">Rejeitado</option>
              </select>
            </div>
            <div className="w-full md:w-32">
              <select
                className="h-12 bg-white border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                value={yearFilter}
                onChange={(e) => setYearFilter(parseInt(e.target.value))}
              >
                {availableYears.length > 0 ? (
                  availableYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))
                ) : (
                  <option value={getCurrentYear()}>{getCurrentYear()}</option>
                )}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          {filteredPeriods.length > 0 ? (
            <div className="min-w-full">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                      Funcionário
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                      Período
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                      Duração
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-lg font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPeriods.map((period) => {
                    const employee = users.find(u => u.id === period.userId);
                    
                    return (
                      <tr key={period.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-primary-100 text-primary-600">
                              {employee?.name.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="ml-4">
                              <div className="text-lg font-medium text-gray-900">
                                {employee?.name || 'Funcionário desconhecido'}
                              </div>
                              <div className="text-base text-gray-500">
                                {employee?.department || 'Departamento desconhecido'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-lg text-gray-900 flex items-center">
                            <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                            {formatDate(period.startDate)} a {formatDate(period.endDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-lg text-gray-900">
                            {period.duration} dias
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={getStatusBadgeVariant(period.status)}>
                            {getStatusText(period.status)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-lg font-medium">
                          <div className="flex justify-end space-x-3">
                            {period.status === 'pending' && (
                              <>
                                <Button 
                                  variant="success" 
                                  size="lg"
                                  leftIcon={<CheckCircle size={20} />}
                                  onClick={() => updateVacationStatus(period.id, 'approved')}
                                >
                                  Aprovar
                                </Button>
                                <Button 
                                  variant="danger" 
                                  size="lg"
                                  leftIcon={<XCircle size={20} />}
                                  onClick={() => updateVacationStatus(period.id, 'rejected')}
                                >
                                  Rejeitar
                                </Button>
                              </>
                            )}
                            <Link to={`/vacation-periods/${period.id}`}>
                              <Button 
                                variant="light" 
                                size="lg"
                                leftIcon={<Edit size={20} />}
                              >
                                Editar
                              </Button>
                            </Link>
                            <Button 
                              variant="danger" 
                              size="lg"
                              leftIcon={<Trash size={20} />}
                              onClick={() => {
                                if (window.confirm('Tem certeza que deseja excluir este período de férias?')) {
                                  deleteVacationPeriod(period.id);
                                }
                              }}
                            >
                              Excluir
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertTriangle className="mx-auto h-16 w-16 text-yellow-400" />
              <h3 className="mt-2 text-xl font-medium text-gray-900">
                Nenhum período de férias encontrado
              </h3>
              <p className="mt-1 text-lg text-gray-500">
                {vacationPeriods.length === 0 
                  ? 'Comece adicionando um novo período de férias.' 
                  : 'Nenhum resultado encontrado para os filtros aplicados.'}
              </p>
              {vacationPeriods.length === 0 && (
                <div className="mt-6">
                  <Link to="/vacation-periods/new">
                    <Button 
                      variant="primary" 
                      size="lg"
                      leftIcon={<Plus size={20} />}
                      className="bg-primary-600 hover:bg-primary-700"
                    >
                      Novo Período
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default VacationPeriodList;