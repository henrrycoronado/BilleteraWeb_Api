
import { useState } from 'react';
import PropTypes from 'prop-types';
import { toast, Toaster } from 'react-hot-toast';

import { UserInfoForm } from '../components/auth/UserInfoForm';
import { OtpVerificationForm } from '../components/auth/OtpVerificationForm';
import { LivenessCheck } from '../components/auth/LivenessCheck';
import { CreatePinForm } from '../components/auth/CreatePinForm';

import { requestOtp, registerUser } from '../api/authService.js';


export const RegistrationPage = ({ showLogin }) => {
    const [step, setStep] = useState('USER_INFO');
    const [isLoading, setIsLoading] = useState(false);

    // Este estado acumulará todos los datos del registro
    const [registrationData, setRegistrationData] = useState({
        fullName: '',
        phoneNumber: '',
        email: '',
        otpCode: '',
        pin: ''
    });

    // Se ejecuta al enviar el primer formulario (UserInfoForm)
    const handleInfoSubmit = (userInfo) => {
        setIsLoading(true);
        // Guardamos los datos del usuario en nuestro estado acumulativo
        setRegistrationData(prev => ({ ...prev, ...userInfo }));

        requestOtp(userInfo.phoneNumber)
            .then(response => {
                // Aquí podríamos usar el OTP real que devuelve el backend para pruebas
                console.log("OTP devuelto por el backend para simulación:", response.data.otpCode);
                toast.success('Te hemos enviado un código de verificación.');
                setStep('VERIFY_OTP');
            })
            .catch(error => {
                toast.error(error.response?.data?.message || 'No se pudo enviar el código.');
            })
            .finally(() => setIsLoading(false));
    };

    // Se ejecuta al enviar el OTP
    const handleOtpSubmit = (otp) => {
        // Ya no llamamos a una API. Solo guardamos el OTP y avanzamos.
        setRegistrationData(prev => ({ ...prev, otpCode: otp }));
        setStep('LIVENESS_CHECK');
    };

    // La simulación de Liveness solo nos hace avanzar al siguiente paso
    const handleLivenessSuccess = () => {
        setStep('CREATE_PIN');
    };

    // Se ejecuta al crear el PIN (el paso final)
    const handlePinSubmit = (pin) => {
        setIsLoading(true);
        
        // Creamos el objeto final con todos los datos recolectados
        const finalData = { ...registrationData, pin };

        registerUser(finalData)
            .then(response => {
                toast.success(response.data.message || '¡Registro exitoso!');
                // Llevamos al usuario a la pantalla de login para que inicie sesión
                setTimeout(showLogin, 2000); 
            })
            .catch(error => {
                toast.error(error.response?.data?.message || 'El registro falló.');
                // En caso de error, podríamos reiniciar el flujo
                // setStep('USER_INFO');
            })
            .finally(() => setIsLoading(false));
    };

    const renderStep = () => {
        switch (step) {
            case 'USER_INFO':
                return <UserInfoForm onSubmit={handleInfoSubmit} onSwitchToLogin={showLogin} isLoading={isLoading} />;
            case 'VERIFY_OTP':
                // Ahora solo necesita pasar el OTP hacia arriba
                return <OtpVerificationForm onSubmit={handleOtpSubmit} isLoading={isLoading} />;
            case 'LIVENESS_CHECK':
                return <LivenessCheck onSuccess={handleLivenessSuccess} />;
            case 'CREATE_PIN':
                // El último paso que gatilla la llamada final
                return <CreatePinForm onSubmit={handlePinSubmit} isLoading={isLoading} />;
            default:
                return <UserInfoForm onSubmit={handleInfoSubmit} onSwitchToLogin={showLogin} isLoading={isLoading} />;
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
            <Toaster position="top-center" />
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                {renderStep()}
            </div>
        </div>
    );
};

RegistrationPage.propTypes = {
    showLogin: PropTypes.func.isRequired,
};