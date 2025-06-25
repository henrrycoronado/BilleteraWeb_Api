// src/api/authService.js

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

// --- Flujo de Registro (CU-01) ---
export const requestOtp = async (userData) => {
  console.log("API Sim: Validando datos y solicitando OTP para", userData.phone);
  if (!/^\d{8,}$/.test(userData.phone)) {
    return simulateApiCall({ error_code: "INVALID_PHONE" }, false);
  }
  return simulateApiCall({ otp_sent: true, next_step: "verify_otp" });
};

export const verifyOtp = async (phone, otp) => {
  console.log(`API Sim: Validando OTP ${otp} para el número ${phone}`);
  if (otp !== "123456") {
    return simulateApiCall({ error_code: "INVALID_OTP" }, false);
  }
  return simulateApiCall({ otp_verified: true, next_step: "liveness_check" });
};

export const verifyLiveness = async (phone) => {
    console.log(`API Sim: Realizando liveness check para ${phone}`);
    const isSuccess = Math.random() > 0.3;
    if (!isSuccess) {
        return simulateApiCall({ error_code: "LIVENESS_FAILED" }, false);
    }
    return simulateApiCall({ liveness_verified: true, next_step: "create_pin" });
}

export const completeRegistration = async (phone, pin) => {
  console.log(`API Sim: Creando cuenta para ${phone} con el PIN.`);
  if (pin === "123456" || pin === "000000") {
      return simulateApiCall({ error_code: "PIN_NOT_SECURE" }, false);
  }
  const mockToken = "fake-jwt-token-" + Math.random().toString(36).substring(2);
  return simulateApiCall({ registration_complete: true, token: mockToken });
};

// --- Flujo de Login (CU-03) ---
const MOCK_USER = {
  phone: '12345678',
  pin: '1234', 
};
let failedLoginAttempts = 0;
let isLocked = false;
let unlockTimeout = null;

export const login = async (phone, pin) => {
  console.log(`API Sim: Intento de login para ${phone}`);
  if (isLocked) {
    return simulateApiCall({ error_code: "ACCOUNT_LOCKED" }, false, 200);
  }
  if (phone === MOCK_USER.phone && pin === MOCK_USER.pin) {
    failedLoginAttempts = 0; 
    const mockToken = "fake-jwt-token-for-login-" + Math.random().toString(36).substring(2);
    return simulateApiCall({ login_complete: true, token: mockToken });
  } else {
    failedLoginAttempts++;
    if (failedLoginAttempts >= 5) {
      isLocked = true;
      unlockTimeout = setTimeout(() => { isLocked = false; failedLoginAttempts = 0; }, 15 * 1000); 
      return simulateApiCall({ error_code: "ACCOUNT_LOCKED" }, false, 200);
    }
    return simulateApiCall({ error_code: "INVALID_CREDENTIALS" }, false);
  }
};

// --- Flujo de Recuperación de PIN (CU-05) ---
export const requestPasswordReset = async (phone) => {
  console.log(`API Sim: Solicitud de reseteo para ${phone}`);
  if (phone !== MOCK_USER.phone) {
    console.log("API Sim: Número no encontrado, pero respondemos con éxito por seguridad.");
  }
  return simulateApiCall({ code_sent: true });
};

export const verifyResetCode = async (phone, code) => {
  console.log(`API Sim: Verificando código de reseteo ${code} para ${phone}`);
  if (code !== '654321') {
    return simulateApiCall({ error_code: 'INVALID_RESET_CODE' }, false);
  }
  return simulateApiCall({ code_verified: true });
};

export const updatePin = async (phone, newPin) => {
    console.log(`API Sim: Actualizando PIN para ${phone}`);
    if (newPin.length !== 6 || newPin === '123123' || newPin === '000000') {
        return simulateApiCall({ error_code: 'PIN_NOT_SECURE' }, false);
    }
    MOCK_USER.pin = newPin;
    console.log(`API Sim: El nuevo PIN para ${MOCK_USER.phone} es ahora ${MOCK_USER.pin}`);
    return simulateApiCall({ pin_updated: true });
};