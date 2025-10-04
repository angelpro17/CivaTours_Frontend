export interface Bus {
  id: string;
  busNumber: string;
  licensePlate: string;
  characteristics: string;
  busBrand: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  roles: string[];
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface BusResponse {
  content: Bus[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
