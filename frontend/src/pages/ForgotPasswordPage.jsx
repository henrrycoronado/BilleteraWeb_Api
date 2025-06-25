// src/pages/ForgotPasswordPage.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import { toast, Toaster } from 'react-hot-toast';
import { requestPinRecoveryOtp, resetPin } from '../api/authService.js';
import { RequestResetCodeForm } from '../components/auth/RequestResetCodeForm';
import { VerifyResetCodeForm } from '../components/auth/VerifyResetCodeForm';
import { ResetPinForm } from '../components/auth/ResetPinForm';

export const ForgotPasswordPage = ({ showLogin }) => {
    const [step, setStep] = useState('request_code');
    const [isLoading, setIsLoading] = useState(false);
    const [recoveryData, setRecoveryData] = useState({
        phoneNumber: '',
        otpCode: '',
    });

    const handleRequestSubmit = (phoneNumber) => {
        setIsLoading(true);
        requestPinRecoveryOtp(phoneNumber)
            .then(response => {
                const otp = response.data.otpCode;
                // Vistazo aquí: Mostramos el OTP para pruebas
                console.log("--- CÓDIGO DE PRUEBA (OTP RECUPERACIÓN) ---:", otp);
                toast.success(`Código de prueba enviado: ${otp}`);
                
                setRecoveryData({ phoneNumber, otpCode: '' });
                setStep('verify_code');
            })
            .catch(error => {
                toast.error(error.response?.data?.message || 'Error al solicitar el código.');
            })
            .finally(() => setIsLoading(false));
    };
    
    const handleVerifySubmit = (otpCode) => {
        setRecoveryData(prev => ({ ...prev, otpCode }));
        setStep('reset_pin');
    };

    const handleResetSubmit = (newPin) => {
        setIsLoading(true);
        const finalData = { ...recoveryData, newPin };
        
        resetPin(finalData)
            .then(response => {
                toast.success(response.data.message || '¡PIN restablecido con éxito!');
                setTimeout(showLogin, 2000);
            })
            .catch(error => {
                toast.error(error.response?.data?.message || 'No se pudo restablecer el PIN.');
            })
          .finally(() => setIsLoading(false));
    };

    const renderStep = () => {
        switch (step) {
            case 'request_code':
                return <RequestResetCodeForm onSubmit={handleRequestSubmit} isLoading={isLoading} />;
            case 'verify_code':
                return <VerifyResetCodeForm onSubmit={handleVerifySubmit} isLoading={isLoading} />;
            case 'reset_pin':
                return <ResetPinForm onSubmit={handleResetSubmit} isLoading={isLoading} />;
            default:
                return null;
        }
    };

    const titles = {
        request_code: 'Recuperar tu PIN',
        verify_code: 'Verificar tu Identidad',
        reset_pin: 'Crear un Nuevo PIN',
    };

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
            <Toaster position="top-center" />
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">{titles[step]}</h1>
                </div>
                {renderStep()}
                <p className="text-center text-sm text-gray-600 mt-4">
                    ¿Ya recuerdas tu PIN?{' '}
                    <button onClick={showLogin} className="font-medium text-indigo-600 hover:text-indigo-500">
                        Volver a Inicio de Sesión
                    </button>
                </p>
            </div>
        </div>
    );
};

ForgotPasswordPage.propTypes = {
    showLogin: PropTypes.func.isRequired,
};