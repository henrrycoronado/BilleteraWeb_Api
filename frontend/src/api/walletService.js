import apiClient from './apiClient.js';


const simulateApiCall = (data, success = true, delay = 1000) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (success) {
        resolve({ success: true, message: "Operación exitosa", data });
      } else {
        reject({ success: false, message: "Ocurrió un error", data });
      }
    }, delay);
  });
};

export const getBalance = () => {
  // El token se añade automáticamente por el interceptor de apiClient.
  return apiClient.get('/user/balance');
};

// --- Flujo de Métodos de Pago (CU-15) ---
export const getPaymentMethods = () => {
    // El token se añade automáticamente por el interceptor.
    return apiClient.get('/payment');
};

export const addPaymentMethod = (methodData) => {
    // methodData debe ser un objeto con: Type, Provider, Token, MaskedIdentifier
    return apiClient.post('/payment', methodData);
};

export const reloadWallet = (topUpData) => {
    // topUpData debe ser un objeto con: paymentMethodId, amount
    return apiClient.post('/payment/reload', topUpData);
};

export const sendMoney = (transferData) => {
    // transferData debe contener: recipientPhoneNumber, amount, description
    return apiClient.post('/user/send-money', transferData);
};

export const getTransactionHistory = () => {
    return apiClient.get('/user/history');
};

const MOCK_RECIPIENTS = {
    '87654321': { name: 'Maria Vargas', isVerified: true },
    '55555555': { name: 'Juan Perez', isVerified: true },
};

/**
 * Simula la validación de un destinatario.
 */
export const validateRecipient = async (phone) => {
    // Flujo Alternativo A1: Usuario no encontrado
    if (!MOCK_RECIPIENTS[phone]) {
        return simulateApiCall({ error_code: 'USER_NOT_FOUND' }, false);
    }
    // Precondición: El destinatario debe estar registrado
    return simulateApiCall({ recipient: MOCK_RECIPIENTS[phone] });
};


export const executeTopUp = async (paymentMethodId, amount, currentBalance) => {
    console.log(`API Sim: Intentando recargar ${amount} desde el método ${paymentMethodId}`);

    // Simular un rechazo del banco para una tarjeta específica
    if (paymentMethodId === 1 && amount > 1000) {
        return simulateApiCall({ error_code: 'PROVIDER_REJECTED', message: 'Fondos insuficientes en la tarjeta.' }, false);
    }
    
    // Simulación Exitosa
    const newBalance = currentBalance + amount;
    console.log(`API Sim: Recarga exitosa. Nuevo saldo: ${newBalance}`);
    return simulateApiCall({ success: true, newBalance: newBalance });
};