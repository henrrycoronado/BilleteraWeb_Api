
import { useState } from 'react';
import PropTypes from 'prop-types';
import { toast, Toaster } from 'react-hot-toast';

import { UserInfoForm } from '../components/auth/UserInfoForm';
import { OtpVerificationForm } from '../components/auth/OtpVerificationForm';
import { LivenessCheck } from '../components/auth/LivenessCheck';
import { CreatePinForm } from '../components/auth/CreatePinForm';

import { AuthServices } from '../api/authService.js';


export const RegistrationPage = ({ showLogin }) => {
    const [step, setStep] = useState('USER_INFO');
    const [isLoading, setIsLoading] = useState(false);
    const [registrationData, setRegistrationData] = useState({
        fullName: '',
        phoneNumber: '',
        email: '',
        otpCode: '',
    });
    const handleInfoSubmit = (userInfo) => {
        setIsLoading(true);
        setRegistrationData(prev => ({ ...prev, ...userInfo }));
        AuthServices.requestOtp({phoneNumber: userInfo.phoneNumber, email: userInfo.email})
            .then(response => {
                console.log("OTP devuelto por el backend para simulación:", response.data.otpCode);
                toast.success('Te hemos enviado un código de verificación.');
                setStep('VERIFY_OTP');
            })
            .catch(error => {
                toast.error(error.response?.data?.message || 'No se pudo enviar el código.');
            })
            .finally(() => setIsLoading(false));
    };

    const handleOtpSubmit = (otp) => {
        setRegistrationData(prev => ({ ...prev, otpCode: otp }));
        setStep('LIVENESS_CHECK');
    };
    const handleLivenessSuccess = () => {
        setStep('CREATE_PIN');
    };
    const handlePinSubmit = (pinI) => {
        setIsLoading(true);
        const finalData = {
            fullName: registrationData.fullName,
            phoneNumber: registrationData.phoneNumber,
            email: registrationData.email,
            otpCode: registrationData.otpCode,
            pin: pinI
        }
        console.log(finalData);
        AuthServices.registerUser(finalData)
            .then(response => {
                toast.success(response.data.message || '¡Registro exitoso!');
                setTimeout(showLogin, 2000); 
            })
            .catch(error => {
                console.log(error);
                toast.error(error.response?.data?.message || 'El registro falló.');
            })
            .finally(() => setIsLoading(false));
    };

    const renderStep = () => {
        switch (step) {
            case 'USER_INFO':
                return <UserInfoForm onSubmit={handleInfoSubmit} onSwitchToLogin={showLogin} isLoading={isLoading}/>;
            case 'VERIFY_OTP':
                return <OtpVerificationForm onSubmit={handleOtpSubmit} isLoading={isLoading} phoneNumberI={registrationData.phoneNumber}/>;
            case 'LIVENESS_CHECK':
                return <LivenessCheck onSuccess={handleLivenessSuccess} />;
            case 'CREATE_PIN':
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