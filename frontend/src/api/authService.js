import apiClient from "./apiClient.js";
// --- Utilidad de Simulación ---
// La copiamos aquí porque todas las funciones de auth la usan.
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

export const registerUser = (registrationData) => {
  // registrationData debe contener: fullName, phoneNumber, email, pin, otpCode
  return apiClient.post('/auth/register', registrationData);
};

export const login = (phoneNumber, pin) => {
  // El cuerpo del post debe coincidir con el DTO del backend.
  const loginData = {
    phoneNumber: phoneNumber,
    pin: pin,
  };
  // Devolvemos la promesa de axios. El componente que la llame se encargará
  // del .then() y .catch()
  return apiClient.post('/auth/login', loginData);
};

// --- Flujo de Registro (CU-01) ---
export const requestOtp = (phoneNumber) => {
  // El cuerpo del post debe coincidir con el DTO del backend.
  return apiClient.post('/auth/request-otp', { phoneNumber });
};

export const verifyLiveness = async (phone) => {
    console.log(`API Sim: Realizando liveness check para ${phone}`);
    const isSuccess = Math.random() > 0.3;
    if (!isSuccess) {
        return simulateApiCall({ error_code: "LIVENESS_FAILED" }, false);
    }
    return simulateApiCall({ liveness_verified: true, next_step: "create_pin" });
}

export const requestPinRecoveryOtp = (phoneNumber) => {
  return apiClient.post('/auth/forgot-pin/request-otp', { phoneNumber });
};

export const resetPin = (resetData) => {
  // resetData debe contener: phoneNumber, otpCode, newPin
  return apiClient.post('/auth/forgot-pin/reset', resetData);
};

export const changePin = (currentPin, newPin) => {
  // El cuerpo del PUT debe coincidir con el DTO del backend
  const pinData = { currentPin, newPin };
  return apiClient.put('/user/change-pin', pinData);
};