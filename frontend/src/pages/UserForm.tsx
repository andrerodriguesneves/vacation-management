import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardHeader, CardBody, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { ArrowLeft, Save, UserCog } from 'lucide-react';
import { supabase } from '../lib/supabase';

const UserForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = id !== 'new';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'user',
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
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
          ...formData,
          email: data.email,
          role: data.role,
        });
      }
    } catch (err) {
      console.error('Error loading user:', err);
      setError('Erro ao carregar usuário');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditing) {
        const { error } = await supabase
          .from('users')
          .update({
            email: formData.email,
            role: formData.role,
          })
          .eq('id', id);

        if (error) throw error;
        setSuccess('Usuário atualizado com sucesso!');
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

        if (signUpError) throw signUpError;

        const { error: insertError } = await supabase
          .from('users')
          .insert([
            {
              email: formData.email,
              role: formData.role,
            },
          ]);

        if (insertError) throw insertError;
        setSuccess('Usuário criado com sucesso!');
      }

      setTimeout(() => {
        navigate('/users');
      }, 2000);
    } catch (err) {
      console.error('Error saving user:', err);
      setError('Erro ao salvar usuário');
    } finally {
      setLoading(false);
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

      {error && (
        <Alert
          variant="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      {success && (
        <Alert
          variant="success"
          message={success}
          onClose={() => setSuccess(null)}
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
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-12 mt-1 block w-full rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 text-lg border-gray-300"
                required
              />
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
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="h-12 mt-1 block w-full rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 text-lg border-gray-300"
                  required={!isEditing}
                />
              </div>
            )}

            <div>
              <label
                htmlFor="role"
                className="block text-lg font-medium text-gray-700 mb-2"
              >
                Função*
              </label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="h-12 mt-1 block w-full rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 text-lg border-gray-300"
                required
              >
                <option value="user">Usuário</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </CardBody>
          <CardFooter className="flex justify-end space-x-4 bg-primary-50 p-6">
            <Button
              type="button"
              variant="light"
              size="lg"
              onClick={() => navigate('/users')}
              className="text-lg px-8"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
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

export default UserForm;