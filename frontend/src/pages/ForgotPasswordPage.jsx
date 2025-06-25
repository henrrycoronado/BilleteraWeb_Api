import { useState } from 'react';
import PropTypes from 'prop-types';
import { Toaster } from 'react-hot-toast';
import { RequestResetCodeForm } from '../components/auth/RequestResetCodeForm';
import { VerifyResetCodeForm } from '../components/auth/VerifyResetCodeForm';
import { ResetPinForm } from '../components/auth/ResetPinForm';

export const ForgotPasswordPage = ({ showLogin }) => {
    const [step, setStep] = useState('request_code'); // request_code, verify_code, reset_pin
    const [phone, setPhone] = useState('');

    const handleCodeRequestSuccess = (phoneNumber) => {
        setPhone(phoneNumber);
        setStep('verify_code');
    };
    
    const handleCodeVerifySuccess = () => {
        setStep('reset_pin');
    };

    const renderStep = () => {
        switch (step) {
            case 'request_code':
                return <RequestResetCodeForm onSuccess={handleCodeRequestSuccess} />;
            case 'verify_code':
                return <VerifyResetCodeForm phone={phone} onSuccess={handleCodeVerifySuccess} />;
            case 'reset_pin':
                return <ResetPinForm phone={phone} onSuccess={showLogin} />; // Al éxito, vuelve a login
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
                <p className="text-center text-sm text-gray-600">
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