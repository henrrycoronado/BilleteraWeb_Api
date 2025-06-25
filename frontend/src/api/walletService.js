
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

// --- Flujo de Saldo (CU-11) ---
export const getBalance = async () => {
  console.log(`API Sim: Obteniendo saldo.`);
  // Aquí ya no necesitamos el token como parámetro porque asumimos que la sesión se maneja por cookies.
  if (Math.random() < 0.2) {
    console.error("API Sim: Error de red simulado.");
    return simulateApiCall({ error_code: 'NETWORK_ERROR' }, false, 1500);
  }
  const randomBalance = Math.random() * 5000;
  return simulateApiCall({ balance: randomBalance }, true, 1200);
};

// --- Flujo de Métodos de Pago (CU-15) ---
const MOCK_PAYMENT_METHODS = [
    { id: 1, type: 'Visa', last4: '4242', isDefault: true },
];

export const getPaymentMethods = async () => {
    return simulateApiCall({ paymentMethods: MOCK_PAYMENT_METHODS });
};

export const addPaymentMethod = async (paymentMethodToken) => {
    if (paymentMethodToken === 'token_datos_invalidos') {
        return simulateApiCall({ error_code: 'INVALID_DATA' }, false);
    }
    if (paymentMethodToken === 'token_rechazado_banco') {
        return simulateApiCall({ error_code: 'PROVIDER_REJECTED' }, false);
    }
    if (MOCK_PAYMENT_METHODS.length >= 3) {
        return simulateApiCall({ error_code: 'METHOD_LIMIT_REACHED' }, false);
    }
    const newMethod = { id: Date.now(), type: 'MasterCard', last4: '5555', isDefault: false };
    MOCK_PAYMENT_METHODS.push(newMethod);
    return simulateApiCall({ newMethod });
};

// src/api/walletService.js

// ... (mantener las funciones existentes y la utilidad simulateApiCall)

// --- Lógica para Simular Enviar Dinero (CU-12) ---

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

/**
 * Simula la ejecución de la transferencia.
 */
export const executeTransfer = async (recipientPhone, amount, currentBalance) => {
    // Precondición: El cliente debe tener saldo suficiente (Flujo Alternativo A2)
    if (amount > currentBalance) {
        return simulateApiCall({ error_code: 'INSUFFICIENT_FUNDS' }, false);
    }
    // Regla de Negocio RB1: Monto mínimo
    if (amount < 1) {
        return simulateApiCall({ error_code: 'INVALID_AMOUNT' }, false);
    }
    
    // Postcondición Exitosa
    const transactionId = 'TXN-' + Date.now();
    console.log(`API Sim: Transferencia de ${amount} a ${recipientPhone} completada. ID: ${transactionId}`);
    const newBalance = currentBalance - amount;
    return simulateApiCall({ success: true, transactionId, newBalance });
};

// src/api/walletService.js

// ... (mantener funciones existentes y la utilidad simulateApiCall)

// --- Lógica para Simular Historial de Transacciones (CU-16) ---

const MOCK_TRANSACTIONS = [
    { id: 'txn_1', type: 'received', amount: 50.00, description: 'Recarga de Saldo', date: '2025-06-24T14:48:00.000Z' },
    { id: 'txn_2', type: 'sent', amount: 15.50, description: 'Envío a Maria Vargas', date: '2025-06-23T10:20:00.000Z' },
    { id: 'txn_3', type: 'sent', amount: 5.00, description: 'Pago en Tienda ABC', date: '2025-06-22T18:05:00.000Z' },
    { id: 'txn_4', type: 'received', amount: 100.00, description: 'Recibido de Juan Perez', date: '2025-06-21T09:00:00.000Z' },
];

export const getTransactionHistory = async () => {
    console.log("API Sim: Obteniendo historial de transacciones.");

    const randomState = Math.random();
    // Flujo Alternativo A2: Simular error de conexión
    if (randomState < 0.1) { // 10% de probabilidad de error
        return simulateApiCall({ error_code: 'NETWORK_ERROR' }, false);
    }
    // Flujo Alternativo A1: Simular que no hay transacciones
    if (randomState < 0.2) { // 10% de probabilidad de no tener transacciones
        return simulateApiCall({ transactions: [] });
    }
    // Flujo Principal Exitoso
    return simulateApiCall({ transactions: MOCK_TRANSACTIONS });
};

/**
 * Simula la ejecución de una recarga de saldo.
 */
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