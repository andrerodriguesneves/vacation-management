import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardHeader, CardBody, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { ArrowLeft, Save, UserCog } from 'lucide-react';
import { supabase } from '../lib/supabase';

const UserEmployeeForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = id !== 'new';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    role: 'user' as 'user' | 'admin',
    position: 'employee' as 'employee' | 'manager',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      loadUser();
    }
  }, [id]);

  const loadUser = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setFormData({
          name: data.name || '',
          email: data.email,
          password: '',
          department: data.department || '',
          role: data.role,
          position: data.position || 'employee',
        });
      }
    } catch (err) {
      console.error('Error loading user:', err);
      setErrors({ general: 'Erro ao carregar usuário' });
    }
  };

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

    if (!isEditing && !formData.password) {
      newErrors.password = 'Senha é obrigatória';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Departamento é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      if (isEditing) {
        // Atualizar usuário existente
        const { error } = await supabase
          .from('users')
          .update({
            name: formData.name,
            email: formData.email,
            department: formData.department,
            role: formData.role,
            position: formData.position,
          })
          .eq('id', id);

        if (error) throw error;
        setSuccessMessage('Usuário atualizado com sucesso!');
      } else {
        // Criar novo usuário
        const { error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

        if (signUpError) throw signUpError;

        const { error: insertError } = await supabase
          .from('users')
          .insert([
            {
              name: formData.name,
              email: formData.email,
              department: formData.department,
              role: formData.role,
              position: formData.position,
            },
          ]);

        if (insertError) throw insertError;
        setSuccessMessage('Usuário criado com sucesso!');
      }

      setTimeout(() => {
        navigate('/users');
      }, 2000);
    } catch (err) {
      console.error('Error saving user:', err);
      setErrors({ general: 'Erro ao salvar usuário' });
    } finally {
      setLoading(false);
    }
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
          onClick={() => navigate('/users')}
          className="mr-4 text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Editar Usuário' : 'Novo Usuário'}
          </h1>
          <p className="mt-2 text-lg text-gray-500">
            {isEditing
              ? 'Atualize as informações do usuário'
              : 'Cadastre um novo usuário no sistema'}
          </p>
        </div>
      </div>

      {errors.general && (
        <Alert
          variant="error"
          message={errors.general}
          onClose={() => setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.general;
            return newErrors;
          })}
        />
      )}

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
              <UserCog className="w-6 h-6 mr-2 text-primary-600" />
              <h2 className="text-xl font-medium text-gray-900">
                Informações do Usuário
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

            {!isEditing && (
              <div>
                <label
                  htmlFor="password"
                  className="block text-lg font-medium text-gray-700 mb-2"
                >
                  Senha*
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`h-12 mt-1 block w-full rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 text-lg border-gray-300 ${
                    errors.password ? 'border-red-300' : ''
                  }`}
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
            )}

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
                  htmlFor="position"
                  className="block text-lg font-medium text-gray-700 mb-2"
                >
                  Cargo*
                </label>
                <select
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="h-12 mt-1 block w-full rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 text-lg border-gray-300"
                >
                  <option value="employee">Funcionário</option>
                  <option value="manager">Gerente</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-lg font-medium text-gray-700 mb-2"
              >
                Nível de Acesso*
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="h-12 mt-1 block w-full rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 text-lg border-gray-300"
              >
                <option value="user">Usuário</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </CardBody>
          <CardFooter className="bg-gray-50 px-8 py-4 flex justify-end space-x-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/users')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={loading}
              leftIcon={<Save size={20} />}
            >
              {isEditing ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default UserEmployeeForm; 