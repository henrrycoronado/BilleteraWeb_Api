
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


const MOCK_USER = {
  phone: '12345678',
  pin: '1234', 
};

let failedLoginAttempts = 0;
let isLocked = false;
let unlockTimeout = null;

/**
 * CU-03: Inicio de Sesión
 * Simula la autenticación del usuario.
 */
export const login = async (phone, pin) => {
  console.log(`API Sim: Intento de login para ${phone}`);

  if (isLocked) {
    console.log("API Sim: Cuenta bloqueada");
    return simulateApiCall({ error_code: "ACCOUNT_LOCKED" }, false, 200);
  }

  if (phone === MOCK_USER.phone && pin === MOCK_USER.pin) {
    failedLoginAttempts = 0; 
    const mockToken = "fake-jwt-token-for-login-" + Math.random().toString(36).substring(2);
    return simulateApiCall({ login_complete: true, token: mockToken });
  } else {
    failedLoginAttempts++;
    console.log(`API Sim: Intento fallido #${failedLoginAttempts}`);
    
    if (failedLoginAttempts >= 5) {
      isLocked = true;
      console.log("API Sim: La cuenta ahora está bloqueada por 15 minutos (simulado)");
      unlockTimeout = setTimeout(() => {
        isLocked = false;
        failedLoginAttempts = 0;
        console.log("API Sim: La cuenta ha sido desbloqueada.");
      }, 15 * 1000); 
      return simulateApiCall({ error_code: "ACCOUNT_LOCKED" }, false, 200);
    }
    
    return simulateApiCall({ error_code: "INVALID_CREDENTIALS" }, false);
  }
};

/**
 * CU-05: Paso 3 - Solicita el envío de un código de recuperación
 */
export const requestPasswordReset = async (phone) => {
  console.log(`API Sim: Solicitud de reseteo para ${phone}`);
  // En la vida real, se verifica que el usuario exista.
  if (phone !== MOCK_USER.phone) {
    // Simulamos que no damos error para no revelar si un número está registrado o no
    console.log("API Sim: Número no encontrado, pero respondemos con éxito por seguridad.");
  }
  return simulateApiCall({ code_sent: true });
};

/**
 * CU-05: Paso 5 - Valida el código de recuperación
 */
export const verifyResetCode = async (phone, code) => {
  console.log(`API Sim: Verificando código de reseteo ${code} para ${phone}`);
  // Usamos un código quemado para la simulación
  if (code !== '654321') {
    return simulateApiCall({ error_code: 'INVALID_RESET_CODE' }, false); // Flujo A2 
  }
  return simulateApiCall({ code_verified: true });
};

/**
 * CU-05: Paso 8 - Actualiza el PIN
 */
export const updatePin = async (phone, newPin) => {
    console.log(`API Sim: Actualizando PIN para ${phone}`);
    if (newPin.length !== 6 || newPin === '123123' || newPin === '000000') {
        return simulateApiCall({ error_code: 'PIN_NOT_SECURE' }, false); // Flujo A3 
    }
    // "Actualizamos" el PIN en nuestra simulación
    MOCK_USER.pin = newPin;
    console.log(`API Sim: El nuevo PIN para ${MOCK_USER.phone} es ahora ${MOCK_USER.pin}`);
    return simulateApiCall({ pin_updated: true });
};

export const getBalance = async (token) => {
  console.log(`API Sim: Obteniendo saldo con token ${token}`);
  
  // Precondición: El cliente debe estar autenticado (simulado por la existencia del token)
  if (!token) {
    return simulateApiCall({ error_code: 'UNAUTHENTICATED' }, false, 100);
  }

  // Simular un fallo de red aleatorio (para probar el flujo alternativo A1)
  if (Math.random() < 0.2) { // 20% de probabilidad de error
    console.error("API Sim: Error de red simulado.");
    return simulateApiCall({ error_code: 'NETWORK_ERROR' }, false, 1500);
  }

  const randomBalance = Math.random() * 5000;
  // Postcondición Exitosa: El sistema muestra el saldo disponible actual del cliente
  return simulateApiCall({ balance: randomBalance }, true, 1200);
};