export interface User {
  id: string;
  email: string;
  password: string; // hashed
  profile: {
    name: string;
    phone?: string;
    avatar?: string;
  };
  addresses: Address[];
  role: "customer" | "admin";
  status: "active" | "suspended" | "deleted";
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

export interface Address {
  id: string
  type: 'home' | 'office' | 'other'
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault: boolean
}

export interface SignupInput {
  email: string
  password: string
  name: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface AuthResponse {
  user: Omit<User, 'password'>
  accessToken: string
  refreshToken: string
}

export interface TokenPayload {
  userId: string
  email: string
  role: string
  iat?: number
  exp?: number
}