import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useVacation } from '../context/VacationContext';
import { Card, CardHeader, CardBody, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import Badge from '../components/ui/Badge';
import { 
  ArrowLeft, Save, Calendar, AlertTriangle, 
  Info, CheckCircle, XCircle 
} from 'lucide-react';
import { 
  formatDate, 
  getDurationInDays, 
  getCurrentYear,
  isValidVacationPeriodCombination,
  getVacationDaysUsedInYear,
  getVacationPeriodsCountInYear
} from '../utils/helpers';

const VacationPeriodForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { users, vacationPeriods, addVacationPeriod, updateVacationPeriod, updateVacationStatus } = useVacation();
  
  const [formData, setFormData] = useState({
    userId: '',
    startDate: '',
    endDate: '',
    status: 'pending' as 'pending' | 'approved' | 'rejected',
    notes: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);
  
  const isEditing = id !== 'new';
  
  useEffect(() => {
    if (isEditing) {
      const vacationPeriod = vacationPeriods.find(period => period.id === id);
      if (vacationPeriod) {
        setFormData({
          userId: vacationPeriod.userId,
          startDate: new Date(vacationPeriod.startDate).toISOString().split('T')[0],
          endDate: new Date(vacationPeriod.endDate).toISOString().split('T')[0],
          status: vacationPeriod.status,
          notes: vacationPeriod.notes || '',
        });
        
        setDuration(vacationPeriod.duration);
      } else {
        navigate('/vacation-periods');
      }
    }
  }, [id, vacationPeriods, isEditing, navigate]);
  
  // Calculate duration when dates change
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      
      if (start <= end) {
        const newDuration = getDurationInDays(start, end);
        setDuration(newDuration);
      } else {
        setDuration(0);
      }
    } else {
      setDuration(0);
    }
  }, [formData.startDate, formData.endDate]);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.userId) {
      newErrors.userId = 'Funcionário é obrigatório';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Data de início é obrigatória';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'Data de término é obrigatória';
    }
    
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      
      if (start > end) {
        newErrors.endDate = 'A data de término deve ser posterior à data de início';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    if (!validateForm()) {
      return;
    }
    
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const year = startDate.getFullYear();
    
    // Check if valid vacation period
    if (isEditing && id) {
      // For editing, we need to exclude the current period from validation
      const filteredPeriods = vacationPeriods.filter(period => period.id !== id);
      const validation = isValidVacationPeriodCombination(
        filteredPeriods, 
        duration, 
        formData.userId, 
        year
      );
      
      if (!validation.isValid) {
        setErrorMessage(validation.message);
        return;
      }
      
      const periodToUpdate = vacationPeriods.find(period => period.id === id);
      if (periodToUpdate) {
        updateVacationPeriod(id, {
          userId: formData.userId,
          startDate,
          endDate,
          duration,
          status: formData.status,
          year,
          notes: formData.notes,
        });
        setSuccessMessage('Período de férias atualizado com sucesso!');
      }
    } else {
      // For new periods
      const validation = isValidVacationPeriodCombination(
        vacationPeriods, 
        duration, 
        formData.userId, 
        year
      );
      
      if (!validation.isValid) {
        setErrorMessage(validation.message);
        return;
      }
      
      addVacationPeriod({
        userId: formData.userId,
        startDate,
        endDate,
        duration,
        status: 'pending',
        year,
        notes: formData.notes,
      });
      
      setFormData({
        userId: '',
        startDate: '',
        endDate: '',
        status: 'pending',
        notes: '',
      });
      
      setDuration(0);
      setSuccessMessage('Período de férias cadastrado com sucesso!');
    }
    
    setTimeout(() => {
      if (isEditing) {
        navigate('/vacation-periods');
      } else {
        setSuccessMessage(null);
      }
    }, 2000);
  };
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Clear error message
    if (errorMessage) {
      setErrorMessage(null);
    }
  };
  
  // Get vacation information for the selected employee
  const getEmployeeVacationInfo = () => {
    if (!formData.userId) return null;
    
    const year = formData.startDate ? new Date(formData.startDate).getFullYear() : getCurrentYear();
    
    // For editing, we need to exclude the current period
    const periodsToConsider = isEditing 
      ? vacationPeriods.filter(period => period.id !== id)
      : vacationPeriods;
    
    const daysUsed = getVacationDaysUsedInYear(periodsToConsider, formData.userId, year, true);
    const periodsCount = getVacationPeriodsCountInYear(periodsToConsider, formData.userId, year, true);
    const daysRemaining = 30 - daysUsed;
    
    return {
      daysUsed,
      periodsCount,
      daysRemaining,
    };
  };
  
  const vacationInfo = getEmployeeVacationInfo();

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <button 
          onClick={() => navigate('/vacation-periods')}
          className="mr-4 text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Editar Período de Férias' : 'Novo Período de Férias'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {isEditing 
              ? 'Atualize as informações do período de férias' 
              : 'Preencha as informações para cadastrar um novo período de férias'}
          </p>
        </div>
      </div>
      
      {successMessage && (
        <Alert 
          variant="success" 
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}
      
      {errorMessage && (
        <Alert 
          variant="error" 
          title="Erro ao salvar período de férias"
          message={errorMessage}
          onClose={() => setErrorMessage(null)}
        />
      )}
      
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader className="bg-gray-50">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              <h2 className="text-lg font-medium text-gray-900">
                Detalhes do Período de Férias
              </h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-6">
            <div>
              <label 
                htmlFor="userId" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Funcionário*
              </label>
              <select
                id="userId"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 ${
                  errors.userId ? 'border-red-300' : ''
                }`}
                disabled={isEditing}
              >
                <option value="">Selecione um funcionário</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} - {user.department}
                  </option>
                ))}
              </select>
              {errors.userId && (
                <p className="mt-1 text-sm text-red-600">{errors.userId}</p>
              )}
            </div>
            
            {vacationInfo && (
              <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-800">
                      Informações de Férias para {getCurrentYear()}
                    </h4>
                    <ul className="mt-2 text-sm text-blue-700 space-y-1">
                      <li>Dias já utilizados: {vacationInfo.daysUsed} de 30</li>
                      <li>Períodos registrados: {vacationInfo.periodsCount} de 3</li>
                      <li>Dias restantes: {vacationInfo.daysRemaining}</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label 
                  htmlFor="startDate" 
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Data de Início*
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 ${
                    errors.startDate ? 'border-red-300' : ''
                  }`}
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
                )}
              </div>
              
              <div>
                <label 
                  htmlFor="endDate" 
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Data de Término*
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 ${
                    errors.endDate ? 'border-red-300' : ''
                  }`}
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center bg-gray-50 p-4 rounded-md">
              <Calendar className="h-6 w-6 text-blue-600 mr-2" />
              <span className="text-gray-700 font-medium">
                Duração total: {duration} dias
              </span>
              {(!isEditing || formData.status === 'pending') && duration > 0 && (
                <div className="ml-auto">
                  {[5, 10, 15, 30].includes(duration) ? (
                    <Badge variant="success" className="flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" /> Duração válida
                    </Badge>
                  ) : (
                    <Badge variant="danger" className="flex items-center">
                      <XCircle className="h-3 w-3 mr-1" /> Duração inválida
                    </Badge>
                  )}
                </div>
              )}
            </div>
            
            {isEditing && (
              <div>
                <label 
                  htmlFor="status" 
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
                >
                  <option value="pending">Pendente</option>
                  <option value="approved">Aprovado</option>
                  <option value="rejected">Rejeitado</option>
                </select>
              </div>
            )}
            
            <div>
              <label 
                htmlFor="notes" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Observações
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                value={formData.notes}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
                placeholder="Adicione observações sobre este período de férias..."
              />
            </div>
          </CardBody>
          <CardFooter className="flex justify-end space-x-3 bg-gray-50">
            <Button 
              type="button" 
              variant="light"
              onClick={() => navigate('/vacation-periods')}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              leftIcon={<Save size={16} />}
              disabled={duration === 0 || ![5, 10, 15, 30].includes(duration)}
            >
              {isEditing ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default VacationPeriodForm;