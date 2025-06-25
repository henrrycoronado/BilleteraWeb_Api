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
