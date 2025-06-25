// src/pages/DashboardPage.jsx
import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Toaster, toast } from 'react-hot-toast';
import { getBalance, getPaymentMethods, getTransactionHistory } from '../api/walletService.js';
import { BalanceDisplay } from '../components/dashboard/BalanceDisplay';
import { AddPaymentMethodForm } from '../components/dashboard/AddPaymentMethodForm';
import { SendMoneyFlow } from '../components/dashboard/SendMoneyFlow';
import { TopUpFlow } from '../components/dashboard/TopUpFlow';
import { TransactionHistory } from '../components/dashboard/TransactionHistory';
import { CreditCard } from 'lucide-react';
import { ChangePinForm } from '../components/dashboard/ChangePinForm'; // <-- 1. Importar nuevo componente


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

const paymentMethodTypeMap = {
    0: 'Tarjeta de Crédito',
    1: 'Tarjeta de Débito',
    2: 'Cuenta Bancaria',
};

export const DashboardPage = ({ onLogout }) => {
    const [balance, setBalance] = useState(null);
    const [isLoading, setIsBalanceLoading] = useState(true);
    const [currentWallet, setCurrentWallet] = useState(null);
    const [error, setBalanceError] = useState(null);

    const [paymentMethods, setPaymentMethods] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [isHistoryLoading, setIsHistoryLoading] = useState(true);
    const [historyError, setHistoryError] = useState(null);

    const [isAddMethodModalOpen, setIsAddMethodModalOpen] = useState(false);
    const [isSendMoneyModalOpen, setIsSendMoneyModalOpen] = useState(false);
    const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);

    
    const fetchBalance = useCallback(async () => {
        setIsBalanceLoading(true);
        setBalanceError(null);
        getBalance()
            .then(response => {
                // Vistazo aquí: 2. Guardamos tanto el saldo como el objeto completo de la billetera
                setBalance(response.data.balance);
                setCurrentWallet(response.data); // Asumimos que la respuesta es el walletDto
            })
            .catch(err => {
                setBalanceError(err);
                toast.error("No se pudo obtener el saldo.");
            })
            .finally(() => setIsBalanceLoading(false));
    }, []);
    
    const fetchPaymentMethods = useCallback(async () => {
        getPaymentMethods()
            .then(response => {
                // La respuesta de axios contiene los datos en response.data
                // Asumimos que el backend devuelve directamente el array de métodos
                setPaymentMethods(response.data);
            })
            .catch(error => {
                console.error("Error al obtener métodos de pago:", error);
                toast.error("No se pudieron cargar tus métodos de pago.");
            });
    }, []);

    const fetchHistory = useCallback(async () => {
        setIsHistoryLoading(true);
        setHistoryError(null);
        getTransactionHistory()
            .then(response => {
                // Asumimos que el backend devuelve directamente el array de transacciones
                setTransactions(response.data);
            })
            .catch(err => {
                setHistoryError(err);
                toast.error("No se pudo cargar el historial.");
            })
            .finally(() => setIsHistoryLoading(false));
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
    
    const handleTransferSuccess = () => {
        // Actualiza el saldo en el Dashboard inmediatamente
        fetchBalance();
        fetchHistory();
    };
    
    const handleTopUpSuccess = () => {
        fetchBalance(); // Refresca el saldo tras una recarga
        fetchHistory(); // Refresca el historial tras una recarga
        setIsTopUpModalOpen(false); // Cierra el modal
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
                        currentWallet={currentWallet}
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
                            {paymentMethods.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No tienes métodos de pago guardados.</p>}
                            {paymentMethods.map(method => (
                                <li key={method.id} className="flex items-center p-3 bg-gray-50 rounded-md">
                                    <CreditCard className="h-6 w-6 text-gray-500 mr-4" />
                                    {/* Vistazo aquí: Usamos el map para mostrar el nombre del tipo */}
                                    <span className="flex-1 font-mono text-sm">
                                        {paymentMethodTypeMap[method.type] || 'Método'} •••• {method.maskedIdentifier || method.last4}
                                    </span>
                                    {method.isDefault && <span className="text-xs text-green-600 font-bold">Default</span>}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="w-full max-w-lg mx-auto mt-8 p-6 bg-white rounded-xl shadow-md">
                        <h2 className="text-lg font-bold mb-4">Seguridad</h2>
                        <ChangePinForm />
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
                    onSuccess={handleTopUpSuccess}
                    onCancel={() => setIsTopUpModalOpen(false)}
                />
            </Modal>
        </>
    );
};

DashboardPage.propTypes = {
    onLogout: PropTypes.func.isRequired,
};