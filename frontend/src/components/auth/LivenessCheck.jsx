// src/components/auth/LivenessCheck.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import { verifyLiveness } from '../../api/authService';
import { toast, Toaster } from 'react-hot-toast';
import { Camera, AlertTriangle, CheckCircle } from 'lucide-react';

export const LivenessCheck = ({ phone, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleCheck = async () => {
    setIsLoading(true);
    toast.dismiss();
    setAttempts(prev => prev + 1);

    try {
      await verifyLiveness(phone);
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
          <div className="flex items-center p-4">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <p className="ml-3 font-medium text-gray-900">¡Identidad verificada!</p>
          </div>
        </div>
      ));
      setTimeout(onSuccess, 1500);
    } catch (error) {
      // Manejo de error según A4: Permite reintentos 
      if (attempts >= 2) {
        toast.error("Demasiados intentos fallidos. Por favor, contacta a soporte.", error);
      } else {
        toast.error(`Verificación fallida. Intento ${attempts + 1} de 3. Por favor, inténtalo de nuevo.`);
      }
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <div className="text-center space-y-6">
        <Camera className="mx-auto h-16 w-16 text-indigo-600" />
        <h1 className="text-2xl font-bold">Verificación de Identidad</h1>
        <p className="text-gray-500">
          Para proteger tu cuenta, necesitamos confirmar que eres tú. Centra tu rostro en la cámara y sigue las instrucciones.
        </p>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Esta es una simulación. Al presionar el botón, se simulará una verificación biométrica.
              </p>
            </div>
          </div>
        </div>
        <button onClick={handleCheck} disabled={isLoading || attempts >= 3}
          className="w-full py-3 px-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none disabled:bg-indigo-300">
          {isLoading ? 'Verificando...' : 'Iniciar Verificación'}
        </button>
      </div>
    </>
  );
};

LivenessCheck.propTypes = {
    phone: PropTypes.string.isRequired,
    onSuccess: PropTypes.func.isRequired,
};