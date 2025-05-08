import React, { useState } from 'react';
import { useVacation } from '../context/VacationContext';
import { Card, CardHeader, CardBody, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { Settings, Mail, Calendar, Save, ArrowLeft, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SystemSettings: React.FC = () => {
  const { systemConfig, updateSystemConfig } = useVacation();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    currentYear: systemConfig.currentYear,
    notificationEmail: systemConfig.notificationEmail,
  });
  
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.currentYear) {
      newErrors.currentYear = 'Ano é obrigatório';
    } else if (formData.currentYear < 2024 || formData.currentYear > 2100) {
      newErrors.currentYear = 'Ano deve estar entre 2024 e 2100';
    }
    
    if (!formData.notificationEmail) {
      newErrors.notificationEmail = 'Email de notificação é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.notificationEmail)) {
      newErrors.notificationEmail = 'Email inválido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    updateSystemConfig({
      currentYear: formData.currentYear,
      notificationEmail: formData.notificationEmail,
    });
    
    setSuccessMessage('Configurações atualizadas com sucesso!');
    
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'currentYear' ? parseInt(value) : value,
    }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <button 
          onClick={() => navigate('/')}
          className="mr-4 text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações do Sistema</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie as configurações globais do sistema de férias
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
      
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader className="bg-gray-50">
            <div className="flex items-center">
              <Settings className="w-5 h-5 mr-2 text-blue-600" />
              <h2 className="text-lg font-medium text-gray-900">
                Configurações Gerais
              </h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label 
                  htmlFor="currentYear" 
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Ano em Curso*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="currentYear"
                    name="currentYear"
                    value={formData.currentYear}
                    onChange={handleChange}
                    min="2024"
                    max="2100"
                    className={`pl-10 mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 ${
                      errors.currentYear ? 'border-red-300' : ''
                    }`}
                  />
                </div>
                {errors.currentYear && (
                  <p className="mt-1 text-sm text-red-600">{errors.currentYear}</p>
                )}
              </div>
              
              <div>
                <label 
                  htmlFor="notificationEmail" 
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email para Notificações*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="notificationEmail"
                    name="notificationEmail"
                    value={formData.notificationEmail}
                    onChange={handleChange}
                    placeholder="gestor@empresa.com"
                    className={`pl-10 mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 ${
                      errors.notificationEmail ? 'border-red-300' : ''
                    }`}
                  />
                </div>
                {errors.notificationEmail && (
                  <p className="mt-1 text-sm text-red-600">{errors.notificationEmail}</p>
                )}
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-100 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Informações Importantes
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        O ano em curso é usado para controlar os períodos de férias disponíveis
                      </li>
                      <li>
                        O email de notificação receberá cópia de todas as aprovações de férias
                      </li>
                      <li>
                        Certifique-se de usar um email válido e monitorado para as notificações
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
          <CardFooter className="flex justify-end space-x-3 bg-gray-50">
            <Button 
              type="button" 
              variant="light"
              onClick={() => navigate('/')}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              leftIcon={<Save size={16} />}
            >
              Salvar Configurações
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SystemSettings;