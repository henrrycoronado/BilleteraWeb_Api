// src/pages/RegistrationPage.jsx
import { useState } from 'react';
import { UserInfoForm } from '../components/auth/UserInfoForm';
import { OtpVerificationForm } from '../components/auth/OtpVerificationForm';
import { LivenessCheck } from '../components/auth/LivenessCheck';
import { CreatePinForm } from '../components/auth/CreatePinForm';
import { DashboardPage } from './DashboardPage';

export const RegistrationPage = () => {
  const [step, setStep] = useState('USER_INFO');
  const [userData, setUserData] = useState({ phone: '' });

  const handleUserInfoSuccess = (data) => {
    setUserData(data);
    setStep('VERIFY_OTP');
  };

  const handleOtpSuccess = () => {
    setStep('LIVENESS_CHECK');
  };

  const handleLivenessSuccess = () => {
    setStep('CREATE_PIN');
  };
  
  const handleRegistrationComplete = (token) => {
    console.log("Registro completado. Token de sesión:", token);
    localStorage.setItem('authToken', token);
    setStep('COMPLETED');
  }

  const renderStep = () => {
    switch (step) {
      case 'USER_INFO':
        return <UserInfoForm onSuccess={handleUserInfoSuccess} />;
      case 'VERIFY_OTP':
        return <OtpVerificationForm phone={userData.phone} onSuccess={handleOtpSuccess} />;
      case 'LIVENESS_CHECK':
        return <LivenessCheck phone={userData.phone} onSuccess={handleLivenessSuccess} />;
      case 'CREATE_PIN':
        return <CreatePinForm phone={userData.phone} onSuccess={handleRegistrationComplete} />;
      case 'COMPLETED':
        return <DashboardPage />;
      default:
        return <UserInfoForm onSuccess={handleUserInfoSuccess} />;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        {renderStep()}
      </div>
    </div>
  );
};