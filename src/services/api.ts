import { Bus, BusResponse, AuthResponse, User } from '../types';

const API_BASE_URL = 'https://civatours.rj.r.appspot.com/';

class ApiService {
  private token: string | null = localStorage.getItem('token');

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  async signUp(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phoneNumber: string
  ): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/v1/authentication/sign-up`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
        phoneNumber
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    return response.json();
  }

  async signIn(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/authentication/sign-in`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error('Credenciales incorrectas');
      }
      
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al iniciar sesión');
      } catch (jsonError) {
        throw new Error('Credenciales incorrectas');
      }
    }

    const data = await response.json();
    this.setToken(data.token);
    return data;
  }

  async getAllBuses(token: string, page: number = 0, size: number = 5): Promise<BusResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/bus?page=${page}&size=${size}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch buses');
    }

    return response.json();
  }

  async getBusById(id: string): Promise<Bus> {
    const response = await fetch(`${API_BASE_URL}/api/v1/bus/${id}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch bus');
    }

    return response.json();
  }

  async createBus(token: string, busData: {
    busNumber: string;
    licensePlate: string;
    characteristics: string;
    busBrand: string;
    isActive: boolean;
  }): Promise<Bus> {
    const response = await fetch(`${API_BASE_URL}/api/v1/bus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(busData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create bus');
    }

    return response.json();
  }
}

export const apiService = new ApiService();
