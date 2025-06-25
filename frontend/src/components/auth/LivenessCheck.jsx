
import PropTypes from 'prop-types';
import { Camera, AlertTriangle } from 'lucide-react';

export const LivenessCheck = ({ onSuccess }) => {

  const handleCheck = () => {
    onSuccess();
  };

  return (
    <div className="text-center space-y-6">
      <Camera className="mx-auto h-16 w-16 text-indigo-600" />
      <h1 className="text-2xl font-bold">Verificación de Identidad</h1>
      <p className="text-gray-500">Para proteger tu cuenta, necesitamos confirmar que eres tú.</p>
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
              <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                      Este es un paso de simulación. Presiona el botón para continuar.
                  </p>
              </div>
          </div>
      </div>
      <button onClick={handleCheck} className="w-full py-3 px-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
        Iniciar Verificación y Continuar
      </button>
    </div>
  );
};

LivenessCheck.propTypes = {
  onSuccess: PropTypes.func.isRequired,
};