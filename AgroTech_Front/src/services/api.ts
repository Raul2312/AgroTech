import axios from 'axios';

// ===============================
// Interfaces
// ===============================

export interface Prize {
  label: string;
  value: number;
  type: string;
}

export interface DailySpinStatusResponse {
  can_spin: boolean;
  message?: string;
}

export interface SpinResponse {
  reward: Prize;
}

// ===============================
// Configuración Axios
// ===============================

const API = axios.create({
  baseURL: 'https://api.agrootech.com.mx/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ===============================
// Interceptor JWT
// ===============================
// Obtiene el token desde:
// 1. localStorage.token
// 2. localStorage.agroSession
// 3. sessionStorage.agroSession
API.interceptors.request.use(
  (config) => {
    let token: string | null = localStorage.getItem('token');

    // Si no existe token directo, buscar dentro de agroSession
    if (!token) {
      const session =
        localStorage.getItem('agroSession') ||
        sessionStorage.getItem('agroSession');

      if (session) {
        try {
          const parsed = JSON.parse(session);

          token =
            parsed?.token ||
            parsed?.access_token ||
            parsed?.jwt ||
            parsed?.user?.token ||
            parsed?.data?.token ||
            parsed?.data?.access_token ||
            null;
        } catch (error) {
          console.error('Error leyendo agroSession:', error);
        }
      }
    }

    // Agregar Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;

      // Guardarlo también como localStorage.token para futuras peticiones
      localStorage.setItem('token', token);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ===============================
// AUTH
// ===============================

export const login = async (
  email: string,
  password: string
): Promise<any> => {
  const response = await API.post('/login', {
    email,
    password,
  });

  const token =
    response.data?.access_token ||
    response.data?.token ||
    null;

  if (token) {
    // Guardar token directo
    localStorage.setItem('token', token);

    // Guardar sesión completa
    localStorage.setItem(
      'agroSession',
      JSON.stringify(response.data)
    );
  }

  return response.data;
};

export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('agroSession');
  sessionStorage.removeItem('agroSession');
};

export const getUser = async (): Promise<any> => {
  const response = await API.get('/me');
  return response.data;
};

// ===============================
// DAILY SPIN
// ===============================

export const getDailySpinStatus =
  async (): Promise<DailySpinStatusResponse> => {
    const response = await API.get('/rewards/me');
    return response.data;
  };

export const spinDailyWheel =
  async (): Promise<SpinResponse> => {
    const response = await API.post('/rewards/spin');
    return response.data;
  };

// ===============================
// Export Default
// ===============================

export default API;