import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useVacation } from '../context/VacationContext';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import Badge from '../components/ui/Badge';
import { formatDate, getCurrentYear } from '../utils/helpers';
import { 
  Users, Clock, Calendar as CalendarIcon, AlertTriangle, CheckCircle, 
  PlusCircle, BarChart3, ChevronRight, UserCog
} from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Dashboard: React.FC = () => {
  const { users, vacationPeriods, updateVacationStatus } = useVacation();
  const { user } = useAuth();
  const [showAlert, setShowAlert] = useState(true);
  const navigate = useNavigate();
  const currentYear = getCurrentYear();

  // Filter pending requests
  const pendingRequests = vacationPeriods.filter(
    (period) => period.status === 'pending'
  ).slice(0, 3); // Only show first 3

  // Filter user's vacation periods
  const userVacationPeriods = vacationPeriods.filter(
    (period) => period.userId === user?.id
  ).slice(0, 3); // Only show first 3

  // Calculate department statistics (admin only)
  const departmentStats = users.reduce((acc: Record<string, number>, user) => {
    acc[user.department] = (acc[user.department] || 0) + 1;
    return acc;
  }, {});

  // Handle approve/reject vacation
  const handleVacationStatus = async (periodId: string, status: 'approved' | 'rejected') => {
    updateVacationStatus(periodId, status);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-lg text-gray-500">
            {user?.role === 'admin' 
              ? 'Visão geral do sistema de gerenciamento de férias'
              : 'Suas informações de férias'}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-4">
          {user?.role === 'admin' ? (
            <Link to="/users/new">
              <Button 
                variant="primary" 
                size="lg"
                leftIcon={<UserCog size={20} />}
                className="bg-primary-600 hover:bg-primary-700"
              >
                Novo Usuário
              </Button>
            </Link>
          ) : (
            <Link to="/vacation-periods/new">
              <Button 
                variant="primary" 
                size="lg"
                leftIcon={<PlusCircle size={20} />}
                className="bg-primary-600 hover:bg-primary-700"
              >
                Solicitar Férias
              </Button>
            </Link>
          )}
        </div>
      </div>

      {showAlert && (
        <Alert
          variant="info"
          title="Bem-vindo ao Sistema de Gerenciamento de Férias"
          message={user?.role === 'admin' 
            ? "Gerencie usuários, funcionários e períodos de férias."
            : "Solicite e acompanhe seus períodos de férias."}
          onClose={() => setShowAlert(false)}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="bg-primary-50">
              <h2 className="text-xl font-medium text-gray-900 flex items-center">
                <CalendarIcon className="w-6 h-6 mr-2 text-primary-600" />
                Calendário de Férias
              </h2>
            </CardHeader>
            <CardBody className="p-4">
              <div className="calendar-wrapper">
                <Calendar
                  className="w-full border-0"
                  tileClassName="text-center p-2"
                  tileContent={({ date }) => {
                    const vacationsOnDay = vacationPeriods.filter(period => {
                      const start = new Date(period.startDate);
                      const end = new Date(period.endDate);
                      return date >= start && date <= end;
                    });
                    
                    return vacationsOnDay.length > 0 ? (
                      <div className="absolute bottom-0 left-0 right-0 text-xs">
                        <Badge variant="primary" className="text-xs">
                          {vacationsOnDay.length}
                        </Badge>
                      </div>
                    ) : null;
                  }}
                />
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Pending Requests Card (Admin Only) */}
          {user?.role === 'admin' && (
            <Card>
              <CardHeader className="bg-primary-50">
                <h2 className="text-xl font-medium text-gray-900 flex items-center">
                  <Clock className="w-6 h-6 mr-2 text-primary-600" />
                  Solicitações Pendentes
                </h2>
              </CardHeader>
              <CardBody className="p-0">
                {pendingRequests.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {pendingRequests.map((request) => {
                      const employee = users.find(u => u.id === request.userId);
                      return (
                        <div key={request.id} className="p-4 hover:bg-gray-50">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-lg text-gray-900">{employee?.name}</p>
                              <div className="text-base text-gray-500 mt-1">
                                {formatDate(request.startDate)} - {formatDate(request.endDate)}
                              </div>
                            </div>
                            <Badge variant="warning">Pendente</Badge>
                          </div>
                          <div className="mt-3 flex justify-end space-x-3">
                            <Button
                              size="lg"
                              variant="success"
                              onClick={() => handleVacationStatus(request.id, 'approved')}
                            >
                              Aprovar
                            </Button>
                            <Button
                              size="lg"
                              variant="danger"
                              onClick={() => handleVacationStatus(request.id, 'rejected')}
                            >
                              Rejeitar
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <AlertTriangle className="mx-auto h-12 w-12 text-yellow-400" />
                    <p className="mt-2 text-lg text-gray-500">Nenhuma solicitação pendente</p>
                  </div>
                )}
              </CardBody>
            </Card>
          )}

          {/* User's Vacation Periods (Regular User Only) */}
          {user?.role !== 'admin' && (
            <Card>
              <CardHeader className="bg-primary-50">
                <h2 className="text-xl font-medium text-gray-900 flex items-center">
                  <Clock className="w-6 h-6 mr-2 text-primary-600" />
                  Minhas Férias
                </h2>
              </CardHeader>
              <CardBody className="p-0">
                {userVacationPeriods.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {userVacationPeriods.map((period) => (
                      <div key={period.id} className="p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-lg text-gray-900">
                              {formatDate(period.startDate)} - {formatDate(period.endDate)}
                            </div>
                            <div className="text-base text-gray-500 mt-1">
                              {period.duration} dias
                            </div>
                          </div>
                          <Badge 
                            variant={
                              period.status === 'approved' ? 'success' : 
                              period.status === 'pending' ? 'warning' : 'danger'
                            }
                          >
                            {period.status === 'approved' ? 'Aprovado' :
                             period.status === 'pending' ? 'Pendente' : 'Rejeitado'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <AlertTriangle className="mx-auto h-12 w-12 text-yellow-400" />
                    <p className="mt-2 text-lg text-gray-500">Nenhum período de férias registrado</p>
                  </div>
                )}
              </CardBody>
            </Card>
          )}

          {/* Department Distribution Card (Admin Only) */}
          {user?.role === 'admin' && (
            <Card>
              <CardHeader className="bg-primary-50">
                <h2 className="text-xl font-medium text-gray-900 flex items-center">
                  <BarChart3 className="w-6 h-6 mr-2 text-primary-600" />
                  Distribuição por Departamento
                </h2>
              </CardHeader>
              <CardBody>
                {Object.entries(departmentStats).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(departmentStats).map(([department, count]) => (
                      <div key={department}>
                        <div className="flex justify-between mb-1">
                          <span className="text-base font-medium text-gray-700">{department}</span>
                          <span className="text-base text-gray-500">{count}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-primary-600 h-2.5 rounded-full"
                            style={{ width: `${(count / users.length) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-lg text-gray-500">Nenhum departamento cadastrado</p>
                  </div>
                )}
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;