import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { LogIn } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await signIn(email, password);
      navigate('/');
    } catch (err) {
      setError('Falha no login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8">
        <div className="text-center">
          <LogIn className="mx-auto h-16 w-16 text-primary-600" />
          <h2 className="mt-6 text-4xl font-extrabold text-gray-900">
            Sistema de Férias
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Faça login para acessar o sistema
          </p>
        </div>

        <Card>
          <CardBody className="p-8">
            {error && (
              <Alert
                variant="error"
                message={error}
                className="mb-6"
                onClose={() => setError('')}
              />
            )}

            <form className="space-y-8" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-lg"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-lg font-medium text-gray-700 mb-2">
                  Senha
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-lg"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full h-12 text-lg bg-primary-600 hover:bg-primary-700"
                isLoading={loading}
                leftIcon={<LogIn size={20} />}
              >
                Entrar
              </Button>

              <div className="text-base text-center mt-6">
                <p className="text-gray-600 font-medium">
                  Usuários de teste:
                </p>
                <p className="text-gray-500 mt-2">
                  Admin: admin@example.com / password
                  <br />
                  Usuário: user@example.com / password
                </p>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Login;