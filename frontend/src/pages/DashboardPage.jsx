// src/pages/DashboardPage.jsx
import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Toaster } from 'react-hot-toast';
import { getBalance, getPaymentMethods, getTransactionHistory } from '../api/walletService.js';
import { BalanceDisplay } from '../components/dashboard/BalanceDisplay';
import { AddPaymentMethodForm } from '../components/dashboard/AddPaymentMethodForm';
import { SendMoneyFlow } from '../components/dashboard/SendMoneyFlow';
import { TopUpFlow } from '../components/dashboard/TopUpFlow';
import { TransactionHistory } from '../components/dashboard/TransactionHistory';
import { CreditCard } from 'lucide-react';

const Modal = ({ children, isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};
Modal.propTypes = { children: PropTypes.node, isOpen: PropTypes.bool, onClose: PropTypes.func };

export const DashboardPage = ({ onLogout }) => {
    const [balance, setBalance] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [paymentMethods, setPaymentMethods] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [isHistoryLoading, setIsHistoryLoading] = useState(true);
    const [historyError, setHistoryError] = useState(null);

    const [isAddMethodModalOpen, setIsAddMethodModalOpen] = useState(false);
    const [isSendMoneyModalOpen, setIsSendMoneyModalOpen] = useState(false);
    const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);

    const fetchBalance = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await getBalance();
            setBalance(response.data.balance);
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    const fetchPaymentMethods = useCallback(async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await getPaymentMethods(token);
            setPaymentMethods(response.data.paymentMethods);
        } catch (error) {
            console.error("Error al obtener métodos de pago:", error);
        }
    }, []);

    const fetchHistory = useCallback(async () => {
        setIsHistoryLoading(true);
        setHistoryError(null);
        try {
            const response = await getTransactionHistory();
            setTransactions(response.data.transactions);
        } catch (err) {
            setHistoryError(err);
        } finally {
            setIsHistoryLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBalance();
        fetchPaymentMethods();
        fetchHistory();
    }, [fetchBalance, fetchPaymentMethods, fetchHistory]);
    
    const handleAddMethodSuccess = (newMethod) => {
        setPaymentMethods(prev => [...prev, newMethod]);
        setIsSendMoneyModalOpen(false);
        setIsAddMethodModalOpen(false);
    }
    
    const handleTransferSuccess = (newBalance) => {
        // Actualiza el saldo en el Dashboard inmediatamente
        setBalance(newBalance);
        fetchHistory();
    };
    
    const handleTopUpSuccess = (newBalance) => {
        setBalance(newBalance);
        fetchHistory(); // Refresca el historial tras una recarga
    };

    return (
        <>
            <Toaster position="top-center" />
            <div className="bg-gray-50 min-h-screen">
                <header className="bg-white shadow-sm p-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-indigo-600">Mi Billetera</h1>
                    <button onClick={onLogout} className="text-sm font-medium text-gray-600 hover:text-indigo-600">
                        Cerrar Sesión
                    </button>
                </header>

                <main className="p-6">
                    <div className="w-full max-w-lg mx-auto p-8 space-y-8 bg-white rounded-xl shadow-md">
                        <BalanceDisplay
                            isLoading={isLoading}
                            error={error}
                            balance={balance}
                            onRetry={fetchBalance}
                        />
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <button onClick={() => setIsSendMoneyModalOpen(true)} className="py-3 px-4 text-white font-bold bg-indigo-600 rounded-lg hover:bg-indigo-700">
                                Enviar Dinero
                            </button>
                            <button onClick={() => setIsTopUpModalOpen(true)} className="py-3 px-4 text-indigo-700 font-bold bg-indigo-100 rounded-lg hover:bg-indigo-200">
                                Recargar Saldo
                            </button>
                        </div>
                    </div>

                    <TransactionHistory 
                        isLoading={isHistoryLoading}
                        error={historyError}
                        transactions={transactions}
                        onRetry={fetchHistory}
                    />

                    {/* Nueva sección para mostrar métodos de pago */}
                    <div className="w-full max-w-lg mx-auto mt-8 p-6 bg-white rounded-xl shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold">Métodos de Pago</h2>
                            <button onClick={() => setIsAddMethodModalOpen(true)} className="text-sm font-medium text-indigo-600 hover:underline">
                                + Añadir Nuevo
                            </button>
                        </div>
                        <ul className="space-y-3">
                            {paymentMethods.map(method => (
                                <li key={method.id} className="flex items-center p-3 bg-gray-50 rounded-md">
                                    <CreditCard className="h-6 w-6 text-gray-500 mr-4" />
                                    <span className="flex-1 font-mono text-gray-700">{method.type} •••• {method.last4}</span>
                                    {method.isDefault && <span className="text-xs text-green-600 font-bold">Default</span>}
                                </li>
                            ))}
                             {paymentMethods.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No tienes métodos de pago guardados.</p>}
                        </ul>
                    </div>
                </main>
            </div>

            {/* Modal para Añadir Método de Pago */}
            <Modal isOpen={isAddMethodModalOpen} onClose={() => setIsAddMethodModalOpen(false)}>
                <AddPaymentMethodForm 
                    onSuccess={handleAddMethodSuccess} 
                    onCancel={() => setIsAddMethodModalOpen(false)} 
                />
            </Modal>
            
            {/* Modal para Enviar Dinero */}
            <Modal isOpen={isSendMoneyModalOpen} onClose={() => setIsSendMoneyModalOpen(false)}>
                <SendMoneyFlow 
                    currentBalance={balance}
                    onTransferSuccess={handleTransferSuccess}
                    onCancel={() => setIsSendMoneyModalOpen(false)}
                />
            </Modal>
            <Modal isOpen={isTopUpModalOpen} onClose={() => setIsTopUpModalOpen(false)}>
                <TopUpFlow 
                    paymentMethods={paymentMethods} 
                    currentBalance={balance} 
                    onSuccess={handleTopUpSuccess} 
                    onCancel={() => setIsTopUpModalOpen(false)} />
            </Modal>
        </>
    );
};

DashboardPage.propTypes = {
    onLogout: PropTypes.func.isRequired,
};