// src/components/auth/CreatePinForm.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import { completeRegistration } from '../../api/authService';
import { Toaster, toast } from 'react-hot-toast';

export const CreatePinForm = ({ phone, onSuccess }) => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();

    if (pin !== confirmPin) {
      toast.error('Los PIN no coinciden.');
      return;
    }
    
    if (pin.length !== 6) {
      toast.error('El PIN debe tener 6 dígitos.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await completeRegistration(phone, pin);
      toast.success('¡Registro completado con éxito!');
      // La respuesta simulada tiene la data dentro de un objeto `data`
      onSuccess(response.data.token);
    } catch (error) {
      // Manejo de errores según A5: PIN no seguro 
      if (error.data?.error_code === 'PIN_NOT_SECURE') {
        toast.error('El PIN no es seguro. Evita secuencias o números repetidos.');
      } else {
        toast.error('No se pudo completar el registro. Inténtalo de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="text-center">
        <h1 className="text-2xl font-bold">Crea tu PIN de seguridad</h1>
        <p className="text-gray-500">Lo usarás para iniciar sesión y confirmar operaciones.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="pin" className="text-sm font-medium text-gray-700">PIN de 6 dígitos</label>
          <input
            id="pin"
            name="pin"
            type="password"
            maxLength={6}
            required
            className="w-full text-center tracking-[1em] text-2xl font-bold px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            onChange={(e) => setPin(e.target.value)}
            value={pin}
          />
        </div>
        <div>
          <label htmlFor="confirmPin" className="text-sm font-medium text-gray-700">Confirma tu PIN</label>
          <input
            id="confirmPin"
            name="confirmPin"
            type="password"
            maxLength={6}
            required
            className="w-full text-center tracking-[1em] text-2xl font-bold px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            onChange={(e) => setConfirmPin(e.target.value)}
            value={confirmPin}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || pin.length !== 6 || confirmPin.length !== 6}
          className="w-full py-2 px-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
        >
          {isLoading ? 'Finalizando...' : 'Crear Cuenta'}
        </button>
      </form>
    </>
  );
};

CreatePinForm.propTypes = {
    phone: PropTypes.string.isRequired,
    onSuccess: PropTypes.func.isRequired,
};