// src/components/auth/OtpVerificationForm.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import { verifyOtp } from '../../api/authService';
import { Toaster, toast } from 'react-hot-toast';

export const OtpVerificationForm = ({ phone, onSuccess }) => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // En una implementación completa, un hook `useTimer` activaría este botón.
  const [canResend, setCanResend] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    toast.dismiss();

    try {
      // Usamos "123456" como el código correcto en nuestra simulación
      await verifyOtp(phone, otp);
      toast.success('Código verificado correctamente.');
      onSuccess();
    } catch (error) {
      // Manejo de errores según A3: OTP incorrecto o expirado
      if (error.data?.error_code === 'INVALID_OTP') {
        toast.error('Código incorrecto o expirado. Inténtalo de nuevo.');
      } else {
        toast.error('Ocurrió un error inesperado.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    // Lógica para reenviar el OTP (simulada)
    toast.success('Te hemos reenviado el código.');
    setCanResend(false); // Desactivar de nuevo hasta que pase el tiempo
  }

  return (
    <>
      <Toaster position="top-center" />
      <div className="text-center">
        <h1 className="text-2xl font-bold">Verificar tu número</h1>
        <p className="text-gray-500">
          Ingresa el código de 6 dígitos que enviamos a {phone}.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="otp" className="sr-only">Código OTP</label>
          <input
            id="otp"
            name="otp"
            type="text"
            maxLength={6}
            required
            className="w-full text-center tracking-[1em] text-2xl font-bold px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            onChange={(e) => setOtp(e.target.value)}
            value={otp}
            placeholder="------"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || otp.length !== 6}
          className="w-full py-2 px-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
        >
          {isLoading ? 'Verificando...' : 'Verificar Código'}
        </button>
      </form>
       <div className="text-center mt-4">
          <button onClick={handleResend} disabled={!canResend} className="text-sm text-indigo-600 hover:underline disabled:text-gray-400">
            Reenviar código
          </button>
           <p className="text-xs text-gray-500 mt-1">Podrás reenviar en 60 segundos.</p>
        </div>
    </>
  );
};

OtpVerificationForm.propTypes = {
    phone: PropTypes.string.isRequired,
    onSuccess: PropTypes.func.isRequired,
};