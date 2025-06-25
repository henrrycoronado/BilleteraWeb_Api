import { useState } from 'react';
import PropTypes from 'prop-types';
import { Eye, EyeOff } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const BalanceSkeleton = () => (
    <div className="animate-pulse flex flex-col items-center">
        <div className="h-4 bg-slate-200 rounded w-24 mb-4"></div>
        <div className="h-10 bg-slate-300 rounded w-48"></div>
    </div>
);

export const BalanceDisplay = ({ isLoading, error, balance, onRetry }) => {
    const [isVisible, setIsVisible] = useState(true);

    if (isLoading) {
        return <BalanceSkeleton />;
    }

    if (error) {
        return (
            <div className="text-center">
                <p className="text-red-600 mb-4">No se pudo obtener el saldo. </p>
                <button onClick={onRetry} className="py-2 px-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                    Reintentar
                </button>
            </div>
        );
    }
    
    return (
        <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">Tu Saldo</p>
            <div className="flex items-center justify-center space-x-4">
                <p className="text-4xl font-bold text-gray-800">
                    {isVisible ? formatCurrency(balance) : 'Bs. ••••••••'}
                </p>
                <button onClick={() => setIsVisible(!isVisible)} className="text-gray-500 hover:text-gray-800">
                    {isVisible ? <Eye size={28} /> : <EyeOff size={28} />}
                </button>
            </div>
        </div>
    );
};

BalanceDisplay.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    error: PropTypes.object,
    balance: PropTypes.number,
    onRetry: PropTypes.func.isRequired,
};