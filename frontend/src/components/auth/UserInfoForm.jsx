// src/components/auth/UserInfoForm.jsx
import { useState } from 'react';
import PropTypes from 'prop-types'; // Importamos PropTypes
import { requestOtp } from '../../api/authService';
import { Toaster, toast } from 'react-hot-toast';

export const UserInfoForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    phone: '',
    name: '',
    lastName: '',
    email: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    toast.dismiss();

    try {
      await requestOtp(formData);
      toast.success('Te hemos enviado un código de verificación.');
      onSuccess({ phone: formData.phone });
    } catch (error) {
      if (error.data?.error_code === 'INVALID_PHONE') {
        toast.error('Número de teléfono inválido. Por favor, corrígelo.');
      } else {
        toast.error('No se pudo procesar tu solicitud. Intenta de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // ... el JSX es idéntico al de la versión TSX
    <>
      <Toaster position="top-center" />
      <div className="text-center">
        <h1 className="text-2xl font-bold">Crear tu cuenta</h1>
        <p className="text-gray-500">Ingresa tus datos para comenzar.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="text-sm font-medium text-gray-700">Nombre</label>
          <input id="name" name="name" type="text" required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" onChange={handleChange} value={formData.name} />
        </div>
        <div>
          <label htmlFor="lastName" className="text-sm font-medium text-gray-700">Apellido</label>
          <input id="lastName" name="lastName" type="text" required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" onChange={handleChange} value={formData.lastName} />
        </div>
        <div>
          <label htmlFor="phone" className="text-sm font-medium text-gray-700">Número de Teléfono</label>
          <input id="phone" name="phone" type="tel" required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" onChange={handleChange} value={formData.phone} />
        </div>
        <button type="submit" disabled={isLoading} className="w-full py-2 px-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300">
          {isLoading ? 'Verificando...' : 'Continuar'}
        </button>
      </form>
    </>
  );
};

UserInfoForm.propTypes = {
  onSuccess: PropTypes.func.isRequired,
};