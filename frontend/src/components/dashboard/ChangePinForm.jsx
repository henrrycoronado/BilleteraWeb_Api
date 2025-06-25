// src/components/dashboard/ChangePinForm.jsx
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { changePin } from '../../api/authService';
import { LockKeyhole } from 'lucide-react';

export const ChangePinForm = () => {
    const [pins, setPins] = useState({
        currentPin: '',
        newPin: '',
        confirmNewPin: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPins(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (pins.newPin !== pins.confirmNewPin) {
            toast.error('El nuevo PIN y su confirmación no coinciden.');
            return;
        }

        if (pins.newPin.length !== 6) {
            toast.error('El nuevo PIN debe tener 6 dígitos.');
            return;
        }

        setIsLoading(true);
        toast.dismiss();

        changePin(pins.currentPin, pins.newPin)
            .then(response => {
                toast.success(response.data.message || '¡PIN actualizado con éxito!');
                // Limpiamos los campos del formulario tras el éxito
                setPins({ currentPin: '', newPin: '', confirmNewPin: '' });
            })
            .catch(error => {
                toast.error(error.response?.data?.message || 'No se pudo cambiar el PIN.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="currentPin" className="text-sm font-medium text-gray-700">PIN Actual</label>
                <input id="currentPin" name="currentPin" type="password" maxLength="6" required value={pins.currentPin} onChange={handleChange}
                    className="w-full px-3 py-2 mt-1 border rounded-md"
                />
            </div>
            <div>
                <label htmlFor="newPin" className="text-sm font-medium text-gray-700">Nuevo PIN (6 dígitos)</label>
                <input id="newPin" name="newPin" type="password" maxLength="6" required value={pins.newPin} onChange={handleChange}
                    className="w-full px-3 py-2 mt-1 border rounded-md"
                />
            </div>
             <div>
                <label htmlFor="confirmNewPin" className="text-sm font-medium text-gray-700">Confirmar Nuevo PIN</label>
                <input id="confirmNewPin" name="confirmNewPin" type="password" maxLength="6" required value={pins.confirmNewPin} onChange={handleChange}
                    className="w-full px-3 py-2 mt-1 border rounded-md"
                />
            </div>
            <div className="pt-2">
                <button type="submit" disabled={isLoading} className="w-full py-2 px-4 flex justify-center items-center gap-2 text-white bg-slate-700 rounded-md hover:bg-slate-800 disabled:bg-slate-400">
                    <LockKeyhole size={16} />
                    {isLoading ? 'Actualizando...' : 'Actualizar mi PIN'}
                </button>
            </div>
        </form>
    );
};