import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useVacation } from '../context/VacationContext';
import { Card, CardHeader, CardBody, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { ArrowLeft, Save, User } from 'lucide-react';

const EmployeeForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { users, addUser, updateUser } = useVacation();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    role: 'employee' as 'employee' | 'manager',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const isEditing = id !== 'new';
  
  useEffect(() => {
    if (isEditing) {
      const employee = users.find(user => user.id === id);
      if (employee) {
        setFormData({
          name: employee.name,
          email: employee.email,
          department: employee.department,
          role: employee.role,
        });
      } else {
        navigate('/employees');
      }
    }
  }, [id, users, isEditing, navigate]);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.department.trim()) {
      newErrors.department = 'Departamento é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (isEditing && id) {
      updateUser(id, formData);
      setSuccessMessage('Funcionário atualizado com sucesso!');
    } else {
      addUser(formData);
      setFormData({
        name: '',
        email: '',
        department: '',
        role: 'employee',
      });
      setSuccessMessage('Funcionário cadastrado com sucesso!');
    }
    
    setTimeout(() => {
      if (isEditing) {
        navigate('/employees');
      } else {
        setSuccessMessage(null);
      }
    }, 2000);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
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
          onClick={() => navigate('/employees')}
          className="mr-4 text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Editar Funcionário' : 'Novo Funcionário'}
          </h1>
          <p className="mt-2 text-lg text-gray-500">
            {isEditing 
              ? 'Atualize as informações do funcionário' 
              : 'Preencha as informações para cadastrar um novo funcionário'}
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
          <CardHeader className="bg-primary-50">
            <div className="flex items-center">
              <User className="w-6 h-6 mr-2 text-primary-600" />
              <h2 className="text-xl font-medium text-gray-900">
                Informações do Funcionário
              </h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-8 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label 
                  htmlFor="name" 
                  className="block text-lg font-medium text-gray-700 mb-2"
                >
                  Nome Completo*
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`h-12 mt-1 block w-full rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 text-lg border-gray-300 ${
                    errors.name ? 'border-red-300' : ''
                  }`}
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
              
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-lg font-medium text-gray-700 mb-2"
                >
                  Email*
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`h-12 mt-1 block w-full rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 text-lg border-gray-300 ${
                    errors.email ? 'border-red-300' : ''
                  }`}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label 
                  htmlFor="department" 
                  className="block text-lg font-medium text-gray-700 mb-2"
                >
                  Departamento*
                </label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className={`h-12 mt-1 block w-full rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 text-lg border-gray-300 ${
                    errors.department ? 'border-red-300' : ''
                  }`}
                />
                {errors.department && (
                  <p className="mt-2 text-sm text-red-600">{errors.department}</p>
                )}
              </div>
              
              <div>
                <label 
                  htmlFor="role" 
                  className="block text-lg font-medium text-gray-700 mb-2"
                >
                  Função*
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="h-12 mt-1 block w-full rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 text-lg border-gray-300"
                >
                  <option value="employee">Funcionário</option>
                  <option value="manager">Gestor</option>
                </select>
              </div>
            </div>
          </CardBody>
          <CardFooter className="flex justify-end space-x-4 bg-primary-50 p-6">
            <Button 
              type="button" 
              variant="light"
              size="lg"
              onClick={() => navigate('/employees')}
              className="text-lg px-8"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              size="lg"
              leftIcon={<Save size={20} />}
              className="bg-primary-600 hover:bg-primary-700 text-lg px-8"
            >
              {isEditing ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default EmployeeForm;