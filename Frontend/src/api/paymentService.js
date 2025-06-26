import apiClient from './apiClient.js';

export const PaymentServices = {
    getPaymentMethods: () => {
      return apiClient.get('/payment');
    },
    addPaymentMethod: (input) => {
        const requestData = {
            Type: input.Type,
            Provider: input.Provider,
            Token: input.Token,
            MaskedIdentifier: input.MaskedIdentifier
        };
        return apiClient.post('/payment', requestData);
    },
    reloadWallet: (input) => {
        const requestData = {
            paymentMethodId: input.paymentMethodId,
            amount: input.amount
        };
        return apiClient.post('/payment/reload', requestData);
    }
};


