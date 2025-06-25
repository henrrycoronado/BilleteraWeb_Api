
import { useState } from 'react';
import PropTypes from 'prop-types';
import { login } from '../../api/authService';
import { Toaster, toast } from 'react-hot-toast';

export const LoginForm = ({ onSuccess }) => {
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    toast.dismiss();

    if (!phone || !pin) {
      toast.error('Todos los campos son obligatorios');
      setIsLoading(false);
      return;
    }

    try {
      const response = await login(phone, pin);
      toast.success('¡Bienvenido de nuevo!');
      onSuccess(response.data.token);
    } catch (error) {
      switch (error.data?.error_code) {
        case 'INVALID_CREDENTIALS':
          toast.error('Número o PIN incorrectos.'); // Mensaje de A3
          break;
        case 'ACCOUNT_LOCKED':
          toast.error('Demasiados intentos. Tu cuenta está bloqueada temporalmente.'); // Mensaje de A4
          break;
        default:
          toast.error('Ocurrió un error. Inténtalo de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="text-center">
        <h1 className="text-2xl font-bold">Iniciar Sesión</h1>
        <p className="text-gray-500">Ingresa a tu billetera móvil.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="phone" className="text-sm font-medium text-gray-700">Número de Teléfono</label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="pin" className="text-sm font-medium text-gray-700">PIN de Seguridad</label>
          <input
            id="pin"
            type="password"
            maxLength={6}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            required
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
        >
          {isLoading ? 'Ingresando...' : 'Iniciar Sesión'}
        </button>
      </form>
    </>
  );
};

LoginForm.propTypes = {
  onSuccess: PropTypes.func.isRequired,
};