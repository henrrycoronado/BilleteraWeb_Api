import { LoginForm } from "../components/auth/LoginForm";
import PropTypes from 'prop-types';

export const LoginPage = ({ onLoginSuccess, showWelcome, showForgotPassword }) => {
    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
          <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
            {/* ... El componente LoginForm ahora usa la prop onLoginSuccess */}
            <LoginForm onSuccess={onLoginSuccess} />
            <div className="flex justify-between items-center text-sm">
                <p className="text-gray-600">
                    ¿No tienes una cuenta?{' '}
                    <button onClick={showWelcome} className="font-medium text-indigo-600 hover:text-indigo-500">
                        Regístrate
                    </button>
                </p>
                {/* Enlace actualizado aquí */}
                <button onClick={showForgotPassword} className="font-medium text-indigo-600 hover:text-indigo-500">
                    ¿Olvidaste tu PIN?
                </button>
            </div>
          </div>
        </div>
    );
};

LoginPage.propTypes = {
    onLoginSuccess: PropTypes.func.isRequired,
    showWelcome: PropTypes.func.isRequired,
    showForgotPassword: PropTypes.func.isRequired,
};