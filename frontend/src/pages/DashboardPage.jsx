import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { getBalance } from '../api/authService';
import { BalanceDisplay } from '../components/dashboard/BalanceDisplay';

export const DashboardPage = ({ onLogout }) => {
    const [balance, setBalance] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBalance = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('authToken');
            const response = await getBalance(token);
            setBalance(response.data.balance);
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBalance();
    }, [fetchBalance]);

    return (
        <div className="bg-gray-50 min-h-screen">
            <header className="bg-white shadow-sm p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-indigo-600">Mi Billetera</h1>
                <button onClick={onLogout} className="text-sm font-medium text-gray-600 hover:text-indigo-600">
                    Cerrar Sesión
                </button>
            </header>

            <main className="p-6">
                <div className="w-full max-w-lg mx-auto p-8 space-y-8 bg-white rounded-xl shadow-md">
                    {/* Aquí integramos nuestro nuevo componente */}
                    <BalanceDisplay
                        isLoading={isLoading}
                        error={error}
                        balance={balance}
                        onRetry={fetchBalance}
                    />

                    {/* Acciones principales de la billetera */}
                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <button className="py-3 px-4 text-white font-bold bg-indigo-600 rounded-lg hover:bg-indigo-700">
                            Enviar Dinero
                        </button>
                        <button className="py-3 px-4 text-indigo-700 font-bold bg-indigo-100 rounded-lg hover:bg-indigo-200">
                            Recargar Saldo
                        </button>
                    </div>
                </div>
                
                {/* Aquí iría el historial de transacciones (próximo paso) */}

            </main>
        </div>
    );
};

DashboardPage.propTypes = {
    onLogout: PropTypes.func.isRequired,
};